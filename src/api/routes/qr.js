let { Router } = require("express");
let constants = require("../../constants");
let { isAuthenticated, isAuthorized } = require("../../middlewares");
let { celebrate, Joi } = require("celebrate");
const route = Router();

let { create, get, getQRInfo } = require("../../controllers/qr");

module.exports = app => {
  app.use("/qr", route);

  // lists all organizations
  route.post(
    "/",
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        shorthand: Joi.string().required(),
        poster: Joi.string()
          .optional()
          .allow(""),
        description: Joi.string()
          .optional()
          .allow("")
      })
    }),
    [
      isAuthenticated,
      isAuthorized({
        hasRole: [constants.user.TYPE_MANAGER, constants.user.TYPE_MEMBER]
      }),
      create
    ]
  );

  // lists all organizations
  route.get("/", [
    isAuthenticated,
    isAuthorized({
      hasRole: [constants.user.TYPE_MANAGER, constants.user.TYPE_MEMBER]
    }),
    get
  ]);

  // lists all organizations
  route.get("/:shorthand", [getQRInfo]);
};
