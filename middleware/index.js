//all middlewares goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error","Camp ground not found!");
                res.redirect("back");
            }
            else {
                //does user own the campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    
                    next();
                }
                else {
                    //otherwise redirect
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });

    }
    else {
        //if , not redirect
        res.redirect("back");
    }
};


 middlewareObj.checkCommentOwnership = function(req, res, next) {
     if (req.isAuthenticated()) {
         Comment.findById(req.params.comment_id, function(err, foundComment) {
             if (err) {
                 res.redirect("back");
             }
             else {
                 //does user own the campground
                 if (foundComment.author.id.equals(req.user._id)) {
                     next();
                 }
                 else {
                     //otherwise redirect
                       req.flash("error","You dont have permission to do that");
                     res.redirect("back");
                 }
             }
         });
 
     }
     else {
         //if , not redirect
           req.flash("error","You need to be logged in to do that");
         res.redirect("back");
     }
 };
 
 
 //middleware
middlewareObj.isLogedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
};

    


module.exports = middlewareObj;