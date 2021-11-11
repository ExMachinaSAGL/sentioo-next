<template>
  <div class="sentioo">
      Cose che cosano cose qui!
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';

export default {
    name: 'Sentioo',
    setup() {
        let state = reactive({});
        return toRefs(state);
    }
};
</script>

<style lang="scss" scoped>
@import '../theme/sentioo.scss';

.sentioo {
  @include app;
}
</style>
