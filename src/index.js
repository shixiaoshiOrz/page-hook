import Vue from 'vue';
import app from './app.vue';
import element from './plugins/element';
import tool from './plugins/tool';
import './style/reset.less'
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(element);
Vue.use(tool);

Vue.config.productionTip = false

Vue.prototype.$EventBus = new Vue()
    Vue.$domMonut('mainApp',app)



