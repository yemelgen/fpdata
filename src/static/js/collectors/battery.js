async function collectBattery() {
    if (!navigator.getBattery) {
        return { battery: { supported: false } };
    }

    try {
        const b = await navigator.getBattery();
        return {
            battery: {
                supported: true,
                charging: b.charging ?? null,
                level: b.level ?? null,
                chargingTime: b.chargingTime ?? null,
                dischargingTime: b.dischargingTime ?? null,
            }
        };
    } catch (e) {
        return { battery: { supported: false, error: e.message } };
    }
}
