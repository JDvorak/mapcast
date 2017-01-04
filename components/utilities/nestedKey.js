var xtend = require('filter-xtend');
var matcher = require('is-match');
var _ = require('lodash')

function nestedKey (o, path, v, options) { 
  options = options || {}
  options.extend = options.extend || false;

  return _.flattenDeep(_dive(o, path[0], 0, []));

  function _dive (obj, key, index, keys) {
    var regexMatch, isMatch, found = [];

    if (regexMatch = key.match(/\/([\s\S]*)\/(ig)*/)) {
      key = new RegExp(regexMatch[1], regexMatch[2])
    }

    isMatch = matcher(key, {strict: true});

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop) && isMatch(prop)) {
        if ((index === path.length-1)) {
          if (v) {
            if (options.extend && _.isObject(obj[prop])) {
              obj[prop] = xtend(obj[prop], v)
            } else {
              obj[prop] = v;
            }
          } else {
            var temp = {}
            temp[keys.concat(prop).join('.')] = obj[prop]
            found.push(temp)
          }
        } else {
          found.push(_dive(obj[prop], path[index + 1], index + 1, keys.concat(prop)))
        }
      }
    }

    return found.filter((ea) => (ea != null))
  }
}

module.exports = nestedKey;
