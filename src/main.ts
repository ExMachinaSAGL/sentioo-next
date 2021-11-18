import { createApp } from 'vue';
import App from './App.vue';


import 'sentioo-vue-3/dist/lib/sentioo.css';
import ExmSentioo from 'sentioo-vue-3';


createApp(App)
.use(ExmSentioo)
.mount('#app');
