async function runCollectors() {
    const collectors = [
        collectNavigator,
        collectPrototypes,
        collectChromiumData,
        collectMath,
        collectErrors,
        collectTimezone,
        collectConnection,
        collectUIBars,
        collectScreen,
        collectClientRects,
        collectStorage,
        collectPermissions,
        collectPlugins,
        collectCodecs,
        collectFonts,
        collectWebGL,
        collectWebGPU,
        collectMediaDevices,
        collectInputDevices,
        collectBattery,
        collectOrientation,
        collectSensors,
        collectAudio,
        collectCanvas,
        collectCSSFeatures,
        collectTLS,
    ];

    const results = {};
    for (let fn of collectors) {
        try {
            Object.assign(results, await fn());
        } catch (e) {
            results[fn.name] = { error: e.message };
        }
    }

    try {
        // Send to server and get response
        const response = await fetch("/fingerprint/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(results)
        });

        if (response.ok) {
            const serverData = await response.json();

            // Hide loading, show results
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('results').classList.remove('hidden');

            // Display the JSON data in a readable format
            document.getElementById('output').textContent = 
                JSON.stringify(serverData, null, 2);
        } else {
            throw new Error('Server error: ' + response.status);
        }
    } catch (e) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error').textContent = 'Error: ' + e.message;
    }
}
window.onload = runCollectors;
