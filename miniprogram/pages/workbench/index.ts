import { ROUTES } from '../../constants/routes';
import { openRoute } from '../../utils/router';
import {
  canVisitWorkbench,
  getWorkbenchPageData,
  getWorkbenchRouteContext,
  logoutFromWorkbench,
} from './service';

Page({
  data: getWorkbenchPageData(),
  onShow() {
    if (!canVisitWorkbench()) {
      openRoute(ROUTES.LOGIN, getWorkbenchRouteContext(), 'reLaunch');
      return;
    }

    this.setData(getWorkbenchPageData());
  },
  goHome() {
    openRoute(ROUTES.HOME, getWorkbenchRouteContext(), 'reLaunch');
  },
  logout() {
    logoutFromWorkbench();
    this.setData(getWorkbenchPageData());
    openRoute(ROUTES.LOGIN, getWorkbenchRouteContext(), 'reLaunch');
  },
});
