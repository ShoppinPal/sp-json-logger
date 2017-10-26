
(Still under development) sp-json-logger is **a simple and fast JSON logging library** for node.js services. It is a wrapper module which adds more functionality and conventions to the bunyan logger.

# Installation

```sh
npm install sp-json-logger
```

```js
var log = require('sp-json-logger');
log.info({log: { message: "hi"}});
```
**Important:** It is important to have **NAME**, **APPLICATION**, **PROGRAM** and **LANGUAGE** env variables set up before requiring the module!

# Conventions followed while logging:

You need to set the following environment variables for logger to work without our logger module throwing errors ( We can change this behavior if we want, but it will help us create a habit to specify env variables which can be used to identify our application in multi app environment where we have multiple modules split up into different microservices each having its own language and platform)

- **NAME:** 'Name of the logger' else will default to 'sp-json-logger'
- **APPLICATION:** 'Name of applicaton'
- **PROGRAM:** 'Name of module' // eg: scheduler-worker or scheduler-api
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

@TODO: Awaiting Harshad's approval for the Elasticsearch - Logstash - Kibana config! It is working as expected, using http driver to push logs to logstash. Created a custom stream for sp-json-logger (test/utils/logstashStream.js) for handling data transfer between logger and logstash!

* To test without publishing, go to the `PROJECT_ROOT` directory and run `npm link`. Sample output:

	```
	$ npm link
	~/.nvm/versions/v7.10.0/lib/node_modules/sp-json-logger -> ~/path/to/<PROJECT_ROOT>
	```
* First start logstash and elasticsearch instances
	* Run the command from root directory: `docker-compose up`
	* Once logstash, elasticsearch and kibana instances are up and running, build the docker image for tests: `docker build ./ --tag tests`
	* Figure out the default network running the ELK stack:

		```
		$ docker network ls
		NETWORK ID          NAME                    DRIVER              SCOPE
		009031fa9b3f        spjsonlogger_default    bridge              local
		```
	* Attach and run the tests on that network: `docker run --network=spjsonlogger_default tests`
	* View test results on kibana: `http://localhost:5601`
        * You must run the tests first before coming here if you want to see meaningful data
		* `Time Filter field name` should be set to `time`
		* Jump to the `Discover` tab on top left and you should see the logs generated by the tests run.

* (Another way) Now you can create and run tests:
	* `node test/test.local.1.js`

		```
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":30,"application":"","program":"","language":"","log":{"message":"hi"},"msg":"","time":"2017-10-26T15:34:12.391Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":20,"application":"","program":"","language":"","log":{"message":"Your string here..."},"msg":"","time":"2017-10-26T15:34:12.394Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":20,"application":"","program":"","language":"","log":{"message":"Successfully connected"},"tag":"myTagA","msg":"","time":"2017-10-26T15:34:12.396Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":20,"application":"","program":"","language":"","log":{"type":"AUDIT","habitable":{"planets":["mars","earth"]}},"tag":"myTagB","msg":"","time":"2017-10-26T15:34:12.396Z","v":0}

		Regex with JSON.stingify(object, replacer)

		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":20,"application":"","program":"","language":"","log":{"query":"{\"sku\":\"/^BA1262$/i\"}"},"tag":"Regex","msg":"","time":"2017-10-26T15:34:12.402Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":20,"application":"","program":"","language":"","log":{"query":"{\"query\":[{\"sku\":\"/^BA1262$/i\"},{\"sku\":\"/^BRAT$/i\"}]}"},"tag":"RegExArray","msg":"","time":"2017-10-26T15:34:12.402Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":50,"application":"","program":"","language":"","err":{"message":"the earth is flat","name":"Error","stack":"Error: the earth is flat\n    at Object.<anonymous> (/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js:25:13)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.runMain (module.js:604:10)\n    at run (bootstrap_node.js:389:7)\n    at startup (bootstrap_node.js:149:9)\n    at bootstrap_node.js:504:3"},"msg":"the earth is flat","time":"2017-10-26T15:34:12.404Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":50,"application":"","program":"","language":"","err":{"message":"the earth is round :p","name":"discovery","stack":"Some stack here....."},"msg":"the earth is round :p","time":"2017-10-26T15:34:12.404Z","v":0}


		Using correct format below logger.error({err: object}), thus name isn't overriden
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":30,"application":"","program":"","language":"","dump":{"message":"Hi...."},"tag":"ParentObject name changed","msg":"","time":"2017-10-26T15:34:12.404Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":48412,"level":20,"application":"","program":"","language":"","dump":{"arg":"some arg"},"msg":"","time":"2017-10-26T15:34:12.405Z","v":0}
		```
	* `NODE_ENV=local node test/test.local.1.js`

		```
		[2017-10-26T15:39:04.448Z]  INFO: sp-json-logger/48472 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

			--
			log: {
			"message": "hi"
			}
		[2017-10-26T15:39:04.453Z] DEBUG: sp-json-logger/48472 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

			--
			log: {
			"message": "Your string here..."
			}
		[2017-10-26T15:39:04.454Z] DEBUG: sp-json-logger/48472 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=myTagA)

			--
			log: {
			"message": "Successfully connected"
			}
		[2017-10-26T15:39:04.455Z] DEBUG: sp-json-logger/48472 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=myTagB)

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

		Regex with JSON.stingify(object, replacer)

		[2017-10-26T15:39:04.460Z] DEBUG: sp-json-logger/48472 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=Regex)

			--
			log: {
			"query": "{\"sku\":\"/^BA1262$/i\"}"
			}
		[2017-10-26T15:39:04.460Z] DEBUG: sp-json-logger/48472 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=RegExArray)

			--
			log: {
			"query": "{\"query\":[{\"sku\":\"/^BA1262$/i\"},{\"sku\":\"/^BRAT$/i\"}]}"
			}
		[2017-10-26T15:39:04.463Z] ERROR: sp-json-logger/48472 on Yogeshs-MacBook-Air.local: the earth is flat (application="", program="", language="")
			Error: the earth is flat
				at Object.<anonymous> (/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js:25:13)
				at Module._compile (module.js:570:32)
				at Object.Module._extensions..js (module.js:579:10)
				at Module.load (module.js:487:32)
				at tryModuleLoad (module.js:446:12)
				at Function.Module._load (module.js:438:3)
				at Module.runMain (module.js:604:10)
				at run (bootstrap_node.js:389:7)
				at startup (bootstrap_node.js:149:9)
				at bootstrap_node.js:504:3
		[2017-10-26T15:39:04.464Z] ERROR: sp-json-logger/48472 on Yogeshs-MacBook-Air.local: the earth is round :p (application="", program="", language="")
			Some stack here.....


		Using correct format below logger.error({err: object}), thus name isn't overriden
		[2017-10-26T15:39:04.465Z]  INFO: sp-json-logger/48472 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag="ParentObject name changed")

			--
			dump: {
			"message": "Hi...."
			}
		[2017-10-26T15:39:04.466Z] DEBUG: sp-json-logger/48472 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

			--
			dump: {
			"arg": "some arg"
			}
		```

# Parsing Objects containing RegEx

- If your logs contain special objects like regex, create a replacer function for `JSON.stringify(object, replacer)` as follows:
```
	// Replacer function for JSON.stringify() method
	function replacer(key, value) {
		if(value instanceof RegExp){
			return value.toString();
		}
		return value;
	}

	// Then use this function to stringify object containing regex as below:

	var query = { sku: /^BA1262$/i };
	logger.tag('Regex').debug({ query: JSON.stringify(query, replacer) });  // use the utility method replacer!

	// Checking passing regex with array
	var query2 = { query: [{ sku: /^BA1262$/i }, {sku: /^BRAT$/i}] } ;
	logger.tag('RegExArray').debug({ query: JSON.stringify(query2, replacer) });

```
- You can also use `parse(boolean)` method for parsing an object containing regex, but it is processing heavy and use it only when you really need to or when you cannot use above method for logging regex!
eg: `logger.tag('REGEX').parse(true).debug({log: {query: query}});`

Logging object parse(boolean)
`var query3 = { sku: /^BA1262$/i };`
`logger.parse(true).tag('parse(boolean)').debug(query3);`

Logging regex array with parse(boolean)
`var query4 = { query: [{ sku: /^BA1262$/i }, {sku: /^BRAT$/i}] };`
`logger.parse(true).tag('RegExArray parse(boolean)').debug(query4);`

