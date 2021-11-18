<template>
  <div class="notification-top-bar">
    <div class="icon-container">
      <div class="notification-icon" :style="{ backgroundColor: iconColor }">
        <i><font-awesome-icon icon="bell" /></i>
      </div>
      <div class="unread-badge" v-if="unreadCount > 0">{{ unreadBadge }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, computed, defineComponent, onMounted } from 'vue';
import store from '../store';
import Notification from '../lib/Notification';
import configUtils from '../lib/configUtils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBell } from '@fortawesome/free-solid-svg-icons';

library.add(faBell);

export default defineComponent({
  name: 'notification-top-bar',
  props: {
    showNotifications: Boolean
  },
  components: {
    'font-awesome-icon': FontAwesomeIcon
  },
  setup() {
    // Returns the notification with the highest priority
    const mostImportantNotification = (): Notification => {
      return state.notifications.reduce((prev: Notification, current: Notification) => {
        return prev.priority > current.priority ? prev : current;
      });
    };

    let notifications = computed((): Notification[] => {
      // return store.getters['sentioo/getNotifications'];
      return store.state.sentioo.notifications;
    });

    let unreadBadge = computed((): number|string => {
      return state.unreadCount > 99 ? `${99}+` : state.unreadCount;
    });

    let iconColor = computed((): string => {
      if (state.notifications.length > 0 && configUtils.config.dynamicIconColor) {
        const top: Notification = mostImportantNotification();
        return configUtils.getLevel(top.priority).color;
      }
      return '';
    });

    let state = reactive({
      emptyText: 'There are no unread notifications.',
      unreadCount: 0,
      notifications,
      unreadBadge,
      iconColor
    });

    onMounted(() => {
      // WORKAROUND: solves the issue of not always updating the unread count on notifications array mutation.
      store.subscribe((_mutation: any, storeState: any) => {
        const count: number = storeState.sentioo.notifications.filter((n: Notification) => { return n.unread; }).length;
        state.unreadCount = count;
      });
    });

    return toRefs(state);
  }
});
</script>

<style lang="scss" scoped>
@import '../theme/notification-top-bar.scss';

.notification-icon {
  @include notification-icon;
  > i {
    line-height: 26px;
  }
}

.notification-top-bar {
  @include container;
}

.unread-badge {
  @include unread-badge;
}
</style>
