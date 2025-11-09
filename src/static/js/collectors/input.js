async function collectInputDevices() {
    const input = {
        keyboard: !!navigator.keyboard,

        // Touchscreen detection
        maxTouchPoints: navigator.maxTouchPoints || 0,
        touchEventConstructor: typeof window.TouchEvent !== "undefined",
        msMaxTouchPoints: navigator.msMaxTouchPoints || 0,

        // Event-based detection
        hasTouchEvents: "ontouchstart" in window,
        hasPointerEvents: "onpointerdown" in window,
        hasWheelEvents: "onwheel" in window,
        hasGamepadEvents: "ongamepadconnected" in window,

        // InputDeviceCapabilities API (experimental)
        pointerCapabilities: {}
    };

    try {
        if (window.InputDeviceCapabilities) {
            const mouse = new InputDeviceCapabilities({ firesTouchEvents: false });
            const touch = new InputDeviceCapabilities({ firesTouchEvents: true });
            input.pointerCapabilities = {
                supported: true,
                mouse: { firesTouchEvents: mouse.firesTouchEvents },
                touch: { firesTouchEvents: touch.firesTouchEvents }
            };
        } else {
            input.pointerCapabilities = { supported: false };
        }
    } catch (e) {
        input.pointerCapabilities = { error: e.message };
    }

    // Gamepad info
    try {
        input.gamepads = navigator.getGamepads
            ? (navigator.getGamepads() || []).map(g => g ? g.id : null)
            : null;
    } catch (e) {
        input.gamepads = { error: e.message };
    }

    return { inputDevices: input };
}
