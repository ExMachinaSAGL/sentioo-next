import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBell, faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faBell);
library.add(faTrash);
library.add(faCheckCircle);

createApp(App)
.use(store)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app');
