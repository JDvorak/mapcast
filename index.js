var _ = require('lodash')
var xtend = require('xtend');
var nestedVal = require('./components/utilities/nestedVal')
var matcher = require('./components/matchers/cast')
var transformer = require('./components/transformers/cast')
var walker = require('./components/walk')


function mapcast (obj, cast) {
  if (_.isArray(cast)) {
    return cast.reduce(function(obj, cast) {
      return mapcast(obj, cast)
    }, obj)
  }

  var walk = walker(matcher(cast), transformer(cast))

  var updateObj = walk(obj)

  return updateObj
}

function reverse(obj, cast) {
  //TBD
}


module.exports = mapcast

