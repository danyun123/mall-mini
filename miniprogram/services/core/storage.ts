export const storage = {
  get<T>(key: string): T | null {
    try {
      const value = wx.getStorageSync(key);
      return value === '' || value === undefined ? null : (value as T);
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    wx.setStorageSync(key, value);
  },
  remove(key: string): void {
    wx.removeStorageSync(key);
  },
};
