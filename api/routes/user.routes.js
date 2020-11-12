module.exports = (app) => {
  const users = require("../controllers/user.controller");
  const LoggedUser = require("../middleware/LoggedUser");

  var router = require("express").Router();

  // Create a new User
  router.post("/", LoggedUser, users.create);

  // Retrieve all users
  router.get("/", LoggedUser, users.findAll);

  // Retrieve a single User with id
  router.get("/:id", LoggedUser, users.findOne);

  // Update a User with id
  router.put("/:id", LoggedUser, users.update);

  // Delete a User with id
  router.delete("/:id", LoggedUser, users.delete);

  app.use("/api/users", router);
};
