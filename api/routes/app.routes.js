module.exports = (app) => {
  const users = require("../controllers/auth.controller");

  var router = require("express").Router();

  router.get("/check-auth", users.checkAuth);
  router.post("/register", users.register);
  router.post("/login", users.auth);

  app.use("/api/auth", router);
};
