var express = require("express");
var router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const passport = require("passport")
const verifyAuth = require("../config/verifyAuth");

//get models
var Users = require("../models/users")

router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Logged Out")
    res.redirect('/');
})

router.get("/login",verifyAuth.checkNotAuth, (req, res)=>{
    res.render("login", {success: req.flash("registration-success"), 
                         failureFlash: req.flash("error")})

})

router.get("/register", verifyAuth.checkNotAuth, (req, res)=>{
    res.render("register", {error: req.flash("registration-err")})
})

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: "Invalid Username or Password",
                                   successFlash: "You are now Logged In"})
);

router.post("/register", 
body("name").notEmpty().withMessage('name must not be empty') ,
body("username").notEmpty().withMessage('username must not be empty') ,
body("email").notEmpty().withMessage('email must not be empty'),
body("email").isEmail().withMessage('enter a valid email'),
body("password").notEmpty().withMessage('password must not be empty'),
body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.errors.forEach(l => {
            req.flash("registration-err", l.msg)
        });
        res.redirect("/users/register");
        return;
    }
    if(await Users.findOne({username: req.body.username})){
        req.flash("registration-err", "User with that username already exists")
        res.redirect("/users/register");
        return;
    }
    var passhash = await bcrypt.hash(req.body.password, 10)
    var user = new Users();
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = passhash;
    user.isMember = false;
    user.isAdmin = false;

    user.save((err, result)=>{
        if(err){
            req.flash("registration-err", "Server Error, please try later");
            res.redirect("/users/register")
        } else{
            req.flash("registration-success", "Successfully Registered")
            res.redirect("/users/login")
        }
    })  
})


module.exports = router;