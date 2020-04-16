let mongoose = require("mongoose");

const QRSchema = new mongoose.Schema(
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
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization"
    },
    dataUriSvg: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
      unique: true
    },
    donationEarnedTillDate: {
      type: Number,
      default: 0
    },
    poster: {
      type: String
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

const QR = mongoose.model("QR", QRSchema);
module.exports = QR;
