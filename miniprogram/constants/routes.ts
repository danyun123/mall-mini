import { ALL_ROLES } from './roles';
import type { RouteMeta } from '../types/route';

export const ROUTES = {
  LAUNCH: {
    path: '/pages/launch/index',
    title: '项目启动',
    requiresAuth: false,
  },
  LOGIN: {
    path: '/pages/login/index',
    title: '登录',
    requiresAuth: false,
  },
  HOME: {
    path: '/pages/home/index',
    title: '首页',
    requiresAuth: true,
    roles: ALL_ROLES,
  },
  WORKBENCH: {
    path: '/pages/workbench/index',
    title: '工作台',
    requiresAuth: true,
    roles: ALL_ROLES,
  },
  ORDER_LIST: {
    path: '/pkg-order/pages/order-list/index',
    title: '订单列表',
    requiresAuth: true,
    roles: ALL_ROLES,
  },
} as const satisfies Record<string, RouteMeta>;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
export type AppRoutePath = (typeof ROUTES)[keyof typeof ROUTES]['path'];
