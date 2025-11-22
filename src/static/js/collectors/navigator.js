async function collectNavigator() {
    const nav = navigator;

    let userAgentData = null;
    if (nav.userAgentData) {
        try {
            const high = await nav.userAgentData.getHighEntropyValues([
                "architecture",
                "bitness",
                "model",
                "platform",
                "platformVersion",
                "uaFullVersion",
                "fullVersionList"
            ]);

            userAgentData = {
                brands: nav.userAgentData.brands || null,
                mobile: nav.userAgentData.mobile ?? null,
                platform: high.platform ?? null,
                architecture: high.architecture ?? null,
                bitness: high.bitness ?? null,
                model: high.model ?? null,
                platformVersion: high.platformVersion ?? null,
                uaFullVersion: high.uaFullVersion ?? null,
                fullVersionList: high.fullVersionList ?? null,
            };
        } catch (err) {
            userAgentData = {
                brands: nav.userAgentData.brands || null,
                mobile: nav.userAgentData.mobile ?? null,
            };
        }
    }

    const extraProperties = {
        vendorFlavors: detectVendorFlavors(),
        globalPrivacyControl: "globalPrivacyControl" in window ? window.globalPrivacyControl : null,
        pdfViewerEnabled: nav.pdfViewerEnabled ?? null,
        installedApps: nav.getInstalledRelatedApps ? await nav.getInstalledRelatedApps().catch(() => []) : []
    };

    return {
        navigator: {
            userAgent: nav.userAgent,
            userAgentData,

            // standard metadata
            doNotTrack: nav.doNotTrack ?? null,
            appCodeName: nav.appCodeName ?? null,
            appName: nav.appName ?? null,
            appVersion: nav.appVersion ?? null,
            oscpu: nav.oscpu ?? null,
            webdriver: nav.webdriver ?? null,
            language: nav.language ?? null,
            languages: nav.languages ?? null,
            platform: nav.platform ?? null,
            deviceMemory: nav.deviceMemory ?? null,
            hardwareConcurrency: nav.hardwareConcurrency ?? null,
            product: nav.product ?? null,
            productSub: nav.productSub ?? null,
            vendor: nav.vendor ?? null,
            vendorSub: nav.vendorSub ?? null,
            maxTouchPoints: nav.maxTouchPoints ?? 0,
            userActivation: nav.userActivation || null,
            cookieEnabled: nav.cookieEnabled,


            extraProperties
        }
    };
}

function detectVendorFlavors() {
    const flavors = [];

    if (window.chrome) flavors.push("chrome");
    if ("safari" in window) flavors.push("safari");
    if (/firefox/i.test(navigator.userAgent)) flavors.push("firefox");
    if (/edg/i.test(navigator.userAgent)) flavors.push("edge");

    return flavors;
}
