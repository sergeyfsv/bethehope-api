let isAuthenticated = require("./authenticated");
let isAuthorized = require("./authorized");

module.exports = {
  isAuthenticated,
  isAuthorized: isAuthorized
};
