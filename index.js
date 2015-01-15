var xal = require('../../xal-javascript');
var _ = require('underscore');
var nlpparser = require('speakeasy-nlp');
var wolfram = require('./wolfram');

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

xal.on('xi.event.input.text', function(state, done) {
    var texts = state.get('xi.event.input.text');
    var text = _.reduce(texts, function(memo, value) {
        if (memo.certainty > value.certainty) {
            memo = value;
        }
        return memo;
    }).value;

    if (isQuestion(text)) {
        wolfram.query(text, function(err, answer) {
            if(err){
                xal.log.error(err);
                return;
            }
            if (answer) {
                xal.createEvent('xi.event.output.text', function(state, done) {
                    xal.log.info({
                        answer: answer
                    });
                    state.put('xi.event.output.text', answer);
                    done(state);
                });
            }
            else{
                xal.log.debug('Queried but did not get relevant answer');
            }
        });
    }
});


xal.start({
    name: 'Wolfram'
});
