/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/augments/WatchedSet.ts":
/*!************************************!*\
  !*** ./src/augments/WatchedSet.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WatchedSet": () => (/* binding */ WatchedSet)
/* harmony export */ });
class WatchedSet extends Set {
    #adds = new Set();
    #deletes = new Set();
    #attemptedAdds = new Set();
    #attemptedDeletes = new Set();
    #locked = false;
    constructor(items) {
        super();
        if (items)
            this.addAll([...items]);
    }
    onAdd(run) {
        this.#adds.add(run);
        return this;
    }
    onDelete(run) {
        this.#deletes.add(run);
        return this;
    }
    onAttemptedAdd(run) {
        this.#attemptedAdds.add(run);
        return this;
    }
    onAttemptedDelete(run) {
        this.#attemptedDeletes.add(run);
        return this;
    }
    offAdd(run) {
        this.#adds.delete(run);
        return this;
    }
    offDelete(run) {
        this.#deletes.delete(run);
        return this;
    }
    offAttemptedAdd(run) {
        this.#attemptedAdds.delete(run);
        return this;
    }
    offAttemptedDelete(run) {
        this.#attemptedDeletes.delete(run);
        return this;
    }
    addAll(items) {
        items.forEach((item) => this.add(item));
        return this;
    }
    deleteAll(items) {
        return items.map((item) => this.delete(item));
    }
    add(item) {
        if (this.#locked) {
            const results = [...this.#attemptedAdds].map((run) => run.call(undefined, item, this));
            if (results.every((out) => !out))
                return this;
        }
        const results = [...this.#adds].map((run) => run.call(undefined, item, this));
        return results.some((out) => out === false) ? this : super.add(item);
    }
    delete(item) {
        if (this.#locked) {
            const results = [...this.#attemptedDeletes].map((run) => run.call(undefined, item, this));
            if (results.every((out) => !out))
                return false;
        }
        const results = [...this.#deletes].map((run) => run.call(undefined, item, this));
        return results.some((out) => out === false) ? false : super.delete(item);
    }
    lock() {
        this.#locked = true;
    }
    unlock() {
        this.#locked = false;
    }
    get locked() {
        return this.#locked;
    }
    clone(withListeners) {
        const set = new WatchedSet(this);
        if (withListeners) {
            this.#adds.forEach((run) => set.onAdd(run));
            this.#deletes.forEach((run) => set.onDelete(run));
        }
        return set;
    }
}


/***/ }),

/***/ "./src/cad/algebra/reify.ts":
/*!**********************************!*\
  !*** ./src/cad/algebra/reify.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reify": () => (/* binding */ reify)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../constants */ "./src/constants.ts");
/* harmony import */ var _variables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./variables */ "./src/cad/algebra/variables.ts");


// need to explicitly pass number of inputs since simplified table may not have all of the original inputs
/** converts a list of expressions into a serialized diagram */
function reify(ins, outs, table) {
    const components = new Array();
    const wires = new Array();
    const id = (0,_constants__WEBPACK_IMPORTED_MODULE_0__.COUNTER_GENERATOR)();
    // create inputs
    const inputs = Array(ins)
        .fill(0)
        .map((_, i) => ({
        reified: i,
        permanent: false,
        type: "INPUT",
        activated: false,
        id: id.next().value,
        x: 100,
        y: i * 50 + 100,
    }));
    // create outputs
    const outputs = Array(outs)
        .fill(0)
        .map((_, i) => ({
        reified: inputs.length + i,
        permanent: false,
        type: "OUTPUT",
        activated: false,
        id: id.next().value,
        x: 700,
        y: i * 50 + 100,
    }));
    // should start at the sum of the lengths of the inputs and outputs
    let reified = inputs.length + outputs.length;
    // not gates for negating inputs
    const negatedInputs = inputs.map((_, i) => {
        const v = (0,_variables__WEBPACK_IMPORTED_MODULE_1__.variableFor)(i, true);
        // if the negated input is never used, don't create a not gate
        if (!table.some((expr) => expr.includes(v)))
            return undefined;
        return {
            reified: reified++,
            permanent: false,
            type: "COMPONENT",
            name: "NOT",
            inputs: [{ id: id.next().value, activated: false }],
            outputs: [{ id: id.next().value, activated: true }],
            x: 150,
            y: i * 50 + 100 + 50,
            angle: 0,
            complementary: false,
            joins: 1,
        };
    });
    // connecting inputs to not gates
    inputs.forEach(({ id: from }, i) => {
        if (negatedInputs[i])
            wires.push({ from, to: negatedInputs[i].inputs[0].id });
    });
    // add inputs, outputs, and negated inputs to components
    components.push(...inputs, ...outputs, ...negatedInputs.filter((x) => typeof x !== "undefined"));
    table.forEach((expr, i) => {
        // product of sums
        if (expr.startsWith("(") && expr.endsWith(")")) {
            const product = expr.slice(1, -1).split(")(");
            // handle single products
            // directly connect or gate to output
            if (product.length === 1) {
                const sum = product[0].split("+");
                const sumGate = {
                    reified: reified++,
                    permanent: false,
                    type: "COMPONENT",
                    name: "OR",
                    inputs: sum.map((v) => ({ id: id.next().value, activated: (0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v) })),
                    outputs: [{ id: id.next().value, activated: sum.some((v) => (0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v)) }],
                    x: 350,
                    y: i * 50 + 100,
                    angle: 0,
                    complementary: false,
                    joins: sum.length,
                };
                // connect inputs to the or gate
                sum.forEach((v, k) => {
                    if ((0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v)) {
                        wires.push({
                            from: negatedInputs[(0,_variables__WEBPACK_IMPORTED_MODULE_1__.fromVariable)(v)].outputs[0].id,
                            to: sumGate.inputs[k].id,
                        });
                    }
                    else {
                        wires.push({
                            from: inputs[(0,_variables__WEBPACK_IMPORTED_MODULE_1__.fromVariable)(v)].id,
                            to: sumGate.inputs[k].id,
                        });
                    }
                });
                // add or gate to components
                components.push(sumGate);
                // connect or gate to output
                wires.push({
                    from: sumGate.outputs[0].id,
                    to: outputs[i].id,
                });
                return;
            }
            const productGate = {
                reified: reified++,
                permanent: false,
                type: "COMPONENT",
                name: "AND",
                inputs: product.map(() => ({ id: id.next().value, activated: false })),
                outputs: [{ id: id.next().value, activated: false }],
                x: 550,
                y: i * 50 + 100,
                angle: 0,
                complementary: false,
                joins: product.length,
            };
            product.forEach((o, j) => {
                const sum = o.split("+");
                const sumGate = {
                    reified: reified++,
                    permanent: false,
                    type: "COMPONENT",
                    name: "OR",
                    inputs: sum.map((v) => ({ id: id.next().value, activated: (0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v) })),
                    outputs: [{ id: id.next().value, activated: sum.some((v) => (0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v)) }],
                    x: 350,
                    y: i * 50 + 100 + (product.length / 2 - j) * 50,
                    angle: 0,
                    complementary: false,
                    joins: sum.length,
                };
                // update and gate input
                productGate.inputs[j].activated = sumGate.outputs[0].activated;
                // connect inputs to the or gate
                sum.forEach((v, k) => {
                    if ((0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v)) {
                        wires.push({
                            from: negatedInputs[(0,_variables__WEBPACK_IMPORTED_MODULE_1__.fromVariable)(v)].outputs[0].id,
                            to: sumGate.inputs[k].id,
                        });
                    }
                    else {
                        wires.push({
                            from: inputs[(0,_variables__WEBPACK_IMPORTED_MODULE_1__.fromVariable)(v)].id,
                            to: sumGate.inputs[k].id,
                        });
                    }
                });
                // add or gate to components
                components.push(sumGate);
                // connect or gate to and gate
                wires.push({
                    from: sumGate.outputs[0].id,
                    to: productGate.inputs[j].id,
                });
            });
            // add and gate to components
            components.push(productGate);
            // connect and gate to output
            wires.push({
                from: productGate.outputs[0].id,
                to: outputs[i].id,
            });
            return;
        }
        // sum of products
        const sum = expr.split("+");
        // handle single sums
        // directly connect and gate to output
        if (sum.length === 1) {
            const product = sum[0].split(/(?=\w)/);
            const productGate = {
                reified: reified++,
                permanent: false,
                type: "COMPONENT",
                name: "AND",
                inputs: product.map((v) => ({ id: id.next().value, activated: (0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v) })),
                outputs: [{ id: id.next().value, activated: product.every((v) => (0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v)) }],
                x: 350,
                y: i * 50 + 100,
                angle: 0,
                complementary: false,
                joins: product.length,
            };
            // connect inputs to the and gate
            product.forEach((v, k) => {
                if ((0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v)) {
                    wires.push({
                        from: negatedInputs[(0,_variables__WEBPACK_IMPORTED_MODULE_1__.fromVariable)(v)].outputs[0].id,
                        to: productGate.inputs[k].id,
                    });
                }
                else {
                    wires.push({
                        from: inputs[(0,_variables__WEBPACK_IMPORTED_MODULE_1__.fromVariable)(v)].id,
                        to: productGate.inputs[k].id,
                    });
                }
            });
            // add and gate to components
            components.push(productGate);
            // connect and gate to output
            wires.push({
                from: productGate.outputs[0].id,
                to: outputs[i].id,
            });
            return;
        }
        const sumGate = {
            reified: reified++,
            permanent: false,
            type: "COMPONENT",
            name: "OR",
            inputs: sum.map(() => ({ id: id.next().value, activated: false })),
            outputs: [{ id: id.next().value, activated: false }],
            x: 550,
            y: i * 50 + 100,
            angle: 0,
            complementary: false,
            joins: sum.length,
        };
        sum.forEach((o, j) => {
            const product = o.split(/(?=\w)/);
            const productGate = {
                reified: reified++,
                permanent: false,
                type: "COMPONENT",
                name: "AND",
                inputs: product.map((v) => ({ id: id.next().value, activated: (0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v) })),
                outputs: [{ id: id.next().value, activated: product.every((v) => (0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v)) }],
                x: 350,
                y: i * 50 + 100 + (product.length / 2 - j) * 50,
                angle: 0,
                complementary: false,
                joins: product.length,
            };
            // update or gate input
            sumGate.inputs[j].activated = productGate.outputs[0].activated;
            // connect inputs to the and gate
            product.forEach((v, k) => {
                if ((0,_variables__WEBPACK_IMPORTED_MODULE_1__.isInversion)(v)) {
                    wires.push({
                        from: negatedInputs[(0,_variables__WEBPACK_IMPORTED_MODULE_1__.fromVariable)(v)].outputs[0].id,
                        to: productGate.inputs[k].id,
                    });
                }
                else {
                    wires.push({
                        from: inputs[(0,_variables__WEBPACK_IMPORTED_MODULE_1__.fromVariable)(v)].id,
                        to: productGate.inputs[k].id,
                    });
                }
            });
            // add and gate to components
            components.push(productGate);
            // connect and gate to or gate
            wires.push({
                from: productGate.outputs[0].id,
                to: sumGate.inputs[j].id,
            });
        });
        // add or gate to components
        components.push(sumGate);
        // connect or gate to output
        wires.push({
            from: sumGate.outputs[0].id,
            to: outputs[i].id,
        });
        return;
    });
    return {
        settings: {
            "DraggingManager.snapToGrid": false,
        },
        components,
        wires,
    };
}


/***/ }),

/***/ "./src/cad/algebra/stringify.ts":
/*!**************************************!*\
  !*** ./src/cad/algebra/stringify.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "stringify": () => (/* binding */ stringify)
/* harmony export */ });
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../circular */ "./src/circular.ts");
/* harmony import */ var _variables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./variables */ "./src/cad/algebra/variables.ts");


/** formats a list of inputs according to the method being used */
function expression(input, type) {
    // expression is a sum, join by '+' for "a+b+c"
    if (type === "PRODUCT_OF_SUMS")
        return input.map((_, i) => (0,_variables__WEBPACK_IMPORTED_MODULE_1__.variableFor)(i, _)).join("+");
    // otherwise it is a product, like "abc"
    if (type === "SUM_OF_PRODUCTS")
        return input.map((_, i) => (0,_variables__WEBPACK_IMPORTED_MODULE_1__.variableFor)(i, !_)).join("");
    return (0,_circular__WEBPACK_IMPORTED_MODULE_0__.assertNever)(type);
}
/** turns a truth table into a list of expressions that represent each output */
function stringify(table) {
    // can't stringify correctly if there are too many inputs
    if (table.some(([inputs]) => inputs.length > _variables__WEBPACK_IMPORTED_MODULE_1__.VARIABLE_NAMES.length))
        throw new RangeError(`Table contains more than ${_variables__WEBPACK_IMPORTED_MODULE_1__.VARIABLE_NAMES.length} inputs.`);
    const outputs = table.map(([, outputs]) => outputs);
    // transpose outputs for easier processing
    const transposed = outputs[0].map((_, col) => outputs.map((row) => row[col]));
    return transposed.map((out, index) => {
        // always true, use (a+¬a)
        if (out.every(Boolean))
            return `(a+a${_variables__WEBPACK_IMPORTED_MODULE_1__.UNICODE_MACRON_DIACRITIC})`;
        // always false, use a¬a
        if (!out.some(Boolean))
            return `aa${_variables__WEBPACK_IMPORTED_MODULE_1__.UNICODE_MACRON_DIACRITIC}`;
        // determine what method to use
        // if there are more trues than falses, use product of sums
        // otherwise, use sum of products
        // this makes it so that there are less outputs to generate expressions for
        const type = out.filter(Boolean).length > out.length / 2 ? "PRODUCT_OF_SUMS" : "SUM_OF_PRODUCTS";
        // filter for false outputs
        if (type === "PRODUCT_OF_SUMS") {
            return ("(" +
                table
                    .filter(([, outputs]) => outputs[index] === false)
                    .map(([inputs]) => expression(inputs, type))
                    .join(")(") +
                ")");
        }
        // filter for true outputs
        if (type === "SUM_OF_PRODUCTS") {
            return table
                .filter(([, outputs]) => outputs[index] === true)
                .map(([inputs]) => expression(inputs, type))
                .join("+");
        }
        return (0,_circular__WEBPACK_IMPORTED_MODULE_0__.assertNever)(type);
    });
}


/***/ }),

/***/ "./src/cad/algebra/substitute.ts":
/*!***************************************!*\
  !*** ./src/cad/algebra/substitute.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "substitute": () => (/* binding */ substitute)
/* harmony export */ });
/* harmony import */ var _variables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./variables */ "./src/cad/algebra/variables.ts");

// Array.prototype.some represents an or gate
// Array.prototype.every represents an and gate
// thus, a product of sums is really .some followed by .every
// and a sum of products is really a .every followed by .some
/** evaluates a list of expressions with the given inputs */
function substitute(exprs, using) {
    return exprs.map((expr) => {
        // product of sums
        if (expr.startsWith("(") && expr.endsWith(")")) {
            // need to get each sum
            return expr
                .slice(1, -1)
                .split(")(")
                .map((o) => o
                .split("+")
                .map((v) => ((0,_variables__WEBPACK_IMPORTED_MODULE_0__.isInversion)(v) ? !using[(0,_variables__WEBPACK_IMPORTED_MODULE_0__.fromVariable)(v)] : using[(0,_variables__WEBPACK_IMPORTED_MODULE_0__.fromVariable)(v)]))
                .some(Boolean))
                .every(Boolean);
        }
        // sum of products
        // splitting by lookahead regex because of macro diacritic and primes or double primes
        return expr
            .split("+")
            .map((o) => o
            .split(/(?=\w)/)
            .map((v) => ((0,_variables__WEBPACK_IMPORTED_MODULE_0__.isInversion)(v) ? !using[(0,_variables__WEBPACK_IMPORTED_MODULE_0__.fromVariable)(v)] : using[(0,_variables__WEBPACK_IMPORTED_MODULE_0__.fromVariable)(v)]))
            .every(Boolean))
            .some(Boolean);
    });
}


/***/ }),

/***/ "./src/cad/algebra/variables.ts":
/*!**************************************!*\
  !*** ./src/cad/algebra/variables.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ALPHABET": () => (/* binding */ ALPHABET),
/* harmony export */   "UNICODE_MACRON_DIACRITIC": () => (/* binding */ UNICODE_MACRON_DIACRITIC),
/* harmony export */   "VARIABLE_NAMES": () => (/* binding */ VARIABLE_NAMES),
/* harmony export */   "fromVariable": () => (/* binding */ fromVariable),
/* harmony export */   "invertVariable": () => (/* binding */ invertVariable),
/* harmony export */   "isInversion": () => (/* binding */ isInversion),
/* harmony export */   "variableFor": () => (/* binding */ variableFor)
/* harmony export */ });
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
// repeats 3 times to add primes and double primes
const VARIABLE_NAMES = ALPHABET.repeat(3)
    .split("")
    .map((c, i) => `${c}${["", "ʹ", "ʺ"][Math.floor(i / ALPHABET.length)]}`);
/** used to negate something, "ā" */
const UNICODE_MACRON_DIACRITIC = "\u0304";
/** converts index of input into variable name */
function variableFor(i, invert) {
    return invert ? VARIABLE_NAMES[i].replace(/^(\w)/, "$1" + UNICODE_MACRON_DIACRITIC) : VARIABLE_NAMES[i];
}
/** converts variable name into index of input */
function fromVariable(v) {
    return VARIABLE_NAMES.indexOf(v.replace(UNICODE_MACRON_DIACRITIC, ""));
}
/** changes a variable into its inverted version (does not toggle) */
function invertVariable(v) {
    return v.replace(/^(\w)/, "$1" + UNICODE_MACRON_DIACRITIC);
}
/** checks if the variable is an inverted version */
function isInversion(v) {
    return v.includes(UNICODE_MACRON_DIACRITIC);
}


/***/ }),

/***/ "./src/cad/employee.ts":
/*!*****************************!*\
  !*** ./src/cad/employee.ts ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _algebra_reify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./algebra/reify */ "./src/cad/algebra/reify.ts");
/* harmony import */ var _algebra_stringify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algebra/stringify */ "./src/cad/algebra/stringify.ts");
/* harmony import */ var _algebra_substitute__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./algebra/substitute */ "./src/cad/algebra/substitute.ts");



try {
    // wait for boss to give us the table
    const table = await new Promise((resolve, reject) => {
        self.onmessage = (e) => resolve(e.data);
        self.onerror = (e) => reject(e);
    });
    self.postMessage({
        code: "MESSAGE",
        message: "Received:\n" + table.map((row) => row.map((col) => col.map(Number).join(" ")).join(" | ")).join("\n"),
    });
    self.postMessage({
        code: "MESSAGE",
        message: "Expressions:\n" +
            (0,_algebra_stringify__WEBPACK_IMPORTED_MODULE_1__.stringify)(table)
                .map((row, i) => `output ${i + 1}: ${row}`)
                .join("\n"),
    });
    self.postMessage({
        code: "MESSAGE",
        message: "Tests:\n" +
            table
                .map(([input]) => `input ${input.map(Number).join(" ")}: ` +
                (0,_algebra_substitute__WEBPACK_IMPORTED_MODULE_2__.substitute)((0,_algebra_stringify__WEBPACK_IMPORTED_MODULE_1__.stringify)(table), input).map(Number).join(" "))
                .join("\n"),
    });
    const generated = (0,_algebra_reify__WEBPACK_IMPORTED_MODULE_0__.reify)(table[0][0].length, table[0][1].length, (0,_algebra_stringify__WEBPACK_IMPORTED_MODULE_1__.stringify)(table));
    const link = new URL(location.href);
    link.pathname = "";
    link.search = "?inline=" + btoa(JSON.stringify(generated));
    self.postMessage({
        code: "MESSAGE",
        message: "Link:\n" + link.href,
    });
    self.postMessage({
        code: "FINISHED",
        message: "Generated:\n" + JSON.stringify(generated, undefined, 4),
    });
}
catch (e) {
    self.postMessage({ code: "ERROR", error: e });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/cad/files.ts":
/*!**************************!*\
  !*** ./src/cad/files.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "downloadFile": () => (/* binding */ downloadFile),
/* harmony export */   "fileInput": () => (/* binding */ fileInput)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");


/** asks user to input a file */
async function fileInput() {
    const input = Object.assign(document.createElement("input"), { type: "file" });
    input.click();
    const file = await new Promise((resolve) => {
        input.onchange = () => resolve(input.files?.[0] ?? undefined);
        input.onerror = () => resolve(undefined);
    });
    if (!file)
        return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_1__.ToastManager.toast({
            message: "No file was provided.",
            color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
            duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
        });
    const reader = new FileReader();
    reader.readAsText(file);
    const raw = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result?.toString() ?? undefined);
        reader.onerror = () => resolve(undefined);
    });
    if (!raw)
        return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_1__.ToastManager.toast({
            message: "Unable to read the file.",
            color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
            duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
        });
    return raw;
}
/** downloads the contents as a file */
async function downloadFile(contents) {
    Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(new Blob(contents, {
            type: "text/plain",
        })),
        download: "table.gatesim.txt",
    }).click();
}


/***/ }),

/***/ "./src/circular.ts":
/*!*************************!*\
  !*** ./src/circular.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IS_MAC_OS": () => (/* binding */ IS_MAC_OS),
/* harmony export */   "assertNever": () => (/* binding */ assertNever)
/* harmony export */ });
// this file only exists to break circular dependencies
const IS_MAC_OS = typeof navigator !== "undefined"
    ? [navigator.userAgentData?.platform, navigator.platform].some((platform) => platform?.toLowerCase().includes("mac") ?? false)
    : false;
function assertNever(...args) {
    if (!args.length)
        throw new Error();
    return args[0];
}


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACTIVATED_CSS_COLOR": () => (/* binding */ ACTIVATED_CSS_COLOR),
/* harmony export */   "APP_NAME": () => (/* binding */ APP_NAME),
/* harmony export */   "CHIP_COMPONENT_CSS_HEIGHT": () => (/* binding */ CHIP_COMPONENT_CSS_HEIGHT),
/* harmony export */   "CHIP_COMPONENT_CSS_WIDTH": () => (/* binding */ CHIP_COMPONENT_CSS_WIDTH),
/* harmony export */   "CHIP_INPUT_CSS_SIZE": () => (/* binding */ CHIP_INPUT_CSS_SIZE),
/* harmony export */   "CHIP_OUTPUT_CSS_SIZE": () => (/* binding */ CHIP_OUTPUT_CSS_SIZE),
/* harmony export */   "COUNTER_GENERATOR": () => (/* binding */ COUNTER_GENERATOR),
/* harmony export */   "DARKER_GRAY_CSS_COLOR": () => (/* binding */ DARKER_GRAY_CSS_COLOR),
/* harmony export */   "DARK_ACTIVATED_CSS_COLOR": () => (/* binding */ DARK_ACTIVATED_CSS_COLOR),
/* harmony export */   "DARK_GRAY_CSS_COLOR": () => (/* binding */ DARK_GRAY_CSS_COLOR),
/* harmony export */   "DELAY": () => (/* binding */ DELAY),
/* harmony export */   "EVEN_DARKER_GRAY_CSS_COLOR": () => (/* binding */ EVEN_DARKER_GRAY_CSS_COLOR),
/* harmony export */   "EVEN_LIGHTER_GRAY_CSS_COLOR": () => (/* binding */ EVEN_LIGHTER_GRAY_CSS_COLOR),
/* harmony export */   "GET_ACTIVATED_COLOR": () => (/* binding */ GET_ACTIVATED_COLOR),
/* harmony export */   "GET_BACKGROUND_CANVAS_CTX": () => (/* binding */ GET_BACKGROUND_CANVAS_CTX),
/* harmony export */   "GET_BIN_PERMS": () => (/* binding */ GET_BIN_PERMS),
/* harmony export */   "GET_FOREGROUND_CANVAS_CTX": () => (/* binding */ GET_FOREGROUND_CANVAS_CTX),
/* harmony export */   "GET_GRAY_COLOR": () => (/* binding */ GET_GRAY_COLOR),
/* harmony export */   "GRID_SIZE": () => (/* binding */ GRID_SIZE),
/* harmony export */   "INPUT_COMPONENT_CSS_SIZE": () => (/* binding */ INPUT_COMPONENT_CSS_SIZE),
/* harmony export */   "IN_DEBUG_MODE": () => (/* binding */ IN_DEBUG_MODE),
/* harmony export */   "KINDA_DARK_GRAY_CSS_COLOR": () => (/* binding */ KINDA_DARK_GRAY_CSS_COLOR),
/* harmony export */   "KINDA_LIGHT_GRAY_CSS_COLOR": () => (/* binding */ KINDA_LIGHT_GRAY_CSS_COLOR),
/* harmony export */   "LIGHTER_GRAY_CSS_COLOR": () => (/* binding */ LIGHTER_GRAY_CSS_COLOR),
/* harmony export */   "LIGHT_GRAY_CSS_COLOR": () => (/* binding */ LIGHT_GRAY_CSS_COLOR),
/* harmony export */   "LOCKED_FOR_TESTING": () => (/* binding */ LOCKED_FOR_TESTING),
/* harmony export */   "MID_GRAY_CSS_COLOR": () => (/* binding */ MID_GRAY_CSS_COLOR),
/* harmony export */   "NOT_REALLY_DARK_GRAY_CSS_COLOR": () => (/* binding */ NOT_REALLY_DARK_GRAY_CSS_COLOR),
/* harmony export */   "NO_RENDERING": () => (/* binding */ NO_RENDERING),
/* harmony export */   "ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR": () => (/* binding */ ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR),
/* harmony export */   "ORIGIN_POINT": () => (/* binding */ ORIGIN_POINT),
/* harmony export */   "OUTPUT_COMPONENT_CSS_SIZE": () => (/* binding */ OUTPUT_COMPONENT_CSS_SIZE),
/* harmony export */   "QUICKPICK_SIZE": () => (/* binding */ QUICKPICK_SIZE),
/* harmony export */   "ROUND_TO_NEAREST": () => (/* binding */ ROUND_TO_NEAREST),
/* harmony export */   "SCUFFED_UUID": () => (/* binding */ SCUFFED_UUID),
/* harmony export */   "SLIGHTLY_DARKER_GRAY_CSS_COLOR": () => (/* binding */ SLIGHTLY_DARKER_GRAY_CSS_COLOR),
/* harmony export */   "SUPER_GRAY_CSS_COLOR": () => (/* binding */ SUPER_GRAY_CSS_COLOR),
/* harmony export */   "TOAST_DURATION": () => (/* binding */ TOAST_DURATION)
/* harmony export */ });
/* harmony import */ var _managers_DarkmodeManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./managers/DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./managers/ModalManager */ "./src/managers/ModalManager.ts");


const INPUT_COMPONENT_CSS_SIZE = 24;
const OUTPUT_COMPONENT_CSS_SIZE = 24;
const CHIP_COMPONENT_CSS_WIDTH = 120;
const CHIP_COMPONENT_CSS_HEIGHT = 40;
const CHIP_INPUT_CSS_SIZE = 16;
const CHIP_OUTPUT_CSS_SIZE = 16;
const ORIGIN_POINT = Object.freeze({ x: 0, y: 0 });
const IN_DEBUG_MODE = new URL(location.href).searchParams.has("debug");
const NO_RENDERING = new URL(location.href).searchParams.has("norender");
const LOCKED_FOR_TESTING = () => _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("The diagram is currently locked. No changes can be made.");
const DELAY = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay));
const GET_BACKGROUND_CANVAS_CTX = () => document.querySelector("canvas.background-canvas").getContext("2d");
const GET_FOREGROUND_CANVAS_CTX = () => document.querySelector("canvas.foreground-canvas").getContext("2d");
const COUNTER_GENERATOR = function* (i = 0) {
    while (true)
        yield i++;
};
const SCUFFED_UUID = () => Date.now().toString(36) + Number(Date.now().toString().split("").reverse().join("")).toString(36);
const ROUND_TO_NEAREST = (x, n) => Math.round(x / n) * n;
const GET_ACTIVATED_COLOR = () => _managers_DarkmodeManager__WEBPACK_IMPORTED_MODULE_0__.DarkmodeManager.darkmodeEnabled ? DARK_ACTIVATED_CSS_COLOR : ACTIVATED_CSS_COLOR;
const GET_GRAY_COLOR = () => _managers_DarkmodeManager__WEBPACK_IMPORTED_MODULE_0__.DarkmodeManager.darkmodeEnabled ? ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR : LIGHT_GRAY_CSS_COLOR;
const GET_BIN_PERMS = (n) => Array.from({ length: Math.pow(2, n) }, (_, y) => Array.from({ length: n }, (_, x) => !!((y >> x) & 1)));
const ACTIVATED_CSS_COLOR = "#ff2626";
const DARK_ACTIVATED_CSS_COLOR = "#dd1111";
const EVEN_DARKER_GRAY_CSS_COLOR = "#0a0a0c";
const SLIGHTLY_DARKER_GRAY_CSS_COLOR = "#101012";
const DARKER_GRAY_CSS_COLOR = "#16161f";
const DARK_GRAY_CSS_COLOR = "#1c1c24";
const KINDA_DARK_GRAY_CSS_COLOR = "#24242e";
const NOT_REALLY_DARK_GRAY_CSS_COLOR = "#2e2e3f";
const ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR = "#3c3c4f";
const MID_GRAY_CSS_COLOR = "#40404f";
const SUPER_GRAY_CSS_COLOR = "#bbbbbb";
const KINDA_LIGHT_GRAY_CSS_COLOR = "#cdcdcd";
const LIGHT_GRAY_CSS_COLOR = "#dedede";
const LIGHTER_GRAY_CSS_COLOR = "#eaeaea";
const EVEN_LIGHTER_GRAY_CSS_COLOR = "#efefef";
const TOAST_DURATION = 2500;
const GRID_SIZE = 15;
const QUICKPICK_SIZE = 75;
const APP_NAME = (new URL(location.href).searchParams.get("app") ?? "sim").toLowerCase();


/***/ }),

/***/ "./src/contextmenu/insert.ts":
/*!***********************************!*\
  !*** ./src/contextmenu/insert.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "componentNameMap": () => (/* binding */ componentNameMap),
/* harmony export */   "insert": () => (/* binding */ insert)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Display__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Display */ "./src/reified/Display.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reified/SevenSegmentDisplay */ "./src/reified/SevenSegmentDisplay.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../reified/chips */ "./src/reified/chips.ts");










const componentNameMap = new Map([
    ["DISPLAY", () => new _reified_Display__WEBPACK_IMPORTED_MODULE_6__.Display()],
    ["7SEG", () => new _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__.SevenSegmentDisplay()],
    ["7SD", () => new _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__.SevenSegmentDisplay()],
    ["SEVEN_SEG", () => new _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__.SevenSegmentDisplay()],
    ["SEVEN_SEGMENT_DISPLAY", () => new _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__.SevenSegmentDisplay()],
]);
const insert = {
    "insert-component": {
        label: "Insert component",
        keybind: "A",
        callback: async (e, n) => {
            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
            const name = typeof n === "string" ? n : await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.prompt("Enter the component's name:");
            if (typeof name !== "string" || !name.trim())
                return;
            const chip = _reified_chips__WEBPACK_IMPORTED_MODULE_9__.chips.get(name.toUpperCase());
            const componentName = name.toUpperCase();
            const component = chip
                ? new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(Reflect.construct(chip, []), _constants__WEBPACK_IMPORTED_MODULE_0__.ORIGIN_POINT)
                : componentNameMap.get(componentName)?.();
            if (!component)
                return _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("No component was found with that name.");
            const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.add(component);
                if (_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.has(component)) {
                    component.attach();
                    const { width, height } = getComputedStyle(component.element);
                    component.move({
                        x: e.clientX - parseFloat(width) / 2,
                        y: e.clientY - parseFloat(height) / 2,
                    });
                    _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.select(component);
                }
            }, () => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active["delete"](component);
                component.detach();
                _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected = selection;
            });
        },
    },
};


/***/ }),

/***/ "./src/contextmenu/io.ts":
/*!*******************************!*\
  !*** ./src/contextmenu/io.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "io": () => (/* binding */ io)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");







const io = {
    "new-input": {
        label: "New input",
        keybind: "I",
        callback: (e) => {
            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
            const input = new _reified_Input__WEBPACK_IMPORTED_MODULE_4__.Input({
                x: e.clientX - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
                y: e.clientY - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
            });
            const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected.clone(true);
            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.pushHistory(() => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.add(input);
                if (_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.has(input)) {
                    input.attach();
                    _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.select(input);
                }
            }, () => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active["delete"](input);
                input.detach();
                _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected = selection;
            });
        },
    },
    "new-output": {
        label: "New output",
        keybind: "O",
        callback: (e) => {
            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
            const output = new _reified_Output__WEBPACK_IMPORTED_MODULE_5__.Output({
                x: e.clientX - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
                y: e.clientY - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
            });
            const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected.clone(true);
            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.pushHistory(() => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.add(output);
                if (_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.has(output)) {
                    output.attach();
                    _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.select(output);
                }
            }, () => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active["delete"](output);
                output.detach();
                _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected = selection;
            });
        },
    },
};


/***/ }),

/***/ "./src/files.ts":
/*!**********************!*\
  !*** ./src/files.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromFile": () => (/* binding */ fromFile),
/* harmony export */   "saveDiagram": () => (/* binding */ saveDiagram)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Display__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reified/Display */ "./src/reified/Display.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./reified/SevenSegmentDisplay */ "./src/reified/SevenSegmentDisplay.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./reified/chips */ "./src/reified/chips.ts");










function saveDiagram(components, wires) {
    const id = (0,_constants__WEBPACK_IMPORTED_MODULE_0__.COUNTER_GENERATOR)();
    const ids = new Map();
    const data = {
        settings: {
            ["DraggingManager.snapToGrid"]: _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.snapToGrid,
        },
        components: components.map((component, reified) => {
            if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input) {
                ids.set(component.element, id.next().value);
                return {
                    reified,
                    permanent: component.permanence,
                    type: "INPUT",
                    activated: component.element.classList.contains("activated"),
                    id: ids.get(component.element),
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                };
            }
            if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output) {
                ids.set(component.element, id.next().value);
                return {
                    reified,
                    permanent: component.permanence,
                    type: "OUTPUT",
                    activated: component.element.classList.contains("activated"),
                    id: ids.get(component.element),
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                };
            }
            if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component) {
                return {
                    reified,
                    permanent: component.permanence,
                    type: "COMPONENT",
                    name: component.chip.name,
                    inputs: component.inputs.map((i) => {
                        ids.set(i, id.next().value);
                        return { id: ids.get(i), activated: i.classList.contains("activated") };
                    }),
                    outputs: component.outputs.map((o) => {
                        ids.set(o, id.next().value);
                        return { id: ids.get(o), activated: o.classList.contains("activated") };
                    }),
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                    angle: component.angle,
                    complementary: component.complementary,
                    joins: component.joins,
                };
            }
            if (component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display) {
                return {
                    reified,
                    permanent: component.permanence,
                    type: "DISPLAY",
                    inputs: component.inputs.map((i) => {
                        ids.set(i, id.next().value);
                        return { id: ids.get(i), activated: i.classList.contains("activated") };
                    }),
                    outputs: component.outputs.map((o) => {
                        ids.set(o, id.next().value);
                        return { id: ids.get(o), activated: o.classList.contains("activated") };
                    }),
                    radix: component.radix,
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                    angle: component.angle,
                };
            }
            if (component instanceof _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__.SevenSegmentDisplay) {
                return {
                    reified,
                    permanent: component.permanence,
                    type: "SEVEN_SEGMENT_DISPLAY",
                    inputs: component.inputs.map((i) => {
                        ids.set(i, id.next().value);
                        return { id: ids.get(i), activated: i.classList.contains("activated") };
                    }),
                    outputs: component.outputs.map((o) => {
                        ids.set(o, id.next().value);
                        return { id: ids.get(o), activated: o.classList.contains("activated") };
                    }),
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                    angle: component.angle,
                };
            }
            _managers_ToastManager__WEBPACK_IMPORTED_MODULE_2__.ToastManager.toast({
                message: "Unable to serialize diagram.",
                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
            });
            throw new Error("Unknown Reified component type.");
        }),
        wires: wires
            .filter((wire) => !wire.destroyed)
            .map((wire) => ({
            from: ids.get(wire.from),
            to: ids.get(wire.to),
        })),
    };
    return JSON.stringify(data, undefined, _constants__WEBPACK_IMPORTED_MODULE_0__.IN_DEBUG_MODE ? 4 : undefined);
}
function fromFile(file) {
    try {
        const data = JSON.parse(file);
        validate(data);
        const elements = new Map();
        const reified = data.components.map((raw) => {
            if (raw.type === "INPUT") {
                const input = new _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input(raw);
                input.element.classList.toggle("activated", raw.activated);
                elements.set(raw.id, input.element);
                return raw.permanent ? input.permanent() : input;
            }
            if (raw.type === "OUTPUT") {
                const output = new _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output(raw);
                output.element.classList.toggle("activated", raw.activated);
                elements.set(raw.id, output.element);
                return raw.permanent ? output.permanent() : output;
            }
            if (raw.type === "DISPLAY") {
                const display = new _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display(raw, raw.inputs.length, raw.radix).rotate(raw.angle);
                display.inputs.forEach((input, index) => {
                    input.classList.toggle("activated", raw.inputs[index].activated);
                    elements.set(raw.inputs[index].id, input);
                });
                display.outputs.forEach((output, index) => {
                    output.classList.toggle("activated", raw.outputs[index].activated);
                    elements.set(raw.outputs[index].id, output);
                });
                return raw.permanent ? display.permanent() : display;
            }
            if (raw.type === "SEVEN_SEGMENT_DISPLAY") {
                const display = new _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__.SevenSegmentDisplay(raw).rotate(raw.angle);
                display.inputs.forEach((input, index) => {
                    input.classList.toggle("activated", raw.inputs[index].activated);
                    elements.set(raw.inputs[index].id, input);
                });
                display.outputs.forEach((output, index) => {
                    output.classList.toggle("activated", raw.outputs[index].activated);
                    elements.set(raw.outputs[index].id, output);
                });
                return raw.permanent ? display.permanent() : display;
            }
            const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component(new (_reified_chips__WEBPACK_IMPORTED_MODULE_9__.chips.get(raw.name))(), raw, raw.complementary, raw.joins).rotate(raw.angle);
            component.inputs.forEach((input, index) => {
                input.classList.toggle("activated", raw.inputs[index].activated);
                elements.set(raw.inputs[index].id, input);
            });
            component.outputs.forEach((output, index) => {
                output.classList.toggle("activated", raw.outputs[index].activated);
                elements.set(raw.outputs[index].id, output);
            });
            return raw.permanent ? component.permanent() : component;
        });
        const wires = data.wires.map(({ from, to }) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(elements.get(from), elements.get(to)));
        return { result: [data.settings, reified, wires], error: undefined };
    }
    catch (e) {
        if (e instanceof Error)
            return { error: e.message, result: [] };
        return { error: "Failed to process file.", result: [] };
    }
}
// giant mess to make sure the provided data matches the expected type
function validate(data) {
    if (!data || typeof data !== "object")
        throw new Error("Data is not an object.");
    if (!("settings" in data))
        throw new Error("Data is missing project settings.");
    if (typeof data.settings !== "object" || !data.settings)
        throw new Error("Project settings should be an object.");
    if (!("components" in data))
        throw new Error("Data is missing components.");
    if (!Array.isArray(data.components))
        throw new Error("Components data is not an array.");
    if (!("wires" in data))
        throw new Error("Data is missing wires.");
    if (!Array.isArray(data.wires))
        throw new Error("Wires data is not an array.");
    if (!("DraggingManager.snapToGrid" in data.settings))
        throw new Error("Missing setting 'DraggingManager.snapToGrid'.");
    for (const component of data.components) {
        if (!component || typeof component !== "object")
            throw new Error("Component data must an object.");
        if (!("reified" in component))
            throw new Error("Components data is missing reified id.");
        if (typeof component.reified !== "number")
            throw new Error("Reified id must be a number.");
        if (!("permanent" in component))
            throw new Error("Components data is missing permanence status.");
        if (typeof component.permanent !== "boolean")
            throw new Error("Component permanence must be a boolean.");
        if (!("type" in component))
            throw new Error("Components data is missing a type.");
        if (typeof component.type !== "string" ||
            !["INPUT", "OUTPUT", "COMPONENT", "DISPLAY", "SEVEN_SEGMENT_DISPLAY"].includes(component.type))
            throw new Error("Invalid component type.");
        if (!("x" in component))
            throw new Error("Components data is missing a x coordinate.");
        if (typeof component.x !== "number")
            throw new Error("Component x coordinate must be a number.");
        if (!("y" in component))
            throw new Error("Components data is missing a y coordinate.");
        if (typeof component.y !== "number")
            throw new Error("Component y coordinate must be a number.");
        switch (component.type) {
            case "INPUT":
            case "OUTPUT": {
                if (!("id" in component))
                    throw new Error("I/O data is missing ids.");
                if (typeof component.id !== "number")
                    throw new Error("I/O id must be a number.");
                if (!("activated" in component))
                    throw new Error("I/O data is missing activation status.");
                if (typeof component.activated !== "boolean")
                    throw new Error("Activation status must be a boolean.");
                break;
            }
            case "COMPONENT": {
                if (!("angle" in component))
                    throw new Error("Component data is missing rotation angle.");
                if (typeof component.angle !== "number")
                    throw new Error("Rotation angle must be a number.");
                if (!("complementary" in component))
                    throw new Error("Component data is missing complementary output.");
                if (typeof component.complementary !== "boolean")
                    throw new Error("Complementary output must be a boolean.");
                if (!("joins" in component))
                    throw new Error("Component data is missing joins.");
                if (typeof component.joins !== "number")
                    throw new Error("Joins count must be a number.");
                if (!("inputs" in component))
                    throw new Error("Component data is missing inputs.");
                if (!Array.isArray(component.inputs))
                    throw new Error("Component inputs data must be an array.");
                if (!("outputs" in component))
                    throw new Error("Component data is missing outputs.");
                if (!Array.isArray(component.outputs))
                    throw new Error("Component outputs data must be an array.");
                if (!("name" in component))
                    throw new Error("Component data is missing chip name.");
                if (typeof component.name !== "string")
                    throw new Error("Chip name must be a string.");
                if (!_reified_chips__WEBPACK_IMPORTED_MODULE_9__.chips.has(component.name.trim().toUpperCase()))
                    throw new Error("Chip name doesn't exist.");
                const Chip = _reified_chips__WEBPACK_IMPORTED_MODULE_9__.chips.get(component.name.trim().toUpperCase());
                if (component.inputs.length !==
                    (component.joins !== Chip.INPUTS ? component.inputs.length : Chip.INPUTS))
                    throw new Error("Component inputs does not match chip inputs.");
                if (component.outputs.length !== (component.complementary ? Chip.OUTPUTS + 1 : Chip.OUTPUTS))
                    throw new Error("Component outputs does not match chip outputs.");
                for (const input of component.inputs) {
                    if (!input || typeof input !== "object")
                        throw new Error("Input data must be an object");
                    if (!("id" in input))
                        throw new Error("Input data is missing id.");
                    if (typeof input.id !== "number")
                        throw new Error("Input data id must be a number.");
                    if (!("activated" in input))
                        throw new Error("Input data is missing activation status.");
                    if (typeof input.activated !== "boolean")
                        throw new Error("Activation status must be a boolean.");
                }
                for (const output of component.outputs) {
                    if (!output || typeof output !== "object")
                        throw new Error("Input data must be an object");
                    if (!("id" in output))
                        throw new Error("Input data is missing id.");
                    if (typeof output.id !== "number")
                        throw new Error("Input data id must be a number.");
                    if (!("activated" in output))
                        throw new Error("Input data is missing activation status.");
                    if (typeof output.activated !== "boolean")
                        throw new Error("Activation status must be a boolean.");
                }
                break;
            }
            case "DISPLAY":
            case "SEVEN_SEGMENT_DISPLAY": {
                if (!("angle" in component))
                    throw new Error("Display data is missing rotation angle.");
                if (typeof component.angle !== "number")
                    throw new Error("Rotation angle must be a number.");
                // radix doesn't apply to seven segment displays
                if (component.type === "DISPLAY") {
                    if (!("radix" in component))
                        throw new Error("Display data is missing display radix.");
                    if (typeof component.radix !== "number")
                        throw new Error("Display radix must be a number.");
                }
                if (!("inputs" in component))
                    throw new Error("Display data is missing inputs.");
                if (!Array.isArray(component.inputs))
                    throw new Error("Display inputs data must be an array.");
                if (!("outputs" in component))
                    throw new Error("Display data is missing outputs.");
                if (!Array.isArray(component.outputs))
                    throw new Error("Display outputs data must be an array.");
                for (const input of component.inputs) {
                    if (!input || typeof input !== "object")
                        throw new Error("Input data must be an object");
                    if (!("id" in input))
                        throw new Error("Input data is missing id.");
                    if (typeof input.id !== "number")
                        throw new Error("Input data id must be a number.");
                    if (!("activated" in input))
                        throw new Error("Input data is missing activation status.");
                    if (typeof input.activated !== "boolean")
                        throw new Error("Activation status must be a boolean.");
                }
                for (const output of component.outputs) {
                    if (!output || typeof output !== "object")
                        throw new Error("Input data must be an object");
                    if (!("id" in output))
                        throw new Error("Input data is missing id.");
                    if (typeof output.id !== "number")
                        throw new Error("Input data id must be a number.");
                    if (!("activated" in output))
                        throw new Error("Input data is missing activation status.");
                    if (typeof output.activated !== "boolean")
                        throw new Error("Activation status must be a boolean.");
                }
            }
        }
    }
    const ids = data.components.flatMap((component) => component.type === "COMPONENT" || component.type === "DISPLAY" || component.type === "SEVEN_SEGMENT_DISPLAY"
        ? [
            ...component.inputs.map(({ id }) => id),
            ...component.outputs.map(({ id }) => id),
        ]
        : component.id);
    for (const wire of data.wires) {
        if (!wire || typeof wire !== "object")
            throw new Error("Wire data must be an object.");
        if (!("from" in wire))
            throw new Error("Wire data is missing the component it starts from.");
        if (typeof wire.from !== "number")
            throw new Error("Wire data must reference numeric ids.");
        if (!("to" in wire))
            throw new Error("Wire data is missing the target component.");
        if (typeof wire.to !== "number")
            throw new Error("Wire data must reference numeric ids.");
        if (!ids.includes(wire.from) || !ids.includes(wire.to))
            throw new Error("Wire data references invalid ids.");
    }
}


/***/ }),

/***/ "./src/managers/CanvasManager.ts":
/*!***************************************!*\
  !*** ./src/managers/CanvasManager.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CanvasManager": () => (/* binding */ CanvasManager)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");

class CanvasManager {
    static #jobs = new Set();
    static #rAF = -1;
    static #render() {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.NO_RENDERING)
            return;
        const bg = (0,_constants__WEBPACK_IMPORTED_MODULE_0__.GET_BACKGROUND_CANVAS_CTX)();
        const fg = (0,_constants__WEBPACK_IMPORTED_MODULE_0__.GET_FOREGROUND_CANVAS_CTX)();
        bg.canvas.width = window.innerWidth;
        bg.canvas.height = window.innerHeight;
        fg.canvas.width = window.innerWidth;
        fg.canvas.height = window.innerHeight;
        this.#jobs.forEach((job) => {
            job.call(undefined, { bg, fg });
        });
    }
    static start() {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.NO_RENDERING)
            return;
        this.#render();
        const id = requestAnimationFrame(this.start.bind(this));
        this.#rAF = id;
    }
    static stop() {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.NO_RENDERING)
            return;
        cancelAnimationFrame(this.#rAF);
    }
    static addJob(job) {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.NO_RENDERING)
            return;
        this.#jobs.add(job);
    }
    static deleteJob(job) {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.NO_RENDERING)
            return;
        this.#jobs.delete(job);
    }
}


/***/ }),

/***/ "./src/managers/DarkmodeManager.ts":
/*!*****************************************!*\
  !*** ./src/managers/DarkmodeManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DarkmodeManager": () => (/* binding */ DarkmodeManager)
/* harmony export */ });
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");

class DarkmodeManager {
    static #changes = new Set();
    static #darkmodeKey = "settings.darkmode";
    static #darkmodeModalsKey = "settings.darkmodeModals";
    static get darkmodeEnabled() {
        return _StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.get(this.#darkmodeKey) ?? false;
    }
    static set darkmodeEnabled(value) {
        _StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.set(this.#darkmodeKey, value);
        this.#element.innerText = value ? "🌕" : "🌑";
        this.#changes.forEach((run) => run.call(undefined));
        document.body.classList.toggle("darkmode", value);
    }
    static get darkmodeModalsEnabled() {
        return _StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.get(this.#darkmodeModalsKey) ?? false;
    }
    static set darkmodeModalsEnabled(value) {
        _StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.set(this.#darkmodeModalsKey, value);
        this.#element.innerText = value ? "🌕" : "🌑";
        this.#changes.forEach((run) => run.call(undefined));
        document.body.classList.toggle("darkmode-modals", value);
    }
    static get #element() {
        return document.querySelector("button.darkmode");
    }
    static onChange(run) {
        this.#changes.add(run);
        return this;
    }
    static offChange(run) {
        this.#changes.delete(run);
        return this;
    }
    static #listener = () => {
        this.darkmodeEnabled = !this.darkmodeEnabled;
        const buttons = document.querySelectorAll("button.tools, button.settings, button.darkmode");
        buttons.forEach((b) => {
            b.style.transition = "none";
        });
        requestAnimationFrame(() => {
            buttons.forEach((b) => {
                b.style.transition = "";
            });
        });
    };
    static listen() {
        // trigger setters to set up initial state
        this.darkmodeEnabled = this.darkmodeEnabled;
        this.darkmodeModalsEnabled = this.darkmodeModalsEnabled;
        this.#element.innerText = this.darkmodeEnabled ? "🌕" : "🌑";
        this.#element.addEventListener("click", this.#listener);
        return this;
    }
    static stop() {
        this.#element.removeEventListener("click", this.#listener);
        return this;
    }
    static toggleDarkmode(value) {
        this.darkmodeEnabled = typeof value === "boolean" ? value : !this.darkmodeEnabled;
    }
    static toggleDarkmodeModals(value) {
        this.darkmodeModalsEnabled = typeof value === "boolean" ? value : !this.darkmodeModalsEnabled;
    }
}


/***/ }),

/***/ "./src/managers/DraggingManager.ts":
/*!*****************************************!*\
  !*** ./src/managers/DraggingManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DraggingManager": () => (/* binding */ DraggingManager)
/* harmony export */ });
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../circular */ "./src/circular.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _quickpicks_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../quickpicks/components */ "./src/quickpicks/components.ts");
/* harmony import */ var _quickpicks_gates__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../quickpicks/gates */ "./src/quickpicks/gates.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _CanvasManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CanvasManager */ "./src/managers/CanvasManager.ts");
/* harmony import */ var _DarkmodeManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");











class DraggingManager {
    static #dragged;
    static #watched = new Map();
    static #mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };
    static #topleft;
    static #original;
    static #downpos = { x: -1, y: -1 };
    static #positions;
    static #snapToGrid = false;
    static get snapToGrid() {
        return this.#snapToGrid;
    }
    static set snapToGrid(value) {
        this.#snapToGrid = value;
        this.snapToGridBasedUpdate();
        _SandboxManager__WEBPACK_IMPORTED_MODULE_9__.SandboxManager.forceSave();
    }
    static snapToGridBasedUpdate({ forceClear = false, onlyUpdateColor = false } = {
        forceClear: false,
        onlyUpdateColor: false,
    }) {
        if (this.snapToGrid && !forceClear) {
            if (!onlyUpdateColor)
                requestAnimationFrame(() => {
                    _reified_Reified__WEBPACK_IMPORTED_MODULE_4__.Reified.active.forEach((component) => {
                        component.element.style.minWidth = "";
                        component.element.style.minHeight = "";
                        requestAnimationFrame(() => {
                            const style = getComputedStyle(component.element);
                            const top = parseFloat(style.top);
                            const left = parseFloat(style.left);
                            const width = parseFloat(style.width);
                            const height = parseFloat(style.height);
                            component.move({
                                x: Math.floor(left / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE,
                                y: Math.floor(top / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE,
                            });
                            component.element.style.minWidth = Math.ceil(width / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE + "px";
                            component.element.style.minHeight = Math.ceil(height / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE + "px";
                        });
                    });
                });
            document.body.style.backgroundSize = _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE + "px " + _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE + "px";
            if (_DarkmodeManager__WEBPACK_IMPORTED_MODULE_6__.DarkmodeManager.darkmodeEnabled) {
                document.body.style.backgroundImage = `linear-gradient(to right, ${_constants__WEBPACK_IMPORTED_MODULE_1__.EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${_constants__WEBPACK_IMPORTED_MODULE_1__.EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            }
            else {
                document.body.style.backgroundImage = `linear-gradient(to right, ${_constants__WEBPACK_IMPORTED_MODULE_1__.EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${_constants__WEBPACK_IMPORTED_MODULE_1__.EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            }
        }
        else {
            requestAnimationFrame(() => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_4__.Reified.active.forEach((component) => {
                    component.element.style.minWidth = "";
                    component.element.style.minHeight = "";
                });
            });
            document.body.style.backgroundSize = "";
            document.body.style.background = "";
        }
    }
    static watch(element, target = element) {
        element.dataset.watched = "true";
        const mousedown = (e) => {
            this.#dragged = element;
            this.#dragged.dataset.dragged = "true";
            this.#dragged.style.cursor = "grabbing";
            const rect = this.#dragged.getBoundingClientRect();
            this.#mouse.x = e.clientX;
            this.#mouse.y = e.clientY;
            this.#mouse.ix = e.clientX;
            this.#mouse.iy = e.clientY;
            if (!_SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.isSelected(element) &&
                !((_circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("MetaLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("MetaRight"))) ||
                    (!_circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS &&
                        (_KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("ControlLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("ControlRight")))))
                _SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected.clear();
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected.size <= 1) {
                this.#mouse.ox = e.clientX - rect.left;
                this.#mouse.oy = e.clientY - rect.top;
            }
            else {
                this.#positions = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected].map((target) => target.pos);
                // store most top left element as an anchor for the others
                const topleft = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected].sort((a, b) => {
                    const ax = parseFloat(a.element.style.left);
                    const ay = parseFloat(a.element.style.top);
                    const bx = parseFloat(b.element.style.left);
                    const by = parseFloat(b.element.style.top);
                    const ad = Math.sqrt(ax * ax + ay * ay);
                    const bd = Math.sqrt(bx * bx + by * by);
                    return ad - bd;
                })[0].element;
                const bounds = topleft.getBoundingClientRect();
                this.#mouse.ox = e.clientX - bounds.x;
                this.#mouse.oy = e.clientY - bounds.y;
                this.#topleft = topleft;
            }
            this.#original = { x: rect.left, y: rect.top };
        };
        const touchstart = (e) => mousedown(e.touches[0]);
        target.addEventListener("mousedown", mousedown, { capture: true });
        target.addEventListener("touchstart", touchstart, { capture: true });
        this.#watched.set(target, { mousedown, touchstart });
    }
    static forget(element, force) {
        const listener = this.#watched.get(element);
        if (!listener && !force)
            throw new Error(`Element is not currently being watched.`);
        if (listener) {
            delete element.dataset.watched;
            element.removeEventListener("mousedown", listener.mousedown, { capture: true });
            element.removeEventListener("touchstart", listener.touchstart, { capture: true });
            this.#watched.delete(element);
        }
    }
    static reset() {
        this.#watched.forEach((_, element) => this.forget(element));
        this.#mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };
        this.#downpos = { x: -1, y: -1 };
        this.#topleft = undefined;
        this.#dragged = undefined;
        this.#original = undefined;
        this.#positions = undefined;
        this.deafen();
    }
    static render({ fg }) {
        if (DraggingManager.downpos.x !== -1 &&
            DraggingManager.downpos.y !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse.y !== -1) {
            fg.strokeStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_ACTIVATED_COLOR)();
            fg.lineWidth = 2.5;
            fg.lineJoin = "miter";
            fg.strokeRect(DraggingManager.downpos.x, DraggingManager.downpos.y, _MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse.x - DraggingManager.downpos.x, _MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse.y - DraggingManager.downpos.y);
        }
    }
    static listen() {
        this.snapToGridBasedUpdate();
        _CanvasManager__WEBPACK_IMPORTED_MODULE_5__.CanvasManager.addJob(this.render.bind(this));
        document.body.addEventListener("mousemove", this.#mousemove);
        window.addEventListener("mousedown", this.#mousedown);
        window.addEventListener("mouseup", this.#mouseup);
        document.body.addEventListener("touchmove", this.#touchmove);
        document.body.addEventListener("touchstart", this.#touchstart);
        document.body.addEventListener("touchend", this.#touchend);
    }
    static deafen() {
        this.snapToGridBasedUpdate({ forceClear: true });
        document.body.removeEventListener("mousemove", this.#mousemove);
        window.removeEventListener("mousedown", this.#mousedown);
        window.removeEventListener("mouseup", this.#mouseup);
        document.body.removeEventListener("touchmove", this.#touchmove);
        document.body.removeEventListener("touchstart", this.#touchstart);
        document.body.removeEventListener("touchend", this.#touchend);
    }
    static #mousemove = (e) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
        if (this.#dragged) {
            this.#dragged.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_4__.computeTransformOrigin)(this.#dragged);
            if (DraggingManager.snapToGrid) {
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left =
                        Math.floor((this.#mouse.x - this.#mouse.ox) / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE + "px";
                    this.#dragged.style.top =
                        Math.floor((this.#mouse.y - this.#mouse.oy) / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected.forEach((component) => {
                        const offset = component.element.getBoundingClientRect();
                        component.move({
                            x: Math.floor((this.#mouse.x - this.#mouse.ox) / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE +
                                offset.left -
                                topleft.left,
                            y: Math.floor((this.#mouse.y - this.#mouse.oy) / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE +
                                offset.top -
                                topleft.top,
                        });
                    });
                }
            }
            else {
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                    this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected.forEach((component) => {
                        const offset = component.element.getBoundingClientRect();
                        component.move({
                            x: this.#mouse.x - this.#mouse.ox + offset.left - topleft.left,
                            y: this.#mouse.y - this.#mouse.oy + offset.top - topleft.top,
                        });
                    });
                }
            }
        }
    };
    static #mousedown = (e) => {
        const m = e instanceof MouseEvent ? e : e.touches[0];
        this.#mouse.x = m.clientX;
        this.#mouse.y = m.clientY;
        this.#mouse.ix = m.clientX;
        this.#mouse.iy = m.clientY;
        const target = e.target;
        const isOnInvalidTarget = [
            target.closest("button.board-input"),
            target.closest("button.board-output"),
            target.closest("div.component"),
            target.closest("div.display"),
            target.closest("div.contextmenu"),
        ].find((element) => element !== null);
        if (e instanceof MouseEvent) {
            if (!isOnInvalidTarget && e.button === 0) {
                if (_KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("KeyA") && _KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("KeyS")) {
                }
                else if (_KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("KeyA")) {
                    (0,_quickpicks_gates__WEBPACK_IMPORTED_MODULE_3__.quickpickGates)(e);
                }
                else if (_KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("KeyS")) {
                    (0,_quickpicks_components__WEBPACK_IMPORTED_MODULE_2__.quickpickComponents)(e);
                }
                else {
                    this.#downpos.x = m.clientX;
                    this.#downpos.y = m.clientY;
                }
            }
        }
        else {
            if (!isOnInvalidTarget) {
                this.#downpos.x = m.clientX;
                this.#downpos.y = m.clientY;
            }
        }
        this.#mouse.down = true;
    };
    static #mouseup = (e) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
        if (this.#dragged) {
            document.querySelectorAll('[data-dragged="true"]').forEach((e) => {
                delete e.dataset.dragged;
                e.style.cursor = "";
            });
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected.size <= 1) {
                const target = this.#dragged;
                const mouse = this.#mouse;
                const original = this.#original;
                const size = _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_9__.SandboxManager.pushHistory(() => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_4__.computeTransformOrigin)(target);
                            target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                            target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                        }, () => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_4__.computeTransformOrigin)(target);
                            target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                            target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                        });
                    else
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_9__.SandboxManager.pushHistory(() => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_4__.computeTransformOrigin)(target);
                            target.style.left = mouse.x - mouse.ox - 1 + "px";
                            target.style.top = mouse.y - mouse.oy - 1 + "px";
                        }, () => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_4__.computeTransformOrigin)(target);
                            target.style.left = original.x - 1 + "px";
                            target.style.top = original.y - 1 + "px";
                        });
            }
            else if (this.#topleft) {
                const mouse = this.#mouse;
                const targets = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selected];
                const positions = this.#positions;
                const topleft = this.#topleft.getBoundingClientRect();
                const size = _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_9__.SandboxManager.pushHistory(() => {
                            targets.forEach((component) => {
                                const offset = component.element.getBoundingClientRect();
                                component.move({
                                    x: Math.floor((mouse.x - mouse.ox) / size) * size + offset.left - topleft.left,
                                    y: Math.floor((mouse.y - mouse.oy) / size) * size + offset.top - topleft.top,
                                });
                            });
                        }, () => {
                            targets.forEach((component, i) => {
                                component.move(positions[i]);
                            });
                        });
                    else
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_9__.SandboxManager.pushHistory(() => {
                            targets.forEach((component) => {
                                const offset = component.element.getBoundingClientRect();
                                component.move({
                                    x: mouse.x - mouse.ox + offset.left - topleft.left,
                                    y: mouse.y - mouse.oy + offset.top - topleft.top,
                                });
                            });
                        }, () => {
                            targets.forEach((component, i) => {
                                component.move(positions[i]);
                            });
                        });
            }
        }
        if (this.#downpos.x !== -1 &&
            this.#downpos.y !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse.y !== -1)
            _SelectionManager__WEBPACK_IMPORTED_MODULE_10__.SelectionManager.selectAllIn(DraggingManager.#downpos, _MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse);
        this.#mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };
        this.#downpos = { x: -1, y: -1 };
        this.#topleft = undefined;
        this.#dragged = undefined;
        this.#original = undefined;
        this.#positions = undefined;
    };
    static #touchmove = (e) => this.#mousemove(e.touches[0]);
    static #touchstart = (e) => this.#mousedown(e);
    static #touchend = (e) => this.#mouseup(e.touches[0]);
    static get downpos() {
        return { ...this.#downpos };
    }
}


/***/ }),

/***/ "./src/managers/KeybindsManager.ts":
/*!*****************************************!*\
  !*** ./src/managers/KeybindsManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeybindsManager": () => (/* binding */ KeybindsManager)
/* harmony export */ });
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../circular */ "./src/circular.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");


class KeybindsManager {
    static #keymap = new Map();
    static #keychords = new Array();
    static #keydown = (e) => {
        this.#keymap.set(e.code, true);
        if (e.metaKey && (e.code === "ShiftLeft" || e.code === "ShiftRight") && _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            this.#keymap = new Map([...this.#keymap.entries()].filter(([key]) => !key.startsWith("Key")));
        if (document.activeElement === document.body) {
            const [chord, runs] = this.#keychords.find(([chord]) => {
                let keys = chord.split("+");
                const checkShift = keys.includes("ShiftLeft") || keys.includes("ShiftRight");
                const checkCtrl = keys.includes("ControlLeft") || keys.includes("ControlRight");
                const checkAlt = keys.includes("AltLeft") || keys.includes("AltRight");
                const checkMeta = keys.includes("MetaLeft") || keys.includes("MetaRight");
                if (!checkShift && e.shiftKey)
                    return false;
                if (!checkCtrl && e.ctrlKey)
                    return false;
                if (!checkAlt && e.altKey)
                    return false;
                if (!checkMeta && e.metaKey)
                    return false;
                if (checkShift)
                    keys = keys.filter((key) => key !== "ShiftLeft" && key !== "ShiftRight");
                if (checkCtrl)
                    keys = keys.filter((key) => key !== "ControlLeft" && key !== "ControlRight");
                if (checkAlt)
                    keys = keys.filter((key) => key !== "AltLeft" && key !== "AltRight");
                if (checkMeta)
                    keys = keys.filter((key) => key !== "MetaLeft" && key !== "MetaRight");
                return ((checkShift ? e.shiftKey : true) &&
                    (checkCtrl ? e.ctrlKey : true) &&
                    (checkAlt ? e.altKey : true) &&
                    (checkMeta ? e.metaKey : true) &&
                    keys.every((key) => this.#keymap.get(key)));
            }) ?? [];
            if (runs) {
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.killMenu();
                runs.forEach((run) => run.call(undefined, e));
                chord.split("+").forEach((key) => {
                    if (key.startsWith("Key"))
                        this.#keymap.delete(key);
                });
            }
        }
    };
    static #keyup = (e) => {
        this.#keymap.delete(e.code);
        if (!e.metaKey && (e.code === "MetaLeft" || e.code === "MetaRight") && _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            this.#keymap.clear();
    };
    static #blur = () => {
        this.#keymap.clear();
    };
    static listen() {
        document.addEventListener("keydown", this.#keydown);
        document.addEventListener("keyup", this.#keyup);
        document.addEventListener("blur", this.#blur);
        return this;
    }
    static deafen() {
        document.removeEventListener("keydown", this.#keydown);
        document.removeEventListener("keyup", this.#keyup);
        document.removeEventListener("blur", this.#blur);
        return this;
    }
    static onKeyChord(chord, run) {
        chord = chord.split("+").sort().join("+");
        if (!this.#keychords.find(([key]) => key === chord)?.[1].push(run))
            this.#keychords.push([chord, [run]]);
        return this;
    }
    static isKeyDownAndNoFocus(key) {
        return !!this.#keymap.get(key) && document.activeElement === document.body;
    }
    static isKeyDown(key) {
        return !!this.#keymap.get(key);
    }
    static reset() {
        this.#keymap.clear();
        this.#keychords = [];
        this.deafen();
        return this;
    }
    static expand(chord) {
        const [key, ...rest] = chord.split("+");
        if (key === "Shift" || key === "Control" || key === "Alt" || key === "Meta")
            return rest.length
                ? this.expand(rest.join("+")).flatMap((keys) => [
                    [`${key}Left`, keys].join("+"),
                    [`${key}Right`, keys].join("+"),
                ])
                : [`${key}Left`, `${key}Right`];
        if (key.length === 1 && key === key.toUpperCase())
            return rest.length
                ? this.expand(rest.join("+")).flatMap((keys) => [[`Key${key}`, keys].join("+")])
                : [`Key${key}`];
        return [chord];
    }
    static assign(chord, run) {
        return Object.fromEntries(this.expand(chord)
            .map((keys) => [keys, run])
            .concat([[chord, run]]));
    }
}


/***/ }),

/***/ "./src/managers/MenuManager.ts":
/*!*************************************!*\
  !*** ./src/managers/MenuManager.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MenuManager": () => (/* binding */ MenuManager)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");

class MenuManager {
    static #elements = new Map();
    static #opened;
    static use(element, actions) {
        const menu = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `<div class="contextmenu"></div>`;
        const clicks = new Map();
        const setup = (actions) => {
            clicks.clear();
            const keys = actions.flatMap((record) => Object.keys(record));
            if (keys.length !== new Set(keys).size)
                throw new Error("Duplicate keys in menu actions.");
            menu.innerHTML = actions
                .map((record) => Object.entries(record)
                .map(([name, { label, keybind }]) => keybind
                ? `<button class="${name}">${label}<p class="menu-keybind">${keybind
                    .split(" ")
                    .map((key) => `<span>${key}</span>`)
                    .join("")}</p></button>`
                : `<button class="${name}">${label}</button>`)
                .join(""))
                .join('<div class="br"></div>');
            actions.forEach((record) => {
                Object.keys(record).forEach((key) => {
                    const click = record[key].callback.bind(undefined);
                    const listener = (e) => {
                        click(this.#opened);
                        if (record[key].stopPropagation)
                            e.stopPropagation();
                    };
                    menu.querySelector("." + key).addEventListener("mousedown", listener);
                    clicks.set(key, listener);
                });
            });
        };
        let context;
        const getActions = () => {
            if (context) {
                const actions = context;
                context = undefined;
                return actions;
            }
            return actions;
        };
        setup(getActions());
        menu.style.left = "0px";
        menu.style.top = "0px";
        menu.style.display = "none";
        document.body.appendChild(menu);
        const mousedown = (e) => {
            setup(getActions());
            this.#opened = e;
            menu.style.left = "0px";
            menu.style.top = "0px";
            menu.style.display = "none";
        };
        const contextmenu = (e) => {
            e.preventDefault();
            setup(getActions());
            menu.style.display = "";
            menu.style.left = e.clientX + "px";
            menu.style.top = e.clientY + "px";
        };
        const click = (e) => {
            e.preventDefault();
            setup(getActions());
            menu.style.left = "0px";
            menu.style.top = "0px";
            menu.style.display = "none";
        };
        element.addEventListener("mousedown", mousedown);
        element.addEventListener("contextmenu", contextmenu);
        menu.addEventListener("click", click);
        menu.addEventListener("contextmenu", click);
        this.#elements.set(element, { menu, clicks, listeners: { mousedown, contextmenu, click } });
        return [
            (newContext) => {
                context = newContext.call(undefined, [...actions]);
            },
            () => {
                setup(getActions());
                menu.style.left = "0px";
                menu.style.top = "0px";
                menu.style.display = "none";
            },
        ];
    }
    static remove(element) {
        const { menu, clicks, listeners } = this.#elements.get(element) ?? {};
        if (!menu || !clicks || !listeners)
            throw new Error(`Elements are not being affected.`);
        element.removeEventListener("mousedown", listeners.mousedown);
        element.removeEventListener("contextmenu", listeners.contextmenu);
        menu.removeEventListener("click", listeners.click);
        menu.removeEventListener("contextmenu", listeners.click);
        Array.from(clicks).forEach(([key, listener]) => {
            menu.querySelector("." + key).removeEventListener("mousedown", listener);
        });
        menu.remove();
        return this;
    }
}


/***/ }),

/***/ "./src/managers/ModalManager.ts":
/*!**************************************!*\
  !*** ./src/managers/ModalManager.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ModalManager": () => (/* binding */ ModalManager)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");


class ModalManager {
    static #abort;
    static get container() {
        return document.querySelector(".modal-container");
    }
    static #onModalMount() {
        _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.killMenu();
        if (this.container.childElementCount <= 0) {
            this.container.classList.remove("modal-inactive");
            if (this.#abort)
                this.#abort.abort();
            requestAnimationFrame(() => {
                this.container.style.opacity = "1";
            });
        }
        else
            this.container.lastElementChild.classList.add("modal-inactive");
    }
    static #onModalUnmount() {
        if (this.container.childElementCount <= 0) {
            requestAnimationFrame(() => {
                this.container.style.opacity = "0";
                this.#abort = new AbortController();
                this.container.addEventListener("transitionend", () => {
                    this.container.classList.add("modal-inactive");
                }, { once: true, signal: this.#abort.signal });
            });
        }
        else {
            this.container.lastElementChild.classList.remove("modal-inactive");
            if (this.container.lastElementChild.classList.contains("modal-alert")) {
                this.container.lastElementChild.querySelector(".modal-ok").focus();
            }
        }
    }
    static async alert(content) {
        this.#onModalMount();
        const alert = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="modal modal-alert">
                <p class="modal-message"></p>
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                </div>
            </div>
        `;
        if (typeof content === "string") {
            alert.children[0].textContent = content;
        }
        else {
            alert.children[0].appendChild(content);
        }
        this.container.appendChild(alert);
        alert.querySelector(".modal-ok").focus();
        return new Promise((resolve) => {
            const finish = () => resolve(undefined);
            _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises.add(finish);
            const done = () => {
                alert.remove();
                this.#onModalUnmount();
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
                return finish();
            };
            const esc = (e) => {
                if (e.code === "Escape") {
                    e.preventDefault();
                    document.removeEventListener("keydown", esc);
                    done();
                }
            };
            document.addEventListener("keydown", esc);
            const clickout = (e) => {
                const target = e.target;
                if (target !== this.container || this.container.lastElementChild !== alert)
                    return;
                this.container.removeEventListener("mousedown", clickout);
                done();
            };
            this.container.addEventListener("mousedown", clickout);
            alert.querySelector(".modal-ok").addEventListener("click", done);
        });
    }
    static async confirm(content) {
        this.#onModalMount();
        const confirm = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="modal modal-confirm">
                <p class="modal-message"></p>
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                    <button class="modal-cancel">Cancel</button>
                </div>
            </div>
        `;
        if (typeof content === "string") {
            confirm.children[0].textContent = content;
        }
        else {
            confirm.children[0].appendChild(content);
        }
        this.container.appendChild(confirm);
        confirm.querySelector(".modal-ok").focus();
        return new Promise((resolve) => {
            const finish = () => resolve(false);
            _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises.add(finish);
            const handler = (value) => () => {
                confirm.remove();
                this.#onModalUnmount();
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
                return resolve(value);
            };
            const esc = (e) => {
                if (e.code === "Escape") {
                    e.preventDefault();
                    document.removeEventListener("keydown", esc);
                    confirm.remove();
                    this.#onModalUnmount();
                    _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
                    resolve(false);
                }
            };
            document.addEventListener("keydown", esc);
            const clickout = (e) => {
                const target = e.target;
                if (target !== this.container || this.container.lastElementChild !== confirm)
                    return;
                this.container.removeEventListener("mousedown", clickout);
                confirm.remove();
                this.#onModalUnmount();
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
                return resolve(false);
            };
            this.container.addEventListener("mousedown", clickout);
            confirm.querySelector(".modal-cancel").addEventListener("click", handler(false));
            confirm.querySelector(".modal-ok").addEventListener("click", handler(true));
        });
    }
    static async prompt(content) {
        this.#onModalMount();
        const prompt = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="modal modal-prompt">
                <p class="modal-message"></p>
                <input class="modal-input" type="text" />
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                    <button class="modal-cancel">Cancel</button>
                </div>
            </div>
        `;
        if (typeof content === "string") {
            prompt.children[0].textContent = content;
        }
        else {
            prompt.children[0].appendChild(content);
        }
        this.container.appendChild(prompt);
        prompt.querySelector(".modal-input").focus();
        return new Promise((resolve) => {
            const finish = () => resolve(undefined);
            _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises.add(finish);
            const done = () => {
                prompt.remove();
                this.#onModalUnmount();
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
            };
            const esc = (e) => {
                if (e.code === "Escape") {
                    e.preventDefault();
                    document.removeEventListener("keydown", esc);
                    done();
                    finish();
                }
            };
            document.addEventListener("keydown", esc);
            const clickout = (e) => {
                const target = e.target;
                if (target !== this.container || this.container.lastElementChild !== prompt)
                    return;
                this.container.removeEventListener("mousedown", clickout);
                done();
                resolve(undefined);
            };
            this.container.addEventListener("mousedown", clickout);
            prompt.querySelector(".modal-input").addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    done();
                    return resolve(prompt.querySelector(".modal-input").value);
                }
            });
            prompt.querySelector(".modal-cancel").addEventListener("click", () => {
                done();
                return finish();
            });
            prompt.querySelector(".modal-ok").addEventListener("click", () => {
                done();
                return resolve(prompt.querySelector(".modal-input").value);
            });
        });
    }
    static async popup(content, onMount, onUnmount) {
        this.#onModalMount();
        const popup = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="modal modal-alert modal-popup">
                <div class="modal-message"></div>
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                </div>
            </div>
        `;
        if (typeof content === "string") {
            popup.children[0].textContent = content;
        }
        else {
            popup.children[0].appendChild(content);
        }
        this.container.appendChild(popup);
        popup.querySelector(".modal-ok").focus();
        requestAnimationFrame(() => onMount?.call(undefined));
        let close;
        const out = [
            new Promise((resolve) => {
                const finish = () => resolve(undefined);
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises.add(finish);
                const done = () => {
                    popup.remove();
                    requestAnimationFrame(() => onUnmount?.call(undefined));
                    this.#onModalUnmount();
                    _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
                    return finish();
                };
                close = done;
                const esc = (e) => {
                    if (e.code === "Escape") {
                        e.preventDefault();
                        document.removeEventListener("keydown", esc);
                        done();
                    }
                };
                document.addEventListener("keydown", esc);
                const clickout = (e) => {
                    const target = e.target;
                    if (target !== this.container || this.container.lastElementChild !== popup)
                        return;
                    this.container.removeEventListener("mousedown", clickout);
                    done();
                };
                this.container.addEventListener("mousedown", clickout);
                popup.querySelector(".modal-ok").addEventListener("click", done);
            }),
        ];
        out.push(close);
        return out;
    }
}


/***/ }),

/***/ "./src/managers/MouseManager.ts":
/*!**************************************!*\
  !*** ./src/managers/MouseManager.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MouseManager": () => (/* binding */ MouseManager)
/* harmony export */ });
class MouseManager {
    static #mouse = { x: 0, y: 0 };
    static #mousedowns = new Set();
    static #mouseups = new Set();
    static #touchstarts = new Set();
    static #touchends = new Set();
    static #mousemove = (e) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
    };
    static #mousedown = (e) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
        this.#mousedowns.forEach((l) => l.call(undefined, e));
    };
    static #mouseup = (e) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
        this.#mouseups.forEach((l) => l.call(undefined, e));
    };
    static #touchmove = (e) => {
        this.#mouse.x = e.touches[0].clientX;
        this.#mouse.y = e.touches[0].clientY;
    };
    static #touchstart = (e) => {
        this.#mouse.x = e.touches[0].clientX;
        this.#mouse.y = e.touches[0].clientY;
        this.#touchstarts.forEach((l) => l.call(undefined, e));
    };
    static #touchend = (e) => {
        this.#mouse.x = e.changedTouches[0].clientX;
        this.#mouse.y = e.changedTouches[0].clientY;
        this.#touchends.forEach((l) => l.call(undefined, e));
    };
    static start() {
        document.addEventListener("mousemove", this.#mousemove);
        document.addEventListener("mousedown", this.#mousedown);
        document.addEventListener("mouseup", this.#mouseup);
        document.addEventListener("touchmove", this.#touchmove);
        document.addEventListener("touchstart", this.#touchstart);
        document.addEventListener("touchend", this.#touchend);
        return this;
    }
    static stop() {
        document.removeEventListener("mousemove", this.#mousemove);
        document.removeEventListener("mousedown", this.#mousedown);
        document.removeEventListener("mouseup", this.#mouseup);
        document.removeEventListener("touchmove", this.#touchmove);
        document.removeEventListener("touchstart", this.#touchstart);
        document.removeEventListener("touchend", this.#touchend);
        this.#mouse = { x: 0, y: 0 };
        return this;
    }
    static reset() {
        this.stop();
        this.#mousedowns.clear();
        this.#mouseups.clear();
        return this;
    }
    static onMouseDown(handler) {
        this.#mousedowns.add(handler);
        return this;
    }
    static onMouseUp(handler) {
        this.#mouseups.add(handler);
        return this;
    }
    static offMouseDown(handler) {
        this.#mousedowns.delete(handler);
        return this;
    }
    static offMouseUp(handler) {
        this.#mouseups.delete(handler);
        return this;
    }
    static onTouchStart(handler) {
        this.#touchstarts.add(handler);
        return this;
    }
    static onTouchEnd(handler) {
        this.#touchends.add(handler);
        return this;
    }
    static offTouchStart(handler) {
        this.#touchstarts.delete(handler);
        return this;
    }
    static offTouchEnd(handler) {
        this.#touchends.delete(handler);
        return this;
    }
    static get mouse() {
        return { ...this.#mouse };
    }
}


/***/ }),

/***/ "./src/managers/QuickPickManager.ts":
/*!******************************************!*\
  !*** ./src/managers/QuickPickManager.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QuickPickManager": () => (/* binding */ QuickPickManager)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _CanvasManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CanvasManager */ "./src/managers/CanvasManager.ts");



class QuickPickManager {
    static #line;
    static async activate(event, actions) {
        const quickpick = _reified_Reified__WEBPACK_IMPORTED_MODULE_1__.html `<div class="quickpick"></div>`;
        const keys = actions.map(({ label }) => label);
        if (keys.length !== new Set(keys).size)
            throw new Error("Duplicate labels in quickpick actions.");
        quickpick.innerHTML = actions
            .map(({ label }, i) => `<div class="quickpick-item index-${i}">${label}</div>`)
            .join("");
        requestAnimationFrame(() => {
            const circle = _reified_Reified__WEBPACK_IMPORTED_MODULE_1__.html `
                <svg
                    class="quickpick-circle"
                    width="${_constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE * 2}"
                    height="${_constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE * 2}"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="${_constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE}"
                        cy="${_constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE}"
                        r="${_constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE / 2 - 1 - 1}"
                        stroke="${(0,_constants__WEBPACK_IMPORTED_MODULE_0__.GET_GRAY_COLOR)()}"
                        stroke-width="2px"
                        fill="none"
                    />
                    ${actions.map((_, i) => {
                const angle = ((2 * Math.PI) / actions.length) * i - Math.PI / 2 - Math.PI / actions.length;
                const linePath = `M${Math.cos(angle) * (_constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE - 1 - 1) + _constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE},${Math.sin(angle) * (_constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE - 1 - 1) + _constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE} L${Math.cos(angle) * (_constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE / 2 - 1 - 1) + _constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE},${Math.sin(angle) * (_constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE / 2 - 1 - 1) + _constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE}`;
                return `<path d="${linePath}" style="stroke: ${(0,_constants__WEBPACK_IMPORTED_MODULE_0__.GET_GRAY_COLOR)()}; stroke-width: 2px; fill: none;" />`;
            })}
                </svg>
            `;
            quickpick.appendChild(circle);
            requestAnimationFrame(() => {
                const { width, height } = circle.getBoundingClientRect();
                circle.style.left = event.clientX - width / 2 + "px";
                circle.style.top = event.clientY - height / 2 + "px";
            });
            actions.forEach((_, i) => {
                const angle = ((2 * Math.PI) / actions.length) * i - Math.PI / 2;
                const x = Math.cos(angle) * _constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE;
                const y = Math.sin(angle) * _constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE;
                const item = quickpick.querySelector(".index-" + i);
                const { width, height } = item.getBoundingClientRect();
                item.style.transitionDelay = i * (200 / actions.length) + "ms";
                item.style.animationDelay = i * (200 / actions.length) + "ms";
                item.style.left = event.clientX + (2 * x) / 3 - width / 2 + "px";
                item.style.top = event.clientY + (2 * y) / 3 - height / 2 + "px";
                requestAnimationFrame(() => {
                    item.style.left = event.clientX + x - width / 2 + "px";
                    item.style.top = event.clientY + y - height / 2 + "px";
                });
            });
        });
        document.body.appendChild(quickpick);
        this.#line = [event, event];
        const mousemove = (e) => (this.#line = [event, e]);
        document.body.addEventListener("mousemove", mousemove);
        document.body.addEventListener("mouseup", (e) => {
            const distance = Math.hypot(e.clientX - event.clientX, e.clientY - event.clientY);
            if (distance >= _constants__WEBPACK_IMPORTED_MODULE_0__.QUICKPICK_SIZE / 2) {
                const angle = Math.atan2(e.clientY - event.clientY, e.clientX - event.clientX) + Math.PI / 2;
                const closest = (Math.round(angle / ((2 * Math.PI) / actions.length)) + actions.length) % actions.length;
                actions[closest].callback.call(undefined, event);
            }
            quickpick.remove();
            document.body.removeEventListener("mousemove", mousemove);
            this.#line = undefined;
        }, { once: true });
        document.body.addEventListener("mouseleave", () => {
            quickpick.remove();
            document.body.removeEventListener("mousemove", mousemove);
            this.#line = undefined;
        }, { once: true });
    }
    static render({ fg }) {
        if (this.#line) {
            const [from, to] = this.#line;
            fg.fillStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_0__.GET_GRAY_COLOR)();
            fg.strokeStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_0__.GET_GRAY_COLOR)();
            fg.lineWidth = 1;
            fg.beginPath();
            fg.arc(from.clientX, from.clientY, 2, 0, Math.PI * 2);
            fg.closePath();
            fg.fill();
            fg.beginPath();
            fg.moveTo(from.clientX, from.clientY);
            fg.lineTo(to.clientX, to.clientY);
            fg.closePath();
            fg.stroke();
            fg.beginPath();
            fg.arc(to.clientX, to.clientY, 2, 0, Math.PI * 2);
            fg.closePath();
            fg.fill();
        }
    }
    static init() {
        _CanvasManager__WEBPACK_IMPORTED_MODULE_2__.CanvasManager.addJob(this.render.bind(this));
    }
}


/***/ }),

/***/ "./src/managers/SandboxManager.ts":
/*!****************************************!*\
  !*** ./src/managers/SandboxManager.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SandboxManager": () => (/* binding */ SandboxManager)
/* harmony export */ });
/* harmony import */ var _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../augments/WatchedSet */ "./src/augments/WatchedSet.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../files */ "./src/files.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Display__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/Display */ "./src/reified/Display.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reified/SevenSegmentDisplay */ "./src/reified/SevenSegmentDisplay.ts");
/* harmony import */ var _CanvasManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./CanvasManager */ "./src/managers/CanvasManager.ts");
/* harmony import */ var _DarkmodeManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MenuManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MenuManager */ "./src/managers/MenuManager.ts");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _QuickPickManager__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./QuickPickManager */ "./src/managers/QuickPickManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _SettingsManager__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./SettingsManager */ "./src/managers/SettingsManager.ts");
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _ToolsManager__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./ToolsManager */ "./src/managers/ToolsManager.ts");
/* harmony import */ var _UndoRedoManager__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./UndoRedoManager */ "./src/managers/UndoRedoManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");
























const calculateReifiedTotals = (set) => [...set].reduce((map, item) => {
    if (item instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_5__.Input) {
        map.inputsTotal++;
    }
    else if (item instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output) {
        map.outputsTotal++;
    }
    else if (item instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component) {
        map.chipsTotal++;
        map.chips.set(item.chip.name, (map.chips.get(item.chip.name) ?? 0) + 1);
    }
    else if (item instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_4__.Display || item instanceof _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_8__.SevenSegmentDisplay) {
    }
    else {
        throw new Error("Unknown component type.");
    }
    return map;
}, {
    inputsTotal: 0,
    outputsTotal: 0,
    chipsTotal: 0,
    chips: new Map(),
});
class SandboxManager {
    static queueNewContext;
    static killMenu;
    static watchedUnresolvedPromises = new Set();
    static #interval = -1;
    static #observer;
    static #history = new Array();
    static #redos = new Array();
    static #config;
    static setup(config) {
        if (this.#observer)
            this.#observer.disconnect();
        clearInterval(this.#interval);
        this.#config = config;
        document.body.innerHTML = "";
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<div class="modal-container modal-inactive"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<div class="reified-root"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<canvas class="background-canvas"></canvas>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<canvas class="foreground-canvas"></canvas>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<div class="toasts-container"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="tools"></button>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="settings"></button>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="darkmode"></button>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="undo"></button>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="redo"></button>`);
        _MouseManager__WEBPACK_IMPORTED_MODULE_15__.MouseManager.start();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_12__.KeybindsManager.listen();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_17__.SelectionManager.listen();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_11__.DraggingManager.listen();
        _WiringManager__WEBPACK_IMPORTED_MODULE_23__.WiringManager.init();
        _QuickPickManager__WEBPACK_IMPORTED_MODULE_16__.QuickPickManager.init();
        _CanvasManager__WEBPACK_IMPORTED_MODULE_9__.CanvasManager.start();
        _ToolsManager__WEBPACK_IMPORTED_MODULE_21__.ToolsManager.listen();
        _SettingsManager__WEBPACK_IMPORTED_MODULE_18__.SettingsManager.listen();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_10__.DarkmodeManager.listen().onChange(() => _DraggingManager__WEBPACK_IMPORTED_MODULE_11__.DraggingManager.snapToGridBasedUpdate({ onlyUpdateColor: true }));
        _UndoRedoManager__WEBPACK_IMPORTED_MODULE_22__.UndoRedoManager.listen();
        const createReifiedActive = (components) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((item, set) => {
            const totals = calculateReifiedTotals(set.clone().add(item));
            if (totals.chipsTotal + totals.inputsTotal + totals.outputsTotal >
                (this.#config.limits?.componentsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                    message: "Exceeded total components limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.inputsTotal > (this.#config.limits?.inputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                    message: "Exceeded total inputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.outputsTotal > (this.#config.limits?.outputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                    message: "Exceeded total outputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.chipsTotal > (this.#config.limits?.chipsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                    message: "Exceeded total chips limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (item instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component &&
                totals.chips.has(item.chip.name) &&
                totals.chips.get(item.chip.name) > (this.#config.limits?.chips?.[item.chip.name] ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                    message: `Exceeded total '${item.chip.name}' limit.`,
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            return true;
        })
            .onAdd(() => {
            _DraggingManager__WEBPACK_IMPORTED_MODULE_11__.DraggingManager.snapToGridBasedUpdate();
            return true;
        })
            .addAll(components);
        const createWiringsSet = (wirings) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((_, set) => {
            if (set.size + 1 > (this.#config.limits?.wirings ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                    message: "Exceeded total wirings limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            return true;
        })
            .addAll(wirings);
        if (typeof this.#config.menu !== "undefined")
            [this.queueNewContext, this.killMenu] = _MenuManager__WEBPACK_IMPORTED_MODULE_13__.MenuManager.use(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root, this.#config.menu);
        if (typeof this.#config.keybinds !== "undefined")
            Object.entries(this.#config.keybinds).forEach(([chord, run]) => _KeybindsManager__WEBPACK_IMPORTED_MODULE_12__.KeybindsManager.onKeyChord(chord, run));
        if (typeof this.#config.initial !== "undefined") {
            this.clear();
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active = createReifiedActive(this.#config.initial[0]);
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => component.attach());
            _WiringManager__WEBPACK_IMPORTED_MODULE_23__.WiringManager.wires = createWiringsSet(this.#config.initial[1]);
        }
        if (typeof this.#config.save !== "undefined") {
            const file = _StorageManager__WEBPACK_IMPORTED_MODULE_19__.StorageManager.get("saves:" + this.#config.save);
            if (file) {
                const { error, result: [settings, components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_2__.fromFile)(file);
                if (error) {
                    _StorageManager__WEBPACK_IMPORTED_MODULE_19__.StorageManager["delete"]("saves:" + this.#config.save);
                    if (_constants__WEBPACK_IMPORTED_MODULE_1__.IN_DEBUG_MODE)
                        console.error("Failed to read from saves:", error);
                    _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                        message: "Unable to read from saves.",
                        color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                        duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                    });
                }
                else {
                    if (!this.#config.overrideSaveIfExists) {
                        this.clear();
                        this.applyRawSettings(settings);
                        _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active = createReifiedActive(components);
                        _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => component.attach());
                        _WiringManager__WEBPACK_IMPORTED_MODULE_23__.WiringManager.wires = createWiringsSet(wires);
                    }
                    _StorageManager__WEBPACK_IMPORTED_MODULE_19__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_23__.WiringManager.wires]));
                }
            }
        }
        this.#observer = new MutationObserver(() => {
            if (typeof this.#config.save !== "undefined")
                _StorageManager__WEBPACK_IMPORTED_MODULE_19__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_23__.WiringManager.wires]));
        });
        this.#observer.observe(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        });
        this.#interval = setInterval(() => {
            const check = this.#config.checkState?.(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.clone(), _WiringManager__WEBPACK_IMPORTED_MODULE_23__.WiringManager.wires.clone()) ?? false;
            if (check)
                this.#config.ifStateChecked?.();
        }, this.#config.checkInterval ?? 50);
        if (!_StorageManager__WEBPACK_IMPORTED_MODULE_19__.StorageManager.get("usedhelp"))
            _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                message: "Press '?' for help.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.LIGHT_GRAY_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
        requestAnimationFrame(() => _DraggingManager__WEBPACK_IMPORTED_MODULE_11__.DraggingManager.snapToGridBasedUpdate());
        return this;
    }
    static forceSave() {
        if (typeof this.#config.save !== "undefined")
            _StorageManager__WEBPACK_IMPORTED_MODULE_19__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_23__.WiringManager.wires]));
        return this;
    }
    static reset() {
        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = undefined;
        }
        clearInterval(this.#interval);
        this.#interval = -1;
        _MouseManager__WEBPACK_IMPORTED_MODULE_15__.MouseManager.reset();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_12__.KeybindsManager.reset();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_17__.SelectionManager.reset();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_11__.DraggingManager.reset();
        _CanvasManager__WEBPACK_IMPORTED_MODULE_9__.CanvasManager.stop();
        _ToolsManager__WEBPACK_IMPORTED_MODULE_21__.ToolsManager.stop();
        _SettingsManager__WEBPACK_IMPORTED_MODULE_18__.SettingsManager.stop();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_10__.DarkmodeManager.stop();
        _UndoRedoManager__WEBPACK_IMPORTED_MODULE_22__.UndoRedoManager.stop();
        _MenuManager__WEBPACK_IMPORTED_MODULE_13__.MenuManager.remove(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root);
        this.clear();
        this.watchedUnresolvedPromises.forEach((finish) => finish.call(undefined));
        this.watchedUnresolvedPromises.clear();
        document.body.innerHTML = "";
        this.#config = {};
        this.#history = [];
        this.#redos = [];
        return this;
    }
    static clear() {
        _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => component.detach());
        _WiringManager__WEBPACK_IMPORTED_MODULE_23__.WiringManager.wires.forEach((wire) => wire.destroy());
        _SelectionManager__WEBPACK_IMPORTED_MODULE_17__.SelectionManager.selected.clear();
        return this;
    }
    static pushHistory(command, undo) {
        this.#redos.length = 0;
        command.call(undefined);
        this.#history.push([command, undo]);
        return this;
    }
    static popHistory() {
        if (!this.#history.length) {
            _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                message: "Nothing to undo.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
            return this;
        }
        const [redo, undo] = this.#history.pop();
        this.#redos.push([redo, undo]);
        undo.call(undefined);
        return this;
    }
    static redoHistory() {
        if (!this.#redos.length) {
            _ToastManager__WEBPACK_IMPORTED_MODULE_20__.ToastManager.toast({
                message: "Nothing to redo.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
            return this;
        }
        const [command, undo] = this.#redos.pop();
        this.#history.push([command, undo]);
        command.call(undefined);
        return this;
    }
    static applySettings(settings) {
        _DraggingManager__WEBPACK_IMPORTED_MODULE_11__.DraggingManager.snapToGrid = settings.snapToGrid ?? false;
        return this;
    }
    static applyRawSettings(settings) {
        _DraggingManager__WEBPACK_IMPORTED_MODULE_11__.DraggingManager.snapToGrid = settings["DraggingManager.snapToGrid"];
        return this;
    }
    static get savedName() {
        return this.#config.save;
    }
    static async saveTo(save) {
        this.#config.save = save;
        if (_StorageManager__WEBPACK_IMPORTED_MODULE_19__.StorageManager.has("saves:" + this.#config.save) &&
            !(await _ModalManager__WEBPACK_IMPORTED_MODULE_14__.ModalManager.confirm("There is already a save with this name. Are you sure you want to replace it?")))
            return;
        _StorageManager__WEBPACK_IMPORTED_MODULE_19__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_23__.WiringManager.wires]));
        return this;
    }
}


/***/ }),

/***/ "./src/managers/SelectionManager.ts":
/*!******************************************!*\
  !*** ./src/managers/SelectionManager.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectionManager": () => (/* binding */ SelectionManager)
/* harmony export */ });
/* harmony import */ var _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../augments/WatchedSet */ "./src/augments/WatchedSet.ts");
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../circular */ "./src/circular.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../files */ "./src/files.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Display__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Display */ "./src/reified/Display.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../reified/SevenSegmentDisplay */ "./src/reified/SevenSegmentDisplay.ts");
/* harmony import */ var _CanvasManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./CanvasManager */ "./src/managers/CanvasManager.ts");
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");

















class SelectionManager {
    static selected = new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet();
    static #mousedown = (e) => {
        const target = e.target;
        const element = [
            target.closest("button.board-input"),
            target.closest("button.board-output"),
            target.closest("div.component"),
            target.closest("div.display"),
        ].find((element) => element !== null);
        const reified = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active].find((component) => component.element === element);
        if (reified) {
            if ((_circular__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_12__.KeybindsManager.isKeyDown("MetaLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_12__.KeybindsManager.isKeyDown("MetaRight"))) ||
                (!_circular__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_12__.KeybindsManager.isKeyDown("ControlLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_12__.KeybindsManager.isKeyDown("ControlRight"))))
                this.addSelection(reified);
            else if (!this.selected.has(reified))
                this.select(reified);
        }
        else {
            this.selected.clear();
        }
    };
    static #copy = async (e) => {
        if (this.selected.size) {
            e.preventDefault();
            const array = [...this.selected];
            const data = (0,_files__WEBPACK_IMPORTED_MODULE_3__.saveDiagram)(array, [..._WiringManager__WEBPACK_IMPORTED_MODULE_16__.WiringManager.wires].filter((wiring) => array.some((component) => {
                if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input)
                    return wiring.from === component.element;
                if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output)
                    return false;
                if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component ||
                    component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display ||
                    component instanceof _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_9__.SevenSegmentDisplay)
                    return component.outputs.some((output) => wiring.from === output);
                throw new Error("Unknown component type.");
            }) &&
                array.some((component) => {
                    if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input)
                        return false;
                    if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output)
                        return wiring.to === component.element;
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component ||
                        component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display ||
                        component instanceof _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_9__.SevenSegmentDisplay)
                        return component.inputs.some((input) => wiring.to === input);
                    throw new Error("Unknown component type.");
                })));
            await navigator.clipboard.writeText(data);
        }
    };
    static #paste = async () => {
        const { error, result: [, components, wirings], } = (0,_files__WEBPACK_IMPORTED_MODULE_3__.fromFile)(await navigator.clipboard.readText());
        if (error)
            return _ToastManager__WEBPACK_IMPORTED_MODULE_15__.ToastManager.toast({
                message: "Unable to paste diagram data.",
                color: _constants__WEBPACK_IMPORTED_MODULE_2__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_2__.TOAST_DURATION,
            });
        const mouse = { ..._MouseManager__WEBPACK_IMPORTED_MODULE_13__.MouseManager.mouse };
        const selection = this.selected.clone(true);
        _SandboxManager__WEBPACK_IMPORTED_MODULE_14__.SandboxManager.pushHistory(() => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.addAll(components);
            if (components.every((component) => _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.has(component))) {
                components.forEach((component) => {
                    component.attach();
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component ||
                        component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display ||
                        component instanceof _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_9__.SevenSegmentDisplay) {
                        component.inputs.forEach((input) => input.classList.remove("activated"));
                        requestAnimationFrame(() => component.update());
                    }
                    if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output) {
                        component.element.classList.remove("activated");
                    }
                });
                if (_MouseManager__WEBPACK_IMPORTED_MODULE_13__.MouseManager.mouse.x !== -1 && _MouseManager__WEBPACK_IMPORTED_MODULE_13__.MouseManager.mouse.y !== -1) {
                    const topleft = components
                        .sort((a, b) => {
                        const ax = parseFloat(a.element.style.left);
                        const ay = parseFloat(a.element.style.top);
                        const bx = parseFloat(b.element.style.left);
                        const by = parseFloat(b.element.style.top);
                        const ad = Math.sqrt(ax * ax + ay * ay);
                        const bd = Math.sqrt(bx * bx + by * by);
                        return ad - bd;
                    })[0]
                        .element.getBoundingClientRect();
                    components.forEach((component) => {
                        const offset = component.element.getBoundingClientRect();
                        component.move({
                            x: mouse.x + offset.left - topleft.left,
                            y: mouse.y + offset.top - topleft.top,
                        });
                    });
                }
                _WiringManager__WEBPACK_IMPORTED_MODULE_16__.WiringManager.wires.addAll(wirings);
                this.selected.clear();
                components.forEach((component) => this.addSelection(component));
                _DraggingManager__WEBPACK_IMPORTED_MODULE_11__.DraggingManager.snapToGridBasedUpdate();
            }
        }, () => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.deleteAll(components);
            components.forEach((component) => {
                component.detach();
            });
            _WiringManager__WEBPACK_IMPORTED_MODULE_16__.WiringManager.wires.deleteAll(wirings);
            this.selected.clear();
            selection.forEach((component) => this.addSelection(component));
        });
    };
    static select(reified) {
        this.selected.clear();
        this.selected.add(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.element.style.zIndex = "1000";
        return this;
    }
    static selectAllIn(from, to) {
        this.selected.clear();
        const reified = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active].filter((component) => (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_8__.overlappedBounds)(component.element.getBoundingClientRect(), from, to));
        this.selected.addAll(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.forEach((component) => (component.element.style.zIndex = "1000"));
        return this;
    }
    static addSelection(reified) {
        this.selected.add(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.element.style.zIndex = "1000";
        return this;
    }
    static isSelected(element) {
        return [...this.selected].some((component) => {
            if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input)
                return element === component.element;
            if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output)
                return element === component.element;
            if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component ||
                component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display ||
                component instanceof _reified_SevenSegmentDisplay__WEBPACK_IMPORTED_MODULE_9__.SevenSegmentDisplay)
                return (component.inputs.some((input) => element === input) ||
                    component.outputs.some((output) => element === output) ||
                    element === component.element);
            throw new Error("Unknown component type.");
        });
    }
    static render({ fg }) {
        SelectionManager.selected.forEach((component) => {
            const rect = component.element.getBoundingClientRect();
            fg.strokeStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_2__.GET_ACTIVATED_COLOR)();
            fg.lineWidth = 1;
            fg.lineJoin = "miter";
            fg.strokeRect(rect.left - 15, rect.top - 15, rect.width + 15 + 15, rect.height + 15 + 15);
        });
    }
    static listen() {
        _CanvasManager__WEBPACK_IMPORTED_MODULE_10__.CanvasManager.addJob(this.render.bind(this));
        document.body.addEventListener("mousedown", this.#mousedown);
        document.addEventListener("copy", this.#copy);
        document.addEventListener("paste", this.#paste);
        return this;
    }
    static deafen() {
        document.body.removeEventListener("mousedown", this.#mousedown);
        document.removeEventListener("copy", this.#copy);
        document.removeEventListener("paste", this.#paste);
        return this;
    }
    static reset() {
        this.selected.clear();
        this.deafen();
        return this;
    }
}


/***/ }),

/***/ "./src/managers/SettingsManager.ts":
/*!*****************************************!*\
  !*** ./src/managers/SettingsManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SettingsManager": () => (/* binding */ SettingsManager)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _DarkmodeManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");





class SettingsManager {
    static #changes = new Set();
    static get #element() {
        return document.querySelector("button.settings");
    }
    static onChange(run) {
        this.#changes.add(run);
        return this;
    }
    static offChange(run) {
        this.#changes.delete(run);
        return this;
    }
    static #listener = async () => {
        const form = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="settings-form">
                <h1>settings</h1>

                <p>Settings are saved automatically.</p>

                <div>
                    <label class="settings-control" for="darkmode">
                        <input name="darkmode" type="checkbox" ${_DarkmodeManager__WEBPACK_IMPORTED_MODULE_1__.DarkmodeManager.darkmodeEnabled ? "checked" : ""} />
                        dark mode
                    </label>

                    <label class="settings-control" for="darkmodeModals">
                        <input
                            name="darkmodeModals"
                            type="checkbox"
                            ${_DarkmodeManager__WEBPACK_IMPORTED_MODULE_1__.DarkmodeManager.darkmodeModalsEnabled ? "checked" : ""}
                        />
                        dark mode modals
                    </label>
                </div>

                <label class="settings-control" for="snapToGrid">
                    <input name="snapToGrid" type="checkbox" ${_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGrid ? "checked" : ""} />
                    snap to grid
                </label>

                <div>
                    <label class="settings-control" for="fancyWires">
                        <input name="fancyWires" type="checkbox" ${_WiringManager__WEBPACK_IMPORTED_MODULE_4__.WiringManager.FANCY_WIRES ? "checked" : ""} />
                        fancy wires
                    </label>

                    <label class="settings-control" for="fancierWires">
                        <input name="fancierWires" type="checkbox" ${_WiringManager__WEBPACK_IMPORTED_MODULE_4__.WiringManager.FANCIER_WIRES ? "checked" : ""} />
                        fancier wires
                    </label>
                </div>

                <div>
                    <label class="settings-control" for="gateDelay">
                        <input
                            name="gateDelay"
                            type="range"
                            min="0"
                            max="250"
                            step="25"
                            value="${_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.Reified.GATE_DELAY}"
                        />
                        gate delay (0-250/25)
                    </label>

                    <label class="settings-control" for="gateDelayVariation">
                        <input
                            name="gateDelayVariation"
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value="${_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.Reified.GATE_DELAY_VARIATION}"
                        />
                        gate delay variation (0-100/5)
                    </label>
                </div>

                <button style="width: 60px;">reset</button>
            </div>
        `;
        let reset = false;
        form.querySelector("button").addEventListener("click", () => {
            _DarkmodeManager__WEBPACK_IMPORTED_MODULE_1__.DarkmodeManager.darkmodeEnabled = false;
            _DarkmodeManager__WEBPACK_IMPORTED_MODULE_1__.DarkmodeManager.darkmodeModalsEnabled = false;
            _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGrid = false;
            _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.Reified.GATE_DELAY = 100;
            _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.Reified.GATE_DELAY_VARIATION = 25;
            reset = true;
            close();
        });
        const [closed, close] = await _ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.popup(form);
        await closed;
        if (!reset) {
            _DarkmodeManager__WEBPACK_IMPORTED_MODULE_1__.DarkmodeManager.darkmodeEnabled = form.querySelector("input[name=darkmode]").checked;
            _DarkmodeManager__WEBPACK_IMPORTED_MODULE_1__.DarkmodeManager.darkmodeModalsEnabled =
                form.querySelector("input[name=darkmodeModals]").checked;
            _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGrid = form.querySelector("input[name=snapToGrid]").checked;
            _WiringManager__WEBPACK_IMPORTED_MODULE_4__.WiringManager.FANCY_WIRES = form.querySelector("input[name=fancyWires]").checked;
            _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.Reified.GATE_DELAY = form.querySelector("input[name=gateDelay]").valueAsNumber;
            _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.Reified.GATE_DELAY_VARIATION = form.querySelector("input[name=gateDelayVariation]").valueAsNumber;
        }
        form.remove();
    };
    static listen() {
        this.#element.innerText = "⚙️";
        this.#element.addEventListener("click", this.#listener);
        return this;
    }
    static stop() {
        this.#element.removeEventListener("click", this.#listener);
        return this;
    }
    static bringUpForm() {
        return this.#listener();
    }
}


/***/ }),

/***/ "./src/managers/StorageManager.ts":
/*!****************************************!*\
  !*** ./src/managers/StorageManager.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StorageManager": () => (/* binding */ StorageManager)
/* harmony export */ });
class StorageManager {
    static prefix = "kelsny.gatesim:";
    static storage = typeof window !== "undefined"
        ? window.localStorage
        : ({
            clear() { },
            getItem: () => null,
            key: () => null,
            length: 0,
            removeItem() { },
            setItem() { },
        });
    static set(key, value) {
        this.storage.setItem(this.prefix + key, JSON.stringify(value));
        return value;
    }
    static get(key) {
        return JSON.parse(this.storage.getItem(this.prefix + key)) ?? undefined;
    }
    static has(key) {
        return this.storage.getItem(this.prefix + key) !== null;
    }
    static delete(key) {
        if (this.storage.getItem(this.prefix + key) === null)
            return false;
        this.storage.removeItem(this.prefix + key);
        return true;
    }
}


/***/ }),

/***/ "./src/managers/TestingManager.ts":
/*!****************************************!*\
  !*** ./src/managers/TestingManager.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TestingManager": () => (/* binding */ TestingManager)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");







class TestingManager {
    static #testing = false;
    static async test(cases) {
        if (this.#testing)
            return _ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.alert("Diagram is already under testing.");
        const inputs = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active]
            .filter((component) => component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_1__.Input)
            .sort((a, b) => parseFloat(a.element.style.top) - parseFloat(b.element.style.top));
        const outputs = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active]
            .filter((component) => component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_2__.Output)
            .sort((a, b) => parseFloat(a.element.style.top) - parseFloat(b.element.style.top));
        const components = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active].filter((component) => !(component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_1__.Input) && !(component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_2__.Output));
        this.#testing = true;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.lock();
        _WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.lock();
        const originalActivations = inputs.map((input) => input.element.classList.contains("activated"));
        const originalDelay = _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY;
        const originalVariation = _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY_VARIATION;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY = 25;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY_VARIATION = 5;
        for (const [givenInputs, expectedOutputs] of cases) {
            if (inputs.length !== givenInputs.length)
                throw new Error("Mismatched input lengths.");
            if (outputs.length !== expectedOutputs.length)
                throw new Error("Mismatched output lengths.");
            for (const [index, input] of inputs.entries()) {
                input.element.classList.toggle("activated", givenInputs[index]);
            }
            await (0,_constants__WEBPACK_IMPORTED_MODULE_0__.DELAY)(components.length * (25 + 5));
            const realOutputs = outputs.map((output) => output.element.classList.contains("activated"));
            if (!realOutputs.every((out, i) => out === expectedOutputs[i])) {
                await _ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.alert(`Diagram failed to pass the test with inputs "${givenInputs
                    .map((boolean) => +boolean)
                    .join(" ")}".`);
                originalActivations.forEach((value, i) => inputs[i].element.classList.toggle("activated", value));
                _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.unlock();
                _WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.unlock();
                this.#testing = false;
                return false;
            }
            await (0,_constants__WEBPACK_IMPORTED_MODULE_0__.DELAY)();
        }
        await _ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.alert("Diagram passed all the tests.");
        originalActivations.forEach((value, i) => inputs[i].element.classList.toggle("activated", value));
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY = originalDelay;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY_VARIATION = originalVariation;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.unlock();
        _WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.unlock();
        this.#testing = false;
        return true;
    }
    static get testing() {
        return this.#testing;
    }
    static async getTruthTable() {
        if (this.#testing)
            return _ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.alert("Diagram is already under testing.");
        const inputs = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active]
            .filter((component) => component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_1__.Input)
            .sort((a, b) => parseFloat(a.element.style.top) - parseFloat(b.element.style.top));
        const outputs = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active]
            .filter((component) => component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_2__.Output)
            .sort((a, b) => parseFloat(a.element.style.top) - parseFloat(b.element.style.top));
        const components = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active].filter((component) => !(component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_1__.Input) && !(component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_2__.Output));
        if (!inputs.length)
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
                message: "Can't create table without inputs.",
                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
            });
        if (!outputs.length)
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
                message: "Can't create table without outputs.",
                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
            });
        this.#testing = true;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.lock();
        _WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.lock();
        const originalActivations = inputs.map((input) => input.element.classList.contains("activated"));
        const originalDelay = _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY;
        const originalVariation = _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY_VARIATION;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY = 25;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY_VARIATION = 5;
        const table = [];
        for (const perm of (0,_constants__WEBPACK_IMPORTED_MODULE_0__.GET_BIN_PERMS)(inputs.length)) {
            for (const [index, input] of inputs.entries()) {
                input.element.classList.toggle("activated", perm[index]);
            }
            await (0,_constants__WEBPACK_IMPORTED_MODULE_0__.DELAY)(components.length * (25 + 5));
            const realOutputs = outputs.map((output) => output.element.classList.contains("activated"));
            table.push([perm, realOutputs]);
        }
        originalActivations.forEach((value, i) => inputs[i].element.classList.toggle("activated", value));
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY = originalDelay;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.GATE_DELAY_VARIATION = originalVariation;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.unlock();
        _WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.unlock();
        this.#testing = false;
        return table;
    }
}


/***/ }),

/***/ "./src/managers/ToastManager.ts":
/*!**************************************!*\
  !*** ./src/managers/ToastManager.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ToastManager": () => (/* binding */ ToastManager)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");


class ToastManager {
    static get container() {
        return document.querySelector(".toasts-container");
    }
    static async toast({ message, color, duration }) {
        const toast = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="toast">
                <div class="toast-color"></div>
                <p class="toast-message">${message}</p>
                <button class="close-toast">╳</button>
            </div>
        `;
        toast.querySelector(".toast-color").style.backgroundColor = color;
        toast.style.animationDelay = duration + "ms";
        this.container.appendChild(toast);
        return new Promise((resolve) => {
            const finish = () => resolve(undefined);
            _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises.add(finish);
            const handler = () => {
                toast.remove();
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
                return finish();
            };
            toast.querySelector(".close-toast").addEventListener("click", handler);
            toast.addEventListener("animationend", handler);
        });
    }
}


/***/ }),

/***/ "./src/managers/ToolsManager.ts":
/*!**************************************!*\
  !*** ./src/managers/ToolsManager.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ToolsManager": () => (/* binding */ ToolsManager)
/* harmony export */ });
/* harmony import */ var _cad_files__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cad/files */ "./src/cad/files.ts");
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../circular */ "./src/circular.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../files */ "./src/files.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _TestingManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");









class ToolsManager {
    static #changes = new Set();
    static #listeners = new Map();
    static actions = [
        {
            "copy-url": {
                label: "Copy link",
                keybind: _circular__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS ? "⌘ K" : "Ctrl K",
                callback: async () => {
                    const hrefAsUrl = new URL(location.href);
                    hrefAsUrl.searchParams.set("inline", btoa((0,_files__WEBPACK_IMPORTED_MODULE_3__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_4__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires])));
                    await navigator.clipboard.writeText(hrefAsUrl.href);
                    return _ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({
                        message: "Copied diagram link to clipboard.",
                        color: _constants__WEBPACK_IMPORTED_MODULE_2__.LIGHT_GRAY_CSS_COLOR,
                        duration: _constants__WEBPACK_IMPORTED_MODULE_2__.TOAST_DURATION,
                    });
                },
            },
        },
        {
            "open-cad": {
                label: "Open CAD",
                callback: () => {
                    const url = new URL(location.href);
                    url.search = "?app=cad";
                    location.href = url.href;
                },
            },
        },
        {
            "truth-table": {
                label: "Truth table from diagram",
                callback: async () => {
                    const table = await _TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.getTruthTable();
                    if (table) {
                        const pre = _reified_Reified__WEBPACK_IMPORTED_MODULE_4__.html `
                            <pre><button>Copy</button> <button>Download</button> <button>Open in CAD</button><hr style="margin: 4px 0; border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_2__.LIGHT_GRAY_CSS_COLOR}" /><code style="font-family: Fira Code, monospace;">${table
                            .map((row) => row.map((io) => io.map((v) => +v).join("")).join(":"))
                            .join("\n")
                            .replaceAll(":", '<span style="color: gray;">:</span>')
                            .replaceAll("0", '<span style="color: red;">0</span>')
                            .replaceAll("1", '<span style="color: blue;">1</span>')}</code></pre>
                        `;
                        pre.children[0].addEventListener("click", async () => {
                            await navigator.clipboard.writeText(table.map((row) => row.map((io) => io.map((v) => +v).join("")).join(":")).join("\n"));
                        });
                        pre.children[1].addEventListener("click", async () => {
                            await (0,_cad_files__WEBPACK_IMPORTED_MODULE_0__.downloadFile)([
                                table.map((row) => row.map((io) => io.map((v) => +v).join("")).join(":")).join("\n"),
                            ]);
                        });
                        pre.children[2].addEventListener("click", () => {
                            const url = new URL(location.href);
                            url.search = `?app=cad&inline=${btoa(table.map((row) => row.map((io) => io.map((v) => +v).join("")).join(":")).join("\n"))}`;
                            location.href = url.href;
                        });
                        await _ModalManager__WEBPACK_IMPORTED_MODULE_5__.ModalManager.alert(pre);
                    }
                },
            },
        },
    ];
    static #actions = this.actions;
    static get #element() {
        return document.querySelector("button.tools");
    }
    static onChange(run) {
        this.#changes.add(run);
        return this;
    }
    static offChange(run) {
        this.#changes.delete(run);
        return this;
    }
    static #listener = () => {
        const menu = document.querySelector(".tools-menu");
        menu.style.display = menu.style.display === "none" ? "" : "none";
    };
    static listen() {
        this.#element.innerText = "🛠";
        const menu = _reified_Reified__WEBPACK_IMPORTED_MODULE_4__.html `<div class="tools-menu" style="display: none;"></div>`;
        menu.innerHTML = this.#actions
            .map((record) => Object.entries(record)
            .map(([name, { label, keybind }]) => keybind
            ? `<button class="${name}">${label}<p class="menu-keybind">${keybind
                .split(" ")
                .map((key) => `<span>${key}</span>`)
                .join("")}</p></button>`
            : `<button class="${name}">${label}</button>`)
            .join(""))
            .join('<div class="br"></div>');
        this.#actions.forEach((record) => {
            Object.keys(record).forEach((key) => {
                const click = record[key].callback.bind(undefined);
                const item = menu.querySelector("." + key);
                item.addEventListener("mousedown", click);
                this.#listeners.set(item, click);
            });
        });
        this.#element.after(menu);
        this.#element.addEventListener("click", this.#listener);
        const body = (e) => {
            if (e.target === this.#element || e.target.closest(".tools"))
                return;
            menu.style.display = "none";
        };
        document.body.addEventListener("mousedown", body);
        this.#listeners.set(document.body, body);
        return this;
    }
    static stop() {
        this.#listeners.forEach((listener, element) => {
            element.removeEventListener("mousedown", listener);
        });
        this.#element.removeEventListener("click", this.#listener);
        return this;
    }
}


/***/ }),

/***/ "./src/managers/UndoRedoManager.ts":
/*!*****************************************!*\
  !*** ./src/managers/UndoRedoManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UndoRedoManager": () => (/* binding */ UndoRedoManager)
/* harmony export */ });
/* harmony import */ var _DarkmodeManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");


class UndoRedoManager {
    static get #undoElement() {
        return document.querySelector("button.undo");
    }
    static get #redoElement() {
        return document.querySelector("button.redo");
    }
    static #undoListener = () => {
        _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.popHistory();
    };
    static #redoListener = () => {
        _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.redoHistory();
    };
    static listen() {
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_0__.DarkmodeManager.onChange(() => {
            this.#undoElement.style.transition = "none";
            this.#redoElement.style.transition = "none";
            requestAnimationFrame(() => {
                this.#undoElement.style.transition = "";
                this.#redoElement.style.transition = "";
            });
        });
        this.#undoElement.innerText = "UNDO";
        this.#redoElement.innerText = "REDO";
        this.#undoElement.addEventListener("click", this.#undoListener);
        this.#redoElement.addEventListener("click", this.#redoListener);
        return this;
    }
    static stop() {
        this.#undoElement.removeEventListener("click", this.#undoListener);
        this.#redoElement.removeEventListener("click", this.#redoListener);
        return this;
    }
}


/***/ }),

/***/ "./src/managers/WiringManager.ts":
/*!***************************************!*\
  !*** ./src/managers/WiringManager.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NewWireContext": () => (/* binding */ NewWireContext),
/* harmony export */   "Wiring": () => (/* binding */ Wiring),
/* harmony export */   "WiringManager": () => (/* binding */ WiringManager)
/* harmony export */ });
/* harmony import */ var _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../augments/WatchedSet */ "./src/augments/WatchedSet.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _CanvasManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CanvasManager */ "./src/managers/CanvasManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _TestingManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TestingManager */ "./src/managers/TestingManager.ts");







class NewWireContext {
    static from;
    static {
        _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.onMouseDown((e) => {
            if (NewWireContext.from) {
                const { target } = e;
                if (target && target instanceof HTMLElement) {
                    if (target.classList.contains("board-output") ||
                        target.classList.contains("component-input-button")) {
                        if (_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                        const from = NewWireContext.from;
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                            WiringManager.wires.add(new Wiring(from, target));
                        }, () => {
                            for (const wire of WiringManager.wires) {
                                if (wire.from === from && wire.to === target) {
                                    wire.destroy();
                                    break;
                                }
                            }
                        });
                    }
                }
                NewWireContext.from = undefined;
            }
            return undefined;
        });
    }
}
class Wiring {
    from;
    to;
    #destroyed = false;
    #observer;
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.#observer = new MutationObserver(() => {
            // make sure this wire is being tracked still before updating the elements
            if (!WiringManager.wires.has(this)) {
                if (![...WiringManager.wires].some((wire) => wire.to === this.to))
                    to.classList.remove("activated");
                return this.destroy();
            }
            to.classList.toggle("activated", from.classList.contains("activated"));
        });
        this.go();
    }
    destroy() {
        this.#destroyed = true;
        this.#observer.disconnect();
    }
    go() {
        this.#destroyed = false;
        this.#observer.observe(this.from, { attributeFilter: ["class"], attributes: true });
    }
    get destroyed() {
        return this.#destroyed;
    }
}
class WiringManager {
    static wires = new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet();
    static render({ bg }) {
        this.wires.forEach((wire) => {
            if (wire.destroyed) {
                if (this.wires.locked)
                    wire.go();
                else
                    this.wires.delete(wire);
                return;
            }
            const from = wire.from.getBoundingClientRect();
            const to = wire.to.getBoundingClientRect();
            const sources = [...this.wires].filter((w) => w.to === wire.to);
            wire.to.classList.toggle("activated", sources.some((w) => w.from.classList.contains("activated")));
            bg.strokeStyle = wire.from.classList.contains("activated") ? (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_ACTIVATED_COLOR)() : (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_GRAY_COLOR)();
            bg.lineWidth = 5;
            bg.lineJoin = "round";
            const xaxis = from.x + from.width / 2 - (to.x + to.width / 2);
            const yaxis = from.y + from.height / 2 - (to.y + to.width / 2);
            const points = !this.#FANCY_WIRES || Math.abs(xaxis) < 10 || Math.abs(yaxis) < 10
                ? [
                    [from.x + from.width / 2, from.y + from.height / 2],
                    [to.x + to.width / 2, to.y + to.height / 2],
                ]
                : Math.abs(xaxis) > Math.abs(yaxis)
                    ? [
                        [from.x + from.width / 2, from.y + from.height / 2],
                        [from.x + from.width / 2 - xaxis / 2, from.y + from.height / 2],
                        [to.x + to.width / 2 + xaxis / 2, to.y + to.height / 2],
                        [to.x + to.width / 2, to.y + to.height / 2],
                    ]
                    : [
                        [from.x + from.width / 2, from.y + from.height / 2],
                        [from.x + from.width / 2, from.y + from.height / 2 - yaxis / 2],
                        [to.x + to.width / 2, to.y + to.height / 2 + yaxis / 2],
                        [to.x + to.width / 2, to.y + to.height / 2],
                    ];
            points.slice(0, -1).forEach((_, i) => {
                bg.beginPath();
                bg.moveTo(...points[i]);
                bg.lineTo(...points[i + 1]);
                bg.closePath();
                bg.stroke();
            });
        });
        if (NewWireContext.from) {
            const from = NewWireContext.from.getBoundingClientRect();
            bg.strokeStyle = NewWireContext.from.classList.contains("activated")
                ? (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_ACTIVATED_COLOR)()
                : (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_GRAY_COLOR)();
            bg.lineWidth = 5;
            bg.lineJoin = "round";
            const xaxis = from.x + from.width / 2 - _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x;
            const yaxis = from.y + from.height / 2 - _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y;
            const points = !this.#FANCY_WIRES || Math.abs(xaxis) < 10 || Math.abs(yaxis) < 10
                ? [
                    [from.x + from.width / 2, from.y + from.height / 2],
                    [_MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y],
                ]
                : Math.abs(xaxis) > Math.abs(yaxis)
                    ? [
                        [from.x + from.width / 2, from.y + from.height / 2],
                        [from.x + from.width / 2 - xaxis / 2, from.y + from.height / 2],
                        [_MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x + xaxis / 2, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y],
                        [_MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y],
                    ]
                    : [
                        [from.x + from.width / 2, from.y + from.height / 2],
                        [from.x + from.width / 2, from.y + from.height / 2 - yaxis / 2],
                        [_MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y + yaxis / 2],
                        [_MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y],
                    ];
            points.slice(0, -1).forEach((_, i) => {
                bg.beginPath();
                bg.moveTo(...points[i]);
                bg.lineTo(...points[i + 1]);
                bg.closePath();
                bg.stroke();
            });
        }
    }
    static init() {
        _CanvasManager__WEBPACK_IMPORTED_MODULE_2__.CanvasManager.addJob(this.render.bind(this));
    }
    static #FANCY_WIRES = true;
    static #FANCIER_WIRES = true;
    static get FANCY_WIRES() {
        return this.#FANCY_WIRES;
    }
    static get FANCIER_WIRES() {
        return this.#FANCIER_WIRES;
    }
    static set FANCY_WIRES(v) {
        this.#FANCY_WIRES = v;
        _StorageManager__WEBPACK_IMPORTED_MODULE_5__.StorageManager.set("settings.fancyWires", this.#FANCY_WIRES);
    }
    static set FANCIER_WIRES(v) {
        this.#FANCIER_WIRES = v;
        _StorageManager__WEBPACK_IMPORTED_MODULE_5__.StorageManager.set("settings.fancierWires", this.#FANCIER_WIRES);
    }
    static {
        this.#FANCY_WIRES = _StorageManager__WEBPACK_IMPORTED_MODULE_5__.StorageManager.get("settings.fancyWires") ?? this.#FANCY_WIRES;
        this.#FANCIER_WIRES = _StorageManager__WEBPACK_IMPORTED_MODULE_5__.StorageManager.get("settings.fancierWires") ?? this.#FANCIER_WIRES;
    }
}


/***/ }),

/***/ "./src/quickpicks/components.ts":
/*!**************************************!*\
  !*** ./src/quickpicks/components.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "quickpickComponents": () => (/* binding */ quickpickComponents)
/* harmony export */ });
/* harmony import */ var _contextmenu_insert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../contextmenu/insert */ "./src/contextmenu/insert.ts");
/* harmony import */ var _contextmenu_io__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../contextmenu/io */ "./src/contextmenu/io.ts");
/* harmony import */ var _managers_QuickPickManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/QuickPickManager */ "./src/managers/QuickPickManager.ts");



const quickpickComponents = (e) => _managers_QuickPickManager__WEBPACK_IMPORTED_MODULE_2__.QuickPickManager.activate(e, [
    {
        label: "Display",
        callback(e) {
            _contextmenu_insert__WEBPACK_IMPORTED_MODULE_0__.insert["insert-component"].callback.call(undefined, e, "DISPLAY");
        },
    },
    {
        label: "7 Seg",
        callback(e) {
            _contextmenu_insert__WEBPACK_IMPORTED_MODULE_0__.insert["insert-component"].callback.call(undefined, e, "SEVEN_SEGMENT_DISPLAY");
        },
    },
    {
        label: "Output",
        callback(e) {
            _contextmenu_io__WEBPACK_IMPORTED_MODULE_1__.io["new-output"].callback.call(undefined, e);
        },
    },
    {
        label: "Input",
        callback(e) {
            _contextmenu_io__WEBPACK_IMPORTED_MODULE_1__.io["new-input"].callback.call(undefined, e);
        },
    },
]);


/***/ }),

/***/ "./src/quickpicks/gates.ts":
/*!*********************************!*\
  !*** ./src/quickpicks/gates.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "quickpickGates": () => (/* binding */ quickpickGates)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_QuickPickManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/QuickPickManager */ "./src/managers/QuickPickManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/chips */ "./src/reified/chips.ts");







const quickpickGates = (e) => _managers_QuickPickManager__WEBPACK_IMPORTED_MODULE_1__.QuickPickManager.activate(e, _reified_chips__WEBPACK_IMPORTED_MODULE_6__.gates.map((gate) => ({
    label: gate.NAME,
    callback(e) {
        const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component(Reflect.construct(gate, []), _constants__WEBPACK_IMPORTED_MODULE_0__.ORIGIN_POINT);
        const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_5__.Reified.active.add(component);
            if (_reified_Reified__WEBPACK_IMPORTED_MODULE_5__.Reified.active.has(component)) {
                component.attach();
                const { width, height } = getComputedStyle(component.element);
                component.move({
                    x: e.clientX - parseFloat(width) / 2,
                    y: e.clientY - parseFloat(height) / 2,
                });
                _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.select(component);
            }
        }, () => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_5__.Reified.active["delete"](component);
            component.detach();
            _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected = selection;
        });
    },
})));


/***/ }),

/***/ "./src/reified/Component.ts":
/*!**********************************!*\
  !*** ./src/reified/Component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ Component)
/* harmony export */ });
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../circular */ "./src/circular.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _chips__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./chips */ "./src/reified/chips.ts");











class Component extends _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified {
    element;
    inputs;
    outputs;
    name;
    #observers = new Map();
    #mouseups = new Map();
    #contextmenus = new Map();
    #clicks = new Map();
    base;
    chip;
    #angle = 0;
    #complementary = false;
    #joins = 0;
    constructor(chip, pos, complementary = false, joins = chip.inputs) {
        super();
        this.#complementary = complementary;
        this.#joins = joins;
        this.base = chip;
        this.chip =
            this.#joins !== this.base.inputs
                ? new (_chips__WEBPACK_IMPORTED_MODULE_10__.Chip.joined(this.base.constructor, this.#joins))()
                : this.base;
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_9__.html `
            <div class="component">
                <div class="component-inputs">
                    ${Array(this.joins).fill('<button class="component-input-button">I</button>').join("")}
                </div>
                <p class="component-name">${this.chip.name}</p>
                <div class="component-outputs">
                    ${Array(complementary && this.chip.outputs === 1 ? this.chip.outputs + 1 : this.chip.outputs)
            .fill('<button class="component-output-button">O</button>')
            .join("")}
                </div>
            </div>
        `;
        this.inputs = Array.from(this.element.querySelectorAll(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));
        this.name = this.element.querySelector(".component-name");
        this.#updateListeners();
        requestAnimationFrame(() => this.update());
        this.move(typeof pos === "function" ? pos.call(undefined, this) : pos);
    }
    async update() {
        const out = this.chip.evaluate(this.inputs.map((i) => i.classList.contains("activated")));
        await (0,_constants__WEBPACK_IMPORTED_MODULE_1__.DELAY)(_Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.GATE_DELAY + Math.random() * (2 * _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.GATE_DELAY_VARIATION) - _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.GATE_DELAY_VARIATION);
        this.outputs.forEach((output, i) => {
            output.classList.toggle("activated", this.#complementary && i === 1 ? !out[0] : out[i]);
        });
        return this;
    }
    get angle() {
        return this.#angle;
    }
    set angle(v) {
        this.#angle = v % 360;
        this.element.style.transform = `rotateZ(${v}deg)`;
        // rotate name rightside up if it's upside down
        if (v === 180) {
            this.name.style.transform = `rotateZ(${v}deg)`;
        }
        else {
            this.name.style.transform = "";
        }
        this.element.style.transformOrigin = (0,_Reified__WEBPACK_IMPORTED_MODULE_9__.computeTransformOrigin)(this.element);
    }
    get complementary() {
        return this.#complementary;
    }
    get joins() {
        return this.#joins;
    }
    rotate(angle) {
        this.angle = angle;
        return this;
    }
    attach() {
        super.attach();
        this.#attachListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.watch(this.element, this.name);
        return this;
    }
    detach() {
        super.detach();
        this.#destroyListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.forget(this.element, true);
        return this;
    }
    #updateListeners() {
        this.#observers.clear();
        this.#mouseups.clear();
        this.#contextmenus.clear();
        this.#clicks.clear();
        this.inputs.forEach((input) => {
            this.#observers.set(input, new MutationObserver(this.update.bind(this)));
            this.#mouseups.set(input, () => input.blur());
            this.#contextmenus.set(input, () => {
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.queueNewContext(() => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                        if (wire.to === input) {
                                            wire.destroy();
                                            deleted.push(wire.from);
                                        }
                                    });
                                    input.classList.remove("activated");
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, input)));
                                });
                            },
                        },
                    },
                ]);
            });
        });
        this.outputs.forEach((output) => {
            this.#mouseups.set(output, () => output.blur());
            this.#contextmenus.set(output, () => {
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.queueNewContext(() => [
                    {
                        "create-connection": {
                            label: "Create connection",
                            keybind: "Q",
                            stopPropagation: true,
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.NewWireContext.from = output;
                                return undefined;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                        if (wire.from === output) {
                                            wire.destroy();
                                            wire.to.classList.remove("activated");
                                            deleted.push(wire.to);
                                        }
                                    });
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(output, to)));
                                });
                            },
                        },
                    },
                ]);
            });
            this.#clicks.set(output, () => {
                if (_managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_3__.KeybindsManager.isKeyDown("KeyQ"))
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.NewWireContext.from = output;
            });
        });
        this.#contextmenus.set(this.name, () => {
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.queueNewContext(() => [
                ...(this.chip.outputs === 1
                    ? [
                        {
                            "set-inputs": {
                                label: "Set inputs",
                                callback: async () => {
                                    const input = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.prompt("Enter the number of inputs:");
                                    if (!input)
                                        return;
                                    const joins = +input;
                                    if (Number.isNaN(joins) || !Number.isInteger(joins) || joins < this.base.inputs)
                                        return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({
                                            message: `Number of inputs must be a positive integer greater than or equal to ${this.base.inputs}.`,
                                            color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                                            duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                                        });
                                    if (this.#joins === joins)
                                        return;
                                    const previous = this.#joins;
                                    const deleted = [];
                                    const inputs = [...this.inputs];
                                    const old = this.chip;
                                    return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                        this.#joins = joins;
                                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                            if (this.inputs.some((i) => wire.to === i)) {
                                                wire.destroy();
                                                wire.to.classList.remove("activated");
                                                deleted.push([wire.from, wire.to]);
                                            }
                                        });
                                        this.#destroyListeners();
                                        this.inputs.forEach((i) => i.remove());
                                        this.inputs = Array(joins)
                                            .fill(undefined)
                                            .map(() => _Reified__WEBPACK_IMPORTED_MODULE_9__.html `<button class="component-input-button">I</button>`);
                                        const ic = this.element.querySelector(".component-inputs");
                                        this.inputs.forEach((i) => ic.appendChild(i));
                                        this.#updateListeners();
                                        this.#attachListeners();
                                        this.chip =
                                            this.#joins !== this.base.inputs
                                                ? new (_chips__WEBPACK_IMPORTED_MODULE_10__.Chip.joined(this.base.constructor, this.#joins))()
                                                : this.base;
                                        this.update();
                                        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                                        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGridBasedUpdate();
                                    }, () => {
                                        this.#joins = previous;
                                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted
                                            .splice(0, deleted.length)
                                            .map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, to)));
                                        this.#destroyListeners();
                                        this.inputs.forEach((i) => i.remove());
                                        this.inputs = inputs;
                                        const ic = this.element.querySelector(".component-inputs");
                                        this.inputs.forEach((i) => ic.appendChild(i));
                                        this.#updateListeners();
                                        this.#attachListeners();
                                        this.chip = old;
                                        this.update();
                                        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                                        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGridBasedUpdate();
                                    });
                                },
                            },
                            "toggle-complementary": {
                                label: "Complementary output",
                                callback: () => {
                                    if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                        return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                    if (this.complementary) {
                                        const output = this.outputs[this.outputs.length - 1];
                                        const deleted = [];
                                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                            this.#complementary = false;
                                            this.#destroyListeners();
                                            output.remove();
                                            this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));
                                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                                if (wire.from === output) {
                                                    wire.destroy();
                                                    wire.to.classList.remove("activated");
                                                    deleted.push(wire.to);
                                                }
                                            });
                                            this.#updateListeners();
                                            this.#attachListeners();
                                            this.update();
                                            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                                            _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGridBasedUpdate();
                                        }, () => {
                                            this.#complementary = true;
                                            this.#destroyListeners();
                                            this.element
                                                .querySelector(".component-outputs")
                                                .appendChild(output);
                                            this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));
                                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted
                                                .splice(0, deleted.length)
                                                .map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(output, to)));
                                            this.#updateListeners();
                                            this.#attachListeners();
                                            this.update();
                                            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                                            _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGridBasedUpdate();
                                        });
                                    }
                                    else {
                                        const output = _Reified__WEBPACK_IMPORTED_MODULE_9__.html `<button class="component-output-button">O</button>`;
                                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                            this.#complementary = true;
                                            this.#destroyListeners();
                                            this.element
                                                .querySelector(".component-outputs")
                                                .appendChild(output);
                                            this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));
                                            this.#updateListeners();
                                            this.#attachListeners();
                                            this.update();
                                            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                                            _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGridBasedUpdate();
                                        }, () => {
                                            this.#complementary = false;
                                            this.#destroyListeners();
                                            output.remove();
                                            this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));
                                            this.#updateListeners();
                                            this.#attachListeners();
                                            this.update();
                                            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                                            _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGridBasedUpdate();
                                        });
                                    }
                                },
                            },
                        },
                    ]
                    : []),
                {
                    "rotate-component": {
                        label: "Rotate component",
                        keybind: "R",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                this.angle += 90;
                            }, () => {
                                this.angle -= 90;
                            });
                        },
                    },
                },
                {
                    "delete-component": {
                        label: "Delete component",
                        keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ X" : "Ctrl X",
                        callback: () => {
                            if (this.PERMANENT)
                                return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({
                                    message: "This component is permanent and cannot be deleted.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                                });
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.active["delete"](this);
                                this.detach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.active.add(this);
                                this.attach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, to)));
                            });
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, to)));
                            });
                        },
                    },
                },
            ]);
        });
    }
    #attachListeners() {
        this.inputs.forEach((input) => {
            this.#observers.get(input).observe(input, {
                attributes: true,
                attributeFilter: ["class"],
            });
            input.addEventListener("mouseup", this.#mouseups.get(input));
            input.addEventListener("contextmenu", this.#contextmenus.get(input));
        });
        this.outputs.forEach((output) => {
            output.addEventListener("mouseup", this.#mouseups.get(output));
            output.addEventListener("contextmenu", this.#contextmenus.get(output));
            output.addEventListener("click", this.#clicks.get(output));
        });
        this.name.addEventListener("contextmenu", this.#contextmenus.get(this.name));
    }
    #destroyListeners() {
        this.#observers.forEach((o) => o.disconnect());
        this.#mouseups.forEach((listener, element) => element.removeEventListener("mouseup", listener));
        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));
        this.#clicks.forEach((listener, element) => element.removeEventListener("click", listener));
        this.name.removeEventListener("contextmenu", this.#contextmenus.get(this.name));
    }
}


/***/ }),

/***/ "./src/reified/Display.ts":
/*!********************************!*\
  !*** ./src/reified/Display.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Display": () => (/* binding */ Display)
/* harmony export */ });
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../circular */ "./src/circular.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");










class Display extends _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified {
    element;
    inputs;
    outputs;
    display;
    #observers = new Map();
    #mouseups = new Map();
    #contextmenus = new Map();
    #clicks = new Map();
    #bits;
    #radix;
    #angle = 0;
    constructor(pos = { x: 0, y: 0 }, bits = 1, radix = 10) {
        super();
        this.#bits = bits;
        this.#radix = radix;
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_9__.html `
            <div class="display">
                <div class="component-inputs">
                    ${Array(bits).fill('<button class="component-input-button">I</button>').join("")}
                </div>
                <p class="display-content">0</p>
                <div class="component-outputs">
                    ${Array(bits).fill('<button class="component-output-button">O</button>').join("")}
                </div>
            </div>
        `;
        this.inputs = Array.from(this.element.querySelectorAll(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));
        this.display = this.element.querySelector(".display-content");
        this.#updateListeners();
        requestAnimationFrame(() => this.update());
        this.move(pos);
    }
    async update() {
        const out = this.inputs.map((i) => i.classList.contains("activated"));
        await (0,_constants__WEBPACK_IMPORTED_MODULE_1__.DELAY)(_Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.GATE_DELAY + Math.random() * (2 * _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.GATE_DELAY_VARIATION) - _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.GATE_DELAY_VARIATION);
        this.display.textContent = out
            .reverse()
            .reduce((a, b, i, n) => a + +b * 2 ** (n.length - i - 1), 0)
            .toString(this.#radix);
        [...this.outputs].reverse().forEach((output, i) => {
            output.classList.toggle("activated", out[i]);
        });
        return this;
    }
    get bits() {
        return this.#bits;
    }
    get radix() {
        return this.#radix;
    }
    get angle() {
        return this.#angle;
    }
    set angle(v) {
        this.#angle = v % 360;
        this.element.style.transform = `rotateZ(${v}deg)`;
        if (v === 180) {
            this.display.style.transform = `rotateZ(${v}deg)`;
        }
        else {
            this.display.style.transform = "";
        }
        this.element.style.transformOrigin = (0,_Reified__WEBPACK_IMPORTED_MODULE_9__.computeTransformOrigin)(this.element);
    }
    rotate(angle) {
        this.angle = angle;
        return this;
    }
    attach() {
        super.attach();
        this.#attachListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.watch(this.element, this.display);
        return this;
    }
    detach() {
        super.detach();
        this.#destroyListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.forget(this.element, true);
        return this;
    }
    #updateListeners() {
        this.#observers.clear();
        this.#mouseups.clear();
        this.#contextmenus.clear();
        this.#clicks.clear();
        this.inputs.forEach((input) => {
            this.#observers.set(input, new MutationObserver(this.update.bind(this)));
            this.#mouseups.set(input, () => input.blur());
            this.#contextmenus.set(input, () => {
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.queueNewContext(() => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                        if (wire.to === input) {
                                            wire.destroy();
                                            deleted.push(wire.from);
                                        }
                                    });
                                    input.classList.remove("activated");
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, input)));
                                });
                            },
                        },
                    },
                ]);
            });
        });
        this.outputs.forEach((output) => {
            this.#mouseups.set(output, () => output.blur());
            this.#contextmenus.set(output, () => {
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.queueNewContext(() => [
                    {
                        "create-connection": {
                            label: "Create connection",
                            keybind: "Q",
                            stopPropagation: true,
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.NewWireContext.from = output;
                                return undefined;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                        if (wire.from === output) {
                                            wire.destroy();
                                            wire.to.classList.remove("activated");
                                            deleted.push(wire.to);
                                        }
                                    });
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(output, to)));
                                });
                            },
                        },
                    },
                ]);
            });
            this.#clicks.set(output, () => {
                if (_managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_3__.KeybindsManager.isKeyDown("KeyQ"))
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.NewWireContext.from = output;
            });
        });
        this.#contextmenus.set(this.display, () => {
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.queueNewContext(() => [
                {
                    "set-bits": {
                        label: "Set bits",
                        callback: async () => {
                            const input = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.prompt("Enter the number of bits:");
                            if (!input)
                                return;
                            const bits = +input;
                            if (Number.isNaN(bits) || !Number.isInteger(bits) || bits < 1)
                                return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({
                                    message: "Number of bits must be a positive integer.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                                });
                            if (this.#bits === bits)
                                return;
                            const previous = this.#bits;
                            const deleted = [];
                            const inputs = [...this.inputs];
                            const outputs = [...this.outputs];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                this.#bits = bits;
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.#destroyListeners();
                                this.inputs.forEach((i) => i.remove());
                                this.outputs.forEach((o) => o.remove());
                                this.inputs = Array(bits)
                                    .fill(undefined)
                                    .map(() => _Reified__WEBPACK_IMPORTED_MODULE_9__.html `<button class="component-input-button">I</button>`);
                                this.outputs = Array(bits)
                                    .fill(undefined)
                                    .map(() => _Reified__WEBPACK_IMPORTED_MODULE_9__.html `<button class="component-output-button">O</button>`);
                                const ic = this.element.querySelector(".component-inputs");
                                const oc = this.element.querySelector(".component-outputs");
                                this.inputs.forEach((i) => ic.appendChild(i));
                                this.outputs.forEach((o) => oc.appendChild(o));
                                this.#updateListeners();
                                this.#attachListeners();
                                this.update();
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                                _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGridBasedUpdate();
                            }, () => {
                                this.#bits = previous;
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, to)));
                                this.#destroyListeners();
                                this.inputs.forEach((i) => i.remove());
                                this.outputs.forEach((o) => o.remove());
                                this.inputs = inputs;
                                this.outputs = outputs;
                                const ic = this.element.querySelector(".component-inputs");
                                const oc = this.element.querySelector(".component-outputs");
                                this.inputs.forEach((i) => ic.appendChild(i));
                                this.outputs.forEach((o) => oc.appendChild(o));
                                this.#updateListeners();
                                this.#attachListeners();
                                this.update();
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                                _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.snapToGridBasedUpdate();
                            });
                        },
                    },
                    "set-radix": {
                        label: "Set radix",
                        callback: async () => {
                            const input = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.prompt("Enter the number of bits:");
                            if (!input)
                                return;
                            const radix = +input;
                            if (Number.isNaN(radix) || !Number.isInteger(radix) || radix < 1 || radix > 16)
                                return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({
                                    message: "Display radix must be an integer from 1 to 16.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                                });
                            const previous = this.#radix;
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                this.#radix = radix;
                                this.update();
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                            }, () => {
                                this.#radix = previous;
                                this.update();
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.forceSave();
                            });
                        },
                    },
                },
                {
                    "rotate-component": {
                        label: "Rotate component",
                        keybind: "R",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                this.angle += 90;
                            }, () => {
                                this.angle -= 90;
                            });
                        },
                    },
                },
                {
                    "delete-component": {
                        label: "Delete component",
                        keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ X" : "Ctrl X",
                        callback: () => {
                            if (this.PERMANENT)
                                return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({
                                    message: "This component is permanent and cannot be deleted.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                                });
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.active["delete"](this);
                                this.detach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.active.add(this);
                                this.attach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, to)));
                            });
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, to)));
                            });
                        },
                    },
                },
            ]);
        });
    }
    #attachListeners() {
        this.inputs.forEach((input) => {
            this.#observers.get(input).observe(input, {
                attributes: true,
                attributeFilter: ["class"],
            });
            input.addEventListener("mouseup", this.#mouseups.get(input));
            input.addEventListener("contextmenu", this.#contextmenus.get(input));
        });
        this.outputs.forEach((output) => {
            output.addEventListener("mouseup", this.#mouseups.get(output));
            output.addEventListener("contextmenu", this.#contextmenus.get(output));
            output.addEventListener("click", this.#clicks.get(output));
        });
        this.display.addEventListener("contextmenu", this.#contextmenus.get(this.display));
    }
    #destroyListeners() {
        this.#observers.forEach((o) => o.disconnect());
        this.#mouseups.forEach((listener, element) => element.removeEventListener("mouseup", listener));
        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));
        this.#clicks.forEach((listener, element) => element.removeEventListener("click", listener));
        this.display.removeEventListener("contextmenu", this.#contextmenus.get(this.display));
    }
}


/***/ }),

/***/ "./src/reified/Input.ts":
/*!******************************!*\
  !*** ./src/reified/Input.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Input": () => (/* binding */ Input)
/* harmony export */ });
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../circular */ "./src/circular.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");









class Input extends _Reified__WEBPACK_IMPORTED_MODULE_8__.Reified {
    element;
    constructor(pos = { x: 0, y: 0 }) {
        super();
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_8__.html `<button class="board-input">I</button>`;
        this.move(pos);
    }
    #mouseup = () => {
        this.element.blur();
    };
    #mousedown = (e) => {
        this.element.dataset.x = e.clientX.toString();
        this.element.dataset.y = e.clientY.toString();
    };
    #click = (e) => {
        if (_managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_3__.KeybindsManager.isKeyDown("KeyQ"))
            return (_managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.NewWireContext.from = this.element);
        if (Math.hypot(e.clientX - +this.element.dataset.x, e.clientY - +this.element.dataset.y) > 2)
            return;
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
        const active = this.element.classList.contains("activated");
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
            this.element.classList.toggle("activated", !active);
        }, () => {
            this.element.classList.toggle("activated", active);
        });
    };
    #contextmenu = () => {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.queueNewContext(() => [
            {
                "create-connection": {
                    label: "Create connection",
                    keybind: "Q",
                    stopPropagation: true,
                    callback: () => {
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.NewWireContext.from = this.element;
                        return undefined;
                    },
                },
                "delete-input": {
                    label: "Delete input",
                    keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ X" : "Ctrl X",
                    callback: () => {
                        if (this.PERMANENT)
                            return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.toast({
                                message: "This input is permanent and cannot be deleted.",
                                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                            });
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                            _Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active["delete"](this);
                            this.detach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.forEach((wire) => {
                                if (wire.from === this.element) {
                                    wire.destroy();
                                    wire.to.classList.remove("activated");
                                    deleted.push(wire.to);
                                }
                            });
                        }, () => {
                            _Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.add(this);
                            this.attach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.Wiring(this.element, to)));
                        });
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                    callback: () => {
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.forEach((wire) => {
                                if (wire.from === this.element) {
                                    wire.destroy();
                                    wire.to.classList.remove("activated");
                                    deleted.push(wire.to);
                                }
                            });
                        }, () => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.Wiring(this.element, to)));
                        });
                    },
                },
            },
        ]);
    };
    attach() {
        super.attach();
        this.element.addEventListener("mouseup", this.#mouseup);
        this.element.addEventListener("mousedown", this.#mousedown);
        this.element.addEventListener("click", this.#click);
        this.element.addEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.watch(this.element);
        return this;
    }
    detach() {
        super.detach();
        this.element.removeEventListener("mouseup", this.#mouseup);
        this.element.removeEventListener("mousedown", this.#mousedown);
        this.element.removeEventListener("click", this.#click);
        this.element.removeEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.forget(this.element, true);
        return this;
    }
}


/***/ }),

/***/ "./src/reified/Output.ts":
/*!*******************************!*\
  !*** ./src/reified/Output.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Output": () => (/* binding */ Output)
/* harmony export */ });
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../circular */ "./src/circular.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");








class Output extends _Reified__WEBPACK_IMPORTED_MODULE_7__.Reified {
    element;
    #mouseup = () => {
        this.element.blur();
    };
    #contextmenu = () => {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.queueNewContext(() => [
            {
                "delete-output": {
                    label: "Delete output",
                    keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ X" : "Ctrl X",
                    callback: () => {
                        if (this.PERMANENT)
                            return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
                                message: "This output is permanent and cannot be deleted.",
                                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                            });
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
                            _Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active["delete"](this);
                            this.detach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.forEach((wire) => {
                                if (wire.to === this.element) {
                                    wire.destroy();
                                    deleted.push(wire.from);
                                }
                            });
                            this.element.classList.remove("activated");
                        }, () => {
                            _Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.add(this);
                            this.attach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.Wiring(from, this.element)));
                        });
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                    callback: () => {
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.forEach((wire) => {
                                if (wire.to === this.element) {
                                    wire.destroy();
                                    deleted.push(wire.from);
                                }
                            });
                            this.element.classList.remove("activated");
                        }, () => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.Wiring(from, this.element)));
                        });
                    },
                },
            },
        ]);
    };
    constructor(pos = { x: 0, y: 0 }) {
        super();
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="board-output">O</button>`;
        this.move(pos);
    }
    attach() {
        super.attach();
        this.element.addEventListener("mouseup", this.#mouseup);
        this.element.addEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.watch(this.element);
        return this;
    }
    detach() {
        super.detach();
        this.element.removeEventListener("mouseup", this.#mouseup);
        this.element.removeEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.forget(this.element, true);
        return this;
    }
}


/***/ }),

/***/ "./src/reified/Reified.ts":
/*!********************************!*\
  !*** ./src/reified/Reified.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Reified": () => (/* binding */ Reified),
/* harmony export */   "computeTransformOrigin": () => (/* binding */ computeTransformOrigin),
/* harmony export */   "css": () => (/* binding */ css),
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "overlappedBounds": () => (/* binding */ overlappedBounds),
/* harmony export */   "preventDefault": () => (/* binding */ preventDefault)
/* harmony export */ });
/* harmony import */ var _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../augments/WatchedSet */ "./src/augments/WatchedSet.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/StorageManager */ "./src/managers/StorageManager.ts");



function html(...args) {
    const [template, ...values] = args;
    const html = typeof template === "string" ? template : template.reduce((html, s, i) => html + s + (values[i] ?? ""), "");
    return new DOMParser().parseFromString(html, "text/html").body.childNodes[0];
}
function css(...args) {
    const [template, ...values] = args;
    const css = typeof template === "string" ? template : template.reduce((css, s, i) => css + s + (values[i] ?? ""), "");
    return css;
}
function computeTransformOrigin(element) {
    const { width, height, transform } = getComputedStyle(element);
    if (transform && transform !== "none") {
        const values = transform.match(/^matrix\((.+)\)$/)?.[1].split(", ");
        if (values) {
            element.style.translate = "";
            const [a, b] = values.map(Number);
            const angle = (Math.round(Math.atan2(b, a) * (180 / Math.PI)) + 360) % 360;
            if (angle === 0 || angle === 90)
                return parseFloat(height) / 2 + "px " + parseFloat(height) / 2 + "px";
            if (angle === 180)
                return "center";
            element.style.translate = "0 " + (parseFloat(width) - parseFloat(height)) + "px";
            return parseFloat(height) / 2 + "px " + parseFloat(height) / 2 + "px";
        }
    }
    return "center";
}
function overlappedBounds(rect, from, to) {
    const bounds = {
        x: Math.min(from.x, to.x),
        y: Math.min(from.y, to.y),
        width: Math.abs(from.x - to.x),
        height: Math.abs(from.y - to.y),
    };
    return (rect.x <= bounds.x + bounds.width &&
        rect.x + rect.width >= bounds.x &&
        rect.y <= bounds.y + bounds.height &&
        rect.y + rect.height >= bounds.y);
}
function preventDefault(e) {
    e.preventDefault();
}
class Reified {
    uuid = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.SCUFFED_UUID)();
    PERMANENT = false;
    static active = new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet();
    static get root() {
        return document.querySelector(".reified-root");
    }
    move({ x, y, centered, relative }) {
        this.element.style.transformOrigin = computeTransformOrigin(this.element);
        if (relative) {
            this.element.style.left = parseFloat(this.element.style.left) + (x ?? 0) + "px";
            this.element.style.top = parseFloat(this.element.style.top) + (y ?? 0) + "px";
        }
        else {
            if (typeof x !== "undefined")
                this.element.style.left = x + "px";
            if (typeof y !== "undefined")
                this.element.style.top = y + "px";
        }
        if (centered)
            requestAnimationFrame(() => {
                const { top, left, width, height } = getComputedStyle(this.element);
                this.move({
                    x: parseFloat(left) - parseFloat(width) / 2,
                    y: parseFloat(top) - parseFloat(height) / 2,
                });
            });
    }
    attach() {
        Reified.root.appendChild(this.element);
        return this;
    }
    detach() {
        this.element.remove();
        return this;
    }
    permanent() {
        this.PERMANENT = true;
        return this;
    }
    get permanence() {
        return this.PERMANENT;
    }
    get pos() {
        return {
            x: parseFloat(this.element.style.left),
            y: parseFloat(this.element.style.top),
        };
    }
    static #GATE_DELAY = 100;
    static #GATE_DELAY_VARIATION = 25;
    static get GATE_DELAY() {
        return this.#GATE_DELAY;
    }
    static get GATE_DELAY_VARIATION() {
        return this.#GATE_DELAY_VARIATION;
    }
    static set GATE_DELAY(v) {
        this.#GATE_DELAY = v;
        _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__.StorageManager.set("settings.gateDelay", this.#GATE_DELAY);
    }
    static set GATE_DELAY_VARIATION(v) {
        this.#GATE_DELAY_VARIATION = v;
        _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__.StorageManager.set("settings.gateDelayVariation", this.#GATE_DELAY_VARIATION);
    }
    static {
        this.#GATE_DELAY = _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__.StorageManager.get("settings.gateDelay") ?? this.#GATE_DELAY;
        this.#GATE_DELAY_VARIATION = _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__.StorageManager.get("settings.gateDelayVariation") ?? this.#GATE_DELAY_VARIATION;
    }
}


/***/ }),

/***/ "./src/reified/SevenSegmentDisplay.ts":
/*!********************************************!*\
  !*** ./src/reified/SevenSegmentDisplay.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SevenSegmentDisplay": () => (/* binding */ SevenSegmentDisplay)
/* harmony export */ });
/* harmony import */ var _circular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../circular */ "./src/circular.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_CanvasManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/CanvasManager */ "./src/managers/CanvasManager.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");










class SevenSegmentDisplay extends _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified {
    element;
    inputs;
    outputs;
    display;
    #observers = new Map();
    #mouseups = new Map();
    #contextmenus = new Map();
    #clicks = new Map();
    #angle = 0;
    #ctx;
    constructor(pos = { x: 0, y: 0 }) {
        super();
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_9__.html `
            <div class="display">
                <div class="component-inputs">
                    ${Array(8).fill('<button class="component-input-button">I</button>').join("")}
                </div>
                <canvas class="seven-segment-display"></canvas>
                <div class="component-outputs">
                    ${Array(0).fill('<button class="component-output-button">O</button>').join("")}
                </div>
            </div>
        `;
        this.inputs = Array.from(this.element.querySelectorAll(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));
        this.display = this.element.querySelector(".seven-segment-display");
        this.display.height = 100 * devicePixelRatio;
        this.display.width = 80 * devicePixelRatio;
        this.#ctx = this.display.getContext("2d");
        this.#updateListeners();
        requestAnimationFrame(() => this.update());
        this.move(pos);
    }
    render() {
        this.#ctx.clearRect(0, 0, this.display.width, this.display.height);
        const out = this.inputs.map((i) => i.classList.contains("activated"));
        // define all our segments
        const segments = [
            {
                x: 2,
                y: 45,
                width: 24,
                height: 10,
            },
            {
                x: 32,
                y: 6,
                width: 32,
                height: 14,
            },
            {
                x: 60,
                y: 16,
                width: 14,
                height: 32,
            },
            {
                x: 60,
                y: 52,
                width: 14,
                height: 32,
            },
            {
                x: 32,
                y: 80,
                width: 32,
                height: 14,
            },
            {
                x: 22,
                y: 52,
                width: 14,
                height: 32,
            },
            {
                x: 22,
                y: 16,
                width: 14,
                height: 32,
            },
            {
                x: 32,
                y: 43,
                width: 32,
                height: 14,
            },
        ].map(({ x, y, width, height }) => ({
            x: x * devicePixelRatio,
            y: y * devicePixelRatio,
            width: width * devicePixelRatio,
            height: height * devicePixelRatio,
        }));
        this.#ctx;
        segments.forEach(({ x, y, width, height }, i) => {
            this.#ctx.fillStyle = out[i] ? (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_ACTIVATED_COLOR)() : (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_GRAY_COLOR)();
            this.#ctx.strokeStyle = "black";
            this.#ctx.beginPath();
            if (width > height) {
                this.#ctx.moveTo(x, y + height / 2);
                this.#ctx.lineTo(x + height / 2, y);
                this.#ctx.lineTo(x + width - height / 2, y);
                this.#ctx.lineTo(x + width, y + height / 2);
                this.#ctx.lineTo(x + width - height / 2, y + height);
                this.#ctx.lineTo(x + height / 2, y + height);
            }
            else {
                this.#ctx.moveTo(x + width / 2, y);
                this.#ctx.lineTo(x, y + width / 2);
                this.#ctx.lineTo(x, y + height - width / 2);
                this.#ctx.lineTo(x + width / 2, y + height);
                this.#ctx.lineTo(x + width, y + height - width / 2);
                this.#ctx.lineTo(x + width, y + width / 2);
            }
            this.#ctx.closePath();
            this.#ctx.stroke();
            this.#ctx.fill();
        });
    }
    async update() {
        await (0,_constants__WEBPACK_IMPORTED_MODULE_1__.DELAY)(_Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.GATE_DELAY + Math.random() * (2 * _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.GATE_DELAY_VARIATION) - _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.GATE_DELAY_VARIATION);
        this.render();
        return this;
    }
    get angle() {
        return this.#angle;
    }
    set angle(v) {
        this.#angle = v % 360;
        this.element.style.transform = `rotateZ(${v}deg)`;
        if (v === 180) {
            this.display.style.transform = `rotateZ(${v}deg)`;
        }
        else {
            this.display.style.transform = "";
        }
        this.element.style.transformOrigin = (0,_Reified__WEBPACK_IMPORTED_MODULE_9__.computeTransformOrigin)(this.element);
    }
    rotate(angle) {
        this.angle = angle;
        return this;
    }
    attach() {
        super.attach();
        this.#attachListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_3__.DraggingManager.watch(this.element, this.display);
        _managers_CanvasManager__WEBPACK_IMPORTED_MODULE_2__.CanvasManager.addJob(this.render.bind(this));
        return this;
    }
    detach() {
        super.detach();
        this.#destroyListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_3__.DraggingManager.forget(this.element, true);
        _managers_CanvasManager__WEBPACK_IMPORTED_MODULE_2__.CanvasManager.deleteJob(this.render.bind(this));
        return this;
    }
    #updateListeners() {
        this.#observers.clear();
        this.#mouseups.clear();
        this.#contextmenus.clear();
        this.#clicks.clear();
        this.inputs.forEach((input) => {
            this.#observers.set(input, new MutationObserver(this.update.bind(this)));
            this.#mouseups.set(input, () => input.blur());
            this.#contextmenus.set(input, () => {
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.queueNewContext(() => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                        if (wire.to === input) {
                                            wire.destroy();
                                            deleted.push(wire.from);
                                        }
                                    });
                                    input.classList.remove("activated");
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, input)));
                                });
                            },
                        },
                    },
                ]);
            });
        });
        this.outputs.forEach((output) => {
            this.#mouseups.set(output, () => output.blur());
            this.#contextmenus.set(output, () => {
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.queueNewContext(() => [
                    {
                        "create-connection": {
                            label: "Create connection",
                            keybind: "Q",
                            stopPropagation: true,
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.NewWireContext.from = output;
                                return undefined;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                        if (wire.from === output) {
                                            wire.destroy();
                                            wire.to.classList.remove("activated");
                                            deleted.push(wire.to);
                                        }
                                    });
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(output, to)));
                                });
                            },
                        },
                    },
                ]);
            });
            this.#clicks.set(output, () => {
                if (_managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_4__.KeybindsManager.isKeyDown("KeyQ"))
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.NewWireContext.from = output;
            });
        });
        this.#contextmenus.set(this.display, () => {
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.queueNewContext(() => [
                {
                    "rotate-component": {
                        label: "Rotate component",
                        keybind: "R",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                this.angle += 90;
                            }, () => {
                                this.angle -= 90;
                            });
                        },
                    },
                },
                {
                    "delete-component": {
                        label: "Delete component",
                        keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ X" : "Ctrl X",
                        callback: () => {
                            if (this.PERMANENT)
                                return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({
                                    message: "This component is permanent and cannot be deleted.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                                });
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.active["delete"](this);
                                this.detach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _Reified__WEBPACK_IMPORTED_MODULE_9__.Reified.active.add(this);
                                this.attach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, to)));
                            });
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        keybind: _circular__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_6__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.Wiring(from, to)));
                            });
                        },
                    },
                },
            ]);
        });
    }
    #attachListeners() {
        this.inputs.forEach((input) => {
            this.#observers.get(input).observe(input, {
                attributes: true,
                attributeFilter: ["class"],
            });
            input.addEventListener("mouseup", this.#mouseups.get(input));
            input.addEventListener("contextmenu", this.#contextmenus.get(input));
        });
        this.outputs.forEach((output) => {
            output.addEventListener("mouseup", this.#mouseups.get(output));
            output.addEventListener("contextmenu", this.#contextmenus.get(output));
            output.addEventListener("click", this.#clicks.get(output));
        });
        this.display.addEventListener("contextmenu", this.#contextmenus.get(this.display));
    }
    #destroyListeners() {
        this.#observers.forEach((o) => o.disconnect());
        this.#mouseups.forEach((listener, element) => element.removeEventListener("mouseup", listener));
        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));
        this.#clicks.forEach((listener, element) => element.removeEventListener("click", listener));
        this.display.removeEventListener("contextmenu", this.#contextmenus.get(this.display));
    }
}


/***/ }),

/***/ "./src/reified/chips.ts":
/*!******************************!*\
  !*** ./src/reified/chips.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AndGate": () => (/* binding */ AndGate),
/* harmony export */   "BufferGate": () => (/* binding */ BufferGate),
/* harmony export */   "Chip": () => (/* binding */ Chip),
/* harmony export */   "FullAdderGate": () => (/* binding */ FullAdderGate),
/* harmony export */   "HalfAdderGate": () => (/* binding */ HalfAdderGate),
/* harmony export */   "NandGate": () => (/* binding */ NandGate),
/* harmony export */   "NorGate": () => (/* binding */ NorGate),
/* harmony export */   "NotGate": () => (/* binding */ NotGate),
/* harmony export */   "OrGate": () => (/* binding */ OrGate),
/* harmony export */   "XnorGate": () => (/* binding */ XnorGate),
/* harmony export */   "XorGate": () => (/* binding */ XorGate),
/* harmony export */   "chips": () => (/* binding */ chips),
/* harmony export */   "gates": () => (/* binding */ gates)
/* harmony export */ });
class Chip {
    static NAME;
    static INPUTS;
    static OUTPUTS;
    name;
    inputs;
    outputs;
    constructor(name, inputs, outputs) {
        this.name = name;
        this.inputs = inputs;
        this.outputs = outputs;
    }
    evaluate(inputs) {
        return this.output(inputs);
    }
    static joined(chip, n) {
        // gates should have at least one input and one output
        if (chip.INPUTS < 1 || chip.OUTPUTS < 1)
            throw new TypeError("Invalid chip");
        // if there is only one input then it's just a buffer gate
        // special case if chip is a not gate, then it's just a not gate
        if (n === 1)
            return (chip instanceof NotGate ? NotGate : BufferGate);
        return class extends Chip {
            static NAME = chip.NAME;
            static INPUTS = n;
            static OUTPUTS = chip.OUTPUTS;
            #chips = Array.from({ length: n - 1 }, () => new chip());
            constructor() {
                super(chip.NAME, n, chip.OUTPUTS);
            }
            output(inputs) {
                return this.#chips
                    .slice(1)
                    .reduce((output, chip, i) => chip.output([inputs[i + chip.inputs], ...output]), this.#chips[0].output(inputs.slice(0, chip.INPUTS)));
            }
        };
    }
}
class AndGate extends Chip {
    static NAME = "AND";
    static INPUTS = 2;
    static OUTPUTS = 1;
    constructor() {
        super("AND", 2, 1);
    }
    output([a, b]) {
        return [a && b];
    }
}
class OrGate extends Chip {
    static NAME = "OR";
    static INPUTS = 2;
    static OUTPUTS = 1;
    constructor() {
        super("OR", 2, 1);
    }
    output([a, b]) {
        return [a || b];
    }
}
class NotGate extends Chip {
    static NAME = "NOT";
    static INPUTS = 1;
    static OUTPUTS = 1;
    constructor() {
        super("NOT", 1, 1);
    }
    output([n]) {
        return [!n];
    }
}
class NandGate extends Chip {
    static NAME = "NAND";
    static INPUTS = 2;
    static OUTPUTS = 1;
    constructor() {
        super("NAND", 2, 1);
    }
    output([a, b]) {
        return [!(a && b)];
    }
}
class NorGate extends Chip {
    static NAME = "NOR";
    static INPUTS = 2;
    static OUTPUTS = 1;
    constructor() {
        super("NOR", 2, 1);
    }
    output([a, b]) {
        return [!(a || b)];
    }
}
class XorGate extends Chip {
    static NAME = "XOR";
    static INPUTS = 2;
    static OUTPUTS = 1;
    constructor() {
        super("XOR", 2, 1);
    }
    output([a, b]) {
        return [!!(+a ^ +b)];
    }
}
class XnorGate extends Chip {
    static NAME = "XNOR";
    static INPUTS = 2;
    static OUTPUTS = 1;
    constructor() {
        super("XNOR", 2, 1);
    }
    output([a, b]) {
        return [!(+a ^ +b)];
    }
}
class BufferGate extends Chip {
    static NAME = "BUF";
    static INPUTS = 1;
    static OUTPUTS = 1;
    constructor() {
        super("BUFFER", 1, 1);
    }
    output([n]) {
        return [n];
    }
}
const gates = [AndGate, OrGate, NotGate, NandGate, NorGate, XorGate, XnorGate, BufferGate];
const chips = new Map(gates.map((gate) => [gate.NAME, gate]));
chips.set("BUFF", BufferGate);
chips.set("BUFFER", BufferGate);
class HalfAdderGate extends Chip {
    static NAME = "HALFADDER";
    static INPUTS = 2;
    static OUTPUTS = 2;
    constructor() {
        super("HADD", 2, 2);
    }
    output([a, b]) {
        return [!!(+a ^ +b), a && b];
    }
}
chips.set(HalfAdderGate.NAME, HalfAdderGate);
chips.set("HADD", HalfAdderGate);
class FullAdderGate extends Chip {
    static NAME = "FULLADDER";
    static INPUTS = 3;
    static OUTPUTS = 2;
    constructor() {
        super("FADD", 3, 2);
    }
    output([a, b, c]) {
        // (a xor b) xor c
        // ((a xor b) and c) or (a and b)
        return [!!(+!!(+a ^ +b) ^ +c), (!!(+a ^ +b) && c) || (a && b)];
    }
}
chips.set(FullAdderGate.NAME, FullAdderGate);
chips.set("FADD", FullAdderGate);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && !queue.d) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = 1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/cad/employee.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUM7d0JBQ25ELENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQy9ELENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3ZELENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3FCQUM5QztvQkFDSCxDQUFDLENBQUM7d0JBQ0ksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ25ELENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBQy9ELENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBQ3ZELENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3FCQUM5QyxDQUFD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QUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7YUFDaEQ7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzlDO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUV0QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU07UUFDUixNQUFNLGlEQUFLLENBQ1Asd0RBQWtCLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLGtFQUE0QixDQUFDLEdBQUcsa0VBQTRCLENBQ3pHLENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxDQUFTO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRXRCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBRWxELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1NBQ3JEO2FBQU07WUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLGdFQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQWE7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDRixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUV4Qiw0RUFBcUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVsRCx5RUFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTdDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNO1FBQ0YsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWYsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFekIsNkVBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUzQyw0RUFBdUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWhELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxnQkFBZ0I7UUFDWixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXpFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUU5QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO2dCQUMvQixvRkFBOEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDakM7d0JBQ0ksb0JBQW9CLEVBQUU7NEJBQ2xCLEtBQUssRUFBRSxvQkFBb0I7NEJBQzNCLE9BQU8sRUFBRSxnREFBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWM7NEJBQzdDLFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0NBQ1gsSUFBSSw0RUFBc0I7b0NBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDO2dDQUV4RCxNQUFNLE9BQU8sR0FBYyxFQUFFLENBQUM7Z0NBRTlCLE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtvQ0FDRCxnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO3dDQUNqQyxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssS0FBSyxFQUFFOzRDQUNuQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7NENBRWYsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7eUNBQzNCO29DQUNMLENBQUMsQ0FBQyxDQUFDO29DQUVILEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dDQUN4QyxDQUFDLEVBQ0QsR0FBRyxFQUFFO29DQUNELCtFQUEwQixDQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLDJEQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQzNFLENBQUM7Z0NBQ04sQ0FBQyxDQUNKLENBQUM7NEJBQ04sQ0FBQzt5QkFDSjtxQkFDSjtpQkFDSixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFFaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtnQkFDaEMsb0ZBQThCLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ2pDO3dCQUNJLG1CQUFtQixFQUFFOzRCQUNqQixLQUFLLEVBQUUsbUJBQW1COzRCQUMxQixPQUFPLEVBQUUsR0FBRzs0QkFDWixlQUFlLEVBQUUsSUFBSTs0QkFDckIsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQ0FDWCxJQUFJLDRFQUFzQjtvQ0FBRSxPQUFPLDhEQUFrQixFQUFFLENBQUM7Z0NBRXhELHdFQUFtQixHQUFHLE1BQU0sQ0FBQztnQ0FFN0IsT0FBTyxTQUFTLENBQUM7NEJBQ3JCLENBQUM7eUJBQ0o7d0JBQ0Qsb0JBQW9CLEVBQUU7NEJBQ2xCLEtBQUssRUFBRSxvQkFBb0I7NEJBQzNCLE9BQU8sRUFBRSxnREFBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWM7NEJBQzdDLFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0NBQ1gsSUFBSSw0RUFBc0I7b0NBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDO2dDQUV4RCxNQUFNLE9BQU8sR0FBYyxFQUFFLENBQUM7Z0NBRTlCLE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtvQ0FDRCxnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO3dDQUNqQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFOzRDQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7NENBRWYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRDQUV0QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt5Q0FDekI7b0NBQ0wsQ0FBQyxDQUFDLENBQUM7Z0NBQ1AsQ0FBQyxFQUNELEdBQUcsRUFBRTtvQ0FDRCwrRUFBMEIsQ0FDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSwyREFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUN4RSxDQUFDO2dDQUNOLENBQUMsQ0FDSixDQUFDOzRCQUNOLENBQUM7eUJBQ0o7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUMxQixJQUFJLGdGQUF5QixDQUFDLE1BQU0sQ0FBQztvQkFBRSx3RUFBbUIsR0FBRyxNQUFNLENBQUM7WUFDeEUsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLG9GQUE4QixDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNqQztvQkFDSSxrQkFBa0IsRUFBRTt3QkFDaEIsS0FBSyxFQUFFLGtCQUFrQjt3QkFDekIsT0FBTyxFQUFFLEdBQUc7d0JBQ1osUUFBUSxFQUFFLEdBQUcsRUFBRTs0QkFDWCxJQUFJLDRFQUFzQjtnQ0FBRSxPQUFPLDhEQUFrQixFQUFFLENBQUM7NEJBRXhELE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtnQ0FDRCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQzs0QkFDckIsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQ0FDRCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQzs0QkFDckIsQ0FBQyxDQUNKLENBQUM7d0JBQ04sQ0FBQztxQkFDSjtpQkFDSjtnQkFDRDtvQkFDSSxrQkFBa0IsRUFBRTt3QkFDaEIsS0FBSyxFQUFFLGtCQUFrQjt3QkFDekIsT0FBTyxFQUFFLGdEQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUTt3QkFDckMsUUFBUSxFQUFFLEdBQUcsRUFBRTs0QkFDWCxJQUFJLElBQUksQ0FBQyxTQUFTO2dDQUNkLE9BQU8sS0FBSyxzRUFBa0IsQ0FBQztvQ0FDM0IsT0FBTyxFQUFFLG9EQUFvRDtvQ0FDN0QsS0FBSyxFQUFFLDJEQUFtQjtvQ0FDMUIsUUFBUSxFQUFFLHNEQUFjO2lDQUMzQixDQUFDLENBQUM7NEJBRVAsSUFBSSw0RUFBc0I7Z0NBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDOzRCQUV4RCxNQUFNLE9BQU8sR0FBbUMsRUFBRSxDQUFDOzRCQUVuRCxPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7Z0NBQ0QsOERBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBRTVCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQ0FFZCxnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29DQUNqQyxJQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3Q0FDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQzNDO3dDQUNFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3Q0FFZixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7d0NBRXRDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FDQUN0QztnQ0FDTCxDQUFDLENBQUMsQ0FBQztnQ0FFSCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs0QkFDaEUsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQ0FDRCx3REFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FFekIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dDQUVkLCtFQUEwQixDQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksMkRBQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FDOUUsQ0FBQzs0QkFDTixDQUFDLENBQ0osQ0FBQzt3QkFDTixDQUFDO3FCQUNKO29CQUNELG9CQUFvQixFQUFFO3dCQUNsQixLQUFLLEVBQUUsb0JBQW9CO3dCQUMzQixPQUFPLEVBQUUsZ0RBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO3dCQUM3QyxRQUFRLEVBQUUsR0FBRyxFQUFFOzRCQUNYLElBQUksNEVBQXNCO2dDQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQzs0QkFFeEQsTUFBTSxPQUFPLEdBQW1DLEVBQUUsQ0FBQzs0QkFFbkQsT0FBTyxnRkFBMEIsQ0FDN0IsR0FBRyxFQUFFO2dDQUNELGdGQUEyQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0NBQ2pDLElBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dDQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsRUFDM0M7d0NBQ0UsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dDQUVmLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQzt3Q0FFdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUNBQ3RDO2dDQUNMLENBQUMsQ0FBQyxDQUFDO2dDQUVILElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUNoRSxDQUFDLEVBQ0QsR0FBRyxFQUFFO2dDQUNELCtFQUEwQixDQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksMkRBQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FDOUUsQ0FBQzs0QkFDTixDQUFDLENBQ0osQ0FBQzt3QkFDTixDQUFDO3FCQUNKO2lCQUNKO2FBQ0osQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO2dCQUN2QyxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsZUFBZSxFQUFFLENBQUMsT0FBTyxDQUFDO2FBQzdCLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBQztZQUU5RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUM7UUFDMUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQzVCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQztZQUVoRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVELGlCQUFpQjtRQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVoRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUV4RyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUU1RixJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBQztJQUMzRixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JjTSxNQUFlLElBQUk7SUFDdEIsTUFBTSxDQUFVLElBQUksQ0FBUztJQUM3QixNQUFNLENBQVUsTUFBTSxDQUFTO0lBQy9CLE1BQU0sQ0FBVSxPQUFPLENBQVM7SUFFdkIsSUFBSSxDQUFDO0lBRUwsTUFBTSxDQUFDO0lBQ1AsT0FBTyxDQUFDO0lBRWpCLFlBQVksSUFBWSxFQUFFLE1BQVMsRUFBRSxPQUFVO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFJRCxRQUFRLENBQUMsTUFBaUI7UUFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQTZCLENBQWMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FDVCxJQUF3QixFQUN4QixDQUFJO1FBRUosc0RBQXNEO1FBQ3RELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDO1lBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU3RSwwREFBMEQ7UUFDMUQsZ0VBQWdFO1FBQ2hFLElBQUksQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLENBQUMsSUFBSSxZQUFZLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQXVCLENBQUM7UUFFM0YsT0FBTyxLQUFNLFNBQVEsSUFBVTtZQUMzQixNQUFNLENBQVUsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDakMsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBRXZDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7WUFFekQ7Z0JBQ0ksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFZLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQWlCO2dCQUNwQixPQUFPLElBQUksQ0FBQyxNQUFNO3FCQUNiLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ1IsTUFBTSxDQUNILENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBb0IsQ0FBQyxFQUN6RixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFvQixDQUFDLENBQ3pFLENBQUM7WUFDVixDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7Q0FDSjtBQUVNLE1BQU0sT0FBUSxTQUFRLElBQVU7SUFDbkMsTUFBTSxDQUFVLElBQUksR0FBRyxLQUFLLENBQUM7SUFDN0IsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFNUI7UUFDSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBcUI7UUFDN0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDOztBQUdFLE1BQU0sTUFBTyxTQUFRLElBQVU7SUFDbEMsTUFBTSxDQUFVLElBQUksR0FBRyxJQUFJLENBQUM7SUFDNUIsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFNUI7UUFDSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBcUI7UUFDN0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDOztBQUdFLE1BQU0sT0FBUSxTQUFRLElBQVU7SUFDbkMsTUFBTSxDQUFVLElBQUksR0FBRyxLQUFLLENBQUM7SUFDN0IsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFNUI7UUFDSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFZO1FBQ2pCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7O0FBR0UsTUFBTSxRQUFTLFNBQVEsSUFBVTtJQUNwQyxNQUFNLENBQVUsSUFBSSxHQUFHLE1BQU0sQ0FBQztJQUM5QixNQUFNLENBQVUsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixNQUFNLENBQVUsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUU1QjtRQUNJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFxQjtRQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7O0FBR0UsTUFBTSxPQUFRLFNBQVEsSUFBVTtJQUNuQyxNQUFNLENBQVUsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUM3QixNQUFNLENBQVUsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixNQUFNLENBQVUsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUU1QjtRQUNJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFxQjtRQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7O0FBR0UsTUFBTSxPQUFRLFNBQVEsSUFBVTtJQUNuQyxNQUFNLENBQVUsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUM3QixNQUFNLENBQVUsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixNQUFNLENBQVUsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUU1QjtRQUNJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFxQjtRQUM3QixPQUFPLENBQUMsQ0FBQyxD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Q0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9hdWdtZW50cy9XYXRjaGVkU2V0LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jYWQvYWxnZWJyYS9yZWlmeS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY2FkL2FsZ2VicmEvc3RyaW5naWZ5LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jYWQvYWxnZWJyYS9zdWJzdGl0dXRlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jYWQvYWxnZWJyYS92YXJpYWJsZXMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NhZC9lbXBsb3llZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY2FkL2ZpbGVzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jaXJjdWxhci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jb250ZXh0bWVudS9pbnNlcnQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L2lvLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9maWxlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvQ2FudmFzTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvRGFya21vZGVNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTWVudU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL01vZGFsTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTW91c2VNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9RdWlja1BpY2tNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU2V0dGluZ3NNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvVGVzdGluZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1RvYXN0TWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvVG9vbHNNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9VbmRvUmVkb01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1dpcmluZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3F1aWNrcGlja3MvY29tcG9uZW50cy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcXVpY2twaWNrcy9nYXRlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9Db21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvRGlzcGxheS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9JbnB1dC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9PdXRwdXQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvUmVpZmllZC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9TZXZlblNlZ21lbnREaXNwbGF5LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL2NoaXBzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL2FzeW5jIG1vZHVsZSIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgV2F0Y2hlZFNldDxUPiBleHRlbmRzIFNldDxUPiB7XG4gICAgI2FkZHMgPSBuZXcgU2V0PChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQ+KCk7XG4gICAgI2RlbGV0ZXMgPSBuZXcgU2V0PChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQ+KCk7XG4gICAgI2F0dGVtcHRlZEFkZHMgPSBuZXcgU2V0PChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQ+KCk7XG4gICAgI2F0dGVtcHRlZERlbGV0ZXMgPSBuZXcgU2V0PChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQ+KCk7XG5cbiAgICAjbG9ja2VkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihpdGVtcz86IENvbnN0cnVjdG9yUGFyYW1ldGVyczx0eXBlb2YgU2V0PFQ+PlswXSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGlmIChpdGVtcykgdGhpcy5hZGRBbGwoWy4uLml0ZW1zXSk7XG4gICAgfVxuXG4gICAgb25BZGQocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2FkZHMuYWRkKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25EZWxldGUocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2RlbGV0ZXMuYWRkKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25BdHRlbXB0ZWRBZGQocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2F0dGVtcHRlZEFkZHMuYWRkKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25BdHRlbXB0ZWREZWxldGUocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2F0dGVtcHRlZERlbGV0ZXMuYWRkKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmQWRkKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhZGRzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZkRlbGV0ZShydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jZGVsZXRlcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZBdHRlbXB0ZWRBZGQocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2F0dGVtcHRlZEFkZHMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmQXR0ZW1wdGVkRGVsZXRlKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhdHRlbXB0ZWREZWxldGVzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFkZEFsbChpdGVtczogVFtdKSB7XG4gICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuYWRkKGl0ZW0pKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZWxldGVBbGwoaXRlbXM6IFRbXSkge1xuICAgICAgICByZXR1cm4gaXRlbXMubWFwKChpdGVtKSA9PiB0aGlzLmRlbGV0ZShpdGVtKSk7XG4gICAgfVxuXG4gICAgYWRkKGl0ZW06IFQpIHtcbiAgICAgICAgaWYgKHRoaXMuI2xvY2tlZCkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IFsuLi50aGlzLiNhdHRlbXB0ZWRBZGRzXS5tYXAoKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBpdGVtLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHRzLmV2ZXJ5KChvdXQpID0+ICFvdXQpKSByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbLi4udGhpcy4jYWRkc10ubWFwKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCwgaXRlbSwgdGhpcykpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHRzLnNvbWUoKG91dCkgPT4gb3V0ID09PSBmYWxzZSkgPyB0aGlzIDogc3VwZXIuYWRkKGl0ZW0pO1xuICAgIH1cblxuICAgIGRlbGV0ZShpdGVtOiBUKSB7XG4gICAgICAgIGlmICh0aGlzLiNsb2NrZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbLi4udGhpcy4jYXR0ZW1wdGVkRGVsZXRlc10ubWFwKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCwgaXRlbSwgdGhpcykpO1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0cy5ldmVyeSgob3V0KSA9PiAhb3V0KSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFsuLi50aGlzLiNkZWxldGVzXS5tYXAoKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBpdGVtLCB0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHMuc29tZSgob3V0KSA9PiBvdXQgPT09IGZhbHNlKSA/IGZhbHNlIDogc3VwZXIuZGVsZXRlKGl0ZW0pO1xuICAgIH1cblxuICAgIGxvY2soKSB7XG4gICAgICAgIHRoaXMuI2xvY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgdW5sb2NrKCkge1xuICAgICAgICB0aGlzLiNsb2NrZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXQgbG9ja2VkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jbG9ja2VkO1xuICAgIH1cblxuICAgIGNsb25lKHdpdGhMaXN0ZW5lcnM/OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHNldCA9IG5ldyBXYXRjaGVkU2V0KHRoaXMpO1xuXG4gICAgICAgIGlmICh3aXRoTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLiNhZGRzLmZvckVhY2goKHJ1bikgPT4gc2V0Lm9uQWRkKHJ1bikpO1xuICAgICAgICAgICAgdGhpcy4jZGVsZXRlcy5mb3JFYWNoKChydW4pID0+IHNldC5vbkRlbGV0ZShydW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ09VTlRFUl9HRU5FUkFUT1IgfSBmcm9tIFwiLi4vLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgU2VyaWFsaXplZENvbXBvbmVudCxcbiAgICBTZXJpYWxpemVkQ29tcG9uZW50cyxcbiAgICBTZXJpYWxpemVkRGlhZ3JhbSxcbiAgICBTZXJpYWxpemVkSW5wdXQsXG4gICAgU2VyaWFsaXplZE91dHB1dCxcbiAgICBTZXJpYWxpemVkV2lyZSxcbn0gZnJvbSBcIi4uLy4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBmcm9tVmFyaWFibGUsIGlzSW52ZXJzaW9uLCB2YXJpYWJsZUZvciB9IGZyb20gXCIuL3ZhcmlhYmxlc1wiO1xuXG4vLyBuZWVkIHRvIGV4cGxpY2l0bHkgcGFzcyBudW1iZXIgb2YgaW5wdXRzIHNpbmNlIHNpbXBsaWZpZWQgdGFibGUgbWF5IG5vdCBoYXZlIGFsbCBvZiB0aGUgb3JpZ2luYWwgaW5wdXRzXG4vKiogY29udmVydHMgYSBsaXN0IG9mIGV4cHJlc3Npb25zIGludG8gYSBzZXJpYWxpemVkIGRpYWdyYW0gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWlmeShpbnM6IG51bWJlciwgb3V0czogbnVtYmVyLCB0YWJsZTogc3RyaW5nW10pOiBTZXJpYWxpemVkRGlhZ3JhbSB7XG4gICAgY29uc3QgY29tcG9uZW50cyA9IG5ldyBBcnJheTxTZXJpYWxpemVkQ29tcG9uZW50cz4oKTtcbiAgICBjb25zdCB3aXJlcyA9IG5ldyBBcnJheTxTZXJpYWxpemVkV2lyZT4oKTtcblxuICAgIGNvbnN0IGlkID0gQ09VTlRFUl9HRU5FUkFUT1IoKTtcblxuICAgIC8vIGNyZWF0ZSBpbnB1dHNcbiAgICBjb25zdCBpbnB1dHM6IFNlcmlhbGl6ZWRJbnB1dFtdID0gQXJyYXkoaW5zKVxuICAgICAgICAuZmlsbCgwKVxuICAgICAgICAubWFwKChfLCBpKSA9PiAoe1xuICAgICAgICAgICAgcmVpZmllZDogaSxcbiAgICAgICAgICAgIHBlcm1hbmVudDogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBcIklOUFVUXCIsXG4gICAgICAgICAgICBhY3RpdmF0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgaWQ6IGlkLm5leHQoKS52YWx1ZSxcbiAgICAgICAgICAgIHg6IDEwMCxcbiAgICAgICAgICAgIHk6IGkgKiA1MCArIDEwMCxcbiAgICAgICAgfSkpO1xuXG4gICAgLy8gY3JlYXRlIG91dHB1dHNcbiAgICBjb25zdCBvdXRwdXRzOiBTZXJpYWxpemVkT3V0cHV0W10gPSBBcnJheShvdXRzKVxuICAgICAgICAuZmlsbCgwKVxuICAgICAgICAubWFwKChfLCBpKSA9PiAoe1xuICAgICAgICAgICAgcmVpZmllZDogaW5wdXRzLmxlbmd0aCArIGksXG4gICAgICAgICAgICBwZXJtYW5lbnQ6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogXCJPVVRQVVRcIixcbiAgICAgICAgICAgIGFjdGl2YXRlZDogZmFsc2UsXG4gICAgICAgICAgICBpZDogaWQubmV4dCgpLnZhbHVlLFxuICAgICAgICAgICAgeDogNzAwLFxuICAgICAgICAgICAgeTogaSAqIDUwICsgMTAwLFxuICAgICAgICB9KSk7XG5cbiAgICAvLyBzaG91bGQgc3RhcnQgYXQgdGhlIHN1bSBvZiB0aGUgbGVuZ3RocyBvZiB0aGUgaW5wdXRzIGFuZCBvdXRwdXRzXG4gICAgbGV0IHJlaWZpZWQgPSBpbnB1dHMubGVuZ3RoICsgb3V0cHV0cy5sZW5ndGg7XG5cbiAgICAvLyBub3QgZ2F0ZXMgZm9yIG5lZ2F0aW5nIGlucHV0c1xuICAgIGNvbnN0IG5lZ2F0ZWRJbnB1dHM6IChTZXJpYWxpemVkQ29tcG9uZW50IHwgdW5kZWZpbmVkKVtdID0gaW5wdXRzLm1hcCgoXywgaSkgPT4ge1xuICAgICAgICBjb25zdCB2ID0gdmFyaWFibGVGb3IoaSwgdHJ1ZSk7XG5cbiAgICAgICAgLy8gaWYgdGhlIG5lZ2F0ZWQgaW5wdXQgaXMgbmV2ZXIgdXNlZCwgZG9uJ3QgY3JlYXRlIGEgbm90IGdhdGVcbiAgICAgICAgaWYgKCF0YWJsZS5zb21lKChleHByKSA9PiBleHByLmluY2x1ZGVzKHYpKSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVpZmllZDogcmVpZmllZCsrLFxuICAgICAgICAgICAgcGVybWFuZW50OiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCIsXG4gICAgICAgICAgICBuYW1lOiBcIk5PVFwiLFxuICAgICAgICAgICAgaW5wdXRzOiBbeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IGZhbHNlIH1dLFxuICAgICAgICAgICAgb3V0cHV0czogW3sgaWQ6IGlkLm5leHQoKS52YWx1ZSwgYWN0aXZhdGVkOiB0cnVlIH1dLFxuICAgICAgICAgICAgeDogMTUwLFxuICAgICAgICAgICAgeTogaSAqIDUwICsgMTAwICsgNTAsXG4gICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgIGNvbXBsZW1lbnRhcnk6IGZhbHNlLFxuICAgICAgICAgICAgam9pbnM6IDEsXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBjb25uZWN0aW5nIGlucHV0cyB0byBub3QgZ2F0ZXNcbiAgICBpbnB1dHMuZm9yRWFjaCgoeyBpZDogZnJvbSB9LCBpKSA9PiB7XG4gICAgICAgIGlmIChuZWdhdGVkSW5wdXRzW2ldKSB3aXJlcy5wdXNoKHsgZnJvbSwgdG86IG5lZ2F0ZWRJbnB1dHNbaV0hLmlucHV0c1swXS5pZCB9KTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBpbnB1dHMsIG91dHB1dHMsIGFuZCBuZWdhdGVkIGlucHV0cyB0byBjb21wb25lbnRzXG4gICAgY29tcG9uZW50cy5wdXNoKFxuICAgICAgICAuLi5pbnB1dHMsXG4gICAgICAgIC4uLm91dHB1dHMsXG4gICAgICAgIC4uLm5lZ2F0ZWRJbnB1dHMuZmlsdGVyKCh4KTogeCBpcyBTZXJpYWxpemVkQ29tcG9uZW50ID0+IHR5cGVvZiB4ICE9PSBcInVuZGVmaW5lZFwiKSxcbiAgICApO1xuXG4gICAgdGFibGUuZm9yRWFjaCgoZXhwciwgaSkgPT4ge1xuICAgICAgICAvLyBwcm9kdWN0IG9mIHN1bXNcbiAgICAgICAgaWYgKGV4cHIuc3RhcnRzV2l0aChcIihcIikgJiYgZXhwci5lbmRzV2l0aChcIilcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3QgPSBleHByLnNsaWNlKDEsIC0xKS5zcGxpdChcIikoXCIpO1xuXG4gICAgICAgICAgICAvLyBoYW5kbGUgc2luZ2xlIHByb2R1Y3RzXG4gICAgICAgICAgICAvLyBkaXJlY3RseSBjb25uZWN0IG9yIGdhdGUgdG8gb3V0cHV0XG4gICAgICAgICAgICBpZiAocHJvZHVjdC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdW0gPSBwcm9kdWN0WzBdLnNwbGl0KFwiK1wiKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHN1bUdhdGU6IFNlcmlhbGl6ZWRDb21wb25lbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQ6IHJlaWZpZWQrKyxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJDT01QT05FTlRcIixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJPUlwiLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IHN1bS5tYXAoKHYpID0+ICh7IGlkOiBpZC5uZXh0KCkudmFsdWUsIGFjdGl2YXRlZDogaXNJbnZlcnNpb24odikgfSkpLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBbeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IHN1bS5zb21lKCh2KSA9PiBpc0ludmVyc2lvbih2KSkgfV0sXG4gICAgICAgICAgICAgICAgICAgIHg6IDM1MCxcbiAgICAgICAgICAgICAgICAgICAgeTogaSAqIDUwICsgMTAwLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxlbWVudGFyeTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGpvaW5zOiBzdW0ubGVuZ3RoLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBjb25uZWN0IGlucHV0cyB0byB0aGUgb3IgZ2F0ZVxuICAgICAgICAgICAgICAgIHN1bS5mb3JFYWNoKCh2LCBrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ludmVyc2lvbih2KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lyZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogbmVnYXRlZElucHV0c1tmcm9tVmFyaWFibGUodildIS5vdXRwdXRzWzBdLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBzdW1HYXRlLmlucHV0c1trXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lyZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogaW5wdXRzW2Zyb21WYXJpYWJsZSh2KV0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG86IHN1bUdhdGUuaW5wdXRzW2tdLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZCBvciBnYXRlIHRvIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLnB1c2goc3VtR2F0ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25uZWN0IG9yIGdhdGUgdG8gb3V0cHV0XG4gICAgICAgICAgICAgICAgd2lyZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZyb206IHN1bUdhdGUub3V0cHV0c1swXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgdG86IG91dHB1dHNbaV0uaWQsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RHYXRlOiBTZXJpYWxpemVkQ29tcG9uZW50ID0ge1xuICAgICAgICAgICAgICAgIHJlaWZpZWQ6IHJlaWZpZWQrKyxcbiAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJBTkRcIixcbiAgICAgICAgICAgICAgICBpbnB1dHM6IHByb2R1Y3QubWFwKCgpID0+ICh7IGlkOiBpZC5uZXh0KCkudmFsdWUsIGFjdGl2YXRlZDogZmFsc2UgfSkpLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IFt7IGlkOiBpZC5uZXh0KCkudmFsdWUsIGFjdGl2YXRlZDogZmFsc2UgfV0sXG4gICAgICAgICAgICAgICAgeDogNTUwLFxuICAgICAgICAgICAgICAgIHk6IGkgKiA1MCArIDEwMCxcbiAgICAgICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgICAgICBjb21wbGVtZW50YXJ5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBqb2luczogcHJvZHVjdC5sZW5ndGgsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBwcm9kdWN0LmZvckVhY2goKG8sIGopID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdW0gPSBvLnNwbGl0KFwiK1wiKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHN1bUdhdGU6IFNlcmlhbGl6ZWRDb21wb25lbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQ6IHJlaWZpZWQrKyxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJDT01QT05FTlRcIixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJPUlwiLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IHN1bS5tYXAoKHYpID0+ICh7IGlkOiBpZC5uZXh0KCkudmFsdWUsIGFjdGl2YXRlZDogaXNJbnZlcnNpb24odikgfSkpLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBbeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IHN1bS5zb21lKCh2KSA9PiBpc0ludmVyc2lvbih2KSkgfV0sXG4gICAgICAgICAgICAgICAgICAgIHg6IDM1MCxcbiAgICAgICAgICAgICAgICAgICAgeTogaSAqIDUwICsgMTAwICsgKHByb2R1Y3QubGVuZ3RoIC8gMiAtIGopICogNTAsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgICAgICAgICBjb21wbGVtZW50YXJ5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgam9pbnM6IHN1bS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBhbmQgZ2F0ZSBpbnB1dFxuICAgICAgICAgICAgICAgIHByb2R1Y3RHYXRlLmlucHV0c1tqXS5hY3RpdmF0ZWQgPSBzdW1HYXRlLm91dHB1dHNbMF0uYWN0aXZhdGVkO1xuXG4gICAgICAgICAgICAgICAgLy8gY29ubmVjdCBpbnB1dHMgdG8gdGhlIG9yIGdhdGVcbiAgICAgICAgICAgICAgICBzdW0uZm9yRWFjaCgodiwgaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbnZlcnNpb24odikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IG5lZ2F0ZWRJbnB1dHNbZnJvbVZhcmlhYmxlKHYpXSEub3V0cHV0c1swXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogc3VtR2F0ZS5pbnB1dHNba10uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IGlucHV0c1tmcm9tVmFyaWFibGUodildLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBzdW1HYXRlLmlucHV0c1trXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgb3IgZ2F0ZSB0byBjb21wb25lbnRzXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKHN1bUdhdGUpO1xuXG4gICAgICAgICAgICAgICAgLy8gY29ubmVjdCBvciBnYXRlIHRvIGFuZCBnYXRlXG4gICAgICAgICAgICAgICAgd2lyZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZyb206IHN1bUdhdGUub3V0cHV0c1swXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgdG86IHByb2R1Y3RHYXRlLmlucHV0c1tqXS5pZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBhZGQgYW5kIGdhdGUgdG8gY29tcG9uZW50c1xuICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKHByb2R1Y3RHYXRlKTtcblxuICAgICAgICAgICAgLy8gY29ubmVjdCBhbmQgZ2F0ZSB0byBvdXRwdXRcbiAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGZyb206IHByb2R1Y3RHYXRlLm91dHB1dHNbMF0uaWQsXG4gICAgICAgICAgICAgICAgdG86IG91dHB1dHNbaV0uaWQsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3VtIG9mIHByb2R1Y3RzXG4gICAgICAgIGNvbnN0IHN1bSA9IGV4cHIuc3BsaXQoXCIrXCIpO1xuXG4gICAgICAgIC8vIGhhbmRsZSBzaW5nbGUgc3Vtc1xuICAgICAgICAvLyBkaXJlY3RseSBjb25uZWN0IGFuZCBnYXRlIHRvIG91dHB1dFxuICAgICAgICBpZiAoc3VtLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc3QgcHJvZHVjdCA9IHN1bVswXS5zcGxpdCgvKD89XFx3KS8pO1xuXG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0R2F0ZTogU2VyaWFsaXplZENvbXBvbmVudCA9IHtcbiAgICAgICAgICAgICAgICByZWlmaWVkOiByZWlmaWVkKyssXG4gICAgICAgICAgICAgICAgcGVybWFuZW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiQU5EXCIsXG4gICAgICAgICAgICAgICAgaW5wdXRzOiBwcm9kdWN0Lm1hcCgodikgPT4gKHsgaWQ6IGlkLm5leHQoKS52YWx1ZSwgYWN0aXZhdGVkOiBpc0ludmVyc2lvbih2KSB9KSksXG4gICAgICAgICAgICAgICAgb3V0cHV0czogW3sgaWQ6IGlkLm5leHQoKS52YWx1ZSwgYWN0aXZhdGVkOiBwcm9kdWN0LmV2ZXJ5KCh2KSA9PiBpc0ludmVyc2lvbih2KSkgfV0sXG4gICAgICAgICAgICAgICAgeDogMzUwLFxuICAgICAgICAgICAgICAgIHk6IGkgKiA1MCArIDEwMCxcbiAgICAgICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgICAgICBjb21wbGVtZW50YXJ5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBqb2luczogcHJvZHVjdC5sZW5ndGgsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBjb25uZWN0IGlucHV0cyB0byB0aGUgYW5kIGdhdGVcbiAgICAgICAgICAgIHByb2R1Y3QuZm9yRWFjaCgodiwgaykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpc0ludmVyc2lvbih2KSkge1xuICAgICAgICAgICAgICAgICAgICB3aXJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IG5lZ2F0ZWRJbnB1dHNbZnJvbVZhcmlhYmxlKHYpXSEub3V0cHV0c1swXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBwcm9kdWN0R2F0ZS5pbnB1dHNba10uaWQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogaW5wdXRzW2Zyb21WYXJpYWJsZSh2KV0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogcHJvZHVjdEdhdGUuaW5wdXRzW2tdLmlkLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gYWRkIGFuZCBnYXRlIHRvIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChwcm9kdWN0R2F0ZSk7XG5cbiAgICAgICAgICAgIC8vIGNvbm5lY3QgYW5kIGdhdGUgdG8gb3V0cHV0XG4gICAgICAgICAgICB3aXJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBwcm9kdWN0R2F0ZS5vdXRwdXRzWzBdLmlkLFxuICAgICAgICAgICAgICAgIHRvOiBvdXRwdXRzW2ldLmlkLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN1bUdhdGU6IFNlcmlhbGl6ZWRDb21wb25lbnQgPSB7XG4gICAgICAgICAgICByZWlmaWVkOiByZWlmaWVkKyssXG4gICAgICAgICAgICBwZXJtYW5lbnQ6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogXCJDT01QT05FTlRcIixcbiAgICAgICAgICAgIG5hbWU6IFwiT1JcIixcbiAgICAgICAgICAgIGlucHV0czogc3VtLm1hcCgoKSA9PiAoeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IGZhbHNlIH0pKSxcbiAgICAgICAgICAgIG91dHB1dHM6IFt7IGlkOiBpZC5uZXh0KCkudmFsdWUsIGFjdGl2YXRlZDogZmFsc2UgfV0sXG4gICAgICAgICAgICB4OiA1NTAsXG4gICAgICAgICAgICB5OiBpICogNTAgKyAxMDAsXG4gICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgIGNvbXBsZW1lbnRhcnk6IGZhbHNlLFxuICAgICAgICAgICAgam9pbnM6IHN1bS5sZW5ndGgsXG4gICAgICAgIH07XG5cbiAgICAgICAgc3VtLmZvckVhY2goKG8sIGopID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3QgPSBvLnNwbGl0KC8oPz1cXHcpLyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RHYXRlOiBTZXJpYWxpemVkQ29tcG9uZW50ID0ge1xuICAgICAgICAgICAgICAgIHJlaWZpZWQ6IHJlaWZpZWQrKyxcbiAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJBTkRcIixcbiAgICAgICAgICAgICAgICBpbnB1dHM6IHByb2R1Y3QubWFwKCh2KSA9PiAoeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IGlzSW52ZXJzaW9uKHYpIH0pKSxcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiBbeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IHByb2R1Y3QuZXZlcnkoKHYpID0+IGlzSW52ZXJzaW9uKHYpKSB9XSxcbiAgICAgICAgICAgICAgICB4OiAzNTAsXG4gICAgICAgICAgICAgICAgeTogaSAqIDUwICsgMTAwICsgKHByb2R1Y3QubGVuZ3RoIC8gMiAtIGopICogNTAsXG4gICAgICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICAgICAgY29tcGxlbWVudGFyeTogZmFsc2UsXG4gICAgICAgICAgICAgICAgam9pbnM6IHByb2R1Y3QubGVuZ3RoLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIG9yIGdhdGUgaW5wdXRcbiAgICAgICAgICAgIHN1bUdhdGUuaW5wdXRzW2pdLmFjdGl2YXRlZCA9IHByb2R1Y3RHYXRlLm91dHB1dHNbMF0uYWN0aXZhdGVkO1xuXG4gICAgICAgICAgICAvLyBjb25uZWN0IGlucHV0cyB0byB0aGUgYW5kIGdhdGVcbiAgICAgICAgICAgIHByb2R1Y3QuZm9yRWFjaCgodiwgaykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpc0ludmVyc2lvbih2KSkge1xuICAgICAgICAgICAgICAgICAgICB3aXJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IG5lZ2F0ZWRJbnB1dHNbZnJvbVZhcmlhYmxlKHYpXSEub3V0cHV0c1swXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBwcm9kdWN0R2F0ZS5pbnB1dHNba10uaWQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogaW5wdXRzW2Zyb21WYXJpYWJsZSh2KV0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogcHJvZHVjdEdhdGUuaW5wdXRzW2tdLmlkLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gYWRkIGFuZCBnYXRlIHRvIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChwcm9kdWN0R2F0ZSk7XG5cbiAgICAgICAgICAgIC8vIGNvbm5lY3QgYW5kIGdhdGUgdG8gb3IgZ2F0ZVxuICAgICAgICAgICAgd2lyZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgZnJvbTogcHJvZHVjdEdhdGUub3V0cHV0c1swXS5pZCxcbiAgICAgICAgICAgICAgICB0bzogc3VtR2F0ZS5pbnB1dHNbal0uaWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gYWRkIG9yIGdhdGUgdG8gY29tcG9uZW50c1xuICAgICAgICBjb21wb25lbnRzLnB1c2goc3VtR2F0ZSk7XG5cbiAgICAgICAgLy8gY29ubmVjdCBvciBnYXRlIHRvIG91dHB1dFxuICAgICAgICB3aXJlcy5wdXNoKHtcbiAgICAgICAgICAgIGZyb206IHN1bUdhdGUub3V0cHV0c1swXS5pZCxcbiAgICAgICAgICAgIHRvOiBvdXRwdXRzW2ldLmlkLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm47XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgXCJEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZFwiOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgY29tcG9uZW50cyxcbiAgICAgICAgd2lyZXMsXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IGFzc2VydE5ldmVyIH0gZnJvbSBcIi4uLy4uL2NpcmN1bGFyXCI7XG5pbXBvcnQgeyBVTklDT0RFX01BQ1JPTl9ESUFDUklUSUMsIFZBUklBQkxFX05BTUVTLCB2YXJpYWJsZUZvciB9IGZyb20gXCIuL3ZhcmlhYmxlc1wiO1xuXG4vKiogZm9ybWF0cyBhIGxpc3Qgb2YgaW5wdXRzIGFjY29yZGluZyB0byB0aGUgbWV0aG9kIGJlaW5nIHVzZWQgKi9cbmZ1bmN0aW9uIGV4cHJlc3Npb24oaW5wdXQ6IGJvb2xlYW5bXSwgdHlwZTogXCJQUk9EVUNUX09GX1NVTVNcIiB8IFwiU1VNX09GX1BST0RVQ1RTXCIpIHtcbiAgICAvLyBleHByZXNzaW9uIGlzIGEgc3VtLCBqb2luIGJ5ICcrJyBmb3IgXCJhK2IrY1wiXG4gICAgaWYgKHR5cGUgPT09IFwiUFJPRFVDVF9PRl9TVU1TXCIpIHJldHVybiBpbnB1dC5tYXAoKF8sIGkpID0+IHZhcmlhYmxlRm9yKGksIF8pKS5qb2luKFwiK1wiKTtcblxuICAgIC8vIG90aGVyd2lzZSBpdCBpcyBhIHByb2R1Y3QsIGxpa2UgXCJhYmNcIlxuICAgIGlmICh0eXBlID09PSBcIlNVTV9PRl9QUk9EVUNUU1wiKSByZXR1cm4gaW5wdXQubWFwKChfLCBpKSA9PiB2YXJpYWJsZUZvcihpLCAhXykpLmpvaW4oXCJcIik7XG5cbiAgICByZXR1cm4gYXNzZXJ0TmV2ZXIodHlwZSk7XG59XG5cbi8qKiB0dXJucyBhIHRydXRoIHRhYmxlIGludG8gYSBsaXN0IG9mIGV4cHJlc3Npb25zIHRoYXQgcmVwcmVzZW50IGVhY2ggb3V0cHV0ICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5KHRhYmxlOiBib29sZWFuW11bXVtdKSB7XG4gICAgLy8gY2FuJ3Qgc3RyaW5naWZ5IGNvcnJlY3RseSBpZiB0aGVyZSBhcmUgdG9vIG1hbnkgaW5wdXRzXG4gICAgaWYgKHRhYmxlLnNvbWUoKFtpbnB1dHNdKSA9PiBpbnB1dHMubGVuZ3RoID4gVkFSSUFCTEVfTkFNRVMubGVuZ3RoKSlcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYFRhYmxlIGNvbnRhaW5zIG1vcmUgdGhhbiAke1ZBUklBQkxFX05BTUVTLmxlbmd0aH0gaW5wdXRzLmApO1xuXG4gICAgY29uc3Qgb3V0cHV0cyA9IHRhYmxlLm1hcCgoWywgb3V0cHV0c10pID0+IG91dHB1dHMpO1xuICAgIC8vIHRyYW5zcG9zZSBvdXRwdXRzIGZvciBlYXNpZXIgcHJvY2Vzc2luZ1xuICAgIGNvbnN0IHRyYW5zcG9zZWQgPSBvdXRwdXRzWzBdLm1hcCgoXywgY29sKSA9PiBvdXRwdXRzLm1hcCgocm93KSA9PiByb3dbY29sXSkpO1xuXG4gICAgcmV0dXJuIHRyYW5zcG9zZWQubWFwKChvdXQsIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIGFsd2F5cyB0cnVlLCB1c2UgKGErwqxhKVxuICAgICAgICBpZiAob3V0LmV2ZXJ5KEJvb2xlYW4pKSByZXR1cm4gYChhK2Eke1VOSUNPREVfTUFDUk9OX0RJQUNSSVRJQ30pYDtcbiAgICAgICAgLy8gYWx3YXlzIGZhbHNlLCB1c2UgYcKsYVxuICAgICAgICBpZiAoIW91dC5zb21lKEJvb2xlYW4pKSByZXR1cm4gYGFhJHtVTklDT0RFX01BQ1JPTl9ESUFDUklUSUN9YDtcblxuICAgICAgICAvLyBkZXRlcm1pbmUgd2hhdCBtZXRob2QgdG8gdXNlXG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBtb3JlIHRydWVzIHRoYW4gZmFsc2VzLCB1c2UgcHJvZHVjdCBvZiBzdW1zXG4gICAgICAgIC8vIG90aGVyd2lzZSwgdXNlIHN1bSBvZiBwcm9kdWN0c1xuICAgICAgICAvLyB0aGlzIG1ha2VzIGl0IHNvIHRoYXQgdGhlcmUgYXJlIGxlc3Mgb3V0cHV0cyB0byBnZW5lcmF0ZSBleHByZXNzaW9ucyBmb3JcbiAgICAgICAgY29uc3QgdHlwZSA9IG91dC5maWx0ZXIoQm9vbGVhbikubGVuZ3RoID4gb3V0Lmxlbmd0aCAvIDIgPyBcIlBST0RVQ1RfT0ZfU1VNU1wiIDogXCJTVU1fT0ZfUFJPRFVDVFNcIjtcblxuICAgICAgICAvLyBmaWx0ZXIgZm9yIGZhbHNlIG91dHB1dHNcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiUFJPRFVDVF9PRl9TVU1TXCIpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgXCIoXCIgK1xuICAgICAgICAgICAgICAgIHRhYmxlXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKFssIG91dHB1dHNdKSA9PiBvdXRwdXRzW2luZGV4XSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKFtpbnB1dHNdKSA9PiBleHByZXNzaW9uKGlucHV0cywgdHlwZSkpXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKFwiKShcIikgK1xuICAgICAgICAgICAgICAgIFwiKVwiXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmlsdGVyIGZvciB0cnVlIG91dHB1dHNcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiU1VNX09GX1BST0RVQ1RTXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKFssIG91dHB1dHNdKSA9PiBvdXRwdXRzW2luZGV4XSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAubWFwKChbaW5wdXRzXSkgPT4gZXhwcmVzc2lvbihpbnB1dHMsIHR5cGUpKVxuICAgICAgICAgICAgICAgIC5qb2luKFwiK1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3NlcnROZXZlcih0eXBlKTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IGZyb21WYXJpYWJsZSwgaXNJbnZlcnNpb24gfSBmcm9tIFwiLi92YXJpYWJsZXNcIjtcblxuLy8gQXJyYXkucHJvdG90eXBlLnNvbWUgcmVwcmVzZW50cyBhbiBvciBnYXRlXG4vLyBBcnJheS5wcm90b3R5cGUuZXZlcnkgcmVwcmVzZW50cyBhbiBhbmQgZ2F0ZVxuLy8gdGh1cywgYSBwcm9kdWN0IG9mIHN1bXMgaXMgcmVhbGx5IC5zb21lIGZvbGxvd2VkIGJ5IC5ldmVyeVxuLy8gYW5kIGEgc3VtIG9mIHByb2R1Y3RzIGlzIHJlYWxseSBhIC5ldmVyeSBmb2xsb3dlZCBieSAuc29tZVxuLyoqIGV2YWx1YXRlcyBhIGxpc3Qgb2YgZXhwcmVzc2lvbnMgd2l0aCB0aGUgZ2l2ZW4gaW5wdXRzICovXG5leHBvcnQgZnVuY3Rpb24gc3Vic3RpdHV0ZShleHByczogc3RyaW5nW10sIHVzaW5nOiBib29sZWFuW10pIHtcbiAgICByZXR1cm4gZXhwcnMubWFwKChleHByKSA9PiB7XG4gICAgICAgIC8vIHByb2R1Y3Qgb2Ygc3Vtc1xuICAgICAgICBpZiAoZXhwci5zdGFydHNXaXRoKFwiKFwiKSAmJiBleHByLmVuZHNXaXRoKFwiKVwiKSkge1xuICAgICAgICAgICAgLy8gbmVlZCB0byBnZXQgZWFjaCBzdW1cbiAgICAgICAgICAgIHJldHVybiBleHByXG4gICAgICAgICAgICAgICAgLnNsaWNlKDEsIC0xKVxuICAgICAgICAgICAgICAgIC5zcGxpdChcIikoXCIpXG4gICAgICAgICAgICAgICAgLm1hcCgobykgPT5cbiAgICAgICAgICAgICAgICAgICAgb1xuICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiK1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgodikgPT4gKGlzSW52ZXJzaW9uKHYpID8gIXVzaW5nW2Zyb21WYXJpYWJsZSh2KV0gOiB1c2luZ1tmcm9tVmFyaWFibGUodildKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zb21lKEJvb2xlYW4pLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuZXZlcnkoQm9vbGVhbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdW0gb2YgcHJvZHVjdHNcbiAgICAgICAgLy8gc3BsaXR0aW5nIGJ5IGxvb2thaGVhZCByZWdleCBiZWNhdXNlIG9mIG1hY3JvIGRpYWNyaXRpYyBhbmQgcHJpbWVzIG9yIGRvdWJsZSBwcmltZXNcbiAgICAgICAgcmV0dXJuIGV4cHJcbiAgICAgICAgICAgIC5zcGxpdChcIitcIilcbiAgICAgICAgICAgIC5tYXAoKG8pID0+XG4gICAgICAgICAgICAgICAgb1xuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoLyg/PVxcdykvKVxuICAgICAgICAgICAgICAgICAgICAubWFwKCh2KSA9PiAoaXNJbnZlcnNpb24odikgPyAhdXNpbmdbZnJvbVZhcmlhYmxlKHYpXSA6IHVzaW5nW2Zyb21WYXJpYWJsZSh2KV0pKVxuICAgICAgICAgICAgICAgICAgICAuZXZlcnkoQm9vbGVhbiksXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc29tZShCb29sZWFuKTtcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBjb25zdCBBTFBIQUJFVCA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbi8vIHJlcGVhdHMgMyB0aW1lcyB0byBhZGQgcHJpbWVzIGFuZCBkb3VibGUgcHJpbWVzXG5leHBvcnQgY29uc3QgVkFSSUFCTEVfTkFNRVMgPSBBTFBIQUJFVC5yZXBlYXQoMylcbiAgICAuc3BsaXQoXCJcIilcbiAgICAubWFwKChjLCBpKSA9PiBgJHtjfSR7W1wiXCIsIFwiyrlcIiwgXCLKulwiXVtNYXRoLmZsb29yKGkgLyBBTFBIQUJFVC5sZW5ndGgpXX1gKTtcbi8qKiB1c2VkIHRvIG5lZ2F0ZSBzb21ldGhpbmcsIFwiYcyEXCIgKi9cbmV4cG9ydCBjb25zdCBVTklDT0RFX01BQ1JPTl9ESUFDUklUSUMgPSBcIlxcdTAzMDRcIjtcblxuLyoqIGNvbnZlcnRzIGluZGV4IG9mIGlucHV0IGludG8gdmFyaWFibGUgbmFtZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhcmlhYmxlRm9yKGk6IG51bWJlciwgaW52ZXJ0OiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGludmVydCA/IFZBUklBQkxFX05BTUVTW2ldLnJlcGxhY2UoL14oXFx3KS8sIFwiJDFcIiArIFVOSUNPREVfTUFDUk9OX0RJQUNSSVRJQykgOiBWQVJJQUJMRV9OQU1FU1tpXTtcbn1cblxuLyoqIGNvbnZlcnRzIHZhcmlhYmxlIG5hbWUgaW50byBpbmRleCBvZiBpbnB1dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21WYXJpYWJsZSh2OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gVkFSSUFCTEVfTkFNRVMuaW5kZXhPZih2LnJlcGxhY2UoVU5JQ09ERV9NQUNST05fRElBQ1JJVElDLCBcIlwiKSk7XG59XG5cbi8qKiBjaGFuZ2VzIGEgdmFyaWFibGUgaW50byBpdHMgaW52ZXJ0ZWQgdmVyc2lvbiAoZG9lcyBub3QgdG9nZ2xlKSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVydFZhcmlhYmxlKHY6IHN0cmluZykge1xuICAgIHJldHVybiB2LnJlcGxhY2UoL14oXFx3KS8sIFwiJDFcIiArIFVOSUNPREVfTUFDUk9OX0RJQUNSSVRJQyk7XG59XG5cbi8qKiBjaGVja3MgaWYgdGhlIHZhcmlhYmxlIGlzIGFuIGludmVydGVkIHZlcnNpb24gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ludmVyc2lvbih2OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdi5pbmNsdWRlcyhVTklDT0RFX01BQ1JPTl9ESUFDUklUSUMpO1xufVxuIiwiaW1wb3J0IHsgcmVpZnkgfSBmcm9tIFwiLi9hbGdlYnJhL3JlaWZ5XCI7XG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tIFwiLi9hbGdlYnJhL3N0cmluZ2lmeVwiO1xuaW1wb3J0IHsgc3Vic3RpdHV0ZSB9IGZyb20gXCIuL2FsZ2VicmEvc3Vic3RpdHV0ZVwiO1xuXG50cnkge1xuICAgIC8vIHdhaXQgZm9yIGJvc3MgdG8gZ2l2ZSB1cyB0aGUgdGFibGVcbiAgICBjb25zdCB0YWJsZSA9IGF3YWl0IG5ldyBQcm9taXNlPGJvb2xlYW5bXVtdW10+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgc2VsZi5vbm1lc3NhZ2UgPSAoZSkgPT4gcmVzb2x2ZShlLmRhdGEpO1xuXG4gICAgICAgIHNlbGYub25lcnJvciA9IChlKSA9PiByZWplY3QoZSk7XG4gICAgfSk7XG5cbiAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgY29kZTogXCJNRVNTQUdFXCIsXG4gICAgICAgIG1lc3NhZ2U6IFwiUmVjZWl2ZWQ6XFxuXCIgKyB0YWJsZS5tYXAoKHJvdykgPT4gcm93Lm1hcCgoY29sKSA9PiBjb2wubWFwKE51bWJlcikuam9pbihcIiBcIikpLmpvaW4oXCIgfCBcIikpLmpvaW4oXCJcXG5cIiksXG4gICAgfSk7XG5cbiAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgY29kZTogXCJNRVNTQUdFXCIsXG4gICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICBcIkV4cHJlc3Npb25zOlxcblwiICtcbiAgICAgICAgICAgIHN0cmluZ2lmeSh0YWJsZSlcbiAgICAgICAgICAgICAgICAubWFwKChyb3csIGkpID0+IGBvdXRwdXQgJHtpICsgMX06ICR7cm93fWApXG4gICAgICAgICAgICAgICAgLmpvaW4oXCJcXG5cIiksXG4gICAgfSk7XG5cbiAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgY29kZTogXCJNRVNTQUdFXCIsXG4gICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICBcIlRlc3RzOlxcblwiICtcbiAgICAgICAgICAgIHRhYmxlXG4gICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgKFtpbnB1dF0pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBgaW5wdXQgJHtpbnB1dC5tYXAoTnVtYmVyKS5qb2luKFwiIFwiKX06IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic3RpdHV0ZShzdHJpbmdpZnkodGFibGUpLCBpbnB1dCkubWFwKE51bWJlcikuam9pbihcIiBcIiksXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2VuZXJhdGVkID0gcmVpZnkodGFibGVbMF1bMF0ubGVuZ3RoLCB0YWJsZVswXVsxXS5sZW5ndGgsIHN0cmluZ2lmeSh0YWJsZSkpO1xuXG4gICAgY29uc3QgbGluayA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cbiAgICBsaW5rLnBhdGhuYW1lID0gXCJcIjtcblxuICAgIGxpbmsuc2VhcmNoID0gXCI/aW5saW5lPVwiICsgYnRvYShKU09OLnN0cmluZ2lmeShnZW5lcmF0ZWQpKTtcblxuICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xuICAgICAgICBjb2RlOiBcIk1FU1NBR0VcIixcbiAgICAgICAgbWVzc2FnZTogXCJMaW5rOlxcblwiICsgbGluay5ocmVmLFxuICAgIH0pO1xuXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvZGU6IFwiRklOSVNIRURcIixcbiAgICAgICAgbWVzc2FnZTogXCJHZW5lcmF0ZWQ6XFxuXCIgKyBKU09OLnN0cmluZ2lmeShnZW5lcmF0ZWQsIHVuZGVmaW5lZCwgNCksXG4gICAgfSk7XG59IGNhdGNoIChlKSB7XG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7IGNvZGU6IFwiRVJST1JcIiwgZXJyb3I6IGUgfSk7XG59XG5cbmV4cG9ydCB7fTtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuXG4vKiogYXNrcyB1c2VyIHRvIGlucHV0IGEgZmlsZSAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbGVJbnB1dCgpIHtcbiAgICBjb25zdCBpbnB1dCA9IE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLCB7IHR5cGU6IFwiZmlsZVwiIH0pO1xuXG4gICAgaW5wdXQuY2xpY2soKTtcblxuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBuZXcgUHJvbWlzZTxGaWxlIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICBpbnB1dC5vbmNoYW5nZSA9ICgpID0+IHJlc29sdmUoaW5wdXQuZmlsZXM/LlswXSA/PyB1bmRlZmluZWQpO1xuXG4gICAgICAgIGlucHV0Lm9uZXJyb3IgPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpZiAoIWZpbGUpXG4gICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgbWVzc2FnZTogXCJObyBmaWxlIHdhcyBwcm92aWRlZC5cIixcbiAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICB9KTtcblxuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblxuICAgIGNvbnN0IHJhdyA9IGF3YWl0IG5ldyBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHJlc29sdmUocmVhZGVyLnJlc3VsdD8udG9TdHJpbmcoKSA/PyB1bmRlZmluZWQpO1xuXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaWYgKCFyYXcpXG4gICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gcmVhZCB0aGUgZmlsZS5cIixcbiAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICB9KTtcblxuICAgIHJldHVybiByYXc7XG59XG5cbi8qKiBkb3dubG9hZHMgdGhlIGNvbnRlbnRzIGFzIGEgZmlsZSAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkRmlsZShjb250ZW50czogQmxvYlBhcnRbXSkge1xuICAgIE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIiksIHtcbiAgICAgICAgaHJlZjogVVJMLmNyZWF0ZU9iamVjdFVSTChcbiAgICAgICAgICAgIG5ldyBCbG9iKGNvbnRlbnRzLCB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0L3BsYWluXCIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICAgZG93bmxvYWQ6IFwidGFibGUuZ2F0ZXNpbS50eHRcIixcbiAgICB9KS5jbGljaygpO1xufVxuIiwiLy8gdGhpcyBmaWxlIG9ubHkgZXhpc3RzIHRvIGJyZWFrIGNpcmN1bGFyIGRlcGVuZGVuY2llc1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgICAgIHVzZXJBZ2VudERhdGE/OiB7IHBsYXRmb3JtOiBzdHJpbmcgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBJU19NQUNfT1MgPVxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgPyBbbmF2aWdhdG9yLnVzZXJBZ2VudERhdGE/LnBsYXRmb3JtLCBuYXZpZ2F0b3IucGxhdGZvcm1dLnNvbWUoXG4gICAgICAgICAgICAgIChwbGF0Zm9ybSkgPT4gcGxhdGZvcm0/LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoXCJtYWNcIikgPz8gZmFsc2UsXG4gICAgICAgICAgKVxuICAgICAgICA6IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0TmV2ZXIoKTogbmV2ZXI7XG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0TmV2ZXIodjogbmV2ZXIpOiBuZXZlcjtcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROZXZlciguLi5hcmdzOiBbXSB8IFt2OiBuZXZlcl0pIHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoKTtcblxuICAgIHJldHVybiBhcmdzWzBdO1xufVxuIiwiaW1wb3J0IHsgRGFya21vZGVNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvRGFya21vZGVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcblxuZXhwb3J0IGNvbnN0IElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSA9IDI0O1xuZXhwb3J0IGNvbnN0IE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgPSAyNDtcbmV4cG9ydCBjb25zdCBDSElQX0NPTVBPTkVOVF9DU1NfV0lEVEggPSAxMjA7XG5leHBvcnQgY29uc3QgQ0hJUF9DT01QT05FTlRfQ1NTX0hFSUdIVCA9IDQwO1xuZXhwb3J0IGNvbnN0IENISVBfSU5QVVRfQ1NTX1NJWkUgPSAxNjtcbmV4cG9ydCBjb25zdCBDSElQX09VVFBVVF9DU1NfU0laRSA9IDE2O1xuZXhwb3J0IGNvbnN0IE9SSUdJTl9QT0lOVCA9IE9iamVjdC5mcmVlemUoeyB4OiAwLCB5OiAwIH0pO1xuZXhwb3J0IGNvbnN0IElOX0RFQlVHX01PREUgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcy5oYXMoXCJkZWJ1Z1wiKTtcbmV4cG9ydCBjb25zdCBOT19SRU5ERVJJTkcgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcy5oYXMoXCJub3JlbmRlclwiKTtcblxuZXhwb3J0IGNvbnN0IExPQ0tFRF9GT1JfVEVTVElORyA9ICgpID0+IE1vZGFsTWFuYWdlci5hbGVydChcIlRoZSBkaWFncmFtIGlzIGN1cnJlbnRseSBsb2NrZWQuIE5vIGNoYW5nZXMgY2FuIGJlIG1hZGUuXCIpO1xuXG5leHBvcnQgY29uc3QgREVMQVkgPSAoZGVsYXkgPSAwKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuXG5leHBvcnQgY29uc3QgR0VUX0JBQ0tHUk9VTkRfQ0FOVkFTX0NUWCA9ICgpID0+XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXCJjYW52YXMuYmFja2dyb3VuZC1jYW52YXNcIikhLmdldENvbnRleHQoXCIyZFwiKSE7XG5cbmV4cG9ydCBjb25zdCBHRVRfRk9SRUdST1VORF9DQU5WQVNfQ1RYID0gKCkgPT5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcy5mb3JlZ3JvdW5kLWNhbnZhc1wiKSEuZ2V0Q29udGV4dChcIjJkXCIpITtcblxuZXhwb3J0IGNvbnN0IENPVU5URVJfR0VORVJBVE9SID0gZnVuY3Rpb24qIChpID0gMCkge1xuICAgIHdoaWxlICh0cnVlKSB5aWVsZCBpKys7XG59O1xuXG5leHBvcnQgY29uc3QgU0NVRkZFRF9VVUlEID0gKCkgPT5cbiAgICBEYXRlLm5vdygpLnRvU3RyaW5nKDM2KSArIE51bWJlcihEYXRlLm5vdygpLnRvU3RyaW5nKCkuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIikpLnRvU3RyaW5nKDM2KTtcblxuZXhwb3J0IGNvbnN0IFJPVU5EX1RPX05FQVJFU1QgPSAoeDogbnVtYmVyLCBuOiBudW1iZXIpID0+IE1hdGgucm91bmQoeCAvIG4pICogbjtcblxuZXhwb3J0IGNvbnN0IEdFVF9BQ1RJVkFURURfQ09MT1IgPSAoKSA9PlxuICAgIERhcmttb2RlTWFuYWdlci5kYXJrbW9kZUVuYWJsZWQgPyBEQVJLX0FDVElWQVRFRF9DU1NfQ09MT1IgOiBBQ1RJVkFURURfQ1NTX0NPTE9SO1xuZXhwb3J0IGNvbnN0IEdFVF9HUkFZX0NPTE9SID0gKCkgPT5cbiAgICBEYXJrbW9kZU1hbmFnZXIuZGFya21vZGVFbmFibGVkID8gT05MWV9BX0hJTlRfT0ZfREFSS19HUkFZX0NTU19DT0xPUiA6IExJR0hUX0dSQVlfQ1NTX0NPTE9SO1xuXG5leHBvcnQgY29uc3QgR0VUX0JJTl9QRVJNUyA9IChuOiBudW1iZXIpID0+XG4gICAgQXJyYXkuZnJvbSh7IGxlbmd0aDogTWF0aC5wb3coMiwgbikgfSwgKF8sIHkpID0+IEFycmF5LmZyb20oeyBsZW5ndGg6IG4gfSwgKF8sIHgpID0+ICEhKCh5ID4+IHgpICYgMSkpKTtcblxuZXhwb3J0IGNvbnN0IEFDVElWQVRFRF9DU1NfQ09MT1IgPSBcIiNmZjI2MjZcIjtcbmV4cG9ydCBjb25zdCBEQVJLX0FDVElWQVRFRF9DU1NfQ09MT1IgPSBcIiNkZDExMTFcIjtcbmV4cG9ydCBjb25zdCBFVkVOX0RBUktFUl9HUkFZX0NTU19DT0xPUiA9IFwiIzBhMGEwY1wiO1xuZXhwb3J0IGNvbnN0IFNMSUdIVExZX0RBUktFUl9HUkFZX0NTU19DT0xPUiA9IFwiIzEwMTAxMlwiO1xuZXhwb3J0IGNvbnN0IERBUktFUl9HUkFZX0NTU19DT0xPUiA9IFwiIzE2MTYxZlwiO1xuZXhwb3J0IGNvbnN0IERBUktfR1JBWV9DU1NfQ09MT1IgPSBcIiMxYzFjMjRcIjtcbmV4cG9ydCBjb25zdCBLSU5EQV9EQVJLX0dSQVlfQ1NTX0NPTE9SID0gXCIjMjQyNDJlXCI7XG5leHBvcnQgY29uc3QgTk9UX1JFQUxMWV9EQVJLX0dSQVlfQ1NTX0NPTE9SID0gXCIjMmUyZTNmXCI7XG5leHBvcnQgY29uc3QgT05MWV9BX0hJTlRfT0ZfREFSS19HUkFZX0NTU19DT0xPUiA9IFwiIzNjM2M0ZlwiO1xuZXhwb3J0IGNvbnN0IE1JRF9HUkFZX0NTU19DT0xPUiA9IFwiIzQwNDA0ZlwiO1xuZXhwb3J0IGNvbnN0IFNVUEVSX0dSQVlfQ1NTX0NPTE9SID0gXCIjYmJiYmJiXCI7XG5leHBvcnQgY29uc3QgS0lOREFfTElHSFRfR1JBWV9DU1NfQ09MT1IgPSBcIiNjZGNkY2RcIjtcbmV4cG9ydCBjb25zdCBMSUdIVF9HUkFZX0NTU19DT0xPUiA9IFwiI2RlZGVkZVwiO1xuZXhwb3J0IGNvbnN0IExJR0hURVJfR1JBWV9DU1NfQ09MT1IgPSBcIiNlYWVhZWFcIjtcbmV4cG9ydCBjb25zdCBFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1IgPSBcIiNlZmVmZWZcIjtcbmV4cG9ydCBjb25zdCBUT0FTVF9EVVJBVElPTiA9IDI1MDA7XG5leHBvcnQgY29uc3QgR1JJRF9TSVpFID0gMTU7XG5leHBvcnQgY29uc3QgUVVJQ0tQSUNLX1NJWkUgPSA3NTtcblxuZXhwb3J0IGNvbnN0IEFQUF9OQU1FID0gKG5ldyBVUkwobG9jYXRpb24uaHJlZikuc2VhcmNoUGFyYW1zLmdldChcImFwcFwiKSA/PyBcInNpbVwiKS50b0xvd2VyQ2FzZSgpO1xuIiwiaW1wb3J0IHsgTE9DS0VEX0ZPUl9URVNUSU5HLCBPUklHSU5fUE9JTlQgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgdHlwZSB7IE1lbnVNYW5hZ2VyQWN0aW9uIH0gZnJvbSBcIi4uL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSBcIi4uL3JlaWZpZWQvRGlzcGxheVwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFNldmVuU2VnbWVudERpc3BsYXkgfSBmcm9tIFwiLi4vcmVpZmllZC9TZXZlblNlZ21lbnREaXNwbGF5XCI7XG5pbXBvcnQgeyBjaGlwcyB9IGZyb20gXCIuLi9yZWlmaWVkL2NoaXBzXCI7XG5cbmV4cG9ydCBjb25zdCBjb21wb25lbnROYW1lTWFwID0gbmV3IE1hcDxzdHJpbmcsICgpID0+IFJlaWZpZWQ+KFtcbiAgICBbXCJESVNQTEFZXCIsICgpID0+IG5ldyBEaXNwbGF5KCldLFxuICAgIFtcIjdTRUdcIiwgKCkgPT4gbmV3IFNldmVuU2VnbWVudERpc3BsYXkoKV0sXG4gICAgW1wiN1NEXCIsICgpID0+IG5ldyBTZXZlblNlZ21lbnREaXNwbGF5KCldLFxuICAgIFtcIlNFVkVOX1NFR1wiLCAoKSA9PiBuZXcgU2V2ZW5TZWdtZW50RGlzcGxheSgpXSxcbiAgICBbXCJTRVZFTl9TRUdNRU5UX0RJU1BMQVlcIiwgKCkgPT4gbmV3IFNldmVuU2VnbWVudERpc3BsYXkoKV0sXG5dKTtcblxuZXhwb3J0IGNvbnN0IGluc2VydCA9IHtcbiAgICBcImluc2VydC1jb21wb25lbnRcIjoge1xuICAgICAgICBsYWJlbDogXCJJbnNlcnQgY29tcG9uZW50XCIsXG4gICAgICAgIGtleWJpbmQ6IFwiQVwiLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKGUsIG4/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB0eXBlb2YgbiA9PT0gXCJzdHJpbmdcIiA/IG4gOiBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiRW50ZXIgdGhlIGNvbXBvbmVudCdzIG5hbWU6XCIpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIgfHwgIW5hbWUudHJpbSgpKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGNoaXAgPSBjaGlwcy5nZXQobmFtZS50b1VwcGVyQ2FzZSgpKTtcblxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50TmFtZSA9IG5hbWUudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY2hpcFxuICAgICAgICAgICAgICAgID8gbmV3IENvbXBvbmVudChSZWZsZWN0LmNvbnN0cnVjdChjaGlwLCBbXSksIE9SSUdJTl9QT0lOVClcbiAgICAgICAgICAgICAgICA6IGNvbXBvbmVudE5hbWVNYXAuZ2V0KGNvbXBvbmVudE5hbWUpPy4oKTtcblxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQpIHJldHVybiBNb2RhbE1hbmFnZXIuYWxlcnQoXCJObyBjb21wb25lbnQgd2FzIGZvdW5kIHdpdGggdGhhdCBuYW1lLlwiKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhjb21wb25lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShjb21wb25lbnQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBwYXJzZUZsb2F0KHdpZHRoKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZS5jbGllbnRZIC0gcGFyc2VGbG9hdChoZWlnaHQpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgIH0sXG59IHNhdGlzZmllcyBNZW51TWFuYWdlckFjdGlvbjtcbiIsImltcG9ydCB7IElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSwgTE9DS0VEX0ZPUl9URVNUSU5HLCBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHR5cGUgeyBNZW51TWFuYWdlckFjdGlvbiB9IGZyb20gXCIuLi9tYW5hZ2Vycy9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNvbnN0IGlvID0ge1xuICAgIFwibmV3LWlucHV0XCI6IHtcbiAgICAgICAgbGFiZWw6IFwiTmV3IGlucHV0XCIsXG4gICAgICAgIGtleWJpbmQ6IFwiSVwiLFxuICAgICAgICBjYWxsYmFjazogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gbmV3IElucHV0KHtcbiAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGlucHV0KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKGlucHV0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBcIm5ldy1vdXRwdXRcIjoge1xuICAgICAgICBsYWJlbDogXCJOZXcgb3V0cHV0XCIsXG4gICAgICAgIGtleWJpbmQ6IFwiT1wiLFxuICAgICAgICBjYWxsYmFjazogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG91dHB1dCA9IG5ldyBPdXRwdXQoe1xuICAgICAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMob3V0cHV0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChvdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgIH0sXG59IHNhdGlzZmllcyBNZW51TWFuYWdlckFjdGlvbjtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIENPVU5URVJfR0VORVJBVE9SLCBJTl9ERUJVR19NT0RFLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZyB9IGZyb20gXCIuL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSBcIi4vcmVpZmllZC9EaXNwbGF5XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuL3JlaWZpZWQvT3V0cHV0XCI7XG5pbXBvcnQgdHlwZSB7IFJlaWZpZWQgfSBmcm9tIFwiLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFNldmVuU2VnbWVudERpc3BsYXkgfSBmcm9tIFwiLi9yZWlmaWVkL1NldmVuU2VnbWVudERpc3BsYXlcIjtcbmltcG9ydCB7IGNoaXBzIH0gZnJvbSBcIi4vcmVpZmllZC9jaGlwc1wiO1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkQ29tcG9uZW50cyA9IFNlcmlhbGl6ZWREaWFncmFtW1wiY29tcG9uZW50c1wiXVtudW1iZXJdO1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkSW5wdXQgPSBFeHRyYWN0PFNlcmlhbGl6ZWRDb21wb25lbnRzLCB7IHR5cGU6IFwiSU5QVVRcIiB9PjtcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZE91dHB1dCA9IEV4dHJhY3Q8U2VyaWFsaXplZENvbXBvbmVudHMsIHsgdHlwZTogXCJPVVRQVVRcIiB9PjtcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZENvbXBvbmVudCA9IEV4dHJhY3Q8U2VyaWFsaXplZENvbXBvbmVudHMsIHsgdHlwZTogXCJDT01QT05FTlRcIiB9PjtcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZERpc3BsYXkgPSBFeHRyYWN0PFNlcmlhbGl6ZWRDb21wb25lbnRzLCB7IHR5cGU6IFwiRElTUExBWVwiIH0+O1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkV2lyZXMgPSBTZXJpYWxpemVkRGlhZ3JhbVtcIndpcmVzXCJdO1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkV2lyZSA9IFNlcmlhbGl6ZWRXaXJlc1tudW1iZXJdO1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkRGlhZ3JhbSA9IHtcbiAgICBzZXR0aW5nczoge1xuICAgICAgICBbXCJEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZFwiXTogYm9vbGVhbjtcbiAgICB9O1xuICAgIGNvbXBvbmVudHM6IChcbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgcGVybWFuZW50OiBib29sZWFuO1xuICAgICAgICAgICAgICB0eXBlOiBcIklOUFVUXCI7XG4gICAgICAgICAgICAgIGFjdGl2YXRlZDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgaWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiT1VUUFVUXCI7XG4gICAgICAgICAgICAgIGFjdGl2YXRlZDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgaWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCI7XG4gICAgICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICAgICAgaW5wdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIG91dHB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XG4gICAgICAgICAgICAgIGNvbXBsZW1lbnRhcnk6IGJvb2xlYW47XG4gICAgICAgICAgICAgIGpvaW5zOiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiRElTUExBWVwiO1xuICAgICAgICAgICAgICBpbnB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgb3V0cHV0czogeyBpZDogbnVtYmVyOyBhY3RpdmF0ZWQ6IGJvb2xlYW4gfVtdO1xuICAgICAgICAgICAgICByYWRpeDogbnVtYmVyO1xuICAgICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAgIHk6IG51bWJlcjtcbiAgICAgICAgICAgICAgYW5nbGU6IG51bWJlcjtcbiAgICAgICAgICB9XG4gICAgICAgIHwge1xuICAgICAgICAgICAgICByZWlmaWVkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHBlcm1hbmVudDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgdHlwZTogXCJTRVZFTl9TRUdNRU5UX0RJU1BMQVlcIjtcbiAgICAgICAgICAgICAgaW5wdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIG91dHB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgIClbXTtcbiAgICB3aXJlczogeyBmcm9tOiBudW1iZXI7IHRvOiBudW1iZXIgfVtdO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEaWFncmFtKGNvbXBvbmVudHM6IFJlaWZpZWRbXSwgd2lyZXM6IFdpcmluZ1tdKSB7XG4gICAgY29uc3QgaWQgPSBDT1VOVEVSX0dFTkVSQVRPUigpO1xuXG4gICAgY29uc3QgaWRzID0gbmV3IE1hcDxFbGVtZW50LCBudW1iZXI+KCk7XG5cbiAgICBjb25zdCBkYXRhOiBTZXJpYWxpemVkRGlhZ3JhbSA9IHtcbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIFtcIkRyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkXCJdOiBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCxcbiAgICAgICAgfSxcbiAgICAgICAgY29tcG9uZW50czogY29tcG9uZW50cy5tYXAoKGNvbXBvbmVudCwgcmVpZmllZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KSB7XG4gICAgICAgICAgICAgICAgaWRzLnNldChjb21wb25lbnQuZWxlbWVudCwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIklOUFVUXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2YXRlZDogY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpLFxuICAgICAgICAgICAgICAgICAgICBpZDogaWRzLmdldChjb21wb25lbnQuZWxlbWVudCkhLFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgIGlkcy5zZXQoY29tcG9uZW50LmVsZW1lbnQsIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpZmllZCxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBjb21wb25lbnQucGVybWFuZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJPVVRQVVRcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVkOiBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZHMuZ2V0KGNvbXBvbmVudC5lbGVtZW50KSEsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpZmllZCxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBjb21wb25lbnQucGVybWFuZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJDT01QT05FTlRcIixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogY29tcG9uZW50LmNoaXAubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBjb21wb25lbnQuaW5wdXRzLm1hcCgoaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChpLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQoaSkhLCBhY3RpdmF0ZWQ6IGkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBjb21wb25lbnQub3V0cHV0cy5tYXAoKG8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5zZXQobywgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGlkOiBpZHMuZ2V0KG8pISwgYWN0aXZhdGVkOiBvLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSB9O1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogY29tcG9uZW50LmFuZ2xlLFxuICAgICAgICAgICAgICAgICAgICBjb21wbGVtZW50YXJ5OiBjb21wb25lbnQuY29tcGxlbWVudGFyeSxcbiAgICAgICAgICAgICAgICAgICAgam9pbnM6IGNvbXBvbmVudC5qb2lucyxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQsXG4gICAgICAgICAgICAgICAgICAgIHBlcm1hbmVudDogY29tcG9uZW50LnBlcm1hbmVuY2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiRElTUExBWVwiLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IGNvbXBvbmVudC5pbnB1dHMubWFwKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KGksIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChpKSEsIGFjdGl2YXRlZDogaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IGNvbXBvbmVudC5vdXRwdXRzLm1hcCgobykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChvLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQobykhLCBhY3RpdmF0ZWQ6IG8uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICByYWRpeDogY29tcG9uZW50LnJhZGl4LFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBjb21wb25lbnQuYW5nbGUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIFNldmVuU2VnbWVudERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNFVkVOX1NFR01FTlRfRElTUExBWVwiLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IGNvbXBvbmVudC5pbnB1dHMubWFwKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KGksIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChpKSEsIGFjdGl2YXRlZDogaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IGNvbXBvbmVudC5vdXRwdXRzLm1hcCgobykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChvLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQobykhLCBhY3RpdmF0ZWQ6IG8uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBjb21wb25lbnQuYW5nbGUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byBzZXJpYWxpemUgZGlhZ3JhbS5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBSZWlmaWVkIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgfSksXG4gICAgICAgIHdpcmVzOiB3aXJlc1xuICAgICAgICAgICAgLmZpbHRlcigod2lyZSkgPT4gIXdpcmUuZGVzdHJveWVkKVxuICAgICAgICAgICAgLm1hcCgod2lyZSkgPT4gKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBpZHMuZ2V0KHdpcmUuZnJvbSkhLFxuICAgICAgICAgICAgICAgIHRvOiBpZHMuZ2V0KHdpcmUudG8pISxcbiAgICAgICAgICAgIH0pKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEsIHVuZGVmaW5lZCwgSU5fREVCVUdfTU9ERSA/IDQgOiB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUZpbGUoXG4gICAgZmlsZTogc3RyaW5nLFxuKTpcbiAgICB8IHsgZXJyb3I6IHN0cmluZzsgcmVzdWx0OiBbXSB9XG4gICAgfCB7IGVycm9yOiB1bmRlZmluZWQ7IHJlc3VsdDogW3NldHRpbmdzOiBTZXJpYWxpemVkRGlhZ3JhbVtcInNldHRpbmdzXCJdLCBjb21wb25lbnRzOiBSZWlmaWVkW10sIHdpcmVzOiBXaXJpbmdbXV0gfSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoZmlsZSk7XG5cbiAgICAgICAgdmFsaWRhdGUoZGF0YSk7XG5cbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBuZXcgTWFwPG51bWJlciwgRWxlbWVudD4oKTtcblxuICAgICAgICBjb25zdCByZWlmaWVkID0gZGF0YS5jb21wb25lbnRzLm1hcCgocmF3KSA9PiB7XG4gICAgICAgICAgICBpZiAocmF3LnR5cGUgPT09IFwiSU5QVVRcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gbmV3IElucHV0KHJhdyk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3LmlkLCBpbnB1dC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByYXcucGVybWFuZW50ID8gaW5wdXQucGVybWFuZW50KCkgOiBpbnB1dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJhdy50eXBlID09PSBcIk9VVFBVVFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gbmV3IE91dHB1dChyYXcpO1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0LmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaWQsIG91dHB1dC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByYXcucGVybWFuZW50ID8gb3V0cHV0LnBlcm1hbmVudCgpIDogb3V0cHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmF3LnR5cGUgPT09IFwiRElTUExBWVwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzcGxheSA9IG5ldyBEaXNwbGF5KHJhdywgcmF3LmlucHV0cy5sZW5ndGgsIHJhdy5yYWRpeCkucm90YXRlKHJhdy5hbmdsZSk7XG5cbiAgICAgICAgICAgICAgICBkaXNwbGF5LmlucHV0cy5mb3JFYWNoKChpbnB1dCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuaW5wdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaW5wdXRzW2luZGV4XS5pZCwgaW5wdXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZGlzcGxheS5vdXRwdXRzLmZvckVhY2goKG91dHB1dCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3Lm91dHB1dHNbaW5kZXhdLmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5vdXRwdXRzW2luZGV4XS5pZCwgb3V0cHV0KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByYXcucGVybWFuZW50ID8gZGlzcGxheS5wZXJtYW5lbnQoKSA6IGRpc3BsYXk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyYXcudHlwZSA9PT0gXCJTRVZFTl9TRUdNRU5UX0RJU1BMQVlcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3BsYXkgPSBuZXcgU2V2ZW5TZWdtZW50RGlzcGxheShyYXcpLnJvdGF0ZShyYXcuYW5nbGUpO1xuXG4gICAgICAgICAgICAgICAgZGlzcGxheS5pbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmlucHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3LmlucHV0c1tpbmRleF0uaWQsIGlucHV0KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGRpc3BsYXkub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5vdXRwdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcub3V0cHV0c1tpbmRleF0uaWQsIG91dHB1dCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmF3LnBlcm1hbmVudCA/IGRpc3BsYXkucGVybWFuZW50KCkgOiBkaXNwbGF5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KG5ldyAoY2hpcHMuZ2V0KHJhdy5uYW1lKSEpKCksIHJhdywgcmF3LmNvbXBsZW1lbnRhcnksIHJhdy5qb2lucykucm90YXRlKFxuICAgICAgICAgICAgICAgIHJhdy5hbmdsZSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuaW5wdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pbnB1dHNbaW5kZXhdLmlkLCBpbnB1dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29tcG9uZW50Lm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5vdXRwdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5vdXRwdXRzW2luZGV4XS5pZCwgb3V0cHV0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmF3LnBlcm1hbmVudCA/IGNvbXBvbmVudC5wZXJtYW5lbnQoKSA6IGNvbXBvbmVudDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgd2lyZXMgPSBkYXRhLndpcmVzLm1hcCgoeyBmcm9tLCB0byB9KSA9PiBuZXcgV2lyaW5nKGVsZW1lbnRzLmdldChmcm9tKSEsIGVsZW1lbnRzLmdldCh0bykhKSk7XG5cbiAgICAgICAgcmV0dXJuIHsgcmVzdWx0OiBbZGF0YS5zZXR0aW5ncywgcmVpZmllZCwgd2lyZXNdLCBlcnJvcjogdW5kZWZpbmVkIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4geyBlcnJvcjogZS5tZXNzYWdlLCByZXN1bHQ6IFtdIH07XG5cbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiRmFpbGVkIHRvIHByb2Nlc3MgZmlsZS5cIiwgcmVzdWx0OiBbXSB9O1xuICAgIH1cbn1cblxuLy8gZ2lhbnQgbWVzcyB0byBtYWtlIHN1cmUgdGhlIHByb3ZpZGVkIGRhdGEgbWF0Y2hlcyB0aGUgZXhwZWN0ZWQgdHlwZVxuZnVuY3Rpb24gdmFsaWRhdGUoZGF0YTogdW5rbm93bik6IGFzc2VydHMgZGF0YSBpcyBTZXJpYWxpemVkRGlhZ3JhbSB7XG4gICAgaWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG5vdCBhbiBvYmplY3QuXCIpO1xuXG4gICAgaWYgKCEoXCJzZXR0aW5nc1wiIGluIGRhdGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG1pc3NpbmcgcHJvamVjdCBzZXR0aW5ncy5cIik7XG5cbiAgICBpZiAodHlwZW9mIGRhdGEuc2V0dGluZ3MgIT09IFwib2JqZWN0XCIgfHwgIWRhdGEuc2V0dGluZ3MpIHRocm93IG5ldyBFcnJvcihcIlByb2plY3Qgc2V0dGluZ3Mgc2hvdWxkIGJlIGFuIG9iamVjdC5cIik7XG5cbiAgICBpZiAoIShcImNvbXBvbmVudHNcIiBpbiBkYXRhKSkgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBtaXNzaW5nIGNvbXBvbmVudHMuXCIpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY29tcG9uZW50cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBub3QgYW4gYXJyYXkuXCIpO1xuXG4gICAgaWYgKCEoXCJ3aXJlc1wiIGluIGRhdGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG1pc3Npbmcgd2lyZXMuXCIpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEud2lyZXMpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlcyBkYXRhIGlzIG5vdCBhbiBhcnJheS5cIik7XG5cbiAgICBpZiAoIShcIkRyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkXCIgaW4gZGF0YS5zZXR0aW5ncykpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3Npbmcgc2V0dGluZyAnRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQnLlwiKTtcblxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGRhdGEuY29tcG9uZW50cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQgfHwgdHlwZW9mIGNvbXBvbmVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgbXVzdCBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwicmVpZmllZFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIHJlaWZpZWQgaWQuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnJlaWZpZWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJlaWZpZWQgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJwZXJtYW5lbnRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBwZXJtYW5lbmNlIHN0YXR1cy5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQucGVybWFuZW50ICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHBlcm1hbmVuY2UgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuXG4gICAgICAgIGlmICghKFwidHlwZVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIGEgdHlwZS5cIik7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdHlwZW9mIGNvbXBvbmVudC50eXBlICE9PSBcInN0cmluZ1wiIHx8XG4gICAgICAgICAgICAhW1wiSU5QVVRcIiwgXCJPVVRQVVRcIiwgXCJDT01QT05FTlRcIiwgXCJESVNQTEFZXCIsIFwiU0VWRU5fU0VHTUVOVF9ESVNQTEFZXCJdLmluY2x1ZGVzKGNvbXBvbmVudC50eXBlKVxuICAgICAgICApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbXBvbmVudCB0eXBlLlwiKTtcblxuICAgICAgICBpZiAoIShcInhcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHggY29vcmRpbmF0ZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQueCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHggY29vcmRpbmF0ZSBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICBpZiAoIShcInlcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHkgY29vcmRpbmF0ZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQueSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHkgY29vcmRpbmF0ZSBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICBzd2l0Y2ggKGNvbXBvbmVudC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiSU5QVVRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJPVVRQVVRcIjoge1xuICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gZGF0YSBpcyBtaXNzaW5nIGlkcy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSS9PIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcIkNPTVBPTkVOVFwiOiB7XG4gICAgICAgICAgICAgICAgaWYgKCEoXCJhbmdsZVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3Npbmcgcm90YXRpb24gYW5nbGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuYW5nbGUgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJvdGF0aW9uIGFuZ2xlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJjb21wbGVtZW50YXJ5XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBjb21wbGVtZW50YXJ5IG91dHB1dC5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5jb21wbGVtZW50YXJ5ICE9PSBcImJvb2xlYW5cIilcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcGxlbWVudGFyeSBvdXRwdXQgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJqb2luc1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3Npbmcgam9pbnMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuam9pbnMgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkpvaW5zIGNvdW50IG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJpbnB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgZGF0YSBpcyBtaXNzaW5nIGlucHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50LmlucHV0cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBpbnB1dHMgZGF0YSBtdXN0IGJlIGFuIGFycmF5LlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwib3V0cHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3Npbmcgb3V0cHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50Lm91dHB1dHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgb3V0cHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJuYW1lXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBjaGlwIG5hbWUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQubmFtZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiQ2hpcCBuYW1lIG11c3QgYmUgYSBzdHJpbmcuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlwcy5oYXMoY29tcG9uZW50Lm5hbWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlwIG5hbWUgZG9lc24ndCBleGlzdC5cIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBDaGlwID0gY2hpcHMuZ2V0KGNvbXBvbmVudC5uYW1lLnRyaW0oKS50b1VwcGVyQ2FzZSgpKSE7XG5cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMubGVuZ3RoICE9PVxuICAgICAgICAgICAgICAgICAgICAoY29tcG9uZW50LmpvaW5zICE9PSBDaGlwLklOUFVUUyA/IGNvbXBvbmVudC5pbnB1dHMubGVuZ3RoIDogQ2hpcC5JTlBVVFMpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgaW5wdXRzIGRvZXMgbm90IG1hdGNoIGNoaXAgaW5wdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQub3V0cHV0cy5sZW5ndGggIT09IChjb21wb25lbnQuY29tcGxlbWVudGFyeSA/IENoaXAuT1VUUFVUUyArIDEgOiBDaGlwLk9VVFBVVFMpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgb3V0cHV0cyBkb2VzIG5vdCBtYXRjaCBjaGlwIG91dHB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbnB1dCBvZiBjb21wb25lbnQuaW5wdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdXRwdXQgb2YgY29tcG9uZW50Lm91dHB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJESVNQTEFZXCI6XG4gICAgICAgICAgICBjYXNlIFwiU0VWRU5fU0VHTUVOVF9ESVNQTEFZXCI6IHtcbiAgICAgICAgICAgICAgICBpZiAoIShcImFuZ2xlXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSBkYXRhIGlzIG1pc3Npbmcgcm90YXRpb24gYW5nbGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuYW5nbGUgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJvdGF0aW9uIGFuZ2xlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gcmFkaXggZG9lc24ndCBhcHBseSB0byBzZXZlbiBzZWdtZW50IGRpc3BsYXlzXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC50eXBlID09PSBcIkRJU1BMQVlcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShcInJhZGl4XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSBkYXRhIGlzIG1pc3NpbmcgZGlzcGxheSByYWRpeC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQucmFkaXggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgcmFkaXggbXVzdCBiZSBhIG51bWJlci5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJpbnB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJEaXNwbGF5IGRhdGEgaXMgbWlzc2luZyBpbnB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbXBvbmVudC5pbnB1dHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJEaXNwbGF5IGlucHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJvdXRwdXRzXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSBkYXRhIGlzIG1pc3Npbmcgb3V0cHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50Lm91dHB1dHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJEaXNwbGF5IG91dHB1dHMgZGF0YSBtdXN0IGJlIGFuIGFycmF5LlwiKTtcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW5wdXQgb2YgY29tcG9uZW50LmlucHV0cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbnB1dCB8fCB0eXBlb2YgaW5wdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIGlucHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGlkLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0LmlkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiYWN0aXZhdGVkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuYWN0aXZhdGVkICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQWN0aXZhdGlvbiBzdGF0dXMgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgb3V0cHV0IG9mIGNvbXBvbmVudC5vdXRwdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmlkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiYWN0aXZhdGVkXCIgaW4gb3V0cHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG91dHB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaWRzID0gZGF0YS5jb21wb25lbnRzLmZsYXRNYXA8bnVtYmVyPigoY29tcG9uZW50KSA9PlxuICAgICAgICBjb21wb25lbnQudHlwZSA9PT0gXCJDT01QT05FTlRcIiB8fCBjb21wb25lbnQudHlwZSA9PT0gXCJESVNQTEFZXCIgfHwgY29tcG9uZW50LnR5cGUgPT09IFwiU0VWRU5fU0VHTUVOVF9ESVNQTEFZXCJcbiAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgICAgLi4uY29tcG9uZW50LmlucHV0cy5tYXAoKHsgaWQgfTogeyBpZDogbnVtYmVyIH0pID0+IGlkKSxcbiAgICAgICAgICAgICAgICAgIC4uLmNvbXBvbmVudC5vdXRwdXRzLm1hcCgoeyBpZCB9OiB7IGlkOiBudW1iZXIgfSkgPT4gaWQpLFxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICA6IGNvbXBvbmVudC5pZCxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCB3aXJlIG9mIGRhdGEud2lyZXMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgIGlmICghd2lyZSB8fCB0eXBlb2Ygd2lyZSAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIG11c3QgYmUgYW4gb2JqZWN0LlwiKTtcblxuICAgICAgICBpZiAoIShcImZyb21cIiBpbiB3aXJlKSkgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIGlzIG1pc3NpbmcgdGhlIGNvbXBvbmVudCBpdCBzdGFydHMgZnJvbS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB3aXJlLmZyb20gIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBtdXN0IHJlZmVyZW5jZSBudW1lcmljIGlkcy5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJ0b1wiIGluIHdpcmUpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgaXMgbWlzc2luZyB0aGUgdGFyZ2V0IGNvbXBvbmVudC5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB3aXJlLnRvICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgbXVzdCByZWZlcmVuY2UgbnVtZXJpYyBpZHMuXCIpO1xuXG4gICAgICAgIGlmICghaWRzLmluY2x1ZGVzKHdpcmUuZnJvbSkgfHwgIWlkcy5pbmNsdWRlcyh3aXJlLnRvKSkgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIHJlZmVyZW5jZXMgaW52YWxpZCBpZHMuXCIpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEdFVF9CQUNLR1JPVU5EX0NBTlZBU19DVFgsIEdFVF9GT1JFR1JPVU5EX0NBTlZBU19DVFgsIE5PX1JFTkRFUklORyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGNsYXNzIENhbnZhc01hbmFnZXIge1xuICAgIHN0YXRpYyAjam9icyA9IG5ldyBTZXQ8KGN0eDogeyBiZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEOyBmZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0pID0+IHZvaWQ+KCk7XG5cbiAgICBzdGF0aWMgI3JBRiA9IC0xO1xuXG4gICAgc3RhdGljICNyZW5kZXIoKSB7XG4gICAgICAgIGlmIChOT19SRU5ERVJJTkcpIHJldHVybjtcblxuICAgICAgICBjb25zdCBiZyA9IEdFVF9CQUNLR1JPVU5EX0NBTlZBU19DVFgoKTtcbiAgICAgICAgY29uc3QgZmcgPSBHRVRfRk9SRUdST1VORF9DQU5WQVNfQ1RYKCk7XG5cbiAgICAgICAgYmcuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGJnLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgZmcuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGZnLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy4jam9icy5mb3JFYWNoKChqb2IpID0+IHtcbiAgICAgICAgICAgIGpvYi5jYWxsKHVuZGVmaW5lZCwgeyBiZywgZmcgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdGFydCgpIHtcbiAgICAgICAgaWYgKE5PX1JFTkRFUklORykgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuI3JlbmRlcigpO1xuXG4gICAgICAgIGNvbnN0IGlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RhcnQuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy4jckFGID0gaWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0b3AoKSB7XG4gICAgICAgIGlmIChOT19SRU5ERVJJTkcpIHJldHVybjtcblxuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLiNyQUYpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRKb2Ioam9iOiAoY3R4OiB7IGJnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7IGZnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSkgPT4gdm9pZCkge1xuICAgICAgICBpZiAoTk9fUkVOREVSSU5HKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy4jam9icy5hZGQoam9iKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVsZXRlSm9iKGpvYjogKGN0eDogeyBiZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEOyBmZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0pID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKE5PX1JFTkRFUklORykgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuI2pvYnMuZGVsZXRlKGpvYik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU3RvcmFnZU1hbmFnZXIgfSBmcm9tIFwiLi9TdG9yYWdlTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgRGFya21vZGVNYW5hZ2VyIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgI2NoYW5nZXMgPSBuZXcgU2V0PCgpID0+IHZvaWQ+KCk7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI2Rhcmttb2RlS2V5ID0gXCJzZXR0aW5ncy5kYXJrbW9kZVwiO1xuICAgIHN0YXRpYyByZWFkb25seSAjZGFya21vZGVNb2RhbHNLZXkgPSBcInNldHRpbmdzLmRhcmttb2RlTW9kYWxzXCI7XG5cbiAgICBzdGF0aWMgZ2V0IGRhcmttb2RlRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIFN0b3JhZ2VNYW5hZ2VyLmdldCh0aGlzLiNkYXJrbW9kZUtleSkgPz8gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldCBkYXJrbW9kZUVuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KHRoaXMuI2Rhcmttb2RlS2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSA/IFwi8J+MlVwiIDogXCLwn4yRXCI7XG5cbiAgICAgICAgdGhpcy4jY2hhbmdlcy5mb3JFYWNoKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcImRhcmttb2RlXCIsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IGRhcmttb2RlTW9kYWxzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIFN0b3JhZ2VNYW5hZ2VyLmdldCh0aGlzLiNkYXJrbW9kZU1vZGFsc0tleSkgPz8gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldCBkYXJrbW9kZU1vZGFsc0VuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KHRoaXMuI2Rhcmttb2RlTW9kYWxzS2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSA/IFwi8J+MlVwiIDogXCLwn4yRXCI7XG5cbiAgICAgICAgdGhpcy4jY2hhbmdlcy5mb3JFYWNoKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcImRhcmttb2RlLW1vZGFsc1wiLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCAjZWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiYnV0dG9uLmRhcmttb2RlXCIpITtcbiAgICB9XG5cbiAgICBzdGF0aWMgb25DaGFuZ2UocnVuOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI2NoYW5nZXMuYWRkKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZkNoYW5nZShydW46ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jY2hhbmdlcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgI2xpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmRhcmttb2RlRW5hYmxlZCA9ICF0aGlzLmRhcmttb2RlRW5hYmxlZDtcblxuICAgICAgICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCJidXR0b24udG9vbHMsIGJ1dHRvbi5zZXR0aW5ncywgYnV0dG9uLmRhcmttb2RlXCIpO1xuXG4gICAgICAgIGJ1dHRvbnMuZm9yRWFjaCgoYikgPT4ge1xuICAgICAgICAgICAgYi5zdHlsZS50cmFuc2l0aW9uID0gXCJub25lXCI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICBidXR0b25zLmZvckVhY2goKGIpID0+IHtcbiAgICAgICAgICAgICAgICBiLnN0eWxlLnRyYW5zaXRpb24gPSBcIlwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICAvLyB0cmlnZ2VyIHNldHRlcnMgdG8gc2V0IHVwIGluaXRpYWwgc3RhdGVcbiAgICAgICAgdGhpcy5kYXJrbW9kZUVuYWJsZWQgPSB0aGlzLmRhcmttb2RlRW5hYmxlZDtcbiAgICAgICAgdGhpcy5kYXJrbW9kZU1vZGFsc0VuYWJsZWQgPSB0aGlzLmRhcmttb2RlTW9kYWxzRW5hYmxlZDtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LmlubmVyVGV4dCA9IHRoaXMuZGFya21vZGVFbmFibGVkID8gXCLwn4yVXCIgOiBcIvCfjJFcIjtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNsaXN0ZW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuI2VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2xpc3RlbmVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgdG9nZ2xlRGFya21vZGUodmFsdWU/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZGFya21vZGVFbmFibGVkID0gdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIiA/IHZhbHVlIDogIXRoaXMuZGFya21vZGVFbmFibGVkO1xuICAgIH1cblxuICAgIHN0YXRpYyB0b2dnbGVEYXJrbW9kZU1vZGFscyh2YWx1ZT86IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5kYXJrbW9kZU1vZGFsc0VuYWJsZWQgPSB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiID8gdmFsdWUgOiAhdGhpcy5kYXJrbW9kZU1vZGFsc0VuYWJsZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4uL2NpcmN1bGFyXCI7XG5pbXBvcnQgeyBFVkVOX0RBUktFUl9HUkFZX0NTU19DT0xPUiwgRVZFTl9MSUdIVEVSX0dSQVlfQ1NTX0NPTE9SLCBHRVRfQUNUSVZBVEVEX0NPTE9SLCBHUklEX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBxdWlja3BpY2tDb21wb25lbnRzIH0gZnJvbSBcIi4uL3F1aWNrcGlja3MvY29tcG9uZW50c1wiO1xuaW1wb3J0IHsgcXVpY2twaWNrR2F0ZXMgfSBmcm9tIFwiLi4vcXVpY2twaWNrcy9nYXRlc1wiO1xuaW1wb3J0IHsgUmVpZmllZCwgY29tcHV0ZVRyYW5zZm9ybU9yaWdpbiB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IENhbnZhc01hbmFnZXIgfSBmcm9tIFwiLi9DYW52YXNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBEYXJrbW9kZU1hbmFnZXIgfSBmcm9tIFwiLi9EYXJrbW9kZU1hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgTW91c2VNYW5hZ2VyIH0gZnJvbSBcIi4vTW91c2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4vU2VsZWN0aW9uTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgRHJhZ2dpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2RyYWdnZWQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICN3YXRjaGVkID0gbmV3IE1hcCgpO1xuXG4gICAgc3RhdGljICNtb3VzZSA9IHsgeDogLTEsIHk6IC0xLCBveDogLTEsIG95OiAtMSwgaXg6IC0xLCBpeTogLTEsIGRvd246IGZhbHNlIH07XG5cbiAgICBzdGF0aWMgI3RvcGxlZnQ6IEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgI29yaWdpbmFsOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgI2Rvd25wb3MgPSB7IHg6IC0xLCB5OiAtMSB9O1xuXG4gICAgc3RhdGljICNwb3NpdGlvbnM6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfVtdIHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljICNzbmFwVG9HcmlkID0gZmFsc2U7XG5cbiAgICBzdGF0aWMgZ2V0IHNuYXBUb0dyaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzbmFwVG9HcmlkO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXQgc25hcFRvR3JpZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLiNzbmFwVG9HcmlkID0gdmFsdWU7XG5cbiAgICAgICAgdGhpcy5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc25hcFRvR3JpZEJhc2VkVXBkYXRlKFxuICAgICAgICB7IGZvcmNlQ2xlYXIgPSBmYWxzZSwgb25seVVwZGF0ZUNvbG9yID0gZmFsc2UgfTogeyBmb3JjZUNsZWFyPzogYm9vbGVhbjsgb25seVVwZGF0ZUNvbG9yPzogYm9vbGVhbiB9ID0ge1xuICAgICAgICAgICAgZm9yY2VDbGVhcjogZmFsc2UsXG4gICAgICAgICAgICBvbmx5VXBkYXRlQ29sb3I6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICkge1xuICAgICAgICBpZiAodGhpcy5zbmFwVG9HcmlkICYmICFmb3JjZUNsZWFyKSB7XG4gICAgICAgICAgICBpZiAoIW9ubHlVcGRhdGVDb2xvcilcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLm1pbldpZHRoID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLm1pbkhlaWdodCA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGNvbXBvbmVudC5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3AgPSBwYXJzZUZsb2F0KHN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdCA9IHBhcnNlRmxvYXQoc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IE1hdGguZmxvb3IobGVmdCAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IE1hdGguZmxvb3IodG9wIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLm1pbldpZHRoID0gTWF0aC5jZWlsKHdpZHRoIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSBNYXRoLmNlaWwoaGVpZ2h0IC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IEdSSURfU0laRSArIFwicHggXCIgKyBHUklEX1NJWkUgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIGlmIChEYXJrbW9kZU1hbmFnZXIuZGFya21vZGVFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAke0VWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SfSAxcHgsIHRyYW5zcGFyZW50IDFweCksIGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICR7RVZFTl9EQVJLRVJfR1JBWV9DU1NfQ09MT1J9IDFweCwgdHJhbnNwYXJlbnQgMXB4KWA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgJHtFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1J9IDFweCwgdHJhbnNwYXJlbnQgMXB4KSwgbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgJHtFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1J9IDFweCwgdHJhbnNwYXJlbnQgMXB4KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5zdHlsZS5taW5XaWR0aCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLm1pbkhlaWdodCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IFwiXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmQgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHdhdGNoKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB0YXJnZXQgPSBlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC53YXRjaGVkID0gXCJ0cnVlXCI7XG5cbiAgICAgICAgY29uc3QgbW91c2Vkb3duID0gKGU6IHsgY2xpZW50WDogbnVtYmVyOyBjbGllbnRZOiBudW1iZXIgfSkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IGVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuZGF0YXNldC5kcmFnZ2VkID0gXCJ0cnVlXCI7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiO1xuXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy4jZHJhZ2dlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgICAgIHRoaXMuI21vdXNlLml4ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jbW91c2UuaXkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhU2VsZWN0aW9uTWFuYWdlci5pc1NlbGVjdGVkKGVsZW1lbnQpICYmXG4gICAgICAgICAgICAgICAgIShcbiAgICAgICAgICAgICAgICAgICAgKElTX01BQ19PUyAmJiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIk1ldGFMZWZ0XCIpIHx8IEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJNZXRhUmlnaHRcIikpKSB8fFxuICAgICAgICAgICAgICAgICAgICAoIUlTX01BQ19PUyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJDb250cm9sTGVmdFwiKSB8fCBLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiQ29udHJvbFJpZ2h0XCIpKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLiNwb3NpdGlvbnMgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF0ubWFwKCh0YXJnZXQpID0+IHRhcmdldC5wb3MpO1xuXG4gICAgICAgICAgICAgICAgLy8gc3RvcmUgbW9zdCB0b3AgbGVmdCBlbGVtZW50IGFzIGFuIGFuY2hvciBmb3IgdGhlIG90aGVyc1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF0uc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBheCA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBheSA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ4ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ5ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWQgPSBNYXRoLnNxcnQoYXggKiBheCArIGF5ICogYXkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiZCA9IE1hdGguc3FydChieCAqIGJ4ICsgYnkgKiBieSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZCAtIGJkO1xuICAgICAgICAgICAgICAgIH0pWzBdLmVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3ggPSBlLmNsaWVudFggLSBib3VuZHMueDtcbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veSA9IGUuY2xpZW50WSAtIGJvdW5kcy55O1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jdG9wbGVmdCA9IHRvcGxlZnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuI29yaWdpbmFsID0geyB4OiByZWN0LmxlZnQsIHk6IHJlY3QudG9wIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdG91Y2hzdGFydCA9IChlOiBUb3VjaEV2ZW50KSA9PiBtb3VzZWRvd24oZS50b3VjaGVzWzBdKTtcblxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd24sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRvdWNoc3RhcnQsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLiN3YXRjaGVkLnNldCh0YXJnZXQsIHsgbW91c2Vkb3duLCB0b3VjaHN0YXJ0IH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBmb3JnZXQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGZvcmNlPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuI3dhdGNoZWQuZ2V0KGVsZW1lbnQpO1xuXG4gICAgICAgIGlmICghbGlzdGVuZXIgJiYgIWZvcmNlKSB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbm90IGN1cnJlbnRseSBiZWluZyB3YXRjaGVkLmApO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZGF0YXNldC53YXRjaGVkO1xuXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXIubW91c2Vkb3duLCB7IGNhcHR1cmU6IHRydWUgfSk7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGxpc3RlbmVyLnRvdWNoc3RhcnQsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgdGhpcy4jd2F0Y2hlZC5kZWxldGUoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuI3dhdGNoZWQuZm9yRWFjaCgoXywgZWxlbWVudCkgPT4gdGhpcy5mb3JnZXQoZWxlbWVudCkpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlID0geyB4OiAtMSwgeTogLTEsIG94OiAtMSwgb3k6IC0xLCBpeDogLTEsIGl5OiAtMSwgZG93bjogZmFsc2UgfTtcblxuICAgICAgICB0aGlzLiNkb3ducG9zID0geyB4OiAtMSwgeTogLTEgfTtcblxuICAgICAgICB0aGlzLiN0b3BsZWZ0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI2RyYWdnZWQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jb3JpZ2luYWwgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jcG9zaXRpb25zID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuZGVhZmVuKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbmRlcih7IGZnIH06IHsgZmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLnggIT09IC0xICYmXG4gICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy55ICE9PSAtMSAmJlxuICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnggIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueSAhPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBmZy5zdHJva2VTdHlsZSA9IEdFVF9BQ1RJVkFURURfQ09MT1IoKTtcblxuICAgICAgICAgICAgZmcubGluZVdpZHRoID0gMi41O1xuXG4gICAgICAgICAgICBmZy5saW5lSm9pbiA9IFwibWl0ZXJcIjtcblxuICAgICAgICAgICAgZmcuc3Ryb2tlUmVjdChcbiAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54LFxuICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLnksXG4gICAgICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnggLSBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54LFxuICAgICAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55IC0gRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuXG4gICAgICAgIENhbnZhc01hbmFnZXIuYWRkSm9iKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLiN0b3VjaG1vdmUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuI3RvdWNoc3RhcnQpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLiN0b3VjaGVuZCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlYWZlbigpIHtcbiAgICAgICAgdGhpcy5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoeyBmb3JjZUNsZWFyOiB0cnVlIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLiN0b3VjaG1vdmUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuI3RvdWNoc3RhcnQpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLiN0b3VjaGVuZCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZW1vdmUgPSAoZTogeyBjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlciB9KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgaWYgKHRoaXMuI2RyYWdnZWQpIHtcbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbih0aGlzLiNkcmFnZ2VkKTtcblxuICAgICAgICAgICAgaWYgKERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUubGVmdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3gpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50b3AgPVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiN0b3BsZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSB0aGlzLiN0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0LmxlZnQgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQudG9wIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5sZWZ0ID0gdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLnRvcCA9IHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IHRoaXMuI3RvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBtID0gZSBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgPyBlIDogZS50b3VjaGVzWzBdO1xuXG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBtLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBtLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UuaXggPSBtLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLml5ID0gbS5jbGllbnRZO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XG5cbiAgICAgICAgY29uc3QgaXNPbkludmFsaWRUYXJnZXQgPSBbXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1pbnB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLW91dHB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmRpc3BsYXlcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5jb250ZXh0bWVudVwiKSxcbiAgICAgICAgXS5maW5kKChlbGVtZW50KSA9PiBlbGVtZW50ICE9PSBudWxsKSE7XG5cbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIWlzT25JbnZhbGlkVGFyZ2V0ICYmIGUuYnV0dG9uID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJLZXlBXCIpICYmIEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJLZXlTXCIpKSB7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiS2V5QVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBxdWlja3BpY2tHYXRlcyhlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJLZXlTXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1aWNrcGlja0NvbXBvbmVudHMoZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZG93bnBvcy54ID0gbS5jbGllbnRYO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkb3ducG9zLnkgPSBtLmNsaWVudFk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFpc09uSW52YWxpZFRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuI2Rvd25wb3MueCA9IG0uY2xpZW50WDtcbiAgICAgICAgICAgICAgICB0aGlzLiNkb3ducG9zLnkgPSBtLmNsaWVudFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNtb3VzZS5kb3duID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZXVwID0gKGU6IHsgY2xpZW50WDogbnVtYmVyOyBjbGllbnRZOiBudW1iZXIgfSkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIGlmICh0aGlzLiNkcmFnZ2VkKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignW2RhdGEtZHJhZ2dlZD1cInRydWVcIl0nKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGUuZGF0YXNldC5kcmFnZ2VkO1xuXG4gICAgICAgICAgICAgICAgZS5zdHlsZS5jdXJzb3IgPSBcIlwiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuI2RyYWdnZWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2UgPSB0aGlzLiNtb3VzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbCA9IHRoaXMuI29yaWdpbmFsITtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gR1JJRF9TSVpFO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLnggIT09IG1vdXNlLml4IHx8IG1vdXNlLnkgIT09IG1vdXNlLml5KVxuICAgICAgICAgICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBNYXRoLmZsb29yKChtb3VzZS54IC0gbW91c2Uub3ggLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoKG1vdXNlLnkgLSBtb3VzZS5veSAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbih0YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5sZWZ0ID0gTWF0aC5mbG9vcigob3JpZ2luYWwueCAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gTWF0aC5mbG9vcigob3JpZ2luYWwueSAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBtb3VzZS54IC0gbW91c2Uub3ggLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gbW91c2UueSAtIG1vdXNlLm95IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4odGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IG9yaWdpbmFsLnggLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gb3JpZ2luYWwueSAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuI21vdXNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldHMgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF07XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy4jcG9zaXRpb25zITtcbiAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gdGhpcy4jdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gR1JJRF9TSVpFO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLnggIT09IG1vdXNlLml4IHx8IG1vdXNlLnkgIT09IG1vdXNlLml5KVxuICAgICAgICAgICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IE1hdGguZmxvb3IoKG1vdXNlLnggLSBtb3VzZS5veCkgLyBzaXplKSAqIHNpemUgKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBNYXRoLmZsb29yKChtb3VzZS55IC0gbW91c2Uub3kpIC8gc2l6ZSkgKiBzaXplICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogbW91c2UueCAtIG1vdXNlLm94ICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbW91c2UueSAtIG1vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggIT09IC0xICYmXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnkgIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueCAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55ICE9PSAtMVxuICAgICAgICApXG4gICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdEFsbEluKERyYWdnaW5nTWFuYWdlci4jZG93bnBvcywgTW91c2VNYW5hZ2VyLm1vdXNlKTtcblxuICAgICAgICB0aGlzLiNtb3VzZSA9IHsgeDogLTEsIHk6IC0xLCBveDogLTEsIG95OiAtMSwgaXg6IC0xLCBpeTogLTEsIGRvd246IGZhbHNlIH07XG5cbiAgICAgICAgdGhpcy4jZG93bnBvcyA9IHsgeDogLTEsIHk6IC0xIH07XG5cbiAgICAgICAgdGhpcy4jdG9wbGVmdCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNkcmFnZ2VkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI29yaWdpbmFsID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICN0b3VjaG1vdmUgPSAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy4jbW91c2Vtb3ZlKGUudG91Y2hlc1swXSk7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3RvdWNoc3RhcnQgPSAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy4jbW91c2Vkb3duKGUpO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICN0b3VjaGVuZCA9IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLiNtb3VzZXVwKGUudG91Y2hlc1swXSk7XG5cbiAgICBzdGF0aWMgZ2V0IGRvd25wb3MoKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMuI2Rvd25wb3MgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY2lyY3VsYXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIEtleWJpbmRzTWFuYWdlciB7XG4gICAgc3RhdGljICNrZXltYXAgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcblxuICAgIHN0YXRpYyAja2V5Y2hvcmRzID0gbmV3IEFycmF5PFtzdHJpbmcsICgoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZClbXV0+KCk7XG5cbiAgICBzdGF0aWMgI2tleWRvd24gPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNrZXltYXAuc2V0KGUuY29kZSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGUubWV0YUtleSAmJiAoZS5jb2RlID09PSBcIlNoaWZ0TGVmdFwiIHx8IGUuY29kZSA9PT0gXCJTaGlmdFJpZ2h0XCIpICYmIElTX01BQ19PUylcbiAgICAgICAgICAgIHRoaXMuI2tleW1hcCA9IG5ldyBNYXAoWy4uLnRoaXMuI2tleW1hcC5lbnRyaWVzKCldLmZpbHRlcigoW2tleV0pID0+ICFrZXkuc3RhcnRzV2l0aChcIktleVwiKSkpO1xuXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICBjb25zdCBbY2hvcmQsIHJ1bnNdID1cbiAgICAgICAgICAgICAgICB0aGlzLiNrZXljaG9yZHMuZmluZCgoW2Nob3JkXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGNob3JkLnNwbGl0KFwiK1wiKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja1NoaWZ0ID0ga2V5cy5pbmNsdWRlcyhcIlNoaWZ0TGVmdFwiKSB8fCBrZXlzLmluY2x1ZGVzKFwiU2hpZnRSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tDdHJsID0ga2V5cy5pbmNsdWRlcyhcIkNvbnRyb2xMZWZ0XCIpIHx8IGtleXMuaW5jbHVkZXMoXCJDb250cm9sUmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrQWx0ID0ga2V5cy5pbmNsdWRlcyhcIkFsdExlZnRcIikgfHwga2V5cy5pbmNsdWRlcyhcIkFsdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja01ldGEgPSBrZXlzLmluY2x1ZGVzKFwiTWV0YUxlZnRcIikgfHwga2V5cy5pbmNsdWRlcyhcIk1ldGFSaWdodFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrU2hpZnQgJiYgZS5zaGlmdEtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrQ3RybCAmJiBlLmN0cmxLZXkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGVja0FsdCAmJiBlLmFsdEtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrTWV0YSAmJiBlLm1ldGFLZXkpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tTaGlmdCkga2V5cyA9IGtleXMuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJTaGlmdExlZnRcIiAmJiBrZXkgIT09IFwiU2hpZnRSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrQ3RybCkga2V5cyA9IGtleXMuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJDb250cm9sTGVmdFwiICYmIGtleSAhPT0gXCJDb250cm9sUmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja0FsdCkga2V5cyA9IGtleXMuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJBbHRMZWZ0XCIgJiYga2V5ICE9PSBcIkFsdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tNZXRhKSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIk1ldGFMZWZ0XCIgJiYga2V5ICE9PSBcIk1ldGFSaWdodFwiKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrU2hpZnQgPyBlLnNoaWZ0S2V5IDogdHJ1ZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIChjaGVja0N0cmwgPyBlLmN0cmxLZXkgOiB0cnVlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrQWx0ID8gZS5hbHRLZXkgOiB0cnVlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrTWV0YSA/IGUubWV0YUtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzLmV2ZXJ5KChrZXkpID0+IHRoaXMuI2tleW1hcC5nZXQoa2V5KSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KSA/PyBbXTtcblxuICAgICAgICAgICAgaWYgKHJ1bnMpIHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5raWxsTWVudSgpO1xuXG4gICAgICAgICAgICAgICAgcnVucy5mb3JFYWNoKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuXG4gICAgICAgICAgICAgICAgY2hvcmQhLnNwbGl0KFwiK1wiKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwiS2V5XCIpKSB0aGlzLiNrZXltYXAuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc3RhdGljICNrZXl1cCA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5kZWxldGUoZS5jb2RlKTtcblxuICAgICAgICBpZiAoIWUubWV0YUtleSAmJiAoZS5jb2RlID09PSBcIk1ldGFMZWZ0XCIgfHwgZS5jb2RlID09PSBcIk1ldGFSaWdodFwiKSAmJiBJU19NQUNfT1MpIHRoaXMuI2tleW1hcC5jbGVhcigpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI2JsdXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5jbGVhcigpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLiNrZXlkb3duKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuI2tleXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy4jYmx1cik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlYWZlbigpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy4ja2V5ZG93bik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLiNrZXl1cCk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuI2JsdXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbktleUNob3JkKGNob3JkOiBzdHJpbmcsIHJ1bjogKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgY2hvcmQgPSBjaG9yZC5zcGxpdChcIitcIikuc29ydCgpLmpvaW4oXCIrXCIpO1xuXG4gICAgICAgIGlmICghdGhpcy4ja2V5Y2hvcmRzLmZpbmQoKFtrZXldKSA9PiBrZXkgPT09IGNob3JkKT8uWzFdLnB1c2gocnVuKSkgdGhpcy4ja2V5Y2hvcmRzLnB1c2goW2Nob3JkLCBbcnVuXV0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0tleURvd25BbmROb0ZvY3VzKGtleTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuI2tleW1hcC5nZXQoa2V5KSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5O1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0tleURvd24oa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy4ja2V5bWFwLmdldChrZXkpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy4ja2V5Y2hvcmRzID0gW107XG5cbiAgICAgICAgdGhpcy5kZWFmZW4oKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgZXhwYW5kPFMgZXh0ZW5kcyBzdHJpbmc+KGNob3JkOiBTKTogRXhwYW5kQ2hvcmQ8Uz5bXTtcbiAgICBzdGF0aWMgZXhwYW5kKGNob3JkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBjaG9yZC5zcGxpdChcIitcIik7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gXCJTaGlmdFwiIHx8IGtleSA9PT0gXCJDb250cm9sXCIgfHwga2V5ID09PSBcIkFsdFwiIHx8IGtleSA9PT0gXCJNZXRhXCIpXG4gICAgICAgICAgICByZXR1cm4gcmVzdC5sZW5ndGhcbiAgICAgICAgICAgICAgICA/IHRoaXMuZXhwYW5kKHJlc3Quam9pbihcIitcIikpLmZsYXRNYXAoKGtleXMpID0+IFtcbiAgICAgICAgICAgICAgICAgICAgICBbYCR7a2V5fUxlZnRgLCBrZXlzXS5qb2luKFwiK1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICBbYCR7a2V5fVJpZ2h0YCwga2V5c10uam9pbihcIitcIiksXG4gICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgIDogW2Ake2tleX1MZWZ0YCwgYCR7a2V5fVJpZ2h0YF07XG5cbiAgICAgICAgaWYgKGtleS5sZW5ndGggPT09IDEgJiYga2V5ID09PSBrZXkudG9VcHBlckNhc2UoKSlcbiAgICAgICAgICAgIHJldHVybiByZXN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgID8gdGhpcy5leHBhbmQocmVzdC5qb2luKFwiK1wiKSkuZmxhdE1hcCgoa2V5cykgPT4gW1tgS2V5JHtrZXl9YCwga2V5c10uam9pbihcIitcIildKVxuICAgICAgICAgICAgICAgIDogW2BLZXkke2tleX1gXTtcblxuICAgICAgICByZXR1cm4gW2Nob3JkXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXNzaWduPFMgZXh0ZW5kcyBzdHJpbmcsIFIgZXh0ZW5kcyAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD4oY2hvcmQ6IFMsIHJ1bjogUik6IEFzc2lnbkNob3JkPFMsIFI+O1xuICAgIHN0YXRpYyBhc3NpZ24oY2hvcmQ6IHN0cmluZywgcnVuOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICAgICAgdGhpcy5leHBhbmQoY2hvcmQpXG4gICAgICAgICAgICAgICAgLm1hcDxbU3RyaW5naWZpYWJsZSwgKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWRdPigoa2V5cykgPT4gW2tleXMsIHJ1bl0pXG4gICAgICAgICAgICAgICAgLmNvbmNhdChbW2Nob3JkLCBydW5dXSksXG4gICAgICAgICk7XG4gICAgfVxufVxuXG50eXBlIFNwbGl0PFMgZXh0ZW5kcyBzdHJpbmcsIEQgZXh0ZW5kcyBzdHJpbmcgPSBcIlwiLCBSIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdID0gW10+ID0gUyBleHRlbmRzIFwiXCJcbiAgICA/IFJcbiAgICA6IFMgZXh0ZW5kcyBgJHtpbmZlciBBfSR7RH0ke2luZmVyIEJ9YFxuICAgID8gU3BsaXQ8QiwgRCwgWy4uLlIsIEFdPlxuICAgIDogWy4uLlIsIFNdO1xuXG50eXBlIFN0cmluZ2lmaWFibGUgPSBzdHJpbmcgfCBudW1iZXIgfCBiaWdpbnQgfCBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxudHlwZSBKb2luPEEsIFMgZXh0ZW5kcyBzdHJpbmcgPSBcIlwiLCBSIGV4dGVuZHMgc3RyaW5nID0gXCJcIj4gPSBBIGV4dGVuZHMgW2luZmVyIFggZXh0ZW5kcyBTdHJpbmdpZmlhYmxlLCAuLi5pbmZlciBZXVxuICAgID8gSm9pbjxZLCBTLCBSIGV4dGVuZHMgXCJcIiA/IFggOiBgJHtSfSR7U30ke1h9YD5cbiAgICA6IFI7XG5cbnR5cGUgRXhwYW5kQ2hvcmQ8UyBleHRlbmRzIHN0cmluZywgQSBleHRlbmRzIHN0cmluZ1tdID0gU3BsaXQ8UywgXCIrXCI+PiA9IEpvaW48XG4gICAge1xuICAgICAgICBbSyBpbiBrZXlvZiBBXTogQVtLXSBleHRlbmRzIFwiU2hpZnRcIiB8IFwiQ29udHJvbFwiIHwgXCJBbHRcIiB8IFwiTWV0YVwiXG4gICAgICAgICAgICA/IGAke0FbS119JHtcIkxlZnRcIiB8IFwiUmlnaHRcIn1gXG4gICAgICAgICAgICA6IFNwbGl0PEFbS10+W1wibGVuZ3RoXCJdIGV4dGVuZHMgMVxuICAgICAgICAgICAgPyBBW0tdIGV4dGVuZHMgVXBwZXJjYXNlPEFbS10+XG4gICAgICAgICAgICAgICAgPyBgS2V5JHtBW0tdfWBcbiAgICAgICAgICAgICAgICA6IEFbS11cbiAgICAgICAgICAgIDogQVtLXTtcbiAgICB9LFxuICAgIFwiK1wiXG4+O1xuXG50eXBlIEFzc2lnbkNob3JkPFMgZXh0ZW5kcyBzdHJpbmcsIFI+ID0ge1xuICAgIFtfIGluIFNdOiBSO1xufSAmIHtcbiAgICBbSyBpbiBFeHBhbmRDaG9yZDxTPiAmIFByb3BlcnR5S2V5XTogUjtcbn07XG4iLCJpbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgdHlwZSBNZW51TWFuYWdlckNvbnRleHQgPSB7XG4gICAgbWVudTogSFRNTEVsZW1lbnQ7XG4gICAgY2xpY2tzOiBNYXA8c3RyaW5nLCAoKSA9PiB2b2lkPjtcbiAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgbW91c2Vkb3duOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICAgICAgY29udGV4dG1lbnU6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgICAgICBjbGljazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQWN0aW9ucyA9IEFycmF5PFxuICAgIFJlY29yZDxzdHJpbmcsIHsgbGFiZWw6IHN0cmluZzsga2V5YmluZD86IHN0cmluZzsgc3RvcFByb3BhZ2F0aW9uPzogYm9vbGVhbjsgY2FsbGJhY2s6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkIH0+XG4+O1xuXG5leHBvcnQgdHlwZSBNZW51TWFuYWdlckFjdGlvbiA9IE1lbnVNYW5hZ2VyQWN0aW9uc1tudW1iZXJdO1xuXG5leHBvcnQgY2xhc3MgTWVudU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSAjZWxlbWVudHMgPSBuZXcgTWFwPEhUTUxFbGVtZW50LCBNZW51TWFuYWdlckNvbnRleHQ+KCk7XG5cbiAgICBzdGF0aWMgI29wZW5lZDogTW91c2VFdmVudDtcblxuICAgIHN0YXRpYyB1c2UoXG4gICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICBhY3Rpb25zOiBNZW51TWFuYWdlckFjdGlvbnMsXG4gICAgKTogW3F1ZXVlTmV3Q29udGV4dDogKG5ld0NvbnRleHQ6IChwcmV2OiBNZW51TWFuYWdlckFjdGlvbnMpID0+IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4gdm9pZCwga2lsbE1lbnU6ICgpID0+IHZvaWRdIHtcbiAgICAgICAgY29uc3QgbWVudSA9IGh0bWxgPGRpdiBjbGFzcz1cImNvbnRleHRtZW51XCI+PC9kaXY+YDtcblxuICAgICAgICBjb25zdCBjbGlja3MgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgY29uc3Qgc2V0dXAgPSAoYWN0aW9uczogTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB7XG4gICAgICAgICAgICBjbGlja3MuY2xlYXIoKTtcblxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IGFjdGlvbnMuZmxhdE1hcCgocmVjb3JkKSA9PiBPYmplY3Qua2V5cyhyZWNvcmQpKTtcblxuICAgICAgICAgICAgaWYgKGtleXMubGVuZ3RoICE9PSBuZXcgU2V0KGtleXMpLnNpemUpIHRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZSBrZXlzIGluIG1lbnUgYWN0aW9ucy5cIik7XG5cbiAgICAgICAgICAgIG1lbnUuaW5uZXJIVE1MID0gYWN0aW9uc1xuICAgICAgICAgICAgICAgIC5tYXAoKHJlY29yZCkgPT5cbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMocmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoW25hbWUsIHsgbGFiZWwsIGtleWJpbmQgfV0pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGA8YnV0dG9uIGNsYXNzPVwiJHtuYW1lfVwiPiR7bGFiZWx9PHAgY2xhc3M9XCJtZW51LWtleWJpbmRcIj4ke2tleWJpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChrZXkpID0+IGA8c3Bhbj4ke2tleX08L3NwYW4+YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcIil9PC9wPjwvYnV0dG9uPmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBgPGJ1dHRvbiBjbGFzcz1cIiR7bmFtZX1cIj4ke2xhYmVsfTwvYnV0dG9uPmAsXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmpvaW4oJzxkaXYgY2xhc3M9XCJiclwiPjwvZGl2PicpO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goKHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlY29yZCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsaWNrID0gcmVjb3JkW2tleV0uY2FsbGJhY2suYmluZCh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrKHRoaXMuI29wZW5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmRba2V5XS5zdG9wUHJvcGFnYXRpb24pIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5cIiArIGtleSkhLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrcy5zZXQoa2V5LCBsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgY29udGV4dDogTWVudU1hbmFnZXJBY3Rpb25zIHwgdW5kZWZpbmVkO1xuXG4gICAgICAgIGNvbnN0IGdldEFjdGlvbnMgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSBjb250ZXh0O1xuXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb25zO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICAgICAgfTtcblxuICAgICAgICBzZXR1cChnZXRBY3Rpb25zKCkpO1xuXG4gICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgIG1lbnUuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtZW51KTtcblxuICAgICAgICBjb25zdCBtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICAgICAgdGhpcy4jb3BlbmVkID0gZTtcblxuICAgICAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNvbnRleHRtZW51ID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IGUuY2xpZW50WCArIFwicHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUudG9wID0gZS5jbGllbnRZICsgXCJweFwiO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9O1xuXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd24pO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBjb250ZXh0bWVudSk7XG4gICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrKTtcbiAgICAgICAgbWVudS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgY2xpY2spO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnRzLnNldChlbGVtZW50LCB7IG1lbnUsIGNsaWNrcywgbGlzdGVuZXJzOiB7IG1vdXNlZG93biwgY29udGV4dG1lbnUsIGNsaWNrIH0gfSk7XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIChuZXdDb250ZXh0OiAocHJldjogTWVudU1hbmFnZXJBY3Rpb25zKSA9PiBNZW51TWFuYWdlckFjdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gbmV3Q29udGV4dC5jYWxsKHVuZGVmaW5lZCwgWy4uLmFjdGlvbnNdKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICAgICAgbWVudS5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHsgbWVudSwgY2xpY2tzLCBsaXN0ZW5lcnMgfSA9IHRoaXMuI2VsZW1lbnRzLmdldChlbGVtZW50KSA/PyB7fTtcblxuICAgICAgICBpZiAoIW1lbnUgfHwgIWNsaWNrcyB8fCAhbGlzdGVuZXJzKSB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnRzIGFyZSBub3QgYmVpbmcgYWZmZWN0ZWQuYCk7XG5cbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGxpc3RlbmVycy5tb3VzZWRvd24pO1xuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcnMuY29udGV4dG1lbnUpO1xuICAgICAgICBtZW51LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcnMuY2xpY2spO1xuICAgICAgICBtZW51LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcnMuY2xpY2spO1xuXG4gICAgICAgIEFycmF5LmZyb20oY2xpY2tzKS5mb3JFYWNoKChba2V5LCBsaXN0ZW5lcl0pID0+IHtcbiAgICAgICAgICAgIG1lbnUucXVlcnlTZWxlY3RvcihcIi5cIiArIGtleSkhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBtZW51LnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBNb2RhbE1hbmFnZXIge1xuICAgIHN0YXRpYyAjYWJvcnQ/OiBBYm9ydENvbnRyb2xsZXI7XG5cbiAgICBzdGF0aWMgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWNvbnRhaW5lclwiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljICNvbk1vZGFsTW91bnQoKSB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLmtpbGxNZW51KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuI2Fib3J0KSB0aGlzLiNhYm9ydC5hYm9ydCgpO1xuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEuY2xhc3NMaXN0LmFkZChcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgIH1cblxuICAgIHN0YXRpYyAjb25Nb2RhbFVubW91bnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCA8PSAwKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcblxuICAgICAgICAgICAgICAgIHRoaXMuI2Fib3J0ID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgXCJ0cmFuc2l0aW9uZW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBvbmNlOiB0cnVlLCBzaWduYWw6IHRoaXMuI2Fib3J0LnNpZ25hbCB9LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5jb250YWlucyhcIm1vZGFsLWFsZXJ0XCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgYWxlcnQoY29udGVudDogc3RyaW5nIHwgRWxlbWVudCkge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBhbGVydCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtYWxlcnRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1vZGFsLW1lc3NhZ2VcIj48L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgYWxlcnQuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBjb250ZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQuY2hpbGRyZW5bMF0uYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChhbGVydCk7XG5cbiAgICAgICAgYWxlcnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRvbmUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYWxlcnQucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsVW5tb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgY29uc3QgY2xpY2tvdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gdGhpcy5jb250YWluZXIgfHwgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCAhPT0gYWxlcnQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgIGFsZXJ0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBjb25maXJtKGNvbnRlbnQ6IHN0cmluZyB8IEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jb25Nb2RhbE1vdW50KCk7XG5cbiAgICAgICAgY29uc3QgY29uZmlybSA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtY29uZmlybVwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPjwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtY2FuY2VsXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGNvbmZpcm0uY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBjb250ZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlybS5jaGlsZHJlblswXS5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbmZpcm0pO1xuXG4gICAgICAgIGNvbmZpcm0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKGZhbHNlKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9ICh2YWx1ZTogYm9vbGVhbikgPT4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbmZpcm0ucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsVW5tb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maXJtLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxVbm1vdW50KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICBjb25zdCBjbGlja291dCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICE9PSB0aGlzLmNvbnRhaW5lciB8fCB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkICE9PSBjb25maXJtKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgICAgIGNvbmZpcm0ucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsVW5tb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICBjb25maXJtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWNhbmNlbFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIoZmFsc2UpKTtcblxuICAgICAgICAgICAgY29uZmlybS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIodHJ1ZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgcHJvbXB0KGNvbnRlbnQ6IHN0cmluZyB8IEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jb25Nb2RhbE1vdW50KCk7XG5cbiAgICAgICAgY29uc3QgcHJvbXB0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1wcm9tcHRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1vZGFsLW1lc3NhZ2VcIj48L3A+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibW9kYWwtaW5wdXRcIiB0eXBlPVwidGV4dFwiIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLWNhbmNlbFwiPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBwcm9tcHQuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBjb250ZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbXB0LmNoaWxkcmVuWzBdLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocHJvbXB0KTtcblxuICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9tcHQucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsVW5tb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZmluaXNoKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgY29uc3QgY2xpY2tvdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gdGhpcy5jb250YWluZXIgfHwgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCAhPT0gcHJvbXB0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtY2FuY2VsXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgcG9wdXAoY29udGVudDogc3RyaW5nIHwgRWxlbWVudCwgb25Nb3VudD86ICgpID0+IHZvaWQsIG9uVW5tb3VudD86ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jb25Nb2RhbE1vdW50KCk7XG5cbiAgICAgICAgY29uc3QgcG9wdXAgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsIG1vZGFsLWFsZXJ0IG1vZGFsLXBvcHVwXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLW1lc3NhZ2VcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBwb3B1cC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3B1cC5jaGlsZHJlblswXS5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBvcHVwKTtcblxuICAgICAgICBwb3B1cC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gb25Nb3VudD8uY2FsbCh1bmRlZmluZWQpKTtcblxuICAgICAgICBsZXQgY2xvc2U6ICgpID0+IHZvaWQ7XG5cbiAgICAgICAgY29uc3Qgb3V0ID0gW1xuICAgICAgICAgICAgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmFkZChmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IG9uVW5tb3VudD8uY2FsbCh1bmRlZmluZWQpKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsVW5tb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjbG9zZSA9IGRvbmU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBlc2MgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5jb2RlID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY2xpY2tvdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICE9PSB0aGlzLmNvbnRhaW5lciB8fCB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkICE9PSBwb3B1cCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgICAgICBwb3B1cC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRvbmUpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgIF0gYXMgW1Byb21pc2U8dm9pZD4sICgoKSA9PiB2b2lkKT9dO1xuXG4gICAgICAgIG91dC5wdXNoKGNsb3NlISk7XG5cbiAgICAgICAgcmV0dXJuIG91dCBhcyBbUHJvbWlzZTx2b2lkPiwgKCkgPT4gdm9pZF07XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIE1vdXNlTWFuYWdlciB7XG4gICAgc3RhdGljICNtb3VzZSA9IHsgeDogMCwgeTogMCB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZWRvd25zID0gbmV3IFNldDwoZTogTW91c2VFdmVudCkgPT4gdm9pZD4oKTtcbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNldXBzID0gbmV3IFNldDwoZTogTW91c2VFdmVudCkgPT4gdm9pZD4oKTtcbiAgICBzdGF0aWMgcmVhZG9ubHkgI3RvdWNoc3RhcnRzID0gbmV3IFNldDwoZTogVG91Y2hFdmVudCkgPT4gdm9pZD4oKTtcbiAgICBzdGF0aWMgcmVhZG9ubHkgI3RvdWNoZW5kcyA9IG5ldyBTZXQ8KGU6IFRvdWNoRXZlbnQpID0+IHZvaWQ+KCk7XG5cbiAgICBzdGF0aWMgI21vdXNlbW92ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmZvckVhY2goKGwpID0+IGwuY2FsbCh1bmRlZmluZWQsIGUpKTtcbiAgICB9O1xuXG4gICAgc3RhdGljICNtb3VzZXVwID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICB0aGlzLiNtb3VzZXVwcy5mb3JFYWNoKChsKSA9PiBsLmNhbGwodW5kZWZpbmVkLCBlKSk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjdG91Y2htb3ZlID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjdG91Y2hzdGFydCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xuXG4gICAgICAgIHRoaXMuI3RvdWNoc3RhcnRzLmZvckVhY2goKGwpID0+IGwuY2FsbCh1bmRlZmluZWQsIGUpKTtcbiAgICB9O1xuXG4gICAgc3RhdGljICN0b3VjaGVuZCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jdG91Y2hlbmRzLmZvckVhY2goKGwpID0+IGwuY2FsbCh1bmRlZmluZWQsIGUpKTtcbiAgICB9O1xuXG4gICAgc3RhdGljIHN0YXJ0KCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuI21vdXNlbW92ZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy4jdG91Y2htb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy4jdG91Y2hzdGFydCk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLiN0b3VjaGVuZCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0b3AoKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLiN0b3VjaG1vdmUpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLiN0b3VjaHN0YXJ0KTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuI3RvdWNoZW5kKTtcblxuICAgICAgICB0aGlzLiNtb3VzZSA9IHsgeDogMCwgeTogMCB9O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG5cbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5jbGVhcigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbk1vdXNlRG93bihoYW5kbGVyOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmFkZChoYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb25Nb3VzZVVwKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmFkZChoYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmTW91c2VEb3duKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuZGVsZXRlKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZNb3VzZVVwKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmRlbGV0ZShoYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb25Ub3VjaFN0YXJ0KGhhbmRsZXI6IChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI3RvdWNoc3RhcnRzLmFkZChoYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb25Ub3VjaEVuZChoYW5kbGVyOiAoZTogVG91Y2hFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiN0b3VjaGVuZHMuYWRkKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZUb3VjaFN0YXJ0KGhhbmRsZXI6IChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI3RvdWNoc3RhcnRzLmRlbGV0ZShoYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmVG91Y2hFbmQoaGFuZGxlcjogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jdG91Y2hlbmRzLmRlbGV0ZShoYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IG1vdXNlKCkge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLiNtb3VzZSB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEdFVF9HUkFZX0NPTE9SLCBRVUlDS1BJQ0tfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBDYW52YXNNYW5hZ2VyIH0gZnJvbSBcIi4vQ2FudmFzTWFuYWdlclwiO1xuXG5leHBvcnQgdHlwZSBRdWlja1BpY2tDb250ZXh0ID0ge1xuICAgIGxpc3RlbmVyczoge1xuICAgICAgICBtb3VzZXVwOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICB9O1xufTtcblxuZXhwb3J0IHR5cGUgUXVpY2tQaWNrQWN0aW9ucyA9IHtcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIGNhbGxiYWNrOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbn1bXTtcblxuZXhwb3J0IGNsYXNzIFF1aWNrUGlja01hbmFnZXIge1xuICAgIHN0YXRpYyAjbGluZTogW2Zyb206IE1vdXNlRXZlbnQsIHRvOiBNb3VzZUV2ZW50XSB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyBhc3luYyBhY3RpdmF0ZShldmVudDogTW91c2VFdmVudCwgYWN0aW9uczogUXVpY2tQaWNrQWN0aW9ucykge1xuICAgICAgICBjb25zdCBxdWlja3BpY2sgPSBodG1sYDxkaXYgY2xhc3M9XCJxdWlja3BpY2tcIj48L2Rpdj5gO1xuXG4gICAgICAgIGNvbnN0IGtleXMgPSBhY3Rpb25zLm1hcCgoeyBsYWJlbCB9KSA9PiBsYWJlbCk7XG5cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoICE9PSBuZXcgU2V0KGtleXMpLnNpemUpIHRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZSBsYWJlbHMgaW4gcXVpY2twaWNrIGFjdGlvbnMuXCIpO1xuXG4gICAgICAgIHF1aWNrcGljay5pbm5lckhUTUwgPSBhY3Rpb25zXG4gICAgICAgICAgICAubWFwKCh7IGxhYmVsIH0sIGkpID0+IGA8ZGl2IGNsYXNzPVwicXVpY2twaWNrLWl0ZW0gaW5kZXgtJHtpfVwiPiR7bGFiZWx9PC9kaXY+YClcbiAgICAgICAgICAgIC5qb2luKFwiXCIpO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjaXJjbGUgPSBodG1sYFxuICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJxdWlja3BpY2stY2lyY2xlXCJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIke1FVSUNLUElDS19TSVpFICogMn1cIlxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIke1FVSUNLUElDS19TSVpFICogMn1cIlxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uPVwiMS4xXCJcbiAgICAgICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgICAgICAgICAgICAgICBjeD1cIiR7UVVJQ0tQSUNLX1NJWkV9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN5PVwiJHtRVUlDS1BJQ0tfU0laRX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgcj1cIiR7UVVJQ0tQSUNLX1NJWkUgLyAyIC0gMSAtIDF9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiR7R0VUX0dSQVlfQ09MT1IoKX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMnB4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgJHthY3Rpb25zLm1hcCgoXywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSAoKDIgKiBNYXRoLlBJKSAvIGFjdGlvbnMubGVuZ3RoKSAqIGkgLSBNYXRoLlBJIC8gMiAtIE1hdGguUEkgLyBhY3Rpb25zLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZVBhdGggPSBgTSR7TWF0aC5jb3MoYW5nbGUpICogKFFVSUNLUElDS19TSVpFIC0gMSAtIDEpICsgUVVJQ0tQSUNLX1NJWkV9LCR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oYW5nbGUpICogKFFVSUNLUElDS19TSVpFIC0gMSAtIDEpICsgUVVJQ0tQSUNLX1NJWkVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gTCR7TWF0aC5jb3MoYW5nbGUpICogKFFVSUNLUElDS19TSVpFIC8gMiAtIDEgLSAxKSArIFFVSUNLUElDS19TSVpFfSwke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguc2luKGFuZ2xlKSAqIChRVUlDS1BJQ0tfU0laRSAvIDIgLSAxIC0gMSkgKyBRVUlDS1BJQ0tfU0laRVxuICAgICAgICAgICAgICAgICAgICAgICAgfWA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgPHBhdGggZD1cIiR7bGluZVBhdGh9XCIgc3R5bGU9XCJzdHJva2U6ICR7R0VUX0dSQVlfQ09MT1IoKX07IHN0cm9rZS13aWR0aDogMnB4OyBmaWxsOiBub25lO1wiIC8+YDtcbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICBgO1xuXG4gICAgICAgICAgICBxdWlja3BpY2suYXBwZW5kQ2hpbGQoY2lyY2xlKTtcblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGNpcmNsZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIGNpcmNsZS5zdHlsZS5sZWZ0ID0gZXZlbnQuY2xpZW50WCAtIHdpZHRoIC8gMiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBjaXJjbGUuc3R5bGUudG9wID0gZXZlbnQuY2xpZW50WSAtIGhlaWdodCAvIDIgKyBcInB4XCI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYWN0aW9ucy5mb3JFYWNoKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSAoKDIgKiBNYXRoLlBJKSAvIGFjdGlvbnMubGVuZ3RoKSAqIGkgLSBNYXRoLlBJIC8gMjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBNYXRoLmNvcyhhbmdsZSkgKiBRVUlDS1BJQ0tfU0laRTtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gTWF0aC5zaW4oYW5nbGUpICogUVVJQ0tQSUNLX1NJWkU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcXVpY2twaWNrLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmluZGV4LVwiICsgaSkhO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBpICogKDIwMCAvIGFjdGlvbnMubGVuZ3RoKSArIFwibXNcIjtcbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gaSAqICgyMDAgLyBhY3Rpb25zLmxlbmd0aCkgKyBcIm1zXCI7XG5cbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSBldmVudC5jbGllbnRYICsgKDIgKiB4KSAvIDMgLSB3aWR0aCAvIDIgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZS50b3AgPSBldmVudC5jbGllbnRZICsgKDIgKiB5KSAvIDMgLSBoZWlnaHQgLyAyICsgXCJweFwiO1xuXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gZXZlbnQuY2xpZW50WCArIHggLSB3aWR0aCAvIDIgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUudG9wID0gZXZlbnQuY2xpZW50WSArIHkgLSBoZWlnaHQgLyAyICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocXVpY2twaWNrKTtcblxuICAgICAgICB0aGlzLiNsaW5lID0gW2V2ZW50LCBldmVudF07XG5cbiAgICAgICAgY29uc3QgbW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+ICh0aGlzLiNsaW5lID0gW2V2ZW50LCBlXSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJtb3VzZXVwXCIsXG4gICAgICAgICAgICAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5oeXBvdChlLmNsaWVudFggLSBldmVudC5jbGllbnRYLCBlLmNsaWVudFkgLSBldmVudC5jbGllbnRZKTtcblxuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+PSBRVUlDS1BJQ0tfU0laRSAvIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLmF0YW4yKGUuY2xpZW50WSAtIGV2ZW50LmNsaWVudFksIGUuY2xpZW50WCAtIGV2ZW50LmNsaWVudFgpICsgTWF0aC5QSSAvIDI7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xvc2VzdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAoTWF0aC5yb3VuZChhbmdsZSAvICgoMiAqIE1hdGguUEkpIC8gYWN0aW9ucy5sZW5ndGgpKSArIGFjdGlvbnMubGVuZ3RoKSAlIGFjdGlvbnMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnNbY2xvc2VzdF0uY2FsbGJhY2suY2FsbCh1bmRlZmluZWQsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBxdWlja3BpY2sucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI2xpbmUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyBvbmNlOiB0cnVlIH0sXG4gICAgICAgICk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJtb3VzZWxlYXZlXCIsXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcXVpY2twaWNrLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNsaW5lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgb25jZTogdHJ1ZSB9LFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW5kZXIoeyBmZyB9OiB7IGZnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSkge1xuICAgICAgICBpZiAodGhpcy4jbGluZSkge1xuICAgICAgICAgICAgY29uc3QgW2Zyb20sIHRvXSA9IHRoaXMuI2xpbmU7XG5cbiAgICAgICAgICAgIGZnLmZpbGxTdHlsZSA9IEdFVF9HUkFZX0NPTE9SKCk7XG4gICAgICAgICAgICBmZy5zdHJva2VTdHlsZSA9IEdFVF9HUkFZX0NPTE9SKCk7XG5cbiAgICAgICAgICAgIGZnLmxpbmVXaWR0aCA9IDE7XG5cbiAgICAgICAgICAgIGZnLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgZmcuYXJjKGZyb20uY2xpZW50WCwgZnJvbS5jbGllbnRZLCAyLCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgICAgICBmZy5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIGZnLmZpbGwoKTtcblxuICAgICAgICAgICAgZmcuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBmZy5tb3ZlVG8oZnJvbS5jbGllbnRYLCBmcm9tLmNsaWVudFkpO1xuICAgICAgICAgICAgZmcubGluZVRvKHRvLmNsaWVudFgsIHRvLmNsaWVudFkpO1xuICAgICAgICAgICAgZmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBmZy5zdHJva2UoKTtcblxuICAgICAgICAgICAgZmcuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBmZy5hcmModG8uY2xpZW50WCwgdG8uY2xpZW50WSwgMiwgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgZmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBmZy5maWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdCgpIHtcbiAgICAgICAgQ2FudmFzTWFuYWdlci5hZGRKb2IodGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBJTl9ERUJVR19NT0RFLCBMSUdIVF9HUkFZX0NTU19DT0xPUiwgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBTZXJpYWxpemVkRGlhZ3JhbSwgZnJvbUZpbGUsIHNhdmVEaWFncmFtIH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi4vcmVpZmllZC9EaXNwbGF5XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQsIGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBTZXZlblNlZ21lbnREaXNwbGF5IH0gZnJvbSBcIi4uL3JlaWZpZWQvU2V2ZW5TZWdtZW50RGlzcGxheVwiO1xuaW1wb3J0IHsgQ2FudmFzTWFuYWdlciB9IGZyb20gXCIuL0NhbnZhc01hbmFnZXJcIjtcbmltcG9ydCB7IERhcmttb2RlTWFuYWdlciB9IGZyb20gXCIuL0Rhcmttb2RlTWFuYWdlclwiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1lbnVNYW5hZ2VyLCBNZW51TWFuYWdlckFjdGlvbnMgfSBmcm9tIFwiLi9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4vTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFF1aWNrUGlja01hbmFnZXIgfSBmcm9tIFwiLi9RdWlja1BpY2tNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4vU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgU2V0dGluZ3NNYW5hZ2VyIH0gZnJvbSBcIi4vU2V0dGluZ3NNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuL1N0b3JhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFRvb2xzTWFuYWdlciB9IGZyb20gXCIuL1Rvb2xzTWFuYWdlclwiO1xuaW1wb3J0IHsgVW5kb1JlZG9NYW5hZ2VyIH0gZnJvbSBcIi4vVW5kb1JlZG9NYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9XaXJpbmdNYW5hZ2VyXCI7XG5cbnR5cGUgU2FuZGJveENvbmZpZyA9IHtcbiAgICBrZXliaW5kcz86IFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiAgICBtZW51PzogTWVudU1hbmFnZXJBY3Rpb25zO1xuICAgIGluaXRpYWw/OiBbY29tcG9uZW50czogUmVpZmllZFtdLCB3aXJlczogV2lyaW5nW11dO1xuICAgIGxpbWl0cz86IHtcbiAgICAgICAgaW5wdXRzPzogbnVtYmVyO1xuICAgICAgICBvdXRwdXRzPzogbnVtYmVyO1xuICAgICAgICB3aXJpbmdzPzogbnVtYmVyO1xuICAgICAgICBjaGlwcz86IFJlY29yZDxzdHJpbmcsIG51bWJlcj47XG4gICAgICAgIGNoaXBzVG90YWw/OiBudW1iZXI7XG4gICAgICAgIGNvbXBvbmVudHNUb3RhbD86IG51bWJlcjtcbiAgICB9O1xuICAgIHN0YXRlcz86IHsgaW5wdXRzPzogYm9vbGVhbltdOyBvdXRwdXRzPzogYm9vbGVhbltdOyBjYWxsYmFjazogKCkgPT4gdm9pZCB9W107XG4gICAgc2F2ZT86IHN0cmluZztcbiAgICBvdmVycmlkZVNhdmVJZkV4aXN0cz86IGJvb2xlYW47XG4gICAgY2hlY2tJbnRlcnZhbD86IG51bWJlcjtcbiAgICBjaGVja1N0YXRlPzogKHJlaWZpZWQ6IFdhdGNoZWRTZXQ8UmVpZmllZD4sIHdpcmluZ3M6IFdhdGNoZWRTZXQ8V2lyaW5nPikgPT4gYm9vbGVhbjtcbiAgICBpZlN0YXRlQ2hlY2tlZD86ICgpID0+IHZvaWQ7XG4gICAgc2V0dGluZ3M/OiB7IHNuYXBUb0dyaWQ/OiBib29sZWFuIH07XG59O1xuXG5jb25zdCBjYWxjdWxhdGVSZWlmaWVkVG90YWxzID0gKHNldDogU2V0PFJlaWZpZWQ+KSA9PlxuICAgIFsuLi5zZXRdLnJlZHVjZShcbiAgICAgICAgKG1hcCwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBJbnB1dCkge1xuICAgICAgICAgICAgICAgIG1hcC5pbnB1dHNUb3RhbCsrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtIGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgbWFwLm91dHB1dHNUb3RhbCsrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtIGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgbWFwLmNoaXBzVG90YWwrKztcblxuICAgICAgICAgICAgICAgIG1hcC5jaGlwcy5zZXQoaXRlbS5jaGlwLm5hbWUsIChtYXAuY2hpcHMuZ2V0KGl0ZW0uY2hpcC5uYW1lKSA/PyAwKSArIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtIGluc3RhbmNlb2YgRGlzcGxheSB8fCBpdGVtIGluc3RhbmNlb2YgU2V2ZW5TZWdtZW50RGlzcGxheSkge1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaW5wdXRzVG90YWw6IDAsXG4gICAgICAgICAgICBvdXRwdXRzVG90YWw6IDAsXG4gICAgICAgICAgICBjaGlwc1RvdGFsOiAwLFxuICAgICAgICAgICAgY2hpcHM6IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCksXG4gICAgICAgIH0sXG4gICAgKTtcblxuZXhwb3J0IGNsYXNzIFNhbmRib3hNYW5hZ2VyIHtcbiAgICBzdGF0aWMgcXVldWVOZXdDb250ZXh0OiBSZXR1cm5UeXBlPHR5cGVvZiBNZW51TWFuYWdlcltcInVzZVwiXT5bMF07XG4gICAgc3RhdGljIGtpbGxNZW51OiBSZXR1cm5UeXBlPHR5cGVvZiBNZW51TWFuYWdlcltcInVzZVwiXT5bMV07XG5cbiAgICBzdGF0aWMgd2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyAjaW50ZXJ2YWwgPSAtMTtcbiAgICBzdGF0aWMgI29ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljICNoaXN0b3J5ID0gbmV3IEFycmF5PFtjb21tYW5kOiAoKSA9PiB2b2lkLCByZWRvOiAoKSA9PiB2b2lkXT4oKTtcbiAgICBzdGF0aWMgI3JlZG9zID0gbmV3IEFycmF5PFtjb21tYW5kOiAoKSA9PiB2b2lkLCByZWRvOiAoKSA9PiB2b2lkXT4oKTtcblxuICAgIHN0YXRpYyAjY29uZmlnOiBTYW5kYm94Q29uZmlnO1xuXG4gICAgc3RhdGljIHNldHVwKGNvbmZpZzogU2FuZGJveENvbmZpZykge1xuICAgICAgICBpZiAodGhpcy4jb2JzZXJ2ZXIpIHRoaXMuI29ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuI2ludGVydmFsKTtcblxuICAgICAgICB0aGlzLiNjb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGFpbmVyIG1vZGFsLWluYWN0aXZlXCI+PC9kaXY+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8ZGl2IGNsYXNzPVwicmVpZmllZC1yb290XCI+PC9kaXY+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZC1jYW52YXNcIj48L2NhbnZhcz5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxjYW52YXMgY2xhc3M9XCJmb3JlZ3JvdW5kLWNhbnZhc1wiPjwvY2FudmFzPmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGRpdiBjbGFzcz1cInRvYXN0cy1jb250YWluZXJcIj48L2Rpdj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxidXR0b24gY2xhc3M9XCJ0b29sc1wiPjwvYnV0dG9uPmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGJ1dHRvbiBjbGFzcz1cInNldHRpbmdzXCI+PC9idXR0b24+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8YnV0dG9uIGNsYXNzPVwiZGFya21vZGVcIj48L2J1dHRvbj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxidXR0b24gY2xhc3M9XCJ1bmRvXCI+PC9idXR0b24+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8YnV0dG9uIGNsYXNzPVwicmVkb1wiPjwvYnV0dG9uPmApO1xuXG4gICAgICAgIE1vdXNlTWFuYWdlci5zdGFydCgpO1xuICAgICAgICBLZXliaW5kc01hbmFnZXIubGlzdGVuKCk7XG4gICAgICAgIFNlbGVjdGlvbk1hbmFnZXIubGlzdGVuKCk7XG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5saXN0ZW4oKTtcbiAgICAgICAgV2lyaW5nTWFuYWdlci5pbml0KCk7XG4gICAgICAgIFF1aWNrUGlja01hbmFnZXIuaW5pdCgpO1xuXG4gICAgICAgIENhbnZhc01hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgICBUb29sc01hbmFnZXIubGlzdGVuKCk7XG4gICAgICAgIFNldHRpbmdzTWFuYWdlci5saXN0ZW4oKTtcblxuICAgICAgICBEYXJrbW9kZU1hbmFnZXIubGlzdGVuKCkub25DaGFuZ2UoKCkgPT4gRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSh7IG9ubHlVcGRhdGVDb2xvcjogdHJ1ZSB9KSk7XG5cbiAgICAgICAgVW5kb1JlZG9NYW5hZ2VyLmxpc3RlbigpO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZVJlaWZpZWRBY3RpdmUgPSAoY29tcG9uZW50czogUmVpZmllZFtdKSA9PlxuICAgICAgICAgICAgbmV3IFdhdGNoZWRTZXQ8UmVpZmllZD4oKVxuICAgICAgICAgICAgICAgIC5vbkFkZCgoaXRlbSwgc2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFscyA9IGNhbGN1bGF0ZVJlaWZpZWRUb3RhbHMoc2V0LmNsb25lKCkuYWRkKGl0ZW0pKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHMuY2hpcHNUb3RhbCArIHRvdGFscy5pbnB1dHNUb3RhbCArIHRvdGFscy5vdXRwdXRzVG90YWwgPlxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuI2NvbmZpZy5saW1pdHM/LmNvbXBvbmVudHNUb3RhbCA/PyBJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgY29tcG9uZW50cyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFscy5pbnB1dHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5pbnB1dHMgPz8gSW5maW5pdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgaW5wdXRzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxzLm91dHB1dHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5vdXRwdXRzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIG91dHB1dHMgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbHMuY2hpcHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5jaGlwc1RvdGFsID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIGNoaXBzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtIGluc3RhbmNlb2YgQ29tcG9uZW50ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHMuY2hpcHMuaGFzKGl0ZW0uY2hpcC5uYW1lKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzLmNoaXBzLmdldChpdGVtLmNoaXAubmFtZSkhID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LmNoaXBzPy5baXRlbS5jaGlwLm5hbWVdID8/IEluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYEV4Y2VlZGVkIHRvdGFsICcke2l0ZW0uY2hpcC5uYW1lfScgbGltaXQuYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub25BZGQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWRkQWxsKGNvbXBvbmVudHMpO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZVdpcmluZ3NTZXQgPSAod2lyaW5nczogV2lyaW5nW10pID0+XG4gICAgICAgICAgICBuZXcgV2F0Y2hlZFNldDxXaXJpbmc+KClcbiAgICAgICAgICAgICAgICAub25BZGQoKF8sIHNldCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0LnNpemUgKyAxID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LndpcmluZ3MgPz8gSW5maW5pdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgd2lyaW5ncyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWRkQWxsKHdpcmluZ3MpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLm1lbnUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICBbdGhpcy5xdWV1ZU5ld0NvbnRleHQsIHRoaXMua2lsbE1lbnVdID0gTWVudU1hbmFnZXIudXNlKFJlaWZpZWQucm9vdCwgdGhpcy4jY29uZmlnLm1lbnUpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLmtleWJpbmRzICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy4jY29uZmlnLmtleWJpbmRzKS5mb3JFYWNoKChbY2hvcmQsIHJ1bl0pID0+IEtleWJpbmRzTWFuYWdlci5vbktleUNob3JkKGNob3JkLCBydW4pKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5pbml0aWFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlID0gY3JlYXRlUmVpZmllZEFjdGl2ZSh0aGlzLiNjb25maWcuaW5pdGlhbFswXSk7XG5cbiAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmF0dGFjaCgpKTtcblxuICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcyA9IGNyZWF0ZVdpcmluZ3NTZXQodGhpcy4jY29uZmlnLmluaXRpYWxbMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcuc2F2ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IFN0b3JhZ2VNYW5hZ2VyLmdldDxzdHJpbmc+KFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSk7XG5cbiAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBbc2V0dGluZ3MsIGNvbXBvbmVudHMsIHdpcmVzXSxcbiAgICAgICAgICAgICAgICB9ID0gZnJvbUZpbGUoZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuZGVsZXRlKFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKElOX0RFQlVHX01PREUpIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcmVhZCBmcm9tIHNhdmVzOlwiLCBlcnJvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHJlYWQgZnJvbSBzYXZlcy5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuI2NvbmZpZy5vdmVycmlkZVNhdmVJZkV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5UmF3U2V0dGluZ3Moc2V0dGluZ3MhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUgPSBjcmVhdGVSZWlmaWVkQWN0aXZlKGNvbXBvbmVudHMhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQuYXR0YWNoKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzID0gY3JlYXRlV2lyaW5nc1NldCh3aXJlcyEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLnNhdmUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFxuICAgICAgICAgICAgICAgICAgICBcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUsXG4gICAgICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIub2JzZXJ2ZShSZWlmaWVkLnJvb3QsIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsXG4gICAgICAgICAgICBjaGFyYWN0ZXJEYXRhT2xkVmFsdWU6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrID0gdGhpcy4jY29uZmlnLmNoZWNrU3RhdGU/LihSZWlmaWVkLmFjdGl2ZS5jbG9uZSgpLCBXaXJpbmdNYW5hZ2VyLndpcmVzLmNsb25lKCkpID8/IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoY2hlY2spIHRoaXMuI2NvbmZpZy5pZlN0YXRlQ2hlY2tlZD8uKCk7XG4gICAgICAgIH0sIHRoaXMuI2NvbmZpZy5jaGVja0ludGVydmFsID8/IDUwKSBhcyBuZXZlcjtcblxuICAgICAgICBpZiAoIVN0b3JhZ2VNYW5hZ2VyLmdldChcInVzZWRoZWxwXCIpKVxuICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlByZXNzICc/JyBmb3IgaGVscC5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogTElHSFRfR1JBWV9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGZvcmNlU2F2ZSgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcuc2F2ZSAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcbiAgICAgICAgICAgICAgICBcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUsXG4gICAgICAgICAgICAgICAgc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICBpZiAodGhpcy4jb2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblxuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuI2ludGVydmFsKTtcblxuICAgICAgICB0aGlzLiNpbnRlcnZhbCA9IC0xO1xuXG4gICAgICAgIE1vdXNlTWFuYWdlci5yZXNldCgpO1xuICAgICAgICBLZXliaW5kc01hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5yZXNldCgpO1xuICAgICAgICBEcmFnZ2luZ01hbmFnZXIucmVzZXQoKTtcblxuICAgICAgICBDYW52YXNNYW5hZ2VyLnN0b3AoKTtcblxuICAgICAgICBUb29sc01hbmFnZXIuc3RvcCgpO1xuICAgICAgICBTZXR0aW5nc01hbmFnZXIuc3RvcCgpO1xuICAgICAgICBEYXJrbW9kZU1hbmFnZXIuc3RvcCgpO1xuICAgICAgICBVbmRvUmVkb01hbmFnZXIuc3RvcCgpO1xuXG4gICAgICAgIE1lbnVNYW5hZ2VyLnJlbW92ZShSZWlmaWVkLnJvb3QpO1xuXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZm9yRWFjaCgoZmluaXNoKSA9PiBmaW5pc2guY2FsbCh1bmRlZmluZWQpKTtcblxuICAgICAgICB0aGlzLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuY2xlYXIoKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgdGhpcy4jY29uZmlnID0ge307XG5cbiAgICAgICAgdGhpcy4jaGlzdG9yeSA9IFtdO1xuICAgICAgICB0aGlzLiNyZWRvcyA9IFtdO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBjbGVhcigpIHtcbiAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQuZGV0YWNoKCkpO1xuXG4gICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4gd2lyZS5kZXN0cm95KCkpO1xuXG4gICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcHVzaEhpc3RvcnkoY29tbWFuZDogKCkgPT4gdm9pZCwgdW5kbzogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNyZWRvcy5sZW5ndGggPSAwO1xuXG4gICAgICAgIGNvbW1hbmQuY2FsbCh1bmRlZmluZWQpO1xuXG4gICAgICAgIHRoaXMuI2hpc3RvcnkucHVzaChbY29tbWFuZCwgdW5kb10pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBwb3BIaXN0b3J5KCkge1xuICAgICAgICBpZiAoIXRoaXMuI2hpc3RvcnkubGVuZ3RoKSB7XG4gICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTm90aGluZyB0byB1bmRvLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IFtyZWRvLCB1bmRvXSA9IHRoaXMuI2hpc3RvcnkucG9wKCkhO1xuXG4gICAgICAgIHRoaXMuI3JlZG9zLnB1c2goW3JlZG8sIHVuZG9dKTtcblxuICAgICAgICB1bmRvLmNhbGwodW5kZWZpbmVkKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVkb0hpc3RvcnkoKSB7XG4gICAgICAgIGlmICghdGhpcy4jcmVkb3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTm90aGluZyB0byByZWRvLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IFtjb21tYW5kLCB1bmRvXSA9IHRoaXMuI3JlZG9zLnBvcCgpITtcblxuICAgICAgICB0aGlzLiNoaXN0b3J5LnB1c2goW2NvbW1hbmQsIHVuZG9dKTtcblxuICAgICAgICBjb21tYW5kLmNhbGwodW5kZWZpbmVkKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgYXBwbHlTZXR0aW5ncyhzZXR0aW5nczogU2FuZGJveENvbmZpZ1tcInNldHRpbmdzXCJdICYge30pIHtcbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQgPSBzZXR0aW5ncy5zbmFwVG9HcmlkID8/IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBhcHBseVJhd1NldHRpbmdzKHNldHRpbmdzOiBTZXJpYWxpemVkRGlhZ3JhbVtcInNldHRpbmdzXCJdKSB7XG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkID0gc2V0dGluZ3NbXCJEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZFwiXTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHNhdmVkTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2NvbmZpZy5zYXZlO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBzYXZlVG8oc2F2ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI2NvbmZpZy5zYXZlID0gc2F2ZTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5oYXMoXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlKSAmJlxuICAgICAgICAgICAgIShhd2FpdCBNb2RhbE1hbmFnZXIuY29uZmlybShcbiAgICAgICAgICAgICAgICBcIlRoZXJlIGlzIGFscmVhZHkgYSBzYXZlIHdpdGggdGhpcyBuYW1lLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVwbGFjZSBpdD9cIixcbiAgICAgICAgICAgICkpXG4gICAgICAgIClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLCBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jaXJjdWxhclwiO1xuaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgR0VUX0FDVElWQVRFRF9DT0xPUiwgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBmcm9tRmlsZSwgc2F2ZURpYWdyYW0gfSBmcm9tIFwiLi4vZmlsZXNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGlzcGxheSB9IGZyb20gXCIuLi9yZWlmaWVkL0Rpc3BsYXlcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCwgb3ZlcmxhcHBlZEJvdW5kcyB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFNldmVuU2VnbWVudERpc3BsYXkgfSBmcm9tIFwiLi4vcmVpZmllZC9TZXZlblNlZ21lbnREaXNwbGF5XCI7XG5pbXBvcnQgeyBDYW52YXNNYW5hZ2VyIH0gZnJvbSBcIi4vQ2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4vVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vV2lyaW5nTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uTWFuYWdlciB7XG4gICAgc3RhdGljIHNlbGVjdGVkID0gbmV3IFdhdGNoZWRTZXQ8UmVpZmllZD4oKTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcblxuICAgICAgICBjb25zdCBlbGVtZW50ID0gW1xuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJidXR0b24uYm9hcmQtaW5wdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1vdXRwdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5jb21wb25lbnRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5kaXNwbGF5XCIpLFxuICAgICAgICBdLmZpbmQoKGVsZW1lbnQpID0+IGVsZW1lbnQgIT09IG51bGwpO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbmQoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmVsZW1lbnQgPT09IGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChyZWlmaWVkKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKElTX01BQ19PUyAmJiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIk1ldGFMZWZ0XCIpIHx8IEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJNZXRhUmlnaHRcIikpKSB8fFxuICAgICAgICAgICAgICAgICghSVNfTUFDX09TICYmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiQ29udHJvbExlZnRcIikgfHwgS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIkNvbnRyb2xSaWdodFwiKSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3Rpb24ocmVpZmllZCk7XG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5zZWxlY3RlZC5oYXMocmVpZmllZCkpIHRoaXMuc2VsZWN0KHJlaWZpZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjY29weSA9IGFzeW5jIChlOiBDbGlwYm9hcmRFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC5zaXplKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gWy4uLnRoaXMuc2VsZWN0ZWRdO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gc2F2ZURpYWdyYW0oXG4gICAgICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICAgICAgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgKHdpcmluZykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LnNvbWUoKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkgcmV0dXJuIHdpcmluZy5mcm9tID09PSBjb21wb25lbnQuZWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50IGluc3RhbmNlb2YgU2V2ZW5TZWdtZW50RGlzcGxheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5vdXRwdXRzLnNvbWUoKG91dHB1dCkgPT4gd2lyaW5nLmZyb20gPT09IG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5zb21lKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiB3aXJpbmcudG8gPT09IGNvbXBvbmVudC5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgaW5zdGFuY2VvZiBTZXZlblNlZ21lbnREaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50LmlucHV0cy5zb21lKChpbnB1dCkgPT4gd2lyaW5nLnRvID09PSBpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChkYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3Bhc3RlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIHJlc3VsdDogWywgY29tcG9uZW50cywgd2lyaW5nc10sXG4gICAgICAgIH0gPSBmcm9tRmlsZShhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCkpO1xuXG4gICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHBhc3RlIGRpYWdyYW0gZGF0YS5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBtb3VzZSA9IHsgLi4uTW91c2VNYW5hZ2VyLm1vdXNlIH07XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGRBbGwoY29tcG9uZW50cyEpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudHMhLmV2ZXJ5KChjb21wb25lbnQpID0+IFJlaWZpZWQuYWN0aXZlLmhhcyhjb21wb25lbnQpKSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgaW5zdGFuY2VvZiBTZXZlblNlZ21lbnREaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBjb21wb25lbnQudXBkYXRlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1vdXNlTWFuYWdlci5tb3VzZS54ICE9PSAtMSAmJiBNb3VzZU1hbmFnZXIubW91c2UueSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSBjb21wb25lbnRzIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF4ID0gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF5ID0gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnggPSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnkgPSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhZCA9IE1hdGguc3FydChheCAqIGF4ICsgYXkgKiBheSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJkID0gTWF0aC5zcXJ0KGJ4ICogYnggKyBieSAqIGJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFkIC0gYmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cyEuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IG1vdXNlLnggKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbW91c2UueSArIG9mZnNldC50b3AgLSB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwod2lyaW5ncyEpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHRoaXMuYWRkU2VsZWN0aW9uKGNvbXBvbmVudCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZUFsbChjb21wb25lbnRzISk7XG5cbiAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5kZWxldGVBbGwod2lyaW5ncyEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goKGNvbXBvbmVudCkgPT4gdGhpcy5hZGRTZWxlY3Rpb24oY29tcG9uZW50KSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBzdGF0aWMgc2VsZWN0KHJlaWZpZWQ6IFJlaWZpZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkKHJlaWZpZWQpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwXCIpKTtcblxuICAgICAgICByZWlmaWVkLmVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDAwXCI7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHNlbGVjdEFsbEluKGZyb206IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSwgdG86IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgY29uc3QgcmVpZmllZCA9IFsuLi5SZWlmaWVkLmFjdGl2ZV0uZmlsdGVyKChjb21wb25lbnQpID0+XG4gICAgICAgICAgICBvdmVybGFwcGVkQm91bmRzKGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBmcm9tLCB0byksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZC5hZGRBbGwocmVpZmllZCk7XG5cbiAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiAoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDBcIikpO1xuXG4gICAgICAgIHJlaWZpZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiAoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDAwXCIpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkU2VsZWN0aW9uKHJlaWZpZWQ6IFJlaWZpZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5hZGQocmVpZmllZCk7XG5cbiAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiAoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDBcIikpO1xuXG4gICAgICAgIHJlaWZpZWQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMDBcIjtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNTZWxlY3RlZChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gWy4uLnRoaXMuc2VsZWN0ZWRdLnNvbWUoKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KSByZXR1cm4gZWxlbWVudCA9PT0gY29tcG9uZW50LmVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiBlbGVtZW50ID09PSBjb21wb25lbnQuZWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkgfHxcbiAgICAgICAgICAgICAgICBjb21wb25lbnQgaW5zdGFuY2VvZiBTZXZlblNlZ21lbnREaXNwbGF5XG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5zb21lKChpbnB1dCkgPT4gZWxlbWVudCA9PT0gaW5wdXQpIHx8XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vdXRwdXRzLnNvbWUoKG91dHB1dCkgPT4gZWxlbWVudCA9PT0gb3V0cHV0KSB8fFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID09PSBjb21wb25lbnQuZWxlbWVudFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVuZGVyKHsgZmcgfTogeyBmZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0pIHtcbiAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgZmcuc3Ryb2tlU3R5bGUgPSBHRVRfQUNUSVZBVEVEX0NPTE9SKCk7XG5cbiAgICAgICAgICAgIGZnLmxpbmVXaWR0aCA9IDE7XG5cbiAgICAgICAgICAgIGZnLmxpbmVKb2luID0gXCJtaXRlclwiO1xuXG4gICAgICAgICAgICBmZy5zdHJva2VSZWN0KHJlY3QubGVmdCAtIDE1LCByZWN0LnRvcCAtIDE1LCByZWN0LndpZHRoICsgMTUgKyAxNSwgcmVjdC5oZWlnaHQgKyAxNSArIDE1KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgQ2FudmFzTWFuYWdlci5hZGRKb2IodGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIHRoaXMuI2NvcHkpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIiwgdGhpcy4jcGFzdGUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWFmZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29weVwiLCB0aGlzLiNjb3B5KTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIHRoaXMuI3Bhc3RlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBEYXJrbW9kZU1hbmFnZXIgfSBmcm9tIFwiLi9EYXJrbW9kZU1hbmFnZXJcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4vTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vV2lyaW5nTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NNYW5hZ2VyIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgI2NoYW5nZXMgPSBuZXcgU2V0PCgpID0+IHZvaWQ+KCk7XG5cbiAgICBzdGF0aWMgZ2V0ICNlbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCJidXR0b24uc2V0dGluZ3NcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbkNoYW5nZShydW46ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jY2hhbmdlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmQ2hhbmdlKHJ1bjogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNjaGFuZ2VzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyAjbGlzdGVuZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZvcm0gPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNldHRpbmdzLWZvcm1cIj5cbiAgICAgICAgICAgICAgICA8aDE+c2V0dGluZ3M8L2gxPlxuXG4gICAgICAgICAgICAgICAgPHA+U2V0dGluZ3MgYXJlIHNhdmVkIGF1dG9tYXRpY2FsbHkuPC9wPlxuXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwic2V0dGluZ3MtY29udHJvbFwiIGZvcj1cImRhcmttb2RlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImRhcmttb2RlXCIgdHlwZT1cImNoZWNrYm94XCIgJHtEYXJrbW9kZU1hbmFnZXIuZGFya21vZGVFbmFibGVkID8gXCJjaGVja2VkXCIgOiBcIlwifSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgZGFyayBtb2RlXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwic2V0dGluZ3MtY29udHJvbFwiIGZvcj1cImRhcmttb2RlTW9kYWxzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZGFya21vZGVNb2RhbHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtEYXJrbW9kZU1hbmFnZXIuZGFya21vZGVNb2RhbHNFbmFibGVkID8gXCJjaGVja2VkXCIgOiBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhcmsgbW9kZSBtb2RhbHNcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInNldHRpbmdzLWNvbnRyb2xcIiBmb3I9XCJzbmFwVG9HcmlkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwic25hcFRvR3JpZFwiIHR5cGU9XCJjaGVja2JveFwiICR7RHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQgPyBcImNoZWNrZWRcIiA6IFwiXCJ9IC8+XG4gICAgICAgICAgICAgICAgICAgIHNuYXAgdG8gZ3JpZFxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzZXR0aW5ncy1jb250cm9sXCIgZm9yPVwiZmFuY3lXaXJlc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJmYW5jeVdpcmVzXCIgdHlwZT1cImNoZWNrYm94XCIgJHtXaXJpbmdNYW5hZ2VyLkZBTkNZX1dJUkVTID8gXCJjaGVja2VkXCIgOiBcIlwifSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFuY3kgd2lyZXNcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cblxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzZXR0aW5ncy1jb250cm9sXCIgZm9yPVwiZmFuY2llcldpcmVzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImZhbmNpZXJXaXJlc1wiIHR5cGU9XCJjaGVja2JveFwiICR7V2lyaW5nTWFuYWdlci5GQU5DSUVSX1dJUkVTID8gXCJjaGVja2VkXCIgOiBcIlwifSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgZmFuY2llciB3aXJlc1xuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwic2V0dGluZ3MtY29udHJvbFwiIGZvcj1cImdhdGVEZWxheVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cImdhdGVEZWxheVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXg9XCIyNTBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIyNVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9XCIke1JlaWZpZWQuR0FURV9ERUxBWX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIGdhdGUgZGVsYXkgKDAtMjUwLzI1KVxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInNldHRpbmdzLWNvbnRyb2xcIiBmb3I9XCJnYXRlRGVsYXlWYXJpYXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJnYXRlRGVsYXlWYXJpYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4PVwiMTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPVwiNVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9XCIke1JlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT059XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICBnYXRlIGRlbGF5IHZhcmlhdGlvbiAoMC0xMDAvNSlcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9XCJ3aWR0aDogNjBweDtcIj5yZXNldDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgbGV0IHJlc2V0ID0gZmFsc2U7XG5cbiAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgRGFya21vZGVNYW5hZ2VyLmRhcmttb2RlRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgRGFya21vZGVNYW5hZ2VyLmRhcmttb2RlTW9kYWxzRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWSA9IDEwMDtcbiAgICAgICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT04gPSAyNTtcblxuICAgICAgICAgICAgcmVzZXQgPSB0cnVlO1xuXG4gICAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBbY2xvc2VkLCBjbG9zZV0gPSBhd2FpdCBNb2RhbE1hbmFnZXIucG9wdXAoZm9ybSk7XG5cbiAgICAgICAgYXdhaXQgY2xvc2VkO1xuXG4gICAgICAgIGlmICghcmVzZXQpIHtcbiAgICAgICAgICAgIERhcmttb2RlTWFuYWdlci5kYXJrbW9kZUVuYWJsZWQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCJpbnB1dFtuYW1lPWRhcmttb2RlXVwiKSEuY2hlY2tlZDtcbiAgICAgICAgICAgIERhcmttb2RlTWFuYWdlci5kYXJrbW9kZU1vZGFsc0VuYWJsZWQgPVxuICAgICAgICAgICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcImlucHV0W25hbWU9ZGFya21vZGVNb2RhbHNdXCIpIS5jaGVja2VkO1xuICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCJpbnB1dFtuYW1lPXNuYXBUb0dyaWRdXCIpIS5jaGVja2VkO1xuICAgICAgICAgICAgV2lyaW5nTWFuYWdlci5GQU5DWV9XSVJFUyA9IGZvcm0ucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcImlucHV0W25hbWU9ZmFuY3lXaXJlc11cIikhLmNoZWNrZWQ7XG4gICAgICAgICAgICBSZWlmaWVkLkdBVEVfREVMQVkgPSBmb3JtLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCJpbnB1dFtuYW1lPWdhdGVEZWxheV1cIikhLnZhbHVlQXNOdW1iZXI7XG4gICAgICAgICAgICBSZWlmaWVkLkdBVEVfREVMQVlfVkFSSUFUSU9OID0gZm9ybS5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgIFwiaW5wdXRbbmFtZT1nYXRlRGVsYXlWYXJpYXRpb25dXCIsXG4gICAgICAgICAgICApIS52YWx1ZUFzTnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybS5yZW1vdmUoKTtcbiAgICB9O1xuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudC5pbm5lclRleHQgPSBcIuKame+4j1wiO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2xpc3RlbmVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jbGlzdGVuZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBicmluZ1VwRm9ybSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xpc3RlbmVyKCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgcHJlZml4ID0gXCJrZWxzbnkuZ2F0ZXNpbTpcIjtcblxuICAgIHN0YXRpYyByZWFkb25seSBzdG9yYWdlID1cbiAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICAgICAgPyB3aW5kb3cubG9jYWxTdG9yYWdlXG4gICAgICAgICAgICA6ICh7XG4gICAgICAgICAgICAgICAgICBjbGVhcigpIHt9LFxuICAgICAgICAgICAgICAgICAgZ2V0SXRlbTogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgICAgICAgIGtleTogKCkgPT4gbnVsbCxcbiAgICAgICAgICAgICAgICAgIGxlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW0oKSB7fSxcbiAgICAgICAgICAgICAgICAgIHNldEl0ZW0oKSB7fSxcbiAgICAgICAgICAgICAgfSBzYXRpc2ZpZXMgU3RvcmFnZSk7XG5cbiAgICBzdGF0aWMgc2V0PFQ+KGtleTogc3RyaW5nLCB2YWx1ZTogVCk6IFQge1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldDxUPihrZXk6IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSkhKSA/PyB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGhhcyhrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXggKyBrZXkpICE9PSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWxldGUoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMucHJlZml4ICsga2V5KSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMucHJlZml4ICsga2V5KTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBERUxBWSwgR0VUX0JJTl9QRVJNUywgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuL1dpcmluZ01hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI3Rlc3RpbmcgPSBmYWxzZTtcblxuICAgIHN0YXRpYyBhc3luYyB0ZXN0KGNhc2VzOiBbaW5wdXRzOiBib29sZWFuW10sIG91dHB1dHM6IGJvb2xlYW5bXV1bXSkge1xuICAgICAgICBpZiAodGhpcy4jdGVzdGluZykgcmV0dXJuIE1vZGFsTWFuYWdlci5hbGVydChcIkRpYWdyYW0gaXMgYWxyZWFkeSB1bmRlciB0ZXN0aW5nLlwiKTtcblxuICAgICAgICBjb25zdCBpbnB1dHMgPSBbLi4uUmVpZmllZC5hY3RpdmVdXG4gICAgICAgICAgICAuZmlsdGVyKChjb21wb25lbnQpOiBjb21wb25lbnQgaXMgSW5wdXQgPT4gY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpXG4gICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUudG9wKSAtIHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLnRvcCkpO1xuICAgICAgICBjb25zdCBvdXRwdXRzID0gWy4uLlJlaWZpZWQuYWN0aXZlXVxuICAgICAgICAgICAgLmZpbHRlcigoY29tcG9uZW50KTogY29tcG9uZW50IGlzIE91dHB1dCA9PiBjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpXG4gICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUudG9wKSAtIHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLnRvcCkpO1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gWy4uLlJlaWZpZWQuYWN0aXZlXS5maWx0ZXIoXG4gICAgICAgICAgICAoY29tcG9uZW50KSA9PiAhKGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KSAmJiAhKGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dCksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy4jdGVzdGluZyA9IHRydWU7XG5cbiAgICAgICAgUmVpZmllZC5hY3RpdmUubG9jaygpO1xuICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmxvY2soKTtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbEFjdGl2YXRpb25zID0gaW5wdXRzLm1hcCgoaW5wdXQpID0+IGlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxEZWxheSA9IFJlaWZpZWQuR0FURV9ERUxBWTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxWYXJpYXRpb24gPSBSZWlmaWVkLkdBVEVfREVMQVlfVkFSSUFUSU9OO1xuXG4gICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWSA9IDI1O1xuICAgICAgICBSZWlmaWVkLkdBVEVfREVMQVlfVkFSSUFUSU9OID0gNTtcblxuICAgICAgICBmb3IgKGNvbnN0IFtnaXZlbklucHV0cywgZXhwZWN0ZWRPdXRwdXRzXSBvZiBjYXNlcykge1xuICAgICAgICAgICAgaWYgKGlucHV0cy5sZW5ndGggIT09IGdpdmVuSW5wdXRzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiTWlzbWF0Y2hlZCBpbnB1dCBsZW5ndGhzLlwiKTtcbiAgICAgICAgICAgIGlmIChvdXRwdXRzLmxlbmd0aCAhPT0gZXhwZWN0ZWRPdXRwdXRzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiTWlzbWF0Y2hlZCBvdXRwdXQgbGVuZ3Rocy5cIik7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgW2luZGV4LCBpbnB1dF0gb2YgaW5wdXRzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBnaXZlbklucHV0c1tpbmRleF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBERUxBWShjb21wb25lbnRzLmxlbmd0aCAqICgyNSArIDUpKTtcblxuICAgICAgICAgICAgY29uc3QgcmVhbE91dHB1dHMgPSBvdXRwdXRzLm1hcCgob3V0cHV0KSA9PiBvdXRwdXQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpO1xuXG4gICAgICAgICAgICBpZiAoIXJlYWxPdXRwdXRzLmV2ZXJ5KChvdXQsIGkpID0+IG91dCA9PT0gZXhwZWN0ZWRPdXRwdXRzW2ldKSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IE1vZGFsTWFuYWdlci5hbGVydChcbiAgICAgICAgICAgICAgICAgICAgYERpYWdyYW0gZmFpbGVkIHRvIHBhc3MgdGhlIHRlc3Qgd2l0aCBpbnB1dHMgXCIke2dpdmVuSW5wdXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChib29sZWFuKSA9PiArYm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiIFwiKX1cIi5gLFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBvcmlnaW5hbEFjdGl2YXRpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiBpbnB1dHNbaV0uZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHZhbHVlKSk7XG5cbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS51bmxvY2soKTtcbiAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLnVubG9jaygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jdGVzdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBERUxBWSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiRGlhZ3JhbSBwYXNzZWQgYWxsIHRoZSB0ZXN0cy5cIik7XG5cbiAgICAgICAgb3JpZ2luYWxBY3RpdmF0aW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4gaW5wdXRzW2ldLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCB2YWx1ZSkpO1xuICAgICAgICBSZWlmaWVkLkdBVEVfREVMQVkgPSBvcmlnaW5hbERlbGF5O1xuICAgICAgICBSZWlmaWVkLkdBVEVfREVMQVlfVkFSSUFUSU9OID0gb3JpZ2luYWxWYXJpYXRpb247XG5cbiAgICAgICAgUmVpZmllZC5hY3RpdmUudW5sb2NrKCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMudW5sb2NrKCk7XG5cbiAgICAgICAgdGhpcy4jdGVzdGluZyA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdGVzdGluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3Rlc3Rpbmc7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGdldFRydXRoVGFibGUoKSB7XG4gICAgICAgIGlmICh0aGlzLiN0ZXN0aW5nKSByZXR1cm4gTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiRGlhZ3JhbSBpcyBhbHJlYWR5IHVuZGVyIHRlc3RpbmcuXCIpO1xuXG4gICAgICAgIGNvbnN0IGlucHV0cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZV1cbiAgICAgICAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCk6IGNvbXBvbmVudCBpcyBJbnB1dCA9PiBjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApIC0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKSk7XG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBbLi4uUmVpZmllZC5hY3RpdmVdXG4gICAgICAgICAgICAuZmlsdGVyKChjb21wb25lbnQpOiBjb21wb25lbnQgaXMgT3V0cHV0ID0+IGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApIC0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKSk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbHRlcihcbiAgICAgICAgICAgIChjb21wb25lbnQpID0+ICEoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpICYmICEoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoIWlucHV0cy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQ2FuJ3QgY3JlYXRlIHRhYmxlIHdpdGhvdXQgaW5wdXRzLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghb3V0cHV0cy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQ2FuJ3QgY3JlYXRlIHRhYmxlIHdpdGhvdXQgb3V0cHV0cy5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiN0ZXN0aW5nID0gdHJ1ZTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5sb2NrKCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMubG9jaygpO1xuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsQWN0aXZhdGlvbnMgPSBpbnB1dHMubWFwKChpbnB1dCkgPT4gaW5wdXQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbERlbGF5ID0gUmVpZmllZC5HQVRFX0RFTEFZO1xuICAgICAgICBjb25zdCBvcmlnaW5hbFZhcmlhdGlvbiA9IFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT047XG5cbiAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZID0gMjU7XG4gICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT04gPSA1O1xuXG4gICAgICAgIGNvbnN0IHRhYmxlOiBib29sZWFuW11bXVtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwZXJtIG9mIEdFVF9CSU5fUEVSTVMoaW5wdXRzLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2luZGV4LCBpbnB1dF0gb2YgaW5wdXRzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBwZXJtW2luZGV4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IERFTEFZKGNvbXBvbmVudHMubGVuZ3RoICogKDI1ICsgNSkpO1xuXG4gICAgICAgICAgICBjb25zdCByZWFsT3V0cHV0cyA9IG91dHB1dHMubWFwKChvdXRwdXQpID0+IG91dHB1dC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgICAgIHRhYmxlLnB1c2goW3Blcm0sIHJlYWxPdXRwdXRzXSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcmlnaW5hbEFjdGl2YXRpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiBpbnB1dHNbaV0uZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHZhbHVlKSk7XG4gICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWSA9IG9yaWdpbmFsRGVsYXk7XG4gICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT04gPSBvcmlnaW5hbFZhcmlhdGlvbjtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS51bmxvY2soKTtcbiAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy51bmxvY2soKTtcblxuICAgICAgICB0aGlzLiN0ZXN0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRhYmxlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9hc3REYXRhIHtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgY29sb3I6IHN0cmluZztcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgVG9hc3RNYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0cy1jb250YWluZXJcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyB0b2FzdCh7IG1lc3NhZ2UsIGNvbG9yLCBkdXJhdGlvbiB9OiBUb2FzdERhdGEpIHtcbiAgICAgICAgY29uc3QgdG9hc3QgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0b2FzdC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xvc2UtdG9hc3RcIj7ilbM8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRvYXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0LWNvbG9yXCIpIS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcblxuICAgICAgICB0b2FzdC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGR1cmF0aW9uICsgXCJtc1wiO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRvYXN0KTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0b2FzdC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0b2FzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbG9zZS10b2FzdFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIpO1xuXG4gICAgICAgICAgICB0b2FzdC5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIGhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBkb3dubG9hZEZpbGUgfSBmcm9tIFwiLi4vY2FkL2ZpbGVzXCI7XG5pbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY2lyY3VsYXJcIjtcbmltcG9ydCB7IExJR0hUX0dSQVlfQ1NTX0NPTE9SLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IHNhdmVEaWFncmFtIH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBSZWlmaWVkLCBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHR5cGUgeyBNZW51TWFuYWdlckFjdGlvbnMgfSBmcm9tIFwiLi9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4vTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9XaXJpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBUb29sc01hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSAjY2hhbmdlcyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IGFjdGlvbnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiY29weS11cmxcIjoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNvcHkgbGlua1wiLFxuICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIEtcIiA6IFwiQ3RybCBLXCIsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaHJlZkFzVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblxuICAgICAgICAgICAgICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLnNldChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5saW5lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBidG9hKHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSkpLFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGhyZWZBc1VybC5ocmVmKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQ29waWVkIGRpYWdyYW0gbGluayB0byBjbGlwYm9hcmQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogTElHSFRfR1JBWV9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm9wZW4tY2FkXCI6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJPcGVuIENBRFwiLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cbiAgICAgICAgICAgICAgICAgICAgdXJsLnNlYXJjaCA9IFwiP2FwcD1jYWRcIjtcblxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gdXJsLmhyZWY7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidHJ1dGgtdGFibGVcIjoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRydXRoIHRhYmxlIGZyb20gZGlhZ3JhbVwiLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhYmxlID0gYXdhaXQgVGVzdGluZ01hbmFnZXIuZ2V0VHJ1dGhUYWJsZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlID0gaHRtbGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cHJlPjxidXR0b24+Q29weTwvYnV0dG9uPiA8YnV0dG9uPkRvd25sb2FkPC9idXR0b24+IDxidXR0b24+T3BlbiBpbiBDQUQ8L2J1dHRvbj48aHIgc3R5bGU9XCJtYXJnaW46IDRweCAwOyBib3JkZXI6IDFweCBzb2xpZCAke0xJR0hUX0dSQVlfQ1NTX0NPTE9SfVwiIC8+PGNvZGUgc3R5bGU9XCJmb250LWZhbWlseTogRmlyYSBDb2RlLCBtb25vc3BhY2U7XCI+JHt0YWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChyb3cpID0+IHJvdy5tYXAoKGlvKSA9PiBpby5tYXAoKHYpID0+ICt2KS5qb2luKFwiXCIpKS5qb2luKFwiOlwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcXG5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCI6XCIsICc8c3BhbiBzdHlsZT1cImNvbG9yOiBncmF5O1wiPjo8L3NwYW4+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCIwXCIsICc8c3BhbiBzdHlsZT1cImNvbG9yOiByZWQ7XCI+MDwvc3Bhbj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZUFsbChcIjFcIiwgJzxzcGFuIHN0eWxlPVwiY29sb3I6IGJsdWU7XCI+MTwvc3Bhbj4nKX08L2NvZGU+PC9wcmU+XG4gICAgICAgICAgICAgICAgICAgICAgICBgO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmUuY2hpbGRyZW5bMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUubWFwKChyb3cpID0+IHJvdy5tYXAoKGlvKSA9PiBpby5tYXAoKHYpID0+ICt2KS5qb2luKFwiXCIpKS5qb2luKFwiOlwiKSkuam9pbihcIlxcblwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByZS5jaGlsZHJlblsxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGRvd25sb2FkRmlsZShbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlLm1hcCgocm93KSA9PiByb3cubWFwKChpbykgPT4gaW8ubWFwKCh2KSA9PiArdikuam9pbihcIlwiKSkuam9pbihcIjpcIikpLmpvaW4oXCJcXG5cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlLmNoaWxkcmVuWzJdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybC5zZWFyY2ggPSBgP2FwcD1jYWQmaW5saW5lPSR7YnRvYShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUubWFwKChyb3cpID0+IHJvdy5tYXAoKGlvKSA9PiBpby5tYXAoKHYpID0+ICt2KS5qb2luKFwiXCIpKS5qb2luKFwiOlwiKSkuam9pbihcIlxcblwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfWA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gdXJsLmhyZWY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgTW9kYWxNYW5hZ2VyLmFsZXJ0KHByZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICBdIGFzIGNvbnN0IHNhdGlzZmllcyBSZWFkb25seTxNZW51TWFuYWdlckFjdGlvbnM+O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNhY3Rpb25zOiBSZWFkb25seTxNZW51TWFuYWdlckFjdGlvbnM+ID0gdGhpcy5hY3Rpb25zO1xuXG4gICAgc3RhdGljIGdldCAjZWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiYnV0dG9uLnRvb2xzXCIpITtcbiAgICB9XG5cbiAgICBzdGF0aWMgb25DaGFuZ2UocnVuOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI2NoYW5nZXMuYWRkKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZkNoYW5nZShydW46ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jY2hhbmdlcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgI2xpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIudG9vbHMtbWVudVwiKSE7XG5cbiAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gbWVudS5zdHlsZS5kaXNwbGF5ID09PSBcIm5vbmVcIiA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICB9O1xuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudC5pbm5lclRleHQgPSBcIvCfm6BcIjtcblxuICAgICAgICBjb25zdCBtZW51ID0gaHRtbGA8ZGl2IGNsYXNzPVwidG9vbHMtbWVudVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj48L2Rpdj5gO1xuXG4gICAgICAgIG1lbnUuaW5uZXJIVE1MID0gdGhpcy4jYWN0aW9uc1xuICAgICAgICAgICAgLm1hcCgocmVjb3JkKSA9PlxuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHJlY29yZClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgoW25hbWUsIHsgbGFiZWwsIGtleWJpbmQgfV0pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBgPGJ1dHRvbiBjbGFzcz1cIiR7bmFtZX1cIj4ke2xhYmVsfTxwIGNsYXNzPVwibWVudS1rZXliaW5kXCI+JHtrZXliaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGtleSkgPT4gYDxzcGFuPiR7a2V5fTwvc3Bhbj5gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpfTwvcD48L2J1dHRvbj5gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBgPGJ1dHRvbiBjbGFzcz1cIiR7bmFtZX1cIj4ke2xhYmVsfTwvYnV0dG9uPmAsXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcIiksXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuam9pbignPGRpdiBjbGFzcz1cImJyXCI+PC9kaXY+Jyk7XG5cbiAgICAgICAgdGhpcy4jYWN0aW9ucy5mb3JFYWNoKChyZWNvcmQpID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlY29yZCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xpY2sgPSByZWNvcmRba2V5XS5jYWxsYmFjay5iaW5kKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gbWVudS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5cIiArIGtleSkhO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI2xpc3RlbmVycy5zZXQoaXRlbSwgY2xpY2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQuYWZ0ZXIobWVudSk7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jbGlzdGVuZXIpO1xuXG4gICAgICAgIGNvbnN0IGJvZHkgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLiNlbGVtZW50IHx8IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdChcIi50b29sc1wiKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgYm9keSk7XG5cbiAgICAgICAgdGhpcy4jbGlzdGVuZXJzLnNldChkb2N1bWVudC5ib2R5LCBib2R5KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgdGhpcy4jbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNsaXN0ZW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRGFya21vZGVNYW5hZ2VyIH0gZnJvbSBcIi4vRGFya21vZGVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBVbmRvUmVkb01hbmFnZXIge1xuICAgIHN0YXRpYyBnZXQgI3VuZG9FbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCJidXR0b24udW5kb1wiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCAjcmVkb0VsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcImJ1dHRvbi5yZWRvXCIpITtcbiAgICB9XG5cbiAgICBzdGF0aWMgI3VuZG9MaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgU2FuZGJveE1hbmFnZXIucG9wSGlzdG9yeSgpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI3JlZG9MaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgU2FuZGJveE1hbmFnZXIucmVkb0hpc3RvcnkoKTtcbiAgICB9O1xuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgRGFya21vZGVNYW5hZ2VyLm9uQ2hhbmdlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI3VuZG9FbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHRoaXMuI3JlZG9FbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcIm5vbmVcIjtcblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLiN1bmRvRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLiNyZWRvRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gXCJcIjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiN1bmRvRWxlbWVudC5pbm5lclRleHQgPSBcIlVORE9cIjtcbiAgICAgICAgdGhpcy4jcmVkb0VsZW1lbnQuaW5uZXJUZXh0ID0gXCJSRURPXCI7XG5cbiAgICAgICAgdGhpcy4jdW5kb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI3VuZG9MaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuI3JlZG9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNyZWRvTGlzdGVuZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wKCkge1xuICAgICAgICB0aGlzLiN1bmRvRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jdW5kb0xpc3RlbmVyKTtcbiAgICAgICAgdGhpcy4jcmVkb0VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI3JlZG9MaXN0ZW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQgeyBHRVRfQUNUSVZBVEVEX0NPTE9SLCBHRVRfR1JBWV9DT0xPUiwgTE9DS0VEX0ZPUl9URVNUSU5HIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ2FudmFzTWFuYWdlciB9IGZyb20gXCIuL0NhbnZhc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU3RvcmFnZU1hbmFnZXIgfSBmcm9tIFwiLi9TdG9yYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi9UZXN0aW5nTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgTmV3V2lyZUNvbnRleHQge1xuICAgIHN0YXRpYyBmcm9tOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyB7XG4gICAgICAgIE1vdXNlTWFuYWdlci5vbk1vdXNlRG93bigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKE5ld1dpcmVDb250ZXh0LmZyb20pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRhcmdldCB9ID0gZTtcblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImJvYXJkLW91dHB1dFwiKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNvbXBvbmVudC1pbnB1dC1idXR0b25cIilcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmcm9tID0gTmV3V2lyZUNvbnRleHQuZnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZChuZXcgV2lyaW5nKGZyb20sIHRhcmdldCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdpcmUgb2YgV2lyaW5nTWFuYWdlci53aXJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gZnJvbSAmJiB3aXJlLnRvID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBOZXdXaXJlQ29udGV4dC5mcm9tID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXaXJpbmcge1xuICAgICNkZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAjb2JzZXJ2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBmcm9tOiBFbGVtZW50LCByZWFkb25seSB0bzogRWxlbWVudCkge1xuICAgICAgICB0aGlzLiNvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGlzIHdpcmUgaXMgYmVpbmcgdHJhY2tlZCBzdGlsbCBiZWZvcmUgdXBkYXRpbmcgdGhlIGVsZW1lbnRzXG4gICAgICAgICAgICBpZiAoIVdpcmluZ01hbmFnZXIud2lyZXMuaGFzKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFbLi4uV2lyaW5nTWFuYWdlci53aXJlc10uc29tZSgod2lyZSkgPT4gd2lyZS50byA9PT0gdGhpcy50bykpIHRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRvLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgZnJvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdvKCk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy4jZGVzdHJveWVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgZ28oKSB7XG4gICAgICAgIHRoaXMuI2Rlc3Ryb3llZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVyLm9ic2VydmUodGhpcy5mcm9tLCB7IGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sIGF0dHJpYnV0ZXM6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGRlc3Ryb3llZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2Rlc3Ryb3llZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXaXJpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgd2lyZXMgPSBuZXcgV2F0Y2hlZFNldDxXaXJpbmc+KCk7XG5cbiAgICBzdGF0aWMgcmVuZGVyKHsgYmcgfTogeyBiZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0pIHtcbiAgICAgICAgdGhpcy53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICBpZiAod2lyZS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aXJlcy5sb2NrZWQpIHdpcmUuZ28oKTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMud2lyZXMuZGVsZXRlKHdpcmUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmcm9tID0gd2lyZS5mcm9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgdG8gPSB3aXJlLnRvLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VzID0gWy4uLnRoaXMud2lyZXNdLmZpbHRlcigodykgPT4gdy50byA9PT0gd2lyZS50byk7XG5cbiAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgICAgICAgICAgICBcImFjdGl2YXRlZFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZXMuc29tZSgodykgPT4gdy5mcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBiZy5zdHJva2VTdHlsZSA9IHdpcmUuZnJvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgPyBHRVRfQUNUSVZBVEVEX0NPTE9SKCkgOiBHRVRfR1JBWV9DT0xPUigpO1xuXG4gICAgICAgICAgICBiZy5saW5lV2lkdGggPSA1O1xuXG4gICAgICAgICAgICBiZy5saW5lSm9pbiA9IFwicm91bmRcIjtcblxuICAgICAgICAgICAgY29uc3QgeGF4aXMgPSBmcm9tLnggKyBmcm9tLndpZHRoIC8gMiAtICh0by54ICsgdG8ud2lkdGggLyAyKTtcbiAgICAgICAgICAgIGNvbnN0IHlheGlzID0gZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyIC0gKHRvLnkgKyB0by53aWR0aCAvIDIpO1xuXG4gICAgICAgICAgICBjb25zdCBwb2ludHM6IFtudW1iZXIsIG51bWJlcl1bXSA9XG4gICAgICAgICAgICAgICAgIXRoaXMuI0ZBTkNZX1dJUkVTIHx8IE1hdGguYWJzKHhheGlzKSA8IDEwIHx8IE1hdGguYWJzKHlheGlzKSA8IDEwXG4gICAgICAgICAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFt0by54ICsgdG8ud2lkdGggLyAyLCB0by55ICsgdG8uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICA6IE1hdGguYWJzKHhheGlzKSA+IE1hdGguYWJzKHlheGlzKVxuICAgICAgICAgICAgICAgICAgICA/IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW2Zyb20ueCArIGZyb20ud2lkdGggLyAyLCBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJvbS54ICsgZnJvbS53aWR0aCAvIDIgLSB4YXhpcyAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFt0by54ICsgdG8ud2lkdGggLyAyICsgeGF4aXMgLyAyLCB0by55ICsgdG8uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFt0by54ICsgdG8ud2lkdGggLyAyLCB0by55ICsgdG8uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW2Zyb20ueCArIGZyb20ud2lkdGggLyAyLCBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMiAtIHlheGlzIC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFt0by54ICsgdG8ud2lkdGggLyAyLCB0by55ICsgdG8uaGVpZ2h0IC8gMiArIHlheGlzIC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFt0by54ICsgdG8ud2lkdGggLyAyLCB0by55ICsgdG8uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgcG9pbnRzLnNsaWNlKDAsIC0xKS5mb3JFYWNoKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgYmcuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgYmcubW92ZVRvKC4uLnBvaW50c1tpXSk7XG4gICAgICAgICAgICAgICAgYmcubGluZVRvKC4uLnBvaW50c1tpICsgMV0pO1xuICAgICAgICAgICAgICAgIGJnLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgICAgIGJnLnN0cm9rZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChOZXdXaXJlQ29udGV4dC5mcm9tKSB7XG4gICAgICAgICAgICBjb25zdCBmcm9tID0gTmV3V2lyZUNvbnRleHQuZnJvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgYmcuc3Ryb2tlU3R5bGUgPSBOZXdXaXJlQ29udGV4dC5mcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKVxuICAgICAgICAgICAgICAgID8gR0VUX0FDVElWQVRFRF9DT0xPUigpXG4gICAgICAgICAgICAgICAgOiBHRVRfR1JBWV9DT0xPUigpO1xuXG4gICAgICAgICAgICBiZy5saW5lV2lkdGggPSA1O1xuXG4gICAgICAgICAgICBiZy5saW5lSm9pbiA9IFwicm91bmRcIjtcblxuICAgICAgICAgICAgY29uc3QgeGF4aXMgPSBmcm9tLnggKyBmcm9tLndpZHRoIC8gMiAtIE1vdXNlTWFuYWdlci5tb3VzZS54O1xuICAgICAgICAgICAgY29uc3QgeWF4aXMgPSBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDIgLSBNb3VzZU1hbmFnZXIubW91c2UueTtcblxuICAgICAgICAgICAgY29uc3QgcG9pbnRzOiBbbnVtYmVyLCBudW1iZXJdW10gPVxuICAgICAgICAgICAgICAgICF0aGlzLiNGQU5DWV9XSVJFUyB8fCBNYXRoLmFicyh4YXhpcykgPCAxMCB8fCBNYXRoLmFicyh5YXhpcykgPCAxMFxuICAgICAgICAgICAgICAgICAgICA/IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW2Zyb20ueCArIGZyb20ud2lkdGggLyAyLCBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbTW91c2VNYW5hZ2VyLm1vdXNlLngsIE1vdXNlTWFuYWdlci5tb3VzZS55XSxcbiAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIDogTWF0aC5hYnMoeGF4aXMpID4gTWF0aC5hYnMoeWF4aXMpXG4gICAgICAgICAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtmcm9tLnggKyBmcm9tLndpZHRoIC8gMiAtIHhheGlzIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW01vdXNlTWFuYWdlci5tb3VzZS54ICsgeGF4aXMgLyAyLCBNb3VzZU1hbmFnZXIubW91c2UueV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtNb3VzZU1hbmFnZXIubW91c2UueCwgTW91c2VNYW5hZ2VyLm1vdXNlLnldLFxuICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtmcm9tLnggKyBmcm9tLndpZHRoIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW2Zyb20ueCArIGZyb20ud2lkdGggLyAyLCBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDIgLSB5YXhpcyAvIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbTW91c2VNYW5hZ2VyLm1vdXNlLngsIE1vdXNlTWFuYWdlci5tb3VzZS55ICsgeWF4aXMgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW01vdXNlTWFuYWdlci5tb3VzZS54LCBNb3VzZU1hbmFnZXIubW91c2UueV0sXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgcG9pbnRzLnNsaWNlKDAsIC0xKS5mb3JFYWNoKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgYmcuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgYmcubW92ZVRvKC4uLnBvaW50c1tpXSk7XG4gICAgICAgICAgICAgICAgYmcubGluZVRvKC4uLnBvaW50c1tpICsgMV0pO1xuICAgICAgICAgICAgICAgIGJnLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgICAgIGJnLnN0cm9rZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdCgpIHtcbiAgICAgICAgQ2FudmFzTWFuYWdlci5hZGRKb2IodGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgc3RhdGljICNGQU5DWV9XSVJFUyA9IHRydWU7XG4gICAgc3RhdGljICNGQU5DSUVSX1dJUkVTID0gdHJ1ZTtcblxuICAgIHN0YXRpYyBnZXQgRkFOQ1lfV0lSRVMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNGQU5DWV9XSVJFUztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IEZBTkNJRVJfV0lSRVMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNGQU5DSUVSX1dJUkVTO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXQgRkFOQ1lfV0lSRVModjogYm9vbGVhbikge1xuICAgICAgICB0aGlzLiNGQU5DWV9XSVJFUyA9IHY7XG5cbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFwic2V0dGluZ3MuZmFuY3lXaXJlc1wiLCB0aGlzLiNGQU5DWV9XSVJFUyk7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldCBGQU5DSUVSX1dJUkVTKHY6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy4jRkFOQ0lFUl9XSVJFUyA9IHY7XG5cbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFwic2V0dGluZ3MuZmFuY2llcldpcmVzXCIsIHRoaXMuI0ZBTkNJRVJfV0lSRVMpO1xuICAgIH1cblxuICAgIHN0YXRpYyB7XG4gICAgICAgIHRoaXMuI0ZBTkNZX1dJUkVTID0gU3RvcmFnZU1hbmFnZXIuZ2V0KFwic2V0dGluZ3MuZmFuY3lXaXJlc1wiKSA/PyB0aGlzLiNGQU5DWV9XSVJFUztcbiAgICAgICAgdGhpcy4jRkFOQ0lFUl9XSVJFUyA9IFN0b3JhZ2VNYW5hZ2VyLmdldChcInNldHRpbmdzLmZhbmNpZXJXaXJlc1wiKSA/PyB0aGlzLiNGQU5DSUVSX1dJUkVTO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGluc2VydCB9IGZyb20gXCIuLi9jb250ZXh0bWVudS9pbnNlcnRcIjtcbmltcG9ydCB7IGlvIH0gZnJvbSBcIi4uL2NvbnRleHRtZW51L2lvXCI7XG5pbXBvcnQgeyBRdWlja1BpY2tNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1F1aWNrUGlja01hbmFnZXJcIjtcblxuZXhwb3J0IGNvbnN0IHF1aWNrcGlja0NvbXBvbmVudHMgPSAoZTogTW91c2VFdmVudCkgPT5cbiAgICBRdWlja1BpY2tNYW5hZ2VyLmFjdGl2YXRlKGUsIFtcbiAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6IFwiRGlzcGxheVwiLFxuICAgICAgICAgICAgY2FsbGJhY2soZSkge1xuICAgICAgICAgICAgICAgIGluc2VydFtcImluc2VydC1jb21wb25lbnRcIl0uY2FsbGJhY2suY2FsbCh1bmRlZmluZWQsIGUsIFwiRElTUExBWVwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIjcgU2VnXCIsXG4gICAgICAgICAgICBjYWxsYmFjayhlKSB7XG4gICAgICAgICAgICAgICAgaW5zZXJ0W1wiaW5zZXJ0LWNvbXBvbmVudFwiXS5jYWxsYmFjay5jYWxsKHVuZGVmaW5lZCwgZSwgXCJTRVZFTl9TRUdNRU5UX0RJU1BMQVlcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogXCJPdXRwdXRcIixcbiAgICAgICAgICAgIGNhbGxiYWNrKGUpIHtcbiAgICAgICAgICAgICAgICBpb1tcIm5ldy1vdXRwdXRcIl0uY2FsbGJhY2suY2FsbCh1bmRlZmluZWQsIGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6IFwiSW5wdXRcIixcbiAgICAgICAgICAgIGNhbGxiYWNrKGUpIHtcbiAgICAgICAgICAgICAgICBpb1tcIm5ldy1pbnB1dFwiXS5jYWxsYmFjay5jYWxsKHVuZGVmaW5lZCwgZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIF0pO1xuIiwiaW1wb3J0IHsgT1JJR0lOX1BPSU5UIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgUXVpY2tQaWNrTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9RdWlja1BpY2tNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBnYXRlcyB9IGZyb20gXCIuLi9yZWlmaWVkL2NoaXBzXCI7XG5cbmV4cG9ydCBjb25zdCBxdWlja3BpY2tHYXRlcyA9IChlOiBNb3VzZUV2ZW50KSA9PlxuICAgIFF1aWNrUGlja01hbmFnZXIuYWN0aXZhdGUoXG4gICAgICAgIGUsXG4gICAgICAgIGdhdGVzLm1hcCgoZ2F0ZSkgPT4gKHtcbiAgICAgICAgICAgIGxhYmVsOiBnYXRlLk5BTUUsXG4gICAgICAgICAgICBjYWxsYmFjayhlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudChSZWZsZWN0LmNvbnN0cnVjdChnYXRlLCBbXSksIE9SSUdJTl9QT0lOVCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhjb21wb25lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBnZXRDb21wdXRlZFN0eWxlKGNvbXBvbmVudC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZS5jbGllbnRYIC0gcGFyc2VGbG9hdCh3aWR0aCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBlLmNsaWVudFkgLSBwYXJzZUZsb2F0KGhlaWdodCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3QoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkpLFxuICAgICk7XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY2lyY3VsYXJcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIERFTEFZLCBMT0NLRURfRk9SX1RFU1RJTkcsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBOZXdXaXJlQ29udGV4dCwgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFJlaWZpZWQsIGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4sIGh0bWwgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5pbXBvcnQgeyBDaGlwLCBFeHRlbmRlZENoaXAgfSBmcm9tIFwiLi9jaGlwc1wiO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50PEkgZXh0ZW5kcyBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXI+IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIGlucHV0cztcbiAgICBvdXRwdXRzO1xuICAgIHJlYWRvbmx5IG5hbWU7XG5cbiAgICByZWFkb25seSAjb2JzZXJ2ZXJzID0gbmV3IE1hcDxFbGVtZW50LCBNdXRhdGlvbk9ic2VydmVyPigpO1xuICAgIHJlYWRvbmx5ICNtb3VzZXVwcyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY29udGV4dG1lbnVzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuICAgIHJlYWRvbmx5ICNjbGlja3MgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG5cbiAgICByZWFkb25seSBiYXNlOiBDaGlwPEksIE8+O1xuICAgIGNoaXA6IENoaXA8SSwgTz47XG5cbiAgICAjYW5nbGUgPSAwO1xuXG4gICAgI2NvbXBsZW1lbnRhcnkgPSBmYWxzZTtcblxuICAgICNqb2lucyA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgY2hpcDogQ2hpcDxJLCBPPixcbiAgICAgICAgcG9zOlxuICAgICAgICAgICAgfCB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfVxuICAgICAgICAgICAgfCAoKGNvbXA6IENvbXBvbmVudDxJLCBPPikgPT4geyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH0pLFxuICAgICAgICBjb21wbGVtZW50YXJ5ID0gZmFsc2UsXG4gICAgICAgIGpvaW5zID0gY2hpcC5pbnB1dHMsXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy4jY29tcGxlbWVudGFyeSA9IGNvbXBsZW1lbnRhcnk7XG4gICAgICAgIHRoaXMuI2pvaW5zID0gam9pbnM7XG5cbiAgICAgICAgdGhpcy5iYXNlID0gY2hpcDtcbiAgICAgICAgdGhpcy5jaGlwID1cbiAgICAgICAgICAgIHRoaXMuI2pvaW5zICE9PSB0aGlzLmJhc2UuaW5wdXRzXG4gICAgICAgICAgICAgICAgPyBuZXcgKENoaXAuam9pbmVkKHRoaXMuYmFzZS5jb25zdHJ1Y3RvciBhcyBFeHRlbmRlZENoaXA8SSwgTz4sIHRoaXMuI2pvaW5zIGFzIEkpKSgpXG4gICAgICAgICAgICAgICAgOiB0aGlzLmJhc2U7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KHRoaXMuam9pbnMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjb21wb25lbnQtbmFtZVwiPiR7dGhpcy5jaGlwLm5hbWV9PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KGNvbXBsZW1lbnRhcnkgJiYgdGhpcy5jaGlwLm91dHB1dHMgPT09IDEgPyB0aGlzLmNoaXAub3V0cHV0cyArIDEgOiB0aGlzLmNoaXAub3V0cHV0cylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWxsKCc8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LW91dHB1dC1idXR0b25cIj5PPC9idXR0b24+JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXQtYnV0dG9uXCIpKTtcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW91dHB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW5hbWVcIikhO1xuXG4gICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcblxuICAgICAgICB0aGlzLm1vdmUodHlwZW9mIHBvcyA9PT0gXCJmdW5jdGlvblwiID8gcG9zLmNhbGwodW5kZWZpbmVkLCB0aGlzKSA6IHBvcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlKCkge1xuICAgICAgICBjb25zdCBvdXQgPSB0aGlzLmNoaXAuZXZhbHVhdGUodGhpcy5pbnB1dHMubWFwKChpKSA9PiBpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSkpO1xuXG4gICAgICAgIGF3YWl0IERFTEFZKFxuICAgICAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZICsgTWF0aC5yYW5kb20oKSAqICgyICogUmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTikgLSBSZWlmaWVkLkdBVEVfREVMQVlfVkFSSUFUSU9OLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQsIGkpID0+IHtcbiAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHRoaXMuI2NvbXBsZW1lbnRhcnkgJiYgaSA9PT0gMSA/ICFvdXRbMF0gOiBvdXRbaV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXQgYW5nbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhbmdsZTtcbiAgICB9XG5cbiAgICBzZXQgYW5nbGUodjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuI2FuZ2xlID0gdiAlIDM2MDtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVooJHt2fWRlZylgO1xuXG4gICAgICAgIC8vIHJvdGF0ZSBuYW1lIHJpZ2h0c2lkZSB1cCBpZiBpdCdzIHVwc2lkZSBkb3duXG4gICAgICAgIGlmICh2ID09PSAxODApIHtcbiAgICAgICAgICAgIHRoaXMubmFtZS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlWigke3Z9ZGVnKWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0IGNvbXBsZW1lbnRhcnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNjb21wbGVtZW50YXJ5O1xuICAgIH1cblxuICAgIGdldCBqb2lucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2pvaW5zO1xuICAgIH1cblxuICAgIHJvdGF0ZShhbmdsZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQsIHRoaXMubmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgICN1cGRhdGVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVycy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy4jY2xpY2tzLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5zZXQoaW5wdXQsIG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudXBkYXRlLmJpbmQodGhpcykpKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2V1cHMuc2V0KGlucHV0LCAoKSA9PiBpbnB1dC5ibHVyKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KGlucHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgaW5wdXQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQob3V0cHV0LCAoKSA9PiBvdXRwdXQuYmx1cigpKTtcblxuICAgICAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNyZWF0ZS1jb25uZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDcmVhdGUgY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BQcm9wYWdhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKHRvKSA9PiBuZXcgV2lyaW5nKG91dHB1dCwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLiNjbGlja3Muc2V0KG91dHB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiS2V5UVwiKSkgTmV3V2lyZUNvbnRleHQuZnJvbSA9IG91dHB1dDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KHRoaXMubmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICAuLi4odGhpcy5jaGlwLm91dHB1dHMgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2V0LWlucHV0c1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU2V0IGlucHV0c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIkVudGVyIHRoZSBudW1iZXIgb2YgaW5wdXRzOlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgam9pbnMgPSAraW5wdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc05hTihqb2lucykgfHwgIU51bWJlci5pc0ludGVnZXIoam9pbnMpIHx8IGpvaW5zIDwgdGhpcy5iYXNlLmlucHV0cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBOdW1iZXIgb2YgaW5wdXRzIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke3RoaXMuYmFzZS5pbnB1dHN9LmAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuI2pvaW5zID09PSBqb2lucykgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy4jam9pbnM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXRzID0gWy4uLnRoaXMuaW5wdXRzXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGQgPSB0aGlzLmNoaXA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2pvaW5zID0gam9pbnM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLnJlbW92ZSgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzID0gQXJyYXkoam9pbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWxsKHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoKSA9PiBodG1sYDxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPmApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LWlucHV0c1wiKSE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpYy5hcHBlbmRDaGlsZChpKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiN1cGRhdGVMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlwID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jam9pbnMgIT09IHRoaXMuYmFzZS5pbnB1dHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbmV3IChDaGlwLmpvaW5lZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFzZS5jb25zdHJ1Y3RvciBhcyBFeHRlbmRlZENoaXA8SSwgTz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNqb2lucyBhcyBJLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMuYmFzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jam9pbnMgPSBwcmV2aW91cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLnJlbW92ZSgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LWlucHV0c1wiKSE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpYy5hcHBlbmRDaGlsZChpKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiN1cGRhdGVMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlwID0gb2xkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidG9nZ2xlLWNvbXBsZW1lbnRhcnlcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNvbXBsZW1lbnRhcnkgb3V0cHV0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb21wbGVtZW50YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQgPSB0aGlzLm91dHB1dHNbdGhpcy5vdXRwdXRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2NvbXBsZW1lbnRhcnkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIuY29tcG9uZW50LW91dHB1dC1idXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jYXR0YWNoTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2NvbXBsZW1lbnRhcnkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtb3V0cHV0c1wiKSFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRDaGlsZChvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cyA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIuY29tcG9uZW50LW91dHB1dC1idXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCh0bykgPT4gbmV3IFdpcmluZyhvdXRwdXQsIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jYXR0YWNoTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBodG1sYDxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiPk88L2J1dHRvbj5gO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNjb21wbGVtZW50YXJ5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW91dHB1dHNcIikhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kQ2hpbGQob3V0cHV0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNjb21wbGVtZW50YXJ5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jZGVzdHJveUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICA6IFtdKSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwicm90YXRlLWNvbXBvbmVudFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJSb3RhdGUgY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBcIlJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZSArPSA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZSAtPSA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29tcG9uZW50XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIFhcIiA6IFwiQ3RybCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBFUk1BTkVOVClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBjb21wb25lbnQgaXMgcGVybWFuZW50IGFuZCBjYW5ub3QgYmUgZGVsZXRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICNhdHRhY2hMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlcnMuZ2V0KGlucHV0KSEub2JzZXJ2ZShpbnB1dCwge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwcy5nZXQoaW5wdXQpISk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KGlucHV0KSEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cHMuZ2V0KG91dHB1dCkhKTtcblxuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KG91dHB1dCkhKTtcblxuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNjbGlja3MuZ2V0KG91dHB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5uYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMubmFtZSkhKTtcbiAgICB9XG5cbiAgICAjZGVzdHJveUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmZvckVhY2goKG8pID0+IG8uZGlzY29ubmVjdCgpKTtcblxuICAgICAgICB0aGlzLiNtb3VzZXVwcy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLiNjbGlja3MuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy5uYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMubmFtZSkhKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY2lyY3VsYXJcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIERFTEFZLCBMT0NLRURfRk9SX1RFU1RJTkcsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBOZXdXaXJlQ29udGV4dCwgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFJlaWZpZWQsIGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4sIGh0bWwgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBEaXNwbGF5IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIGlucHV0cztcbiAgICBvdXRwdXRzO1xuICAgIHJlYWRvbmx5IGRpc3BsYXk7XG5cbiAgICByZWFkb25seSAjb2JzZXJ2ZXJzID0gbmV3IE1hcDxFbGVtZW50LCBNdXRhdGlvbk9ic2VydmVyPigpO1xuICAgIHJlYWRvbmx5ICNtb3VzZXVwcyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY29udGV4dG1lbnVzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuICAgIHJlYWRvbmx5ICNjbGlja3MgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG5cbiAgICAjYml0cztcbiAgICAjcmFkaXg7XG5cbiAgICAjYW5nbGUgPSAwO1xuXG4gICAgY29uc3RydWN0b3IocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCB9LCBiaXRzID0gMSwgcmFkaXggPSAxMCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuI2JpdHMgPSBiaXRzO1xuICAgICAgICB0aGlzLiNyYWRpeCA9IHJhZGl4O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlzcGxheVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkoYml0cykuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dC1idXR0b25cIj5JPC9idXR0b24+Jykuam9pbihcIlwiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImRpc3BsYXktY29udGVudFwiPjA8L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkoYml0cykuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCI+TzwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmlucHV0cyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1pbnB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5kaXNwbGF5LWNvbnRlbnRcIikhO1xuXG4gICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IG91dCA9IHRoaXMuaW5wdXRzLm1hcCgoaSkgPT4gaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpO1xuXG4gICAgICAgIGF3YWl0IERFTEFZKFxuICAgICAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZICsgTWF0aC5yYW5kb20oKSAqICgyICogUmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTikgLSBSZWlmaWVkLkdBVEVfREVMQVlfVkFSSUFUSU9OLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0Q29udGVudCA9IG91dFxuICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYiwgaSwgbikgPT4gYSArICtiICogMiAqKiAobi5sZW5ndGggLSBpIC0gMSksIDApXG4gICAgICAgICAgICAudG9TdHJpbmcodGhpcy4jcmFkaXgpO1xuXG4gICAgICAgIFsuLi50aGlzLm91dHB1dHNdLnJldmVyc2UoKS5mb3JFYWNoKChvdXRwdXQsIGkpID0+IHtcbiAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIG91dFtpXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldCBiaXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYml0cztcbiAgICB9XG5cbiAgICBnZXQgcmFkaXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNyYWRpeDtcbiAgICB9XG5cbiAgICBnZXQgYW5nbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhbmdsZTtcbiAgICB9XG5cbiAgICBzZXQgYW5nbGUodjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuI2FuZ2xlID0gdiAlIDM2MDtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVooJHt2fWRlZylgO1xuXG4gICAgICAgIGlmICh2ID09PSAxODApIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlWigke3Z9ZGVnKWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcm90YXRlKGFuZ2xlOiBudW1iZXIpOiB0aGlzIHtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgc3VwZXIuYXR0YWNoKCk7XG5cbiAgICAgICAgdGhpcy4jYXR0YWNoTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCwgdGhpcy5kaXNwbGF5KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHN1cGVyLmRldGFjaCgpO1xuXG4gICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZm9yZ2V0KHRoaXMuZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgI3VwZGF0ZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNjbGlja3MuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLnNldChpbnB1dCwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGUuYmluZCh0aGlzKSkpO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQoaW5wdXQsICgpID0+IGlucHV0LmJsdXIoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQoaW5wdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoZnJvbSkgPT4gbmV3IFdpcmluZyhmcm9tLCBpbnB1dCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI21vdXNldXBzLnNldChvdXRwdXQsICgpID0+IG91dHB1dC5ibHVyKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KG91dHB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY3JlYXRlLWNvbm5lY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogXCJRXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcFByb3BhZ2F0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IG91dHB1dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgodG8pID0+IG5ldyBXaXJpbmcob3V0cHV0LCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NsaWNrcy5zZXQob3V0cHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJLZXlRXCIpKSBOZXdXaXJlQ29udGV4dC5mcm9tID0gb3V0cHV0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQodGhpcy5kaXNwbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJzZXQtYml0c1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTZXQgYml0c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IGF3YWl0IE1vZGFsTWFuYWdlci5wcm9tcHQoXCJFbnRlciB0aGUgbnVtYmVyIG9mIGJpdHM6XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYml0cyA9ICtpbnB1dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oYml0cykgfHwgIU51bWJlci5pc0ludGVnZXIoYml0cykgfHwgYml0cyA8IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJOdW1iZXIgb2YgYml0cyBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiNiaXRzID09PSBiaXRzKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuI2JpdHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0cyA9IFsuLi50aGlzLmlucHV0c107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0cyA9IFsuLi50aGlzLm91dHB1dHNdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNiaXRzID0gYml0cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jZGVzdHJveUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLnJlbW92ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvKSA9PiBvLnJlbW92ZSgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMgPSBBcnJheShiaXRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWxsKHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCgpID0+IGh0bWxgPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dC1idXR0b25cIj5JPC9idXR0b24+YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cyA9IEFycmF5KGJpdHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbGwodW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKCkgPT4gaHRtbGA8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LW91dHB1dC1idXR0b25cIj5PPC9idXR0b24+YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGljID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1pbnB1dHNcIikhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2MgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW91dHB1dHNcIikhO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpYy5hcHBlbmRDaGlsZChpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgobykgPT4gb2MuYXBwZW5kQ2hpbGQobykpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiN1cGRhdGVMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jYXR0YWNoTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2JpdHMgPSBwcmV2aW91cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jZGVzdHJveUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLnJlbW92ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvKSA9PiBvLnJlbW92ZSgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMgPSBpbnB1dHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMgPSBvdXRwdXRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpYyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXRzXCIpITtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9jID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXRzXCIpITtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaWMuYXBwZW5kQ2hpbGQoaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG8pID0+IG9jLmFwcGVuZENoaWxkKG8pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInNldC1yYWRpeFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTZXQgcmFkaXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiRW50ZXIgdGhlIG51bWJlciBvZiBiaXRzOlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5wdXQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhZGl4ID0gK2lucHV0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc05hTihyYWRpeCkgfHwgIU51bWJlci5pc0ludGVnZXIocmFkaXgpIHx8IHJhZGl4IDwgMSB8fCByYWRpeCA+IDE2KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRGlzcGxheSByYWRpeCBtdXN0IGJlIGFuIGludGVnZXIgZnJvbSAxIHRvIDE2LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLiNyYWRpeDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jcmFkaXggPSByYWRpeDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3JhZGl4ID0gcHJldmlvdXM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInJvdGF0ZS1jb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUm90YXRlIGNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogXCJSXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUgKz0gOTA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUgLT0gOTA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbXBvbmVudFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBYXCIgOiBcIkN0cmwgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoaXMgY29tcG9uZW50IGlzIHBlcm1hbmVudCBhbmQgY2Fubm90IGJlIGRlbGV0ZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZSh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAjYXR0YWNoTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmdldChpbnB1dCkhLm9ic2VydmUoaW5wdXQsIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cHMuZ2V0KGlucHV0KSEpO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChpbnB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXBzLmdldChvdXRwdXQpISk7XG5cbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChvdXRwdXQpISk7XG5cbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jY2xpY2tzLmdldChvdXRwdXQpISk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLmRpc3BsYXkpISk7XG4gICAgfVxuXG4gICAgI2Rlc3Ryb3lMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVycy5mb3JFYWNoKChvKSA9PiBvLmRpc2Nvbm5lY3QoKSk7XG5cbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy4jY2xpY2tzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLmRpc3BsYXkpISk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4uL2NpcmN1bGFyXCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBMT0NLRURfRk9SX1RFU1RJTkcsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBOZXdXaXJlQ29udGV4dCwgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFJlaWZpZWQsIGh0bWwgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnB1dCBleHRlbmRzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IGVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwb3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IGNlbnRlcmVkPzogYm9vbGVhbiB9ID0geyB4OiAwLCB5OiAwIH0pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBodG1sYDxidXR0b24gY2xhc3M9XCJib2FyZC1pbnB1dFwiPkk8L2J1dHRvbj5gO1xuXG4gICAgICAgIHRoaXMubW92ZShwb3MpO1xuICAgIH1cblxuICAgIHJlYWRvbmx5ICNtb3VzZXVwID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYmx1cigpO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQueCA9IGUuY2xpZW50WC50b1N0cmluZygpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC55ID0gZS5jbGllbnRZLnRvU3RyaW5nKCk7XG4gICAgfTtcblxuICAgIHJlYWRvbmx5ICNjbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiS2V5UVwiKSkgcmV0dXJuIChOZXdXaXJlQ29udGV4dC5mcm9tID0gdGhpcy5lbGVtZW50KTtcblxuICAgICAgICBpZiAoTWF0aC5oeXBvdChlLmNsaWVudFggLSArdGhpcy5lbGVtZW50LmRhdGFzZXQueCEsIGUuY2xpZW50WSAtICt0aGlzLmVsZW1lbnQuZGF0YXNldC55ISkgPiAyKSByZXR1cm47XG5cbiAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICBjb25zdCBhY3RpdmUgPSB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCAhYWN0aXZlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgYWN0aXZlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHJlYWRvbmx5ICNjb250ZXh0bWVudSA9ICgpID0+IHtcbiAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNyZWF0ZS1jb25uZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIGNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAga2V5YmluZDogXCJRXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0b3BQcm9wYWdhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSB0aGlzLmVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1pbnB1dFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBpbnB1dFwiLFxuICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBYXCIgOiBcIkN0cmwgWFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUEVSTUFORU5UKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBpbnB1dCBpcyBwZXJtYW5lbnQgYW5kIGNhbm5vdCBiZSBkZWxldGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgodG8pID0+IG5ldyBXaXJpbmcodGhpcy5lbGVtZW50LCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgodG8pID0+IG5ldyBXaXJpbmcodGhpcy5lbGVtZW50LCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdKTtcbiAgICB9O1xuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jY2xpY2spO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51KTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIud2F0Y2godGhpcy5lbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHN1cGVyLmRldGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNjbGljayk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5mb3JnZXQodGhpcy5lbGVtZW50LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY2lyY3VsYXJcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIExPQ0tFRF9GT1JfVEVTVElORywgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgT3V0cHV0IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIHJlYWRvbmx5ICNtb3VzZXVwID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYmx1cigpO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY29udGV4dG1lbnUgPSAoKSA9PiB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJkZWxldGUtb3V0cHV0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIG91dHB1dFwiLFxuICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBYXCIgOiBcIkN0cmwgWFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUEVSTUFORU5UKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBvdXRwdXQgaXMgcGVybWFuZW50IGFuZCBjYW5ub3QgYmUgZGVsZXRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZSh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgdGhpcy5lbGVtZW50KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChmcm9tKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRoaXMuZWxlbWVudCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdKTtcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCB9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGA8YnV0dG9uIGNsYXNzPVwiYm9hcmQtb3V0cHV0XCI+TzwvYnV0dG9uPmA7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHBvcyk7XG4gICAgfVxuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgc3VwZXIuZGV0YWNoKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51KTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZm9yZ2V0KHRoaXMuZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQgeyBTQ1VGRkVEX1VVSUQgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaHRtbCh0ZW1wbGF0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnZhbHVlczogdW5rbm93bltdKTogSFRNTEVsZW1lbnQ7XG5leHBvcnQgZnVuY3Rpb24gaHRtbChodG1sOiBzdHJpbmcpOiBIVE1MRWxlbWVudDtcbmV4cG9ydCBmdW5jdGlvbiBodG1sKC4uLmFyZ3M6IFtzdHJpbmddIHwgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi51bmtub3duW11dKSB7XG4gICAgY29uc3QgW3RlbXBsYXRlLCAuLi52YWx1ZXNdID0gYXJncztcblxuICAgIGNvbnN0IGh0bWwgPVxuICAgICAgICB0eXBlb2YgdGVtcGxhdGUgPT09IFwic3RyaW5nXCIgPyB0ZW1wbGF0ZSA6IHRlbXBsYXRlLnJlZHVjZSgoaHRtbCwgcywgaSkgPT4gaHRtbCArIHMgKyAodmFsdWVzW2ldID8/IFwiXCIpLCBcIlwiKTtcblxuICAgIHJldHVybiBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGh0bWwsIFwidGV4dC9odG1sXCIpLmJvZHkuY2hpbGROb2Rlc1swXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNzcyh0ZW1wbGF0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnZhbHVlczogdW5rbm93bltdKTogc3RyaW5nO1xuZXhwb3J0IGZ1bmN0aW9uIGNzcyhjc3M6IHN0cmluZyk6IHN0cmluZztcbmV4cG9ydCBmdW5jdGlvbiBjc3MoLi4uYXJnczogW3N0cmluZ10gfCBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnVua25vd25bXV0pIHtcbiAgICBjb25zdCBbdGVtcGxhdGUsIC4uLnZhbHVlc10gPSBhcmdzO1xuXG4gICAgY29uc3QgY3NzID1cbiAgICAgICAgdHlwZW9mIHRlbXBsYXRlID09PSBcInN0cmluZ1wiID8gdGVtcGxhdGUgOiB0ZW1wbGF0ZS5yZWR1Y2UoKGNzcywgcywgaSkgPT4gY3NzICsgcyArICh2YWx1ZXNbaV0gPz8gXCJcIiksIFwiXCIpO1xuXG4gICAgcmV0dXJuIGNzcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4oZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIHRyYW5zZm9ybSB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblxuICAgIGlmICh0cmFuc2Zvcm0gJiYgdHJhbnNmb3JtICE9PSBcIm5vbmVcIikge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0cmFuc2Zvcm0ubWF0Y2goL15tYXRyaXhcXCgoLispXFwpJC8pPy5bMV0uc3BsaXQoXCIsIFwiKTtcblxuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zbGF0ZSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGNvbnN0IFthLCBiXSA9IHZhbHVlcy5tYXAoTnVtYmVyKTtcblxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSAoTWF0aC5yb3VuZChNYXRoLmF0YW4yKGIsIGEpICogKDE4MCAvIE1hdGguUEkpKSArIDM2MCkgJSAzNjA7XG5cbiAgICAgICAgICAgIGlmIChhbmdsZSA9PT0gMCB8fCBhbmdsZSA9PT0gOTApIHJldHVybiBwYXJzZUZsb2F0KGhlaWdodCkgLyAyICsgXCJweCBcIiArIHBhcnNlRmxvYXQoaGVpZ2h0KSAvIDIgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIGlmIChhbmdsZSA9PT0gMTgwKSByZXR1cm4gXCJjZW50ZXJcIjtcblxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2xhdGUgPSBcIjAgXCIgKyAocGFyc2VGbG9hdCh3aWR0aCkgLSBwYXJzZUZsb2F0KGhlaWdodCkpICsgXCJweFwiO1xuXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChoZWlnaHQpIC8gMiArIFwicHggXCIgKyBwYXJzZUZsb2F0KGhlaWdodCkgLyAyICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiY2VudGVyXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdmVybGFwcGVkQm91bmRzKHJlY3Q6IERPTVJlY3QsIGZyb206IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSwgdG86IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkge1xuICAgIGNvbnN0IGJvdW5kcyA9IHtcbiAgICAgICAgeDogTWF0aC5taW4oZnJvbS54LCB0by54KSxcbiAgICAgICAgeTogTWF0aC5taW4oZnJvbS55LCB0by55KSxcbiAgICAgICAgd2lkdGg6IE1hdGguYWJzKGZyb20ueCAtIHRvLngpLFxuICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGZyb20ueSAtIHRvLnkpLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICByZWN0LnggPD0gYm91bmRzLnggKyBib3VuZHMud2lkdGggJiZcbiAgICAgICAgcmVjdC54ICsgcmVjdC53aWR0aCA+PSBib3VuZHMueCAmJlxuICAgICAgICByZWN0LnkgPD0gYm91bmRzLnkgKyBib3VuZHMuaGVpZ2h0ICYmXG4gICAgICAgIHJlY3QueSArIHJlY3QuaGVpZ2h0ID49IGJvdW5kcy55XG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KGU6IEV2ZW50KSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgdXVpZCA9IFNDVUZGRURfVVVJRCgpO1xuXG4gICAgcHJvdGVjdGVkIFBFUk1BTkVOVCA9IGZhbHNlO1xuXG4gICAgc3RhdGljIGFjdGl2ZSA9IG5ldyBXYXRjaGVkU2V0PFJlaWZpZWQ+KCk7XG5cbiAgICBzdGF0aWMgZ2V0IHJvb3QoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5yZWlmaWVkLXJvb3RcIikhO1xuICAgIH1cblxuICAgIGFic3RyYWN0IHJlYWRvbmx5IGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gICAgbW92ZSh7IHgsIHksIGNlbnRlcmVkLCByZWxhdGl2ZSB9OiB7IHg/OiBudW1iZXI7IHk/OiBudW1iZXI7IGNlbnRlcmVkPzogYm9vbGVhbjsgcmVsYXRpdmU/OiBib29sZWFuIH0pIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4odGhpcy5lbGVtZW50KTtcblxuICAgICAgICBpZiAocmVsYXRpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gcGFyc2VGbG9hdCh0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCkgKyAoeCA/PyAwKSArIFwicHhcIjtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSBwYXJzZUZsb2F0KHRoaXMuZWxlbWVudC5zdHlsZS50b3ApICsgKHkgPz8gMCkgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHggIT09IFwidW5kZWZpbmVkXCIpIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0geCArIFwicHhcIjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgeSAhPT0gXCJ1bmRlZmluZWRcIikgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHkgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2VudGVyZWQpXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdG9wLCBsZWZ0LCB3aWR0aCwgaGVpZ2h0IH0gPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGxlZnQpIC0gcGFyc2VGbG9hdCh3aWR0aCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KHRvcCkgLSBwYXJzZUZsb2F0KGhlaWdodCkgLyAyLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBSZWlmaWVkLnJvb3QuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwZXJtYW5lbnQoKSB7XG4gICAgICAgIHRoaXMuUEVSTUFORU5UID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXQgcGVybWFuZW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuUEVSTUFORU5UO1xuICAgIH1cblxuICAgIGdldCBwb3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBwYXJzZUZsb2F0KHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQodGhpcy5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljICNHQVRFX0RFTEFZID0gMTAwO1xuICAgIHN0YXRpYyAjR0FURV9ERUxBWV9WQVJJQVRJT04gPSAyNTtcblxuICAgIHN0YXRpYyBnZXQgR0FURV9ERUxBWSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI0dBVEVfREVMQVk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBHQVRFX0RFTEFZX1ZBUklBVElPTigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI0dBVEVfREVMQVlfVkFSSUFUSU9OO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXQgR0FURV9ERUxBWSh2OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy4jR0FURV9ERUxBWSA9IHY7XG5cbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFwic2V0dGluZ3MuZ2F0ZURlbGF5XCIsIHRoaXMuI0dBVEVfREVMQVkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXQgR0FURV9ERUxBWV9WQVJJQVRJT04odjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuI0dBVEVfREVMQVlfVkFSSUFUSU9OID0gdjtcblxuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJzZXR0aW5ncy5nYXRlRGVsYXlWYXJpYXRpb25cIiwgdGhpcy4jR0FURV9ERUxBWV9WQVJJQVRJT04pO1xuICAgIH1cblxuICAgIHN0YXRpYyB7XG4gICAgICAgIHRoaXMuI0dBVEVfREVMQVkgPSBTdG9yYWdlTWFuYWdlci5nZXQoXCJzZXR0aW5ncy5nYXRlRGVsYXlcIikgPz8gdGhpcy4jR0FURV9ERUxBWTtcbiAgICAgICAgdGhpcy4jR0FURV9ERUxBWV9WQVJJQVRJT04gPSBTdG9yYWdlTWFuYWdlci5nZXQoXCJzZXR0aW5ncy5nYXRlRGVsYXlWYXJpYXRpb25cIikgPz8gdGhpcy4jR0FURV9ERUxBWV9WQVJJQVRJT047XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4uL2NpcmN1bGFyXCI7XG5pbXBvcnQge1xuICAgIEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgREVMQVksXG4gICAgR0VUX0FDVElWQVRFRF9DT0xPUixcbiAgICBHRVRfR1JBWV9DT0xPUixcbiAgICBMT0NLRURfRk9SX1RFU1RJTkcsXG4gICAgVE9BU1RfRFVSQVRJT04sXG59IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IENhbnZhc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBOZXdXaXJlQ29udGV4dCwgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFJlaWZpZWQsIGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4sIGh0bWwgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBTZXZlblNlZ21lbnREaXNwbGF5IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIGlucHV0cztcbiAgICBvdXRwdXRzO1xuICAgIHJlYWRvbmx5IGRpc3BsYXk7XG5cbiAgICByZWFkb25seSAjb2JzZXJ2ZXJzID0gbmV3IE1hcDxFbGVtZW50LCBNdXRhdGlvbk9ic2VydmVyPigpO1xuICAgIHJlYWRvbmx5ICNtb3VzZXVwcyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY29udGV4dG1lbnVzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuICAgIHJlYWRvbmx5ICNjbGlja3MgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG5cbiAgICAjYW5nbGUgPSAwO1xuXG4gICAgcmVhZG9ubHkgI2N0eDtcblxuICAgIGNvbnN0cnVjdG9yKHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH0gPSB7IHg6IDAsIHk6IDAgfSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlzcGxheVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkoOCkuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dC1idXR0b25cIj5JPC9idXR0b24+Jykuam9pbihcIlwiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8Y2FudmFzIGNsYXNzPVwic2V2ZW4tc2VnbWVudC1kaXNwbGF5XCI+PC9jYW52YXM+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkoMCkuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCI+TzwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmlucHV0cyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1pbnB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcIi5zZXZlbi1zZWdtZW50LWRpc3BsYXlcIikhO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5oZWlnaHQgPSAxMDAgKiBkZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB0aGlzLmRpc3BsYXkud2lkdGggPSA4MCAqIGRldmljZVBpeGVsUmF0aW87XG5cbiAgICAgICAgdGhpcy4jY3R4ID0gdGhpcy5kaXNwbGF5LmdldENvbnRleHQoXCIyZFwiKSE7XG5cbiAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMudXBkYXRlKCkpO1xuXG4gICAgICAgIHRoaXMubW92ZShwb3MpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy4jY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmRpc3BsYXkud2lkdGgsIHRoaXMuZGlzcGxheS5oZWlnaHQpO1xuXG4gICAgICAgIGNvbnN0IG91dCA9IHRoaXMuaW5wdXRzLm1hcCgoaSkgPT4gaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpO1xuXG4gICAgICAgIC8vIGRlZmluZSBhbGwgb3VyIHNlZ21lbnRzXG4gICAgICAgIGNvbnN0IHNlZ21lbnRzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHg6IDIsXG4gICAgICAgICAgICAgICAgeTogNDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDI0LFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHg6IDMyLFxuICAgICAgICAgICAgICAgIHk6IDYsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDMyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHg6IDYwLFxuICAgICAgICAgICAgICAgIHk6IDE2LFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxNCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB4OiA2MCxcbiAgICAgICAgICAgICAgICB5OiA1MixcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgeDogMzIsXG4gICAgICAgICAgICAgICAgeTogODAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDMyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHg6IDIyLFxuICAgICAgICAgICAgICAgIHk6IDUyLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxNCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB4OiAyMixcbiAgICAgICAgICAgICAgICB5OiAxNixcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgeDogMzIsXG4gICAgICAgICAgICAgICAgeTogNDMsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDMyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTQsXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLm1hcCgoeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0pID0+ICh7XG4gICAgICAgICAgICB4OiB4ICogZGV2aWNlUGl4ZWxSYXRpbyxcbiAgICAgICAgICAgIHk6IHkgKiBkZXZpY2VQaXhlbFJhdGlvLFxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoICogZGV2aWNlUGl4ZWxSYXRpbyxcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ICogZGV2aWNlUGl4ZWxSYXRpbyxcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuI2N0eDtcblxuICAgICAgICBzZWdtZW50cy5mb3JFYWNoKCh7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSwgaSkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jY3R4LmZpbGxTdHlsZSA9IG91dFtpXSA/IEdFVF9BQ1RJVkFURURfQ09MT1IoKSA6IEdFVF9HUkFZX0NPTE9SKCk7XG4gICAgICAgICAgICB0aGlzLiNjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XG5cbiAgICAgICAgICAgIHRoaXMuI2N0eC5iZWdpblBhdGgoKTtcblxuICAgICAgICAgICAgaWYgKHdpZHRoID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy4jY3R4Lm1vdmVUbyh4LCB5ICsgaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICAgICAgdGhpcy4jY3R4LmxpbmVUbyh4ICsgaGVpZ2h0IC8gMiwgeSk7XG4gICAgICAgICAgICAgICAgdGhpcy4jY3R4LmxpbmVUbyh4ICsgd2lkdGggLSBoZWlnaHQgLyAyLCB5KTtcbiAgICAgICAgICAgICAgICB0aGlzLiNjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgIHRoaXMuI2N0eC5saW5lVG8oeCArIHdpZHRoIC0gaGVpZ2h0IC8gMiwgeSArIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy4jY3R4LmxpbmVUbyh4ICsgaGVpZ2h0IC8gMiwgeSArIGhlaWdodCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuI2N0eC5tb3ZlVG8oeCArIHdpZHRoIC8gMiwgeSk7XG4gICAgICAgICAgICAgICAgdGhpcy4jY3R4LmxpbmVUbyh4LCB5ICsgd2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICB0aGlzLiNjdHgubGluZVRvKHgsIHkgKyBoZWlnaHQgLSB3aWR0aCAvIDIpO1xuICAgICAgICAgICAgICAgIHRoaXMuI2N0eC5saW5lVG8oeCArIHdpZHRoIC8gMiwgeSArIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy4jY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQgLSB3aWR0aCAvIDIpO1xuICAgICAgICAgICAgICAgIHRoaXMuI2N0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgd2lkdGggLyAyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4jY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgICAgICB0aGlzLiNjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICB0aGlzLiNjdHguZmlsbCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGUoKSB7XG4gICAgICAgIGF3YWl0IERFTEFZKFxuICAgICAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZICsgTWF0aC5yYW5kb20oKSAqICgyICogUmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTikgLSBSZWlmaWVkLkdBVEVfREVMQVlfVkFSSUFUSU9OLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IGFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYW5nbGU7XG4gICAgfVxuXG4gICAgc2V0IGFuZ2xlKHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLiNhbmdsZSA9IHYgJSAzNjA7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVaKCR7dn1kZWcpYDtcblxuICAgICAgICBpZiAodiA9PT0gMTgwKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVooJHt2fWRlZylgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbih0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuICAgIHJvdGF0ZShhbmdsZTogbnVtYmVyKTogdGhpcyB7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQsIHRoaXMuZGlzcGxheSk7XG5cbiAgICAgICAgQ2FudmFzTWFuYWdlci5hZGRKb2IodGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIENhbnZhc01hbmFnZXIuZGVsZXRlSm9iKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgICN1cGRhdGVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVycy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy4jY2xpY2tzLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5zZXQoaW5wdXQsIG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudXBkYXRlLmJpbmQodGhpcykpKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2V1cHMuc2V0KGlucHV0LCAoKSA9PiBpbnB1dC5ibHVyKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KGlucHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgaW5wdXQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQob3V0cHV0LCAoKSA9PiBvdXRwdXQuYmx1cigpKTtcblxuICAgICAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNyZWF0ZS1jb25uZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDcmVhdGUgY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BQcm9wYWdhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKHRvKSA9PiBuZXcgV2lyaW5nKG91dHB1dCwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLiNjbGlja3Muc2V0KG91dHB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiS2V5UVwiKSkgTmV3V2lyZUNvbnRleHQuZnJvbSA9IG91dHB1dDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KHRoaXMuZGlzcGxheSwgKCkgPT4ge1xuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwicm90YXRlLWNvbXBvbmVudFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJSb3RhdGUgY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBcIlJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZSArPSA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZSAtPSA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29tcG9uZW50XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIFhcIiA6IFwiQ3RybCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBFUk1BTkVOVClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBjb21wb25lbnQgaXMgcGVybWFuZW50IGFuZCBjYW5ub3QgYmUgZGVsZXRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICNhdHRhY2hMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlcnMuZ2V0KGlucHV0KSEub2JzZXJ2ZShpbnB1dCwge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwcy5nZXQoaW5wdXQpISk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KGlucHV0KSEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cHMuZ2V0KG91dHB1dCkhKTtcblxuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KG91dHB1dCkhKTtcblxuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNjbGlja3MuZ2V0KG91dHB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMuZGlzcGxheSkhKTtcbiAgICB9XG5cbiAgICAjZGVzdHJveUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmZvckVhY2goKG8pID0+IG8uZGlzY29ubmVjdCgpKTtcblxuICAgICAgICB0aGlzLiNtb3VzZXVwcy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLiNjbGlja3MuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMuZGlzcGxheSkhKTtcbiAgICB9XG59XG4iLCJ0eXBlIEJvb2xlYW5UdXBsZTxMIGV4dGVuZHMgbnVtYmVyLCBSIGV4dGVuZHMgYm9vbGVhbltdID0gW10+ID0gbnVtYmVyIGV4dGVuZHMgTFxuICAgID8gYm9vbGVhbltdXG4gICAgOiBSW1wibGVuZ3RoXCJdIGV4dGVuZHMgTFxuICAgID8gUlxuICAgIDogQm9vbGVhblR1cGxlPEwsIFsuLi5SLCBib29sZWFuXT47XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDaGlwPEkgZXh0ZW5kcyBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXI+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRTogc3RyaW5nO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFM6IG51bWJlcjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUzogbnVtYmVyO1xuXG4gICAgcmVhZG9ubHkgbmFtZTtcblxuICAgIHJlYWRvbmx5IGlucHV0cztcbiAgICByZWFkb25seSBvdXRwdXRzO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBpbnB1dHM6IEksIG91dHB1dHM6IE8pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBpbnB1dHM7XG4gICAgICAgIHRoaXMub3V0cHV0cyA9IG91dHB1dHM7XG4gICAgfVxuXG4gICAgYWJzdHJhY3Qgb3V0cHV0KGlucHV0czogQm9vbGVhblR1cGxlPEk+KTogQm9vbGVhblR1cGxlPE8+O1xuXG4gICAgZXZhbHVhdGUoaW5wdXRzOiBib29sZWFuW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0cHV0KGlucHV0cyBhcyBCb29sZWFuVHVwbGU8SSwgW10+KSBhcyBib29sZWFuW107XG4gICAgfVxuXG4gICAgc3RhdGljIGpvaW5lZDxJIGV4dGVuZHMgbnVtYmVyLCBPIGV4dGVuZHMgbnVtYmVyLCBOIGV4dGVuZHMgbnVtYmVyPihcbiAgICAgICAgY2hpcDogRXh0ZW5kZWRDaGlwPEksIE8+LFxuICAgICAgICBuOiBOLFxuICAgICk6IEV4dGVuZGVkQ2hpcDxOLCBPPiB7XG4gICAgICAgIC8vIGdhdGVzIHNob3VsZCBoYXZlIGF0IGxlYXN0IG9uZSBpbnB1dCBhbmQgb25lIG91dHB1dFxuICAgICAgICBpZiAoY2hpcC5JTlBVVFMgPCAxIHx8IGNoaXAuT1VUUFVUUyA8IDEpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGNoaXBcIik7XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUgaW5wdXQgdGhlbiBpdCdzIGp1c3QgYSBidWZmZXIgZ2F0ZVxuICAgICAgICAvLyBzcGVjaWFsIGNhc2UgaWYgY2hpcCBpcyBhIG5vdCBnYXRlLCB0aGVuIGl0J3MganVzdCBhIG5vdCBnYXRlXG4gICAgICAgIGlmIChuID09PSAxKSByZXR1cm4gKGNoaXAgaW5zdGFuY2VvZiBOb3RHYXRlID8gTm90R2F0ZSA6IEJ1ZmZlckdhdGUpIGFzIEV4dGVuZGVkQ2hpcDxOLCBPPjtcblxuICAgICAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBDaGlwPE4sIE8+IHtcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gY2hpcC5OQU1FO1xuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IG47XG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IGNoaXAuT1VUUFVUUztcblxuICAgICAgICAgICAgI2NoaXBzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogbiAtIDEgfSwgKCkgPT4gbmV3IGNoaXAoKSk7XG5cbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgICAgIHN1cGVyKGNoaXAuTkFNRSwgbiwgY2hpcC5PVVRQVVRTIGFzIE8pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXRwdXQoaW5wdXRzOiBib29sZWFuW10pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4jY2hpcHNcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAob3V0cHV0LCBjaGlwLCBpKSA9PiBjaGlwLm91dHB1dChbaW5wdXRzW2kgKyBjaGlwLmlucHV0c10sIC4uLm91dHB1dF0gYXMgQm9vbGVhblR1cGxlPEk+KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2NoaXBzWzBdLm91dHB1dChpbnB1dHMuc2xpY2UoMCwgY2hpcC5JTlBVVFMpIGFzIEJvb2xlYW5UdXBsZTxJPiksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW5kR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJBTkRcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJBTkRcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFthICYmIGJdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9yR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJPUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk9SXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbYSB8fCBiXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3RHYXRlIGV4dGVuZHMgQ2hpcDwxLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk5PVFwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAxO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk5PVFwiLCAxLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW25dOiBbYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyFuXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOYW5kR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJOQU5EXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiTkFORFwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyEoYSAmJiBiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9yR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJOT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJOT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshKGEgfHwgYildO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFhvckdhdGUgZXh0ZW5kcyBDaGlwPDIsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiWE9SXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiWE9SXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbISEoK2EgXiArYildO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFhub3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIlhOT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJYTk9SXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbISgrYSBeICtiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQnVmZmVyR2F0ZSBleHRlbmRzIENoaXA8MSwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJCVUZcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMTtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJCVUZGRVJcIiwgMSwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFtuXTogW2Jvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFtuXTtcbiAgICB9XG59XG5cbnR5cGUgU3RhdGljTWVtYmVyczxUPiA9IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gfTtcblxuZXhwb3J0IHR5cGUgRXh0ZW5kZWRDaGlwPEkgZXh0ZW5kcyBudW1iZXIgPSBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXIgPSBudW1iZXI+ID0gU3RhdGljTWVtYmVyczx0eXBlb2YgQ2hpcDxJLCBPPj4gJiB7XG4gICAgbmV3ICgpOiBDaGlwPEksIE8+O1xufTtcblxuZXhwb3J0IGNvbnN0IGdhdGVzID0gW0FuZEdhdGUsIE9yR2F0ZSwgTm90R2F0ZSwgTmFuZEdhdGUsIE5vckdhdGUsIFhvckdhdGUsIFhub3JHYXRlLCBCdWZmZXJHYXRlXSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IGNoaXBzID0gbmV3IE1hcDxzdHJpbmcsIEV4dGVuZGVkQ2hpcD4oZ2F0ZXMubWFwKChnYXRlKSA9PiBbZ2F0ZS5OQU1FLCBnYXRlXSkpO1xuXG5jaGlwcy5zZXQoXCJCVUZGXCIsIEJ1ZmZlckdhdGUpO1xuY2hpcHMuc2V0KFwiQlVGRkVSXCIsIEJ1ZmZlckdhdGUpO1xuXG5leHBvcnQgY2xhc3MgSGFsZkFkZGVyR2F0ZSBleHRlbmRzIENoaXA8MiwgMj4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJIQUxGQURERVJcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJIQUREXCIsIDIsIDIpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuLCBib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbISEoK2EgXiArYiksIGEgJiYgYl07XG4gICAgfVxufVxuXG5jaGlwcy5zZXQoSGFsZkFkZGVyR2F0ZS5OQU1FLCBIYWxmQWRkZXJHYXRlKTtcbmNoaXBzLnNldChcIkhBRERcIiwgSGFsZkFkZGVyR2F0ZSk7XG5cbmV4cG9ydCBjbGFzcyBGdWxsQWRkZXJHYXRlIGV4dGVuZHMgQ2hpcDwzLCAyPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkZVTExBRERFUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAzO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkZBRERcIiwgMywgMik7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiLCBjXTogW2Jvb2xlYW4sIGJvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW4sIGJvb2xlYW5dIHtcbiAgICAgICAgLy8gKGEgeG9yIGIpIHhvciBjXG4gICAgICAgIC8vICgoYSB4b3IgYikgYW5kIGMpIG9yIChhIGFuZCBiKVxuICAgICAgICByZXR1cm4gWyEhKCshISgrYSBeICtiKSBeICtjKSwgKCEhKCthIF4gK2IpICYmIGMpIHx8IChhICYmIGIpXTtcbiAgICB9XG59XG5cbmNoaXBzLnNldChGdWxsQWRkZXJHYXRlLk5BTUUsIEZ1bGxBZGRlckdhdGUpO1xuY2hpcHMuc2V0KFwiRkFERFwiLCBGdWxsQWRkZXJHYXRlKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJ2YXIgd2VicGFja1F1ZXVlcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgcXVldWVzXCIpIDogXCJfX3dlYnBhY2tfcXVldWVzX19cIjtcbnZhciB3ZWJwYWNrRXhwb3J0cyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXhwb3J0c1wiKSA6IFwiX193ZWJwYWNrX2V4cG9ydHNfX1wiO1xudmFyIHdlYnBhY2tFcnJvciA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXJyb3JcIikgOiBcIl9fd2VicGFja19lcnJvcl9fXCI7XG52YXIgcmVzb2x2ZVF1ZXVlID0gKHF1ZXVlKSA9PiB7XG5cdGlmKHF1ZXVlICYmICFxdWV1ZS5kKSB7XG5cdFx0cXVldWUuZCA9IDE7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0pKTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSA/IGZuLnIrKyA6IGZuKCkpKTtcblx0fVxufVxudmFyIHdyYXBEZXBzID0gKGRlcHMpID0+IChkZXBzLm1hcCgoZGVwKSA9PiB7XG5cdGlmKGRlcCAhPT0gbnVsbCAmJiB0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKSB7XG5cdFx0aWYoZGVwW3dlYnBhY2tRdWV1ZXNdKSByZXR1cm4gZGVwO1xuXHRcdGlmKGRlcC50aGVuKSB7XG5cdFx0XHR2YXIgcXVldWUgPSBbXTtcblx0XHRcdHF1ZXVlLmQgPSAwO1xuXHRcdFx0ZGVwLnRoZW4oKHIpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFeHBvcnRzXSA9IHI7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9LCAoZSkgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0Vycm9yXSA9IGU7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBvYmogPSB7fTtcblx0XHRcdG9ialt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKGZuKHF1ZXVlKSk7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblx0fVxuXHR2YXIgcmV0ID0ge307XG5cdHJldFt3ZWJwYWNrUXVldWVzXSA9IHggPT4ge307XG5cdHJldFt3ZWJwYWNrRXhwb3J0c10gPSBkZXA7XG5cdHJldHVybiByZXQ7XG59KSk7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmEgPSAobW9kdWxlLCBib2R5LCBoYXNBd2FpdCkgPT4ge1xuXHR2YXIgcXVldWU7XG5cdGhhc0F3YWl0ICYmICgocXVldWUgPSBbXSkuZCA9IDEpO1xuXHR2YXIgZGVwUXVldWVzID0gbmV3IFNldCgpO1xuXHR2YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xuXHR2YXIgY3VycmVudERlcHM7XG5cdHZhciBvdXRlclJlc29sdmU7XG5cdHZhciByZWplY3Q7XG5cdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuXHRcdHJlamVjdCA9IHJlajtcblx0XHRvdXRlclJlc29sdmUgPSByZXNvbHZlO1xuXHR9KTtcblx0cHJvbWlzZVt3ZWJwYWNrRXhwb3J0c10gPSBleHBvcnRzO1xuXHRwcm9taXNlW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAocXVldWUgJiYgZm4ocXVldWUpLCBkZXBRdWV1ZXMuZm9yRWFjaChmbiksIHByb21pc2VbXCJjYXRjaFwiXSh4ID0+IHt9KSk7XG5cdG1vZHVsZS5leHBvcnRzID0gcHJvbWlzZTtcblx0Ym9keSgoZGVwcykgPT4ge1xuXHRcdGN1cnJlbnREZXBzID0gd3JhcERlcHMoZGVwcyk7XG5cdFx0dmFyIGZuO1xuXHRcdHZhciBnZXRSZXN1bHQgPSAoKSA9PiAoY3VycmVudERlcHMubWFwKChkKSA9PiB7XG5cdFx0XHRpZihkW3dlYnBhY2tFcnJvcl0pIHRocm93IGRbd2VicGFja0Vycm9yXTtcblx0XHRcdHJldHVybiBkW3dlYnBhY2tFeHBvcnRzXTtcblx0XHR9KSlcblx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRmbiA9ICgpID0+IChyZXNvbHZlKGdldFJlc3VsdCkpO1xuXHRcdFx0Zm4uciA9IDA7XG5cdFx0XHR2YXIgZm5RdWV1ZSA9IChxKSA9PiAocSAhPT0gcXVldWUgJiYgIWRlcFF1ZXVlcy5oYXMocSkgJiYgKGRlcFF1ZXVlcy5hZGQocSksIHEgJiYgIXEuZCAmJiAoZm4ucisrLCBxLnB1c2goZm4pKSkpO1xuXHRcdFx0Y3VycmVudERlcHMubWFwKChkZXApID0+IChkZXBbd2VicGFja1F1ZXVlc10oZm5RdWV1ZSkpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZm4uciA/IHByb21pc2UgOiBnZXRSZXN1bHQoKTtcblx0fSwgKGVycikgPT4gKChlcnIgPyByZWplY3QocHJvbWlzZVt3ZWJwYWNrRXJyb3JdID0gZXJyKSA6IG91dGVyUmVzb2x2ZShleHBvcnRzKSksIHJlc29sdmVRdWV1ZShxdWV1ZSkpKTtcblx0cXVldWUgJiYgKHF1ZXVlLmQgPSAwKTtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jYWQvZW1wbG95ZWUudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=