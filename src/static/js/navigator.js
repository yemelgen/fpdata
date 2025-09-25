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

async function collectPrototypes() {
    function collect(obj, maxDepth = 5) {
        const properties = new Set();

        function walk(target, depth = 0) {
            if (!target || depth > maxDepth) return;
            try {
                const props = Object.getOwnPropertyNames(target);
                for (const prop of props) {
                    try {
                        const desc = Object.getOwnPropertyDescriptor(target, prop);
                        let type = 'unknown';
                        if (desc) {
                            if (typeof desc.value === 'function') type = 'function';
                            else if (desc.value !== undefined) type = typeof desc.value;
                            else if (desc.get || desc.set) type = 'accessor';
                        }
                        properties.add(`${prop}:[${type}]`);
                    } catch {
                        properties.add(`${prop}:[inaccessible]`);
                    }
                }
            } catch {
                properties.add('[cannot enumerate]');
            }
            walk(Object.getPrototypeOf(target), depth + 1);
        }

        walk(obj);
        return Array.from(properties).sort();
    }

    return {
        navigatorPrototype: collect(navigator),
        windowPrototype: collect(window)
    };
}
