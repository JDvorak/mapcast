var _ = require('lodash')
var traverse = require('traverse')

module.exports = function makeWalker (match, transform) {
  return function useTraverse (obj) {
    n = traverse(obj).map(function each (each) {
      if (this.notLeaf && match(each, this.path, obj)) {
        this.update(transform(this.node, this.path, obj))
      }
      return each
    })
    return n;
  }
}