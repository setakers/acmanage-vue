// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// Element UI library
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//Echarts
import echarts from 'echarts'
// Vue application
import App from './App';
// Routing
import router from './router';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
