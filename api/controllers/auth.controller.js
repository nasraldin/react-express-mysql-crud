const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// register new user
exports.register = async (req, res) => {
  // Validate request
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  var condition = req.body.email
    ? { email: { [Op.eq]: `${req.body.email}` } }
    : null;

  User.findOne({ where: condition })
    .then(async (data) => {
      if (data) {
        return res.status(500).send({
          message: "email already registered.",
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create a User
      const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
        role: "user",
      };

      // Save User in the database
      User.create(user)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};

exports.auth = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findOne({ email: email })
    .then(async (data) => {
      if (!data) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }

      bcrypt.compare(password, data.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: data.id,
            email: data.email,
          };

          const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
          });
          res.json({
            token,
            user: { payload },
            message: "Login was successful",
          });

          //   res
          //     .cookie("token", token, { httpOnly: true })
          //     .send(`{"token": "${token}"}`);
        } else {
          return res.status(400).json({ error: "Invalid Email or password" });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
      res.status(401).send({
        message: err.message || "Incorrect email.",
      });
    });
};

// check user is authenticated
exports.checkAuth = (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("No token provided");
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send("Unauthorized user");
      } else {
        res.send("Authenticated");
      }
    });
  }
};
