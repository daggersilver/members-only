require("dotenv").config();
var mongoAttach = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.s6okb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

module.exports = mongoAttach;