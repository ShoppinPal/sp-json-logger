


sp-json-logger is **a simple and fast JSON logging library** for node.js services. It is a wrapper module which adds more functionality and conventions to the bunyan logger.
Readme for [version 1.0.9 ](https://github.com/ShoppinPal/sp-json-logger/blob/develop/Readme-1.0.9.md)
# Installation

```sh
npm install sp-json-logger
```

```js
var log = require('sp-json-logger')(); // without passing config object
var log = require('sp-json-logger')({fileName: __filename}); // passing config object
log.info('hi');
```
**Important:** It is important to have **NAME**, **APPLICATION**, **PROGRAM** and **LANGUAGE** env variables set up before requiring the module!

# Conventions followed while logging:

You need to set the following environment variables for logger to work without our logger module throwing errors ( We can change this behavior if we want, but it will help us create a habit to specify env variables which can be used to identify our application in multi app environment where we have multiple modules split up into different microservices each having its own language and platform)

- **NAME:** 'Name of the logger' else will default to 'sp-json-logger'
- **APPLICATION:** 'Name of applicaton'
- **PROGRAM:** 'Name of module' // eg: scheduler-worker or scheduler-api
- **LANGUAGE:** 'Programming language used' // eg: javascript/php/go
- **NODE_ENV:** 'environment' // note: Pretty print is supported on local environment setting, if using staging or production, you won’t get pretty json output to console.
- **SP_DISABLE_LOGS:** Use this env variable as `SP_DISABLE_LOGS=true` to disable all logs from `sp-json-logger`.
- ***SP_PRETTY_PRINT:*** Set its value as `SP_PRETTY_PRINT=true` to enable pretty print of json.

If logging only string message, use the following format:

`logger.debug({message: 'Your string here...'});` or `logger.debug('Your string here...');`

Also use `logger.tag('CONNECTION').debug({ message: 'Successfully connected' });`
If logging a JSON Object, use following format:
```js
logger.tag('AUDIT').debug({
	type: 'TYPE of LOG',  // eg: AUDIT Created
	objectName: objectValue,
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

- Specify name of the logger in the NAME env variable to be meaningful.
- Use tags wherever applicable i.e `logger.tag(‘TAG’).error(err);`
- Order version required you to log by explcitly stating parent object name i.e **log** as per following example:


```js
// Older version (1.0.9)
logger.debug({log: {message: 'hello world'}});
// Newer version
logger.debug('hello world');
logger.debug({message: 'hello world'});
logger.error('hello world');
logger.error({message: 'hello world'});
```
- You can set parent object name by utilizing the method `setParentObjectName('String')` explained below.
- As far as possible use `logger.tag('TAG');` field to describe the event for which we are logging.
- If you just need to log a string, you can create it as follows: 

	`logger.debug('your string');`
- To enable pretty print, use the environment variable `SP_PRETTY_PRINT=true`.

# Local environment vs Staging/Production environment:

It was observed that printing json through bunyan was not readable for developers. In short it did not have pretty print functionality built in. 
We solved this problem by using the following module: https://github.com/WoLfulus/bunyans
Above module provided a new output stream that pretty prints json object to console.

So during local environment, we can enjoy pretty print. During staging and production, we get normal json output which helps us to reduce the impact of performance for pretty printing.

Important: Pretty print stream is a huge performance overhead, so it is recommended to use it only for local/development environment (if you ever want to modify bunyanLogger.js file inside sp-json-logger module)
# Testing:

* To test without publishing, go to the `PROJECT_ROOT` directory and run `npm link`. Sample output:

	```
	$ npm link
	~/.nvm/versions/v7.10.0/lib/node_modules/sp-json-logger -> ~/path/to/<PROJECT_ROOT>
	```
* First start logstash and elasticsearch instances
	* Run the command from root directory: `docker-compose up`
	* Once logstash, elasticsearch and kibana instances are up and running, build the docker image for tests: 
	
		`docker build ./ --tag tests`
	* Figure out the default network running the ELK stack:

		```
		$ docker network ls
		NETWORK ID          NAME                    DRIVER              SCOPE
		009031fa9b3f        spjsonlogger_default    bridge              local
		```
	* Attach and run the tests on that network: 
	
		`docker run --network=spjsonlogger_default tests`
	* View test results on kibana: `http://localhost:5601`
        * You must run the tests first before coming here if you want to see meaningful data
		* `Time Filter field name` should be set to `time`
		* Jump to the `Discover` tab on top left and you should see the logs generated by the tests run.

* (Another way) Now you can create and run tests:
	* `node test/test.local.1.js`

		```
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":30,"application":"","program":"","language":"","log":{"messag
		e":"hi"},"fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.923Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","log":{"message":"Your string here..."},"fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.928Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","log":{"message":"Successfully connected"},"tag":"myTagA","fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.931Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","log":{"type":
		"AUDIT","habitable":{"planets":["mars","earth"]}},"tag":"myTagB","fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","
		msg":"","time":"2018-03-28T18:22:45.932Z","v":0}

		Regex with JSON.stingify(object, replacer)

		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","log":{"query"
		:"{\"sku\":\"/^BA1262$/i\"}"},"tag":"Regex","fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.942Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","log":{"query":"{\"query\":[{\"sku\":\"/^BA1262$/i\"},{\"sku\":\"/^BRAT$/i\"}]}"},"tag":"RegExArray","fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.942Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","log":{"sku":"/^BA1262$/"},"tag":"parse(boolean)","fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.944Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","log":{"query":[{"sku":"/^BA1262$/"},{"sku":"/^BRAT$/"}]},"tag":"RegExArray parse(boolean)","fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.945Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":50,"application":"","program":"","language":"","err":{"message":"the earth is flat","name":"Error","stack":"Error: the earth is flat\n    at Object.<anonymous> (/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js:34:13)\n    at Module._compile (module.js:570:32)\n    at Object.Module._extensions..js (module.js:579:10)\n    at Module.load (module.js:487:32)\n    at tryModuleLoad (module.js:446:12)\n    at Function.Module._load (module.js:438:3)\n    at Module.runMain (module.js:604:10)\n    at run (bootstrap_node.js:389:7)\n    at startup (bootstrap_node.js:149:9)\n    at bootstrap_node.js:504:3"},"log":{},"fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"the earth is flat","time":"2018-03-28T18:22:45.946Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":50,"application":"","program":"","language":"","err":{"message":"the earth is round :p","name":"discovery","stack":"Some stack here....."},"log":{"message":"the earth is round :p","name":"discovery"},"fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"the earth is round :p","time":"2018-03-28T18:22:45.947Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":30,"application":"","program":"","language":"","dump":{"message":"Hi...."},"tag":"ParentObject name changed","fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.947Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","dump":{"arg":"some arg"},"fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.948Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","dump":{"demo":{"text":"hello world"},"someObj":{"p":"content.."}},"fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.948Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":20,"application":"","program":"","language":"","dump":{"demo":{"number":0,"obj":{"a":"a","b":"b"}}},"fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-03-28T18:22:45.949Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":50,"application":"","program":"","language":"","err":{"message":"the earth is round :p","name":"discovery","stack":"Some stack here....."},"dump":{"message":"Some error"},"tag":"hello error","fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"the earth is round :p","time":"2018-03-28T18:22:45.949Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":29062,"level":50,"application":"","program":"","language":"","err":{"message":"the earth is round :p","name":"discovery","stack":"Some stack here....."},"log":{"message":"My custom error message","functionName":"hello()"
		},"fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"the earth is round :p","time":"2018-03-28T18:22:45.949Z","v":0}
		{"name":"sp-json-logger","hostname":"3076905ec882","pid":5,"level":50,"application":"tests","program":"sp-json-logger","language":"javascript","log":{"message":"My custom error message","functionName":"error()"},"tag":"Not-Error-Instance","fileName":"/app/test/test.1.js","msg":"","time":"2018-03-29T09:54:30.393Z","v":0}
		{"name":"sp-json-logger","hostname":"Yogeshs-MacBook-Air.local","pid":95722,"level":50,"application":"","program":"","language":"","log":{"message":"hello error"},"tag":"Not-Error-Instance","fileName":"/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js","msg":"","time":"2018-04-29T11:53:51.606Z","v":0}
		```
	* `SP_PRETTY_PRINT=true node test/test.local.1.js`

		```
		[2018-03-28T18:34:43.503Z]  INFO: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

		--
		log: {
		"message": "hi"
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.511Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

		--
		log: {
		"message": "Your string here..."
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.513Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=myTagA)

		--
		log: {
		"message": "Successfully connected"
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.514Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=myTagB)

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
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js

		Regex with JSON.stingify(object, replacer)

		[2018-03-28T18:34:43.522Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=Regex)

		--
		log: {
		"query": "{\"sku\":\"/^BA1262$/i\"}"
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.523Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=RegExArray)

		--
		log: {
		"query": "{\"query\":[{\"sku\":\"/^BA1262$/i\"},{\"sku\":\"/^BRAT$/i\"}]}"
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.525Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=parse(boolean))

		--
		log: {
		"sku": "/^BA1262$/"
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.525Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag="RegExArray parse(boolean)")

		--
		log: {
		"query": [
			{
			"sku": "/^BA1262$/"
			},
			{
			"sku": "/^BRAT$/"
			}
		]
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.528Z] ERROR: sp-json-logger/29239 on Yogeshs-MacBook-Air.local: the earth is flat (application="", program="", language="",log={})
		Error: the earth is flat
			at Object.<anonymous> (/Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js:34:13)
			at Module._compile (module.js:570:32)
			at Object.Module._extensions..js (module.js:579:10)
			at Module.load (module.js:487:32)
			at tryModuleLoad (module.js:446:12)
			at Function.Module._load (module.js:438:3)
			at Module.runMain (module.js:604:10)
			at run (bootstrap_node.js:389:7)
			at startup (bootstrap_node.js:149:9)
			at bootstrap_node.js:504:3
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.529Z] ERROR: sp-json-logger/29239 on Yogeshs-MacBook-Air.local: the earth is round :p (application="", program="", language="")
		Some stack here.....
		--
		log: {
		"message": "the earth is round :p",
		"name": "discovery"
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.530Z]  INFO: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag="ParentObject name changed")

		--
		dump: {
		"message": "Hi...."
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.530Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

		--
		dump: {
		"arg": "some arg"
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.531Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

		--
		dump: {
		"demo": {
			"text": "hello world"
		},
		"someObj": {
			"p": "content.."
		}
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.532Z] DEBUG: sp-json-logger/29239 on Yogeshs-MacBook-Air.local:  (application="", program="", language="")

		--
		dump: {
		"demo": {
			"number": 0,
			"obj": {
			"a": "a",
			"b": "b"
			}
		}
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.539Z] ERROR: sp-json-logger/29239 on Yogeshs-MacBook-Air.local: the earth is round :p (application="", program="", language="", tag="hello error")
		Some stack here.....
		--
		dump: {
		"message": "Some error"
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-28T18:34:43.540Z] ERROR: sp-json-logger/29239 on Yogeshs-MacBook-Air.local: the earth is round :p (application="", program="", language="")
		Some stack here.....
		--
		log: {
		"message": "My custom error message",
		"functionName": "hello()"
		}
		--
		fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-03-29T09:58:27.409Z] ERROR: sp-json-logger/35398 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=Not-Error-Instance)
    	--
    	log: {
      	"message": "My custom error message",
      	"functionName": "hello()"
    	}
    	--
    	fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		[2018-04-29T11:53:00.841Z] ERROR: sp-json-logger/95687 on Yogeshs-MacBook-Air.local:  (application="", program="", language="", tag=Not-Error-Instance)
    	--
    	log: {
      	"message": "hello error"
    	}
    	--
    	fileName: /Users/yogeshjadhav/Documents/sp-json-logger/test/test.local.1.js
		```
# setParentObjectName('String')

If we are not setting the parent object name, it defaults to `log`. But if we use `setParentObjectName('dump')` then the parent object name will become `dump`.

Eg: Without `setParentObjectName('String')`

```
logger.info('hello world');
```
It will output log as : 

`{..., {log: {message: 'hello world'},... }`

Eg: With `setParentObjectName('String')`

```
logger.setParentObjectName('dump');
logger.info('hello world with dump');

# Again calling setParentObjectName('String')
logger.setParentObjectName('payload');
logger.info('hello world with payload');
```
It will output log as : 
```
{..., {dump: {message: 'hello world with dump'},... }
{..., {payload: {message: 'hello world with payload'},... }
```
# Filtering objects while logging

To filter objects, you can use `filter({object: ['key1', 'key2']})` function.

Syntax: 

	`logger.filter({someObject: ['key1', 'key2']}).debug({someObject: object});` 

Here `someObject` is the object whose key needs to be filtered. The value for `someObject` is the array of keys which we want to keep in it during logging.

So `someObject` acts as an alias to `object` that will be filtered in the debug function. Example is given below.

Ensure a syntax requirement for filter to work in the example below. In the `debug()` function we need to pass our payload as a property of object.

	Eg: `debug({someObject: object});`

Notice the `{someObject: object}`. Here we need to define `someObject` key as the object name that we pass to the filter function.

```
// object to filter `demo`
var demo = {text: 'hello world', number: 0000, obj: {a: 'a'} };
// (1)
logger.filter({demo: ['text']}).debug({demo, someObj: 'content..'});
// (2)
logger.filter({demo: ['number', 'obj']}).debug({demo});
```

This will result in the following output:

```
// (1)
log:{
	"demo": {
        "text": "hello world"
      },
      "someObj": "content.."
    }
// (2)
log:{
      "demo": {
        "number": 0,
        "obj": {
          "a": "a"
        }
      }
    }
```
# Parsing Objects containing RegEx

- If your logs contain special objects like regex, create a replacer function for 

	`JSON.stringify(object, replacer)` as follows:
```
	// Replacer function for JSON.stringify() method
	function replacer(key, value) {
		if(value instanceof RegExp){
			return value.toString();
		}
		return value;
	}
```
	Then use this function to stringify object containing regex as below:

```
	var query = { sku: /^BA1262$/i };
	logger.tag('Regex').debug({ query: JSON.stringify(query, replacer) });  // use the utility method replacer!

	// Checking passing regex with array
	var query2 = { query: [{ sku: /^BA1262$/i }, {sku: /^BRAT$/i}] } ;
	logger.tag('RegExArray').debug({ query: JSON.stringify(query2, replacer) });

```
- You can also use `parse(boolean)` method for parsing an object containing regex, but it is processing heavy and use it only when you really need to or when you cannot use above method for logging regex!

- Logging object parse(boolean)

	```
	var query3 = { sku: /^BA1262$/i };`
	logger.parse(true).tag('parse(boolean)').debug(query3);
	```

- Logging regex array with parse(boolean)
	```
	var query4 = { query: [{ sku: /^BA1262$/i }, {sku: /^BRAT$/i}] };
	logger.parse(true).tag('RegExArray parse(boolean)').debug(query4);
	```

