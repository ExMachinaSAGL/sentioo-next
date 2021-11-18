<template>
  <div>Subscribe URL: {{ serverUrl }}</div>

  <div class="from-npm-module">
    <h4>From NPM module</h4>
    <exm-sentioo :server-url="serverUrl"></exm-sentioo>
  </div>

  <div class="from-local-component">
    <h4>From local component</h4>
    <test-sentioo :server-url="serverUrl"></test-sentioo>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from 'vue';
import TestSentioo from './components/TestSentioo.vue';

export default defineComponent({
  name: 'App',
  components: {
    TestSentioo
  },
  setup() {
    let state = reactive({
      serverUrl: 'http://localhost:3000/notifications/LOCATIONS'
    });

    return toRefs(state);
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
