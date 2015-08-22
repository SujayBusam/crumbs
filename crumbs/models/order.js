'use strict';

var mongoose = require('mongoose');

var config = {
	"USER"    : "",           
	"PASS"    : "",
	"HOST"    : "ec2-54-69-72-28.us-west-2.compute.amazonaws.com",  
	"PORT"    : "27017", 
	"DATABASE" : "orders"
};

var dbPath  = "mongodb://"+config.USER + ":"+
    config.PASS + "@"+
    config.HOST + ":"+
    config.PORT + "/"+
    config.DATABASE;
// mongoose.connect(dbPath);

mongoose.connect('mongodb://localhost/orders');
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
