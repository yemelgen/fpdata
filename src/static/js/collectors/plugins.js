async function collectPlugins() {
    const results = {
        plugins: [],
        mimeTypes: []
    };

    try {
        for (let i = 0; i < navigator.plugins.length; i++) {
            const p = navigator.plugins[i];
            results.plugins.push({
                name: p.name,
                filename: p.filename,
                description: p.description,
                version: p.version,
                length: p.length,
            });
        }

        for (let i = 0; i < navigator.mimeTypes.length; i++) {
            const mt = navigator.mimeTypes[i];
            results.mimeTypes.push({
                type: mt.type,
                description: mt.description,
                suffixes: mt.suffixes,
                enabledPlugin: mt.enabledPlugin ? {
                    name: mt.enabledPlugin.name,
                    description: mt.enabledPlugin.description
                } : null
            });
        }
    } catch (e) {
        results.error = e.toString();
    }

    return results;
}
