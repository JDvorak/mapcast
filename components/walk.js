var _ = require('lodash')
var nestedVal = require('./utilities/nestedVal')

module.exports = function makeWalker (match, transform) {
  return function walk (obj) {
      var newObj;
      _walk(obj, [], obj);

      function _walk (subObj, path, obj) {
        if (_.isObject(subObj)) {
          subObj = nestedVal(obj, path) || {}
          if (match(subObj, path, obj)) {
            var partialObj = transform(subObj, path, obj)
            //TODO: Simplify
            if (!newObj) {
              newObj = partialObj
            } else {
              nestedVal(newObj, path, partialObj)
            }

          }
          for (var key in subObj) {
            _walk(subObj[key], path.concat([key]), obj)
          }
        } else if (_.isArray(subObj)) {
          subObj.forEach((subObj, index) => {_walk(subObj, path.concat([index]), obj)})
        }      
      }

      return newObj
  }
}