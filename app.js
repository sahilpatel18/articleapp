const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const pgp = require("pg-promise")();
const session = require("express-session");
const path = require("path");
const checkAuthorization = require("./utils/authorization");

const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");

const PORT = process.env.PORT || 8080;
const CONNECTION_STRING =
  "postgres://coxfsdbcvvohvm:ee199043ea92024b092d7882619e6088ef82a643e1a38963ffe5f01dfa0c82fd@ec2-18-210-214-86.compute-1.amazonaws.com:5432/d353rg48h0gvno";

const VIEWS_PATH = path.join(__dirname, "/views");

// configuring your view engine
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.use("/css", express.static("css")); // localhost:3000/css/site.css

app.use(
  session({
    secret: "lhadhlsdalh",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.authenticated = req.session.user == null ? false : true;
  next();
});

db = pgp(CONNECTION_STRING);

// setup routes
app.use("/", indexRoutes);
app.use("/users", checkAuthorization, userRoutes);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`);
});
