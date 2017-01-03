var flatten = require('flat');
var _ = require('lodash')
var xtend = require('xtend');
var nestedVal = require('../utilities/nestedVal')

/*
 Match if all keys in a cast definition are present in the subobject and that the values match
*/
module.exports = function makeMatcher (cast) {
  return function match (subObj, keys, obj) {
    return _match(subObj, cast)
  }
}

function _match (obj, cast) {
  var value, everything;
  var flatCast = flatten(cast.from);
  if (Object.keys(obj).length < 1) {
    return false;
  }

  everything = true;

  for (var key in flatCast) {
    if (key.match(/\$\$$/)) {
      continue; //TODO: Support 'any key, so long as it has this value'
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