import { currentEnv } from '../../config/index';
import { ROUTES } from '../../constants/routes';
import { openRoute } from '../../utils/router';
import { getLaunchPageData, getLaunchRouteContext } from './service';

Page({
  data: getLaunchPageData(currentEnv.appEnv),
  onShow() {
    this.setData(getLaunchPageData(currentEnv.appEnv));
  },
  goLogin() {
    openRoute(ROUTES.LOGIN, getLaunchRouteContext(), 'navigateTo');
  },
  goHome() {
    openRoute(ROUTES.HOME, getLaunchRouteContext(), 'navigateTo');
  },
  goWorkbench() {
    openRoute(ROUTES.WORKBENCH, getLaunchRouteContext(), 'navigateTo');
  },
});
