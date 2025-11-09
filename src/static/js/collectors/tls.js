async function collectTLS() {
    const tlsData = {
        security: {
            isSecureContext: window.isSecureContext,
            crossOriginIsolated: window.crossOriginIsolated,
            hasCredentialManagement: "credentials" in navigator,
            hasPublicKeyCredential: "PublicKeyCredential" in window,
        },

        crypto: {
            hasCrypto: !!window.crypto,
            hasSubtle: !!(window.crypto && window.crypto.subtle),
            hasRandom: !!(window.crypto && window.crypto.getRandomValues),
            algorithms: await detectAlgorithms([
                "AES-CBC",
                "AES-GCM",
                "RSA-OAEP",
                "ECDSA",
                "ECDH",
                "HMAC",
                "SHA-1",
                "SHA-256",
                "SHA-384",
                "SHA-512"
            ])
        },

        timing: {
            hasPerformance: !!window.performance,
            hasNow: typeof performance.now === "function",
            hasTimeOrigin: "timeOrigin" in performance,
        },

        tlsFeatures: {
            supportsCompression: false, // disabled everywhere
            supportsHTTP2: detectHTTP2Support(),
            supportsEC: "crypto" in window && "subtle" in crypto, // baseline EC support
        }
    };

    return { tls: tlsData };
}

// Check algorithms robustly
async function detectAlgorithms(names) {
    if (!window.crypto || !window.crypto.subtle) return {};

    const results = {};
    for (const name of names) {
        try {
            switch (name) {
                case "AES-CBC":
                case "AES-GCM":
                    await crypto.subtle.importKey(
                        "raw",
                        new Uint8Array(16),
                        { name },
                        false,
                        ["encrypt", "decrypt"]
                    );
                    results[name] = true;
                    break;
                case "RSA-OAEP":
                    await crypto.subtle.generateKey(
                        { name, modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
                        false,
                        ["encrypt", "decrypt"]
                    );
                    results[name] = true;
                    break;
                case "ECDSA":
                    await crypto.subtle.generateKey(
                        { name, namedCurve: "P-256" },
                        false,
                        ["sign", "verify"]
                    );
                    results[name] = true;
                    break;
                case "ECDH":
                    await crypto.subtle.generateKey(
                        { name, namedCurve: "P-256" },
                        false,
                        ["deriveKey", "deriveBits"]
                    );
                    results[name] = true;
                    break;
                case "HMAC":
                    await crypto.subtle.generateKey(
                        { name, hash: "SHA-256" },
                        false,
                        ["sign", "verify"]
                    );
                    results[name] = true;
                    break;
                case "SHA-1":
                case "SHA-256":
                case "SHA-384":
                case "SHA-512":
                    await crypto.subtle.digest(name, new Uint8Array(0));
                    results[name] = true;
                    break;
                default:
                    results[name] = false;
            }
        } catch {
            results[name] = false;
        }
    }
    return results;
}

function detectHTTP2Support() {
    return (
        "fetch" in window &&
        "ReadableStream" in window &&
        "Response" in window && "body" in Response.prototype
    );
}
