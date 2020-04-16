let { Router } = require("express");
let { celebrate, Joi } = require("celebrate");
let constants = require("../../constants");
const logger = require("../../loaders/logger");

let { isAuthenticated, isAuthorized } = require("../../middlewares");

let { create } = require("../../controllers/user");

const route = Router();

module.exports = app => {
  app.use("/auth", route);

  route.post(
    "/signup",
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().valid(
          ...[constants.user.TYPE_MANAGER, constants.user.TYPE_MEMBER]
        )
      })
    }),
    create
  );

  route.post(
    "/signin",
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    async (req, res, next) => {
      logger.debug("Calling Sign-In endpoint with body: %o", req.body);
      try {
        const { email, password } = req.body;
        // const authServiceInstance = Container.get(AuthService);
        // const { user, token } = await authServiceInstance.SignIn(email, password);
        // return res.json({ user, token }).status(200);
        return res.status(200);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  /**
   * @TODO Let's leave this as a place holder for now
   * The reason for a logout route could be deleting a 'push notification token'
   * so the device stops receiving push notifications after logout.
   *
   * Another use case for advance/enterprise apps, you can store a record of the jwt token
   * emitted for the session and add it to a black list.
   * It's really annoying to develop that but if you had to, please use Redis as your data store
   */
  // route.post("/logout", middlewares.isAuth, async (req, res, next) => {
  //   logger.debug("Calling Sign-Out endpoint with body: %o", req.body);
  //   try {
  //     //@TODO AuthService.Logout(req.user) do some clever stuff
  //     return res.status(200).end();
  //   } catch (e) {
  //     logger.error("🔥 error %o", e);
  //     return next(e);
  //   }
  // });
};
