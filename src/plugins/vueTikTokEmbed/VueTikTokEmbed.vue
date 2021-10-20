<template>
  <div v-html="embedContent" ref="container"></div>
</template>

<script>
import { fetchData } from './index'
export default {
  name: 'vue-tik-tok-embed',
  props: {
    url: {
      type: String
    }
  },
  data () {
    return {
      embedContent: ''
    }
  },
  methods: {
    async init () {
      try {
        const res = await fetchData(this.url)
        this.embedContent = res.html
        const script = document.createElement('script')
        script.async = true
        script.defer = 'defer'
        script.src = 'https://www.tiktok.com/embed.js'
        script.onload = function () {

        }
        this.$refs.container.appendChild(script)
      } catch (err) {
        console.error(err)
        this.embedContent = '<p>Unable to download content</p>'
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss">
  .tiktok-embed {
    width: 100% !important;
    max-width: 100% !important;
    margin-top: 0 !important;
  }
</style>
