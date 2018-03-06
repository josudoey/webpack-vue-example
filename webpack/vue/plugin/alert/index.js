const Plug = {}
Plug.install = function (Vue, opts) {
  opts = opts || {}
  const zIndex = opts.zIndex || 16777271
  const $ = require('jquery')
  const el = opts.el
  let vm = $(el)
  if (vm.length === 0) {
    vm = $('<div style="position: fixed; right: 0; margin-bottom: 0; z-index:' + zIndex + '"></div>')
    vm.prependTo('body')
  }

  const style = {
    'success': 'alert-success',
    'info': 'alert-info',
    'warn': 'alert-warning',
    'error': 'alert-danger'
  }

  const makeAlertFunc = function (type) {
    const cls = style[type]
    return function (msg, ms) {
      ms = ms || 3000
      var el = $('<div class="alert ' + cls + '"role="alert" style="display: none; padding: 3px 6px 3px 6px; margin-bottom: 3px;">' + msg + '</div>')
      vm.append(el)
      el.slideDown(function () {
        el.delay(ms).slideUp(function () {
          el.remove()
        })
      })
    }
  }

  const $alert = Vue.prototype.$alert = makeAlertFunc('info')
  $alert.info = makeAlertFunc('info')
  $alert.success = makeAlertFunc('success')
  $alert.warn = makeAlertFunc('warn')
  $alert.error = makeAlertFunc('error')
}
module.exports = Plug
