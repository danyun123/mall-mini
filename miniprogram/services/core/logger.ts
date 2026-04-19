export const logger = {
  info(message: string, payload?: unknown): void {
    console.info(`[mall-mini] ${message}`, payload);
  },
  warn(message: string, payload?: unknown): void {
    console.warn(`[mall-mini] ${message}`, payload);
  },
  error(message: string, payload?: unknown): void {
    console.error(`[mall-mini] ${message}`, payload);
  },
};
