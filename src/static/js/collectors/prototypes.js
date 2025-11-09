async function collectPrototypes() {
    function isNativeFunction(fn) {
        try {
            return typeof fn === "function" && /\{\s*\[native code\]\s*\}/.test(Function.prototype.toString.call(fn));
        } catch {
            return false;
        }
    }

    function collect(obj, maxDepth = 5) {
        const properties = [];

        function walk(target, depth = 0) {
            if (!target || depth > maxDepth) return;
            try {
                const props = Object.getOwnPropertyNames(target);
                for (const prop of props) {
                    try {
                        const desc = Object.getOwnPropertyDescriptor(target, prop);
                        let type = "unknown";
                        let native = null;

                        if (desc) {
                            if (typeof desc.value === "function") {
                                type = "function";
                                native = isNativeFunction(desc.value);
                            } else if (desc.value !== undefined) {
                                type = typeof desc.value;
                            } else if (desc.get || desc.set) {
                                type = "accessor";
                                native = {
                                    get: desc.get ? isNativeFunction(desc.get) : null,
                                    set: desc.set ? isNativeFunction(desc.set) : null
                                };
                            }
                        }

                        properties.push({
                            name: prop,
                            type,
                            native
                        });
                    } catch {
                        properties.push({ name: prop, type: "inaccessible" });
                    }
                }
            } catch {
                properties.push({ name: "[cannot enumerate]" });
            }
            walk(Object.getPrototypeOf(target), depth + 1);
        }

        walk(obj);
        return properties.sort((a, b) => a.name.localeCompare(b.name));
    }

    return {
        navigatorPrototype: collect(navigator),
        windowPrototype: collect(window)
    };
}
