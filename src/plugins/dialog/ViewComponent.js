// import BaseButton from '@components/controls/BaseButton';
// import Icon from '@components/Icon';

export default {
  // Продумать анимацию на цсс
  // Продумать анимацию скрытия/появления (независимо от свайпа)
  // Думаю анимации и обработки соответствующих событий
  // вынести в RootComponent, что-бы не переусложнять этот
  name: 'app-modal',
  props: {
    id: {
      type: String,
      required: true
    },
    /* определяет направление свайпа или его отсутствие */
    swipeDirection: {
      type: String,
      default: 'none',
      validator (val) {
        return [
          'left',
          'right',
          'top',
          'bottom',
          'none'
        ].includes(val)
      }
    },
    /* определяет позицию окна */
    /* работает только в режиме normal */
    /* в режиме sheet принудительно выставляется bottom */
    position: {
      type: String,
      default: 'center',
      validator (val) {
        return [
          'top',
          'center',
          'bottom',
          'top-left',
          'top-right',
          'center-right',
          'center-left',
          'bottom-left',
          'bottom-right'
        ].includes(val)
      }
    },
    /* определяет тип окна */
    mode: {
      type: String,
      default: 'normal',
      validator (val) {
        return [
          'menu',
          'fullscreen',
          'normal',
          'sheet'
        ].includes(val)
      }
    },
    /* возможность закрытия окна иначе чем по кнопке закрыть (если она есть :)) ) */
    /* не работает в режиме sheet */
    persistent: Boolean,
    /* наличие кнопки(крестика) закрытия */
    /* в режиме sheet представляется как swiper */
    closeBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      proxiProps: {},
      yPosition: 0,
      moveStartPosition: null,
      contentHeight: null,
      limit: 50,
      closingProcess: false,
      animationSpeed: 500,
      hasScroll: false
    }
  },
  computed: {
    /* applied params */
    appliedSwipeDirection () {
      return this.proxiProps.swipeDirection || this.swipeDirection
    },
    appliedPosition () {
      return this.proxiProps.position || this.position
    },
    appliedMode () {
      return this.proxiProps.mode || this.mode
    },
    appliedPersistent () {
      return 'persistent' in this.proxiProps ? this.proxiProps.persistent : this.persistent
    },
    appliedCloseBtn () {
      return 'closeBtn' in this.proxiProps ? this.proxiProps.closeBtn : this.closeBtn
    },
    /* computed props */
    isPositionApply () {
      return !(this.appliedMode === 'fullscreen' && this.appliedMode === 'menu')
    },
    isCloseBtn () {
      return (this.appliedMode === 'normal' || this.appliedMode === 'sheet') && this.appliedCloseBtn
    },
    cmpPosition () {
      return this.appliedMode === 'sheet' ? 'bottom' : this.appliedPosition
    },
    cmpSwipeDirection () {
      return (/* this.appliedMode === 'normal' || */ this.appliedMode === 'sheet') ? this.appliedMode : 'none'
    },
    /* for animation */
    contentTransformed () {
      const y = `${this.yPosition}px`
      const value = {
        transform: `translate3d(0px, ${y}, 0px)`
      }
      if (this.yPosition === 0) {
        value.transition = 'transform .2s cubic-bezier(0.95, 0.05, 0.795, 0.035)'
      }
      return value
    },
    /* % пройденного пути */
    passed () {
      if (!this.contentHeight) return 0
      return this.yPosition / (this.contentHeight / 100)
    }
  },
  methods: {
    renderCloseBtn (h) {
      const _this = this
      return h('button', {
        staticClass: 'view__close',
        props: {
          unstyled: true
        },
        on: {
          click (event) {
            _this.onClose()
          }
        }
      }/* , [h(Icon, { props: { name: 'Сrosshair', color: 'color-white' } })] */)
    },
    renderSwiper (h) {
      return h('div', {
        staticClass: 'view__swiper'
      })
    },
    renderBody (h) {
      const body = this.$scopedSlots.default()[0]
      return h('div', {
        staticClass: 'view__body',
        ref: 'body'
      }, [h('div', { staticClass: 'view__body__header', ref: 'header' }), body])
    },
    renderHeader (h) {
      if (!this.isCloseBtn) {
        return null
      }
      const elInside = this.appliedMode === 'sheet' ? this.renderSwiper(h) : this.renderCloseBtn(h)
      return h('div', {
        staticClass: 'view__header'
      }, [elInside])
    },
    hide (progress) {
      const s = this.contentHeight
      const distance = (s / 100) * Math.abs(progress * 100)
      if (this.closingProcess) {
        this.yPosition += distance
      } else {
        this.yPosition = distance
      }
    },
    // перенести в utils -> animate
    quad (timeFraction) {
      return timeFraction ** 5
    },
    elastic (x, timeFraction) {
      return 2 ** (10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction)
    },
    makeEaseOut (timing) {
      return function (timeFraction) {
        return 1 - timing(1 - timeFraction)
      }
    },
    animate ({
      timing, draw, duration, end
    }) {
      const start = performance.now()

      const animate = (time) => {
        let timeFraction = (time - start) / duration
        if (timeFraction > 1) timeFraction = 1

        const progress = timing(timeFraction)
        draw(progress)

        if (timeFraction < 1) {
          requestAnimationFrame(animate)
        } else {
          typeof end === 'function' && end()
        }
      }

      requestAnimationFrame(animate)
    },
    // =================================
    onClose () {
      if (this.cmpSwipeDirection !== 'none') {
        this.animate({
          timing: this.makeEaseOut(this.quad),
          draw: this.hide,
          duration: this.animationSpeed,
          end: () => { this.$emit('hide', { id: this.id }) }
        })
      } else {
        this.$emit('hide', { id: this.id })
      }
    },
    _getClientY (event) {
      if (!(event instanceof TouchEvent || event instanceof MouseEvent)) {
        console.warn('Unknown event type, it is impossible to get clientY')
        return undefined
      }
      return event instanceof TouchEvent ? event.targetTouches[0].clientY : event.clientY
    },
    reset () {
      this.yPosition = 0
      this.moveStartPosition = null
      this.closingProcess = false
    },
    onStartMove (event) {
      if (this.closingProcess) return
      // document.body.style.overflow = 'hidden'
      this.moveStartPosition = this._getClientY(event)
      const targetEl = event.target.closest('.view__body')
      this.hasScroll = !!targetEl.scrollTop
    },
    onEndMove (event) {
      if (this.closingProcess) return
      this.reset()
    },
    onMove (event) {
      if (this.closingProcess || this.hasScroll) return
      /* event.preventDefault() */
      /* event.stopPropagation() */
      const y = this._getClientY(event)
      this.yPosition = y - this.moveStartPosition
      if (this.yPosition <= 0) this.yPosition = 0
      if (this.limit < this.passed) {
        this.closingProcess = true
        this.onClose()
      }
    }
  },
  mounted () {
    const VNode = this.$scopedSlots.default()[0]
    this.proxiProps = new VNode.componentOptions.Ctor()
    this.proxiProps.$mount()
    const header = this.$refs.body.querySelector('[data-id=header]')
    if (header) {
      this.$refs.header.appendChild(header)
    }
    this.$nextTick(() => {
      this.contentHeight = this.$refs.body.offsetHeight
    })
  },
  render (h) {
    const on = {}
    if (this.cmpSwipeDirection !== 'none') {
      on.touchstart = this.onStartMove
      on.touchmove = this.onMove
      on.touchend = this.onEndMove
    }
    return h('div', {
      staticClass: 'dialog__view-presenter',
      class: [
        {
          'dialog__view-presenter--indents': this.appliedMode === 'normal',
          [`view-position__${this.cmpPosition}`]: this.isPositionApply
        }
      ]
    }, [h('div', {
      staticClass: 'view',
      style: this.contentTransformed,
      class: [
        `view--${this.appliedMode}`
      ],
      on
    }, [this.renderHeader(h), this.renderBody(h)])])
  }
}
