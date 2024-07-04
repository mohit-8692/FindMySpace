const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// Middleware to set showFooter variable
const setShowFooter = (showFooter) => (req, res, next) => {
  res.locals.showFooter = showFooter;
  next();
};

router
  .route("/signup")
  .get(setShowFooter(false), userController.rendersignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(setShowFooter(false), userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
