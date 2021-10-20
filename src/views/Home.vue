<template>
  <div class="page">
    <embedded
      :url="contentUrl"
      :price="contentPrice"
      :time="contentTime"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Embedded from '@/components/Embedded'
export default {
  name: 'Home',
  components: {
    Embedded
  },
  data () {
    return {}
  },
  computed: {
    ...mapState(['mainContent']),
    contentUrl () {
      return this.mainContent && this.mainContent.url
    },
    contentPrice () {
      return this.mainContent && this.mainContent.price
    },
    contentTime () {
      return this.mainContent && this.mainContent.time
    }
  }
}
</script>
