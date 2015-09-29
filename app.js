var express = require("express");
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req,res){
	res.render("step1");
});

app.listen(3000, function(req,res){
	console.log("listening on 3000");
});
