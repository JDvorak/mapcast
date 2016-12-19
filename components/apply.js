var flatten = require('flat');
var _ = require('lodash')
var xtend = require('filter-xtend');
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
            newObj = xtend(newObj, nestedVal(obj, path))
          } else if (path === '$') {
            newObj = xtend(newObj, obj)
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
      if (transformTarget[tKey].length === 1) { //TODO: Make this extensible to any length array.
        if (transformTarget[tKey][0] == '$$') {
          var extendObj = xtend({}, obj, function (target, source, key, index) {
            return index === 0 || transformSource[key] == null
          })
          newObj[tKey] = [extendObj]
        } else if (_.isString(transformTarget[tKey][0])) {
          var path = (transformTarget[tKey][0].match(/^\$(.+)/) || [])[1]
          if (path) {
            newObj[tKey] = [nestedVal(obj, path)]
          }
        }
      }
    } else if (_.isObject(transformTarget[tKey])) {
      for (var key in transformTarget[tKey]) {
        newObj[tKey] = apply(obj, transformSource, transformTarget[tKey])
      }
    }
  }

  newObj = xtend(newObj, obj, function (target, source, key, index) {
    return index === 0 || (transformSource[key] == null && transformSource['$$'] == null)
  })

  return newObj
}