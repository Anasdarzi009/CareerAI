const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Store Puppeteer cache in Backend/.cache/puppeteer so Render retains it in runtime
  cacheDirectory: join(__dirname, 'Backend', '.cache', 'puppeteer'),
};
