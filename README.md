
(Still under development) sp-json-logger is **a simple and fast JSON logging library** for node.js services. It is a wrapper module which adds more functionality and conventions to the bunyan logger.

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

- **NAME:** 'Name of the logger' else will default to 'sp-json-logger'
- **APPLICATION:** 'Name of applicaton'
- **PROGRAM:** 'Name of module' // eg: scheduler-worker/scheduler-api
- **LANGUAGE:** 'Programming language used' // eg: javascript/php/go
- **NODE_ENV:** 'environment' // note: Pretty print is supported on local environment setting, if using staging or production, you won’t get pretty json output to console.

If logging only string message, use the following format:

`logger.debug({log: {message: 'Your string here...'}});`

Also use `logger.tag('CONNECTION').debug({log: { message: 'Successfully connected' } });`
If logging a JSON Object, use following format:
```js
logger.tag('AUDIT').debug({log:{
	type: 'TYPE of LOG',  // eg: AUDIT Created
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
- When logging error, pass the err object instance directly i.e rather than doing `logger.error({log: {error: err}})`, do `logger.error(err);` instead. Assuming the format of err object is `{err: {message: 'your message', name: 'some name', stack: 'some stack...'}}`! Bunyan recommends this approach and we have to make sure that it is being followed!
Source: [https://www.npmjs.com/package/bunyan#recommendedbest-practice-fields](https://www.npmjs.com/package/bunyan#recommendedbest-practice-fields)
- For logging errors of custom objects, use the syntax: `logger.error({err: customObj});`

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
`logger.debug({ log: {message: 'your string' } });`

# Testing:

@TODO: need to configure docker container ip addresses, I tested it on my local machine by looking at logs where elasticsearch and logstash were listening for input.

* To test without publishing, go to the `PROJECT_ROOT` directory and run `npm link`. Sample output:

		```
		$ npm link
		~/.nvm/versions/v7.10.0/lib/node_modules/sp-json-logger -> ~/path/to/<PROJECT_ROOT>
		```
* First start logstash and elasticsearch instances
	- run the command from root directory: `docker-compose up`
	- once logstash and elasticsearch instances are up and running, issue following commands:

	- `docker build ./ --tag tests`
	- `docker run tests`

* (Another way) Now you can create and run tests:
		* `node test/test.1.js`

				```
				{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":46852,"level":30,"application":"","program":"","language":"","log":{"message
				":"hi"},"msg":"","time":"2017-09-13T07:39:22.107Z","v":0}
				{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":46852,"level":20,"application":"","program":"","language":"","log":{"message
				":"Your string here..."},"msg":"","time":"2017-09-13T07:39:22.109Z","v":0}{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":46852,"level":20,"application":"","program":"","language":"","log":{"message
				":"Successfully connected"},"tag":"myTagA","msg":"","time":"2017-09-13T07:39:22.110Z","v":0}{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":46852,"level":20,"application":"","program":"","language":"","log":{"type":"
				AUDIT","habitable":{"planets":["mars","earth"]}},"tag":"myTagB","msg":"","time":"2017-09-13T07:39:22.110Z","v":0}
				If we use logger.error({message: 'Your message', name: 'error name', stack: 'some stack....'});
				It will override the bunyan name property, so such usage is discouraged. See below output for such behavior, name property is discovery instead of sp-json-logger
				{"name":"discovery","hostname":"Yogeshs-MacBook-Air.local","pid":46852,"level":50,"application":"","program":"","language":"","message":"the earth is round :p","msg":"","time":"2017-09-13T07:39:22.114Z","v":0}

				Using correct format below logger.error({err: object}), thus name isn't overriden{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":46852,"level":50,"application":"","program":"","language":"","err":{"message
				":"the earth is round :p","name":"discovery","stack":"Some stack here....."},"msg":"the earth is round :p","time":"2017-09-13T07:39:22.115Z","v":0
				}
				```
		* `NODE_ENV=local node test/test.1.js`

				```
				[2017-09-13T07:40:26.355Z]  INFO: sp-json-logger/46861 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

					--
					log: {
					"message": "hi"
					}
				[2017-09-13T07:40:26.359Z] DEBUG: sp-json-logger/46861 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

					--
					log: {
					"message": "Your string here..."
					}
				[2017-09-13T07:40:26.360Z] DEBUG: sp-json-logger/46861 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=myTagA)

					--
					log: {
					"message": "Successfully connected"
					}
				[2017-09-13T07:40:26.361Z] DEBUG: sp-json-logger/46861 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=myTagB)

					--
					log: {
					"type": "AUDIT",
					"habitable": {
						"planets": [
						"mars",
						"earth"
						]
					}
					}


				If we use logger.error({message: 'Your message', name: 'error name', stack: 'some stack....'});
				It will override the bunyan name property, so such usage is discouraged. See below output for such behavior, name property is discovery instead of sp-json-logger
				[2017-09-13T07:40:26.367Z] ERROR: discovery/46861 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", message="the earth is round :p")



				Using correct format below logger.error({err: object}), thus name isn't overriden
				[2017-09-13T07:40:26.368Z] ERROR: sp-json-logger/46861 on Yogeshs-MacBook-Air.local: the earth is round :p (application="", program="", language="")
					Some stack here.....
				```
