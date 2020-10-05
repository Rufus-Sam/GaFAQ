var mongoose = require("mongoose");

var aSchema = new mongoose.Schema({
	answer: String,
	author: {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	}
});

module.exports = mongoose.model("Answer", aSchema);