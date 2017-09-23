var logger = require('./../src/bunyanWrapper');


logger.info({log: { message: "hi"}});
logger.debug({log: {message: 'Your string here...'}});
logger.tag('myTagA').debug({log: { message: 'Successfully connected' }});

var planets = {planets: ['mars', 'earth']};
logger.tag('myTagB').debug({log: {
    type: 'AUDIT',
    habitable: planets,
	}
});

console.log('Regex with parse(true)\n');
// checking regex with parse = true
var query = { sku: /^BA1262$/i };
logger.tag('Regex').parse(true).debug({log: {query: query}});

// Checking passing regex with array
var query2 = { log: { query: [{ sku: /^BA1262$/i }, {sku: /^BRAT$/i}] } };
logger.tag('RegExArray').parse(true).debug(query2);

console.log('Regex without parse(true)\n');
// checking regex without parse = true
var query = { sku: /^BA1262$/i };
logger.tag('Regex').debug({log: {query: query}});

// Checking passing regex with array
var query2 = { log: { query: [{ sku: /^BA1262$/i }, {sku: /^BRAT$/i}] } };
logger.tag('RegExArray').debug(query2);

// This does not work due to issue at: https://github.com/trentm/node-bunyan/issues/369
//var error = new Error('the earth is flat');
//logger.error(error);

// Whereas explicitly stating the object below works with one caveat i.e name property overrides the logger name property!
console.log("\n\nIf we use logger.error({message: 'Your message', name: 'error name', stack: 'some stack....'});");
console.log('It will override the bunyan name property, so such usage is discouraged. See below output for such behavior, name property is discovery instead of sp-json-logger');
var explicitError = new Error();
explicitError.message = 'the earth is round :p';
explicitError.name = 'discovery';   
explicitError.stack = 'Some stack here.....';
logger.error(explicitError);

console.log("\n\nUsing correct format below logger.error({err: object}), thus name isn't overriden");
// It is therefore recommended to use the following format! This way we don't override name property of bunyan.
logger.error({err: explicitError});




