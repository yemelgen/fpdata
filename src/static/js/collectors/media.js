async function collectMediaDevices() {
    const capabilities = {
        supported: !!navigator.mediaDevices,
        mediaDevices: !!navigator.mediaDevices,
        bluetooth: !!navigator.bluetooth,
        usb: !!navigator.usb,
        xr: !!navigator.xr,
        gamepads: typeof navigator.getGamepads === "function",
        queries: testMediaQueries()
    };

    const result = {
        multimediaDevices: {
            speakers: [],
            micros: [],
            webcams: []
        },
        capabilities
    };

    if (!navigator.mediaDevices?.enumerateDevices) {
        return result;
    }

    try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        for (const d of devices) {
            const entry = {
                deviceId: d.deviceId || null,
                label: d.label || null,
                groupId: d.groupId || null,
                kind: d.kind
            };

            if (d.kind === "audioinput") {
                result.multimediaDevices.micros.push(entry);
            } else if (d.kind === "audiooutput") {
                result.multimediaDevices.speakers.push(entry);
            } else if (d.kind === "videoinput") {
                result.multimediaDevices.webcams.push(entry);
            }
        }
    } catch (err) {
        result.capabilities.error = err.toString();
    }

    return result;
}

function testMediaQueries() {
    return {
        prefersDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        hover: window.matchMedia("(hover: hover)").matches,
        pointerCoarse: window.matchMedia("(pointer: coarse)").matches,
        highContrast: window.matchMedia("(forced-colors: active)").matches
    };
}
