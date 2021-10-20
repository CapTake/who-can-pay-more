export default {
  methods: {
    /* определение принадлежности к ресурсу */
    async embedDefinition (resourse) {
      const iterator = this._checkEmbed(resourse)
      let result = null
      while (!result) {
        const res = await iterator.next()
        result = res && res.value ? res : null
        if (res.done) break
      }
      return result
    },
    _checkEmbed: async function * (url) {
      yield await this._checkYouTube(url)
      yield await this._checkFacebook(url)
      /* yield await this._checkTelegramm(url) */
      yield await this._checkInstagramm(url)
      yield await this._checkTikTok(url)
      yield await this._checkTwitter(url)
    },
    /* Проверка тик-ток */
    async _checkTikTok (url) {
      if (!url.startsWith('https://www.tiktok.com')) {
        return null
      }
      return { url, type: 'tik-tok' }
    },
    /* Проверка Инстаграмм */
    async _checkInstagramm (url) {
      if (!url.startsWith('https://www.instagram.com')) {
        return null
      }
      const link = url.split('?')
      return { url: link[0], type: 'instagramm' }
    },
    /* Проверка facebook */
    async _checkFacebook (url) {
      // https://m.facebook.com/story.php?story_fbid=10159271922923116&id=713593115
      if (!(url.startsWith('https://www.facebook.com') || url.startsWith('https://m.facebook.com'))) {
        return null
      }
      const normalizeUrl = decodeURIComponent(url)
      const urlObj = new URL(normalizeUrl)
      return { url: urlObj.searchParams.get('href') || url, type: 'facebook' }
    },
    /* проверка twitter */
    async _checkTwitter (url) {
      if (!(url.startsWith('https://twitter.com') || url.startsWith('https://mobile.twitter'))) {
        return null
      }
      if (url.includes('events')) {
        return null
      }
      const path = new URL(url).pathname
      const id = path.split('/').reverse()[0]
      return { url, id, type: 'twitter' }
    },
    /* Проверка телеграмм */
    async _checkTelegramm (url) {
      if (!url.includes('https://t.me')) {
        return null
      }
      const path = url.split('/').splice(-2).join('/')
      return { url: path, type: 'telegramm' }
    },
    /* Проверка ютуб */
    async _checkYouTube (url) {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
      const match = url.match(regExp)
      const videoId = (match && match[7].length === 11) ? match[7] : null
      return videoId ? { url, type: 'youtube', videoId } : null
    }
  }
}
