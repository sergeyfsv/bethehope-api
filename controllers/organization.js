const handleError = require("./helper");
const constants = require("../constants");
const firebase = require("../services/firebase");
const _ = require("lodash");
let Organization = require("../models/organization");
let QR = require("../models/qr");
const User = require("../models/user");
const mongoose = require("mongoose");
const twilio = require("../services/twilio")
const sendgrid = require("../services/sendgrid")


async function create(req, res) {
  try {
    let { shorthand, name, logo, description, type } = req.body;
    let { uid, role } = res.locals;

    // if (role != constants.user.TYPE_MANAGER) {
    //   throw new Error("Only managers can create organization");
    // }

    user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      throw new Error(
        `Internal: Current user with firebaseUID ${uid} not found`
      );
    }

    let organization = await Organization.create({
      shorthand,
      name,
      logo,
      description,
      type,
      managers: [user._id],
      members: [user._id]
    });

    user.organization = organization._id;
    console.log(user);

    await user.save();

    user = await User.findOne({ _id: user._id })
      .populate("organization")
      .exec();

    return res.status(200).send({ organization, user });
  } catch (err) {
    return handleError(res, err);
  }
}

async function notification(req, res) {
  try {
    let { values, shorthand, type, message } = req.body;

    values = values.split(",")
    qr = await QR.findOne({ shorthand: shorthand })

    if (!qr) {
      throw new Error("No campaign found with given shorthand")
    }

    if (!message.includes("[campaign_url]")) {
      throw new Error("No campaign_url placeholder found")
    }

    message = message.replace("[campaign_url]", qr.url);

    if (type === 'sms') {
      await Promise.all(values.map(async (val) => {
        twilio.sendMessage(val, message);
      }));
    }
    else if (type === 'whatsapp') {
      await Promise.all(values.map(async (val) => {
        twilio.sendWhatsApp(val, message);
      }));
    }
    else if (type === 'email') {
      await Promise.all(values.map(async (val) => {
        sendgrid.sendEmail(val, message);
      }));
    }

    return res.status(200).send({ message: "Notifications sent!" });
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = {
  create,
  notification
};
