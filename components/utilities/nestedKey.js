var xtend = require('filter-xtend');
var matcher = require('is-match');
var _ = require('lodash')

function nestedKey (o, path, v, options) { 
  options = options || {}
  options.extend = options.extend || false;
  return _.flattenDeep(dive(o, path[0], 0, []));

  function dive (obj, key, index, keys) {
    if (!key) {
      var temp = {}
      temp[keys.join('.')] = obj
      return temp
    }

    var regexMatch = key.match(/\/([\s\S]*)\/(ig)*/);
    
    if (regexMatch) {
      key = new RegExp(regexMatch[1], regexMatch[2])
    }

    var isMatch = matcher(key, {strict: true});
    var spread = [];
    var found = []


    for (var prop in obj) {
      if (obj.hasOwnProperty(prop) && isMatch(prop)) {
        if ((index === path.length-1) && v) {
          if (options.extend && _.isObject(obj[prop])) {
            obj[prop] = xtend(obj[prop], v)
          } else {
            obj[prop] = v;
          }
        }
        spread.push(prop)
      }
    }

    if (spread.length > 0) {
      found = spread.map(function (prop) {
        return dive(obj[prop], path[index + 1], index + 1, keys.concat(prop))
      }).filter((ea) => (ea != null))
      return found
    } 
  }
}

module.exports = nestedKey;