const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCharge = chargeObj => {
  return stripe.charges.create(chargeObj);
};

exports.retrieveCharge = id => {
  return stripe.charges.retrieve(id);
};

exports.retrieveBalanceTransaction = id => {
  return stripe.balanceTransactions.retrieve(id);
};
