v2.1.3
- This release brings a set of new minor feature patches as given below
    - You can log an error string using the syntax: `logger.error('some error');`
    - If you want to enable pretty print, then use the new env variable: `SP_PRETTY_PRINT=true` instead of earlier `NODE_ENV=local`.
    - If you want to disable all the logs from `sp-json-logger`, then use the env variable `SP_DISABLE_LOGS=true`.

v2.1.2
- Intelligent error object detection. If we pass custom object inside error log, it will be encapsulated into `log` object or whichever object name is set using `setParentObjectName()`.
But if we are passing an error object instance, it will be encapsulated inside `err` object.

v2.1.1
- Error logging output changed. Previously any property logged other than `err` was at the same level as the `err` object.
Now it has been changed to be wrapped inside a parentObject (log by default).
    
v2.1.0
- Pass config object while instantiating logger object.
- Currently config object only suports `fileName` property.

v2.0.1
- Fix for error object not printing stack trace

v2.0


- New syntax for making life of developer easier.
- Now do `logger.debug('hello world)` for single string logging. Replaces older syntax `logger.debug({log: { message: 'hello world' }});`.
- For error logging, do `logger.error(error)`. Older syntax: `logger.error({err: error});` is deprecated.
- New function `parse(boolean)` added to log regex. It will scan for regex object in your JSON log and stringify it so that it can be logged properly. This operation is heavy on cpu so use alternative method like `replacer function in JSON.stringify()` to convert `regex object` to `string`.
- New function `setParentObjectName('string')` added to set parent log object name. By default it is set to `log`.
- New function `filter({ objectToFilter: ['key1', 'key2'] });` added. You can now filter (cherry pick) properties of an object to log.