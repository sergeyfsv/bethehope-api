// opts type
//opts: { hasRole: Array ['admin' | 'manager' | 'user'], allowSameUser?: boolean }

function isAuthorized(opts) {
  return (req, res, next) => {
    const { role, email, uid } = res.locals;
    // const uidFromParams = req.params["uid"] || "";

    // console.log("isAuthorized", uidFromParams, uid);
    console.log(req.body);
    if (email === process.env.FIREBASE_ROOT_USER_EMAIL) {
      return next();
    }

    // if (opts.allowSameUser && uidFromParams && uid === uidFromParams)
    //   return next();

    if (!role) return res.status(403).send();

    if (opts.hasRole.includes(role)) return next();

    return res.status(403).send();
  };
}

module.exports = isAuthorized;
