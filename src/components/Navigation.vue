<template>
  <nav class="navbar" :class="{ 'navbar--open': menuOpen }">
    <ul class="nav-list">
      <li
        v-for="item in items"
        :key="item.title"
        class="nav-list__item"
      >
        <router-link
          :to="item.to"
          class="nav-list__link"
          exact-active-class="nav-list__link--active"
        >
          {{ item.title }}
        </router-link>
      </li>
    </ul>
    <button class="hamburger-btn" @click="menuOpen = !menuOpen">
      <svg v-if="!menuOpen" width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.799988 14.4C0.799988 15.2837 1.51633 16 2.39999 16H21.6C22.4836 16 23.2 15.2837 23.2 14.4C23.2 13.5163 22.4836 12.8 21.6 12.8H2.39999C1.51633 12.8 0.799988 13.5163 0.799988 14.4ZM2.39999 0C1.51633 0 0.799988 0.716345 0.799988 1.6C0.799988 2.48366 1.51633 3.2 2.39999 3.2H21.6C22.4836 3.2 23.2 2.48366 23.2 1.6C23.2 0.716345 22.4836 0 21.6 0H2.39999ZM0.799988 8C0.799988 8.88366 1.51633 9.6 2.39999 9.6H21.6C22.4836 9.6 23.2 8.88366 23.2 8C23.2 7.11634 22.4836 6.4 21.6 6.4H2.39999C1.51633 6.4 0.799988 7.11634 0.799988 8Z" fill="#9CBACE"/>
      </svg>
      <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.08035 23.9196C8.70518 24.5445 9.71825 24.5445 10.3431 23.9196L23.9195 10.3432C24.5444 9.71835 24.5444 8.70529 23.9195 8.08045C23.2947 7.45561 22.2816 7.45561 21.6568 8.08045L8.08034 21.6569C7.45551 22.2817 7.45551 23.2948 8.08035 23.9196Z" fill="#9CBACE"/>
        <path d="M8.08036 8.08047C7.45552 8.70531 7.45552 9.71837 8.08036 10.3432L21.6568 23.9197C22.2816 24.5445 23.2947 24.5445 23.9196 23.9197C24.5444 23.2948 24.5444 22.2818 23.9196 21.6569L10.3431 8.08047C9.71826 7.45563 8.7052 7.45563 8.08036 8.08047Z" fill="#9CBACE"/>
      </svg>
    </button>
  </nav>
</template>

<script>
export default {
  name: 'navigation',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      menuOpen: false
    }
  },
  watch: {
    $route () {
      this.menuOpen = false
    }
  }
}
</script>

<style lang="scss">
  .navbar {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    margin-left: 3%;

    &--open.navbar {
      .nav-list {
        position: fixed;
        height: calc(50vh - 50px);
        width: auto;
        overflow: auto;
        flex-direction: column;
        width: 100%;
        margin-left: 0;
        margin-right: 0;
        justify-content: center;
        align-items: center;
        top: 72px;
        left: 0;
        z-index: 9999;

        &__item {
          width: 100%;
          margin-left: 0;
          margin-right: 0;
          padding-top: 15px;
          padding-bottom: 15px;
        }

        &__link {
          display: block;
          width: 100%;
          height: 100%;
          text-align: center;
        }
      }
    }

    .hamburger-btn {
      @include media-desktop() {
        display: none;
      }
    }

    .nav-list {
      list-style: none;
      display: flex;
      margin-left: -3%;
      margin-right: -3%;
      padding-left: 0;
      flex-grow: 1;
      justify-content: flex-end;
      height: 0;
      width: 0;
      overflow: hidden;
      background-color: $white;

      @include media-desktop() {
        height: auto;
        width: auto;
        overflow: auto;
        background-color: transparent;
      }

      &__item {
        margin-left: 3%;
        margin-right: 3%;
      }

      &__link {
        text-decoration: none;
        font-family: 'Montserrat', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 20px;
        color: $dark;

        &--active {
          color: $blue-grey;
        }
      }
    }
  }
</style>
