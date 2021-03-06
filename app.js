var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment"),
	passport =  require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	methodOverride = require("method-Override"),
	flash = require("connect-flash")
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")
//seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
	secret: "once again rusty wins cutest dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.get("/",function(req,res){
 	res.render("campgrounds/landing");
});


app.listen(8888,process.env.IP);