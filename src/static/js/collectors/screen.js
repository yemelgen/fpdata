async function collectScreen() {
  return {
    screen: {
        width: screen?.width ?? null,
        height: screen?.height ?? null,
        availWidth: screen?.availWidth ?? null,
        availHeight: screen?.availHeight ?? null,
        colorDepth: screen?.colorDepth ?? null,
        pixelDepth: screen?.pixelDepth ?? null,
    },
    viewport: {
        devicePixelRatio: window?.devicePixelRatio ?? null,
        innerWidth: window?.innerWidth ?? null,
        innerHeight: window?.innerHeight ?? null,
        outerWidth: window?.outerWidth ?? null,
        outerHeight: window?.outerHeight ?? null,
    },
    position: {
        orientation: screen?.orientation?.type ?? null,
        orientationAngle: screen?.orientation?.angle ?? null,
        screenLeft: window?.screenLeft ?? null,
        screenTop: window?.screenTop ?? null,
        screenX: window?.screenX ?? null,
        screenY: window?.screenY ?? null,
    },
  };
}
