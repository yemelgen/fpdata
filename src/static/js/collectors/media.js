async function collectMediaDevices(tryEnumerate = false) {
    const capabilities = {
        mediaDevices: !!navigator.mediaDevices,
        bluetooth: !!navigator.bluetooth,
        usb: !!navigator.usb,
        xr: !!navigator.xr,
        gamepads: typeof navigator.getGamepads === "function",
        queries: testMediaQueries(),
    };

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return { media: { supported: false, ...capabilities } };
    }

    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return {
            media: {
                supported: true,
                ...capabilities,
                devices: devices.map(d => ({
                    deviceId: d.deviceId,
                    kind: d.kind,
                    label: d.label || null,
                    groupId: d.groupId || null,
                }))
            }
        };
    } catch (e) {
        return { media: { supported: true, error: e.toString(), ...capabilities } };
    }
}


function testMediaQueries() {
    return {
        prefersDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        hover: window.matchMedia("(hover: hover)").matches,
        pointerCoarse: window.matchMedia("(pointer: coarse)").matches,
        highContrast: window.matchMedia("(forced-colors: active)").matches,
    };
}
