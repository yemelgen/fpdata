async function collectOrientation() {
    if (!window.DeviceOrientationEvent) {
        return { deviceOrientation: { supported: false } };
    }

    return new Promise(resolve => {
        const result = { deviceOrientation: { supported: true } };

        // Set a timeout in case the event doesn't fire
        const timeout = setTimeout(() => {
            window.removeEventListener('deviceorientation', handler);
            result.deviceOrientation.available = false;
            resolve(result);
        }, 1000);

        const handler = event => {
            clearTimeout(timeout);
            window.removeEventListener('deviceorientation', handler);

            result.deviceOrientation.available = true;
            result.deviceOrientation.alpha = event.alpha;
            result.deviceOrientation.beta = event.beta;
            result.deviceOrientation.gamma = event.gamma;

            resolve(result);
        };

        window.addEventListener('deviceorientation', handler);
    });
}
