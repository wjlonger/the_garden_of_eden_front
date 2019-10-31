import Vue from 'vue'
import 'babel-polyfill'
import ElementUI from 'element-ui'
import Axios from 'axios'
import NProgress from 'nprogress'
import App from './App'
import router from './router'
import _ from 'lodash'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/font-awesome-4.7.0/css/font-awesome.min.css'
import '@/assets/css/main.css'
import '@/assets/css/scrollbar.css'
import '@/assets/css/reset.css'
import 'nprogress/nprogress.css'
import 'animate.css'


import DropdownPlugin from './m/dropdown'
import NavbarPlugin from './m/navbar'
import ContextMenuPlugin from './m/context-menu'
import MButton from '@/m/button'
import MSwitch from '@/m/switch'
import MAlert from '@/m/alert'
import MCheckbox from '@/m/checkbox'
import MInput from '@/m/input'
import MLoading from '@/m/loading'
import Mkeyboard from '@/m/keyboard'
import MNumberkeyboard from '@/m/number-keyboard'
import MBox from '@/m/box'
import MBackTop from '@/m/back-top'
import MLoader from '@/m/loader'
import MContainer from '@/m/container'

Vue.use(ElementUI)
Vue.use(DropdownPlugin)
Vue.use(NavbarPlugin)
Vue.use(ContextMenuPlugin)
Vue.use(MButton)
Vue.use(MSwitch)
Vue.use(MAlert)
Vue.use(MCheckbox)
Vue.use(MInput)
Vue.use(MLoading)
Vue.use(Mkeyboard)
Vue.use(MNumberkeyboard)
Vue.use(MBox)
Vue.use(MBackTop)
Vue.use(MLoader)
Vue.use(MContainer)
Vue.prototype.lodash = _

NProgress.configure({ ease: 'ease', speed: 3000, showSpinner: true, trickleRate: 0.2, trickleSpeed: 100 })

Vue.prototype.$http = Axios
Vue.http = Axios
Vue.config.productionTip = false
window.APP_INFO = process.env.APP_INFO
window.API_ROOT = process.env.API_ROOT

router.beforeEach((to, from, next) => {
  NProgress.start()
  return next()
})

router.afterEach(transition => {
  setTimeout(() => {
    NProgress.done()
  })
})


Axios.defaults.validateStatus = status => {
  return status <= 200
}

Axios.interceptors.request.use(config => {
  NProgress.start()
  return config
})

Axios.interceptors.response.use(res => {
  NProgress.done()
  if (res.status !== 200) {
    return Promise.reject(new Error('error'))
  }
  return res
}, err => {
  app.$notify.error({
    title: '服务错误',
    message: '服务器响应错误 ' + err.message
  })
  return Promise.reject(err)
})

var app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

window.app = app
