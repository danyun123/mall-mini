import { action, observable } from 'mobx-miniprogram';

const state = observable({
  unreadCount: 0,
  subscriptionReady: false,
});

export const messageStore = {
  state,
  setUnreadCount: action((count: number) => {
    state.unreadCount = count;
  }),
  setSubscriptionReady: action((ready: boolean) => {
    state.subscriptionReady = ready;
  }),
  reset: action(() => {
    state.unreadCount = 0;
    state.subscriptionReady = false;
  }),
};
