import { createApp } from 'vue';
import App from './App.vue';
// import store from './store';


import 'sentioo-vue-3/dist/lib/sentioo.css';
import ExmSentioo from 'sentioo-vue-3';


createApp(App)
// .use(store)
.use(ExmSentioo)
.mount('#app');
