var _ = require('lodash')
var traverse = require('traverse')

module.exports = function makeWalker (match, transform) {
  return function _walk (obj) {
    return traverse(obj).map(function each (each) {
      if (this.notLeaf && match(each, this.path, obj)) {
        this.update(transform(each, this.path, obj))
      }
    })
  }
}