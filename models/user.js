let mongoose = require("mongoose");
let constants = require("../constants");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter user's name"]
    },
    email: {
      type: String,
      required: [true, "Please enter user's email"],
      index: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: [true, "Please enter user's password"],
      select: false
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization"
    },
    firebaseUID: {
      type: String,
      required: [true, "Firebase UID not passed"]
    },
    role: {
      type: String,
      enum: [constants.user.TYPE_MEMBER, constants.user.TYPE_MANAGER],
      required: true
    },
    qrcodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "QR" }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
