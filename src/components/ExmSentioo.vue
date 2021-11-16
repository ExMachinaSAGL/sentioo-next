<template>
  <div class="sentioo">
    {{ label }}
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from 'vue';

export default defineComponent({
  name: 'ExmSentioo',
  props: {
    serverUrl: String
  },
  setup(props: { serverUrl: any; }) {
    let state = reactive({
      label: props.serverUrl
    });

    return toRefs(state);
  }
});
</script>

<style lang="scss" scoped>
@import '../theme/sentioo.scss';

.sentioo {
  @include app;
}

.notifications-toggle {
  @include notifications-toggle;
}

.toggle-enter-active, .toggle-leave-active {
  @include toggle-animation-transition;
}
.toggle-enter, .toggle-leave-to {
  @include toggle-animation-start;
}
</style>
