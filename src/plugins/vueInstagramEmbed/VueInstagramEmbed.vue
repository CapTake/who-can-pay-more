<template>
  <div ref="i-root">
    <blockquote
      class="instagram-media"
      data-instgrm-captioned
      :data-instgrm-permalink="`${url}?utm_source=ig_embed&amp;utm_campaign=loading`"
      data-instgrm-version="13"
      style="
        background: #fff;
        border: 0;
        border-radius: 3px;
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5), 0 1px 10px 0 rgba(0, 0, 0, 0.15);
        margin: 1px;
        max-width: 100%;
        min-width: 326px;
        margin-left: auto;
        margin-right: auto;
        padding: 0;
        width: 99.375%;
        width: -webkit-calc(100% - 2px);
        width: calc(100% - 2px);
      "
    >
      <div style="padding: 16px">
        <a
          :href="`${url}?utm_source=ig_embed&amp;utm_campaign=loading`"
          style="
            background: #ffffff;
            line-height: 0;
            padding: 0 0;
            text-align: center;
            text-decoration: none;
            width: 100%;
          "
          target="_blank"
        >
          <div style="display: flex; flex-direction: row; align-items: center">
            <div
              style="
                background-color: #f4f4f4;
                border-radius: 50%;
                flex-grow: 0;
                height: 40px;
                margin-right: 14px;
                width: 40px;
              "
            ></div>
            <div
              style="
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                justify-content: center;
              "
            >
              <div
                style="
                  background-color: #f4f4f4;
                  border-radius: 4px;
                  flex-grow: 0;
                  height: 14px;
                  margin-bottom: 6px;
                  width: 100px;
                "
              ></div>
              <div
                style="
                  background-color: #f4f4f4;
                  border-radius: 4px;
                  flex-grow: 0;
                  height: 14px;
                  width: 60px;
                "
              ></div>
            </div>
          </div>
          <div style="padding: 19% 0"></div>
          <div style="padding-top: 8px">
            <div
              style="
                color: #3897f0;
                font-family: Arial, sans-serif;
                font-size: 14px;
                font-style: normal;
                font-weight: 550;
                line-height: 18px;
              "
            >
              View this publication in Instagram
            </div>
          </div>
          <div style="padding: 12.5% 0"></div>
          <div
            style="
              display: flex;
              flex-direction: row;
              margin-bottom: 14px;
              align-items: center;
            "
          >
            <div>
              <div
                style="
                  background-color: #f4f4f4;
                  border-radius: 50%;
                  height: 12.5px;
                  width: 12.5px;
                  transform: translateX(0px) translateY(7px);
                "
              ></div>
              <div
                style="
                  background-color: #f4f4f4;
                  height: 12.5px;
                  transform: rotate(-45deg) translateX(3px) translateY(1px);
                  width: 12.5px;
                  flex-grow: 0;
                  margin-right: 14px;
                  margin-left: 2px;
                "
              ></div>
              <div
                style="
                  background-color: #f4f4f4;
                  border-radius: 50%;
                  height: 12.5px;
                  width: 12.5px;
                  transform: translateX(9px) translateY(-18px);
                "
              ></div>
            </div>
            <div style="margin-left: 8px">
              <div
                style="
                  background-color: #f4f4f4;
                  border-radius: 50%;
                  flex-grow: 0;
                  height: 20px;
                  width: 20px;
                "
              ></div>
              <div
                style="
                  width: 0;
                  height: 0;
                  border-top: 2px solid transparent;
                  border-left: 6px solid #f4f4f4;
                  border-bottom: 2px solid transparent;
                  transform: translateX(16px) translateY(-4px) rotate(30deg);
                "
              ></div>
            </div>
            <div style="margin-left: auto">
              <div
                style="
                  width: 0px;
                  border-top: 8px solid #f4f4f4;
                  border-right: 8px solid transparent;
                  transform: translateY(16px);
                "
              ></div>
              <div
                style="
                  background-color: #f4f4f4;
                  flex-grow: 0;
                  height: 12px;
                  width: 16px;
                  transform: translateY(-4px);
                "
              ></div>
              <div
                style="
                  width: 0;
                  height: 0;
                  border-top: 8px solid #f4f4f4;
                  border-left: 8px solid transparent;
                  transform: translateY(-4px) translateX(8px);
                "
              ></div>
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              justify-content: center;
              margin-bottom: 24px;
            "
          >
            <div
              style="
                background-color: #f4f4f4;
                border-radius: 4px;
                flex-grow: 0;
                height: 14px;
                margin-bottom: 6px;
                width: 224px;
              "
            ></div>
            <div
              style="
                background-color: #f4f4f4;
                border-radius: 4px;
                flex-grow: 0;
                height: 14px;
                width: 144px;
              "
            ></div></div
        ></a>
      </div>
    </blockquote>
  </div>
</template>

<script>
export default {
  name: 'vue-instagram-embed',
  props: {
    url: String
  },
  methods: {
    init () {
      const script = document.createElement('script')
      script.async = true
      script.defer = 'defer'
      script.src = 'https://www.instagram.com/embed.js'
      const container = this.$refs['i-root']
      script.onload = function (event) {
        window.instgrm.Embeds.process()
      }
      container.appendChild(script)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
</style>
