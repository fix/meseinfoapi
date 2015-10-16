/**
 * Establishing the routes / API's for this server
 */

var App = require("../core");
var _ =  require("underscore");
var errorHandling = require("./errorHandling");
var tokens = require("../tokens");
var config = require("../config").v1;
var request = require("request");


module.exports = function() {

	// Validate token in routine
	function validateToken(req, res, next) {
		// Handle secret admin access
		if(config.adminKeyEnabled && req.query.secret_admin === config.adminKey) {
			next();
		} else {
			try {
				if(!req.headers.api_token) {
					throw { code: "NO_TOKEN" };
				}

				if(!req.headers.api_secret) {
					throw { code: "NO_TOKEN" };
				}

				if(!tokens[req.headers.api_token]) {
					throw { code: "INVALID_TOKEN" };
				}

				if(!tokens[req.headers.api_token].secret !== req.headers.api_secret) {
					throw { code: "INVALID_TOKEN" };
				}

				next();
			} catch(e) {
				errorHandling.handle(e, res);
			}
		}
	}

	App.Express.get("/:version/search/:terms", validateToken, function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		try {
			if(!req.params.terms) {
				throw { code: "NO_EMPLOYEE_ID" };
			}
			var data = {
			  "F": "cef.kephas.shared.request.AppRequestFactory",
			  "I": [{
			    "O": "Bzv0wi60qgwcW5aKiRKrtgNaLKo=",
			    "P": [req.params.terms + " toutecelebration", 0, 25, 0, null, null, ""],
			    "R": ["listCelebrationTime.locality"]
			  }]
			};
			request({
		    url: "http://egliseinfo.catholique.fr/Widget/gwtRequest",
		    method: "POST",
				headers: {"Content-Type":"application/json; charset=UTF-8"},
		    json: true,
		    body: data
			}, function (error, response, body){
				res.send(body);
			});

		} catch(e) {
			errorHandling.handle(e, res);
		}
	});
};
