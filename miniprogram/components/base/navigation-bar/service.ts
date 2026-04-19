interface NavigationBarLayout {
  ios: boolean;
  innerPaddingRight: string;
  leftWidth: string;
  safeAreaTop: string;
}

export const buildDisplayStyle = (show: boolean, animated: boolean): string => {
  if (animated) {
    return `opacity: ${show ? '1' : '0'};transition: opacity 0.25s;`;
  }

  return `display: ${show ? '' : 'none'}`;
};

export const buildNavigationBarLayout = (
  systemInfo: WechatMiniprogram.SystemInfo,
  rect: WechatMiniprogram.ClientRect,
): NavigationBarLayout => {
  const safeAreaTop = systemInfo.safeArea?.top ?? 0;
  const isAndroid = systemInfo.platform === 'android';
  const isDevtools = systemInfo.platform === 'devtools';

  return {
    ios: !isAndroid,
    innerPaddingRight: `padding-right: ${systemInfo.windowWidth - rect.left}px`,
    leftWidth: `width: ${systemInfo.windowWidth - rect.left}px`,
    safeAreaTop:
      isDevtools || isAndroid
        ? `height: calc(var(--height) + ${safeAreaTop}px); padding-top: ${safeAreaTop}px`
        : '',
  };
};
