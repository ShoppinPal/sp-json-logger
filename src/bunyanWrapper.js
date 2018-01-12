/*
    Wrapper implementation 
*/
var bunyan = require('bunyan');
const cloneDeep = require('clone-deep');
const constants = require('./utils/constants.js');
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

  this.parentObject = 'log';
  this.filterObject = {};
  this.application = process.env.APPLICATION ? process.env.APPLICATION : '';
  this.program = process.env.PROGRAM ? process.env.PROGRAM : '';
  this.language = process.env.LANGUAGE ? process.env.LANGUAGE : '';
  this.tagLabel = null;
  this.shouldParse = false;
  this.shouldFilter = false;

  this.tag = function (label) {
    this.tagLabel = label;
    return this;
  }

  this.setParentObjectName = function (name) {
    this.parentObject = name ? name: 'log';
  }

  this.parse = function (_shouldParse) {
    this.shouldParse = _shouldParse;
    return this;
  }

  /**
   * @param
   * objectArrays - Data structure with object as `array key` and properties to filter as `array values`
   */
  this.filter = function (_filterObject) {
    this.shouldFilter = true;
    this.filterObject =  _filterObject;
    return this;
  }

  // Wrapper method for debug
  this.info = function (payload) {
    var log = this.generateLogJSON(payload, constants.STATE_INFO);
    this.bunyanLogger.info(log);
    this.resetObjects();
  }

  // Wrapper method for trace
  this.trace = function (payload) {
    var log = this.generateLogJSON(payload, constants.STATE_TRACE);
    this.bunyanLogger.trace(log);
    this.resetObjects();
  }

  // Wrapper method for debug
  this.debug = function (payload) {
    var log = this.generateLogJSON(payload, constants.STATE_DEBUG);
    this.bunyanLogger.debug(log);
    this.resetObjects();
  }

  // Wrapper method for error
  this.error = function (payload) {
    var err = this.generateLogJSON(payload, constants.STATE_ERROR);
    this.bunyanLogger.error(err);
    this.resetObjects();
  }

  this.warn = function (payload) {
    var log = this.generateLogJSON(payload, constants.STATE_WARN);
    this.bunyanLogger.warn(log);
    this.resetObjects();
  }

  // Wrapper method for fatal
  this.fatal = function (payload) {
    var log = this.generateLogJSON(payload, constants.STATE_FATAL);
    this.bunyanLogger.fatal(log);
    this.resetObjects();
  }

  // This method appends program and language properties and also a tag if it is specified 
  this.generateLogJSON = function (_payload, state) {
    if(_payload === null)
      return {};
    var payload = _payload;

    if(this.shouldFilter) {
      payload = cloneDeep(_payload);
      filterObjects(this.filterObject, payload);
    }

    if(this.shouldParse) {
      payload = cloneDeep(_payload);
      expandProperty(payload);
    }
    
    var log = {};
    if (typeof payload === 'string') {
      log = Object.assign({}, { application: this.application, program: this.program, language: this.language },
        {
          [state === constants.STATE_ERROR ? 'err' : this.parentObject]: { message: payload }
        });
    } else if (typeof payload === 'object') {
      if (state === constants.STATE_ERROR) {
        var errorObject = payload.err || payload.error;
        if (errorObject) {
          delete payload.err;
          delete payload.error;
        }
        else {
          errorObject = payload;
        }
        log = Object.assign({}, { application: this.application, program: this.program, language: this.language }, { err: errorObject }, payload);
      }
      else {
        log = Object.assign({}, { application: this.application, program: this.program, language: this.language }, { [this.parentObject]: payload });
      }

    }

    if(this.tagLabel)
      log.tag = this.tagLabel;

    return log;
  }

  this.resetObjects = function () {
    this.tagLabel = ''; 
    this.shouldParse = false;
    this.shouldFilter = false;
    this.filterObject = {};
    this.state = constants.STATE_DEFAULT;
  }
}

// Iterate through properties and check if it is a regex!
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

function filterObjects (filterObject, payload) {
  Object.keys(filterObject).forEach(function (object) {
    // values inside filterKeys are to be kept and remaining keys needs to be removed from payload object
    var filterKeys = filterObject[object]; 
    Object.keys(payload[object]).forEach(function(key) {
      if (filterKeys.indexOf(key) < 0) {
        delete payload[object][key];
      }
    });
  });
}

module.exports = new Logger;