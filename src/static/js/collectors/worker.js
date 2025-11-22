async function collectWorker() {
    if (!window.Worker) {
        return { worker: { supported: false } };
    }

    const workerCode = `
        function safeNavigator() {
            const nav = self.navigator || {};
            return {
                userAgent: nav.userAgent || null,
                platform: nav.platform || null,
                language: nav.language || null,
                languages: nav.languages || null,
                hardwareConcurrency: nav.hardwareConcurrency || null,
                deviceMemory: nav.deviceMemory || null,
                maxTouchPoints: nav.maxTouchPoints || null,
                userAgentData: nav.userAgentData ? {
                    mobile: nav.userAgentData.mobile,
                    brands: nav.userAgentData.brands || null,
                    platform: nav.userAgentData.platform || null
                } : null
            };
        }

        function summarizeFloat32(data) {
            let min = Infinity, max = -Infinity, sum = 0, sumSq = 0;
            for (let i = 0; i < data.length; i++) {
                const v = data[i];
                if (v < min) min = v;
                if (v > max) max = v;
                sum += v;
                sumSq += v * v;
            }
            const mean = sum / data.length;
            const variance = (sumSq / data.length) - (mean * mean);

            let hash = 0;
            for (let i = 0; i < data.length; i += 8) {
                hash = ((hash << 5) - hash + Math.floor(data[i] * 1e6)) | 0;
            }

            return { min, max, mean, variance, hash };
        }

        self.onmessage = () => {
            // Performance timing
            const t0 = performance.now();
            const arr = new Float32Array(256);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = (Math.sin(i) * Math.random());
            }
            const t1 = performance.now();

            // Endianness
            const buffer = new ArrayBuffer(4);
            new DataView(buffer).setUint32(0, 0x11223344, true);
            const isLittleEndian = new Uint8Array(buffer)[0] === 0x44;

            // Stack style
            const stackFormat = (() => {
                try { throw new Error("worker_test"); }
                catch (e) { return e.stack || null; }
            })();

            // Crypto test
            let cryptoValues = null;
            try {
                const tmp = new Uint32Array(8);
                crypto.getRandomValues(tmp);
                cryptoValues = Array.from(tmp);
            } catch (_) {}

            self.postMessage({
                worker: {
                    supported: true,
                    performanceResolution: (t1 - t0),
                    timeOrigin: performance.timeOrigin || null,
                    isLittleEndian,
                    randomSummary: summarizeFloat32(arr),
                    cryptoValues,
                    navigator: safeNavigator(),
                    errors: {
                        stackFormat
                    }
                }
            });
        };
    `;

    try {
        const blob = new Blob([workerCode], { type: "application/javascript" });
        const url = URL.createObjectURL(blob);
        const worker = new Worker(url);

        return await new Promise(resolve => {
            const timeout = setTimeout(() => {
                worker.terminate();
                resolve({
                    worker: {
                        supported: true,
                        timeout: true
                    }
                });
            }, 3000);

            worker.onmessage = (e) => {
                clearTimeout(timeout);
                worker.terminate();
                resolve(e.data);
            };

            worker.postMessage("start");
        });

    } catch (e) {
        return { worker: { supported: false, error: e.message } };
    }
}
