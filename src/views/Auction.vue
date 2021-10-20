<template>
  <div class="page auction">
    <Timer
      :key="auctionDeadline"
      :starttime="new Date()"
      :endtime="new Date(auctionDeadline)"
      trans='{
      "day":"Day",
      "hours":"Hours",
      "minutes":"Minutes",
      "seconds":"Seconds",
      "expired":"<p class=\"auction__info\">Make the first <span class=\"color-blue-grey\">bid</span></p>",
      "running":"<p class=\"auction__info\"><span class=\"color-blue-grey\">Auction</span> will end in</p>",
      "upcoming":"123",
      "status": {
        "expired":"Expired",
        "running":"Running",
        "upcoming":"Future"
        }}'
    />

    <v-container>
      <v-row class="justify-space-between">
        <v-col cols="12">
            <v-form v-model="valid">
            <div class="d-flex relative-position">
              <!-- #A6CCBB -->
              <v-text-field
                class="rounded-lg"
                placeholder="Link to content"
                outlined
                dense
                color="#D7D7D7"
                height="56px"
                :error-messages="embedValue && errorMessage"
                :success="!!embedContent.type"
                :success-messages="!!embedContent.type ? 'This is an experimental dApp, use it at your own risk.' : ''"
                v-model="embedValue"
                @input="onEmbed"
                style="max-width: calc(100% - 36px);"
              >
                <template v-slot:append>
                  <svg v-if="embedValue && errorMessage" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.001 10H13.001V15H11.001V10ZM11 16H13V18H11V16Z" fill="#FF4A4A"/>
                    <path d="M13.7679 4.19994C13.4199 3.54494 12.7419 3.13794 11.9999 3.13794C11.2579 3.13794 10.5799 3.54494 10.2319 4.20094L2.89395 18.0639C2.73112 18.3684 2.65046 18.71 2.65993 19.0551C2.6694 19.4002 2.76867 19.7369 2.94795 20.0319C3.12465 20.3283 3.37559 20.5735 3.676 20.7432C3.97641 20.913 4.3159 21.0015 4.66095 20.9999H19.3389C20.0469 20.9999 20.6879 20.6379 21.0529 20.0319C21.2319 19.7368 21.331 19.4001 21.3405 19.0551C21.35 18.71 21.2695 18.3685 21.1069 18.0639L13.7679 4.19994ZM4.66095 18.9999L11.9999 5.13694L19.3439 18.9999H4.66095Z" fill="#FF4A4A"/>
                  </svg>
                  <svg v-if="embedContent.type" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12.5L11 15.5L16 9.5" stroke="#A6CCBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#A6CCBB" stroke-width="2"/>
                  </svg>
                </template>
              </v-text-field>
              <v-btn
                v-if="embedContent.type"
                class="prompt-btn mt-2"
                icon
                color="primary"
                @click="onViewPreview"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="10.25" stroke="#9CBACE" stroke-width="1.5"/>
                  <path d="M4.58337 11.0001C4.58337 11.0001 6.91671 6.55566 11 6.55566C15.0834 6.55566 17.4167 11.0001 17.4167 11.0001C17.4167 11.0001 15.0834 15.4446 11 15.4446C6.91671 15.4446 4.58337 11.0001 4.58337 11.0001Z" stroke="#9CBACE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11 12.6666C11.9665 12.6666 12.75 11.9204 12.75 10.9999C12.75 10.0794 11.9665 9.33325 11 9.33325C10.0335 9.33325 9.25 10.0794 9.25 10.9999C9.25 11.9204 10.0335 12.6666 11 12.6666Z" stroke="#9CBACE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </v-btn>
              <v-btn
                v-if="embedValue && errorMessage"
                class="prompt-btn mt-2"
                icon
                color="primary"
                @click="onViewPrompt"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.403198 11C0.403198 8.18955 1.51964 5.49422 3.50693 3.50693C5.49422 1.51964 8.18955 0.403198 11 0.403198C13.8104 0.403198 16.5058 1.51964 18.4931 3.50693C20.4804 5.49422 21.5968 8.18955 21.5968 11C21.5968 13.8104 20.4804 16.5058 18.4931 18.4931C16.5058 20.4804 13.8104 21.5968 11 21.5968C8.18955 21.5968 5.49422 20.4804 3.50693 18.4931C1.51964 16.5058 0.403198 13.8104 0.403198 11ZM11 1.9232C8.59268 1.9232 6.28396 2.8795 4.58173 4.58173C2.8795 6.28396 1.9232 8.59268 1.9232 11C1.9232 13.4073 2.8795 15.716 4.58173 17.4183C6.28396 19.1205 8.59268 20.0768 11 20.0768C13.4073 20.0768 15.716 19.1205 17.4183 17.4183C19.1205 15.716 20.0768 13.4073 20.0768 11C20.0768 8.59268 19.1205 6.28396 17.4183 4.58173C15.716 2.8795 13.4073 1.9232 11 1.9232ZM12.2 15.8C12.2 16.1183 12.0736 16.4235 11.8485 16.6485C11.6235 16.8736 11.3183 17 11 17C10.6817 17 10.3765 16.8736 10.1515 16.6485C9.92643 16.4235 9.8 16.1183 9.8 15.8C9.8 15.4817 9.92643 15.1765 10.1515 14.9515C10.3765 14.7264 10.6817 14.6 11 14.6C11.3183 14.6 11.6235 14.7264 11.8485 14.9515C12.0736 15.1765 12.2 15.4817 12.2 15.8ZM8.68 9C8.68 7.9152 9.616 6.88 11 6.88C12.384 6.88 13.32 7.9152 13.32 9C13.32 9.7856 12.888 10.1872 12.1424 10.64C12.0608 10.6912 11.9648 10.7456 11.8608 10.8064C11.5481 10.9791 11.2467 11.1715 10.9584 11.3824C10.5712 11.6832 10.12 12.1712 10.12 12.92C10.1192 13.1534 10.2111 13.3776 10.3755 13.5432C10.5399 13.7088 10.7634 13.8024 10.9968 13.8032C11.2302 13.804 11.4544 13.7121 11.62 13.5477C11.7856 13.3833 11.8792 13.1598 11.88 12.9264C11.9247 12.866 11.9787 12.8131 12.04 12.7696C12.2032 12.6432 12.384 12.5392 12.6256 12.3984C12.7504 12.3264 12.8928 12.2432 13.0576 12.144C13.912 11.624 15.08 10.7664 15.08 9C15.08 6.8848 13.296 5.12 11 5.12C8.704 5.12 6.92 6.8848 6.92 9C6.92 9.23339 7.01271 9.45722 7.17774 9.62225C7.34278 9.78729 7.56661 9.88 7.8 9.88C8.03339 9.88 8.25722 9.78729 8.42225 9.62225C8.58729 9.45722 8.68 9.23339 8.68 9Z" fill="#9CBACE"/>
                </svg>
              </v-btn>

            </div>
            <div class="d-flex relative-position">
              <v-text-field
                v-model="bidAmountValue"
                type="number"
                :min="minimumBid"
                :step="bidStep"
                placeholder="Your bid"
                :rules="bidAmountRules"
                outlined
                dense
                class="rounded-lg"
                color="#D7D7D7"
                height="56px"
                style="max-width: calc(100% - 36px);"
              >
              </v-text-field>
            </div>
            <div class="d-flex">
              <v-btn
                class="apply-btn"
                color="#F6BA40"
                height="56px"
                depressed
                :loading="loading"
                @click="makeBid"
                :disabled="!this.embedContent.type"
              >
                Send
              </v-btn>

            </div>
          </v-form>
        </v-col>
        <v-col cols="12">
          <p class="bids">Current bids</p>
          <p v-if="isBidsHistoryError">An error occurred when downloading a list of bets</p>
          <p v-else-if="isEmptyBidsHistory">List of rates are empty, you can make the first bet </p>
          <div v-else class="d-flex flex-column">
            <v-virtual-scroll
              :bench="0"
              :items="bidsHistoryData"
              height="328"
              item-height="82"
            >
              <template v-slot:default="{ item }">
                <div
                  :key="`${item.url}/${item.price}`"
                  class="d-flex justify-space-between bid-item"
                >
                  <div class="d-flex flex-column">
                    <span class="bid-price">{{ item.price }} tz</span>
                    <span>{{ item.user }}</span>
                  </div>
                  <span class="bid-time">{{ item.time }}</span>
                </div>
              </template>
            </v-virtual-scroll>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar
      v-model="notify"
      :timeout="2000"
    >
      {{ notifyMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="onCloseNotify"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { debounce } from '@/utils'
import embed from '@/mixins/embed'
import Timer from '@/components/Timer'
import Embedded from '@/components/Embedded'
import EmbedPrompt from '@/components/EmbedPrompt'

const DEBOUNCE_INTEVAL = 1000
export default {
  name: 'auction',
  mixins: [embed],
  components: {
    Timer
  },
  data () {
    return {
      loading: false,
      embedValue: '',
      bidAmount: null,
      isPreview: false,
      notify: false,
      notifyMessage: '',
      errorMessage: '',
      valid: true,
      embedContent: {},
      bidAmountRules: [
        val => this.bidAmountValue >= this.minimumBid || `Permissible minimum rate ${this.minimumBid} tz`
      ]
    }
  },
  watch: {
    minimumBid: {
      handler (val) {
        if (val > this.bidAmount) {
          this.bidAmount = val
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['storage', 'bidStep', 'minimumBid', 'isConnected', 'auctionDeadline']),
    ...mapState(['bidsHistory']),
    bidAmountValue: {
      get () {
        return this.bidAmount || this.minimumBid
      },
      set (val) {
        this.bidAmount = val
      }
    },
    isBidsHistoryError () {
      return this.bidsHistory.error
    },
    isEmptyBidsHistory () {
      return !this.bidsHistory.error && !this.bidsHistory.data.length
    },
    bidsHistoryData () {
      return this.bidsHistory.data
    }
  },
  methods: {
    ...mapActions(['setBid', 'connectWallet']),
    onCloseNotify () {
      this.notify = false
      this.notifyMessage = ''
    },
    onViewPreview () {
      this.$dialog({
        component: Embedded,
        url: this.embedContent.url
      })
    },
    onViewPrompt () {
      this.$dialog({
        component: EmbedPrompt
      })
    },
    onEmbed: debounce(async function (value) {
      this.errorMessage = ''
      if (!value) {
        this.embedValue = ''
        this.embedContent = Object.assign({})
        return
      }
      let url = value.match(/http[^"]*/g)
      if (!Array.isArray(url)) return
      url = url[0]
      const result = await this.embedDefinition(url)
      if (result && result.value) {
        this.embedValue = result.value.url
        this.embedContent = Object.assign({}, result.value)
        this.saveLastBid({ url: this.embedValue, amount: this.bidAmountValue })
      } else {
        // this.notify = true
        this.errorMessage = 'Unknown embed content'
        this.embedContent = Object.assign({})
      }
    }, DEBOUNCE_INTEVAL),

    readLastBid () {
      const lastBid = JSON.parse(localStorage.getItem('bid'))
      if (lastBid) {
        this.embedValue = lastBid.url
        this.bidAmountValue = this.minimumBid <= lastBid.amount ? lastBid.amount : this.minimumBid
        this.onEmbed(this.embedValue)
      }
    },
    saveLastBid (bid) {
      localStorage.setItem('bid', JSON.stringify(bid))
    },

    async makeBid () {
      if (!this.valid) {
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true
      try {
        await this.connectWallet()
        await this.setBid({ url: this.embedValue, amount: this.bidAmountValue })
        this.notifyMessage = 'The rate has been successfully accepted '
        this.notify = true
      } catch (err) {
        console.error(err)
        this.notifyMessage = err.description
        this.notify = true
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.readLastBid()
  }
}
</script>

<style lang="scss">
.v-dialog {
  width: auto !important;
  overflow-x: hidden;
  box-sizing: border-box;
  padding-top: 20px;
  padding-right: 20px;
}
.auction {
  max-width: 622px !important;
  padding-right: 35px !important;
  &__info {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
  }
}
.bid-item {
  padding: 10px 10px;
  margin-left: 20px;
  margin-right: 20px;
  font-family: Montserrat;
  font-style: normal;
  border-bottom: 1px dashed $outline-color;

  .bid-price {
    font-weight: 500;
    font-size: 20px;
    color: #3E3E3E;
  }
  .bid-time {
    font-weight: normal;
    font-size: 16px;
    color: #797979;
  }
}
.preview-btn {
  position: absolute;
  top: 10px;
  right: -45px;
}
.apply-btn {
  border-radius: 8px;
  width: 100%;
  .v-btn__content {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    color: $white;
  }
}
.bids {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
}
.v-dialog.v-dialog--active {
  max-width: max-content;
  position: relative;
}
.close-dialog-btn {
  top: 0;
  right: -11px;
}
.v-application .v-input.success--text {
  color: #A6CCBB !important;
  caret-color: #A6CCBB !important;
}
.v-text-field--outlined.v-input--is-focused:not(.error--text).success--text fieldset, .v-text-field--outlined.v-input--has-state:not(.error--text).success--text fieldset {
  border: 2px solid #A6CCBB !important;
}
.v-text-field__details .v-messages.success--text {
  color: #A6CCBB !important;
  caret-color: #A6CCBB !important;
}
</style>
