import VueFacebookEmbed from './VueFacebookEmbed'
let init = false
export default {
  install (Vue) {
    Vue.component('facebook', VueFacebookEmbed)
    if (init) {
      window.FB.XFBML.parse()
      this.initFB()
    } else {
      const script = document.createElement('script')
      script.async = true
      script.defer = 'defer'
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.onload = function () {
        init = true
        window.fbAsyncInit = function () {
          window.FB.init({
            appId: '1682972985208351',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v10.0'
          })
        }
      }
      document.body.appendChild(script)
    }
  }
}
