var express = require("express");
var app = express();

var bodyParser     = require("body-parser"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelpcamp_app_v6', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));


app.use(bodyParser.urlencoded({ extended : true }));

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//========================================================================

var seedDB = require("./seeds"),
    User = require("./models/user");
    
    
   // seedDB(); //seed the Database
    
    //PASSPORT CONFIGURATION
    app.use(require("express-session")({
        secret : "Rusty wins the cutest dog Competition",
        resave :  false,
        saveUninitialized : false
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    app.use(function(req,res, next){
        res.locals.currentUser = req.user;
        res.locals.error     = req.flash("error");
        res.locals.success     = req.flash("success");
        next();
    });

//=============================================================================

var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");


app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started");
});
