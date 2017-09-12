
sp-json-logger is **a simple and fast JSON logging library** for node.js services. It is a wrapper module which adds more functionality and conventions to the bunyan logger.

# Installation

```sh
npm install sp-json-logger
```

```js
var log = require('sp-json-logger');
log.info({log: { message: "hi"}});
```
**Important:** It is important to have NAME, APPLICATION, PROGRAM and LANGUAGE env variables set up before requiring the module!

# Conventions followed while logging:

You need to set the following environment variables for logger to work without our logger module throwing errors ( We can change this behavior if we want, but it will help us create a habit to specify env variables which can be used to identify our application in multi app environment where we have multiple modules split up into different microservices each having its own language and platform)

- **NAME:** ‘Name of the logger’ 
- **APPLICATION:** ‘Name of applicaton’
- **PROGRAM:** ‘Name of module’ // eg: scheduler-worker/scheduler-api
- **LANGUAGE:** ‘Programming language used’ // eg: javascript/php/go
- **NODE_ENV:** ‘environment’ // note: Pretty print is supported on local environment setting, if using staging or production, you won’t get pretty json output to console.

If logging only string message, use the following format:

`logger.debug({log: {message: ‘Your string here...’}});`

Also use `logger.tag(‘CONNECTION’).debug({log: { message: ‘Successfully connected’ } });`
If logging a JSON Object, use following format:
```js
logger.tag(‘AUDIT’).debug({log:{
	type: ‘TYPE of LOG’,  // eg: AUDIT Created
	objectName: objectValue,
	}
});
```

# Different log levels: (Log levels corresponds to different integer values)
Source: [https://www.npmjs.com/package/bunyan#levels](https://www.npmjs.com/package/bunyan#levels)

- "fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
- "error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
- "warn" (40): A note on something that should probably be looked at by an operator eventually.
- "info" (30): Detail on regular operation.
- "debug" (20): Anything else, i.e. too verbose to be included in "info" level.
- "trace" (10): Logging from external libraries used by your app or very detailed application logging.


# Key Notes:
- Use tags wherever applicable i.e `logger.tag(‘TAG’).error(err);`
- When logging error, pass the err object instance directly i.e rather than doing `logger.error({log: {error: err}})`, do `logger.error(err);` instead! Bunyan recommends this approach and we have to make sure that it is being followed!
Source: [https://www.npmjs.com/package/bunyan#recommendedbest-practice-fields](https://www.npmjs.com/package/bunyan#recommendedbest-practice-fields)

# Local environment vs Staging/Production environment:

It was observed that printing json through bunyan was not readable for developers. In short it did not have pretty print functionality built in. 
We solved this problem by using the following module: https://github.com/WoLfulus/bunyans
Above module provided a new output stream that pretty prints json object to console.

So during local environment, we can enjoy pretty print. During staging and production, we get normal json output which helps us to reduce the impact of performance for pretty printing.

Important: Pretty print stream is a huge performance overhead, so it is recommended to use it only for local/development environment (if you ever want to modify bunyanLogger.js file inside sp-json-logger module)

# Notes: 
- Specify name of the logger in the NAME env variable to be meaningful.
- As far as possible use `logger.tag('TAG');` field to describe the event for which we are logging.
- If you just need to log a string, do take the pain and create it as follows: 
`logger.debug({ log: {message: ‘your string’ } });`


