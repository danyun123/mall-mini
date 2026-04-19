import type { RouteMeta } from '../types/route';
import { appStore } from '../stores/app.store';
import { canAccessRoute, type RouteAccessContext } from './guard';

export type NavigationMethod = 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab';

const navigate = (url: string, method: NavigationMethod): void => {
  if (method === 'redirectTo') {
    wx.redirectTo({ url });
    return;
  }

  if (method === 'reLaunch') {
    wx.reLaunch({ url });
    return;
  }

  if (method === 'switchTab') {
    wx.switchTab({ url });
    return;
  }

  wx.navigateTo({ url });
};

export const openRoute = (
  route: RouteMeta,
  context: RouteAccessContext,
  method: NavigationMethod = 'navigateTo',
): boolean => {
  if (!canAccessRoute(route, context)) {
    wx.showToast({
      title: route.requiresAuth && !context.isAuthenticated ? '请先登录' : '暂无权限',
      icon: 'none',
    });
    return false;
  }

  appStore.setActiveRoute(route.path);
  navigate(route.path, method);
  return true;
};
