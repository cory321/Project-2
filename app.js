var express = require("express");
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	db = require("./models"),
	session = require("cookie-session"),
	stripe = require("stripe")("sk_test_3NxSejZObkd1VsaX3NCrCZ64"),
    loginMiddleware = require("./middleware/loginHelper"),
    routeMiddleware = require("./middleware/routeHelper"),
	app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(loginMiddleware);

app.use(session({
  maxAge: 3600000,
  secret: 'secret-token',
  name: "bookingForm"
}));

//**** PUBLIC VIEWS ****//

app.get("/", function(req,res){
	res.render("index");
});

app.get("/step1", function(req,res){
	if(req.session.form0) {
		res.render("step1", req.session.form0);
	} else {
		res.redirect("/contact-us");
	}
});

app.get("/reset", function(req,res){
	req.session.form0 = null;
	res.redirect("/");
});

app.post("/step1", function(req,res){
		req.session.form0 = req.body;
		var monthNames = ["January", "February", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
		];
		var weddingISODate = new Date(req.body.weddingDate);
		var weddingUTCDate = monthNames[weddingISODate.getMonth()] + " " + weddingISODate.getDate() + ", " + weddingISODate.getFullYear();

		req.session.form0.weddingDate = weddingUTCDate;

		db.Couple.find({weddingDate: weddingISODate.toISOString()}, function(err, couple){
			if(err) {
				console.log(err);
			} else if(!couple.length) {
				res.render("step1", req.session.form0);
			} else {
				res.render("date-already-booked", req.session.form0);
				console.log(couple);
			}
			
		});
});

app.get("/step2", function(req,res){
	//if there are any query params
	if(req.query){
		var selectedPackage = req.query.package;
		req.session.selectedPackage = selectedPackage;
	}

	//if there is a session
	// if(req.session.form0) {

	var person = req.session.form0.person;

		//Autofill the Wedding Overview with what we already know from Contact Form
		switch(person) {
			case "groom":
			var step2params = {
				weddingDate : req.session.form0.weddingDate,
				packageType : req.session.selectedPackage,
				groomsFirstName : req.session.form0.firstName,
				groomsLastName : req.session.form0.lastName,
				groomsEmail : req.session.form0.email,
				bridesFirstName : "",
				bridesLastName : "",
				bridesEmail : ""
			};
			break;

			case "bride":
			var step2params = {
				weddingDate : req.session.form0.weddingDate,
				packageType : req.session.selectedPackage,
				groomsFirstName : "",
				groomsLastName : "",
				groomsEmail : "",
				bridesFirstName : req.session.form0.firstName,
				bridesLastName : req.session.form0.lastName,
				bridesEmail : req.session.form0.email
			};
			break;

			case "else":
			 var step2params = {
				weddingDate : req.session.form0.weddingDate,
				packageType : req.session.selectedPackage,
				groomsFirstName : "",
				groomsLastName : "",
				groomsEmail : "",
				bridesFirstName : "",
				bridesLastName : "",
				bridesEmail : ""
			};
			break;

			default:
			var step2params = {
			 	weddingDate : req.session.form0.weddingDate,
				groomsFirstName : "",
				groomsLastName : "",
				groomsEmail : "",
				bridesFirstName : "",
				bridesLastName : "",
				bridesEmail : ""
			};
			break;
		}

		res.render("step2", step2params);
	// } else {
	// 	res.redirect("/contact-us");
	// }
});

app.get("/step3", function(req,res){
	if(req.session.form0) {
		res.render("step3");
	} else {
		res.redirect("/contact-us");
	}
});

app.post("/step3", function(req,res){
	db.Couple.create(req.body.newCouple, function(err, post){
		if(err) {
			console.log(err);
		} else {
			console.log(req.body.newCouple);
			res.render("step3");
		}
	});
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
	var price = 80000;
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

app.get("/admin", routeMiddleware.ensureLoggedIn, function(req,res){
	db.Couple.find({}, function(err, couple){
		if(err) {
			throw err;
		} else {
			res.render("admin/index", {couple: couple});
		}
	});
});

app.get('/admin/signup', routeMiddleware.preventLoginSignup, function(req,res){

  res.render('admin/signup');
});

app.post("/admin/signup", function (req, res) {
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/");
    } else {
      console.log(err);
      res.render("admin/signup");
    }
  });
});

app.get("/admin/login", routeMiddleware.preventLoginSignup, function (req, res) {
	res.render("admin/login");
});

app.post("/admin/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/admin");
    } else {
      res.render("admin/index");
    }
  });
});

app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
});

//**** 404 Catch All ****//
app.get("*", function(req,res){
	res.redirect("/");
});

app.listen(3000, function(req,res){
	console.log("listening on 3000");
});
