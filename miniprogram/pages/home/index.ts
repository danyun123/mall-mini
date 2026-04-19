import { ROUTES } from '../../constants/routes';
import { openRoute } from '../../utils/router';
import { canVisitHome, getHomePageData, getHomeRouteContext, logoutFromHome } from './service';

Page({
  data: getHomePageData(),
  onShow() {
    if (!canVisitHome()) {
      openRoute(ROUTES.LOGIN, getHomeRouteContext(), 'reLaunch');
      return;
    }

    this.setData(getHomePageData());
  },
  goWorkbench() {
    openRoute(ROUTES.WORKBENCH, getHomeRouteContext(), 'navigateTo');
  },
  logout() {
    logoutFromHome();
    this.setData(getHomePageData());
    openRoute(ROUTES.LOGIN, getHomeRouteContext(), 'reLaunch');
  },
});
