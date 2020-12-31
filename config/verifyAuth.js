function checkAuth(req,res,next){
    if(req.user){
        next();
    } else{
        req.flash("error", "You have to Log In first")
        res.redirect("/users/login");
    }
}

function checkNotAuth(req,res,next){
    if(req.isAuthenticated()){
        req.flash("error", "You are already Logged In")
        res.redirect("/");
    } else{
        next();
    }
}
function checkMember(req,res,next){
    if(req.user.isMember){
        next(); 
    } else{
        req.flash("error", "You have to become a member to send messages")
        res.redirect("/members");
    }
}
function checkIsMember(req, res, next){
    if(req.user.isMember){
        req.flash("error", "You are already a member")
        res.redirect("/");
    } else{
        next();
    }
}

function checkAdmin(req, res, next){
    if(!req.user.isMember){
        req.flash("error", "Become a member first")
        res.redirect("/members");
    } else{
        next();
    }
}

module.exports.checkAuth = checkAuth;
module.exports.checkNotAuth = checkNotAuth;
module.exports.checkMember = checkMember;
module.exports.checkIsMember = checkIsMember;
module.exports.checkAdmin = checkAdmin;