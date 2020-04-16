let { Router } = require("express");
let constants = require("../../constants");
let { isAuthenticated, isAuthorized } = require("../../middlewares");
const route = Router();

let {
  donate,
  getDonations,
  retrieveCharge,
  retrieveBalanceTransaction
} = require("../../controllers/donate");

module.exports = app => {
  app.use("/donate", route);

  // donate
  route.post("/", [donate]);

  // lists all donations for current user's organization
  route.get(
    "/",
    isAuthenticated,
    isAuthorized({
      hasRole: [constants.user.TYPE_MANAGER, constants.user.TYPE_MEMBER]
    }),
    [getDonations]
  );

  // INTERNAL: retrieve charge
  route.get("/charge/:id", [retrieveCharge]);

  // INTERNAL: retrieve balanceTransactions
  route.get("/balance/:id", [retrieveBalanceTransaction]);
};
