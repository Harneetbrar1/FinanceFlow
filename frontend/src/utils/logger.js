const isDev = Boolean(import.meta.env && import.meta.env.DEV);

export const logger = {
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isDev) {
      console.error(...args);
    }
  }
};

export default logger;
