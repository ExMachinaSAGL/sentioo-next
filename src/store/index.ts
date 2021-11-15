import { InjectionKey } from 'vue';
import { createStore, Store, Module, ModuleTree } from 'vuex';
import Notification from '../lib/Notification';

export interface State {
  notifications: Notification[]
}


export interface RootState {
  sentioo: State;
}

export const key: InjectionKey<Store<State>> = Symbol();

const state: State = {
  notifications: []
};

export const sentiooModule: Module<State, RootState> = {
  namespaced: true,
  state: state,
  mutations: {
    addNotification (state, notification) {
      const exists = state.notifications.find((n) => {
        if (n.type) {
          return n.id === notification.id && n.type === notification.type;
        } else {
          return n.id === notification.id;
        }
      });
      if (!exists) { 
        state.notifications.push(notification);
      }
    },
    deleteNotification (state, notification) {
      state.notifications = state.notifications.filter((n) => {
        if (n.type) {
          return `${n.id}|${n.type}` !== `${notification.id}|${notification.type}`; 
        } else {
          return n.id !== notification.id;
        }
      });
    },
    markRead (state, notification) {
      state.notifications.forEach((n) => {
        // match type only if exists
        if (n.id === notification.id && (!n.type || n.type === notification.type)) {
          n.unread = false;
        }
      });
    },
    markAllRead (state) {
      state.notifications.forEach((notification) => {
        notification.unread = false;
      });
    },
    deleteAll (state) {
      state.notifications = [];
    }
  },
  actions: {
    addNotification ({ commit }, notification) {
      commit('addNotification', notification);
    },
  
    deleteNotification ({ commit }, notification) {
      commit('deleteNotification', notification);
    },
  
    markRead ({ commit }, notification) {
      commit('markRead', notification);
    },
  
    markAllRead ({ commit }) {
      commit('markAllRead');
    },
  
    deleteAll ({ commit }) {
      commit('deleteAll');
    }
  },
  getters: {
    getNotifications: (state) => state.notifications
  }
};

const modules: ModuleTree<RootState> = {
  sentioo: sentiooModule
}

const store = createStore<RootState>(
  { modules }
);

export default store;