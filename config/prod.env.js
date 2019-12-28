'use strict'
let version = require('./version')
const host = process.argv.splice(2)[0] || '192.168.1.29:8800';
console.log('---------------', '"http://' + host + '"', '---------------')
module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: '"http://' + host + '"',
  // API_ROOT: '"http://www.wujunlong.com"',
  APP_INFO: JSON.stringify(version)
}
