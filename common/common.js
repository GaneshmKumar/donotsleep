var request = require('request');
var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var common = require('../common/common');
var URL = require('../models/urlSchema');

exports.ping = function(appURL) 
{
	request(appURL, function (error, response, body) {
		if(error)
		{
			res.status(500).end("Internal Server Error");
		}

		var d = new Date();
		var hr = d.getHours(),
			min = d.getMinutes(),
			sec = d.getSeconds();
		console.log('url: ', appURL, 'statusCode:', response && response.statusCode, 'Time: ', hr+':'+min+':'+sec); 
	});
}

exports.startAllJobs = function() {
	URL.find({}, function(err, data) {
		console.log(data);
		if(err) throw err;
		data.forEach(function(item, index, arr) {
			var appURL = data[index].url;
			common.ping(appURL);
			console.log(appURL);
			var job = new CronJob({
				cronTime: '* */30 * * * *',
				onTick: function() {
					common.ping(appURL);
				},
				start: true
			});
		})
	});
}