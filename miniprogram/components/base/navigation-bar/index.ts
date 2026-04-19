import { buildDisplayStyle, buildNavigationBarLayout } from './service';

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    extClass: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    background: {
      type: String,
      value: '#ffffff',
    },
    color: {
      type: String,
      value: '#12202f',
    },
    back: {
      type: Boolean,
      value: true,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    homeButton: {
      type: Boolean,
      value: false,
    },
    animated: {
      type: Boolean,
      value: true,
    },
    show: {
      type: Boolean,
      value: true,
      observer: '_showChange',
    },
    delta: {
      type: Number,
      value: 1,
    },
  },
  data: {
    displayStyle: '',
    ios: true,
    innerPaddingRight: '',
    leftWidth: '',
    safeAreaTop: '',
  },
  lifetimes: {
    attached() {
      const rect = wx.getMenuButtonBoundingClientRect();

      wx.getSystemInfo({
        success: (res) => {
          this.setData(buildNavigationBarLayout(res, rect));
        },
      });
    },
  },
  methods: {
    _showChange(show: boolean) {
      this.setData({
        displayStyle: buildDisplayStyle(show, this.data.animated),
      });
    },
    back() {
      if (this.data.delta > 0) {
        wx.navigateBack({
          delta: this.data.delta,
        });
      }

      this.triggerEvent('back', { delta: this.data.delta }, {});
    },
    home() {
      wx.reLaunch({
        url: '/pages/launch/index',
      });

      this.triggerEvent('home');
    },
  },
});
