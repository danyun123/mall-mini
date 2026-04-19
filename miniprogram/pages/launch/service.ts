import type { AppEnv } from '../../types/common';

interface LaunchStatusTag {
  text: string;
}

const statusTags: LaunchStatusTag[] = [
  { text: '原生小程序' },
  { text: 'TypeScript' },
  { text: 'style v2' },
  { text: 'glass-easel' },
  { text: 'lazyCodeLoading' },
];

export const getLaunchPageData = (appEnv: AppEnv) => ({
  envLabel: appEnv.toUpperCase(),
  // 启动页只展示工程基线，不再承载登录、首页、工作台等占位测试入口。
  statusTags,
});
