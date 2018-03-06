
exports = module.exports = {
  template: require('./template.html'),
  data: function () {
    return {
      message: ''
    }
  },
  watch: {

  },
  created: async function () {

  },
  destroyed: function () {

  },
  filters: {

  },
  computed: {

  },
  methods: {
    alert: function () {
      this.$alert(this.message)
    }
  }
}
