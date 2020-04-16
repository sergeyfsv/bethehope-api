let mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    qr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QR",
      required: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    stripeChargeId: {
      type: String
    },
    amountDonated: {
      type: Number,
      required: true
    },
    amountReceived: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["succeeded", "pending", "failed"]
    },
    created: {
      type: Date
    },
    email: {
      type: String
    },
    paymentMode: {
      type: String
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
