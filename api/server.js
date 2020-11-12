require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const debug = require("debug")("media-management:server");
const passport = require("passport");
require("./config/passport")(passport);
const cookieSession = require("cookie-session");

const app = express();

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["key1", "key2"],
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

require("./routes/app.routes")(app);

const db = require("./models");
db.sequelize.sync();

// this just for dev test only
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to User CURD App." });
});

// set port, listen for requests
const PORT = process.env.API_PORT || 3100;
app.listen(PORT, () => {
  debug(`Server is running on port ${PORT}.`);
});
