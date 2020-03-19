// vue.config.js
module.exports = {
  // options...
  devServer: {
    disableHostCheck: true
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  }
};
