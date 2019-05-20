var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//ROOTE ROUTE
router.get("/", (req, res) => {
   res.render("landing");
});

//==============
//AUTH ROUTES
///

//SHOW REGISTERATION PAGE
router.get('/register', (req, res) =>{
    res.render("register");
})

//HNDLE SIGN UP INFO FROM FORM

router.post('/register', (req,res) =>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) =>{
        if(err){
            return res.render("register", {"error": err.message});
        } passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        })
    } )
})

//show login form

router.get('/login', (req,res)=>{
    res.render('login');
});

//HANDLING LOGIN LOGIC
router.post('/login', passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"    
    }),(req, res) => {
    res.send("Login logic happens here");
});

//LOGOUT LOGIC ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged You Out");
    res.redirect('/campgrounds');
});


module.exports = router;