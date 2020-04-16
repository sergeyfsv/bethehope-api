const handleError = require("./helper");
const constants = require("../constants");
const firebase = require("../services/firebase");
const _ = require("lodash");
let Organization = require("../models/organization");
const User = require("../models/user");
const mongoose = require("mongoose");

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

module.exports = {
  create
};
