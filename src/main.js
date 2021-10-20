import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './scss/style.scss'

import VueYouTubeEmbed from 'vue-youtube-embed'
import VueFacebookEmbed from './plugins/vueFacebookEmbed'
import VueInstagramEmbed from './plugins/vueInstagramEmbed'
import VueTikTokEmbed from './plugins/vueTikTokEmbed'
import dialog from './plugins/dialog'
Vue.use(VueYouTubeEmbed)
Vue.use(VueFacebookEmbed)
Vue.use(VueInstagramEmbed)
Vue.use(VueTikTokEmbed)
Vue.use(dialog)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
