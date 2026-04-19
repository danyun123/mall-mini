import type { AppEnv } from '../../types/common';
import { authStore } from '../../stores/auth.store';

interface LaunchQuickLink {
  title: string;
  description: string;
  actionText: string;
}

const quickLinks: LaunchQuickLink[] = [
  {
    title: '登录页',
    description: '验证 mock 登录和权限守卫',
    actionText: '进入登录',
  },
  {
    title: '首页占位',
    description: '查看初始化后的主包首页骨架',
    actionText: '进入首页',
  },
  {
    title: '工作台占位',
    description: '查看共享 store 和摘要信息展示',
    actionText: '进入工作台',
  },
];

export const getLaunchPageData = (appEnv: AppEnv) => ({
  envLabel: appEnv.toUpperCase(),
  loginState: authStore.state.isAuthenticated ? `已登录：${authStore.state.displayName}` : '未登录',
  quickLinks,
});

export const getLaunchRouteContext = () => authStore.state;
