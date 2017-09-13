var logger = require('sp-json-logger');

logger.info({log: { message: "hi"}});
logger.debug({log: {message: 'Your string here...'}});
logger.tag('myTagA').debug({log: { message: 'Successfully connected' } });

var planets = {planets: ['mars', 'earth']};
logger.tag('myTagB').debug({log: {
    type: 'AUDIT',
    habitable: planets,
	}
});

// This does not work due to issue at: https://github.com/trentm/node-bunyan/issues/369
var error = new Error('the earth is flat');
logger.error(error);

// Whereas explicitly stating the object below works with one caveat i.e name property overrides the logger name property!
var explicitError = new Error();
explicitError.message = 'the earth is round :p';
explicitError.name = 'discovery';   
logger.error(explicitError);

// It is therefore recommended to use the following format! This way we don't override name property of bunyan.
logger.error({err: explicitError});