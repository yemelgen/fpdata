async function collectClientRects() {
    const results = { elements: {}, standard: {}, tests: {} };

    // Collect rects from demo elements
    for (let i = 1; i <= 3; i++) {
        const element = document.getElementById(`element${i}`);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        results.elements[`element${i}`] = formatRect(rect);

        // Update UI
        const rectInfo = element.querySelector(".rect-info");
        if (rectInfo) {
            rectInfo.innerHTML = `
        left: ${rect.left.toFixed(2)}, top: ${rect.top.toFixed(2)}<br>
        width: ${rect.width.toFixed(2)}, height: ${rect.height.toFixed(2)}
      `;
        }
    }

    // Standard DOM boxes
    const standards = [
        { id: "body", el: document.body },
        { id: "html", el: document.documentElement },
        { id: 'testsWrapper', el: document.getElementById('tests') }
    ];
    for (const { id, el } of standards) {
        if (el) results.standard[id] = formatRect(el.getBoundingClientRect());
    }

    // Synthetic tests
    results.tests = runRectTests();

    return { clientRects: results };
}

// Format rect consistently
function formatRect(rect) {
    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom,
        centerX: +(rect.left + rect.width / 2).toFixed(2),
        centerY: +(rect.top + rect.height / 2).toFixed(2)
    };
}

// Synthetic rendering tests
function runRectTests() {
    const tests = {};

    // Hidden wrapper so user never sees flashes
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "visibility:hidden;position:absolute;top:-9999px;";
    document.body.appendChild(wrapper);

    // Border + padding
    const t1 = document.createElement("div");
    t1.style.cssText = "width:100px;height:50px;padding:10px;border:5px solid red;margin:20px;";
    wrapper.appendChild(t1);
    tests.borderBox = {
        rect: formatRect(t1.getBoundingClientRect()),
        offsetWidth: t1.offsetWidth,
        offsetHeight: t1.offsetHeight
    };
    t1.remove();

    // Fractional pixels
    const t2 = document.createElement("div");
    t2.style.cssText = "width:100.5px;height:50.5px;";
    wrapper.appendChild(t2);
    const r2 = t2.getBoundingClientRect();
    tests.fractionalPixels = {
        rect: formatRect(r2),
        roundedW: Math.round(r2.width),
        roundedH: Math.round(r2.height)
    };
    t2.remove();

    // Hidden element
    const t3 = document.createElement("div");
    t3.style.cssText = "width:100px;height:50px;display:none;";
    wrapper.appendChild(t3);
    const r3 = t3.getBoundingClientRect();
    tests.hiddenElement = {
        rect: formatRect(r3),
        isZero: r3.width === 0 && r3.height === 0
    };
    t3.remove();

    // Transform
    const t4 = document.createElement("div");
    t4.style.cssText = "width:100px;height:50px;transform:rotate(5deg) scale(1.1);";
    wrapper.appendChild(t4);
    tests.transformed = formatRect(t4.getBoundingClientRect());
    t4.remove();

    wrapper.remove();
    return tests;
}
