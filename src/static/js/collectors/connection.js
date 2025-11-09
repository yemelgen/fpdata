async function collectConnection() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return { connection: { supported: false } };

    let descriptors = {};
    try {
        Object.getOwnPropertyNames(conn).forEach(prop => {
            descriptors[prop] = typeof conn[prop];
        });
    } catch (e) {
        descriptors = { error: e.message };
    }

    return {
        connection: {
            supported: true,
            downlink: conn.downlink ?? null,
            effectiveType: conn.effectiveType ?? null,
            rtt: conn.rtt ?? null,
            saveData: conn.saveData ?? null,
            type: conn.type ?? null,
            onchange: typeof conn.onchange === "function",
            properties: descriptors,
        }
    };
}
