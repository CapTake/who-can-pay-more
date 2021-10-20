<template>
  <div class="embedded">
    <v-responsive :aspect-ratio="16/9">
      <youtube v-if="isYoutube" :video-id="embed.videoId" class="embed embedded__youtube"/>
      <facebook v-else-if="isFacebook" :url="embed.url" class="embed embedded__facebook"/>
      <telegramm v-else-if="isTelegramm" :link="embed.url" class="embed embedded__telegramm"/>
      <instagram v-else-if="isInstagramm" :url="embed.url" class="embedded__instagram"/>
      <tweet v-else-if="isTwitter" :id="embed.id" class="embed embedded__tweet"/>
      <tik-tok v-else-if="isTikTok" :url="embed.url" class="embed embedded__tik-tok"/>
      <p v-else-if="!embed && !loading" class="embedded__unknown">
        <img src="data:image/jpeg;base64,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">
      </p>
      <div class="embedded__loading">
        <v-progress-circular
          indeterminate
        />
      </div>
    </v-responsive>
    <div v-if="isEmbedInfo">
      <div class="d-flex justify-space-between">
        <div class="embedded__info">{{ price }}tz</div>
        <div class="embedded__info">{{ time }}</div>
      </div>
      <div class="d-flex justify-space-between">
        <div class="embedded__decipter">Price Paid</div>
        <div class="embedded__decipter">How long it stayed up</div>
      </div>
    </div>
  </div>
</template>

<script>
import embed from '@/mixins/embed'
import VueTelegramEmbed from 'vue-telegram-embed'
import { Tweet } from 'vue-tweet-embed'
export default {
  name: 'embedded',
  mixins: [embed],
  components: {
    telegramm: VueTelegramEmbed,
    Tweet
  },
  props: {
    url: {
      type: String
    },
    price: {
      type: Number
    },
    time: String
  },
  data () {
    return {
      embed: null,
      loading: true
    }
  },
  watch: {
    url (val) {
      this.loading = true
      console.log(this.loading)
      console.log(!(this.embed && this.loading))
      this.embedDefinition(this.url)
        .then(embed => {
          this.embed = embed.value
        }).finally(() => {
          this.loading = false
          console.log(!(this.embed && this.loading))
        })
    }
  },
  computed: {
    isYoutube () {
      return this.embed && this.embed.type === 'youtube'
    },
    isFacebook () {
      return this.embed && this.embed.type === 'facebook'
    },
    isTelegramm () {
      return this.embed && this.embed.type === 'telegramm'
    },
    isInstagramm () {
      return this.embed && this.embed.type === 'instagramm'
    },
    isTwitter () {
      return this.embed && this.embed.type === 'twitter'
    },
    isTikTok () {
      return this.embed && this.embed.type === 'tik-tok'
    },
    isEmbedInfo () {
      return !!(!isNaN(this.price) && this.time)
    }
  },
  mounted () {
    if (!this.url) return
    this.loading = true
    this.embedDefinition(this.url)
      .then(embed => {
        this.embed = embed.value
      }).finally(() => {
        this.loading = false
      })
  }
}
</script>

<style lang="scss">
  .embedded {
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    background: $white;
    border-radius: 16px;
    padding: 14px;
    margin-right: auto;
    margin-left: auto;
    width: 100%;

    &__unknown {
      width: 100%;
      @include media-desktop() {
        max-width: 570px;
        min-width: 510px;
        img {
          width: 100%;
          object-fit: cover;
        }
      }
    }
    &__loading {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      @include media-desktop() {
        max-width: 570px;
        min-width: 510px;
      }
    }

    @include media-desktop() {
      padding: 30px;
      width: auto;
      max-width: max-content;

      &__tweet {
        min-width: 540px;
      }
      &__youtube {
        min-width: 809px;
      }
      &__tik-tok {
        min-width: 687px;
        height: 100%;
      }
      &__instagram {
        min-width: 509px;
        height: 100%;
      }
      &__facebook {
        min-width: 639px;
      }
    }

    &__content {
      & .v-responsive__content > div {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100%;
      }
    }

    &__info {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: bold;
      font-size: 30px;
      color: $dark;
    }

    &__decipter {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 300;
      font-size: 18px;
    }
    & .embed {
      height: 100%;
      & blockquote {
        min-width: 100%;
      }
      & iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
