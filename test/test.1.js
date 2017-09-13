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

var error = new Error('the earth is flat');
logger.error(error);