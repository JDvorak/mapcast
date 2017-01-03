var _ = require('lodash')
var xtend = require('xtend');
var nestedVal = require('./components/utilities/nestedVal')
var matcher = require('./components/match')
var apply = require('./components/apply')
var walker = require('./components/walk')


function mapcast (obj, cast) {
  if (_.isArray(cast)) {
    return cast.reduce(function(obj, cast) {
      return mapcast(obj, cast)
    }, obj)
  }

  //TODO: Update Apply and Transform functions
  function match (subObj) {
    return matcher(subObj, cast)
  }

  function transform (subObj) {
    return apply(subObj, cast.from, cast.to)
  }

  var walk = walker(match, transform)

  var updateObj = walk(obj)

  return updateObj
}

function reverse(obj, cast) {
  //TBD
}


module.exports = mapcast

