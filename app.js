const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 8080
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



main().then((res)=>{
    console.log("Data was connected on DB")
})
.catch((err)=>{
    console.log(err)
});


async function main() {
  await mongoose.connect('mongodb+srv://arkobag712409:V1uV3W9Clwekk8Ax@cluster0.8lvaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}


// 'mongodb://127.0.0.1:27017/EcoHub'

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));



//Index Route
app.get("/listings", async(req, res)=>{
    let listings = await  Listing.find();
    res.render("listings/index.ejs", {listings})
});



//New Route
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});


//Show Route
app.get("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    let showListing = await Listing.findById(id);
    res.render("listings/show.ejs", {showListing});
});


//Create Route
app.post("/listings", async(req, res)=>{
    // let newListing = new Listing({
    //     title : title,
    //     image : image,
    //     Capacity : Capacity,
    //     Material : Material,
    //     Price : Price,
    // })
    // await newListing.save()
    // let listing = req.body.listing;
    // console.log(listing);


    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
});


//Edit Route
app.get("/listings/:id/edit", async(req, res)=>{
    let {id} = req.params;
    let showListing = await Listing.findById(id);
    res.render("listings/edit.ejs", {showListing});
});


//Update Route
app.put("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    // let {title, image, Capacity, Material, Price} = req.body;
    // await Listing.findByIdAndUpdate(id, {title, image, Capacity, Material, Price});
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // console.log(updateListing);
    res.redirect(`/listings/${id}`);
});


//Delete Route
app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(deleteListing);
    res.redirect("/listings");
});



app.get("/", (req, res)=>{
    res.send("Wellcom to the home page")
});

app.listen(port, ()=>{
    console.log("Server was connected port : 8080")
});