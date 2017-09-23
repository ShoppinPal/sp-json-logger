/*
    Wrapper implementation 
*/
var bunyan = require('bunyan');
var env = process.env.NODE_ENV;
var PrettyStream = require('./utils/bunyan-pretty-stream/lib/prettystream');

var prettyStdOut = null;
if (env === 'local') {
  prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);
}

function Logger(config) {

  this.bunyanLogger = bunyan.createLogger({
      name: process.env.NAME ? process.env.NAME : 'sp-json-logger',
      serializers: bunyan.stdSerializers,
      streams: [    
        {
          level: 'trace',
          stream: prettyStdOut  || process.stdout
        }
      ]
    });

  this.application = process.env.APPLICATION ? process.env.APPLICATION : '';
  this.program = process.env.PROGRAM ? process.env.PROGRAM : '';
  this.language = process.env.LANGUAGE ? process.env.LANGUAGE : '';
  this.tagLabel = null;
  this.shouldParse = false;

  this.tag = function (label) {
    this.tagLabel = label;
    return this;
  }

  this.parse = function (_shouldParse) {
    this.shouldParse = _shouldParse;
    return this;
  }

  // Wrapper method for debug
  this.info = function (payload) {
    var log = this.generateLogJSON(payload);
    this.bunyanLogger.info(log);
    this.resetObjects();
  }

  // Wrapper method for trace
  this.trace = function (payload) {
    var log = this.generateLogJSON(payload);
    this.bunyanLogger.trace(log);
    this.resetObjects();
  }

  // Wrapper method for debug
  this.debug = function (payload) {
    var log = this.generateLogJSON(payload);
    this.bunyanLogger.debug(log);
    this.resetObjects();
  }

  // Wrapper method for error
  this.error = function (payload) {
    var err = this.generateLogJSON(payload);
    this.bunyanLogger.error(err);
    this.resetObjects();
  }

  this.warn = function (payload) {
    var log = this.generateLogJSON(payload);
    this.bunyanLogger.warn(log);
    this.resetObjects();
  }

  // Wrapper method for fatal
  this.fatal = function (payload) {
    var log = this.generateLogJSON(payload);
    this.bunyanLogger.fatal(log);
    this.resetObjects();
  }

  // This method appends program and language properties and also a tag if it is specified 
  this.generateLogJSON = function (payload) {
    
    if(this.shouldParse)
      expandProperty(payload);
    var log = Object.assign({}, { application: this.application, program: this.program, language: this.language }, payload);

    if(this.tagLabel)
      log.tag = this.tagLabel;

    return log;
  }

  this.resetObjects = function () {
    this.tagLabel = ''; 
    this.shouldParse = false;
  }
}

// Iterate through properties and check if its a regex!
function expandProperty(object) {

  for(var key in object) {
    if(object.hasOwnProperty(key)) {
      if(object[key] instanceof RegExp) {
        object[key] = object[key].toString();
      }else if(typeof object[key] === 'object') {
          expandProperty(object[key]);
      }else if(typeof object[key] === Array) {
        for(var i=0; i < object[key].length; i++) {
          expandProperty(object[key][i]);
        }
      }
    }
  }
}

module.exports = new Logger;