async function collectOrientation() {
    const result = {
        orientation: {
            screenOrientation: null,
            screenOrientationAngle: null,
        },
        deviceOrientation: {
            supported: false,
            available: false,
            alpha: null,
            beta: null,
            gamma: null,
        }
    };

    if (screen.orientation) {
        result.orientation.screenOrientation = screen.orientation.type || null;
        result.orientation.screenOrientationAngle = screen.orientation.angle ?? null;
    } else if (typeof window.orientation === "number") {
        result.orientation.screenOrientation = "unknown"; 
        result.orientation.screenOrientationAngle = window.orientation;
    }

    if (!window.DeviceOrientationEvent) {
        return result; // no support
    }

    result.deviceOrientation.supported = true;

    return new Promise(resolve => {
        const timeout = setTimeout(() => {
            window.removeEventListener("deviceorientation", handler);
            result.deviceOrientation.available = false;
            resolve(result);
        }, 1000);

        const handler = (event) => {
            clearTimeout(timeout);
            window.removeEventListener("deviceorientation", handler);

            result.deviceOrientation.available = true;
            result.deviceOrientation.alpha = event.alpha;
            result.deviceOrientation.beta = event.beta;
            result.deviceOrientation.gamma = event.gamma;

            resolve(result);
        };

        window.addEventListener("deviceorientation", handler);
    });
}
