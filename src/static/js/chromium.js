async function collectChromiumData() {
    const results = {
        chromeObject: {},
        clientHints: {}
    };

    // --- Chrome object detection ---
    const chromeExists = typeof chrome !== "undefined";
    results.chromeObject = {
        chrome: chromeExists,
        chrome_runtime: chromeExists && !!chrome.runtime,
        chrome_app: chromeExists && !!chrome.app,
        chrome_webstore: chromeExists && !!chrome.webstore,
        chrome_csi: chromeExists && !!chrome.csi,
        chrome_loadTimes: chromeExists && !!chrome.loadTimes,
        chrome_extension: chromeExists && !!chrome.extension,
        chrome_tabs: chromeExists && !!chrome.tabs,
        chrome_windows: chromeExists && !!chrome.windows,
    };

    // --- Client Hints ---
    if (navigator.userAgentData) {
        try {
            const uaData = navigator.userAgentData;
            const highEntropy = await uaData.getHighEntropyValues([
                "architecture",
                "bitness",
                "model",
                "platformVersion",
                "uaFullVersion",
                "fullVersionList",
                "wow64"
            ]);

            results.clientHints = {
                brands: uaData.brands,
                mobile: uaData.mobile,
                platform: uaData.platform,
                ...highEntropy
            };
        } catch (e) {
            results.clientHints = { error: e.message };
        }
    } else {
        results.clientHints = { supported: false };
    }

    return { chromium: results };
}
