<template>
  <div class="sentioo">
    <a href="#" title="Toggle notifications" class="notifications-toggle" @click="toggleNotifications">
      <notification-top-bar :show-notifications="showNotifications"></notification-top-bar>
    </a>
    <transition name="toggle">
      <notifications-view
        id="notifications-view"
        v-if="showNotifications"
        :base-server-url="baseServerUrl"
        v-click-away="closeDropdown">
      </notifications-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, computed, defineComponent, PropType, onMounted } from 'vue';
// import { useStore } from 'vuex';
import store from '../store';
import { mixin as clickaway } from "vue3-click-away";
import Notification from '../lib/Notification';
import configUtils from '../lib/configUtils';
import { ConfigFile } from '../lib/configUtils';
import { SSEConnection, SSEEvent, SSEReadyStates } from '../lib/SSEConnection';
import NotificationTopBar from './NotificationTopBar.vue';
import NotificationsView from './NotificationsView.vue';

interface PropsState {
  connection: SSEConnection | null | undefined,
  showNotifications: boolean,
  baseServerUrl: string | null | undefined,
  sseServerUrl: string,
  reconnectTimeout: number
}

export default defineComponent({
  name: 'ExmSentioo',
  components: {
    NotificationsView,
    NotificationTopBar
  },
  props: {
    configProp: Object as PropType<ConfigFile>,
    serverUrl: String
  },
  mixins: [
    clickaway
  ],
  setup(props) {
    // const store = useStore();

    const closeDropdown = (): void => {
      state.showNotifications = false;
    };

    const toggleNotifications = (): void => {
      state.showNotifications = !state.showNotifications;
    }

    const addNotification = (n : Notification) => {
      store.dispatch('sentioo/addNotification', n);
    };

    const stopEvtSource = (): void => {
      if (state.connection) {
        state.connection.close();
      }
    };

    const handleDisconnects = (): void => {
      if (state.connection) {
        const readyState: number = state.connection.readyState;

        // WORKAROUND: IE10 and FF try to reconnect only once,
        // in that case the readyState is "CLOSED" => manually reconnect
        if (readyState === SSEReadyStates.CLOSED) {
          state.connection.close();
          setTimeout(() => {
            // re-do everything
            startEvtSource(); 
          }, state.reconnectTimeout);
        }
      }
    };

    const startEvtSource = (): void => {
      state.connection = new SSEConnection(state.sseServerUrl);
      state.connection.on('notify', (evt: SSEEvent) => {
        // console.log('Received notify event');
        const notification: Notification = JSON.parse(evt.data);
        addNotification(notification);
      });
      // Handles heartbeat event, sent from server every few seconds
      // to keep the SSE connection alive for older browsers
      // (see https://github.com/Yaffle/EventSource#server-side-requirements)
      state.connection.on('heartbeat', (/*evt: SSEEvent*/) => {
        // console.log('Heartbeat');
      });
      state.connection.onOpen((/*evt: SSEEvent*/) => {
        // console.log('Connection open');
        // console.log(this.connection.source.readyState);
      });
      state.connection.onError((/*evt: SSEEvent*/) => {
        handleDisconnects();
      });
      state.connection.onClose((/*evt: SSEEvent*/) => {
        stopEvtSource();
      });

      window.addEventListener('beforeunload', (/*evt: any*/) => {
        stopEvtSource();
      });
    };

    let state: PropsState = reactive({
      connection: null,
      showNotifications: false,
      baseServerUrl: props.serverUrl,
      sseServerUrl: `${props.serverUrl}/${'subscribe'}`,
      reconnectTimeout: 5000,
      closeDropdown,
      toggleNotifications
    });

    onMounted(() => {
      // override config if passed as a prop
      if (props.configProp) { 
        configUtils.overrideConfig(props.configProp);
      }

      startEvtSource();

      window.addEventListener('keypress', (evt) => {
        const k: any = evt.key || evt.keyCode;
        const key: number = parseInt(k);
        // Close notification dropdown on ESC keypress
        if (key === 27 && state.showNotifications) {
          closeDropdown();
        }
      });
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
