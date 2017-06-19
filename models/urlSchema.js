var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var URL = new Schema({
	url: String
});

URL.index({url: 1});
module.exports = mongoose.model('URL', URL);