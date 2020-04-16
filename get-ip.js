const internalIp = require('internal-ip')

module.exports = () => {
  const HOST = internalIp.v4.sync() || '127.0.0.1'
  const PORT = 3000
  
  return { HOST, PORT }
}