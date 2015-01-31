var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var config = require('../config.json');

var request;

if (config.proxy) {
    request = require('request').defaults({
        proxy: config.proxy
    });
} else {
    request = require('request');
}

var query_url = "http://api.wolframalpha.com/v2/query?format=plaintext&primary=true&appid=" + config.auth + "&input=";





function analyzeXML(xml) {
    var doc = new dom().parseFromString(xml);
    var nodes = xpath.select("//pod[@title='Result']/subpod/plaintext", doc);
    var result = null;
    if (nodes.length !== 0) {
        result = nodes[0].firstChild.data;
    }
    return result;
}

function query(q, cb) {
    request(query_url + encodeURIComponent(q), function(err, response, body) {
        if(err) {
            cb(err);
        }
        else{
            cb(null, analyzeXML(body));
        }
    });
}



exports.query = query;
