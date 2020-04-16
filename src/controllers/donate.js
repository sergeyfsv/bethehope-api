const handleError = require("./helper");
const _ = require("lodash");
const QR = require("../models/qr");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const Organization = require("../models/organization");
const stripe = require("../services/stripe");

async function donate(req, res) {
  try {
    if (!req.body.shorthand) {
      throw new Error(`Could not verify donation receiver`);
    }

    if (!req.body.amount) {
      throw new Error(`No donation amount provided`);
    }

    if (!req.body.email) {
      throw new Error(`No donation amount provided`);
    }

    if (!req.body.amount > 100000) {
      throw new Error(`We currently do not accept donations above $1000`);
    }

    if (!req.body.sourceToken) {
      throw new Error(`Internal: Stripe source token not provided`);
    }

    let qr = await QR.findOne({ shorthand: req.body.shorthand });

    if (!qr) {
      throw new Error(`Invalid QR source`);
    }

    if (!qr.organization) {
      throw new Error(`Invalid QR organization`);
    }

    let transaction = new Transaction({
      qr: qr._id,
      organization: qr.organization,
      amountDonated: req.body.amount
    });

    let charge = await stripe.createCharge({
      source: req.body.sourceToken,
      amount: req.body.amount,
      currency: "cad",
      description: `Donation for ${req.body.shorthand}`,
      receipt_email: req.body.email
    });

    let balance = await stripe.retrieveBalanceTransaction(
      _.get(charge, "balance_transaction")
    );

    transaction.status = charge.status;
    transaction.created = charge.created;
    transaction.stripeChargeId = charge.id;
    transaction.amountReceived = balance.net;
    transaction.email = req.body.email;
    transaction.paymentMode = req.body.paymentMode;

    await transaction.save();

    if (transaction.status == "failed") {
      throw new Error(`Donation could not be transacated`);
    }

    if (transaction.status == "succeeded") {
      let organization = await Organization.findOne({ _id: qr.organization });
      if (
        organization.donationEarnedTillDate &&
        organization.donationEarnedTillDate > 0
      ) {
        organization.donationEarnedTillDate += balance.net;
      } else {
        organization.donationEarnedTillDate = balance.net;
      }

      if (qr.donationEarnedTillDate && qr.donationEarnedTillDate > 0) {
        qr.donationEarnedTillDate += balance.net;
      } else {
        qr.donationEarnedTillDate = balance.net;
      }

      await organization.save();
      await qr.save();
    }

    return res
      .status(200)
      .send({ message: "Donation completed!", transaction: transaction._id });
  } catch (err) {
    return handleError(res, err);
  }
}

async function getDonations(req, res) {
  try {
    let { uid } = res.locals;
    let user = await User.findOne({ firebaseUID: uid });

    let donations = await Transaction.find({
      organization: user.organization
    })
      .populate("qr", "shorthand name")
      .sort({ createdAt: -1 });

    let organization = await Organization.findById(user.organization);

    res.status(200).send({
      donations: donations,
      donationEarnedTillDate: _.get(organization, "donationEarnedTillDate", 0)
    });
  } catch (err) {
    return handleError(res, err);
  }
}

async function retrieveCharge(req, res) {
  try {
    if (!req.params.id) {
      throw new Error("Transaction id not passed");
    }
    let charge = await stripe.retrieveCharge(req.params.id);
    return res.status(200).send({ charge });
  } catch (err) {
    return handleError(res, err);
  }
}

async function retrieveBalanceTransaction(req, res) {
  try {
    if (!req.params.id) {
      throw new Error("Transaction id not passed");
    }
    let charge = await stripe.retrieveBalanceTransaction(req.params.id);
    return res.status(200).send({ charge });
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = {
  donate,
  getDonations,
  retrieveCharge,
  retrieveBalanceTransaction
};
