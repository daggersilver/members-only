const mongoose = require("mongoose");


const messageSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    msg:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    }
})

var Messages = module.exports = mongoose.model("messages", messageSchema);