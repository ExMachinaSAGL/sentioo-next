<template>
  <li  @mouseover="hovered = true"
        @mouseout="hovered = false"
        class="notification-item"
        :class="[notification.unread ? '' : 'notification-read']"
        :style="{ backgroundColor: backgroundColor }">
    <div class="notification-actions">
      <i title="Delete notification" @click="removeNotification"><font-awesome-icon icon="trash" /></i>
      <i title="Mark as read" @click="readNotification"><font-awesome-icon icon="check-circle" /></i>
    </div>
    <div class="notification-header">
      <div class="icon-container">
        <div class="notification-icon" :style="{ backgroundColor: iconColor }">
          <font-awesome-icon :icon="iconClass" />
        </div>
      </div>
      <div class="notification-content">
        <p :class="[notification.unread ? 'notification-title-unread' : 'notification-title-read']">
          {{ notification.title }}
        </p>
        <p class="notification-datetime">
          <span>Date &amp; Time:</span>
          {{ notificationValidity }}
        </p>
        <p class="notification-text">
          <span v-html="excerpt"></span>
          <span v-if="showMore || expanded" class="excerpt-btn" @click="toggleExpand">{{expanded ? ' (show less)' : ' (show more)'}}</span>
        </p>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import 'whatwg-fetch';
import linkifyHtml from 'linkify-html';
import { reactive, toRefs, computed, defineComponent, PropType } from 'vue';
import store from '../store';
import Notification from '../lib/Notification';
import configUtils from '../lib/configUtils';
import datetimeFilter from '../lib/datetimeFilter';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faCheckCircle, faEnvelope, faExclamation, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

library.add(faTrash);
library.add(faCheckCircle);
library.add(faEnvelope);
library.add(faExclamation);
library.add(faExclamationTriangle);

export default defineComponent({
  name: 'notification-item',
  props: {
    notification: {
      type: Object as PropType<Notification>,
      default: () => {
        return {};
      }
    },
    baseServerUrl: String
  },
  components: {
    'font-awesome-icon': FontAwesomeIcon
  },
  setup(props) {
    let notificationValidity = computed((): string => {
      return datetimeFilter(props?.notification?.validFrom);
    });

    let iconClass = computed((): string => {
      if (props.notification) {
        const priority: number = props.notification.priority;
        return configUtils.getLevel(priority).icon;
      }
      return '';
    });

    let iconColor = computed((): string => {
      if (props.notification) {
        const priority: number = props.notification.priority;
        return configUtils.getIconColor(priority);
      }
      return '';
    });

    let backgroundColor = computed((): string => {
      if (props.notification) {
        const priority: number = props.notification.priority;
        const background: string = configUtils.getLevel(priority).backgroundColor;
        const hover: string = configUtils.getLevel(priority).hoverColor;
        return state.hovered || !props.notification.unread ? hover : background;
      }
      return '';
    });

    let excerpt = computed((): string => {
      if (props.notification) {
        const text: string = props.notification.text || '';
        if (text.length > state.maxTextLength && !state.expanded) {
          return `${text.substring(0, state.maxTextLength)}...`;
        } else {
          return linkifyHtml(text, {});
        }
      } else return '';
    });

    let showMore = computed((): boolean => {
      const text: string = props?.notification?.text || '';
      if (text.length > state.maxTextLength && !state.expanded) {
        return true;
      }
      else {
        return false;
      }
    });

    const markRead = (n: Notification) => {
      store.dispatch('sentioo/markRead', n);
    };

    const deleteNotification = (n: Notification) => {
      store.dispatch('sentioo/deleteNotification', n);
    };

    const readNotification = (): void => {
      if (!props.notification.unread) return;
      const url = `${props.baseServerUrl}/${props.notification.id}/read${configUtils.getParams(props.notification, 'read')}`;
      fetch(url, {
        method: 'POST',
        credentials: 'include'
      }).then((res) => {
        if (res.status === 200) { markRead(props.notification); }
      });
    };

    const removeNotification = (): void => {
      fetch(`${props.baseServerUrl}/${props.notification.id}/delete${configUtils.getParams(props.notification, 'delete')}`, {
        method: 'POST',
        credentials: 'include'
      }).then((res) => {
        if (res.status === 200) { deleteNotification(props.notification); }
      });
    };

    const toggleExpand = (): void => {
      state.expanded = !state.expanded;
    }

    let state = reactive({
      expanded: false,
      hovered: false,
      maxTextLength: configUtils.config.excerptSize,
      notificationValidity,
      iconClass,
      iconColor,
      backgroundColor,
      excerpt,
      showMore,
      readNotification,
      removeNotification,
      toggleExpand
    });

    return toRefs(state);
  }
});
</script>

<style lang="scss">
@import '../theme/notification.scss';

.notification-item {
  @include container;

  .notification-actions {
    font-size: 18px;
    position: absolute;
    top: 5px;
    right: 5px;
    width: auto;
    padding: 0 5px;

    * {
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }

    .fa-check-circle {
      padding-left: 2px;
    }
  }

  &.notification-read {
    background-color: #eee!important;
    opacity: 0.6!important;
    &:hover {
      opacity: 1!important;
    }
  }
}

.notification-header {
  @include header;
}

.notification-content {
  @include notification-content;
}

.notification-icon {
  @include icon;
}

.notification-title-unread {
  @include title-unread;
}

.notification-title-read {
  @include title-read;
}

.notification-btn-container {
  @include btn-container;
}

.notification-text {
  @include text;

  .excerpt-btn {
    text-transform: uppercase;
    color: #B84322;
    font-weight: bold;
    cursor: pointer;
    display: block;
  }
}

.notification-btn {
  @include button;
}

.icon-container {
  @include icon-container;
}
</style>
