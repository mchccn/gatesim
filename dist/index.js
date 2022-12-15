/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _contextmenu_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contextmenu/menu */ "./src/contextmenu/menu.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files */ "./src/files.ts");
/* harmony import */ var _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./keybinds/keybinds */ "./src/keybinds/keybinds.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _premade__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./premade */ "./src/premade/index.ts");
/* harmony import */ var _styling_attacher__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styling/attacher */ "./src/styling/attacher.ts");









Object.assign(globalThis, _constants__WEBPACK_IMPORTED_MODULE_0__);
await (0,_styling_attacher__WEBPACK_IMPORTED_MODULE_7__.attachStyles)(["style", "component", "io", "contextmenu", "toast", "modals", "buttons", "darkmode", "quickpick"]);
const hrefAsUrl = new URL(location.href);
const shouldLoadInline = hrefAsUrl.searchParams.get("inline");
if (shouldLoadInline) {
    try {
        const inlined = atob(shouldLoadInline);
        const { error, result: [settings, components, wirings], } = (0,_files__WEBPACK_IMPORTED_MODULE_2__.fromFile)(inlined);
        if (error)
            throw new Error(error);
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({ keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_3__.keybinds, menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_1__.menu, initial: [components, wirings] });
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.applyRawSettings(settings);
    }
    catch {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({ keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_3__.keybinds, menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_1__.menu, save: "sandbox" });
        _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
            message: "Diagram is not correctly encoded.",
            color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
            duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
        });
        hrefAsUrl.searchParams.delete("inline");
        history.pushState(undefined, "", hrefAsUrl);
    }
}
else {
    const save = hrefAsUrl.searchParams.get("save");
    if (save) {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({ keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_3__.keybinds, menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_1__.menu, save });
    }
    else {
        const shouldLoadPremade = hrefAsUrl.searchParams.get("premade");
        if (shouldLoadPremade && _premade__WEBPACK_IMPORTED_MODULE_6__.premade.has(shouldLoadPremade.trim().toLowerCase())) {
            _premade__WEBPACK_IMPORTED_MODULE_6__.premade.get(shouldLoadPremade.trim().toLowerCase())({ name: shouldLoadPremade.trim().toLowerCase() });
        }
        else {
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({ keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_3__.keybinds, menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_1__.menu, save: "sandbox" });
            if (shouldLoadPremade) {
                _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
                    message: "No premades were found with that name.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                });
                hrefAsUrl.searchParams.delete("premade");
                history.pushState(undefined, "", hrefAsUrl);
            }
        }
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/augments/WatchedSet.ts":
/*!************************************!*\
  !*** ./src/augments/WatchedSet.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./src/cad/boss.ts":
/*!*************************!*\
  !*** ./src/cad/boss.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Boss": () => (/* binding */ Boss)
/* harmony export */ });
class Boss {
    #table;
    #worker;
    #ongens = new Set();
    constructor(table) {
        this.#table = table;
        this.#worker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_cad_employee_ts"), __webpack_require__.b));
    }
    ongen(run) {
        this.#ongens.add(run);
        return this;
    }
    offgen(run) {
        this.#ongens.delete(run);
        return this;
    }
    async work() {
        this.#worker.postMessage(this.#table);
        return new Promise((resolve, reject) => {
            this.#worker.addEventListener("message", (e) => {
                const data = e.data;
                if (data.code === "ERROR") {
                    this.#worker.terminate();
                    return reject(data.error);
                }
                if (data.code === "GENERATION") {
                    return this.#ongens.forEach((run) => run.call(undefined, data.message));
                }
                if (data.code === "FINISHED") {
                    return resolve(data.message);
                }
            });
        });
    }
    async fired() {
        this.#worker.terminate();
    }
}


/***/ }),

/***/ "./src/cad/elements/CADOutput.ts":
/*!***************************************!*\
  !*** ./src/cad/elements/CADOutput.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CADOutput": () => (/* binding */ CADOutput)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../reified/Reified */ "./src/reified/Reified.ts");

class CADOutput extends HTMLElement {
    element;
    constructor() {
        super();
        this.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `<div class="cad-output"></div>`);
        this.element = this.querySelector(".cad-output");
    }
}
customElements.define("cad-output", CADOutput);


/***/ }),

/***/ "./src/cad/elements/TruthTable.ts":
/*!****************************************!*\
  !*** ./src/cad/elements/TruthTable.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TruthTable": () => (/* binding */ TruthTable)
/* harmony export */ });
/* harmony import */ var _managers_StorageManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../managers/StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../files */ "./src/cad/files.ts");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../table */ "./src/cad/table.ts");




class TruthTable extends HTMLElement {
    asynconpaste;
    #input;
    #highlight;
    #import;
    #export;
    #value = "";
    constructor() {
        super();
        this.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_1__.html `
            <div class="truth-table">
                <pre>
                    <code class="input-highlight"></code>
                </pre>
                <textarea class="table-input" spellcheck="false" autocapitalize="off"></textarea>
                <div class="buttons">
                    <button class="cad-control">Go</button>
                    <button class="import-table">Import table</button>
                    <button class="export-table">Export table</button>
                </div>
            </div>
        `);
        this.#input = this.querySelector(".table-input");
        this.#highlight = this.querySelector(".input-highlight");
        this.#import = this.querySelector(".import-table");
        this.#export = this.querySelector(".export-table");
        this.#import.addEventListener("click", async () => {
            const txt = await (0,_files__WEBPACK_IMPORTED_MODULE_2__.fileInput)();
            if (txt)
                this.value = txt;
        });
        this.#export.addEventListener("click", () => {
            (0,_files__WEBPACK_IMPORTED_MODULE_2__.downloadFile)([this.value]);
        });
        requestAnimationFrame(() => {
            if (!_managers_StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.has("cad:input"))
                _managers_StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.set("cad:input", "");
            this.value = _managers_StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.get("cad:input");
            this.#highlightInput();
            this.#syncSizes();
            this.#input.addEventListener("keypress", (e) => {
                if (!["0", "1", ":", " "].includes(e.key) && e.code !== "Enter")
                    return e.preventDefault();
            });
            this.#input.addEventListener("paste", async (e) => {
                e.preventDefault();
                const text = await navigator.clipboard.readText();
                if (!/[^01:\s]/.test(text)) {
                    (0,_table__WEBPACK_IMPORTED_MODULE_3__.typeInTextarea)(text, this.#input);
                    this.#update();
                    this.#input.blur();
                    this.#input.focus();
                    this.asynconpaste?.();
                }
            });
            this.#input.addEventListener("change", () => {
                this.#update();
            });
            this.#input.addEventListener("input", () => {
                this.#update();
            });
            this.#input.addEventListener("scroll", () => {
                this.#syncSizes();
                this.#highlight.scrollTop = this.#input.scrollTop;
                this.#highlight.scrollLeft = this.#input.scrollLeft;
            });
            window.addEventListener("resize", () => {
                this.#syncSizes();
            });
        });
    }
    #update() {
        this.value = this.#input.value;
        _managers_StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.set("cad:input", this.#value);
        this.#highlightInput();
        this.#syncSizes();
    }
    #syncSizes() {
        const style = getComputedStyle(this.#input);
        this.#highlight.style.width = style.width;
        this.#highlight.style.maxHeight = style.height;
    }
    #highlightInput() {
        this.#highlight.innerHTML = this.#input.value
            .replaceAll(":", '<span style="color: gray;">:</span>')
            .replaceAll("0", '<span style="color: red;">0</span>')
            .replaceAll("1", '<span style="color: blue;">1</span>');
        if (this.#input.value.endsWith("\n"))
            this.#highlight.innerHTML += `<span style="display: block; height: 16px;"></span>`;
    }
    get value() {
        return this.#value;
    }
    set value(v) {
        this.#value = v;
        this.#input.value = v;
    }
    get element() {
        return this.#input;
    }
}
customElements.define("truth-table", TruthTable);


/***/ }),

/***/ "./src/cad/files.ts":
/*!**************************!*\
  !*** ./src/cad/files.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "downloadFile": () => (/* binding */ downloadFile),
/* harmony export */   "fileInput": () => (/* binding */ fileInput)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");


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
async function downloadFile(contents) {
    Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(new Blob(contents, {
            type: "text/plain",
        })),
        download: "table.gatesim.txt",
    }).click();
}


/***/ }),

/***/ "./src/cad/index.ts":
/*!**************************!*\
  !*** ./src/cad/index.ts ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _styling_attacher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styling/attacher */ "./src/styling/attacher.ts");
/* harmony import */ var _boss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./boss */ "./src/cad/boss.ts");
/* harmony import */ var _elements_CADOutput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./elements/CADOutput */ "./src/cad/elements/CADOutput.ts");
/* harmony import */ var _elements_TruthTable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./elements/TruthTable */ "./src/cad/elements/TruthTable.ts");
/* harmony import */ var _output__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./output */ "./src/cad/output.ts");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./table */ "./src/cad/table.ts");








await (0,_styling_attacher__WEBPACK_IMPORTED_MODULE_2__.attachStyles)(["style", "cad", "darkmode", "toast"]);
const table = _reified_Reified__WEBPACK_IMPORTED_MODULE_1__.html `<truth-table></truth-table>`;
const output = _reified_Reified__WEBPACK_IMPORTED_MODULE_1__.html `<cad-output></cad-output>`;
document.body.appendChild(table);
document.body.appendChild(output);
document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_1__.html `<div class="toasts-container"></div>`);
await (0,_constants__WEBPACK_IMPORTED_MODULE_0__.DELAY)();
table.element.addEventListener("input", () => {
    (0,_output__WEBPACK_IMPORTED_MODULE_6__.displayHeuristics)(table, output);
});
table.asynconpaste = () => (0,_output__WEBPACK_IMPORTED_MODULE_6__.displayHeuristics)(table, output);
(0,_output__WEBPACK_IMPORTED_MODULE_6__.displayHeuristics)(table, output);
const control = table.querySelector(".cad-control");
let boss;
function finished() {
    if (boss) {
        boss.fired();
        boss = undefined;
    }
    control.textContent = "Go";
}
control.addEventListener("click", async () => {
    if (control.textContent === "Stop") {
        table.element.disabled = false;
        finished();
    }
    else {
        table.element.disabled = true;
        output.element.innerHTML = "";
        boss = new _boss__WEBPACK_IMPORTED_MODULE_3__.Boss((0,_table__WEBPACK_IMPORTED_MODULE_7__.parseTable)(table.value));
        boss.ongen((message) => {
            output.element.textContent += (output.element.textContent ? "\n" : "") + message;
        })
            .work()
            .then((message) => {
            console.log(message);
        })
            .catch((e) => {
            output.element.textContent = e;
        })
            .finally(() => finished());
        control.textContent = "Stop";
    }
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/cad/output.ts":
/*!***************************!*\
  !*** ./src/cad/output.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "displayHeuristics": () => (/* binding */ displayHeuristics)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./table */ "./src/cad/table.ts");


function displayHeuristics(table, output) {
    const heuristics = (0,_table__WEBPACK_IMPORTED_MODULE_1__.validTable)(table.value);
    output.element.innerHTML = "";
    if (heuristics.length) {
        heuristics
            .sort((a, b) => {
            if (typeof a.row === "undefined" && typeof b.row === "undefined")
                return a.message > b.message ? -1 : 1;
            if (typeof a.row === "number" && typeof b.row === "number")
                return a.row - b.row;
            return typeof a.row === "undefined" ? -1 : 1;
        })
            .forEach((h) => {
            output.element.appendChild(Object.assign(_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `<div class="cad-heuristic"></div>`, {
                textContent: `${typeof h.row === "undefined" ? "Table:" : `Row ${h.row}`} ${h.message}`,
            }));
        });
    }
    table.querySelector(".cad-control").disabled = !!heuristics.length;
}


/***/ }),

/***/ "./src/cad/table.ts":
/*!**************************!*\
  !*** ./src/cad/table.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseTable": () => (/* binding */ parseTable),
/* harmony export */   "typeInTextarea": () => (/* binding */ typeInTextarea),
/* harmony export */   "validTable": () => (/* binding */ validTable)
/* harmony export */ });
function typeInTextarea(content, element) {
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const text = element.value;
    const before = text.slice(0, start);
    const after = text.slice(end, text.length);
    element.value = before + content + after;
    element.selectionStart = start + content.length;
    element.selectionEnd = start + content.length;
    return element.focus();
}
function validTable(string) {
    const heuristics = [];
    if (!string.trim())
        return heuristics;
    const rows = string
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const definedParts = rows[0].split(":");
    const definedInputs = definedParts[0]?.length ?? 0;
    const definedOutputs = definedParts[1]?.length ?? 0;
    rows.forEach((row, i) => {
        const rowParts = row.split(":");
        if (rowParts.length !== 2)
            heuristics.push({ row: i + 1, message: "needs exactly 2 columns" });
        const rowInputs = rowParts[0]?.length ?? 0;
        const rowOutputs = rowParts[1]?.length ?? 0;
        if (rowInputs !== definedInputs)
            heuristics.push({ row: i + 1, message: `must have ${definedInputs} inputs` });
        if (rowOutputs !== definedOutputs)
            heuristics.push({ row: i + 1, message: `must have ${definedOutputs} outputs` });
    });
    if (rows.length !== Math.pow(2, definedInputs))
        heuristics.push({
            message: `${Math.pow(2, definedInputs)} entries are needed for ${definedInputs} inputs, but ${rows.length} were given`,
        });
    const inputs = rows.map((row) => row.split(":")?.[0]).filter(Boolean);
    if (inputs.length !== new Set(inputs).size)
        heuristics.push({
            message: "can't have duplicate entries",
        });
    return heuristics;
}
function parseTable(string) {
    return string
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((row) => row.split(":").map((io) => io.split("").map((bit) => !!+bit)));
}


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACTIVATED_CSS_COLOR": () => (/* binding */ ACTIVATED_CSS_COLOR),
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
/* harmony export */   "GET_FOREGROUND_CANVAS_CTX": () => (/* binding */ GET_FOREGROUND_CANVAS_CTX),
/* harmony export */   "GET_GRAY_COLOR": () => (/* binding */ GET_GRAY_COLOR),
/* harmony export */   "GRID_SIZE": () => (/* binding */ GRID_SIZE),
/* harmony export */   "INPUT_COMPONENT_CSS_SIZE": () => (/* binding */ INPUT_COMPONENT_CSS_SIZE),
/* harmony export */   "IN_DEBUG_MODE": () => (/* binding */ IN_DEBUG_MODE),
/* harmony export */   "IS_CAD_APP": () => (/* binding */ IS_CAD_APP),
/* harmony export */   "IS_MAC_OS": () => (/* binding */ IS_MAC_OS),
/* harmony export */   "KINDA_DARK_GRAY_CSS_COLOR": () => (/* binding */ KINDA_DARK_GRAY_CSS_COLOR),
/* harmony export */   "KINDA_LIGHT_GRAY_CSS_COLOR": () => (/* binding */ KINDA_LIGHT_GRAY_CSS_COLOR),
/* harmony export */   "LIGHTER_GRAY_CSS_COLOR": () => (/* binding */ LIGHTER_GRAY_CSS_COLOR),
/* harmony export */   "LIGHT_GRAY_CSS_COLOR": () => (/* binding */ LIGHT_GRAY_CSS_COLOR),
/* harmony export */   "LOCKED_FOR_TESTING": () => (/* binding */ LOCKED_FOR_TESTING),
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
const IS_MAC_OS = [navigator.userAgentData?.platform, navigator.platform].some((platform) => platform?.toLowerCase().includes("mac") ?? false);
const LOCKED_FOR_TESTING = () => _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("The diagram is currently locked for testing. No changes can be made.");
const DELAY = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay));
const GET_BACKGROUND_CANVAS_CTX = () => document.querySelector("canvas.background-canvas").getContext("2d");
const GET_FOREGROUND_CANVAS_CTX = () => document.querySelector("canvas.foreground-canvas").getContext("2d");
const COUNTER_GENERATOR = function* (i = 0) {
    while (true)
        yield i++;
};
const SCUFFED_UUID = () => Date.now().toString(36) + Number(Date.now().toString().split("").reverse().join("")).toString(36);
const ROUND_TO_NEAREST = (x, n) => Math.round(x / n) * n;
const GET_ACTIVATED_COLOR = () => (_managers_DarkmodeManager__WEBPACK_IMPORTED_MODULE_0__.DarkmodeManager.enabled ? DARK_ACTIVATED_CSS_COLOR : ACTIVATED_CSS_COLOR);
const GET_GRAY_COLOR = () => _managers_DarkmodeManager__WEBPACK_IMPORTED_MODULE_0__.DarkmodeManager.enabled ? ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR : LIGHT_GRAY_CSS_COLOR;
const ACTIVATED_CSS_COLOR = "#ff2626";
const DARK_ACTIVATED_CSS_COLOR = "#dd1111";
const EVEN_DARKER_GRAY_CSS_COLOR = "#0a0a0c";
const SLIGHTLY_DARKER_GRAY_CSS_COLOR = "#101012";
const DARKER_GRAY_CSS_COLOR = "#16161f";
const DARK_GRAY_CSS_COLOR = "#1c1c24";
const KINDA_DARK_GRAY_CSS_COLOR = "#24242e";
const NOT_REALLY_DARK_GRAY_CSS_COLOR = "#2e2e3f";
const ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR = "#3c3c4f";
const SUPER_GRAY_CSS_COLOR = "#bbbbbb";
const KINDA_LIGHT_GRAY_CSS_COLOR = "#cdcdcd";
const LIGHT_GRAY_CSS_COLOR = "#dedede";
const LIGHTER_GRAY_CSS_COLOR = "#eaeaea";
const EVEN_LIGHTER_GRAY_CSS_COLOR = "#efefef";
const TOAST_DURATION = 2500;
const GRID_SIZE = 15;
const QUICKPICK_SIZE = 75;
const IS_CAD_APP = new URL(location.href).searchParams.has("cad");


/***/ }),

/***/ "./src/contextmenu/debug.ts":
/*!**********************************!*\
  !*** ./src/contextmenu/debug.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debug": () => (/* binding */ debug)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_CanvasManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/CanvasManager */ "./src/managers/CanvasManager.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_StorageManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");





const debug = (_constants__WEBPACK_IMPORTED_MODULE_0__.IN_DEBUG_MODE
    ? [
        {
            "test-alert": {
                label: "Test alert",
                callback: async () => {
                    console.log(await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__.ModalManager.alert("This is an alert."));
                },
            },
            "test-confirm": {
                label: "Test confirm",
                callback: async () => {
                    console.log(await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__.ModalManager.confirm("This is a confirmation."));
                },
            },
            "test-prompt": {
                label: "Test prompt",
                callback: async () => {
                    console.log(await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__.ModalManager.prompt("This is a prompt."));
                },
            },
            "test-toast": {
                label: "Test toast",
                callback: async () => {
                    console.log(await _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__.ToastManager.toast({
                        message: "This is a toast.",
                        color: _constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR,
                        duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                    }));
                },
            },
        },
        {
            "wipe-storage": {
                label: "Wipe storage",
                callback: () => {
                    _managers_StorageManager__WEBPACK_IMPORTED_MODULE_3__.StorageManager.storage.clear();
                },
            },
            "wipe-save": {
                label: "Wipe named save",
                callback: async () => {
                    const save = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__.ModalManager.prompt("");
                    if (save) {
                        if (!_managers_StorageManager__WEBPACK_IMPORTED_MODULE_3__.StorageManager.has("saves:" + save))
                            return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__.ToastManager.toast({
                                message: "No saves exist with that name.",
                                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                            });
                        _managers_StorageManager__WEBPACK_IMPORTED_MODULE_3__.StorageManager["delete"]("saves:" + save);
                        location.reload();
                    }
                },
            },
        },
        {
            "stop-render": {
                label: "Stop rendering",
                callback: () => {
                    _managers_CanvasManager__WEBPACK_IMPORTED_MODULE_1__.CanvasManager.stop();
                },
            },
            "start-render": {
                label: "Start rendering",
                callback: () => {
                    _managers_CanvasManager__WEBPACK_IMPORTED_MODULE_1__.CanvasManager.start();
                },
            },
        },
    ]
    : []);


/***/ }),

/***/ "./src/contextmenu/insert.ts":
/*!***********************************!*\
  !*** ./src/contextmenu/insert.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "insert": () => (/* binding */ insert)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Display__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../reified/Display */ "./src/reified/Display.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");









const insert = {
    "insert-component": {
        label: "Insert component",
        keybind: "A",
        callback: async (e, n) => {
            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
            const name = typeof n === "string" ? n : await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.prompt("Enter the component's name:");
            if (typeof name !== "string")
                return;
            const chip = _reified_chips__WEBPACK_IMPORTED_MODULE_5__.chips.get(name.toUpperCase());
            const component = chip
                ? new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(Reflect.construct(chip, []), _constants__WEBPACK_IMPORTED_MODULE_0__.ORIGIN_POINT)
                : name.toUpperCase() === "DISPLAY"
                    ? new _reified_Display__WEBPACK_IMPORTED_MODULE_7__.Display()
                    : undefined;
            if (!component)
                return _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("No component was found with that name.");
            const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.add(component);
                if (_reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.has(component)) {
                    component.attach();
                    const { width, height } = getComputedStyle(component.element);
                    component.move({
                        x: e.clientX - parseFloat(width) / 2,
                        y: e.clientY - parseFloat(height) / 2,
                    });
                    _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.select(component);
                }
            }, () => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active["delete"](component);
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

"use strict";
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

/***/ "./src/contextmenu/menu.ts":
/*!*********************************!*\
  !*** ./src/contextmenu/menu.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "menu": () => (/* binding */ menu)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug */ "./src/contextmenu/debug.ts");
/* harmony import */ var _insert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./insert */ "./src/contextmenu/insert.ts");
/* harmony import */ var _io__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./io */ "./src/contextmenu/io.ts");
/* harmony import */ var _serde__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./serde */ "./src/contextmenu/serde.ts");




const menu = [_insert__WEBPACK_IMPORTED_MODULE_1__.insert, _io__WEBPACK_IMPORTED_MODULE_2__.io, _serde__WEBPACK_IMPORTED_MODULE_3__.serde, ..._debug__WEBPACK_IMPORTED_MODULE_0__.debug];


/***/ }),

/***/ "./src/contextmenu/serde.ts":
/*!**********************************!*\
  !*** ./src/contextmenu/serde.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "serde": () => (/* binding */ serde)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../files */ "./src/files.ts");
/* harmony import */ var _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../keybinds/keybinds */ "./src/keybinds/keybinds.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_StorageManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./menu */ "./src/contextmenu/menu.ts");










const serde = {
    "copy-url": {
        label: "Copy link",
        keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ K" : "Ctrl K",
        callback: async () => {
            const hrefAsUrl = new URL(location.href);
            hrefAsUrl.searchParams.set("inline", btoa((0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active], [..._managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires])));
            await navigator.clipboard.writeText(hrefAsUrl.href);
            return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.toast({
                message: "Copied diagram link to clipboard.",
                color: _constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
            });
        },
    },
    "save-to": {
        label: "Save with name",
        keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ S" : "Ctrl S",
        callback: async () => {
            const save = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.prompt("What should be the name of this save?");
            if (typeof save !== "string")
                return;
            await _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.saveTo(save);
            const hrefAsUrl = new URL(location.href);
            hrefAsUrl.searchParams.set("save", save);
            history.pushState(undefined, "", hrefAsUrl);
        },
    },
    "load-from": {
        label: "Load from saves",
        keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ O" : "Ctrl O",
        callback: async () => {
            const save = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.prompt("Which save would you like to load?");
            if (typeof save !== "string")
                return;
            if (!_managers_StorageManager__WEBPACK_IMPORTED_MODULE_5__.StorageManager.has("saves:" + save))
                return _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.alert("No save was found with that name.");
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.reset();
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({ keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds, menu: _menu__WEBPACK_IMPORTED_MODULE_9__.menu, save });
            const hrefAsUrl = new URL(location.href);
            hrefAsUrl.searchParams.set("save", save);
            history.pushState(undefined, "", hrefAsUrl);
        },
    },
    "save-as": {
        label: "Save as file",
        keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ S" : "Ctrl Shift S",
        callback: () => {
            Object.assign(document.createElement("a"), {
                href: URL.createObjectURL(new Blob([(0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active], [..._managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires])], {
                    type: "application/json",
                })),
                download: `${_managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.savedName ?? "sandbox"}.gatesim.json`,
            }).click();
        },
    },
    "import-from": {
        label: "Import from file",
        keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ O" : "Ctrl Shift O",
        callback: async () => {
            const input = Object.assign(document.createElement("input"), { type: "file" });
            input.click();
            const file = await new Promise((resolve) => {
                input.onchange = () => resolve(input.files?.[0] ?? undefined);
                input.onerror = () => resolve(undefined);
            });
            if (!file)
                return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.toast({
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
                return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.toast({
                    message: "Unable to read the file.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                });
            const { error, result: [settings, components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_1__.fromFile)(raw);
            if (error)
                return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.toast({
                    message: error,
                    color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                });
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.reset();
            const save = file.name.split(".").slice(0, -1).join(".");
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({
                keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds,
                menu: _menu__WEBPACK_IMPORTED_MODULE_9__.menu,
                save: save.endsWith(".gatesim") ? save.slice(0, -".gatesim".length) : save,
                initial: [components, wires],
                overrideSaveIfExists: true,
                settings: {},
            });
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.applyRawSettings(settings);
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.forceSave();
        },
    },
};


/***/ }),

/***/ "./src/files.ts":
/*!**********************!*\
  !*** ./src/files.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromFile": () => (/* binding */ fromFile),
/* harmony export */   "saveDiagram": () => (/* binding */ saveDiagram)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Display__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reified/Display */ "./src/reified/Display.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./reified/Output */ "./src/reified/Output.ts");









function saveDiagram(components, wires) {
    const id = (0,_constants__WEBPACK_IMPORTED_MODULE_0__.COUNTER_GENERATOR)();
    const ids = new Map();
    const data = {
        settings: {
            ["DraggingManager.snapToGrid"]: _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.snapToGrid,
        },
        components: components.map((component, reified) => {
            if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input) {
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
            if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_8__.Output) {
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
            if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component) {
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
                };
            }
            if (component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_6__.Display) {
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
                const input = new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input(raw);
                input.element.classList.toggle("activated", raw.activated);
                elements.set(raw.id, input.element);
                return raw.permanent ? input.permanent() : input;
            }
            if (raw.type === "OUTPUT") {
                const output = new _reified_Output__WEBPACK_IMPORTED_MODULE_8__.Output(raw);
                output.element.classList.toggle("activated", raw.activated);
                elements.set(raw.id, output.element);
                return raw.permanent ? output.permanent() : output;
            }
            if (raw.type === "DISPLAY") {
                const display = new _reified_Display__WEBPACK_IMPORTED_MODULE_6__.Display(raw, raw.inputs.length, raw.radix).rotate(raw.angle);
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
            const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(new (_reified_chips__WEBPACK_IMPORTED_MODULE_4__.chips.get(raw.name))(), raw, raw.complementary).rotate(raw.angle);
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
                if (!_reified_chips__WEBPACK_IMPORTED_MODULE_4__.chips.has(component.name.trim().toUpperCase()))
                    throw new Error("Chip name doesn't exist.");
                const Chip = _reified_chips__WEBPACK_IMPORTED_MODULE_4__.chips.get(component.name.trim().toUpperCase());
                if (component.inputs.length !== Chip.INPUTS)
                    throw new Error("Component inputs does not match chip inputs.");
                if (component.outputs.length !== Chip.OUTPUTS)
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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
//@ts-nocheck

if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_CAD_APP) {
    await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./cad/index.ts */ "./src/cad/index.ts"));
    console.log("%cGATESIM CAD", `color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR}; font-size: 2rem;`);
    console.log("Input a truth table to get started.");
    console.log("The program will find a circuit that matches the table.");
}
else {
    await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./app.ts */ "./src/app.ts"));
    console.log("%cGATESIM", `color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR}; font-size: 2rem;`);
    console.log("Right click to get started.");
    console.log("Press '?' for help.");
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/keybinds/backspace.ts":
/*!***********************************!*\
  !*** ./src/keybinds/backspace.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "backspace": () => (/* binding */ backspace)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Display__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../reified/Display */ "./src/reified/Display.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");











const backspace = {
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Control+X", () => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        backspace["Backspace"]();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Meta+X", () => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        backspace["Backspace"]();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Control+Shift+X", () => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        backspace["Shift+Backspace"]();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Meta+Shift+X", () => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        backspace["Shift+Backspace"]();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Shift+Backspace", () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        if (!_managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size)
            return;
        const selected = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        const deleted = [];
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            selected.forEach((component) => {
                if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_8__.Input) {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                        if (wire.from === component.element) {
                            wire.destroy();
                            wire.to.classList.remove("activated");
                            deleted.push([wire.from, wire.to]);
                        }
                    });
                }
                else if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_9__.Output) {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                        if (wire.to === component.element) {
                            wire.destroy();
                            deleted.push([wire.from, wire.to]);
                        }
                    });
                    component.element.classList.remove("activated");
                }
                else if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_7__.Display) {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                        if (component.inputs.some((i) => wire.to === i) ||
                            component.outputs.some((o) => wire.from === o)) {
                            wire.destroy();
                            wire.to.classList.remove("activated");
                            deleted.push([wire.from, wire.to]);
                        }
                    });
                    component.inputs.forEach((i) => i.classList.remove("activated"));
                }
                else {
                    throw new Error("Unknown component type.");
                }
            });
        }, () => {
            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(from, to)));
            _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected = selected.clone(true);
        });
    }),
    ["Backspace"]: () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        if (!_managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size)
            return;
        const selected = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        const deleted = [];
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            selected.forEach((component) => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_10__.Reified.active["delete"](component);
                component.detach();
                if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_8__.Input) {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                        if (wire.from === component.element) {
                            wire.destroy();
                            wire.to.classList.remove("activated");
                            deleted.push([wire.from, wire.to]);
                        }
                    });
                }
                else if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_9__.Output) {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                        if (wire.to === component.element) {
                            wire.destroy();
                            deleted.push([wire.from, wire.to]);
                        }
                    });
                    component.element.classList.remove("activated");
                }
                else if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_7__.Display) {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                        if (component.inputs.some((i) => wire.to === i) ||
                            component.outputs.some((o) => wire.from === o)) {
                            wire.destroy();
                            wire.to.classList.remove("activated");
                            deleted.push([wire.from, wire.to]);
                        }
                    });
                    component.inputs.forEach((i) => i.classList.remove("activated"));
                }
                else {
                    throw new Error("Unknown component type.");
                }
            });
            _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clear();
        }, () => {
            selected.forEach((component) => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_10__.Reified.active.add(component);
                component.attach();
            });
            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(from, to)));
            _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected = selected.clone(true);
        });
    },
};


/***/ }),

/***/ "./src/keybinds/behavior.ts":
/*!**********************************!*\
  !*** ./src/keybinds/behavior.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "behavior": () => (/* binding */ behavior)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");







const behavior = {
    ["ArrowLeft"]: () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        if (!_managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size)
            return;
        const selected = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            selected.forEach((component) => {
                component.move({ x: -_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE, relative: true });
            });
        }, () => {
            selected.forEach((component) => {
                component.move({ x: _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE, relative: true });
            });
        });
    },
    ["ArrowRight"]: () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        if (!_managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size)
            return;
        const selected = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            selected.forEach((component) => {
                component.move({ x: _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE, relative: true });
            });
        }, () => {
            selected.forEach((component) => {
                component.move({ x: -_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE, relative: true });
            });
        });
    },
    ["ArrowUp"]: () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        if (!_managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size)
            return;
        const selected = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            selected.forEach((component) => {
                component.move({ y: -_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE, relative: true });
            });
        }, () => {
            selected.forEach((component) => {
                component.move({ y: _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE, relative: true });
            });
        });
    },
    ["ArrowDown"]: () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        if (!_managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size)
            return;
        const selected = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            selected.forEach((component) => {
                component.move({ y: _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE, relative: true });
            });
        }, () => {
            selected.forEach((component) => {
                component.move({ y: -_constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE, relative: true });
            });
        });
    },
    ["KeyG"]: () => {
        const components = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active];
        const positions = components.map(({ pos }) => pos);
        const size = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE;
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.snapToGrid = !_managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.snapToGrid;
            components.forEach((component) => {
                component.move({
                    x: Math.floor(component.pos.x / size) * size,
                    y: Math.floor(component.pos.y / size) * size,
                });
            });
            _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
                message: `Toggled snap to grid (now ${_managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.snapToGrid}) [G].`,
                color: _constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
            });
        }, () => {
            _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.snapToGrid = !_managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.snapToGrid;
            components.forEach((component, i) => {
                component.move(positions[i]);
            });
        });
    },
};


/***/ }),

/***/ "./src/keybinds/history.ts":
/*!*********************************!*\
  !*** ./src/keybinds/history.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "history": () => (/* binding */ history)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");



const undo = () => {
    _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.popHistory();
};
const redo = () => {
    _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.redoHistory();
};
const history = {
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Control+Shift+Z", () => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Meta+Shift+Z", () => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Control+Z", () => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        undo();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Meta+Z", () => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        undo();
    }),
};


/***/ }),

/***/ "./src/keybinds/howtouse.ts":
/*!**********************************!*\
  !*** ./src/keybinds/howtouse.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "howtouse": () => (/* binding */ howtouse)
/* harmony export */ });
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");




const howtouse = {
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_0__.KeybindsManager.assign("Shift+Slash", async () => {
        //TODO: add stuff
        await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.popup(_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.html `
            <div>
                <h1>gatesim</h1>
            </div>
        `);
        _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__.StorageManager.set("usedhelp", "true");
    }),
};


/***/ }),

/***/ "./src/keybinds/io.ts":
/*!****************************!*\
  !*** ./src/keybinds/io.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "io": () => (/* binding */ io)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_MouseManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");








const io = {
    ["KeyI"]: () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        const input = new _reified_Input__WEBPACK_IMPORTED_MODULE_5__.Input({
            x: _managers_MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.x - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
            y: _managers_MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.y - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
        });
        const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.add(input);
            if (_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.has(input)) {
                input.attach();
                _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.select(input);
            }
        }, () => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active["delete"](input);
            input.detach();
            _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected = selection;
        });
    },
    ["KeyO"]: () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        const output = new _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output({
            x: _managers_MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.x - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
            y: _managers_MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.y - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
        });
        const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.add(output);
            if (_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.has(output)) {
                output.attach();
                _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.select(output);
            }
        }, () => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active["delete"](output);
            output.detach();
            _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected = selection;
        });
    },
};


/***/ }),

/***/ "./src/keybinds/keybinds.ts":
/*!**********************************!*\
  !*** ./src/keybinds/keybinds.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "keybinds": () => (/* binding */ keybinds)
/* harmony export */ });
/* harmony import */ var _backspace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./backspace */ "./src/keybinds/backspace.ts");
/* harmony import */ var _behavior__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./behavior */ "./src/keybinds/behavior.ts");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./history */ "./src/keybinds/history.ts");
/* harmony import */ var _howtouse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./howtouse */ "./src/keybinds/howtouse.ts");
/* harmony import */ var _io__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./io */ "./src/keybinds/io.ts");
/* harmony import */ var _rotate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rotate */ "./src/keybinds/rotate.ts");
/* harmony import */ var _select__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./select */ "./src/keybinds/select.ts");
/* harmony import */ var _serde__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./serde */ "./src/keybinds/serde.ts");








const keybinds = Object.assign({}, _backspace__WEBPACK_IMPORTED_MODULE_0__.backspace, _behavior__WEBPACK_IMPORTED_MODULE_1__.behavior, _history__WEBPACK_IMPORTED_MODULE_2__.history, _howtouse__WEBPACK_IMPORTED_MODULE_3__.howtouse, _io__WEBPACK_IMPORTED_MODULE_4__.io, _rotate__WEBPACK_IMPORTED_MODULE_5__.rotate, _select__WEBPACK_IMPORTED_MODULE_6__.select, _serde__WEBPACK_IMPORTED_MODULE_7__.serde);


/***/ }),

/***/ "./src/keybinds/rotate.ts":
/*!********************************!*\
  !*** ./src/keybinds/rotate.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rotate": () => (/* binding */ rotate)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Display__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Display */ "./src/reified/Display.ts");







const rotate = {
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Shift+R", () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        if (!_managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size)
            return;
        const selected = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            selected.forEach((component) => {
                if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_6__.Display) {
                    component.angle -= 90;
                }
            });
        }, () => {
            selected.forEach((component) => {
                if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_6__.Display) {
                    component.angle += 90;
                }
            });
        });
    }),
    ["KeyR"]: () => {
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        if (!_managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size)
            return;
        const selected = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            selected.forEach((component) => {
                if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_6__.Display) {
                    component.angle += 90;
                }
            });
        }, () => {
            selected.forEach((component) => {
                if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_6__.Display) {
                    component.angle -= 90;
                }
            });
        });
    },
};


/***/ }),

/***/ "./src/keybinds/select.ts":
/*!********************************!*\
  !*** ./src/keybinds/select.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "select": () => (/* binding */ select)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");




const select = {
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Control+A", () => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.forEach((component) => _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.addSelection(component));
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_1__.KeybindsManager.assign("Meta+A", () => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.forEach((component) => _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.addSelection(component));
    }),
};


/***/ }),

/***/ "./src/keybinds/serde.ts":
/*!*******************************!*\
  !*** ./src/keybinds/serde.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "serde": () => (/* binding */ serde)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../contextmenu/serde */ "./src/contextmenu/serde.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");



const serde = {
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Control+K", (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["copy-url"].callback();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Meta+K", (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["copy-url"].callback();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Control+S", (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["save-to"].callback();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Meta+S", (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["save-to"].callback();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Control+O", (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["load-from"].callback();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Meta+O", (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["load-from"].callback();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Control+Shift+S", (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["save-as"].callback();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Meta+Shift+S", (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["save-as"].callback();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Control+Shift+O", (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["import-from"].callback();
    }),
    ..._managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.assign("Meta+Shift+O", (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        e.preventDefault();
        _contextmenu_serde__WEBPACK_IMPORTED_MODULE_1__.serde["import-from"].callback();
    }),
};


/***/ }),

/***/ "./src/managers/CanvasManager.ts":
/*!***************************************!*\
  !*** ./src/managers/CanvasManager.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DarkmodeManager": () => (/* binding */ DarkmodeManager)
/* harmony export */ });
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");

class DarkmodeManager {
    static #changes = new Set();
    static #key = "settings.darkmode";
    static get #enabled() {
        return _StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.get(this.#key) ?? false;
    }
    static set #enabled(value) {
        _StorageManager__WEBPACK_IMPORTED_MODULE_0__.StorageManager.set(this.#key, value);
        this.#element.innerText = value ? "🌕" : "🌑";
        this.#changes.forEach((run) => run.call(undefined));
        document.body.classList.toggle("darkmode", value);
    }
    static get enabled() {
        return this.#enabled;
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
        this.#enabled = !this.#enabled;
        this.#element.style.transition = "none";
        requestAnimationFrame(() => {
            this.#element.style.transition = "";
        });
    };
    static listen() {
        this.#enabled = this.#enabled;
        this.#element.innerText = this.#enabled ? "🌕" : "🌑";
        this.#element.addEventListener("click", this.#listener);
        return this;
    }
    static stop() {
        this.#element.removeEventListener("click", this.#listener);
        return this;
    }
    static toggle(value) {
        this.#enabled = typeof value === "boolean" ? value : !this.#enabled;
    }
}


/***/ }),

/***/ "./src/managers/DraggingManager.ts":
/*!*****************************************!*\
  !*** ./src/managers/DraggingManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DraggingManager": () => (/* binding */ DraggingManager)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _quickpicks_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../quickpicks/components */ "./src/quickpicks/components.ts");
/* harmony import */ var _quickpicks_gates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../quickpicks/gates */ "./src/quickpicks/gates.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _CanvasManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CanvasManager */ "./src/managers/CanvasManager.ts");
/* harmony import */ var _DarkmodeManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");










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
        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.forceSave();
    }
    static snapToGridBasedUpdate({ forceClear = false, onlyUpdateColor = false } = {
        forceClear: false,
        onlyUpdateColor: false,
    }) {
        if (this.snapToGrid && !forceClear) {
            if (!onlyUpdateColor)
                requestAnimationFrame(() => {
                    _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.forEach((component) => {
                        component.element.style.minWidth = "";
                        component.element.style.minHeight = "";
                        requestAnimationFrame(() => {
                            const style = getComputedStyle(component.element);
                            const top = parseFloat(style.top);
                            const left = parseFloat(style.left);
                            const width = parseFloat(style.width);
                            const height = parseFloat(style.height);
                            component.element.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(component.element);
                            component.element.style.top = Math.floor(top / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                            component.element.style.left = Math.floor(left / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                            component.element.style.minWidth = Math.ceil(width / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                            component.element.style.minHeight = Math.ceil(height / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                        });
                    });
                });
            document.body.style.backgroundSize = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px " + _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
            if (_DarkmodeManager__WEBPACK_IMPORTED_MODULE_5__.DarkmodeManager.enabled) {
                document.body.style.backgroundImage = `linear-gradient(to right, ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            }
            else {
                document.body.style.backgroundImage = `linear-gradient(to right, ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            }
        }
        else {
            requestAnimationFrame(() => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.forEach((component) => {
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
            if (!_SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.isSelected(element))
                _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.clear();
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.size <= 1) {
                this.#mouse.ox = e.clientX - rect.left;
                this.#mouse.oy = e.clientY - rect.top;
            }
            else {
                this.#positions = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected].map((target) => target.pos);
                const topleft = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected].sort((a, b) => {
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
        const touchstart = (e) => {
            const [touch] = e.touches;
            this.#dragged = element;
            this.#dragged.dataset.dragged = "true";
            this.#dragged.style.cursor = "grabbing";
            const rect = this.#dragged.getBoundingClientRect();
            this.#mouse.x = touch.clientX;
            this.#mouse.y = touch.clientY;
            this.#mouse.ix = touch.clientX;
            this.#mouse.iy = touch.clientY;
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.size <= 1) {
                this.#mouse.ox = touch.clientX - rect.left;
                this.#mouse.oy = touch.clientY - rect.top;
            }
            else {
                this.#positions = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected].map((target) => target.pos);
                const topleft = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected].sort((a, b) => {
                    const ax = parseFloat(a.element.style.left);
                    const ay = parseFloat(a.element.style.top);
                    const bx = parseFloat(b.element.style.left);
                    const by = parseFloat(b.element.style.top);
                    const ad = Math.sqrt(ax * ax + ay * ay);
                    const bd = Math.sqrt(bx * bx + by * by);
                    return ad - bd;
                })[0].element;
                const bounds = topleft.getBoundingClientRect();
                this.#mouse.ox = touch.clientX - bounds.x;
                this.#mouse.oy = touch.clientY - bounds.y;
                this.#topleft = topleft;
            }
            this.#original = { x: rect.left, y: rect.top };
        };
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
            _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse.y !== -1) {
            fg.strokeStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_0__.GET_ACTIVATED_COLOR)();
            fg.lineWidth = 2.5;
            fg.lineJoin = "miter";
            fg.strokeRect(DraggingManager.downpos.x, DraggingManager.downpos.y, _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse.x - DraggingManager.downpos.x, _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse.y - DraggingManager.downpos.y);
        }
    }
    static listen() {
        this.snapToGridBasedUpdate();
        _CanvasManager__WEBPACK_IMPORTED_MODULE_4__.CanvasManager.addJob(this.render.bind(this));
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
            this.#dragged.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(this.#dragged);
            if (DraggingManager.snapToGrid) {
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left =
                        Math.floor((this.#mouse.x - this.#mouse.ox) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                    this.#dragged.style.top =
                        Math.floor((this.#mouse.y - this.#mouse.oy) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.forEach((component) => {
                        const offset = component.element.getBoundingClientRect();
                        component.move({
                            x: Math.floor((this.#mouse.x - this.#mouse.ox) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE +
                                offset.left -
                                topleft.left,
                            y: Math.floor((this.#mouse.y - this.#mouse.oy) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE +
                                offset.top -
                                topleft.top,
                        });
                    });
                }
            }
            else {
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                    this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.forEach((component) => {
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
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
        this.#mouse.ix = e.clientX;
        this.#mouse.iy = e.clientY;
        const target = e.target;
        const isOnInvalidTarget = [
            target.closest("button.board-input"),
            target.closest("button.board-output"),
            target.closest("div.component"),
            target.closest("div.display"),
            target.closest("div.contextmenu"),
        ].find((element) => element !== null);
        if (!isOnInvalidTarget && e.button === 0) {
            if (_KeybindsManager__WEBPACK_IMPORTED_MODULE_6__.KeybindsManager.isKeyDown("KeyA") && _KeybindsManager__WEBPACK_IMPORTED_MODULE_6__.KeybindsManager.isKeyDown("KeyS")) {
            }
            else if (_KeybindsManager__WEBPACK_IMPORTED_MODULE_6__.KeybindsManager.isKeyDown("KeyA")) {
                (0,_quickpicks_gates__WEBPACK_IMPORTED_MODULE_2__.quickpickGates)(e);
            }
            else if (_KeybindsManager__WEBPACK_IMPORTED_MODULE_6__.KeybindsManager.isKeyDown("KeyS")) {
                (0,_quickpicks_components__WEBPACK_IMPORTED_MODULE_1__.quickpickComponents)(e);
            }
            else {
                this.#downpos.x = e.clientX;
                this.#downpos.y = e.clientY;
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
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.size <= 1) {
                const target = this.#dragged;
                const mouse = this.#mouse;
                const original = this.#original;
                const size = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(target);
                            target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                            target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                        }, () => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(target);
                            target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                            target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                        });
                    else
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(target);
                            target.style.left = mouse.x - mouse.ox - 1 + "px";
                            target.style.top = mouse.y - mouse.oy - 1 + "px";
                        }, () => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(target);
                            target.style.left = original.x - 1 + "px";
                            target.style.top = original.y - 1 + "px";
                        });
            }
            else if (this.#topleft) {
                const mouse = this.#mouse;
                const targets = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected];
                const positions = this.#positions;
                const topleft = this.#topleft.getBoundingClientRect();
                const size = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
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
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
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
            _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse.y !== -1)
            _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selectAllIn(DraggingManager.#downpos, _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse);
        this.#mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };
        this.#downpos = { x: -1, y: -1 };
        this.#topleft = undefined;
        this.#dragged = undefined;
        this.#original = undefined;
        this.#positions = undefined;
    };
    static #touchmove = (e) => {
        const [touch] = e.touches;
        this.#mouse.x = touch.clientX;
        this.#mouse.y = touch.clientY;
        if (this.#dragged) {
            this.#dragged.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(this.#dragged);
            if (DraggingManager.snapToGrid) {
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left =
                        Math.floor((this.#mouse.x - this.#mouse.ox) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                    this.#dragged.style.top =
                        Math.floor((this.#mouse.y - this.#mouse.oy) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.forEach((component) => {
                        const offset = component.element.getBoundingClientRect();
                        component.move({
                            x: Math.floor((this.#mouse.x - this.#mouse.ox) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE +
                                offset.left -
                                topleft.left,
                            y: Math.floor((this.#mouse.y - this.#mouse.oy) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE +
                                offset.top -
                                topleft.top,
                        });
                    });
                }
            }
            else {
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                    this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.forEach((component) => {
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
    static #touchstart = (e) => {
        const [touch] = e.touches;
        this.#mouse.x = touch.clientX;
        this.#mouse.y = touch.clientY;
        this.#mouse.ix = touch.clientX;
        this.#mouse.iy = touch.clientY;
        const target = e.target;
        const isOnInvalidTarget = [
            target.closest("button.board-input"),
            target.closest("button.board-output"),
            target.closest("div.component"),
            target.closest("div.display"),
            target.closest("div.contextmenu"),
        ].find((element) => element !== null);
        if (!isOnInvalidTarget) {
            this.#downpos.x = touch.clientX;
            this.#downpos.y = touch.clientY;
        }
        this.#mouse.down = true;
    };
    static #touchend = (e) => {
        const [touch] = e.changedTouches;
        this.#mouse.x = touch.clientX;
        this.#mouse.y = touch.clientY;
        if (this.#dragged) {
            document.querySelectorAll('[data-dragged="true"]').forEach((e) => {
                delete e.dataset.dragged;
                e.style.cursor = "";
            });
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.size <= 1) {
                const target = this.#dragged;
                const mouse = this.#mouse;
                const original = this.#original;
                const size = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(target);
                            target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                            target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                        }, () => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(target);
                            target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                            target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                        });
                    else
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(target);
                            target.style.left = mouse.x - mouse.ox - 1 + "px";
                            target.style.top = mouse.y - mouse.oy - 1 + "px";
                        }, () => {
                            target.style.transformOrigin = (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.computeTransformOrigin)(target);
                            target.style.left = original.x - 1 + "px";
                            target.style.top = original.y - 1 + "px";
                        });
            }
            else if (this.#topleft) {
                const mouse = this.#mouse;
                const targets = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected];
                const positions = this.#positions;
                const topleft = this.#topleft.getBoundingClientRect();
                const size = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
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
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
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
            _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse.y !== -1)
            _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selectAllIn(DraggingManager.#downpos, _MouseManager__WEBPACK_IMPORTED_MODULE_7__.MouseManager.mouse);
        this.#mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };
        this.#downpos = { x: -1, y: -1 };
        this.#topleft = undefined;
        this.#dragged = undefined;
        this.#original = undefined;
        this.#positions = undefined;
    };
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeybindsManager": () => (/* binding */ KeybindsManager)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");


class KeybindsManager {
    static #keymap = new Map();
    static #keychords = new Array();
    static #keydown = (e) => {
        this.#keymap.set(e.code, true);
        if (e.metaKey && (e.code === "ShiftLeft" || e.code === "ShiftRight") && _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
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
        if (!e.metaKey && (e.code === "MetaLeft" || e.code === "MetaRight") && _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
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

"use strict";
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
                    const listener = () => click(this.#opened);
                    menu.querySelector("." + key).addEventListener("click", listener);
                    menu.querySelector("." + key).addEventListener("contextmenu", listener);
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
            menu.querySelector("." + key).removeEventListener("click", listener);
            menu.querySelector("." + key).removeEventListener("contextmenu", listener);
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ModalManager": () => (/* binding */ ModalManager)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");


class ModalManager {
    static get container() {
        return document.querySelector(".modal-container");
    }
    static #onModalMount() {
        if (this.container.childElementCount <= 0)
            this.container.classList.remove("modal-inactive");
        else
            this.container.lastElementChild.classList.add("modal-inactive");
    }
    static #onModalResolved() {
        if (this.container.childElementCount <= 0)
            this.container.classList.add("modal-inactive");
        else {
            this.container.lastElementChild.classList.remove("modal-inactive");
            if (this.container.lastElementChild.classList.contains("modal-alert")) {
                this.container.lastElementChild.querySelector(".modal-ok").focus();
            }
        }
    }
    static async alert(message) {
        this.#onModalMount();
        const alert = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="modal modal-alert">
                <p class="modal-message">${message}</p>
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                </div>
            </div>
        `;
        this.container.appendChild(alert);
        alert.querySelector(".modal-ok").focus();
        return new Promise((resolve) => {
            const finish = () => resolve(undefined);
            _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises.add(finish);
            const done = () => {
                alert.remove();
                this.#onModalResolved();
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
    static async confirm(message) {
        this.#onModalMount();
        const confirm = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="modal modal-confirm">
                <p class="modal-message">${message}</p>
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                    <button class="modal-cancel">Cancel</button>
                </div>
            </div>
        `;
        this.container.appendChild(confirm);
        confirm.querySelector(".modal-ok").focus();
        return new Promise((resolve) => {
            const finish = () => resolve(false);
            _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises.add(finish);
            const handler = (value) => () => {
                confirm.remove();
                this.#onModalResolved();
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
                return resolve(value);
            };
            const esc = (e) => {
                if (e.code === "Escape") {
                    e.preventDefault();
                    document.removeEventListener("keydown", esc);
                    confirm.remove();
                    this.#onModalResolved();
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
                this.#onModalResolved();
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
                return resolve(false);
            };
            this.container.addEventListener("mousedown", clickout);
            confirm.querySelector(".modal-cancel").addEventListener("click", handler(false));
            confirm.querySelector(".modal-ok").addEventListener("click", handler(true));
        });
    }
    static async prompt(message) {
        this.#onModalMount();
        const prompt = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="modal modal-confirm">
                <p class="modal-message">${message}</p>
                <input class="modal-input" type="text" />
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                    <button class="modal-cancel">Cancel</button>
                </div>
            </div>
        `;
        this.container.appendChild(prompt);
        prompt.querySelector(".modal-input").focus();
        return new Promise((resolve) => {
            const finish = () => resolve(undefined);
            _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises.add(finish);
            const done = () => {
                prompt.remove();
                this.#onModalResolved();
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
    static async popup(content) {
        this.#onModalMount();
        const popup = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="modal modal-alert modal-popup">
                <div class="modal-message">${typeof content === "string" ? content : content.outerHTML}</div>
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                </div>
            </div>
        `;
        this.container.appendChild(popup);
        popup.querySelector(".modal-ok").focus();
        return new Promise((resolve) => {
            const finish = () => resolve(undefined);
            _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises.add(finish);
            const done = () => {
                popup.remove();
                this.#onModalResolved();
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
                if (target !== this.container || this.container.lastElementChild !== popup)
                    return;
                this.container.removeEventListener("mousedown", clickout);
                done();
            };
            this.container.addEventListener("mousedown", clickout);
            popup.querySelector(".modal-ok").addEventListener("click", done);
        });
    }
}


/***/ }),

/***/ "./src/managers/MouseManager.ts":
/*!**************************************!*\
  !*** ./src/managers/MouseManager.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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

"use strict";
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
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _UndoRedoManager__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./UndoRedoManager */ "./src/managers/UndoRedoManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");





















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
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="darkmode"></button>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="undo"></button>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="redo"></button>`);
        _MouseManager__WEBPACK_IMPORTED_MODULE_14__.MouseManager.start();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_11__.KeybindsManager.listen();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.listen();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_16__.SelectionManager.listen();
        _WiringManager__WEBPACK_IMPORTED_MODULE_20__.WiringManager.init();
        _QuickPickManager__WEBPACK_IMPORTED_MODULE_15__.QuickPickManager.init();
        _CanvasManager__WEBPACK_IMPORTED_MODULE_8__.CanvasManager.start();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_9__.DarkmodeManager.listen().onChange(() => _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.snapToGridBasedUpdate({ onlyUpdateColor: true }));
        _UndoRedoManager__WEBPACK_IMPORTED_MODULE_19__.UndoRedoManager.listen();
        const createReifiedActive = (components) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((item, set) => {
            const totals = calculateReifiedTotals(set.clone().add(item));
            if (totals.chipsTotal + totals.inputsTotal + totals.outputsTotal >
                (this.#config.limits?.componentsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
                    message: "Exceeded total components limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.inputsTotal > (this.#config.limits?.inputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
                    message: "Exceeded total inputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.outputsTotal > (this.#config.limits?.outputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
                    message: "Exceeded total outputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.chipsTotal > (this.#config.limits?.chipsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
                    message: "Exceeded total chips limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (item instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component &&
                totals.chips.has(item.chip.name) &&
                totals.chips.get(item.chip.name) > (this.#config.limits?.chips?.[item.chip.name] ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
                    message: `Exceeded total '${item.chip.name}' limit.`,
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            return true;
        })
            .onAdd((component) => {
            _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.snapToGridBasedUpdate();
            requestAnimationFrame(() => {
                component.move({
                    x: Math.floor(component.pos.x / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE,
                    y: Math.floor(component.pos.y / _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE,
                });
            });
            return true;
        })
            .addAll(components);
        const createWiringsSet = (wirings) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((_, set) => {
            if (set.size + 1 > (this.#config.limits?.wirings ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
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
            _WiringManager__WEBPACK_IMPORTED_MODULE_20__.WiringManager.wires = createWiringsSet(this.#config.initial[1]);
        }
        if (typeof this.#config.save !== "undefined") {
            const file = _StorageManager__WEBPACK_IMPORTED_MODULE_17__.StorageManager.get("saves:" + this.#config.save);
            if (file) {
                const { error, result: [settings, components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_2__.fromFile)(file);
                if (error) {
                    _StorageManager__WEBPACK_IMPORTED_MODULE_17__.StorageManager["delete"]("saves:" + this.#config.save);
                    if (_constants__WEBPACK_IMPORTED_MODULE_1__.IN_DEBUG_MODE)
                        console.error("Failed to read from saves:", error);
                    _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
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
                        _WiringManager__WEBPACK_IMPORTED_MODULE_20__.WiringManager.wires = createWiringsSet(wires);
                    }
                    _StorageManager__WEBPACK_IMPORTED_MODULE_17__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_20__.WiringManager.wires]));
                }
            }
        }
        this.#observer = new MutationObserver(() => {
            if (typeof this.#config.save !== "undefined")
                _StorageManager__WEBPACK_IMPORTED_MODULE_17__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_20__.WiringManager.wires]));
        });
        this.#observer.observe(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        });
        this.#interval = setInterval(() => {
            const check = this.#config.checkState?.(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.clone(), _WiringManager__WEBPACK_IMPORTED_MODULE_20__.WiringManager.wires.clone()) ?? false;
            if (check)
                this.#config.ifStateChecked?.();
        }, this.#config.checkInterval ?? 50);
        if (!_StorageManager__WEBPACK_IMPORTED_MODULE_17__.StorageManager.get("usedhelp"))
            _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
                message: "Press '?' for help.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.LIGHT_GRAY_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
        requestAnimationFrame(() => _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.snapToGridBasedUpdate());
        return this;
    }
    static forceSave() {
        if (typeof this.#config.save !== "undefined")
            _StorageManager__WEBPACK_IMPORTED_MODULE_17__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_20__.WiringManager.wires]));
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
        _DraggingManager__WEBPACK_IMPORTED_MODULE_10__.DraggingManager.reset();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_16__.SelectionManager.reset();
        _CanvasManager__WEBPACK_IMPORTED_MODULE_8__.CanvasManager.stop();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_9__.DarkmodeManager.stop();
        _UndoRedoManager__WEBPACK_IMPORTED_MODULE_19__.UndoRedoManager.stop();
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
        _WiringManager__WEBPACK_IMPORTED_MODULE_20__.WiringManager.wires.forEach((wire) => wire.destroy());
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
            _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
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
            _ToastManager__WEBPACK_IMPORTED_MODULE_18__.ToastManager.toast({
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
        if (_StorageManager__WEBPACK_IMPORTED_MODULE_17__.StorageManager.has("saves:" + this.#config.save) &&
            !(await _ModalManager__WEBPACK_IMPORTED_MODULE_13__.ModalManager.confirm("There is already a save with this name. Are you sure you want to replace it?")))
            return;
        _StorageManager__WEBPACK_IMPORTED_MODULE_17__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_20__.WiringManager.wires]));
        return this;
    }
}


/***/ }),

/***/ "./src/managers/SelectionManager.ts":
/*!******************************************!*\
  !*** ./src/managers/SelectionManager.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectionManager": () => (/* binding */ SelectionManager)
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
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");















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
        const reified = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active].find((component) => component.element === element);
        if (reified) {
            if ((_constants__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_10__.KeybindsManager.isKeyDown("MetaLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_10__.KeybindsManager.isKeyDown("MetaRight"))) ||
                (!_constants__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_10__.KeybindsManager.isKeyDown("ControlLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_10__.KeybindsManager.isKeyDown("ControlRight"))))
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
            const data = (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)(array, [..._WiringManager__WEBPACK_IMPORTED_MODULE_14__.WiringManager.wires].filter((wiring) => array.some((component) => {
                if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_5__.Input)
                    return wiring.from === component.element;
                if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output)
                    return false;
                if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_4__.Display)
                    return component.outputs.some((output) => wiring.from === output);
                throw new Error("Unknown component type.");
            }) &&
                array.some((component) => {
                    if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_5__.Input)
                        return false;
                    if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output)
                        return wiring.to === component.element;
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_4__.Display)
                        return component.inputs.some((input) => wiring.to === input);
                    throw new Error("Unknown component type.");
                })));
            await navigator.clipboard.writeText(data);
        }
    };
    static #paste = async () => {
        const { error, result: [, components, wirings], } = (0,_files__WEBPACK_IMPORTED_MODULE_2__.fromFile)(await navigator.clipboard.readText());
        if (error)
            return _ToastManager__WEBPACK_IMPORTED_MODULE_13__.ToastManager.toast({
                message: "Unable to paste diagram data.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
        const mouse = { ..._MouseManager__WEBPACK_IMPORTED_MODULE_11__.MouseManager.mouse };
        const selection = this.selected.clone(true);
        _SandboxManager__WEBPACK_IMPORTED_MODULE_12__.SandboxManager.pushHistory(() => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.addAll(components);
            if (components.every((component) => _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.has(component))) {
                components.forEach((component) => {
                    component.attach();
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_4__.Display) {
                        component.inputs.forEach((input) => input.classList.remove("activated"));
                        requestAnimationFrame(() => component.update());
                    }
                    if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output) {
                        component.element.classList.remove("activated");
                    }
                });
                if (_MouseManager__WEBPACK_IMPORTED_MODULE_11__.MouseManager.mouse.x !== -1 && _MouseManager__WEBPACK_IMPORTED_MODULE_11__.MouseManager.mouse.y !== -1) {
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
                _WiringManager__WEBPACK_IMPORTED_MODULE_14__.WiringManager.wires.addAll(wirings);
                this.selected.clear();
                components.forEach((component) => this.addSelection(component));
                _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.snapToGridBasedUpdate();
            }
        }, () => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.deleteAll(components);
            components.forEach((component) => {
                component.detach();
            });
            _WiringManager__WEBPACK_IMPORTED_MODULE_14__.WiringManager.wires.deleteAll(wirings);
            this.selected.clear();
            selection.forEach((component) => this.addSelection(component));
        });
    };
    static select(reified) {
        this.selected.clear();
        this.selected.add(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.element.style.zIndex = "1000";
        return this;
    }
    static selectAllIn(from, to) {
        this.selected.clear();
        const reified = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active].filter((component) => (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.overlappedBounds)(component.element.getBoundingClientRect(), from, to));
        this.selected.addAll(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.forEach((component) => (component.element.style.zIndex = "1000"));
        return this;
    }
    static addSelection(reified) {
        this.selected.add(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.element.style.zIndex = "1000";
        return this;
    }
    static isSelected(element) {
        return [...this.selected].some((component) => {
            if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_5__.Input)
                return element === component.element;
            if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output)
                return element === component.element;
            if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_4__.Display)
                return (component.inputs.some((input) => element === input) ||
                    component.outputs.some((output) => element === output) ||
                    element === component.element);
            throw new Error("Unknown component type.");
        });
    }
    static render({ fg }) {
        SelectionManager.selected.forEach((component) => {
            const rect = component.element.getBoundingClientRect();
            fg.strokeStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_ACTIVATED_COLOR)();
            fg.lineWidth = 1;
            fg.lineJoin = "miter";
            fg.strokeRect(rect.left - 15, rect.top - 15, rect.width + 15 + 15, rect.height + 15 + 15);
        });
    }
    static listen() {
        _CanvasManager__WEBPACK_IMPORTED_MODULE_8__.CanvasManager.addJob(this.render.bind(this));
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

/***/ "./src/managers/StorageManager.ts":
/*!****************************************!*\
  !*** ./src/managers/StorageManager.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StorageManager": () => (/* binding */ StorageManager)
/* harmony export */ });
class StorageManager {
    static prefix = "kelsny.gatesim:";
    static storage = window.localStorage;
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TestingManager": () => (/* binding */ TestingManager)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");






class TestingManager {
    static #testing = false;
    static async test(cases, { timeout = 1000 } = {}) {
        if (this.#testing)
            return _ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.alert("Diagram is already under testing.");
        this.#testing = true;
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.lock();
        _WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.lock();
        const inputs = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active]
            .filter((component) => component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_1__.Input)
            .sort((a, b) => parseFloat(a.element.style.top) - parseFloat(b.element.style.top));
        const outputs = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active]
            .filter((component) => component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_2__.Output)
            .sort((a, b) => parseFloat(a.element.style.top) - parseFloat(b.element.style.top));
        const originalActivations = inputs.map((input) => input.element.classList.contains("activated"));
        let failed = false;
        for (const [givenInputs, expectedOutputs] of cases) {
            if (inputs.length !== givenInputs.length)
                throw new Error("Mismatched input lengths.");
            if (outputs.length !== expectedOutputs.length)
                throw new Error("Mismatched output lengths.");
            for (const [index, input] of inputs.entries()) {
                input.element.classList.toggle("activated", givenInputs[index]);
            }
            await (0,_constants__WEBPACK_IMPORTED_MODULE_0__.DELAY)(timeout);
            const realOutputs = outputs.map((output) => output.element.classList.contains("activated"));
            if (!realOutputs.every((out, i) => out === expectedOutputs[i])) {
                failed = true;
                await _ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.alert(`Diagram failed to pass the test with inputs "${givenInputs
                    .map((boolean) => +boolean)
                    .join(" ")}".`);
                break;
            }
            await (0,_constants__WEBPACK_IMPORTED_MODULE_0__.DELAY)(0);
        }
        if (!failed)
            await _ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.alert("Diagram passed all the tests.");
        originalActivations.forEach((value, i) => inputs[i].element.classList.toggle("activated", value));
        _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.unlock();
        _WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.unlock();
        this.#testing = false;
        return this;
    }
    static get testing() {
        return this.#testing;
    }
}


/***/ }),

/***/ "./src/managers/ToastManager.ts":
/*!**************************************!*\
  !*** ./src/managers/ToastManager.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./src/managers/UndoRedoManager.ts":
/*!*****************************************!*\
  !*** ./src/managers/UndoRedoManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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
/* harmony import */ var _TestingManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TestingManager */ "./src/managers/TestingManager.ts");






class NewWireContext {
    static from;
    static {
        _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.onMouseDown((e) => {
            if (NewWireContext.from) {
                const { target } = e;
                if (target && target instanceof HTMLElement) {
                    if (target.classList.contains("board-output") ||
                        target.classList.contains("component-input-button")) {
                        if (_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
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
            bg.beginPath();
            bg.moveTo(from.x + from.width / 2, from.y + from.height / 2);
            bg.lineTo(to.x + to.width / 2, to.y + to.height / 2);
            bg.closePath();
            bg.stroke();
        });
        if (NewWireContext.from) {
            const from = NewWireContext.from.getBoundingClientRect();
            bg.strokeStyle = NewWireContext.from.classList.contains("activated")
                ? (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_ACTIVATED_COLOR)()
                : (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_GRAY_COLOR)();
            bg.lineWidth = 5;
            bg.lineJoin = "round";
            bg.beginPath();
            bg.moveTo(from.x + from.width / 2, from.y + from.height / 2);
            bg.lineTo(_MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y);
            bg.closePath();
            bg.stroke();
        }
    }
    static init() {
        _CanvasManager__WEBPACK_IMPORTED_MODULE_2__.CanvasManager.addJob(this.render.bind(this));
    }
}


/***/ }),

/***/ "./src/premade/example.ts":
/*!********************************!*\
  !*** ./src/premade/example.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "example": () => (/* binding */ example)
/* harmony export */ });
/* harmony import */ var _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../contextmenu/menu */ "./src/contextmenu/menu.ts");
/* harmony import */ var _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../keybinds/keybinds */ "./src/keybinds/keybinds.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");








const example = {
    "example:halfadder": ({ name: save }) => {
        const components = [
            new _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input({ x: 100, y: 100, centered: true }),
            new _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input({ x: 100, y: 200, centered: true }),
            new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_4__.XorGate(), { x: 300, y: 100, centered: true }),
            new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_4__.AndGate(), { x: 300, y: 200, centered: true }),
            new _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output({ x: 500, y: 100, centered: true }),
            new _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output({ x: 500, y: 200, centered: true }),
        ];
        const [i1, i2, xor, and, o1, o2] = components;
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.setup({
            keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__.keybinds,
            menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu,
            save,
            initial: [
                components.map((component) => component.permanent()),
                [
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i1.element, xor.inputs[0]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i1.element, and.inputs[0]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i2.element, xor.inputs[1]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i2.element, and.inputs[1]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(xor.outputs[0], o1.element),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(and.outputs[0], o2.element),
                ],
            ],
            limits: {
                inputs: 2,
                outputs: 2,
                chipsTotal: 2,
                wirings: 6,
                componentsTotal: 6,
                chips: { AND: 1, XOR: 1 },
            },
        });
    },
    "example:fulladder": ({ name: save }) => {
        const components = [
            new _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input({ x: 100, y: 100, centered: true }),
            new _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input({ x: 100, y: 200, centered: true }),
            new _reified_Input__WEBPACK_IMPORTED_MODULE_6__.Input({ x: 100, y: 300, centered: true }),
            new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_4__.XorGate(), { x: 250, y: 100, centered: true }),
            new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_4__.AndGate(), { x: 250, y: 200, centered: true }),
            new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_4__.AndGate(), { x: 250, y: 300, centered: true }),
            new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_4__.XorGate(), { x: 400, y: 150, centered: true }),
            new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_4__.OrGate(), { x: 400, y: 250, centered: true }),
            new _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output({ x: 550, y: 150, centered: true }),
            new _reified_Output__WEBPACK_IMPORTED_MODULE_7__.Output({ x: 550, y: 250, centered: true }),
        ];
        const [i1, i2, i3, xor1, and1, and2, xor2, or, o1, o2] = components;
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.setup({
            keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__.keybinds,
            menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu,
            save,
            initial: [
                components.map((component) => component.permanent()),
                [
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i1.element, xor1.inputs[0]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i1.element, and2.inputs[0]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i2.element, xor1.inputs[1]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i2.element, and2.inputs[1]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i3.element, and1.inputs[1]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(i3.element, xor2.inputs[1]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(xor1.outputs[0], and1.inputs[0]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(xor1.outputs[0], xor2.inputs[0]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(and1.outputs[0], or.inputs[0]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(and2.outputs[0], or.inputs[1]),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(xor2.outputs[0], o1.element),
                    new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(or.outputs[0], o2.element),
                ],
            ],
            limits: {
                inputs: 3,
                outputs: 2,
                chipsTotal: 5,
                wirings: 12,
                componentsTotal: 10,
                chips: { AND: 2, XOR: 2, OR: 1 },
            },
        });
    },
};


/***/ }),

/***/ "./src/premade/index.ts":
/*!******************************!*\
  !*** ./src/premade/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "premade": () => (/* binding */ premade)
/* harmony export */ });
/* harmony import */ var _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../contextmenu/menu */ "./src/contextmenu/menu.ts");
/* harmony import */ var _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../keybinds/keybinds */ "./src/keybinds/keybinds.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _example__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./example */ "./src/premade/example.ts");
/* harmony import */ var _nand__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nand */ "./src/premade/nand.ts");





const premade = new Map([
    ...Object.entries(_example__WEBPACK_IMPORTED_MODULE_3__.example),
    ["sandbox", () => _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.setup({ keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__.keybinds, menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu, save: "sandbox" })],
    ...Object.entries(_nand__WEBPACK_IMPORTED_MODULE_4__.nand),
]);


/***/ }),

/***/ "./src/premade/nand.ts":
/*!*****************************!*\
  !*** ./src/premade/nand.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "nand": () => (/* binding */ nand)
/* harmony export */ });
/* harmony import */ var _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../contextmenu/menu */ "./src/contextmenu/menu.ts");
/* harmony import */ var _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../keybinds/keybinds */ "./src/keybinds/keybinds.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");









const nand = {
    "nand:not": ({ name: save }) => {
        _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.test([
                        [[true], [false]],
                        [[false], [true]],
                    ], { timeout: 500 });
                },
            },
        });
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.setup({
            keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__.keybinds,
            menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu,
            save,
            initial: [
                [
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 100, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 100, centered: true }),
                    new _reified_Output__WEBPACK_IMPORTED_MODULE_8__.Output({ x: 500, y: 100, centered: true }),
                ].map((component) => component.permanent()),
                [],
            ],
            limits: {
                inputs: 1,
                outputs: 1,
                chipsTotal: 1,
                wirings: 3,
                componentsTotal: 3,
                chips: { NAND: 1 },
            },
        });
        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__.ModalManager.alert("Recreate a NOT gate using only a NAND gate.");
    },
    "nand:and": ({ name: save }) => {
        _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.test([
                        [[false, false], [false]],
                        [[true, false], [false]],
                        [[false, true], [false]],
                        [[true, true], [true]],
                    ], { timeout: 750 });
                },
            },
        });
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.setup({
            keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__.keybinds,
            menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu,
            save,
            initial: [
                [
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 100, centered: true }),
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 200, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 100, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 200, centered: true }),
                    new _reified_Output__WEBPACK_IMPORTED_MODULE_8__.Output({ x: 500, y: 150, centered: true }),
                ].map((component) => component.permanent()),
                [],
            ],
            limits: {
                inputs: 2,
                outputs: 1,
                chipsTotal: 2,
                wirings: 5,
                componentsTotal: 5,
                chips: { NAND: 2 },
            },
        });
        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__.ModalManager.alert("Recreate an AND gate using only NAND gates.");
    },
    "nand:or": ({ name: save }) => {
        _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.test([
                        [[false, false], [false]],
                        [[true, false], [true]],
                        [[false, true], [true]],
                        [[true, true], [true]],
                    ], { timeout: 1000 });
                },
            },
        });
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.setup({
            keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__.keybinds,
            menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu,
            save,
            initial: [
                [
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 100, centered: true }),
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 200, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 100, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 150, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 200, centered: true }),
                    new _reified_Output__WEBPACK_IMPORTED_MODULE_8__.Output({ x: 600, y: 150 }),
                ].map((component) => component.permanent()),
                [],
            ],
            limits: {
                inputs: 2,
                outputs: 1,
                chipsTotal: 3,
                wirings: 7,
                componentsTotal: 6,
                chips: { NAND: 3 },
            },
        });
        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__.ModalManager.alert("Recreate an OR gate using only NAND gates.");
    },
    "nand:xor": ({ name: save }) => {
        _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.test([
                        [[false, false], [false]],
                        [[true, false], [true]],
                        [[false, true], [true]],
                        [[true, true], [false]],
                    ], { timeout: 1250 });
                },
            },
        });
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.setup({
            keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_1__.keybinds,
            menu: _contextmenu_menu__WEBPACK_IMPORTED_MODULE_0__.menu,
            save,
            initial: [
                [
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 100, centered: true }),
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 200, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 100, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 200, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 500, y: 100, centered: true }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 500, y: 200, centered: true }),
                    new _reified_Output__WEBPACK_IMPORTED_MODULE_8__.Output({ x: 700, y: 150, centered: true }),
                ].map((component) => component.permanent()),
                [],
            ],
            limits: {
                inputs: 2,
                outputs: 1,
                chipsTotal: 4,
                wirings: 9,
                componentsTotal: 8,
                chips: { NAND: 4 },
            },
        });
        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_2__.ModalManager.alert("Recreate a XOR gate using only NAND gates.");
    },
};


/***/ }),

/***/ "./src/quickpicks/components.ts":
/*!**************************************!*\
  !*** ./src/quickpicks/components.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "quickpickGates": () => (/* binding */ quickpickGates)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_QuickPickManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/QuickPickManager */ "./src/managers/QuickPickManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");







const quickpickGates = (e) => _managers_QuickPickManager__WEBPACK_IMPORTED_MODULE_1__.QuickPickManager.activate(e, _reified_chips__WEBPACK_IMPORTED_MODULE_4__.gates.map((gate) => ({
    label: gate.NAME,
    callback(e) {
        const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(Reflect.construct(gate, []), _constants__WEBPACK_IMPORTED_MODULE_0__.ORIGIN_POINT);
        const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.clone(true);
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.add(component);
            if (_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.has(component)) {
                component.attach();
                const { width, height } = getComputedStyle(component.element);
                component.move({
                    x: e.clientX - parseFloat(width) / 2,
                    y: e.clientY - parseFloat(height) / 2,
                });
                _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.select(component);
            }
        }, () => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active["delete"](component);
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ Component)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");








class Component extends _Reified__WEBPACK_IMPORTED_MODULE_7__.Reified {
    element;
    inputs;
    outputs;
    name;
    #observers = new Map();
    #mouseups = new Map();
    #contextmenus = new Map();
    #clicks = new Map();
    chip;
    #angle = 0;
    #complementary = false;
    constructor(chip, pos, complementary = false) {
        super();
        this.chip = chip;
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_7__.html `
            <div class="component">
                <div class="component-inputs">
                    ${Array(this.chip.inputs).fill('<button class="component-input-button">I</button>').join("")}
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
        await (0,_constants__WEBPACK_IMPORTED_MODULE_0__.DELAY)(100 + Math.random() * 50 - 25);
        this.outputs.forEach((output, i) => {
            output.classList.toggle("activated", out[i]);
        });
        return this;
    }
    get angle() {
        return this.#angle;
    }
    set angle(v) {
        this.#angle = v % 360;
        this.element.style.transform = `rotateZ(${v}deg)`;
        if (v === 180) {
            this.name.style.transform = `rotateZ(${v}deg)`;
        }
        else {
            this.name.style.transform = "";
        }
        this.element.style.transformOrigin = (0,_Reified__WEBPACK_IMPORTED_MODULE_7__.computeTransformOrigin)(this.element);
    }
    get complementary() {
        return this.#complementary;
    }
    set complementary(v) {
        this.#complementary = v;
    }
    rotate(angle) {
        this.angle = angle;
        return this;
    }
    attach() {
        super.attach();
        this.#attachListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.watch(this.element, this.name);
        return this;
    }
    detach() {
        super.detach();
        this.#destroyListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.forget(this.element, true);
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
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.queueNewContext(() => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.forEach((wire) => {
                                        if (wire.to === input) {
                                            wire.destroy();
                                            deleted.push(wire.from);
                                        }
                                    });
                                    input.classList.remove("activated");
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.Wiring(from, input)));
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
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.queueNewContext(() => [
                    {
                        "create-connection": {
                            label: "Create connection",
                            keybind: "Q",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.NewWireContext.from = output;
                                return undefined;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.forEach((wire) => {
                                        if (wire.from === output) {
                                            wire.destroy();
                                            wire.to.classList.remove("activated");
                                            deleted.push(wire.to);
                                        }
                                    });
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.Wiring(output, to)));
                                });
                            },
                        },
                    },
                ]);
            });
            this.#clicks.set(output, () => {
                if (_managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.isKeyDown("KeyQ"))
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.NewWireContext.from = output;
            });
        });
        this.#contextmenus.set(this.name, () => {
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.queueNewContext(() => [
                {
                    "delete-component": {
                        label: "Delete component",
                        keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ X" : "Ctrl X",
                        callback: () => {
                            if (this.PERMANENT)
                                return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
                                    message: "This component is permanent and cannot be deleted.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                    duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                                });
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
                                _Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active["delete"](this);
                                this.detach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.add(this);
                                this.attach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.Wiring(from, to)));
                            });
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.Wiring(from, to)));
                            });
                        },
                    },
                },
                {
                    "toggle-complementary": {
                        label: "Complementary output",
                        callback: () => { },
                    },
                },
                {
                    "rotate-component": {
                        label: "Rotate component",
                        keybind: "R",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
                                this.angle += 90;
                            }, () => {
                                this.angle -= 90;
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Display": () => (/* binding */ Display)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");









class Display extends _Reified__WEBPACK_IMPORTED_MODULE_8__.Reified {
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
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_8__.html `
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
        await (0,_constants__WEBPACK_IMPORTED_MODULE_0__.DELAY)(100 + Math.random() * 50 - 25);
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
        this.element.style.transformOrigin = (0,_Reified__WEBPACK_IMPORTED_MODULE_8__.computeTransformOrigin)(this.element);
    }
    rotate(angle) {
        this.angle = angle;
        return this;
    }
    attach() {
        super.attach();
        this.#attachListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.watch(this.element, this.display);
        return this;
    }
    detach() {
        super.detach();
        this.#destroyListeners();
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.forget(this.element, true);
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
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.queueNewContext(() => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.forEach((wire) => {
                                        if (wire.to === input) {
                                            wire.destroy();
                                            deleted.push(wire.from);
                                        }
                                    });
                                    input.classList.remove("activated");
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.Wiring(from, input)));
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
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.queueNewContext(() => [
                    {
                        "create-connection": {
                            label: "Create connection",
                            keybind: "Q",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.NewWireContext.from = output;
                                return undefined;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.forEach((wire) => {
                                        if (wire.from === output) {
                                            wire.destroy();
                                            wire.to.classList.remove("activated");
                                            deleted.push(wire.to);
                                        }
                                    });
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.Wiring(output, to)));
                                });
                            },
                        },
                    },
                ]);
            });
            this.#clicks.set(output, () => {
                if (_managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.isKeyDown("KeyQ"))
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.NewWireContext.from = output;
            });
        });
        this.#contextmenus.set(this.display, () => {
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.queueNewContext(() => [
                {
                    "set-bits": {
                        label: "Set bits",
                        callback: async () => {
                            const input = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.prompt("Enter the number of bits:");
                            if (!input)
                                return;
                            const bits = +input;
                            if (Number.isNaN(bits) || !Number.isInteger(bits) || bits < 1)
                                return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.toast({
                                    message: "Number of bits must be a positive integer.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                    duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                                });
                            if (this.#bits === bits)
                                return;
                            const previous = this.#bits;
                            const deleted = [];
                            const inputs = [...this.inputs];
                            const outputs = [...this.outputs];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                                this.#bits = bits;
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.forEach((wire) => {
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
                                this.inputs.splice(0, this.inputs.length, ...Array(bits)
                                    .fill(undefined)
                                    .map(() => _Reified__WEBPACK_IMPORTED_MODULE_8__.html `<button class="component-input-button">I</button>`));
                                this.outputs.splice(0, this.outputs.length, ...Array(bits)
                                    .fill(undefined)
                                    .map(() => _Reified__WEBPACK_IMPORTED_MODULE_8__.html `<button class="component-output-button">O</button>`));
                                const ic = this.element.querySelector(".component-inputs");
                                const oc = this.element.querySelector(".component-outputs");
                                this.inputs.forEach((i) => ic.appendChild(i));
                                this.outputs.forEach((o) => oc.appendChild(o));
                                this.#updateListeners();
                                this.#attachListeners();
                                this.update();
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.forceSave();
                                _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.snapToGridBasedUpdate();
                            }, () => {
                                this.#bits = previous;
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.Wiring(from, to)));
                                this.#destroyListeners();
                                this.inputs.forEach((i) => i.remove());
                                this.outputs.forEach((o) => o.remove());
                                this.inputs.splice(0, this.inputs.length, ...inputs);
                                this.outputs.splice(0, this.outputs.length, ...outputs);
                                const ic = this.element.querySelector(".component-inputs");
                                const oc = this.element.querySelector(".component-outputs");
                                this.inputs.forEach((i) => ic.appendChild(i));
                                this.outputs.forEach((o) => oc.appendChild(o));
                                this.#updateListeners();
                                this.#attachListeners();
                                this.update();
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.forceSave();
                                _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.snapToGridBasedUpdate();
                            });
                        },
                    },
                    "set-radix": {
                        label: "Set radix",
                        callback: async () => {
                            const input = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.prompt("Enter the number of bits:");
                            if (!input)
                                return;
                            const radix = +input;
                            if (Number.isNaN(radix) || !Number.isInteger(radix) || radix < 1 || radix > 16)
                                return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.toast({
                                    message: "Display radix must be an integer from 1 to 16.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                    duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                                });
                            const previous = this.#radix;
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                                this.#radix = radix;
                                this.update();
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.forceSave();
                            }, () => {
                                this.#radix = previous;
                                this.update();
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.forceSave();
                            });
                        },
                    },
                },
                {
                    "rotate-component": {
                        label: "Rotate component",
                        keybind: "R",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
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
                        keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ X" : "Ctrl X",
                        callback: () => {
                            if (this.PERMANENT)
                                return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_6__.ToastManager.toast({
                                    message: "This component is permanent and cannot be deleted.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                    duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                                });
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                                _Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active["delete"](this);
                                this.detach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active.add(this);
                                this.attach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.Wiring(from, to)));
                            });
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_5__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.Wiring(from, to)));
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Input": () => (/* binding */ Input)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");








class Input extends _Reified__WEBPACK_IMPORTED_MODULE_7__.Reified {
    element;
    constructor(pos = { x: 0, y: 0 }) {
        super();
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="board-input">I</button>`;
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
        if (_managers_KeybindsManager__WEBPACK_IMPORTED_MODULE_2__.KeybindsManager.isKeyDown("KeyQ"))
            return (_managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.NewWireContext.from = this.element);
        if (Math.hypot(e.clientX - +this.element.dataset.x, e.clientY - +this.element.dataset.y) > 2)
            return;
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        const active = this.element.classList.contains("activated");
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
            this.element.classList.toggle("activated", !active);
        }, () => {
            this.element.classList.toggle("activated", active);
        });
    };
    #contextmenu = () => {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.queueNewContext(() => [
            {
                "create-connection": {
                    label: "Create connection",
                    keybind: "Q",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.NewWireContext.from = this.element;
                    },
                },
                "delete-input": {
                    label: "Delete input",
                    keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ X" : "Ctrl X",
                    callback: () => {
                        if (this.PERMANENT)
                            return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
                                message: "This input is permanent and cannot be deleted.",
                                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                            });
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
                            _Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active["delete"](this);
                            this.detach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.forEach((wire) => {
                                if (wire.from === this.element) {
                                    wire.destroy();
                                    wire.to.classList.remove("activated");
                                    deleted.push(wire.to);
                                }
                            });
                        }, () => {
                            _Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.add(this);
                            this.attach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.Wiring(this.element, to)));
                        });
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                    callback: () => {
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.pushHistory(() => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.forEach((wire) => {
                                if (wire.from === this.element) {
                                    wire.destroy();
                                    wire.to.classList.remove("activated");
                                    deleted.push(wire.to);
                                }
                            });
                        }, () => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.Wiring(this.element, to)));
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
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.watch(this.element);
        return this;
    }
    detach() {
        super.detach();
        this.element.removeEventListener("mouseup", this.#mouseup);
        this.element.removeEventListener("mousedown", this.#mousedown);
        this.element.removeEventListener("click", this.#click);
        this.element.removeEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.forget(this.element, true);
        return this;
    }
}


/***/ }),

/***/ "./src/reified/Output.ts":
/*!*******************************!*\
  !*** ./src/reified/Output.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Output": () => (/* binding */ Output)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");







class Output extends _Reified__WEBPACK_IMPORTED_MODULE_6__.Reified {
    element;
    #mouseup = () => {
        this.element.blur();
    };
    #contextmenu = () => {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.queueNewContext(() => [
            {
                "delete-output": {
                    label: "Delete output",
                    keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⌘ X" : "Ctrl X",
                    callback: () => {
                        if (this.PERMANENT)
                            return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__.ToastManager.toast({
                                message: "This output is permanent and cannot be deleted.",
                                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                            });
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                            _Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active["delete"](this);
                            this.detach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                                if (wire.to === this.element) {
                                    wire.destroy();
                                    deleted.push(wire.from);
                                }
                            });
                            this.element.classList.remove("activated");
                        }, () => {
                            _Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.add(this);
                            this.attach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(from, this.element)));
                        });
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    keybind: _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                    callback: () => {
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                                if (wire.to === this.element) {
                                    wire.destroy();
                                    deleted.push(wire.from);
                                }
                            });
                            this.element.classList.remove("activated");
                        }, () => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(from, this.element)));
                        });
                    },
                },
            },
        ]);
    };
    constructor(pos = { x: 0, y: 0 }) {
        super();
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_6__.html `<button class="board-output">O</button>`;
        this.move(pos);
    }
    attach() {
        super.attach();
        this.element.addEventListener("mouseup", this.#mouseup);
        this.element.addEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.watch(this.element);
        return this;
    }
    detach() {
        super.detach();
        this.element.removeEventListener("mouseup", this.#mouseup);
        this.element.removeEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.forget(this.element, true);
        return this;
    }
}


/***/ }),

/***/ "./src/reified/Reified.ts":
/*!********************************!*\
  !*** ./src/reified/Reified.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
}


/***/ }),

/***/ "./src/reified/chips.ts":
/*!******************************!*\
  !*** ./src/reified/chips.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
        return [!!(+!!(+a ^ +b) ^ +c), (!!(+a ^ +b) && c) || (a && b)];
    }
}
chips.set(FullAdderGate.NAME, FullAdderGate);
chips.set("FADD", FullAdderGate);


/***/ }),

/***/ "./src/styling/attacher.ts":
/*!*********************************!*\
  !*** ./src/styling/attacher.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attachStyles": () => (/* binding */ attachStyles)
/* harmony export */ });
const attachStyles = async (styles) => {
    const css = await Promise.all(styles.map((name) => __webpack_require__("./src/styling lazy recursive ^\\.\\/.*\\.ts$")(`./${name}.ts`))).then((css) => css.map((_) => _.default).join(""));
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return new Promise((resolve, reject) => {
        style.addEventListener("load", () => resolve(), { once: true });
        style.addEventListener("error", () => reject(), { once: true });
    });
};


/***/ }),

/***/ "./src/styling/buttons.ts":
/*!********************************!*\
  !*** ./src/styling/buttons.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_1__.css `
    button.darkmode {
        position: absolute;

        left: 16px;
        bottom: 16px;

        width: 40px;
        height: 40px;

        font-size: 18px;

        border: none;
        border-radius: 50%;

        cursor: pointer;

        user-select: none;

        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_LIGHTER_GRAY_CSS_COLOR};

        transition: 0.1s ease background-color;
    }

    button.darkmode:hover {
        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHTER_GRAY_CSS_COLOR};
    }

    button.undo {
        left: 64px;
    }

    button.redo {
        left: 122px;
    }

    button.undo,
    button.redo {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.KINDA_LIGHT_GRAY_CSS_COLOR};

        bottom: 24px;

        position: absolute;

        font-size: 16px;

        border: none;

        background: transparent;

        cursor: pointer;

        user-select: none;

        transition: 0.1s ease color;
    }

    button.undo:hover,
    button.redo:hover {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.SUPER_GRAY_CSS_COLOR};
    }
`);


/***/ }),

/***/ "./src/styling/cad.ts":
/*!****************************!*\
  !*** ./src/styling/cad.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.css `
    body {
        display: flex;
        flex-direction: column;
    }

    truth-table {
        flex: 1;

        width: 100%;

        max-width: 100%;

        max-height: 500px;
    }

    div.truth-table {
        position: relative;

        height: 100%;
        width: 100%;

        max-width: 100%;

        overflow: hidden;

        display: flex;
        flex-direction: column;
    }

    div.truth-table pre {
        flex: 1;
    }

    div.truth-table .input-highlight,
    div.truth-table .table-input {
        -ms-overflow-style: none;
        scrollbar-width: none;

        position: absolute;
        top: 0;
        left: 0;

        font-size: 16px;
        font-family: Fira Code, monospace;

        line-height: 1;

        letter-spacing: 0;

        word-spacing: 0;
        word-break: break-all;
        word-wrap: break-word;

        overflow-wrap: break-word;
        text-overflow: clip;

        overflow: scroll;
        overscroll-behavior: none;
        white-space: pre;

        border: none;
        outline: none;

        padding: 0.5rem;

        width: 100%;
        height: 100%;

        background: transparent;

        max-height: calc(100% - 52px);
    }

    div.truth-table .input-highlight {
        z-index: 0;
    }

    div.truth-table .table-input {
        z-index: 1;

        color: transparent;
        caret-color: black;
    }

    div.truth-table .input-highlight::-webkit-scrollbar,
    div.truth-table .table-input::-webkit-scrollbar {
        display: none;
    }

    div.truth-table .input-highlight::-webkit-scrollbar-thumb,
    div.truth-table .table-input::-webkit-scrollbar-thumb {
        background: transparent;
    }

    div.truth-table > div.buttons {
        display: flex;

        min-height: 52px;
    }

    div.truth-table > div.buttons > button {
        flex: 1;

        padding: 1rem 0.5rem;

        display: grid;
        place-items: center;

        user-select: none;
    }

    div.truth-table > div.buttons > button:hover {
        cursor: pointer;
    }

    cad-output {
        flex: 1;
    }

    cad-output div.cad-output {
        height: 100%;

        font-size: 16px;
        font-family: Fira Code, monospace;

        line-height: 1;

        letter-spacing: 0;

        word-spacing: 0;
        word-break: break-all;
        word-wrap: break-word;

        overflow-wrap: break-word;
        text-overflow: clip;

        overflow: scroll;
        overscroll-behavior: none;
        white-space: pre;

        padding: 0.5rem;
    }

    @media (min-width: 984px) {
        body {
            flex-direction: row;
        }

        truth-table {
            max-height: unset;

            max-width: 50vw;
        }

        cad-output {
            max-width: 50vw;
        }

        div.cad-output {
            border-left: 1px solid black;

            max-width: 50vw;
        }
    }
`);


/***/ }),

/***/ "./src/styling/component.ts":
/*!**********************************!*\
  !*** ./src/styling/component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_1__.css `
    .display,
    .component {
        position: absolute;

        z-index: 10;

        display: grid;
        place-items: center;
        grid-template-columns: 6px auto 6px;

        height: fit-content;
        width: fit-content;

        min-height: 40px;
        min-width: 100px;

        background-color: white;

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
        border-radius: 4px;
    }

    .display:hover,
    .component:hover {
        cursor: grab;
    }

    .component-inputs,
    .component-outputs {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        height: 100%;

        gap: 4px;
    }

    .component-input-button,
    .component-output-button {
        display: grid;
        place-items: center;

        font-family: serif;
        font-weight: 900;
        font-size: 12px;

        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.SUPER_GRAY_CSS_COLOR};

        height: 16px;
        width: 16px;

        padding: 0;

        user-select: none;

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
    }

    .component-input-button {
        margin-left: -6px;

        border-radius: 50%;
    }

    .component-output-button {
        margin-right: -6px;

        border-radius: 2px;
    }

    .component-input-button.activated,
    .component-output-button.activated {
        color: #ff7777;
    }

    .display-content,
    .component-name {
        height: 100%;
        width: 100%;

        display: grid;
        place-items: center;

        font-family: sans-serif;
        font-weight: 900;
        font-size: 1.5rem;

        padding: 0 8px;

        color: #333333;

        user-select: none;
    }
`);


/***/ }),

/***/ "./src/styling/contextmenu.ts":
/*!************************************!*\
  !*** ./src/styling/contextmenu.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_1__.css `
    .contextmenu {
        position: absolute;

        z-index: 100;

        display: flex;
        flex-direction: column;

        width: 200px;

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
        border-radius: 4px;

        background-color: #fefefe;

        user-select: none;

        box-shadow: 1px 1px 4px ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
    }

    .contextmenu > .br {
        display: block;

        width: 100%;

        border-bottom: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
    }

    .contextmenu > button {
        text-align: left;

        background: transparent;

        border: none;

        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 8px 8px;

        color: #999999;
    }

    .contextmenu > button:hover {
        cursor: pointer;

        color: #333333;

        background: #f0f0f0;
    }

    .menu-keybind {
        color: #dddddd;

        display: flex;
        align-items: center;

        gap: 2px;
    }

    .menu-keybind > span {
        display: grid;

        place-items: center;

        min-height: 20px;
        min-width: 14px;
    }

    .contextmenu > button:hover > .menu-keybind {
        color: #bbbbbb;
    }
`);


/***/ }),

/***/ "./src/styling/darkmode.ts":
/*!*********************************!*\
  !*** ./src/styling/darkmode.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_1__.css `
    body.darkmode {
        background-color: #010102;
    }

    body.darkmode button.darkmode {
        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode button.darkmode:hover {
        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARK_GRAY_CSS_COLOR};
    }

    body.darkmode button.undo,
    body.darkmode button.redo {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.NOT_REALLY_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode button.undo:hover,
    body.darkmode button.redo:hover {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode .board-input,
    body.darkmode .board-output {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHTER_GRAY_CSS_COLOR};

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.NOT_REALLY_DARK_GRAY_CSS_COLOR};

        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.KINDA_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode .activated {
        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARK_ACTIVATED_CSS_COLOR};
    }

    body.darkmode .component-input-button.activated,
    body.darkmode .component-output-button.activated {
        color: #ff9999;

        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARK_ACTIVATED_CSS_COLOR};
    }

    body.darkmode .component-input-button,
    body.darkmode .component-output-button {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.NOT_REALLY_DARK_GRAY_CSS_COLOR};

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARKER_GRAY_CSS_COLOR};

        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.SLIGHTLY_DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .display,
    body.darkmode .component {
        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_DARKER_GRAY_CSS_COLOR};

        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.SLIGHTLY_DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .display-content,
    body.darkmode .component-name {
        font-weight: 100;

        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.KINDA_LIGHT_GRAY_CSS_COLOR};
    }

    body.darkmode .contextmenu {
        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARKER_GRAY_CSS_COLOR};

        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_DARKER_GRAY_CSS_COLOR};

        box-shadow: 1px 1px 4px ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .contextmenu > .br {
        border-bottom: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .contextmenu > button {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode .contextmenu > button:hover {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};

        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .menu-keybind {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .contextmenu > button:hover > .menu-keybind {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode .toast {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.DARKER_GRAY_CSS_COLOR};

        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.SLIGHTLY_DARKER_GRAY_CSS_COLOR};

        box-shadow: 1px 1px 4px ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .close-toast {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.KINDA_LIGHT_GRAY_CSS_COLOR};
    }

    body.darkmode .quickpick-item {
        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.KINDA_LIGHT_GRAY_CSS_COLOR};
    }
`);


/***/ }),

/***/ "./src/styling/io.ts":
/*!***************************!*\
  !*** ./src/styling/io.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_1__.css `
    .board-input,
    .board-output {
        position: absolute;

        z-index: 20;

        display: grid;
        place-items: center;

        color: #333333;

        font-family: serif;
        font-weight: 900;
        font-size: 16px;

        height: 24px;
        width: 24px;

        user-select: none;

        padding: 0;

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
    }

    .board-input {
        border-radius: 50%;
    }

    .board-output {
        border-radius: 4px;
    }

    .board-input:hover {
        cursor: pointer;
    }

    .board-output:hover {
        cursor: grab;
    }

    .activated {
        background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR};

        color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_LIGHTER_GRAY_CSS_COLOR};
    }
`);


/***/ }),

/***/ "./src/styling/modals.ts":
/*!*******************************!*\
  !*** ./src/styling/modals.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_1__.css `
    .modal-container {
        position: absolute;

        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        z-index: 1000;

        background-color: #000000aa;
    }

    .modal-container.modal-inactive,
    .modal.modal-inactive {
        display: none;
    }

    .modal {
        position: absolute;

        transform: translate(calc(50vw - 50%), calc(50vh - 50%));
    }

    .modal-confirm,
    .modal-alert {
        min-width: 400px;
        min-height: 80px;

        background-color: #efefef;

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
        border-radius: 4px;

        padding: 8px 10px;

        display: flex;
        flex-direction: column;

        box-shadow: 1px 1px 4px #333333;
    }

    .modal-confirm > .button-container,
    .modal-alert > .button-container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;

        gap: 6px;
    }

    .modal-message {
        font-family: sans-serif;

        flex: 1;
    }

    .modal-cancel,
    .modal-ok {
        min-width: 50px;

        padding: 4px 8px;

        font-size: 12px;
        text-transform: uppercase;

        border: 0;
        border-radius: 2px;

        user-select: none;

        align-self: flex-end;
    }

    .modal-cancel {
        outline: 1px solid #333333;
    }

    .modal-ok {
        color: white;

        background-color: #0077ff;

        outline: 1px solid #0077ff;
    }

    .modal-cancel:hover {
        cursor: pointer;

        background-color: #eaeaea;
    }

    .modal-ok:hover {
        cursor: pointer;

        background-color: #0066ee;

        outline: 1px solid #0066ee;
    }

    .modal-input {
        margin: 8px 0;

        padding: 2px 4px;

        font-size: 12px;

        background: transparent;

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
        border-radius: 2px;
    }

    .modal-popup {
        width: 600px;
        max-width: 600px;
    }

    .modal-popup .modal-message {
        height: 450px;
        max-height: 450px;

        overflow-y: scroll;

        display: flex;
        flex-direction: column;
        gap: 16px;
    }
`);


/***/ }),

/***/ "./src/styling/quickpick.ts":
/*!**********************************!*\
  !*** ./src/styling/quickpick.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.css `
    .quickpick-item {
        position: absolute;

        font-family: sans-serif;

        opacity: 0;

        transition-duration: 0.2s;
        transition-timing-function: ease;
        transition-property: top, left;

        animation: forwards ease 0.2s fade-in;

        user-select: none;
    }

    .quickpick-circle {
        position: absolute;

        animation: forwards ease 0.2s fade-in;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
`);


/***/ }),

/***/ "./src/styling/style.ts":
/*!******************************!*\
  !*** ./src/styling/style.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.css `
    *,
    *::before,
    *::after {
        margin: 0;
        box-sizing: border-box;
    }

    html {
        height: 100%;

        overflow: hidden;

        overscroll-behavior: none;
    }

    body {
        height: 100%;
    }

    .reified-root {
        z-index: 0;

        height: 100vh;
        width: 100vw;

        position: absolute;
    }

    .background-canvas,
    .foreground-canvas {
        position: absolute;

        pointer-events: none;

        width: 100vw;
        height: 100vh;
    }

    .background-canvas {
        z-index: -100;
    }

    .foreground-canvas {
        z-index: 100;
    }
`);


/***/ }),

/***/ "./src/styling/toast.ts":
/*!******************************!*\
  !*** ./src/styling/toast.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_1__.css `
    .toasts-container {
        position: absolute;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;

        padding: 16px;

        gap: 8px;

        pointer-events: none;

        z-index: 100;

        width: 100vw;
        height: 100vh;
    }

    .toast {
        animation: forwards linear 0.5s fade-out;

        position: relative;

        font-family: sans-serif;

        min-width: 275px;

        padding: 10px 18px;

        border: 1px solid ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
        border-radius: 4px;

        background-color: #fefefe;

        user-select: none;

        box-shadow: 1px 1px 4px ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
    }

    .toast-color {
        position: absolute;

        width: 6px;

        top: 0;
        bottom: 0;
        left: 0;

        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;

        background-color: #fefefe;
    }

    .close-toast {
        pointer-events: all;

        position: absolute;

        margin-top: 4px;

        font-size: 10px;

        color: #aaaaaa;

        top: 0;
        right: 0;

        border: none;

        background: transparent;
    }

    .close-toast:hover {
        cursor: pointer;

        color: black;
    }

    @keyframes fade-out {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }
`);


/***/ }),

/***/ "./src/styling lazy recursive ^\\.\\/.*\\.ts$":
/*!*********************************************************!*\
  !*** ./src/styling/ lazy ^\.\/.*\.ts$ namespace object ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./attacher.ts": "./src/styling/attacher.ts",
	"./buttons.ts": "./src/styling/buttons.ts",
	"./cad.ts": "./src/styling/cad.ts",
	"./component.ts": "./src/styling/component.ts",
	"./contextmenu.ts": "./src/styling/contextmenu.ts",
	"./darkmode.ts": "./src/styling/darkmode.ts",
	"./io.ts": "./src/styling/io.ts",
	"./modals.ts": "./src/styling/modals.ts",
	"./quickpick.ts": "./src/styling/quickpick.ts",
	"./style.ts": "./src/styling/style.ts",
	"./toast.ts": "./src/styling/toast.ts"
};

function webpackAsyncContext(req) {
	return Promise.resolve().then(() => {
		if(!__webpack_require__.o(map, req)) {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		}

		var id = map[req];
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./src/styling lazy recursive ^\\.\\/.*\\.ts$";
module.exports = webpackAsyncContext;

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		// The chunk loading function for additional chunks
/******/ 		// Since all referenced chunks are already included
/******/ 		// in this file, this function is empty here.
/******/ 		__webpack_require__.e = () => (Promise.resolve());
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".index.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyx3RUFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFFOUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQzs0QkFDdEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQzt3QkFDekUsQ0FBQyxDQUNKLENBQUM7O3dCQUVGLHVFQUEwQixDQUN0QixHQUFHLEVBQUU7NEJBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsd0VBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBRTlELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDOzRCQUNsRCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQzt3QkFDckQsQ0FBQyxFQUNELEdBQUcsRUFBRTs0QkFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyx3RUFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFFOUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDOzRCQUMxQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7d0JBQzdDLENBQUMsQ0FDSixDQUFDO2FB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cmNlcyI6WyJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvYXVnbWVudHMvV2F0Y2hlZFNldC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY2FkL2Jvc3MudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NhZC9lbGVtZW50cy9DQURPdXRwdXQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NhZC9lbGVtZW50cy9UcnV0aFRhYmxlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jYWQvZmlsZXMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NhZC9pbmRleC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY2FkL291dHB1dC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY2FkL3RhYmxlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L2RlYnVnLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jb250ZXh0bWVudS9pbnNlcnQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L2lvLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jb250ZXh0bWVudS9tZW51LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jb250ZXh0bWVudS9zZXJkZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvZmlsZXMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9rZXliaW5kcy9iYWNrc3BhY2UudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL2JlaGF2aW9yLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9rZXliaW5kcy9oaXN0b3J5LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9rZXliaW5kcy9ob3d0b3VzZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMva2V5YmluZHMvaW8udHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL2tleWJpbmRzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9rZXliaW5kcy9yb3RhdGUudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL3NlbGVjdC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMva2V5YmluZHMvc2VyZGUudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL0NhbnZhc01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL0Rhcmttb2RlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL01lbnVNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL01vdXNlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvUXVpY2tQaWNrTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU2FuZGJveE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1NlbGVjdGlvbk1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1N0b3JhZ2VNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvVG9hc3RNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9VbmRvUmVkb01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1dpcmluZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3ByZW1hZGUvZXhhbXBsZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcHJlbWFkZS9pbmRleC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcHJlbWFkZS9uYW5kLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9xdWlja3BpY2tzL2NvbXBvbmVudHMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3F1aWNrcGlja3MvZ2F0ZXMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvQ29tcG9uZW50LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL0Rpc3BsYXkudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvSW5wdXQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvT3V0cHV0LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL1JlaWZpZWQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvY2hpcHMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvYXR0YWNoZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvYnV0dG9ucy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvc3R5bGluZy9jYWQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvY29tcG9uZW50LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL2NvbnRleHRtZW51LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL2Rhcmttb2RlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL2lvLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL21vZGFscy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvc3R5bGluZy9xdWlja3BpY2sudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvc3R5bGUudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvdG9hc3QudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvIGxhenkgXlxcLlxcLy4qXFwudHMkIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvYXN5bmMgbW9kdWxlIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb25zdGFudHMgZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL2NvbnRleHRtZW51L21lbnVcIjtcbmltcG9ydCB7IGZyb21GaWxlIH0gZnJvbSBcIi4vZmlsZXNcIjtcbmltcG9ydCB7IGtleWJpbmRzIH0gZnJvbSBcIi4va2V5YmluZHMva2V5YmluZHNcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgcHJlbWFkZSB9IGZyb20gXCIuL3ByZW1hZGVcIjtcbmltcG9ydCB7IGF0dGFjaFN0eWxlcyB9IGZyb20gXCIuL3N0eWxpbmcvYXR0YWNoZXJcIjtcblxuT2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCBjb25zdGFudHMpO1xuXG5hd2FpdCBhdHRhY2hTdHlsZXMoW1wic3R5bGVcIiwgXCJjb21wb25lbnRcIiwgXCJpb1wiLCBcImNvbnRleHRtZW51XCIsIFwidG9hc3RcIiwgXCJtb2RhbHNcIiwgXCJidXR0b25zXCIsIFwiZGFya21vZGVcIiwgXCJxdWlja3BpY2tcIl0pO1xuXG5jb25zdCBocmVmQXNVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG5jb25zdCBzaG91bGRMb2FkSW5saW5lID0gaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJpbmxpbmVcIik7XG5cbmlmIChzaG91bGRMb2FkSW5saW5lKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaW5saW5lZCA9IGF0b2Ioc2hvdWxkTG9hZElubGluZSk7XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICByZXN1bHQ6IFtzZXR0aW5ncywgY29tcG9uZW50cywgd2lyaW5nc10sXG4gICAgICAgIH0gPSBmcm9tRmlsZShpbmxpbmVkKTtcblxuICAgICAgICBpZiAoZXJyb3IpIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoeyBrZXliaW5kcywgbWVudSwgaW5pdGlhbDogW2NvbXBvbmVudHMhLCB3aXJpbmdzIV0gfSk7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIuYXBwbHlSYXdTZXR0aW5ncyhzZXR0aW5ncyEpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBzYXZlOiBcInNhbmRib3hcIiB9KTtcblxuICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgbWVzc2FnZTogXCJEaWFncmFtIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC5cIixcbiAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICB9KTtcblxuICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLmRlbGV0ZShcImlubGluZVwiKTtcblxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh1bmRlZmluZWQsIFwiXCIsIGhyZWZBc1VybCk7XG4gICAgfVxufSBlbHNlIHtcbiAgICBjb25zdCBzYXZlID0gaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJzYXZlXCIpO1xuXG4gICAgaWYgKHNhdmUpIHtcbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoeyBrZXliaW5kcywgbWVudSwgc2F2ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzaG91bGRMb2FkUHJlbWFkZSA9IGhyZWZBc1VybC5zZWFyY2hQYXJhbXMuZ2V0KFwicHJlbWFkZVwiKTtcblxuICAgICAgICBpZiAoc2hvdWxkTG9hZFByZW1hZGUgJiYgcHJlbWFkZS5oYXMoc2hvdWxkTG9hZFByZW1hZGUudHJpbSgpLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICBwcmVtYWRlLmdldChzaG91bGRMb2FkUHJlbWFkZS50cmltKCkudG9Mb3dlckNhc2UoKSkhKHsgbmFtZTogc2hvdWxkTG9hZFByZW1hZGUudHJpbSgpLnRvTG93ZXJDYXNlKCkgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBzYXZlOiBcInNhbmRib3hcIiB9KTtcblxuICAgICAgICAgICAgaWYgKHNob3VsZExvYWRQcmVtYWRlKSB7XG4gICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJObyBwcmVtYWRlcyB3ZXJlIGZvdW5kIHdpdGggdGhhdCBuYW1lLlwiLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5kZWxldGUoXCJwcmVtYWRlXCIpO1xuXG4gICAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUodW5kZWZpbmVkLCBcIlwiLCBocmVmQXNVcmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFdhdGNoZWRTZXQ8VD4gZXh0ZW5kcyBTZXQ8VD4ge1xuICAgICNhZGRzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuICAgICNkZWxldGVzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuICAgICNhdHRlbXB0ZWRBZGRzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuICAgICNhdHRlbXB0ZWREZWxldGVzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuXG4gICAgI2xvY2tlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoaXRlbXM/OiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8dHlwZW9mIFNldDxUPj5bMF0pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBpZiAoaXRlbXMpIHRoaXMuYWRkQWxsKFsuLi5pdGVtc10pO1xuICAgIH1cblxuICAgIG9uQWRkKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhZGRzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uRGVsZXRlKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNkZWxldGVzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uQXR0ZW1wdGVkQWRkKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhdHRlbXB0ZWRBZGRzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uQXR0ZW1wdGVkRGVsZXRlKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhdHRlbXB0ZWREZWxldGVzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZkFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYWRkcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZEZWxldGUocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2RlbGV0ZXMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmQXR0ZW1wdGVkQWRkKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhdHRlbXB0ZWRBZGRzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZkF0dGVtcHRlZERlbGV0ZShydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkRGVsZXRlcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhZGRBbGwoaXRlbXM6IFRbXSkge1xuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLmFkZChpdGVtKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGVsZXRlQWxsKGl0ZW1zOiBUW10pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1zLm1hcCgoaXRlbSkgPT4gdGhpcy5kZWxldGUoaXRlbSkpO1xuICAgIH1cblxuICAgIGFkZChpdGVtOiBUKSB7XG4gICAgICAgIGlmICh0aGlzLiNsb2NrZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbLi4udGhpcy4jYXR0ZW1wdGVkQWRkc10ubWFwKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCwgaXRlbSwgdGhpcykpO1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0cy5ldmVyeSgob3V0KSA9PiAhb3V0KSkgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2FkZHNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0cy5zb21lKChvdXQpID0+IG91dCA9PT0gZmFsc2UpID8gdGhpcyA6IHN1cGVyLmFkZChpdGVtKTtcbiAgICB9XG5cbiAgICBkZWxldGUoaXRlbTogVCkge1xuICAgICAgICBpZiAodGhpcy4jbG9ja2VkKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2F0dGVtcHRlZERlbGV0ZXNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdHMuZXZlcnkoKG91dCkgPT4gIW91dCkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbLi4udGhpcy4jZGVsZXRlc10ubWFwKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCwgaXRlbSwgdGhpcykpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHRzLnNvbWUoKG91dCkgPT4gb3V0ID09PSBmYWxzZSkgPyBmYWxzZSA6IHN1cGVyLmRlbGV0ZShpdGVtKTtcbiAgICB9XG5cbiAgICBsb2NrKCkge1xuICAgICAgICB0aGlzLiNsb2NrZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHVubG9jaygpIHtcbiAgICAgICAgdGhpcy4jbG9ja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0IGxvY2tlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2xvY2tlZDtcbiAgICB9XG5cbiAgICBjbG9uZSh3aXRoTGlzdGVuZXJzPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBzZXQgPSBuZXcgV2F0Y2hlZFNldCh0aGlzKTtcblxuICAgICAgICBpZiAod2l0aExpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy4jYWRkcy5mb3JFYWNoKChydW4pID0+IHNldC5vbkFkZChydW4pKTtcbiAgICAgICAgICAgIHRoaXMuI2RlbGV0ZXMuZm9yRWFjaCgocnVuKSA9PiBzZXQub25EZWxldGUocnVuKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2V0O1xuICAgIH1cbn1cbiIsImV4cG9ydCB0eXBlIEJvc3NPbkdlbiA9IChkaWFncmFtOiBzdHJpbmcpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBCb3NzIHtcbiAgICAjdGFibGU7XG4gICAgI3dvcmtlcjtcbiAgICAjb25nZW5zID0gbmV3IFNldDxCb3NzT25HZW4+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcih0YWJsZTogcmVhZG9ubHkgYm9vbGVhbltdW11bXSkge1xuICAgICAgICB0aGlzLiN0YWJsZSA9IHRhYmxlO1xuXG4gICAgICAgIHRoaXMuI3dvcmtlciA9IG5ldyBXb3JrZXIobmV3IFVSTChcIi4vZW1wbG95ZWUudHNcIiwgaW1wb3J0Lm1ldGEudXJsKSk7XG4gICAgfVxuXG4gICAgb25nZW4ocnVuOiBCb3NzT25HZW4pIHtcbiAgICAgICAgdGhpcy4jb25nZW5zLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZmdlbihydW46IEJvc3NPbkdlbikge1xuICAgICAgICB0aGlzLiNvbmdlbnMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXN5bmMgd29yaygpIHtcbiAgICAgICAgdGhpcy4jd29ya2VyLnBvc3RNZXNzYWdlKHRoaXMuI3RhYmxlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiN3b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gZS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PT0gXCJFUlJPUlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI3dvcmtlci50ZXJtaW5hdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGRhdGEuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgPT09IFwiR0VORVJBVElPTlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiNvbmdlbnMuZm9yRWFjaCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGRhdGEubWVzc2FnZSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgPT09IFwiRklOSVNIRURcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmaXJlZCgpIHtcbiAgICAgICAgdGhpcy4jd29ya2VyLnRlcm1pbmF0ZSgpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBDQURPdXRwdXQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaHRtbGA8ZGl2IGNsYXNzPVwiY2FkLW91dHB1dFwiPjwvZGl2PmApO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY2FkLW91dHB1dFwiKSE7XG4gICAgfVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJjYWQtb3V0cHV0XCIsIENBRE91dHB1dCk7XG4iLCJpbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuLi8uLi9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi8uLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IGRvd25sb2FkRmlsZSwgZmlsZUlucHV0IH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyB0eXBlSW5UZXh0YXJlYSB9IGZyb20gXCIuLi90YWJsZVwiO1xuXG5leHBvcnQgY2xhc3MgVHJ1dGhUYWJsZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhc3luY29ucGFzdGU/OiAoKSA9PiB2b2lkO1xuXG4gICAgI2lucHV0O1xuICAgICNoaWdobGlnaHQ7XG5cbiAgICAjaW1wb3J0O1xuICAgICNleHBvcnQ7XG5cbiAgICAjdmFsdWUgPSBcIlwiO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRydXRoLXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgPHByZT5cbiAgICAgICAgICAgICAgICAgICAgPGNvZGUgY2xhc3M9XCJpbnB1dC1oaWdobGlnaHRcIj48L2NvZGU+XG4gICAgICAgICAgICAgICAgPC9wcmU+XG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwidGFibGUtaW5wdXRcIiBzcGVsbGNoZWNrPVwiZmFsc2VcIiBhdXRvY2FwaXRhbGl6ZT1cIm9mZlwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNhZC1jb250cm9sXCI+R288L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImltcG9ydC10YWJsZVwiPkltcG9ydCB0YWJsZTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZXhwb3J0LXRhYmxlXCI+RXhwb3J0IHRhYmxlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYCk7XG5cbiAgICAgICAgdGhpcy4jaW5wdXQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oXCIudGFibGUtaW5wdXRcIikhO1xuICAgICAgICB0aGlzLiNoaWdobGlnaHQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oXCIuaW5wdXQtaGlnaGxpZ2h0XCIpITtcblxuICAgICAgICB0aGlzLiNpbXBvcnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiLmltcG9ydC10YWJsZVwiKSE7XG4gICAgICAgIHRoaXMuI2V4cG9ydCA9IHRoaXMucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oXCIuZXhwb3J0LXRhYmxlXCIpITtcblxuICAgICAgICB0aGlzLiNpbXBvcnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHR4dCA9IGF3YWl0IGZpbGVJbnB1dCgpO1xuXG4gICAgICAgICAgICBpZiAodHh0KSB0aGlzLnZhbHVlID0gdHh0O1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNleHBvcnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGRvd25sb2FkRmlsZShbdGhpcy52YWx1ZV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFTdG9yYWdlTWFuYWdlci5oYXMoXCJjYWQ6aW5wdXRcIikpIFN0b3JhZ2VNYW5hZ2VyLnNldChcImNhZDppbnB1dFwiLCBcIlwiKTtcblxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFN0b3JhZ2VNYW5hZ2VyLmdldChcImNhZDppbnB1dFwiKSE7XG5cbiAgICAgICAgICAgIHRoaXMuI2hpZ2hsaWdodElucHV0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuI3N5bmNTaXplcygpO1xuXG4gICAgICAgICAgICB0aGlzLiNpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIVtcIjBcIiwgXCIxXCIsIFwiOlwiLCBcIiBcIl0uaW5jbHVkZXMoZS5rZXkpICYmIGUuY29kZSAhPT0gXCJFbnRlclwiKSByZXR1cm4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLCBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIS9bXjAxOlxcc10vLnRlc3QodGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZUluVGV4dGFyZWEodGV4dCwgdGhpcy4jaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2lucHV0LmJsdXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jaW5wdXQuZm9jdXMoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFzeW5jb25wYXN0ZT8uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy4jaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4jc3luY1NpemVzKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNoaWdobGlnaHQuc2Nyb2xsVG9wID0gdGhpcy4jaW5wdXQuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIHRoaXMuI2hpZ2hsaWdodC5zY3JvbGxMZWZ0ID0gdGhpcy4jaW5wdXQuc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4jc3luY1NpemVzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgI3VwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuI2lucHV0LnZhbHVlO1xuXG4gICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcImNhZDppbnB1dFwiLCB0aGlzLiN2YWx1ZSk7XG5cbiAgICAgICAgdGhpcy4jaGlnaGxpZ2h0SW5wdXQoKTtcblxuICAgICAgICB0aGlzLiNzeW5jU2l6ZXMoKTtcbiAgICB9XG5cbiAgICAjc3luY1NpemVzKCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGhpcy4jaW5wdXQpO1xuXG4gICAgICAgIHRoaXMuI2hpZ2hsaWdodC5zdHlsZS53aWR0aCA9IHN0eWxlLndpZHRoO1xuICAgICAgICB0aGlzLiNoaWdobGlnaHQuc3R5bGUubWF4SGVpZ2h0ID0gc3R5bGUuaGVpZ2h0O1xuICAgIH1cblxuICAgICNoaWdobGlnaHRJbnB1dCgpIHtcbiAgICAgICAgdGhpcy4jaGlnaGxpZ2h0LmlubmVySFRNTCA9IHRoaXMuI2lucHV0LnZhbHVlXG4gICAgICAgICAgICAucmVwbGFjZUFsbChcIjpcIiwgJzxzcGFuIHN0eWxlPVwiY29sb3I6IGdyYXk7XCI+Ojwvc3Bhbj4nKVxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCIwXCIsICc8c3BhbiBzdHlsZT1cImNvbG9yOiByZWQ7XCI+MDwvc3Bhbj4nKVxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCIxXCIsICc8c3BhbiBzdHlsZT1cImNvbG9yOiBibHVlO1wiPjE8L3NwYW4+Jyk7XG5cbiAgICAgICAgaWYgKHRoaXMuI2lucHV0LnZhbHVlLmVuZHNXaXRoKFwiXFxuXCIpKVxuICAgICAgICAgICAgdGhpcy4jaGlnaGxpZ2h0LmlubmVySFRNTCArPSBgPHNwYW4gc3R5bGU9XCJkaXNwbGF5OiBibG9jazsgaGVpZ2h0OiAxNnB4O1wiPjwvc3Bhbj5gO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3ZhbHVlO1xuICAgIH1cblxuICAgIHNldCB2YWx1ZSh2OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy4jdmFsdWUgPSB2O1xuXG4gICAgICAgIHRoaXMuI2lucHV0LnZhbHVlID0gdjtcbiAgICB9XG5cbiAgICBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2lucHV0O1xuICAgIH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidHJ1dGgtdGFibGVcIiwgVHJ1dGhUYWJsZSk7XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbGVJbnB1dCgpIHtcbiAgICBjb25zdCBpbnB1dCA9IE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLCB7IHR5cGU6IFwiZmlsZVwiIH0pO1xuXG4gICAgaW5wdXQuY2xpY2soKTtcblxuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBuZXcgUHJvbWlzZTxGaWxlIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICBpbnB1dC5vbmNoYW5nZSA9ICgpID0+IHJlc29sdmUoaW5wdXQuZmlsZXM/LlswXSA/PyB1bmRlZmluZWQpO1xuXG4gICAgICAgIGlucHV0Lm9uZXJyb3IgPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpZiAoIWZpbGUpXG4gICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgbWVzc2FnZTogXCJObyBmaWxlIHdhcyBwcm92aWRlZC5cIixcbiAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICB9KTtcblxuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblxuICAgIGNvbnN0IHJhdyA9IGF3YWl0IG5ldyBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHJlc29sdmUocmVhZGVyLnJlc3VsdD8udG9TdHJpbmcoKSA/PyB1bmRlZmluZWQpO1xuXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaWYgKCFyYXcpXG4gICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gcmVhZCB0aGUgZmlsZS5cIixcbiAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICB9KTtcblxuICAgIHJldHVybiByYXc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb3dubG9hZEZpbGUoY29udGVudHM6IEJsb2JQYXJ0W10pIHtcbiAgICBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpLCB7XG4gICAgICAgIGhyZWY6IFVSTC5jcmVhdGVPYmplY3RVUkwoXG4gICAgICAgICAgICBuZXcgQmxvYihjb250ZW50cywge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dC9wbGFpblwiLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICAgIGRvd25sb2FkOiBcInRhYmxlLmdhdGVzaW0udHh0XCIsXG4gICAgfSkuY2xpY2soKTtcbn1cbiIsImltcG9ydCB7IERFTEFZIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IGF0dGFjaFN0eWxlcyB9IGZyb20gXCIuLi9zdHlsaW5nL2F0dGFjaGVyXCI7XG5pbXBvcnQgeyBCb3NzIH0gZnJvbSBcIi4vYm9zc1wiO1xuaW1wb3J0IFwiLi9lbGVtZW50cy9DQURPdXRwdXRcIjtcbmltcG9ydCB7IENBRE91dHB1dCB9IGZyb20gXCIuL2VsZW1lbnRzL0NBRE91dHB1dFwiO1xuaW1wb3J0IFwiLi9lbGVtZW50cy9UcnV0aFRhYmxlXCI7XG5pbXBvcnQgeyBUcnV0aFRhYmxlIH0gZnJvbSBcIi4vZWxlbWVudHMvVHJ1dGhUYWJsZVwiO1xuaW1wb3J0IHsgZGlzcGxheUhldXJpc3RpY3MgfSBmcm9tIFwiLi9vdXRwdXRcIjtcbmltcG9ydCB7IHBhcnNlVGFibGUgfSBmcm9tIFwiLi90YWJsZVwiO1xuXG5hd2FpdCBhdHRhY2hTdHlsZXMoW1wic3R5bGVcIiwgXCJjYWRcIiwgXCJkYXJrbW9kZVwiLCBcInRvYXN0XCJdKTtcblxuY29uc3QgdGFibGUgPSBodG1sYDx0cnV0aC10YWJsZT48L3RydXRoLXRhYmxlPmAgYXMgVHJ1dGhUYWJsZTtcbmNvbnN0IG91dHB1dCA9IGh0bWxgPGNhZC1vdXRwdXQ+PC9jYWQtb3V0cHV0PmAgYXMgQ0FET3V0cHV0O1xuXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRhYmxlKTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3V0cHV0KTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8ZGl2IGNsYXNzPVwidG9hc3RzLWNvbnRhaW5lclwiPjwvZGl2PmApO1xuXG5hd2FpdCBERUxBWSgpO1xuXG50YWJsZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgZGlzcGxheUhldXJpc3RpY3ModGFibGUsIG91dHB1dCk7XG59KTtcblxudGFibGUuYXN5bmNvbnBhc3RlID0gKCkgPT4gZGlzcGxheUhldXJpc3RpY3ModGFibGUsIG91dHB1dCk7XG5cbmRpc3BsYXlIZXVyaXN0aWNzKHRhYmxlLCBvdXRwdXQpO1xuXG5jb25zdCBjb250cm9sID0gdGFibGUucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oXCIuY2FkLWNvbnRyb2xcIikhO1xuXG5sZXQgYm9zczogQm9zcyB8IHVuZGVmaW5lZDtcblxuZnVuY3Rpb24gZmluaXNoZWQoKSB7XG4gICAgaWYgKGJvc3MpIHtcbiAgICAgICAgYm9zcy5maXJlZCgpO1xuXG4gICAgICAgIGJvc3MgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29udHJvbC50ZXh0Q29udGVudCA9IFwiR29cIjtcbn1cblxuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGlmIChjb250cm9sLnRleHRDb250ZW50ID09PSBcIlN0b3BcIikge1xuICAgICAgICB0YWJsZS5lbGVtZW50LmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAgICAgZmluaXNoZWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0YWJsZS5lbGVtZW50LmRpc2FibGVkID0gdHJ1ZTtcblxuICAgICAgICBvdXRwdXQuZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGJvc3MgPSBuZXcgQm9zcyhwYXJzZVRhYmxlKHRhYmxlLnZhbHVlKSk7XG5cbiAgICAgICAgYm9zcy5vbmdlbigobWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmVsZW1lbnQudGV4dENvbnRlbnQgKz0gKG91dHB1dC5lbGVtZW50LnRleHRDb250ZW50ID8gXCJcXG5cIiA6IFwiXCIpICsgbWVzc2FnZTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC53b3JrKClcbiAgICAgICAgICAgIC50aGVuKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LmVsZW1lbnQudGV4dENvbnRlbnQgPSBlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maW5hbGx5KCgpID0+IGZpbmlzaGVkKCkpO1xuXG4gICAgICAgIGNvbnRyb2wudGV4dENvbnRlbnQgPSBcIlN0b3BcIjtcbiAgICB9XG59KTtcbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBDQURPdXRwdXQgfSBmcm9tIFwiLi9lbGVtZW50cy9DQURPdXRwdXRcIjtcbmltcG9ydCB7IFRydXRoVGFibGUgfSBmcm9tIFwiLi9lbGVtZW50cy9UcnV0aFRhYmxlXCI7XG5pbXBvcnQgeyB2YWxpZFRhYmxlIH0gZnJvbSBcIi4vdGFibGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlIZXVyaXN0aWNzKHRhYmxlOiBUcnV0aFRhYmxlLCBvdXRwdXQ6IENBRE91dHB1dCkge1xuICAgIGNvbnN0IGhldXJpc3RpY3MgPSB2YWxpZFRhYmxlKHRhYmxlLnZhbHVlKTtcblxuICAgIG91dHB1dC5lbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICBpZiAoaGV1cmlzdGljcy5sZW5ndGgpIHtcbiAgICAgICAgaGV1cmlzdGljc1xuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGEucm93ID09PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBiLnJvdyA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGEubWVzc2FnZSA+IGIubWVzc2FnZSA/IC0xIDogMTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYS5yb3cgPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIGIucm93ID09PSBcIm51bWJlclwiKSByZXR1cm4gYS5yb3cgLSBiLnJvdztcblxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYS5yb3cgPT09IFwidW5kZWZpbmVkXCIgPyAtMSA6IDE7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZvckVhY2goKGgpID0+IHtcbiAgICAgICAgICAgICAgICBvdXRwdXQuZWxlbWVudC5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihodG1sYDxkaXYgY2xhc3M9XCJjYWQtaGV1cmlzdGljXCI+PC9kaXY+YCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbnRlbnQ6IGAke3R5cGVvZiBoLnJvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwiVGFibGU6XCIgOiBgUm93ICR7aC5yb3d9YH0gJHtoLm1lc3NhZ2V9YCxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRhYmxlLnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiLmNhZC1jb250cm9sXCIpIS5kaXNhYmxlZCA9ICEhaGV1cmlzdGljcy5sZW5ndGg7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdHlwZUluVGV4dGFyZWEoY29udGVudDogc3RyaW5nLCBlbGVtZW50OiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XG4gICAgY29uc3Qgc3RhcnQgPSBlbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xuICAgIGNvbnN0IGVuZCA9IGVsZW1lbnQuc2VsZWN0aW9uRW5kO1xuICAgIGNvbnN0IHRleHQgPSBlbGVtZW50LnZhbHVlO1xuICAgIGNvbnN0IGJlZm9yZSA9IHRleHQuc2xpY2UoMCwgc3RhcnQpO1xuICAgIGNvbnN0IGFmdGVyID0gdGV4dC5zbGljZShlbmQsIHRleHQubGVuZ3RoKTtcblxuICAgIGVsZW1lbnQudmFsdWUgPSBiZWZvcmUgKyBjb250ZW50ICsgYWZ0ZXI7XG5cbiAgICBlbGVtZW50LnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQgKyBjb250ZW50Lmxlbmd0aDtcbiAgICBlbGVtZW50LnNlbGVjdGlvbkVuZCA9IHN0YXJ0ICsgY29udGVudC5sZW5ndGg7XG5cbiAgICByZXR1cm4gZWxlbWVudC5mb2N1cygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRUYWJsZShzdHJpbmc6IHN0cmluZykge1xuICAgIGNvbnN0IGhldXJpc3RpY3M6IHsgcm93PzogbnVtYmVyOyBtZXNzYWdlOiBzdHJpbmcgfVtdID0gW107XG5cbiAgICBpZiAoIXN0cmluZy50cmltKCkpIHJldHVybiBoZXVyaXN0aWNzO1xuXG4gICAgY29uc3Qgcm93cyA9IHN0cmluZ1xuICAgICAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAgICAgLm1hcCgobGluZSkgPT4gbGluZS50cmltKCkpXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBjb25zdCBkZWZpbmVkUGFydHMgPSByb3dzWzBdLnNwbGl0KFwiOlwiKTtcblxuICAgIGNvbnN0IGRlZmluZWRJbnB1dHMgPSBkZWZpbmVkUGFydHNbMF0/Lmxlbmd0aCA/PyAwO1xuICAgIGNvbnN0IGRlZmluZWRPdXRwdXRzID0gZGVmaW5lZFBhcnRzWzFdPy5sZW5ndGggPz8gMDtcblxuICAgIHJvd3MuZm9yRWFjaCgocm93LCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvd1BhcnRzID0gcm93LnNwbGl0KFwiOlwiKTtcblxuICAgICAgICBpZiAocm93UGFydHMubGVuZ3RoICE9PSAyKSBoZXVyaXN0aWNzLnB1c2goeyByb3c6IGkgKyAxLCBtZXNzYWdlOiBcIm5lZWRzIGV4YWN0bHkgMiBjb2x1bW5zXCIgfSk7XG5cbiAgICAgICAgY29uc3Qgcm93SW5wdXRzID0gcm93UGFydHNbMF0/Lmxlbmd0aCA/PyAwO1xuICAgICAgICBjb25zdCByb3dPdXRwdXRzID0gcm93UGFydHNbMV0/Lmxlbmd0aCA/PyAwO1xuXG4gICAgICAgIGlmIChyb3dJbnB1dHMgIT09IGRlZmluZWRJbnB1dHMpIGhldXJpc3RpY3MucHVzaCh7IHJvdzogaSArIDEsIG1lc3NhZ2U6IGBtdXN0IGhhdmUgJHtkZWZpbmVkSW5wdXRzfSBpbnB1dHNgIH0pO1xuXG4gICAgICAgIGlmIChyb3dPdXRwdXRzICE9PSBkZWZpbmVkT3V0cHV0cylcbiAgICAgICAgICAgIGhldXJpc3RpY3MucHVzaCh7IHJvdzogaSArIDEsIG1lc3NhZ2U6IGBtdXN0IGhhdmUgJHtkZWZpbmVkT3V0cHV0c30gb3V0cHV0c2AgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAocm93cy5sZW5ndGggIT09IE1hdGgucG93KDIsIGRlZmluZWRJbnB1dHMpKVxuICAgICAgICBoZXVyaXN0aWNzLnB1c2goe1xuICAgICAgICAgICAgbWVzc2FnZTogYCR7TWF0aC5wb3coMiwgZGVmaW5lZElucHV0cyl9IGVudHJpZXMgYXJlIG5lZWRlZCBmb3IgJHtkZWZpbmVkSW5wdXRzfSBpbnB1dHMsIGJ1dCAke1xuICAgICAgICAgICAgICAgIHJvd3MubGVuZ3RoXG4gICAgICAgICAgICB9IHdlcmUgZ2l2ZW5gLFxuICAgICAgICB9KTtcblxuICAgIGNvbnN0IGlucHV0cyA9IHJvd3MubWFwKChyb3cpID0+IHJvdy5zcGxpdChcIjpcIik/LlswXSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKGlucHV0cy5sZW5ndGggIT09IG5ldyBTZXQoaW5wdXRzKS5zaXplKVxuICAgICAgICBoZXVyaXN0aWNzLnB1c2goe1xuICAgICAgICAgICAgbWVzc2FnZTogXCJjYW4ndCBoYXZlIGR1cGxpY2F0ZSBlbnRyaWVzXCIsXG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIGhldXJpc3RpY3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRhYmxlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZ1xuICAgICAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAgICAgLm1hcCgobGluZSkgPT4gbGluZS50cmltKCkpXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgLm1hcCgocm93KSA9PiByb3cuc3BsaXQoXCI6XCIpLm1hcCgoaW8pID0+IGlvLnNwbGl0KFwiXCIpLm1hcCgoYml0KSA9PiAhIStiaXQpKSk7XG59XG4iLCJpbXBvcnQgeyBEYXJrbW9kZU1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9EYXJrbW9kZU1hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL01vZGFsTWFuYWdlclwiO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgICAgIHVzZXJBZ2VudERhdGE/OiB7IHBsYXRmb3JtOiBzdHJpbmcgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgPSAyNDtcbmV4cG9ydCBjb25zdCBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFID0gMjQ7XG5leHBvcnQgY29uc3QgQ0hJUF9DT01QT05FTlRfQ1NTX1dJRFRIID0gMTIwO1xuZXhwb3J0IGNvbnN0IENISVBfQ09NUE9ORU5UX0NTU19IRUlHSFQgPSA0MDtcbmV4cG9ydCBjb25zdCBDSElQX0lOUFVUX0NTU19TSVpFID0gMTY7XG5leHBvcnQgY29uc3QgQ0hJUF9PVVRQVVRfQ1NTX1NJWkUgPSAxNjtcbmV4cG9ydCBjb25zdCBPUklHSU5fUE9JTlQgPSBPYmplY3QuZnJlZXplKHsgeDogMCwgeTogMCB9KTtcbmV4cG9ydCBjb25zdCBJTl9ERUJVR19NT0RFID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKS5zZWFyY2hQYXJhbXMuaGFzKFwiZGVidWdcIik7XG5leHBvcnQgY29uc3QgTk9fUkVOREVSSU5HID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKS5zZWFyY2hQYXJhbXMuaGFzKFwibm9yZW5kZXJcIik7XG5leHBvcnQgY29uc3QgSVNfTUFDX09TID0gW25hdmlnYXRvci51c2VyQWdlbnREYXRhPy5wbGF0Zm9ybSwgbmF2aWdhdG9yLnBsYXRmb3JtXS5zb21lKFxuICAgIChwbGF0Zm9ybSkgPT4gcGxhdGZvcm0/LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoXCJtYWNcIikgPz8gZmFsc2UsXG4pO1xuXG5leHBvcnQgY29uc3QgTE9DS0VEX0ZPUl9URVNUSU5HID0gKCkgPT5cbiAgICBNb2RhbE1hbmFnZXIuYWxlcnQoXCJUaGUgZGlhZ3JhbSBpcyBjdXJyZW50bHkgbG9ja2VkIGZvciB0ZXN0aW5nLiBObyBjaGFuZ2VzIGNhbiBiZSBtYWRlLlwiKTtcblxuZXhwb3J0IGNvbnN0IERFTEFZID0gKGRlbGF5ID0gMCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcblxuZXhwb3J0IGNvbnN0IEdFVF9CQUNLR1JPVU5EX0NBTlZBU19DVFggPSAoKSA9PlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTENhbnZhc0VsZW1lbnQ+KFwiY2FudmFzLmJhY2tncm91bmQtY2FudmFzXCIpIS5nZXRDb250ZXh0KFwiMmRcIikhO1xuXG5leHBvcnQgY29uc3QgR0VUX0ZPUkVHUk9VTkRfQ0FOVkFTX0NUWCA9ICgpID0+XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXCJjYW52YXMuZm9yZWdyb3VuZC1jYW52YXNcIikhLmdldENvbnRleHQoXCIyZFwiKSE7XG5cbmV4cG9ydCBjb25zdCBDT1VOVEVSX0dFTkVSQVRPUiA9IGZ1bmN0aW9uKiAoaSA9IDApIHtcbiAgICB3aGlsZSAodHJ1ZSkgeWllbGQgaSsrO1xufTtcblxuZXhwb3J0IGNvbnN0IFNDVUZGRURfVVVJRCA9ICgpID0+XG4gICAgRGF0ZS5ub3coKS50b1N0cmluZygzNikgKyBOdW1iZXIoRGF0ZS5ub3coKS50b1N0cmluZygpLnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpKS50b1N0cmluZygzNik7XG5cbmV4cG9ydCBjb25zdCBST1VORF9UT19ORUFSRVNUID0gKHg6IG51bWJlciwgbjogbnVtYmVyKSA9PiBNYXRoLnJvdW5kKHggLyBuKSAqIG47XG5cbmV4cG9ydCBjb25zdCBHRVRfQUNUSVZBVEVEX0NPTE9SID0gKCkgPT4gKERhcmttb2RlTWFuYWdlci5lbmFibGVkID8gREFSS19BQ1RJVkFURURfQ1NTX0NPTE9SIDogQUNUSVZBVEVEX0NTU19DT0xPUik7XG5leHBvcnQgY29uc3QgR0VUX0dSQVlfQ09MT1IgPSAoKSA9PlxuICAgIERhcmttb2RlTWFuYWdlci5lbmFibGVkID8gT05MWV9BX0hJTlRfT0ZfREFSS19HUkFZX0NTU19DT0xPUiA6IExJR0hUX0dSQVlfQ1NTX0NPTE9SO1xuXG5leHBvcnQgY29uc3QgQUNUSVZBVEVEX0NTU19DT0xPUiA9IFwiI2ZmMjYyNlwiO1xuZXhwb3J0IGNvbnN0IERBUktfQUNUSVZBVEVEX0NTU19DT0xPUiA9IFwiI2RkMTExMVwiO1xuZXhwb3J0IGNvbnN0IEVWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SID0gXCIjMGEwYTBjXCI7XG5leHBvcnQgY29uc3QgU0xJR0hUTFlfREFSS0VSX0dSQVlfQ1NTX0NPTE9SID0gXCIjMTAxMDEyXCI7XG5leHBvcnQgY29uc3QgREFSS0VSX0dSQVlfQ1NTX0NPTE9SID0gXCIjMTYxNjFmXCI7XG5leHBvcnQgY29uc3QgREFSS19HUkFZX0NTU19DT0xPUiA9IFwiIzFjMWMyNFwiO1xuZXhwb3J0IGNvbnN0IEtJTkRBX0RBUktfR1JBWV9DU1NfQ09MT1IgPSBcIiMyNDI0MmVcIjtcbmV4cG9ydCBjb25zdCBOT1RfUkVBTExZX0RBUktfR1JBWV9DU1NfQ09MT1IgPSBcIiMyZTJlM2ZcIjtcbmV4cG9ydCBjb25zdCBPTkxZX0FfSElOVF9PRl9EQVJLX0dSQVlfQ1NTX0NPTE9SID0gXCIjM2MzYzRmXCI7XG5leHBvcnQgY29uc3QgU1VQRVJfR1JBWV9DU1NfQ09MT1IgPSBcIiNiYmJiYmJcIjtcbmV4cG9ydCBjb25zdCBLSU5EQV9MSUdIVF9HUkFZX0NTU19DT0xPUiA9IFwiI2NkY2RjZFwiO1xuZXhwb3J0IGNvbnN0IExJR0hUX0dSQVlfQ1NTX0NPTE9SID0gXCIjZGVkZWRlXCI7XG5leHBvcnQgY29uc3QgTElHSFRFUl9HUkFZX0NTU19DT0xPUiA9IFwiI2VhZWFlYVwiO1xuZXhwb3J0IGNvbnN0IEVWRU5fTElHSFRFUl9HUkFZX0NTU19DT0xPUiA9IFwiI2VmZWZlZlwiO1xuZXhwb3J0IGNvbnN0IFRPQVNUX0RVUkFUSU9OID0gMjUwMDtcbmV4cG9ydCBjb25zdCBHUklEX1NJWkUgPSAxNTtcbmV4cG9ydCBjb25zdCBRVUlDS1BJQ0tfU0laRSA9IDc1O1xuXG5leHBvcnQgY29uc3QgSVNfQ0FEX0FQUCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZikuc2VhcmNoUGFyYW1zLmhhcyhcImNhZFwiKTtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElOX0RFQlVHX01PREUsIExJR0hUX0dSQVlfQ1NTX0NPTE9SLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IENhbnZhc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IHsgTWVudU1hbmFnZXJBY3Rpb25zIH0gZnJvbSBcIi4uL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuXG5leHBvcnQgY29uc3QgZGVidWcgPSAoXG4gICAgSU5fREVCVUdfTU9ERVxuICAgICAgICA/IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXN0LWFsZXJ0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IGFsZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXdhaXQgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiVGhpcyBpcyBhbiBhbGVydC5cIikpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJ0ZXN0LWNvbmZpcm1cIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3QgY29uZmlybVwiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGF3YWl0IE1vZGFsTWFuYWdlci5jb25maXJtKFwiVGhpcyBpcyBhIGNvbmZpcm1hdGlvbi5cIikpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJ0ZXN0LXByb21wdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCBwcm9tcHRcIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiVGhpcyBpcyBhIHByb21wdC5cIikpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJ0ZXN0LXRvYXN0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IHRvYXN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBpcyBhIHRvYXN0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBMSUdIVF9HUkFZX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ3aXBlLXN0b3JhZ2VcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIldpcGUgc3RvcmFnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwid2lwZS1zYXZlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJXaXBlIG5hbWVkIHNhdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzYXZlID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2F2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFTdG9yYWdlTWFuYWdlci5oYXMoXCJzYXZlczpcIiArIHNhdmUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vIHNhdmVzIGV4aXN0IHdpdGggdGhhdCBuYW1lLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5kZWxldGUoXCJzYXZlczpcIiArIHNhdmUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInN0b3AtcmVuZGVyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTdG9wIHJlbmRlcmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIENhbnZhc01hbmFnZXIuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJzdGFydC1yZW5kZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlN0YXJ0IHJlbmRlcmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIENhbnZhc01hbmFnZXIuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICBdXG4gICAgICAgIDogW11cbikgc2F0aXNmaWVzIE1lbnVNYW5hZ2VyQWN0aW9ucztcbiIsImltcG9ydCB7IExPQ0tFRF9GT1JfVEVTVElORywgT1JJR0lOX1BPSU5UIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgTWVudU1hbmFnZXJBY3Rpb24gfSBmcm9tIFwiLi4vbWFuYWdlcnMvTWVudU1hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NlbGVjdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBjaGlwcyB9IGZyb20gXCIuLi9yZWlmaWVkL2NoaXBzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi4vcmVpZmllZC9EaXNwbGF5XCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgY29uc3QgaW5zZXJ0ID0ge1xuICAgIFwiaW5zZXJ0LWNvbXBvbmVudFwiOiB7XG4gICAgICAgIGxhYmVsOiBcIkluc2VydCBjb21wb25lbnRcIixcbiAgICAgICAga2V5YmluZDogXCJBXCIsXG4gICAgICAgIGNhbGxiYWNrOiBhc3luYyAoZSwgbj86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IHR5cGVvZiBuID09PSBcInN0cmluZ1wiID8gbiA6IGF3YWl0IE1vZGFsTWFuYWdlci5wcm9tcHQoXCJFbnRlciB0aGUgY29tcG9uZW50J3MgbmFtZTpcIik7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBjaGlwID0gY2hpcHMuZ2V0KG5hbWUudG9VcHBlckNhc2UoKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNoaXBcbiAgICAgICAgICAgICAgICA/IG5ldyBDb21wb25lbnQoUmVmbGVjdC5jb25zdHJ1Y3QoY2hpcCwgW10pLCBPUklHSU5fUE9JTlQpXG4gICAgICAgICAgICAgICAgOiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IFwiRElTUExBWVwiXG4gICAgICAgICAgICAgICAgPyBuZXcgRGlzcGxheSgpXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGlmICghY29tcG9uZW50KSByZXR1cm4gTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiTm8gY29tcG9uZW50IHdhcyBmb3VuZCB3aXRoIHRoYXQgbmFtZS5cIik7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMoY29tcG9uZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGdldENvbXB1dGVkU3R5bGUoY29tcG9uZW50LmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZS5jbGllbnRYIC0gcGFyc2VGbG9hdCh3aWR0aCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIHBhcnNlRmxvYXQoaGVpZ2h0KSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3QoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICB9LFxufSBzYXRpc2ZpZXMgTWVudU1hbmFnZXJBY3Rpb247XG4iLCJpbXBvcnQgeyBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUsIExPQ0tFRF9GT1JfVEVTVElORywgT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IE1lbnVNYW5hZ2VyQWN0aW9uIH0gZnJvbSBcIi4uL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvT3V0cHV0XCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgY29uc3QgaW8gPSB7XG4gICAgXCJuZXctaW5wdXRcIjoge1xuICAgICAgICBsYWJlbDogXCJOZXcgaW5wdXRcIixcbiAgICAgICAga2V5YmluZDogXCJJXCIsXG4gICAgICAgIGNhbGxiYWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBuZXcgSW5wdXQoe1xuICAgICAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICAgICAgeTogZS5jbGllbnRZIC0gSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQoaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3QoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIFwibmV3LW91dHB1dFwiOiB7XG4gICAgICAgIGxhYmVsOiBcIk5ldyBvdXRwdXRcIixcbiAgICAgICAga2V5YmluZDogXCJPXCIsXG4gICAgICAgIGNhbGxiYWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gbmV3IE91dHB1dCh7XG4gICAgICAgICAgICAgICAgeDogZS5jbGllbnRYIC0gT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICAgICAgeTogZS5jbGllbnRZIC0gT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhvdXRwdXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KG91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgfSxcbn0gc2F0aXNmaWVzIE1lbnVNYW5hZ2VyQWN0aW9uO1xuIiwiaW1wb3J0IHsgTWVudU1hbmFnZXJBY3Rpb25zIH0gZnJvbSBcIi4uL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBkZWJ1ZyB9IGZyb20gXCIuL2RlYnVnXCI7XG5pbXBvcnQgeyBpbnNlcnQgfSBmcm9tIFwiLi9pbnNlcnRcIjtcbmltcG9ydCB7IGlvIH0gZnJvbSBcIi4vaW9cIjtcbmltcG9ydCB7IHNlcmRlIH0gZnJvbSBcIi4vc2VyZGVcIjtcblxuZXhwb3J0IGNvbnN0IG1lbnU6IE1lbnVNYW5hZ2VyQWN0aW9ucyA9IFtpbnNlcnQsIGlvLCBzZXJkZSwgLi4uZGVidWddO1xuIiwiaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgSVNfTUFDX09TLCBMSUdIVF9HUkFZX0NTU19DT0xPUiwgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBmcm9tRmlsZSwgc2F2ZURpYWdyYW0gfSBmcm9tIFwiLi4vZmlsZXNcIjtcbmltcG9ydCB7IGtleWJpbmRzIH0gZnJvbSBcIi4uL2tleWJpbmRzL2tleWJpbmRzXCI7XG5pbXBvcnQgeyBNZW51TWFuYWdlckFjdGlvbiB9IGZyb20gXCIuLi9tYW5hZ2Vycy9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1N0b3JhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudVwiO1xuXG5leHBvcnQgY29uc3Qgc2VyZGUgPSB7XG4gICAgXCJjb3B5LXVybFwiOiB7XG4gICAgICAgIGxhYmVsOiBcIkNvcHkgbGlua1wiLFxuICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBLXCIgOiBcIkN0cmwgS1wiLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaHJlZkFzVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblxuICAgICAgICAgICAgaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJpbmxpbmVcIiwgYnRvYShzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pKSk7XG5cbiAgICAgICAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGhyZWZBc1VybC5ocmVmKTtcblxuICAgICAgICAgICAgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJDb3BpZWQgZGlhZ3JhbSBsaW5rIHRvIGNsaXBib2FyZC5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogTElHSFRfR1JBWV9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBcInNhdmUtdG9cIjoge1xuICAgICAgICBsYWJlbDogXCJTYXZlIHdpdGggbmFtZVwiLFxuICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBTXCIgOiBcIkN0cmwgU1wiLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2F2ZSA9IGF3YWl0IE1vZGFsTWFuYWdlci5wcm9tcHQoXCJXaGF0IHNob3VsZCBiZSB0aGUgbmFtZSBvZiB0aGlzIHNhdmU/XCIpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNhdmUgIT09IFwic3RyaW5nXCIpIHJldHVybjtcblxuICAgICAgICAgICAgYXdhaXQgU2FuZGJveE1hbmFnZXIuc2F2ZVRvKHNhdmUpO1xuXG4gICAgICAgICAgICBjb25zdCBocmVmQXNVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLnNldChcInNhdmVcIiwgc2F2ZSk7XG5cbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHVuZGVmaW5lZCwgXCJcIiwgaHJlZkFzVXJsKTtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIFwibG9hZC1mcm9tXCI6IHtcbiAgICAgICAgbGFiZWw6IFwiTG9hZCBmcm9tIHNhdmVzXCIsXG4gICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIE9cIiA6IFwiQ3RybCBPXCIsXG4gICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzYXZlID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIldoaWNoIHNhdmUgd291bGQgeW91IGxpa2UgdG8gbG9hZD9cIik7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2F2ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAoIVN0b3JhZ2VNYW5hZ2VyLmhhcyhcInNhdmVzOlwiICsgc2F2ZSkpIHJldHVybiBNb2RhbE1hbmFnZXIuYWxlcnQoXCJObyBzYXZlIHdhcyBmb3VuZCB3aXRoIHRoYXQgbmFtZS5cIik7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnJlc2V0KCk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHsga2V5YmluZHMsIG1lbnUsIHNhdmUgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGhyZWZBc1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cbiAgICAgICAgICAgIGhyZWZBc1VybC5zZWFyY2hQYXJhbXMuc2V0KFwic2F2ZVwiLCBzYXZlKTtcblxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUodW5kZWZpbmVkLCBcIlwiLCBocmVmQXNVcmwpO1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgXCJzYXZlLWFzXCI6IHtcbiAgICAgICAgbGFiZWw6IFwiU2F2ZSBhcyBmaWxlXCIsXG4gICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBTXCIgOiBcIkN0cmwgU2hpZnQgU1wiLFxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKSwge1xuICAgICAgICAgICAgICAgIGhyZWY6IFVSTC5jcmVhdGVPYmplY3RVUkwoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCbG9iKFtzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgZG93bmxvYWQ6IGAke1NhbmRib3hNYW5hZ2VyLnNhdmVkTmFtZSA/PyBcInNhbmRib3hcIn0uZ2F0ZXNpbS5qc29uYCxcbiAgICAgICAgICAgIH0pLmNsaWNrKCk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBcImltcG9ydC1mcm9tXCI6IHtcbiAgICAgICAgbGFiZWw6IFwiSW1wb3J0IGZyb20gZmlsZVwiLFxuICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggT1wiIDogXCJDdHJsIFNoaWZ0IE9cIixcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gT2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksIHsgdHlwZTogXCJmaWxlXCIgfSk7XG5cbiAgICAgICAgICAgIGlucHV0LmNsaWNrKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBuZXcgUHJvbWlzZTxGaWxlIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4gcmVzb2x2ZShpbnB1dC5maWxlcz8uWzBdID8/IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghZmlsZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJObyBmaWxlIHdhcyBwcm92aWRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJhdyA9IGF3YWl0IG5ldyBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4gcmVzb2x2ZShyZWFkZXIucmVzdWx0Py50b1N0cmluZygpID8/IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIXJhdylcbiAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gcmVhZCB0aGUgZmlsZS5cIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICAgIHJlc3VsdDogW3NldHRpbmdzLCBjb21wb25lbnRzLCB3aXJlc10sXG4gICAgICAgICAgICB9ID0gZnJvbUZpbGUocmF3KTtcblxuICAgICAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucmVzZXQoKTtcblxuICAgICAgICAgICAgY29uc3Qgc2F2ZSA9IGZpbGUubmFtZS5zcGxpdChcIi5cIikuc2xpY2UoMCwgLTEpLmpvaW4oXCIuXCIpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICAgICAga2V5YmluZHMsXG4gICAgICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgICAgICBzYXZlOiBzYXZlLmVuZHNXaXRoKFwiLmdhdGVzaW1cIikgPyBzYXZlLnNsaWNlKDAsIC1cIi5nYXRlc2ltXCIubGVuZ3RoKSA6IHNhdmUsXG4gICAgICAgICAgICAgICAgaW5pdGlhbDogW2NvbXBvbmVudHMhLCB3aXJlcyFdLFxuICAgICAgICAgICAgICAgIG92ZXJyaWRlU2F2ZUlmRXhpc3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5hcHBseVJhd1NldHRpbmdzKHNldHRpbmdzISk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuICAgICAgICB9LFxuICAgIH0sXG59IHNhdGlzZmllcyBNZW51TWFuYWdlckFjdGlvbjtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIENPVU5URVJfR0VORVJBVE9SLCBJTl9ERUJVR19NT0RFLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZyB9IGZyb20gXCIuL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGNoaXBzIH0gZnJvbSBcIi4vcmVpZmllZC9jaGlwc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi9yZWlmaWVkL0Rpc3BsYXlcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZERpYWdyYW0gPSB7XG4gICAgc2V0dGluZ3M6IHtcbiAgICAgICAgW1wiRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRcIl06IGJvb2xlYW47XG4gICAgfTtcbiAgICBjb21wb25lbnRzOiAoXG4gICAgICAgIHwge1xuICAgICAgICAgICAgICByZWlmaWVkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHBlcm1hbmVudDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgdHlwZTogXCJJTlBVVFwiO1xuICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIGlkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeTogbnVtYmVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgcGVybWFuZW50OiBib29sZWFuO1xuICAgICAgICAgICAgICB0eXBlOiBcIk9VVFBVVFwiO1xuICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIGlkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeTogbnVtYmVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgcGVybWFuZW50OiBib29sZWFuO1xuICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiO1xuICAgICAgICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICAgIGlucHV0czogeyBpZDogbnVtYmVyOyBhY3RpdmF0ZWQ6IGJvb2xlYW4gfVtdO1xuICAgICAgICAgICAgICBvdXRwdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIHg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeTogbnVtYmVyO1xuICAgICAgICAgICAgICBhbmdsZTogbnVtYmVyO1xuICAgICAgICAgICAgICBjb21wbGVtZW50YXJ5OiBib29sZWFuO1xuICAgICAgICAgIH1cbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgcGVybWFuZW50OiBib29sZWFuO1xuICAgICAgICAgICAgICB0eXBlOiBcIkRJU1BMQVlcIjtcbiAgICAgICAgICAgICAgaW5wdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIG91dHB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgcmFkaXg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgIClbXTtcbiAgICB3aXJlczogeyBmcm9tOiBudW1iZXI7IHRvOiBudW1iZXIgfVtdO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEaWFncmFtKGNvbXBvbmVudHM6IFJlaWZpZWRbXSwgd2lyZXM6IFdpcmluZ1tdKSB7XG4gICAgY29uc3QgaWQgPSBDT1VOVEVSX0dFTkVSQVRPUigpO1xuXG4gICAgY29uc3QgaWRzID0gbmV3IE1hcDxFbGVtZW50LCBudW1iZXI+KCk7XG5cbiAgICBjb25zdCBkYXRhOiBTZXJpYWxpemVkRGlhZ3JhbSA9IHtcbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIFtcIkRyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkXCJdOiBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCxcbiAgICAgICAgfSxcbiAgICAgICAgY29tcG9uZW50czogY29tcG9uZW50cy5tYXAoKGNvbXBvbmVudCwgcmVpZmllZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KSB7XG4gICAgICAgICAgICAgICAgaWRzLnNldChjb21wb25lbnQuZWxlbWVudCwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIklOUFVUXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2YXRlZDogY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpLFxuICAgICAgICAgICAgICAgICAgICBpZDogaWRzLmdldChjb21wb25lbnQuZWxlbWVudCkhLFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgIGlkcy5zZXQoY29tcG9uZW50LmVsZW1lbnQsIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpZmllZCxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBjb21wb25lbnQucGVybWFuZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJPVVRQVVRcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVkOiBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZHMuZ2V0KGNvbXBvbmVudC5lbGVtZW50KSEsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpZmllZCxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBjb21wb25lbnQucGVybWFuZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJDT01QT05FTlRcIixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogY29tcG9uZW50LmNoaXAubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBjb21wb25lbnQuaW5wdXRzLm1hcCgoaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChpLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQoaSkhLCBhY3RpdmF0ZWQ6IGkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBjb21wb25lbnQub3V0cHV0cy5tYXAoKG8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5zZXQobywgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGlkOiBpZHMuZ2V0KG8pISwgYWN0aXZhdGVkOiBvLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSB9O1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogY29tcG9uZW50LmFuZ2xlLFxuICAgICAgICAgICAgICAgICAgICBjb21wbGVtZW50YXJ5OiBjb21wb25lbnQuY29tcGxlbWVudGFyeSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQsXG4gICAgICAgICAgICAgICAgICAgIHBlcm1hbmVudDogY29tcG9uZW50LnBlcm1hbmVuY2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiRElTUExBWVwiLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IGNvbXBvbmVudC5pbnB1dHMubWFwKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KGksIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChpKSEsIGFjdGl2YXRlZDogaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IGNvbXBvbmVudC5vdXRwdXRzLm1hcCgobykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChvLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQobykhLCBhY3RpdmF0ZWQ6IG8uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICByYWRpeDogY29tcG9uZW50LnJhZGl4LFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBjb21wb25lbnQuYW5nbGUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byBzZXJpYWxpemUgZGlhZ3JhbS5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBSZWlmaWVkIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgfSksXG4gICAgICAgIHdpcmVzOiB3aXJlc1xuICAgICAgICAgICAgLmZpbHRlcigod2lyZSkgPT4gIXdpcmUuZGVzdHJveWVkKVxuICAgICAgICAgICAgLm1hcCgod2lyZSkgPT4gKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBpZHMuZ2V0KHdpcmUuZnJvbSkhLFxuICAgICAgICAgICAgICAgIHRvOiBpZHMuZ2V0KHdpcmUudG8pISxcbiAgICAgICAgICAgIH0pKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEsIHVuZGVmaW5lZCwgSU5fREVCVUdfTU9ERSA/IDQgOiB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUZpbGUoXG4gICAgZmlsZTogc3RyaW5nLFxuKTpcbiAgICB8IHsgZXJyb3I6IHN0cmluZzsgcmVzdWx0OiBbXSB9XG4gICAgfCB7IGVycm9yOiB1bmRlZmluZWQ7IHJlc3VsdDogW3NldHRpbmdzOiBTZXJpYWxpemVkRGlhZ3JhbVtcInNldHRpbmdzXCJdLCBjb21wb25lbnRzOiBSZWlmaWVkW10sIHdpcmVzOiBXaXJpbmdbXV0gfSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoZmlsZSk7XG5cbiAgICAgICAgdmFsaWRhdGUoZGF0YSk7XG5cbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBuZXcgTWFwPG51bWJlciwgRWxlbWVudD4oKTtcblxuICAgICAgICBjb25zdCByZWlmaWVkID0gZGF0YS5jb21wb25lbnRzLm1hcCgocmF3KSA9PiB7XG4gICAgICAgICAgICBpZiAocmF3LnR5cGUgPT09IFwiSU5QVVRcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gbmV3IElucHV0KHJhdyk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3LmlkLCBpbnB1dC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByYXcucGVybWFuZW50ID8gaW5wdXQucGVybWFuZW50KCkgOiBpbnB1dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJhdy50eXBlID09PSBcIk9VVFBVVFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gbmV3IE91dHB1dChyYXcpO1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0LmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaWQsIG91dHB1dC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByYXcucGVybWFuZW50ID8gb3V0cHV0LnBlcm1hbmVudCgpIDogb3V0cHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmF3LnR5cGUgPT09IFwiRElTUExBWVwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzcGxheSA9IG5ldyBEaXNwbGF5KHJhdywgcmF3LmlucHV0cy5sZW5ndGgsIHJhdy5yYWRpeCkucm90YXRlKHJhdy5hbmdsZSk7XG5cbiAgICAgICAgICAgICAgICBkaXNwbGF5LmlucHV0cy5mb3JFYWNoKChpbnB1dCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuaW5wdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaW5wdXRzW2luZGV4XS5pZCwgaW5wdXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZGlzcGxheS5vdXRwdXRzLmZvckVhY2goKG91dHB1dCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3Lm91dHB1dHNbaW5kZXhdLmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5vdXRwdXRzW2luZGV4XS5pZCwgb3V0cHV0KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByYXcucGVybWFuZW50ID8gZGlzcGxheS5wZXJtYW5lbnQoKSA6IGRpc3BsYXk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnQobmV3IChjaGlwcy5nZXQocmF3Lm5hbWUpISkoKSwgcmF3LCByYXcuY29tcGxlbWVudGFyeSkucm90YXRlKHJhdy5hbmdsZSk7XG5cbiAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuaW5wdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pbnB1dHNbaW5kZXhdLmlkLCBpbnB1dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29tcG9uZW50Lm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5vdXRwdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5vdXRwdXRzW2luZGV4XS5pZCwgb3V0cHV0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmF3LnBlcm1hbmVudCA/IGNvbXBvbmVudC5wZXJtYW5lbnQoKSA6IGNvbXBvbmVudDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgd2lyZXMgPSBkYXRhLndpcmVzLm1hcCgoeyBmcm9tLCB0byB9KSA9PiBuZXcgV2lyaW5nKGVsZW1lbnRzLmdldChmcm9tKSEsIGVsZW1lbnRzLmdldCh0bykhKSk7XG5cbiAgICAgICAgcmV0dXJuIHsgcmVzdWx0OiBbZGF0YS5zZXR0aW5ncywgcmVpZmllZCwgd2lyZXNdLCBlcnJvcjogdW5kZWZpbmVkIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4geyBlcnJvcjogZS5tZXNzYWdlLCByZXN1bHQ6IFtdIH07XG5cbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiRmFpbGVkIHRvIHByb2Nlc3MgZmlsZS5cIiwgcmVzdWx0OiBbXSB9O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGUoZGF0YTogdW5rbm93bik6IGFzc2VydHMgZGF0YSBpcyBTZXJpYWxpemVkRGlhZ3JhbSB7XG4gICAgaWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG5vdCBhbiBvYmplY3QuXCIpO1xuXG4gICAgaWYgKCEoXCJzZXR0aW5nc1wiIGluIGRhdGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG1pc3NpbmcgcHJvamVjdCBzZXR0aW5ncy5cIik7XG5cbiAgICBpZiAodHlwZW9mIGRhdGEuc2V0dGluZ3MgIT09IFwib2JqZWN0XCIgfHwgIWRhdGEuc2V0dGluZ3MpIHRocm93IG5ldyBFcnJvcihcIlByb2plY3Qgc2V0dGluZ3Mgc2hvdWxkIGJlIGFuIG9iamVjdC5cIik7XG5cbiAgICBpZiAoIShcImNvbXBvbmVudHNcIiBpbiBkYXRhKSkgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBtaXNzaW5nIGNvbXBvbmVudHMuXCIpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY29tcG9uZW50cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBub3QgYW4gYXJyYXkuXCIpO1xuXG4gICAgaWYgKCEoXCJ3aXJlc1wiIGluIGRhdGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG1pc3Npbmcgd2lyZXMuXCIpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEud2lyZXMpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlcyBkYXRhIGlzIG5vdCBhbiBhcnJheS5cIik7XG5cbiAgICBpZiAoIShcIkRyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkXCIgaW4gZGF0YS5zZXR0aW5ncykpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3Npbmcgc2V0dGluZyAnRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQnLlwiKTtcblxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGRhdGEuY29tcG9uZW50cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQgfHwgdHlwZW9mIGNvbXBvbmVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgbXVzdCBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwicmVpZmllZFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIHJlaWZpZWQgaWQuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnJlaWZpZWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJlaWZpZWQgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJwZXJtYW5lbnRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBwZXJtYW5lbmNlIHN0YXR1cy5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQucGVybWFuZW50ICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHBlcm1hbmVuY2UgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuXG4gICAgICAgIGlmICghKFwidHlwZVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIGEgdHlwZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQudHlwZSAhPT0gXCJzdHJpbmdcIiB8fCAhW1wiSU5QVVRcIiwgXCJPVVRQVVRcIiwgXCJDT01QT05FTlRcIiwgXCJESVNQTEFZXCJdLmluY2x1ZGVzKGNvbXBvbmVudC50eXBlKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29tcG9uZW50IHR5cGUuXCIpO1xuXG4gICAgICAgIGlmICghKFwieFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIGEgeCBjb29yZGluYXRlLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC54ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgeCBjb29yZGluYXRlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgIGlmICghKFwieVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIGEgeSBjb29yZGluYXRlLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC55ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgeSBjb29yZGluYXRlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgIHN3aXRjaCAoY29tcG9uZW50LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJJTlBVVFwiOlxuICAgICAgICAgICAgY2FzZSBcIk9VVFBVVFwiOiB7XG4gICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkkvTyBkYXRhIGlzIG1pc3NpbmcgaWRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmlkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcImFjdGl2YXRlZFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkkvTyBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuYWN0aXZhdGVkICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQWN0aXZhdGlvbiBzdGF0dXMgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFwiQ09NUE9ORU5UXCI6IHtcbiAgICAgICAgICAgICAgICBpZiAoIShcImFuZ2xlXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyByb3RhdGlvbiBhbmdsZS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5hbmdsZSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiUm90YXRpb24gYW5nbGUgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcImNvbXBsZW1lbnRhcnlcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgZGF0YSBpcyBtaXNzaW5nIGNvbXBsZW1lbnRhcnkgb3V0cHV0LlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmNvbXBsZW1lbnRhcnkgIT09IFwiYm9vbGVhblwiKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wbGVtZW50YXJ5IG91dHB1dCBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcImlucHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3NpbmcgaW5wdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnQuaW5wdXRzKSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGlucHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJvdXRwdXRzXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBvdXRwdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnQub3V0cHV0cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBvdXRwdXRzIGRhdGEgbXVzdCBiZSBhbiBhcnJheS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcIm5hbWVcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgZGF0YSBpcyBtaXNzaW5nIGNoaXAgbmFtZS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5uYW1lICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlwIG5hbWUgbXVzdCBiZSBhIHN0cmluZy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNoaXBzLmhhcyhjb21wb25lbnQubmFtZS50cmltKCkudG9VcHBlckNhc2UoKSkpIHRocm93IG5ldyBFcnJvcihcIkNoaXAgbmFtZSBkb2Vzbid0IGV4aXN0LlwiKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IENoaXAgPSBjaGlwcy5nZXQoY29tcG9uZW50Lm5hbWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpITtcblxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuaW5wdXRzLmxlbmd0aCAhPT0gQ2hpcC5JTlBVVFMpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBpbnB1dHMgZG9lcyBub3QgbWF0Y2ggY2hpcCBpbnB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5vdXRwdXRzLmxlbmd0aCAhPT0gQ2hpcC5PVVRQVVRTKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgb3V0cHV0cyBkb2VzIG5vdCBtYXRjaCBjaGlwIG91dHB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbnB1dCBvZiBjb21wb25lbnQuaW5wdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdXRwdXQgb2YgY29tcG9uZW50Lm91dHB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJESVNQTEFZXCI6IHtcbiAgICAgICAgICAgICAgICBpZiAoIShcImFuZ2xlXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSBkYXRhIGlzIG1pc3Npbmcgcm90YXRpb24gYW5nbGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuYW5nbGUgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJvdGF0aW9uIGFuZ2xlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJyYWRpeFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgZGF0YSBpcyBtaXNzaW5nIGRpc3BsYXkgcmFkaXguXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQucmFkaXggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgcmFkaXggbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcImlucHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgZGF0YSBpcyBtaXNzaW5nIGlucHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50LmlucHV0cykpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgaW5wdXRzIGRhdGEgbXVzdCBiZSBhbiBhcnJheS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcIm91dHB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJEaXNwbGF5IGRhdGEgaXMgbWlzc2luZyBvdXRwdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnQub3V0cHV0cykpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgb3V0cHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbnB1dCBvZiBjb21wb25lbnQuaW5wdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdXRwdXQgb2YgY29tcG9uZW50Lm91dHB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpZHMgPSBkYXRhLmNvbXBvbmVudHMuZmxhdE1hcDxudW1iZXI+KChjb21wb25lbnQpID0+XG4gICAgICAgIGNvbXBvbmVudC50eXBlID09PSBcIkNPTVBPTkVOVFwiIHx8IGNvbXBvbmVudC50eXBlID09PSBcIkRJU1BMQVlcIlxuICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQuaW5wdXRzLm1hcCgoeyBpZCB9OiB7IGlkOiBudW1iZXIgfSkgPT4gaWQpLFxuICAgICAgICAgICAgICAgICAgLi4uY29tcG9uZW50Lm91dHB1dHMubWFwKCh7IGlkIH06IHsgaWQ6IG51bWJlciB9KSA9PiBpZCksXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIDogY29tcG9uZW50LmlkLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHdpcmUgb2YgZGF0YS53aXJlcyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCF3aXJlIHx8IHR5cGVvZiB3aXJlICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgbXVzdCBiZSBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwiZnJvbVwiIGluIHdpcmUpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgaXMgbWlzc2luZyB0aGUgY29tcG9uZW50IGl0IHN0YXJ0cyBmcm9tLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUuZnJvbSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIG11c3QgcmVmZXJlbmNlIG51bWVyaWMgaWRzLlwiKTtcblxuICAgICAgICBpZiAoIShcInRvXCIgaW4gd2lyZSkpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBpcyBtaXNzaW5nIHRoZSB0YXJnZXQgY29tcG9uZW50LlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUudG8gIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBtdXN0IHJlZmVyZW5jZSBudW1lcmljIGlkcy5cIik7XG5cbiAgICAgICAgaWYgKCFpZHMuaW5jbHVkZXMod2lyZS5mcm9tKSB8fCAhaWRzLmluY2x1ZGVzKHdpcmUudG8pKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgcmVmZXJlbmNlcyBpbnZhbGlkIGlkcy5cIik7XG4gICAgfVxufVxuIiwiLy9AdHMtbm9jaGVja1xuXG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBJU19DQURfQVBQIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5cbmlmIChJU19DQURfQVBQKSB7XG4gICAgYXdhaXQgaW1wb3J0KGAuL2NhZC9pbmRleC50c2ApO1xuXG4gICAgY29uc29sZS5sb2coXCIlY0dBVEVTSU0gQ0FEXCIsIGBjb2xvcjogJHtBQ1RJVkFURURfQ1NTX0NPTE9SfTsgZm9udC1zaXplOiAycmVtO2ApO1xuICAgIGNvbnNvbGUubG9nKFwiSW5wdXQgYSB0cnV0aCB0YWJsZSB0byBnZXQgc3RhcnRlZC5cIik7XG4gICAgY29uc29sZS5sb2coXCJUaGUgcHJvZ3JhbSB3aWxsIGZpbmQgYSBjaXJjdWl0IHRoYXQgbWF0Y2hlcyB0aGUgdGFibGUuXCIpO1xufSBlbHNlIHtcbiAgICBhd2FpdCBpbXBvcnQoYC4vYXBwLnRzYCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIiVjR0FURVNJTVwiLCBgY29sb3I6ICR7QUNUSVZBVEVEX0NTU19DT0xPUn07IGZvbnQtc2l6ZTogMnJlbTtgKTtcbiAgICBjb25zb2xlLmxvZyhcIlJpZ2h0IGNsaWNrIHRvIGdldCBzdGFydGVkLlwiKTtcbiAgICBjb25zb2xlLmxvZyhcIlByZXNzICc/JyBmb3IgaGVscC5cIik7XG59XG5cbmV4cG9ydCB7fTtcbiIsImltcG9ydCB7IElTX01BQ19PUywgTE9DS0VEX0ZPUl9URVNUSU5HIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi4vcmVpZmllZC9EaXNwbGF5XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjb25zdCBiYWNrc3BhY2UgPSB7XG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrWFwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBiYWNrc3BhY2VbXCJCYWNrc3BhY2VcIl0oKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStYXCIsICgpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBiYWNrc3BhY2VbXCJCYWNrc3BhY2VcIl0oKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtTaGlmdCtYXCIsICgpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIGJhY2tzcGFjZVtcIlNoaWZ0K0JhY2tzcGFjZVwiXSgpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK1NoaWZ0K1hcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIGJhY2tzcGFjZVtcIlNoaWZ0K0JhY2tzcGFjZVwiXSgpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJTaGlmdCtCYWNrc3BhY2VcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgIGlmICghU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gY29tcG9uZW50LmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gY29tcG9uZW50LmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSk7XG5cbiAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH0pLFxuICAgIFtcIkJhY2tzcGFjZVwiXTogKCkgPT4ge1xuICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgIGlmICghU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IGNvbXBvbmVudC5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IGNvbXBvbmVudC5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50IHx8IGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbGVhcigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmF0dGFjaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpKTtcblxuICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3RlZC5jbG9uZSh0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiIsImltcG9ydCB7IEdSSURfU0laRSwgTElHSFRfR1JBWV9DU1NfQ09MT1IsIExPQ0tFRF9GT1JfVEVTVElORywgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNvbnN0IGJlaGF2aW9yID0ge1xuICAgIFtcIkFycm93TGVmdFwiXTogKCkgPT4ge1xuICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgIGlmICghU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoeyB4OiAtR1JJRF9TSVpFLCByZWxhdGl2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHsgeDogR1JJRF9TSVpFLCByZWxhdGl2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBbXCJBcnJvd1JpZ2h0XCJdOiAoKSA9PiB7XG4gICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgaWYgKCFTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUpIHJldHVybjtcblxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7IHg6IEdSSURfU0laRSwgcmVsYXRpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7IHg6IC1HUklEX1NJWkUsIHJlbGF0aXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9LFxuICAgIFtcIkFycm93VXBcIl06ICgpID0+IHtcbiAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICBpZiAoIVNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHsgeTogLUdSSURfU0laRSwgcmVsYXRpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7IHk6IEdSSURfU0laRSwgcmVsYXRpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH0sXG4gICAgW1wiQXJyb3dEb3duXCJdOiAoKSA9PiB7XG4gICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgaWYgKCFTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUpIHJldHVybjtcblxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7IHk6IEdSSURfU0laRSwgcmVsYXRpdmU6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7IHk6IC1HUklEX1NJWkUsIHJlbGF0aXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9LFxuICAgIFtcIktleUdcIl06ICgpID0+IHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZV07XG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IGNvbXBvbmVudHMubWFwKCh7IHBvcyB9KSA9PiBwb3MpO1xuXG4gICAgICAgIGNvbnN0IHNpemUgPSBHUklEX1NJWkU7XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkID0gIURyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkO1xuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogTWF0aC5mbG9vcihjb21wb25lbnQucG9zLnggLyBzaXplKSAqIHNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBNYXRoLmZsb29yKGNvbXBvbmVudC5wb3MueSAvIHNpemUpICogc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgVG9nZ2xlZCBzbmFwIHRvIGdyaWQgKG5vdyAke0RyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkfSkgW0ddLmAsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBMSUdIVF9HUkFZX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCA9ICFEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZDtcblxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHBvc2l0aW9uc1tpXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH0sXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuXG5jb25zdCB1bmRvID0gKCkgPT4ge1xuICAgIFNhbmRib3hNYW5hZ2VyLnBvcEhpc3RvcnkoKTtcbn07XG5cbmNvbnN0IHJlZG8gPSAoKSA9PiB7XG4gICAgU2FuZGJveE1hbmFnZXIucmVkb0hpc3RvcnkoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBoaXN0b3J5ID0ge1xuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJDb250cm9sK1NoaWZ0K1pcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK1NoaWZ0K1pcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHJlZG8oKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtaXCIsICgpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHVuZG8oKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStaXCIsICgpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICB1bmRvKCk7XG4gICAgfSksXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNvbnN0IGhvd3RvdXNlID0ge1xuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJTaGlmdCtTbGFzaFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vVE9ETzogYWRkIHN0dWZmXG4gICAgICAgIGF3YWl0IE1vZGFsTWFuYWdlci5wb3B1cChodG1sYFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8aDE+Z2F0ZXNpbTwvaDE+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYCk7XG5cbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFwidXNlZGhlbHBcIiwgXCJ0cnVlXCIpO1xuICAgIH0pLFxufSBzYXRpc2ZpZXMgUmVjb3JkPHN0cmluZywgKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ+O1xuIiwiaW1wb3J0IHsgSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFLCBMT0NLRURfRk9SX1RFU1RJTkcsIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW91c2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvT3V0cHV0XCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgY29uc3QgaW8gPSB7XG4gICAgW1wiS2V5SVwiXTogKCkgPT4ge1xuICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgIGNvbnN0IGlucHV0ID0gbmV3IElucHV0KHtcbiAgICAgICAgICAgIHg6IE1vdXNlTWFuYWdlci5tb3VzZS54IC0gSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgIHk6IE1vdXNlTWFuYWdlci5tb3VzZS55IC0gSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGlucHV0KTtcblxuICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KGlucHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH0sXG4gICAgW1wiS2V5T1wiXTogKCkgPT4ge1xuICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IG5ldyBPdXRwdXQoe1xuICAgICAgICAgICAgeDogTW91c2VNYW5hZ2VyLm1vdXNlLnggLSBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgIHk6IE1vdXNlTWFuYWdlci5tb3VzZS55IC0gT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhvdXRwdXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChvdXRwdXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICBvdXRwdXQuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9LFxufSBzYXRpc2ZpZXMgUmVjb3JkPHN0cmluZywgKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ+O1xuIiwiaW1wb3J0IHsgYmFja3NwYWNlIH0gZnJvbSBcIi4vYmFja3NwYWNlXCI7XG5pbXBvcnQgeyBiZWhhdmlvciB9IGZyb20gXCIuL2JlaGF2aW9yXCI7XG5pbXBvcnQgeyBoaXN0b3J5IH0gZnJvbSBcIi4vaGlzdG9yeVwiO1xuaW1wb3J0IHsgaG93dG91c2UgfSBmcm9tIFwiLi9ob3d0b3VzZVwiO1xuaW1wb3J0IHsgaW8gfSBmcm9tIFwiLi9pb1wiO1xuaW1wb3J0IHsgcm90YXRlIH0gZnJvbSBcIi4vcm90YXRlXCI7XG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tIFwiLi9zZWxlY3RcIjtcbmltcG9ydCB7IHNlcmRlIH0gZnJvbSBcIi4vc2VyZGVcIjtcblxuZXhwb3J0IGNvbnN0IGtleWJpbmRzOiBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD4gPSBPYmplY3QuYXNzaWduKFxuICAgIHt9LFxuICAgIGJhY2tzcGFjZSxcbiAgICBiZWhhdmlvcixcbiAgICBoaXN0b3J5LFxuICAgIGhvd3RvdXNlLFxuICAgIGlvLFxuICAgIHJvdGF0ZSxcbiAgICBzZWxlY3QsXG4gICAgc2VyZGUsXG4pO1xuIiwiaW1wb3J0IHsgTE9DS0VEX0ZPUl9URVNUSU5HIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGlzcGxheSB9IGZyb20gXCIuLi9yZWlmaWVkL0Rpc3BsYXlcIjtcblxuZXhwb3J0IGNvbnN0IHJvdGF0ZSA9IHtcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiU2hpZnQrUlwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgaWYgKCFTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUpIHJldHVybjtcblxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50IHx8IGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hbmdsZSAtPSA5MDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuYW5nbGUgKz0gOTA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfSksXG4gICAgW1wiS2V5UlwiXTogKCkgPT4ge1xuICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgIGlmICghU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuYW5nbGUgKz0gOTA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmFuZ2xlIC09IDkwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH0sXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NlbGVjdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3QgPSB7XG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrQVwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IFNlbGVjdGlvbk1hbmFnZXIuYWRkU2VsZWN0aW9uKGNvbXBvbmVudCkpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK0FcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gU2VsZWN0aW9uTWFuYWdlci5hZGRTZWxlY3Rpb24oY29tcG9uZW50KSk7XG4gICAgfSksXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBzZXJkZSBhcyBtZW51IH0gZnJvbSBcIi4uL2NvbnRleHRtZW51L3NlcmRlXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjb25zdCBzZXJkZSA9IHtcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtLXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcImNvcHktdXJsXCJdLmNhbGxiYWNrKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIk1ldGErS1wiLCAoZSkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBtZW51W1wiY29weS11cmxcIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtTXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcInNhdmUtdG9cIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStTXCIsIChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJzYXZlLXRvXCJdLmNhbGxiYWNrKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrT1wiLCAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJsb2FkLWZyb21cIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStPXCIsIChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJsb2FkLWZyb21cIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtTaGlmdCtTXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcInNhdmUtYXNcIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStTaGlmdCtTXCIsIChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJzYXZlLWFzXCJdLmNhbGxiYWNrKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrU2hpZnQrT1wiLCAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJpbXBvcnQtZnJvbVwiXS5jYWxsYmFjaygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK1NoaWZ0K09cIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcImltcG9ydC1mcm9tXCJdLmNhbGxiYWNrKCk7XG4gICAgfSksXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBHRVRfQkFDS0dST1VORF9DQU5WQVNfQ1RYLCBHRVRfRk9SRUdST1VORF9DQU5WQVNfQ1RYLCBOT19SRU5ERVJJTkcgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5cbmV4cG9ydCBjbGFzcyBDYW52YXNNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2pvYnMgPSBuZXcgU2V0PChjdHg6IHsgYmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDsgZmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9KSA9PiB2b2lkPigpO1xuXG4gICAgc3RhdGljICNyQUYgPSAtMTtcblxuICAgIHN0YXRpYyAjcmVuZGVyKCkge1xuICAgICAgICBpZiAoTk9fUkVOREVSSU5HKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgYmcgPSBHRVRfQkFDS0dST1VORF9DQU5WQVNfQ1RYKCk7XG4gICAgICAgIGNvbnN0IGZnID0gR0VUX0ZPUkVHUk9VTkRfQ0FOVkFTX0NUWCgpO1xuXG4gICAgICAgIGJnLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBiZy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgIGZnLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBmZy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgIHRoaXMuI2pvYnMuZm9yRWFjaCgoam9iKSA9PiB7XG4gICAgICAgICAgICBqb2IuY2FsbCh1bmRlZmluZWQsIHsgYmcsIGZnIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RhcnQoKSB7XG4gICAgICAgIGlmIChOT19SRU5ERVJJTkcpIHJldHVybjtcblxuICAgICAgICB0aGlzLiNyZW5kZXIoKTtcblxuICAgICAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0YXJ0LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuI3JBRiA9IGlkO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wKCkge1xuICAgICAgICBpZiAoTk9fUkVOREVSSU5HKSByZXR1cm47XG5cbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy4jckFGKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkSm9iKGpvYjogKGN0eDogeyBiZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEOyBmZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0pID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKE5PX1JFTkRFUklORykgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuI2pvYnMuYWRkKGpvYik7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlbGV0ZUpvYihqb2I6IChjdHg6IHsgYmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDsgZmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB9KSA9PiB2b2lkKSB7XG4gICAgICAgIGlmIChOT19SRU5ERVJJTkcpIHJldHVybjtcblxuICAgICAgICB0aGlzLiNqb2JzLmRlbGV0ZShqb2IpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSBcIi4vU3RvcmFnZU1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIERhcmttb2RlTWFuYWdlciB7XG4gICAgc3RhdGljIHJlYWRvbmx5ICNjaGFuZ2VzID0gbmV3IFNldDwoKSA9PiB2b2lkPigpO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNrZXkgPSBcInNldHRpbmdzLmRhcmttb2RlXCI7XG5cbiAgICBzdGF0aWMgZ2V0ICNlbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gU3RvcmFnZU1hbmFnZXIuZ2V0KHRoaXMuI2tleSkgPz8gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldCAjZW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQodGhpcy4ja2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSA/IFwi8J+MlVwiIDogXCLwn4yRXCI7XG5cbiAgICAgICAgdGhpcy4jY2hhbmdlcy5mb3JFYWNoKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCkpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcImRhcmttb2RlXCIsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IGVuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNlbmFibGVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgI2VsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcImJ1dHRvbi5kYXJrbW9kZVwiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uQ2hhbmdlKHJ1bjogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNjaGFuZ2VzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZDaGFuZ2UocnVuOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI2NoYW5nZXMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljICNsaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy4jZW5hYmxlZCA9ICF0aGlzLiNlbmFibGVkO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwibm9uZVwiO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcIlwiO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgdGhpcy4jZW5hYmxlZCA9IHRoaXMuI2VuYWJsZWQ7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudC5pbm5lclRleHQgPSB0aGlzLiNlbmFibGVkID8gXCLwn4yVXCIgOiBcIvCfjJFcIjtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNsaXN0ZW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuI2VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2xpc3RlbmVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgdG9nZ2xlKHZhbHVlPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLiNlbmFibGVkID0gdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIiA/IHZhbHVlIDogIXRoaXMuI2VuYWJsZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRVZFTl9EQVJLRVJfR1JBWV9DU1NfQ09MT1IsIEVWRU5fTElHSFRFUl9HUkFZX0NTU19DT0xPUiwgR0VUX0FDVElWQVRFRF9DT0xPUiwgR1JJRF9TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgcXVpY2twaWNrQ29tcG9uZW50cyB9IGZyb20gXCIuLi9xdWlja3BpY2tzL2NvbXBvbmVudHNcIjtcbmltcG9ydCB7IHF1aWNrcGlja0dhdGVzIH0gZnJvbSBcIi4uL3F1aWNrcGlja3MvZ2F0ZXNcIjtcbmltcG9ydCB7IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4sIFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBDYW52YXNNYW5hZ2VyIH0gZnJvbSBcIi4vQ2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IHsgRGFya21vZGVNYW5hZ2VyIH0gZnJvbSBcIi4vRGFya21vZGVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuL1NlbGVjdGlvbk1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIERyYWdnaW5nTWFuYWdlciB7XG4gICAgc3RhdGljICNkcmFnZ2VkOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyByZWFkb25seSAjd2F0Y2hlZCA9IG5ldyBNYXAoKTtcblxuICAgIHN0YXRpYyAjbW91c2UgPSB7IHg6IC0xLCB5OiAtMSwgb3g6IC0xLCBveTogLTEsIGl4OiAtMSwgaXk6IC0xLCBkb3duOiBmYWxzZSB9O1xuXG4gICAgc3RhdGljICN0b3BsZWZ0OiBFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljICNvcmlnaW5hbDogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljICNkb3ducG9zID0geyB4OiAtMSwgeTogLTEgfTtcblxuICAgIHN0YXRpYyAjcG9zaXRpb25zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH1bXSB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjc25hcFRvR3JpZCA9IGZhbHNlO1xuXG4gICAgc3RhdGljIGdldCBzbmFwVG9HcmlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jc25hcFRvR3JpZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0IHNuYXBUb0dyaWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy4jc25hcFRvR3JpZCA9IHZhbHVlO1xuXG4gICAgICAgIHRoaXMuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCk7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHNuYXBUb0dyaWRCYXNlZFVwZGF0ZShcbiAgICAgICAgeyBmb3JjZUNsZWFyID0gZmFsc2UsIG9ubHlVcGRhdGVDb2xvciA9IGZhbHNlIH06IHsgZm9yY2VDbGVhcj86IGJvb2xlYW47IG9ubHlVcGRhdGVDb2xvcj86IGJvb2xlYW4gfSA9IHtcbiAgICAgICAgICAgIGZvcmNlQ2xlYXI6IGZhbHNlLFxuICAgICAgICAgICAgb25seVVwZGF0ZUNvbG9yOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICApIHtcbiAgICAgICAgaWYgKHRoaXMuc25hcFRvR3JpZCAmJiAhZm9yY2VDbGVhcikge1xuICAgICAgICAgICAgaWYgKCFvbmx5VXBkYXRlQ29sb3IpXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5zdHlsZS5taW5XaWR0aCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShjb21wb25lbnQuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wID0gcGFyc2VGbG9hdChzdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZnQgPSBwYXJzZUZsb2F0KHN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gcGFyc2VGbG9hdChzdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gcGFyc2VGbG9hdChzdHlsZS5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbihjb21wb25lbnQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3AgPSBNYXRoLmZsb29yKHRvcCAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCA9IE1hdGguZmxvb3IobGVmdCAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5zdHlsZS5taW5XaWR0aCA9IE1hdGguY2VpbCh3aWR0aCAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubWluSGVpZ2h0ID0gTWF0aC5jZWlsKGhlaWdodCAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBHUklEX1NJWkUgKyBcInB4IFwiICsgR1JJRF9TSVpFICsgXCJweFwiO1xuXG4gICAgICAgICAgICBpZiAoRGFya21vZGVNYW5hZ2VyLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICR7RVZFTl9EQVJLRVJfR1JBWV9DU1NfQ09MT1J9IDFweCwgdHJhbnNwYXJlbnQgMXB4KSwgbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgJHtFVkVOX0RBUktFUl9HUkFZX0NTU19DT0xPUn0gMXB4LCB0cmFuc3BhcmVudCAxcHgpYDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAke0VWRU5fTElHSFRFUl9HUkFZX0NTU19DT0xPUn0gMXB4LCB0cmFuc3BhcmVudCAxcHgpLCBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCAke0VWRU5fTElHSFRFUl9HUkFZX0NTU19DT0xPUn0gMXB4LCB0cmFuc3BhcmVudCAxcHgpYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLm1pbldpZHRoID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubWluSGVpZ2h0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJcIjtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgd2F0Y2goZWxlbWVudDogSFRNTEVsZW1lbnQsIHRhcmdldCA9IGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LndhdGNoZWQgPSBcInRydWVcIjtcblxuICAgICAgICBjb25zdCBtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IGVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuZGF0YXNldC5kcmFnZ2VkID0gXCJ0cnVlXCI7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiO1xuXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy4jZHJhZ2dlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgICAgIHRoaXMuI21vdXNlLml4ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jbW91c2UuaXkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgICAgIGlmICghU2VsZWN0aW9uTWFuYWdlci5pc1NlbGVjdGVkKGVsZW1lbnQpKSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm94ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm95ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IFsuLi5TZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkXS5tYXAoKHRhcmdldCkgPT4gdGFyZ2V0LnBvcyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gWy4uLlNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWRdLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXggPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXkgPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBieCA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBieSA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkID0gTWF0aC5zcXJ0KGF4ICogYXggKyBheSAqIGF5KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmQgPSBNYXRoLnNxcnQoYnggKiBieCArIGJ5ICogYnkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWQgLSBiZDtcbiAgICAgICAgICAgICAgICB9KVswXS5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYm91bmRzID0gdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm94ID0gZS5jbGllbnRYIC0gYm91bmRzLng7XG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3kgPSBlLmNsaWVudFkgLSBib3VuZHMueTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI3RvcGxlZnQgPSB0b3BsZWZ0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLiNvcmlnaW5hbCA9IHsgeDogcmVjdC5sZWZ0LCB5OiByZWN0LnRvcCB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHRvdWNoc3RhcnQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgW3RvdWNoXSA9IGUudG91Y2hlcztcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IGVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuZGF0YXNldC5kcmFnZ2VkID0gXCJ0cnVlXCI7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiO1xuXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy4jZHJhZ2dlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2UueCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZS55ID0gdG91Y2guY2xpZW50WTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2UuaXggPSB0b3VjaC5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jbW91c2UuaXkgPSB0b3VjaC5jbGllbnRZO1xuXG4gICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veCA9IHRvdWNoLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3kgPSB0b3VjaC5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IFsuLi5TZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkXS5tYXAoKHRhcmdldCkgPT4gdGFyZ2V0LnBvcyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gWy4uLlNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWRdLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXggPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXkgPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBieCA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBieSA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkID0gTWF0aC5zcXJ0KGF4ICogYXggKyBheSAqIGF5KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmQgPSBNYXRoLnNxcnQoYnggKiBieCArIGJ5ICogYnkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWQgLSBiZDtcbiAgICAgICAgICAgICAgICB9KVswXS5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYm91bmRzID0gdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm94ID0gdG91Y2guY2xpZW50WCAtIGJvdW5kcy54O1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm95ID0gdG91Y2guY2xpZW50WSAtIGJvdW5kcy55O1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jdG9wbGVmdCA9IHRvcGxlZnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuI29yaWdpbmFsID0geyB4OiByZWN0LmxlZnQsIHk6IHJlY3QudG9wIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duLCB7IGNhcHR1cmU6IHRydWUgfSk7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0b3VjaHN0YXJ0LCB7IGNhcHR1cmU6IHRydWUgfSk7XG5cbiAgICAgICAgdGhpcy4jd2F0Y2hlZC5zZXQodGFyZ2V0LCB7IG1vdXNlZG93biwgdG91Y2hzdGFydCB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZm9yZ2V0KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBmb3JjZT86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLiN3YXRjaGVkLmdldChlbGVtZW50KTtcblxuICAgICAgICBpZiAoIWxpc3RlbmVyICYmICFmb3JjZSkgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGlzIG5vdCBjdXJyZW50bHkgYmVpbmcgd2F0Y2hlZC5gKTtcblxuICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50LmRhdGFzZXQud2F0Y2hlZDtcblxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGxpc3RlbmVyLm1vdXNlZG93biwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBsaXN0ZW5lci50b3VjaHN0YXJ0LCB7IGNhcHR1cmU6IHRydWUgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuI3dhdGNoZWQuZGVsZXRlKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLiN3YXRjaGVkLmZvckVhY2goKF8sIGVsZW1lbnQpID0+IHRoaXMuZm9yZ2V0KGVsZW1lbnQpKTtcblxuICAgICAgICB0aGlzLiNtb3VzZSA9IHsgeDogLTEsIHk6IC0xLCBveDogLTEsIG95OiAtMSwgaXg6IC0xLCBpeTogLTEsIGRvd246IGZhbHNlIH07XG5cbiAgICAgICAgdGhpcy4jZG93bnBvcyA9IHsgeDogLTEsIHk6IC0xIH07XG5cbiAgICAgICAgdGhpcy4jdG9wbGVmdCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNkcmFnZ2VkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI29yaWdpbmFsID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW5kZXIoeyBmZyB9OiB7IGZnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54ICE9PSAtMSAmJlxuICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueSAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS54ICE9PSAtMSAmJlxuICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnkgIT09IC0xXG4gICAgICAgICkge1xuICAgICAgICAgICAgZmcuc3Ryb2tlU3R5bGUgPSBHRVRfQUNUSVZBVEVEX0NPTE9SKCk7XG5cbiAgICAgICAgICAgIGZnLmxpbmVXaWR0aCA9IDIuNTtcblxuICAgICAgICAgICAgZmcubGluZUpvaW4gPSBcIm1pdGVyXCI7XG5cbiAgICAgICAgICAgIGZnLnN0cm9rZVJlY3QoXG4gICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueCxcbiAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy55LFxuICAgICAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS54IC0gRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueCxcbiAgICAgICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueSAtIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLnksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgdGhpcy5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcblxuICAgICAgICBDYW52YXNNYW5hZ2VyLmFkZEpvYih0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy4jdG91Y2htb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLiN0b3VjaHN0YXJ0KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy4jdG91Y2hlbmQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWFmZW4oKSB7XG4gICAgICAgIHRoaXMuc25hcFRvR3JpZEJhc2VkVXBkYXRlKHsgZm9yY2VDbGVhcjogdHJ1ZSB9KTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy4jdG91Y2htb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLiN0b3VjaHN0YXJ0KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy4jdG91Y2hlbmQpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICBpZiAodGhpcy4jZHJhZ2dlZCkge1xuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRoaXMuI2RyYWdnZWQpO1xuXG4gICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5sZWZ0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLnRvcCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IHRoaXMuI3RvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQubGVmdCAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldC50b3AgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLmxlZnQgPSB0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3ggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUudG9wID0gdGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy4jdG9wbGVmdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gdGhpcy4jdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3ggKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kgKyBvZmZzZXQudG9wIC0gdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICB0aGlzLiNtb3VzZS5peCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UuaXkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcblxuICAgICAgICBjb25zdCBpc09uSW52YWxpZFRhcmdldCA9IFtcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLWlucHV0XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJidXR0b24uYm9hcmQtb3V0cHV0XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJkaXYuY29tcG9uZW50XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJkaXYuZGlzcGxheVwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbnRleHRtZW51XCIpLFxuICAgICAgICBdLmZpbmQoKGVsZW1lbnQpID0+IGVsZW1lbnQgIT09IG51bGwpITtcblxuICAgICAgICBpZiAoIWlzT25JbnZhbGlkVGFyZ2V0ICYmIGUuYnV0dG9uID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleUFcIikgJiYgS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVNcIikpIHtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleUFcIikpIHtcbiAgICAgICAgICAgICAgICBxdWlja3BpY2tHYXRlcyhlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVNcIikpIHtcbiAgICAgICAgICAgICAgICBxdWlja3BpY2tDb21wb25lbnRzKGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgdGhpcy4jZG93bnBvcy55ID0gZS5jbGllbnRZO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jbW91c2UuZG93biA9IHRydWU7XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2V1cCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgaWYgKHRoaXMuI2RyYWdnZWQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kcmFnZ2VkPVwidHJ1ZVwiXScpLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgZS5kYXRhc2V0LmRyYWdnZWQ7XG5cbiAgICAgICAgICAgICAgICBlLnN0eWxlLmN1cnNvciA9IFwiXCI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy4jZHJhZ2dlZDtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuI21vdXNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsID0gdGhpcy4jb3JpZ2luYWwhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSBHUklEX1NJWkU7XG5cbiAgICAgICAgICAgICAgICBpZiAobW91c2UueCAhPT0gbW91c2UuaXggfHwgbW91c2UueSAhPT0gbW91c2UuaXkpXG4gICAgICAgICAgICAgICAgICAgIGlmIChEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZClcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4odGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IE1hdGguZmxvb3IoKG1vdXNlLnggLSBtb3VzZS5veCAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gTWF0aC5mbG9vcigobW91c2UueSAtIG1vdXNlLm95IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBNYXRoLmZsb29yKChvcmlnaW5hbC54IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBNYXRoLmZsb29yKChvcmlnaW5hbC55IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4odGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IG1vdXNlLnggLSBtb3VzZS5veCAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBtb3VzZS55IC0gbW91c2Uub3kgLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbih0YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5sZWZ0ID0gb3JpZ2luYWwueCAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBvcmlnaW5hbC55IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy4jdG9wbGVmdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vdXNlID0gdGhpcy4jbW91c2U7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0cyA9IFsuLi5TZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkXTtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSB0aGlzLiNwb3NpdGlvbnMhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSB0aGlzLiN0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSBHUklEX1NJWkU7XG5cbiAgICAgICAgICAgICAgICBpZiAobW91c2UueCAhPT0gbW91c2UuaXggfHwgbW91c2UueSAhPT0gbW91c2UuaXkpXG4gICAgICAgICAgICAgICAgICAgIGlmIChEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZClcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogTWF0aC5mbG9vcigobW91c2UueCAtIG1vdXNlLm94KSAvIHNpemUpICogc2l6ZSArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IE1hdGguZmxvb3IoKG1vdXNlLnkgLSBtb3VzZS5veSkgLyBzaXplKSAqIHNpemUgKyBvZmZzZXQudG9wIC0gdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZShwb3NpdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBtb3VzZS54IC0gbW91c2Uub3ggKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBtb3VzZS55IC0gbW91c2Uub3kgKyBvZmZzZXQudG9wIC0gdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZShwb3NpdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuI2Rvd25wb3MueCAhPT0gLTEgJiZcbiAgICAgICAgICAgIHRoaXMuI2Rvd25wb3MueSAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS54ICE9PSAtMSAmJlxuICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnkgIT09IC0xXG4gICAgICAgIClcbiAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0QWxsSW4oRHJhZ2dpbmdNYW5hZ2VyLiNkb3ducG9zLCBNb3VzZU1hbmFnZXIubW91c2UpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlID0geyB4OiAtMSwgeTogLTEsIG94OiAtMSwgb3k6IC0xLCBpeDogLTEsIGl5OiAtMSwgZG93bjogZmFsc2UgfTtcblxuICAgICAgICB0aGlzLiNkb3ducG9zID0geyB4OiAtMSwgeTogLTEgfTtcblxuICAgICAgICB0aGlzLiN0b3BsZWZ0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI2RyYWdnZWQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jb3JpZ2luYWwgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jcG9zaXRpb25zID0gdW5kZWZpbmVkO1xuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3RvdWNobW92ZSA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IFt0b3VjaF0gPSBlLnRvdWNoZXM7XG5cbiAgICAgICAgdGhpcy4jbW91c2UueCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSB0b3VjaC5jbGllbnRZO1xuXG4gICAgICAgIGlmICh0aGlzLiNkcmFnZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4odGhpcy4jZHJhZ2dlZCk7XG5cbiAgICAgICAgICAgIGlmIChEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCkge1xuICAgICAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLmxlZnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUudG9wID1cbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy4jdG9wbGVmdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gdGhpcy4jdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3gpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldC5sZWZ0IC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0LnRvcCAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUubGVmdCA9IHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50b3AgPSB0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiN0b3BsZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSB0aGlzLiN0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSArIG9mZnNldC50b3AgLSB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICN0b3VjaHN0YXJ0ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgW3RvdWNoXSA9IGUudG91Y2hlcztcblxuICAgICAgICB0aGlzLiNtb3VzZS54ID0gdG91Y2guY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IHRvdWNoLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UuaXggPSB0b3VjaC5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS5peSA9IHRvdWNoLmNsaWVudFk7XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcblxuICAgICAgICBjb25zdCBpc09uSW52YWxpZFRhcmdldCA9IFtcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLWlucHV0XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJidXR0b24uYm9hcmQtb3V0cHV0XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJkaXYuY29tcG9uZW50XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJkaXYuZGlzcGxheVwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbnRleHRtZW51XCIpLFxuICAgICAgICBdLmZpbmQoKGVsZW1lbnQpID0+IGVsZW1lbnQgIT09IG51bGwpITtcblxuICAgICAgICBpZiAoIWlzT25JbnZhbGlkVGFyZ2V0KSB7XG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggPSB0b3VjaC5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jZG93bnBvcy55ID0gdG91Y2guY2xpZW50WTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI21vdXNlLmRvd24gPSB0cnVlO1xuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3RvdWNoZW5kID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgW3RvdWNoXSA9IGUuY2hhbmdlZFRvdWNoZXM7XG5cbiAgICAgICAgdGhpcy4jbW91c2UueCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSB0b3VjaC5jbGllbnRZO1xuXG4gICAgICAgIGlmICh0aGlzLiNkcmFnZ2VkKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignW2RhdGEtZHJhZ2dlZD1cInRydWVcIl0nKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGUuZGF0YXNldC5kcmFnZ2VkO1xuXG4gICAgICAgICAgICAgICAgZS5zdHlsZS5jdXJzb3IgPSBcIlwiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuI2RyYWdnZWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2UgPSB0aGlzLiNtb3VzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbCA9IHRoaXMuI29yaWdpbmFsITtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gR1JJRF9TSVpFO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLnggIT09IG1vdXNlLml4IHx8IG1vdXNlLnkgIT09IG1vdXNlLml5KVxuICAgICAgICAgICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBNYXRoLmZsb29yKChtb3VzZS54IC0gbW91c2Uub3ggLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoKG1vdXNlLnkgLSBtb3VzZS5veSAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbih0YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5sZWZ0ID0gTWF0aC5mbG9vcigob3JpZ2luYWwueCAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gTWF0aC5mbG9vcigob3JpZ2luYWwueSAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBtb3VzZS54IC0gbW91c2Uub3ggLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gbW91c2UueSAtIG1vdXNlLm95IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4odGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IG9yaWdpbmFsLnggLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gb3JpZ2luYWwueSAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuI21vdXNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldHMgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF07XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy4jcG9zaXRpb25zITtcbiAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gdGhpcy4jdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gR1JJRF9TSVpFO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLnggIT09IG1vdXNlLml4IHx8IG1vdXNlLnkgIT09IG1vdXNlLml5KVxuICAgICAgICAgICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IE1hdGguZmxvb3IoKG1vdXNlLnggLSBtb3VzZS5veCkgLyBzaXplKSAqIHNpemUgKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBNYXRoLmZsb29yKChtb3VzZS55IC0gbW91c2Uub3kpIC8gc2l6ZSkgKiBzaXplICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogbW91c2UueCAtIG1vdXNlLm94ICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbW91c2UueSAtIG1vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggIT09IC0xICYmXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnkgIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueCAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55ICE9PSAtMVxuICAgICAgICApXG4gICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdEFsbEluKERyYWdnaW5nTWFuYWdlci4jZG93bnBvcywgTW91c2VNYW5hZ2VyLm1vdXNlKTtcblxuICAgICAgICB0aGlzLiNtb3VzZSA9IHsgeDogLTEsIHk6IC0xLCBveDogLTEsIG95OiAtMSwgaXg6IC0xLCBpeTogLTEsIGRvd246IGZhbHNlIH07XG5cbiAgICAgICAgdGhpcy4jZG93bnBvcyA9IHsgeDogLTEsIHk6IC0xIH07XG5cbiAgICAgICAgdGhpcy4jdG9wbGVmdCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNkcmFnZ2VkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI29yaWdpbmFsID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB9O1xuXG4gICAgc3RhdGljIGdldCBkb3ducG9zKCkge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLiNkb3ducG9zIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgS2V5YmluZHNNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2tleW1hcCA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xuXG4gICAgc3RhdGljICNrZXljaG9yZHMgPSBuZXcgQXJyYXk8W3N0cmluZywgKChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKVtdXT4oKTtcblxuICAgIHN0YXRpYyAja2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5zZXQoZS5jb2RlLCB0cnVlKTtcblxuICAgICAgICBpZiAoZS5tZXRhS2V5ICYmIChlLmNvZGUgPT09IFwiU2hpZnRMZWZ0XCIgfHwgZS5jb2RlID09PSBcIlNoaWZ0UmlnaHRcIikgJiYgSVNfTUFDX09TKVxuICAgICAgICAgICAgdGhpcy4ja2V5bWFwID0gbmV3IE1hcChbLi4udGhpcy4ja2V5bWFwLmVudHJpZXMoKV0uZmlsdGVyKChba2V5XSkgPT4gIWtleS5zdGFydHNXaXRoKFwiS2V5XCIpKSk7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGNvbnN0IFtjaG9yZCwgcnVuc10gPVxuICAgICAgICAgICAgICAgIHRoaXMuI2tleWNob3Jkcy5maW5kKChbY2hvcmRdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBrZXlzID0gY2hvcmQuc3BsaXQoXCIrXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrU2hpZnQgPSBrZXlzLmluY2x1ZGVzKFwiU2hpZnRMZWZ0XCIpIHx8IGtleXMuaW5jbHVkZXMoXCJTaGlmdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja0N0cmwgPSBrZXlzLmluY2x1ZGVzKFwiQ29udHJvbExlZnRcIikgfHwga2V5cy5pbmNsdWRlcyhcIkNvbnRyb2xSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tBbHQgPSBrZXlzLmluY2x1ZGVzKFwiQWx0TGVmdFwiKSB8fCBrZXlzLmluY2x1ZGVzKFwiQWx0UmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrTWV0YSA9IGtleXMuaW5jbHVkZXMoXCJNZXRhTGVmdFwiKSB8fCBrZXlzLmluY2x1ZGVzKFwiTWV0YVJpZ2h0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tTaGlmdCAmJiBlLnNoaWZ0S2V5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tDdHJsICYmIGUuY3RybEtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrQWx0ICYmIGUuYWx0S2V5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tNZXRhICYmIGUubWV0YUtleSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja1NoaWZ0KSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIlNoaWZ0TGVmdFwiICYmIGtleSAhPT0gXCJTaGlmdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tDdHJsKSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIkNvbnRyb2xMZWZ0XCIgJiYga2V5ICE9PSBcIkNvbnRyb2xSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrQWx0KSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIkFsdExlZnRcIiAmJiBrZXkgIT09IFwiQWx0UmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja01ldGEpIGtleXMgPSBrZXlzLmZpbHRlcigoa2V5KSA9PiBrZXkgIT09IFwiTWV0YUxlZnRcIiAmJiBrZXkgIT09IFwiTWV0YVJpZ2h0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tTaGlmdCA/IGUuc2hpZnRLZXkgOiB0cnVlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrQ3RybCA/IGUuY3RybEtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tBbHQgPyBlLmFsdEtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tNZXRhID8gZS5tZXRhS2V5IDogdHJ1ZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXMuZXZlcnkoKGtleSkgPT4gdGhpcy4ja2V5bWFwLmdldChrZXkpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pID8/IFtdO1xuXG4gICAgICAgICAgICBpZiAocnVucykge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmtpbGxNZW51KCk7XG5cbiAgICAgICAgICAgICAgICBydW5zLmZvckVhY2goKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBlKSk7XG5cbiAgICAgICAgICAgICAgICBjaG9yZCEuc3BsaXQoXCIrXCIpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJLZXlcIikpIHRoaXMuI2tleW1hcC5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgI2tleXVwID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmRlbGV0ZShlLmNvZGUpO1xuXG4gICAgICAgIGlmICghZS5tZXRhS2V5ICYmIChlLmNvZGUgPT09IFwiTWV0YUxlZnRcIiB8fCBlLmNvZGUgPT09IFwiTWV0YVJpZ2h0XCIpICYmIElTX01BQ19PUykgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjYmx1ciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuI2tleWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy4ja2V5dXApO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLiNibHVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVhZmVuKCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLiNrZXlkb3duKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuI2tleXVwKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy4jYmx1cik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uS2V5Q2hvcmQoY2hvcmQ6IHN0cmluZywgcnVuOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICBjaG9yZCA9IGNob3JkLnNwbGl0KFwiK1wiKS5zb3J0KCkuam9pbihcIitcIik7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNrZXljaG9yZHMuZmluZCgoW2tleV0pID0+IGtleSA9PT0gY2hvcmQpPy5bMV0ucHVzaChydW4pKSB0aGlzLiNrZXljaG9yZHMucHVzaChbY2hvcmQsIFtydW5dXSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bkFuZE5vRm9jdXMoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy4ja2V5bWFwLmdldChrZXkpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bihrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gISF0aGlzLiNrZXltYXAuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLiNrZXltYXAuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLiNrZXljaG9yZHMgPSBbXTtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBleHBhbmQ8UyBleHRlbmRzIHN0cmluZz4oY2hvcmQ6IFMpOiBFeHBhbmRDaG9yZDxTPltdO1xuICAgIHN0YXRpYyBleHBhbmQoY2hvcmQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBba2V5LCAuLi5yZXN0XSA9IGNob3JkLnNwbGl0KFwiK1wiKTtcblxuICAgICAgICBpZiAoa2V5ID09PSBcIlNoaWZ0XCIgfHwga2V5ID09PSBcIkNvbnRyb2xcIiB8fCBrZXkgPT09IFwiQWx0XCIgfHwga2V5ID09PSBcIk1ldGFcIilcbiAgICAgICAgICAgIHJldHVybiByZXN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgID8gdGhpcy5leHBhbmQocmVzdC5qb2luKFwiK1wiKSkuZmxhdE1hcCgoa2V5cykgPT4gW1xuICAgICAgICAgICAgICAgICAgICAgIFtgJHtrZXl9TGVmdGAsIGtleXNdLmpvaW4oXCIrXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIFtgJHtrZXl9UmlnaHRgLCBrZXlzXS5qb2luKFwiK1wiKSxcbiAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgOiBbYCR7a2V5fUxlZnRgLCBgJHtrZXl9UmlnaHRgXTtcblxuICAgICAgICBpZiAoa2V5Lmxlbmd0aCA9PT0gMSAmJiBrZXkgPT09IGtleS50b1VwcGVyQ2FzZSgpKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3QubGVuZ3RoXG4gICAgICAgICAgICAgICAgPyB0aGlzLmV4cGFuZChyZXN0LmpvaW4oXCIrXCIpKS5mbGF0TWFwKChrZXlzKSA9PiBbW2BLZXkke2tleX1gLCBrZXlzXS5qb2luKFwiK1wiKV0pXG4gICAgICAgICAgICAgICAgOiBbYEtleSR7a2V5fWBdO1xuXG4gICAgICAgIHJldHVybiBbY2hvcmRdO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3NpZ248UyBleHRlbmRzIHN0cmluZywgUiBleHRlbmRzIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPihjaG9yZDogUywgcnVuOiBSKTogQXNzaWduQ2hvcmQ8UywgUj47XG4gICAgc3RhdGljIGFzc2lnbihjaG9yZDogc3RyaW5nLCBydW46IChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChjaG9yZClcbiAgICAgICAgICAgICAgICAubWFwPFtTdHJpbmdpZmlhYmxlLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZF0+KChrZXlzKSA9PiBba2V5cywgcnVuXSlcbiAgICAgICAgICAgICAgICAuY29uY2F0KFtbY2hvcmQsIHJ1bl1dKSxcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbnR5cGUgU3BsaXQ8UyBleHRlbmRzIHN0cmluZywgRCBleHRlbmRzIHN0cmluZyA9IFwiXCIsIFIgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gPSBbXT4gPSBTIGV4dGVuZHMgXCJcIlxuICAgID8gUlxuICAgIDogUyBleHRlbmRzIGAke2luZmVyIEF9JHtEfSR7aW5mZXIgQn1gXG4gICAgPyBTcGxpdDxCLCBELCBbLi4uUiwgQV0+XG4gICAgOiBbLi4uUiwgU107XG5cbnR5cGUgU3RyaW5naWZpYWJsZSA9IHN0cmluZyB8IG51bWJlciB8IGJpZ2ludCB8IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG50eXBlIEpvaW48QSwgUyBleHRlbmRzIHN0cmluZyA9IFwiXCIsIFIgZXh0ZW5kcyBzdHJpbmcgPSBcIlwiPiA9IEEgZXh0ZW5kcyBbaW5mZXIgWCBleHRlbmRzIFN0cmluZ2lmaWFibGUsIC4uLmluZmVyIFldXG4gICAgPyBKb2luPFksIFMsIFIgZXh0ZW5kcyBcIlwiID8gWCA6IGAke1J9JHtTfSR7WH1gPlxuICAgIDogUjtcblxudHlwZSBFeHBhbmRDaG9yZDxTIGV4dGVuZHMgc3RyaW5nLCBBIGV4dGVuZHMgc3RyaW5nW10gPSBTcGxpdDxTLCBcIitcIj4+ID0gSm9pbjxcbiAgICB7XG4gICAgICAgIFtLIGluIGtleW9mIEFdOiBBW0tdIGV4dGVuZHMgXCJTaGlmdFwiIHwgXCJDb250cm9sXCIgfCBcIkFsdFwiIHwgXCJNZXRhXCJcbiAgICAgICAgICAgID8gYCR7QVtLXX0ke1wiTGVmdFwiIHwgXCJSaWdodFwifWBcbiAgICAgICAgICAgIDogU3BsaXQ8QVtLXT5bXCJsZW5ndGhcIl0gZXh0ZW5kcyAxXG4gICAgICAgICAgICA/IEFbS10gZXh0ZW5kcyBVcHBlcmNhc2U8QVtLXT5cbiAgICAgICAgICAgICAgICA/IGBLZXkke0FbS119YFxuICAgICAgICAgICAgICAgIDogQVtLXVxuICAgICAgICAgICAgOiBBW0tdO1xuICAgIH0sXG4gICAgXCIrXCJcbj47XG5cbnR5cGUgQXNzaWduQ2hvcmQ8UyBleHRlbmRzIHN0cmluZywgUj4gPSB7XG4gICAgW18gaW4gU106IFI7XG59ICYge1xuICAgIFtLIGluIEV4cGFuZENob3JkPFM+ICYgUHJvcGVydHlLZXldOiBSO1xufTtcbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQ29udGV4dCA9IHtcbiAgICBtZW51OiBIVE1MRWxlbWVudDtcbiAgICBjbGlja3M6IE1hcDxzdHJpbmcsICgpID0+IHZvaWQ+O1xuICAgIGxpc3RlbmVyczoge1xuICAgICAgICBtb3VzZWRvd246IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgICAgICBjb250ZXh0bWVudTogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgICAgIGNsaWNrOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICB9O1xufTtcblxuZXhwb3J0IHR5cGUgTWVudU1hbmFnZXJBY3Rpb25zID0gQXJyYXk8XG4gICAgUmVjb3JkPHN0cmluZywgeyBsYWJlbDogc3RyaW5nOyBrZXliaW5kPzogc3RyaW5nOyBjYWxsYmFjazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQgfT5cbj47XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQWN0aW9uID0gTWVudU1hbmFnZXJBY3Rpb25zW251bWJlcl07XG5cbmV4cG9ydCBjbGFzcyBNZW51TWFuYWdlciB7XG4gICAgc3RhdGljIHJlYWRvbmx5ICNlbGVtZW50cyA9IG5ldyBNYXA8SFRNTEVsZW1lbnQsIE1lbnVNYW5hZ2VyQ29udGV4dD4oKTtcblxuICAgIHN0YXRpYyAjb3BlbmVkOiBNb3VzZUV2ZW50O1xuXG4gICAgc3RhdGljIHVzZShcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgIGFjdGlvbnM6IE1lbnVNYW5hZ2VyQWN0aW9ucyxcbiAgICApOiBbcXVldWVOZXdDb250ZXh0OiAobmV3Q29udGV4dDogKHByZXY6IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4gTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB2b2lkLCBraWxsTWVudTogKCkgPT4gdm9pZF0ge1xuICAgICAgICBjb25zdCBtZW51ID0gaHRtbGA8ZGl2IGNsYXNzPVwiY29udGV4dG1lbnVcIj48L2Rpdj5gO1xuXG4gICAgICAgIGNvbnN0IGNsaWNrcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICBjb25zdCBzZXR1cCA9IChhY3Rpb25zOiBNZW51TWFuYWdlckFjdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGNsaWNrcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gYWN0aW9ucy5mbGF0TWFwKChyZWNvcmQpID0+IE9iamVjdC5rZXlzKHJlY29yZCkpO1xuXG4gICAgICAgICAgICBpZiAoa2V5cy5sZW5ndGggIT09IG5ldyBTZXQoa2V5cykuc2l6ZSkgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIGtleXMgaW4gbWVudSBhY3Rpb25zLlwiKTtcblxuICAgICAgICAgICAgbWVudS5pbm5lckhUTUwgPSBhY3Rpb25zXG4gICAgICAgICAgICAgICAgLm1hcCgocmVjb3JkKSA9PlxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhyZWNvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChbbmFtZSwgeyBsYWJlbCwga2V5YmluZCB9XSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYDxidXR0b24gY2xhc3M9XCIke25hbWV9XCI+JHtsYWJlbH08cCBjbGFzcz1cIm1lbnUta2V5YmluZFwiPiR7a2V5YmluZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGtleSkgPT4gYDxzcGFuPiR7a2V5fTwvc3Bhbj5gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKX08L3A+PC9idXR0b24+YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGA8YnV0dG9uIGNsYXNzPVwiJHtuYW1lfVwiPiR7bGFiZWx9PC9idXR0b24+YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuam9pbignPGRpdiBjbGFzcz1cImJyXCI+PC9kaXY+Jyk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZm9yRWFjaCgocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVjb3JkKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xpY2sgPSByZWNvcmRba2V5XS5jYWxsYmFjay5iaW5kKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiBjbGljayh0aGlzLiNvcGVuZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIG1lbnUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuXCIgKyBrZXkpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLlwiICsga2V5KSEuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgICAgICBjbGlja3Muc2V0KGtleSwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGNvbnRleHQ6IE1lbnVNYW5hZ2VyQWN0aW9ucyB8IHVuZGVmaW5lZDtcblxuICAgICAgICBjb25zdCBnZXRBY3Rpb25zID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gY29udGV4dDtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobWVudSk7XG5cbiAgICAgICAgY29uc3QgbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI29wZW5lZCA9IGU7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjb250ZXh0bWVudSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBlLmNsaWVudFggKyBcInB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IGUuY2xpZW50WSArIFwicHhcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgY29udGV4dG1lbnUpO1xuICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGljayk7XG4gICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGNsaWNrKTtcblxuICAgICAgICB0aGlzLiNlbGVtZW50cy5zZXQoZWxlbWVudCwgeyBtZW51LCBjbGlja3MsIGxpc3RlbmVyczogeyBtb3VzZWRvd24sIGNvbnRleHRtZW51LCBjbGljayB9IH0pO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAobmV3Q29udGV4dDogKHByZXY6IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4gTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IG5ld0NvbnRleHQuY2FsbCh1bmRlZmluZWQsIFsuLi5hY3Rpb25zXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIG1lbnUuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCB7IG1lbnUsIGNsaWNrcywgbGlzdGVuZXJzIH0gPSB0aGlzLiNlbGVtZW50cy5nZXQoZWxlbWVudCkgPz8ge307XG5cbiAgICAgICAgaWYgKCFtZW51IHx8ICFjbGlja3MgfHwgIWxpc3RlbmVycykgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50cyBhcmUgbm90IGJlaW5nIGFmZmVjdGVkLmApO1xuXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBsaXN0ZW5lcnMubW91c2Vkb3duKTtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXJzLmNvbnRleHRtZW51KTtcbiAgICAgICAgbWVudS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXJzLmNsaWNrKTtcbiAgICAgICAgbWVudS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXJzLmNsaWNrKTtcblxuICAgICAgICBBcnJheS5mcm9tKGNsaWNrcykuZm9yRWFjaCgoW2tleSwgbGlzdGVuZXJdKSA9PiB7XG4gICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3IoXCIuXCIgKyBrZXkpIS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yKFwiLlwiICsga2V5KSEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWVudS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgTW9kYWxNYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWNvbnRhaW5lclwiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljICNvbk1vZGFsTW91bnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCA8PSAwKSB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtaW5hY3RpdmVcIik7XG4gICAgICAgIGVsc2UgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEuY2xhc3NMaXN0LmFkZChcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgIH1cblxuICAgIHN0YXRpYyAjb25Nb2RhbFJlc29sdmVkKCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPD0gMCkgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5jb250YWlucyhcIm1vZGFsLWFsZXJ0XCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgYWxlcnQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI29uTW9kYWxNb3VudCgpO1xuXG4gICAgICAgIGNvbnN0IGFsZXJ0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1hbGVydFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGFsZXJ0KTtcblxuICAgICAgICBhbGVydC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBhbGVydC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxSZXNvbHZlZCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgY29uc3QgY2xpY2tvdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gdGhpcy5jb250YWluZXIgfHwgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCAhPT0gYWxlcnQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgIGFsZXJ0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBjb25maXJtKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBjb25maXJtID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1jb25maXJtXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtY2FuY2VsXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChjb25maXJtKTtcblxuICAgICAgICBjb25maXJtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5mb2N1cygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKCkgPT4gcmVzb2x2ZShmYWxzZSk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAodmFsdWU6IGJvb2xlYW4pID0+ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25maXJtLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jb25Nb2RhbFJlc29sdmVkKCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZXNjID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5jb2RlID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm0ucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jb25Nb2RhbFJlc29sdmVkKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICBjb25zdCBjbGlja291dCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICE9PSB0aGlzLmNvbnRhaW5lciB8fCB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkICE9PSBjb25maXJtKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgICAgIGNvbmZpcm0ucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgY29uZmlybS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1jYW5jZWxcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKGZhbHNlKSk7XG5cbiAgICAgICAgICAgIGNvbmZpcm0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKHRydWUpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIHByb21wdChtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy4jb25Nb2RhbE1vdW50KCk7XG5cbiAgICAgICAgY29uc3QgcHJvbXB0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1jb25maXJtXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJtb2RhbC1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgLz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtY2FuY2VsXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9tcHQpO1xuXG4gICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmFkZChmaW5pc2gpO1xuXG4gICAgICAgICAgICBjb25zdCBkb25lID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb21wdC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxSZXNvbHZlZCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZmluaXNoKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgY29uc3QgY2xpY2tvdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gdGhpcy5jb250YWluZXIgfHwgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCAhPT0gcHJvbXB0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtY2FuY2VsXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgcG9wdXAoY29udGVudDogc3RyaW5nIHwgRWxlbWVudCkge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBwb3B1cCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtYWxlcnQgbW9kYWwtcG9wdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPiR7dHlwZW9mIGNvbnRlbnQgPT09IFwic3RyaW5nXCIgPyBjb250ZW50IDogY29udGVudC5vdXRlckhUTUx9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHBvcHVwKTtcblxuICAgICAgICBwb3B1cC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBwb3B1cC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxSZXNvbHZlZCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgY29uc3QgY2xpY2tvdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gdGhpcy5jb250YWluZXIgfHwgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCAhPT0gcG9wdXApIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgIHBvcHVwLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBNb3VzZU1hbmFnZXIge1xuICAgIHN0YXRpYyAjbW91c2UgPSB7IHg6IDAsIHk6IDAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vkb3ducyA9IG5ldyBTZXQ8KGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ+KCk7XG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZXVwcyA9IG5ldyBTZXQ8KGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ+KCk7XG4gICAgc3RhdGljIHJlYWRvbmx5ICN0b3VjaHN0YXJ0cyA9IG5ldyBTZXQ8KGU6IFRvdWNoRXZlbnQpID0+IHZvaWQ+KCk7XG4gICAgc3RhdGljIHJlYWRvbmx5ICN0b3VjaGVuZHMgPSBuZXcgU2V0PChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkPigpO1xuXG4gICAgc3RhdGljICNtb3VzZW1vdmUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI21vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5mb3JFYWNoKChsKSA9PiBsLmNhbGwodW5kZWZpbmVkLCBlKSk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjbW91c2V1cCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI3RvdWNobW92ZSA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI3RvdWNoc3RhcnQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcblxuICAgICAgICB0aGlzLiN0b3VjaHN0YXJ0cy5mb3JFYWNoKChsKSA9PiBsLmNhbGwodW5kZWZpbmVkLCBlKSk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjdG91Y2hlbmQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xuXG4gICAgICAgIHRoaXMuI3RvdWNoZW5kcy5mb3JFYWNoKChsKSA9PiBsLmNhbGwodW5kZWZpbmVkLCBlKSk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBzdGFydCgpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMuI3RvdWNobW92ZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuI3RvdWNoc3RhcnQpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy4jdG91Y2hlbmQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wKCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuI21vdXNlbW92ZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy4jdG91Y2htb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy4jdG91Y2hzdGFydCk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLiN0b3VjaGVuZCk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UgPSB7IHg6IDAsIHk6IDAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuY2xlYXIoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb25Nb3VzZURvd24oaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5hZGQoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uTW91c2VVcChoYW5kbGVyOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5hZGQoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZk1vdXNlRG93bihoYW5kbGVyOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmRlbGV0ZShoYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmTW91c2VVcChoYW5kbGVyOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5kZWxldGUoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uVG91Y2hTdGFydChoYW5kbGVyOiAoZTogVG91Y2hFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiN0b3VjaHN0YXJ0cy5hZGQoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uVG91Y2hFbmQoaGFuZGxlcjogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jdG91Y2hlbmRzLmFkZChoYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmVG91Y2hTdGFydChoYW5kbGVyOiAoZTogVG91Y2hFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiN0b3VjaHN0YXJ0cy5kZWxldGUoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZlRvdWNoRW5kKGhhbmRsZXI6IChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI3RvdWNoZW5kcy5kZWxldGUoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBtb3VzZSgpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy4jbW91c2UgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBHRVRfR1JBWV9DT0xPUiwgUVVJQ0tQSUNLX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHsgQ2FudmFzTWFuYWdlciB9IGZyb20gXCIuL0NhbnZhc01hbmFnZXJcIjtcblxuZXhwb3J0IHR5cGUgUXVpY2tQaWNrQ29udGV4dCA9IHtcbiAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgbW91c2V1cDogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIFF1aWNrUGlja0FjdGlvbnMgPSB7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBjYWxsYmFjazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG59W107XG5cbmV4cG9ydCBjbGFzcyBRdWlja1BpY2tNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2xpbmU6IFtmcm9tOiBNb3VzZUV2ZW50LCB0bzogTW91c2VFdmVudF0gfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgYXN5bmMgYWN0aXZhdGUoZXZlbnQ6IE1vdXNlRXZlbnQsIGFjdGlvbnM6IFF1aWNrUGlja0FjdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcXVpY2twaWNrID0gaHRtbGA8ZGl2IGNsYXNzPVwicXVpY2twaWNrXCI+PC9kaXY+YDtcblxuICAgICAgICBjb25zdCBrZXlzID0gYWN0aW9ucy5tYXAoKHsgbGFiZWwgfSkgPT4gbGFiZWwpO1xuXG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCAhPT0gbmV3IFNldChrZXlzKS5zaXplKSB0aHJvdyBuZXcgRXJyb3IoXCJEdXBsaWNhdGUgbGFiZWxzIGluIHF1aWNrcGljayBhY3Rpb25zLlwiKTtcblxuICAgICAgICBxdWlja3BpY2suaW5uZXJIVE1MID0gYWN0aW9uc1xuICAgICAgICAgICAgLm1hcCgoeyBsYWJlbCB9LCBpKSA9PiBgPGRpdiBjbGFzcz1cInF1aWNrcGljay1pdGVtIGluZGV4LSR7aX1cIj4ke2xhYmVsfTwvZGl2PmApXG4gICAgICAgICAgICAuam9pbihcIlwiKTtcblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gaHRtbGBcbiAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicXVpY2twaWNrLWNpcmNsZVwiXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiJHtRVUlDS1BJQ0tfU0laRSAqIDJ9XCJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiJHtRVUlDS1BJQ0tfU0laRSAqIDJ9XCJcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXG4gICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgICAgICAgICAgICAgY3g9XCIke1FVSUNLUElDS19TSVpFfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjeT1cIiR7UVVJQ0tQSUNLX1NJWkV9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHI9XCIke1FVSUNLUElDS19TSVpFIC8gMiAtIDEgLSAxfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIke0dFVF9HUkFZX0NPTE9SKCl9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjJweFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICR7YWN0aW9ucy5tYXAoKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKCgyICogTWF0aC5QSSkgLyBhY3Rpb25zLmxlbmd0aCkgKiBpIC0gTWF0aC5QSSAvIDIgLSBNYXRoLlBJIC8gYWN0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVQYXRoID0gYE0ke01hdGguY29zKGFuZ2xlKSAqIChRVUlDS1BJQ0tfU0laRSAtIDEgLSAxKSArIFFVSUNLUElDS19TSVpFfSwke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguc2luKGFuZ2xlKSAqIChRVUlDS1BJQ0tfU0laRSAtIDEgLSAxKSArIFFVSUNLUElDS19TSVpFXG4gICAgICAgICAgICAgICAgICAgICAgICB9IEwke01hdGguY29zKGFuZ2xlKSAqIChRVUlDS1BJQ0tfU0laRSAvIDIgLSAxIC0gMSkgKyBRVUlDS1BJQ0tfU0laRX0sJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbihhbmdsZSkgKiAoUVVJQ0tQSUNLX1NJWkUgLyAyIC0gMSAtIDEpICsgUVVJQ0tQSUNLX1NJWkVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1gO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwYXRoIGQ9XCIke2xpbmVQYXRofVwiIHN0eWxlPVwic3Ryb2tlOiAke0dFVF9HUkFZX0NPTE9SKCl9OyBzdHJva2Utd2lkdGg6IDJweDsgZmlsbDogbm9uZTtcIiAvPmA7XG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgcXVpY2twaWNrLmFwcGVuZENoaWxkKGNpcmNsZSk7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBjaXJjbGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICBjaXJjbGUuc3R5bGUubGVmdCA9IGV2ZW50LmNsaWVudFggLSB3aWR0aCAvIDIgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgY2lyY2xlLnN0eWxlLnRvcCA9IGV2ZW50LmNsaWVudFkgLSBoZWlnaHQgLyAyICsgXCJweFwiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZm9yRWFjaCgoXywgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKCgyICogTWF0aC5QSSkgLyBhY3Rpb25zLmxlbmd0aCkgKiBpIC0gTWF0aC5QSSAvIDI7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gTWF0aC5jb3MoYW5nbGUpICogUVVJQ0tQSUNLX1NJWkU7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IE1hdGguc2luKGFuZ2xlKSAqIFFVSUNLUElDS19TSVpFO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHF1aWNrcGljay5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5pbmRleC1cIiArIGkpITtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gaSAqICgyMDAgLyBhY3Rpb25zLmxlbmd0aCkgKyBcIm1zXCI7XG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5hbmltYXRpb25EZWxheSA9IGkgKiAoMjAwIC8gYWN0aW9ucy5sZW5ndGgpICsgXCJtc1wiO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gZXZlbnQuY2xpZW50WCArICgyICogeCkgLyAzIC0gd2lkdGggLyAyICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUudG9wID0gZXZlbnQuY2xpZW50WSArICgyICogeSkgLyAzIC0gaGVpZ2h0IC8gMiArIFwicHhcIjtcblxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IGV2ZW50LmNsaWVudFggKyB4IC0gd2lkdGggLyAyICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnRvcCA9IGV2ZW50LmNsaWVudFkgKyB5IC0gaGVpZ2h0IC8gMiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHF1aWNrcGljayk7XG5cbiAgICAgICAgdGhpcy4jbGluZSA9IFtldmVudCwgZXZlbnRdO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlbW92ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiAodGhpcy4jbGluZSA9IFtldmVudCwgZV0pO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmUpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwibW91c2V1cFwiLFxuICAgICAgICAgICAgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguaHlwb3QoZS5jbGllbnRYIC0gZXZlbnQuY2xpZW50WCwgZS5jbGllbnRZIC0gZXZlbnQuY2xpZW50WSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPj0gUVVJQ0tQSUNLX1NJWkUgLyAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuMihlLmNsaWVudFkgLSBldmVudC5jbGllbnRZLCBlLmNsaWVudFggLSBldmVudC5jbGllbnRYKSArIE1hdGguUEkgLyAyO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsb3Nlc3QgPVxuICAgICAgICAgICAgICAgICAgICAgICAgKE1hdGgucm91bmQoYW5nbGUgLyAoKDIgKiBNYXRoLlBJKSAvIGFjdGlvbnMubGVuZ3RoKSkgKyBhY3Rpb25zLmxlbmd0aCkgJSBhY3Rpb25zLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zW2Nsb3Nlc3RdLmNhbGxiYWNrLmNhbGwodW5kZWZpbmVkLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcXVpY2twaWNrLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNsaW5lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgb25jZTogdHJ1ZSB9LFxuICAgICAgICApO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwibW91c2VsZWF2ZVwiLFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHF1aWNrcGljay5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jbGluZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IG9uY2U6IHRydWUgfSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVuZGVyKHsgZmcgfTogeyBmZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0pIHtcbiAgICAgICAgaWYgKHRoaXMuI2xpbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IFtmcm9tLCB0b10gPSB0aGlzLiNsaW5lO1xuXG4gICAgICAgICAgICBmZy5maWxsU3R5bGUgPSBHRVRfR1JBWV9DT0xPUigpO1xuICAgICAgICAgICAgZmcuc3Ryb2tlU3R5bGUgPSBHRVRfR1JBWV9DT0xPUigpO1xuXG4gICAgICAgICAgICBmZy5saW5lV2lkdGggPSAxO1xuXG4gICAgICAgICAgICBmZy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGZnLmFyYyhmcm9tLmNsaWVudFgsIGZyb20uY2xpZW50WSwgMiwgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgZmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBmZy5maWxsKCk7XG5cbiAgICAgICAgICAgIGZnLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgZmcubW92ZVRvKGZyb20uY2xpZW50WCwgZnJvbS5jbGllbnRZKTtcbiAgICAgICAgICAgIGZnLmxpbmVUbyh0by5jbGllbnRYLCB0by5jbGllbnRZKTtcbiAgICAgICAgICAgIGZnLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgZmcuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgIGZnLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgZmcuYXJjKHRvLmNsaWVudFgsIHRvLmNsaWVudFksIDIsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgICAgIGZnLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgZmcuZmlsbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXQoKSB7XG4gICAgICAgIENhbnZhc01hbmFnZXIuYWRkSm9iKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFdhdGNoZWRTZXQgfSBmcm9tIFwiLi4vYXVnbWVudHMvV2F0Y2hlZFNldFwiO1xuaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgR1JJRF9TSVpFLCBJTl9ERUJVR19NT0RFLCBMSUdIVF9HUkFZX0NTU19DT0xPUiwgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBmcm9tRmlsZSwgc2F2ZURpYWdyYW0sIFNlcmlhbGl6ZWREaWFncmFtIH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi4vcmVpZmllZC9EaXNwbGF5XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBDYW52YXNNYW5hZ2VyIH0gZnJvbSBcIi4vQ2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IHsgRGFya21vZGVNYW5hZ2VyIH0gZnJvbSBcIi4vRGFya21vZGVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgTWVudU1hbmFnZXIsIE1lbnVNYW5hZ2VyQWN0aW9ucyB9IGZyb20gXCIuL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgUXVpY2tQaWNrTWFuYWdlciB9IGZyb20gXCIuL1F1aWNrUGlja01hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuL1N0b3JhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFVuZG9SZWRvTWFuYWdlciB9IGZyb20gXCIuL1VuZG9SZWRvTWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vV2lyaW5nTWFuYWdlclwiO1xuXG50eXBlIFNhbmRib3hDb25maWcgPSB7XG4gICAga2V5YmluZHM/OiBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4gICAgbWVudT86IE1lbnVNYW5hZ2VyQWN0aW9ucztcbiAgICBpbml0aWFsPzogW2NvbXBvbmVudHM6IFJlaWZpZWRbXSwgd2lyZXM6IFdpcmluZ1tdXTtcbiAgICBsaW1pdHM/OiB7XG4gICAgICAgIGlucHV0cz86IG51bWJlcjtcbiAgICAgICAgb3V0cHV0cz86IG51bWJlcjtcbiAgICAgICAgd2lyaW5ncz86IG51bWJlcjtcbiAgICAgICAgY2hpcHM/OiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+O1xuICAgICAgICBjaGlwc1RvdGFsPzogbnVtYmVyO1xuICAgICAgICBjb21wb25lbnRzVG90YWw/OiBudW1iZXI7XG4gICAgfTtcbiAgICBzdGF0ZXM/OiB7IGlucHV0cz86IGJvb2xlYW5bXTsgb3V0cHV0cz86IGJvb2xlYW5bXTsgY2FsbGJhY2s6ICgpID0+IHZvaWQgfVtdO1xuICAgIHNhdmU/OiBzdHJpbmc7XG4gICAgb3ZlcnJpZGVTYXZlSWZFeGlzdHM/OiBib29sZWFuO1xuICAgIGNoZWNrSW50ZXJ2YWw/OiBudW1iZXI7XG4gICAgY2hlY2tTdGF0ZT86IChyZWlmaWVkOiBXYXRjaGVkU2V0PFJlaWZpZWQ+LCB3aXJpbmdzOiBXYXRjaGVkU2V0PFdpcmluZz4pID0+IGJvb2xlYW47XG4gICAgaWZTdGF0ZUNoZWNrZWQ/OiAoKSA9PiB2b2lkO1xuICAgIHNldHRpbmdzPzogeyBzbmFwVG9HcmlkPzogYm9vbGVhbiB9O1xufTtcblxuY29uc3QgY2FsY3VsYXRlUmVpZmllZFRvdGFscyA9IChzZXQ6IFNldDxSZWlmaWVkPikgPT5cbiAgICBbLi4uc2V0XS5yZWR1Y2UoXG4gICAgICAgIChtYXAsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBtYXAuaW5wdXRzVG90YWwrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbSBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgIG1hcC5vdXRwdXRzVG90YWwrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbSBpbnN0YW5jZW9mIENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIG1hcC5jaGlwc1RvdGFsKys7XG5cbiAgICAgICAgICAgICAgICBtYXAuY2hpcHMuc2V0KGl0ZW0uY2hpcC5uYW1lLCAobWFwLmNoaXBzLmdldChpdGVtLmNoaXAubmFtZSkgPz8gMCkgKyAxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbSBpbnN0YW5jZW9mIERpc3BsYXkpIHtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlucHV0c1RvdGFsOiAwLFxuICAgICAgICAgICAgb3V0cHV0c1RvdGFsOiAwLFxuICAgICAgICAgICAgY2hpcHNUb3RhbDogMCxcbiAgICAgICAgICAgIGNoaXBzOiBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpLFxuICAgICAgICB9LFxuICAgICk7XG5cbmV4cG9ydCBjbGFzcyBTYW5kYm94TWFuYWdlciB7XG4gICAgc3RhdGljIHF1ZXVlTmV3Q29udGV4dDogUmV0dXJuVHlwZTx0eXBlb2YgTWVudU1hbmFnZXJbXCJ1c2VcIl0+WzBdO1xuICAgIHN0YXRpYyBraWxsTWVudTogUmV0dXJuVHlwZTx0eXBlb2YgTWVudU1hbmFnZXJbXCJ1c2VcIl0+WzFdO1xuXG4gICAgc3RhdGljIHdhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMgPSBuZXcgU2V0PCgpID0+IHZvaWQ+KCk7XG5cbiAgICBzdGF0aWMgI2ludGVydmFsID0gLTE7XG4gICAgc3RhdGljICNvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjaGlzdG9yeSA9IG5ldyBBcnJheTxbY29tbWFuZDogKCkgPT4gdm9pZCwgcmVkbzogKCkgPT4gdm9pZF0+KCk7XG4gICAgc3RhdGljICNyZWRvcyA9IG5ldyBBcnJheTxbY29tbWFuZDogKCkgPT4gdm9pZCwgcmVkbzogKCkgPT4gdm9pZF0+KCk7XG5cbiAgICBzdGF0aWMgI2NvbmZpZzogU2FuZGJveENvbmZpZztcblxuICAgIHN0YXRpYyBzZXR1cChjb25maWc6IFNhbmRib3hDb25maWcpIHtcbiAgICAgICAgaWYgKHRoaXMuI29ic2VydmVyKSB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNpbnRlcnZhbCk7XG5cbiAgICAgICAgdGhpcy4jY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRhaW5lciBtb2RhbC1pbmFjdGl2ZVwiPjwvZGl2PmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGRpdiBjbGFzcz1cInJlaWZpZWQtcm9vdFwiPjwvZGl2PmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmQtY2FudmFzXCI+PC9jYW52YXM+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8Y2FudmFzIGNsYXNzPVwiZm9yZWdyb3VuZC1jYW52YXNcIj48L2NhbnZhcz5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxkaXYgY2xhc3M9XCJ0b2FzdHMtY29udGFpbmVyXCI+PC9kaXY+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8YnV0dG9uIGNsYXNzPVwiZGFya21vZGVcIj48L2J1dHRvbj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxidXR0b24gY2xhc3M9XCJ1bmRvXCI+PC9idXR0b24+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8YnV0dG9uIGNsYXNzPVwicmVkb1wiPjwvYnV0dG9uPmApO1xuXG4gICAgICAgIE1vdXNlTWFuYWdlci5zdGFydCgpO1xuICAgICAgICBLZXliaW5kc01hbmFnZXIubGlzdGVuKCk7XG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5saXN0ZW4oKTtcbiAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5saXN0ZW4oKTtcbiAgICAgICAgV2lyaW5nTWFuYWdlci5pbml0KCk7XG4gICAgICAgIFF1aWNrUGlja01hbmFnZXIuaW5pdCgpO1xuXG4gICAgICAgIENhbnZhc01hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgICBEYXJrbW9kZU1hbmFnZXIubGlzdGVuKCkub25DaGFuZ2UoKCkgPT4gRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSh7IG9ubHlVcGRhdGVDb2xvcjogdHJ1ZSB9KSk7XG5cbiAgICAgICAgVW5kb1JlZG9NYW5hZ2VyLmxpc3RlbigpO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZVJlaWZpZWRBY3RpdmUgPSAoY29tcG9uZW50czogUmVpZmllZFtdKSA9PlxuICAgICAgICAgICAgbmV3IFdhdGNoZWRTZXQ8UmVpZmllZD4oKVxuICAgICAgICAgICAgICAgIC5vbkFkZCgoaXRlbSwgc2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFscyA9IGNhbGN1bGF0ZVJlaWZpZWRUb3RhbHMoc2V0LmNsb25lKCkuYWRkKGl0ZW0pKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHMuY2hpcHNUb3RhbCArIHRvdGFscy5pbnB1dHNUb3RhbCArIHRvdGFscy5vdXRwdXRzVG90YWwgPlxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuI2NvbmZpZy5saW1pdHM/LmNvbXBvbmVudHNUb3RhbCA/PyBJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgY29tcG9uZW50cyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFscy5pbnB1dHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5pbnB1dHMgPz8gSW5maW5pdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgaW5wdXRzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxzLm91dHB1dHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5vdXRwdXRzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIG91dHB1dHMgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbHMuY2hpcHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5jaGlwc1RvdGFsID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIGNoaXBzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtIGluc3RhbmNlb2YgQ29tcG9uZW50ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHMuY2hpcHMuaGFzKGl0ZW0uY2hpcC5uYW1lKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzLmNoaXBzLmdldChpdGVtLmNoaXAubmFtZSkhID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LmNoaXBzPy5baXRlbS5jaGlwLm5hbWVdID8/IEluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYEV4Y2VlZGVkIHRvdGFsICcke2l0ZW0uY2hpcC5uYW1lfScgbGltaXQuYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub25BZGQoKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBNYXRoLmZsb29yKGNvbXBvbmVudC5wb3MueCAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5mbG9vcihjb21wb25lbnQucG9zLnkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFkZEFsbChjb21wb25lbnRzKTtcblxuICAgICAgICBjb25zdCBjcmVhdGVXaXJpbmdzU2V0ID0gKHdpcmluZ3M6IFdpcmluZ1tdKSA9PlxuICAgICAgICAgICAgbmV3IFdhdGNoZWRTZXQ8V2lyaW5nPigpXG4gICAgICAgICAgICAgICAgLm9uQWRkKChfLCBzZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldC5zaXplICsgMSA+ICh0aGlzLiNjb25maWcubGltaXRzPy53aXJpbmdzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIHdpcmluZ3MgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFkZEFsbCh3aXJpbmdzKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5tZW51ICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgW3RoaXMucXVldWVOZXdDb250ZXh0LCB0aGlzLmtpbGxNZW51XSA9IE1lbnVNYW5hZ2VyLnVzZShSZWlmaWVkLnJvb3QsIHRoaXMuI2NvbmZpZy5tZW51KTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5rZXliaW5kcyAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuI2NvbmZpZy5rZXliaW5kcykuZm9yRWFjaCgoW2Nob3JkLCBydW5dKSA9PiBLZXliaW5kc01hbmFnZXIub25LZXlDaG9yZChjaG9yZCwgcnVuKSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcuaW5pdGlhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZSA9IGNyZWF0ZVJlaWZpZWRBY3RpdmUodGhpcy4jY29uZmlnLmluaXRpYWxbMF0pO1xuXG4gICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5hdHRhY2goKSk7XG5cbiAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMgPSBjcmVhdGVXaXJpbmdzU2V0KHRoaXMuI2NvbmZpZy5pbml0aWFsWzFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLnNhdmUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBTdG9yYWdlTWFuYWdlci5nZXQ8c3RyaW5nPihcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUpO1xuXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogW3NldHRpbmdzLCBjb21wb25lbnRzLCB3aXJlc10sXG4gICAgICAgICAgICAgICAgfSA9IGZyb21GaWxlKGZpbGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLmRlbGV0ZShcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChJTl9ERUJVR19NT0RFKSBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHJlYWQgZnJvbSBzYXZlczpcIiwgZXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byByZWFkIGZyb20gc2F2ZXMuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLiNjb25maWcub3ZlcnJpZGVTYXZlSWZFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseVJhd1NldHRpbmdzKHNldHRpbmdzISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlID0gY3JlYXRlUmVpZmllZEFjdGl2ZShjb21wb25lbnRzISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmF0dGFjaCgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcyA9IGNyZWF0ZVdpcmluZ3NTZXQod2lyZXMhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5zYXZlICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcbiAgICAgICAgICAgICAgICAgICAgXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLFxuICAgICAgICAgICAgICAgICAgICBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVyLm9ic2VydmUoUmVpZmllZC5yb290LCB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLFxuICAgICAgICAgICAgY2hhcmFjdGVyRGF0YU9sZFZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjaGVjayA9IHRoaXMuI2NvbmZpZy5jaGVja1N0YXRlPy4oUmVpZmllZC5hY3RpdmUuY2xvbmUoKSwgV2lyaW5nTWFuYWdlci53aXJlcy5jbG9uZSgpKSA/PyBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGNoZWNrKSB0aGlzLiNjb25maWcuaWZTdGF0ZUNoZWNrZWQ/LigpO1xuICAgICAgICB9LCB0aGlzLiNjb25maWcuY2hlY2tJbnRlcnZhbCA/PyA1MCkgYXMgbmV2ZXI7XG5cbiAgICAgICAgaWYgKCFTdG9yYWdlTWFuYWdlci5nZXQoXCJ1c2VkaGVscFwiKSlcbiAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQcmVzcyAnPycgZm9yIGhlbHAuXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IExJR0hUX0dSQVlfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZEJhc2VkVXBkYXRlKCkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBmb3JjZVNhdmUoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLnNhdmUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXG4gICAgICAgICAgICAgICAgXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLFxuICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuI29ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNpbnRlcnZhbCk7XG5cbiAgICAgICAgdGhpcy4jaW50ZXJ2YWwgPSAtMTtcblxuICAgICAgICBNb3VzZU1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgS2V5YmluZHNNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5yZXNldCgpO1xuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnJlc2V0KCk7XG5cbiAgICAgICAgQ2FudmFzTWFuYWdlci5zdG9wKCk7XG5cbiAgICAgICAgRGFya21vZGVNYW5hZ2VyLnN0b3AoKTtcbiAgICAgICAgVW5kb1JlZG9NYW5hZ2VyLnN0b3AoKTtcblxuICAgICAgICBNZW51TWFuYWdlci5yZW1vdmUoUmVpZmllZC5yb290KTtcblxuICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmZvckVhY2goKGZpbmlzaCkgPT4gZmluaXNoLmNhbGwodW5kZWZpbmVkKSk7XG5cbiAgICAgICAgdGhpcy53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmNsZWFyKCk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIHRoaXMuI2NvbmZpZyA9IHt9O1xuXG4gICAgICAgIHRoaXMuI2hpc3RvcnkgPSBbXTtcbiAgICAgICAgdGhpcy4jcmVkb3MgPSBbXTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgY2xlYXIoKSB7XG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmRldGFjaCgpKTtcblxuICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHdpcmUuZGVzdHJveSgpKTtcblxuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHB1c2hIaXN0b3J5KGNvbW1hbmQ6ICgpID0+IHZvaWQsIHVuZG86ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jcmVkb3MubGVuZ3RoID0gMDtcblxuICAgICAgICBjb21tYW5kLmNhbGwodW5kZWZpbmVkKTtcblxuICAgICAgICB0aGlzLiNoaXN0b3J5LnB1c2goW2NvbW1hbmQsIHVuZG9dKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcG9wSGlzdG9yeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiNoaXN0b3J5Lmxlbmd0aCkge1xuICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vdGhpbmcgdG8gdW5kby5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbcmVkbywgdW5kb10gPSB0aGlzLiNoaXN0b3J5LnBvcCgpITtcblxuICAgICAgICB0aGlzLiNyZWRvcy5wdXNoKFtyZWRvLCB1bmRvXSk7XG5cbiAgICAgICAgdW5kby5jYWxsKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlZG9IaXN0b3J5KCkge1xuICAgICAgICBpZiAoIXRoaXMuI3JlZG9zLmxlbmd0aCkge1xuICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vdGhpbmcgdG8gcmVkby5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbY29tbWFuZCwgdW5kb10gPSB0aGlzLiNyZWRvcy5wb3AoKSE7XG5cbiAgICAgICAgdGhpcy4jaGlzdG9yeS5wdXNoKFtjb21tYW5kLCB1bmRvXSk7XG5cbiAgICAgICAgY29tbWFuZC5jYWxsKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFwcGx5U2V0dGluZ3Moc2V0dGluZ3M6IFNhbmRib3hDb25maWdbXCJzZXR0aW5nc1wiXSAmIHt9KSB7XG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkID0gc2V0dGluZ3Muc25hcFRvR3JpZCA/PyBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgYXBwbHlSYXdTZXR0aW5ncyhzZXR0aW5nczogU2VyaWFsaXplZERpYWdyYW1bXCJzZXR0aW5nc1wiXSkge1xuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCA9IHNldHRpbmdzW1wiRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRcIl07XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBzYXZlZE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNjb25maWcuc2F2ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgc2F2ZVRvKHNhdmU6IHN0cmluZykge1xuICAgICAgICB0aGlzLiNjb25maWcuc2F2ZSA9IHNhdmU7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuaGFzKFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSkgJiZcbiAgICAgICAgICAgICEoYXdhaXQgTW9kYWxNYW5hZ2VyLmNvbmZpcm0oXG4gICAgICAgICAgICAgICAgXCJUaGVyZSBpcyBhbHJlYWR5IGEgc2F2ZSB3aXRoIHRoaXMgbmFtZS4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlcGxhY2UgaXQ/XCIsXG4gICAgICAgICAgICApKVxuICAgICAgICApXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSwgc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBHRVRfQUNUSVZBVEVEX0NPTE9SLCBJU19NQUNfT1MsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZnJvbUZpbGUsIHNhdmVEaWFncmFtIH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi4vcmVpZmllZC9EaXNwbGF5XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IG92ZXJsYXBwZWRCb3VuZHMsIFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBDYW52YXNNYW5hZ2VyIH0gZnJvbSBcIi4vQ2FudmFzTWFuYWdlclwiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4vVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vV2lyaW5nTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uTWFuYWdlciB7XG4gICAgc3RhdGljIHNlbGVjdGVkID0gbmV3IFdhdGNoZWRTZXQ8UmVpZmllZD4oKTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcblxuICAgICAgICBjb25zdCBlbGVtZW50ID0gW1xuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJidXR0b24uYm9hcmQtaW5wdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1vdXRwdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5jb21wb25lbnRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5kaXNwbGF5XCIpLFxuICAgICAgICBdLmZpbmQoKGVsZW1lbnQpID0+IGVsZW1lbnQgIT09IG51bGwpITtcblxuICAgICAgICBjb25zdCByZWlmaWVkID0gWy4uLlJlaWZpZWQuYWN0aXZlXS5maW5kKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5lbGVtZW50ID09PSBlbGVtZW50KTtcblxuICAgICAgICBpZiAocmVpZmllZCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIChJU19NQUNfT1MgJiYgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJNZXRhTGVmdFwiKSB8fCBLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiTWV0YVJpZ2h0XCIpKSkgfHxcbiAgICAgICAgICAgICAgICAoIUlTX01BQ19PUyAmJiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIkNvbnRyb2xMZWZ0XCIpIHx8IEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJDb250cm9sUmlnaHRcIikpKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0aW9uKHJlaWZpZWQpO1xuICAgICAgICAgICAgZWxzZSBpZiAoIXRoaXMuc2VsZWN0ZWQuaGFzKHJlaWZpZWQpKSB0aGlzLnNlbGVjdChyZWlmaWVkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI2NvcHkgPSBhc3luYyAoZTogQ2xpcGJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQuc2l6ZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBhcnJheSA9IFsuLi50aGlzLnNlbGVjdGVkXTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHNhdmVEaWFncmFtKFxuICAgICAgICAgICAgICAgIGFycmF5LFxuICAgICAgICAgICAgICAgIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICh3aXJpbmcpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5zb21lKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHJldHVybiB3aXJpbmcuZnJvbSA9PT0gY29tcG9uZW50LmVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50IHx8IGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQub3V0cHV0cy5zb21lKChvdXRwdXQpID0+IHdpcmluZy5mcm9tID09PSBvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkuc29tZSgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSByZXR1cm4gd2lyaW5nLnRvID09PSBjb21wb25lbnQuZWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5pbnB1dHMuc29tZSgoaW5wdXQpID0+IHdpcmluZy50byA9PT0gaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNwYXN0ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICByZXN1bHQ6IFssIGNvbXBvbmVudHMsIHdpcmluZ3NdLFxuICAgICAgICB9ID0gZnJvbUZpbGUoYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpKTtcblxuICAgICAgICBpZiAoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byBwYXN0ZSBkaWFncmFtIGRhdGEuXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbW91c2UgPSB7IC4uLk1vdXNlTWFuYWdlci5tb3VzZSB9O1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkQWxsKGNvbXBvbmVudHMhKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnRzIS5ldmVyeSgoY29tcG9uZW50KSA9PiBSZWlmaWVkLmFjdGl2ZS5oYXMoY29tcG9uZW50KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cyEuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGNvbXBvbmVudC51cGRhdGUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoTW91c2VNYW5hZ2VyLm1vdXNlLnggIT09IC0xICYmIE1vdXNlTWFuYWdlci5tb3VzZS55ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IGNvbXBvbmVudHMhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXggPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXkgPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBieCA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBieSA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkID0gTWF0aC5zcXJ0KGF4ICogYXggKyBheSAqIGF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmQgPSBNYXRoLnNxcnQoYnggKiBieCArIGJ5ICogYnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWQgLSBiZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVswXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogbW91c2UueCArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBtb3VzZS55ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbCh3aXJpbmdzISk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMhLmZvckVhY2goKGNvbXBvbmVudCkgPT4gdGhpcy5hZGRTZWxlY3Rpb24oY29tcG9uZW50KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlQWxsKGNvbXBvbmVudHMhKTtcblxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMhLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmRlbGV0ZUFsbCh3aXJpbmdzISk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uZm9yRWFjaCgoY29tcG9uZW50KSA9PiB0aGlzLmFkZFNlbGVjdGlvbihjb21wb25lbnQpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBzZWxlY3QocmVpZmllZDogUmVpZmllZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZC5hZGQocmVpZmllZCk7XG5cbiAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiAoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDBcIikpO1xuXG4gICAgICAgIHJlaWZpZWQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMDBcIjtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc2VsZWN0QWxsSW4oZnJvbTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9LCB0bzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICBjb25zdCByZWlmaWVkID0gWy4uLlJlaWZpZWQuYWN0aXZlXS5maWx0ZXIoKGNvbXBvbmVudCkgPT5cbiAgICAgICAgICAgIG92ZXJsYXBwZWRCb3VuZHMoY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGZyb20sIHRvKSxcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZEFsbChyZWlmaWVkKTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IChjb21wb25lbnQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMFwiKSk7XG5cbiAgICAgICAgcmVpZmllZC5mb3JFYWNoKChjb21wb25lbnQpID0+IChjb21wb25lbnQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMDBcIikpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRTZWxlY3Rpb24ocmVpZmllZDogUmVpZmllZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZChyZWlmaWVkKTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IChjb21wb25lbnQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMFwiKSk7XG5cbiAgICAgICAgcmVpZmllZC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwMFwiO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc1NlbGVjdGVkKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBbLi4udGhpcy5zZWxlY3RlZF0uc29tZSgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHJldHVybiBlbGVtZW50ID09PSBjb21wb25lbnQuZWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dCkgcmV0dXJuIGVsZW1lbnQgPT09IGNvbXBvbmVudC5lbGVtZW50O1xuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50IHx8IGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5zb21lKChpbnB1dCkgPT4gZWxlbWVudCA9PT0gaW5wdXQpIHx8XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vdXRwdXRzLnNvbWUoKG91dHB1dCkgPT4gZWxlbWVudCA9PT0gb3V0cHV0KSB8fFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID09PSBjb21wb25lbnQuZWxlbWVudFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVuZGVyKHsgZmcgfTogeyBmZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0pIHtcbiAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgZmcuc3Ryb2tlU3R5bGUgPSBHRVRfQUNUSVZBVEVEX0NPTE9SKCk7XG5cbiAgICAgICAgICAgIGZnLmxpbmVXaWR0aCA9IDE7XG5cbiAgICAgICAgICAgIGZnLmxpbmVKb2luID0gXCJtaXRlclwiO1xuXG4gICAgICAgICAgICBmZy5zdHJva2VSZWN0KHJlY3QubGVmdCAtIDE1LCByZWN0LnRvcCAtIDE1LCByZWN0LndpZHRoICsgMTUgKyAxNSwgcmVjdC5oZWlnaHQgKyAxNSArIDE1KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgQ2FudmFzTWFuYWdlci5hZGRKb2IodGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIHRoaXMuI2NvcHkpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIiwgdGhpcy4jcGFzdGUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWFmZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29weVwiLCB0aGlzLiNjb3B5KTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIHRoaXMuI3Bhc3RlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTdG9yYWdlTWFuYWdlciB7XG4gICAgc3RhdGljIHJlYWRvbmx5IHByZWZpeCA9IFwia2Vsc255LmdhdGVzaW06XCI7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbiAgICBzdGF0aWMgc2V0PFQ+KGtleTogc3RyaW5nLCB2YWx1ZTogVCk6IFQge1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldDxUPihrZXk6IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSkhKSA/PyB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGhhcyhrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXggKyBrZXkpICE9PSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWxldGUoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMucHJlZml4ICsga2V5KSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMucHJlZml4ICsga2V5KTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBERUxBWSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuL1dpcmluZ01hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI3Rlc3RpbmcgPSBmYWxzZTtcblxuICAgIHN0YXRpYyBhc3luYyB0ZXN0KGNhc2VzOiBbaW5wdXRzOiBib29sZWFuW10sIG91dHB1dHM6IGJvb2xlYW5bXV1bXSwgeyB0aW1lb3V0ID0gMTAwMCB9OiB7IHRpbWVvdXQ/OiBudW1iZXIgfSA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLiN0ZXN0aW5nKSByZXR1cm4gTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiRGlhZ3JhbSBpcyBhbHJlYWR5IHVuZGVyIHRlc3RpbmcuXCIpO1xuXG4gICAgICAgIHRoaXMuI3Rlc3RpbmcgPSB0cnVlO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmxvY2soKTtcbiAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5sb2NrKCk7XG5cbiAgICAgICAgY29uc3QgaW5wdXRzID0gWy4uLlJlaWZpZWQuYWN0aXZlXVxuICAgICAgICAgICAgLmZpbHRlcigoY29tcG9uZW50KTogY29tcG9uZW50IGlzIElucHV0ID0+IGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KVxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCkgLSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApKTtcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZV1cbiAgICAgICAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCk6IGNvbXBvbmVudCBpcyBPdXRwdXQgPT4gY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KVxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCkgLSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApKTtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbEFjdGl2YXRpb25zID0gaW5wdXRzLm1hcCgoaW5wdXQpID0+IGlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcblxuICAgICAgICBsZXQgZmFpbGVkID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChjb25zdCBbZ2l2ZW5JbnB1dHMsIGV4cGVjdGVkT3V0cHV0c10gb2YgY2FzZXMpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dHMubGVuZ3RoICE9PSBnaXZlbklucHV0cy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcIk1pc21hdGNoZWQgaW5wdXQgbGVuZ3Rocy5cIik7XG4gICAgICAgICAgICBpZiAob3V0cHV0cy5sZW5ndGggIT09IGV4cGVjdGVkT3V0cHV0cy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcIk1pc21hdGNoZWQgb3V0cHV0IGxlbmd0aHMuXCIpO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtpbmRleCwgaW5wdXRdIG9mIGlucHV0cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgZ2l2ZW5JbnB1dHNbaW5kZXhdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgREVMQVkodGltZW91dCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlYWxPdXRwdXRzID0gb3V0cHV0cy5tYXAoKG91dHB1dCkgPT4gb3V0cHV0LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcblxuICAgICAgICAgICAgaWYgKCFyZWFsT3V0cHV0cy5ldmVyeSgob3V0LCBpKSA9PiBvdXQgPT09IGV4cGVjdGVkT3V0cHV0c1tpXSkpIHtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgTW9kYWxNYW5hZ2VyLmFsZXJ0KFxuICAgICAgICAgICAgICAgICAgICBgRGlhZ3JhbSBmYWlsZWQgdG8gcGFzcyB0aGUgdGVzdCB3aXRoIGlucHV0cyBcIiR7Z2l2ZW5JbnB1dHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGJvb2xlYW4pID0+ICtib29sZWFuKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCIgXCIpfVwiLmAsXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBERUxBWSgwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZmFpbGVkKSBhd2FpdCBNb2RhbE1hbmFnZXIuYWxlcnQoXCJEaWFncmFtIHBhc3NlZCBhbGwgdGhlIHRlc3RzLlwiKTtcblxuICAgICAgICBvcmlnaW5hbEFjdGl2YXRpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiBpbnB1dHNbaV0uZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHZhbHVlKSk7XG5cbiAgICAgICAgUmVpZmllZC5hY3RpdmUudW5sb2NrKCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMudW5sb2NrKCk7XG5cbiAgICAgICAgdGhpcy4jdGVzdGluZyA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdGVzdGluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3Rlc3Rpbmc7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUb2FzdERhdGEge1xuICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICBjb2xvcjogc3RyaW5nO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBUb2FzdE1hbmFnZXIge1xuICAgIHN0YXRpYyBnZXQgY29udGFpbmVyKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIudG9hc3RzLWNvbnRhaW5lclwiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIHRvYXN0KHsgbWVzc2FnZSwgY29sb3IsIGR1cmF0aW9uIH06IFRvYXN0RGF0YSkge1xuICAgICAgICBjb25zdCB0b2FzdCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9hc3RcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9hc3QtY29sb3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInRvYXN0LW1lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjbG9zZS10b2FzdFwiPuKVszwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdG9hc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIudG9hc3QtY29sb3JcIikhLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuXG4gICAgICAgIHRvYXN0LnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gZHVyYXRpb24gKyBcIm1zXCI7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodG9hc3QpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmFkZChmaW5pc2gpO1xuXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRvYXN0LnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRvYXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNsb3NlLXRvYXN0XCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcik7XG5cbiAgICAgICAgICAgIHRvYXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgaGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IERhcmttb2RlTWFuYWdlciB9IGZyb20gXCIuL0Rhcmttb2RlTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgVW5kb1JlZG9NYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0ICN1bmRvRWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiYnV0dG9uLnVuZG9cIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgI3JlZG9FbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCJidXR0b24ucmVkb1wiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljICN1bmRvTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnBvcEhpc3RvcnkoKTtcbiAgICB9O1xuXG4gICAgc3RhdGljICNyZWRvTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnJlZG9IaXN0b3J5KCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIERhcmttb2RlTWFuYWdlci5vbkNoYW5nZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiN1bmRvRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gXCJub25lXCI7XG4gICAgICAgICAgICB0aGlzLiNyZWRvRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gXCJub25lXCI7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4jdW5kb0VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy4jcmVkb0VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jdW5kb0VsZW1lbnQuaW5uZXJUZXh0ID0gXCJVTkRPXCI7XG4gICAgICAgIHRoaXMuI3JlZG9FbGVtZW50LmlubmVyVGV4dCA9IFwiUkVET1wiO1xuXG4gICAgICAgIHRoaXMuI3VuZG9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiN1bmRvTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLiNyZWRvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jcmVkb0xpc3RlbmVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgdGhpcy4jdW5kb0VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI3VuZG9MaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuI3JlZG9FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNyZWRvTGlzdGVuZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFdhdGNoZWRTZXQgfSBmcm9tIFwiLi4vYXVnbWVudHMvV2F0Y2hlZFNldFwiO1xuaW1wb3J0IHsgR0VUX0FDVElWQVRFRF9DT0xPUiwgR0VUX0dSQVlfQ09MT1IsIExPQ0tFRF9GT1JfVEVTVElORyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IENhbnZhc01hbmFnZXIgfSBmcm9tIFwiLi9DYW52YXNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vVGVzdGluZ01hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIE5ld1dpcmVDb250ZXh0IHtcbiAgICBzdGF0aWMgZnJvbTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMge1xuICAgICAgICBNb3VzZU1hbmFnZXIub25Nb3VzZURvd24oKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChOZXdXaXJlQ29udGV4dC5mcm9tKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0YXJnZXQgfSA9IGU7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJib2FyZC1vdXRwdXRcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCIpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJvbSA9IE5ld1dpcmVDb250ZXh0LmZyb207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGQobmV3IFdpcmluZyhmcm9tLCB0YXJnZXQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB3aXJlIG9mIFdpcmluZ01hbmFnZXIud2lyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IGZyb20gJiYgd2lyZS50byA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2lyaW5nIHtcbiAgICAjZGVzdHJveWVkID0gZmFsc2U7XG4gICAgI29ic2VydmVyO1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZnJvbTogRWxlbWVudCwgcmVhZG9ubHkgdG86IEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIVdpcmluZ01hbmFnZXIud2lyZXMuaGFzKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFbLi4uV2lyaW5nTWFuYWdlci53aXJlc10uc29tZSgod2lyZSkgPT4gd2lyZS50byA9PT0gdGhpcy50bykpIHRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRvLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgZnJvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdvKCk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy4jZGVzdHJveWVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgZ28oKSB7XG4gICAgICAgIHRoaXMuI2Rlc3Ryb3llZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVyLm9ic2VydmUodGhpcy5mcm9tLCB7IGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sIGF0dHJpYnV0ZXM6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGRlc3Ryb3llZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2Rlc3Ryb3llZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXaXJpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgd2lyZXMgPSBuZXcgV2F0Y2hlZFNldDxXaXJpbmc+KCk7XG5cbiAgICBzdGF0aWMgcmVuZGVyKHsgYmcgfTogeyBiZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0pIHtcbiAgICAgICAgdGhpcy53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICBpZiAod2lyZS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aXJlcy5sb2NrZWQpIHdpcmUuZ28oKTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMud2lyZXMuZGVsZXRlKHdpcmUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmcm9tID0gd2lyZS5mcm9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgdG8gPSB3aXJlLnRvLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VzID0gWy4uLnRoaXMud2lyZXNdLmZpbHRlcigodykgPT4gdy50byA9PT0gd2lyZS50byk7XG5cbiAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgICAgICAgICAgICBcImFjdGl2YXRlZFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZXMuc29tZSgodykgPT4gdy5mcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBiZy5zdHJva2VTdHlsZSA9IHdpcmUuZnJvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgPyBHRVRfQUNUSVZBVEVEX0NPTE9SKCkgOiBHRVRfR1JBWV9DT0xPUigpO1xuXG4gICAgICAgICAgICBiZy5saW5lV2lkdGggPSA1O1xuXG4gICAgICAgICAgICBiZy5saW5lSm9pbiA9IFwicm91bmRcIjtcblxuICAgICAgICAgICAgYmcuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBiZy5tb3ZlVG8oZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBiZy5saW5lVG8odG8ueCArIHRvLndpZHRoIC8gMiwgdG8ueSArIHRvLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgYmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBiZy5zdHJva2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKE5ld1dpcmVDb250ZXh0LmZyb20pIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSBOZXdXaXJlQ29udGV4dC5mcm9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBiZy5zdHJva2VTdHlsZSA9IE5ld1dpcmVDb250ZXh0LmZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpXG4gICAgICAgICAgICAgICAgPyBHRVRfQUNUSVZBVEVEX0NPTE9SKClcbiAgICAgICAgICAgICAgICA6IEdFVF9HUkFZX0NPTE9SKCk7XG5cbiAgICAgICAgICAgIGJnLmxpbmVXaWR0aCA9IDU7XG5cbiAgICAgICAgICAgIGJnLmxpbmVKb2luID0gXCJyb3VuZFwiO1xuXG4gICAgICAgICAgICBiZy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGJnLm1vdmVUbyhmcm9tLnggKyBmcm9tLndpZHRoIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIGJnLmxpbmVUbyhNb3VzZU1hbmFnZXIubW91c2UueCwgTW91c2VNYW5hZ2VyLm1vdXNlLnkpO1xuICAgICAgICAgICAgYmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBiZy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgICBDYW52YXNNYW5hZ2VyLmFkZEpvYih0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4uL2NvbnRleHRtZW51L21lbnVcIjtcbmltcG9ydCB7IGtleWJpbmRzIH0gZnJvbSBcIi4uL2tleWJpbmRzL2tleWJpbmRzXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IEFuZEdhdGUsIE9yR2F0ZSwgWG9yR2F0ZSB9IGZyb20gXCIuLi9yZWlmaWVkL2NoaXBzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuXG5leHBvcnQgY29uc3QgZXhhbXBsZTogUmVjb3JkPHN0cmluZywgKGN0eDogeyBuYW1lOiBzdHJpbmcgfSkgPT4gdm9pZD4gPSB7XG4gICAgXCJleGFtcGxlOmhhbGZhZGRlclwiOiAoeyBuYW1lOiBzYXZlIH0pID0+IHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IFtcbiAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IFhvckdhdGUoKSwgeyB4OiAzMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBBbmRHYXRlKCksIHsgeDogMzAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IE91dHB1dCh7IHg6IDUwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBPdXRwdXQoeyB4OiA1MDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgIF0gYXMgY29uc3Q7XG5cbiAgICAgICAgY29uc3QgW2kxLCBpMiwgeG9yLCBhbmQsIG8xLCBvMl0gPSBjb21wb25lbnRzO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHtcbiAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgIHNhdmUsXG4gICAgICAgICAgICBpbml0aWFsOiBbXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5tYXAoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LnBlcm1hbmVudCgpKSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTEuZWxlbWVudCwgeG9yLmlucHV0c1swXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTEuZWxlbWVudCwgYW5kLmlucHV0c1swXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTIuZWxlbWVudCwgeG9yLmlucHV0c1sxXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTIuZWxlbWVudCwgYW5kLmlucHV0c1sxXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoeG9yLm91dHB1dHNbMF0sIG8xLmVsZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGFuZC5vdXRwdXRzWzBdLCBvMi5lbGVtZW50KSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGxpbWl0czoge1xuICAgICAgICAgICAgICAgIGlucHV0czogMixcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiAyLFxuICAgICAgICAgICAgICAgIGNoaXBzVG90YWw6IDIsXG4gICAgICAgICAgICAgICAgd2lyaW5nczogNixcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzVG90YWw6IDYsXG4gICAgICAgICAgICAgICAgY2hpcHM6IHsgQU5EOiAxLCBYT1I6IDEgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgXCJleGFtcGxlOmZ1bGxhZGRlclwiOiAoeyBuYW1lOiBzYXZlIH0pID0+IHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IFtcbiAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMzAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IFhvckdhdGUoKSwgeyB4OiAyNTAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBBbmRHYXRlKCksIHsgeDogMjUwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgQW5kR2F0ZSgpLCB7IHg6IDI1MCwgeTogMzAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IFhvckdhdGUoKSwgeyB4OiA0MDAsIHk6IDE1MCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBPckdhdGUoKSwgeyB4OiA0MDAsIHk6IDI1MCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNTUwLCB5OiAxNTAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IE91dHB1dCh7IHg6IDU1MCwgeTogMjUwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgXSBhcyBjb25zdDtcblxuICAgICAgICBjb25zdCBbaTEsIGkyLCBpMywgeG9yMSwgYW5kMSwgYW5kMiwgeG9yMiwgb3IsIG8xLCBvMl0gPSBjb21wb25lbnRzO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHtcbiAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgIHNhdmUsXG4gICAgICAgICAgICBpbml0aWFsOiBbXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5tYXAoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LnBlcm1hbmVudCgpKSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTEuZWxlbWVudCwgeG9yMS5pbnB1dHNbMF0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkxLmVsZW1lbnQsIGFuZDIuaW5wdXRzWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMi5lbGVtZW50LCB4b3IxLmlucHV0c1sxXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTIuZWxlbWVudCwgYW5kMi5pbnB1dHNbMV0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkzLmVsZW1lbnQsIGFuZDEuaW5wdXRzWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMy5lbGVtZW50LCB4b3IyLmlucHV0c1sxXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoeG9yMS5vdXRwdXRzWzBdLCBhbmQxLmlucHV0c1swXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoeG9yMS5vdXRwdXRzWzBdLCB4b3IyLmlucHV0c1swXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoYW5kMS5vdXRwdXRzWzBdLCBvci5pbnB1dHNbMF0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGFuZDIub3V0cHV0c1swXSwgb3IuaW5wdXRzWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyh4b3IyLm91dHB1dHNbMF0sIG8xLmVsZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKG9yLm91dHB1dHNbMF0sIG8yLmVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbGltaXRzOiB7XG4gICAgICAgICAgICAgICAgaW5wdXRzOiAzLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IDIsXG4gICAgICAgICAgICAgICAgY2hpcHNUb3RhbDogNSxcbiAgICAgICAgICAgICAgICB3aXJpbmdzOiAxMixcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzVG90YWw6IDEwLFxuICAgICAgICAgICAgICAgIGNoaXBzOiB7IEFORDogMiwgWE9SOiAyLCBPUjogMSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSxcbn07XG4iLCJpbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4uL2NvbnRleHRtZW51L21lbnVcIjtcbmltcG9ydCB7IGtleWJpbmRzIH0gZnJvbSBcIi4uL2tleWJpbmRzL2tleWJpbmRzXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgZXhhbXBsZSB9IGZyb20gXCIuL2V4YW1wbGVcIjtcbmltcG9ydCB7IG5hbmQgfSBmcm9tIFwiLi9uYW5kXCI7XG5cbmV4cG9ydCBjb25zdCBwcmVtYWRlID0gbmV3IE1hcDxzdHJpbmcsIChjdHg6IHsgbmFtZTogc3RyaW5nIH0pID0+IHZvaWQ+KFtcbiAgICAuLi5PYmplY3QuZW50cmllcyhleGFtcGxlKSxcbiAgICBbXCJzYW5kYm94XCIsICgpID0+IFNhbmRib3hNYW5hZ2VyLnNldHVwKHsga2V5YmluZHMsIG1lbnUsIHNhdmU6IFwic2FuZGJveFwiIH0pXSxcbiAgICAuLi5PYmplY3QuZW50cmllcyhuYW5kKSxcbl0pO1xuIiwiaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuLi9jb250ZXh0bWVudS9tZW51XCI7XG5pbXBvcnQgeyBrZXliaW5kcyB9IGZyb20gXCIuLi9rZXliaW5kcy9rZXliaW5kc1wiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBOYW5kR2F0ZSB9IGZyb20gXCIuLi9yZWlmaWVkL2NoaXBzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuXG5leHBvcnQgY29uc3QgbmFuZDogUmVjb3JkPHN0cmluZywgKGN0eDogeyBuYW1lOiBzdHJpbmcgfSkgPT4gdm9pZD4gPSB7XG4gICAgXCJuYW5kOm5vdFwiOiAoeyBuYW1lOiBzYXZlIH0pID0+IHtcbiAgICAgICAgbWVudS5zcGxpY2UoMiwgMCwge1xuICAgICAgICAgICAgdGVzdDoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3Qgc29sdXRpb25cIixcbiAgICAgICAgICAgICAgICBhc3luYyBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgVGVzdGluZ01hbmFnZXIudGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW3RydWVdLCBbZmFsc2VdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRpbWVvdXQ6IDUwMCB9LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICBrZXliaW5kcyxcbiAgICAgICAgICAgIG1lbnUsXG4gICAgICAgICAgICBzYXZlLFxuICAgICAgICAgICAgaW5pdGlhbDogW1xuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IE91dHB1dCh7IHg6IDUwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICBdLm1hcCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQucGVybWFuZW50KCkpLFxuICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGxpbWl0czoge1xuICAgICAgICAgICAgICAgIGlucHV0czogMSxcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiAxLFxuICAgICAgICAgICAgICAgIGNoaXBzVG90YWw6IDEsXG4gICAgICAgICAgICAgICAgd2lyaW5nczogMyxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzVG90YWw6IDMsXG4gICAgICAgICAgICAgICAgY2hpcHM6IHsgTkFORDogMSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiUmVjcmVhdGUgYSBOT1QgZ2F0ZSB1c2luZyBvbmx5IGEgTkFORCBnYXRlLlwiKTtcbiAgICB9LFxuICAgIFwibmFuZDphbmRcIjogKHsgbmFtZTogc2F2ZSB9KSA9PiB7XG4gICAgICAgIG1lbnUuc3BsaWNlKDIsIDAsIHtcbiAgICAgICAgICAgIHRlc3Q6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IHNvbHV0aW9uXCIsXG4gICAgICAgICAgICAgICAgYXN5bmMgY2FsbGJhY2soKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFRlc3RpbmdNYW5hZ2VyLnRlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1tmYWxzZSwgZmFsc2VdLCBbZmFsc2VdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW3RydWUsIGZhbHNlXSwgW2ZhbHNlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1tmYWxzZSwgdHJ1ZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZSwgdHJ1ZV0sIFt0cnVlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0aW1lb3V0OiA3NTAgfSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoe1xuICAgICAgICAgICAga2V5YmluZHMsXG4gICAgICAgICAgICBtZW51LFxuICAgICAgICAgICAgc2F2ZSxcbiAgICAgICAgICAgIGluaXRpYWw6IFtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBPdXRwdXQoeyB4OiA1MDAsIHk6IDE1MCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgXS5tYXAoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LnBlcm1hbmVudCgpKSxcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBpbnB1dHM6IDIsXG4gICAgICAgICAgICAgICAgb3V0cHV0czogMSxcbiAgICAgICAgICAgICAgICBjaGlwc1RvdGFsOiAyLFxuICAgICAgICAgICAgICAgIHdpcmluZ3M6IDUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1RvdGFsOiA1LFxuICAgICAgICAgICAgICAgIGNoaXBzOiB7IE5BTkQ6IDIgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE1vZGFsTWFuYWdlci5hbGVydChcIlJlY3JlYXRlIGFuIEFORCBnYXRlIHVzaW5nIG9ubHkgTkFORCBnYXRlcy5cIik7XG4gICAgfSxcbiAgICBcIm5hbmQ6b3JcIjogKHsgbmFtZTogc2F2ZSB9KSA9PiB7XG4gICAgICAgIG1lbnUuc3BsaWNlKDIsIDAsIHtcbiAgICAgICAgICAgIHRlc3Q6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IHNvbHV0aW9uXCIsXG4gICAgICAgICAgICAgICAgYXN5bmMgY2FsbGJhY2soKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFRlc3RpbmdNYW5hZ2VyLnRlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1tmYWxzZSwgZmFsc2VdLCBbZmFsc2VdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW3RydWUsIGZhbHNlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCB0cnVlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW3RydWUsIHRydWVdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGltZW91dDogMTAwMCB9LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICBrZXliaW5kcyxcbiAgICAgICAgICAgIG1lbnUsXG4gICAgICAgICAgICBzYXZlLFxuICAgICAgICAgICAgaW5pdGlhbDogW1xuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMTUwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBPdXRwdXQoeyB4OiA2MDAsIHk6IDE1MCB9KSxcbiAgICAgICAgICAgICAgICBdLm1hcCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQucGVybWFuZW50KCkpLFxuICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGxpbWl0czoge1xuICAgICAgICAgICAgICAgIGlucHV0czogMixcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiAxLFxuICAgICAgICAgICAgICAgIGNoaXBzVG90YWw6IDMsXG4gICAgICAgICAgICAgICAgd2lyaW5nczogNyxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzVG90YWw6IDYsXG4gICAgICAgICAgICAgICAgY2hpcHM6IHsgTkFORDogMyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiUmVjcmVhdGUgYW4gT1IgZ2F0ZSB1c2luZyBvbmx5IE5BTkQgZ2F0ZXMuXCIpO1xuICAgIH0sXG4gICAgXCJuYW5kOnhvclwiOiAoeyBuYW1lOiBzYXZlIH0pID0+IHtcbiAgICAgICAgbWVudS5zcGxpY2UoMiwgMCwge1xuICAgICAgICAgICAgdGVzdDoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3Qgc29sdXRpb25cIixcbiAgICAgICAgICAgICAgICBhc3luYyBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgVGVzdGluZ01hbmFnZXIudGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCBmYWxzZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZSwgZmFsc2VdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbZmFsc2UsIHRydWVdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZSwgdHJ1ZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGltZW91dDogMTI1MCB9LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICBrZXliaW5kcyxcbiAgICAgICAgICAgIG1lbnUsXG4gICAgICAgICAgICBzYXZlLFxuICAgICAgICAgICAgaW5pdGlhbDogW1xuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiA1MDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogNTAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNzAwLCB5OiAxNTAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgIF0ubWFwKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5wZXJtYW5lbnQoKSksXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbGltaXRzOiB7XG4gICAgICAgICAgICAgICAgaW5wdXRzOiAyLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IDEsXG4gICAgICAgICAgICAgICAgY2hpcHNUb3RhbDogNCxcbiAgICAgICAgICAgICAgICB3aXJpbmdzOiA5LFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHNUb3RhbDogOCxcbiAgICAgICAgICAgICAgICBjaGlwczogeyBOQU5EOiA0IH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBNb2RhbE1hbmFnZXIuYWxlcnQoXCJSZWNyZWF0ZSBhIFhPUiBnYXRlIHVzaW5nIG9ubHkgTkFORCBnYXRlcy5cIik7XG4gICAgfSxcbn07XG4iLCJpbXBvcnQgeyBpbnNlcnQgfSBmcm9tIFwiLi4vY29udGV4dG1lbnUvaW5zZXJ0XCI7XG5pbXBvcnQgeyBpbyB9IGZyb20gXCIuLi9jb250ZXh0bWVudS9pb1wiO1xuaW1wb3J0IHsgUXVpY2tQaWNrTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9RdWlja1BpY2tNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjb25zdCBxdWlja3BpY2tDb21wb25lbnRzID0gKGU6IE1vdXNlRXZlbnQpID0+XG4gICAgUXVpY2tQaWNrTWFuYWdlci5hY3RpdmF0ZShlLCBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiBcIkRpc3BsYXlcIixcbiAgICAgICAgICAgIGNhbGxiYWNrKGUpIHtcbiAgICAgICAgICAgICAgICBpbnNlcnRbXCJpbnNlcnQtY29tcG9uZW50XCJdLmNhbGxiYWNrLmNhbGwodW5kZWZpbmVkLCBlLCBcIkRJU1BMQVlcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogXCJPdXRwdXRcIixcbiAgICAgICAgICAgIGNhbGxiYWNrKGUpIHtcbiAgICAgICAgICAgICAgICBpb1tcIm5ldy1vdXRwdXRcIl0uY2FsbGJhY2suY2FsbCh1bmRlZmluZWQsIGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6IFwiSW5wdXRcIixcbiAgICAgICAgICAgIGNhbGxiYWNrKGUpIHtcbiAgICAgICAgICAgICAgICBpb1tcIm5ldy1pbnB1dFwiXS5jYWxsYmFjay5jYWxsKHVuZGVmaW5lZCwgZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIF0pO1xuIiwiaW1wb3J0IHsgT1JJR0lOX1BPSU5UIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgUXVpY2tQaWNrTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9RdWlja1BpY2tNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBnYXRlcyB9IGZyb20gXCIuLi9yZWlmaWVkL2NoaXBzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjb25zdCBxdWlja3BpY2tHYXRlcyA9IChlOiBNb3VzZUV2ZW50KSA9PlxuICAgIFF1aWNrUGlja01hbmFnZXIuYWN0aXZhdGUoXG4gICAgICAgIGUsXG4gICAgICAgIGdhdGVzLm1hcCgoZ2F0ZSkgPT4gKHtcbiAgICAgICAgICAgIGxhYmVsOiBnYXRlLk5BTUUsXG4gICAgICAgICAgICBjYWxsYmFjayhlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudChSZWZsZWN0LmNvbnN0cnVjdChnYXRlLCBbXSksIE9SSUdJTl9QT0lOVCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhjb21wb25lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBnZXRDb21wdXRlZFN0eWxlKGNvbXBvbmVudC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZS5jbGllbnRYIC0gcGFyc2VGbG9hdCh3aWR0aCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBlLmNsaWVudFkgLSBwYXJzZUZsb2F0KGhlaWdodCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3QoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkpLFxuICAgICk7XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBERUxBWSwgSVNfTUFDX09TLCBMT0NLRURfRk9SX1RFU1RJTkcsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBOZXdXaXJlQ29udGV4dCwgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IENoaXAgfSBmcm9tIFwiLi9jaGlwc1wiO1xuaW1wb3J0IHsgY29tcHV0ZVRyYW5zZm9ybU9yaWdpbiwgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudDxJIGV4dGVuZHMgbnVtYmVyLCBPIGV4dGVuZHMgbnVtYmVyPiBleHRlbmRzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IGVsZW1lbnQ7XG5cbiAgICByZWFkb25seSBpbnB1dHM7XG4gICAgcmVhZG9ubHkgb3V0cHV0cztcbiAgICByZWFkb25seSBuYW1lO1xuXG4gICAgcmVhZG9ubHkgI29ic2VydmVycyA9IG5ldyBNYXA8RWxlbWVudCwgTXV0YXRpb25PYnNlcnZlcj4oKTtcbiAgICByZWFkb25seSAjbW91c2V1cHMgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51cyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY2xpY2tzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuXG4gICAgcmVhZG9ubHkgY2hpcDogQ2hpcDxJLCBPPjtcblxuICAgICNhbmdsZSA9IDA7XG5cbiAgICAjY29tcGxlbWVudGFyeSA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGNoaXA6IENoaXA8SSwgTz4sXG4gICAgICAgIHBvczpcbiAgICAgICAgICAgIHwgeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH1cbiAgICAgICAgICAgIHwgKChjb21wOiBDb21wb25lbnQ8SSwgTz4pID0+IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IGNlbnRlcmVkPzogYm9vbGVhbiB9KSxcbiAgICAgICAgY29tcGxlbWVudGFyeSA9IGZhbHNlLFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuY2hpcCA9IGNoaXA7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KHRoaXMuY2hpcC5pbnB1dHMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjb21wb25lbnQtbmFtZVwiPiR7dGhpcy5jaGlwLm5hbWV9PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KGNvbXBsZW1lbnRhcnkgJiYgdGhpcy5jaGlwLm91dHB1dHMgPT09IDEgPyB0aGlzLmNoaXAub3V0cHV0cyArIDEgOiB0aGlzLmNoaXAub3V0cHV0cylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWxsKCc8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LW91dHB1dC1idXR0b25cIj5PPC9idXR0b24+JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXQtYnV0dG9uXCIpKTtcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW91dHB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW5hbWVcIikhO1xuXG4gICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcblxuICAgICAgICB0aGlzLm1vdmUodHlwZW9mIHBvcyA9PT0gXCJmdW5jdGlvblwiID8gcG9zLmNhbGwodW5kZWZpbmVkLCB0aGlzKSA6IHBvcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlKCkge1xuICAgICAgICBjb25zdCBvdXQgPSB0aGlzLmNoaXAuZXZhbHVhdGUodGhpcy5pbnB1dHMubWFwKChpKSA9PiBpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSkpO1xuXG4gICAgICAgIGF3YWl0IERFTEFZKDEwMCArIE1hdGgucmFuZG9tKCkgKiA1MCAtIDI1KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBvdXRbaV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXQgYW5nbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNhbmdsZTtcbiAgICB9XG5cbiAgICBzZXQgYW5nbGUodjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuI2FuZ2xlID0gdiAlIDM2MDtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVooJHt2fWRlZylgO1xuXG4gICAgICAgIGlmICh2ID09PSAxODApIHtcbiAgICAgICAgICAgIHRoaXMubmFtZS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlWigke3Z9ZGVnKWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUuc3R5bGUudHJhbnNmb3JtID0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgZ2V0IGNvbXBsZW1lbnRhcnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNjb21wbGVtZW50YXJ5O1xuICAgIH1cblxuICAgIHNldCBjb21wbGVtZW50YXJ5KHY6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy4jY29tcGxlbWVudGFyeSA9IHY7XG4gICAgfVxuXG4gICAgcm90YXRlKGFuZ2xlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgc3VwZXIuYXR0YWNoKCk7XG5cbiAgICAgICAgdGhpcy4jYXR0YWNoTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCwgdGhpcy5uYW1lKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHN1cGVyLmRldGFjaCgpO1xuXG4gICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZm9yZ2V0KHRoaXMuZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgI3VwZGF0ZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNjbGlja3MuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLnNldChpbnB1dCwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGUuYmluZCh0aGlzKSkpO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQoaW5wdXQsICgpID0+IGlucHV0LmJsdXIoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQoaW5wdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoZnJvbSkgPT4gbmV3IFdpcmluZyhmcm9tLCBpbnB1dCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI21vdXNldXBzLnNldChvdXRwdXQsICgpID0+IG91dHB1dC5ibHVyKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KG91dHB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY3JlYXRlLWNvbm5lY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogXCJRXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOZXdXaXJlQ29udGV4dC5mcm9tID0gb3V0cHV0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IG91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUudG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKCh0bykgPT4gbmV3IFdpcmluZyhvdXRwdXQsIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy4jY2xpY2tzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVFcIikpIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldCh0aGlzLm5hbWUsICgpID0+IHtcbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggWFwiIDogXCJDdHJsIFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUEVSTUFORU5UKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGNvbXBvbmVudCBpcyBwZXJtYW5lbnQgYW5kIGNhbm5vdCBiZSBkZWxldGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRvZ2dsZS1jb21wbGVtZW50YXJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNvbXBsZW1lbnRhcnkgb3V0cHV0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge30sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwicm90YXRlLWNvbXBvbmVudFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJSb3RhdGUgY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBcIlJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZSArPSA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZSAtPSA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICNhdHRhY2hMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlcnMuZ2V0KGlucHV0KSEub2JzZXJ2ZShpbnB1dCwge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwcy5nZXQoaW5wdXQpISk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KGlucHV0KSEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cHMuZ2V0KG91dHB1dCkhKTtcblxuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KG91dHB1dCkhKTtcblxuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNjbGlja3MuZ2V0KG91dHB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5uYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMubmFtZSkhKTtcbiAgICB9XG5cbiAgICAjZGVzdHJveUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmZvckVhY2goKG8pID0+IG8uZGlzY29ubmVjdCgpKTtcblxuICAgICAgICB0aGlzLiNtb3VzZXVwcy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLiNjbGlja3MuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy5uYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMubmFtZSkhKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBERUxBWSwgSVNfTUFDX09TLCBMT0NLRURfRk9SX1RFU1RJTkcsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBOZXdXaXJlQ29udGV4dCwgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGNvbXB1dGVUcmFuc2Zvcm1PcmlnaW4sIGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBEaXNwbGF5IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIHJlYWRvbmx5IGlucHV0cztcbiAgICByZWFkb25seSBvdXRwdXRzO1xuICAgIHJlYWRvbmx5IGRpc3BsYXk7XG5cbiAgICByZWFkb25seSAjb2JzZXJ2ZXJzID0gbmV3IE1hcDxFbGVtZW50LCBNdXRhdGlvbk9ic2VydmVyPigpO1xuICAgIHJlYWRvbmx5ICNtb3VzZXVwcyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY29udGV4dG1lbnVzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuICAgIHJlYWRvbmx5ICNjbGlja3MgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG5cbiAgICAjYml0cztcbiAgICAjcmFkaXg7XG5cbiAgICAjYW5nbGUgPSAwO1xuXG4gICAgY29uc3RydWN0b3IocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCB9LCBiaXRzID0gMSwgcmFkaXggPSAxMCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuI2JpdHMgPSBiaXRzO1xuICAgICAgICB0aGlzLiNyYWRpeCA9IHJhZGl4O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlzcGxheVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkoYml0cykuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dC1idXR0b25cIj5JPC9idXR0b24+Jykuam9pbihcIlwiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImRpc3BsYXktY29udGVudFwiPjA8L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkoYml0cykuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCI+TzwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmlucHV0cyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1pbnB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5kaXNwbGF5LWNvbnRlbnRcIikhO1xuXG4gICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IG91dCA9IHRoaXMuaW5wdXRzLm1hcCgoaSkgPT4gaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpO1xuXG4gICAgICAgIGF3YWl0IERFTEFZKDEwMCArIE1hdGgucmFuZG9tKCkgKiA1MCAtIDI1KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dENvbnRlbnQgPSBvdXRcbiAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIsIGksIG4pID0+IGEgKyArYiAqIDIgKiogKG4ubGVuZ3RoIC0gaSAtIDEpLCAwKVxuICAgICAgICAgICAgLnRvU3RyaW5nKHRoaXMuI3JhZGl4KTtcblxuICAgICAgICBbLi4udGhpcy5vdXRwdXRzXS5yZXZlcnNlKCkuZm9yRWFjaCgob3V0cHV0LCBpKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBvdXRbaV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXQgYml0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2JpdHM7XG4gICAgfVxuXG4gICAgZ2V0IHJhZGl4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jcmFkaXg7XG4gICAgfVxuXG4gICAgZ2V0IGFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYW5nbGU7XG4gICAgfVxuXG4gICAgc2V0IGFuZ2xlKHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLiNhbmdsZSA9IHYgJSAzNjA7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVaKCR7dn1kZWcpYDtcblxuICAgICAgICBpZiAodiA9PT0gMTgwKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVooJHt2fWRlZylgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gY29tcHV0ZVRyYW5zZm9ybU9yaWdpbih0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuICAgIHJvdGF0ZShhbmdsZTogbnVtYmVyKTogdGhpcyB7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuI2F0dGFjaExpc3RlbmVycygpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQsIHRoaXMuZGlzcGxheSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgICN1cGRhdGVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVycy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy4jY2xpY2tzLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5zZXQoaW5wdXQsIG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudXBkYXRlLmJpbmQodGhpcykpKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2V1cHMuc2V0KGlucHV0LCAoKSA9PiBpbnB1dC5ibHVyKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KGlucHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgaW5wdXQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQob3V0cHV0LCAoKSA9PiBvdXRwdXQuYmx1cigpKTtcblxuICAgICAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNyZWF0ZS1jb25uZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDcmVhdGUgY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IG91dHB1dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgodG8pID0+IG5ldyBXaXJpbmcob3V0cHV0LCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NsaWNrcy5zZXQob3V0cHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJLZXlRXCIpKSBOZXdXaXJlQ29udGV4dC5mcm9tID0gb3V0cHV0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQodGhpcy5kaXNwbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJzZXQtYml0c1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTZXQgYml0c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IGF3YWl0IE1vZGFsTWFuYWdlci5wcm9tcHQoXCJFbnRlciB0aGUgbnVtYmVyIG9mIGJpdHM6XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbnB1dCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYml0cyA9ICtpbnB1dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4oYml0cykgfHwgIU51bWJlci5pc0ludGVnZXIoYml0cykgfHwgYml0cyA8IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJOdW1iZXIgb2YgYml0cyBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiNiaXRzID09PSBiaXRzKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuI2JpdHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0cyA9IFsuLi50aGlzLmlucHV0c107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0cyA9IFsuLi50aGlzLm91dHB1dHNdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNiaXRzID0gYml0cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jZGVzdHJveUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLnJlbW92ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvKSA9PiBvLnJlbW92ZSgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc3BsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLkFycmF5KGJpdHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWxsKHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoKSA9PiBodG1sYDxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPmApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNwbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uQXJyYXkoYml0cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbGwodW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCgpID0+IGh0bWxgPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCI+TzwvYnV0dG9uPmApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LWlucHV0c1wiKSE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtb3V0cHV0c1wiKSE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGljLmFwcGVuZENoaWxkKGkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvKSA9PiBvYy5hcHBlbmRDaGlsZChvKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNhdHRhY2hMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jYml0cyA9IHByZXZpb3VzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkucmVtb3ZlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG8pID0+IG8ucmVtb3ZlKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zcGxpY2UoMCwgdGhpcy5pbnB1dHMubGVuZ3RoLCAuLi5pbnB1dHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNwbGljZSgwLCB0aGlzLm91dHB1dHMubGVuZ3RoLCAuLi5vdXRwdXRzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LWlucHV0c1wiKSE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtb3V0cHV0c1wiKSE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGljLmFwcGVuZENoaWxkKGkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvKSA9PiBvYy5hcHBlbmRDaGlsZChvKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNhdHRhY2hMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZXQtcmFkaXhcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU2V0IHJhZGl4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIkVudGVyIHRoZSBudW1iZXIgb2YgYml0czpcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYWRpeCA9ICtpbnB1dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4ocmFkaXgpIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKHJhZGl4KSB8fCByYWRpeCA8IDEgfHwgcmFkaXggPiAxNilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkRpc3BsYXkgcmFkaXggbXVzdCBiZSBhbiBpbnRlZ2VyIGZyb20gMSB0byAxNi5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy4jcmFkaXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3JhZGl4ID0gcmFkaXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNyYWRpeCA9IHByZXZpb3VzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJyb3RhdGUtY29tcG9uZW50XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlJvdGF0ZSBjb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2xlICs9IDkwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2xlIC09IDkwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggWFwiIDogXCJDdHJsIFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUEVSTUFORU5UKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGNvbXBvbmVudCBpcyBwZXJtYW5lbnQgYW5kIGNhbm5vdCBiZSBkZWxldGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgI2F0dGFjaExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5nZXQoaW5wdXQpIS5vYnNlcnZlKGlucHV0LCB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcImNsYXNzXCJdLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXBzLmdldChpbnB1dCkhKTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQoaW5wdXQpISk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwcy5nZXQob3V0cHV0KSEpO1xuXG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQob3V0cHV0KSEpO1xuXG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrcy5nZXQob3V0cHV0KSEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQodGhpcy5kaXNwbGF5KSEpO1xuICAgIH1cblxuICAgICNkZXN0cm95TGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLiNvYnNlcnZlcnMuZm9yRWFjaCgobykgPT4gby5kaXNjb25uZWN0KCkpO1xuXG4gICAgICAgIHRoaXMuI21vdXNldXBzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMuI2NsaWNrcy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQodGhpcy5kaXNwbGF5KSEpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElTX01BQ19PUywgTE9DS0VEX0ZPUl9URVNUSU5HLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCB9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGA8YnV0dG9uIGNsYXNzPVwiYm9hcmQtaW5wdXRcIj5JPC9idXR0b24+YDtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICByZWFkb25seSAjbW91c2V1cCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmJsdXIoKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI21vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnggPSBlLmNsaWVudFgudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQueSA9IGUuY2xpZW50WS50b1N0cmluZygpO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVFcIikpIHJldHVybiAoTmV3V2lyZUNvbnRleHQuZnJvbSA9IHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKE1hdGguaHlwb3QoZS5jbGllbnRYIC0gK3RoaXMuZWxlbWVudC5kYXRhc2V0LnghLCBlLmNsaWVudFkgLSArdGhpcy5lbGVtZW50LmRhdGFzZXQueSEpID4gMikgcmV0dXJuO1xuXG4gICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlID0gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgIWFjdGl2ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGFjdGl2ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY29udGV4dG1lbnUgPSAoKSA9PiB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjcmVhdGUtY29ubmVjdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUVwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlLWlucHV0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGlucHV0XCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIFhcIiA6IFwiQ3RybCBYXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGlucHV0IGlzIHBlcm1hbmVudCBhbmQgY2Fubm90IGJlIGRlbGV0ZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUudG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKCh0bykgPT4gbmV3IFdpcmluZyh0aGlzLmVsZW1lbnQsIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUudG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKCh0bykgPT4gbmV3IFdpcmluZyh0aGlzLmVsZW1lbnQsIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0pO1xuICAgIH07XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNjbGljayk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgc3VwZXIuZGV0YWNoKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElTX01BQ19PUywgTE9DS0VEX0ZPUl9URVNUSU5HLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgcmVhZG9ubHkgI21vdXNldXAgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5ibHVyKCk7XG4gICAgfTtcblxuICAgIHJlYWRvbmx5ICNjb250ZXh0bWVudSA9ICgpID0+IHtcbiAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1vdXRwdXRcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgb3V0cHV0XCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIFhcIiA6IFwiQ3RybCBYXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIG91dHB1dCBpcyBwZXJtYW5lbnQgYW5kIGNhbm5vdCBiZSBkZWxldGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gdGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoZnJvbSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0aGlzLmVsZW1lbnQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgdGhpcy5lbGVtZW50KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0pO1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwb3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IGNlbnRlcmVkPzogYm9vbGVhbiB9ID0geyB4OiAwLCB5OiAwIH0pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBodG1sYDxidXR0b24gY2xhc3M9XCJib2FyZC1vdXRwdXRcIj5PPC9idXR0b24+YDtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5mb3JnZXQodGhpcy5lbGVtZW50LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IFNDVUZGRURfVVVJRCB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWwodGVtcGxhdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IHVua25vd25bXSk6IEhUTUxFbGVtZW50O1xuZXhwb3J0IGZ1bmN0aW9uIGh0bWwoaHRtbDogc3RyaW5nKTogSFRNTEVsZW1lbnQ7XG5leHBvcnQgZnVuY3Rpb24gaHRtbCguLi5hcmdzOiBbc3RyaW5nXSB8IFtUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udW5rbm93bltdXSkge1xuICAgIGNvbnN0IFt0ZW1wbGF0ZSwgLi4udmFsdWVzXSA9IGFyZ3M7XG5cbiAgICBjb25zdCBodG1sID1cbiAgICAgICAgdHlwZW9mIHRlbXBsYXRlID09PSBcInN0cmluZ1wiID8gdGVtcGxhdGUgOiB0ZW1wbGF0ZS5yZWR1Y2UoKGh0bWwsIHMsIGkpID0+IGh0bWwgKyBzICsgKHZhbHVlc1tpXSA/PyBcIlwiKSwgXCJcIik7XG5cbiAgICByZXR1cm4gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKS5ib2R5LmNoaWxkTm9kZXNbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjc3ModGVtcGxhdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IHVua25vd25bXSk6IHN0cmluZztcbmV4cG9ydCBmdW5jdGlvbiBjc3MoY3NzOiBzdHJpbmcpOiBzdHJpbmc7XG5leHBvcnQgZnVuY3Rpb24gY3NzKC4uLmFyZ3M6IFtzdHJpbmddIHwgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi51bmtub3duW11dKSB7XG4gICAgY29uc3QgW3RlbXBsYXRlLCAuLi52YWx1ZXNdID0gYXJncztcblxuICAgIGNvbnN0IGNzcyA9XG4gICAgICAgIHR5cGVvZiB0ZW1wbGF0ZSA9PT0gXCJzdHJpbmdcIiA/IHRlbXBsYXRlIDogdGVtcGxhdGUucmVkdWNlKChjc3MsIHMsIGkpID0+IGNzcyArIHMgKyAodmFsdWVzW2ldID8/IFwiXCIpLCBcIlwiKTtcblxuICAgIHJldHVybiBjc3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCB0cmFuc2Zvcm0gfSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG5cbiAgICBpZiAodHJhbnNmb3JtICYmIHRyYW5zZm9ybSAhPT0gXCJub25lXCIpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdHJhbnNmb3JtLm1hdGNoKC9ebWF0cml4XFwoKC4rKVxcKSQvKT8uWzFdLnNwbGl0KFwiLCBcIik7XG5cbiAgICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2xhdGUgPSBcIlwiO1xuXG4gICAgICAgICAgICBjb25zdCBbYSwgYl0gPSB2YWx1ZXMubWFwKE51bWJlcik7XG5cbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKE1hdGgucm91bmQoTWF0aC5hdGFuMihiLCBhKSAqICgxODAgLyBNYXRoLlBJKSkgKyAzNjApICUgMzYwO1xuXG4gICAgICAgICAgICBpZiAoYW5nbGUgPT09IDAgfHwgYW5nbGUgPT09IDkwKSByZXR1cm4gcGFyc2VGbG9hdChoZWlnaHQpIC8gMiArIFwicHggXCIgKyBwYXJzZUZsb2F0KGhlaWdodCkgLyAyICsgXCJweFwiO1xuXG4gICAgICAgICAgICBpZiAoYW5nbGUgPT09IDE4MCkgcmV0dXJuIFwiY2VudGVyXCI7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNsYXRlID0gXCIwIFwiICsgKHBhcnNlRmxvYXQod2lkdGgpIC0gcGFyc2VGbG9hdChoZWlnaHQpKSArIFwicHhcIjtcblxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoaGVpZ2h0KSAvIDIgKyBcInB4IFwiICsgcGFyc2VGbG9hdChoZWlnaHQpIC8gMiArIFwicHhcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBcImNlbnRlclwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3ZlcmxhcHBlZEJvdW5kcyhyZWN0OiBET01SZWN0LCBmcm9tOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sIHRvOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pIHtcbiAgICBjb25zdCBib3VuZHMgPSB7XG4gICAgICAgIHg6IE1hdGgubWluKGZyb20ueCwgdG8ueCksXG4gICAgICAgIHk6IE1hdGgubWluKGZyb20ueSwgdG8ueSksXG4gICAgICAgIHdpZHRoOiBNYXRoLmFicyhmcm9tLnggLSB0by54KSxcbiAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhmcm9tLnkgLSB0by55KSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgcmVjdC54IDw9IGJvdW5kcy54ICsgYm91bmRzLndpZHRoICYmXG4gICAgICAgIHJlY3QueCArIHJlY3Qud2lkdGggPj0gYm91bmRzLnggJiZcbiAgICAgICAgcmVjdC55IDw9IGJvdW5kcy55ICsgYm91bmRzLmhlaWdodCAmJlxuICAgICAgICByZWN0LnkgKyByZWN0LmhlaWdodCA+PSBib3VuZHMueVxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChlOiBFdmVudCkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IHV1aWQgPSBTQ1VGRkVEX1VVSUQoKTtcblxuICAgIHByb3RlY3RlZCBQRVJNQU5FTlQgPSBmYWxzZTtcblxuICAgIHN0YXRpYyBhY3RpdmUgPSBuZXcgV2F0Y2hlZFNldDxSZWlmaWVkPigpO1xuXG4gICAgc3RhdGljIGdldCByb290KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIucmVpZmllZC1yb290XCIpITtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCByZWFkb25seSBlbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgIG1vdmUoeyB4LCB5LCBjZW50ZXJlZCwgcmVsYXRpdmUgfTogeyB4PzogbnVtYmVyOyB5PzogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW47IHJlbGF0aXZlPzogYm9vbGVhbiB9KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb21wdXRlVHJhbnNmb3JtT3JpZ2luKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHBhcnNlRmxvYXQodGhpcy5lbGVtZW50LnN0eWxlLmxlZnQpICsgKHggPz8gMCkgKyBcInB4XCI7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gcGFyc2VGbG9hdCh0aGlzLmVsZW1lbnQuc3R5bGUudG9wKSArICh5ID8/IDApICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB4ICE9PSBcInVuZGVmaW5lZFwiKSB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHggKyBcInB4XCI7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHkgIT09IFwidW5kZWZpbmVkXCIpIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB5ICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNlbnRlcmVkKVxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRvcCwgbGVmdCwgd2lkdGgsIGhlaWdodCB9ID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChsZWZ0KSAtIHBhcnNlRmxvYXQod2lkdGgpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdCh0b3ApIC0gcGFyc2VGbG9hdChoZWlnaHQpIC8gMixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgUmVpZmllZC5yb290LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGVybWFuZW50KCkge1xuICAgICAgICB0aGlzLlBFUk1BTkVOVCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IHBlcm1hbmVuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlBFUk1BTkVOVDtcbiAgICB9XG5cbiAgICBnZXQgcG9zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcGFyc2VGbG9hdCh0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICB5OiBwYXJzZUZsb2F0KHRoaXMuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsInR5cGUgQm9vbGVhblR1cGxlPEwgZXh0ZW5kcyBudW1iZXIsIFIgZXh0ZW5kcyBib29sZWFuW10gPSBbXT4gPSBudW1iZXIgZXh0ZW5kcyBMXG4gICAgPyBib29sZWFuW11cbiAgICA6IFJbXCJsZW5ndGhcIl0gZXh0ZW5kcyBMXG4gICAgPyBSXG4gICAgOiBCb29sZWFuVHVwbGU8TCwgWy4uLlIsIGJvb2xlYW5dPjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENoaXA8SSBleHRlbmRzIG51bWJlciwgTyBleHRlbmRzIG51bWJlcj4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FOiBzdHJpbmc7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUzogbnVtYmVyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTOiBudW1iZXI7XG5cbiAgICByZWFkb25seSBuYW1lO1xuXG4gICAgcmVhZG9ubHkgaW5wdXRzO1xuICAgIHJlYWRvbmx5IG91dHB1dHM7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGlucHV0czogSSwgb3V0cHV0czogTykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmlucHV0cyA9IGlucHV0cztcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gb3V0cHV0cztcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBvdXRwdXQoaW5wdXRzOiBCb29sZWFuVHVwbGU8ST4pOiBCb29sZWFuVHVwbGU8Tz47XG5cbiAgICBldmFsdWF0ZShpbnB1dHM6IGJvb2xlYW5bXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vdXRwdXQoaW5wdXRzIGFzIEJvb2xlYW5UdXBsZTxJLCBbXT4pIGFzIGJvb2xlYW5bXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBbmRHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkFORFwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkFORFwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gW2EgJiYgYl07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgT3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk9SXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFthIHx8IGJdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vdEdhdGUgZXh0ZW5kcyBDaGlwPDEsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiTk9UXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDE7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiTk9UXCIsIDEsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbbl06IFtib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbIW5dO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5hbmRHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk5BTkRcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJOQU5EXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbIShhICYmIGIpXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk5PUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk5PUlwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyEoYSB8fCBiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgWG9yR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJYT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJYT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshISgrYSBeICtiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgWG5vckdhdGUgZXh0ZW5kcyBDaGlwPDIsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiWE5PUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlhOT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshKCthIF4gK2IpXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCdWZmZXJHYXRlIGV4dGVuZHMgQ2hpcDwxLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkJVRlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAxO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkJVRkZFUlwiLCAxLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW25dOiBbYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gW25dO1xuICAgIH1cbn1cblxudHlwZSBTdGF0aWNNZW1iZXJzPFQ+ID0geyBbSyBpbiBrZXlvZiBUXTogVFtLXSB9O1xudHlwZSBFeHRlbmRlZENoaXA8SSBleHRlbmRzIG51bWJlciA9IG51bWJlciwgTyBleHRlbmRzIG51bWJlciA9IG51bWJlcj4gPSBTdGF0aWNNZW1iZXJzPHR5cGVvZiBDaGlwPEksIE8+PiAmIHtcbiAgICBuZXcgKCk6IENoaXA8SSwgTz47XG59O1xuXG5leHBvcnQgY29uc3QgZ2F0ZXMgPSBbQW5kR2F0ZSwgT3JHYXRlLCBOb3RHYXRlLCBOYW5kR2F0ZSwgTm9yR2F0ZSwgWG9yR2F0ZSwgWG5vckdhdGUsIEJ1ZmZlckdhdGVdIGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgY2hpcHMgPSBuZXcgTWFwPHN0cmluZywgRXh0ZW5kZWRDaGlwPihnYXRlcy5tYXAoKGdhdGUpID0+IFtnYXRlLk5BTUUsIGdhdGVdKSk7XG5cbmNoaXBzLnNldChcIkJVRkZcIiwgQnVmZmVyR2F0ZSk7XG5jaGlwcy5zZXQoXCJCVUZGRVJcIiwgQnVmZmVyR2F0ZSk7XG5cbmV4cG9ydCBjbGFzcyBIYWxmQWRkZXJHYXRlIGV4dGVuZHMgQ2hpcDwyLCAyPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkhBTEZBRERFUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkhBRERcIiwgMiwgMik7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW4sIGJvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshISgrYSBeICtiKSwgYSAmJiBiXTtcbiAgICB9XG59XG5cbmNoaXBzLnNldChIYWxmQWRkZXJHYXRlLk5BTUUsIEhhbGZBZGRlckdhdGUpO1xuY2hpcHMuc2V0KFwiSEFERFwiLCBIYWxmQWRkZXJHYXRlKTtcblxuZXhwb3J0IGNsYXNzIEZ1bGxBZGRlckdhdGUgZXh0ZW5kcyBDaGlwPDMsIDI+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiRlVMTEFEREVSXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDM7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiRkFERFwiLCAzLCAyKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGIsIGNdOiBbYm9vbGVhbiwgYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbiwgYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyEhKCshISgrYSBeICtiKSBeICtjKSwgKCEhKCthIF4gK2IpICYmIGMpIHx8IChhICYmIGIpXTtcbiAgICB9XG59XG5cbmNoaXBzLnNldChGdWxsQWRkZXJHYXRlLk5BTUUsIEZ1bGxBZGRlckdhdGUpO1xuY2hpcHMuc2V0KFwiRkFERFwiLCBGdWxsQWRkZXJHYXRlKTtcbiIsImV4cG9ydCBjb25zdCBhdHRhY2hTdHlsZXMgPSBhc3luYyAoc3R5bGVzOiBzdHJpbmdbXSkgPT4ge1xuICAgIGNvbnN0IGNzcyA9IGF3YWl0IFByb21pc2UuYWxsKHN0eWxlcy5tYXAoKG5hbWUpID0+IGltcG9ydChgLi8ke25hbWV9LnRzYCkpKS50aGVuKChjc3MpID0+XG4gICAgICAgIGNzcy5tYXAoKF8pID0+IF8uZGVmYXVsdCkuam9pbihcIlwiKSxcbiAgICApO1xuXG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cbiAgICBzdHlsZS50ZXh0Q29udGVudCA9IGNzcztcblxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgc3R5bGUuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gcmVzb2x2ZSgpLCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgICAgICAgc3R5bGUuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHJlamVjdCgpLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfSk7XG59O1xuIiwiaW1wb3J0IHtcbiAgICBFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1IsXG4gICAgS0lOREFfTElHSFRfR1JBWV9DU1NfQ09MT1IsXG4gICAgTElHSFRFUl9HUkFZX0NTU19DT0xPUixcbiAgICBTVVBFUl9HUkFZX0NTU19DT0xPUixcbn0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgYnV0dG9uLmRhcmttb2RlIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgICAgIGxlZnQ6IDE2cHg7XG4gICAgICAgIGJvdHRvbTogMTZweDtcblxuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuXG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcblxuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcblxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1J9O1xuXG4gICAgICAgIHRyYW5zaXRpb246IDAuMXMgZWFzZSBiYWNrZ3JvdW5kLWNvbG9yO1xuICAgIH1cblxuICAgIGJ1dHRvbi5kYXJrbW9kZTpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7TElHSFRFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYnV0dG9uLnVuZG8ge1xuICAgICAgICBsZWZ0OiA2NHB4O1xuICAgIH1cblxuICAgIGJ1dHRvbi5yZWRvIHtcbiAgICAgICAgbGVmdDogMTIycHg7XG4gICAgfVxuXG4gICAgYnV0dG9uLnVuZG8sXG4gICAgYnV0dG9uLnJlZG8ge1xuICAgICAgICBjb2xvcjogJHtLSU5EQV9MSUdIVF9HUkFZX0NTU19DT0xPUn07XG5cbiAgICAgICAgYm90dG9tOiAyNHB4O1xuXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICBmb250LXNpemU6IDE2cHg7XG5cbiAgICAgICAgYm9yZGVyOiBub25lO1xuXG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgICAgICB0cmFuc2l0aW9uOiAwLjFzIGVhc2UgY29sb3I7XG4gICAgfVxuXG4gICAgYnV0dG9uLnVuZG86aG92ZXIsXG4gICAgYnV0dG9uLnJlZG86aG92ZXIge1xuICAgICAgICBjb2xvcjogJHtTVVBFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuYDtcbiIsImltcG9ydCB7IGNzcyB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuICAgIGJvZHkge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIH1cblxuICAgIHRydXRoLXRhYmxlIHtcbiAgICAgICAgZmxleDogMTtcblxuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICBtYXgtd2lkdGg6IDEwMCU7XG5cbiAgICAgICAgbWF4LWhlaWdodDogNTAwcHg7XG4gICAgfVxuXG4gICAgZGl2LnRydXRoLXRhYmxlIHtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG5cbiAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuXG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICB9XG5cbiAgICBkaXYudHJ1dGgtdGFibGUgcHJlIHtcbiAgICAgICAgZmxleDogMTtcbiAgICB9XG5cbiAgICBkaXYudHJ1dGgtdGFibGUgLmlucHV0LWhpZ2hsaWdodCxcbiAgICBkaXYudHJ1dGgtdGFibGUgLnRhYmxlLWlucHV0IHtcbiAgICAgICAgLW1zLW92ZXJmbG93LXN0eWxlOiBub25lO1xuICAgICAgICBzY3JvbGxiYXItd2lkdGg6IG5vbmU7XG5cbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGxlZnQ6IDA7XG5cbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBmb250LWZhbWlseTogRmlyYSBDb2RlLCBtb25vc3BhY2U7XG5cbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG5cbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDA7XG5cbiAgICAgICAgd29yZC1zcGFjaW5nOiAwO1xuICAgICAgICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XG4gICAgICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcblxuICAgICAgICBvdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xuICAgICAgICB0ZXh0LW92ZXJmbG93OiBjbGlwO1xuXG4gICAgICAgIG92ZXJmbG93OiBzY3JvbGw7XG4gICAgICAgIG92ZXJzY3JvbGwtYmVoYXZpb3I6IG5vbmU7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBwcmU7XG5cbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuXG4gICAgICAgIHBhZGRpbmc6IDAuNXJlbTtcblxuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuXG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuXG4gICAgICAgIG1heC1oZWlnaHQ6IGNhbGMoMTAwJSAtIDUycHgpO1xuICAgIH1cblxuICAgIGRpdi50cnV0aC10YWJsZSAuaW5wdXQtaGlnaGxpZ2h0IHtcbiAgICAgICAgei1pbmRleDogMDtcbiAgICB9XG5cbiAgICBkaXYudHJ1dGgtdGFibGUgLnRhYmxlLWlucHV0IHtcbiAgICAgICAgei1pbmRleDogMTtcblxuICAgICAgICBjb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNhcmV0LWNvbG9yOiBibGFjaztcbiAgICB9XG5cbiAgICBkaXYudHJ1dGgtdGFibGUgLmlucHV0LWhpZ2hsaWdodDo6LXdlYmtpdC1zY3JvbGxiYXIsXG4gICAgZGl2LnRydXRoLXRhYmxlIC50YWJsZS1pbnB1dDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cblxuICAgIGRpdi50cnV0aC10YWJsZSAuaW5wdXQtaGlnaGxpZ2h0Ojotd2Via2l0LXNjcm9sbGJhci10aHVtYixcbiAgICBkaXYudHJ1dGgtdGFibGUgLnRhYmxlLWlucHV0Ojotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIH1cblxuICAgIGRpdi50cnV0aC10YWJsZSA+IGRpdi5idXR0b25zIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICBtaW4taGVpZ2h0OiA1MnB4O1xuICAgIH1cblxuICAgIGRpdi50cnV0aC10YWJsZSA+IGRpdi5idXR0b25zID4gYnV0dG9uIHtcbiAgICAgICAgZmxleDogMTtcblxuICAgICAgICBwYWRkaW5nOiAxcmVtIDAuNXJlbTtcblxuICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICBwbGFjZS1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIH1cblxuICAgIGRpdi50cnV0aC10YWJsZSA+IGRpdi5idXR0b25zID4gYnV0dG9uOmhvdmVyIHtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cblxuICAgIGNhZC1vdXRwdXQge1xuICAgICAgICBmbGV4OiAxO1xuICAgIH1cblxuICAgIGNhZC1vdXRwdXQgZGl2LmNhZC1vdXRwdXQge1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG5cbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBmb250LWZhbWlseTogRmlyYSBDb2RlLCBtb25vc3BhY2U7XG5cbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG5cbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDA7XG5cbiAgICAgICAgd29yZC1zcGFjaW5nOiAwO1xuICAgICAgICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XG4gICAgICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcblxuICAgICAgICBvdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xuICAgICAgICB0ZXh0LW92ZXJmbG93OiBjbGlwO1xuXG4gICAgICAgIG92ZXJmbG93OiBzY3JvbGw7XG4gICAgICAgIG92ZXJzY3JvbGwtYmVoYXZpb3I6IG5vbmU7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBwcmU7XG5cbiAgICAgICAgcGFkZGluZzogMC41cmVtO1xuICAgIH1cblxuICAgIEBtZWRpYSAobWluLXdpZHRoOiA5ODRweCkge1xuICAgICAgICBib2R5IHtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIH1cblxuICAgICAgICB0cnV0aC10YWJsZSB7XG4gICAgICAgICAgICBtYXgtaGVpZ2h0OiB1bnNldDtcblxuICAgICAgICAgICAgbWF4LXdpZHRoOiA1MHZ3O1xuICAgICAgICB9XG5cbiAgICAgICAgY2FkLW91dHB1dCB7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDUwdnc7XG4gICAgICAgIH1cblxuICAgICAgICBkaXYuY2FkLW91dHB1dCB7XG4gICAgICAgICAgICBib3JkZXItbGVmdDogMXB4IHNvbGlkIGJsYWNrO1xuXG4gICAgICAgICAgICBtYXgtd2lkdGg6IDUwdnc7XG4gICAgICAgIH1cbiAgICB9XG5gO1xuIiwiaW1wb3J0IHsgTElHSFRfR1JBWV9DU1NfQ09MT1IsIFNVUEVSX0dSQVlfQ1NTX0NPTE9SIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgLmRpc3BsYXksXG4gICAgLmNvbXBvbmVudCB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICB6LWluZGV4OiAxMDtcblxuICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICBwbGFjZS1pdGVtczogY2VudGVyO1xuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDZweCBhdXRvIDZweDtcblxuICAgICAgICBoZWlnaHQ6IGZpdC1jb250ZW50O1xuICAgICAgICB3aWR0aDogZml0LWNvbnRlbnQ7XG5cbiAgICAgICAgbWluLWhlaWdodDogNDBweDtcbiAgICAgICAgbWluLXdpZHRoOiAxMDBweDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAke0xJR0hUX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIH1cblxuICAgIC5kaXNwbGF5OmhvdmVyLFxuICAgIC5jb21wb25lbnQ6aG92ZXIge1xuICAgICAgICBjdXJzb3I6IGdyYWI7XG4gICAgfVxuXG4gICAgLmNvbXBvbmVudC1pbnB1dHMsXG4gICAgLmNvbXBvbmVudC1vdXRwdXRzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG5cbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuXG4gICAgICAgIGdhcDogNHB4O1xuICAgIH1cblxuICAgIC5jb21wb25lbnQtaW5wdXQtYnV0dG9uLFxuICAgIC5jb21wb25lbnQtb3V0cHV0LWJ1dHRvbiB7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgZm9udC1mYW1pbHk6IHNlcmlmO1xuICAgICAgICBmb250LXdlaWdodDogOTAwO1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG5cbiAgICAgICAgY29sb3I6ICR7U1VQRVJfR1JBWV9DU1NfQ09MT1J9O1xuXG4gICAgICAgIGhlaWdodDogMTZweDtcbiAgICAgICAgd2lkdGg6IDE2cHg7XG5cbiAgICAgICAgcGFkZGluZzogMDtcblxuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAke0xJR0hUX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICAuY29tcG9uZW50LWlucHV0LWJ1dHRvbiB7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAtNnB4O1xuXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICB9XG5cbiAgICAuY29tcG9uZW50LW91dHB1dC1idXR0b24ge1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IC02cHg7XG5cbiAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xuICAgIH1cblxuICAgIC5jb21wb25lbnQtaW5wdXQtYnV0dG9uLmFjdGl2YXRlZCxcbiAgICAuY29tcG9uZW50LW91dHB1dC1idXR0b24uYWN0aXZhdGVkIHtcbiAgICAgICAgY29sb3I6ICNmZjc3Nzc7XG4gICAgfVxuXG4gICAgLmRpc3BsYXktY29udGVudCxcbiAgICAuY29tcG9uZW50LW5hbWUge1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuXG4gICAgICAgIHBhZGRpbmc6IDAgOHB4O1xuXG4gICAgICAgIGNvbG9yOiAjMzMzMzMzO1xuXG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIH1cbmA7XG4iLCJpbXBvcnQgeyBMSUdIVF9HUkFZX0NTU19DT0xPUiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGNzcyB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuICAgIC5jb250ZXh0bWVudSB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICB6LWluZGV4OiAxMDA7XG5cbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgICAgICB3aWR0aDogMjAwcHg7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJHtMSUdIVF9HUkFZX0NTU19DT0xPUn07XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVmZWZlO1xuXG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuXG4gICAgICAgIGJveC1zaGFkb3c6IDFweCAxcHggNHB4ICR7TElHSFRfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIC5jb250ZXh0bWVudSA+IC5iciB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAke0xJR0hUX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICAuY29udGV4dG1lbnUgPiBidXR0b24ge1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuXG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuXG4gICAgICAgIGJvcmRlcjogbm9uZTtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICAgICAgcGFkZGluZzogOHB4IDhweDtcblxuICAgICAgICBjb2xvcjogIzk5OTk5OTtcbiAgICB9XG5cbiAgICAuY29udGV4dG1lbnUgPiBidXR0b246aG92ZXIge1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgY29sb3I6ICMzMzMzMzM7XG5cbiAgICAgICAgYmFja2dyb3VuZDogI2YwZjBmMDtcbiAgICB9XG5cbiAgICAubWVudS1rZXliaW5kIHtcbiAgICAgICAgY29sb3I6ICNkZGRkZGQ7XG5cbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICBnYXA6IDJweDtcbiAgICB9XG5cbiAgICAubWVudS1rZXliaW5kID4gc3BhbiB7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG5cbiAgICAgICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcblxuICAgICAgICBtaW4taGVpZ2h0OiAyMHB4O1xuICAgICAgICBtaW4td2lkdGg6IDE0cHg7XG4gICAgfVxuXG4gICAgLmNvbnRleHRtZW51ID4gYnV0dG9uOmhvdmVyID4gLm1lbnUta2V5YmluZCB7XG4gICAgICAgIGNvbG9yOiAjYmJiYmJiO1xuICAgIH1cbmA7XG4iLCJpbXBvcnQge1xuICAgIERBUktFUl9HUkFZX0NTU19DT0xPUixcbiAgICBEQVJLX0FDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgREFSS19HUkFZX0NTU19DT0xPUixcbiAgICBFVkVOX0RBUktFUl9HUkFZX0NTU19DT0xPUixcbiAgICBLSU5EQV9EQVJLX0dSQVlfQ1NTX0NPTE9SLFxuICAgIEtJTkRBX0xJR0hUX0dSQVlfQ1NTX0NPTE9SLFxuICAgIExJR0hURVJfR1JBWV9DU1NfQ09MT1IsXG4gICAgTElHSFRfR1JBWV9DU1NfQ09MT1IsXG4gICAgTk9UX1JFQUxMWV9EQVJLX0dSQVlfQ1NTX0NPTE9SLFxuICAgIE9OTFlfQV9ISU5UX09GX0RBUktfR1JBWV9DU1NfQ09MT1IsXG4gICAgU0xJR0hUTFlfREFSS0VSX0dSQVlfQ1NTX0NPTE9SLFxufSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBjc3MgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNzc2BcbiAgICBib2R5LmRhcmttb2RlIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAxMDEwMjtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIGJ1dHRvbi5kYXJrbW9kZSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7REFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIGJ1dHRvbi5kYXJrbW9kZTpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7REFSS19HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSBidXR0b24udW5kbyxcbiAgICBib2R5LmRhcmttb2RlIGJ1dHRvbi5yZWRvIHtcbiAgICAgICAgY29sb3I6ICR7Tk9UX1JFQUxMWV9EQVJLX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIGJ1dHRvbi51bmRvOmhvdmVyLFxuICAgIGJvZHkuZGFya21vZGUgYnV0dG9uLnJlZG86aG92ZXIge1xuICAgICAgICBjb2xvcjogJHtPTkxZX0FfSElOVF9PRl9EQVJLX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5ib2FyZC1pbnB1dCxcbiAgICBib2R5LmRhcmttb2RlIC5ib2FyZC1vdXRwdXQge1xuICAgICAgICBjb2xvcjogJHtMSUdIVEVSX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAke05PVF9SRUFMTFlfREFSS19HUkFZX0NTU19DT0xPUn07XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtLSU5EQV9EQVJLX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5hY3RpdmF0ZWQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke0RBUktfQUNUSVZBVEVEX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAuY29tcG9uZW50LWlucHV0LWJ1dHRvbi5hY3RpdmF0ZWQsXG4gICAgYm9keS5kYXJrbW9kZSAuY29tcG9uZW50LW91dHB1dC1idXR0b24uYWN0aXZhdGVkIHtcbiAgICAgICAgY29sb3I6ICNmZjk5OTk7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtEQVJLX0FDVElWQVRFRF9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgLmNvbXBvbmVudC1pbnB1dC1idXR0b24sXG4gICAgYm9keS5kYXJrbW9kZSAuY29tcG9uZW50LW91dHB1dC1idXR0b24ge1xuICAgICAgICBjb2xvcjogJHtOT1RfUkVBTExZX0RBUktfR1JBWV9DU1NfQ09MT1J9O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICR7REFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke1NMSUdIVExZX0RBUktFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAuZGlzcGxheSxcbiAgICBib2R5LmRhcmttb2RlIC5jb21wb25lbnQge1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAke0VWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke1NMSUdIVExZX0RBUktFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAuZGlzcGxheS1jb250ZW50LFxuICAgIGJvZHkuZGFya21vZGUgLmNvbXBvbmVudC1uYW1lIHtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDEwMDtcblxuICAgICAgICBjb2xvcjogJHtLSU5EQV9MSUdIVF9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAuY29udGV4dG1lbnUge1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAke0RBUktFUl9HUkFZX0NTU19DT0xPUn07XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtFVkVOX0RBUktFUl9HUkFZX0NTU19DT0xPUn07XG5cbiAgICAgICAgYm94LXNoYWRvdzogMXB4IDFweCA0cHggJHtFVkVOX0RBUktFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAuY29udGV4dG1lbnUgPiAuYnIge1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHtEQVJLRVJfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgLmNvbnRleHRtZW51ID4gYnV0dG9uIHtcbiAgICAgICAgY29sb3I6ICR7T05MWV9BX0hJTlRfT0ZfREFSS19HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAuY29udGV4dG1lbnUgPiBidXR0b246aG92ZXIge1xuICAgICAgICBjb2xvcjogJHtMSUdIVF9HUkFZX0NTU19DT0xPUn07XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtEQVJLRVJfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgLm1lbnUta2V5YmluZCB7XG4gICAgICAgIGNvbG9yOiAke0RBUktFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAuY29udGV4dG1lbnUgPiBidXR0b246aG92ZXIgPiAubWVudS1rZXliaW5kIHtcbiAgICAgICAgY29sb3I6ICR7T05MWV9BX0hJTlRfT0ZfREFSS19HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAudG9hc3Qge1xuICAgICAgICBjb2xvcjogJHtMSUdIVF9HUkFZX0NTU19DT0xPUn07XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJHtEQVJLRVJfR1JBWV9DU1NfQ09MT1J9O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7U0xJR0hUTFlfREFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgICAgICBib3gtc2hhZG93OiAxcHggMXB4IDRweCAke0VWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5jbG9zZS10b2FzdCB7XG4gICAgICAgIGNvbG9yOiAke0tJTkRBX0xJR0hUX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5xdWlja3BpY2staXRlbSB7XG4gICAgICAgIGNvbG9yOiAke0tJTkRBX0xJR0hUX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5gO1xuIiwiaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgRVZFTl9MSUdIVEVSX0dSQVlfQ1NTX0NPTE9SLCBMSUdIVF9HUkFZX0NTU19DT0xPUiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGNzcyB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuICAgIC5ib2FyZC1pbnB1dCxcbiAgICAuYm9hcmQtb3V0cHV0IHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgICAgIHotaW5kZXg6IDIwO1xuXG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgY29sb3I6ICMzMzMzMzM7XG5cbiAgICAgICAgZm9udC1mYW1pbHk6IHNlcmlmO1xuICAgICAgICBmb250LXdlaWdodDogOTAwO1xuICAgICAgICBmb250LXNpemU6IDE2cHg7XG5cbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICB3aWR0aDogMjRweDtcblxuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgICAgICBwYWRkaW5nOiAwO1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICR7TElHSFRfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIC5ib2FyZC1pbnB1dCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICB9XG5cbiAgICAuYm9hcmQtb3V0cHV0IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIH1cblxuICAgIC5ib2FyZC1pbnB1dDpob3ZlciB7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB9XG5cbiAgICAuYm9hcmQtb3V0cHV0OmhvdmVyIHtcbiAgICAgICAgY3Vyc29yOiBncmFiO1xuICAgIH1cblxuICAgIC5hY3RpdmF0ZWQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke0FDVElWQVRFRF9DU1NfQ09MT1J9O1xuXG4gICAgICAgIGNvbG9yOiAke0VWRU5fTElHSFRFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuYDtcbiIsImltcG9ydCB7IExJR0hUX0dSQVlfQ1NTX0NPTE9SIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgLm1vZGFsLWNvbnRhaW5lciB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGxlZnQ6IDA7XG4gICAgICAgIGJvdHRvbTogMDtcbiAgICAgICAgcmlnaHQ6IDA7XG5cbiAgICAgICAgei1pbmRleDogMTAwMDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwYWE7XG4gICAgfVxuXG4gICAgLm1vZGFsLWNvbnRhaW5lci5tb2RhbC1pbmFjdGl2ZSxcbiAgICAubW9kYWwubW9kYWwtaW5hY3RpdmUge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cblxuICAgIC5tb2RhbCB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZShjYWxjKDUwdncgLSA1MCUpLCBjYWxjKDUwdmggLSA1MCUpKTtcbiAgICB9XG5cbiAgICAubW9kYWwtY29uZmlybSxcbiAgICAubW9kYWwtYWxlcnQge1xuICAgICAgICBtaW4td2lkdGg6IDQwMHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA4MHB4O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlZmVmZWY7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJHtMSUdIVF9HUkFZX0NTU19DT0xPUn07XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcblxuICAgICAgICBwYWRkaW5nOiA4cHggMTBweDtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgICAgIGJveC1zaGFkb3c6IDFweCAxcHggNHB4ICMzMzMzMzM7XG4gICAgfVxuXG4gICAgLm1vZGFsLWNvbmZpcm0gPiAuYnV0dG9uLWNvbnRhaW5lcixcbiAgICAubW9kYWwtYWxlcnQgPiAuYnV0dG9uLWNvbnRhaW5lciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuXG4gICAgICAgIGdhcDogNnB4O1xuICAgIH1cblxuICAgIC5tb2RhbC1tZXNzYWdlIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG5cbiAgICAgICAgZmxleDogMTtcbiAgICB9XG5cbiAgICAubW9kYWwtY2FuY2VsLFxuICAgIC5tb2RhbC1vayB7XG4gICAgICAgIG1pbi13aWR0aDogNTBweDtcblxuICAgICAgICBwYWRkaW5nOiA0cHggOHB4O1xuXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcblxuICAgICAgICBib3JkZXI6IDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcblxuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgICAgICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcbiAgICB9XG5cbiAgICAubW9kYWwtY2FuY2VsIHtcbiAgICAgICAgb3V0bGluZTogMXB4IHNvbGlkICMzMzMzMzM7XG4gICAgfVxuXG4gICAgLm1vZGFsLW9rIHtcbiAgICAgICAgY29sb3I6IHdoaXRlO1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDc3ZmY7XG5cbiAgICAgICAgb3V0bGluZTogMXB4IHNvbGlkICMwMDc3ZmY7XG4gICAgfVxuXG4gICAgLm1vZGFsLWNhbmNlbDpob3ZlciB7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWFlYWVhO1xuICAgIH1cblxuICAgIC5tb2RhbC1vazpob3ZlciB7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA2NmVlO1xuXG4gICAgICAgIG91dGxpbmU6IDFweCBzb2xpZCAjMDA2NmVlO1xuICAgIH1cblxuICAgIC5tb2RhbC1pbnB1dCB7XG4gICAgICAgIG1hcmdpbjogOHB4IDA7XG5cbiAgICAgICAgcGFkZGluZzogMnB4IDRweDtcblxuICAgICAgICBmb250LXNpemU6IDEycHg7XG5cbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJHtMSUdIVF9HUkFZX0NTU19DT0xPUn07XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICB9XG5cbiAgICAubW9kYWwtcG9wdXAge1xuICAgICAgICB3aWR0aDogNjAwcHg7XG4gICAgICAgIG1heC13aWR0aDogNjAwcHg7XG4gICAgfVxuXG4gICAgLm1vZGFsLXBvcHVwIC5tb2RhbC1tZXNzYWdlIHtcbiAgICAgICAgaGVpZ2h0OiA0NTBweDtcbiAgICAgICAgbWF4LWhlaWdodDogNDUwcHg7XG5cbiAgICAgICAgb3ZlcmZsb3cteTogc2Nyb2xsO1xuXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMTZweDtcbiAgICB9XG5gO1xuIiwiaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgLnF1aWNrcGljay1pdGVtIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgICAgIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuXG4gICAgICAgIG9wYWNpdHk6IDA7XG5cbiAgICAgICAgdHJhbnNpdGlvbi1kdXJhdGlvbjogMC4ycztcbiAgICAgICAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2U7XG4gICAgICAgIHRyYW5zaXRpb24tcHJvcGVydHk6IHRvcCwgbGVmdDtcblxuICAgICAgICBhbmltYXRpb246IGZvcndhcmRzIGVhc2UgMC4ycyBmYWRlLWluO1xuXG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIH1cblxuICAgIC5xdWlja3BpY2stY2lyY2xlIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgICAgIGFuaW1hdGlvbjogZm9yd2FyZHMgZWFzZSAwLjJzIGZhZGUtaW47XG4gICAgfVxuXG4gICAgQGtleWZyYW1lcyBmYWRlLWluIHtcbiAgICAgICAgZnJvbSB7XG4gICAgICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdG8ge1xuICAgICAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgfVxuICAgIH1cbmA7XG4iLCJpbXBvcnQgeyBjc3MgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNzc2BcbiAgICAqLFxuICAgICo6OmJlZm9yZSxcbiAgICAqOjphZnRlciB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB9XG5cbiAgICBodG1sIHtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuXG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgICAgb3ZlcnNjcm9sbC1iZWhhdmlvcjogbm9uZTtcbiAgICB9XG5cbiAgICBib2R5IHtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cblxuICAgIC5yZWlmaWVkLXJvb3Qge1xuICAgICAgICB6LWluZGV4OiAwO1xuXG4gICAgICAgIGhlaWdodDogMTAwdmg7XG4gICAgICAgIHdpZHRoOiAxMDB2dztcblxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgfVxuXG4gICAgLmJhY2tncm91bmQtY2FudmFzLFxuICAgIC5mb3JlZ3JvdW5kLWNhbnZhcyB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcblxuICAgICAgICB3aWR0aDogMTAwdnc7XG4gICAgICAgIGhlaWdodDogMTAwdmg7XG4gICAgfVxuXG4gICAgLmJhY2tncm91bmQtY2FudmFzIHtcbiAgICAgICAgei1pbmRleDogLTEwMDtcbiAgICB9XG5cbiAgICAuZm9yZWdyb3VuZC1jYW52YXMge1xuICAgICAgICB6LWluZGV4OiAxMDA7XG4gICAgfVxuYDtcbiIsImltcG9ydCB7IExJR0hUX0dSQVlfQ1NTX0NPTE9SIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgLnRvYXN0cy1jb250YWluZXIge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG5cbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuXG4gICAgICAgIHBhZGRpbmc6IDE2cHg7XG5cbiAgICAgICAgZ2FwOiA4cHg7XG5cbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG5cbiAgICAgICAgei1pbmRleDogMTAwO1xuXG4gICAgICAgIHdpZHRoOiAxMDB2dztcbiAgICAgICAgaGVpZ2h0OiAxMDB2aDtcbiAgICB9XG5cbiAgICAudG9hc3Qge1xuICAgICAgICBhbmltYXRpb246IGZvcndhcmRzIGxpbmVhciAwLjVzIGZhZGUtb3V0O1xuXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAgICAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcblxuICAgICAgICBtaW4td2lkdGg6IDI3NXB4O1xuXG4gICAgICAgIHBhZGRpbmc6IDEwcHggMThweDtcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAke0xJR0hUX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XG5cbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICAgICAgYm94LXNoYWRvdzogMXB4IDFweCA0cHggJHtMSUdIVF9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgLnRvYXN0LWNvbG9yIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgICAgIHdpZHRoOiA2cHg7XG5cbiAgICAgICAgdG9wOiAwO1xuICAgICAgICBib3R0b206IDA7XG4gICAgICAgIGxlZnQ6IDA7XG5cbiAgICAgICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogNHB4O1xuICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA0cHg7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcbiAgICB9XG5cbiAgICAuY2xvc2UtdG9hc3Qge1xuICAgICAgICBwb2ludGVyLWV2ZW50czogYWxsO1xuXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICBtYXJnaW4tdG9wOiA0cHg7XG5cbiAgICAgICAgZm9udC1zaXplOiAxMHB4O1xuXG4gICAgICAgIGNvbG9yOiAjYWFhYWFhO1xuXG4gICAgICAgIHRvcDogMDtcbiAgICAgICAgcmlnaHQ6IDA7XG5cbiAgICAgICAgYm9yZGVyOiBub25lO1xuXG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIH1cblxuICAgIC5jbG9zZS10b2FzdDpob3ZlciB7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICBjb2xvcjogYmxhY2s7XG4gICAgfVxuXG4gICAgQGtleWZyYW1lcyBmYWRlLW91dCB7XG4gICAgICAgIGZyb20ge1xuICAgICAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvIHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIH1cbiAgICB9XG5gO1xuIiwidmFyIG1hcCA9IHtcblx0XCIuL2F0dGFjaGVyLnRzXCI6IFwiLi9zcmMvc3R5bGluZy9hdHRhY2hlci50c1wiLFxuXHRcIi4vYnV0dG9ucy50c1wiOiBcIi4vc3JjL3N0eWxpbmcvYnV0dG9ucy50c1wiLFxuXHRcIi4vY2FkLnRzXCI6IFwiLi9zcmMvc3R5bGluZy9jYWQudHNcIixcblx0XCIuL2NvbXBvbmVudC50c1wiOiBcIi4vc3JjL3N0eWxpbmcvY29tcG9uZW50LnRzXCIsXG5cdFwiLi9jb250ZXh0bWVudS50c1wiOiBcIi4vc3JjL3N0eWxpbmcvY29udGV4dG1lbnUudHNcIixcblx0XCIuL2Rhcmttb2RlLnRzXCI6IFwiLi9zcmMvc3R5bGluZy9kYXJrbW9kZS50c1wiLFxuXHRcIi4vaW8udHNcIjogXCIuL3NyYy9zdHlsaW5nL2lvLnRzXCIsXG5cdFwiLi9tb2RhbHMudHNcIjogXCIuL3NyYy9zdHlsaW5nL21vZGFscy50c1wiLFxuXHRcIi4vcXVpY2twaWNrLnRzXCI6IFwiLi9zcmMvc3R5bGluZy9xdWlja3BpY2sudHNcIixcblx0XCIuL3N0eWxlLnRzXCI6IFwiLi9zcmMvc3R5bGluZy9zdHlsZS50c1wiLFxuXHRcIi4vdG9hc3QudHNcIjogXCIuL3NyYy9zdHlsaW5nL3RvYXN0LnRzXCJcbn07XG5cbmZ1bmN0aW9uIHdlYnBhY2tBc3luY0NvbnRleHQocmVxKSB7XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcblx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cblx0XHR2YXIgaWQgPSBtYXBbcmVxXTtcblx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG5cdH0pO1xufVxud2VicGFja0FzeW5jQ29udGV4dC5rZXlzID0gKCkgPT4gKE9iamVjdC5rZXlzKG1hcCkpO1xud2VicGFja0FzeW5jQ29udGV4dC5pZCA9IFwiLi9zcmMvc3R5bGluZyBsYXp5IHJlY3Vyc2l2ZSBeXFxcXC5cXFxcLy4qXFxcXC50cyRcIjtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0FzeW5jQ29udGV4dDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciB3ZWJwYWNrUXVldWVzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBxdWV1ZXNcIikgOiBcIl9fd2VicGFja19xdWV1ZXNfX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgd2VicGFja0Vycm9yID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKSA6IFwiX193ZWJwYWNrX2Vycm9yX19cIjtcbnZhciByZXNvbHZlUXVldWUgPSAocXVldWUpID0+IHtcblx0aWYocXVldWUgJiYgIXF1ZXVlLmQpIHtcblx0XHRxdWV1ZS5kID0gMTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSkpO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tID8gZm4ucisrIDogZm4oKSkpO1xuXHR9XG59XG52YXIgd3JhcERlcHMgPSAoZGVwcykgPT4gKGRlcHMubWFwKChkZXApID0+IHtcblx0aWYoZGVwICE9PSBudWxsICYmIHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZihkZXBbd2VicGFja1F1ZXVlc10pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0cXVldWUuZCA9IDA7XG5cdFx0XHRkZXAudGhlbigocikgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0V4cG9ydHNdID0gcjtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0sIChlKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXJyb3JdID0gZTtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG9iaiA9IHt9O1xuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdHZhciByZXQgPSB7fTtcblx0cmV0W3dlYnBhY2tRdWV1ZXNdID0geCA9PiB7fTtcblx0cmV0W3dlYnBhY2tFeHBvcnRzXSA9IGRlcDtcblx0cmV0dXJuIHJldDtcbn0pKTtcbl9fd2VicGFja19yZXF1aXJlX18uYSA9IChtb2R1bGUsIGJvZHksIGhhc0F3YWl0KSA9PiB7XG5cdHZhciBxdWV1ZTtcblx0aGFzQXdhaXQgJiYgKChxdWV1ZSA9IFtdKS5kID0gMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCIvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3Ncbi8vIFNpbmNlIGFsbCByZWZlcmVuY2VkIGNodW5rcyBhcmUgYWxyZWFkeSBpbmNsdWRlZFxuLy8gaW4gdGhpcyBmaWxlLCB0aGlzIGZ1bmN0aW9uIGlzIGVtcHR5IGhlcmUuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoKSA9PiAoUHJvbWlzZS5yZXNvbHZlKCkpOyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmluZGV4LmpzXCI7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=