let { Router } = require("express");
let auth = require("./routes/auth");
let user = require("./routes/user");
let organization = require("./routes/organization");
let donate = require("./routes/donate");
let qr = require("./routes/qr");

// guaranteed to get dependencies
module.exports = () => {
  const app = Router();
  auth(app);
  user(app);
  organization(app);
  qr(app);
  donate(app);

  return app;
};
