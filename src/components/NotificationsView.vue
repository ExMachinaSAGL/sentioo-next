<template>
  <div class="notifications-view">
    <div class="notifications-view-header">
      <div class="notifications-view-header-bulk-icons" v-if="notifications && notifications.length">
        <span title="Mark all as read" class="notifications-read-all" @click="readAll">
          <font-awesome-icon icon="check-circle" />
        </span>
        <span title="Remove all notifications" class="notifications-remove-all" @click="removeAll">
          <font-awesome-icon icon="trash" />
        </span>
      </div>
      <div class="unread-text" v-show="showUnreadText">{{ unreadText }}</div>
    </div>
    <!--<transition-group name="list" tag="ul" class="notification-list">--><ul class="notification-list">
      <notification-item
        ref="items"
        v-for="notification in sortedNotifications"
        :base-server-url="baseServerUrl"
        :notification="notification"
        :key="notification.id">
      </notification-item>
    </ul><!--</transition-group>-->
    <div id="empty" class="list-empty" v-if="notifications.length === 0">{{ emptyText }}</div>
  </div>
</template>

<script lang="ts">
import 'whatwg-fetch';
import { reactive, toRefs, computed, defineComponent, onMounted } from 'vue';
import store from '../store';
import Notification from '../lib/Notification';
import configUtils from '../lib/configUtils';
import NotificationItem from './NotificationItem.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faTrash);
library.add(faCheckCircle);

export default defineComponent({
  name: 'notifications-view',
  components: {
    NotificationItem,
    'font-awesome-icon': FontAwesomeIcon
  },
  props: {
    baseServerUrl: String
  },
  setup(props) {
    let sortedNotifications = computed((): Notification[] => {
      return state.notifications.slice().sort((a: any, b: any) => {
        return new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime();
      });
    });

    let unreadCount = computed((): number => {
      const count: number = state.notifications.filter((n: Notification) => {
        return n.unread;
      }).length;
      return count;
    });

    let showUnreadText = computed((): boolean => {
      return configUtils.config.showUnreadText;
    });

    let unreadText = computed((): string => {
      const count: number = unreadCount.value;
      const plural: string = (count > 1) ? 's' : '';

      const importantCount: number = state.notifications.filter((n: Notification) => {
        const maxLength = configUtils.config.levels.length - 1;
        return (n.priority === maxLength) && n.unread;
      }).length;

      const important: string = importantCount > 0
        ? ` (${importantCount} important)`
        : ``;

      return (count > 0)
        ? `${count} unread notification${plural}${important}`
        : '';
    });

    const markAllRead = () => {
      store.dispatch('sentioo/markAllRead');
    };

    const deleteAll = () => {
      store.dispatch('sentioo/deleteAll');
    };

    const readAll = (): void => {
      fetch(`${props.baseServerUrl}/readAll`, {
        method: 'POST',
        credentials: 'include'
      }).then((res) => {
        if (res.status === 200) {
          markAllRead();
        }
      })
    };

    const removeAll = (): void => {
      fetch(`${props.baseServerUrl}/deleteAll`, {
        method: 'POST',
        credentials: 'include'
      }).then((res) => {
        if (res.status === 200) {
          deleteAll();
        }
      })
    }

    let state = reactive({
      emptyText: 'There are no unread notifications.',
      notifications: store.state.sentioo.notifications,
      sortedNotifications,
      showUnreadText,
      unreadText,
      readAll,
      removeAll
    });

    onMounted(() => {
      // Workaround for the issue of the notification list not correctly updating
      store.subscribe((mutation, storeState) => {
        state.notifications = storeState.sentioo.notifications;
      });
    });

    return toRefs(state);
  }
});
</script>

<style lang="scss">
@import '../theme/notifications-list.scss';

.notifications-view {
  @include container;

  ul {
    @include list;
  }

  .unread-text {
    @include unread-text;
  }

  .list-move {
    @include list-move;
  }

  .list-enter-active {
    @include list-enter-active;
  }

  .list-enter {
    @include list-enter;
  }

  .notifications-view-header {
    @include list-header;
  }

  .notifications-remove-all {
    @include list-remove-all-btn;
  }

  .notifications-read-all {
    @include list-read-all-btn;
  }

  .list-empty {
    @include list-empty;
  }
}
</style>
