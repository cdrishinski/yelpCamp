var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX ROUTE
router.get("/", (req, res) =>{
    
    //get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) =>{
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
});


//CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) =>{
    //get data from form
    let name = req.body.name;
    let image = req.body.image;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let desc = req.body.description;
    let newCampground = {name: name, price: price, image: image, description: desc, author:  author};
  
    //create a new compgrand and save to DB
    Campground.create(newCampground, (err, newlyCreated) =>{
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        } else {
            //redirect to campground get route
            req.flash("success", "Succesfully created campground!");
            res.redirect("campgrounds");
        }
    });
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) =>{
    //fid campground with provided id
   res.render("campgrounds/new");
   //render showtemplate with that campground
});

//SHOW ROUTE
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) =>{
        if(err) {
            console.log(err);
        }else {
             res.render("campgrounds/show",{campgrounds: foundCampground}) ;
        }
    });
  
});

//EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) =>{
        res.render("campgrounds/edit", {campground: foundCampground});
      });
});

//UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err) {
            res.redirect('/campgrounds');
        } else {//redirect to show page
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
    
});
//DESTROY ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            req.flash("error", "Something went wrong")
            res.redirect('/campgrounds');
        } else {
            req.flash("success", "Succesfully deleted campground :(")
            res.redirect('/campgrounds');
        }
    });
});

//MIDDLEWARE


module.exports = router;