export const logger = {
  info: (message: string, ...meta: object[]) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...meta);
  },
  error: (message: string, ...meta: object[]) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...meta);
  },
  warn: (message: string, ...meta: object[]) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...meta);
  },
  debug: (message: string, ...meta: object[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, ...meta);
    }
  }
};
