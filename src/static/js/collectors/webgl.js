async function collectVideoCard() {
    const canvas = document.createElement("canvas");
    const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl") ||
        canvas.getContext("webgl2");

    if (!gl) {
        return {
            videoCard: {
                supported: false
            }
        };
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    if (!debugInfo) {
        return {
            videoCard: {
                supported: true,
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER)
            }
        };
    }

    return {
        videoCard: {
            supported: true,
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        }
    };
}

async function collectWebGL() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || 
                   canvas.getContext('webgl') || 
                   canvas.getContext('experimental-webgl');
        if (!gl) return { supported: false };

        const debug = gl.getExtension('WEBGL_debug_renderer_info');

        // Base capabilities
        const results = {
            supported: true,
            basicInfo: {
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                contextType: isWebGL2(gl) ? "webgl2" : "webgl",
                version: gl.getParameter(gl.VERSION),
                shadingLangVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                unmaskedVendor: debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : null,
                unmaskedRenderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : null,
            },

            // Context attributes
            contextAttributes: gl.getContextAttributes(),

            // Extensions
            extensions: gl.getSupportedExtensions(),
         
            // Parameters
            parameters : getWebGLParameters(gl),
            
            // Extension parameters
            extensionParameters: getExtensionParameters(gl),
            
            // Shader precision
            shaderPrecisions: {
                vertex: getShaderPrecisions(gl,"VERTEX_SHADER"),
                fragment: getShaderPrecisions(gl, "FRAGMENT_SHADER"),
            },
            
            // Extra probes
            shaderCompile: shaderCompileCheck(gl),
            internalFormats: getInternalFormats(gl),
        };

        return { webgl: results };

    } catch (e) {
        return { webgl: { supported: false, error: e.toString() } };
    }
}

function isWebGL2(gl) {
    return typeof WebGL2RenderingContext !== 'undefined' && 
           gl instanceof WebGL2RenderingContext;
}

function isWebGLConstant(key, gl) {
    return (
        key === key.toUpperCase() &&
        key.length >= 2 && // Minimum meaningful constant length
        typeof gl[key] === 'number' && // WebGL constants are numbers
        !key.startsWith('_') &&
        !['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key[0]) // Not numeric
    );
}

// Shader compile quirk test
function shaderCompileCheck(gl) {
    const src = "void main(){ gl_FragColor = vec4(0.5); }";
    const s = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS);
}

function getShaderPrecisions(gl, type) {
    const precisions = {};
    const kinds = [
        ['FLOAT', 'LOW_FLOAT'], ['FLOAT', 'MEDIUM_FLOAT'], ['FLOAT', 'HIGH_FLOAT'],
        ['INT', 'LOW_INT'], ['INT', 'MEDIUM_INT'], ['INT', 'HIGH_INT'],
    ];
    const shaderTypes = {
        VERTEX_SHADER: gl.VERTEX_SHADER,
        FRAGMENT_SHADER: gl.FRAGMENT_SHADER,
    };
    for (const [base, name] of kinds) {
        try {
            const fmt = gl.getShaderPrecisionFormat(shaderTypes[type], gl[name]);
            if (fmt) {
                precisions[name] = {
                    rangeMin: fmt.rangeMin,
                    rangeMax: fmt.rangeMax,
                    precision: fmt.precision,
                };
            }
        } catch (e) {
            precisions[name] = null;
        }
    }
    return precisions;
}

function getInternalFormats(gl) {
    if (!isWebGL2(gl)) return null;

    const formats = [
        gl.RGBA8, 
        gl.RGBA16F, 
        gl.RGBA32F,
        gl.DEPTH_COMPONENT16, 
        gl.DEPTH_COMPONENT24, 
        gl.DEPTH24_STENCIL8
    ];
    const results = {};
    for (const f of formats) {
        try {
            results[f] = gl.getInternalformatParameter(gl.RENDERBUFFER, f, gl.SAMPLES);
        } catch (e) {
            results[f] = null;
        }
    }
    return results;
}

function getWebGLConstants(gl) {
    const constants = [];
    let current = gl;
    
    // Walk up the prototype chain
    while (current !== null && current !== Object.prototype) {
        const keys = Object.getOwnPropertyNames(current);
        
        for (const key of keys) {
            if (isWebGLConstant(key, gl)) {
                constants.push(key);
            }
        }
        
        current = Object.getPrototypeOf(current);
    }
    
    return [...new Set(constants)]; // Remove duplicates
}

function getWebGLParameters(gl) {
    const webglConstants = getWebGLConstants(gl);
    const params = {};
    for (const constant of webglConstants) {
        try {
            params[constant] = gl.getParameter(gl[constant]);
        } catch (e) {}
    }
    return params;
}

function getExtensionParameters(gl) {
    const parameters = {};
    const extensions = gl.getSupportedExtensions() || [];
    
    for (const extName of extensions) {
        try {
            const extension = gl.getExtension(extName);
            if (extension) {
                parameters[extName] = {};
                
                // Get extension-specific parameters
                const extConstants = getWebGLConstants(extension);
                for (const constantName of extConstants) {
                    const code = extension[constantName];
                    try {
                        parameters[extName][constantName] = gl.getParameter(code);
                    } catch (e) {}
                }
            }
        } catch (e) {
            parameters[extName] = { error: e.message };
        }
    }
    
    return parameters;
}
