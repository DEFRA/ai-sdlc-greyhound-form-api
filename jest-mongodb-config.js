// Configuration for jest-mongodb
const config = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.0.6',
      skipMD5: true
    },
    autoStart: false,
    instance: {}
  },
  mongoURLEnvName: 'MONGO_URI'
}

// Support both CommonJS and ES modules
// eslint-disable-next-line no-undef
if (typeof module !== 'undefined') {
  // eslint-disable-next-line no-undef
  module.exports = config
}

export default config
