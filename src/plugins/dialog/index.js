import ViewComponent from './ViewComponent'
import RootComponent from './RootComponent'
import './style.scss'

let lastY = 1
function onMove (event) {
  const lastS = document.documentElement.scrollTop
  // сделать обход родительских элементов
  // вплоть до view__body
  // на предмет наличия в них скрола
  const target = event.target.closest('.view__body')
  if (lastS === 0 && (lastY - event.touches[0].clientY) < 0 && event.cancelable && !target.scrollTop) {
    event.preventDefault()
    event.stopPropagation()
  }
  lastY = event.touches[0].clientY
}

function onMoveEnd (event) {
  lastY = 1
}

function onEsc (event) {
  if (event.keyCode === 27 || event.key === 'Escape') {
    dialog._rootComponent.$emit('hide', { id: null, root: true })
  }
}

const dialog = {
  _parentNode: null,
  _rootComponent: null,
  _children: [],
  _cancelRouteHook: null,
  replaceChild (old, val) {
    const replaceIndex = this._children.findIndex(child => child.id === old.id)
    if (replaceIndex < 0) {
      // this is side effect
      this._push(val)
    } else {
      this._children.splice(replaceIndex, 1, val)
    }
  },
  _splice (pos) {
    if (isNaN(pos) || pos < 0 || pos > this._children.length - 1) {
      throw new Error(`dialog plugin: incorrect position ${pos}`)
    }
    this._children.splice(pos, 1)
  },
  _push (component) {
    this._children.push(component)
  },
  _getChild (id) {
    let childIndex = this._children.findIndex(child => child.id === id)
    childIndex = childIndex >= 0 ? childIndex : this._children.length - 1
    const child = this._children[childIndex]
    return { child, childIndex }
  },
  _cancel (id, isRootEvent) {
    const { child, childIndex } = this._getChild(id)
    const view = this._rootComponent.$children.find(vm => vm.id === child.id)
    if (child.persistent) {
      // TODO
      console.log('я не могу закрыться без спец. санкций')
      return
    }
    if (isRootEvent) {
      view.onClose()
      return
    }
    view.$destroy()
    this._splice(childIndex)
    if (this._children.length === 0) {
      this._rootComponent.$destroy()
      this._rootComponent.$el.remove()
      this._rootComponent = null
      lastY = 1
      window.removeEventListener('keydown', onEsc)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onMoveEnd)
      if (typeof dialog._cancelRouteHook === 'function') {
        dialog._cancelRouteHook()
        dialog._cancelRouteHook = null
      }
    }
  },
  _onOkEventHandler (data) {
    const { id, event } = data
    const { child } = this._getChild(id)
    child.okFns.forEach((fn) => {
      fn(event)
    })
  },
  async _onCancelEventHandler (data) {
    const { id, event, root } = data
    const { child } = this._getChild(id)
    child.cancelFns.forEach((fn) => {
      fn(event)
    })
    await this._cancel(id, root)
  }
}

function settingUp (component, options) {
  const {
    swipeDirection, position, mode, persistent, closeBtn, ...props
  } = options
  const id = `f${(~~(Math.random() * 1e8)).toString(16)}`
  const _obj = {
    component,
    props,
    id,
    swipeDirection,
    position,
    mode,
    persistent,
    closeBtn,
    okFns: [],
    cancelFns: [],
    API: {
      onOk (fn) {
        _obj.okFns.push(fn)
        return this
      },
      onCancel (fn) {
        _obj.cancelFns.push(fn)
        return this
      },
      hide () {
        dialog._rootComponent.$emit('hide', { id: _obj.id, root: true })
      },
      update (options) {
        const { component, ...opts } = options
        if (component) {
          const viewChild = settingUp(component, opts)
          dialog.replaceChild(_obj, viewChild)
          return viewChild.API
        }
        const {
          swipeDirection, position, mode, persistent, closeBtn, ...props
        } = opts
        _obj.props = Object.assign(_obj.props, props)
        _obj.position = position
        _obj.swipeDirection = swipeDirection
        _obj.mode = mode
        _obj.persistent = persistent
        _obj.closeBtn = closeBtn
        _obj.okFns = []
        return _obj.API
      }
    }
  }
  return _obj
}

export default {
  install (Vue, router) {
    Vue.component('app-dialog', ViewComponent)
    Vue.prototype.$dialog = function (props) {
      if (!dialog._parentNode) {
        dialog._parentNode = document.body
      }

      const { component, ...options } = props

      const viewChild = settingUp(component, options)

      if (!dialog._rootComponent) {
        dialog._push(viewChild)
        const Copmponent = Vue.extend(RootComponent)
        dialog._rootComponent = new Copmponent({
          key: JSON.stringify(props),
          propsData: {
            children: dialog._children
          }
        })

        dialog._rootComponent.$on('hide', dialog._onCancelEventHandler.bind(dialog))
        dialog._rootComponent.$on('ok', dialog._onOkEventHandler.bind(dialog))

        dialog._parentNode.appendChild(dialog._rootComponent.$mount().$el)

        /* esc handler */
        window.addEventListener('keydown', onEsc)

        /* prevented mobile scroll */
        document.addEventListener('touchmove', onMove, { passive: false })
        document.addEventListener('touchstart', onMoveEnd)

        /* handle back button */
        if (router) {
          dialog._cancelRouteHook = router.beforeEach((to, from, next) => {
            dialog._rootComponent.$emit('hide', { id: null, root: true })
            next(false)
          })
        }
      } else {
        dialog._push(viewChild)
      }
      return viewChild.API
    }
  }
}
