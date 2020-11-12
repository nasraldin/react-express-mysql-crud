const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
  const saltRounds = 10;

  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const { email } = req.body;

  var condition = email ? { email: { [Op.eq]: `${email}` } } : null;

  User.findOne({ where: condition })
    .then(async (data) => {
      if (data) {
        return res.status(500).send({
          message: "email already registered.",
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      // Create a User
      const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
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

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const first_name = req.query.first_name;
  var condition = first_name
    ? { first_name: { [Op.like]: `%${first_name}%` } }
    : null;

  User.findAll({ where: condition })
    .then((data) => {
      let user = [];

      data.forEach((element) => {
        const us = {
          id: element.dataValues.id,
          first_name: element.dataValues.first_name,
          last_name: element.dataValues.last_name,
          email: element.dataValues.email,
          role: element.dataValues.role,
        };

        user.push(us);
      });
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      console.log(num);
      // eslint-disable-next-line eqeqeq
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};
