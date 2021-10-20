<template>
  <v-app>
    <w-header/>
    <v-main>
      <!-- <vector/> -->
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import WHeader from '@/components/Header'
/* import Vector from '@/components/Vector' */
export default {
  name: 'App',
  components: { WHeader/* , Vector */ },
  methods: {
    ...mapActions(['init'])
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss">
  $color-pack: false;
  .theme--light.v-application {
    background-color: $bg-color !important;
  }
</style>
