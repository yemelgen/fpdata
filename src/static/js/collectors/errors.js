async function collectErrors() {
    const results = {};

    // 1. ReferenceError
    try {
        azeaze;
    } catch (err) {
        results.referenceError = summarizeError(err);
    }

    // 2. TypeError
    try {
        null.f();
    } catch (err) {
        results.typeError = summarizeError(err);
    }

    // 3. URIError
    try {
        decodeURIComponent("%");
    } catch (err) {
        results.uriError = summarizeError(err);
    }

    // 4. SyntaxError
    try {
        eval("}");
    } catch (err) {
        results.syntaxError = summarizeError(err);
    }

    // 5. EvalError
    try {
        throw new EvalError("test");
    } catch (err) {
        results.evalError = summarizeError(err);
    }

    // 6. AggregateError (Promise.any([]))
    try {
        await Promise.any([]);
    } catch (err) {
        results.aggregateError = summarizeError(err);
    }

    // 7. Recursion depth (RangeError)
    try {
        const depth = measureRecursionDepth();
        results.recursionError = { hasRangeError: depth !== null, depth: depth };
    } catch (err) {
        results.recursionError = summarizeError(err);
    }

    // 8. Error constructors presence
    results.constructors = {
        ReferenceError: typeof ReferenceError,
        TypeError: typeof TypeError,
        URIError: typeof URIError,
        SyntaxError: typeof SyntaxError,
        EvalError: typeof EvalError,
        AggregateError: typeof AggregateError,
        RangeError: typeof RangeError,
    };

    return { errors: results };
}

function summarizeError(err) {
    return {
        name: err.name,
        message: err.message,
        hasStack: !!err.stack,
        stackSignature: normalizeStack(err.stack),
        stackFrames: err.stack ? err.stack.split("\n").length : 0,
        captureStackTrace: typeof Error.captureStackTrace === "function",
    };
}

function normalizeStack(stack) {
    if (!stack) return null;
    return stack
        .split("\n")
        .map(line => line.trim().replace(/https?:\/\/\S+/g, "")) // strip URLs
        .slice(0, 3) // only top 3 frames
        .join("|");
}

function measureRecursionDepth() {
    let depth = 0;
    function recurse() {
        depth++;
        recurse();
    }
    try {
        recurse();
    } catch (err) {
        if (err instanceof RangeError) return depth;
        return null;
    }
}
