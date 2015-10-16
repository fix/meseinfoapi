/**
 * The core app singleton
 * @class App
 */

var express = require("express");
var bodyParser = require("body-parser");
var config = require("./config");

var App = {
	Express: {},
	Server: {},
	init: function() {
		App.Express = express();

		App.Express.use(bodyParser());

		require("./routes")();

		var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
		var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

		App.Server = App.Express.listen(server_port, server_ip_address, function () {
  		console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
		});
	}
};

module.exports = App;
