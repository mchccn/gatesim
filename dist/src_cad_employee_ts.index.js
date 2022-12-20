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
    console.log(e);
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
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reified/chips */ "./src/reified/chips.ts");









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
            const chip = _reified_chips__WEBPACK_IMPORTED_MODULE_8__.chips.get(name.toUpperCase());
            const component = chip
                ? new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(Reflect.construct(chip, []), _constants__WEBPACK_IMPORTED_MODULE_0__.ORIGIN_POINT)
                : name.toUpperCase() === "DISPLAY"
                    ? new _reified_Display__WEBPACK_IMPORTED_MODULE_6__.Display()
                    : undefined;
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
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./reified/chips */ "./src/reified/chips.ts");









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
            const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component(new (_reified_chips__WEBPACK_IMPORTED_MODULE_8__.chips.get(raw.name))(), raw, raw.complementary, raw.joins).rotate(raw.angle);
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
        if (typeof component.type !== "string" || !["INPUT", "OUTPUT", "COMPONENT", "DISPLAY"].includes(component.type))
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
                if (!_reified_chips__WEBPACK_IMPORTED_MODULE_8__.chips.has(component.name.trim().toUpperCase()))
                    throw new Error("Chip name doesn't exist.");
                const Chip = _reified_chips__WEBPACK_IMPORTED_MODULE_8__.chips.get(component.name.trim().toUpperCase());
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
            case "DISPLAY": {
                if (!("angle" in component))
                    throw new Error("Display data is missing rotation angle.");
                if (typeof component.angle !== "number")
                    throw new Error("Rotation angle must be a number.");
                if (!("radix" in component))
                    throw new Error("Display data is missing display radix.");
                if (typeof component.radix !== "number")
                    throw new Error("Display radix must be a number.");
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
    const ids = data.components.flatMap((component) => component.type === "COMPONENT" || component.type === "DISPLAY"
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
/* harmony import */ var _CanvasManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./CanvasManager */ "./src/managers/CanvasManager.ts");
/* harmony import */ var _DarkmodeManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MenuManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./MenuManager */ "./src/managers/MenuManager.ts");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _QuickPickManager__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./QuickPickManager */ "./src/managers/QuickPickManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _SettingsManager__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./SettingsManager */ "./src/managers/SettingsManager.ts");
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _ToolsManager__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./ToolsManager */ "./src/managers/ToolsManager.ts");
/* harmony import */ var _UndoRedoManager__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./UndoRedoManager */ "./src/managers/UndoRedoManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");























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
    else if (item instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_4__.Display) {
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
        _MouseManager__WEBPACK_IMPORTED_MODULE_14__.MouseManager.start();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_11__.KeybindsManager.listen();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_16__.SelectionManager.listen();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.listen();
        _WiringManager__WEBPACK_IMPORTED_MODULE_22__.WiringManager.init();
        _QuickPickManager__WEBPACK_IMPORTED_MODULE_15__.QuickPickManager.init();
        _CanvasManager__WEBPACK_IMPORTED_MODULE_8__.CanvasManager.start();
        _ToolsManager__WEBPACK_IMPORTED_MODULE_20__.ToolsManager.listen();
        _SettingsManager__WEBPACK_IMPORTED_MODULE_17__.SettingsManager.listen();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_9__.DarkmodeManager.listen().onChange(() => _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.snapToGridBasedUpdate({ onlyUpdateColor: true }));
        _UndoRedoManager__WEBPACK_IMPORTED_MODULE_21__.UndoRedoManager.listen();
        const createReifiedActive = (components) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((item, set) => {
            const totals = calculateReifiedTotals(set.clone().add(item));
            if (totals.chipsTotal + totals.inputsTotal + totals.outputsTotal >
                (this.#config.limits?.componentsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
                    message: "Exceeded total components limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.inputsTotal > (this.#config.limits?.inputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
                    message: "Exceeded total inputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.outputsTotal > (this.#config.limits?.outputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
                    message: "Exceeded total outputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.chipsTotal > (this.#config.limits?.chipsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
                    message: "Exceeded total chips limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (item instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component &&
                totals.chips.has(item.chip.name) &&
                totals.chips.get(item.chip.name) > (this.#config.limits?.chips?.[item.chip.name] ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
                    message: `Exceeded total '${item.chip.name}' limit.`,
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            return true;
        })
            .onAdd(() => {
            _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.snapToGridBasedUpdate();
            return true;
        })
            .addAll(components);
        const createWiringsSet = (wirings) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((_, set) => {
            if (set.size + 1 > (this.#config.limits?.wirings ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
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
            [this.queueNewContext, this.killMenu] = _MenuManager__WEBPACK_IMPORTED_MODULE_12__.MenuManager.use(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root, this.#config.menu);
        if (typeof this.#config.keybinds !== "undefined")
            Object.entries(this.#config.keybinds).forEach(([chord, run]) => _KeybindsManager__WEBPACK_IMPORTED_MODULE_11__.KeybindsManager.onKeyChord(chord, run));
        if (typeof this.#config.initial !== "undefined") {
            this.clear();
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active = createReifiedActive(this.#config.initial[0]);
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => component.attach());
            _WiringManager__WEBPACK_IMPORTED_MODULE_22__.WiringManager.wires = createWiringsSet(this.#config.initial[1]);
        }
        if (typeof this.#config.save !== "undefined") {
            const file = _StorageManager__WEBPACK_IMPORTED_MODULE_18__.StorageManager.get("saves:" + this.#config.save);
            if (file) {
                const { error, result: [settings, components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_2__.fromFile)(file);
                if (error) {
                    _StorageManager__WEBPACK_IMPORTED_MODULE_18__.StorageManager["delete"]("saves:" + this.#config.save);
                    if (_constants__WEBPACK_IMPORTED_MODULE_1__.IN_DEBUG_MODE)
                        console.error("Failed to read from saves:", error);
                    _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
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
                        _WiringManager__WEBPACK_IMPORTED_MODULE_22__.WiringManager.wires = createWiringsSet(wires);
                    }
                    _StorageManager__WEBPACK_IMPORTED_MODULE_18__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_22__.WiringManager.wires]));
                }
            }
        }
        this.#observer = new MutationObserver(() => {
            if (typeof this.#config.save !== "undefined")
                _StorageManager__WEBPACK_IMPORTED_MODULE_18__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_22__.WiringManager.wires]));
        });
        this.#observer.observe(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        });
        this.#interval = setInterval(() => {
            const check = this.#config.checkState?.(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.clone(), _WiringManager__WEBPACK_IMPORTED_MODULE_22__.WiringManager.wires.clone()) ?? false;
            if (check)
                this.#config.ifStateChecked?.();
        }, this.#config.checkInterval ?? 50);
        if (!_StorageManager__WEBPACK_IMPORTED_MODULE_18__.StorageManager.get("usedhelp"))
            _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
                message: "Press '?' for help.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.LIGHT_GRAY_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
        requestAnimationFrame(() => _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.snapToGridBasedUpdate());
        return this;
    }
    static forceSave() {
        if (typeof this.#config.save !== "undefined")
            _StorageManager__WEBPACK_IMPORTED_MODULE_18__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_22__.WiringManager.wires]));
        return this;
    }
    static reset() {
        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = undefined;
        }
        clearInterval(this.#interval);
        this.#interval = -1;
        _MouseManager__WEBPACK_IMPORTED_MODULE_14__.MouseManager.reset();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_11__.KeybindsManager.reset();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_16__.SelectionManager.reset();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.reset();
        _CanvasManager__WEBPACK_IMPORTED_MODULE_8__.CanvasManager.stop();
        _ToolsManager__WEBPACK_IMPORTED_MODULE_20__.ToolsManager.stop();
        _SettingsManager__WEBPACK_IMPORTED_MODULE_17__.SettingsManager.stop();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_9__.DarkmodeManager.stop();
        _UndoRedoManager__WEBPACK_IMPORTED_MODULE_21__.UndoRedoManager.stop();
        _MenuManager__WEBPACK_IMPORTED_MODULE_12__.MenuManager.remove(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root);
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
        _WiringManager__WEBPACK_IMPORTED_MODULE_22__.WiringManager.wires.forEach((wire) => wire.destroy());
        _SelectionManager__WEBPACK_IMPORTED_MODULE_16__.SelectionManager.selected.clear();
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
            _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
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
            _ToastManager__WEBPACK_IMPORTED_MODULE_19__.ToastManager.toast({
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
        _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.snapToGrid = settings.snapToGrid ?? false;
        return this;
    }
    static applyRawSettings(settings) {
        _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.snapToGrid = settings["DraggingManager.snapToGrid"];
        return this;
    }
    static get savedName() {
        return this.#config.save;
    }
    static async saveTo(save) {
        this.#config.save = save;
        if (_StorageManager__WEBPACK_IMPORTED_MODULE_18__.StorageManager.has("saves:" + this.#config.save) &&
            !(await _ModalManager__WEBPACK_IMPORTED_MODULE_13__.ModalManager.confirm("There is already a save with this name. Are you sure you want to replace it?")))
            return;
        _StorageManager__WEBPACK_IMPORTED_MODULE_18__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_22__.WiringManager.wires]));
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
/* harmony import */ var _CanvasManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./CanvasManager */ "./src/managers/CanvasManager.ts");
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");
















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
            if ((_circular__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_11__.KeybindsManager.isKeyDown("MetaLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_11__.KeybindsManager.isKeyDown("MetaRight"))) ||
                (!_circular__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_11__.KeybindsManager.isKeyDown("ControlLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_11__.KeybindsManager.isKeyDown("ControlRight"))))
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
            const data = (0,_files__WEBPACK_IMPORTED_MODULE_3__.saveDiagram)(array, [..._WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires].filter((wiring) => array.some((component) => {
                if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input)
                    return wiring.from === component.element;
                if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output)
                    return false;
                if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display)
                    return component.outputs.some((output) => wiring.from === output);
                throw new Error("Unknown component type.");
            }) &&
                array.some((component) => {
                    if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input)
                        return false;
                    if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output)
                        return wiring.to === component.element;
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display)
                        return component.inputs.some((input) => wiring.to === input);
                    throw new Error("Unknown component type.");
                })));
            await navigator.clipboard.writeText(data);
        }
    };
    static #paste = async () => {
        const { error, result: [, components, wirings], } = (0,_files__WEBPACK_IMPORTED_MODULE_3__.fromFile)(await navigator.clipboard.readText());
        if (error)
            return _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                message: "Unable to paste diagram data.",
                color: _constants__WEBPACK_IMPORTED_MODULE_2__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_2__.TOAST_DURATION,
            });
        const mouse = { ..._MouseManager__WEBPACK_IMPORTED_MODULE_12__.MouseManager.mouse };
        const selection = this.selected.clone(true);
        _SandboxManager__WEBPACK_IMPORTED_MODULE_13__.SandboxManager.pushHistory(() => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.addAll(components);
            if (components.every((component) => _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.has(component))) {
                components.forEach((component) => {
                    component.attach();
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display) {
                        component.inputs.forEach((input) => input.classList.remove("activated"));
                        requestAnimationFrame(() => component.update());
                    }
                    if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output) {
                        component.element.classList.remove("activated");
                    }
                });
                if (_MouseManager__WEBPACK_IMPORTED_MODULE_12__.MouseManager.mouse.x !== -1 && _MouseManager__WEBPACK_IMPORTED_MODULE_12__.MouseManager.mouse.y !== -1) {
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
                _WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires.addAll(wirings);
                this.selected.clear();
                components.forEach((component) => this.addSelection(component));
                _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.snapToGridBasedUpdate();
            }
        }, () => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.deleteAll(components);
            components.forEach((component) => {
                component.detach();
            });
            _WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires.deleteAll(wirings);
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
            if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_5__.Display)
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
        _CanvasManager__WEBPACK_IMPORTED_MODULE_9__.CanvasManager.addJob(this.render.bind(this));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2NhZF9lbXBsb3llZV90cy5pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFPLE1BQU0sVUFBYyxTQUFRLEdBQU07SUFDckMsS0FBSyxHQUFHLElBQUksR0FBRyxFQUF3RCxDQUFDO0lBQ3hFLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBd0QsQ0FBQztJQUMzRSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXdELENBQUM7SUFDakYsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLEVBQXdELENBQUM7SUFFcEYsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUVoQixZQUFZLEtBQStDO1FBQ3ZELEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxLQUFLO1lBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQXlEO1FBQzNELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXBCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxRQUFRLENBQUMsR0FBeUQ7UUFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELGNBQWMsQ0FBQyxHQUF5RDtRQUNwRSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsaUJBQWlCLENBQUMsR0FBeUQ7UUFDdkUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQXlEO1FBQzVELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxTQUFTLENBQUMsR0FBeUQ7UUFDL0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFMUIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELGVBQWUsQ0FBQyxHQUF5RDtRQUNyRSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsa0JBQWtCLENBQUMsR0FBeUQ7UUFDeEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQVU7UUFDYixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFeEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFVO1FBQ2hCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxHQUFHLENBQUMsSUFBTztRQUNQLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV2RixJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1NBQ2pEO1FBRUQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTlFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFPO1FBQ1YsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFMUYsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFBRSxPQUFPLEtBQUssQ0FBQztTQUNsRDtRQUVELE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVqRixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxJQUFJO1FBQ0EsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBdUI7UUFDekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakMsSUFBSSxhQUFhLEVBQUU7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDckQ7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SG1EO0FBU2lCO0FBRXJFLDBHQUEwRztBQUMxRywrREFBK0Q7QUFDeEQsU0FBUyxLQUFLLENBQUMsR0FBVyxFQUFFLElBQVksRUFBRSxLQUFlO0lBQzVELE1BQU0sVUFBVSxHQUFHLElBQUksS0FBSyxFQUF3QixDQUFDO0lBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFrQixDQUFDO0lBRTFDLE1BQU0sRUFBRSxHQUFHLDZEQUFpQixFQUFFLENBQUM7SUFFL0IsZ0JBQWdCO0lBQ2hCLE1BQU0sTUFBTSxHQUFzQixLQUFLLENBQUMsR0FBRyxDQUFDO1NBQ3ZDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDUCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1osT0FBTyxFQUFFLENBQUM7UUFDVixTQUFTLEVBQUUsS0FBSztRQUNoQixJQUFJLEVBQUUsT0FBTztRQUNiLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSztRQUNuQixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUc7S0FDbEIsQ0FBQyxDQUFDLENBQUM7SUFFUixpQkFBaUI7SUFDakIsTUFBTSxPQUFPLEdBQXVCLEtBQUssQ0FBQyxJQUFJLENBQUM7U0FDMUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNQLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDWixPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQzFCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLElBQUksRUFBRSxRQUFRO1FBQ2QsU0FBUyxFQUFFLEtBQUs7UUFDaEIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLO1FBQ25CLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRztLQUNsQixDQUFDLENBQUMsQ0FBQztJQUVSLG1FQUFtRTtJQUNuRSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFFN0MsZ0NBQWdDO0lBQ2hDLE1BQU0sYUFBYSxHQUF3QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzNFLE1BQU0sQ0FBQyxHQUFHLHVEQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9CLDhEQUE4RDtRQUM5RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFFLE9BQU8sU0FBUyxDQUFDO1FBRTlELE9BQU87WUFDSCxPQUFPLEVBQUUsT0FBTyxFQUFFO1lBQ2xCLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLElBQUksRUFBRSxXQUFXO1lBQ2pCLElBQUksRUFBRSxLQUFLO1lBQ1gsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUM7WUFDbkQsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDbkQsQ0FBQyxFQUFFLEdBQUc7WUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRTtZQUNwQixLQUFLLEVBQUUsQ0FBQztZQUNSLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLEtBQUssRUFBRSxDQUFDO1NBQ1gsQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDO0lBRUgsaUNBQWlDO0lBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQixJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkYsQ0FBQyxDQUFDLENBQUM7SUFFSCx3REFBd0Q7SUFDeEQsVUFBVSxDQUFDLElBQUksQ0FDWCxHQUFHLE1BQU0sRUFDVCxHQUFHLE9BQU8sRUFDVixHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQTRCLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FDckYsQ0FBQztJQUVGLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEIsa0JBQWtCO1FBQ2xCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzVDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTlDLHlCQUF5QjtZQUN6QixxQ0FBcUM7WUFDckMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDdEIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFbEMsTUFBTSxPQUFPLEdBQXdCO29CQUNqQyxPQUFPLEVBQUUsT0FBTyxFQUFFO29CQUNsQixTQUFTLEVBQUUsS0FBSztvQkFDaEIsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLElBQUksRUFBRSxJQUFJO29CQUNWLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLHVEQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUM1RSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyx1REFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDOUUsQ0FBQyxFQUFFLEdBQUc7b0JBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRztvQkFDZixLQUFLLEVBQUUsQ0FBQztvQkFDUixhQUFhLEVBQUUsS0FBSztvQkFDcEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNO2lCQUNwQixDQUFDO2dCQUVGLGdDQUFnQztnQkFDaEMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDakIsSUFBSSx1REFBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNoQixLQUFLLENBQUMsSUFBSSxDQUFDOzRCQUNQLElBQUksRUFBRSxhQUFhLENBQUMsd0RBQVksQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUNuRCxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3lCQUMzQixDQUFDLENBQUM7cUJBQ047eUJBQU07d0JBQ0gsS0FBSyxDQUFDLElBQUksQ0FBQzs0QkFDUCxJQUFJLEVBQUUsTUFBTSxDQUFDLHdEQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUNoQyxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3lCQUMzQixDQUFDLENBQUM7cUJBQ047Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsNEJBQTRCO2dCQUM1QixVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUV6Qiw0QkFBNEI7Z0JBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUM7b0JBQ1AsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDM0IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUNwQixDQUFDLENBQUM7Z0JBRUgsT0FBTzthQUNWO1lBRUQsTUFBTSxXQUFXLEdBQXdCO2dCQUNyQyxPQUFPLEVBQUUsT0FBTyxFQUFFO2dCQUNsQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLElBQUksRUFBRSxLQUFLO2dCQUNYLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDdEUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUM7Z0JBQ3BELENBQUMsRUFBRSxHQUFHO2dCQUNOLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUc7Z0JBQ2YsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTTthQUN4QixDQUFDO1lBRUYsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDckIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFekIsTUFBTSxPQUFPLEdBQXdCO29CQUNqQyxPQUFPLEVBQUUsT0FBTyxFQUFFO29CQUNsQixTQUFTLEVBQUUsS0FBSztvQkFDaEIsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLElBQUksRUFBRSxJQUFJO29CQUNWLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLHVEQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUM1RSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyx1REFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDOUUsQ0FBQyxFQUFFLEdBQUc7b0JBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRTtvQkFDL0MsS0FBSyxFQUFFLENBQUM7b0JBQ1IsYUFBYSxFQUFFLEtBQUs7b0JBQ3BCLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTTtpQkFDcEIsQ0FBQztnQkFFRix3QkFBd0I7Z0JBQ3hCLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUUvRCxnQ0FBZ0M7Z0JBQ2hDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ2pCLElBQUksdURBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQzs0QkFDUCxJQUFJLEVBQUUsYUFBYSxDQUFDLHdEQUFZLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDbkQsRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt5QkFDM0IsQ0FBQyxDQUFDO3FCQUNOO3lCQUFNO3dCQUNILEtBQUssQ0FBQyxJQUFJLENBQUM7NEJBQ1AsSUFBSSxFQUFFLE1BQU0sQ0FBQyx3REFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDaEMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt5QkFDM0IsQ0FBQyxDQUFDO3FCQUNOO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUVILDRCQUE0QjtnQkFDNUIsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFekIsOEJBQThCO2dCQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDO29CQUNQLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzNCLEVBQUUsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7aUJBQy9CLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBRUgsNkJBQTZCO1lBQzdCLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFN0IsNkJBQTZCO1lBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ1AsSUFBSSxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDL0IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2FBQ3BCLENBQUMsQ0FBQztZQUVILE9BQU87U0FDVjtRQUVELGtCQUFrQjtRQUNsQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTVCLHFCQUFxQjtRQUNyQixzQ0FBc0M7UUFDdEMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsQixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXZDLE1BQU0sV0FBVyxHQUF3QjtnQkFDckMsT0FBTyxFQUFFLE9BQU8sRUFBRTtnQkFDbEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLElBQUksRUFBRSxXQUFXO2dCQUNqQixJQUFJLEVBQUUsS0FBSztnQkFDWCxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSx1REFBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDaEYsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsdURBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ25GLENBQUMsRUFBRSxHQUFHO2dCQUNOLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUc7Z0JBQ2YsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTTthQUN4QixDQUFDO1lBRUYsaUNBQWlDO1lBQ2pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksdURBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQzt3QkFDUCxJQUFJLEVBQUUsYUFBYSxDQUFDLHdEQUFZLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDbkQsRUFBRSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtxQkFDL0IsQ0FBQyxDQUFDO2lCQUNOO3FCQUFNO29CQUNILEtBQUssQ0FBQyxJQUFJLENBQUM7d0JBQ1AsSUFBSSxFQUFFLE1BQU0sQ0FBQyx3REFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDaEMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtxQkFDL0IsQ0FBQyxDQUFDO2lCQUNOO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCw2QkFBNkI7WUFDN0IsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUU3Qiw2QkFBNkI7WUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDUCxJQUFJLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUMvQixFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7YUFDcEIsQ0FBQyxDQUFDO1lBRUgsT0FBTztTQUNWO1FBRUQsTUFBTSxPQUFPLEdBQXdCO1lBQ2pDLE9BQU8sRUFBRSxPQUFPLEVBQUU7WUFDbEIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsSUFBSSxFQUFFLFdBQVc7WUFDakIsSUFBSSxFQUFFLElBQUk7WUFDVixNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDbEUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUM7WUFDcEQsQ0FBQyxFQUFFLEdBQUc7WUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHO1lBQ2YsS0FBSyxFQUFFLENBQUM7WUFDUixhQUFhLEVBQUUsS0FBSztZQUNwQixLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU07U0FDcEIsQ0FBQztRQUVGLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVsQyxNQUFNLFdBQVcsR0FBd0I7Z0JBQ3JDLE9BQU8sRUFBRSxPQUFPLEVBQUU7Z0JBQ2xCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixJQUFJLEVBQUUsV0FBVztnQkFDakIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsdURBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2hGLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLHVEQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNuRixDQUFDLEVBQUUsR0FBRztnQkFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUMvQyxLQUFLLEVBQUUsQ0FBQztnQkFDUixhQUFhLEVBQUUsS0FBSztnQkFDcEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNO2FBQ3hCLENBQUM7WUFFRix1QkFBdUI7WUFDdkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFFL0QsaUNBQWlDO1lBQ2pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksdURBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQzt3QkFDUCxJQUFJLEVBQUUsYUFBYSxDQUFDLHdEQUFZLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDbkQsRUFBRSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtxQkFDL0IsQ0FBQyxDQUFDO2lCQUNOO3FCQUFNO29CQUNILEtBQUssQ0FBQyxJQUFJLENBQUM7d0JBQ1AsSUFBSSxFQUFFLE1BQU0sQ0FBQyx3REFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDaEMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtxQkFDL0IsQ0FBQyxDQUFDO2lCQUNOO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCw2QkFBNkI7WUFDN0IsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUU3Qiw4QkFBOEI7WUFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDUCxJQUFJLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUMvQixFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2FBQzNCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsNEJBQTRCO1FBQzVCLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekIsNEJBQTRCO1FBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDUCxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzNCLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtTQUNwQixDQUFDLENBQUM7UUFFSCxPQUFPO0lBQ1gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPO1FBQ0gsUUFBUSxFQUFFO1lBQ04sNEJBQTRCLEVBQUUsS0FBSztTQUN0QztRQUNELFVBQVU7UUFDVixLQUFLO0tBQ1IsQ0FBQztBQUNOLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM1U0QztBQUN1QztBQUVwRixrRUFBa0U7QUFDbEUsU0FBUyxVQUFVLENBQUMsS0FBZ0IsRUFBRSxJQUEyQztJQUM3RSwrQ0FBK0M7SUFDL0MsSUFBSSxJQUFJLEtBQUssaUJBQWlCO1FBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsdURBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFeEYsd0NBQXdDO0lBQ3hDLElBQUksSUFBSSxLQUFLLGlCQUFpQjtRQUFFLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLHVEQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFeEYsT0FBTyxzREFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRCxnRkFBZ0Y7QUFDekUsU0FBUyxTQUFTLENBQUMsS0FBb0I7SUFDMUMseURBQXlEO0lBQ3pELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsNkRBQXFCLENBQUM7UUFDL0QsTUFBTSxJQUFJLFVBQVUsQ0FBQyw0QkFBNEIsNkRBQXFCLFVBQVUsQ0FBQyxDQUFDO0lBRXRGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELDBDQUEwQztJQUMxQyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU5RSxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDakMsMEJBQTBCO1FBQzFCLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFBRSxPQUFPLE9BQU8sZ0VBQXdCLEdBQUcsQ0FBQztRQUNsRSx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQUUsT0FBTyxLQUFLLGdFQUF3QixFQUFFLENBQUM7UUFFL0QsK0JBQStCO1FBQy9CLDJEQUEyRDtRQUMzRCxpQ0FBaUM7UUFDakMsMkVBQTJFO1FBQzNFLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7UUFFakcsMkJBQTJCO1FBQzNCLElBQUksSUFBSSxLQUFLLGlCQUFpQixFQUFFO1lBQzVCLE9BQU8sQ0FDSCxHQUFHO2dCQUNILEtBQUs7cUJBQ0EsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxDQUFDO3FCQUNqRCxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNmLEdBQUcsQ0FDTixDQUFDO1NBQ0w7UUFFRCwwQkFBMEI7UUFDMUIsSUFBSSxJQUFJLEtBQUssaUJBQWlCLEVBQUU7WUFDNUIsT0FBTyxLQUFLO2lCQUNQLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQztpQkFDaEQsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO1FBRUQsT0FBTyxzREFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzFEdUQ7QUFFeEQsNkNBQTZDO0FBQzdDLCtDQUErQztBQUMvQyw2REFBNkQ7QUFDN0QsNkRBQTZEO0FBQzdELDREQUE0RDtBQUNyRCxTQUFTLFVBQVUsQ0FBQyxLQUFlLEVBQUUsS0FBZ0I7SUFDeEQsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDdEIsa0JBQWtCO1FBQ2xCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzVDLHVCQUF1QjtZQUN2QixPQUFPLElBQUk7aUJBQ04sS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDWixLQUFLLENBQUMsSUFBSSxDQUFDO2lCQUNYLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQ1AsQ0FBQztpQkFDSSxLQUFLLENBQUMsR0FBRyxDQUFDO2lCQUNWLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyx1REFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyx3REFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyx3REFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUNyQjtpQkFDQSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkI7UUFFRCxrQkFBa0I7UUFDbEIsc0ZBQXNGO1FBQ3RGLE9BQU8sSUFBSTthQUNOLEtBQUssQ0FBQyxHQUFHLENBQUM7YUFDVixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUNQLENBQUM7YUFDSSxLQUFLLENBQUMsUUFBUSxDQUFDO2FBQ2YsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLHVEQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLHdEQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLHdEQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9FLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FDdEI7YUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQ00sTUFBTSxRQUFRLEdBQUcsNEJBQTRCLENBQUM7QUFDckQsa0RBQWtEO0FBQzNDLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzNDLEtBQUssQ0FBQyxFQUFFLENBQUM7S0FDVCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdFLHFDQUFxQztBQUM5QixNQUFNLHdCQUF3QixHQUFHLFFBQVEsQ0FBQztBQUVqRCxpREFBaUQ7QUFDMUMsU0FBUyxXQUFXLENBQUMsQ0FBUyxFQUFFLE1BQWU7SUFDbEQsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUcsQ0FBQztBQUVELGlEQUFpRDtBQUMxQyxTQUFTLFlBQVksQ0FBQyxDQUFTO0lBQ2xDLE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELHFFQUFxRTtBQUM5RCxTQUFTLGNBQWMsQ0FBQyxDQUFTO0lBQ3BDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLHdCQUF3QixDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUVELG9EQUFvRDtBQUM3QyxTQUFTLFdBQVcsQ0FBQyxDQUFTO0lBQ2pDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2hELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQnVDO0FBQ1E7QUFDRTtBQUVsRCxJQUFJO0lBQ0EscUNBQXFDO0lBQ3JDLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQy9ELElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNiLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLGFBQWEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDbEgsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNiLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUNILGdCQUFnQjtZQUNoQiw2REFBUyxDQUFDLEtBQUssQ0FBQztpQkFDWCxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7aUJBQzFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDdEIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNiLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUNILFVBQVU7WUFDVixLQUFLO2lCQUNBLEdBQUcsQ0FDQSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUNSLFNBQVMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUk7Z0JBQ3hDLCtEQUFVLENBQUMsNkRBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUNoRTtpQkFDQSxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ3RCLENBQUMsQ0FBQztJQUVILE1BQU0sU0FBUyxHQUFHLHFEQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLDZEQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVsRixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFFbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUUzRCxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2IsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJO0tBQ2pDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxXQUFXLENBQUM7UUFDYixJQUFJLEVBQUUsVUFBVTtRQUNoQixPQUFPLEVBQUUsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7S0FDcEUsQ0FBQyxDQUFDO0NBQ047QUFBQyxPQUFPLENBQUMsRUFBRTtJQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFZixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUNqRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1RGtFO0FBQ1g7QUFFeEQsZ0NBQWdDO0FBQ3pCLEtBQUssVUFBVSxTQUFTO0lBQzNCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBRS9FLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUVkLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQW1CLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDekQsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDO1FBRTlELEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLElBQUk7UUFDTCxPQUFPLHNFQUFrQixDQUFDO1lBQ3RCLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsS0FBSyxFQUFFLDJEQUFtQjtZQUMxQixRQUFRLEVBQUUsc0RBQWM7U0FDM0IsQ0FBQyxDQUFDO0lBRVAsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztJQUVoQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXhCLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQXFCLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDMUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxTQUFTLENBQUMsQ0FBQztRQUV0RSxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxHQUFHO1FBQ0osT0FBTyxzRUFBa0IsQ0FBQztZQUN0QixPQUFPLEVBQUUsMEJBQTBCO1lBQ25DLEtBQUssRUFBRSwyREFBbUI7WUFDMUIsUUFBUSxFQUFFLHNEQUFjO1NBQzNCLENBQUMsQ0FBQztJQUVQLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVELHVDQUF1QztBQUNoQyxLQUFLLFVBQVUsWUFBWSxDQUFDLFFBQW9CO0lBQ25ELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN2QyxJQUFJLEVBQUUsR0FBRyxDQUFDLGVBQWUsQ0FDckIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxFQUFFLFlBQVk7U0FDckIsQ0FBQyxDQUNMO1FBQ0QsUUFBUSxFQUFFLG1CQUFtQjtLQUNoQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDZixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDcERELHVEQUF1RDtBQUVoRCxNQUFNLFNBQVMsR0FDbEIsT0FBTyxTQUFTLEtBQUssV0FBVztJQUM1QixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUN4RCxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQ2pFO0lBQ0gsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUlULFNBQVMsV0FBVyxDQUFDLEdBQUcsSUFBcUI7SUFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1FBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO0lBRXBDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2Y0RDtBQUNOO0FBUWhELE1BQU0sd0JBQXdCLEdBQUcsRUFBRSxDQUFDO0FBQ3BDLE1BQU0seUJBQXlCLEdBQUcsRUFBRSxDQUFDO0FBQ3JDLE1BQU0sd0JBQXdCLEdBQUcsR0FBRyxDQUFDO0FBQ3JDLE1BQU0seUJBQXlCLEdBQUcsRUFBRSxDQUFDO0FBQ3JDLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBQy9CLE1BQU0sb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25ELE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZFLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxFQUFFLENBQUMsc0VBQWtCLENBQUMsMERBQTBELENBQUMsQ0FBQztBQUVoSCxNQUFNLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFFbEYsTUFBTSx5QkFBeUIsR0FBRyxHQUFHLEVBQUUsQ0FDMUMsUUFBUSxDQUFDLGFBQWEsQ0FBb0IsMEJBQTBCLENBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLENBQUM7QUFFdEYsTUFBTSx5QkFBeUIsR0FBRyxHQUFHLEVBQUUsQ0FDMUMsUUFBUSxDQUFDLGFBQWEsQ0FBb0IsMEJBQTBCLENBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLENBQUM7QUFFdEYsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUM3QyxPQUFPLElBQUk7UUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQzNCLENBQUMsQ0FBQztBQUVLLE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUM3QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUUvRixNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxFQUFFLENBQ3BDLHNGQUErQixDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUM7QUFDOUUsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFLENBQy9CLHNGQUErQixDQUFDLENBQUMsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUM7QUFFekYsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXJHLE1BQU0sbUJBQW1CLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLE1BQU0sd0JBQXdCLEdBQUcsU0FBUyxDQUFDO0FBQzNDLE1BQU0sMEJBQTBCLEdBQUcsU0FBUyxDQUFDO0FBQzdDLE1BQU0sOEJBQThCLEdBQUcsU0FBUyxDQUFDO0FBQ2pELE1BQU0scUJBQXFCLEdBQUcsU0FBUyxDQUFDO0FBQ3hDLE1BQU0sbUJBQW1CLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLE1BQU0seUJBQXlCLEdBQUcsU0FBUyxDQUFDO0FBQzVDLE1BQU0sOEJBQThCLEdBQUcsU0FBUyxDQUFDO0FBQ2pELE1BQU0sa0NBQWtDLEdBQUcsU0FBUyxDQUFDO0FBQ3JELE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDO0FBQ3JDLE1BQU0sb0JBQW9CLEdBQUcsU0FBUyxDQUFDO0FBQ3ZDLE1BQU0sMEJBQTBCLEdBQUcsU0FBUyxDQUFDO0FBQzdDLE1BQU0sb0JBQW9CLEdBQUcsU0FBUyxDQUFDO0FBQ3ZDLE1BQU0sc0JBQXNCLEdBQUcsU0FBUyxDQUFDO0FBQ3pDLE1BQU0sMkJBQTJCLEdBQUcsU0FBUyxDQUFDO0FBQzlDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQztBQUM1QixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDckIsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pFaEM7QUFFUjtBQUNJO0FBQ0k7QUFDSjtBQUNYO0FBQ0o7QUFDQTtBQUNKO0FBRWxDLE1BQU0sTUFBTSxHQUFHO0lBQ2xCLGtCQUFrQixFQUFFO1FBQ2hCLEtBQUssRUFBRSxrQkFBa0I7UUFDekIsT0FBTyxFQUFFLEdBQUc7UUFDWixRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFVLEVBQUUsRUFBRTtZQUM5QixJQUFJLDRFQUFzQjtnQkFBRSxPQUFPLDhEQUFrQixFQUFFLENBQUM7WUFFeEQsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sdUVBQW1CLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUVsRyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQUUsT0FBTztZQUVyRCxNQUFNLElBQUksR0FBRyxxREFBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBRTNDLE1BQU0sU0FBUyxHQUFHLElBQUk7Z0JBQ2xCLENBQUMsQ0FBQyxJQUFJLHlEQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsb0RBQVksQ0FBQztnQkFDMUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxTQUFTO29CQUNsQyxDQUFDLENBQUMsSUFBSSxxREFBTyxFQUFFO29CQUNmLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFFaEIsSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTyxzRUFBa0IsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBRXBGLE1BQU0sU0FBUyxHQUFHLHVGQUErQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXhELE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtnQkFDRCxnRUFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFOUIsSUFBSSxnRUFBa0IsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDL0IsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUVuQixNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFOUQsU0FBUyxDQUFDLElBQUksQ0FBQzt3QkFDWCxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzt3QkFDcEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7cUJBQ3hDLENBQUMsQ0FBQztvQkFFSCwrRUFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDdEM7WUFDTCxDQUFDLEVBQ0QsR0FBRyxFQUFFO2dCQUNELHNFQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUVqQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRW5CLGlGQUF5QixHQUFHLFNBQVMsQ0FBQztZQUMxQyxDQUFDLENBQ0osQ0FBQztRQUNOLENBQUM7S0FDSjtDQUN3QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0R5RTtBQUUzQztBQUNJO0FBQ0o7QUFDbkI7QUFDRTtBQUNFO0FBRXRDLE1BQU0sRUFBRSxHQUFHO0lBQ2QsV0FBVyxFQUFFO1FBQ1QsS0FBSyxFQUFFLFdBQVc7UUFDbEIsT0FBTyxFQUFFLEdBQUc7UUFDWixRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNaLElBQUksNEVBQXNCO2dCQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQztZQUV4RCxNQUFNLEtBQUssR0FBRyxJQUFJLGlEQUFLLENBQUM7Z0JBQ3BCLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLGdFQUF3QixHQUFHLENBQUM7Z0JBQzNDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLGdFQUF3QixHQUFHLENBQUM7YUFDOUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxTQUFTLEdBQUcsdUZBQStCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFeEQsT0FBTyxnRkFBMEIsQ0FDN0IsR0FBRyxFQUFFO2dCQUNELGdFQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUUxQixJQUFJLGdFQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUMzQixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBRWYsK0VBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2xDO1lBQ0wsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQkFDRCxzRUFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFN0IsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUVmLGlGQUF5QixHQUFHLFNBQVMsQ0FBQztZQUMxQyxDQUFDLENBQ0osQ0FBQztRQUNOLENBQUM7S0FDSjtJQUNELFlBQVksRUFBRTtRQUNWLEtBQUssRUFBRSxZQUFZO1FBQ25CLE9BQU8sRUFBRSxHQUFHO1FBQ1osUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDWixJQUFJLDRFQUFzQjtnQkFBRSxPQUFPLDhEQUFrQixFQUFFLENBQUM7WUFFeEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxtREFBTSxDQUFDO2dCQUN0QixDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxpRUFBeUIsR0FBRyxDQUFDO2dCQUM1QyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxpRUFBeUIsR0FBRyxDQUFDO2FBQy9DLENBQUMsQ0FBQztZQUVILE1BQU0sU0FBUyxHQUFHLHVGQUErQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXhELE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtnQkFDRCxnRUFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFM0IsSUFBSSxnRUFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDNUIsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUVoQiwrRUFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDbkM7WUFDTCxDQUFDLEVBQ0QsR0FBRyxFQUFFO2dCQUNELHNFQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUU5QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRWhCLGlGQUF5QixHQUFHLFNBQVMsQ0FBQztZQUMxQyxDQUFDLENBQ0osQ0FBQztRQUNOLENBQUM7S0FDSjtDQUN3QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUVzRTtBQUN2QztBQUNOO0FBQ0w7QUFDRjtBQUNKO0FBQ0o7QUFDRTtBQUVGO0FBbUVqQyxTQUFTLFdBQVcsQ0FBQyxVQUFxQixFQUFFLEtBQWU7SUFDOUQsTUFBTSxFQUFFLEdBQUcsNkRBQWlCLEVBQUUsQ0FBQztJQUUvQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBbUIsQ0FBQztJQUV2QyxNQUFNLElBQUksR0FBc0I7UUFDNUIsUUFBUSxFQUFFO1lBQ04sQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLGlGQUEwQjtTQUM3RDtRQUNELFVBQVUsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQzlDLElBQUksU0FBUyxZQUFZLGlEQUFLLEVBQUU7Z0JBQzVCLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBTSxDQUFDLENBQUM7Z0JBRTdDLE9BQU87b0JBQ0gsT0FBTztvQkFDUCxTQUFTLEVBQUUsU0FBUyxDQUFDLFVBQVU7b0JBQy9CLElBQUksRUFBRSxPQUFPO29CQUNiLFNBQVMsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO29CQUM1RCxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFFO29CQUMvQixDQUFDLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDM0MsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7aUJBQzdDLENBQUM7YUFDTDtZQUVELElBQUksU0FBUyxZQUFZLG1EQUFNLEVBQUU7Z0JBQzdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBTSxDQUFDLENBQUM7Z0JBRTdDLE9BQU87b0JBQ0gsT0FBTztvQkFDUCxTQUFTLEVBQUUsU0FBUyxDQUFDLFVBQVU7b0JBQy9CLElBQUksRUFBRSxRQUFRO29CQUNkLFNBQVMsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO29CQUM1RCxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFFO29CQUMvQixDQUFDLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDM0MsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7aUJBQzdDLENBQUM7YUFDTDtZQUVELElBQUksU0FBUyxZQUFZLHlEQUFTLEVBQUU7Z0JBQ2hDLE9BQU87b0JBQ0gsT0FBTztvQkFDUCxTQUFTLEVBQUUsU0FBUyxDQUFDLFVBQVU7b0JBQy9CLElBQUksRUFBRSxXQUFXO29CQUNqQixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJO29CQUN6QixNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDL0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQU0sQ0FBQyxDQUFDO3dCQUU3QixPQUFPLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7b0JBQzdFLENBQUMsQ0FBQztvQkFDRixPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDakMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQU0sQ0FBQyxDQUFDO3dCQUU3QixPQUFPLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7b0JBQzdFLENBQUMsQ0FBQztvQkFDRixDQUFDLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDM0MsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7b0JBQzFDLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSztvQkFDdEIsYUFBYSxFQUFFLFNBQVMsQ0FBQyxhQUFhO29CQUN0QyxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUs7aUJBQ3pCLENBQUM7YUFDTDtZQUVELElBQUksU0FBUyxZQUFZLHFEQUFPLEVBQUU7Z0JBQzlCLE9BQU87b0JBQ0gsT0FBTztvQkFDUCxTQUFTLEVBQUUsU0FBUyxDQUFDLFVBQVU7b0JBQy9CLElBQUksRUFBRSxTQUFTO29CQUNmLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUMvQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBTSxDQUFDLENBQUM7d0JBRTdCLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztvQkFDN0UsQ0FBQyxDQUFDO29CQUNGLE9BQU8sRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNqQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBTSxDQUFDLENBQUM7d0JBRTdCLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztvQkFDN0UsQ0FBQyxDQUFDO29CQUNGLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSztvQkFDdEIsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7b0JBQzNDLENBQUMsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO29CQUMxQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUs7aUJBQ3pCLENBQUM7YUFDTDtZQUVELHNFQUFrQixDQUFDO2dCQUNmLE9BQU8sRUFBRSw4QkFBOEI7Z0JBQ3ZDLEtBQUssRUFBRSwyREFBbUI7Z0JBQzFCLFFBQVEsRUFBRSxzREFBYzthQUMzQixDQUFDLENBQUM7WUFFSCxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDO1FBQ0YsS0FBSyxFQUFFLEtBQUs7YUFDUCxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQzthQUNqQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDWixJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFO1lBQ3pCLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUU7U0FDeEIsQ0FBQyxDQUFDO0tBQ1YsQ0FBQztJQUVGLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLHFEQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUVNLFNBQVMsUUFBUSxDQUNwQixJQUFZO0lBSVosSUFBSTtRQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWYsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQW1CLENBQUM7UUFFNUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN4QyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO2dCQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLGlEQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTdCLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUUzRCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVwQyxPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQ3BEO1lBRUQsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxtREFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUUvQixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFNUQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFckMsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzthQUN0RDtZQUVELElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ3hCLE1BQU0sT0FBTyxHQUFHLElBQUkscURBQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRWpGLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO29CQUNwQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFFakUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7b0JBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUVuRSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNoRCxDQUFDLENBQUMsQ0FBQztnQkFFSCxPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2FBQ3hEO1lBRUQsTUFBTSxTQUFTLEdBQUcsSUFBSSx5REFBUyxDQUFDLElBQUksQ0FBQyxxREFBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FDbkcsR0FBRyxDQUFDLEtBQUssQ0FDWixDQUFDO1lBRUYsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3RDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUVqRSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlDLENBQUMsQ0FBQyxDQUFDO1lBRUgsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3hDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUVuRSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksMkRBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxDQUFDO1FBRW5HLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7S0FDeEU7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLElBQUksQ0FBQyxZQUFZLEtBQUs7WUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBRWhFLE9BQU8sRUFBRSxLQUFLLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO0tBQzNEO0FBQ0wsQ0FBQztBQUVELHNFQUFzRTtBQUN0RSxTQUFTLFFBQVEsQ0FBQyxJQUFhO0lBQzNCLElBQUksQ0FBQyxJQUFJLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUVqRixJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0lBRWhGLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0lBRWxILElBQUksQ0FBQyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7SUFFNUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUV6RixJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBRWxFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7SUFFL0UsSUFBSSxDQUFDLENBQUMsNEJBQTRCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNoRCxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFFckUsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBdUIsRUFBRTtRQUNsRCxJQUFJLENBQUMsU0FBUyxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFFbkcsSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUV6RixJQUFJLE9BQU8sU0FBUyxDQUFDLE9BQU8sS0FBSyxRQUFRO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBRTNGLElBQUksQ0FBQyxDQUFDLFdBQVcsSUFBSSxTQUFTLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7UUFFbEcsSUFBSSxPQUFPLFNBQVMsQ0FBQyxTQUFTLEtBQUssU0FBUztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztRQUV6RyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBRWxGLElBQUksT0FBTyxTQUFTLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDM0csTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFFdkYsSUFBSSxPQUFPLFNBQVMsQ0FBQyxDQUFDLEtBQUssUUFBUTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUVqRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBRXZGLElBQUksT0FBTyxTQUFTLENBQUMsQ0FBQyxLQUFLLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7UUFFakcsUUFBUSxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ3BCLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxRQUFRLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztnQkFFdEUsSUFBSSxPQUFPLFNBQVMsQ0FBQyxFQUFFLEtBQUssUUFBUTtvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7Z0JBRWxGLElBQUksQ0FBQyxDQUFDLFdBQVcsSUFBSSxTQUFTLENBQUM7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO2dCQUUzRixJQUFJLE9BQU8sU0FBUyxDQUFDLFNBQVMsS0FBSyxTQUFTO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztnQkFFdEcsTUFBTTthQUNUO1lBQ0QsS0FBSyxXQUFXLENBQUMsQ0FBQztnQkFDZCxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksU0FBUyxDQUFDO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztnQkFFMUYsSUFBSSxPQUFPLFNBQVMsQ0FBQyxLQUFLLEtBQUssUUFBUTtvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7Z0JBRTdGLElBQUksQ0FBQyxDQUFDLGVBQWUsSUFBSSxTQUFTLENBQUM7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO2dCQUV4RyxJQUFJLE9BQU8sU0FBUyxDQUFDLGFBQWEsS0FBSyxTQUFTO29CQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7Z0JBRS9ELElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUM7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO2dCQUVqRixJQUFJLE9BQU8sU0FBUyxDQUFDLEtBQUssS0FBSyxRQUFRO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztnQkFFMUYsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQztvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7Z0JBRW5GLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO2dCQUVqRyxJQUFJLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztnQkFFckYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7Z0JBRW5HLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUM7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2dCQUVwRixJQUFJLE9BQU8sU0FBUyxDQUFDLElBQUksS0FBSyxRQUFRO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztnQkFFdkYsSUFBSSxDQUFDLHFEQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7Z0JBRWpHLE1BQU0sSUFBSSxHQUFHLHFEQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBRSxDQUFDO2dCQUU3RCxJQUNJLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTTtvQkFDdkIsQ0FBQyxTQUFTLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUV6RSxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7Z0JBRXBFLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDeEYsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO2dCQUV0RSxLQUFLLE1BQU0sS0FBSyxJQUFJLFNBQVMsQ0FBQyxNQUFtQixFQUFFO29CQUMvQyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7d0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO29CQUV6RixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztvQkFFbkUsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFLEtBQUssUUFBUTt3QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7b0JBRXJGLElBQUksQ0FBQyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUM7d0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO29CQUV6RixJQUFJLE9BQU8sS0FBSyxDQUFDLFNBQVMsS0FBSyxTQUFTO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztpQkFDckc7Z0JBRUQsS0FBSyxNQUFNLE1BQU0sSUFBSSxTQUFTLENBQUMsT0FBb0IsRUFBRTtvQkFDakQsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztvQkFFM0YsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQzt3QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7b0JBRXBFLElBQUksT0FBTyxNQUFNLENBQUMsRUFBRSxLQUFLLFFBQVE7d0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29CQUV0RixJQUFJLENBQUMsQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztvQkFFMUYsSUFBSSxPQUFPLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUzt3QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7aUJBQ3RHO2dCQUVELE1BQU07YUFDVDtZQUNELEtBQUssU0FBUyxDQUFDLENBQUM7Z0JBQ1osSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQztvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7Z0JBRXhGLElBQUksT0FBTyxTQUFTLENBQUMsS0FBSyxLQUFLLFFBQVE7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO2dCQUU3RixJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksU0FBUyxDQUFDO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztnQkFFdkYsSUFBSSxPQUFPLFNBQVMsQ0FBQyxLQUFLLEtBQUssUUFBUTtvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7Z0JBRTVGLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUM7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2dCQUVqRixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO29CQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztnQkFFL0YsSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQztvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7Z0JBRW5GLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7b0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO2dCQUVqRyxLQUFLLE1BQU0sS0FBSyxJQUFJLFNBQVMsQ0FBQyxNQUFtQixFQUFFO29CQUMvQyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7d0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO29CQUV6RixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztvQkFFbkUsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFLEtBQUssUUFBUTt3QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7b0JBRXJGLElBQUksQ0FBQyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUM7d0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO29CQUV6RixJQUFJLE9BQU8sS0FBSyxDQUFDLFNBQVMsS0FBSyxTQUFTO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztpQkFDckc7Z0JBRUQsS0FBSyxNQUFNLE1BQU0sSUFBSSxTQUFTLENBQUMsT0FBb0IsRUFBRTtvQkFDakQsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztvQkFFM0YsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQzt3QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7b0JBRXBFLElBQUksT0FBTyxNQUFNLENBQUMsRUFBRSxLQUFLLFFBQVE7d0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29CQUV0RixJQUFJLENBQUMsQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztvQkFFMUYsSUFBSSxPQUFPLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUzt3QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7aUJBQ3RHO2FBQ0o7U0FDSjtLQUNKO0lBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQVMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUN0RCxTQUFTLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLFNBQVM7UUFDMUQsQ0FBQyxDQUFDO1lBQ0ksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDdkQsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDM0Q7UUFDSCxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FDckIsQ0FBQztJQUVGLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQWtCLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBRXZGLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7UUFFN0YsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztRQUU1RixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBRW5GLElBQUksT0FBTyxJQUFJLENBQUMsRUFBRSxLQUFLLFFBQVE7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFFMUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0tBQ2hIO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzliaUc7QUFFM0YsTUFBTSxhQUFhO0lBQ3RCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQWlGLENBQUM7SUFFeEcsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVqQixNQUFNLENBQUMsT0FBTztRQUNWLElBQUksb0RBQVk7WUFBRSxPQUFPO1FBRXpCLE1BQU0sRUFBRSxHQUFHLHFFQUF5QixFQUFFLENBQUM7UUFDdkMsTUFBTSxFQUFFLEdBQUcscUVBQXlCLEVBQUUsQ0FBQztRQUV2QyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFFdEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNwQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBRXRDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDdkIsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSztRQUNSLElBQUksb0RBQVk7WUFBRSxPQUFPO1FBRXpCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVmLE1BQU0sRUFBRSxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1AsSUFBSSxvREFBWTtZQUFFLE9BQU87UUFFekIsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWtGO1FBQzVGLElBQUksb0RBQVk7WUFBRSxPQUFPO1FBRXpCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQWtGO1FBQy9GLElBQUksb0RBQVk7WUFBRSxPQUFPO1FBRXpCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEQ2QztBQUUzQyxNQUFNLGVBQWU7SUFDeEIsTUFBTSxDQUFVLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBYyxDQUFDO0lBRWpELE1BQU0sQ0FBVSxZQUFZLEdBQUcsbUJBQW1CLENBQUM7SUFDbkQsTUFBTSxDQUFVLGtCQUFrQixHQUFHLHlCQUF5QixDQUFDO0lBRS9ELE1BQU0sS0FBSyxlQUFlO1FBQ3RCLE9BQU8sK0RBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQztJQUMxRCxDQUFDO0lBRUQsTUFBTSxLQUFLLGVBQWUsQ0FBQyxLQUFjO1FBQ3JDLCtEQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUU5QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRXBELFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELE1BQU0sS0FBSyxxQkFBcUI7UUFDNUIsT0FBTywrREFBa0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxLQUFLLENBQUM7SUFDaEUsQ0FBQztJQUVELE1BQU0sS0FBSyxxQkFBcUIsQ0FBQyxLQUFjO1FBQzNDLCtEQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRTlDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFcEQsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxNQUFNLEtBQUssUUFBUTtRQUNmLE9BQU8sUUFBUSxDQUFDLGFBQWEsQ0FBYyxpQkFBaUIsQ0FBRSxDQUFDO0lBQ25FLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQWU7UUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBZTtRQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUU7UUFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7UUFFN0MsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFjLGdEQUFnRCxDQUFDLENBQUM7UUFFekcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2xCLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFxQixDQUFDLEdBQUcsRUFBRTtZQUN2QixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xCLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUM1QixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDO0lBRUYsTUFBTSxDQUFDLE1BQU07UUFDVCwwQ0FBMEM7UUFDMUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzVDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUM7UUFFeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXhELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUzRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFlO1FBQ2pDLElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUN0RixDQUFDO0lBRUQsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQWU7UUFDdkMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztJQUNsRyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1Rm1DO0FBQytFO0FBQ3hEO0FBQ1Y7QUFDZ0I7QUFDckI7QUFDSTtBQUNBO0FBQ047QUFDSTtBQUNJO0FBRS9DLE1BQU0sZUFBZTtJQUN4QixNQUFNLENBQUMsUUFBUSxDQUEwQjtJQUV6QyxNQUFNLENBQVUsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFFckMsTUFBTSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUU5RSxNQUFNLENBQUMsUUFBUSxDQUFzQjtJQUVyQyxNQUFNLENBQUMsU0FBUyxDQUF1QztJQUV2RCxNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRW5DLE1BQU0sQ0FBQyxVQUFVLENBQXlDO0lBRTFELE1BQU0sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBRTNCLE1BQU0sS0FBSyxVQUFVO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBRUQsTUFBTSxLQUFLLFVBQVUsQ0FBQyxLQUFjO1FBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXpCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRTdCLHFFQUF3QixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELE1BQU0sQ0FBQyxxQkFBcUIsQ0FDeEIsRUFBRSxVQUFVLEdBQUcsS0FBSyxFQUFFLGVBQWUsR0FBRyxLQUFLLEtBQTBEO1FBQ25HLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLGVBQWUsRUFBRSxLQUFLO0tBQ3pCO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxlQUFlO2dCQUNoQixxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7b0JBQ3ZCLG9FQUFzQixDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7d0JBQ2pDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7d0JBQ3RDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7d0JBRXZDLHFCQUFxQixDQUFDLEdBQUcsRUFBRTs0QkFDdkIsTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUNsRCxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNsQyxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNwQyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUN0QyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUV4QyxTQUFTLENBQUMsSUFBSSxDQUFDO2dDQUNYLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxpREFBUyxDQUFDLEdBQUcsaURBQVM7Z0NBQzNDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxpREFBUyxDQUFDLEdBQUcsaURBQVM7NkJBQzdDLENBQUMsQ0FBQzs0QkFFSCxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsaURBQVMsQ0FBQyxHQUFHLGlEQUFTLEdBQUcsSUFBSSxDQUFDOzRCQUNuRixTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsaURBQVMsQ0FBQyxHQUFHLGlEQUFTLEdBQUcsSUFBSSxDQUFDO3dCQUN6RixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsQ0FBQztZQUVQLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxpREFBUyxHQUFHLEtBQUssR0FBRyxpREFBUyxHQUFHLElBQUksQ0FBQztZQUUxRSxJQUFJLDZFQUErQixFQUFFO2dCQUNqQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsNkJBQTZCLGtFQUEwQixzREFBc0Qsa0VBQTBCLHdCQUF3QixDQUFDO2FBQ3pNO2lCQUFNO2dCQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyw2QkFBNkIsbUVBQTJCLHNEQUFzRCxtRUFBMkIsd0JBQXdCLENBQUM7YUFDM007U0FDSjthQUFNO1lBQ0gscUJBQXFCLENBQUMsR0FBRyxFQUFFO2dCQUN2QixvRUFBc0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO29CQUNqQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUN0QyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUMzQyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztZQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1NBQ3ZDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBb0IsRUFBRSxNQUFNLEdBQUcsT0FBTztRQUMvQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFakMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUF1QyxFQUFFLEVBQUU7WUFDMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFFeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUV2QyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO1lBRXhDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUVuRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFFMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBRTNCLElBQ0ksQ0FBQywyRUFBMkIsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JDLENBQUMsQ0FDRyxDQUFDLGdEQUFTLElBQUksQ0FBQyx1RUFBeUIsQ0FBQyxVQUFVLENBQUMsSUFBSSx1RUFBeUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNoRyxDQUFDLENBQUMsZ0RBQVM7d0JBQ1AsQ0FBQyx1RUFBeUIsQ0FBQyxhQUFhLENBQUMsSUFBSSx1RUFBeUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQy9GO2dCQUVELCtFQUErQixFQUFFLENBQUM7WUFFdEMsSUFBSSw4RUFBOEIsSUFBSSxDQUFDLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ3pDO2lCQUFNO2dCQUNILElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLHlFQUF5QixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTdFLDBEQUEwRDtnQkFDMUQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLHlFQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN6RCxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVDLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDM0MsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzNDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQ3hDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQ3hDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztnQkFDbkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUVkLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2dCQUUvQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFFdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7YUFDM0I7WUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuRCxDQUFDLENBQUM7UUFFRixNQUFNLFVBQVUsR0FBRyxDQUFDLENBQWEsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFFckUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBb0IsRUFBRSxLQUFlO1FBQy9DLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTVDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxLQUFLO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1FBRXBGLElBQUksUUFBUSxFQUFFO1lBQ1YsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUUvQixPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNoRixPQUFPLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUVsRixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRTVELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFFNUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVqQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUUxQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUUxQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUUzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUU1QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQW9DO1FBQ2xELElBQ0ksZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQywrREFBb0IsS0FBSyxDQUFDLENBQUM7WUFDM0IsK0RBQW9CLEtBQUssQ0FBQyxDQUFDLEVBQzdCO1lBQ0UsRUFBRSxDQUFDLFdBQVcsR0FBRywrREFBbUIsRUFBRSxDQUFDO1lBRXZDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1lBRW5CLEVBQUUsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBRXRCLEVBQUUsQ0FBQyxVQUFVLENBQ1QsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQ3pCLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUN6QiwrREFBb0IsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsRUFDaEQsK0RBQW9CLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQ25ELENBQUM7U0FDTDtJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTTtRQUNULElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRTdCLGdFQUFvQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFN0MsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3RCxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0QsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTTtRQUNULElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRWpELFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRSxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEUsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xFLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsTUFBTSxDQUFVLFVBQVUsR0FBRyxDQUFDLENBQXVDLEVBQUUsRUFBRTtRQUNyRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFMUIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLHdFQUFzQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU1RSxJQUFJLGVBQWUsQ0FBQyxVQUFVLEVBQUU7Z0JBQzVCLElBQUksOEVBQThCLElBQUksQ0FBQyxFQUFFO29CQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJO3dCQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxpREFBUyxDQUFDLEdBQUcsaURBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ2hGLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUc7d0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLGlEQUFTLENBQUMsR0FBRyxpREFBUyxHQUFHLElBQUksQ0FBQztpQkFDbkY7cUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUN0QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBRXRELGlGQUFpQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7d0JBQzVDLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQzt3QkFFekQsU0FBUyxDQUFDLElBQUksQ0FBQzs0QkFDWCxDQUFDLEVBQ0csSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsaURBQVMsQ0FBQyxHQUFHLGlEQUFTO2dDQUNwRSxNQUFNLENBQUMsSUFBSTtnQ0FDWCxPQUFPLENBQUMsSUFBSTs0QkFDaEIsQ0FBQyxFQUNHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLGlEQUFTLENBQUMsR0FBRyxpREFBUztnQ0FDcEUsTUFBTSxDQUFDLEdBQUc7Z0NBQ1YsT0FBTyxDQUFDLEdBQUc7eUJBQ2xCLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsQ0FBQztpQkFDTjthQUNKO2lCQUFNO2dCQUNILElBQUksOEVBQThCLElBQUksQ0FBQyxFQUFFO29CQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO29CQUNqRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO2lCQUNuRTtxQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ3RCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQztvQkFFdEQsaUZBQWlDLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTt3QkFDNUMsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO3dCQUV6RCxTQUFTLENBQUMsSUFBSSxDQUFDOzRCQUNYLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJOzRCQUM5RCxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRzt5QkFDL0QsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7U0FDSjtJQUNMLENBQUMsQ0FBQztJQUVGLE1BQU0sQ0FBVSxVQUFVLEdBQUcsQ0FBQyxDQUEwQixFQUFFLEVBQUU7UUFDeEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUUxQixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFM0IsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQWlCLENBQUM7UUFFbkMsTUFBTSxpQkFBaUIsR0FBRztZQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUM7WUFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7WUFDL0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7WUFDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztTQUNwQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBRSxDQUFDO1FBRXZDLElBQUksQ0FBQyxZQUFZLFVBQVUsRUFBRTtZQUN6QixJQUFJLENBQUMsaUJBQWlCLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3RDLElBQUksdUVBQXlCLENBQUMsTUFBTSxDQUFDLElBQUksdUVBQXlCLENBQUMsTUFBTSxDQUFDLEVBQUU7aUJBQzNFO3FCQUFNLElBQUksdUVBQXlCLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQzFDLGlFQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3JCO3FCQUFNLElBQUksdUVBQXlCLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQzFDLDJFQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMxQjtxQkFBTTtvQkFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO2lCQUMvQjthQUNKO1NBQ0o7YUFBTTtZQUNILElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQzthQUMvQjtTQUNKO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUMsQ0FBQztJQUVGLE1BQU0sQ0FBVSxRQUFRLEdBQUcsQ0FBQyxDQUF1QyxFQUFFLEVBQUU7UUFDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRTFCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBYyx1QkFBdUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMxRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUV6QixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLDhFQUE4QixJQUFJLENBQUMsRUFBRTtnQkFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVUsQ0FBQztnQkFDakMsTUFBTSxJQUFJLEdBQUcsaURBQVMsQ0FBQztnQkFFdkIsSUFBSSxLQUFLLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtvQkFDNUMsSUFBSSxlQUFlLENBQUMsVUFBVTt3QkFDMUIsdUVBQTBCLENBQ3RCLEdBQUcsRUFBRTs0QkFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyx3RUFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFFOUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDOzRCQUM5RSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7d0JBQ2pGLENBQUMsRUFDRCxHQUFHLEVBQUU7NEJBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsd0VBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBRTlELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7NEJBQ3RFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7d0JBQ3pFLENBQUMsQ0FDSixDQUFDOzt3QkFFRix1RUFBMEIsQ0FDdEIsR0FBRyxFQUFFOzRCQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLHdFQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUU5RCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQzs0QkFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsR0FB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QUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7Z0JBQzlELENBQUMsQ0FBQztvQkFDSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDbkQsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7aUJBQzlDO2dCQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO29CQUNuQyxDQUFDLENBQUM7d0JBQ0ksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ25ELENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQy9ELENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3ZELENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3FCQUM5QztvQkFDSCxDQUFDLENBQUM7d0JBQ0ksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ25ELENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBQy9ELENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBQ3ZELENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3FCQUM5QyxDQUFDO1lBRVosTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2pDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDZixFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDZixFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksY0FBYyxDQUFDLElBQUksRUFBRTtZQUNyQixNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFFekQsRUFBRSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO2dCQUNoRSxDQUFDLENBQUMsK0RBQW1CLEVBQUU7Z0JBQ3ZCLENBQUMsQ0FBQywwREFBYyxFQUFFLENBQUM7WUFFdkIsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFFakIsRUFBRSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRywrREFBb0IsQ0FBQztZQUM3RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLCtEQUFvQixDQUFDO1lBRTlELE1BQU0sTUFBTSxHQUNSLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7Z0JBQzlELENBQUMsQ0FBQztvQkFDSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDbkQsQ0FBQywrREFBb0IsRUFBRSwrREFBb0IsQ0FBQztpQkFDL0M7Z0JBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7b0JBQ25DLENBQUMsQ0FBQzt3QkFDSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFDbkQsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFDL0QsQ0FBQywrREFBb0IsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLCtEQUFvQixDQUFDO3dCQUN4RCxDQUFDLCtEQUFvQixFQUFFLCtEQUFvQixDQUFDO3FCQUMvQztvQkFDSCxDQUFDLENBQUM7d0JBQ0ksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ25ELENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7d0JBQy9ELENBQUMsK0RBQW9CLEVBQUUsK0RBQW9CLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQzt3QkFDeEQsQ0FBQywrREFBb0IsRUFBRSwrREFBb0IsQ0FBQztxQkFDL0MsQ0FBQztZQUVaLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDUCxnRUFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUMzQixNQUFNLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUU3QixNQUFNLEtBQUssV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUVELE1BQU0sS0FBSyxhQUFhO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMvQixDQUFDO0lBRUQsTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFVO1FBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBRXRCLCtEQUFrQixDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsTUFBTSxLQUFLLGFBQWEsQ0FBQyxDQUFVO1FBQy9CLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO1FBRXhCLCtEQUFrQixDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQ7UUFDSSxJQUFJLENBQUMsWUFBWSxHQUFHLCtEQUFrQixDQUFDLHFCQUFxQixDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNuRixJQUFJLENBQUMsY0FBYyxHQUFHLCtEQUFrQixDQUFDLHVCQUF1QixDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3RixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNU4wQztBQUNSO0FBQ3lCO0FBRXpELE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxDQUFhLEVBQUUsRUFBRSxDQUNqRCxpRkFBeUIsQ0FBQyxDQUFDLEVBQUU7SUFDekI7UUFDSSxLQUFLLEVBQUUsU0FBUztRQUNoQixRQUFRLENBQUMsQ0FBQztZQUNOLHlGQUF3QyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdEUsQ0FBQztLQUNKO0lBQ0Q7UUFDSSxLQUFLLEVBQUUsUUFBUTtRQUNmLFFBQVEsQ0FBQyxDQUFDO1lBQ04sMkVBQThCLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUM7S0FDSjtJQUNEO1FBQ0ksS0FBSyxFQUFFLE9BQU87UUFDZCxRQUFRLENBQUMsQ0FBQztZQUNOLDBFQUE2QixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDO0tBQ0o7Q0FDSixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QnFDO0FBQ29CO0FBQ0o7QUFDSTtBQUNmO0FBQ0o7QUFDSjtBQUVsQyxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQWEsRUFBRSxFQUFFLENBQzVDLGlGQUF5QixDQUNyQixDQUFDLEVBQ0QscURBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUk7SUFDaEIsUUFBUSxDQUFDLENBQUM7UUFDTixNQUFNLFNBQVMsR0FBRyxJQUFJLHlEQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsb0RBQVksQ0FBQyxDQUFDO1FBRTNFLE1BQU0sU0FBUyxHQUFHLHVGQUErQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhELE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtZQUNELGdFQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTlCLElBQUksZ0VBQWtCLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQy9CLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFbkIsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTlELFNBQVMsQ0FBQyxJQUFJLENBQUM7b0JBQ1gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7b0JBQ3BDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2lCQUN4QyxDQUFDLENBQUM7Z0JBRUgsK0VBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDdEM7UUFDTCxDQUFDLEVBQ0QsR0FBRyxFQUFFO1lBQ0Qsc0VBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFakMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRW5CLGlGQUF5QixHQUFHLFNBQVMsQ0FBQztRQUMxQyxDQUFDLENBQ0osQ0FBQztJQUNOLENBQUM7Q0FDSixDQUFDLENBQUMsQ0FDTixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdDa0M7QUFDc0Q7QUFDaEM7QUFDQTtBQUNOO0FBQ0k7QUFDQTtBQUNKO0FBQzBCO0FBQ2hCO0FBQ3JCO0FBRXRDLE1BQU0sU0FBOEMsU0FBUSw2Q0FBTztJQUM3RCxPQUFPLENBQUM7SUFFakIsTUFBTSxDQUFDO0lBQ1AsT0FBTyxDQUFDO0lBQ0MsSUFBSSxDQUFDO0lBRUwsVUFBVSxHQUFHLElBQUksR0FBRyxFQUE2QixDQUFDO0lBQ2xELFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztJQUMzQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7SUFDL0MsT0FBTyxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO0lBRXpDLElBQUksQ0FBYTtJQUMxQixJQUFJLENBQWE7SUFFakIsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVYLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFFdkIsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUVYLFlBQ0ksSUFBZ0IsRUFDaEIsR0FFK0UsRUFDL0UsYUFBYSxHQUFHLEtBQUssRUFDckIsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNO1FBRW5CLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFFcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUk7WUFDTCxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDNUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxnREFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBaUMsRUFBRSxJQUFJLENBQUMsTUFBVyxDQUFDLENBQUMsRUFBRTtnQkFDcEYsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFcEIsSUFBSSxDQUFDLE9BQU8sR0FBRywwQ0FBSTs7O3NCQUdMLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzs7NENBRTlELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTs7c0JBRXBDLEtBQUssQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2FBQ3hGLElBQUksQ0FBQyxvREFBb0QsQ0FBQzthQUMxRCxJQUFJLENBQUMsRUFBRSxDQUFDOzs7U0FHeEIsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFjLHlCQUF5QixDQUFDLENBQUMsQ0FBQztRQUNoRyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBYywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7UUFDbEcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBYyxpQkFBaUIsQ0FBRSxDQUFDO1FBRXhFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhCLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxRixNQUFNLGlEQUFLLENBQ1Asd0RBQWtCLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLGtFQUE0QixDQUFDLEdBQUcsa0VBQTRCLENBQ3pHLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUYsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxDQUFTO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRXRCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBRWxELCtDQUErQztRQUMvQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztTQUNsRDthQUFNO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztTQUNsQztRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxnRUFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELElBQUksYUFBYTtRQUNiLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMvQixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBYTtRQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNGLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVmLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhCLDRFQUFxQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRS9DLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNO1FBQ0YsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWYsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFekIsNkVBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUzQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsZ0JBQWdCO1FBQ1osSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVyQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6RSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFFOUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtnQkFDL0Isb0ZBQThCLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ2pDO3dCQUNJLG9CQUFvQixFQUFFOzRCQUNsQixLQUFLLEVBQUUsb0JBQW9COzRCQUMzQixPQUFPLEVBQUUsZ0RBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjOzRCQUM3QyxRQUFRLEVBQUUsR0FBRyxFQUFFO2dDQUNYLElBQUksNEVBQXNCO29DQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQztnQ0FFeEQsTUFBTSxPQUFPLEdBQWMsRUFBRSxDQUFDO2dDQUU5QixPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7b0NBQ0QsZ0ZBQTJCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTt3Q0FDakMsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLEtBQUssRUFBRTs0Q0FDbkIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRDQUVmLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3lDQUMzQjtvQ0FDTCxDQUFDLENBQUMsQ0FBQztvQ0FFSCxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQ0FDeEMsQ0FBQyxFQUNELEdBQUcsRUFBRTtvQ0FDRCwrRUFBMEIsQ0FDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSwyREFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUMzRSxDQUFDO2dDQUNOLENBQUMsQ0FDSixDQUFDOzRCQUNOLENBQUM7eUJBQ0o7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRWhELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQ2hDLG9GQUE4QixDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNqQzt3QkFDSSxtQkFBbUIsRUFBRTs0QkFDakIsS0FBSyxFQUFFLG1CQUFtQjs0QkFDMUIsT0FBTyxFQUFFLEdBQUc7NEJBQ1osZUFBZSxFQUFFLElBQUk7NEJBQ3JCLFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0NBQ1gsSUFBSSw0RUFBc0I7b0NBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDO2dDQUV4RCx3RUFBbUIsR0FBRyxNQUFNLENBQUM7Z0NBRTdCLE9BQU8sU0FBUyxDQUFDOzRCQUNyQixDQUFDO3lCQUNKO3dCQUNELG9CQUFvQixFQUFFOzRCQUNsQixLQUFLLEVBQUUsb0JBQW9COzRCQUMzQixPQUFPLEVBQUUsZ0RBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjOzRCQUM3QyxRQUFRLEVBQUUsR0FBRyxFQUFFO2dDQUNYLElBQUksNEVBQXNCO29DQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQztnQ0FFeEQsTUFBTSxPQUFPLEdBQWMsRUFBRSxDQUFDO2dDQUU5QixPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7b0NBQ0QsZ0ZBQTJCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTt3Q0FDakMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTs0Q0FDdEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRDQUVmLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQzs0Q0FFdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7eUNBQ3pCO29DQUNMLENBQUMsQ0FBQyxDQUFDO2dDQUNQLENBQUMsRUFDRCxHQUFHLEVBQUU7b0NBQ0QsK0VBQTBCLENBQ3RCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksMkRBQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FDeEUsQ0FBQztnQ0FDTixDQUFDLENBQ0osQ0FBQzs0QkFDTixDQUFDO3lCQUNKO3FCQUNKO2lCQUNKLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtnQkFDMUIsSUFBSSxnRkFBeUIsQ0FBQyxNQUFNLENBQUM7b0JBQUUsd0VBQW1CLEdBQUcsTUFBTSxDQUFDO1lBQ3hFLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUNuQyxvRkFBOEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLENBQUM7b0JBQ3ZCLENBQUMsQ0FBQzt3QkFDSTs0QkFDSSxZQUFZLEVBQUU7Z0NBQ1YsS0FBSyxFQUFFLFlBQVk7Z0NBQ25CLFFBQVEsRUFBRSxLQUFLLElBQUksRUFBRTtvQ0FDakIsTUFBTSxLQUFLLEdBQUcsTUFBTSx1RUFBbUIsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO29DQUV2RSxJQUFJLENBQUMsS0FBSzt3Q0FBRSxPQUFPO29DQUVuQixNQUFNLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQztvQ0FFckIsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO3dDQUMzRSxPQUFPLHNFQUFrQixDQUFDOzRDQUN0QixPQUFPLEVBQUUsd0VBQXdFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHOzRDQUNwRyxLQUFLLEVBQUUsMkRBQW1COzRDQUMxQixRQUFRLEVBQUUsc0RBQWM7eUNBQzNCLENBQUMsQ0FBQztvQ0FFUCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSzt3Q0FBRSxPQUFPO29DQUVsQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO29DQUU3QixNQUFNLE9BQU8sR0FBbUMsRUFBRSxDQUFDO29DQUVuRCxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29DQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO29DQUV0QixPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7d0NBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7d0NBRXBCLGdGQUEyQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7NENBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0RBQ3hDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnREFFZixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7Z0RBRXRDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzZDQUN0Qzt3Q0FDTCxDQUFDLENBQUMsQ0FBQzt3Q0FFSCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzt3Q0FFekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3dDQUV2QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7NkNBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUM7NkNBQ2YsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLDBDQUFJLG9EQUFtRCxDQUFDLENBQUM7d0NBRXhFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFjLG1CQUFtQixDQUFFLENBQUM7d0NBRXpFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBRTlDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO3dDQUV4QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzt3Q0FFeEIsSUFBSSxDQUFDLElBQUk7NENBQ0wsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07Z0RBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0RBQVcsQ0FDWixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQWlDLEVBQzNDLElBQUksQ0FBQyxNQUFXLENBQ25CLENBQUMsRUFBRTtnREFDTixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzt3Q0FFcEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO3dDQUVkLDhFQUF3QixFQUFFLENBQUM7d0NBRTNCLDRGQUFxQyxFQUFFLENBQUM7b0NBQzVDLENBQUMsRUFDRCxHQUFHLEVBQUU7d0NBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7d0NBRXZCLCtFQUEwQixDQUN0QixPQUFPOzZDQUNGLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQzs2Q0FDekIsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksMkRBQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FDakQsQ0FBQzt3Q0FFRixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzt3Q0FFekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3dDQUV2QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzt3Q0FFckIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQWMsbUJBQW1CLENBQUUsQ0FBQzt3Q0FFekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FFOUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7d0NBRXhCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO3dDQUV4QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQzt3Q0FFaEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO3dDQUVkLDhFQUF3QixFQUFFLENBQUM7d0NBRTNCLDRGQUFxQyxFQUFFLENBQUM7b0NBQzVDLENBQUMsQ0FDSixDQUFDO2dDQUNOLENBQUM7NkJBQ0o7NEJBQ0Qsc0JBQXNCLEVBQUU7Z0NBQ3BCLEtBQUssRUFBRSxzQkFBc0I7Z0NBQzdCLFFBQVEsRUFBRSxHQUFHLEVBQUU7b0NBQ1gsSUFBSSw0RUFBc0I7d0NBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDO29DQUV4RCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7d0NBQ3BCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0NBQ3JELE1BQU0sT0FBTyxHQUFjLEVBQUUsQ0FBQzt3Q0FFOUIsT0FBTyxnRkFBMEIsQ0FDN0IsR0FBRyxFQUFFOzRDQUNELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDOzRDQUU1QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs0Q0FFekIsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDOzRDQUVoQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQ3pCLDBCQUEwQixDQUM3QixDQUNKLENBQUM7NENBRUYsZ0ZBQTJCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnREFDakMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtvREFDdEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29EQUVmLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztvREFFdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7aURBQ3pCOzRDQUNMLENBQUMsQ0FBQyxDQUFDOzRDQUVILElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOzRDQUV4QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs0Q0FFeEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOzRDQUVkLDhFQUF3QixFQUFFLENBQUM7NENBRTNCLDRGQUFxQyxFQUFFLENBQUM7d0NBQzVDLENBQUMsRUFDRCxHQUFHLEVBQUU7NENBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7NENBRTNCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOzRDQUV6QixJQUFJLENBQUMsT0FBTztpREFDUCxhQUFhLENBQWMsb0JBQW9CLENBQUU7aURBQ2pELFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs0Q0FFekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUN6QiwwQkFBMEIsQ0FDN0IsQ0FDSixDQUFDOzRDQUVGLCtFQUEwQixDQUN0QixPQUFPO2lEQUNGLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQztpREFDekIsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLDJEQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQzNDLENBQUM7NENBRUYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7NENBRXhCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOzRDQUV4QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7NENBRWQsOEVBQXdCLEVBQUUsQ0FBQzs0Q0FFM0IsNEZBQXFDLEVBQUUsQ0FBQzt3Q0FDNUMsQ0FBQyxDQUNKLENBQUM7cUNBQ0w7eUNBQU07d0NBQ0gsTUFBTSxNQUFNLEdBQUcsMENBQUkscURBQW9ELENBQUM7d0NBRXhFLE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTs0Q0FDRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQzs0Q0FFM0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7NENBRXpCLElBQUksQ0FBQyxPQUFPO2lEQUNQLGFBQWEsQ0FBYyxvQkFBb0IsQ0FBRTtpREFDakQsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRDQUV6QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQ3pCLDBCQUEwQixDQUM3QixDQUNKLENBQUM7NENBRUYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7NENBRXhCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOzRDQUV4QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7NENBRWQsOEVBQXdCLEVBQUUsQ0FBQzs0Q0FFM0IsNEZBQXFDLEVBQUUsQ0FBQzt3Q0FDNUMsQ0FBQyxFQUNELEdBQUcsRUFBRTs0Q0FDRCxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQzs0Q0FFNUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7NENBRXpCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0Q0FFaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUN6QiwwQkFBMEIsQ0FDN0IsQ0FDSixDQUFDOzRDQUVGLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOzRDQUV4QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs0Q0FFeEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOzRDQUVkLDhFQUF3QixFQUFFLENBQUM7NENBRTNCLDRGQUFxQyxFQUFFLENBQUM7d0NBQzVDLENBQUMsQ0FDSixDQUFDO3FDQUNMO2dDQUNMLENBQUM7NkJBQ0o7eUJBQ0o7cUJBQ0o7b0JBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDVDtvQkFDSSxrQkFBa0IsRUFBRTt3QkFDaEIsS0FBSyxFQUFFLGtCQUFrQjt3QkFDekIsT0FBTyxFQUFFLEdBQUc7d0JBQ1osUUFBUSxFQUFFLEdBQUcsRUFBRTs0QkFDWCxJQUFJLDRFQUFzQjtnQ0FBRSxPQUFPLDhEQUFrQixFQUFFLENBQUM7NEJBRXhELE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtnQ0FDRCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQzs0QkFDckIsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQ0FDRCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQzs0QkFDckIsQ0FBQyxDQUNKLENBQUM7d0JBQ04sQ0FBQztxQkFDSjtpQkFDSjtnQkFDRDtvQkFDSSxrQkFBa0IsRUFBRTt3QkFDaEIsS0FBSyxFQUFFLGtCQUFrQjt3QkFDekIsT0FBTyxFQUFFLGdEQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUTt3QkFDckMsUUFBUSxFQUFFLEdBQUcsRUFBRTs0QkFDWCxJQUFJLElBQUksQ0FBQyxTQUFTO2dDQUNkLE9BQU8sS0FBSyxzRUFBa0IsQ0FBQztvQ0FDM0IsT0FBTyxFQUFFLG9EQUFvRDtvQ0FDN0QsS0FBSyxFQUFFLDJEQUFtQjtvQ0FDMUIsUUFBUSxFQUFFLHNEQUFjO2lDQUMzQixDQUFDLENBQUM7NEJBRVAsSUFBSSw0RUFBc0I7Z0NBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDOzRCQUV4RCxNQUFNLE9BQU8sR0FBbUMsRUFBRSxDQUFDOzRCQUVuRCxPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7Z0NBQ0QsOERBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBRTVCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQ0FFZCxnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29DQUNqQyxJQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3Q0FDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQzNDO3dDQUNFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3Q0FFZixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7d0NBRXRDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FDQUN0QztnQ0FDTCxDQUFDLENBQUMsQ0FBQztnQ0FFSCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs0QkFDaEUsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQ0FDRCx3REFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FFekIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dDQUVkLCtFQUEwQixDQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksMkRBQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FDOUUsQ0FBQzs0QkFDTixDQUFDLENBQ0osQ0FBQzt3QkFDTixDQUFDO3FCQUNKO29CQUNELG9CQUFvQixFQUFFO3dCQUNsQixLQUFLLEVBQUUsb0JBQW9CO3dCQUMzQixPQUFPLEVBQUUsZ0RBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO3dCQUM3QyxRQUFRLEVBQUUsR0FBRyxFQUFFOzRCQUNYLElBQUksNEVBQXNCO2dDQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQzs0QkFFeEQsTUFBTSxPQUFPLEdBQW1DLEVBQUUsQ0FBQzs0QkFFbkQsT0FBTyxnRkFBMEIsQ0FDN0IsR0FBRyxFQUFFO2dDQUNELGdGQUEyQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0NBQ2pDLElBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dDQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsRUFDM0M7d0NBQ0UsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dDQUVmLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQzt3Q0FFdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUNBQ3RDO2dDQUNMLENBQUMsQ0FBQyxDQUFDO2dDQUVILElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUNoRSxDQUFDLEVBQ0QsR0FBRyxFQUFFO2dDQUNELCtFQUEwQixDQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksMkRBQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FDOUUsQ0FBQzs0QkFDTixDQUFDLENBQ0osQ0FBQzt3QkFDTixDQUFDO3FCQUNKO2lCQUNKO2FBQ0osQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO2dCQUN2QyxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsZUFBZSxFQUFFLENBQUMsT0FBTyxDQUFDO2FBQzdCLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBQztZQUU5RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUM7UUFDMUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQzVCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQztZQUVoRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVELGlCQUFpQjtRQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVoRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUV4RyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUU1RixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQztJQUNyRixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwbkJ1QztBQUNzRDtBQUNoQztBQUNBO0FBQ047QUFDSTtBQUNBO0FBQ0o7QUFDMEI7QUFDaEI7QUFFM0QsTUFBTSxPQUFRLFNBQVEsNkNBQU87SUFDdkIsT0FBTyxDQUFDO0lBRWpCLE1BQU0sQ0FBQztJQUNQLE9BQU8sQ0FBQztJQUNDLE9BQU8sQ0FBQztJQUVSLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBNkIsQ0FBQztJQUNsRCxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7SUFDM0MsYUFBYSxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO0lBQy9DLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQztJQUVsRCxLQUFLLENBQUM7SUFDTixNQUFNLENBQUM7SUFFUCxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRVgsWUFBWSxNQUFvRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEVBQUU7UUFDaEcsS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUVwQixJQUFJLENBQUMsT0FBTyxHQUFHLDBDQUFJOzs7c0JBR0wsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxtREFBbUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Ozs7c0JBSTlFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsb0RBQW9ELENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDOzs7U0FHNUYsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFjLHlCQUF5QixDQUFDLENBQUMsQ0FBQztRQUNoRyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBYywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7UUFDbEcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBYyxrQkFBa0IsQ0FBRSxDQUFDO1FBRTVFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhCLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFdEUsTUFBTSxpREFBSyxDQUNQLHdEQUFrQixHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxrRUFBNEIsQ0FBQyxHQUFHLGtFQUE0QixDQUN6RyxDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsR0FBRzthQUN6QixPQUFPLEVBQUU7YUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDM0QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzQixDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsQ0FBUztRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUV0QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUVsRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztTQUNyRDthQUFNO1lBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztTQUNyQztRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxnRUFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFhO1FBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNO1FBQ0YsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFeEIsNEVBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbEQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDRixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUV6Qiw2RUFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTNDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxnQkFBZ0I7UUFDWixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXpFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUU5QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO2dCQUMvQixvRkFBOEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDakM7d0JBQ0ksb0JBQW9CLEVBQUU7NEJBQ2xCLEtBQUssRUFBRSxvQkFBb0I7NEJBQzNCLE9BQU8sRUFBRSxnREFBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWM7NEJBQzdDLFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0NBQ1gsSUFBSSw0RUFBc0I7b0NBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDO2dDQUV4RCxNQUFNLE9BQU8sR0FBYyxFQUFFLENBQUM7Z0NBRTlCLE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtvQ0FDRCxnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO3dDQUNqQyxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssS0FBSyxFQUFFOzRDQUNuQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7NENBRWYsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7eUNBQzNCO29DQUNMLENBQUMsQ0FBQyxDQUFDO29DQUVILEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dDQUN4QyxDQUFDLEVBQ0QsR0FBRyxFQUFFO29DQUNELCtFQUEwQixDQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLDJEQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQzNFLENBQUM7Z0NBQ04sQ0FBQyxDQUNKLENBQUM7NEJBQ04sQ0FBQzt5QkFDSjtxQkFDSjtpQkFDSixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFFaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtnQkFDaEMsb0ZBQThCLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ2pDO3dCQUNJLG1CQUFtQixFQUFFOzRCQUNqQixLQUFLLEVBQUUsbUJBQW1COzRCQUMxQixPQUFPLEVBQUUsR0FBRzs0QkFDWixlQUFlLEVBQUUsSUFBSTs0QkFDckIsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQ0FDWCxJQUFJLDRFQUFzQjtvQ0FBRSxPQUFPLDhEQUFrQixFQUFFLENBQUM7Z0NBRXhELHdFQUFtQixHQUFHLE1BQU0sQ0FBQztnQ0FFN0IsT0FBTyxTQUFTLENBQUM7NEJBQ3JCLENBQUM7eUJBQ0o7d0JBQ0Qsb0JBQW9CLEVBQUU7NEJBQ2xCLEtBQUssRUFBRSxvQkFBb0I7NEJBQzNCLE9BQU8sRUFBRSxnREFBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWM7NEJBQzdDLFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0NBQ1gsSUFBSSw0RUFBc0I7b0NBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDO2dDQUV4RCxNQUFNLE9BQU8sR0FBYyxFQUFFLENBQUM7Z0NBRTlCLE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtvQ0FDRCxnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO3dDQUNqQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFOzRDQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7NENBRWYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRDQUV0QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt5Q0FDekI7b0NBQ0wsQ0FBQyxDQUFDLENBQUM7Z0NBQ1AsQ0FBQyxFQUNELEdBQUcsRUFBRTtvQ0FDRCwrRUFBMEIsQ0FDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSwyREFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUN4RSxDQUFDO2dDQUNOLENBQUMsQ0FDSixDQUFDOzRCQUNOLENBQUM7eUJBQ0o7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUMxQixJQUFJLGdGQUF5QixDQUFDLE1BQU0sQ0FBQztvQkFBRSx3RUFBbUIsR0FBRyxNQUFNLENBQUM7WUFDeEUsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLG9GQUE4QixDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNqQztvQkFDSSxVQUFVLEVBQUU7d0JBQ1IsS0FBSyxFQUFFLFVBQVU7d0JBQ2pCLFFBQVEsRUFBRSxLQUFLLElBQUksRUFBRTs0QkFDakIsTUFBTSxLQUFLLEdBQUcsTUFBTSx1RUFBbUIsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOzRCQUVyRSxJQUFJLENBQUMsS0FBSztnQ0FBRSxPQUFPOzRCQUVuQixNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQzs0QkFFcEIsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQztnQ0FDekQsT0FBTyxzRUFBa0IsQ0FBQztvQ0FDdEIsT0FBTyxFQUFFLDRDQUE0QztvQ0FDckQsS0FBSyxFQUFFLDJEQUFtQjtvQ0FDMUIsUUFBUSxFQUFFLHNEQUFjO2lDQUMzQixDQUFDLENBQUM7NEJBRVAsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUk7Z0NBQUUsT0FBTzs0QkFFaEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs0QkFFNUIsTUFBTSxPQUFPLEdBQW1DLEVBQUUsQ0FBQzs0QkFFbkQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFDaEMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs0QkFFbEMsT0FBTyxnRkFBMEIsQ0FDN0IsR0FBRyxFQUFFO2dDQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dDQUVsQixnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29DQUNqQyxJQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3Q0FDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQzNDO3dDQUNFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3Q0FFZixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7d0NBRXRDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FDQUN0QztnQ0FDTCxDQUFDLENBQUMsQ0FBQztnQ0FFSCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQ0FFekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dDQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0NBRXhDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztxQ0FDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQztxQ0FDZixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsMENBQUksb0RBQW1ELENBQUMsQ0FBQztnQ0FFeEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO3FDQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDO3FDQUNmLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQywwQ0FBSSxxREFBb0QsQ0FBQyxDQUFDO2dDQUV6RSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBYyxtQkFBbUIsQ0FBRSxDQUFDO2dDQUN6RSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBYyxvQkFBb0IsQ0FBRSxDQUFDO2dDQUUxRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUUvQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQ0FFeEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0NBRXhCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQ0FFZCw4RUFBd0IsRUFBRSxDQUFDO2dDQUUzQiw0RkFBcUMsRUFBRSxDQUFDOzRCQUM1QyxDQUFDLEVBQ0QsR0FBRyxFQUFFO2dDQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO2dDQUV0QiwrRUFBMEIsQ0FDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLDJEQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQzlFLENBQUM7Z0NBRUYsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0NBRXpCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQ0FDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dDQUV4QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztnQ0FDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0NBRXZCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFjLG1CQUFtQixDQUFFLENBQUM7Z0NBQ3pFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFjLG9CQUFvQixDQUFFLENBQUM7Z0NBRTFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBRS9DLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dDQUV4QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQ0FFeEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dDQUVkLDhFQUF3QixFQUFFLENBQUM7Z0NBRTNCLDRGQUFxQyxFQUFFLENBQUM7NEJBQzVDLENBQUMsQ0FDSixDQUFDO3dCQUNOLENBQUM7cUJBQ0o7b0JBQ0QsV0FBVyxFQUFFO3dCQUNULEtBQUssRUFBRSxXQUFXO3dCQUNsQixRQUFRLEVBQUUsS0FBSyxJQUFJLEVBQUU7NEJBQ2pCLE1BQU0sS0FBSyxHQUFHLE1BQU0sdUVBQW1CLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs0QkFFckUsSUFBSSxDQUFDLEtBQUs7Z0NBQUUsT0FBTzs0QkFFbkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUM7NEJBRXJCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRTtnQ0FDMUUsT0FBTyxzRUFBa0IsQ0FBQztvQ0FDdEIsT0FBTyxFQUFFLGdEQUFnRDtvQ0FDekQsS0FBSyxFQUFFLDJEQUFtQjtvQ0FDMUIsUUFBUSxFQUFFLHNEQUFjO2lDQUMzQixDQUFDLENBQUM7NEJBRVAsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs0QkFFN0IsT0FBTyxnRkFBMEIsQ0FDN0IsR0FBRyxFQUFFO2dDQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dDQUVwQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0NBRWQsOEVBQXdCLEVBQUUsQ0FBQzs0QkFDL0IsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQ0FDRCxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztnQ0FFdkIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dDQUVkLDhFQUF3QixFQUFFLENBQUM7NEJBQy9CLENBQUMsQ0FDSixDQUFDO3dCQUNOLENBQUM7cUJBQ0o7aUJBQ0o7Z0JBQ0Q7b0JBQ0ksa0JBQWtCLEVBQUU7d0JBQ2hCLEtBQUssRUFBRSxrQkFBa0I7d0JBQ3pCLE9BQU8sRUFBRSxHQUFHO3dCQUNaLFFBQVEsRUFBRSxHQUFHLEVBQUU7NEJBQ1gsSUFBSSw0RUFBc0I7Z0NBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDOzRCQUV4RCxPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7Z0NBQ0QsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7NEJBQ3JCLENBQUMsRUFDRCxHQUFHLEVBQUU7Z0NBQ0QsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7NEJBQ3JCLENBQUMsQ0FDSixDQUFDO3dCQUNOLENBQUM7cUJBQ0o7aUJBQ0o7Z0JBQ0Q7b0JBQ0ksa0JBQWtCLEVBQUU7d0JBQ2hCLEtBQUssRUFBRSxrQkFBa0I7d0JBQ3pCLE9BQU8sRUFBRSxnREFBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVE7d0JBQ3JDLFFBQVEsRUFBRSxHQUFHLEVBQUU7NEJBQ1gsSUFBSSxJQUFJLENBQUMsU0FBUztnQ0FDZCxPQUFPLEtBQUssc0VBQWtCLENBQUM7b0NBQzNCLE9BQU8sRUFBRSxvREFBb0Q7b0NBQzdELEtBQUssRUFBRSwyREFBbUI7b0NBQzFCLFFBQVEsRUFBRSxzREFBYztpQ0FDM0IsQ0FBQyxDQUFDOzRCQUVQLElBQUksNEVBQXNCO2dDQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQzs0QkFFeEQsTUFBTSxPQUFPLEdBQW1DLEVBQUUsQ0FBQzs0QkFFbkQsT0FBTyxnRkFBMEIsQ0FDN0IsR0FBRyxFQUFFO2dDQUNELDhEQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUU1QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0NBRWQsZ0ZBQTJCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQ0FDakMsSUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7d0NBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUMzQzt3Q0FDRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0NBRWYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dDQUV0QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQ0FDdEM7Z0NBQ0wsQ0FBQyxDQUFDLENBQUM7Z0NBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7NEJBQ2hFLENBQUMsRUFDRCxHQUFHLEVBQUU7Z0NBQ0Qsd0RBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBRXpCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQ0FFZCwrRUFBMEIsQ0FDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLDJEQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQzlFLENBQUM7NEJBQ04sQ0FBQyxDQUNKLENBQUM7d0JBQ04sQ0FBQztxQkFDSjtvQkFDRCxvQkFBb0IsRUFBRTt3QkFDbEIsS0FBSyxFQUFFLG9CQUFvQjt3QkFDM0IsT0FBTyxFQUFFLGdEQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYzt3QkFDN0MsUUFBUSxFQUFFLEdBQUcsRUFBRTs0QkFDWCxJQUFJLDRFQUFzQjtnQ0FBRSxPQUFPLDhEQUFrQixFQUFFLENBQUM7NEJBRXhELE1BQU0sT0FBTyxHQUFtQyxFQUFFLENBQUM7NEJBRW5ELE9BQU8sZ0ZBQTBCLENBQzdCLEdBQUcsRUFBRTtnQ0FDRCxnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29DQUNqQyxJQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3Q0FDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQzNDO3dDQUNFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3Q0FFZixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7d0NBRXRDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FDQUN0QztnQ0FDTCxDQUFDLENBQUMsQ0FBQztnQ0FFSCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs0QkFDaEUsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQ0FDRCwrRUFBMEIsQ0FDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLDJEQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQzlFLENBQUM7NEJBQ04sQ0FBQyxDQUNKLENBQUM7d0JBQ04sQ0FBQztxQkFDSjtpQkFDSjthQUNKLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGdCQUFnQjtRQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDdkMsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLGVBQWUsRUFBRSxDQUFDLE9BQU8sQ0FBQzthQUM3QixDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUM7WUFFOUQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUUsQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM1QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUM7WUFFaEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDO1lBRXhFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCxpQkFBaUI7UUFDYixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFaEcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFeEcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUM7SUFDM0YsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsZ0J1QztBQUMrQztBQUN6QjtBQUNBO0FBQ0Y7QUFDQTtBQUNKO0FBQzBCO0FBQ3hDO0FBRW5DLE1BQU0sS0FBTSxTQUFRLDZDQUFPO0lBQ3JCLE9BQU8sQ0FBQztJQUVqQixZQUFZLE1BQW9ELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQzFFLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLE9BQU8sR0FBRywwQ0FBSSx5Q0FBd0MsQ0FBQztRQUU1RCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFUSxRQUFRLEdBQUcsR0FBRyxFQUFFO1FBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQyxDQUFDO0lBRU8sVUFBVSxHQUFHLENBQUMsQ0FBYSxFQUFFLEVBQUU7UUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEQsQ0FBQyxDQUFDO0lBRU8sTUFBTSxHQUFHLENBQUMsQ0FBYSxFQUFFLEVBQUU7UUFDaEMsSUFBSSxnRkFBeUIsQ0FBQyxNQUFNLENBQUM7WUFBRSxPQUFPLENBQUMsd0VBQW1CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRW5GLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTztRQUV2RyxJQUFJLDRFQUFzQjtZQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQztRQUV4RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFNUQsT0FBTyxnRkFBMEIsQ0FDN0IsR0FBRyxFQUFFO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELENBQUMsRUFDRCxHQUFHLEVBQUU7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FDSixDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRU8sWUFBWSxHQUFHLEdBQUcsRUFBRTtRQUN6QixvRkFBOEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNqQztnQkFDSSxtQkFBbUIsRUFBRTtvQkFDakIsS0FBSyxFQUFFLG1CQUFtQjtvQkFDMUIsT0FBTyxFQUFFLEdBQUc7b0JBQ1osZUFBZSxFQUFFLElBQUk7b0JBQ3JCLFFBQVEsRUFBRSxHQUFHLEVBQUU7d0JBQ1gsSUFBSSw0RUFBc0I7NEJBQUUsT0FBTyw4REFBa0IsRUFBRSxDQUFDO3dCQUV4RCx3RUFBbUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO3dCQUVuQyxPQUFPLFNBQVMsQ0FBQztvQkFDckIsQ0FBQztpQkFDSjtnQkFDRCxjQUFjLEVBQUU7b0JBQ1osS0FBSyxFQUFFLGNBQWM7b0JBQ3JCLE9BQU8sRUFBRSxnREFBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVE7b0JBQ3JDLFFBQVEsRUFBRSxHQUFHLEVBQUU7d0JBQ1gsSUFBSSxJQUFJLENBQUMsU0FBUzs0QkFDZCxPQUFPLEtBQUssc0VBQWtCLENBQUM7Z0NBQzNCLE9BQU8sRUFBRSxnREFBZ0Q7Z0NBQ3pELEtBQUssRUFBRSwyREFBbUI7Z0NBQzFCLFFBQVEsRUFBRSxzREFBYzs2QkFDM0IsQ0FBQyxDQUFDO3dCQUVQLElBQUksNEVBQXNCOzRCQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQzt3QkFFeEQsTUFBTSxPQUFPLEdBQWMsRUFBRSxDQUFDO3dCQUU5QixPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7NEJBQ0QsOERBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBRTVCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFFZCxnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dDQUNqQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtvQ0FDNUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29DQUVmLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQ0FFdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7aUNBQ3pCOzRCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUNQLENBQUMsRUFDRCxHQUFHLEVBQUU7NEJBQ0Qsd0RBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBRXpCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFFZCwrRUFBMEIsQ0FDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSwyREFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FDOUUsQ0FBQzt3QkFDTixDQUFDLENBQ0osQ0FBQztvQkFDTixDQUFDO2lCQUNKO2dCQUNELG9CQUFvQixFQUFFO29CQUNsQixLQUFLLEVBQUUsb0JBQW9CO29CQUMzQixPQUFPLEVBQUUsZ0RBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO29CQUM3QyxRQUFRLEVBQUUsR0FBRyxFQUFFO3dCQUNYLElBQUksNEVBQXNCOzRCQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQzt3QkFFeEQsTUFBTSxPQUFPLEdBQWMsRUFBRSxDQUFDO3dCQUU5QixPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7NEJBQ0QsZ0ZBQTJCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQ0FDakMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7b0NBQzVCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQ0FFZixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7b0NBRXRDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lDQUN6Qjs0QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDLEVBQ0QsR0FBRyxFQUFFOzRCQUNELCtFQUEwQixDQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLDJEQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUM5RSxDQUFDO3dCQUNOLENBQUMsQ0FDSixDQUFDO29CQUNOLENBQUM7aUJBQ0o7YUFDSjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQztJQUVGLE1BQU07UUFDRixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFaEUsNEVBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNO1FBQ0YsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5FLDZFQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFM0MsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BLdUM7QUFDK0M7QUFDekI7QUFDRjtBQUNBO0FBQ0o7QUFDVTtBQUN4QjtBQUVuQyxNQUFNLE1BQU8sU0FBUSw2Q0FBTztJQUN0QixPQUFPLENBQUM7SUFFUixRQUFRLEdBQUcsR0FBRyxFQUFFO1FBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQyxDQUFDO0lBRU8sWUFBWSxHQUFHLEdBQUcsRUFBRTtRQUN6QixvRkFBOEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNqQztnQkFDSSxlQUFlLEVBQUU7b0JBQ2IsS0FBSyxFQUFFLGVBQWU7b0JBQ3RCLE9BQU8sRUFBRSxnREFBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVE7b0JBQ3JDLFFBQVEsRUFBRSxHQUFHLEVBQUU7d0JBQ1gsSUFBSSxJQUFJLENBQUMsU0FBUzs0QkFDZCxPQUFPLEtBQUssc0VBQWtCLENBQUM7Z0NBQzNCLE9BQU8sRUFBRSxpREFBaUQ7Z0NBQzFELEtBQUssRUFBRSwyREFBbUI7Z0NBQzFCLFFBQVEsRUFBRSxzREFBYzs2QkFDM0IsQ0FBQyxDQUFDO3dCQUVQLElBQUksNEVBQXNCOzRCQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQzt3QkFFeEQsTUFBTSxPQUFPLEdBQWMsRUFBRSxDQUFDO3dCQUU5QixPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7NEJBQ0QsOERBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBRTVCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFFZCxnRkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dDQUNqQyxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtvQ0FDMUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29DQUVmLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lDQUMzQjs0QkFDTCxDQUFDLENBQUMsQ0FBQzs0QkFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQy9DLENBQUMsRUFDRCxHQUFHLEVBQUU7NEJBQ0Qsd0RBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBRXpCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFFZCwrRUFBMEIsQ0FDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSwyREFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FDbEYsQ0FBQzt3QkFDTixDQUFDLENBQ0osQ0FBQztvQkFDTixDQUFDO2lCQUNKO2dCQUNELG9CQUFvQixFQUFFO29CQUNsQixLQUFLLEVBQUUsb0JBQW9CO29CQUMzQixPQUFPLEVBQUUsZ0RBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO29CQUM3QyxRQUFRLEVBQUUsR0FBRyxFQUFFO3dCQUNYLElBQUksNEVBQXNCOzRCQUFFLE9BQU8sOERBQWtCLEVBQUUsQ0FBQzt3QkFFeEQsTUFBTSxPQUFPLEdBQWMsRUFBRSxDQUFDO3dCQUU5QixPQUFPLGdGQUEwQixDQUM3QixHQUFHLEVBQUU7NEJBQ0QsZ0ZBQTJCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQ0FDakMsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7b0NBQzFCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQ0FFZixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQ0FDM0I7NEJBQ0wsQ0FBQyxDQUFDLENBQUM7NEJBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUMvQyxDQUFDLEVBQ0QsR0FBRyxFQUFFOzRCQUNELCtFQUEwQixDQUN0QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLDJEQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUNsRixDQUFDO3dCQUNOLENBQUMsQ0FDSixDQUFDO29CQUNOLENBQUM7aUJBQ0o7YUFDSjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQztJQUVGLFlBQVksTUFBb0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDMUUsS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsT0FBTyxHQUFHLDBDQUFJLDBDQUF5QyxDQUFDO1FBRTdELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELE1BQU07UUFDRixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWhFLDRFQUFxQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVwQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNGLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVmLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkUsNkVBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUzQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0htRDtBQUNSO0FBQ2dCO0FBSXJELFNBQVMsSUFBSSxDQUFDLEdBQUcsSUFBcUQ7SUFDekUsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztJQUVuQyxNQUFNLElBQUksR0FDTixPQUFPLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRWhILE9BQU8sSUFBSSxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakYsQ0FBQztBQUlNLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBcUQ7SUFDeEUsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztJQUVuQyxNQUFNLEdBQUcsR0FDTCxPQUFPLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRTlHLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVNLFNBQVMsc0JBQXNCLENBQUMsT0FBb0I7SUFDdkQsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFL0QsSUFBSSxTQUFTLElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTtRQUNuQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEUsSUFBSSxNQUFNLEVBQUU7WUFDUixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFFN0IsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWxDLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7WUFFM0UsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO2dCQUFFLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7WUFFdkcsSUFBSSxLQUFLLEtBQUssR0FBRztnQkFBRSxPQUFPLFFBQVEsQ0FBQztZQUVuQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBRWpGLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDekU7S0FDSjtJQUVELE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUM7QUFFTSxTQUFTLGdCQUFnQixDQUFDLElBQWEsRUFBRSxJQUE4QixFQUFFLEVBQTRCO0lBQ3hHLE1BQU0sTUFBTSxHQUFHO1FBQ1gsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6QixLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2xDLENBQUM7SUFFRixPQUFPLENBQ0gsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLO1FBQ2pDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU07UUFDbEMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQ25DLENBQUM7QUFDTixDQUFDO0FBRU0sU0FBUyxjQUFjLENBQUMsQ0FBUTtJQUNuQyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsQ0FBQztBQUVNLE1BQWUsT0FBTztJQUNoQixJQUFJLEdBQUcsd0RBQVksRUFBRSxDQUFDO0lBRXJCLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFFNUIsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLDREQUFVLEVBQVcsQ0FBQztJQUUxQyxNQUFNLEtBQUssSUFBSTtRQUNYLE9BQU8sUUFBUSxDQUFDLGFBQWEsQ0FBYyxlQUFlLENBQUUsQ0FBQztJQUNqRSxDQUFDO0lBSUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFzRTtRQUNqRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFFLElBQUksUUFBUSxFQUFFO1lBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDaEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDakY7YUFBTTtZQUNILElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztnQkFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNqRSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFdBQVc7Z0JBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDbkU7UUFFRCxJQUFJLFFBQVE7WUFDUixxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRXBFLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ04sQ0FBQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQkFDM0MsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDOUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsTUFBTTtRQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV2QyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUV0QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLEdBQUc7UUFDSCxPQUFPO1lBQ0gsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDdEMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7U0FDeEMsQ0FBQztJQUNOLENBQUM7SUFFRCxNQUFNLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztJQUN6QixNQUFNLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDO0lBRWxDLE1BQU0sS0FBSyxVQUFVO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBRUQsTUFBTSxLQUFLLG9CQUFvQjtRQUMzQixPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztJQUN0QyxDQUFDO0lBRUQsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFTO1FBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBRXJCLHdFQUFrQixDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsTUFBTSxLQUFLLG9CQUFvQixDQUFDLENBQVM7UUFDckMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQztRQUUvQix3RUFBa0IsQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBRUQ7UUFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLHdFQUFrQixDQUFDLG9CQUFvQixDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNoRixJQUFJLENBQUMscUJBQXFCLEdBQUcsd0VBQWtCLENBQUMsNkJBQTZCLENBQUMsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUM7SUFDakgsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVKRSxNQUFlLElBQUk7SUFDdEIsTUFBTSxDQUFVLElBQUksQ0FBUztJQUM3QixNQUFNLENBQVUsTUFBTSxDQUFTO0lBQy9CLE1BQU0sQ0FBVSxPQUFPLENBQVM7SUFFdkIsSUFBSSxDQUFDO0lBRUwsTUFBTSxDQUFDO0lBQ1AsT0FBTyxDQUFDO0lBRWpCLFlBQVksSUFBWSxFQUFFLE1BQVMsRUFBRSxPQUFVO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFJRCxRQUFRLENBQUMsTUFBaUI7UUFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQTZCLENBQWMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FDVCxJQUF3QixFQUN4QixDQUFJO1FBRUosc0RBQXNEO1FBQ3RELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDO1lBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU3RSwwREFBMEQ7UUFDMUQsZ0VBQWdFO1FBQ2hFLElBQUksQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLENBQUMsSUFBSSxZQUFZLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQXVCLENBQUM7UUFFM0YsT0FBTyxLQUFNLFNBQVEsSUFBVTtZQUMzQixNQUFNLENBQVUsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDakMsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBRXZDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7WUFFekQ7Z0JBQ0ksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFZLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQWlCO2dCQUNwQixPQUFPLElBQUksQ0FBQyxNQUFNO3FCQUNiLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ1IsTUFBTSxDQUNILENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBb0IsQ0FBQyxFQUN6RixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFvQixDQUFDLENBQ3pFLENBQUM7WUFDVixDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7Q0FDSjtBQUVNLE1BQU0sT0FBUSxTQUFRLElBQVU7SUFDbkMsTUFBTSxDQUFVLElBQUksR0FBRyxLQUFLLENBQUM7SUFDN0IsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFNUI7UUFDSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBcUI7UUFDN0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDOztBQUdFLE1BQU0sTUFBTyxTQUFRLElBQVU7SUFDbEMsTUFBTSxDQUFVLElBQUksR0FBRyxJQUFJLENBQUM7SUFDNUIsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFNUI7UUFDSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBcUI7UUFDN0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDOztBQUdFLE1BQU0sT0FBUSxTQUFRLElBQVU7SUFDbkMsTUFBTSxDQUFVLElBQUksR0FBRyxLQUFLLENBQUM7SUFDN0IsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFNUI7UUFDSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFZO1FBQ2pCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7O0FBR0UsTUFBTSxRQUFTLFNBQVEsSUFBVTtJQUNwQyxNQUFNLENBQVUsSUFBSSxHQUFHLE1BQU0sQ0FBQztJQUM5QixNQUFNLENBQVUsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixNQUFNLENBQVUsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUU1QjtRQUNJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFxQjtRQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7O0FBR0UsTUFBTSxPQUFRLFNBQVEsSUFBVTtJQUNuQyxNQUFNLENBQVUsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUM3QixNQUFNLENBQVUsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixNQUFNLENBQVUsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUU1QjtRQUNJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFxQjtRQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7O0FBR0UsTUFBTSxPQUFRLFNBQVEsSUFBVTtJQUNuQyxNQUFNLENBQVUsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUM3QixNQUFNLENBQVUsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixNQUFNLENBQVUsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUU1QjtRQUNJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFxQjtRQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7O0FBR0UsTUFBTSxRQUFTLFNBQVEsSUFBVTtJQUNwQyxNQUFNLENBQVUsSUFBSSxHQUFHLE1BQU0sQ0FBQztJQUM5QixNQUFNLENBQVUsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixNQUFNLENBQVUsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUU1QjtRQUNJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7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QUM7Ozs7Ozs7VUM3TmpDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsQ0FBQztXQUNEO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQSxzR0FBc0c7V0FDdEc7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBLEVBQUU7V0FDRjtXQUNBOzs7OztXQ2hFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9hdWdtZW50cy9XYXRjaGVkU2V0LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jYWQvYWxnZWJyYS9yZWlmeS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY2FkL2FsZ2VicmEvc3RyaW5naWZ5LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jYWQvYWxnZWJyYS9zdWJzdGl0dXRlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jYWQvYWxnZWJyYS92YXJpYWJsZXMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NhZC9lbXBsb3llZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY2FkL2ZpbGVzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jaXJjdWxhci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jb250ZXh0bWVudS9pbnNlcnQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L2lvLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9maWxlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvQ2FudmFzTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvRGFya21vZGVNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTWVudU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL01vZGFsTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTW91c2VNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9RdWlja1BpY2tNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU2V0dGluZ3NNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvVGVzdGluZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1RvYXN0TWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvVG9vbHNNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9VbmRvUmVkb01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1dpcmluZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3F1aWNrcGlja3MvY29tcG9uZW50cy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcXVpY2twaWNrcy9nYXRlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9Db21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvRGlzcGxheS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9JbnB1dC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9PdXRwdXQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvUmVpZmllZC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9jaGlwcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9hc3luYyBtb2R1bGUiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFdhdGNoZWRTZXQ8VD4gZXh0ZW5kcyBTZXQ8VD4ge1xuICAgICNhZGRzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuICAgICNkZWxldGVzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuICAgICNhdHRlbXB0ZWRBZGRzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuICAgICNhdHRlbXB0ZWREZWxldGVzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuXG4gICAgI2xvY2tlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoaXRlbXM/OiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8dHlwZW9mIFNldDxUPj5bMF0pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBpZiAoaXRlbXMpIHRoaXMuYWRkQWxsKFsuLi5pdGVtc10pO1xuICAgIH1cblxuICAgIG9uQWRkKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhZGRzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uRGVsZXRlKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNkZWxldGVzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uQXR0ZW1wdGVkQWRkKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhdHRlbXB0ZWRBZGRzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uQXR0ZW1wdGVkRGVsZXRlKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhdHRlbXB0ZWREZWxldGVzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZkFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYWRkcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZEZWxldGUocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2RlbGV0ZXMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmQXR0ZW1wdGVkQWRkKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhdHRlbXB0ZWRBZGRzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZkF0dGVtcHRlZERlbGV0ZShydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkRGVsZXRlcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhZGRBbGwoaXRlbXM6IFRbXSkge1xuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLmFkZChpdGVtKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGVsZXRlQWxsKGl0ZW1zOiBUW10pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1zLm1hcCgoaXRlbSkgPT4gdGhpcy5kZWxldGUoaXRlbSkpO1xuICAgIH1cblxuICAgIGFkZChpdGVtOiBUKSB7XG4gICAgICAgIGlmICh0aGlzLiNsb2NrZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbLi4udGhpcy4jYXR0ZW1wdGVkQWRkc10ubWFwKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCwgaXRlbSwgdGhpcykpO1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0cy5ldmVyeSgob3V0KSA9PiAhb3V0KSkgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2FkZHNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0cy5zb21lKChvdXQpID0+IG91dCA9PT0gZmFsc2UpID8gdGhpcyA6IHN1cGVyLmFkZChpdGVtKTtcbiAgICB9XG5cbiAgICBkZWxldGUoaXRlbTogVCkge1xuICAgICAgICBpZiAodGhpcy4jbG9ja2VkKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2F0dGVtcHRlZERlbGV0ZXNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdHMuZXZlcnkoKG91dCkgPT4gIW91dCkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbLi4udGhpcy4jZGVsZXRlc10ubWFwKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCwgaXRlbSwgdGhpcykpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHRzLnNvbWUoKG91dCkgPT4gb3V0ID09PSBmYWxzZSkgPyBmYWxzZSA6IHN1cGVyLmRlbGV0ZShpdGVtKTtcbiAgICB9XG5cbiAgICBsb2NrKCkge1xuICAgICAgICB0aGlzLiNsb2NrZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHVubG9jaygpIHtcbiAgICAgICAgdGhpcy4jbG9ja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0IGxvY2tlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvY2tlZDtcbiAgICB9XG5cbiAgICBjbG9uZSh3aXRoTGlzdGVuZXJzPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBzZXQgPSBuZXcgV2F0Y2hlZFNldCh0aGlzKTtcblxuICAgICAgICBpZiAod2l0aExpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy4jYWRkcy5mb3JFYWNoKChydW4pID0+IHNldC5vbkFkZChydW4pKTtcbiAgICAgICAgICAgIHRoaXMuI2RlbGV0ZXMuZm9yRWFjaCgocnVuKSA9PiBzZXQub25EZWxldGUocnVuKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2V0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENPVU5URVJfR0VORVJBVE9SIH0gZnJvbSBcIi4uLy4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHR5cGUge1xuICAgIFNlcmlhbGl6ZWRDb21wb25lbnQsXG4gICAgU2VyaWFsaXplZENvbXBvbmVudHMsXG4gICAgU2VyaWFsaXplZERpYWdyYW0sXG4gICAgU2VyaWFsaXplZElucHV0LFxuICAgIFNlcmlhbGl6ZWRPdXRwdXQsXG4gICAgU2VyaWFsaXplZFdpcmUsXG59IGZyb20gXCIuLi8uLi9maWxlc1wiO1xuaW1wb3J0IHsgZnJvbVZhcmlhYmxlLCBpc0ludmVyc2lvbiwgdmFyaWFibGVGb3IgfSBmcm9tIFwiLi92YXJpYWJsZXNcIjtcblxuLy8gbmVlZCB0byBleHBsaWNpdGx5IHBhc3MgbnVtYmVyIG9mIGlucHV0cyBzaW5jZSBzaW1wbGlmaWVkIHRhYmxlIG1heSBub3QgaGF2ZSBhbGwgb2YgdGhlIG9yaWdpbmFsIGlucHV0c1xuLyoqIGNvbnZlcnRzIGEgbGlzdCBvZiBleHByZXNzaW9ucyBpbnRvIGEgc2VyaWFsaXplZCBkaWFncmFtICovXG5leHBvcnQgZnVuY3Rpb24gcmVpZnkoaW5zOiBudW1iZXIsIG91dHM6IG51bWJlciwgdGFibGU6IHN0cmluZ1tdKTogU2VyaWFsaXplZERpYWdyYW0ge1xuICAgIGNvbnN0IGNvbXBvbmVudHMgPSBuZXcgQXJyYXk8U2VyaWFsaXplZENvbXBvbmVudHM+KCk7XG4gICAgY29uc3Qgd2lyZXMgPSBuZXcgQXJyYXk8U2VyaWFsaXplZFdpcmU+KCk7XG5cbiAgICBjb25zdCBpZCA9IENPVU5URVJfR0VORVJBVE9SKCk7XG5cbiAgICAvLyBjcmVhdGUgaW5wdXRzXG4gICAgY29uc3QgaW5wdXRzOiBTZXJpYWxpemVkSW5wdXRbXSA9IEFycmF5KGlucylcbiAgICAgICAgLmZpbGwoMClcbiAgICAgICAgLm1hcCgoXywgaSkgPT4gKHtcbiAgICAgICAgICAgIHJlaWZpZWQ6IGksXG4gICAgICAgICAgICBwZXJtYW5lbnQ6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogXCJJTlBVVFwiLFxuICAgICAgICAgICAgYWN0aXZhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGlkOiBpZC5uZXh0KCkudmFsdWUsXG4gICAgICAgICAgICB4OiAxMDAsXG4gICAgICAgICAgICB5OiBpICogNTAgKyAxMDAsXG4gICAgICAgIH0pKTtcblxuICAgIC8vIGNyZWF0ZSBvdXRwdXRzXG4gICAgY29uc3Qgb3V0cHV0czogU2VyaWFsaXplZE91dHB1dFtdID0gQXJyYXkob3V0cylcbiAgICAgICAgLmZpbGwoMClcbiAgICAgICAgLm1hcCgoXywgaSkgPT4gKHtcbiAgICAgICAgICAgIHJlaWZpZWQ6IGlucHV0cy5sZW5ndGggKyBpLFxuICAgICAgICAgICAgcGVybWFuZW50OiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IFwiT1VUUFVUXCIsXG4gICAgICAgICAgICBhY3RpdmF0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgaWQ6IGlkLm5leHQoKS52YWx1ZSxcbiAgICAgICAgICAgIHg6IDcwMCxcbiAgICAgICAgICAgIHk6IGkgKiA1MCArIDEwMCxcbiAgICAgICAgfSkpO1xuXG4gICAgLy8gc2hvdWxkIHN0YXJ0IGF0IHRoZSBzdW0gb2YgdGhlIGxlbmd0aHMgb2YgdGhlIGlucHV0cyBhbmQgb3V0cHV0c1xuICAgIGxldCByZWlmaWVkID0gaW5wdXRzLmxlbmd0aCArIG91dHB1dHMubGVuZ3RoO1xuXG4gICAgLy8gbm90IGdhdGVzIGZvciBuZWdhdGluZyBpbnB1dHNcbiAgICBjb25zdCBuZWdhdGVkSW5wdXRzOiAoU2VyaWFsaXplZENvbXBvbmVudCB8IHVuZGVmaW5lZClbXSA9IGlucHV0cy5tYXAoKF8sIGkpID0+IHtcbiAgICAgICAgY29uc3QgdiA9IHZhcmlhYmxlRm9yKGksIHRydWUpO1xuXG4gICAgICAgIC8vIGlmIHRoZSBuZWdhdGVkIGlucHV0IGlzIG5ldmVyIHVzZWQsIGRvbid0IGNyZWF0ZSBhIG5vdCBnYXRlXG4gICAgICAgIGlmICghdGFibGUuc29tZSgoZXhwcikgPT4gZXhwci5pbmNsdWRlcyh2KSkpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlaWZpZWQ6IHJlaWZpZWQrKyxcbiAgICAgICAgICAgIHBlcm1hbmVudDogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiLFxuICAgICAgICAgICAgbmFtZTogXCJOT1RcIixcbiAgICAgICAgICAgIGlucHV0czogW3sgaWQ6IGlkLm5leHQoKS52YWx1ZSwgYWN0aXZhdGVkOiBmYWxzZSB9XSxcbiAgICAgICAgICAgIG91dHB1dHM6IFt7IGlkOiBpZC5uZXh0KCkudmFsdWUsIGFjdGl2YXRlZDogdHJ1ZSB9XSxcbiAgICAgICAgICAgIHg6IDE1MCxcbiAgICAgICAgICAgIHk6IGkgKiA1MCArIDEwMCArIDUwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICBjb21wbGVtZW50YXJ5OiBmYWxzZSxcbiAgICAgICAgICAgIGpvaW5zOiAxLFxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gY29ubmVjdGluZyBpbnB1dHMgdG8gbm90IGdhdGVzXG4gICAgaW5wdXRzLmZvckVhY2goKHsgaWQ6IGZyb20gfSwgaSkgPT4ge1xuICAgICAgICBpZiAobmVnYXRlZElucHV0c1tpXSkgd2lyZXMucHVzaCh7IGZyb20sIHRvOiBuZWdhdGVkSW5wdXRzW2ldIS5pbnB1dHNbMF0uaWQgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgaW5wdXRzLCBvdXRwdXRzLCBhbmQgbmVnYXRlZCBpbnB1dHMgdG8gY29tcG9uZW50c1xuICAgIGNvbXBvbmVudHMucHVzaChcbiAgICAgICAgLi4uaW5wdXRzLFxuICAgICAgICAuLi5vdXRwdXRzLFxuICAgICAgICAuLi5uZWdhdGVkSW5wdXRzLmZpbHRlcigoeCk6IHggaXMgU2VyaWFsaXplZENvbXBvbmVudCA9PiB0eXBlb2YgeCAhPT0gXCJ1bmRlZmluZWRcIiksXG4gICAgKTtcblxuICAgIHRhYmxlLmZvckVhY2goKGV4cHIsIGkpID0+IHtcbiAgICAgICAgLy8gcHJvZHVjdCBvZiBzdW1zXG4gICAgICAgIGlmIChleHByLnN0YXJ0c1dpdGgoXCIoXCIpICYmIGV4cHIuZW5kc1dpdGgoXCIpXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0ID0gZXhwci5zbGljZSgxLCAtMSkuc3BsaXQoXCIpKFwiKTtcblxuICAgICAgICAgICAgLy8gaGFuZGxlIHNpbmdsZSBwcm9kdWN0c1xuICAgICAgICAgICAgLy8gZGlyZWN0bHkgY29ubmVjdCBvciBnYXRlIHRvIG91dHB1dFxuICAgICAgICAgICAgaWYgKHByb2R1Y3QubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VtID0gcHJvZHVjdFswXS5zcGxpdChcIitcIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdW1HYXRlOiBTZXJpYWxpemVkQ29tcG9uZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkOiByZWlmaWVkKyssXG4gICAgICAgICAgICAgICAgICAgIHBlcm1hbmVudDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCIsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiT1JcIixcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBzdW0ubWFwKCh2KSA9PiAoeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IGlzSW52ZXJzaW9uKHYpIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0czogW3sgaWQ6IGlkLm5leHQoKS52YWx1ZSwgYWN0aXZhdGVkOiBzdW0uc29tZSgodikgPT4gaXNJbnZlcnNpb24odikpIH1dLFxuICAgICAgICAgICAgICAgICAgICB4OiAzNTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IGkgKiA1MCArIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZW1lbnRhcnk6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBqb2luczogc3VtLmxlbmd0aCxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gY29ubmVjdCBpbnB1dHMgdG8gdGhlIG9yIGdhdGVcbiAgICAgICAgICAgICAgICBzdW0uZm9yRWFjaCgodiwgaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbnZlcnNpb24odikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IG5lZ2F0ZWRJbnB1dHNbZnJvbVZhcmlhYmxlKHYpXSEub3V0cHV0c1swXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogc3VtR2F0ZS5pbnB1dHNba10uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IGlucHV0c1tmcm9tVmFyaWFibGUodildLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBzdW1HYXRlLmlucHV0c1trXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgb3IgZ2F0ZSB0byBjb21wb25lbnRzXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKHN1bUdhdGUpO1xuXG4gICAgICAgICAgICAgICAgLy8gY29ubmVjdCBvciBnYXRlIHRvIG91dHB1dFxuICAgICAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmcm9tOiBzdW1HYXRlLm91dHB1dHNbMF0uaWQsXG4gICAgICAgICAgICAgICAgICAgIHRvOiBvdXRwdXRzW2ldLmlkLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0R2F0ZTogU2VyaWFsaXplZENvbXBvbmVudCA9IHtcbiAgICAgICAgICAgICAgICByZWlmaWVkOiByZWlmaWVkKyssXG4gICAgICAgICAgICAgICAgcGVybWFuZW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiQU5EXCIsXG4gICAgICAgICAgICAgICAgaW5wdXRzOiBwcm9kdWN0Lm1hcCgoKSA9PiAoeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IGZhbHNlIH0pKSxcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiBbeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IGZhbHNlIH1dLFxuICAgICAgICAgICAgICAgIHg6IDU1MCxcbiAgICAgICAgICAgICAgICB5OiBpICogNTAgKyAxMDAsXG4gICAgICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICAgICAgY29tcGxlbWVudGFyeTogZmFsc2UsXG4gICAgICAgICAgICAgICAgam9pbnM6IHByb2R1Y3QubGVuZ3RoLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcHJvZHVjdC5mb3JFYWNoKChvLCBqKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VtID0gby5zcGxpdChcIitcIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdW1HYXRlOiBTZXJpYWxpemVkQ29tcG9uZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkOiByZWlmaWVkKyssXG4gICAgICAgICAgICAgICAgICAgIHBlcm1hbmVudDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCIsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiT1JcIixcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBzdW0ubWFwKCh2KSA9PiAoeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IGlzSW52ZXJzaW9uKHYpIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0czogW3sgaWQ6IGlkLm5leHQoKS52YWx1ZSwgYWN0aXZhdGVkOiBzdW0uc29tZSgodikgPT4gaXNJbnZlcnNpb24odikpIH1dLFxuICAgICAgICAgICAgICAgICAgICB4OiAzNTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IGkgKiA1MCArIDEwMCArIChwcm9kdWN0Lmxlbmd0aCAvIDIgLSBqKSAqIDUwLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxlbWVudGFyeTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGpvaW5zOiBzdW0ubGVuZ3RoLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgYW5kIGdhdGUgaW5wdXRcbiAgICAgICAgICAgICAgICBwcm9kdWN0R2F0ZS5pbnB1dHNbal0uYWN0aXZhdGVkID0gc3VtR2F0ZS5vdXRwdXRzWzBdLmFjdGl2YXRlZDtcblxuICAgICAgICAgICAgICAgIC8vIGNvbm5lY3QgaW5wdXRzIHRvIHRoZSBvciBnYXRlXG4gICAgICAgICAgICAgICAgc3VtLmZvckVhY2goKHYsIGspID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSW52ZXJzaW9uKHYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aXJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiBuZWdhdGVkSW5wdXRzW2Zyb21WYXJpYWJsZSh2KV0hLm91dHB1dHNbMF0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG86IHN1bUdhdGUuaW5wdXRzW2tdLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aXJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiBpbnB1dHNbZnJvbVZhcmlhYmxlKHYpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogc3VtR2F0ZS5pbnB1dHNba10uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gYWRkIG9yIGdhdGUgdG8gY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChzdW1HYXRlKTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbm5lY3Qgb3IgZ2F0ZSB0byBhbmQgZ2F0ZVxuICAgICAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmcm9tOiBzdW1HYXRlLm91dHB1dHNbMF0uaWQsXG4gICAgICAgICAgICAgICAgICAgIHRvOiBwcm9kdWN0R2F0ZS5pbnB1dHNbal0uaWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gYWRkIGFuZCBnYXRlIHRvIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChwcm9kdWN0R2F0ZSk7XG5cbiAgICAgICAgICAgIC8vIGNvbm5lY3QgYW5kIGdhdGUgdG8gb3V0cHV0XG4gICAgICAgICAgICB3aXJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBwcm9kdWN0R2F0ZS5vdXRwdXRzWzBdLmlkLFxuICAgICAgICAgICAgICAgIHRvOiBvdXRwdXRzW2ldLmlkLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN1bSBvZiBwcm9kdWN0c1xuICAgICAgICBjb25zdCBzdW0gPSBleHByLnNwbGl0KFwiK1wiKTtcblxuICAgICAgICAvLyBoYW5kbGUgc2luZ2xlIHN1bXNcbiAgICAgICAgLy8gZGlyZWN0bHkgY29ubmVjdCBhbmQgZ2F0ZSB0byBvdXRwdXRcbiAgICAgICAgaWYgKHN1bS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3QgPSBzdW1bMF0uc3BsaXQoLyg/PVxcdykvKTtcblxuICAgICAgICAgICAgY29uc3QgcHJvZHVjdEdhdGU6IFNlcmlhbGl6ZWRDb21wb25lbnQgPSB7XG4gICAgICAgICAgICAgICAgcmVpZmllZDogcmVpZmllZCsrLFxuICAgICAgICAgICAgICAgIHBlcm1hbmVudDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJDT01QT05FTlRcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkFORFwiLFxuICAgICAgICAgICAgICAgIGlucHV0czogcHJvZHVjdC5tYXAoKHYpID0+ICh7IGlkOiBpZC5uZXh0KCkudmFsdWUsIGFjdGl2YXRlZDogaXNJbnZlcnNpb24odikgfSkpLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IFt7IGlkOiBpZC5uZXh0KCkudmFsdWUsIGFjdGl2YXRlZDogcHJvZHVjdC5ldmVyeSgodikgPT4gaXNJbnZlcnNpb24odikpIH1dLFxuICAgICAgICAgICAgICAgIHg6IDM1MCxcbiAgICAgICAgICAgICAgICB5OiBpICogNTAgKyAxMDAsXG4gICAgICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICAgICAgY29tcGxlbWVudGFyeTogZmFsc2UsXG4gICAgICAgICAgICAgICAgam9pbnM6IHByb2R1Y3QubGVuZ3RoLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gY29ubmVjdCBpbnB1dHMgdG8gdGhlIGFuZCBnYXRlXG4gICAgICAgICAgICBwcm9kdWN0LmZvckVhY2goKHYsIGspID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNJbnZlcnNpb24odikpIHtcbiAgICAgICAgICAgICAgICAgICAgd2lyZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiBuZWdhdGVkSW5wdXRzW2Zyb21WYXJpYWJsZSh2KV0hLm91dHB1dHNbMF0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogcHJvZHVjdEdhdGUuaW5wdXRzW2tdLmlkLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aXJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IGlucHV0c1tmcm9tVmFyaWFibGUodildLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHByb2R1Y3RHYXRlLmlucHV0c1trXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGFkZCBhbmQgZ2F0ZSB0byBjb21wb25lbnRzXG4gICAgICAgICAgICBjb21wb25lbnRzLnB1c2gocHJvZHVjdEdhdGUpO1xuXG4gICAgICAgICAgICAvLyBjb25uZWN0IGFuZCBnYXRlIHRvIG91dHB1dFxuICAgICAgICAgICAgd2lyZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgZnJvbTogcHJvZHVjdEdhdGUub3V0cHV0c1swXS5pZCxcbiAgICAgICAgICAgICAgICB0bzogb3V0cHV0c1tpXS5pZCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdW1HYXRlOiBTZXJpYWxpemVkQ29tcG9uZW50ID0ge1xuICAgICAgICAgICAgcmVpZmllZDogcmVpZmllZCsrLFxuICAgICAgICAgICAgcGVybWFuZW50OiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCIsXG4gICAgICAgICAgICBuYW1lOiBcIk9SXCIsXG4gICAgICAgICAgICBpbnB1dHM6IHN1bS5tYXAoKCkgPT4gKHsgaWQ6IGlkLm5leHQoKS52YWx1ZSwgYWN0aXZhdGVkOiBmYWxzZSB9KSksXG4gICAgICAgICAgICBvdXRwdXRzOiBbeyBpZDogaWQubmV4dCgpLnZhbHVlLCBhY3RpdmF0ZWQ6IGZhbHNlIH1dLFxuICAgICAgICAgICAgeDogNTUwLFxuICAgICAgICAgICAgeTogaSAqIDUwICsgMTAwLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICBjb21wbGVtZW50YXJ5OiBmYWxzZSxcbiAgICAgICAgICAgIGpvaW5zOiBzdW0ubGVuZ3RoLFxuICAgICAgICB9O1xuXG4gICAgICAgIHN1bS5mb3JFYWNoKChvLCBqKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0ID0gby5zcGxpdCgvKD89XFx3KS8pO1xuXG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0R2F0ZTogU2VyaWFsaXplZENvbXBvbmVudCA9IHtcbiAgICAgICAgICAgICAgICByZWlmaWVkOiByZWlmaWVkKyssXG4gICAgICAgICAgICAgICAgcGVybWFuZW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiQU5EXCIsXG4gICAgICAgICAgICAgICAgaW5wdXRzOiBwcm9kdWN0Lm1hcCgodikgPT4gKHsgaWQ6IGlkLm5leHQoKS52YWx1ZSwgYWN0aXZhdGVkOiBpc0ludmVyc2lvbih2KSB9KSksXG4gICAgICAgICAgICAgICAgb3V0cHV0czogW3sgaWQ6IGlkLm5leHQoKS52YWx1ZSwgYWN0aXZhdGVkOiBwcm9kdWN0LmV2ZXJ5KCh2KSA9PiBpc0ludmVyc2lvbih2KSkgfV0sXG4gICAgICAgICAgICAgICAgeDogMzUwLFxuICAgICAgICAgICAgICAgIHk6IGkgKiA1MCArIDEwMCArIChwcm9kdWN0Lmxlbmd0aCAvIDIgLSBqKSAqIDUwLFxuICAgICAgICAgICAgICAgIGFuZ2xlOiAwLFxuICAgICAgICAgICAgICAgIGNvbXBsZW1lbnRhcnk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGpvaW5zOiBwcm9kdWN0Lmxlbmd0aCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSBvciBnYXRlIGlucHV0XG4gICAgICAgICAgICBzdW1HYXRlLmlucHV0c1tqXS5hY3RpdmF0ZWQgPSBwcm9kdWN0R2F0ZS5vdXRwdXRzWzBdLmFjdGl2YXRlZDtcblxuICAgICAgICAgICAgLy8gY29ubmVjdCBpbnB1dHMgdG8gdGhlIGFuZCBnYXRlXG4gICAgICAgICAgICBwcm9kdWN0LmZvckVhY2goKHYsIGspID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNJbnZlcnNpb24odikpIHtcbiAgICAgICAgICAgICAgICAgICAgd2lyZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiBuZWdhdGVkSW5wdXRzW2Zyb21WYXJpYWJsZSh2KV0hLm91dHB1dHNbMF0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogcHJvZHVjdEdhdGUuaW5wdXRzW2tdLmlkLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aXJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IGlucHV0c1tmcm9tVmFyaWFibGUodildLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IHByb2R1Y3RHYXRlLmlucHV0c1trXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGFkZCBhbmQgZ2F0ZSB0byBjb21wb25lbnRzXG4gICAgICAgICAgICBjb21wb25lbnRzLnB1c2gocHJvZHVjdEdhdGUpO1xuXG4gICAgICAgICAgICAvLyBjb25uZWN0IGFuZCBnYXRlIHRvIG9yIGdhdGVcbiAgICAgICAgICAgIHdpcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGZyb206IHByb2R1Y3RHYXRlLm91dHB1dHNbMF0uaWQsXG4gICAgICAgICAgICAgICAgdG86IHN1bUdhdGUuaW5wdXRzW2pdLmlkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGFkZCBvciBnYXRlIHRvIGNvbXBvbmVudHNcbiAgICAgICAgY29tcG9uZW50cy5wdXNoKHN1bUdhdGUpO1xuXG4gICAgICAgIC8vIGNvbm5lY3Qgb3IgZ2F0ZSB0byBvdXRwdXRcbiAgICAgICAgd2lyZXMucHVzaCh7XG4gICAgICAgICAgICBmcm9tOiBzdW1HYXRlLm91dHB1dHNbMF0uaWQsXG4gICAgICAgICAgICB0bzogb3V0cHV0c1tpXS5pZCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIFwiRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRcIjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBvbmVudHMsXG4gICAgICAgIHdpcmVzLFxuICAgIH07XG59XG4iLCJpbXBvcnQgeyBhc3NlcnROZXZlciB9IGZyb20gXCIuLi8uLi9jaXJjdWxhclwiO1xuaW1wb3J0IHsgVU5JQ09ERV9NQUNST05fRElBQ1JJVElDLCBWQVJJQUJMRV9OQU1FUywgdmFyaWFibGVGb3IgfSBmcm9tIFwiLi92YXJpYWJsZXNcIjtcblxuLyoqIGZvcm1hdHMgYSBsaXN0IG9mIGlucHV0cyBhY2NvcmRpbmcgdG8gdGhlIG1ldGhvZCBiZWluZyB1c2VkICovXG5mdW5jdGlvbiBleHByZXNzaW9uKGlucHV0OiBib29sZWFuW10sIHR5cGU6IFwiUFJPRFVDVF9PRl9TVU1TXCIgfCBcIlNVTV9PRl9QUk9EVUNUU1wiKSB7XG4gICAgLy8gZXhwcmVzc2lvbiBpcyBhIHN1bSwgam9pbiBieSAnKycgZm9yIFwiYStiK2NcIlxuICAgIGlmICh0eXBlID09PSBcIlBST0RVQ1RfT0ZfU1VNU1wiKSByZXR1cm4gaW5wdXQubWFwKChfLCBpKSA9PiB2YXJpYWJsZUZvcihpLCBfKSkuam9pbihcIitcIik7XG5cbiAgICAvLyBvdGhlcndpc2UgaXQgaXMgYSBwcm9kdWN0LCBsaWtlIFwiYWJjXCJcbiAgICBpZiAodHlwZSA9PT0gXCJTVU1fT0ZfUFJPRFVDVFNcIikgcmV0dXJuIGlucHV0Lm1hcCgoXywgaSkgPT4gdmFyaWFibGVGb3IoaSwgIV8pKS5qb2luKFwiXCIpO1xuXG4gICAgcmV0dXJuIGFzc2VydE5ldmVyKHR5cGUpO1xufVxuXG4vKiogdHVybnMgYSB0cnV0aCB0YWJsZSBpbnRvIGEgbGlzdCBvZiBleHByZXNzaW9ucyB0aGF0IHJlcHJlc2VudCBlYWNoIG91dHB1dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeSh0YWJsZTogYm9vbGVhbltdW11bXSkge1xuICAgIC8vIGNhbid0IHN0cmluZ2lmeSBjb3JyZWN0bHkgaWYgdGhlcmUgYXJlIHRvbyBtYW55IGlucHV0c1xuICAgIGlmICh0YWJsZS5zb21lKChbaW5wdXRzXSkgPT4gaW5wdXRzLmxlbmd0aCA+IFZBUklBQkxFX05BTUVTLmxlbmd0aCkpXG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKGBUYWJsZSBjb250YWlucyBtb3JlIHRoYW4gJHtWQVJJQUJMRV9OQU1FUy5sZW5ndGh9IGlucHV0cy5gKTtcblxuICAgIGNvbnN0IG91dHB1dHMgPSB0YWJsZS5tYXAoKFssIG91dHB1dHNdKSA9PiBvdXRwdXRzKTtcbiAgICAvLyB0cmFuc3Bvc2Ugb3V0cHV0cyBmb3IgZWFzaWVyIHByb2Nlc3NpbmdcbiAgICBjb25zdCB0cmFuc3Bvc2VkID0gb3V0cHV0c1swXS5tYXAoKF8sIGNvbCkgPT4gb3V0cHV0cy5tYXAoKHJvdykgPT4gcm93W2NvbF0pKTtcblxuICAgIHJldHVybiB0cmFuc3Bvc2VkLm1hcCgob3V0LCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBhbHdheXMgdHJ1ZSwgdXNlIChhK8KsYSlcbiAgICAgICAgaWYgKG91dC5ldmVyeShCb29sZWFuKSkgcmV0dXJuIGAoYSthJHtVTklDT0RFX01BQ1JPTl9ESUFDUklUSUN9KWA7XG4gICAgICAgIC8vIGFsd2F5cyBmYWxzZSwgdXNlIGHCrGFcbiAgICAgICAgaWYgKCFvdXQuc29tZShCb29sZWFuKSkgcmV0dXJuIGBhYSR7VU5JQ09ERV9NQUNST05fRElBQ1JJVElDfWA7XG5cbiAgICAgICAgLy8gZGV0ZXJtaW5lIHdoYXQgbWV0aG9kIHRvIHVzZVxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbW9yZSB0cnVlcyB0aGFuIGZhbHNlcywgdXNlIHByb2R1Y3Qgb2Ygc3Vtc1xuICAgICAgICAvLyBvdGhlcndpc2UsIHVzZSBzdW0gb2YgcHJvZHVjdHNcbiAgICAgICAgLy8gdGhpcyBtYWtlcyBpdCBzbyB0aGF0IHRoZXJlIGFyZSBsZXNzIG91dHB1dHMgdG8gZ2VuZXJhdGUgZXhwcmVzc2lvbnMgZm9yXG4gICAgICAgIGNvbnN0IHR5cGUgPSBvdXQuZmlsdGVyKEJvb2xlYW4pLmxlbmd0aCA+IG91dC5sZW5ndGggLyAyID8gXCJQUk9EVUNUX09GX1NVTVNcIiA6IFwiU1VNX09GX1BST0RVQ1RTXCI7XG5cbiAgICAgICAgLy8gZmlsdGVyIGZvciBmYWxzZSBvdXRwdXRzXG4gICAgICAgIGlmICh0eXBlID09PSBcIlBST0RVQ1RfT0ZfU1VNU1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIFwiKFwiICtcbiAgICAgICAgICAgICAgICB0YWJsZVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChbLCBvdXRwdXRzXSkgPT4gb3V0cHV0c1tpbmRleF0gPT09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAubWFwKChbaW5wdXRzXSkgPT4gZXhwcmVzc2lvbihpbnB1dHMsIHR5cGUpKVxuICAgICAgICAgICAgICAgICAgICAuam9pbihcIikoXCIpICtcbiAgICAgICAgICAgICAgICBcIilcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpbHRlciBmb3IgdHJ1ZSBvdXRwdXRzXG4gICAgICAgIGlmICh0eXBlID09PSBcIlNVTV9PRl9QUk9EVUNUU1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFibGVcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChbLCBvdXRwdXRzXSkgPT4gb3V0cHV0c1tpbmRleF0gPT09IHRydWUpXG4gICAgICAgICAgICAgICAgLm1hcCgoW2lucHV0c10pID0+IGV4cHJlc3Npb24oaW5wdXRzLCB0eXBlKSlcbiAgICAgICAgICAgICAgICAuam9pbihcIitcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXNzZXJ0TmV2ZXIodHlwZSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBmcm9tVmFyaWFibGUsIGlzSW52ZXJzaW9uIH0gZnJvbSBcIi4vdmFyaWFibGVzXCI7XG5cbi8vIEFycmF5LnByb3RvdHlwZS5zb21lIHJlcHJlc2VudHMgYW4gb3IgZ2F0ZVxuLy8gQXJyYXkucHJvdG90eXBlLmV2ZXJ5IHJlcHJlc2VudHMgYW4gYW5kIGdhdGVcbi8vIHRodXMsIGEgcHJvZHVjdCBvZiBzdW1zIGlzIHJlYWxseSAuc29tZSBmb2xsb3dlZCBieSAuZXZlcnlcbi8vIGFuZCBhIHN1bSBvZiBwcm9kdWN0cyBpcyByZWFsbHkgYSAuZXZlcnkgZm9sbG93ZWQgYnkgLnNvbWVcbi8qKiBldmFsdWF0ZXMgYSBsaXN0IG9mIGV4cHJlc3Npb25zIHdpdGggdGhlIGdpdmVuIGlucHV0cyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1YnN0aXR1dGUoZXhwcnM6IHN0cmluZ1tdLCB1c2luZzogYm9vbGVhbltdKSB7XG4gICAgcmV0dXJuIGV4cHJzLm1hcCgoZXhwcikgPT4ge1xuICAgICAgICAvLyBwcm9kdWN0IG9mIHN1bXNcbiAgICAgICAgaWYgKGV4cHIuc3RhcnRzV2l0aChcIihcIikgJiYgZXhwci5lbmRzV2l0aChcIilcIikpIHtcbiAgICAgICAgICAgIC8vIG5lZWQgdG8gZ2V0IGVhY2ggc3VtXG4gICAgICAgICAgICByZXR1cm4gZXhwclxuICAgICAgICAgICAgICAgIC5zbGljZSgxLCAtMSlcbiAgICAgICAgICAgICAgICAuc3BsaXQoXCIpKFwiKVxuICAgICAgICAgICAgICAgIC5tYXAoKG8pID0+XG4gICAgICAgICAgICAgICAgICAgIG9cbiAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIitcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHYpID0+IChpc0ludmVyc2lvbih2KSA/ICF1c2luZ1tmcm9tVmFyaWFibGUodildIDogdXNpbmdbZnJvbVZhcmlhYmxlKHYpXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc29tZShCb29sZWFuKSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmV2ZXJ5KEJvb2xlYW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3VtIG9mIHByb2R1Y3RzXG4gICAgICAgIC8vIHNwbGl0dGluZyBieSBsb29rYWhlYWQgcmVnZXggYmVjYXVzZSBvZiBtYWNybyBkaWFjcml0aWMgYW5kIHByaW1lcyBvciBkb3VibGUgcHJpbWVzXG4gICAgICAgIHJldHVybiBleHByXG4gICAgICAgICAgICAuc3BsaXQoXCIrXCIpXG4gICAgICAgICAgICAubWFwKChvKSA9PlxuICAgICAgICAgICAgICAgIG9cbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KC8oPz1cXHcpLylcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgodikgPT4gKGlzSW52ZXJzaW9uKHYpID8gIXVzaW5nW2Zyb21WYXJpYWJsZSh2KV0gOiB1c2luZ1tmcm9tVmFyaWFibGUodildKSlcbiAgICAgICAgICAgICAgICAgICAgLmV2ZXJ5KEJvb2xlYW4pLFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnNvbWUoQm9vbGVhbik7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgY29uc3QgQUxQSEFCRVQgPSBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCI7XG4vLyByZXBlYXRzIDMgdGltZXMgdG8gYWRkIHByaW1lcyBhbmQgZG91YmxlIHByaW1lc1xuZXhwb3J0IGNvbnN0IFZBUklBQkxFX05BTUVTID0gQUxQSEFCRVQucmVwZWF0KDMpXG4gICAgLnNwbGl0KFwiXCIpXG4gICAgLm1hcCgoYywgaSkgPT4gYCR7Y30ke1tcIlwiLCBcIsq5XCIsIFwiyrpcIl1bTWF0aC5mbG9vcihpIC8gQUxQSEFCRVQubGVuZ3RoKV19YCk7XG4vKiogdXNlZCB0byBuZWdhdGUgc29tZXRoaW5nLCBcImHMhFwiICovXG5leHBvcnQgY29uc3QgVU5JQ09ERV9NQUNST05fRElBQ1JJVElDID0gXCJcXHUwMzA0XCI7XG5cbi8qKiBjb252ZXJ0cyBpbmRleCBvZiBpbnB1dCBpbnRvIHZhcmlhYmxlIG5hbWUgKi9cbmV4cG9ydCBmdW5jdGlvbiB2YXJpYWJsZUZvcihpOiBudW1iZXIsIGludmVydDogYm9vbGVhbikge1xuICAgIHJldHVybiBpbnZlcnQgPyBWQVJJQUJMRV9OQU1FU1tpXS5yZXBsYWNlKC9eKFxcdykvLCBcIiQxXCIgKyBVTklDT0RFX01BQ1JPTl9ESUFDUklUSUMpIDogVkFSSUFCTEVfTkFNRVNbaV07XG59XG5cbi8qKiBjb252ZXJ0cyB2YXJpYWJsZSBuYW1lIGludG8gaW5kZXggb2YgaW5wdXQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tVmFyaWFibGUodjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFZBUklBQkxFX05BTUVTLmluZGV4T2Yodi5yZXBsYWNlKFVOSUNPREVfTUFDUk9OX0RJQUNSSVRJQywgXCJcIikpO1xufVxuXG4vKiogY2hhbmdlcyBhIHZhcmlhYmxlIGludG8gaXRzIGludmVydGVkIHZlcnNpb24gKGRvZXMgbm90IHRvZ2dsZSkgKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnRWYXJpYWJsZSh2OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdi5yZXBsYWNlKC9eKFxcdykvLCBcIiQxXCIgKyBVTklDT0RFX01BQ1JPTl9ESUFDUklUSUMpO1xufVxuXG4vKiogY2hlY2tzIGlmIHRoZSB2YXJpYWJsZSBpcyBhbiBpbnZlcnRlZCB2ZXJzaW9uICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnZlcnNpb24odjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHYuaW5jbHVkZXMoVU5JQ09ERV9NQUNST05fRElBQ1JJVElDKTtcbn1cbiIsImltcG9ydCB7IHJlaWZ5IH0gZnJvbSBcIi4vYWxnZWJyYS9yZWlmeVwiO1xuaW1wb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSBcIi4vYWxnZWJyYS9zdHJpbmdpZnlcIjtcbmltcG9ydCB7IHN1YnN0aXR1dGUgfSBmcm9tIFwiLi9hbGdlYnJhL3N1YnN0aXR1dGVcIjtcblxudHJ5IHtcbiAgICAvLyB3YWl0IGZvciBib3NzIHRvIGdpdmUgdXMgdGhlIHRhYmxlXG4gICAgY29uc3QgdGFibGUgPSBhd2FpdCBuZXcgUHJvbWlzZTxib29sZWFuW11bXVtdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHNlbGYub25tZXNzYWdlID0gKGUpID0+IHJlc29sdmUoZS5kYXRhKTtcblxuICAgICAgICBzZWxmLm9uZXJyb3IgPSAoZSkgPT4gcmVqZWN0KGUpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvZGU6IFwiTUVTU0FHRVwiLFxuICAgICAgICBtZXNzYWdlOiBcIlJlY2VpdmVkOlxcblwiICsgdGFibGUubWFwKChyb3cpID0+IHJvdy5tYXAoKGNvbCkgPT4gY29sLm1hcChOdW1iZXIpLmpvaW4oXCIgXCIpKS5qb2luKFwiIHwgXCIpKS5qb2luKFwiXFxuXCIpLFxuICAgIH0pO1xuXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvZGU6IFwiTUVTU0FHRVwiLFxuICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgXCJFeHByZXNzaW9uczpcXG5cIiArXG4gICAgICAgICAgICBzdHJpbmdpZnkodGFibGUpXG4gICAgICAgICAgICAgICAgLm1hcCgocm93LCBpKSA9PiBgb3V0cHV0ICR7aSArIDF9OiAke3Jvd31gKVxuICAgICAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpLFxuICAgIH0pO1xuXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvZGU6IFwiTUVTU0FHRVwiLFxuICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgXCJUZXN0czpcXG5cIiArXG4gICAgICAgICAgICB0YWJsZVxuICAgICAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChbaW5wdXRdKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgYGlucHV0ICR7aW5wdXQubWFwKE51bWJlcikuam9pbihcIiBcIil9OiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnN0aXR1dGUoc3RyaW5naWZ5KHRhYmxlKSwgaW5wdXQpLm1hcChOdW1iZXIpLmpvaW4oXCIgXCIpLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuam9pbihcIlxcblwiKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGdlbmVyYXRlZCA9IHJlaWZ5KHRhYmxlWzBdWzBdLmxlbmd0aCwgdGFibGVbMF1bMV0ubGVuZ3RoLCBzdHJpbmdpZnkodGFibGUpKTtcblxuICAgIGNvbnN0IGxpbmsgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG4gICAgbGluay5wYXRobmFtZSA9IFwiXCI7XG5cbiAgICBsaW5rLnNlYXJjaCA9IFwiP2lubGluZT1cIiArIGJ0b2EoSlNPTi5zdHJpbmdpZnkoZ2VuZXJhdGVkKSk7XG5cbiAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgY29kZTogXCJNRVNTQUdFXCIsXG4gICAgICAgIG1lc3NhZ2U6IFwiTGluazpcXG5cIiArIGxpbmsuaHJlZixcbiAgICB9KTtcblxuICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xuICAgICAgICBjb2RlOiBcIkZJTklTSEVEXCIsXG4gICAgICAgIG1lc3NhZ2U6IFwiR2VuZXJhdGVkOlxcblwiICsgSlNPTi5zdHJpbmdpZnkoZ2VuZXJhdGVkLCB1bmRlZmluZWQsIDQpLFxuICAgIH0pO1xufSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7IGNvZGU6IFwiRVJST1JcIiwgZXJyb3I6IGUgfSk7XG59XG5cbmV4cG9ydCB7fTtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuXG4vKiogYXNrcyB1c2VyIHRvIGlucHV0IGEgZmlsZSAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbGVJbnB1dCgpIHtcbiAgICBjb25zdCBpbnB1dCA9IE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLCB7IHR5cGU6IFwiZmlsZVwiIH0pO1xuXG4gICAgaW5wdXQuY2xpY2soKTtcblxuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBuZXcgUHJvbWlzZTxGaWxlIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICBpbnB1dC5vbmNoYW5nZSA9ICgpID0+IHJlc29sdmUoaW5wdXQuZmlsZXM/LlswXSA/PyB1bmRlZmluZWQpO1xuXG4gICAgICAgIGlucHV0Lm9uZXJyb3IgPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpZiAoIWZpbGUpXG4gICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgbWVzc2FnZTogXCJObyBmaWxlIHdhcyBwcm92aWRlZC5cIixcbiAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICB9KTtcblxuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblxuICAgIGNvbnN0IHJhdyA9IGF3YWl0IG5ldyBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHJlc29sdmUocmVhZGVyLnJlc3VsdD8udG9TdHJpbmcoKSA/PyB1bmRlZmluZWQpO1xuXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaWYgKCFyYXcpXG4gICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gcmVhZCB0aGUgZmlsZS5cIixcbiAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICB9KTtcblxuICAgIHJldHVybiByYXc7XG59XG5cbi8qKiBkb3dubG9hZHMgdGhlIGNvbnRlbnRzIGFzIGEgZmlsZSAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkRmlsZShjb250ZW50czogQmxvYlBhcnRbXSkge1xuICAgIE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIiksIHtcbiAgICAgICAgaHJlZjogVVJMLmNyZWF0ZU9iamVjdFVSTChcbiAgICAgICAgICAgIG5ldyBCbG9iKGNvbnRlbnRzLCB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0L3BsYWluXCIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICAgZG93bmxvYWQ6IFwidGFibGUuZ2F0ZXNpbS50eHRcIixcbiAgICB9KS5jbGljaygpO1xufVxuIiwiLy8gdGhpcyBmaWxlIG9ubHkgZXhpc3RzIHRvIGJyZWFrIGNpcmN1bGFyIGRlcGVuZGVuY2llc1xuXG5leHBvcnQgY29uc3QgSVNfTUFDX09TID1cbiAgICB0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICAgID8gW25hdmlnYXRvci51c2VyQWdlbnREYXRhPy5wbGF0Zm9ybSwgbmF2aWdhdG9yLnBsYXRmb3JtXS5zb21lKFxuICAgICAgICAgICAgICAocGxhdGZvcm0pID0+IHBsYXRmb3JtPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFwibWFjXCIpID8/IGZhbHNlLFxuICAgICAgICAgIClcbiAgICAgICAgOiBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE5ldmVyKCk6IG5ldmVyO1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE5ldmVyKHY6IG5ldmVyKTogbmV2ZXI7XG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0TmV2ZXIoLi4uYXJnczogW10gfCBbdjogbmV2ZXJdKSB7XG4gICAgaWYgKCFhcmdzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCk7XG5cbiAgICByZXR1cm4gYXJnc1swXTtcbn1cbiIsImltcG9ydCB7IERhcmttb2RlTWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL0Rhcmttb2RlTWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgTmF2aWdhdG9yIHtcbiAgICAgICAgdXNlckFnZW50RGF0YT86IHsgcGxhdGZvcm06IHN0cmluZyB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSA9IDI0O1xuZXhwb3J0IGNvbnN0IE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgPSAyNDtcbmV4cG9ydCBjb25zdCBDSElQX0NPTVBPTkVOVF9DU1NfV0lEVEggPSAxMjA7XG5leHBvcnQgY29uc3QgQ0hJUF9DT01QT05FTlRfQ1NTX0hFSUdIVCA9IDQwO1xuZXhwb3J0IGNvbnN0IENISVBfSU5QVVRfQ1NTX1NJWkUgPSAxNjtcbmV4cG9ydCBjb25zdCBDSElQX09VVFBVVF9DU1NfU0laRSA9IDE2O1xuZXhwb3J0IGNvbnN0IE9SSUdJTl9QT0lOVCA9IE9iamVjdC5mcmVlemUoeyB4OiAwLCB5OiAwIH0pO1xuZXhwb3J0IGNvbnN0IElOX0RFQlVHX01PREUgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcy5oYXMoXCJkZWJ1Z1wiKTtcbmV4cG9ydCBjb25zdCBOT19SRU5ERVJJTkcgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcy5oYXMoXCJub3JlbmRlclwiKTtcblxuZXhwb3J0IGNvbnN0IExPQ0tFRF9GT1JfVEVTVElORyA9ICgpID0+IE1vZGFsTWFuYWdlci5hbGVydChcIlRoZSBkaWFncmFtIGlzIGN1cnJlbnRseSBsb2NrZWQuIE5vIGNoYW5nZXMgY2FuIGJlIG1hZGUuXCIpO1xuXG5leHBvcnQgY29uc3QgREVMQVkgPSAoZGVsYXkgPSAwKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuXG5leHBvcnQgY29uc3QgR0VUX0JBQ0tHUk9VTkRfQ0FOVkFTX0NUWCA9ICgpID0+XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXCJjYW52YXMuYmFja2dyb3VuZC1jYW52YXNcIikhLmdldENvbnRleHQoXCIyZFwiKSE7XG5cbmV4cG9ydCBjb25zdCBHRVRfRk9SRUdST1VORF9DQU5WQVNfQ1RYID0gKCkgPT5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcy5mb3JlZ3JvdW5kLWNhbnZhc1wiKSEuZ2V0Q29udGV4dChcIjJkXCIpITtcblxuZXhwb3J0IGNvbnN0IENPVU5URVJfR0VORVJBVE9SID0gZnVuY3Rpb24qIChpID0gMCkge1xuICAgIHdoaWxlICh0cnVlKSB5aWVsZCBpKys7XG59O1xuXG5leHBvcnQgY29uc3QgU0NVRkZFRF9VVUlEID0gKCkgPT5cbiAgICBEYXRlLm5vdygpLnRvU3RyaW5nKDM2KSArIE51bWJlcihEYXRlLm5vdygpLnRvU3RyaW5nKCkuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIikpLnRvU3RyaW5nKDM2KTtcblxuZXhwb3J0IGNvbnN0IFJPVU5EX1RPX05FQVJFU1QgPSAoeDogbnVtYmVyLCBuOiBudW1iZXIpID0+IE1hdGgucm91bmQoeCAvIG4pICogbjtcblxuZXhwb3J0IGNvbnN0IEdFVF9BQ1RJVkFURURfQ09MT1IgPSAoKSA9PlxuICAgIERhcmttb2RlTWFuYWdlci5kYXJrbW9kZUVuYWJsZWQgPyBEQVJLX0FDVElWQVRFRF9DU1NfQ09MT1IgOiBBQ1RJVkFURURfQ1NTX0NPTE9SO1xuZXhwb3J0IGNvbnN0IEdFVF9HUkFZX0NPTE9SID0gKCkgPT5cbiAgICBEYXJrbW9kZU1hbmFnZXIuZGFya21vZGVFbmFibGVkID8gT05MWV9BX0hJTlRfT0ZfREFSS19HUkFZX0NTU19DT0xPUiA6IExJR0hUX0dSQVlfQ1NTX0NPTE9SO1xuXG5leHBvcnQgY29uc3QgR0VUX0JJTl9QRVJNUyA9IChuOiBudW1iZXIpID0+XG4gICAgQXJyYXkuZnJvbSh7IGxlbmd0aDogTWF0aC5wb3coMiwgbikgfSwgKF8sIHkpID0+IEFycmF5LmZyb20oeyBsZW5ndGg6IG4gfSwgKF8sIHgpID0+ICEhKCh5ID4+IHgpICYgMSkpKTtcblxuZXhwb3J0IGNvbnN0IEFDVElWQVRFRF9DU1NfQ09MT1IgPSBcIiNmZjI2MjZcIjtcbmV4cG9ydCBjb25zdCBEQVJLX0FDVElWQVRFRF9DU1NfQ09MT1IgPSBcIiNkZDExMTFcIjtcbmV4cG9ydCBjb25zdCBFVkVOX0RBUktFUl9HUkFZX0NTU19DT0xPUiA9IFwiIzBhMGEwY1wiO1xuZXhwb3J0IGNvbnN0IFNMSUdIVExZX0RBUktFUl9HUkFZX0NTU19DT0xPUiA9IFwiIzEwMTAxMlwiO1xuZXhwb3J0IGNvbnN0IERBUktFUl9HUkFZX0NTU19DT0xPUiA9IFwiIzE2MTYxZlwiO1xuZXhwb3J0IGNvbnN0IERBUktfR1JBWV9DU1NfQ09MT1IgPSBcIiMxYzFjMjRcIjtcbmV4cG9ydCBjb25zdCBLSU5EQV9EQVJLX0dSQVlfQ1NTX0NPTE9SID0gXCIjMjQyNDJlXCI7XG5leHBvcnQgY29uc3QgTk9UX1JFQUxMWV9EQVJLX0dSQVlfQ1NTX0NPTE9SID0gXCIjMmUyZTNmXCI7XG5leHBvcnQgY29uc3QgT05MWV9BX0hJTlRfT0ZfREFSS19HUkFZX0NTU19DT0xPUiA9IFwiIzNjM2M0ZlwiO1xuZXhwb3J0IGNvbnN0IE1JRF9HUkFZX0NTU19DT0xPUiA9IFwiIzQwNDA0ZlwiO1xuZXhwb3J0IGNvbnN0IFNVUEVSX0dSQVlfQ1NTX0NPTE9SID0gXCIjYmJiYmJiXCI7XG5leHBvcnQgY29uc3QgS0lOREFfTElHSFRfR1JBWV9DU1NfQ09MT1IgPSBcIiNjZGNkY2RcIjtcbmV4cG9ydCBjb25zdCBMSUdIVF9HUkFZX0NTU19DT0xPUiA9IFwiI2RlZGVkZVwiO1xuZXhwb3J0IGNvbnN0IExJR0hURVJfR1JBWV9DU1NfQ09MT1IgPSBcIiNlYWVhZWFcIjtcbmV4cG9ydCBjb25zdCBFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1IgPSBcIiNlZmVmZWZcIjtcbmV4cG9ydCBjb25zdCBUT0FTVF9EVVJBVElPTiA9IDI1MDA7XG5leHBvcnQgY29uc3QgR1JJRF9TSVpFID0gMTU7XG5leHBvcnQgY29uc3QgUVVJQ0tQSUNLX1NJWkUgPSA3NTtcblxuZXhwb3J0IGNvbnN0IEFQUF9OQU1FID0gKG5ldyBVUkwobG9jYXRpb24uaHJlZikuc2VhcmNoUGFyYW1zLmdldChcImFwcFwiKSA/PyBcInNpbVwiKS50b0xvd2VyQ2FzZSgpO1xuIiwiaW1wb3J0IHsgTE9DS0VEX0ZPUl9URVNUSU5HLCBPUklHSU5fUE9JTlQgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgdHlwZSB7IE1lbnVNYW5hZ2VyQWN0aW9uIH0gZnJvbSBcIi4uL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSBcIi4uL3JlaWZpZWQvRGlzcGxheVwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IGNoaXBzIH0gZnJvbSBcIi4uL3JlaWZpZWQvY2hpcHNcIjtcblxuZXhwb3J0IGNvbnN0IGluc2VydCA9IHtcbiAgICBcImluc2VydC1jb21wb25lbnRcIjoge1xuICAgICAgICBsYWJlbDogXCJJbnNlcnQgY29tcG9uZW50XCIsXG4gICAgICAgIGtleWJpbmQ6IFwiQVwiLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKGUsIG4/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB0eXBlb2YgbiA9PT0gXCJzdHJpbmdcIiA/IG4gOiBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiRW50ZXIgdGhlIGNvbXBvbmVudCdzIG5hbWU6XCIpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIgfHwgIW5hbWUudHJpbSgpKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGNoaXAgPSBjaGlwcy5nZXQobmFtZS50b1VwcGVyQ2FzZSgpKTtcblxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY2hpcFxuICAgICAgICAgICAgICAgID8gbmV3IENvbXBvbmVudChSZWZsZWN0LmNvbnN0cnVjdChjaGlwLCBbXSksIE9SSUdJTl9QT0lOVClcbiAgICAgICAgICAgICAgICA6IG5hbWUudG9VcHBlckNhc2UoKSA9PT0gXCJESVNQTEFZXCJcbiAgICAgICAgICAgICAgICA/IG5ldyBEaXNwbGF5KClcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQpIHJldHVybiBNb2RhbE1hbmFnZXIuYWxlcnQoXCJObyBjb21wb25lbnQgd2FzIGZvdW5kIHdpdGggdGhhdCBuYW1lLlwiKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhjb21wb25lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShjb21wb25lbnQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBwYXJzZUZsb2F0KHdpZHRoKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZS5jbGllbnRZIC0gcGFyc2VGbG9hdChoZWlnaHQpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgIH0sXG59IHNhdGlzZmllcyBNZW51TWFuYWdlckFjdGlvbjtcbiIsImltcG9ydCB7IElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSwgTE9DS0VEX0ZPUl9URVNUSU5HLCBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHR5cGUgeyBNZW51TWFuYWdlckFjdGlvbiB9IGZyb20gXCIuLi9tYW5hZ2Vycy9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNvbnN0IGlvID0ge1xuICAgIFwibmV3LWlucHV0XCI6IHtcbiAgICAgICAgbGFiZWw6IFwiTmV3IGlucHV0XCIsXG4gICAgICAgIGtleWJpbmQ6IFwiSVwiLFxuICAgICAgICBjYWxsYmFjazogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gbmV3IElucHV0KHtcbiAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGlucHV0KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKGlucHV0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBcIm5ldy1vdXRwdXRcIjoge1xuICAgICAgICBsYWJlbDogXCJOZXcgb3V0cHV0XCIsXG4gICAgICAgIGtleWJpbmQ6IFwiT1wiLFxuICAgICAgICBjYWxsYmFjazogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG91dHB1dCA9IG5ldyBPdXRwdXQoe1xuICAgICAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMob3V0cHV0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChvdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgIH0sXG59IHNhdGlzZmllcyBNZW51TWFuYWdlckFjdGlvbjtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIENPVU5URVJfR0VORVJBVE9SLCBJTl9ERUJVR19NT0RFLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZyB9IGZyb20gXCIuL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSBcIi4vcmVpZmllZC9EaXNwbGF5XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuL3JlaWZpZWQvT3V0cHV0XCI7XG5pbXBvcnQgdHlwZSB7IFJlaWZpZWQgfSBmcm9tIFwiLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IGNoaXBzIH0gZnJvbSBcIi4vcmVpZmllZC9jaGlwc1wiO1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkQ29tcG9uZW50cyA9IFNlcmlhbGl6ZWREaWFncmFtW1wiY29tcG9uZW50c1wiXVtudW1iZXJdO1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkSW5wdXQgPSBFeHRyYWN0PFNlcmlhbGl6ZWRDb21wb25lbnRzLCB7IHR5cGU6IFwiSU5QVVRcIiB9PjtcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZE91dHB1dCA9IEV4dHJhY3Q8U2VyaWFsaXplZENvbXBvbmVudHMsIHsgdHlwZTogXCJPVVRQVVRcIiB9PjtcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZENvbXBvbmVudCA9IEV4dHJhY3Q8U2VyaWFsaXplZENvbXBvbmVudHMsIHsgdHlwZTogXCJDT01QT05FTlRcIiB9PjtcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZERpc3BsYXkgPSBFeHRyYWN0PFNlcmlhbGl6ZWRDb21wb25lbnRzLCB7IHR5cGU6IFwiRElTUExBWVwiIH0+O1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkV2lyZXMgPSBTZXJpYWxpemVkRGlhZ3JhbVtcIndpcmVzXCJdO1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkV2lyZSA9IFNlcmlhbGl6ZWRXaXJlc1tudW1iZXJdO1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkRGlhZ3JhbSA9IHtcbiAgICBzZXR0aW5nczoge1xuICAgICAgICBbXCJEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZFwiXTogYm9vbGVhbjtcbiAgICB9O1xuICAgIGNvbXBvbmVudHM6IChcbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgcGVybWFuZW50OiBib29sZWFuO1xuICAgICAgICAgICAgICB0eXBlOiBcIklOUFVUXCI7XG4gICAgICAgICAgICAgIGFjdGl2YXRlZDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgaWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiT1VUUFVUXCI7XG4gICAgICAgICAgICAgIGFjdGl2YXRlZDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgaWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCI7XG4gICAgICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICAgICAgaW5wdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIG91dHB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XG4gICAgICAgICAgICAgIGNvbXBsZW1lbnRhcnk6IGJvb2xlYW47XG4gICAgICAgICAgICAgIGpvaW5zOiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiRElTUExBWVwiO1xuICAgICAgICAgICAgICBpbnB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgb3V0cHV0czogeyBpZDogbnVtYmVyOyBhY3RpdmF0ZWQ6IGJvb2xlYW4gfVtdO1xuICAgICAgICAgICAgICByYWRpeDogbnVtYmVyO1xuICAgICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAgIHk6IG51bWJlcjtcbiAgICAgICAgICAgICAgYW5nbGU6IG51bWJlcjtcbiAgICAgICAgICB9XG4gICAgKVtdO1xuICAgIHdpcmVzOiB7IGZyb206IG51bWJlcjsgdG86IG51bWJlciB9W107XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURpYWdyYW0oY29tcG9uZW50czogUmVpZmllZFtdLCB3aXJlczogV2lyaW5nW10pIHtcbiAgICBjb25zdCBpZCA9IENPVU5URVJfR0VORVJBVE9SKCk7XG5cbiAgICBjb25zdCBpZHMgPSBuZXcgTWFwPEVsZW1lbnQsIG51bWJlcj4oKTtcblxuICAgIGNvbnN0IGRhdGE6IFNlcmlhbGl6ZWREaWFncmFtID0ge1xuICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgW1wiRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRcIl06IERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkLFxuICAgICAgICB9LFxuICAgICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzLm1hcCgoY29tcG9uZW50LCByZWlmaWVkKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZHMuc2V0KGNvbXBvbmVudC5lbGVtZW50LCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQsXG4gICAgICAgICAgICAgICAgICAgIHBlcm1hbmVudDogY29tcG9uZW50LnBlcm1hbmVuY2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiSU5QVVRcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVkOiBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZHMuZ2V0KGNvbXBvbmVudC5lbGVtZW50KSEsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgaWRzLnNldChjb21wb25lbnQuZWxlbWVudCwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIk9VVFBVVFwiLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkcy5nZXQoY29tcG9uZW50LmVsZW1lbnQpISxcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb21wb25lbnQuY2hpcC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IGNvbXBvbmVudC5pbnB1dHMubWFwKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KGksIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChpKSEsIGFjdGl2YXRlZDogaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IGNvbXBvbmVudC5vdXRwdXRzLm1hcCgobykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChvLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQobykhLCBhY3RpdmF0ZWQ6IG8uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBjb21wb25lbnQuYW5nbGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZW1lbnRhcnk6IGNvbXBvbmVudC5jb21wbGVtZW50YXJ5LFxuICAgICAgICAgICAgICAgICAgICBqb2luczogY29tcG9uZW50LmpvaW5zLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpZmllZCxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBjb21wb25lbnQucGVybWFuZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJESVNQTEFZXCIsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0czogY29tcG9uZW50LmlucHV0cy5tYXAoKGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5zZXQoaSwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGlkOiBpZHMuZ2V0KGkpISwgYWN0aXZhdGVkOiBpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSB9O1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0czogY29tcG9uZW50Lm91dHB1dHMubWFwKChvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KG8sIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChvKSEsIGFjdGl2YXRlZDogby5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIHJhZGl4OiBjb21wb25lbnQucmFkaXgsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IGNvbXBvbmVudC5hbmdsZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHNlcmlhbGl6ZSBkaWFncmFtLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIFJlaWZpZWQgY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICB9KSxcbiAgICAgICAgd2lyZXM6IHdpcmVzXG4gICAgICAgICAgICAuZmlsdGVyKCh3aXJlKSA9PiAhd2lyZS5kZXN0cm95ZWQpXG4gICAgICAgICAgICAubWFwKCh3aXJlKSA9PiAoe1xuICAgICAgICAgICAgICAgIGZyb206IGlkcy5nZXQod2lyZS5mcm9tKSEsXG4gICAgICAgICAgICAgICAgdG86IGlkcy5nZXQod2lyZS50bykhLFxuICAgICAgICAgICAgfSkpLFxuICAgIH07XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSwgdW5kZWZpbmVkLCBJTl9ERUJVR19NT0RFID8gNCA6IHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRmlsZShcbiAgICBmaWxlOiBzdHJpbmcsXG4pOlxuICAgIHwgeyBlcnJvcjogc3RyaW5nOyByZXN1bHQ6IFtdIH1cbiAgICB8IHsgZXJyb3I6IHVuZGVmaW5lZDsgcmVzdWx0OiBbc2V0dGluZ3M6IFNlcmlhbGl6ZWREaWFncmFtW1wic2V0dGluZ3NcIl0sIGNvbXBvbmVudHM6IFJlaWZpZWRbXSwgd2lyZXM6IFdpcmluZ1tdXSB9IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShmaWxlKTtcblxuICAgICAgICB2YWxpZGF0ZShkYXRhKTtcblxuICAgICAgICBjb25zdCBlbGVtZW50cyA9IG5ldyBNYXA8bnVtYmVyLCBFbGVtZW50PigpO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBkYXRhLmNvbXBvbmVudHMubWFwKChyYXcpID0+IHtcbiAgICAgICAgICAgIGlmIChyYXcudHlwZSA9PT0gXCJJTlBVVFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBuZXcgSW5wdXQocmF3KTtcblxuICAgICAgICAgICAgICAgIGlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaWQsIGlucHV0LmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhdy5wZXJtYW5lbnQgPyBpbnB1dC5wZXJtYW5lbnQoKSA6IGlucHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmF3LnR5cGUgPT09IFwiT1VUUFVUXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBuZXcgT3V0cHV0KHJhdyk7XG5cbiAgICAgICAgICAgICAgICBvdXRwdXQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pZCwgb3V0cHV0LmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhdy5wZXJtYW5lbnQgPyBvdXRwdXQucGVybWFuZW50KCkgOiBvdXRwdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyYXcudHlwZSA9PT0gXCJESVNQTEFZXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNwbGF5ID0gbmV3IERpc3BsYXkocmF3LCByYXcuaW5wdXRzLmxlbmd0aCwgcmF3LnJhZGl4KS5yb3RhdGUocmF3LmFuZ2xlKTtcblxuICAgICAgICAgICAgICAgIGRpc3BsYXkuaW5wdXRzLmZvckVhY2goKGlucHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5pbnB1dHNbaW5kZXhdLmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pbnB1dHNbaW5kZXhdLmlkLCBpbnB1dCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBkaXNwbGF5Lm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcub3V0cHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3Lm91dHB1dHNbaW5kZXhdLmlkLCBvdXRwdXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhdy5wZXJtYW5lbnQgPyBkaXNwbGF5LnBlcm1hbmVudCgpIDogZGlzcGxheTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudChuZXcgKGNoaXBzLmdldChyYXcubmFtZSkhKSgpLCByYXcsIHJhdy5jb21wbGVtZW50YXJ5LCByYXcuam9pbnMpLnJvdGF0ZShcbiAgICAgICAgICAgICAgICByYXcuYW5nbGUsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLmZvckVhY2goKGlucHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmlucHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaW5wdXRzW2luZGV4XS5pZCwgaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbXBvbmVudC5vdXRwdXRzLmZvckVhY2goKG91dHB1dCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcub3V0cHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcub3V0cHV0c1tpbmRleF0uaWQsIG91dHB1dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJhdy5wZXJtYW5lbnQgPyBjb21wb25lbnQucGVybWFuZW50KCkgOiBjb21wb25lbnQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHdpcmVzID0gZGF0YS53aXJlcy5tYXAoKHsgZnJvbSwgdG8gfSkgPT4gbmV3IFdpcmluZyhlbGVtZW50cy5nZXQoZnJvbSkhLCBlbGVtZW50cy5nZXQodG8pISkpO1xuXG4gICAgICAgIHJldHVybiB7IHJlc3VsdDogW2RhdGEuc2V0dGluZ3MsIHJlaWZpZWQsIHdpcmVzXSwgZXJyb3I6IHVuZGVmaW5lZCB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIHsgZXJyb3I6IGUubWVzc2FnZSwgcmVzdWx0OiBbXSB9O1xuXG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIkZhaWxlZCB0byBwcm9jZXNzIGZpbGUuXCIsIHJlc3VsdDogW10gfTtcbiAgICB9XG59XG5cbi8vIGdpYW50IG1lc3MgdG8gbWFrZSBzdXJlIHRoZSBwcm92aWRlZCBkYXRhIG1hdGNoZXMgdGhlIGV4cGVjdGVkIHR5cGVcbmZ1bmN0aW9uIHZhbGlkYXRlKGRhdGE6IHVua25vd24pOiBhc3NlcnRzIGRhdGEgaXMgU2VyaWFsaXplZERpYWdyYW0ge1xuICAgIGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBub3QgYW4gb2JqZWN0LlwiKTtcblxuICAgIGlmICghKFwic2V0dGluZ3NcIiBpbiBkYXRhKSkgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBtaXNzaW5nIHByb2plY3Qgc2V0dGluZ3MuXCIpO1xuXG4gICAgaWYgKHR5cGVvZiBkYXRhLnNldHRpbmdzICE9PSBcIm9iamVjdFwiIHx8ICFkYXRhLnNldHRpbmdzKSB0aHJvdyBuZXcgRXJyb3IoXCJQcm9qZWN0IHNldHRpbmdzIHNob3VsZCBiZSBhbiBvYmplY3QuXCIpO1xuXG4gICAgaWYgKCEoXCJjb21wb25lbnRzXCIgaW4gZGF0YSkpIHRocm93IG5ldyBFcnJvcihcIkRhdGEgaXMgbWlzc2luZyBjb21wb25lbnRzLlwiKTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLmNvbXBvbmVudHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbm90IGFuIGFycmF5LlwiKTtcblxuICAgIGlmICghKFwid2lyZXNcIiBpbiBkYXRhKSkgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBtaXNzaW5nIHdpcmVzLlwiKTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLndpcmVzKSkgdGhyb3cgbmV3IEVycm9yKFwiV2lyZXMgZGF0YSBpcyBub3QgYW4gYXJyYXkuXCIpO1xuXG4gICAgaWYgKCEoXCJEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZFwiIGluIGRhdGEuc2V0dGluZ3MpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIHNldHRpbmcgJ0RyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkJy5cIik7XG5cbiAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBkYXRhLmNvbXBvbmVudHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgIGlmICghY29tcG9uZW50IHx8IHR5cGVvZiBjb21wb25lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIG11c3QgYW4gb2JqZWN0LlwiKTtcblxuICAgICAgICBpZiAoIShcInJlaWZpZWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyByZWlmaWVkIGlkLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5yZWlmaWVkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJSZWlmaWVkIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgIGlmICghKFwicGVybWFuZW50XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50cyBkYXRhIGlzIG1pc3NpbmcgcGVybWFuZW5jZSBzdGF0dXMuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnBlcm1hbmVudCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBwZXJtYW5lbmNlIG11c3QgYmUgYSBib29sZWFuLlwiKTtcblxuICAgICAgICBpZiAoIShcInR5cGVcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHR5cGUuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnR5cGUgIT09IFwic3RyaW5nXCIgfHwgIVtcIklOUFVUXCIsIFwiT1VUUFVUXCIsIFwiQ09NUE9ORU5UXCIsIFwiRElTUExBWVwiXS5pbmNsdWRlcyhjb21wb25lbnQudHlwZSkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbXBvbmVudCB0eXBlLlwiKTtcblxuICAgICAgICBpZiAoIShcInhcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHggY29vcmRpbmF0ZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQueCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHggY29vcmRpbmF0ZSBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICBpZiAoIShcInlcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHkgY29vcmRpbmF0ZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQueSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHkgY29vcmRpbmF0ZSBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICBzd2l0Y2ggKGNvbXBvbmVudC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiSU5QVVRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJPVVRQVVRcIjoge1xuICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gZGF0YSBpcyBtaXNzaW5nIGlkcy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSS9PIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcIkNPTVBPTkVOVFwiOiB7XG4gICAgICAgICAgICAgICAgaWYgKCEoXCJhbmdsZVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3Npbmcgcm90YXRpb24gYW5nbGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuYW5nbGUgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJvdGF0aW9uIGFuZ2xlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJjb21wbGVtZW50YXJ5XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBjb21wbGVtZW50YXJ5IG91dHB1dC5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5jb21wbGVtZW50YXJ5ICE9PSBcImJvb2xlYW5cIilcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcGxlbWVudGFyeSBvdXRwdXQgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJqb2luc1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3Npbmcgam9pbnMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuam9pbnMgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkpvaW5zIGNvdW50IG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJpbnB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgZGF0YSBpcyBtaXNzaW5nIGlucHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50LmlucHV0cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBpbnB1dHMgZGF0YSBtdXN0IGJlIGFuIGFycmF5LlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwib3V0cHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3Npbmcgb3V0cHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50Lm91dHB1dHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgb3V0cHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJuYW1lXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBjaGlwIG5hbWUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQubmFtZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiQ2hpcCBuYW1lIG11c3QgYmUgYSBzdHJpbmcuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlwcy5oYXMoY29tcG9uZW50Lm5hbWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlwIG5hbWUgZG9lc24ndCBleGlzdC5cIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBDaGlwID0gY2hpcHMuZ2V0KGNvbXBvbmVudC5uYW1lLnRyaW0oKS50b1VwcGVyQ2FzZSgpKSE7XG5cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMubGVuZ3RoICE9PVxuICAgICAgICAgICAgICAgICAgICAoY29tcG9uZW50LmpvaW5zICE9PSBDaGlwLklOUFVUUyA/IGNvbXBvbmVudC5pbnB1dHMubGVuZ3RoIDogQ2hpcC5JTlBVVFMpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgaW5wdXRzIGRvZXMgbm90IG1hdGNoIGNoaXAgaW5wdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQub3V0cHV0cy5sZW5ndGggIT09IChjb21wb25lbnQuY29tcGxlbWVudGFyeSA/IENoaXAuT1VUUFVUUyArIDEgOiBDaGlwLk9VVFBVVFMpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgb3V0cHV0cyBkb2VzIG5vdCBtYXRjaCBjaGlwIG91dHB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbnB1dCBvZiBjb21wb25lbnQuaW5wdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdXRwdXQgb2YgY29tcG9uZW50Lm91dHB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJESVNQTEFZXCI6IHtcbiAgICAgICAgICAgICAgICBpZiAoIShcImFuZ2xlXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSBkYXRhIGlzIG1pc3Npbmcgcm90YXRpb24gYW5nbGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuYW5nbGUgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJvdGF0aW9uIGFuZ2xlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJyYWRpeFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgZGF0YSBpcyBtaXNzaW5nIGRpc3BsYXkgcmFkaXguXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQucmFkaXggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgcmFkaXggbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcImlucHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgZGF0YSBpcyBtaXNzaW5nIGlucHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50LmlucHV0cykpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgaW5wdXRzIGRhdGEgbXVzdCBiZSBhbiBhcnJheS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcIm91dHB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJEaXNwbGF5IGRhdGEgaXMgbWlzc2luZyBvdXRwdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnQub3V0cHV0cykpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgb3V0cHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbnB1dCBvZiBjb21wb25lbnQuaW5wdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdXRwdXQgb2YgY29tcG9uZW50Lm91dHB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpZHMgPSBkYXRhLmNvbXBvbmVudHMuZmxhdE1hcDxudW1iZXI+KChjb21wb25lbnQpID0+XG4gICAgICAgIGNvbXBvbmVudC50eXBlID09PSBcIkNPTVBPTkVOVFwiIHx8IGNvbXBvbmVudC50eXBlID09PSBcIkRJU1BMQVlcIlxuICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQuaW5wdXRzLm1hcCgoeyBpZCB9OiB7IGlkOiBudW1iZXIgfSkgPT4gaWQpLFxuICAgICAgICAgICAgICAgICAgLi4uY29tcG9uZW50Lm91dHB1dHMubWFwKCh7IGlkIH06IHsgaWQ6IG51bWJlciB9KSA9PiBpZCksXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIDogY29tcG9uZW50LmlkLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHdpcmUgb2YgZGF0YS53aXJlcyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCF3aXJlIHx8IHR5cGVvZiB3aXJlICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgbXVzdCBiZSBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwiZnJvbVwiIGluIHdpcmUpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgaXMgbWlzc2luZyB0aGUgY29tcG9uZW50IGl0IHN0YXJ0cyBmcm9tLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUuZnJvbSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIG11c3QgcmVmZXJlbmNlIG51bWVyaWMgaWRzLlwiKTtcblxuICAgICAgICBpZiAoIShcInRvXCIgaW4gd2lyZSkpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBpcyBtaXNzaW5nIHRoZSB0YXJnZXQgY29tcG9uZW50LlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUudG8gIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBtdXN0IHJlZmVyZW5jZSBudW1lcmljIGlkcy5cIik7XG5cbiAgICAgICAgaWYgKCFpZHMuaW5jbHVkZXMod2lyZS5mcm9tKSB8fCAhaWRzLmluY2x1ZGVzKHdpcmUudG8pKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgcmVmZXJlbmNlcyBpbnZhbGlkIGlkcy5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgR0VUX0JBQ0tHUk9VTkRfQ0FOVkFTX0NUWCwgR0VUX0ZPUkVHUk9VTkRfQ0FOVkFTX0NUWCwgTk9fUkVOREVSSU5HIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgY2xhc3MgQ2FudmFzTWFuYWdlciB7XG4gICAgc3RhdGljICNqb2JzID0gbmV3IFNldDwoY3R4OiB7IGJnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7IGZnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyAjckFGID0gLTE7XG5cbiAgICBzdGF0aWMgI3JlbmRlcigpIHtcbiAgICAgICAgaWYgKE5PX1JFTkRFUklORykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGJnID0gR0VUX0JBQ0tHUk9VTkRfQ0FOVkFTX0NUWCgpO1xuICAgICAgICBjb25zdCBmZyA9IEdFVF9GT1JFR1JPVU5EX0NBTlZBU19DVFgoKTtcblxuICAgICAgICBiZy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgYmcuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICBmZy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgZmcuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICB0aGlzLiNqb2JzLmZvckVhY2goKGpvYikgPT4ge1xuICAgICAgICAgICAgam9iLmNhbGwodW5kZWZpbmVkLCB7IGJnLCBmZyB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0YXJ0KCkge1xuICAgICAgICBpZiAoTk9fUkVOREVSSU5HKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy4jcmVuZGVyKCk7XG5cbiAgICAgICAgY29uc3QgaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5zdGFydC5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLiNyQUYgPSBpZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgaWYgKE5PX1JFTkRFUklORykgcmV0dXJuO1xuXG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuI3JBRik7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZEpvYihqb2I6IChjdHg6IHsgYmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDsgZmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9KSA9PiB2b2lkKSB7XG4gICAgICAgIGlmIChOT19SRU5ERVJJTkcpIHJldHVybjtcblxuICAgICAgICB0aGlzLiNqb2JzLmFkZChqb2IpO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWxldGVKb2Ioam9iOiAoY3R4OiB7IGJnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7IGZnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSkgPT4gdm9pZCkge1xuICAgICAgICBpZiAoTk9fUkVOREVSSU5HKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy4jam9icy5kZWxldGUoam9iKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuL1N0b3JhZ2VNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXJrbW9kZU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSAjY2hhbmdlcyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjZGFya21vZGVLZXkgPSBcInNldHRpbmdzLmRhcmttb2RlXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5ICNkYXJrbW9kZU1vZGFsc0tleSA9IFwic2V0dGluZ3MuZGFya21vZGVNb2RhbHNcIjtcblxuICAgIHN0YXRpYyBnZXQgZGFya21vZGVFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gU3RvcmFnZU1hbmFnZXIuZ2V0KHRoaXMuI2Rhcmttb2RlS2V5KSA/PyBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0IGRhcmttb2RlRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQodGhpcy4jZGFya21vZGVLZXksIHZhbHVlKTtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LmlubmVyVGV4dCA9IHZhbHVlID8gXCLwn4yVXCIgOiBcIvCfjJFcIjtcblxuICAgICAgICB0aGlzLiNjaGFuZ2VzLmZvckVhY2goKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwiZGFya21vZGVcIiwgdmFsdWUpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgZGFya21vZGVNb2RhbHNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gU3RvcmFnZU1hbmFnZXIuZ2V0KHRoaXMuI2Rhcmttb2RlTW9kYWxzS2V5KSA/PyBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0IGRhcmttb2RlTW9kYWxzRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQodGhpcy4jZGFya21vZGVNb2RhbHNLZXksIHZhbHVlKTtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LmlubmVyVGV4dCA9IHZhbHVlID8gXCLwn4yVXCIgOiBcIvCfjJFcIjtcblxuICAgICAgICB0aGlzLiNjaGFuZ2VzLmZvckVhY2goKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwiZGFya21vZGUtbW9kYWxzXCIsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0ICNlbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCJidXR0b24uZGFya21vZGVcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbkNoYW5nZShydW46ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jY2hhbmdlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmQ2hhbmdlKHJ1bjogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNjaGFuZ2VzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyAjbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGFya21vZGVFbmFibGVkID0gIXRoaXMuZGFya21vZGVFbmFibGVkO1xuXG4gICAgICAgIGNvbnN0IGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcImJ1dHRvbi50b29scywgYnV0dG9uLnNldHRpbmdzLCBidXR0b24uZGFya21vZGVcIik7XG5cbiAgICAgICAgYnV0dG9ucy5mb3JFYWNoKChiKSA9PiB7XG4gICAgICAgICAgICBiLnN0eWxlLnRyYW5zaXRpb24gPSBcIm5vbmVcIjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIGJ1dHRvbnMuZm9yRWFjaCgoYikgPT4ge1xuICAgICAgICAgICAgICAgIGIuc3R5bGUudHJhbnNpdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIC8vIHRyaWdnZXIgc2V0dGVycyB0byBzZXQgdXAgaW5pdGlhbCBzdGF0ZVxuICAgICAgICB0aGlzLmRhcmttb2RlRW5hYmxlZCA9IHRoaXMuZGFya21vZGVFbmFibGVkO1xuICAgICAgICB0aGlzLmRhcmttb2RlTW9kYWxzRW5hYmxlZCA9IHRoaXMuZGFya21vZGVNb2RhbHNFbmFibGVkO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy5kYXJrbW9kZUVuYWJsZWQgPyBcIvCfjJVcIiA6IFwi8J+MkVwiO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2xpc3RlbmVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jbGlzdGVuZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyB0b2dnbGVEYXJrbW9kZSh2YWx1ZT86IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5kYXJrbW9kZUVuYWJsZWQgPSB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiID8gdmFsdWUgOiAhdGhpcy5kYXJrbW9kZUVuYWJsZWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIHRvZ2dsZURhcmttb2RlTW9kYWxzKHZhbHVlPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmRhcmttb2RlTW9kYWxzRW5hYmxlZCA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIgPyB2YWx1ZSA6ICF0aGlzLmRhcmttb2RlTW9kYWxzRW5hYmxlZDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY2lyY3VsYXJcIjtcbmltcG9ydCB7IEVWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SLCBFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1IsIEdFVF9BQ1RJVkFURURfQ09MT1IsIEdSSURfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IHF1aWNrcGlja0NvbXBvbmVudHMgfSBmcm9tIFwiLi4vcXVpY2twaWNrcy9jb21wb25lbnRzXCI7XG5pbXBvcnQgeyBxdWlja3BpY2tHYXRlcyB9IGZyb20gXCIuLi9xdWlja3BpY2tzL2dhdGVzXCI7XG5pbXBvcnQgeyBSZWlmaWVkLCBjb21wdXRlVHJhbnNmb3JtT3JpZ2luIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHsgQ2FudmFzTWFuYWdlciB9IGZyb20gXCIuL0NhbnZhc01hbmFnZXJcIjtcbmltcG9ydCB7IERhcmttb2RlTWFuYWdlciB9IGZyb20gXCIuL0Rhcmttb2RlTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4vS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBEcmFnZ2luZ01hbmFnZXIge1xuICAgIHN0YXRpYyAjZHJhZ2dlZDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3dhdGNoZWQgPSBuZXcgTWFwKCk7XG5cbiAgICBzdGF0aWMgI21vdXNlID0geyB4OiAtMSwgeTogLTEsIG94OiAtMSwgb3k6IC0xLCBpeDogLTEsIGl5OiAtMSwgZG93bjogZmFsc2UgfTtcblxuICAgIHN0YXRpYyAjdG9wbGVmdDogRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjb3JpZ2luYWw6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjZG93bnBvcyA9IHsgeDogLTEsIHk6IC0xIH07XG5cbiAgICBzdGF0aWMgI3Bvc2l0aW9uczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9W10gfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgI3NuYXBUb0dyaWQgPSBmYWxzZTtcblxuICAgIHN0YXRpYyBnZXQgc25hcFRvR3JpZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NuYXBUb0dyaWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldCBzbmFwVG9HcmlkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuI3NuYXBUb0dyaWQgPSB2YWx1ZTtcblxuICAgICAgICB0aGlzLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBzbmFwVG9HcmlkQmFzZWRVcGRhdGUoXG4gICAgICAgIHsgZm9yY2VDbGVhciA9IGZhbHNlLCBvbmx5VXBkYXRlQ29sb3IgPSBmYWxzZSB9OiB7IGZvcmNlQ2xlYXI/OiBib29sZWFuOyBvbmx5VXBkYXRlQ29sb3I/OiBib29sZWFuIH0gPSB7XG4gICAgICAgICAgICBmb3JjZUNsZWFyOiBmYWxzZSxcbiAgICAgICAgICAgIG9ubHlVcGRhdGVDb2xvcjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgKSB7XG4gICAgICAgIGlmICh0aGlzLnNuYXBUb0dyaWQgJiYgIWZvcmNlQ2xlYXIpIHtcbiAgICAgICAgICAgIGlmICghb25seVVwZGF0ZUNvbG9yKVxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubWluV2lkdGggPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubWluSGVpZ2h0ID0gXCJcIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoY29tcG9uZW50LmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcCA9IHBhcnNlRmxvYXQoc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0ID0gcGFyc2VGbG9hdChzdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IHBhcnNlRmxvYXQoc3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHBhcnNlRmxvYXQoc3R5bGUuaGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogTWF0aC5mbG9vcihsZWZ0IC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5mbG9vcih0b3AgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubWluV2lkdGggPSBNYXRoLmNlaWwod2lkdGggLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLm1pbkhlaWdodCA9IE1hdGguY2VpbChoZWlnaHQgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRTaXplID0gR1JJRF9TSVpFICsgXCJweCBcIiArIEdSSURfU0laRSArIFwicHhcIjtcblxuICAgICAgICAgICAgaWYgKERhcmttb2RlTWFuYWdlci5kYXJrbW9kZUVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICR7RVZFTl9EQVJLRVJfR1JBWV9DU1NfQ09MT1J9IDFweCwgdHJhbnNwYXJlbnQgMXB4KSwgbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgJHtFVkVOX0RBUktFUl9HUkFZX0NTU19DT0xPUn0gMXB4LCB0cmFuc3BhcmVudCAxcHgpYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAke0VWRU5fTElHSFRFUl9HUkFZX0NTU19DT0xPUn0gMXB4LCB0cmFuc3BhcmVudCAxcHgpLCBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCAke0VWRU5fTElHSFRFUl9HUkFZX0NTU19DT0xPUn0gMXB4LCB0cmFuc3BhcmVudCAxcHgpYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLm1pbldpZHRoID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubWluSGVpZ2h0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJcIjtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgd2F0Y2goZWxlbWVudDogSFRNTEVsZW1lbnQsIHRhcmdldCA9IGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LndhdGNoZWQgPSBcInRydWVcIjtcblxuICAgICAgICBjb25zdCBtb3VzZWRvd24gPSAoZTogeyBjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlciB9KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNkcmFnZ2VkID0gZWxlbWVudDtcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5kYXRhc2V0LmRyYWdnZWQgPSBcInRydWVcIjtcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5jdXJzb3IgPSBcImdyYWJiaW5nXCI7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLiNkcmFnZ2VkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2UuaXggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZS5peSA9IGUuY2xpZW50WTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICFTZWxlY3Rpb25NYW5hZ2VyLmlzU2VsZWN0ZWQoZWxlbWVudCkgJiZcbiAgICAgICAgICAgICAgICAhKFxuICAgICAgICAgICAgICAgICAgICAoSVNfTUFDX09TICYmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiTWV0YUxlZnRcIikgfHwgS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIk1ldGFSaWdodFwiKSkpIHx8XG4gICAgICAgICAgICAgICAgICAgICghSVNfTUFDX09TICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIkNvbnRyb2xMZWZ0XCIpIHx8IEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJDb250cm9sUmlnaHRcIikpKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm94ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm95ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IFsuLi5TZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkXS5tYXAoKHRhcmdldCkgPT4gdGFyZ2V0LnBvcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzdG9yZSBtb3N0IHRvcCBsZWZ0IGVsZW1lbnQgYXMgYW4gYW5jaG9yIGZvciB0aGUgb3RoZXJzXG4gICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IFsuLi5TZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkXS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF4ID0gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF5ID0gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnggPSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnkgPSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZCA9IE1hdGguc3FydChheCAqIGF4ICsgYXkgKiBheSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJkID0gTWF0aC5zcXJ0KGJ4ICogYnggKyBieSAqIGJ5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFkIC0gYmQ7XG4gICAgICAgICAgICAgICAgfSlbMF0uZWxlbWVudDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHRvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veCA9IGUuY2xpZW50WCAtIGJvdW5kcy54O1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm95ID0gZS5jbGllbnRZIC0gYm91bmRzLnk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiN0b3BsZWZ0ID0gdG9wbGVmdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4jb3JpZ2luYWwgPSB7IHg6IHJlY3QubGVmdCwgeTogcmVjdC50b3AgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCB0b3VjaHN0YXJ0ID0gKGU6IFRvdWNoRXZlbnQpID0+IG1vdXNlZG93bihlLnRvdWNoZXNbMF0pO1xuXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlZG93biwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdG91Y2hzdGFydCwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuXG4gICAgICAgIHRoaXMuI3dhdGNoZWQuc2V0KHRhcmdldCwgeyBtb3VzZWRvd24sIHRvdWNoc3RhcnQgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGZvcmdldChlbGVtZW50OiBIVE1MRWxlbWVudCwgZm9yY2U/OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy4jd2F0Y2hlZC5nZXQoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKCFsaXN0ZW5lciAmJiAhZm9yY2UpIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBpcyBub3QgY3VycmVudGx5IGJlaW5nIHdhdGNoZWQuYCk7XG5cbiAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBkZWxldGUgZWxlbWVudC5kYXRhc2V0LndhdGNoZWQ7XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBsaXN0ZW5lci5tb3VzZWRvd24sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgbGlzdGVuZXIudG91Y2hzdGFydCwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICB0aGlzLiN3YXRjaGVkLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy4jd2F0Y2hlZC5mb3JFYWNoKChfLCBlbGVtZW50KSA9PiB0aGlzLmZvcmdldChlbGVtZW50KSk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UgPSB7IHg6IC0xLCB5OiAtMSwgb3g6IC0xLCBveTogLTEsIGl4OiAtMSwgaXk6IC0xLCBkb3duOiBmYWxzZSB9O1xuXG4gICAgICAgIHRoaXMuI2Rvd25wb3MgPSB7IHg6IC0xLCB5OiAtMSB9O1xuXG4gICAgICAgIHRoaXMuI3RvcGxlZnQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNvcmlnaW5hbCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNwb3NpdGlvbnMgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy5kZWFmZW4oKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVuZGVyKHsgZmcgfTogeyBmZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueCAhPT0gLTEgJiZcbiAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLnkgIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueCAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55ICE9PSAtMVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGZnLnN0cm9rZVN0eWxlID0gR0VUX0FDVElWQVRFRF9DT0xPUigpO1xuXG4gICAgICAgICAgICBmZy5saW5lV2lkdGggPSAyLjU7XG5cbiAgICAgICAgICAgIGZnLmxpbmVKb2luID0gXCJtaXRlclwiO1xuXG4gICAgICAgICAgICBmZy5zdHJva2VSZWN0KFxuICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLngsXG4gICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueSxcbiAgICAgICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueCAtIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLngsXG4gICAgICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnkgLSBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy55LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIHRoaXMuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCk7XG5cbiAgICAgICAgQ2FudmFzTWFuYWdlci5hZGRKb2IodGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuI21vdXNlbW92ZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMuI3RvdWNobW92ZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy4jdG91Y2hzdGFydCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuI3RvdWNoZW5kKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVhZmVuKCkge1xuICAgICAgICB0aGlzLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSh7IGZvcmNlQ2xlYXI6IHRydWUgfSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuI21vdXNlbW92ZSk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMuI3RvdWNobW92ZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy4jdG91Y2hzdGFydCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuI3RvdWNoZW5kKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlbW92ZSA9IChlOiB7IGNsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyIH0pID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICBpZiAodGhpcy4jZHJhZ2dlZCkge1xuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRoaXMuI2RyYWdnZWQpO1xuXG4gICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5sZWZ0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLnRvcCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IHRoaXMuI3RvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQubGVmdCAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldC50b3AgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLmxlZnQgPSB0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3ggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUudG9wID0gdGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy4jdG9wbGVmdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gdGhpcy4jdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3ggKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kgKyBvZmZzZXQudG9wIC0gdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IG0gPSBlIGluc3RhbmNlb2YgTW91c2VFdmVudCA/IGUgOiBlLnRvdWNoZXNbMF07XG5cbiAgICAgICAgdGhpcy4jbW91c2UueCA9IG0uY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IG0uY2xpZW50WTtcblxuICAgICAgICB0aGlzLiNtb3VzZS5peCA9IG0uY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UuaXkgPSBtLmNsaWVudFk7XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcblxuICAgICAgICBjb25zdCBpc09uSW52YWxpZFRhcmdldCA9IFtcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLWlucHV0XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJidXR0b24uYm9hcmQtb3V0cHV0XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJkaXYuY29tcG9uZW50XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJkaXYuZGlzcGxheVwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbnRleHRtZW51XCIpLFxuICAgICAgICBdLmZpbmQoKGVsZW1lbnQpID0+IGVsZW1lbnQgIT09IG51bGwpITtcblxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghaXNPbkludmFsaWRUYXJnZXQgJiYgZS5idXR0b24gPT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleUFcIikgJiYgS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVNcIikpIHtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJLZXlBXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1aWNrcGlja0dhdGVzKGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcXVpY2twaWNrQ29tcG9uZW50cyhlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggPSBtLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2Rvd25wb3MueSA9IG0uY2xpZW50WTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWlzT25JbnZhbGlkVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy4jZG93bnBvcy54ID0gbS5jbGllbnRYO1xuICAgICAgICAgICAgICAgIHRoaXMuI2Rvd25wb3MueSA9IG0uY2xpZW50WTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI21vdXNlLmRvd24gPSB0cnVlO1xuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNldXAgPSAoZTogeyBjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlciB9KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgaWYgKHRoaXMuI2RyYWdnZWQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kcmFnZ2VkPVwidHJ1ZVwiXScpLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgZS5kYXRhc2V0LmRyYWdnZWQ7XG5cbiAgICAgICAgICAgICAgICBlLnN0eWxlLmN1cnNvciA9IFwiXCI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy4jZHJhZ2dlZDtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuI21vdXNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsID0gdGhpcy4jb3JpZ2luYWwhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSBHUklEX1NJWkU7XG5cbiAgICAgICAgICAgICAgICBpZiAobW91c2UueCAhPT0gbW91c2UuaXggfHwgbW91c2UueSAhPT0gbW91c2UuaXkpXG4gICAgICAgICAgICAgICAgICAgIGlmIChEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZClcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4odGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IE1hdGguZmxvb3IoKG1vdXNlLnggLSBtb3VzZS5veCAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gTWF0aC5mbG9vcigobW91c2UueSAtIG1vdXNlLm95IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBNYXRoLmZsb29yKChvcmlnaW5hbC54IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBNYXRoLmZsb29yKChvcmlnaW5hbC55IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4odGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IG1vdXNlLnggLSBtb3VzZS5veCAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBtb3VzZS55IC0gbW91c2Uub3kgLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbih0YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5sZWZ0ID0gb3JpZ2luYWwueCAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBvcmlnaW5hbC55IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy4jdG9wbGVmdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vdXNlID0gdGhpcy4jbW91c2U7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0cyA9IFsuLi5TZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkXTtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSB0aGlzLiNwb3NpdGlvbnMhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSB0aGlzLiN0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSBHUklEX1NJWkU7XG5cbiAgICAgICAgICAgICAgICBpZiAobW91c2UueCAhPT0gbW91c2UuaXggfHwgbW91c2UueSAhPT0gbW91c2UuaXkpXG4gICAgICAgICAgICAgICAgICAgIGlmIChEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZClcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogTWF0aC5mbG9vcigobW91c2UueCAtIG1vdXNlLm94KSAvIHNpemUpICogc2l6ZSArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IE1hdGguZmxvb3IoKG1vdXNlLnkgLSBtb3VzZS5veSkgLyBzaXplKSAqIHNpemUgKyBvZmZzZXQudG9wIC0gdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZShwb3NpdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBtb3VzZS54IC0gbW91c2Uub3ggKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBtb3VzZS55IC0gbW91c2Uub3kgKyBvZmZzZXQudG9wIC0gdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZShwb3NpdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuI2Rvd25wb3MueCAhPT0gLTEgJiZcbiAgICAgICAgICAgIHRoaXMuI2Rvd25wb3MueSAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS54ICE9PSAtMSAmJlxuICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnkgIT09IC0xXG4gICAgICAgIClcbiAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0QWxsSW4oRHJhZ2dpbmdNYW5hZ2VyLiNkb3ducG9zLCBNb3VzZU1hbmFnZXIubW91c2UpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlID0geyB4OiAtMSwgeTogLTEsIG94OiAtMSwgb3k6IC0xLCBpeDogLTEsIGl5OiAtMSwgZG93bjogZmFsc2UgfTtcblxuICAgICAgICB0aGlzLiNkb3ducG9zID0geyB4OiAtMSwgeTogLTEgfTtcblxuICAgICAgICB0aGlzLiN0b3BsZWZ0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI2RyYWdnZWQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jb3JpZ2luYWwgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jcG9zaXRpb25zID0gdW5kZWZpbmVkO1xuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3RvdWNobW92ZSA9IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLiNtb3VzZW1vdmUoZS50b3VjaGVzWzBdKTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjdG91Y2hzdGFydCA9IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLiNtb3VzZWRvd24oZSk7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3RvdWNoZW5kID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuI21vdXNldXAoZS50b3VjaGVzWzBdKTtcblxuICAgIHN0YXRpYyBnZXQgZG93bnBvcygpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy4jZG93bnBvcyB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jaXJjdWxhclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgS2V5YmluZHNNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2tleW1hcCA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xuXG4gICAgc3RhdGljICNrZXljaG9yZHMgPSBuZXcgQXJyYXk8W3N0cmluZywgKChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKVtdXT4oKTtcblxuICAgIHN0YXRpYyAja2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5zZXQoZS5jb2RlLCB0cnVlKTtcblxuICAgICAgICBpZiAoZS5tZXRhS2V5ICYmIChlLmNvZGUgPT09IFwiU2hpZnRMZWZ0XCIgfHwgZS5jb2RlID09PSBcIlNoaWZ0UmlnaHRcIikgJiYgSVNfTUFDX09TKVxuICAgICAgICAgICAgdGhpcy4ja2V5bWFwID0gbmV3IE1hcChbLi4udGhpcy4ja2V5bWFwLmVudHJpZXMoKV0uZmlsdGVyKChba2V5XSkgPT4gIWtleS5zdGFydHNXaXRoKFwiS2V5XCIpKSk7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGNvbnN0IFtjaG9yZCwgcnVuc10gPVxuICAgICAgICAgICAgICAgIHRoaXMuI2tleWNob3Jkcy5maW5kKChbY2hvcmRdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBrZXlzID0gY2hvcmQuc3BsaXQoXCIrXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrU2hpZnQgPSBrZXlzLmluY2x1ZGVzKFwiU2hpZnRMZWZ0XCIpIHx8IGtleXMuaW5jbHVkZXMoXCJTaGlmdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja0N0cmwgPSBrZXlzLmluY2x1ZGVzKFwiQ29udHJvbExlZnRcIikgfHwga2V5cy5pbmNsdWRlcyhcIkNvbnRyb2xSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tBbHQgPSBrZXlzLmluY2x1ZGVzKFwiQWx0TGVmdFwiKSB8fCBrZXlzLmluY2x1ZGVzKFwiQWx0UmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrTWV0YSA9IGtleXMuaW5jbHVkZXMoXCJNZXRhTGVmdFwiKSB8fCBrZXlzLmluY2x1ZGVzKFwiTWV0YVJpZ2h0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tTaGlmdCAmJiBlLnNoaWZ0S2V5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tDdHJsICYmIGUuY3RybEtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrQWx0ICYmIGUuYWx0S2V5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tNZXRhICYmIGUubWV0YUtleSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja1NoaWZ0KSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIlNoaWZ0TGVmdFwiICYmIGtleSAhPT0gXCJTaGlmdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tDdHJsKSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIkNvbnRyb2xMZWZ0XCIgJiYga2V5ICE9PSBcIkNvbnRyb2xSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrQWx0KSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIkFsdExlZnRcIiAmJiBrZXkgIT09IFwiQWx0UmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja01ldGEpIGtleXMgPSBrZXlzLmZpbHRlcigoa2V5KSA9PiBrZXkgIT09IFwiTWV0YUxlZnRcIiAmJiBrZXkgIT09IFwiTWV0YVJpZ2h0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tTaGlmdCA/IGUuc2hpZnRLZXkgOiB0cnVlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrQ3RybCA/IGUuY3RybEtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tBbHQgPyBlLmFsdEtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tNZXRhID8gZS5tZXRhS2V5IDogdHJ1ZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXMuZXZlcnkoKGtleSkgPT4gdGhpcy4ja2V5bWFwLmdldChrZXkpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pID8/IFtdO1xuXG4gICAgICAgICAgICBpZiAocnVucykge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmtpbGxNZW51KCk7XG5cbiAgICAgICAgICAgICAgICBydW5zLmZvckVhY2goKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBlKSk7XG5cbiAgICAgICAgICAgICAgICBjaG9yZCEuc3BsaXQoXCIrXCIpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJLZXlcIikpIHRoaXMuI2tleW1hcC5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgI2tleXVwID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmRlbGV0ZShlLmNvZGUpO1xuXG4gICAgICAgIGlmICghZS5tZXRhS2V5ICYmIChlLmNvZGUgPT09IFwiTWV0YUxlZnRcIiB8fCBlLmNvZGUgPT09IFwiTWV0YVJpZ2h0XCIpICYmIElTX01BQ19PUykgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjYmx1ciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuI2tleWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy4ja2V5dXApO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLiNibHVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVhZmVuKCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLiNrZXlkb3duKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuI2tleXVwKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy4jYmx1cik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uS2V5Q2hvcmQoY2hvcmQ6IHN0cmluZywgcnVuOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICBjaG9yZCA9IGNob3JkLnNwbGl0KFwiK1wiKS5zb3J0KCkuam9pbihcIitcIik7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNrZXljaG9yZHMuZmluZCgoW2tleV0pID0+IGtleSA9PT0gY2hvcmQpPy5bMV0ucHVzaChydW4pKSB0aGlzLiNrZXljaG9yZHMucHVzaChbY2hvcmQsIFtydW5dXSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bkFuZE5vRm9jdXMoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy4ja2V5bWFwLmdldChrZXkpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bihrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gISF0aGlzLiNrZXltYXAuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLiNrZXltYXAuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLiNrZXljaG9yZHMgPSBbXTtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBleHBhbmQ8UyBleHRlbmRzIHN0cmluZz4oY2hvcmQ6IFMpOiBFeHBhbmRDaG9yZDxTPltdO1xuICAgIHN0YXRpYyBleHBhbmQoY2hvcmQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBba2V5LCAuLi5yZXN0XSA9IGNob3JkLnNwbGl0KFwiK1wiKTtcblxuICAgICAgICBpZiAoa2V5ID09PSBcIlNoaWZ0XCIgfHwga2V5ID09PSBcIkNvbnRyb2xcIiB8fCBrZXkgPT09IFwiQWx0XCIgfHwga2V5ID09PSBcIk1ldGFcIilcbiAgICAgICAgICAgIHJldHVybiByZXN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgID8gdGhpcy5leHBhbmQocmVzdC5qb2luKFwiK1wiKSkuZmxhdE1hcCgoa2V5cykgPT4gW1xuICAgICAgICAgICAgICAgICAgICAgIFtgJHtrZXl9TGVmdGAsIGtleXNdLmpvaW4oXCIrXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIFtgJHtrZXl9UmlnaHRgLCBrZXlzXS5qb2luKFwiK1wiKSxcbiAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgOiBbYCR7a2V5fUxlZnRgLCBgJHtrZXl9UmlnaHRgXTtcblxuICAgICAgICBpZiAoa2V5Lmxlbmd0aCA9PT0gMSAmJiBrZXkgPT09IGtleS50b1VwcGVyQ2FzZSgpKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3QubGVuZ3RoXG4gICAgICAgICAgICAgICAgPyB0aGlzLmV4cGFuZChyZXN0LmpvaW4oXCIrXCIpKS5mbGF0TWFwKChrZXlzKSA9PiBbW2BLZXkke2tleX1gLCBrZXlzXS5qb2luKFwiK1wiKV0pXG4gICAgICAgICAgICAgICAgOiBbYEtleSR7a2V5fWBdO1xuXG4gICAgICAgIHJldHVybiBbY2hvcmRdO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3NpZ248UyBleHRlbmRzIHN0cmluZywgUiBleHRlbmRzIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPihjaG9yZDogUywgcnVuOiBSKTogQXNzaWduQ2hvcmQ8UywgUj47XG4gICAgc3RhdGljIGFzc2lnbihjaG9yZDogc3RyaW5nLCBydW46IChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChjaG9yZClcbiAgICAgICAgICAgICAgICAubWFwPFtTdHJpbmdpZmlhYmxlLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZF0+KChrZXlzKSA9PiBba2V5cywgcnVuXSlcbiAgICAgICAgICAgICAgICAuY29uY2F0KFtbY2hvcmQsIHJ1bl1dKSxcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbnR5cGUgU3BsaXQ8UyBleHRlbmRzIHN0cmluZywgRCBleHRlbmRzIHN0cmluZyA9IFwiXCIsIFIgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gPSBbXT4gPSBTIGV4dGVuZHMgXCJcIlxuICAgID8gUlxuICAgIDogUyBleHRlbmRzIGAke2luZmVyIEF9JHtEfSR7aW5mZXIgQn1gXG4gICAgPyBTcGxpdDxCLCBELCBbLi4uUiwgQV0+XG4gICAgOiBbLi4uUiwgU107XG5cbnR5cGUgU3RyaW5naWZpYWJsZSA9IHN0cmluZyB8IG51bWJlciB8IGJpZ2ludCB8IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG50eXBlIEpvaW48QSwgUyBleHRlbmRzIHN0cmluZyA9IFwiXCIsIFIgZXh0ZW5kcyBzdHJpbmcgPSBcIlwiPiA9IEEgZXh0ZW5kcyBbaW5mZXIgWCBleHRlbmRzIFN0cmluZ2lmaWFibGUsIC4uLmluZmVyIFldXG4gICAgPyBKb2luPFksIFMsIFIgZXh0ZW5kcyBcIlwiID8gWCA6IGAke1J9JHtTfSR7WH1gPlxuICAgIDogUjtcblxudHlwZSBFeHBhbmRDaG9yZDxTIGV4dGVuZHMgc3RyaW5nLCBBIGV4dGVuZHMgc3RyaW5nW10gPSBTcGxpdDxTLCBcIitcIj4+ID0gSm9pbjxcbiAgICB7XG4gICAgICAgIFtLIGluIGtleW9mIEFdOiBBW0tdIGV4dGVuZHMgXCJTaGlmdFwiIHwgXCJDb250cm9sXCIgfCBcIkFsdFwiIHwgXCJNZXRhXCJcbiAgICAgICAgICAgID8gYCR7QVtLXX0ke1wiTGVmdFwiIHwgXCJSaWdodFwifWBcbiAgICAgICAgICAgIDogU3BsaXQ8QVtLXT5bXCJsZW5ndGhcIl0gZXh0ZW5kcyAxXG4gICAgICAgICAgICA/IEFbS10gZXh0ZW5kcyBVcHBlcmNhc2U8QVtLXT5cbiAgICAgICAgICAgICAgICA/IGBLZXkke0FbS119YFxuICAgICAgICAgICAgICAgIDogQVtLXVxuICAgICAgICAgICAgOiBBW0tdO1xuICAgIH0sXG4gICAgXCIrXCJcbj47XG5cbnR5cGUgQXNzaWduQ2hvcmQ8UyBleHRlbmRzIHN0cmluZywgUj4gPSB7XG4gICAgW18gaW4gU106IFI7XG59ICYge1xuICAgIFtLIGluIEV4cGFuZENob3JkPFM+ICYgUHJvcGVydHlLZXldOiBSO1xufTtcbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQ29udGV4dCA9IHtcbiAgICBtZW51OiBIVE1MRWxlbWVudDtcbiAgICBjbGlja3M6IE1hcDxzdHJpbmcsICgpID0+IHZvaWQ+O1xuICAgIGxpc3RlbmVyczoge1xuICAgICAgICBtb3VzZWRvd246IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgICAgICBjb250ZXh0bWVudTogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgICAgIGNsaWNrOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICB9O1xufTtcblxuZXhwb3J0IHR5cGUgTWVudU1hbmFnZXJBY3Rpb25zID0gQXJyYXk8XG4gICAgUmVjb3JkPHN0cmluZywgeyBsYWJlbDogc3RyaW5nOyBrZXliaW5kPzogc3RyaW5nOyBzdG9wUHJvcGFnYXRpb24/OiBib29sZWFuOyBjYWxsYmFjazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQgfT5cbj47XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQWN0aW9uID0gTWVudU1hbmFnZXJBY3Rpb25zW251bWJlcl07XG5cbmV4cG9ydCBjbGFzcyBNZW51TWFuYWdlciB7XG4gICAgc3RhdGljIHJlYWRvbmx5ICNlbGVtZW50cyA9IG5ldyBNYXA8SFRNTEVsZW1lbnQsIE1lbnVNYW5hZ2VyQ29udGV4dD4oKTtcblxuICAgIHN0YXRpYyAjb3BlbmVkOiBNb3VzZUV2ZW50O1xuXG4gICAgc3RhdGljIHVzZShcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgIGFjdGlvbnM6IE1lbnVNYW5hZ2VyQWN0aW9ucyxcbiAgICApOiBbcXVldWVOZXdDb250ZXh0OiAobmV3Q29udGV4dDogKHByZXY6IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4gTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB2b2lkLCBraWxsTWVudTogKCkgPT4gdm9pZF0ge1xuICAgICAgICBjb25zdCBtZW51ID0gaHRtbGA8ZGl2IGNsYXNzPVwiY29udGV4dG1lbnVcIj48L2Rpdj5gO1xuXG4gICAgICAgIGNvbnN0IGNsaWNrcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICBjb25zdCBzZXR1cCA9IChhY3Rpb25zOiBNZW51TWFuYWdlckFjdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGNsaWNrcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gYWN0aW9ucy5mbGF0TWFwKChyZWNvcmQpID0+IE9iamVjdC5rZXlzKHJlY29yZCkpO1xuXG4gICAgICAgICAgICBpZiAoa2V5cy5sZW5ndGggIT09IG5ldyBTZXQoa2V5cykuc2l6ZSkgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIGtleXMgaW4gbWVudSBhY3Rpb25zLlwiKTtcblxuICAgICAgICAgICAgbWVudS5pbm5lckhUTUwgPSBhY3Rpb25zXG4gICAgICAgICAgICAgICAgLm1hcCgocmVjb3JkKSA9PlxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhyZWNvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChbbmFtZSwgeyBsYWJlbCwga2V5YmluZCB9XSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYDxidXR0b24gY2xhc3M9XCIke25hbWV9XCI+JHtsYWJlbH08cCBjbGFzcz1cIm1lbnUta2V5YmluZFwiPiR7a2V5YmluZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGtleSkgPT4gYDxzcGFuPiR7a2V5fTwvc3Bhbj5gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKX08L3A+PC9idXR0b24+YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGA8YnV0dG9uIGNsYXNzPVwiJHtuYW1lfVwiPiR7bGFiZWx9PC9idXR0b24+YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuam9pbignPGRpdiBjbGFzcz1cImJyXCI+PC9kaXY+Jyk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZm9yRWFjaCgocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVjb3JkKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xpY2sgPSByZWNvcmRba2V5XS5jYWxsYmFjay5iaW5kKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2sodGhpcy4jb3BlbmVkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZFtrZXldLnN0b3BQcm9wYWdhdGlvbikgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLlwiICsga2V5KSEuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICAgICAgY2xpY2tzLnNldChrZXksIGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBjb250ZXh0OiBNZW51TWFuYWdlckFjdGlvbnMgfCB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3QgZ2V0QWN0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNvbnRleHQ7XG5cbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhY3Rpb25zO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgbWVudS5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1lbnUpO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBzZXR1cChnZXRBY3Rpb25zKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNvcGVuZWQgPSBlO1xuXG4gICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY29udGV4dG1lbnUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBzZXR1cChnZXRBY3Rpb25zKCkpO1xuXG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gZS5jbGllbnRYICsgXCJweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS50b3AgPSBlLmNsaWVudFkgKyBcInB4XCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBzZXR1cChnZXRBY3Rpb25zKCkpO1xuXG4gICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlZG93bik7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGNvbnRleHRtZW51KTtcbiAgICAgICAgbWVudS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2spO1xuICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBjbGljayk7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudHMuc2V0KGVsZW1lbnQsIHsgbWVudSwgY2xpY2tzLCBsaXN0ZW5lcnM6IHsgbW91c2Vkb3duLCBjb250ZXh0bWVudSwgY2xpY2sgfSB9KTtcblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgKG5ld0NvbnRleHQ6IChwcmV2OiBNZW51TWFuYWdlckFjdGlvbnMpID0+IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBuZXdDb250ZXh0LmNhbGwodW5kZWZpbmVkLCBbLi4uYWN0aW9uc10pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXR1cChnZXRBY3Rpb25zKCkpO1xuXG4gICAgICAgICAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW1vdmUoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgeyBtZW51LCBjbGlja3MsIGxpc3RlbmVycyB9ID0gdGhpcy4jZWxlbWVudHMuZ2V0KGVsZW1lbnQpID8/IHt9O1xuXG4gICAgICAgIGlmICghbWVudSB8fCAhY2xpY2tzIHx8ICFsaXN0ZW5lcnMpIHRocm93IG5ldyBFcnJvcihgRWxlbWVudHMgYXJlIG5vdCBiZWluZyBhZmZlY3RlZC5gKTtcblxuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXJzLm1vdXNlZG93bik7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVycy5jb250ZXh0bWVudSk7XG4gICAgICAgIG1lbnUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVycy5jbGljayk7XG4gICAgICAgIG1lbnUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVycy5jbGljayk7XG5cbiAgICAgICAgQXJyYXkuZnJvbShjbGlja3MpLmZvckVhY2goKFtrZXksIGxpc3RlbmVyXSkgPT4ge1xuICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yKFwiLlwiICsga2V5KSEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBsaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1lbnUucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIE1vZGFsTWFuYWdlciB7XG4gICAgc3RhdGljICNhYm9ydD86IEFib3J0Q29udHJvbGxlcjtcblxuICAgIHN0YXRpYyBnZXQgY29udGFpbmVyKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtY29udGFpbmVyXCIpITtcbiAgICB9XG5cbiAgICBzdGF0aWMgI29uTW9kYWxNb3VudCgpIHtcbiAgICAgICAgU2FuZGJveE1hbmFnZXIua2lsbE1lbnUoKTtcblxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIm1vZGFsLWluYWN0aXZlXCIpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy4jYWJvcnQpIHRoaXMuI2Fib3J0LmFib3J0KCk7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkIS5jbGFzc0xpc3QuYWRkKFwibW9kYWwtaW5hY3RpdmVcIik7XG4gICAgfVxuXG4gICAgc3RhdGljICNvbk1vZGFsVW5tb3VudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IDw9IDApIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jYWJvcnQgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICAgICBcInRyYW5zaXRpb25lbmRcIixcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7IG9uY2U6IHRydWUsIHNpZ25hbDogdGhpcy4jYWJvcnQuc2lnbmFsIH0sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEuY2xhc3NMaXN0LnJlbW92ZShcIm1vZGFsLWluYWN0aXZlXCIpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEuY2xhc3NMaXN0LmNvbnRhaW5zKFwibW9kYWwtYWxlcnRcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkIS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBhbGVydChjb250ZW50OiBzdHJpbmcgfCBFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI29uTW9kYWxNb3VudCgpO1xuXG4gICAgICAgIGNvbnN0IGFsZXJ0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1hbGVydFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPjwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBhbGVydC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydC5jaGlsZHJlblswXS5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGFsZXJ0KTtcblxuICAgICAgICBhbGVydC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBhbGVydC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxVbm1vdW50KCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZXNjID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5jb2RlID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICBjb25zdCBjbGlja291dCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICE9PSB0aGlzLmNvbnRhaW5lciB8fCB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkICE9PSBhbGVydCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgYWxlcnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBkb25lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNvbmZpcm0oY29udGVudDogc3RyaW5nIHwgRWxlbWVudCkge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBjb25maXJtID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1jb25maXJtXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC1tZXNzYWdlXCI+PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1va1wiPk9rPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1jYW5jZWxcIj5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY29uZmlybS5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maXJtLmNoaWxkcmVuWzBdLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZmlybSk7XG5cbiAgICAgICAgY29uZmlybS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUoZmFsc2UpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmFkZChmaW5pc2gpO1xuXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKHZhbHVlOiBib29sZWFuKSA9PiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uZmlybS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxVbm1vdW50KCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZXNjID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5jb2RlID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm0ucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jb25Nb2RhbFVubW91bnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsaWNrb3V0ID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IHRoaXMuY29udGFpbmVyIHx8IHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQgIT09IGNvbmZpcm0pIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICAgICAgY29uZmlybS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxVbm1vdW50KCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgIGNvbmZpcm0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtY2FuY2VsXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcihmYWxzZSkpO1xuXG4gICAgICAgICAgICBjb25maXJtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcih0cnVlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBwcm9tcHQoY29udGVudDogc3RyaW5nIHwgRWxlbWVudCkge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBwcm9tcHQgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsIG1vZGFsLXByb21wdFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPjwvcD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJtb2RhbC1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgLz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtY2FuY2VsXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHByb21wdC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9tcHQuY2hpbGRyZW5bMF0uYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9tcHQpO1xuXG4gICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmFkZChmaW5pc2gpO1xuXG4gICAgICAgICAgICBjb25zdCBkb25lID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb21wdC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxVbm1vdW50KCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZXNjID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5jb2RlID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICBjb25zdCBjbGlja291dCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICE9PSB0aGlzLmNvbnRhaW5lciB8fCB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkICE9PSBwcm9tcHQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiLm1vZGFsLWlucHV0XCIpIS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1jYW5jZWxcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBwb3B1cChjb250ZW50OiBzdHJpbmcgfCBFbGVtZW50LCBvbk1vdW50PzogKCkgPT4gdm9pZCwgb25Vbm1vdW50PzogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBwb3B1cCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtYWxlcnQgbW9kYWwtcG9wdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1va1wiPk9rPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHBvcHVwLmNoaWxkcmVuWzBdLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcHVwLmNoaWxkcmVuWzBdLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocG9wdXApO1xuXG4gICAgICAgIHBvcHVwLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5mb2N1cygpO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBvbk1vdW50Py5jYWxsKHVuZGVmaW5lZCkpO1xuXG4gICAgICAgIGxldCBjbG9zZTogKCkgPT4gdm9pZDtcblxuICAgICAgICBjb25zdCBvdXQgPSBbXG4gICAgICAgICAgICBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkb25lID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwb3B1cC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gb25Vbm1vdW50Py5jYWxsKHVuZGVmaW5lZCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxVbm1vdW50KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNsb3NlID0gZG9uZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjbGlja291dCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IHRoaXMuY29udGFpbmVyIHx8IHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQgIT09IHBvcHVwKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgICAgIHBvcHVwLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG9uZSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgXSBhcyBbUHJvbWlzZTx2b2lkPiwgKCgpID0+IHZvaWQpP107XG5cbiAgICAgICAgb3V0LnB1c2goY2xvc2UhKTtcblxuICAgICAgICByZXR1cm4gb3V0IGFzIFtQcm9taXNlPHZvaWQ+LCAoKSA9PiB2b2lkXTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgTW91c2VNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI21vdXNlID0geyB4OiAwLCB5OiAwIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlZG93bnMgPSBuZXcgU2V0PChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2V1cHMgPSBuZXcgU2V0PChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjdG91Y2hzdGFydHMgPSBuZXcgU2V0PChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjdG91Y2hlbmRzID0gbmV3IFNldDwoZTogVG91Y2hFdmVudCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyAjbW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcbiAgICB9O1xuXG4gICAgc3RhdGljICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI21vdXNldXAgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIHRoaXMuI21vdXNldXBzLmZvckVhY2goKGwpID0+IGwuY2FsbCh1bmRlZmluZWQsIGUpKTtcbiAgICB9O1xuXG4gICAgc3RhdGljICN0b3VjaG1vdmUgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICB9O1xuXG4gICAgc3RhdGljICN0b3VjaHN0YXJ0ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jdG91Y2hzdGFydHMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI3RvdWNoZW5kID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcblxuICAgICAgICB0aGlzLiN0b3VjaGVuZHMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgc3RhcnQoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLiN0b3VjaG1vdmUpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLiN0b3VjaHN0YXJ0KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuI3RvdWNoZW5kKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMuI3RvdWNobW92ZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuI3RvdWNoc3RhcnQpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy4jdG91Y2hlbmQpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlID0geyB4OiAwLCB5OiAwIH07XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcblxuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmNsZWFyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uTW91c2VEb3duKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuYWRkKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbk1vdXNlVXAoaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuYWRkKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZNb3VzZURvd24oaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5kZWxldGUoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZk1vdXNlVXAoaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZGVsZXRlKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvblRvdWNoU3RhcnQoaGFuZGxlcjogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jdG91Y2hzdGFydHMuYWRkKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvblRvdWNoRW5kKGhhbmRsZXI6IChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI3RvdWNoZW5kcy5hZGQoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZlRvdWNoU3RhcnQoaGFuZGxlcjogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jdG91Y2hzdGFydHMuZGVsZXRlKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZUb3VjaEVuZChoYW5kbGVyOiAoZTogVG91Y2hFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiN0b3VjaGVuZHMuZGVsZXRlKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgbW91c2UoKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMuI21vdXNlIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgR0VUX0dSQVlfQ09MT1IsIFFVSUNLUElDS19TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IENhbnZhc01hbmFnZXIgfSBmcm9tIFwiLi9DYW52YXNNYW5hZ2VyXCI7XG5cbmV4cG9ydCB0eXBlIFF1aWNrUGlja0NvbnRleHQgPSB7XG4gICAgbGlzdGVuZXJzOiB7XG4gICAgICAgIG1vdXNldXA6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgIH07XG59O1xuXG5leHBvcnQgdHlwZSBRdWlja1BpY2tBY3Rpb25zID0ge1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgY2FsbGJhY2s6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xufVtdO1xuXG5leHBvcnQgY2xhc3MgUXVpY2tQaWNrTWFuYWdlciB7XG4gICAgc3RhdGljICNsaW5lOiBbZnJvbTogTW91c2VFdmVudCwgdG86IE1vdXNlRXZlbnRdIHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIGFzeW5jIGFjdGl2YXRlKGV2ZW50OiBNb3VzZUV2ZW50LCBhY3Rpb25zOiBRdWlja1BpY2tBY3Rpb25zKSB7XG4gICAgICAgIGNvbnN0IHF1aWNrcGljayA9IGh0bWxgPGRpdiBjbGFzcz1cInF1aWNrcGlja1wiPjwvZGl2PmA7XG5cbiAgICAgICAgY29uc3Qga2V5cyA9IGFjdGlvbnMubWFwKCh7IGxhYmVsIH0pID0+IGxhYmVsKTtcblxuICAgICAgICBpZiAoa2V5cy5sZW5ndGggIT09IG5ldyBTZXQoa2V5cykuc2l6ZSkgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIGxhYmVscyBpbiBxdWlja3BpY2sgYWN0aW9ucy5cIik7XG5cbiAgICAgICAgcXVpY2twaWNrLmlubmVySFRNTCA9IGFjdGlvbnNcbiAgICAgICAgICAgIC5tYXAoKHsgbGFiZWwgfSwgaSkgPT4gYDxkaXYgY2xhc3M9XCJxdWlja3BpY2staXRlbSBpbmRleC0ke2l9XCI+JHtsYWJlbH08L2Rpdj5gKVxuICAgICAgICAgICAgLmpvaW4oXCJcIik7XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNpcmNsZSA9IGh0bWxgXG4gICAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInF1aWNrcGljay1jaXJjbGVcIlxuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIiR7UVVJQ0tQSUNLX1NJWkUgKiAyfVwiXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIiR7UVVJQ0tQSUNLX1NJWkUgKiAyfVwiXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb249XCIxLjFcIlxuICAgICAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGN4PVwiJHtRVUlDS1BJQ0tfU0laRX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgY3k9XCIke1FVSUNLUElDS19TSVpFfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICByPVwiJHtRVUlDS1BJQ0tfU0laRSAvIDIgLSAxIC0gMX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiJHtHRVRfR1JBWV9DT0xPUigpfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIycHhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAke2FjdGlvbnMubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9ICgoMiAqIE1hdGguUEkpIC8gYWN0aW9ucy5sZW5ndGgpICogaSAtIE1hdGguUEkgLyAyIC0gTWF0aC5QSSAvIGFjdGlvbnMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5lUGF0aCA9IGBNJHtNYXRoLmNvcyhhbmdsZSkgKiAoUVVJQ0tQSUNLX1NJWkUgLSAxIC0gMSkgKyBRVUlDS1BJQ0tfU0laRX0sJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbihhbmdsZSkgKiAoUVVJQ0tQSUNLX1NJWkUgLSAxIC0gMSkgKyBRVUlDS1BJQ0tfU0laRVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBMJHtNYXRoLmNvcyhhbmdsZSkgKiAoUVVJQ0tQSUNLX1NJWkUgLyAyIC0gMSAtIDEpICsgUVVJQ0tQSUNLX1NJWkV9LCR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oYW5nbGUpICogKFFVSUNLUElDS19TSVpFIC8gMiAtIDEgLSAxKSArIFFVSUNLUElDS19TSVpFXG4gICAgICAgICAgICAgICAgICAgICAgICB9YDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiJHtsaW5lUGF0aH1cIiBzdHlsZT1cInN0cm9rZTogJHtHRVRfR1JBWV9DT0xPUigpfTsgc3Ryb2tlLXdpZHRoOiAycHg7IGZpbGw6IG5vbmU7XCIgLz5gO1xuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIGA7XG5cbiAgICAgICAgICAgIHF1aWNrcGljay5hcHBlbmRDaGlsZChjaXJjbGUpO1xuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gY2lyY2xlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgY2lyY2xlLnN0eWxlLmxlZnQgPSBldmVudC5jbGllbnRYIC0gd2lkdGggLyAyICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGNpcmNsZS5zdHlsZS50b3AgPSBldmVudC5jbGllbnRZIC0gaGVpZ2h0IC8gMiArIFwicHhcIjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9ICgoMiAqIE1hdGguUEkpIC8gYWN0aW9ucy5sZW5ndGgpICogaSAtIE1hdGguUEkgLyAyO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IE1hdGguY29zKGFuZ2xlKSAqIFFVSUNLUElDS19TSVpFO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSBNYXRoLnNpbihhbmdsZSkgKiBRVUlDS1BJQ0tfU0laRTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBxdWlja3BpY2sucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuaW5kZXgtXCIgKyBpKSE7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGkgKiAoMjAwIC8gYWN0aW9ucy5sZW5ndGgpICsgXCJtc1wiO1xuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBpICogKDIwMCAvIGFjdGlvbnMubGVuZ3RoKSArIFwibXNcIjtcblxuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IGV2ZW50LmNsaWVudFggKyAoMiAqIHgpIC8gMyAtIHdpZHRoIC8gMiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnRvcCA9IGV2ZW50LmNsaWVudFkgKyAoMiAqIHkpIC8gMyAtIGhlaWdodCAvIDIgKyBcInB4XCI7XG5cbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSBldmVudC5jbGllbnRYICsgeCAtIHdpZHRoIC8gMiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS50b3AgPSBldmVudC5jbGllbnRZICsgeSAtIGhlaWdodCAvIDIgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChxdWlja3BpY2spO1xuXG4gICAgICAgIHRoaXMuI2xpbmUgPSBbZXZlbnQsIGV2ZW50XTtcblxuICAgICAgICBjb25zdCBtb3VzZW1vdmUgPSAoZTogTW91c2VFdmVudCkgPT4gKHRoaXMuI2xpbmUgPSBbZXZlbnQsIGVdKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcIm1vdXNldXBcIixcbiAgICAgICAgICAgIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmh5cG90KGUuY2xpZW50WCAtIGV2ZW50LmNsaWVudFgsIGUuY2xpZW50WSAtIGV2ZW50LmNsaWVudFkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID49IFFVSUNLUElDS19TSVpFIC8gMikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIoZS5jbGllbnRZIC0gZXZlbnQuY2xpZW50WSwgZS5jbGllbnRYIC0gZXZlbnQuY2xpZW50WCkgKyBNYXRoLlBJIC8gMjtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbG9zZXN0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLnJvdW5kKGFuZ2xlIC8gKCgyICogTWF0aC5QSSkgLyBhY3Rpb25zLmxlbmd0aCkpICsgYWN0aW9ucy5sZW5ndGgpICUgYWN0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uc1tjbG9zZXN0XS5jYWxsYmFjay5jYWxsKHVuZGVmaW5lZCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHF1aWNrcGljay5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jbGluZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IG9uY2U6IHRydWUgfSxcbiAgICAgICAgKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcIm1vdXNlbGVhdmVcIixcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBxdWlja3BpY2sucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI2xpbmUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyBvbmNlOiB0cnVlIH0sXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbmRlcih7IGZnIH06IHsgZmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9KSB7XG4gICAgICAgIGlmICh0aGlzLiNsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCBbZnJvbSwgdG9dID0gdGhpcy4jbGluZTtcblxuICAgICAgICAgICAgZmcuZmlsbFN0eWxlID0gR0VUX0dSQVlfQ09MT1IoKTtcbiAgICAgICAgICAgIGZnLnN0cm9rZVN0eWxlID0gR0VUX0dSQVlfQ09MT1IoKTtcblxuICAgICAgICAgICAgZmcubGluZVdpZHRoID0gMTtcblxuICAgICAgICAgICAgZmcuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBmZy5hcmMoZnJvbS5jbGllbnRYLCBmcm9tLmNsaWVudFksIDIsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgICAgIGZnLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgZmcuZmlsbCgpO1xuXG4gICAgICAgICAgICBmZy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGZnLm1vdmVUbyhmcm9tLmNsaWVudFgsIGZyb20uY2xpZW50WSk7XG4gICAgICAgICAgICBmZy5saW5lVG8odG8uY2xpZW50WCwgdG8uY2xpZW50WSk7XG4gICAgICAgICAgICBmZy5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIGZnLnN0cm9rZSgpO1xuXG4gICAgICAgICAgICBmZy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGZnLmFyYyh0by5jbGllbnRYLCB0by5jbGllbnRZLCAyLCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgICAgICBmZy5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIGZnLmZpbGwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgICBDYW52YXNNYW5hZ2VyLmFkZEpvYih0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElOX0RFQlVHX01PREUsIExJR0hUX0dSQVlfQ1NTX0NPTE9SLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFNlcmlhbGl6ZWREaWFncmFtLCBmcm9tRmlsZSwgc2F2ZURpYWdyYW0gfSBmcm9tIFwiLi4vZmlsZXNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGlzcGxheSB9IGZyb20gXCIuLi9yZWlmaWVkL0Rpc3BsYXlcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCwgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IENhbnZhc01hbmFnZXIgfSBmcm9tIFwiLi9DYW52YXNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBEYXJrbW9kZU1hbmFnZXIgfSBmcm9tIFwiLi9EYXJrbW9kZU1hbmFnZXJcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4vS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNZW51TWFuYWdlciwgTWVudU1hbmFnZXJBY3Rpb25zIH0gZnJvbSBcIi4vTWVudU1hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgTW91c2VNYW5hZ2VyIH0gZnJvbSBcIi4vTW91c2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBRdWlja1BpY2tNYW5hZ2VyIH0gZnJvbSBcIi4vUXVpY2tQaWNrTWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuL1NlbGVjdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7IFNldHRpbmdzTWFuYWdlciB9IGZyb20gXCIuL1NldHRpbmdzTWFuYWdlclwiO1xuaW1wb3J0IHsgU3RvcmFnZU1hbmFnZXIgfSBmcm9tIFwiLi9TdG9yYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4vVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb29sc01hbmFnZXIgfSBmcm9tIFwiLi9Ub29sc01hbmFnZXJcIjtcbmltcG9ydCB7IFVuZG9SZWRvTWFuYWdlciB9IGZyb20gXCIuL1VuZG9SZWRvTWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vV2lyaW5nTWFuYWdlclwiO1xuXG50eXBlIFNhbmRib3hDb25maWcgPSB7XG4gICAga2V5YmluZHM/OiBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4gICAgbWVudT86IE1lbnVNYW5hZ2VyQWN0aW9ucztcbiAgICBpbml0aWFsPzogW2NvbXBvbmVudHM6IFJlaWZpZWRbXSwgd2lyZXM6IFdpcmluZ1tdXTtcbiAgICBsaW1pdHM/OiB7XG4gICAgICAgIGlucHV0cz86IG51bWJlcjtcbiAgICAgICAgb3V0cHV0cz86IG51bWJlcjtcbiAgICAgICAgd2lyaW5ncz86IG51bWJlcjtcbiAgICAgICAgY2hpcHM/OiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+O1xuICAgICAgICBjaGlwc1RvdGFsPzogbnVtYmVyO1xuICAgICAgICBjb21wb25lbnRzVG90YWw/OiBudW1iZXI7XG4gICAgfTtcbiAgICBzdGF0ZXM/OiB7IGlucHV0cz86IGJvb2xlYW5bXTsgb3V0cHV0cz86IGJvb2xlYW5bXTsgY2FsbGJhY2s6ICgpID0+IHZvaWQgfVtdO1xuICAgIHNhdmU/OiBzdHJpbmc7XG4gICAgb3ZlcnJpZGVTYXZlSWZFeGlzdHM/OiBib29sZWFuO1xuICAgIGNoZWNrSW50ZXJ2YWw/OiBudW1iZXI7XG4gICAgY2hlY2tTdGF0ZT86IChyZWlmaWVkOiBXYXRjaGVkU2V0PFJlaWZpZWQ+LCB3aXJpbmdzOiBXYXRjaGVkU2V0PFdpcmluZz4pID0+IGJvb2xlYW47XG4gICAgaWZTdGF0ZUNoZWNrZWQ/OiAoKSA9PiB2b2lkO1xuICAgIHNldHRpbmdzPzogeyBzbmFwVG9HcmlkPzogYm9vbGVhbiB9O1xufTtcblxuY29uc3QgY2FsY3VsYXRlUmVpZmllZFRvdGFscyA9IChzZXQ6IFNldDxSZWlmaWVkPikgPT5cbiAgICBbLi4uc2V0XS5yZWR1Y2UoXG4gICAgICAgIChtYXAsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBtYXAuaW5wdXRzVG90YWwrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbSBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgIG1hcC5vdXRwdXRzVG90YWwrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbSBpbnN0YW5jZW9mIENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIG1hcC5jaGlwc1RvdGFsKys7XG5cbiAgICAgICAgICAgICAgICBtYXAuY2hpcHMuc2V0KGl0ZW0uY2hpcC5uYW1lLCAobWFwLmNoaXBzLmdldChpdGVtLmNoaXAubmFtZSkgPz8gMCkgKyAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbSBpbnN0YW5jZW9mIERpc3BsYXkpIHtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlucHV0c1RvdGFsOiAwLFxuICAgICAgICAgICAgb3V0cHV0c1RvdGFsOiAwLFxuICAgICAgICAgICAgY2hpcHNUb3RhbDogMCxcbiAgICAgICAgICAgIGNoaXBzOiBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpLFxuICAgICAgICB9LFxuICAgICk7XG5cbmV4cG9ydCBjbGFzcyBTYW5kYm94TWFuYWdlciB7XG4gICAgc3RhdGljIHF1ZXVlTmV3Q29udGV4dDogUmV0dXJuVHlwZTx0eXBlb2YgTWVudU1hbmFnZXJbXCJ1c2VcIl0+WzBdO1xuICAgIHN0YXRpYyBraWxsTWVudTogUmV0dXJuVHlwZTx0eXBlb2YgTWVudU1hbmFnZXJbXCJ1c2VcIl0+WzFdO1xuXG4gICAgc3RhdGljIHdhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMgPSBuZXcgU2V0PCgpID0+IHZvaWQ+KCk7XG5cbiAgICBzdGF0aWMgI2ludGVydmFsID0gLTE7XG4gICAgc3RhdGljICNvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjaGlzdG9yeSA9IG5ldyBBcnJheTxbY29tbWFuZDogKCkgPT4gdm9pZCwgcmVkbzogKCkgPT4gdm9pZF0+KCk7XG4gICAgc3RhdGljICNyZWRvcyA9IG5ldyBBcnJheTxbY29tbWFuZDogKCkgPT4gdm9pZCwgcmVkbzogKCkgPT4gdm9pZF0+KCk7XG5cbiAgICBzdGF0aWMgI2NvbmZpZzogU2FuZGJveENvbmZpZztcblxuICAgIHN0YXRpYyBzZXR1cChjb25maWc6IFNhbmRib3hDb25maWcpIHtcbiAgICAgICAgaWYgKHRoaXMuI29ic2VydmVyKSB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNpbnRlcnZhbCk7XG5cbiAgICAgICAgdGhpcy4jY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRhaW5lciBtb2RhbC1pbmFjdGl2ZVwiPjwvZGl2PmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGRpdiBjbGFzcz1cInJlaWZpZWQtcm9vdFwiPjwvZGl2PmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmQtY2FudmFzXCI+PC9jYW52YXM+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8Y2FudmFzIGNsYXNzPVwiZm9yZWdyb3VuZC1jYW52YXNcIj48L2NhbnZhcz5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxkaXYgY2xhc3M9XCJ0b2FzdHMtY29udGFpbmVyXCI+PC9kaXY+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8YnV0dG9uIGNsYXNzPVwidG9vbHNcIj48L2J1dHRvbj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxidXR0b24gY2xhc3M9XCJzZXR0aW5nc1wiPjwvYnV0dG9uPmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGJ1dHRvbiBjbGFzcz1cImRhcmttb2RlXCI+PC9idXR0b24+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8YnV0dG9uIGNsYXNzPVwidW5kb1wiPjwvYnV0dG9uPmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGJ1dHRvbiBjbGFzcz1cInJlZG9cIj48L2J1dHRvbj5gKTtcblxuICAgICAgICBNb3VzZU1hbmFnZXIuc3RhcnQoKTtcbiAgICAgICAgS2V5YmluZHNNYW5hZ2VyLmxpc3RlbigpO1xuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLmxpc3RlbigpO1xuICAgICAgICBEcmFnZ2luZ01hbmFnZXIubGlzdGVuKCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIuaW5pdCgpO1xuICAgICAgICBRdWlja1BpY2tNYW5hZ2VyLmluaXQoKTtcblxuICAgICAgICBDYW52YXNNYW5hZ2VyLnN0YXJ0KCk7XG5cbiAgICAgICAgVG9vbHNNYW5hZ2VyLmxpc3RlbigpO1xuICAgICAgICBTZXR0aW5nc01hbmFnZXIubGlzdGVuKCk7XG5cbiAgICAgICAgRGFya21vZGVNYW5hZ2VyLmxpc3RlbigpLm9uQ2hhbmdlKCgpID0+IERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoeyBvbmx5VXBkYXRlQ29sb3I6IHRydWUgfSkpO1xuXG4gICAgICAgIFVuZG9SZWRvTWFuYWdlci5saXN0ZW4oKTtcblxuICAgICAgICBjb25zdCBjcmVhdGVSZWlmaWVkQWN0aXZlID0gKGNvbXBvbmVudHM6IFJlaWZpZWRbXSkgPT5cbiAgICAgICAgICAgIG5ldyBXYXRjaGVkU2V0PFJlaWZpZWQ+KClcbiAgICAgICAgICAgICAgICAub25BZGQoKGl0ZW0sIHNldCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3RhbHMgPSBjYWxjdWxhdGVSZWlmaWVkVG90YWxzKHNldC5jbG9uZSgpLmFkZChpdGVtKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzLmNoaXBzVG90YWwgKyB0b3RhbHMuaW5wdXRzVG90YWwgKyB0b3RhbHMub3V0cHV0c1RvdGFsID5cbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLiNjb25maWcubGltaXRzPy5jb21wb25lbnRzVG90YWwgPz8gSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIGNvbXBvbmVudHMgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbHMuaW5wdXRzVG90YWwgPiAodGhpcy4jY29uZmlnLmxpbWl0cz8uaW5wdXRzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIGlucHV0cyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFscy5vdXRwdXRzVG90YWwgPiAodGhpcy4jY29uZmlnLmxpbWl0cz8ub3V0cHV0cyA/PyBJbmZpbml0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJFeGNlZWRlZCB0b3RhbCBvdXRwdXRzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxzLmNoaXBzVG90YWwgPiAodGhpcy4jY29uZmlnLmxpbWl0cz8uY2hpcHNUb3RhbCA/PyBJbmZpbml0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJFeGNlZWRlZCB0b3RhbCBjaGlwcyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSBpbnN0YW5jZW9mIENvbXBvbmVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzLmNoaXBzLmhhcyhpdGVtLmNoaXAubmFtZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFscy5jaGlwcy5nZXQoaXRlbS5jaGlwLm5hbWUpISA+ICh0aGlzLiNjb25maWcubGltaXRzPy5jaGlwcz8uW2l0ZW0uY2hpcC5uYW1lXSA/PyBJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBFeGNlZWRlZCB0b3RhbCAnJHtpdGVtLmNoaXAubmFtZX0nIGxpbWl0LmAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uQWRkKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFkZEFsbChjb21wb25lbnRzKTtcblxuICAgICAgICBjb25zdCBjcmVhdGVXaXJpbmdzU2V0ID0gKHdpcmluZ3M6IFdpcmluZ1tdKSA9PlxuICAgICAgICAgICAgbmV3IFdhdGNoZWRTZXQ8V2lyaW5nPigpXG4gICAgICAgICAgICAgICAgLm9uQWRkKChfLCBzZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldC5zaXplICsgMSA+ICh0aGlzLiNjb25maWcubGltaXRzPy53aXJpbmdzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIHdpcmluZ3MgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFkZEFsbCh3aXJpbmdzKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5tZW51ICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgW3RoaXMucXVldWVOZXdDb250ZXh0LCB0aGlzLmtpbGxNZW51XSA9IE1lbnVNYW5hZ2VyLnVzZShSZWlmaWVkLnJvb3QsIHRoaXMuI2NvbmZpZy5tZW51KTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5rZXliaW5kcyAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuI2NvbmZpZy5rZXliaW5kcykuZm9yRWFjaCgoW2Nob3JkLCBydW5dKSA9PiBLZXliaW5kc01hbmFnZXIub25LZXlDaG9yZChjaG9yZCwgcnVuKSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcuaW5pdGlhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZSA9IGNyZWF0ZVJlaWZpZWRBY3RpdmUodGhpcy4jY29uZmlnLmluaXRpYWxbMF0pO1xuXG4gICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5hdHRhY2goKSk7XG5cbiAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMgPSBjcmVhdGVXaXJpbmdzU2V0KHRoaXMuI2NvbmZpZy5pbml0aWFsWzFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLnNhdmUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBTdG9yYWdlTWFuYWdlci5nZXQ8c3RyaW5nPihcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUpO1xuXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogW3NldHRpbmdzLCBjb21wb25lbnRzLCB3aXJlc10sXG4gICAgICAgICAgICAgICAgfSA9IGZyb21GaWxlKGZpbGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLmRlbGV0ZShcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChJTl9ERUJVR19NT0RFKSBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHJlYWQgZnJvbSBzYXZlczpcIiwgZXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byByZWFkIGZyb20gc2F2ZXMuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLiNjb25maWcub3ZlcnJpZGVTYXZlSWZFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseVJhd1NldHRpbmdzKHNldHRpbmdzISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlID0gY3JlYXRlUmVpZmllZEFjdGl2ZShjb21wb25lbnRzISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmF0dGFjaCgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcyA9IGNyZWF0ZVdpcmluZ3NTZXQod2lyZXMhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5zYXZlICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcbiAgICAgICAgICAgICAgICAgICAgXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLFxuICAgICAgICAgICAgICAgICAgICBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVyLm9ic2VydmUoUmVpZmllZC5yb290LCB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLFxuICAgICAgICAgICAgY2hhcmFjdGVyRGF0YU9sZFZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjaGVjayA9IHRoaXMuI2NvbmZpZy5jaGVja1N0YXRlPy4oUmVpZmllZC5hY3RpdmUuY2xvbmUoKSwgV2lyaW5nTWFuYWdlci53aXJlcy5jbG9uZSgpKSA/PyBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGNoZWNrKSB0aGlzLiNjb25maWcuaWZTdGF0ZUNoZWNrZWQ/LigpO1xuICAgICAgICB9LCB0aGlzLiNjb25maWcuY2hlY2tJbnRlcnZhbCA/PyA1MCkgYXMgbmV2ZXI7XG5cbiAgICAgICAgaWYgKCFTdG9yYWdlTWFuYWdlci5nZXQoXCJ1c2VkaGVscFwiKSlcbiAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQcmVzcyAnPycgZm9yIGhlbHAuXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IExJR0hUX0dSQVlfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBmb3JjZVNhdmUoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLnNhdmUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXG4gICAgICAgICAgICAgICAgXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLFxuICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuI29ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNpbnRlcnZhbCk7XG5cbiAgICAgICAgdGhpcy4jaW50ZXJ2YWwgPSAtMTtcblxuICAgICAgICBNb3VzZU1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgS2V5YmluZHNNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgIFNlbGVjdGlvbk1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnJlc2V0KCk7XG5cbiAgICAgICAgQ2FudmFzTWFuYWdlci5zdG9wKCk7XG5cbiAgICAgICAgVG9vbHNNYW5hZ2VyLnN0b3AoKTtcbiAgICAgICAgU2V0dGluZ3NNYW5hZ2VyLnN0b3AoKTtcbiAgICAgICAgRGFya21vZGVNYW5hZ2VyLnN0b3AoKTtcbiAgICAgICAgVW5kb1JlZG9NYW5hZ2VyLnN0b3AoKTtcblxuICAgICAgICBNZW51TWFuYWdlci5yZW1vdmUoUmVpZmllZC5yb290KTtcblxuICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmZvckVhY2goKGZpbmlzaCkgPT4gZmluaXNoLmNhbGwodW5kZWZpbmVkKSk7XG5cbiAgICAgICAgdGhpcy53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmNsZWFyKCk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIHRoaXMuI2NvbmZpZyA9IHt9O1xuXG4gICAgICAgIHRoaXMuI2hpc3RvcnkgPSBbXTtcbiAgICAgICAgdGhpcy4jcmVkb3MgPSBbXTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgY2xlYXIoKSB7XG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmRldGFjaCgpKTtcblxuICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHdpcmUuZGVzdHJveSgpKTtcblxuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHB1c2hIaXN0b3J5KGNvbW1hbmQ6ICgpID0+IHZvaWQsIHVuZG86ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jcmVkb3MubGVuZ3RoID0gMDtcblxuICAgICAgICBjb21tYW5kLmNhbGwodW5kZWZpbmVkKTtcblxuICAgICAgICB0aGlzLiNoaXN0b3J5LnB1c2goW2NvbW1hbmQsIHVuZG9dKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcG9wSGlzdG9yeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiNoaXN0b3J5Lmxlbmd0aCkge1xuICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vdGhpbmcgdG8gdW5kby5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbcmVkbywgdW5kb10gPSB0aGlzLiNoaXN0b3J5LnBvcCgpITtcblxuICAgICAgICB0aGlzLiNyZWRvcy5wdXNoKFtyZWRvLCB1bmRvXSk7XG5cbiAgICAgICAgdW5kby5jYWxsKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlZG9IaXN0b3J5KCkge1xuICAgICAgICBpZiAoIXRoaXMuI3JlZG9zLmxlbmd0aCkge1xuICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vdGhpbmcgdG8gcmVkby5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbY29tbWFuZCwgdW5kb10gPSB0aGlzLiNyZWRvcy5wb3AoKSE7XG5cbiAgICAgICAgdGhpcy4jaGlzdG9yeS5wdXNoKFtjb21tYW5kLCB1bmRvXSk7XG5cbiAgICAgICAgY29tbWFuZC5jYWxsKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFwcGx5U2V0dGluZ3Moc2V0dGluZ3M6IFNhbmRib3hDb25maWdbXCJzZXR0aW5nc1wiXSAmIHt9KSB7XG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkID0gc2V0dGluZ3Muc25hcFRvR3JpZCA/PyBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgYXBwbHlSYXdTZXR0aW5ncyhzZXR0aW5nczogU2VyaWFsaXplZERpYWdyYW1bXCJzZXR0aW5nc1wiXSkge1xuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCA9IHNldHRpbmdzW1wiRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRcIl07XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBzYXZlZE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNjb25maWcuc2F2ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgc2F2ZVRvKHNhdmU6IHN0cmluZykge1xuICAgICAgICB0aGlzLiNjb25maWcuc2F2ZSA9IHNhdmU7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuaGFzKFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSkgJiZcbiAgICAgICAgICAgICEoYXdhaXQgTW9kYWxNYW5hZ2VyLmNvbmZpcm0oXG4gICAgICAgICAgICAgICAgXCJUaGVyZSBpcyBhbHJlYWR5IGEgc2F2ZSB3aXRoIHRoaXMgbmFtZS4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlcGxhY2UgaXQ/XCIsXG4gICAgICAgICAgICApKVxuICAgICAgICApXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSwgc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY2lyY3VsYXJcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIEdFVF9BQ1RJVkFURURfQ09MT1IsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZnJvbUZpbGUsIHNhdmVEaWFncmFtIH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi4vcmVpZmllZC9EaXNwbGF5XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQsIG92ZXJsYXBwZWRCb3VuZHMgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBDYW52YXNNYW5hZ2VyIH0gZnJvbSBcIi4vQ2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4vVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vV2lyaW5nTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uTWFuYWdlciB7XG4gICAgc3RhdGljIHNlbGVjdGVkID0gbmV3IFdhdGNoZWRTZXQ8UmVpZmllZD4oKTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcblxuICAgICAgICBjb25zdCBlbGVtZW50ID0gW1xuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJidXR0b24uYm9hcmQtaW5wdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1vdXRwdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5jb21wb25lbnRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5kaXNwbGF5XCIpLFxuICAgICAgICBdLmZpbmQoKGVsZW1lbnQpID0+IGVsZW1lbnQgIT09IG51bGwpO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbmQoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmVsZW1lbnQgPT09IGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChyZWlmaWVkKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKElTX01BQ19PUyAmJiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIk1ldGFMZWZ0XCIpIHx8IEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJNZXRhUmlnaHRcIikpKSB8fFxuICAgICAgICAgICAgICAgICghSVNfTUFDX09TICYmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiQ29udHJvbExlZnRcIikgfHwgS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIkNvbnRyb2xSaWdodFwiKSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3Rpb24ocmVpZmllZCk7XG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5zZWxlY3RlZC5oYXMocmVpZmllZCkpIHRoaXMuc2VsZWN0KHJlaWZpZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjY29weSA9IGFzeW5jIChlOiBDbGlwYm9hcmRFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC5zaXplKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gWy4uLnRoaXMuc2VsZWN0ZWRdO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gc2F2ZURpYWdyYW0oXG4gICAgICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICAgICAgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgKHdpcmluZykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LnNvbWUoKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkgcmV0dXJuIHdpcmluZy5mcm9tID09PSBjb21wb25lbnQuZWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5vdXRwdXRzLnNvbWUoKG91dHB1dCkgPT4gd2lyaW5nLmZyb20gPT09IG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5zb21lKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiB3aXJpbmcudG8gPT09IGNvbXBvbmVudC5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50LmlucHV0cy5zb21lKChpbnB1dCkgPT4gd2lyaW5nLnRvID09PSBpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChkYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3Bhc3RlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIHJlc3VsdDogWywgY29tcG9uZW50cywgd2lyaW5nc10sXG4gICAgICAgIH0gPSBmcm9tRmlsZShhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCkpO1xuXG4gICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHBhc3RlIGRpYWdyYW0gZGF0YS5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBtb3VzZSA9IHsgLi4uTW91c2VNYW5hZ2VyLm1vdXNlIH07XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGRBbGwoY29tcG9uZW50cyEpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudHMhLmV2ZXJ5KChjb21wb25lbnQpID0+IFJlaWZpZWQuYWN0aXZlLmhhcyhjb21wb25lbnQpKSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4gaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gY29tcG9uZW50LnVwZGF0ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChNb3VzZU1hbmFnZXIubW91c2UueCAhPT0gLTEgJiYgTW91c2VNYW5hZ2VyLm1vdXNlLnkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gY29tcG9uZW50cyFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBheCA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBheSA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ4ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ5ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWQgPSBNYXRoLnNxcnQoYXggKiBheCArIGF5ICogYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiZCA9IE1hdGguc3FydChieCAqIGJ4ICsgYnkgKiBieSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhZCAtIGJkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMhLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBtb3VzZS54ICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IG1vdXNlLnkgKyBvZmZzZXQudG9wIC0gdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKHdpcmluZ3MhKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cyEuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB0aGlzLmFkZFNlbGVjdGlvbihjb21wb25lbnQpKTtcblxuICAgICAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGVBbGwoY29tcG9uZW50cyEpO1xuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cyEuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZXRhY2goKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZGVsZXRlQWxsKHdpcmluZ3MhKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKChjb21wb25lbnQpID0+IHRoaXMuYWRkU2VsZWN0aW9uKGNvbXBvbmVudCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgc3RhdGljIHNlbGVjdChyZWlmaWVkOiBSZWlmaWVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZChyZWlmaWVkKTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IChjb21wb25lbnQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMFwiKSk7XG5cbiAgICAgICAgcmVpZmllZC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwMFwiO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZWxlY3RBbGxJbihmcm9tOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sIHRvOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbHRlcigoY29tcG9uZW50KSA9PlxuICAgICAgICAgICAgb3ZlcmxhcHBlZEJvdW5kcyhjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgZnJvbSwgdG8pLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkQWxsKHJlaWZpZWQpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwXCIpKTtcblxuICAgICAgICByZWlmaWVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwMFwiKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFNlbGVjdGlvbihyZWlmaWVkOiBSZWlmaWVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkKHJlaWZpZWQpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwXCIpKTtcblxuICAgICAgICByZWlmaWVkLmVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDAwXCI7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzU2VsZWN0ZWQoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLnNlbGVjdGVkXS5zb21lKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkgcmV0dXJuIGVsZW1lbnQgPT09IGNvbXBvbmVudC5lbGVtZW50O1xuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSByZXR1cm4gZWxlbWVudCA9PT0gY29tcG9uZW50LmVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSlcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLnNvbWUoKGlucHV0KSA9PiBlbGVtZW50ID09PSBpbnB1dCkgfHxcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm91dHB1dHMuc29tZSgob3V0cHV0KSA9PiBlbGVtZW50ID09PSBvdXRwdXQpIHx8XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPT09IGNvbXBvbmVudC5lbGVtZW50XG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW5kZXIoeyBmZyB9OiB7IGZnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSkge1xuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBmZy5zdHJva2VTdHlsZSA9IEdFVF9BQ1RJVkFURURfQ09MT1IoKTtcblxuICAgICAgICAgICAgZmcubGluZVdpZHRoID0gMTtcblxuICAgICAgICAgICAgZmcubGluZUpvaW4gPSBcIm1pdGVyXCI7XG5cbiAgICAgICAgICAgIGZnLnN0cm9rZVJlY3QocmVjdC5sZWZ0IC0gMTUsIHJlY3QudG9wIC0gMTUsIHJlY3Qud2lkdGggKyAxNSArIDE1LCByZWN0LmhlaWdodCArIDE1ICsgMTUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICBDYW52YXNNYW5hZ2VyLmFkZEpvYih0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgdGhpcy4jY29weSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLCB0aGlzLiNwYXN0ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlYWZlbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIHRoaXMuI2NvcHkpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicGFzdGVcIiwgdGhpcy4jcGFzdGUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgIHRoaXMuZGVhZmVuKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IERhcmttb2RlTWFuYWdlciB9IGZyb20gXCIuL0Rhcmttb2RlTWFuYWdlclwiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9XaXJpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc01hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSAjY2hhbmdlcyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyBnZXQgI2VsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcImJ1dHRvbi5zZXR0aW5nc1wiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uQ2hhbmdlKHJ1bjogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNjaGFuZ2VzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZDaGFuZ2UocnVuOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI2NoYW5nZXMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljICNsaXN0ZW5lciA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZm9ybSA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2V0dGluZ3MtZm9ybVwiPlxuICAgICAgICAgICAgICAgIDxoMT5zZXR0aW5nczwvaDE+XG5cbiAgICAgICAgICAgICAgICA8cD5TZXR0aW5ncyBhcmUgc2F2ZWQgYXV0b21hdGljYWxseS48L3A+XG5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzZXR0aW5ncy1jb250cm9sXCIgZm9yPVwiZGFya21vZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiZGFya21vZGVcIiB0eXBlPVwiY2hlY2tib3hcIiAke0Rhcmttb2RlTWFuYWdlci5kYXJrbW9kZUVuYWJsZWQgPyBcImNoZWNrZWRcIiA6IFwiXCJ9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXJrIG1vZGVcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cblxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzZXR0aW5ncy1jb250cm9sXCIgZm9yPVwiZGFya21vZGVNb2RhbHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJkYXJrbW9kZU1vZGFsc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke0Rhcmttb2RlTWFuYWdlci5kYXJrbW9kZU1vZGFsc0VuYWJsZWQgPyBcImNoZWNrZWRcIiA6IFwiXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgZGFyayBtb2RlIG1vZGFsc1xuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwic2V0dGluZ3MtY29udHJvbFwiIGZvcj1cInNuYXBUb0dyaWRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJzbmFwVG9HcmlkXCIgdHlwZT1cImNoZWNrYm94XCIgJHtEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCA/IFwiY2hlY2tlZFwiIDogXCJcIn0gLz5cbiAgICAgICAgICAgICAgICAgICAgc25hcCB0byBncmlkXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cblxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInNldHRpbmdzLWNvbnRyb2xcIiBmb3I9XCJmYW5jeVdpcmVzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImZhbmN5V2lyZXNcIiB0eXBlPVwiY2hlY2tib3hcIiAke1dpcmluZ01hbmFnZXIuRkFOQ1lfV0lSRVMgPyBcImNoZWNrZWRcIiA6IFwiXCJ9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICBmYW5jeSB3aXJlc1xuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInNldHRpbmdzLWNvbnRyb2xcIiBmb3I9XCJmYW5jaWVyV2lyZXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiZmFuY2llcldpcmVzXCIgdHlwZT1cImNoZWNrYm94XCIgJHtXaXJpbmdNYW5hZ2VyLkZBTkNJRVJfV0lSRVMgPyBcImNoZWNrZWRcIiA6IFwiXCJ9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICBmYW5jaWVyIHdpcmVzXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzZXR0aW5ncy1jb250cm9sXCIgZm9yPVwiZ2F0ZURlbGF5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZ2F0ZURlbGF5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heD1cIjI1MFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjI1XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT1cIiR7UmVpZmllZC5HQVRFX0RFTEFZfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgZ2F0ZSBkZWxheSAoMC0yNTAvMjUpXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwic2V0dGluZ3MtY29udHJvbFwiIGZvcj1cImdhdGVEZWxheVZhcmlhdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cImdhdGVEZWxheVZhcmlhdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXg9XCIxMDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCI1XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT1cIiR7UmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTn1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIGdhdGUgZGVsYXkgdmFyaWF0aW9uICgwLTEwMC81KVxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT1cIndpZHRoOiA2MHB4O1wiPnJlc2V0PC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICBsZXQgcmVzZXQgPSBmYWxzZTtcblxuICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBEYXJrbW9kZU1hbmFnZXIuZGFya21vZGVFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICBEYXJrbW9kZU1hbmFnZXIuZGFya21vZGVNb2RhbHNFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCA9IGZhbHNlO1xuICAgICAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZID0gMTAwO1xuICAgICAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTiA9IDI1O1xuXG4gICAgICAgICAgICByZXNldCA9IHRydWU7XG5cbiAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IFtjbG9zZWQsIGNsb3NlXSA9IGF3YWl0IE1vZGFsTWFuYWdlci5wb3B1cChmb3JtKTtcblxuICAgICAgICBhd2FpdCBjbG9zZWQ7XG5cbiAgICAgICAgaWYgKCFyZXNldCkge1xuICAgICAgICAgICAgRGFya21vZGVNYW5hZ2VyLmRhcmttb2RlRW5hYmxlZCA9IGZvcm0ucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcImlucHV0W25hbWU9ZGFya21vZGVdXCIpIS5jaGVja2VkO1xuICAgICAgICAgICAgRGFya21vZGVNYW5hZ2VyLmRhcmttb2RlTW9kYWxzRW5hYmxlZCA9XG4gICAgICAgICAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiaW5wdXRbbmFtZT1kYXJrbW9kZU1vZGFsc11cIikhLmNoZWNrZWQ7XG4gICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCA9IGZvcm0ucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcImlucHV0W25hbWU9c25hcFRvR3JpZF1cIikhLmNoZWNrZWQ7XG4gICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLkZBTkNZX1dJUkVTID0gZm9ybS5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiaW5wdXRbbmFtZT1mYW5jeVdpcmVzXVwiKSEuY2hlY2tlZDtcbiAgICAgICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWSA9IGZvcm0ucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcImlucHV0W25hbWU9Z2F0ZURlbGF5XVwiKSEudmFsdWVBc051bWJlcjtcbiAgICAgICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT04gPSBmb3JtLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXG4gICAgICAgICAgICAgICAgXCJpbnB1dFtuYW1lPWdhdGVEZWxheVZhcmlhdGlvbl1cIixcbiAgICAgICAgICAgICkhLnZhbHVlQXNOdW1iZXI7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtLnJlbW92ZSgpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLiNlbGVtZW50LmlubmVyVGV4dCA9IFwi4pqZ77iPXCI7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jbGlzdGVuZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wKCkge1xuICAgICAgICB0aGlzLiNlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNsaXN0ZW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGJyaW5nVXBGb3JtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jbGlzdGVuZXIoKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU3RvcmFnZU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSBwcmVmaXggPSBcImtlbHNueS5nYXRlc2ltOlwiO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0b3JhZ2UgPVxuICAgICAgICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICAgICA/IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICAgICAgICAgIDogKHtcbiAgICAgICAgICAgICAgICAgIGNsZWFyKCkge30sXG4gICAgICAgICAgICAgICAgICBnZXRJdGVtOiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgICAgICAga2V5OiAoKSA9PiBudWxsLFxuICAgICAgICAgICAgICAgICAgbGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgcmVtb3ZlSXRlbSgpIHt9LFxuICAgICAgICAgICAgICAgICAgc2V0SXRlbSgpIHt9LFxuICAgICAgICAgICAgICB9IHNhdGlzZmllcyBTdG9yYWdlKTtcblxuICAgIHN0YXRpYyBzZXQ8VD4oa2V5OiBzdHJpbmcsIHZhbHVlOiBUKTogVCB7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKHRoaXMucHJlZml4ICsga2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0PFQ+KGtleTogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMucHJlZml4ICsga2V5KSEpID8/IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgaGFzKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSkgIT09IG51bGw7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlbGV0ZShrZXk6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXggKyBrZXkpID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5wcmVmaXggKyBrZXkpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIERFTEFZLCBHRVRfQklOX1BFUk1TLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4vVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vV2lyaW5nTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgVGVzdGluZ01hbmFnZXIge1xuICAgIHN0YXRpYyAjdGVzdGluZyA9IGZhbHNlO1xuXG4gICAgc3RhdGljIGFzeW5jIHRlc3QoY2FzZXM6IFtpbnB1dHM6IGJvb2xlYW5bXSwgb3V0cHV0czogYm9vbGVhbltdXVtdKSB7XG4gICAgICAgIGlmICh0aGlzLiN0ZXN0aW5nKSByZXR1cm4gTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiRGlhZ3JhbSBpcyBhbHJlYWR5IHVuZGVyIHRlc3RpbmcuXCIpO1xuXG4gICAgICAgIGNvbnN0IGlucHV0cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZV1cbiAgICAgICAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCk6IGNvbXBvbmVudCBpcyBJbnB1dCA9PiBjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApIC0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKSk7XG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBbLi4uUmVpZmllZC5hY3RpdmVdXG4gICAgICAgICAgICAuZmlsdGVyKChjb21wb25lbnQpOiBjb21wb25lbnQgaXMgT3V0cHV0ID0+IGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApIC0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKSk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbHRlcihcbiAgICAgICAgICAgIChjb21wb25lbnQpID0+ICEoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpICYmICEoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSxcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLiN0ZXN0aW5nID0gdHJ1ZTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5sb2NrKCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMubG9jaygpO1xuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsQWN0aXZhdGlvbnMgPSBpbnB1dHMubWFwKChpbnB1dCkgPT4gaW5wdXQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbERlbGF5ID0gUmVpZmllZC5HQVRFX0RFTEFZO1xuICAgICAgICBjb25zdCBvcmlnaW5hbFZhcmlhdGlvbiA9IFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT047XG5cbiAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZID0gMjU7XG4gICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT04gPSA1O1xuXG4gICAgICAgIGZvciAoY29uc3QgW2dpdmVuSW5wdXRzLCBleHBlY3RlZE91dHB1dHNdIG9mIGNhc2VzKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRzLmxlbmd0aCAhPT0gZ2l2ZW5JbnB1dHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJNaXNtYXRjaGVkIGlucHV0IGxlbmd0aHMuXCIpO1xuICAgICAgICAgICAgaWYgKG91dHB1dHMubGVuZ3RoICE9PSBleHBlY3RlZE91dHB1dHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJNaXNtYXRjaGVkIG91dHB1dCBsZW5ndGhzLlwiKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIGlucHV0XSBvZiBpbnB1dHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGdpdmVuSW5wdXRzW2luZGV4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IERFTEFZKGNvbXBvbmVudHMubGVuZ3RoICogKDI1ICsgNSkpO1xuXG4gICAgICAgICAgICBjb25zdCByZWFsT3V0cHV0cyA9IG91dHB1dHMubWFwKChvdXRwdXQpID0+IG91dHB1dC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgICAgIGlmICghcmVhbE91dHB1dHMuZXZlcnkoKG91dCwgaSkgPT4gb3V0ID09PSBleHBlY3RlZE91dHB1dHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgTW9kYWxNYW5hZ2VyLmFsZXJ0KFxuICAgICAgICAgICAgICAgICAgICBgRGlhZ3JhbSBmYWlsZWQgdG8gcGFzcyB0aGUgdGVzdCB3aXRoIGlucHV0cyBcIiR7Z2l2ZW5JbnB1dHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGJvb2xlYW4pID0+ICtib29sZWFuKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCIgXCIpfVwiLmAsXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIG9yaWdpbmFsQWN0aXZhdGlvbnMuZm9yRWFjaCgodmFsdWUsIGkpID0+IGlucHV0c1tpXS5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgdmFsdWUpKTtcblxuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLnVubG9jaygpO1xuICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMudW5sb2NrKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiN0ZXN0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IERFTEFZKCk7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBNb2RhbE1hbmFnZXIuYWxlcnQoXCJEaWFncmFtIHBhc3NlZCBhbGwgdGhlIHRlc3RzLlwiKTtcblxuICAgICAgICBvcmlnaW5hbEFjdGl2YXRpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiBpbnB1dHNbaV0uZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHZhbHVlKSk7XG4gICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWSA9IG9yaWdpbmFsRGVsYXk7XG4gICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT04gPSBvcmlnaW5hbFZhcmlhdGlvbjtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS51bmxvY2soKTtcbiAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy51bmxvY2soKTtcblxuICAgICAgICB0aGlzLiN0ZXN0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCB0ZXN0aW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jdGVzdGluZztcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0VHJ1dGhUYWJsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuI3Rlc3RpbmcpIHJldHVybiBNb2RhbE1hbmFnZXIuYWxlcnQoXCJEaWFncmFtIGlzIGFscmVhZHkgdW5kZXIgdGVzdGluZy5cIik7XG5cbiAgICAgICAgY29uc3QgaW5wdXRzID0gWy4uLlJlaWZpZWQuYWN0aXZlXVxuICAgICAgICAgICAgLmZpbHRlcigoY29tcG9uZW50KTogY29tcG9uZW50IGlzIElucHV0ID0+IGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KVxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCkgLSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApKTtcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZV1cbiAgICAgICAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCk6IGNvbXBvbmVudCBpcyBPdXRwdXQgPT4gY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KVxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCkgLSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZV0uZmlsdGVyKFxuICAgICAgICAgICAgKGNvbXBvbmVudCkgPT4gIShjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkgJiYgIShjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICghaW5wdXRzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJDYW4ndCBjcmVhdGUgdGFibGUgd2l0aG91dCBpbnB1dHMuXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFvdXRwdXRzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJDYW4ndCBjcmVhdGUgdGFibGUgd2l0aG91dCBvdXRwdXRzLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI3Rlc3RpbmcgPSB0cnVlO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmxvY2soKTtcbiAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5sb2NrKCk7XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxBY3RpdmF0aW9ucyA9IGlucHV0cy5tYXAoKGlucHV0KSA9PiBpbnB1dC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRGVsYXkgPSBSZWlmaWVkLkdBVEVfREVMQVk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsVmFyaWF0aW9uID0gUmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTjtcblxuICAgICAgICBSZWlmaWVkLkdBVEVfREVMQVkgPSAyNTtcbiAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTiA9IDU7XG5cbiAgICAgICAgY29uc3QgdGFibGU6IGJvb2xlYW5bXVtdW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBlcm0gb2YgR0VUX0JJTl9QRVJNUyhpbnB1dHMubGVuZ3RoKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIGlucHV0XSBvZiBpbnB1dHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHBlcm1baW5kZXhdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgREVMQVkoY29tcG9uZW50cy5sZW5ndGggKiAoMjUgKyA1KSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlYWxPdXRwdXRzID0gb3V0cHV0cy5tYXAoKG91dHB1dCkgPT4gb3V0cHV0LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcblxuICAgICAgICAgICAgdGFibGUucHVzaChbcGVybSwgcmVhbE91dHB1dHNdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9yaWdpbmFsQWN0aXZhdGlvbnMuZm9yRWFjaCgodmFsdWUsIGkpID0+IGlucHV0c1tpXS5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgdmFsdWUpKTtcbiAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZID0gb3JpZ2luYWxEZWxheTtcbiAgICAgICAgUmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTiA9IG9yaWdpbmFsVmFyaWF0aW9uO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLnVubG9jaygpO1xuICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLnVubG9jaygpO1xuXG4gICAgICAgIHRoaXMuI3Rlc3RpbmcgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUb2FzdERhdGEge1xuICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICBjb2xvcjogc3RyaW5nO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBUb2FzdE1hbmFnZXIge1xuICAgIHN0YXRpYyBnZXQgY29udGFpbmVyKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIudG9hc3RzLWNvbnRhaW5lclwiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIHRvYXN0KHsgbWVzc2FnZSwgY29sb3IsIGR1cmF0aW9uIH06IFRvYXN0RGF0YSkge1xuICAgICAgICBjb25zdCB0b2FzdCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9hc3RcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9hc3QtY29sb3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInRvYXN0LW1lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjbG9zZS10b2FzdFwiPuKVszwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdG9hc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIudG9hc3QtY29sb3JcIikhLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuXG4gICAgICAgIHRvYXN0LnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gZHVyYXRpb24gKyBcIm1zXCI7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodG9hc3QpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmFkZChmaW5pc2gpO1xuXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRvYXN0LnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRvYXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNsb3NlLXRvYXN0XCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcik7XG5cbiAgICAgICAgICAgIHRvYXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgaGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGRvd25sb2FkRmlsZSB9IGZyb20gXCIuLi9jYWQvZmlsZXNcIjtcbmltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jaXJjdWxhclwiO1xuaW1wb3J0IHsgTElHSFRfR1JBWV9DU1NfQ09MT1IsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgc2F2ZURpYWdyYW0gfSBmcm9tIFwiLi4vZmlsZXNcIjtcbmltcG9ydCB7IFJlaWZpZWQsIGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgdHlwZSB7IE1lbnVNYW5hZ2VyQWN0aW9ucyB9IGZyb20gXCIuL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuL1dpcmluZ01hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFRvb2xzTWFuYWdlciB7XG4gICAgc3RhdGljIHJlYWRvbmx5ICNjaGFuZ2VzID0gbmV3IFNldDwoKSA9PiB2b2lkPigpO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNsaXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgYWN0aW9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJjb3B5LXVybFwiOiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiQ29weSBsaW5rXCIsXG4gICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggS1wiIDogXCJDdHJsIEtcIixcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBocmVmQXNVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAgICAgICAgICAgICAgIGhyZWZBc1VybC5zZWFyY2hQYXJhbXMuc2V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbmxpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ0b2Eoc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSksXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoaHJlZkFzVXJsLmhyZWYpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJDb3BpZWQgZGlhZ3JhbSBsaW5rIHRvIGNsaXBib2FyZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBMSUdIVF9HUkFZX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwib3Blbi1jYWRcIjoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIk9wZW4gQ0FEXCIsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblxuICAgICAgICAgICAgICAgICAgICB1cmwuc2VhcmNoID0gXCI/YXBwPWNhZFwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSB1cmwuaHJlZjtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0cnV0aC10YWJsZVwiOiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVHJ1dGggdGFibGUgZnJvbSBkaWFncmFtXCIsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFibGUgPSBhd2FpdCBUZXN0aW5nTWFuYWdlci5nZXRUcnV0aFRhYmxlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBodG1sYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwcmU+PGJ1dHRvbj5Db3B5PC9idXR0b24+IDxidXR0b24+RG93bmxvYWQ8L2J1dHRvbj4gPGJ1dHRvbj5PcGVuIGluIENBRDwvYnV0dG9uPjxociBzdHlsZT1cIm1hcmdpbjogNHB4IDA7IGJvcmRlcjogMXB4IHNvbGlkICR7TElHSFRfR1JBWV9DU1NfQ09MT1J9XCIgLz48Y29kZSBzdHlsZT1cImZvbnQtZmFtaWx5OiBGaXJhIENvZGUsIG1vbm9zcGFjZTtcIj4ke3RhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHJvdykgPT4gcm93Lm1hcCgoaW8pID0+IGlvLm1hcCgodikgPT4gK3YpLmpvaW4oXCJcIikpLmpvaW4oXCI6XCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlxcblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZUFsbChcIjpcIiwgJzxzcGFuIHN0eWxlPVwiY29sb3I6IGdyYXk7XCI+Ojwvc3Bhbj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZUFsbChcIjBcIiwgJzxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZDtcIj4wPC9zcGFuPicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlQWxsKFwiMVwiLCAnPHNwYW4gc3R5bGU9XCJjb2xvcjogYmx1ZTtcIj4xPC9zcGFuPicpfTwvY29kZT48L3ByZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByZS5jaGlsZHJlblswXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZS5tYXAoKHJvdykgPT4gcm93Lm1hcCgoaW8pID0+IGlvLm1hcCgodikgPT4gK3YpLmpvaW4oXCJcIikpLmpvaW4oXCI6XCIpKS5qb2luKFwiXFxuXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlLmNoaWxkcmVuWzFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZG93bmxvYWRGaWxlKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUubWFwKChyb3cpID0+IHJvdy5tYXAoKGlvKSA9PiBpby5tYXAoKHYpID0+ICt2KS5qb2luKFwiXCIpKS5qb2luKFwiOlwiKSkuam9pbihcIlxcblwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmUuY2hpbGRyZW5bMl0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsLnNlYXJjaCA9IGA/YXBwPWNhZCZpbmxpbmU9JHtidG9hKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZS5tYXAoKHJvdykgPT4gcm93Lm1hcCgoaW8pID0+IGlvLm1hcCgodikgPT4gK3YpLmpvaW4oXCJcIikpLmpvaW4oXCI6XCIpKS5qb2luKFwiXFxuXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9YDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSB1cmwuaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBNb2RhbE1hbmFnZXIuYWxlcnQocHJlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIF0gYXMgY29uc3Qgc2F0aXNmaWVzIFJlYWRvbmx5PE1lbnVNYW5hZ2VyQWN0aW9ucz47XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI2FjdGlvbnM6IFJlYWRvbmx5PE1lbnVNYW5hZ2VyQWN0aW9ucz4gPSB0aGlzLmFjdGlvbnM7XG5cbiAgICBzdGF0aWMgZ2V0ICNlbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCJidXR0b24udG9vbHNcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbkNoYW5nZShydW46ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jY2hhbmdlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmQ2hhbmdlKHJ1bjogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNjaGFuZ2VzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyAjbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi50b29scy1tZW51XCIpITtcblxuICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBtZW51LnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiID8gXCJcIiA6IFwibm9uZVwiO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLiNlbGVtZW50LmlubmVyVGV4dCA9IFwi8J+boFwiO1xuXG4gICAgICAgIGNvbnN0IG1lbnUgPSBodG1sYDxkaXYgY2xhc3M9XCJ0b29scy1tZW51XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPjwvZGl2PmA7XG5cbiAgICAgICAgbWVudS5pbm5lckhUTUwgPSB0aGlzLiNhY3Rpb25zXG4gICAgICAgICAgICAubWFwKChyZWNvcmQpID0+XG4gICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMocmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICAubWFwKChbbmFtZSwgeyBsYWJlbCwga2V5YmluZCB9XSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGA8YnV0dG9uIGNsYXNzPVwiJHtuYW1lfVwiPiR7bGFiZWx9PHAgY2xhc3M9XCJtZW51LWtleWJpbmRcIj4ke2tleWJpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoa2V5KSA9PiBgPHNwYW4+JHtrZXl9PC9zcGFuPmApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcIil9PC9wPjwvYnV0dG9uPmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGA8YnV0dG9uIGNsYXNzPVwiJHtuYW1lfVwiPiR7bGFiZWx9PC9idXR0b24+YCxcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKSxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5qb2luKCc8ZGl2IGNsYXNzPVwiYnJcIj48L2Rpdj4nKTtcblxuICAgICAgICB0aGlzLiNhY3Rpb25zLmZvckVhY2goKHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMocmVjb3JkKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGljayA9IHJlY29yZFtrZXldLmNhbGxiYWNrLmJpbmQodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBtZW51LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLlwiICsga2V5KSE7XG5cbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2spO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jbGlzdGVuZXJzLnNldChpdGVtLCBjbGljayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudC5hZnRlcihtZW51KTtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNsaXN0ZW5lcik7XG5cbiAgICAgICAgY29uc3QgYm9keSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMuI2VsZW1lbnQgfHwgKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KFwiLnRvb2xzXCIpKSByZXR1cm47XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBib2R5KTtcblxuICAgICAgICB0aGlzLiNsaXN0ZW5lcnMuc2V0KGRvY3VtZW50LmJvZHksIGJvZHkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wKCkge1xuICAgICAgICB0aGlzLiNsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBsaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2xpc3RlbmVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBEYXJrbW9kZU1hbmFnZXIgfSBmcm9tIFwiLi9EYXJrbW9kZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFVuZG9SZWRvTWFuYWdlciB7XG4gICAgc3RhdGljIGdldCAjdW5kb0VsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcImJ1dHRvbi51bmRvXCIpITtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0ICNyZWRvRWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiYnV0dG9uLnJlZG9cIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyAjdW5kb0xpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5wb3BIaXN0b3J5KCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjcmVkb0xpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5yZWRvSGlzdG9yeSgpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICBEYXJrbW9kZU1hbmFnZXIub25DaGFuZ2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jdW5kb0VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgdGhpcy4jcmVkb0VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwibm9uZVwiO1xuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuI3VuZG9FbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuI3JlZG9FbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcIlwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI3VuZG9FbGVtZW50LmlubmVyVGV4dCA9IFwiVU5ET1wiO1xuICAgICAgICB0aGlzLiNyZWRvRWxlbWVudC5pbm5lclRleHQgPSBcIlJFRE9cIjtcblxuICAgICAgICB0aGlzLiN1bmRvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jdW5kb0xpc3RlbmVyKTtcbiAgICAgICAgdGhpcy4jcmVkb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI3JlZG9MaXN0ZW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuI3VuZG9FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiN1bmRvTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLiNyZWRvRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jcmVkb0xpc3RlbmVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IEdFVF9BQ1RJVkFURURfQ09MT1IsIEdFVF9HUkFZX0NPTE9SLCBMT0NLRURfRk9SX1RFU1RJTkcgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDYW52YXNNYW5hZ2VyIH0gZnJvbSBcIi4vQ2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IHsgTW91c2VNYW5hZ2VyIH0gZnJvbSBcIi4vTW91c2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuL1N0b3JhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuL1Rlc3RpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBOZXdXaXJlQ29udGV4dCB7XG4gICAgc3RhdGljIGZyb206IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIHtcbiAgICAgICAgTW91c2VNYW5hZ2VyLm9uTW91c2VEb3duKChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoTmV3V2lyZUNvbnRleHQuZnJvbSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSBlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm9hcmQtb3V0cHV0XCIpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY29tcG9uZW50LWlucHV0LWJ1dHRvblwiKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSBOZXdXaXJlQ29udGV4dC5mcm9tO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkKG5ldyBXaXJpbmcoZnJvbSwgdGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd2lyZSBvZiBXaXJpbmdNYW5hZ2VyLndpcmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBmcm9tICYmIHdpcmUudG8gPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdpcmluZyB7XG4gICAgI2Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgICNvYnNlcnZlcjtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGZyb206IEVsZW1lbnQsIHJlYWRvbmx5IHRvOiBFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRoaXMgd2lyZSBpcyBiZWluZyB0cmFja2VkIHN0aWxsIGJlZm9yZSB1cGRhdGluZyB0aGUgZWxlbWVudHNcbiAgICAgICAgICAgIGlmICghV2lyaW5nTWFuYWdlci53aXJlcy5oYXModGhpcykpIHtcbiAgICAgICAgICAgICAgICBpZiAoIVsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXS5zb21lKCh3aXJlKSA9PiB3aXJlLnRvID09PSB0aGlzLnRvKSkgdG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG8uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBmcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ28oKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLiNkZXN0cm95ZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG5cbiAgICBnbygpIHtcbiAgICAgICAgdGhpcy4jZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmZyb20sIHsgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSwgYXR0cmlidXRlczogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBnZXQgZGVzdHJveWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jZGVzdHJveWVkO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdpcmluZ01hbmFnZXIge1xuICAgIHN0YXRpYyB3aXJlcyA9IG5ldyBXYXRjaGVkU2V0PFdpcmluZz4oKTtcblxuICAgIHN0YXRpYyByZW5kZXIoeyBiZyB9OiB7IGJnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSkge1xuICAgICAgICB0aGlzLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgIGlmICh3aXJlLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndpcmVzLmxvY2tlZCkgd2lyZS5nbygpO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy53aXJlcy5kZWxldGUod2lyZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSB3aXJlLmZyb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCB0byA9IHdpcmUudG8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZXMgPSBbLi4udGhpcy53aXJlc10uZmlsdGVyKCh3KSA9PiB3LnRvID09PSB3aXJlLnRvKTtcblxuICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgICAgICAgICAgIFwiYWN0aXZhdGVkXCIsXG4gICAgICAgICAgICAgICAgc291cmNlcy5zb21lKCh3KSA9PiB3LmZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGJnLnN0cm9rZVN0eWxlID0gd2lyZS5mcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSA/IEdFVF9BQ1RJVkFURURfQ09MT1IoKSA6IEdFVF9HUkFZX0NPTE9SKCk7XG5cbiAgICAgICAgICAgIGJnLmxpbmVXaWR0aCA9IDU7XG5cbiAgICAgICAgICAgIGJnLmxpbmVKb2luID0gXCJyb3VuZFwiO1xuXG4gICAgICAgICAgICBjb25zdCB4YXhpcyA9IGZyb20ueCArIGZyb20ud2lkdGggLyAyIC0gKHRvLnggKyB0by53aWR0aCAvIDIpO1xuICAgICAgICAgICAgY29uc3QgeWF4aXMgPSBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDIgLSAodG8ueSArIHRvLndpZHRoIC8gMik7XG5cbiAgICAgICAgICAgIGNvbnN0IHBvaW50czogW251bWJlciwgbnVtYmVyXVtdID1cbiAgICAgICAgICAgICAgICAhdGhpcy4jRkFOQ1lfV0lSRVMgfHwgTWF0aC5hYnMoeGF4aXMpIDwgMTAgfHwgTWF0aC5hYnMoeWF4aXMpIDwgMTBcbiAgICAgICAgICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtmcm9tLnggKyBmcm9tLndpZHRoIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW3RvLnggKyB0by53aWR0aCAvIDIsIHRvLnkgKyB0by5oZWlnaHQgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIDogTWF0aC5hYnMoeGF4aXMpID4gTWF0aC5hYnMoeWF4aXMpXG4gICAgICAgICAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtmcm9tLnggKyBmcm9tLndpZHRoIC8gMiAtIHhheGlzIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW3RvLnggKyB0by53aWR0aCAvIDIgKyB4YXhpcyAvIDIsIHRvLnkgKyB0by5oZWlnaHQgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW3RvLnggKyB0by53aWR0aCAvIDIsIHRvLnkgKyB0by5oZWlnaHQgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtmcm9tLnggKyBmcm9tLndpZHRoIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyIC0geWF4aXMgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW3RvLnggKyB0by53aWR0aCAvIDIsIHRvLnkgKyB0by5oZWlnaHQgLyAyICsgeWF4aXMgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW3RvLnggKyB0by53aWR0aCAvIDIsIHRvLnkgKyB0by5oZWlnaHQgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBwb2ludHMuc2xpY2UoMCwgLTEpLmZvckVhY2goKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICBiZy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBiZy5tb3ZlVG8oLi4ucG9pbnRzW2ldKTtcbiAgICAgICAgICAgICAgICBiZy5saW5lVG8oLi4ucG9pbnRzW2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgYmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICAgICAgYmcuc3Ryb2tlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKE5ld1dpcmVDb250ZXh0LmZyb20pIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSBOZXdXaXJlQ29udGV4dC5mcm9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBiZy5zdHJva2VTdHlsZSA9IE5ld1dpcmVDb250ZXh0LmZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpXG4gICAgICAgICAgICAgICAgPyBHRVRfQUNUSVZBVEVEX0NPTE9SKClcbiAgICAgICAgICAgICAgICA6IEdFVF9HUkFZX0NPTE9SKCk7XG5cbiAgICAgICAgICAgIGJnLmxpbmVXaWR0aCA9IDU7XG5cbiAgICAgICAgICAgIGJnLmxpbmVKb2luID0gXCJyb3VuZFwiO1xuXG4gICAgICAgICAgICBjb25zdCB4YXhpcyA9IGZyb20ueCArIGZyb20ud2lkdGggLyAyIC0gTW91c2VNYW5hZ2VyLm1vdXNlLng7XG4gICAgICAgICAgICBjb25zdCB5YXhpcyA9IGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMiAtIE1vdXNlTWFuYWdlci5tb3VzZS55O1xuXG4gICAgICAgICAgICBjb25zdCBwb2ludHM6IFtudW1iZXIsIG51bWJlcl1bXSA9XG4gICAgICAgICAgICAgICAgIXRoaXMuI0ZBTkNZX1dJUkVTIHx8IE1hdGguYWJzKHhheGlzKSA8IDEwIHx8IE1hdGguYWJzKHlheGlzKSA8IDEwXG4gICAgICAgICAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtNb3VzZU1hbmFnZXIubW91c2UueCwgTW91c2VNYW5hZ2VyLm1vdXNlLnldLFxuICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgOiBNYXRoLmFicyh4YXhpcykgPiBNYXRoLmFicyh5YXhpcylcbiAgICAgICAgICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtmcm9tLnggKyBmcm9tLndpZHRoIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW2Zyb20ueCArIGZyb20ud2lkdGggLyAyIC0geGF4aXMgLyAyLCBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbTW91c2VNYW5hZ2VyLm1vdXNlLnggKyB4YXhpcyAvIDIsIE1vdXNlTWFuYWdlci5tb3VzZS55XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW01vdXNlTWFuYWdlci5tb3VzZS54LCBNb3VzZU1hbmFnZXIubW91c2UueV0sXG4gICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW2Zyb20ueCArIGZyb20ud2lkdGggLyAyLCBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMiAtIHlheGlzIC8gMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtNb3VzZU1hbmFnZXIubW91c2UueCwgTW91c2VNYW5hZ2VyLm1vdXNlLnkgKyB5YXhpcyAvIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbTW91c2VNYW5hZ2VyLm1vdXNlLngsIE1vdXNlTWFuYWdlci5tb3VzZS55XSxcbiAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBwb2ludHMuc2xpY2UoMCwgLTEpLmZvckVhY2goKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICBiZy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBiZy5tb3ZlVG8oLi4ucG9pbnRzW2ldKTtcbiAgICAgICAgICAgICAgICBiZy5saW5lVG8oLi4ucG9pbnRzW2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgYmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICAgICAgYmcuc3Ryb2tlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgICBDYW52YXNNYW5hZ2VyLmFkZEpvYih0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgI0ZBTkNZX1dJUkVTID0gdHJ1ZTtcbiAgICBzdGF0aWMgI0ZBTkNJRVJfV0lSRVMgPSB0cnVlO1xuXG4gICAgc3RhdGljIGdldCBGQU5DWV9XSVJFUygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI0ZBTkNZX1dJUkVTO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgRkFOQ0lFUl9XSVJFUygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI0ZBTkNJRVJfV0lSRVM7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldCBGQU5DWV9XSVJFUyh2OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuI0ZBTkNZX1dJUkVTID0gdjtcblxuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJzZXR0aW5ncy5mYW5jeVdpcmVzXCIsIHRoaXMuI0ZBTkNZX1dJUkVTKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0IEZBTkNJRVJfV0lSRVModjogYm9vbGVhbikge1xuICAgICAgICB0aGlzLiNGQU5DSUVSX1dJUkVTID0gdjtcblxuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJzZXR0aW5ncy5mYW5jaWVyV2lyZXNcIiwgdGhpcy4jRkFOQ0lFUl9XSVJFUyk7XG4gICAgfVxuXG4gICAgc3RhdGljIHtcbiAgICAgICAgdGhpcy4jRkFOQ1lfV0lSRVMgPSBTdG9yYWdlTWFuYWdlci5nZXQoXCJzZXR0aW5ncy5mYW5jeVdpcmVzXCIpID8/IHRoaXMuI0ZBTkNZX1dJUkVTO1xuICAgICAgICB0aGlzLiNGQU5DSUVSX1dJUkVTID0gU3RvcmFnZU1hbmFnZXIuZ2V0KFwic2V0dGluZ3MuZmFuY2llcldpcmVzXCIpID8/IHRoaXMuI0ZBTkNJRVJfV0lSRVM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaW5zZXJ0IH0gZnJvbSBcIi4uL2NvbnRleHRtZW51L2luc2VydFwiO1xuaW1wb3J0IHsgaW8gfSBmcm9tIFwiLi4vY29udGV4dG1lbnUvaW9cIjtcbmltcG9ydCB7IFF1aWNrUGlja01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvUXVpY2tQaWNrTWFuYWdlclwiO1xuXG5leHBvcnQgY29uc3QgcXVpY2twaWNrQ29tcG9uZW50cyA9IChlOiBNb3VzZUV2ZW50KSA9PlxuICAgIFF1aWNrUGlja01hbmFnZXIuYWN0aXZhdGUoZSwgW1xuICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogXCJEaXNwbGF5XCIsXG4gICAgICAgICAgICBjYWxsYmFjayhlKSB7XG4gICAgICAgICAgICAgICAgaW5zZXJ0W1wiaW5zZXJ0LWNvbXBvbmVudFwiXS5jYWxsYmFjay5jYWxsKHVuZGVmaW5lZCwgZSwgXCJESVNQTEFZXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6IFwiT3V0cHV0XCIsXG4gICAgICAgICAgICBjYWxsYmFjayhlKSB7XG4gICAgICAgICAgICAgICAgaW9bXCJuZXctb3V0cHV0XCJdLmNhbGxiYWNrLmNhbGwodW5kZWZpbmVkLCBlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIklucHV0XCIsXG4gICAgICAgICAgICBjYWxsYmFjayhlKSB7XG4gICAgICAgICAgICAgICAgaW9bXCJuZXctaW5wdXRcIl0uY2FsbGJhY2suY2FsbCh1bmRlZmluZWQsIGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICBdKTtcbiIsImltcG9ydCB7IE9SSUdJTl9QT0lOVCB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFF1aWNrUGlja01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvUXVpY2tQaWNrTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHsgZ2F0ZXMgfSBmcm9tIFwiLi4vcmVpZmllZC9jaGlwc1wiO1xuXG5leHBvcnQgY29uc3QgcXVpY2twaWNrR2F0ZXMgPSAoZTogTW91c2VFdmVudCkgPT5cbiAgICBRdWlja1BpY2tNYW5hZ2VyLmFjdGl2YXRlKFxuICAgICAgICBlLFxuICAgICAgICBnYXRlcy5tYXAoKGdhdGUpID0+ICh7XG4gICAgICAgICAgICBsYWJlbDogZ2F0ZS5OQU1FLFxuICAgICAgICAgICAgY2FsbGJhY2soZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnQoUmVmbGVjdC5jb25zdHJ1Y3QoZ2F0ZSwgW10pLCBPUklHSU5fUE9JTlQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMoY29tcG9uZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShjb21wb25lbnQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIHBhcnNlRmxvYXQod2lkdGgpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZS5jbGllbnRZIC0gcGFyc2VGbG9hdChoZWlnaHQpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pKSxcbiAgICApO1xuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4uL2NpcmN1bGFyXCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBERUxBWSwgTE9DS0VEX0ZPUl9URVNUSU5HLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBSZWlmaWVkLCBjb21wdXRlVHJhbnNmb3JtT3JpZ2luLCBodG1sIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuaW1wb3J0IHsgQ2hpcCwgRXh0ZW5kZWRDaGlwIH0gZnJvbSBcIi4vY2hpcHNcIjtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudDxJIGV4dGVuZHMgbnVtYmVyLCBPIGV4dGVuZHMgbnVtYmVyPiBleHRlbmRzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IGVsZW1lbnQ7XG5cbiAgICBpbnB1dHM7XG4gICAgb3V0cHV0cztcbiAgICByZWFkb25seSBuYW1lO1xuXG4gICAgcmVhZG9ubHkgI29ic2VydmVycyA9IG5ldyBNYXA8RWxlbWVudCwgTXV0YXRpb25PYnNlcnZlcj4oKTtcbiAgICByZWFkb25seSAjbW91c2V1cHMgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51cyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY2xpY2tzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuXG4gICAgcmVhZG9ubHkgYmFzZTogQ2hpcDxJLCBPPjtcbiAgICBjaGlwOiBDaGlwPEksIE8+O1xuXG4gICAgI2FuZ2xlID0gMDtcblxuICAgICNjb21wbGVtZW50YXJ5ID0gZmFsc2U7XG5cbiAgICAjam9pbnMgPSAwO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGNoaXA6IENoaXA8SSwgTz4sXG4gICAgICAgIHBvczpcbiAgICAgICAgICAgIHwgeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH1cbiAgICAgICAgICAgIHwgKChjb21wOiBDb21wb25lbnQ8SSwgTz4pID0+IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IGNlbnRlcmVkPzogYm9vbGVhbiB9KSxcbiAgICAgICAgY29tcGxlbWVudGFyeSA9IGZhbHNlLFxuICAgICAgICBqb2lucyA9IGNoaXAuaW5wdXRzLFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuI2NvbXBsZW1lbnRhcnkgPSBjb21wbGVtZW50YXJ5O1xuICAgICAgICB0aGlzLiNqb2lucyA9IGpvaW5zO1xuXG4gICAgICAgIHRoaXMuYmFzZSA9IGNoaXA7XG4gICAgICAgIHRoaXMuY2hpcCA9XG4gICAgICAgICAgICB0aGlzLiNqb2lucyAhPT0gdGhpcy5iYXNlLmlucHV0c1xuICAgICAgICAgICAgICAgID8gbmV3IChDaGlwLmpvaW5lZCh0aGlzLmJhc2UuY29uc3RydWN0b3IgYXMgRXh0ZW5kZWRDaGlwPEksIE8+LCB0aGlzLiNqb2lucyBhcyBJKSkoKVxuICAgICAgICAgICAgICAgIDogdGhpcy5iYXNlO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dHNcIj5cbiAgICAgICAgICAgICAgICAgICAgJHtBcnJheSh0aGlzLmpvaW5zKS5maWxsKCc8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LWlucHV0LWJ1dHRvblwiPkk8L2J1dHRvbj4nKS5qb2luKFwiXCIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiY29tcG9uZW50LW5hbWVcIj4ke3RoaXMuY2hpcC5uYW1lfTwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LW91dHB1dHNcIj5cbiAgICAgICAgICAgICAgICAgICAgJHtBcnJheShjb21wbGVtZW50YXJ5ICYmIHRoaXMuY2hpcC5vdXRwdXRzID09PSAxID8gdGhpcy5jaGlwLm91dHB1dHMgKyAxIDogdGhpcy5jaGlwLm91dHB1dHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCI+TzwvYnV0dG9uPicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LWlucHV0LWJ1dHRvblwiKSk7XG4gICAgICAgIHRoaXMub3V0cHV0cyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCIpKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1uYW1lXCIpITtcblxuICAgICAgICB0aGlzLiN1cGRhdGVMaXN0ZW5lcnMoKTtcblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy51cGRhdGUoKSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHR5cGVvZiBwb3MgPT09IFwiZnVuY3Rpb25cIiA/IHBvcy5jYWxsKHVuZGVmaW5lZCwgdGhpcykgOiBwb3MpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3Qgb3V0ID0gdGhpcy5jaGlwLmV2YWx1YXRlKHRoaXMuaW5wdXRzLm1hcCgoaSkgPT4gaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpKTtcblxuICAgICAgICBhd2FpdCBERUxBWShcbiAgICAgICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWSArIE1hdGgucmFuZG9tKCkgKiAoMiAqIFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT04pIC0gUmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTixcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCB0aGlzLiNjb21wbGVtZW50YXJ5ICYmIGkgPT09IDEgPyAhb3V0WzBdIDogb3V0W2ldKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IGFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYW5nbGU7XG4gICAgfVxuXG4gICAgc2V0IGFuZ2xlKHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLiNhbmdsZSA9IHYgJSAzNjA7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVaKCR7dn1kZWcpYDtcblxuICAgICAgICAvLyByb3RhdGUgbmFtZSByaWdodHNpZGUgdXAgaWYgaXQncyB1cHNpZGUgZG93blxuICAgICAgICBpZiAodiA9PT0gMTgwKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVooJHt2fWRlZylgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5uYW1lLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbih0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuICAgIGdldCBjb21wbGVtZW50YXJ5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jY29tcGxlbWVudGFyeTtcbiAgICB9XG5cbiAgICBnZXQgam9pbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNqb2lucztcbiAgICB9XG5cbiAgICByb3RhdGUoYW5nbGU6IG51bWJlcikge1xuICAgICAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLiNhdHRhY2hMaXN0ZW5lcnMoKTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIud2F0Y2godGhpcy5lbGVtZW50LCB0aGlzLm5hbWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgc3VwZXIuZGV0YWNoKCk7XG5cbiAgICAgICAgdGhpcy4jZGVzdHJveUxpc3RlbmVycygpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5mb3JnZXQodGhpcy5lbGVtZW50LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAjdXBkYXRlTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLiNvYnNlcnZlcnMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI2NsaWNrcy5jbGVhcigpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlcnMuc2V0KGlucHV0LCBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI21vdXNldXBzLnNldChpbnB1dCwgKCkgPT4gaW5wdXQuYmx1cigpKTtcblxuICAgICAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldChpbnB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChmcm9tKSA9PiBuZXcgV2lyaW5nKGZyb20sIGlucHV0KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jbW91c2V1cHMuc2V0KG91dHB1dCwgKCkgPT4gb3V0cHV0LmJsdXIoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQob3V0cHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjcmVhdGUtY29ubmVjdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIGNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBcIlFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9wUHJvcGFnYXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOZXdXaXJlQ29udGV4dC5mcm9tID0gb3V0cHV0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IG91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUudG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKCh0bykgPT4gbmV3IFdpcmluZyhvdXRwdXQsIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy4jY2xpY2tzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVFcIikpIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldCh0aGlzLm5hbWUsICgpID0+IHtcbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAgLi4uKHRoaXMuY2hpcC5vdXRwdXRzID09PSAxXG4gICAgICAgICAgICAgICAgICAgID8gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNldC1pbnB1dHNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlNldCBpbnB1dHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IGF3YWl0IE1vZGFsTWFuYWdlci5wcm9tcHQoXCJFbnRlciB0aGUgbnVtYmVyIG9mIGlucHV0czpcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGpvaW5zID0gK2lucHV0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oam9pbnMpIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGpvaW5zKSB8fCBqb2lucyA8IHRoaXMuYmFzZS5pbnB1dHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgTnVtYmVyIG9mIGlucHV0cyBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHt0aGlzLmJhc2UuaW5wdXRzfS5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiNqb2lucyA9PT0gam9pbnMpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuI2pvaW5zO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0cyA9IFsuLi50aGlzLmlucHV0c107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkID0gdGhpcy5jaGlwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNqb2lucyA9IGpvaW5zO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jZGVzdHJveUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5yZW1vdmUoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cyA9IEFycmF5KGpvaW5zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsbCh1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKCkgPT4gaHRtbGA8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LWlucHV0LWJ1dHRvblwiPkk8L2J1dHRvbj5gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGljID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1pbnB1dHNcIikhO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaWMuYXBwZW5kQ2hpbGQoaSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNhdHRhY2hMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpcCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2pvaW5zICE9PSB0aGlzLmJhc2UuaW5wdXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IG5ldyAoQ2hpcC5qb2luZWQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhc2UuY29uc3RydWN0b3IgYXMgRXh0ZW5kZWRDaGlwPEksIE8+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jam9pbnMgYXMgSSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmJhc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2pvaW5zID0gcHJldmlvdXM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jZGVzdHJveUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5yZW1vdmUoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cyA9IGlucHV0cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGljID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1pbnB1dHNcIikhO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaWMuYXBwZW5kQ2hpbGQoaSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNhdHRhY2hMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpcCA9IG9sZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRvZ2dsZS1jb21wbGVtZW50YXJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDb21wbGVtZW50YXJ5IG91dHB1dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29tcGxlbWVudGFyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5vdXRwdXRzW3RoaXMub3V0cHV0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNjb21wbGVtZW50YXJ5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jZGVzdHJveUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNjb21wbGVtZW50YXJ5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW91dHB1dHNcIikhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kQ2hpbGQob3V0cHV0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgodG8pID0+IG5ldyBXaXJpbmcob3V0cHV0LCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gaHRtbGA8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LW91dHB1dC1idXR0b25cIj5PPC9idXR0b24+YDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jY29tcGxlbWVudGFyeSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jZGVzdHJveUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXRzXCIpIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZENoaWxkKG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi5jb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiN1cGRhdGVMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNhdHRhY2hMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jY29tcGxlbWVudGFyeSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi5jb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiN1cGRhdGVMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNhdHRhY2hMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgOiBbXSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInJvdGF0ZS1jb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUm90YXRlIGNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogXCJSXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUgKz0gOTA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUgLT0gOTA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbXBvbmVudFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBYXCIgOiBcIkN0cmwgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoaXMgY29tcG9uZW50IGlzIHBlcm1hbmVudCBhbmQgY2Fubm90IGJlIGRlbGV0ZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZSh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAjYXR0YWNoTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmdldChpbnB1dCkhLm9ic2VydmUoaW5wdXQsIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cHMuZ2V0KGlucHV0KSEpO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChpbnB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXBzLmdldChvdXRwdXQpISk7XG5cbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChvdXRwdXQpISk7XG5cbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jY2xpY2tzLmdldChvdXRwdXQpISk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubmFtZS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLm5hbWUpISk7XG4gICAgfVxuXG4gICAgI2Rlc3Ryb3lMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVycy5mb3JFYWNoKChvKSA9PiBvLmRpc2Nvbm5lY3QoKSk7XG5cbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy4jY2xpY2tzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMubmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLm5hbWUpISk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4uL2NpcmN1bGFyXCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBERUxBWSwgTE9DS0VEX0ZPUl9URVNUSU5HLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBSZWlmaWVkLCBjb21wdXRlVHJhbnNmb3JtT3JpZ2luLCBodG1sIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgRGlzcGxheSBleHRlbmRzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IGVsZW1lbnQ7XG5cbiAgICBpbnB1dHM7XG4gICAgb3V0cHV0cztcbiAgICByZWFkb25seSBkaXNwbGF5O1xuXG4gICAgcmVhZG9ubHkgI29ic2VydmVycyA9IG5ldyBNYXA8RWxlbWVudCwgTXV0YXRpb25PYnNlcnZlcj4oKTtcbiAgICByZWFkb25seSAjbW91c2V1cHMgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51cyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY2xpY2tzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuXG4gICAgI2JpdHM7XG4gICAgI3JhZGl4O1xuXG4gICAgI2FuZ2xlID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH0gPSB7IHg6IDAsIHk6IDAgfSwgYml0cyA9IDEsIHJhZGl4ID0gMTApIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLiNiaXRzID0gYml0cztcbiAgICAgICAgdGhpcy4jcmFkaXggPSByYWRpeDtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpc3BsYXlcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KGJpdHMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJkaXNwbGF5LWNvbnRlbnRcIj4wPC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KGJpdHMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiPk88L2J1dHRvbj4nKS5qb2luKFwiXCIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXQtYnV0dG9uXCIpKTtcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW91dHB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuZGlzcGxheS1jb250ZW50XCIpITtcblxuICAgICAgICB0aGlzLiN1cGRhdGVMaXN0ZW5lcnMoKTtcblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy51cGRhdGUoKSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHBvcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlKCkge1xuICAgICAgICBjb25zdCBvdXQgPSB0aGlzLmlucHV0cy5tYXAoKGkpID0+IGkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcblxuICAgICAgICBhd2FpdCBERUxBWShcbiAgICAgICAgICAgIFJlaWZpZWQuR0FURV9ERUxBWSArIE1hdGgucmFuZG9tKCkgKiAoMiAqIFJlaWZpZWQuR0FURV9ERUxBWV9WQVJJQVRJT04pIC0gUmVpZmllZC5HQVRFX0RFTEFZX1ZBUklBVElPTixcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dENvbnRlbnQgPSBvdXRcbiAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIsIGksIG4pID0+IGEgKyArYiAqIDIgKiogKG4ubGVuZ3RoIC0gaSAtIDEpLCAwKVxuICAgICAgICAgICAgLnRvU3RyaW5nKHRoaXMuI3JhZGl4KTtcblxuICAgICAgICBbLi4udGhpcy5vdXRwdXRzXS5yZXZlcnNlKCkuZm9yRWFjaCgob3V0cHV0LCBpKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBvdXRbaV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXQgYml0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2JpdHM7XG4gICAgfVxuXG4gICAgZ2V0IHJhZGl4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jcmFkaXg7XG4gICAgfVxuXG4gICAgZ2V0IGFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYW5nbGU7XG4gICAgfVxuXG4gICAgc2V0IGFuZ2xlKHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLiNhbmdsZSA9IHYgJSAzNjA7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVaKCR7dn1kZWcpYDtcblxuICAgICAgICBpZiAodiA9PT0gMTgwKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVooJHt2fWRlZylgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbih0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuICAgIHJvdGF0ZShhbmdsZTogbnVtYmVyKTogdGhpcyB7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQsIHRoaXMuZGlzcGxheSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgICN1cGRhdGVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVycy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy4jY2xpY2tzLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5zZXQoaW5wdXQsIG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudXBkYXRlLmJpbmQodGhpcykpKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2V1cHMuc2V0KGlucHV0LCAoKSA9PiBpbnB1dC5ibHVyKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KGlucHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgaW5wdXQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQob3V0cHV0LCAoKSA9PiBvdXRwdXQuYmx1cigpKTtcblxuICAgICAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNyZWF0ZS1jb25uZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDcmVhdGUgY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3BQcm9wYWdhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKHRvKSA9PiBuZXcgV2lyaW5nKG91dHB1dCwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLiNjbGlja3Muc2V0KG91dHB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiS2V5UVwiKSkgTmV3V2lyZUNvbnRleHQuZnJvbSA9IG91dHB1dDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KHRoaXMuZGlzcGxheSwgKCkgPT4ge1xuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwic2V0LWJpdHNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU2V0IGJpdHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiRW50ZXIgdGhlIG51bWJlciBvZiBiaXRzOlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5wdXQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpdHMgPSAraW5wdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGJpdHMpIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGJpdHMpIHx8IGJpdHMgPCAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTnVtYmVyIG9mIGJpdHMgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy4jYml0cyA9PT0gYml0cykgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLiNiaXRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dHMgPSBbLi4udGhpcy5pbnB1dHNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dHMgPSBbLi4udGhpcy5vdXRwdXRzXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jYml0cyA9IGJpdHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5yZW1vdmUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgobykgPT4gby5yZW1vdmUoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzID0gQXJyYXkoYml0cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsbCh1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoKSA9PiBodG1sYDxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPmApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheShiaXRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWxsKHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCgpID0+IGh0bWxgPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCI+TzwvYnV0dG9uPmApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpYyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXRzXCIpITtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9jID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXRzXCIpITtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaWMuYXBwZW5kQ2hpbGQoaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG8pID0+IG9jLmFwcGVuZENoaWxkKG8pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNiaXRzID0gcHJldmlvdXM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5yZW1vdmUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgobykgPT4gby5yZW1vdmUoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzID0gb3V0cHV0cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LWlucHV0c1wiKSE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtb3V0cHV0c1wiKSE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGljLmFwcGVuZENoaWxkKGkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvKSA9PiBvYy5hcHBlbmRDaGlsZChvKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNhdHRhY2hMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZXQtcmFkaXhcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU2V0IHJhZGl4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIkVudGVyIHRoZSBudW1iZXIgb2YgYml0czpcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYWRpeCA9ICtpbnB1dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4ocmFkaXgpIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKHJhZGl4KSB8fCByYWRpeCA8IDEgfHwgcmFkaXggPiAxNilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkRpc3BsYXkgcmFkaXggbXVzdCBiZSBhbiBpbnRlZ2VyIGZyb20gMSB0byAxNi5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy4jcmFkaXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3JhZGl4ID0gcmFkaXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNyYWRpeCA9IHByZXZpb3VzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJyb3RhdGUtY29tcG9uZW50XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlJvdGF0ZSBjb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2xlICs9IDkwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2xlIC09IDkwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggWFwiIDogXCJDdHJsIFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUEVSTUFORU5UKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGNvbXBvbmVudCBpcyBwZXJtYW5lbnQgYW5kIGNhbm5vdCBiZSBkZWxldGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgI2F0dGFjaExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5nZXQoaW5wdXQpIS5vYnNlcnZlKGlucHV0LCB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcImNsYXNzXCJdLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXBzLmdldChpbnB1dCkhKTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQoaW5wdXQpISk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwcy5nZXQob3V0cHV0KSEpO1xuXG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQob3V0cHV0KSEpO1xuXG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrcy5nZXQob3V0cHV0KSEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQodGhpcy5kaXNwbGF5KSEpO1xuICAgIH1cblxuICAgICNkZXN0cm95TGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLiNvYnNlcnZlcnMuZm9yRWFjaCgobykgPT4gby5kaXNjb25uZWN0KCkpO1xuXG4gICAgICAgIHRoaXMuI21vdXNldXBzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMuI2NsaWNrcy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQodGhpcy5kaXNwbGF5KSEpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jaXJjdWxhclwiO1xuaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgTE9DS0VEX0ZPUl9URVNUSU5HLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBSZWlmaWVkLCBodG1sIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCB9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGA8YnV0dG9uIGNsYXNzPVwiYm9hcmQtaW5wdXRcIj5JPC9idXR0b24+YDtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICByZWFkb25seSAjbW91c2V1cCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmJsdXIoKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI21vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnggPSBlLmNsaWVudFgudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQueSA9IGUuY2xpZW50WS50b1N0cmluZygpO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVFcIikpIHJldHVybiAoTmV3V2lyZUNvbnRleHQuZnJvbSA9IHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKE1hdGguaHlwb3QoZS5jbGllbnRYIC0gK3RoaXMuZWxlbWVudC5kYXRhc2V0LnghLCBlLmNsaWVudFkgLSArdGhpcy5lbGVtZW50LmRhdGFzZXQueSEpID4gMikgcmV0dXJuO1xuXG4gICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlID0gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgIWFjdGl2ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGFjdGl2ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY29udGV4dG1lbnUgPSAoKSA9PiB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjcmVhdGUtY29ubmVjdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUVwiLFxuICAgICAgICAgICAgICAgICAgICBzdG9wUHJvcGFnYXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBOZXdXaXJlQ29udGV4dC5mcm9tID0gdGhpcy5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWxldGUtaW5wdXRcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgaW5wdXRcIixcbiAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggWFwiIDogXCJDdHJsIFhcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBFUk1BTkVOVClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoaXMgaW5wdXQgaXMgcGVybWFuZW50IGFuZCBjYW5ub3QgYmUgZGVsZXRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZSh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gdGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKHRvKSA9PiBuZXcgV2lyaW5nKHRoaXMuZWxlbWVudCwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gdGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKHRvKSA9PiBuZXcgV2lyaW5nKHRoaXMuZWxlbWVudCwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSk7XG4gICAgfTtcblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgc3VwZXIuYXR0YWNoKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jY2xpY2spO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51KTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZm9yZ2V0KHRoaXMuZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4uL2NpcmN1bGFyXCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBMT0NLRURfRk9SX1RFU1RJTkcsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNsYXNzIE91dHB1dCBleHRlbmRzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IGVsZW1lbnQ7XG5cbiAgICByZWFkb25seSAjbW91c2V1cCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmJsdXIoKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51ID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiZGVsZXRlLW91dHB1dFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBvdXRwdXRcIixcbiAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggWFwiIDogXCJDdHJsIFhcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBFUk1BTkVOVClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoaXMgb3V0cHV0IGlzIHBlcm1hbmVudCBhbmQgY2Fubm90IGJlIGRlbGV0ZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChmcm9tKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRoaXMuZWxlbWVudCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gdGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoZnJvbSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0aGlzLmVsZW1lbnQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSk7XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH0gPSB7IHg6IDAsIHk6IDAgfSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGh0bWxgPGJ1dHRvbiBjbGFzcz1cImJvYXJkLW91dHB1dFwiPk88L2J1dHRvbj5gO1xuXG4gICAgICAgIHRoaXMubW92ZShwb3MpO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgc3VwZXIuYXR0YWNoKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51KTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIud2F0Y2godGhpcy5lbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHN1cGVyLmRldGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFdhdGNoZWRTZXQgfSBmcm9tIFwiLi4vYXVnbWVudHMvV2F0Y2hlZFNldFwiO1xuaW1wb3J0IHsgU0NVRkZFRF9VVUlEIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgU3RvcmFnZU1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU3RvcmFnZU1hbmFnZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWwodGVtcGxhdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IHVua25vd25bXSk6IEhUTUxFbGVtZW50O1xuZXhwb3J0IGZ1bmN0aW9uIGh0bWwoaHRtbDogc3RyaW5nKTogSFRNTEVsZW1lbnQ7XG5leHBvcnQgZnVuY3Rpb24gaHRtbCguLi5hcmdzOiBbc3RyaW5nXSB8IFtUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udW5rbm93bltdXSkge1xuICAgIGNvbnN0IFt0ZW1wbGF0ZSwgLi4udmFsdWVzXSA9IGFyZ3M7XG5cbiAgICBjb25zdCBodG1sID1cbiAgICAgICAgdHlwZW9mIHRlbXBsYXRlID09PSBcInN0cmluZ1wiID8gdGVtcGxhdGUgOiB0ZW1wbGF0ZS5yZWR1Y2UoKGh0bWwsIHMsIGkpID0+IGh0bWwgKyBzICsgKHZhbHVlc1tpXSA/PyBcIlwiKSwgXCJcIik7XG5cbiAgICByZXR1cm4gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKS5ib2R5LmNoaWxkTm9kZXNbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjc3ModGVtcGxhdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IHVua25vd25bXSk6IHN0cmluZztcbmV4cG9ydCBmdW5jdGlvbiBjc3MoY3NzOiBzdHJpbmcpOiBzdHJpbmc7XG5leHBvcnQgZnVuY3Rpb24gY3NzKC4uLmFyZ3M6IFtzdHJpbmddIHwgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi51bmtub3duW11dKSB7XG4gICAgY29uc3QgW3RlbXBsYXRlLCAuLi52YWx1ZXNdID0gYXJncztcblxuICAgIGNvbnN0IGNzcyA9XG4gICAgICAgIHR5cGVvZiB0ZW1wbGF0ZSA9PT0gXCJzdHJpbmdcIiA/IHRlbXBsYXRlIDogdGVtcGxhdGUucmVkdWNlKChjc3MsIHMsIGkpID0+IGNzcyArIHMgKyAodmFsdWVzW2ldID8/IFwiXCIpLCBcIlwiKTtcblxuICAgIHJldHVybiBjc3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCB0cmFuc2Zvcm0gfSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG5cbiAgICBpZiAodHJhbnNmb3JtICYmIHRyYW5zZm9ybSAhPT0gXCJub25lXCIpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdHJhbnNmb3JtLm1hdGNoKC9ebWF0cml4XFwoKC4rKVxcKSQvKT8uWzFdLnNwbGl0KFwiLCBcIik7XG5cbiAgICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2xhdGUgPSBcIlwiO1xuXG4gICAgICAgICAgICBjb25zdCBbYSwgYl0gPSB2YWx1ZXMubWFwKE51bWJlcik7XG5cbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKE1hdGgucm91bmQoTWF0aC5hdGFuMihiLCBhKSAqICgxODAgLyBNYXRoLlBJKSkgKyAzNjApICUgMzYwO1xuXG4gICAgICAgICAgICBpZiAoYW5nbGUgPT09IDAgfHwgYW5nbGUgPT09IDkwKSByZXR1cm4gcGFyc2VGbG9hdChoZWlnaHQpIC8gMiArIFwicHggXCIgKyBwYXJzZUZsb2F0KGhlaWdodCkgLyAyICsgXCJweFwiO1xuXG4gICAgICAgICAgICBpZiAoYW5nbGUgPT09IDE4MCkgcmV0dXJuIFwiY2VudGVyXCI7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNsYXRlID0gXCIwIFwiICsgKHBhcnNlRmxvYXQod2lkdGgpIC0gcGFyc2VGbG9hdChoZWlnaHQpKSArIFwicHhcIjtcblxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoaGVpZ2h0KSAvIDIgKyBcInB4IFwiICsgcGFyc2VGbG9hdChoZWlnaHQpIC8gMiArIFwicHhcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBcImNlbnRlclwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3ZlcmxhcHBlZEJvdW5kcyhyZWN0OiBET01SZWN0LCBmcm9tOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sIHRvOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pIHtcbiAgICBjb25zdCBib3VuZHMgPSB7XG4gICAgICAgIHg6IE1hdGgubWluKGZyb20ueCwgdG8ueCksXG4gICAgICAgIHk6IE1hdGgubWluKGZyb20ueSwgdG8ueSksXG4gICAgICAgIHdpZHRoOiBNYXRoLmFicyhmcm9tLnggLSB0by54KSxcbiAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhmcm9tLnkgLSB0by55KSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgcmVjdC54IDw9IGJvdW5kcy54ICsgYm91bmRzLndpZHRoICYmXG4gICAgICAgIHJlY3QueCArIHJlY3Qud2lkdGggPj0gYm91bmRzLnggJiZcbiAgICAgICAgcmVjdC55IDw9IGJvdW5kcy55ICsgYm91bmRzLmhlaWdodCAmJlxuICAgICAgICByZWN0LnkgKyByZWN0LmhlaWdodCA+PSBib3VuZHMueVxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChlOiBFdmVudCkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IHV1aWQgPSBTQ1VGRkVEX1VVSUQoKTtcblxuICAgIHByb3RlY3RlZCBQRVJNQU5FTlQgPSBmYWxzZTtcblxuICAgIHN0YXRpYyBhY3RpdmUgPSBuZXcgV2F0Y2hlZFNldDxSZWlmaWVkPigpO1xuXG4gICAgc3RhdGljIGdldCByb290KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIucmVpZmllZC1yb290XCIpITtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCByZWFkb25seSBlbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgIG1vdmUoeyB4LCB5LCBjZW50ZXJlZCwgcmVsYXRpdmUgfTogeyB4PzogbnVtYmVyOyB5PzogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW47IHJlbGF0aXZlPzogYm9vbGVhbiB9KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHBhcnNlRmxvYXQodGhpcy5lbGVtZW50LnN0eWxlLmxlZnQpICsgKHggPz8gMCkgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gcGFyc2VGbG9hdCh0aGlzLmVsZW1lbnQuc3R5bGUudG9wKSArICh5ID8/IDApICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB4ICE9PSBcInVuZGVmaW5lZFwiKSB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHggKyBcInB4XCI7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHkgIT09IFwidW5kZWZpbmVkXCIpIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB5ICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNlbnRlcmVkKVxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRvcCwgbGVmdCwgd2lkdGgsIGhlaWdodCB9ID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChsZWZ0KSAtIHBhcnNlRmxvYXQod2lkdGgpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdCh0b3ApIC0gcGFyc2VGbG9hdChoZWlnaHQpIC8gMixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgUmVpZmllZC5yb290LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGVybWFuZW50KCkge1xuICAgICAgICB0aGlzLlBFUk1BTkVOVCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IHBlcm1hbmVuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlBFUk1BTkVOVDtcbiAgICB9XG5cbiAgICBnZXQgcG9zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcGFyc2VGbG9hdCh0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICB5OiBwYXJzZUZsb2F0KHRoaXMuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyAjR0FURV9ERUxBWSA9IDEwMDtcbiAgICBzdGF0aWMgI0dBVEVfREVMQVlfVkFSSUFUSU9OID0gMjU7XG5cbiAgICBzdGF0aWMgZ2V0IEdBVEVfREVMQVkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNHQVRFX0RFTEFZO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgR0FURV9ERUxBWV9WQVJJQVRJT04oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNHQVRFX0RFTEFZX1ZBUklBVElPTjtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0IEdBVEVfREVMQVkodjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuI0dBVEVfREVMQVkgPSB2O1xuXG4gICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcInNldHRpbmdzLmdhdGVEZWxheVwiLCB0aGlzLiNHQVRFX0RFTEFZKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0IEdBVEVfREVMQVlfVkFSSUFUSU9OKHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLiNHQVRFX0RFTEFZX1ZBUklBVElPTiA9IHY7XG5cbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFwic2V0dGluZ3MuZ2F0ZURlbGF5VmFyaWF0aW9uXCIsIHRoaXMuI0dBVEVfREVMQVlfVkFSSUFUSU9OKTtcbiAgICB9XG5cbiAgICBzdGF0aWMge1xuICAgICAgICB0aGlzLiNHQVRFX0RFTEFZID0gU3RvcmFnZU1hbmFnZXIuZ2V0KFwic2V0dGluZ3MuZ2F0ZURlbGF5XCIpID8/IHRoaXMuI0dBVEVfREVMQVk7XG4gICAgICAgIHRoaXMuI0dBVEVfREVMQVlfVkFSSUFUSU9OID0gU3RvcmFnZU1hbmFnZXIuZ2V0KFwic2V0dGluZ3MuZ2F0ZURlbGF5VmFyaWF0aW9uXCIpID8/IHRoaXMuI0dBVEVfREVMQVlfVkFSSUFUSU9OO1xuICAgIH1cbn1cbiIsInR5cGUgQm9vbGVhblR1cGxlPEwgZXh0ZW5kcyBudW1iZXIsIFIgZXh0ZW5kcyBib29sZWFuW10gPSBbXT4gPSBudW1iZXIgZXh0ZW5kcyBMXG4gICAgPyBib29sZWFuW11cbiAgICA6IFJbXCJsZW5ndGhcIl0gZXh0ZW5kcyBMXG4gICAgPyBSXG4gICAgOiBCb29sZWFuVHVwbGU8TCwgWy4uLlIsIGJvb2xlYW5dPjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENoaXA8SSBleHRlbmRzIG51bWJlciwgTyBleHRlbmRzIG51bWJlcj4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FOiBzdHJpbmc7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUzogbnVtYmVyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTOiBudW1iZXI7XG5cbiAgICByZWFkb25seSBuYW1lO1xuXG4gICAgcmVhZG9ubHkgaW5wdXRzO1xuICAgIHJlYWRvbmx5IG91dHB1dHM7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGlucHV0czogSSwgb3V0cHV0czogTykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmlucHV0cyA9IGlucHV0cztcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gb3V0cHV0cztcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBvdXRwdXQoaW5wdXRzOiBCb29sZWFuVHVwbGU8ST4pOiBCb29sZWFuVHVwbGU8Tz47XG5cbiAgICBldmFsdWF0ZShpbnB1dHM6IGJvb2xlYW5bXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vdXRwdXQoaW5wdXRzIGFzIEJvb2xlYW5UdXBsZTxJLCBbXT4pIGFzIGJvb2xlYW5bXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgam9pbmVkPEkgZXh0ZW5kcyBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXIsIE4gZXh0ZW5kcyBudW1iZXI+KFxuICAgICAgICBjaGlwOiBFeHRlbmRlZENoaXA8SSwgTz4sXG4gICAgICAgIG46IE4sXG4gICAgKTogRXh0ZW5kZWRDaGlwPE4sIE8+IHtcbiAgICAgICAgLy8gZ2F0ZXMgc2hvdWxkIGhhdmUgYXQgbGVhc3Qgb25lIGlucHV0IGFuZCBvbmUgb3V0cHV0XG4gICAgICAgIGlmIChjaGlwLklOUFVUUyA8IDEgfHwgY2hpcC5PVVRQVVRTIDwgMSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgY2hpcFwiKTtcblxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBpbnB1dCB0aGVuIGl0J3MganVzdCBhIGJ1ZmZlciBnYXRlXG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZSBpZiBjaGlwIGlzIGEgbm90IGdhdGUsIHRoZW4gaXQncyBqdXN0IGEgbm90IGdhdGVcbiAgICAgICAgaWYgKG4gPT09IDEpIHJldHVybiAoY2hpcCBpbnN0YW5jZW9mIE5vdEdhdGUgPyBOb3RHYXRlIDogQnVmZmVyR2F0ZSkgYXMgRXh0ZW5kZWRDaGlwPE4sIE8+O1xuXG4gICAgICAgIHJldHVybiBjbGFzcyBleHRlbmRzIENoaXA8TiwgTz4ge1xuICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBjaGlwLk5BTUU7XG4gICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gbjtcbiAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gY2hpcC5PVVRQVVRTO1xuXG4gICAgICAgICAgICAjY2hpcHMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBuIC0gMSB9LCAoKSA9PiBuZXcgY2hpcCgpKTtcblxuICAgICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAgICAgc3VwZXIoY2hpcC5OQU1FLCBuLCBjaGlwLk9VVFBVVFMgYXMgTyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG91dHB1dChpbnB1dHM6IGJvb2xlYW5bXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiNjaGlwc1xuICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChvdXRwdXQsIGNoaXAsIGkpID0+IGNoaXAub3V0cHV0KFtpbnB1dHNbaSArIGNoaXAuaW5wdXRzXSwgLi4ub3V0cHV0XSBhcyBCb29sZWFuVHVwbGU8ST4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jY2hpcHNbMF0ub3V0cHV0KGlucHV0cy5zbGljZSgwLCBjaGlwLklOUFVUUykgYXMgQm9vbGVhblR1cGxlPEk+KSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBbmRHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkFORFwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkFORFwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gW2EgJiYgYl07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgT3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk9SXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFthIHx8IGJdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vdEdhdGUgZXh0ZW5kcyBDaGlwPDEsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiTk9UXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDE7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiTk9UXCIsIDEsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbbl06IFtib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbIW5dO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5hbmRHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk5BTkRcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJOQU5EXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbIShhICYmIGIpXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk5PUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk5PUlwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyEoYSB8fCBiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgWG9yR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJYT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJYT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshISgrYSBeICtiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgWG5vckdhdGUgZXh0ZW5kcyBDaGlwPDIsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiWE5PUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlhOT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshKCthIF4gK2IpXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCdWZmZXJHYXRlIGV4dGVuZHMgQ2hpcDwxLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkJVRlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAxO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkJVRkZFUlwiLCAxLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW25dOiBbYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gW25dO1xuICAgIH1cbn1cblxudHlwZSBTdGF0aWNNZW1iZXJzPFQ+ID0geyBbSyBpbiBrZXlvZiBUXTogVFtLXSB9O1xuXG5leHBvcnQgdHlwZSBFeHRlbmRlZENoaXA8SSBleHRlbmRzIG51bWJlciA9IG51bWJlciwgTyBleHRlbmRzIG51bWJlciA9IG51bWJlcj4gPSBTdGF0aWNNZW1iZXJzPHR5cGVvZiBDaGlwPEksIE8+PiAmIHtcbiAgICBuZXcgKCk6IENoaXA8SSwgTz47XG59O1xuXG5leHBvcnQgY29uc3QgZ2F0ZXMgPSBbQW5kR2F0ZSwgT3JHYXRlLCBOb3RHYXRlLCBOYW5kR2F0ZSwgTm9yR2F0ZSwgWG9yR2F0ZSwgWG5vckdhdGUsIEJ1ZmZlckdhdGVdIGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgY2hpcHMgPSBuZXcgTWFwPHN0cmluZywgRXh0ZW5kZWRDaGlwPihnYXRlcy5tYXAoKGdhdGUpID0+IFtnYXRlLk5BTUUsIGdhdGVdKSk7XG5cbmNoaXBzLnNldChcIkJVRkZcIiwgQnVmZmVyR2F0ZSk7XG5jaGlwcy5zZXQoXCJCVUZGRVJcIiwgQnVmZmVyR2F0ZSk7XG5cbmV4cG9ydCBjbGFzcyBIYWxmQWRkZXJHYXRlIGV4dGVuZHMgQ2hpcDwyLCAyPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkhBTEZBRERFUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkhBRERcIiwgMiwgMik7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW4sIGJvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshISgrYSBeICtiKSwgYSAmJiBiXTtcbiAgICB9XG59XG5cbmNoaXBzLnNldChIYWxmQWRkZXJHYXRlLk5BTUUsIEhhbGZBZGRlckdhdGUpO1xuY2hpcHMuc2V0KFwiSEFERFwiLCBIYWxmQWRkZXJHYXRlKTtcblxuZXhwb3J0IGNsYXNzIEZ1bGxBZGRlckdhdGUgZXh0ZW5kcyBDaGlwPDMsIDI+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiRlVMTEFEREVSXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDM7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiRkFERFwiLCAzLCAyKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGIsIGNdOiBbYm9vbGVhbiwgYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbiwgYm9vbGVhbl0ge1xuICAgICAgICAvLyAoYSB4b3IgYikgeG9yIGNcbiAgICAgICAgLy8gKChhIHhvciBiKSBhbmQgYykgb3IgKGEgYW5kIGIpXG4gICAgICAgIHJldHVybiBbISEoKyEhKCthIF4gK2IpIF4gK2MpLCAoISEoK2EgXiArYikgJiYgYykgfHwgKGEgJiYgYildO1xuICAgIH1cbn1cblxuY2hpcHMuc2V0KEZ1bGxBZGRlckdhdGUuTkFNRSwgRnVsbEFkZGVyR2F0ZSk7XG5jaGlwcy5zZXQoXCJGQUREXCIsIEZ1bGxBZGRlckdhdGUpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciB3ZWJwYWNrUXVldWVzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBxdWV1ZXNcIikgOiBcIl9fd2VicGFja19xdWV1ZXNfX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgd2VicGFja0Vycm9yID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKSA6IFwiX193ZWJwYWNrX2Vycm9yX19cIjtcbnZhciByZXNvbHZlUXVldWUgPSAocXVldWUpID0+IHtcblx0aWYocXVldWUgJiYgIXF1ZXVlLmQpIHtcblx0XHRxdWV1ZS5kID0gMTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSkpO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tID8gZm4ucisrIDogZm4oKSkpO1xuXHR9XG59XG52YXIgd3JhcERlcHMgPSAoZGVwcykgPT4gKGRlcHMubWFwKChkZXApID0+IHtcblx0aWYoZGVwICE9PSBudWxsICYmIHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZihkZXBbd2VicGFja1F1ZXVlc10pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0cXVldWUuZCA9IDA7XG5cdFx0XHRkZXAudGhlbigocikgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0V4cG9ydHNdID0gcjtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0sIChlKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXJyb3JdID0gZTtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG9iaiA9IHt9O1xuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdHZhciByZXQgPSB7fTtcblx0cmV0W3dlYnBhY2tRdWV1ZXNdID0geCA9PiB7fTtcblx0cmV0W3dlYnBhY2tFeHBvcnRzXSA9IGRlcDtcblx0cmV0dXJuIHJldDtcbn0pKTtcbl9fd2VicGFja19yZXF1aXJlX18uYSA9IChtb2R1bGUsIGJvZHksIGhhc0F3YWl0KSA9PiB7XG5cdHZhciBxdWV1ZTtcblx0aGFzQXdhaXQgJiYgKChxdWV1ZSA9IFtdKS5kID0gMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NhZC9lbXBsb3llZS50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==