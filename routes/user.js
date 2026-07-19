const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js")
// Signup Page // Signup

router.route("/signup")
    .get(userController.renderSignupForm)
    .post( userController.signup);

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );
///Logout
router.get("/logout",userController.logout);

module.exports = router;