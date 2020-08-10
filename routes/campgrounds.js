var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//Campground Rout 

router.get("/", function(req, res) {

    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {

            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

//Campgroud Post Rout create

router.post("/", middleware.isLogedIn, function(req, res) {
    //get data from the form and add to the campgrounds array
    var name   = req.body.name;
    var price  = req.body.price;
    var img    = req.body.img;
    var desc   = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newCampground = { name: name, price : price, img: img, description: desc, author: author };

    //Create a new capground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//New Rout

router.get("/new", middleware.isLogedIn, function(req, res) {
    res.render("campgrounds/new");
});

//Show Rout - Show info about one campground

router.get("/:id", function(req, res) {

    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//Comment Rout 
router.get("/:id/comments/new", function(req, res) {
    //Find Campground bu Id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    });

});

//EDIT Campground Rout
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {

    Campground.findById(req.params.id, function(err, foundCampground) {

        res.render("campgrounds/edit", { campground: foundCampground });


    });
});



//UPDATE Campground ROUT
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    //find and update the current campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campground");
        }
        else {
            //redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});





module.exports = router;