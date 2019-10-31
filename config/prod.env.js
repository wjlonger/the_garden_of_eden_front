'use strict'
let version = require('./version')
module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: '"http://192.168.1.29:8800"',
  APP_INFO: JSON.stringify(version)
}
