var _ = require('lodash')
var traverse = require('traverse')

module.exports = function makeWalker (match, transform) {
  return function _walk (obj) {
    return traverse(obj).map(function each (each) {
      if (!each.__visited && this.notLeaf && match(each, this.path, obj)) {
        each.__visited = true
        this.update(transform(each, this.path, obj))
      }
      delete each.__visited
    })
  }
}