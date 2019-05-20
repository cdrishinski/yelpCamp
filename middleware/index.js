var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};


//CHECKCAMPGROUNDOWNERSHIP FUNCTION MIDDLEWARE
 middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    //check if user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) =>{
            if(err){
                req.flash("error", "Campground Not Found!")
                res.redirect("back");
            } else {
                
            // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
            if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
            // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
                 
                  //does user own the campground?
                  if(foundCampground.author.id.equals(req.user._id)){
                         //if so let them edit campground
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            } 
      });
        
    }else {//if not logged in redirect them to login page
        res.redirect("back");
    }
     
}

//CHECKCOMMENTOWNERSHIP FUNCTION MIDDLEWARE
middlewareObj.checkCommentOwnership = (req, res, next)=> {
    //check if user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) =>{
            if(err){
                res.redirect("back");
            } else {
                  //does user own the comment?
                  if(foundComment.author.id.equals(req.user._id)){
                         //if so let them edit campground
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back");
                }
            } 
      });
        
    }else {//if not logged in redirect them to login page
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
     
};

//ISLOGGEDIN FUNCTION MIDDLWARE
middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }

    req.flash("error", "You need to be logged in to do that"); //this has to happen prior to redirect on next line, or it won't run.
    res.redirect("/login");
};




module.exports = middlewareObj;