'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var suggestionSchema = new Schema({
	item: String,
	price: String,
	email: String
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
