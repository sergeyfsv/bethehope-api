let { Router } = require("express");
let constants = require("../../constants");
let { celebrate, Joi } = require("celebrate");
let { isAuthenticated, isAuthorized } = require("../../middlewares");
const route = Router();

let { all, get, patch, remove } = require("../../controllers/user");

module.exports = app => {
  app.use("/users", route);

  // lists all users
  route.get("/", [
    isAuthenticated,
    isAuthorized({ hasRole: [constants.user.TYPE_MANAGER] }),
    all
  ]);
  // get :id user
  route.get("/current", [
    isAuthenticated,
    isAuthorized({
      hasRole: [constants.user.TYPE_MANAGER, constants.user.TYPE_MEMBER],
      allowSameUser: true
    }),
    get
  ]);
  // updates :id user
  // route.patch("/:id", [
  //   isAuthenticated,
  //   isAuthorized({
  //     hasRole: [constants.user.TYPE_MANAGER],
  //     allowSameUser: true
  //   }),
  //   patch
  // ]);
  // deletes :id user
  // route.delete("/:id", [
  //   isAuthenticated,
  //   isAuthorized({ hasRole: [constants.user.TYPE_MANAGER] }),
  //   remove
  // ]);
};
