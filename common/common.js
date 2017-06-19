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
		if(err) throw err;
		for(var i = 0; i < data.length; i ++)
		{
			var appURL = data[i].url;
			var job = new CronJob({
				cronTime: '45 * * * * *',
				onTick: function() {
					common.ping(appURL);
				},
				start: false
			});
			job.start();
		}
	});
}