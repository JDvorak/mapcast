var xtend = require('filter-xtend');
var unflatten = require('flat').unflatten;

module.exports = function nestedVal (o, s, v) { 
  if (s instanceof Array) {
    s = s.join('.')
  }

  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  s = s.replace(/\\/g, '');           // strip any escapes

  if (!s) return o;

  return s.split('.').reduce(
    function dive (obj, prop) { 
      if (obj && prop in obj) {
        if (v) {
          obj[prop] = v;
        } else {
          return obj[prop]
        }
      } else {
        return undefined
      }
    }, o);
};
