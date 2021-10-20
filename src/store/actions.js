import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { char2Bytes, bytes2Char } from '@taquito/utils'
import moment from 'moment'

import { CONTRACT, ENDPOINT, NETWORK } from '@/config'
// import axios from 'axios'

const tezos = new TezosToolkit(ENDPOINT)
const wallet = new BeaconWallet({ name: 'who-can-pm' })

const POLL_INTERVAL = 20000

function timer (delta) {
  // Берем разницу дат в секундах
  // let delta = Math.floor((endTime - new Date()) / 1000);
  // Вычисляем количество ПОЛНЫХ дней
  const days = Math.floor(delta / 86400)
  const daysStr = days > 0 ? `${days}d ` : ''
  // А теперь вычитаем из секунд количество дней, выраженных в секундах
  delta -= days * 86400
  // В оставшихся секунд вычленяем количество полных часов
  const hours = Math.floor(delta / 3600) % 24
  const hoursStr = hours > 0 ? `${hours}h ` : ''
  // Также их потом вычитаем, выразив в секундах
  delta -= hours * 3600
  // Из оставшихся секунд берем минуты
  const minutes = Math.floor(delta / 60) % 60
  const minutesStr = minutes > 0 ? `${minutes}m` : ''
  // Опять вычитаем
  delta -= minutes * 60
  // И наконец секунды
  // В теории  деление по модулю на 60 не обязателен
  // const seconds = delta % 60
  // Итоговая дата
  return `${daysStr}${hoursStr}${minutesStr}`
}

function getBidContent (bid) {
  // typeof bid.t === 'string' ? moment(bid.t).fromNow(true) : moment.duration(bid.t.toNumber(), 'seconds').humanize({ d: 7, w: 4 }),
  const delta = typeof bid.t === 'string' ? (new Date() - new Date(bid.t)) / 1000 : typeof bid.t === 'number' ? bid.t : bid.t.toNumber()
  return {
    url: bid.c ? bytes2Char(bid.c) : '',
    price: bid.b.toNumber() / 1000000,
    time: timer(delta),
    user: bid.a ? `${bid.a.substring(0, 4)}...${bid.a.substring(bid.a.length - 4)}` : ''
  }
}

export default {
  async init ({ commit, dispatch }) {
    try {
      const contract = await tezos.contract.at(CONTRACT)
      commit('setContract', contract)
      await dispatch('pollStorage')
      commit('setInit')
    } catch (err) {
      console.error(err)
    } finally {
      console.log('init done')
    }
  },

  async pollStorage ({ commit, dispatch }) {
    try {
      await dispatch('getContractStorage')
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => { dispatch('pollStorage') }, POLL_INTERVAL)
    }
  },

  async connectWallet ({ state, commit }) {
    if (!state.userAddress) {
      await wallet.requestPermissions({
        network: {
          type: NETWORK
        }
      })
      const address = await wallet.getPKH()
      tezos.setWalletProvider(wallet)
      commit('setUserAddress', address)
    }
    return true
  },

  disconnectWallet ({ commit }) {
    wallet.clearActiveAccount().then(() => commit('setUserAddress', null))
  },

  async getContractStorage ({ state, commit, dispatch, getters }) {
    try {
      const storage = await state.contract.storage()
      commit('setContractStorage', storage)
      dispatch('getBidsHistory')
      dispatch('setMainContent')
    } catch (err) {
      console.error(err)
    }
  },

  setMainContent ({ commit, getters }) {
    const content = moment().isAfter(getters.auctionDeadline) ? getters.storage.last_bid : getters.storage.winning_bid
    commit('setMainContent', getBidContent(content, false))
  },

  async getBidsHistory ({ commit, getters }) {
    const history = []
    const endIndex = getters.storage.bid_count.toNumber()
    let startIndex = Math.max(endIndex - 9, 0)
    for (; startIndex < endIndex; startIndex++) {
      const action = getters.storage.history.get(String(startIndex))
      history.push(action)
    }
    try {
      let historyData = await Promise.all(history)
      historyData = historyData.map(h => getBidContent(h))
      commit('setBidsHistory', { error: false, data: historyData.reverse() })
    } catch (err) {
      commit('setBidsHistory', { error: true, data: [] })
    }
  },

  async getContentsHistory ({ commit, getters, state }, { numberOfRecords, lastIndex, order = 1 }) {
    const history = []
    console.log(getters.contentHistoryLength)
    let startIndex = order ? getters.contentHistoryLength - lastIndex : lastIndex + 1
    const endIndex = order ? Math.max(startIndex - numberOfRecords, 0) : Math.min(startIndex + numberOfRecords, getters.contentHistoryLength + 1)
    if (order) {
      for (; startIndex > endIndex; --startIndex) {
        const action = getters.storage.win_history.get(String(startIndex))
        history.push(action)
      }
    } else {
      for (; startIndex < endIndex; startIndex++) {
        const action = getters.storage.win_history.get(String(startIndex))
        history.push(action)
      }
    }
    try {
      let historyData = await Promise.all(history)
      console.log(historyData)
      const wb = moment().isAfter(getters.auctionDeadline) ? { ...getters.storage.winning_bid } : null
      if (wb) {
        console.log(wb)
        wb.t = moment(getters.auctionDeadline).diff(moment(wb.t)) / 1000
        if (order) {
          historyData.unshift(wb)
        } else {
          historyData.push(wb)
        }
      }
      console.log(historyData)
      historyData = historyData.map(h => getBidContent(h, false))
      return historyData
    } catch (err) {
      console.error(err)
      Promise.reject(err)
    }
  },

  async setBid ({ state }, data) {
    let { url, amount } = data
    url = char2Bytes(url)
    amount = amount * 1000000

    const contract = await tezos.wallet.at(CONTRACT)
    const op = await contract.methods.bid(url).send({ amount, mutez: true })
    const result = await op.confirmation()
    console.log(result)
    if (result.completed) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('Make bit: transaction not confirmed'))
    }
  }
}
