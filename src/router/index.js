import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import History from '../views/History.vue'
import Auction from '../views/Auction.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/how-it-work',
    name: 'about',
    component: About
  },
  {
    path: '/history',
    name: 'history',
    component: History
  },
  {
    path: '/auction',
    name: 'auction',
    component: Auction
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
