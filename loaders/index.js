let expressLoader = require("./express");
// let dependencyInjectorLoader = require( "./dependencyInjector");
let mongooseLoader = require("./mongoose");
// let jobsLoader = require( "./jobs");
let Logger = require("./logger");
//We have to import at least all the events once so they can be triggered
// let "./events";
let { Container } = require("typedi");

module.exports = async app => {
  const mongoConnection = await mongooseLoader();
  Logger.info("✌️ DB loaded and connected!");

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  //   const userModel = {
  //     name: "userModel",
  //     // Notice the require syntax and the '.default'
  //     model: require("../models/user").default
  //   };

  // It returns the agenda instance because it's needed in the subsequent loaders
  //   const { agenda } = await dependencyInjectorLoader({
  //     mongoConnection,
  //     models: [
  //       userModel
  //       // salaryModel,
  //       // whateverModel
  //     ]
  //   });
  // Logger.info("✌️ Dependency Injector loaded");

  //   await jobsLoader({ agenda });
  // Logger.info("✌️ Jobs loaded");

  await expressLoader(app);
  Logger.info("✌️ Express loaded");
};
