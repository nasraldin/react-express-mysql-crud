const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ Error: "You must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ Error: "You must be logged in" });
    }
    const { id } = payload;
    User.findByPk(id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
