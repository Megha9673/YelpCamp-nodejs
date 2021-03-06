var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");



router.post("/",isLoggedIn, function(req,res){
	var name= req.body.name;
	var price= req.body.price;
	var image = req.body.image;
	var desc = req.body.des;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name,price:price, image:image, des:desc, author: author};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}	
	})
	
});

router.get("/new",isLoggedIn, function(req,res){
	res.render("campgrounds/newcamp");
});

router.get("/",function(req,res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/campgrounds",{campgrounds: allCampgrounds});
		}
	});
	
});

router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCamground});
		}	
	});
	
});

router.get("/:id/edit",checkcampgroundOwnership, function(req,res){
	Campground.findById(req.params.id,function(err, editedcampground){
		if(err){
			res.redirect("/campgrounds")
		} else {
			res.render("campgrounds/edit",{campground: editedcampground});
		}
	});
});

router.put("/:id",checkcampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCamground){
		if(err){
			console.log(err)
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/"+req.params.id)
		}
	});
});

router.delete("/:id",checkcampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err)
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
})
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login First!");
	res.redirect("/login");
}


function checkcampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err, editedcampground){
			if(err){
				req.flash("error","Campground not Found");
				res.redirect("back");
			} else {
				if(editedcampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error","You DonNot have Permission to Do That");
					res.redirect("back");
				}
				
			}
		});
	} else {
		req.flash("error","Please Login First!");
		res.redirect("back");
	}
}
	

module.exports = router;