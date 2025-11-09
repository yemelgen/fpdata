async function collectCanvas() {
    try {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");

        // Test different rendering operations and collect their results
        const tests = {
            // 1. Gradient rendering
            gradient: testGradient(ctx),

            // 2. Text rendering with different fonts
            textRendering: testTextRendering(ctx),

            // 3. Transparency and blending
            transparency: testTransparency(ctx),

            // 4. Shadow effects
            shadows: testShadows(ctx),

            // 5. Composite operations
            composite: testCompositeOperations(ctx),

            // 6. Basic shape rendering
            shapes: testShapes(ctx),

            // 7. System font availability
            fontMetrics: testFontMetrics(),

            // 8. Line styles — compares how lineCap and lineJoin are rendered
            lineStyles: testLineStyles(ctx),


            // 9. Curves — bezier and quadratic curves. Subtle rendering differences
            curves: testCurves(ctx),

            // 10. Image scaling — draws and scales a test pattern with imageSmoothingEnabled.
            imageScaling: testImageScaling(ctx),

            // 11. Sub-pixel rendering — draws lines at fractional pixel positions.
            subPixel: testSubPixel(ctx),

            // 12. WebGL capabilities — queries vendor/renderer, supported extensions,
            webgl: testWebGL()
        };

        return { canvas: tests };
    } catch (e) {
        return { canvasError: e.message };
    }
}

function testGradient(ctx) {
    const results = {};
    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, "#f60");
    gradient.addColorStop(1, "#069");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 200);

    // Sample gradient pixels at various points
    const imageData = ctx.getImageData(0, 0, 400, 200);
    results.gradientSamples = samplePixels(imageData, [
        [10, 10], [200, 50], [390, 10], [100, 150]
    ]);

    return results;
}

function testTextRendering(ctx) {
    const results = {};
    const testPositions = [];

    // Test different fonts and characters
    const fontTests = [
        { font: "20px Arial", text: "Canvas FP — Arial 😎", x: 10, y: 30 },
        { font: "20px 'Times New Roman'", text: "𝌆 𝄞 Σ ε", x: 10, y: 60 },
        { font: "20px Courier New", text: "Shadow test", x: 10, y: 90 }
    ];

    fontTests.forEach(test => {
        ctx.font = test.font;
        ctx.fillStyle = "black";
        ctx.fillText(test.text, test.x, test.y);
        testPositions.push([test.x, test.y, test.x + 150, test.y + 20]);
    });

    // Get pixel data around text
    const imageData = ctx.getImageData(0, 0, 400, 200);
    results.textSamples = {};

    fontTests.forEach((test, index) => {
        const [x1, y1, x2, y2] = testPositions[index];
        results.textSamples[test.font] = sampleTextArea(imageData, x1, y1, x2, y2);
    });

    return results;
}

function testTransparency(ctx) {
    const results = {};

    // Clear canvas first
    ctx.clearRect(0, 0, 400, 200);

    // Draw transparent rectangles
    ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
    ctx.fillRect(50, 50, 100, 100);
    ctx.fillStyle = "rgba(0, 200, 0, 0.5)";
    ctx.fillRect(100, 100, 100, 100);

    // Sample overlapping area
    const imageData = ctx.getImageData(75, 75, 75, 75);
    results.transparencySamples = samplePixels(imageData, [
        [10, 10], [40, 40], [70, 10]
    ]);

    return results;
}

function testShadows(ctx) {
    const results = {};

    ctx.clearRect(0, 0, 400, 200);
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.font = "20px Arial";
    ctx.fillText("Shadow test", 50, 100);

    // Sample shadow area
    const imageData = ctx.getImageData(45, 85, 100, 30);
    results.shadowSamples = samplePixels(imageData, [
        [5, 5], [50, 15], [95, 5]
    ]);

    return results;
}

function testCompositeOperations(ctx) {
    const results = {};
    const operations = ['multiply', 'screen', 'overlay', 'difference'];

    operations.forEach(op => {
        ctx.clearRect(0, 0, 400, 200);
        ctx.fillStyle = "rgb(255,100,100)";
        ctx.fillRect(50, 50, 100, 100);

        ctx.globalCompositeOperation = op;
        ctx.fillStyle = "rgb(100,100,255)";
        ctx.fillRect(100, 100, 100, 100);

        const imageData = ctx.getImageData(75, 75, 75, 75);
        results[op] = samplePixels(imageData, [[35, 35]]);
    });

    return results;
}

function testShapes(ctx) {
    const results = {};

    // Test various shape rendering
    ctx.clearRect(0, 0, 400, 200);

    // Lines with different widths
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, 50, 50);
    ctx.lineWidth = 3;
    ctx.strokeRect(90, 20, 50, 50);

    // Circles/arcs
    ctx.beginPath();
    ctx.arc(200, 45, 20, 0, Math.PI * 2);
    ctx.stroke();

    const imageData = ctx.getImageData(0, 0, 400, 200);
    results.shapeSamples = samplePixels(imageData, [
        [25, 25], [95, 25], [200, 45]
    ]);

    return results;
}

function testFontMetrics() {
    // Test which fonts are available and their metrics
    const testFonts = [
        'Arial', 'Times New Roman', 'Courier New', 
        'Verdana', 'Georgia', 'Helvetica'
    ];

    const results = {};
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.left = '-9999px';
    span.style.fontSize = '20px';
    span.innerHTML = 'TestString';

    document.body.appendChild(span);

    testFonts.forEach(font => {
        span.style.fontFamily = font;
        // Force reflow
        void span.offsetWidth;

        results[font] = {
            available: span.style.fontFamily.includes(font),
            width: span.offsetWidth,
            height: span.offsetHeight
        };
    });

    document.body.removeChild(span);
    return results;
}

// Helper functions
function samplePixels(imageData, coordinates) {
    const samples = [];
    const data = imageData.data;
    const width = imageData.width;

    coordinates.forEach(([x, y]) => {
        const index = (y * width + x) * 4;
        samples.push({
            x, y,
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
        });
    });

    return samples;
}

function sampleTextArea(imageData, x1, y1, x2, y2) {
    const samples = [];
    const data = imageData.data;
    const width = imageData.width;

    // Sample a grid within the text area
    for (let x = x1; x < x2; x += 5) {
        for (let y = y1; y < y2; y += 5) {
            const index = (y * width + x) * 4;
            if (data[index + 3] > 0) { // Only sample non-transparent pixels
                samples.push({
                    x, y,
                    r: data[index],
                    g: data[index + 1],
                    b: data[index + 2],
                    a: data[index + 3]
                });
            }
        }
    }

    return samples;
}


function testLineStyles(ctx) {
    const results = {};
    ctx.clearRect(0, 0, 400, 200);

    ctx.lineWidth = 10;
    ctx.strokeStyle = "black";

    ["butt", "round", "square"].forEach((cap, i) => {
        ctx.beginPath();
        ctx.lineCap = cap;
        ctx.moveTo(20, 40 + i * 40);
        ctx.lineTo(120, 40 + i * 40);
        ctx.stroke();
        results[cap] = ctx.getImageData(20, 40 + i * 40, 100, 20).data.slice(0, 40);
    });

    return results;
}


function testCurves(ctx) {
    const results = {};
    ctx.clearRect(0, 0, 400, 200);

    ctx.beginPath();
    ctx.moveTo(20, 100);
    ctx.bezierCurveTo(80, 20, 160, 180, 220, 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(240, 100);
    ctx.quadraticCurveTo(300, 20, 360, 100);
    ctx.stroke();

    results.curveSamples = samplePixels(ctx.getImageData(0, 0, 400, 200), [
        [80, 60], [180, 120], [300, 60]
    ]);

    return results;
}


function testImageScaling(ctx) {
    const results = {};
    ctx.clearRect(0, 0, 400, 200);

    const img = ctx.createImageData(20, 20);
    for (let i = 0; i < img.data.length; i += 4) {
        img.data[i] = (i % 2) * 255; // checkerboard
        img.data[i + 1] = ((i >> 1) % 2) * 255;
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 10, 10);

    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(ctx.canvas, 10, 10, 20, 20, 150, 10, 200, 200);

    results.scaledSample = ctx.getImageData(200, 100, 1, 1).data;
    return results;
}


function testSubPixel(ctx) {
    const results = {};
    ctx.clearRect(0, 0, 400, 200);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10.5, 10.5);
    ctx.lineTo(200.5, 10.5);
    ctx.stroke();

    results.subPixel = ctx.getImageData(100, 10, 1, 1).data;
    return results;
}


function testWebGL() {
    try {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

        if (!gl) return { supported: false };

        // Simple vertex shader
        const vsSource = `
            attribute vec4 aPosition;
            void main(void) {
                gl_Position = aPosition;
            }
        `;

        // Simple fragment shader with a gradient + math ops
        const fsSource = `
            precision highp float;
            void main(void) {
                vec2 uv = gl_FragCoord.xy / 256.0;
                float r = sin(uv.x * 20.0) * 0.5 + 0.5;
                float g = cos(uv.y * 20.0) * 0.5 + 0.5;
                float b = r * g;
                gl_FragColor = vec4(r, g, b, 1.0);
            }
        `;

        function compileShader(type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        }

        const program = gl.createProgram();
        gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource));
        gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource));
        gl.linkProgram(program);
        gl.useProgram(program);

        // Fullscreen quad
        const vertices = new Float32Array([
            -1, -1,  1, -1,  -1, 1,
            -1,  1,  1, -1,   1, 1
        ]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const pos = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Read pixels
        const pixels = new Uint8Array(256 * 256 * 4);
        gl.readPixels(0, 0, 256, 256, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        // Hash the pixels (quick base64 slice instead of sending raw data)
        const sample = Array.from(pixels.slice(0, 64)); // take first 64 values
        return { supported: true, pixelSample: sample };

    } catch (e) {
        return { supported: false, error: e.message };
    }
}
