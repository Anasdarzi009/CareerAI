const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

/**
 * Resolve launch options and executable path for Puppeteer across environments (local Mac, Render Linux).
 */
function getPuppeteerLaunchOptions() {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
    ];

    const options = {
        headless: true,
        args
    };

    // 1. Explicit override via environment variable
    if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
        options.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
        return options;
    }

    // 2. Puppeteer native resolution (via .puppeteerrc.cjs or PUPPETEER_CACHE_DIR)
    try {
        const resolved = puppeteer.executablePath();
        if (resolved && fs.existsSync(resolved)) {
            options.executablePath = resolved;
            return options;
        }
    } catch (e) {
        // Fall back to candidate cache search
    }

    // 3. Fallback: Search candidate project cache directories
    const candidateCacheDirs = [
        path.join(__dirname, '../../.cache/puppeteer'),
        path.join(process.cwd(), '.cache/puppeteer'),
        path.join(process.cwd(), 'Backend/.cache/puppeteer')
    ];

    const searchChrome = (dir) => {
        if (!fs.existsSync(dir)) return null;
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    const match = searchChrome(full);
                    if (match) return match;
                } else if (entry.name === 'chrome' || entry.name === 'Google Chrome for Testing') {
                    return full;
                }
            }
        } catch (e) {}
        return null;
    };

    for (const dir of candidateCacheDirs) {
        const found = searchChrome(dir);
        if (found && fs.existsSync(found)) {
            options.executablePath = found;
            return options;
        }
    }

    // 4. Fallback: Common Linux system paths (if Chrome or Chromium is pre-installed)
    const systemChromePaths = [
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium'
    ];
    for (const p of systemChromePaths) {
        if (fs.existsSync(p)) {
            options.executablePath = p;
            return options;
        }
    }

    return options;
}

module.exports = {
    getPuppeteerLaunchOptions
};
