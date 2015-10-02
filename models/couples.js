var mongoose = require("mongoose");

var couplesSchema = new mongoose.Schema({
	weddingDate: Date,
	groomsFirstName: String,
	groomsLastName: String,
	groomsEmail: String,
	groomsPhone: String,
	bridesFirstName: String,
	bridesLastName: String,
	bridesEmail: String,
	bridesPhone: String,
	gettingReadyLocation: String,
	receptionLocation: String,
	photographersName: String,
	plannersName: String,
	referralNotes: String,
	packageType: Number
});

var Couple = mongoose.model("Couple", couplesSchema);

module.exports = Couple;