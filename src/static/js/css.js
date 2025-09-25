function collectCSSFeatures() {
    const features = [
        "backdrop-filter",
        "display: grid",
        "scroll-snap-type",
        "color: lab(50% 40 30)"
    ];

    const results = {};
    for (const f of features) {
        results[f] = CSS.supports(f);
    }

    return { cssFeatures: results };
}
