var _ = require('lodash')
var xtend = require('xtend');
var nestedVal = require('./components/utilities/nestedVal')
var match = require('./components/match')
var apply = require('./components/apply')

function mapcast (obj, cast) {
  if (_.isArray(cast)) {
    return cast.reduce(function(obj, cast) {
      return mapcast(obj, cast)
    }, obj)
  }

  var updateObj = {}
  recurse(obj, [])

  function recurse (subObj, keys) {
    var subKey = keys.join('.');
    if (_.isObject(subObj)) {
      subObj = nestedVal(obj, keys) || {}

      if (match(subObj, cast)) {
        subObj = apply(subObj, cast.from, cast.to)
        if (!subKey) {
          updateObj = subObj
        } else {
          nestedVal(updateObj, subKey, subObj)
        }
      } 

      for (var key in subObj) {
        recurse(subObj[key], keys.concat([key]))
      }

    } else if (_.isArray(subObj)) {
        obj.forEach((subObj, index) => {recurse(subObj, keys.concat([index]))})
    }
  }

  return updateObj
}

function reverse(obj, cast) {
  //TBD
}


module.exports = mapcast