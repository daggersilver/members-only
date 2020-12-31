const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const moment = require("moment");

//auth
const verifyAuth = require("../config/verifyAuth");

//get models
const Messages = require("../models/Messages");
const Users = require("../models/users");
const Admin = require("../models/admins");

router.get("/message", verifyAuth.checkAuth, verifyAuth.checkMember, (req, res)=>{
    res.render("message", {msgError: req.flash("msgError")})
})

router.get("/members",verifyAuth.checkAuth, verifyAuth.checkIsMember,(req, res)=>{
    res.render("member", {error: req.flash("error")});
})

router.get("/admin",verifyAuth.checkAuth, verifyAuth.checkAdmin, (req, res)=>{
    res.render("admin")
})

router.post("/admin", async (req, res)=>{
    var findUser = await Admin.findOne({username: req.user.username});

    if(findUser){
        req.flash("error", "You have already registered to become an admin. Please have patience")
        res.redirect("/")
    } else{
        var admin = new Admin();
        admin.username = req.user.username;
        admin.email = req.body.email;
        admin.save((err)=>{
            if(err){
                res.send("Server Error, Try again later");
            } else{
                
                req.flash("success", "Successfully registered for becoming an Admin");
                res.redirect("/");
            }
        })
    } 
})

router.post("/members", (req,res)=>{
    if(req.body.secret!=="blue-cat-is-not-blue"){
        req.flash("error", "Wrong Passcode, try again");
        res.redirect("/members");
        return;
    }
    var query = req.user.username;
    Users.updateOne({username: query}, {$set:{isMember: true}}, (err, result)=>{
        if(err){
            res.send("Server Error, please try later");
            return;
        } 
        if(result){
            req.flash("success", "Congratulations, You are a member now");
            res.redirect("/")
        } else{
            res.send("Server Error, please try later");
            return;
        }
    })
})

router.post("/message", 
body("title").notEmpty().withMessage('title must not be empty') ,
body("message").notEmpty().withMessage('message must not be empty') ,

(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.errors.forEach(l => {
            req.flash("msgError", l.msg)
        });
        res.redirect("/message");
        return;
    }
    
    var message = new Messages();
    message.title = req.body.title;
    message.msg = req.body.message;
    message.author = req.user.username;
    message.date = moment().format('MMMM Do YYYY, h:mm a'); 

    message.save((err, result)=>{
        if(err){
            console.log(err)
            req.flash("error", "Server Error, please try later");
        } else{
            console.log(result)
            req.flash("success", "Message Added")
        }
        res.redirect("/")
    })  
})

module.exports = router;