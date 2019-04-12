const express    = require("express"),
      app        = express(),
      mongoose   = require("mongoose"),
      bodyParser = require("body-parser");
      
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Granite Hill",
//     image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
//     description: "this is a beautiful site with no bears."
// }, (err, newlyMade) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log(`New campground made:`);
//         console.log(newlyMade);
//     }
// });


app.get("/", (req, res) => {
   res.render("landing");
});

app.get("/campgrounds", (req, res) =>{
    //get all campgrounds from DB
    
    Campground.find({}, (err, allCampgrounds) =>{
        if(err){
            console.log(err);
        } else {
            res.render("index",{campgrounds: allCampgrounds});
        }
    });
});

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


app.get("/campgrounds/new", (req, res) =>{
    //fid campground with provided id
   res.render("new");
   //render showtemplate with that campground
});

//SHOW routing
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) =>{
        if(err) {
            console.log(err);
        }else {
             res.render("show",{campground: foundCampground}) ;
        }
    });
  
});


//serving up the server
app.listen(process.env.PORT, process.env.IT, () => {
    console.log("YelpCamp server has started");
});