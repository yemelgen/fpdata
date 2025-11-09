async function collectMath() {
    function safeCall(fn, ...args) {
        try {
            return fn(...args);
        } catch {
            return null;
        }
    }

    return {
        math: {
            // Trig
            sin: Math.sin(0.5),
            cos: Math.cos(0.5),
            tan: Math.tan(0.5),
            asin: safeCall(Math.asin, 0.5),
            acos: safeCall(Math.acos, 0.5),
            atan: Math.atan(0.5),
            atan2: Math.atan2(1, 2),

            // Hyperbolic
            sinh: safeCall(Math.sinh, 1),
            cosh: safeCall(Math.cosh, 1),
            tanh: safeCall(Math.tanh, 1),

            // Logarithms & exponentials
            log: Math.log(10),
            log2: Math.log2(10),
            log10: Math.log10(10),
            exp: Math.exp(1),
            expm1: Math.expm1(1),

            // Roots & powers
            sqrt: Math.sqrt(2),
            cbrt: Math.cbrt(2),
            pow: Math.pow(2, 53),

            // Rounding & precision quirks
            round_05: Math.round(0.5),
            round_15: Math.round(1.5),
            floor_neg: Math.floor(-0.5),
            ceil_neg: Math.ceil(-0.5),

            // Edge cases
            log_neg: safeCall(Math.log, -1), // should be NaN
            sqrt_neg: safeCall(Math.sqrt, -1), // should be NaN
            div_zero: 1 / 0,  // Infinity
            neg_zero: 1 / -Infinity, // -0
            tiny: Math.pow(2, -1074), // smallest subnormal double
            huge: Math.pow(2, 1023), // largest finite double

            // Precision test
            precision: 1.0000000000000001 === 1 ? "low" : "high",
        }
    };
}
