let { Router } = require("express");
let constants = require("../../constants");
let { isAuthenticated, isAuthorized } = require("../../middlewares");
let { celebrate, Joi } = require("celebrate");
const route = Router();

let { create, get, patch, remove } = require("../../controllers/organization");

module.exports = app => {
  app.use("/organizations", route);

  // lists all organizations
  route.post(
    "/",
    // celebrate({
    //   body: Joi.object({
    //     name: Joi.string().required(),
    //     shorthand: Joi.string().required(),
    //     logo: Joi.string(),
    //     description: Joi.string()
    //   })
    // }),
    [
      isAuthenticated,
      isAuthorized({
        hasRole: [constants.user.TYPE_MANAGER, constants.user.TYPE_MEMBER]
      }),
      create
    ]
  );

  // lists all organizations
  //   route.get("/", [
  //     isAuthenticated,
  //     isAuthorized({ hasRole: [constants.user.TYPE_MANAGER] }),
  //     all
  //   ]);

  //   // get :id user
  //   route.get("/:id", [
  //     isAuthenticated,
  //     isAuthorized({
  //       hasRole: [constants.user.TYPE_MANAGER],
  //       allowSameUser: true
  //     }),
  //     get
  //   ]);
};
