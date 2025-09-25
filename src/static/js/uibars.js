async function collectUIBars() {
    const safeVisible = bar => {
        try { return !!(bar && bar.visible); } catch { return null; }
    };

    return {
        uibars: {
            locationbar: safeVisible(window.locationbar),
            menubar: safeVisible(window.menubar),
            personalbar: safeVisible(window.personalbar),
            statusbar: safeVisible(window.statusbar),
            toolbar: safeVisible(window.toolbar),
        }
    };
}
