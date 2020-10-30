const express = require("express");
const passport = require("passport");
const router = express.Router();

// initialize a default redirect path variable for successful auth
let authRedirect = "/";

// create a login failure endpoint
router.get("/loginFailed", (req, res, next) => {
  res.status(401).send("Could not authenticate with OAuth provider");
});

// create a login endpoint which kickstarts the auth process
router.get("/login", (req, res) => {
  // remember the current path user comes from for login to redirect back to it
  authRedirect = req.query.from;
  // start authenticating
  passport.authenticate("github")(req, res);
});

//auth with google
router.get("/google", (req, res) => {
  authRedirect = req.query.from;
  passport.authenticate("google", { scope: ["profile"] })(req, res);
});

// logout path
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(req.query.from);
});

//GitHub Auth CallBack/Redirect http:://localhost:5000/auth
router.get("/auth", (req, res) => {
  passport.authenticate("github", {
    successRedirect: authRedirect,
    failureRedirect: "/loginFailed",
  })(req, res);
});

//Google Auth CallBack/Redirect http:://localhost:5000/googleauth
router.get("/googleauth", (req, res) => {
  passport.authenticate("google", {
    successRedirect: authRedirect,
    failureRedirect: "/loginFailed",
  })(req, res);
});

// endpoint for checking user's auth status
router.get("/check-auth", (req, res) => {
  if (req.user === undefined) return res.status(401).send("Unauthorized");
  // if user is currently authenticated, send back user info
  res.status(200).json(req.user);
});

module.exports = router;
