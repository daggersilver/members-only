var mongoose = require("mongoose");

var adminSchema = mongoose.Schema({
    username:{
        type: String
    },
    email:{
        type: String
    }
})


var Admin = module.exports = mongoose.model("adminRequests", adminSchema);