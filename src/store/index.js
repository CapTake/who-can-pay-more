import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import moment from 'moment'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    init: new Promise(() => {}),
    contract: null,
    userAddress: null,
    contractStorage: null,
    mainContent: null,
    bidsHistory: {
      error: false,
      data: []
    }

  },
  mutations: {
    setInit (state) {
      state.init = new Promise(resolve => resolve(true))
    },
    setUserAddress (state, address) {
      state.userAddress = address
    },
    setContract (state, contract) {
      state.contract = contract
    },
    setContractStorage (state, storage) {
      state.contractStorage = storage
    },
    setMainContent (state, content) {
      state.mainContent = content
    },
    setBidsHistory (state, history) {
      state.bidsHistory = history
    }
  },
  getters: {
    isConnected (state) {
      return !!state.userAddress
    },
    storage (state) {
      return state.contractStorage
    },
    bidStep (state, getters) {
      return getters.storage && getters.storage.bid_step.toNumber() / 1000000
    },
    lastBid (state, getters) {
      return getters.storage && getters.storage.bid_size.toNumber() / 1000000
    },
    minimumBid (state, getters) {
      return getters.storage ? (getters.lastBid * 1000000 + getters.bidStep * 1000000) / 1000000 : null
    },
    auctionDeadline (state, getters) {
      return getters.storage && moment(getters.storage.deadline).isValid()
        ? moment.parseZone(getters.storage.deadline).local().format()
        : moment().subtract(1, 'days').format()
    },
    contentHistoryLength (state, getters) {
      return getters.storage && getters.storage.win_count.toNumber() - 1
    }
  },
  actions
})
