const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Store Puppeteer cache inside the project directory so Render retains it in runtime
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
