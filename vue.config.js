module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/scss/config/index.scss";'
      }
    }
  }
}
