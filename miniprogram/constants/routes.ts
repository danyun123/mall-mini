import type { RouteMeta } from '../types/route';

// 微信开发者工具内置的 TS 解析链路可能不支持 satisfies，
// 用泛型函数同时保留路由字面量类型和 RouteMeta 结构校验。
const defineRoutes = <T extends Record<string, RouteMeta>>(routes: T): T => routes;

export const ROUTES = defineRoutes({
  LAUNCH: {
    path: '/pages/launch/index',
    title: '项目启动',
    requiresAuth: false,
  },
} as const);

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
export type AppRoutePath = (typeof ROUTES)[keyof typeof ROUTES]['path'];
