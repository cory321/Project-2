var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/surrealdb");
mongoose.set("debug", true);

module.exports.Couple = require("./couples");