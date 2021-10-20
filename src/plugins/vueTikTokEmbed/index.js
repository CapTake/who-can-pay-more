import axios from 'axios'
import VueTikTokEmbed from './VueTikTokEmbed'
// const inited = false
export default {
  /* <script async="" src="https://www.tiktok.com/embed.js"></script> */
  install (Vue) {
    /* if (!inited) {
      const script = document.createElement('script')
      script.async = true
      script.defer = 'defer'
      script.src = 'https://www.tiktok.com/embed.js'
      script.onload = function () {
        inited = true
        console.log(1)
      }
      document.body.appendChild(script)
    } */
    Vue.component('tik-tok', VueTikTokEmbed)
  }
}

export async function fetchData (url) {
  const res = await axios.get('https://www.tiktok.com/oembed', { params: { url } })
  return res.data
}
