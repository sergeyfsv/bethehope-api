let mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    shorthand: {
      type: String,
      required: [true, "Please enter organization id"],
      index: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, "Please enter organization name"]
    },
    type: {
      type: String,
      enum: ["personal", "company"]
    },
    managers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    logo: String,
    description: String,
    donationEarnedTillDate: Number
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", OrganizationSchema);
module.exports = Organization;
