// ref https://vuex.vuejs.org/en/api.html
const Vue = require('vue').default
const Vuex = require('vuex').default
Vue.use(Vuex)

const store = {}

store.mutations = {}

store.actions = {}

store.getters = {}

exports = module.exports = new Vuex.Store(store)
