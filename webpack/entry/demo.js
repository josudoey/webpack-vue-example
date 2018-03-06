require('bootstrap/dist/css/bootstrap.css').use()
require('nprogress/nprogress.css').use()
const NProgress = window.NProgress = require('nprogress')
NProgress.start()

const main = async function () {
  const Vue = window.Vue = require('vue').default
  Vue.use(require('../vue/plugin/alert'))
  Vue.use(require('bootstrap-vue'))
  require('../vue-axios')
  const router = require('../vue-router')
  const store = require('../vuex')

  router.afterEach(function (to, from) {})

  router.beforeEach(function (to, from, next) {
    NProgress.done()
    next()
  })

  window.vm = new Vue({
    router: router,
    store: store
  }).$mount('#app')
}

window.addEventListener('load', function load (event) {
  main()
})
