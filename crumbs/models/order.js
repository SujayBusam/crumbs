'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var orderSchema = new Schema({
	cost: Number,
	items: [String],
	quantities: [Number],
	dormname: String,
	dormnumber: String,
	timestamp: String,
	confirmation: {type: String, unique: true},
});

module.exports = mongoose.model('Order', orderSchema);
