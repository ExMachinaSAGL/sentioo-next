import { App, Plugin, createApp } from "vue";
import store from './store';
import ExmSentioo from './components/ExmSentioo.vue';
import { sentiooModule } from './store/index';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBell, faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faBell);
library.add(faTrash);
library.add(faCheckCircle);

const install = function (Vue: App): void {
    Vue.component('ExmSentioo', ExmSentioo as any);
};

const ExmSentiooNext: Plugin = {
    install
};

createApp(ExmSentioo)
.use(store)
.component('font-awesome-icon', FontAwesomeIcon);

export const sentiooStore = sentiooModule;

export default ExmSentiooNext;

export {
    ExmSentioo
};
