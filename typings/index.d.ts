interface IAppOption {
  globalData: {
    env: {
      apiBaseUrl: string;
      appEnv: 'dev' | 'test' | 'prod';
      enableMock: boolean;
    };
    systemInfo?: WechatMiniprogram.SystemInfo;
    isAuthenticated: boolean;
  };
}
