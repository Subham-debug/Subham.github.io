var express = require("express");
var router = express.Router();
var User = require("../models/user"),
    passport = require("passport");



//Landing Rout

router.get("/", function(req, res) {
    res.render("landing");
});



//=====
//Auth Routh
//=======

//show Register Form
router.get("/register", function(req, res) {
    res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
              req.flash("error", err.message);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
              req.flash("success","Welcome to YelpCamp "+ user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//handling login logic

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
    res.send("Login logic Here!");
});

//logout logic rout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","Logged You Out");
    res.redirect("back");
});

//============================


module.exports = router;