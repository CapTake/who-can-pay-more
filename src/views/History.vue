<template>
  <div class="page">
    <button
      v-if="historyItems.length"
      @click="changeOrdering"
      class="ordering-btn"
    >
      <svg width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.0624 12L0.937621 12C0.683706 12 0.463911 12.0989 0.278439 12.2968C0.0930693 12.4947 2.30607e-07 12.7291 2.54285e-07 12.9999C2.77963e-07 13.2708 0.0930179 13.505 0.278439 13.7032L6.84087 20.7032C7.02629 20.9008 7.24593 21 7.5 21C7.75407 21 7.97371 20.9008 8.15929 20.7032L14.7217 13.7032C14.9073 13.5052 15 13.2708 15 12.9999C15 12.7291 14.9073 12.4947 14.7217 12.2968C14.5359 12.0989 14.3163 12 14.0624 12Z" fill="#9CBACE"/>
        <path d="M14.357 7.63914L14.3569 7.63904L7.7947 0.63923L14.357 7.63914ZM14.357 7.63914C14.4557 7.74434 14.5 7.8565 14.5 8.00022C14.5 8.14375 14.4558 8.25578 14.3571 8.36115C14.2588 8.46594 14.1681 8.5 14.0624 8.5L0.937622 8.5M14.357 7.63914L0.937622 8.5M7.20578 0.638879L7.20564 0.639031L0.64326 7.63905C0.643244 7.63906 0.643227 7.63908 0.643211 7.6391C0.544355 7.7446 0.500001 7.85694 0.500001 8.00028C0.500001 8.14339 0.544227 8.25566 0.643307 8.36151L7.20578 0.638879ZM7.20578 0.638879C7.30396 0.534073 7.39472 0.5 7.5 0.5C7.60503 0.5 7.69577 0.533902 7.79451 0.639033L7.20578 0.638879ZM0.937622 8.5C0.831787 8.5 0.741166 8.46591 0.643401 8.36161L0.937622 8.5Z" stroke="#9CBACE"/>
      </svg>

      <span style="margin-left: 10px;">{{ order ? 'Sort Newest First' : 'Sort Oldest First' }}</span>
    </button>
    <embedded
      v-for="(item, index) in historyItems"
      :key="item.url + index"
      :url="item.url"
      :price="item.price"
      :time="item.time"
      class="mb-5"
    />
    <v-btn
      v-if="isHasHistory"
      @click="loadHistoryItems(order)"
      :loading="loading"
      color="#9CBACE"
      class="load-more"
    >
      read more
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Embedded from '@/components/Embedded'
import { PER_PAGE_COUNT } from '@/config'
export default {
  name: 'history',
  components: {
    Embedded
  },
  data () {
    return {
      numberOfRecords: PER_PAGE_COUNT,
      loading: false,
      historyItems: [],
      order: 1
    }
  },
  watch: {
    init: {
      handler (val) {
        val.then(() => {
          this.loadHistoryItems(this.order)
        })
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['contentHistoryLength']),
    ...mapState(['init']),
    isHasHistory () {
      return this.contentHistoryLength && (this.contentHistoryLength > this.historyItems.length)
    }
  },
  methods: {
    ...mapActions(['getContentsHistory']),
    changeOrdering () {
      this.historyItems = []
      this.order = this.order > 0 ? 0 : 1
      this.loadHistoryItems(this.order)
    },
    async loadHistoryItems (order) {
      if (!this.isHasHistory) return
      if (this.loading) return
      this.loading = true
      try {
        const res = await this.getContentsHistory({
          numberOfRecords: this.numberOfRecords,
          lastIndex: this.historyItems.length > 0 ? this.historyItems.length + 1 : this.historyItems.length,
          order
        })
        this.historyItems = [...this.historyItems, ...res]
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
  .ordering-btn {
    position: sticky !important;
    top: 100px;
    z-index: 9999;
    color: #9CBACE;
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    @include media-desktop() {
      margin-left: auto;
    }
  }
  .load-more {
    border-radius: 16px !important;
    height: 50px !important;
    margin-left: auto;
    margin-right: auto;
    display: block !important;
    .v-btn__content {
      color: #F9FAFC !important;
      font-family: 'PeaceSans';
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      padding-top: 4px;
    }
  }
</style>
