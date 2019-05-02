const express    = require("express"),
      app        = express(),
      mongoose   = require("mongoose"),
      bodyParser = require("body-parser"),
      //SCHEMA SETUP - imported from campground.js
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      //seed the db with sample data
      seedDB = require("./seeds");
      
      
 
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
seedDB();     



app.get("/", (req, res) => {
   res.render("landing");
});

//INDEX ROUTE
app.get("/campgrounds", (req, res) =>{
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
app.post("/campgrounds", (req, res) =>{
    //get data from form
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name: name, image: image, description: desc};
    
    //create a new compgrand and save to DB
    Campground.create(newCampground, (err, newlyCreated) =>{
        if(err){
            console.log(err);
        } else {
            //redirect to campground get route
            res.redirect("campgrounds");
        }
    });
});

//NEW ROUTE
app.get("/campgrounds/new", (req, res) =>{
    //fid campground with provided id
   res.render("campgrounds/new");
   //render showtemplate with that campground
});

//SHOW ROUTE
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) =>{
        if(err) {
            console.log(err);
        }else {
             res.render("campgrounds/show",{campgrounds: foundCampground}) ;
        }
    });
  
});

//================
//COMMENTS ROUTE
//================

app.get("/campgrounds/:id/comments/new", (req, res) =>{
   Campground.findById(req.params.id, (err, campground)=>{
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
   });
    
});

app.post("/campgrounds/:id/comments", (req, res) => {
   //look up campground by id
   Campground.findById(req.params.id, (err, campground) =>{
     if(err){
         console.log(err);
         res.redirect("/campgrounds");
     }  else {
         Comment.create(req.body.comment, (err, comment)=>{
             if(err){
                 console.log(err);
             } else {
                 campground.comments.push(comment);
                 campground.save();
                 res.redirect("/campgrounds/" + campground._id);
             }
         });
     }
   });
   //create new comment
   //connect new comment to campground
   //return to campground show page
});


//serving up the server
app.listen(process.env.PORT, process.env.IT, () => {
    console.log("YelpCamp server has started");
});