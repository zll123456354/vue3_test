import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import NutUI from "@nutui/nutui";
import ElementPlus from 'element-plus';
import { IconFont } from '@nutui/icons-vue';
import '@nutui/icons-vue/dist/style_iconfont.css';
import 'element-plus/dist/index.css';
import "@nutui/nutui/dist/style.css";

const app = createApp(App);

app.use(store).use(ElementPlus).use(router).use(IconFont).use(NutUI).mount('#app')