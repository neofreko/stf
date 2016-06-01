var Promise = require('bluebird')
var syrup = require('stf-syrup')

var logger = require('../../../../util/logger')
var dbapi = require('../../../../db/api')


module.exports = syrup.serial()
  .dependency(require('../group'))
  .define(function(options, group) {
    var log = logger.createLogger('device:plugins:usage_stats')
    
    group.on('join', function(currentGroup, identifier) {
      log.info('startDeviceUsage')
      dbapi.startDeviceUsage(currentGroup, new Date())
      
      function updateLastSeen(currentGroup, interval) {
        return function () {
          log.info('updateLastSeen')
          dbapi.updateDeviceUsageLastSeen(currentGroup, new Date())
          setTimeout(updateLastSeen(currentGroup, interval), interval)
        }
      }
      
      // start timer to update usage
      updateLastSeen(currentGroup, options.heartbeatInterval)
    })

    group.on('leave', function(currentGroup) {
      log.info('updateDeviceUsage')
      dbapi.updateDeviceUsage(currentGroup, new Date())
      
      // stop timer to update usage
    })

    return Promise.resolve()
  })
