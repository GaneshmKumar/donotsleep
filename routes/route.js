var express = require('express');
var CronJob = require('cron').CronJob;
var request = require('request');
var path = require('path');

var common = require('../common/common');
var URL = require('../models/urlSchema');

var router = express.Router();

router.route('/')
	.get(function(req, res) {
		res.setHeader('content-type', 'text/html');
		res.sendFile(path.join(__dirname, '../assets/index.html'));
	})
	.post(function(req, res) {
		var appURL = 'http://' + req.body.app + '.herokuapp.com';
		console.log(appURL);
		request(appURL, function(err, response, body) {
			if(err)
			{
				res.setHeader('content-type', 'text/plain');
				res.status(500).end("Internal Server Error");
			}
			else
			{
				var r = response && response.statusCode;
				if(r == 404 || r == 500 || r == 401 || r == 403)
				{
					console.log('404');
					res.setHeader('content-type', 'text/plain');
					res.status(404).end('Cannot access the app');
				}
				else
				{
					URL.findOne({url: appURL}, function(err, data) {
						if(err) { 
							res.setHeader('content-type', 'text/plain');
							res.status(500).end('Internal Server Error'); 
						}
						if(data == null)
						{
							URL.create({url: appURL}, function(err, data) {
								if(err) { 
									res.setHeader('content-type', 'text/plain');
									res.status(500).end('Internal Server Error'); 
								}
								var job = new CronJob({
									cronTime: '* 30 * * * *',
									onTick: function() {
						  				common.ping(appURL);
									},
									start: true
								});

								res.setHeader('content-type', 'text/plain');
								res.status(200).end('Successfully added the app');
							});
						}
						else
						{
							res.setHeader('content-type', 'text/plain');
							res.status(200).end('Successfully added the app');
						}
					});
				}
			}
		});
	});


module.exports = router;