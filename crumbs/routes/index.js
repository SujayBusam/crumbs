'use strict';

var paypal = require('paypal-rest-sdk');
var config = {};
var Order = require('../models/order');
var Suggestion = require('../models/suggestion');

var deliveryDays = [4, 6] // Wednesday and Friday

// Routes

exports.mission = function(req, res) {
	return Order.find(function(err, orders) {
		if (!err) {
			res.render('mission', {
				title: 'The Crumbs Mission',
				orders: orders,
			});
			console.log(orders);
		} else {
			return console.log(err);
		}
	});
};

exports.originalIndex = function(req, res) {
	res.render('index');
}

// Reroute if not a delivery day
exports.nibbles = function (req, res) {
	res.render('nibbles');
};

exports.index = function (req, res) {
  var d = new Date();
  var n = d.getDay();

  if (deliveryDays.indexOf(n) != -1) {
    // Is a delivery day
    res.render('nibbles');
  } else {
    res.redirect('/closed');
  }
};

exports.draft = function(req, res) {
	res.render('draft');
};

exports.closed = function(req, res) {
	res.render('closed');
};

exports.cancel = function (req, res) {
	res.render('cancel');
};

exports.volunteer = function(req, res) {
	res.redirect('https://docs.google.com/forms/d/1YDhl1N9kViC5iJeHqZsgZ5EVYc3gzy8z-iKQmzeXLXs/viewform');
}

exports.suggestion = function(req, res) {
	var item = req.param('item');
	var price = req.param('price');
	var email = req.param('email');
	var suggestion = new Suggestion(
			{
				item: item,
				price: price,
				email: email
			});
	suggestion.save(function(err) {
		if (err) {
			console.log(err);
		}
		else {
			console.log(suggestion);
			res.end('{"success" : "Updated Successfully", "status" : 200}');
		}
	});
};


exports.success = function(req, res){
  var paymentId = req.session.paymentId;
  var payerId = req.param('PayerID');

  var details = { "payer_id": payerId };
	console.log(paymentId);
	

  paypal.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
      console.log(error);
    } else {
			res.render('success', {
				title: 'Success!',
				paymentId: paymentId,
			});
    }
  });
};

exports.execute = function(req, res) {
	var payerId = req.param('payerId');
	var summary = JSON.parse(req.param('summary'));
	console.log("PAYPAL");
	console.log(payerId);
	var order = new Order(
		{
			cost: summary['cost'],
			items: summary['items'],
			quantities: summary['quantities'],
			dormname: summary['dormname'],
			dormnumber: summary['dormnumber'],
			timestamp: summary['timestamp'],
			confirmation: payerId
		});
	order.save(function(err) {
		if (err) {
			console.log(err);
		}
		else {
			console.log(order);
		}
	});
}
 

exports.paypal = function(req, res) {
	var payment = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://thecrumbs.org/success",
			"cancel_url": "http://thecrumbs.org/cancel"
		},
		"transactions": [{
			"amount": {
				"total": req.param('amount'),
				"currency": "USD"
			},
			"description": req.param('description')
		}]
	};
	console.log(payment);


	paypal.payment.create(payment, function (error, payment) {
		if (error) {
			console.log(error);
		} else {
				req.session.paymentId = payment.id;
				var redirectUrl;
				for(var i=0; i < payment.links.length; i++) {
					var link = payment.links[i];
					if (link.method === 'REDIRECT') {
						redirectUrl = link.href;
					}
				}
				res.send(redirectUrl);
		}
	});
};

exports.suggestions = function(req, res) {
	return Suggestion.find(function(err, suggestions) {
		if (!err) {
			res.render('suggestions', {
				title: "Suggestions Page",
				suggestions: suggestions
			});
			console.log(suggestions);
		} else {
			return console.log(err);
		}
	});
};

exports.validatereferral = function(req, res) {
	var referralcode = req.param('referralcode');
	if (referralcode.substring(0, 3) != "PAY") {
		referralcode = "PAY-" + referralcode;
	}
	return Order.findOne({'confirmation':referralcode}, function(err, order) {
		console.log(referralcode);
		console.log(order);
		if (order) {
			res.send("Approved");
		}
		else {
			res.send("Error");
		}
	});
};


exports.admin = function(req, res) {
	return Order.find(function(err, orders) {
		if (!err) {
			res.render('admin', {
				title: 'Orders Page',
				orders: orders,
			});
			console.log(orders);
		} else {
			return console.log(err);
		}
	});
};

exports.create = function (req, res) {

	var payment = {
		"intent": "sale",
		"payer": {
		},
		"transactions": [{
			"amount": {
				"currency": 'USD',
				"total": req.param('amount')
			},
			"description": req.param('description')
		}]
	};

		var funding_instruments = [
			{
				"credit_card": {
					"type": req.param('type').toLowerCase(),
					"number": parseInt(req.param('number').replace(/\s+/g, '')),
					"expire_month": req.param('expire_month'),
					"expire_year": req.param('expire_year'),
					"first_name": req.param('first_name'),
					"last_name": req.param('last_name')
				}
			}
		];
		payment.payer.payment_method = 'credit_card';
		payment.payer.funding_instruments = funding_instruments;

	paypal.payment.create(payment, function (error, payment) {
		if (error) {
			console.log(error);
			console.log(error['response']['details']);
			res.send(error['response']);
		} else {
			req.session.paymentId = payment.id;
			res.send(payment);
			var summary = JSON.parse(req.param('summary'));
			console.log(summary);
			var order = new Order(
				{
					cost: summary['cost'],
					items: summary['items'],
					quantities: summary['quantities'],
					dormname: summary['dormname'],
					dormnumber: summary['dormnumber'],
					timestamp: summary['timestamp'],
					confirmation: payment.id,
					verified: true
				});
			order.save(function(err) {
				if (err) {
					console.log(err);
				}
				else {
					console.log(order);
				}
			});
		}
	});
};

// Configuration

exports.init = function (c) {
	config = c;
	paypal.configure(c.api);
};
