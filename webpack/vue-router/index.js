
const Vue = require('vue').default
const VueRouter = require('vue-router').default
Vue.use(VueRouter)

const page404 = function (resolve) {
  resolve({
    template: '<h1>page not found</h2>',
    data: function () {
      return {}
    }
  })
}

exports = module.exports = new VueRouter({
  base: '/',
  mode: 'hash',
  linkActiveClass: 'router-link-active',
  routes: [ {
    name: 'index',
    path: '/',
    component: function (resolve) {
      require(['../vue/pages/index'], resolve)
    }
  }, {
    name: '404',
    path: '/:any*',
    component: page404
  }]
})
