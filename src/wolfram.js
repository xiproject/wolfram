var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var xal = require('../../../xal-javascript');
var request = require('request');

try {
    var config = require('../config.json');
} catch (e) {
    xal.log.fatal('config.json not found. Procure the API key from [Wolfram Alpha](https://developer.wolframalpha.com) and place it in config.json. See the README for more details');
    process.exit(1);
}




var query_url = "http://api.wolframalpha.com/v2/query?format=plaintext&primary=true&appid=" + config.auth + "&input=";

function analyzeXML(xml) {
    var doc = new dom().parseFromString(xml);
    var nodes = xpath.select("//pod[@title='Result']/subpod/plaintext", doc);
    var result = null;
    if (nodes.length !== 0 && nodes[0].firstChild) {
        result = nodes[0].firstChild.data;
    }
    return result;
}

function query(q, cb) {

    var tries = 0;
    var maxTries = 3;

    var queryHelper = function () {
        request(query_url + encodeURIComponent(q), function(err, response, body) {
            if(err) {
                if (tries < maxTries){
                    tries += 1;
                    queryHelper();
                } else {
                    cb(err);
                }

            } else {
                cb(null, analyzeXML(body));
            }
        });
    };
    queryHelper();
}

exports.query = query;
