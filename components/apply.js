var flatten = require('flat');
var _ = require('lodash')
var xtend = require('xtend');
var unflatten = require('flat').unflatten;
var nestedVal = require('./utilities/nestedVal')

module.exports = function apply (obj, transformSource, transformTarget) {
  var newObj = {};
  var transfers = [];

  if (_.isString(transformTarget)) {
    var path = (transformTarget.match(/^\$(.+)/) || [])[1]
    return nestedVal(obj, path)
  }

  for (var tKey in transformTarget) {
    if (_.isString(transformTarget[tKey])) {
      var path = (transformTarget[tKey].match(/^\$(.+)/) || [])[1]
      if (tKey == '$$') {
          if (path) {
            var extendObj = nestedVal(obj, path)
            for (var extendKey in extendObj) {
              newObj[extendKey] = extendObj[extendKey];
            }
          } else if (path === '$' && transformSource[extendKey] == null) {
            for (var extendKey in obj) {
              newObj[extendKey] = obj[extendKey];
            }
          } else {
          }
      } else {
        if (transformTarget[tKey] === '$$') {

          newObj[tKey] = obj[tKey];
        } else if (path) {
          newObj[tKey] = nestedVal(obj, path);
        } else if (transformSource[tKey] == '$$' || transformSource[tKey] == null) {
          newObj[tKey] = transformTarget[tKey];
        } else if (obj[tKey].match(transformSource[tKey])) {
          newObj[tKey] = transformTarget[tKey];
        }
      }
    } else if (_.isArray(transformTarget[tKey])) {
      if (transformTarget[tKey].length === 1) { //TODO: Make this extensible to multiple cases.
        var extendObj = {};
        if (transformTarget[tKey][0] == '$$') {
          for (var extendKey in obj) {
            if (transformSource[extendKey] == null) {
              extendObj[extendKey] = obj[extendKey]
            }
          }
        }
        newObj[tKey] = [extendObj]
      }
    } else if (_.isObject(transformTarget[tKey])) {
      for (var key in transformTarget[tKey]) {
        newObj[tKey] = apply(obj, transformSource, transformTarget[tKey])
      }
    }
  }

  for (var extendKey in obj) {
    if (transformSource[extendKey] == null && transformSource['$$'] == null) {
      newObj[extendKey] = obj[extendKey];
    }

  }

  return newObj
}