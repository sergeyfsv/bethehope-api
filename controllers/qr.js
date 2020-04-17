const handleError = require("./helper");
const _ = require("lodash");
let QR = require("../models/qr");
const User = require("../models/user");
var QRCode = require("qrcode");
var Organization = require("../models/organization");

async function create(req, res) {
  try {
    let { shorthand, name } = req.body;
    let { uid } = res.locals;

    user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      throw new Error(
        `Internal: Current user with firebaseUID ${uid} not found`
      );
    }

    if (!_.get(user, "organization")) {
      throw new Error(`User does not have an organization`);
    }

    let organization = await Organization.findOne({
      _id: _.get(user, "organization._id")
    });

    let url = `${process.env.CLIENT_QRDONATE_URL}${organization.shorthand}/${shorthand}`;
    let dataUriSvg = await QRCode.toString(url, { type: "svg" });
    dataUriSvg = _.replace(dataUriSvg, new RegExp('"', "g"), "'");
    dataUriSvg = _.replace(dataUriSvg, new RegExp("\n", "g"), "");

    let qr = await QR.create({
      shorthand,
      name,
      creator: user._id,
      organization: _.get(user, "organization"),
      dataUriSvg,
      url,
      shorturl,
      poster: _.get(req, "body.poster", ""),
      description: _.get(req, "body.description", "")
    });

    user.qrcodes.push(qr._id);
    console.log(user);

    await user.save();

    user = await User.findOne({ _id: user._id })
      .populate("organization")
      .exec();

    return res.status(200).send({ qr, user });
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      // Duplicate username
      return res.status(422).send({
        succes: false,
        message: "URL Shorthand already used. Try another!"
      });
    }
    return handleError(res, err);
  }
}

async function get(req, res) {
  try {
    let { uid, role } = res.locals;
    user = await User.findOne({ firebaseUID: uid }).populate("qrcodes");

    if (_.get(user, "qrcodes") && _.get(user, "qrcodes").length >= 1) {
      return res
        .status(200)
        .send({ qrcodes: _.orderBy(user.qrcodes, "createdAt", "desc") });
    } else {
      return res.status(200).send({ qrcodes: [] });
    }
  } catch (err) {
    return handleError(res, err);
  }
}

async function getQRInfo(req, res) {
  try {
    if (!req.params.shorthand) {
      throw new Error(`QR shorthand not passed.`);
    }

    qr = await QR.findOne({ shorthand: req.params.shorthand })
      .populate("organization")
      .select("shorthand name description poster");

    if (!qr) {
      throw new Error(`QR with provided shorthand not found.`);
    }

    return res.status(200).send({ qr });
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = {
  create,
  get,
  getQRInfo
};
