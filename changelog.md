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