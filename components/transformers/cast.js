var _ = require('lodash')
var xtend = require('filter-xtend');
var nestedVal = require('../utilities/nestedVal')

module.exports = function makeTransformer (cast) {
  return function transform(obj) {
    return _apply(obj, cast.from, cast.to)
  }
}

function _apply (source, transformSource, transformTarget) {
  var target = {};
  var transfers = [];

  if (_.isString(transformTarget)) {
    var path = (transformTarget.match(/^\$(.+)/) || [])[1]
    return nestedVal(source, path)
  }

  for (var tKey in transformTarget) {
    if (_.isString(transformTarget[tKey])) {
      var path = (transformTarget[tKey].match(/^\$(.+)/) || [])[1]
      if (tKey == '$$') {
        if (path) {
          if (path === '$') {
            target = xtend(target, source)
          } else {
            target = xtend(target, nestedVal(source, path))
          }
        } 
      } else {
        if (path) {
          if (path === '$') {
            target[tKey] = source[tKey];
          } else {
            target[tKey] = nestedVal(source, path);
          }
        } else {
          if (transformSource[tKey] == '$$' || transformSource[tKey] == null) {
            target[tKey] = transformTarget[tKey];
          } else if (source[tKey].match(transformSource[tKey])) {
            target[tKey] = transformTarget[tKey];
          }
        }
      }
    } else if (_.isArray(transformTarget[tKey])) {
      //TODO: Rewrite to support extensible arrays.
      if (transformTarget[tKey].length === 1) { 
        if (transformTarget[tKey][0] == '$$') {
          var extension = xtend({}, source, function (target, source, key, index) {
            return index === 0 || transformSource[key] == null
          })
          target[tKey] = [extension]
        } else if (_.isString(transformTarget[tKey][0])) {
          var path = (transformTarget[tKey][0].match(/^\$(.+)/) || [])[1]
          if (path) {
            target[tKey] = [nestedVal(source, path)]
          }
        }
      }
    } else if (_.isObject(transformTarget[tKey])) {
      for (var key in transformTarget[tKey]) {
        target[tKey] = _apply(source, transformSource, transformTarget[tKey])
      }
    } else {
      //TODO: Support non-string values.
    }
  }

  if (transformSource['$$'] == null) {
    target = xtend(target, source, function (target, source, key, index) {
      return index === 0 || (transformSource[key] == null)
    })
  }

  return target
}
