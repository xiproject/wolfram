var xal = require('../../xal-javascript');
var nlpparser = require('speakeasy-nlp');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var _ = require('underscore');

var config = require('./config.json');

var request;

if (config.proxy) {
    request = require('request').defaults({
        proxy: config.proxy
    });
} else {
    request = require('request');
}

var query_url = "http://api.wolframalpha.com/v2/query?appid=" + config.auth + "&input=";



function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

function isQuestion(query) {
    var question_actions = ["how", "what", "when", "who", "whom"];
    return containsObject(nlpparser.classify(query).action, question_actions);
}

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
    request(query_url + q, function(error, response, body) {
        cb(analyzeXML(body));
    });
}


xal.on('xi.event.input.text', function(state, done) {

    var texts = state.get('xi.event.input.text');
    var text = _.reduce(texts, function(memo, value) {
        if (memo.certainty > value.certainty) {
            memo = value;
        }
        return memo;
    }).value;

    if (isQuestion(text)) {
        query(text, function(answer) {
            if (answer) {
                xal.createEvent('xi.event.output.text', function(state, done) {
                    xal.log.info({
                        answer: answer
                    });
                    state.put('xi.event.output.text', answer);
                    done(state);
                });
            }
        });
    }
});


xal.start({
    name: 'Wolfram'
});
