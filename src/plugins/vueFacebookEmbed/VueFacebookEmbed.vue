<template>
  <div>
    <div ref="root" id="fb-root"></div>
    <div :class="[isVideo ? 'fb-video' : 'fb-post']" :data-href="url"></div>
  </div>
</template>

<script>
// const init = false
export default {
  name: 'vue-facebook-embed',
  props: {
    url: String
  },
  computed: {
    isVideo () {
      return this.url.includes('video')
    }
  },
  methods: {
    init () {
      window.FB.XFBML.parse()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss">
.fb-post {
  width: 100%;
  display: flex !important;
  justify-content: center;
  iframe {
    width: 100%;
  }
}
</style>
