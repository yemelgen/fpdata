async function collectSensors() {
    const sensors = {
        // Modern Generic Sensor API
        accelerometer: "Accelerometer" in window,
        gyroscope: "Gyroscope" in window,
        magnetometer: "Magnetometer" in window,

        // Legacy events
        deviceMotion: "DeviceMotionEvent" in window,
        deviceOrientation: "DeviceOrientationEvent" in window,

        // Other sensors
        proximity: "ondeviceproximity" in window || "ProximitySensor" in window,
        ambientLight: "AmbientLightSensor" in window,

        // Vibration
        vibration: "vibrate" in navigator,
    };

    // Optional: functional check for accelerometer
    if (sensors.accelerometer) {
        try {
            const sensor = new Accelerometer({ frequency: 1 });
            await new Promise(resolve => setTimeout(resolve, 50));
            sensors.accelerometerFunctional = true;
        } catch (e) {
            sensors.accelerometerError = e.message;
        }
    }

    return { sensors };
}
