const handleError = require("./helper");
const constants = require("../constants");
const firebase = require("../services/firebase");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
let User = require("../models/user");

async function create(req, res) {
  try {
    let { name, email, password, role, key } = req.body;

    if (process.env.BETHEHOPE_API_SECRET !== key) {
      return res.status(403).send("Incorrect secret api key");
    }

    if (!role) {
      role = constants.user.TYPE_MANAGER;
    }

    const { uid } = await firebase.createUser({
      displayName: name,
      password,
      email
    });

    await firebase.setCustomUserClaims(uid, { role });
    let user = await User.create({
      name: name,
      email: email,
      passwordHash: bcrypt.hashSync(password, constants.password.SALT_ROUNDS),
      firebaseUID: uid,
      role: role
    });

    return res
      .status(201)
      .send({ _id: user._id, firebaseUID: user.firebaseUID });
  } catch (err) {
    return handleError(res, err);
  }
}

async function all(req, res) {
  try {
    const listUsers = await firebase.listUsers();
    const users = listUsers.users.map(user => {
      const customClaims = user.customClaims || { role: "" };
      const role = customClaims.role ? customClaims.role : "";
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime
      };
    });

    return res.status(200).send({ users });
  } catch (err) {
    return handleError(res, err);
  }
}

let randomNumber = 23;

async function get(req, res) {
  try {
    let { uid } = res.locals;
    let user = await User.findOne({ firebaseUID: uid })
      .populate("organization")
      .populate("qrcodes")
      .exec();
    console.log(user);

    user = user.toObject();
    user["randomNumber"] = randomNumber;
    randomNumber = randomNumber + 10;

    return res.status(200).send({ user });
  } catch (err) {
    return handleError(res, err);
  }
}

async function patch(req, res) {
  try {
    const { id } = req.params;
    const { displayName, password, email, role } = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({ message: "Missing fields" });
    }

    const user = await firebase.updateUser(id, {
      name,
      password,
      email
    });
    await firebase.setCustomUserClaims(id, { role });
    return res.status(204).send({ user });
  } catch (err) {
    return handleError(res, err);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await firebase.deleteUser(id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = {
  create,
  all,
  get,
  patch,
  remove
};
