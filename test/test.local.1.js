var logger = require('./../src/bunyanWrapper');


logger.info("hi");
logger.debug({message: 'Your string here...'});
logger.tag('myTagA').debug({ message: 'Successfully connected' });

var planets = {planets: ['mars', 'earth']};
logger.tag('myTagB').debug({
    type: 'AUDIT',
    habitable: planets,
});

console.log('\nRegex with JSON.stingify(object, replacer)\n');
// checking regex with parse = true
var query = { sku: /^BA1262$/i };
logger.tag('Regex').debug({ query: JSON.stringify(query, replacer) }); // use the utility method replacer!


// Checking passing regex with array
var query2 = { query: [{ sku: /^BA1262$/i }, {sku: /^BRAT$/i}] } ;
logger.tag('RegExArray').debug({ query: JSON.stringify(query2, replacer) });

// Checking object parse(boolean)
var query3 = { sku: /^BA1262$/i };
logger.parse(true).tag('parse(boolean)').debug(query3);

// Checking regex array with parse(boolean)
var query4 = { query: [{ sku: /^BA1262$/i }, {sku: /^BRAT$/i}] } ;
logger.parse(true).tag('RegExArray parse(boolean)').debug(query4);

// This does not work due to issue at: https://github.com/trentm/node-bunyan/issues/369. 
// Update: This works as of version: 1.1.0 as we are encapsulating errors inside err object using parentObject property
var error = new Error('the earth is flat');
logger.error(error);

var explicitError = new Error();
explicitError.message = 'the earth is round :p';
explicitError.name = 'discovery';   
explicitError.stack = 'Some stack here.....';
logger.error(explicitError);

//console.log("\n\nUsing correct format below logger.error({err: object}), thus name isn't overriden");
// It is therefore recommended to use the following format! This way we don't override name property of bunyan. *This statement doesn't apply to version 1.1.0*
// Update: No longer need to use below format as of version 1.1.0
//logger.error({err: explicitError}});

/* Version 1.1.0 (Will be included in v2.0.0) */
logger.setParentObjectName('dump');

logger.tag('ParentObject name changed').info('Hi....');
logger.debug({arg: 'some arg'});

/* Version 2.0.0 */
var demo = {text: 'hello world', number: 0000, obj: {a: 'a', b: 'b'} };
logger.filter({demo: ['text'], someObj: ['q']}).debug({demo: demo, someObj: {p: 'content..', q: 'q' }});
logger.filter({demo: ['number', 'obj']}).debug({demo: demo});

/*
    utility functions
*/

function replacer(key, value) {
    if(value instanceof RegExp) {
        return value.toString();
    }
    return value;
}