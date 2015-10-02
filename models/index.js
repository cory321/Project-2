var mongoose = require("mongoose");

mongoose.connect("mongodb://cory321:cory103662@ds051953.mongolab.com:51953/heroku_rqzmw3k7" || "mongodb://localhost/surrealdb");
mongoose.set("debug", true);

module.exports.User = require("./user");
module.exports.Couple = require("./couples");