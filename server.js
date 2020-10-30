const express = require("express");
// session id on server session cookie on client
const session = require("express-session");
// cors package prevents CORS errors when using client side API calls
const cors = require("cors");
// add http headers, small layer of security
const helmet = require("helmet");
// log http requests
const logger = require("morgan");
const app = express();
app.use(express.json());
const path = require("path");

app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;

// instantiate Passport and Github + Google Strategy
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//import router paths
const routes = require("./routes");

// require .env files for private data (keys and secrets)
require("dotenv").config();

const passportConfig = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
};

const passportGoogleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

// initialize HTTP Headers middleware
app.use(helmet());

// morgan logger, network info in node console
app.use(logger("dev"));

// enable cors
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// passport config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
// passport.session middleware
app.use(passport.session());

// initialize github strategy middleware
passport.use(
  new GitHubStrategy(passportConfig, function (
    _accessToken,
    _refreshToken,
    profile,
    cb
  ) {
    // console.log('Github Callback: ', profile);
    // this profile will get saved in express session
    return cb(null, profile);
  })
);

passport.use(
  new GoogleStrategy(passportGoogleConfig, function (
    _accessToken,
    _refreshToken,
    profile,
    cb
  ) {
    return cb(null, profile);
  })
);

// serializeUser and deserializeUser
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// paths, url endpoint routing
app.use("/", routes);

const vehicleRoute = require("./routes/api/vehicleRoute");
app.use("/vehicles", vehicleRoute);
const blogRoute = require("./routes/api/blogRoute");
app.use("/blogs", blogRoute);

// MongoDB
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGODB_URL;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to DB");
});

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Sever listening on port ${PORT}.`);
});
