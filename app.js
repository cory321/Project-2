var express = require("express");
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	stripe = require("stripe")("sk_test_3NxSejZObkd1VsaX3NCrCZ64"),
	app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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

app.get("/stripe", function(req,res){
	res.render("stripe");
});

app.post("/stripe", function(req,res) {
	
	var stripeToken = req.body.stripeToken;
	var price = 2000;
	var priceReadable = "$" + ((price/100).toFixed(2)).toString();

	var charge = stripe.charges.create({
	  amount: price, // amount in cents, again
	  currency: "usd",
	  source: stripeToken,
	  description: "Example charge"
	}, function(err, charge) {
	  if (err || err && err.type === 'StripeCardError') {
	    // The card has been declined
	    res.render("declined", {error: err.message});
	  } else {
	  	res.render("success", {amount: priceReadable});
	  }
	});
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
