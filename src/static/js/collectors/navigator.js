async function collectNavigator() {
    return {
        navigator: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            appVersion: navigator.appVersion,
            product: navigator.product || null,
            productSub: navigator.productSub || null,
            vendor: navigator.vendor || null,
            vendorSub: navigator.vendorSub || null,

            language: navigator.language || null,
            languages: navigator.languages,

            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,

            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            webdriver: navigator.webdriver,
            userActivation: navigator.userActivation || null,

            oscpu: navigator.oscpu || null, // Firefox only
        }
    };
}
