

const mongoose = require("mongoose");
const path = require("path");
const mongoURL = require("./config/db")
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const flash = require('express-flash');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport")
const express = require("express");
const app = express();

mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;

db.on("error", (err)=>{
    if(err) console.log(err); 
})
db.once("open", (err)=>{
    console.log("database running")
})

//initialize passport
var InitializeAuth = require("./config/passport")
InitializeAuth();

//pug 
app.set("views", "./views/")
app.set("view engine", "pug")

//static files
app.use(express.static(path.join(__dirname, "public")))

//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//flash middleware
app.use(cookieParser('keyboard cat'));
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());

//get models
var Messages = require("./models/Messages");

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next)=>{
    res.locals.user = req.user;
    next();
})

app.get("/", (req, res)=>{
    Messages.find({}, (err, result)=>{
        if(err) throw err;
        else{
            res.render("index", {success: req.flash("success"),
                                 error: req.flash("error"),
                                 messages: result})
        }
    }) 
})


//get routes
const routes = require("./routes/route");
const generalRoutes = require("./routes/general");
app.use("/users", routes)
app.use("/", generalRoutes)

app.listen(port);
