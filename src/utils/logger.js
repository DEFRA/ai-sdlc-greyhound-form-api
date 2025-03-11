export const logger = {
  info: (...args) => {
    // eslint-disable-next-line no-console
    console.log(...args)
  },
  error: (...args) => {
    // eslint-disable-next-line no-console
    console.error(...args)
  }
}
