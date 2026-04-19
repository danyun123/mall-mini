import { currentEnv } from '../../config/index';
import { getLaunchPageData } from './service';

Page({
  data: getLaunchPageData(currentEnv.appEnv),
  onShow() {
    this.setData(getLaunchPageData(currentEnv.appEnv));
  },
});
