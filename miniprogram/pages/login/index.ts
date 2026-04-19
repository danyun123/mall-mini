import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { openRoute } from '../../utils/router';
import { getLoginPageData, getLoginRouteContext, loginAsRole } from './service';

Page({
  data: getLoginPageData(),
  onShow() {
    this.setData(getLoginPageData());
  },
  loginAsPurchaser() {
    const targetRoute = loginAsRole(ROLES.PURCHASER);

    this.setData(getLoginPageData());
    openRoute(targetRoute, getLoginRouteContext(), 'reLaunch');
  },
  loginAsReviewer() {
    const targetRoute = loginAsRole(ROLES.REVIEWER);

    this.setData(getLoginPageData());
    openRoute(targetRoute, getLoginRouteContext(), 'reLaunch');
  },
  goLaunch() {
    openRoute(ROUTES.LAUNCH, getLoginRouteContext(), 'reLaunch');
  },
});
