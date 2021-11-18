<template>
  <exm-sentioo-local :server-url="baseServerUrl"></exm-sentioo-local>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from 'vue';
import ExmSentiooLocal from './ExmSentioo.vue';

export default defineComponent({
  name: 'TestSentioo',
  props: {
    serverUrl: String
  },
  components: {
      ExmSentiooLocal
  },
  setup(props) {
    let state = reactive({
      baseServerUrl: props.serverUrl
    });
    return toRefs(state);
  }
});
</script>
