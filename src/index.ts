import { App, Plugin } from "vue";
import ExmSentioo from './components/ExmSentioo.vue';
import { sentiooModule } from './store/index';

const install = function (Vue: App): void {
    Vue.component('ExmSentioo', ExmSentioo as any);
};

const ExmSentiooNext: Plugin = {
    install
};

export const sentiooStore = sentiooModule;

export default ExmSentiooNext;

export {
    ExmSentioo
};
