async function collectPermissions() {
    if (!navigator.permissions) return { permissions: null };

    const names = [
        "geolocation", "notifications", "push", "camera", "microphone",
        "clipboard-read", "clipboard-write", "persistent-storage",
        "background-sync", "midi", "storage-access", "local-fonts"
    ];

    const permissions = {};
    for (const name of names) {
        try {
            const status = await navigator.permissions.query({ name });
            permissions[name] = status.state;
        } catch {
            permissions[name] = "unsupported";
        }
    }

    return { permissions };
}
