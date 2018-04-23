var flatten = require('flat');
var _ = require('lodash')
var xtend = require('xtend');
var nestedVal = require('../utilities/nestedVal')
var minimatch = require('minimatch')

/*
 Match if all keys in a cast definition are present in the subobject and that the values match
*/
module.exports = function makeMatcher (cast) {
  return function match (subObj, keys, obj) {
    return _match(subObj, cast)
  }
}

function toGlob (key) {
  return key.split('.').map(function (ea) {
    if (ea.match(/^\$/) !== null) {
      return '**'
    }
    return ea
  }).join('.')
}

function matchedValue(obj, key, value) {
  return Object.keys(obj)
    .filter(each => minimatch(each, toGlob(key)))
    .filter(each => nestedVal(obj, each) === value)
}

function _match (obj, cast) {
  var value, everything;
  var flatCast = flatten(cast.pre);
  
  if (Object.keys(obj).length < 1) {
    return false;
  }

  everything = true;

  for (var key in flatCast) {
    if (key.match(/^\$/gi)) {
      let matches = matchedValue(obj, key, flatCast[key])
      if (matches.length <= 0) {
        everything = false
      }
    } else {
      //TODO: Support the special case of arrays
      value = nestedVal(obj, key);
      if (value !== undefined) {
        if (flatCast[key] === '$$' || value.match(flatCast[key])) {
          continue;
        } else {
          everything = false
        }
      } else {
        everything = false
      }
    }
  }
        
  return everything
}