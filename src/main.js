import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import NutUI from "@nutui/nutui";
import "@nutui/nutui/dist/style.css";

const app = createApp(App);

app.use(store).use(router).use(NutUI).mount('#app')