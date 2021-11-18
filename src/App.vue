<template>
  <exm-sentioo :server-url="serverUrl"></exm-sentioo>
  {{ serverUrl }}
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
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
