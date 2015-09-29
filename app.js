var express = require("express");
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//**** PUBLIC VIEWS ****//

app.get("/", function(req,res){
	res.render("index");
});

app.get("/step1", function(req,res){
	res.render("step1");
});

app.get("/step2", function(req,res){
	res.render("step2");
});

app.get("/step3", function(req,res){
	res.render("step3");
});

app.get("/step4", function(req,res){
	res.render("step4");
});

app.get("/san-luis-obispo-wedding-videography", function(req,res){
	res.render("films");
});

app.get("/about-cory-williams", function(req,res){
	res.render("about");
});

app.get("/contact-us", function(req,res){
	res.render("contact");
});


//**** ADMIN DASHBOARD ****//

app.get("/admin", function(req,res){
	res.render("admin/index");
});



//**** 404 Catch All ****//
app.get("*", function(req,res){
	res.redirect("/");
});

app.listen(3000, function(req,res){
	console.log("listening on 3000");
});
