import ViewComponent from './ViewComponent'
// import Vue from 'vue'
export default {
  name: 'dialogRoot',
  props: {
    children: {
      type: Array,
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    getContent (h) {
      const _this = this
      return this.children.map((child) => {
        const on = {
          hide (event) {
            _this.$emit('hide', event)
          },
          ok (event) {
            _this.$emit('ok', event)
          }
        }
        const {
          id, position, mode, swipeDirection, closeBtn, persistent
        } = child
        const opts = {
          key: child.id,
          props: {
            id,
            position,
            mode,
            swipeDirection,
            closeBtn,
            persistent
          },
          on,
          scopedSlots: {
            default: () => {
              return h(child.component, {
                props: child.props,
                on: {
                  hide (event) {
                    _this.$emit('hide', { id: child.id, event })
                  },
                  ok (event) {
                    _this.$emit('ok', { id: child.id, event })
                  }
                }
              })
            }
          }
        }
        return h(ViewComponent, opts)
      })
    }
  },
  render (h) {
    const _this = this
    if (!this.children.length) {
      return null
    }

    return h('div', {
      staticClass: 'dialog-root',
      on: {
        click (event) {
          const { target } = event
          if (
            !(target.classList.contains('dialog-root') ||
            target.classList.contains('dialog__view-presenter'))
          ) return
          const vmTarget = _this.children[_this.children.length - 1]
          if (vmTarget.persistent) return
          _this.$emit('hide', { id: null, root: true })
        }
      }
    }, [this.getContent(h)])
  }
}
