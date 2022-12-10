/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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
/* harmony export */   "IS_MAC_OS": () => (/* binding */ IS_MAC_OS),
/* harmony export */   "KINDA_DARK_GRAY_CSS_COLOR": () => (/* binding */ KINDA_DARK_GRAY_CSS_COLOR),
/* harmony export */   "KINDA_LIGHT_GRAY_CSS_COLOR": () => (/* binding */ KINDA_LIGHT_GRAY_CSS_COLOR),
/* harmony export */   "LIGHTER_GRAY_CSS_COLOR": () => (/* binding */ LIGHTER_GRAY_CSS_COLOR),
/* harmony export */   "LIGHT_GRAY_CSS_COLOR": () => (/* binding */ LIGHT_GRAY_CSS_COLOR),
/* harmony export */   "LOCKED_FOR_TESTING": () => (/* binding */ LOCKED_FOR_TESTING),
/* harmony export */   "NOT_REALLY_DARK_GRAY_CSS_COLOR": () => (/* binding */ NOT_REALLY_DARK_GRAY_CSS_COLOR),
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
const IN_DEBUG_MODE = !!new URL(location.href).searchParams.has("debug");
const IS_MAC_OS = [navigator.userAgentData?.platform, navigator.platform].some((platform) => platform?.toLowerCase().includes("mac") ?? false);
const LOCKED_FOR_TESTING = () => _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("The diagram is currently locked for testing. No changes can be made.");
const DELAY = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
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
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");





const debug = (_constants__WEBPACK_IMPORTED_MODULE_0__.IN_DEBUG_MODE
    ? [
        {
            "test-alert": {
                label: "Test alert",
                callback: async () => {
                    console.log(await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("This is an alert."));
                },
            },
            "test-confirm": {
                label: "Test confirm",
                callback: async () => {
                    console.log(await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.confirm("This is a confirmation."));
                },
            },
            "test-prompt": {
                label: "Test prompt",
                callback: async () => {
                    console.log(await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.prompt("This is a prompt."));
                },
            },
            "test-toast": {
                label: "Test toast",
                callback: async () => {
                    console.log(await _managers_ToastManager__WEBPACK_IMPORTED_MODULE_3__.ToastManager.toast({
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
                    _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__.StorageManager.storage.clear();
                },
            },
            "wipe-save": {
                label: "Wipe named save",
                callback: async () => {
                    const save = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.prompt("");
                    if (save) {
                        if (!_managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__.StorageManager.has("saves:" + save))
                            return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_3__.ToastManager.toast({
                                message: "No saves exist with that name.",
                                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                duration: _constants__WEBPACK_IMPORTED_MODULE_0__.TOAST_DURATION,
                            });
                        _managers_StorageManager__WEBPACK_IMPORTED_MODULE_2__.StorageManager["delete"]("saves:" + save);
                        location.reload();
                    }
                },
            },
        },
        {
            "stop-render": {
                label: "Stop rendering wires",
                callback: () => {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_4__.WiringManager.stop();
                },
            },
            "start-render": {
                label: "Start rendering wires",
                callback: () => {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_4__.WiringManager.start();
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
        callback: async (e) => {
            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_4__.TestingManager.testing)
                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
            const name = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.prompt("Enter the component's name:");
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
                download: `gatesim-${Date.now()}.json`,
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
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({
                keybinds: _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds,
                menu: _menu__WEBPACK_IMPORTED_MODULE_9__.menu,
                save: "sandbox",
                initial: [components, wires],
                overrideSaveIfExists: true,
                settings: {},
            });
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.applyRawSettings(settings);
            _managers_StorageManager__WEBPACK_IMPORTED_MODULE_5__.StorageManager.set("saves:" + "sandbox", (0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_8__.Reified.active], [..._managers_WiringManager__WEBPACK_IMPORTED_MODULE_7__.WiringManager.wires]));
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
                const display = new _reified_Display__WEBPACK_IMPORTED_MODULE_6__.Display(raw, raw.inputs.length, raw.radix);
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
            const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_5__.Component(new (_reified_chips__WEBPACK_IMPORTED_MODULE_4__.chips.get(raw.name))(), raw);
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
/* harmony import */ var _contextmenu_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contextmenu/menu */ "./src/contextmenu/menu.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files */ "./src/files.ts");
/* harmony import */ var _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./keybinds/keybinds */ "./src/keybinds/keybinds.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _premade__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./premade */ "./src/premade/index.ts");
/* harmony import */ var _styling_attacher__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styling/attacher */ "./src/styling/attacher.ts");









Object.assign(globalThis, _constants__WEBPACK_IMPORTED_MODULE_0__);
await (0,_styling_attacher__WEBPACK_IMPORTED_MODULE_7__.attachStyles)();
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
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");





const behavior = {
    ["KeyG"]: async () => {
        const components = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_4__.Reified.active];
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
            _managers_ToastManager__WEBPACK_IMPORTED_MODULE_3__.ToastManager.toast({
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
/* harmony import */ var _select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./select */ "./src/keybinds/select.ts");
/* harmony import */ var _serde__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./serde */ "./src/keybinds/serde.ts");







const keybinds = Object.assign({}, _backspace__WEBPACK_IMPORTED_MODULE_0__.backspace, _behavior__WEBPACK_IMPORTED_MODULE_1__.behavior, _history__WEBPACK_IMPORTED_MODULE_2__.history, _howtouse__WEBPACK_IMPORTED_MODULE_3__.howtouse, _io__WEBPACK_IMPORTED_MODULE_4__.io, _select__WEBPACK_IMPORTED_MODULE_5__.select, _serde__WEBPACK_IMPORTED_MODULE_6__.serde);


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
        setTimeout(() => {
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
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _DarkmodeManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _QuickPickManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./QuickPickManager */ "./src/managers/QuickPickManager.ts");
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
    static snapToGridBasedUpdate({ forceClear = false } = { forceClear: false }) {
        if (this.snapToGrid && !forceClear) {
            setTimeout(() => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.forEach((component) => {
                    component.element.style.minWidth = "";
                    component.element.style.minHeight = "";
                    setTimeout(() => {
                        const style = getComputedStyle(component.element);
                        const width = parseFloat(style.width);
                        const height = parseFloat(style.height);
                        component.element.style.minWidth = Math.ceil(width / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                        component.element.style.minHeight = Math.ceil(height / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                    });
                });
            });
            document.body.style.backgroundSize = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px " + _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
            if (_DarkmodeManager__WEBPACK_IMPORTED_MODULE_4__.DarkmodeManager.enabled) {
                document.body.style.backgroundImage = `linear-gradient(to right, ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            }
            else {
                document.body.style.backgroundImage = `linear-gradient(to right, ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${_constants__WEBPACK_IMPORTED_MODULE_0__.EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            }
        }
        else {
            setTimeout(() => {
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
    static listen() {
        this.snapToGridBasedUpdate();
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
            if (_KeybindsManager__WEBPACK_IMPORTED_MODULE_5__.KeybindsManager.isKeyDown("KeyA")) {
                _QuickPickManager__WEBPACK_IMPORTED_MODULE_7__.QuickPickManager.activate(e, _reified_chips__WEBPACK_IMPORTED_MODULE_1__.gates.map((gate) => ({
                    label: gate.NAME,
                    callback(e) {
                        const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_2__.Component(Reflect.construct(gate, []), _constants__WEBPACK_IMPORTED_MODULE_0__.ORIGIN_POINT);
                        const selection = _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected.clone(true);
                        return _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
                            _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.add(component);
                            if (_reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active.has(component)) {
                                component.attach();
                                const { width, height } = getComputedStyle(component.element);
                                component.move({
                                    x: e.clientX - parseFloat(width) / 2,
                                    y: e.clientY - parseFloat(height) / 2,
                                });
                                _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.select(component);
                            }
                        }, () => {
                            _reified_Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active["delete"](component);
                            component.detach();
                            _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selected = selection;
                        });
                    },
                })));
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
                            target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                            target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                        }, () => {
                            target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                            target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                        });
                    else
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
                            target.style.left = mouse.x - mouse.ox - 1 + "px";
                            target.style.top = mouse.y - mouse.oy - 1 + "px";
                        }, () => {
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
            _MouseManager__WEBPACK_IMPORTED_MODULE_6__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_6__.MouseManager.mouse.y !== -1)
            _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selectAllIn(DraggingManager.#downpos, _MouseManager__WEBPACK_IMPORTED_MODULE_6__.MouseManager.mouse);
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
                            target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                            target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                        }, () => {
                            target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                            target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                        });
                    else
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_8__.SandboxManager.pushHistory(() => {
                            target.style.left = mouse.x - mouse.ox - 1 + "px";
                            target.style.top = mouse.y - mouse.oy - 1 + "px";
                        }, () => {
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
            _MouseManager__WEBPACK_IMPORTED_MODULE_6__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_6__.MouseManager.mouse.y !== -1)
            _SelectionManager__WEBPACK_IMPORTED_MODULE_9__.SelectionManager.selectAllIn(DraggingManager.#downpos, _MouseManager__WEBPACK_IMPORTED_MODULE_6__.MouseManager.mouse);
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


class QuickPickManager {
    static line;
    static async activate(event, actions) {
        const quickpick = _reified_Reified__WEBPACK_IMPORTED_MODULE_1__.html `<div class="quickpick"></div>`;
        const keys = actions.map(({ label }) => label);
        if (keys.length !== new Set(keys).size)
            throw new Error("Duplicate labels in quickpick actions.");
        quickpick.innerHTML = actions
            .map(({ label }, i) => `<div class="quickpick-item index-${i}">${label}</div>`)
            .join("");
        setTimeout(() => {
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
            setTimeout(() => {
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
                setTimeout(() => {
                    item.style.left = event.clientX + x - width / 2 + "px";
                    item.style.top = event.clientY + y - height / 2 + "px";
                });
            });
        });
        document.body.appendChild(quickpick);
        const mousemove = (e) => {
            this.line = [event, e];
        };
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
            this.line = undefined;
        }, { once: true });
        document.body.addEventListener("mouseleave", () => {
            quickpick.remove();
            document.body.removeEventListener("mousemove", mousemove);
            this.line = undefined;
        }, { once: true });
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
/* harmony import */ var _DarkmodeManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MenuManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MenuManager */ "./src/managers/MenuManager.ts");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _UndoRedoManager__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./UndoRedoManager */ "./src/managers/UndoRedoManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");



















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
        _MouseManager__WEBPACK_IMPORTED_MODULE_13__.MouseManager.start();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_10__.KeybindsManager.listen();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.listen();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_14__.SelectionManager.listen();
        _WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.start();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_8__.DarkmodeManager.listen().onChange(() => _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.snapToGridBasedUpdate());
        _UndoRedoManager__WEBPACK_IMPORTED_MODULE_17__.UndoRedoManager.listen();
        const createReifiedActive = (components) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((item, set) => {
            const totals = calculateReifiedTotals(set.clone().add(item));
            if (totals.chipsTotal + totals.inputsTotal + totals.outputsTotal >
                (this.#config.limits?.componentsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
                    message: "Exceeded total components limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.inputsTotal > (this.#config.limits?.inputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
                    message: "Exceeded total inputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.outputsTotal > (this.#config.limits?.outputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
                    message: "Exceeded total outputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (totals.chipsTotal > (this.#config.limits?.chipsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
                    message: "Exceeded total chips limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            if (item instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component &&
                totals.chips.has(item.chip.name) &&
                totals.chips.get(item.chip.name) > (this.#config.limits?.chips?.[item.chip.name] ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
                    message: `Exceeded total '${item.chip.name}' limit.`,
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
                });
                return false;
            }
            return true;
        })
            .onAdd((component) => {
            _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.snapToGridBasedUpdate();
            setTimeout(() => {
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
                _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
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
            [this.queueNewContext, this.killMenu] = _MenuManager__WEBPACK_IMPORTED_MODULE_11__.MenuManager.use(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root, this.#config.menu);
        if (typeof this.#config.keybinds !== "undefined")
            Object.entries(this.#config.keybinds).forEach(([chord, run]) => _KeybindsManager__WEBPACK_IMPORTED_MODULE_10__.KeybindsManager.onKeyChord(chord, run));
        if (typeof this.#config.initial !== "undefined") {
            this.clear();
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active = createReifiedActive(this.#config.initial[0]);
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => component.attach());
            _WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.wires = createWiringsSet(this.#config.initial[1]);
        }
        if (typeof this.#config.save !== "undefined") {
            const file = _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.get("saves:" + this.#config.save);
            if (file) {
                const { error, result: [settings, components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_2__.fromFile)(file);
                if (error) {
                    _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager["delete"]("saves:" + this.#config.save);
                    if (_constants__WEBPACK_IMPORTED_MODULE_1__.IN_DEBUG_MODE)
                        console.error("Failed to read from saves:", error);
                    _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
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
                        _WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.wires = createWiringsSet(wires);
                    }
                    _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.wires]));
                }
            }
        }
        this.#observer = new MutationObserver(() => {
            if (typeof this.#config.save !== "undefined")
                _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.wires]));
        });
        this.#observer.observe(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        });
        this.#interval = setInterval(() => {
            const check = this.#config.checkState?.(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.clone(), _WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.wires.clone()) ?? false;
            if (check)
                this.#config.ifStateChecked?.();
        }, this.#config.checkInterval ?? 50);
        if (!_StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.get("usedhelp"))
            _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
                message: "Press '?' for help.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.LIGHT_GRAY_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
        return this;
    }
    static forceSave() {
        if (typeof this.#config.save !== "undefined")
            _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.wires]));
        return this;
    }
    static reset() {
        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = undefined;
        }
        clearInterval(this.#interval);
        this.#interval = -1;
        _MouseManager__WEBPACK_IMPORTED_MODULE_13__.MouseManager.reset();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_10__.KeybindsManager.reset();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.reset();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_14__.SelectionManager.reset();
        _WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.stop();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_8__.DarkmodeManager.stop();
        _UndoRedoManager__WEBPACK_IMPORTED_MODULE_17__.UndoRedoManager.stop();
        _MenuManager__WEBPACK_IMPORTED_MODULE_11__.MenuManager.remove(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root);
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
        _WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.wires.forEach((wire) => wire.destroy());
        _SelectionManager__WEBPACK_IMPORTED_MODULE_14__.SelectionManager.selected.clear();
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
            _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
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
            _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
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
        _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.snapToGrid = settings.snapToGrid ?? false;
        return this;
    }
    static applyRawSettings(settings) {
        _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.snapToGrid = settings["DraggingManager.snapToGrid"];
        return this;
    }
    static async saveTo(save) {
        this.#config.save = save;
        if (_StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.has("saves:" + this.#config.save) &&
            !(await _ModalManager__WEBPACK_IMPORTED_MODULE_12__.ModalManager.confirm("There is already a save with this name. Are you sure you want to replace it?")))
            return;
        _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_18__.WiringManager.wires]));
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
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");













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
            if ((_constants__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_8__.KeybindsManager.isKeyDown("MetaLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_8__.KeybindsManager.isKeyDown("MetaRight"))) ||
                (!_constants__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_8__.KeybindsManager.isKeyDown("ControlLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_8__.KeybindsManager.isKeyDown("ControlRight"))))
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
            const data = (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)(array, [..._WiringManager__WEBPACK_IMPORTED_MODULE_12__.WiringManager.wires].filter((wiring) => array.some((component) => {
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
            return _ToastManager__WEBPACK_IMPORTED_MODULE_11__.ToastManager.toast({
                message: "Unable to paste diagram data.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
        const mouse = { ..._MouseManager__WEBPACK_IMPORTED_MODULE_9__.MouseManager.mouse };
        const selection = this.selected.clone(true);
        _SandboxManager__WEBPACK_IMPORTED_MODULE_10__.SandboxManager.pushHistory(() => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.addAll(components);
            if (components.every((component) => _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.has(component))) {
                components.forEach((component) => {
                    component.attach();
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component || component instanceof _reified_Display__WEBPACK_IMPORTED_MODULE_4__.Display) {
                        component.inputs.forEach((input) => input.classList.remove("activated"));
                        setTimeout(() => component.update(), 0);
                    }
                    if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output) {
                        component.element.classList.remove("activated");
                    }
                });
                if (_MouseManager__WEBPACK_IMPORTED_MODULE_9__.MouseManager.mouse.x !== -1 && _MouseManager__WEBPACK_IMPORTED_MODULE_9__.MouseManager.mouse.y !== -1) {
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
                _WiringManager__WEBPACK_IMPORTED_MODULE_12__.WiringManager.wires.addAll(wirings);
                this.selected.clear();
                components.forEach((component) => this.addSelection(component));
            }
        }, () => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.deleteAll(components);
            components.forEach((component) => {
                component.detach();
            });
            _WiringManager__WEBPACK_IMPORTED_MODULE_12__.WiringManager.wires.deleteAll(wirings);
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
    static listen() {
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
            setTimeout(() => {
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
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _QuickPickManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./QuickPickManager */ "./src/managers/QuickPickManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _TestingManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TestingManager */ "./src/managers/TestingManager.ts");








class NewWireContext {
    static from;
    static {
        _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.onMouseDown((e) => {
            if (NewWireContext.from) {
                const { target } = e;
                if (target && target instanceof HTMLElement) {
                    if (target.classList.contains("board-output") ||
                        target.classList.contains("component-input-button")) {
                        if (_TestingManager__WEBPACK_IMPORTED_MODULE_7__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_1__.LOCKED_FOR_TESTING)();
                        const from = NewWireContext.from;
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.pushHistory(() => {
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
    static #rAF = -1;
    static wires = new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet();
    static update() {
        const bg = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_BACKGROUND_CANVAS_CTX)();
        const fg = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_FOREGROUND_CANVAS_CTX)();
        bg.canvas.width = window.innerWidth;
        bg.canvas.height = window.innerHeight;
        fg.canvas.width = window.innerWidth;
        fg.canvas.height = window.innerHeight;
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
        if (_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.x !== -1 &&
            _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.y !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y !== -1) {
            fg.strokeStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_ACTIVATED_COLOR)();
            fg.lineWidth = 2.5;
            fg.lineJoin = "miter";
            fg.strokeRect(_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.x, _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.y, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x - _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.x, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y - _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.y);
        }
        _SelectionManager__WEBPACK_IMPORTED_MODULE_6__.SelectionManager.selected.forEach((component) => {
            const rect = component.element.getBoundingClientRect();
            fg.strokeStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_ACTIVATED_COLOR)();
            fg.lineWidth = 1;
            fg.lineJoin = "miter";
            fg.strokeRect(rect.left - 15, rect.top - 15, rect.width + 15 + 15, rect.height + 15 + 15);
        });
        if (_QuickPickManager__WEBPACK_IMPORTED_MODULE_4__.QuickPickManager.line) {
            const [from, to] = _QuickPickManager__WEBPACK_IMPORTED_MODULE_4__.QuickPickManager.line;
            fg.fillStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_GRAY_COLOR)();
            fg.strokeStyle = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_GRAY_COLOR)();
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
    static start() {
        this.update();
        const id = requestAnimationFrame(this.start.bind(this));
        this.#rAF = id;
    }
    static stop() {
        cancelAnimationFrame(this.#rAF);
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
    constructor(chip, pos) {
        super();
        this.chip = chip;
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_7__.html `
            <div class="component">
                <div class="component-inputs">
                    ${Array(this.chip.inputs).fill('<button class="component-input-button">I</button>').join("")}
                </div>
                <p class="component-name">${this.chip.name}</p>
                <div class="component-outputs">
                    ${Array(this.chip.outputs).fill('<button class="component-output-button">O</button>').join("")}
                </div>
            </div>
        `;
        this.inputs = Array.from(this.element.querySelectorAll(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));
        this.name = this.element.querySelector(".component-name");
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
            ]);
        });
        setTimeout(() => this.update(), 0);
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
    attach() {
        super.attach();
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
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.watch(this.element, this.name);
        return this;
    }
    detach() {
        super.detach();
        this.#observers.forEach((o) => o.disconnect());
        this.#mouseups.forEach((listener, element) => element.removeEventListener("mouseup", listener));
        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));
        this.#clicks.forEach((listener, element) => element.removeEventListener("click", listener));
        this.name.removeEventListener("contextmenu", this.#contextmenus.get(this.name));
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.forget(this.element, true);
        return this;
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
        setTimeout(() => this.update(), 0);
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
    attach() {
        super.attach();
        this.#makeListeners();
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
                                this.#makeListeners();
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
                                this.#makeListeners();
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
    #makeListeners() {
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
    get bits() {
        return this.#bits;
    }
    get radix() {
        return this.#radix;
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
    move({ x, y, centered }) {
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        if (centered)
            setTimeout(() => {
                const { top, left, width, height } = getComputedStyle(this.element);
                this.move({
                    x: parseFloat(left) - parseFloat(width) / 2,
                    y: parseFloat(top) - parseFloat(height) / 2,
                });
            }, 0);
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
const attachStyles = async () => {
    const css = await Promise.all(["style", "component", "io", "contextmenu", "toast", "modals", "buttons", "darkmode", "quickpick"].map((name) => __webpack_require__("./src/styling lazy recursive ^\\.\\/.*\\.ts$")(`./${name}.ts`))).then((css) => css.map((_) => _.default).join(""));
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return new Promise((resolve, reject) => {
        style.addEventListener("load", resolve, { once: true });
        style.addEventListener("error", reject, { once: true });
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
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.css `
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

        border: 1px solid #dedede;
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

        color: #cccccc;

        height: 16px;
        width: 16px;

        padding: 0;

        user-select: none;

        border: 1px solid #dedede;
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
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.css `
    .contextmenu {
        position: absolute;

        z-index: 100;

        display: flex;
        flex-direction: column;

        width: 200px;

        border: 1px solid #dedede;
        border-radius: 4px;

        background-color: #fefefe;

        user-select: none;

        box-shadow: 1px 1px 4px #dedede;
    }

    .contextmenu > .br {
        display: block;

        width: 100%;

        border-bottom: 1px solid #dedede;
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

        border: 1px solid #dedede;
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

        color: #eeeeee;
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
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.css `
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

        border: 1px solid #dedede;
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

        border: 1px solid #dedede;
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
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_reified_Reified__WEBPACK_IMPORTED_MODULE_0__.css `
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

        border: 1px solid #dedede;
        border-radius: 4px;

        background-color: #fefefe;

        user-select: none;

        box-shadow: 1px 1px 4px #dedede;
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDOzRCQUM5RSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7d0JBQ2pGLENBQUMsRUFDRCxHQUFHLEVBQUU7NEJBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQzs0QkFDdEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQzt3QkFDekUsQ0FBQyxDQUNKLENBQUM7O3dCQUVGLHVFQUEwQixDQUN0QixHQUFHLEVBQUU7NEJBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7NEJBQ2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO3dCQUNyRCxDQUFDLEVBQ0QsR0FBRyxFQUFFOzRCQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFH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QUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsSUFBSSwyREFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsSUFBSSwyREFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsSUFBSSwyREFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsSUFBSSwyREFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsSUFBSSwyREFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsSUFBSSwyREFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsSUFBSSwyREFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsSUFBSSwyREFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekMsSUFBSSwyREFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekMsSUFBSSwyREFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQztv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QUN4QixDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBcUI7UUFDN0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDOztBQUdFLE1BQU0sT0FBUSxTQUFRLElBQVU7SUFDbkMsTUFBTSxDQUFVLElBQUksR0FBRyxLQUFLLENBQUM7SUFDN0IsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFNUI7UUFDSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBcUI7UUFDN0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDOztBQUdFLE1BQU0sT0FBUSxTQUFRLElBQVU7SUFDbkMsTUFBTSxDQUFVLElBQUksR0FBRyxLQUFLLENBQUM7SUFDN0IsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFNUI7UUFDSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBcUI7UUFDN0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDOztBQUdFLE1BQU0sUUFBUyxTQUFRLElBQVU7SUFDcEMsTUFBTSxDQUFVLElBQUksR0FBRyxNQUFNLENBQUM7SUFDOUIsTUFBTSxDQUFVLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFVLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFNUI7UUFDSSxLQUFL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VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBLElBQUk7V0FDSjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxDQUFDO1dBQ0Q7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBLHNHQUFzRztXQUN0RztXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7Ozs7O1dDaEVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2F1Z21lbnRzL1dhdGNoZWRTZXQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY29udGV4dG1lbnUvZGVidWcudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L2luc2VydC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY29udGV4dG1lbnUvaW8udHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L21lbnUudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L3NlcmRlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9maWxlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL2JhY2tzcGFjZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMva2V5YmluZHMvYmVoYXZpb3IudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL2hpc3RvcnkudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL2hvd3RvdXNlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9rZXliaW5kcy9pby50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMva2V5YmluZHMva2V5YmluZHMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL3NlbGVjdC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMva2V5YmluZHMvc2VyZGUudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL0Rhcmttb2RlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL01lbnVNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL01vdXNlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvUXVpY2tQaWNrTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU2FuZGJveE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1NlbGVjdGlvbk1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1N0b3JhZ2VNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvVG9hc3RNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9VbmRvUmVkb01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1dpcmluZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3ByZW1hZGUvZXhhbXBsZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcHJlbWFkZS9pbmRleC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcHJlbWFkZS9uYW5kLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL0NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9EaXNwbGF5LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL0lucHV0LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL091dHB1dC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9SZWlmaWVkLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL2NoaXBzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL2F0dGFjaGVyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL2J1dHRvbnMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvY29tcG9uZW50LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL2NvbnRleHRtZW51LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL2Rhcmttb2RlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL2lvLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL21vZGFscy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvc3R5bGluZy9xdWlja3BpY2sudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvc3R5bGUudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvdG9hc3QudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvIGxhenkgXlxcLlxcLy4qXFwudHMkIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvYXN5bmMgbW9kdWxlIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBXYXRjaGVkU2V0PFQ+IGV4dGVuZHMgU2V0PFQ+IHtcbiAgICAjYWRkcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcbiAgICAjZGVsZXRlcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcbiAgICAjYXR0ZW1wdGVkQWRkcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcbiAgICAjYXR0ZW1wdGVkRGVsZXRlcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcblxuICAgICNsb2NrZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGl0ZW1zPzogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPHR5cGVvZiBTZXQ8VD4+WzBdKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgaWYgKGl0ZW1zKSB0aGlzLmFkZEFsbChbLi4uaXRlbXNdKTtcbiAgICB9XG5cbiAgICBvbkFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYWRkcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkRlbGV0ZShydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jZGVsZXRlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkF0dGVtcHRlZEFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkQWRkcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkF0dGVtcHRlZERlbGV0ZShydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkRGVsZXRlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZBZGQocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2FkZHMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmRGVsZXRlKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNkZWxldGVzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZkF0dGVtcHRlZEFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkQWRkcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZBdHRlbXB0ZWREZWxldGUocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2F0dGVtcHRlZERlbGV0ZXMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWRkQWxsKGl0ZW1zOiBUW10pIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5hZGQoaXRlbSkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRlbGV0ZUFsbChpdGVtczogVFtdKSB7XG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoKGl0ZW0pID0+IHRoaXMuZGVsZXRlKGl0ZW0pKTtcbiAgICB9XG5cbiAgICBhZGQoaXRlbTogVCkge1xuICAgICAgICBpZiAodGhpcy4jbG9ja2VkKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2F0dGVtcHRlZEFkZHNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdHMuZXZlcnkoKG91dCkgPT4gIW91dCkpIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFsuLi50aGlzLiNhZGRzXS5tYXAoKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBpdGVtLCB0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHMuc29tZSgob3V0KSA9PiBvdXQgPT09IGZhbHNlKSA/IHRoaXMgOiBzdXBlci5hZGQoaXRlbSk7XG4gICAgfVxuXG4gICAgZGVsZXRlKGl0ZW06IFQpIHtcbiAgICAgICAgaWYgKHRoaXMuI2xvY2tlZCkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IFsuLi50aGlzLiNhdHRlbXB0ZWREZWxldGVzXS5tYXAoKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBpdGVtLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHRzLmV2ZXJ5KChvdXQpID0+ICFvdXQpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2RlbGV0ZXNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0cy5zb21lKChvdXQpID0+IG91dCA9PT0gZmFsc2UpID8gZmFsc2UgOiBzdXBlci5kZWxldGUoaXRlbSk7XG4gICAgfVxuXG4gICAgbG9jaygpIHtcbiAgICAgICAgdGhpcy4jbG9ja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1bmxvY2soKSB7XG4gICAgICAgIHRoaXMuI2xvY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGdldCBsb2NrZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNsb2NrZWQ7XG4gICAgfVxuXG4gICAgY2xvbmUod2l0aExpc3RlbmVycz86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgc2V0ID0gbmV3IFdhdGNoZWRTZXQodGhpcyk7XG5cbiAgICAgICAgaWYgKHdpdGhMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuI2FkZHMuZm9yRWFjaCgocnVuKSA9PiBzZXQub25BZGQocnVuKSk7XG4gICAgICAgICAgICB0aGlzLiNkZWxldGVzLmZvckVhY2goKHJ1bikgPT4gc2V0Lm9uRGVsZXRlKHJ1bikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNldDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBEYXJrbW9kZU1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9EYXJrbW9kZU1hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL01vZGFsTWFuYWdlclwiO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgICAgIHVzZXJBZ2VudERhdGE/OiB7IHBsYXRmb3JtOiBzdHJpbmcgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgPSAyNDtcbmV4cG9ydCBjb25zdCBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFID0gMjQ7XG5leHBvcnQgY29uc3QgQ0hJUF9DT01QT05FTlRfQ1NTX1dJRFRIID0gMTIwO1xuZXhwb3J0IGNvbnN0IENISVBfQ09NUE9ORU5UX0NTU19IRUlHSFQgPSA0MDtcbmV4cG9ydCBjb25zdCBDSElQX0lOUFVUX0NTU19TSVpFID0gMTY7XG5leHBvcnQgY29uc3QgQ0hJUF9PVVRQVVRfQ1NTX1NJWkUgPSAxNjtcbmV4cG9ydCBjb25zdCBPUklHSU5fUE9JTlQgPSBPYmplY3QuZnJlZXplKHsgeDogMCwgeTogMCB9KTtcbmV4cG9ydCBjb25zdCBJTl9ERUJVR19NT0RFID0gISFuZXcgVVJMKGxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcy5oYXMoXCJkZWJ1Z1wiKTtcbmV4cG9ydCBjb25zdCBJU19NQUNfT1MgPSBbbmF2aWdhdG9yLnVzZXJBZ2VudERhdGE/LnBsYXRmb3JtLCBuYXZpZ2F0b3IucGxhdGZvcm1dLnNvbWUoXG4gICAgKHBsYXRmb3JtKSA9PiBwbGF0Zm9ybT8udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhcIm1hY1wiKSA/PyBmYWxzZSxcbik7XG5cbmV4cG9ydCBjb25zdCBMT0NLRURfRk9SX1RFU1RJTkcgPSAoKSA9PlxuICAgIE1vZGFsTWFuYWdlci5hbGVydChcIlRoZSBkaWFncmFtIGlzIGN1cnJlbnRseSBsb2NrZWQgZm9yIHRlc3RpbmcuIE5vIGNoYW5nZXMgY2FuIGJlIG1hZGUuXCIpO1xuXG5leHBvcnQgY29uc3QgREVMQVkgPSAoZGVsYXk6IG51bWJlcikgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcblxuZXhwb3J0IGNvbnN0IEdFVF9CQUNLR1JPVU5EX0NBTlZBU19DVFggPSAoKSA9PlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTENhbnZhc0VsZW1lbnQ+KFwiY2FudmFzLmJhY2tncm91bmQtY2FudmFzXCIpIS5nZXRDb250ZXh0KFwiMmRcIikhO1xuXG5leHBvcnQgY29uc3QgR0VUX0ZPUkVHUk9VTkRfQ0FOVkFTX0NUWCA9ICgpID0+XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXCJjYW52YXMuZm9yZWdyb3VuZC1jYW52YXNcIikhLmdldENvbnRleHQoXCIyZFwiKSE7XG5cbmV4cG9ydCBjb25zdCBDT1VOVEVSX0dFTkVSQVRPUiA9IGZ1bmN0aW9uKiAoaSA9IDApIHtcbiAgICB3aGlsZSAodHJ1ZSkgeWllbGQgaSsrO1xufTtcblxuZXhwb3J0IGNvbnN0IFNDVUZGRURfVVVJRCA9ICgpID0+XG4gICAgRGF0ZS5ub3coKS50b1N0cmluZygzNikgKyBOdW1iZXIoRGF0ZS5ub3coKS50b1N0cmluZygpLnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpKS50b1N0cmluZygzNik7XG5cbmV4cG9ydCBjb25zdCBST1VORF9UT19ORUFSRVNUID0gKHg6IG51bWJlciwgbjogbnVtYmVyKSA9PiBNYXRoLnJvdW5kKHggLyBuKSAqIG47XG5cbmV4cG9ydCBjb25zdCBHRVRfQUNUSVZBVEVEX0NPTE9SID0gKCkgPT4gKERhcmttb2RlTWFuYWdlci5lbmFibGVkID8gREFSS19BQ1RJVkFURURfQ1NTX0NPTE9SIDogQUNUSVZBVEVEX0NTU19DT0xPUik7XG5leHBvcnQgY29uc3QgR0VUX0dSQVlfQ09MT1IgPSAoKSA9PlxuICAgIERhcmttb2RlTWFuYWdlci5lbmFibGVkID8gT05MWV9BX0hJTlRfT0ZfREFSS19HUkFZX0NTU19DT0xPUiA6IExJR0hUX0dSQVlfQ1NTX0NPTE9SO1xuXG5leHBvcnQgY29uc3QgQUNUSVZBVEVEX0NTU19DT0xPUiA9IFwiI2ZmMjYyNlwiO1xuZXhwb3J0IGNvbnN0IERBUktfQUNUSVZBVEVEX0NTU19DT0xPUiA9IFwiI2RkMTExMVwiO1xuZXhwb3J0IGNvbnN0IEVWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SID0gXCIjMGEwYTBjXCI7XG5leHBvcnQgY29uc3QgU0xJR0hUTFlfREFSS0VSX0dSQVlfQ1NTX0NPTE9SID0gXCIjMTAxMDEyXCI7XG5leHBvcnQgY29uc3QgREFSS0VSX0dSQVlfQ1NTX0NPTE9SID0gXCIjMTYxNjFmXCI7XG5leHBvcnQgY29uc3QgREFSS19HUkFZX0NTU19DT0xPUiA9IFwiIzFjMWMyNFwiO1xuZXhwb3J0IGNvbnN0IEtJTkRBX0RBUktfR1JBWV9DU1NfQ09MT1IgPSBcIiMyNDI0MmVcIjtcbmV4cG9ydCBjb25zdCBOT1RfUkVBTExZX0RBUktfR1JBWV9DU1NfQ09MT1IgPSBcIiMyZTJlM2ZcIjtcbmV4cG9ydCBjb25zdCBPTkxZX0FfSElOVF9PRl9EQVJLX0dSQVlfQ1NTX0NPTE9SID0gXCIjM2MzYzRmXCI7XG5leHBvcnQgY29uc3QgU1VQRVJfR1JBWV9DU1NfQ09MT1IgPSBcIiNiYmJiYmJcIjtcbmV4cG9ydCBjb25zdCBLSU5EQV9MSUdIVF9HUkFZX0NTU19DT0xPUiA9IFwiI2NkY2RjZFwiO1xuZXhwb3J0IGNvbnN0IExJR0hUX0dSQVlfQ1NTX0NPTE9SID0gXCIjZGVkZWRlXCI7XG5leHBvcnQgY29uc3QgTElHSFRFUl9HUkFZX0NTU19DT0xPUiA9IFwiI2VhZWFlYVwiO1xuZXhwb3J0IGNvbnN0IEVWRU5fTElHSFRFUl9HUkFZX0NTU19DT0xPUiA9IFwiI2VmZWZlZlwiO1xuZXhwb3J0IGNvbnN0IFRPQVNUX0RVUkFUSU9OID0gMjUwMDtcbmV4cG9ydCBjb25zdCBHUklEX1NJWkUgPSAxNTtcbmV4cG9ydCBjb25zdCBRVUlDS1BJQ0tfU0laRSA9IDc1O1xuIiwiaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgSU5fREVCVUdfTU9ERSwgTElHSFRfR1JBWV9DU1NfQ09MT1IsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgTWVudU1hbmFnZXJBY3Rpb25zIH0gZnJvbSBcIi4uL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjb25zdCBkZWJ1ZyA9IChcbiAgICBJTl9ERUJVR19NT0RFXG4gICAgICAgID8gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRlc3QtYWxlcnRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3QgYWxlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhd2FpdCBNb2RhbE1hbmFnZXIuYWxlcnQoXCJUaGlzIGlzIGFuIGFsZXJ0LlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInRlc3QtY29uZmlybVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCBjb25maXJtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXdhaXQgTW9kYWxNYW5hZ2VyLmNvbmZpcm0oXCJUaGlzIGlzIGEgY29uZmlybWF0aW9uLlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInRlc3QtcHJvbXB0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IHByb21wdFwiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGF3YWl0IE1vZGFsTWFuYWdlci5wcm9tcHQoXCJUaGlzIGlzIGEgcHJvbXB0LlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInRlc3QtdG9hc3RcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3QgdG9hc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGlzIGEgdG9hc3QuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IExJR0hUX0dSQVlfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcIndpcGUtc3RvcmFnZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiV2lwZSBzdG9yYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuc3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJ3aXBlLXNhdmVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIldpcGUgbmFtZWQgc2F2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNhdmUgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzYXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVN0b3JhZ2VNYW5hZ2VyLmhhcyhcInNhdmVzOlwiICsgc2F2ZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTm8gc2F2ZXMgZXhpc3Qgd2l0aCB0aGF0IG5hbWUuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLmRlbGV0ZShcInNhdmVzOlwiICsgc2F2ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwic3RvcC1yZW5kZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlN0b3AgcmVuZGVyaW5nIHdpcmVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInN0YXJ0LXJlbmRlclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU3RhcnQgcmVuZGVyaW5nIHdpcmVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgIF1cbiAgICAgICAgOiBbXVxuKSBzYXRpc2ZpZXMgTWVudU1hbmFnZXJBY3Rpb25zO1xuIiwiaW1wb3J0IHsgTE9DS0VEX0ZPUl9URVNUSU5HLCBPUklHSU5fUE9JTlQgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBNZW51TWFuYWdlckFjdGlvbiB9IGZyb20gXCIuLi9tYW5hZ2Vycy9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGNoaXBzIH0gZnJvbSBcIi4uL3JlaWZpZWQvY2hpcHNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGlzcGxheSB9IGZyb20gXCIuLi9yZWlmaWVkL0Rpc3BsYXlcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjb25zdCBpbnNlcnQgPSB7XG4gICAgXCJpbnNlcnQtY29tcG9uZW50XCI6IHtcbiAgICAgICAgbGFiZWw6IFwiSW5zZXJ0IGNvbXBvbmVudFwiLFxuICAgICAgICBrZXliaW5kOiBcIkFcIixcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIkVudGVyIHRoZSBjb21wb25lbnQncyBuYW1lOlwiKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGNoaXAgPSBjaGlwcy5nZXQobmFtZS50b1VwcGVyQ2FzZSgpKTtcblxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY2hpcFxuICAgICAgICAgICAgICAgID8gbmV3IENvbXBvbmVudChSZWZsZWN0LmNvbnN0cnVjdChjaGlwLCBbXSksIE9SSUdJTl9QT0lOVClcbiAgICAgICAgICAgICAgICA6IG5hbWUudG9VcHBlckNhc2UoKSA9PT0gXCJESVNQTEFZXCJcbiAgICAgICAgICAgICAgICA/IG5ldyBEaXNwbGF5KClcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQpIHJldHVybiBNb2RhbE1hbmFnZXIuYWxlcnQoXCJObyBjb21wb25lbnQgd2FzIGZvdW5kIHdpdGggdGhhdCBuYW1lLlwiKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhjb21wb25lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShjb21wb25lbnQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBwYXJzZUZsb2F0KHdpZHRoKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogZS5jbGllbnRZIC0gcGFyc2VGbG9hdChoZWlnaHQpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgIH0sXG59IHNhdGlzZmllcyBNZW51TWFuYWdlckFjdGlvbjtcbiIsImltcG9ydCB7IElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSwgTE9DS0VEX0ZPUl9URVNUSU5HLCBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgTWVudU1hbmFnZXJBY3Rpb24gfSBmcm9tIFwiLi4vbWFuYWdlcnMvTWVudU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NlbGVjdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjb25zdCBpbyA9IHtcbiAgICBcIm5ldy1pbnB1dFwiOiB7XG4gICAgICAgIGxhYmVsOiBcIk5ldyBpbnB1dFwiLFxuICAgICAgICBrZXliaW5kOiBcIklcIixcbiAgICAgICAgY2FsbGJhY2s6IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IG5ldyBJbnB1dCh7XG4gICAgICAgICAgICAgICAgeDogZS5jbGllbnRYIC0gSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgICAgICB5OiBlLmNsaWVudFkgLSBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKGlucHV0KTtcblxuICAgICAgICAgICAgICAgICAgICBpbnB1dC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgXCJuZXctb3V0cHV0XCI6IHtcbiAgICAgICAgbGFiZWw6IFwiTmV3IG91dHB1dFwiLFxuICAgICAgICBrZXliaW5kOiBcIk9cIixcbiAgICAgICAgY2FsbGJhY2s6IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBuZXcgT3V0cHV0KHtcbiAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgICAgICB5OiBlLmNsaWVudFkgLSBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQob3V0cHV0KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKG91dHB1dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3Qob3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUob3V0cHV0KTtcblxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICB9LFxufSBzYXRpc2ZpZXMgTWVudU1hbmFnZXJBY3Rpb247XG4iLCJpbXBvcnQgeyBNZW51TWFuYWdlckFjdGlvbnMgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTWVudU1hbmFnZXJcIjtcbmltcG9ydCB7IGRlYnVnIH0gZnJvbSBcIi4vZGVidWdcIjtcbmltcG9ydCB7IGluc2VydCB9IGZyb20gXCIuL2luc2VydFwiO1xuaW1wb3J0IHsgaW8gfSBmcm9tIFwiLi9pb1wiO1xuaW1wb3J0IHsgc2VyZGUgfSBmcm9tIFwiLi9zZXJkZVwiO1xuXG5leHBvcnQgY29uc3QgbWVudTogTWVudU1hbmFnZXJBY3Rpb25zID0gW2luc2VydCwgaW8sIHNlcmRlLCAuLi5kZWJ1Z107XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBJU19NQUNfT1MsIExJR0hUX0dSQVlfQ1NTX0NPTE9SLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGZyb21GaWxlLCBzYXZlRGlhZ3JhbSB9IGZyb20gXCIuLi9maWxlc1wiO1xuaW1wb3J0IHsga2V5YmluZHMgfSBmcm9tIFwiLi4va2V5YmluZHMva2V5YmluZHNcIjtcbmltcG9ydCB7IE1lbnVNYW5hZ2VyQWN0aW9uIH0gZnJvbSBcIi4uL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU3RvcmFnZU1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU3RvcmFnZU1hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi9tZW51XCI7XG5cbmV4cG9ydCBjb25zdCBzZXJkZSA9IHtcbiAgICBcImNvcHktdXJsXCI6IHtcbiAgICAgICAgbGFiZWw6IFwiQ29weSBsaW5rXCIsXG4gICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIEtcIiA6IFwiQ3RybCBLXCIsXG4gICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBocmVmQXNVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLnNldChcImlubGluZVwiLCBidG9hKHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSkpKTtcblxuICAgICAgICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoaHJlZkFzVXJsLmhyZWYpO1xuXG4gICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkNvcGllZCBkaWFncmFtIGxpbmsgdG8gY2xpcGJvYXJkLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBMSUdIVF9HUkFZX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIFwic2F2ZS10b1wiOiB7XG4gICAgICAgIGxhYmVsOiBcIlNhdmUgd2l0aCBuYW1lXCIsXG4gICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIFNcIiA6IFwiQ3RybCBTXCIsXG4gICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzYXZlID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIldoYXQgc2hvdWxkIGJlIHRoZSBuYW1lIG9mIHRoaXMgc2F2ZT9cIik7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2F2ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuO1xuXG4gICAgICAgICAgICBhd2FpdCBTYW5kYm94TWFuYWdlci5zYXZlVG8oc2F2ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGhyZWZBc1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cbiAgICAgICAgICAgIGhyZWZBc1VybC5zZWFyY2hQYXJhbXMuc2V0KFwic2F2ZVwiLCBzYXZlKTtcblxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUodW5kZWZpbmVkLCBcIlwiLCBocmVmQXNVcmwpO1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgXCJsb2FkLWZyb21cIjoge1xuICAgICAgICBsYWJlbDogXCJMb2FkIGZyb20gc2F2ZXNcIixcbiAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggT1wiIDogXCJDdHJsIE9cIixcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNhdmUgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiV2hpY2ggc2F2ZSB3b3VsZCB5b3UgbGlrZSB0byBsb2FkP1wiKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzYXZlICE9PSBcInN0cmluZ1wiKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmICghU3RvcmFnZU1hbmFnZXIuaGFzKFwic2F2ZXM6XCIgKyBzYXZlKSkgcmV0dXJuIE1vZGFsTWFuYWdlci5hbGVydChcIk5vIHNhdmUgd2FzIGZvdW5kIHdpdGggdGhhdCBuYW1lLlwiKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucmVzZXQoKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoeyBrZXliaW5kcywgbWVudSwgc2F2ZSB9KTtcblxuICAgICAgICAgICAgY29uc3QgaHJlZkFzVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblxuICAgICAgICAgICAgaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJzYXZlXCIsIHNhdmUpO1xuXG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh1bmRlZmluZWQsIFwiXCIsIGhyZWZBc1VybCk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBcInNhdmUtYXNcIjoge1xuICAgICAgICBsYWJlbDogXCJTYXZlIGFzIGZpbGVcIixcbiAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFNcIiA6IFwiQ3RybCBTaGlmdCBTXCIsXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpLCB7XG4gICAgICAgICAgICAgICAgaHJlZjogVVJMLmNyZWF0ZU9iamVjdFVSTChcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJsb2IoW3NhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSldLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBkb3dubG9hZDogYGdhdGVzaW0tJHtEYXRlLm5vdygpfS5qc29uYCxcbiAgICAgICAgICAgIH0pLmNsaWNrKCk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBcImltcG9ydC1mcm9tXCI6IHtcbiAgICAgICAgbGFiZWw6IFwiSW1wb3J0IGZyb20gZmlsZVwiLFxuICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggT1wiIDogXCJDdHJsIFNoaWZ0IE9cIixcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gT2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksIHsgdHlwZTogXCJmaWxlXCIgfSk7XG5cbiAgICAgICAgICAgIGlucHV0LmNsaWNrKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBuZXcgUHJvbWlzZTxGaWxlIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4gcmVzb2x2ZShpbnB1dC5maWxlcz8uWzBdID8/IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghZmlsZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJObyBmaWxlIHdhcyBwcm92aWRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJhdyA9IGF3YWl0IG5ldyBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4gcmVzb2x2ZShyZWFkZXIucmVzdWx0Py50b1N0cmluZygpID8/IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIXJhdylcbiAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gcmVhZCB0aGUgZmlsZS5cIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICAgIHJlc3VsdDogW3NldHRpbmdzLCBjb21wb25lbnRzLCB3aXJlc10sXG4gICAgICAgICAgICB9ID0gZnJvbUZpbGUocmF3KTtcblxuICAgICAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucmVzZXQoKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoe1xuICAgICAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgICAgIG1lbnUsXG4gICAgICAgICAgICAgICAgc2F2ZTogXCJzYW5kYm94XCIsXG4gICAgICAgICAgICAgICAgaW5pdGlhbDogW2NvbXBvbmVudHMhLCB3aXJlcyFdLFxuICAgICAgICAgICAgICAgIG92ZXJyaWRlU2F2ZUlmRXhpc3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7fSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5hcHBseVJhd1NldHRpbmdzKHNldHRpbmdzISk7XG5cbiAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcInNhdmVzOlwiICsgXCJzYW5kYm94XCIsIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSkpO1xuICAgICAgICB9LFxuICAgIH0sXG59IHNhdGlzZmllcyBNZW51TWFuYWdlckFjdGlvbjtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIENPVU5URVJfR0VORVJBVE9SLCBJTl9ERUJVR19NT0RFLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZyB9IGZyb20gXCIuL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGNoaXBzIH0gZnJvbSBcIi4vcmVpZmllZC9jaGlwc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi9yZWlmaWVkL0Rpc3BsYXlcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZERpYWdyYW0gPSB7XG4gICAgc2V0dGluZ3M6IHtcbiAgICAgICAgW1wiRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRcIl06IGJvb2xlYW47XG4gICAgfTtcbiAgICBjb21wb25lbnRzOiAoXG4gICAgICAgIHwge1xuICAgICAgICAgICAgICByZWlmaWVkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHBlcm1hbmVudDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgdHlwZTogXCJJTlBVVFwiO1xuICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIGlkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeTogbnVtYmVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgcGVybWFuZW50OiBib29sZWFuO1xuICAgICAgICAgICAgICB0eXBlOiBcIk9VVFBVVFwiO1xuICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIGlkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeTogbnVtYmVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgcGVybWFuZW50OiBib29sZWFuO1xuICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiO1xuICAgICAgICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICAgIGlucHV0czogeyBpZDogbnVtYmVyOyBhY3RpdmF0ZWQ6IGJvb2xlYW4gfVtdO1xuICAgICAgICAgICAgICBvdXRwdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIHg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeTogbnVtYmVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgcGVybWFuZW50OiBib29sZWFuO1xuICAgICAgICAgICAgICB0eXBlOiBcIkRJU1BMQVlcIjtcbiAgICAgICAgICAgICAgaW5wdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIG91dHB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgcmFkaXg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgIClbXTtcbiAgICB3aXJlczogeyBmcm9tOiBudW1iZXI7IHRvOiBudW1iZXIgfVtdO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEaWFncmFtKGNvbXBvbmVudHM6IFJlaWZpZWRbXSwgd2lyZXM6IFdpcmluZ1tdKSB7XG4gICAgY29uc3QgaWQgPSBDT1VOVEVSX0dFTkVSQVRPUigpO1xuXG4gICAgY29uc3QgaWRzID0gbmV3IE1hcDxFbGVtZW50LCBudW1iZXI+KCk7XG5cbiAgICBjb25zdCBkYXRhOiBTZXJpYWxpemVkRGlhZ3JhbSA9IHtcbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIFtcIkRyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkXCJdOiBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCxcbiAgICAgICAgfSxcbiAgICAgICAgY29tcG9uZW50czogY29tcG9uZW50cy5tYXAoKGNvbXBvbmVudCwgcmVpZmllZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KSB7XG4gICAgICAgICAgICAgICAgaWRzLnNldChjb21wb25lbnQuZWxlbWVudCwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIklOUFVUXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2YXRlZDogY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpLFxuICAgICAgICAgICAgICAgICAgICBpZDogaWRzLmdldChjb21wb25lbnQuZWxlbWVudCkhLFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgIGlkcy5zZXQoY29tcG9uZW50LmVsZW1lbnQsIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpZmllZCxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBjb21wb25lbnQucGVybWFuZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJPVVRQVVRcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVkOiBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZHMuZ2V0KGNvbXBvbmVudC5lbGVtZW50KSEsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpZmllZCxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBjb21wb25lbnQucGVybWFuZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJDT01QT05FTlRcIixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogY29tcG9uZW50LmNoaXAubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBjb21wb25lbnQuaW5wdXRzLm1hcCgoaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChpLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQoaSkhLCBhY3RpdmF0ZWQ6IGkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBjb21wb25lbnQub3V0cHV0cy5tYXAoKG8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5zZXQobywgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGlkOiBpZHMuZ2V0KG8pISwgYWN0aXZhdGVkOiBvLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSB9O1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpZmllZCxcbiAgICAgICAgICAgICAgICAgICAgcGVybWFuZW50OiBjb21wb25lbnQucGVybWFuZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJESVNQTEFZXCIsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0czogY29tcG9uZW50LmlucHV0cy5tYXAoKGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5zZXQoaSwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGlkOiBpZHMuZ2V0KGkpISwgYWN0aXZhdGVkOiBpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSB9O1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0czogY29tcG9uZW50Lm91dHB1dHMubWFwKChvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KG8sIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChvKSEsIGFjdGl2YXRlZDogby5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIHJhZGl4OiBjb21wb25lbnQucmFkaXgsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHNlcmlhbGl6ZSBkaWFncmFtLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIFJlaWZpZWQgY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICB9KSxcbiAgICAgICAgd2lyZXM6IHdpcmVzXG4gICAgICAgICAgICAuZmlsdGVyKCh3aXJlKSA9PiAhd2lyZS5kZXN0cm95ZWQpXG4gICAgICAgICAgICAubWFwKCh3aXJlKSA9PiAoe1xuICAgICAgICAgICAgICAgIGZyb206IGlkcy5nZXQod2lyZS5mcm9tKSEsXG4gICAgICAgICAgICAgICAgdG86IGlkcy5nZXQod2lyZS50bykhLFxuICAgICAgICAgICAgfSkpLFxuICAgIH07XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSwgdW5kZWZpbmVkLCBJTl9ERUJVR19NT0RFID8gNCA6IHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRmlsZShcbiAgICBmaWxlOiBzdHJpbmcsXG4pOlxuICAgIHwgeyBlcnJvcjogc3RyaW5nOyByZXN1bHQ6IFtdIH1cbiAgICB8IHsgZXJyb3I6IHVuZGVmaW5lZDsgcmVzdWx0OiBbc2V0dGluZ3M6IFNlcmlhbGl6ZWREaWFncmFtW1wic2V0dGluZ3NcIl0sIGNvbXBvbmVudHM6IFJlaWZpZWRbXSwgd2lyZXM6IFdpcmluZ1tdXSB9IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShmaWxlKTtcblxuICAgICAgICB2YWxpZGF0ZShkYXRhKTtcblxuICAgICAgICBjb25zdCBlbGVtZW50cyA9IG5ldyBNYXA8bnVtYmVyLCBFbGVtZW50PigpO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBkYXRhLmNvbXBvbmVudHMubWFwKChyYXcpID0+IHtcbiAgICAgICAgICAgIGlmIChyYXcudHlwZSA9PT0gXCJJTlBVVFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBuZXcgSW5wdXQocmF3KTtcblxuICAgICAgICAgICAgICAgIGlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaWQsIGlucHV0LmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhdy5wZXJtYW5lbnQgPyBpbnB1dC5wZXJtYW5lbnQoKSA6IGlucHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmF3LnR5cGUgPT09IFwiT1VUUFVUXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBuZXcgT3V0cHV0KHJhdyk7XG5cbiAgICAgICAgICAgICAgICBvdXRwdXQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pZCwgb3V0cHV0LmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhdy5wZXJtYW5lbnQgPyBvdXRwdXQucGVybWFuZW50KCkgOiBvdXRwdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyYXcudHlwZSA9PT0gXCJESVNQTEFZXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNwbGF5ID0gbmV3IERpc3BsYXkocmF3LCByYXcuaW5wdXRzLmxlbmd0aCwgcmF3LnJhZGl4KTtcblxuICAgICAgICAgICAgICAgIGRpc3BsYXkuaW5wdXRzLmZvckVhY2goKGlucHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5pbnB1dHNbaW5kZXhdLmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pbnB1dHNbaW5kZXhdLmlkLCBpbnB1dCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBkaXNwbGF5Lm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcub3V0cHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3Lm91dHB1dHNbaW5kZXhdLmlkLCBvdXRwdXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhdy5wZXJtYW5lbnQgPyBkaXNwbGF5LnBlcm1hbmVudCgpIDogZGlzcGxheTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudChuZXcgKGNoaXBzLmdldChyYXcubmFtZSkhKSgpLCByYXcpO1xuXG4gICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLmZvckVhY2goKGlucHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmlucHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaW5wdXRzW2luZGV4XS5pZCwgaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbXBvbmVudC5vdXRwdXRzLmZvckVhY2goKG91dHB1dCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcub3V0cHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcub3V0cHV0c1tpbmRleF0uaWQsIG91dHB1dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJhdy5wZXJtYW5lbnQgPyBjb21wb25lbnQucGVybWFuZW50KCkgOiBjb21wb25lbnQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHdpcmVzID0gZGF0YS53aXJlcy5tYXAoKHsgZnJvbSwgdG8gfSkgPT4gbmV3IFdpcmluZyhlbGVtZW50cy5nZXQoZnJvbSkhLCBlbGVtZW50cy5nZXQodG8pISkpO1xuXG4gICAgICAgIHJldHVybiB7IHJlc3VsdDogW2RhdGEuc2V0dGluZ3MsIHJlaWZpZWQsIHdpcmVzXSwgZXJyb3I6IHVuZGVmaW5lZCB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIHsgZXJyb3I6IGUubWVzc2FnZSwgcmVzdWx0OiBbXSB9O1xuXG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIkZhaWxlZCB0byBwcm9jZXNzIGZpbGUuXCIsIHJlc3VsdDogW10gfTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKGRhdGE6IHVua25vd24pOiBhc3NlcnRzIGRhdGEgaXMgU2VyaWFsaXplZERpYWdyYW0ge1xuICAgIGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBub3QgYW4gb2JqZWN0LlwiKTtcblxuICAgIGlmICghKFwic2V0dGluZ3NcIiBpbiBkYXRhKSkgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBtaXNzaW5nIHByb2plY3Qgc2V0dGluZ3MuXCIpO1xuXG4gICAgaWYgKHR5cGVvZiBkYXRhLnNldHRpbmdzICE9PSBcIm9iamVjdFwiIHx8ICFkYXRhLnNldHRpbmdzKSB0aHJvdyBuZXcgRXJyb3IoXCJQcm9qZWN0IHNldHRpbmdzIHNob3VsZCBiZSBhbiBvYmplY3QuXCIpO1xuXG4gICAgaWYgKCEoXCJjb21wb25lbnRzXCIgaW4gZGF0YSkpIHRocm93IG5ldyBFcnJvcihcIkRhdGEgaXMgbWlzc2luZyBjb21wb25lbnRzLlwiKTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLmNvbXBvbmVudHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbm90IGFuIGFycmF5LlwiKTtcblxuICAgIGlmICghKFwid2lyZXNcIiBpbiBkYXRhKSkgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBtaXNzaW5nIHdpcmVzLlwiKTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLndpcmVzKSkgdGhyb3cgbmV3IEVycm9yKFwiV2lyZXMgZGF0YSBpcyBub3QgYW4gYXJyYXkuXCIpO1xuXG4gICAgaWYgKCEoXCJEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZFwiIGluIGRhdGEuc2V0dGluZ3MpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIHNldHRpbmcgJ0RyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkJy5cIik7XG5cbiAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBkYXRhLmNvbXBvbmVudHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgIGlmICghY29tcG9uZW50IHx8IHR5cGVvZiBjb21wb25lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIG11c3QgYW4gb2JqZWN0LlwiKTtcblxuICAgICAgICBpZiAoIShcInJlaWZpZWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyByZWlmaWVkIGlkLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5yZWlmaWVkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJSZWlmaWVkIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgIGlmICghKFwicGVybWFuZW50XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50cyBkYXRhIGlzIG1pc3NpbmcgcGVybWFuZW5jZSBzdGF0dXMuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnBlcm1hbmVudCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBwZXJtYW5lbmNlIG11c3QgYmUgYSBib29sZWFuLlwiKTtcblxuICAgICAgICBpZiAoIShcInR5cGVcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHR5cGUuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnR5cGUgIT09IFwic3RyaW5nXCIgfHwgIVtcIklOUFVUXCIsIFwiT1VUUFVUXCIsIFwiQ09NUE9ORU5UXCIsIFwiRElTUExBWVwiXS5pbmNsdWRlcyhjb21wb25lbnQudHlwZSkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbXBvbmVudCB0eXBlLlwiKTtcblxuICAgICAgICBpZiAoIShcInhcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHggY29vcmRpbmF0ZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQueCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHggY29vcmRpbmF0ZSBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICBpZiAoIShcInlcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHkgY29vcmRpbmF0ZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQueSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHkgY29vcmRpbmF0ZSBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICBzd2l0Y2ggKGNvbXBvbmVudC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiSU5QVVRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJPVVRQVVRcIjoge1xuICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gZGF0YSBpcyBtaXNzaW5nIGlkcy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSS9PIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcIkNPTVBPTkVOVFwiOiB7XG4gICAgICAgICAgICAgICAgaWYgKCEoXCJpbnB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgZGF0YSBpcyBtaXNzaW5nIGlucHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50LmlucHV0cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBpbnB1dHMgZGF0YSBtdXN0IGJlIGFuIGFycmF5LlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwib3V0cHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3Npbmcgb3V0cHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50Lm91dHB1dHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgb3V0cHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJuYW1lXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBjaGlwIG5hbWUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQubmFtZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiQ2hpcCBuYW1lIG11c3QgYmUgYSBzdHJpbmcuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlwcy5oYXMoY29tcG9uZW50Lm5hbWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlwIG5hbWUgZG9lc24ndCBleGlzdC5cIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBDaGlwID0gY2hpcHMuZ2V0KGNvbXBvbmVudC5uYW1lLnRyaW0oKS50b1VwcGVyQ2FzZSgpKSE7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmlucHV0cy5sZW5ndGggIT09IENoaXAuSU5QVVRTKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgaW5wdXRzIGRvZXMgbm90IG1hdGNoIGNoaXAgaW5wdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQub3V0cHV0cy5sZW5ndGggIT09IENoaXAuT1VUUFVUUylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IG91dHB1dHMgZG9lcyBub3QgbWF0Y2ggY2hpcCBvdXRwdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW5wdXQgb2YgY29tcG9uZW50LmlucHV0cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbnB1dCB8fCB0eXBlb2YgaW5wdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIGlucHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGlkLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0LmlkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiYWN0aXZhdGVkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuYWN0aXZhdGVkICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQWN0aXZhdGlvbiBzdGF0dXMgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgb3V0cHV0IG9mIGNvbXBvbmVudC5vdXRwdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmlkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiYWN0aXZhdGVkXCIgaW4gb3V0cHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG91dHB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFwiRElTUExBWVwiOiB7XG4gICAgICAgICAgICAgICAgaWYgKCEoXCJyYWRpeFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgZGF0YSBpcyBtaXNzaW5nIGRpc3BsYXkgcmFkaXguXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQucmFkaXggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgcmFkaXggbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcImlucHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgZGF0YSBpcyBtaXNzaW5nIGlucHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50LmlucHV0cykpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgaW5wdXRzIGRhdGEgbXVzdCBiZSBhbiBhcnJheS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcIm91dHB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJEaXNwbGF5IGRhdGEgaXMgbWlzc2luZyBvdXRwdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnQub3V0cHV0cykpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgb3V0cHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbnB1dCBvZiBjb21wb25lbnQuaW5wdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdXRwdXQgb2YgY29tcG9uZW50Lm91dHB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpZHMgPSBkYXRhLmNvbXBvbmVudHMuZmxhdE1hcDxudW1iZXI+KChjb21wb25lbnQpID0+XG4gICAgICAgIGNvbXBvbmVudC50eXBlID09PSBcIkNPTVBPTkVOVFwiIHx8IGNvbXBvbmVudC50eXBlID09PSBcIkRJU1BMQVlcIlxuICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQuaW5wdXRzLm1hcCgoeyBpZCB9OiB7IGlkOiBudW1iZXIgfSkgPT4gaWQpLFxuICAgICAgICAgICAgICAgICAgLi4uY29tcG9uZW50Lm91dHB1dHMubWFwKCh7IGlkIH06IHsgaWQ6IG51bWJlciB9KSA9PiBpZCksXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIDogY29tcG9uZW50LmlkLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHdpcmUgb2YgZGF0YS53aXJlcyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCF3aXJlIHx8IHR5cGVvZiB3aXJlICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgbXVzdCBiZSBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwiZnJvbVwiIGluIHdpcmUpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgaXMgbWlzc2luZyB0aGUgY29tcG9uZW50IGl0IHN0YXJ0cyBmcm9tLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUuZnJvbSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIG11c3QgcmVmZXJlbmNlIG51bWVyaWMgaWRzLlwiKTtcblxuICAgICAgICBpZiAoIShcInRvXCIgaW4gd2lyZSkpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBpcyBtaXNzaW5nIHRoZSB0YXJnZXQgY29tcG9uZW50LlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUudG8gIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBtdXN0IHJlZmVyZW5jZSBudW1lcmljIGlkcy5cIik7XG5cbiAgICAgICAgaWYgKCFpZHMuaW5jbHVkZXMod2lyZS5mcm9tKSB8fCAhaWRzLmluY2x1ZGVzKHdpcmUudG8pKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgcmVmZXJlbmNlcyBpbnZhbGlkIGlkcy5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgY29uc3RhbnRzIGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi9jb250ZXh0bWVudS9tZW51XCI7XG5pbXBvcnQgeyBmcm9tRmlsZSB9IGZyb20gXCIuL2ZpbGVzXCI7XG5pbXBvcnQgeyBrZXliaW5kcyB9IGZyb20gXCIuL2tleWJpbmRzL2tleWJpbmRzXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IHByZW1hZGUgfSBmcm9tIFwiLi9wcmVtYWRlXCI7XG5pbXBvcnQgeyBhdHRhY2hTdHlsZXMgfSBmcm9tIFwiLi9zdHlsaW5nL2F0dGFjaGVyXCI7XG5cbk9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgY29uc3RhbnRzKTtcblxuYXdhaXQgYXR0YWNoU3R5bGVzKCk7XG5cbmNvbnN0IGhyZWZBc1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cbmNvbnN0IHNob3VsZExvYWRJbmxpbmUgPSBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLmdldChcImlubGluZVwiKTtcblxuaWYgKHNob3VsZExvYWRJbmxpbmUpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBpbmxpbmVkID0gYXRvYihzaG91bGRMb2FkSW5saW5lKTtcblxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIHJlc3VsdDogW3NldHRpbmdzLCBjb21wb25lbnRzLCB3aXJpbmdzXSxcbiAgICAgICAgfSA9IGZyb21GaWxlKGlubGluZWQpO1xuXG4gICAgICAgIGlmIChlcnJvcikgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBpbml0aWFsOiBbY29tcG9uZW50cyEsIHdpcmluZ3MhXSB9KTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5hcHBseVJhd1NldHRpbmdzKHNldHRpbmdzISk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHsga2V5YmluZHMsIG1lbnUsIHNhdmU6IFwic2FuZGJveFwiIH0pO1xuXG4gICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICBtZXNzYWdlOiBcIkRpYWdyYW0gaXMgbm90IGNvcnJlY3RseSBlbmNvZGVkLlwiLFxuICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGhyZWZBc1VybC5zZWFyY2hQYXJhbXMuZGVsZXRlKFwiaW5saW5lXCIpO1xuXG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHVuZGVmaW5lZCwgXCJcIiwgaHJlZkFzVXJsKTtcbiAgICB9XG59IGVsc2Uge1xuICAgIGNvbnN0IHNhdmUgPSBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLmdldChcInNhdmVcIik7XG5cbiAgICBpZiAoc2F2ZSkge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBzYXZlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHNob3VsZExvYWRQcmVtYWRlID0gaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJwcmVtYWRlXCIpO1xuXG4gICAgICAgIGlmIChzaG91bGRMb2FkUHJlbWFkZSAmJiBwcmVtYWRlLmhhcyhzaG91bGRMb2FkUHJlbWFkZS50cmltKCkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgIHByZW1hZGUuZ2V0KHNob3VsZExvYWRQcmVtYWRlLnRyaW0oKS50b0xvd2VyQ2FzZSgpKSEoeyBuYW1lOiBzaG91bGRMb2FkUHJlbWFkZS50cmltKCkudG9Mb3dlckNhc2UoKSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHsga2V5YmluZHMsIG1lbnUsIHNhdmU6IFwic2FuZGJveFwiIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2hvdWxkTG9hZFByZW1hZGUpIHtcbiAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vIHByZW1hZGVzIHdlcmUgZm91bmQgd2l0aCB0aGF0IG5hbWUuXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLmRlbGV0ZShcInByZW1hZGVcIik7XG5cbiAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh1bmRlZmluZWQsIFwiXCIsIGhyZWZBc1VybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MsIExPQ0tFRF9GT1JfVEVTVElORyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NlbGVjdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSBcIi4uL3JlaWZpZWQvRGlzcGxheVwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvT3V0cHV0XCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgY29uc3QgYmFja3NwYWNlID0ge1xuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJDb250cm9sK1hcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgYmFja3NwYWNlW1wiQmFja3NwYWNlXCJdKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIk1ldGErWFwiLCAoKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgYmFja3NwYWNlW1wiQmFja3NwYWNlXCJdKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrU2hpZnQrWFwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBiYWNrc3BhY2VbXCJTaGlmdCtCYWNrc3BhY2VcIl0oKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStTaGlmdCtYXCIsICgpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBiYWNrc3BhY2VbXCJTaGlmdCtCYWNrc3BhY2VcIl0oKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiU2hpZnQrQmFja3NwYWNlXCIsICgpID0+IHtcbiAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICBpZiAoIVNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcbiAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IGNvbXBvbmVudC5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IGNvbXBvbmVudC5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50IHx8IGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSkpO1xuXG4gICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGVkLmNsb25lKHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9KSxcbiAgICBbXCJCYWNrc3BhY2VcIl06ICgpID0+IHtcbiAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICBpZiAoIVNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcbiAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBjb21wb25lbnQuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSBjb21wb25lbnQuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hdHRhY2goKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSk7XG5cbiAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH0sXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBHUklEX1NJWkUsIExJR0hUX0dSQVlfQ1NTX0NPTE9SLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgY29uc3QgYmVoYXZpb3IgPSB7XG4gICAgW1wiS2V5R1wiXTogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gWy4uLlJlaWZpZWQuYWN0aXZlXTtcbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gY29tcG9uZW50cy5tYXAoKHsgcG9zIH0pID0+IHBvcyk7XG5cbiAgICAgICAgY29uc3Qgc2l6ZSA9IEdSSURfU0laRTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQgPSAhRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQ7XG5cbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBNYXRoLmZsb29yKGNvbXBvbmVudC5wb3MueCAvIHNpemUpICogc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IE1hdGguZmxvb3IoY29tcG9uZW50LnBvcy55IC8gc2l6ZSkgKiBzaXplLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBUb2dnbGVkIHNuYXAgdG8gZ3JpZCAobm93ICR7RHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWR9KSBbR10uYCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IExJR0hUX0dSQVlfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkID0gIURyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkO1xuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5mb3JFYWNoKChjb21wb25lbnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiIsImltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmNvbnN0IHVuZG8gPSAoKSA9PiB7XG4gICAgU2FuZGJveE1hbmFnZXIucG9wSGlzdG9yeSgpO1xufTtcblxuY29uc3QgcmVkbyA9ICgpID0+IHtcbiAgICBTYW5kYm94TWFuYWdlci5yZWRvSGlzdG9yeSgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGhpc3RvcnkgPSB7XG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrU2hpZnQrWlwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIk1ldGErU2hpZnQrWlwiLCAoKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJDb250cm9sK1pcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgdW5kbygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK1pcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHVuZG8oKTtcbiAgICB9KSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiIsImltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1N0b3JhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgY29uc3QgaG93dG91c2UgPSB7XG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIlNoaWZ0K1NsYXNoXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy9UT0RPOiBhZGQgc3R1ZmZcbiAgICAgICAgYXdhaXQgTW9kYWxNYW5hZ2VyLnBvcHVwKGh0bWxgXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxoMT5nYXRlc2ltPC9oMT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgKTtcblxuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJ1c2VkaGVscFwiLCBcInRydWVcIik7XG4gICAgfSksXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUsIExPQ0tFRF9GT1JfVEVTVElORywgT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NlbGVjdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjb25zdCBpbyA9IHtcbiAgICBbXCJLZXlJXCJdOiAoKSA9PiB7XG4gICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgY29uc3QgaW5wdXQgPSBuZXcgSW5wdXQoe1xuICAgICAgICAgICAgeDogTW91c2VNYW5hZ2VyLm1vdXNlLnggLSBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgeTogTW91c2VNYW5hZ2VyLm1vdXNlLnkgLSBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQoaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3QoaW5wdXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKGlucHV0KTtcblxuICAgICAgICAgICAgICAgIGlucHV0LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBbXCJLZXlPXCJdOiAoKSA9PiB7XG4gICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gbmV3IE91dHB1dCh7XG4gICAgICAgICAgICB4OiBNb3VzZU1hbmFnZXIubW91c2UueCAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgeTogTW91c2VNYW5hZ2VyLm1vdXNlLnkgLSBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKG91dHB1dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KG91dHB1dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUob3V0cHV0KTtcblxuICAgICAgICAgICAgICAgIG91dHB1dC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH0sXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBiYWNrc3BhY2UgfSBmcm9tIFwiLi9iYWNrc3BhY2VcIjtcbmltcG9ydCB7IGJlaGF2aW9yIH0gZnJvbSBcIi4vYmVoYXZpb3JcIjtcbmltcG9ydCB7IGhpc3RvcnkgfSBmcm9tIFwiLi9oaXN0b3J5XCI7XG5pbXBvcnQgeyBob3d0b3VzZSB9IGZyb20gXCIuL2hvd3RvdXNlXCI7XG5pbXBvcnQgeyBpbyB9IGZyb20gXCIuL2lvXCI7XG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tIFwiLi9zZWxlY3RcIjtcbmltcG9ydCB7IHNlcmRlIH0gZnJvbSBcIi4vc2VyZGVcIjtcblxuZXhwb3J0IGNvbnN0IGtleWJpbmRzOiBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD4gPSBPYmplY3QuYXNzaWduKFxuICAgIHt9LFxuICAgIGJhY2tzcGFjZSxcbiAgICBiZWhhdmlvcixcbiAgICBoaXN0b3J5LFxuICAgIGhvd3RvdXNlLFxuICAgIGlvLFxuICAgIHNlbGVjdCxcbiAgICBzZXJkZSxcbik7XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NlbGVjdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3QgPSB7XG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrQVwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IFNlbGVjdGlvbk1hbmFnZXIuYWRkU2VsZWN0aW9uKGNvbXBvbmVudCkpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK0FcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gU2VsZWN0aW9uTWFuYWdlci5hZGRTZWxlY3Rpb24oY29tcG9uZW50KSk7XG4gICAgfSksXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBzZXJkZSBhcyBtZW51IH0gZnJvbSBcIi4uL2NvbnRleHRtZW51L3NlcmRlXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjb25zdCBzZXJkZSA9IHtcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtLXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcImNvcHktdXJsXCJdLmNhbGxiYWNrKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIk1ldGErS1wiLCAoZSkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBtZW51W1wiY29weS11cmxcIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtTXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcInNhdmUtdG9cIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStTXCIsIChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJzYXZlLXRvXCJdLmNhbGxiYWNrKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrT1wiLCAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJsb2FkLWZyb21cIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStPXCIsIChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJsb2FkLWZyb21cIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtTaGlmdCtTXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcInNhdmUtYXNcIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStTaGlmdCtTXCIsIChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJzYXZlLWFzXCJdLmNhbGxiYWNrKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrU2hpZnQrT1wiLCAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJpbXBvcnQtZnJvbVwiXS5jYWxsYmFjaygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK1NoaWZ0K09cIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcImltcG9ydC1mcm9tXCJdLmNhbGxiYWNrKCk7XG4gICAgfSksXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuL1N0b3JhZ2VNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXJrbW9kZU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSAjY2hhbmdlcyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyByZWFkb25seSAja2V5ID0gXCJzZXR0aW5ncy5kYXJrbW9kZVwiO1xuXG4gICAgc3RhdGljIGdldCAjZW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIFN0b3JhZ2VNYW5hZ2VyLmdldCh0aGlzLiNrZXkpID8/IGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXQgI2VuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KHRoaXMuI2tleSwgdmFsdWUpO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQuaW5uZXJUZXh0ID0gdmFsdWUgPyBcIvCfjJVcIiA6IFwi8J+MkVwiO1xuXG4gICAgICAgIHRoaXMuI2NoYW5nZXMuZm9yRWFjaCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQpKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJkYXJrbW9kZVwiLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBlbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jZW5hYmxlZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0ICNlbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCJidXR0b24uZGFya21vZGVcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbkNoYW5nZShydW46ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jY2hhbmdlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmQ2hhbmdlKHJ1bjogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNjaGFuZ2VzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyAjbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuI2VuYWJsZWQgPSAhdGhpcy4jZW5hYmxlZDtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBcIm5vbmVcIjtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI2VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwiXCI7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLiNlbmFibGVkID0gdGhpcy4jZW5hYmxlZDtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LmlubmVyVGV4dCA9IHRoaXMuI2VuYWJsZWQgPyBcIvCfjJVcIiA6IFwi8J+MkVwiO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2xpc3RlbmVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jbGlzdGVuZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyB0b2dnbGUodmFsdWU/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuI2VuYWJsZWQgPSB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiID8gdmFsdWUgOiAhdGhpcy4jZW5hYmxlZDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBFVkVOX0RBUktFUl9HUkFZX0NTU19DT0xPUiwgRVZFTl9MSUdIVEVSX0dSQVlfQ1NTX0NPTE9SLCBHUklEX1NJWkUsIE9SSUdJTl9QT0lOVCB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdhdGVzIH0gZnJvbSBcIi4uL3JlaWZpZWQvY2hpcHNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IERhcmttb2RlTWFuYWdlciB9IGZyb20gXCIuL0Rhcmttb2RlTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4vS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFF1aWNrUGlja01hbmFnZXIgfSBmcm9tIFwiLi9RdWlja1BpY2tNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4vU2VsZWN0aW9uTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgRHJhZ2dpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2RyYWdnZWQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICN3YXRjaGVkID0gbmV3IE1hcCgpO1xuXG4gICAgc3RhdGljICNtb3VzZSA9IHsgeDogLTEsIHk6IC0xLCBveDogLTEsIG95OiAtMSwgaXg6IC0xLCBpeTogLTEsIGRvd246IGZhbHNlIH07XG5cbiAgICBzdGF0aWMgI3RvcGxlZnQ6IEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgI29yaWdpbmFsOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgI2Rvd25wb3MgPSB7IHg6IC0xLCB5OiAtMSB9O1xuXG4gICAgc3RhdGljICNwb3NpdGlvbnM6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfVtdIHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljICNzbmFwVG9HcmlkID0gZmFsc2U7XG5cbiAgICBzdGF0aWMgZ2V0IHNuYXBUb0dyaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzbmFwVG9HcmlkO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXQgc25hcFRvR3JpZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLiNzbmFwVG9HcmlkID0gdmFsdWU7XG5cbiAgICAgICAgdGhpcy5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc25hcFRvR3JpZEJhc2VkVXBkYXRlKHsgZm9yY2VDbGVhciA9IGZhbHNlIH06IHsgZm9yY2VDbGVhcj86IGJvb2xlYW4gfSA9IHsgZm9yY2VDbGVhcjogZmFsc2UgfSkge1xuICAgICAgICBpZiAodGhpcy5zbmFwVG9HcmlkICYmICFmb3JjZUNsZWFyKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubWluV2lkdGggPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGNvbXBvbmVudC5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gcGFyc2VGbG9hdChzdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLm1pbldpZHRoID0gTWF0aC5jZWlsKHdpZHRoIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLm1pbkhlaWdodCA9IE1hdGguY2VpbChoZWlnaHQgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRTaXplID0gR1JJRF9TSVpFICsgXCJweCBcIiArIEdSSURfU0laRSArIFwicHhcIjtcblxuICAgICAgICAgICAgaWYgKERhcmttb2RlTWFuYWdlci5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAke0VWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SfSAxcHgsIHRyYW5zcGFyZW50IDFweCksIGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICR7RVZFTl9EQVJLRVJfR1JBWV9DU1NfQ09MT1J9IDFweCwgdHJhbnNwYXJlbnQgMXB4KWA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgJHtFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1J9IDFweCwgdHJhbnNwYXJlbnQgMXB4KSwgbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgJHtFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1J9IDFweCwgdHJhbnNwYXJlbnQgMXB4KWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubWluV2lkdGggPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcIlwiO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyB3YXRjaChlbGVtZW50OiBIVE1MRWxlbWVudCwgdGFyZ2V0ID0gZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmRhdGFzZXQud2F0Y2hlZCA9IFwidHJ1ZVwiO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNkcmFnZ2VkID0gZWxlbWVudDtcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5kYXRhc2V0LmRyYWdnZWQgPSBcInRydWVcIjtcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5jdXJzb3IgPSBcImdyYWJiaW5nXCI7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLiNkcmFnZ2VkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2UuaXggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZS5peSA9IGUuY2xpZW50WTtcblxuICAgICAgICAgICAgaWYgKCFTZWxlY3Rpb25NYW5hZ2VyLmlzU2VsZWN0ZWQoZWxlbWVudCkpIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3ggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3kgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy4jcG9zaXRpb25zID0gWy4uLlNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWRdLm1hcCgodGFyZ2V0KSA9PiB0YXJnZXQucG9zKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF0uc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBheCA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBheSA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ4ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ5ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWQgPSBNYXRoLnNxcnQoYXggKiBheCArIGF5ICogYXkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiZCA9IE1hdGguc3FydChieCAqIGJ4ICsgYnkgKiBieSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZCAtIGJkO1xuICAgICAgICAgICAgICAgIH0pWzBdLmVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3ggPSBlLmNsaWVudFggLSBib3VuZHMueDtcbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veSA9IGUuY2xpZW50WSAtIGJvdW5kcy55O1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jdG9wbGVmdCA9IHRvcGxlZnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuI29yaWdpbmFsID0geyB4OiByZWN0LmxlZnQsIHk6IHJlY3QudG9wIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdG91Y2hzdGFydCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBbdG91Y2hdID0gZS50b3VjaGVzO1xuXG4gICAgICAgICAgICB0aGlzLiNkcmFnZ2VkID0gZWxlbWVudDtcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5kYXRhc2V0LmRyYWdnZWQgPSBcInRydWVcIjtcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5jdXJzb3IgPSBcImdyYWJiaW5nXCI7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLiNkcmFnZ2VkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZS54ID0gdG91Y2guY2xpZW50WDtcbiAgICAgICAgICAgIHRoaXMuI21vdXNlLnkgPSB0b3VjaC5jbGllbnRZO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZS5peCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZS5peSA9IHRvdWNoLmNsaWVudFk7XG5cbiAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm94ID0gdG91Y2guY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veSA9IHRvdWNoLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy4jcG9zaXRpb25zID0gWy4uLlNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWRdLm1hcCgodGFyZ2V0KSA9PiB0YXJnZXQucG9zKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF0uc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBheCA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBheSA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ4ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ5ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWQgPSBNYXRoLnNxcnQoYXggKiBheCArIGF5ICogYXkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiZCA9IE1hdGguc3FydChieCAqIGJ4ICsgYnkgKiBieSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZCAtIGJkO1xuICAgICAgICAgICAgICAgIH0pWzBdLmVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3ggPSB0b3VjaC5jbGllbnRYIC0gYm91bmRzLng7XG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3kgPSB0b3VjaC5jbGllbnRZIC0gYm91bmRzLnk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiN0b3BsZWZ0ID0gdG9wbGVmdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4jb3JpZ2luYWwgPSB7IHg6IHJlY3QubGVmdCwgeTogcmVjdC50b3AgfTtcbiAgICAgICAgfTtcblxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd24sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRvdWNoc3RhcnQsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLiN3YXRjaGVkLnNldCh0YXJnZXQsIHsgbW91c2Vkb3duLCB0b3VjaHN0YXJ0IH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBmb3JnZXQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGZvcmNlPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuI3dhdGNoZWQuZ2V0KGVsZW1lbnQpO1xuXG4gICAgICAgIGlmICghbGlzdGVuZXIgJiYgIWZvcmNlKSB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbm90IGN1cnJlbnRseSBiZWluZyB3YXRjaGVkLmApO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZGF0YXNldC53YXRjaGVkO1xuXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXIubW91c2Vkb3duLCB7IGNhcHR1cmU6IHRydWUgfSk7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGxpc3RlbmVyLnRvdWNoc3RhcnQsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgdGhpcy4jd2F0Y2hlZC5kZWxldGUoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuI3dhdGNoZWQuZm9yRWFjaCgoXywgZWxlbWVudCkgPT4gdGhpcy5mb3JnZXQoZWxlbWVudCkpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlID0geyB4OiAtMSwgeTogLTEsIG94OiAtMSwgb3k6IC0xLCBpeDogLTEsIGl5OiAtMSwgZG93bjogZmFsc2UgfTtcblxuICAgICAgICB0aGlzLiNkb3ducG9zID0geyB4OiAtMSwgeTogLTEgfTtcblxuICAgICAgICB0aGlzLiN0b3BsZWZ0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI2RyYWdnZWQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jb3JpZ2luYWwgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jcG9zaXRpb25zID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuZGVhZmVuKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgdGhpcy5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy4jdG91Y2htb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLiN0b3VjaHN0YXJ0KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy4jdG91Y2hlbmQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWFmZW4oKSB7XG4gICAgICAgIHRoaXMuc25hcFRvR3JpZEJhc2VkVXBkYXRlKHsgZm9yY2VDbGVhcjogdHJ1ZSB9KTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy4jdG91Y2htb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLiN0b3VjaHN0YXJ0KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy4jdG91Y2hlbmQpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICBpZiAodGhpcy4jZHJhZ2dlZCkge1xuICAgICAgICAgICAgaWYgKERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUubGVmdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3gpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50b3AgPVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiN0b3BsZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSB0aGlzLiN0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0LmxlZnQgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQudG9wIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5sZWZ0ID0gdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLnRvcCA9IHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IHRoaXMuI3RvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UuaXggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLml5ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XG5cbiAgICAgICAgY29uc3QgaXNPbkludmFsaWRUYXJnZXQgPSBbXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1pbnB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLW91dHB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmRpc3BsYXlcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5jb250ZXh0bWVudVwiKSxcbiAgICAgICAgXS5maW5kKChlbGVtZW50KSA9PiBlbGVtZW50ICE9PSBudWxsKSE7XG5cbiAgICAgICAgaWYgKCFpc09uSW52YWxpZFRhcmdldCAmJiBlLmJ1dHRvbiA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJLZXlBXCIpKSB7XG4gICAgICAgICAgICAgICAgUXVpY2tQaWNrTWFuYWdlci5hY3RpdmF0ZShcbiAgICAgICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgICAgICAgICAgZ2F0ZXMubWFwKChnYXRlKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGdhdGUuTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KFJlZmxlY3QuY29uc3RydWN0KGdhdGUsIFtdKSwgT1JJR0lOX1BPSU5UKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKGNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGdldENvbXB1dGVkU3R5bGUoY29tcG9uZW50LmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBwYXJzZUZsb2F0KHdpZHRoKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIHBhcnNlRmxvYXQoaGVpZ2h0KSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy4jZG93bnBvcy54ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgICAgIHRoaXMuI2Rvd25wb3MueSA9IGUuY2xpZW50WTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI21vdXNlLmRvd24gPSB0cnVlO1xuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNldXAgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIGlmICh0aGlzLiNkcmFnZ2VkKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignW2RhdGEtZHJhZ2dlZD1cInRydWVcIl0nKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGUuZGF0YXNldC5kcmFnZ2VkO1xuXG4gICAgICAgICAgICAgICAgZS5zdHlsZS5jdXJzb3IgPSBcIlwiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuI2RyYWdnZWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2UgPSB0aGlzLiNtb3VzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbCA9IHRoaXMuI29yaWdpbmFsITtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gR1JJRF9TSVpFO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLnggIT09IG1vdXNlLml4IHx8IG1vdXNlLnkgIT09IG1vdXNlLml5KVxuICAgICAgICAgICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5sZWZ0ID0gTWF0aC5mbG9vcigobW91c2UueCAtIG1vdXNlLm94IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBNYXRoLmZsb29yKChtb3VzZS55IC0gbW91c2Uub3kgLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBNYXRoLmZsb29yKChvcmlnaW5hbC54IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBNYXRoLmZsb29yKChvcmlnaW5hbC55IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBtb3VzZS54IC0gbW91c2Uub3ggLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gbW91c2UueSAtIG1vdXNlLm95IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBvcmlnaW5hbC54IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IG9yaWdpbmFsLnkgLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiN0b3BsZWZ0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2UgPSB0aGlzLiNtb3VzZTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRzID0gWy4uLlNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWRdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMuI3Bvc2l0aW9ucyE7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IHRoaXMuI3RvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IEdSSURfU0laRTtcblxuICAgICAgICAgICAgICAgIGlmIChtb3VzZS54ICE9PSBtb3VzZS5peCB8fCBtb3VzZS55ICE9PSBtb3VzZS5peSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBNYXRoLmZsb29yKChtb3VzZS54IC0gbW91c2Uub3gpIC8gc2l6ZSkgKiBzaXplICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5mbG9vcigobW91c2UueSAtIG1vdXNlLm95KSAvIHNpemUpICogc2l6ZSArIG9mZnNldC50b3AgLSB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHBvc2l0aW9uc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IG1vdXNlLnggLSBtb3VzZS5veCArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IG1vdXNlLnkgLSBtb3VzZS5veSArIG9mZnNldC50b3AgLSB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHBvc2l0aW9uc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy4jZG93bnBvcy54ICE9PSAtMSAmJlxuICAgICAgICAgICAgdGhpcy4jZG93bnBvcy55ICE9PSAtMSAmJlxuICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnggIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueSAhPT0gLTFcbiAgICAgICAgKVxuICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RBbGxJbihEcmFnZ2luZ01hbmFnZXIuI2Rvd25wb3MsIE1vdXNlTWFuYWdlci5tb3VzZSk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UgPSB7IHg6IC0xLCB5OiAtMSwgb3g6IC0xLCBveTogLTEsIGl4OiAtMSwgaXk6IC0xLCBkb3duOiBmYWxzZSB9O1xuXG4gICAgICAgIHRoaXMuI2Rvd25wb3MgPSB7IHg6IC0xLCB5OiAtMSB9O1xuXG4gICAgICAgIHRoaXMuI3RvcGxlZnQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNvcmlnaW5hbCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNwb3NpdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjdG91Y2htb3ZlID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgW3RvdWNoXSA9IGUudG91Y2hlcztcblxuICAgICAgICB0aGlzLiNtb3VzZS54ID0gdG91Y2guY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IHRvdWNoLmNsaWVudFk7XG5cbiAgICAgICAgaWYgKHRoaXMuI2RyYWdnZWQpIHtcbiAgICAgICAgICAgIGlmIChEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCkge1xuICAgICAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLmxlZnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUudG9wID1cbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy4jdG9wbGVmdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gdGhpcy4jdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3gpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldC5sZWZ0IC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0LnRvcCAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUubGVmdCA9IHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50b3AgPSB0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiN0b3BsZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSB0aGlzLiN0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSArIG9mZnNldC50b3AgLSB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICN0b3VjaHN0YXJ0ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgW3RvdWNoXSA9IGUudG91Y2hlcztcblxuICAgICAgICB0aGlzLiNtb3VzZS54ID0gdG91Y2guY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IHRvdWNoLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UuaXggPSB0b3VjaC5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS5peSA9IHRvdWNoLmNsaWVudFk7XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcblxuICAgICAgICBjb25zdCBpc09uSW52YWxpZFRhcmdldCA9IFtcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLWlucHV0XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJidXR0b24uYm9hcmQtb3V0cHV0XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJkaXYuY29tcG9uZW50XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJkaXYuZGlzcGxheVwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbnRleHRtZW51XCIpLFxuICAgICAgICBdLmZpbmQoKGVsZW1lbnQpID0+IGVsZW1lbnQgIT09IG51bGwpITtcblxuICAgICAgICBpZiAoIWlzT25JbnZhbGlkVGFyZ2V0KSB7XG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggPSB0b3VjaC5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jZG93bnBvcy55ID0gdG91Y2guY2xpZW50WTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI21vdXNlLmRvd24gPSB0cnVlO1xuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3RvdWNoZW5kID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgW3RvdWNoXSA9IGUuY2hhbmdlZFRvdWNoZXM7XG5cbiAgICAgICAgdGhpcy4jbW91c2UueCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSB0b3VjaC5jbGllbnRZO1xuXG4gICAgICAgIGlmICh0aGlzLiNkcmFnZ2VkKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignW2RhdGEtZHJhZ2dlZD1cInRydWVcIl0nKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGUuZGF0YXNldC5kcmFnZ2VkO1xuXG4gICAgICAgICAgICAgICAgZS5zdHlsZS5jdXJzb3IgPSBcIlwiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuI2RyYWdnZWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2UgPSB0aGlzLiNtb3VzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbCA9IHRoaXMuI29yaWdpbmFsITtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gR1JJRF9TSVpFO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLnggIT09IG1vdXNlLml4IHx8IG1vdXNlLnkgIT09IG1vdXNlLml5KVxuICAgICAgICAgICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5sZWZ0ID0gTWF0aC5mbG9vcigobW91c2UueCAtIG1vdXNlLm94IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBNYXRoLmZsb29yKChtb3VzZS55IC0gbW91c2Uub3kgLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBNYXRoLmZsb29yKChvcmlnaW5hbC54IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBNYXRoLmZsb29yKChvcmlnaW5hbC55IC0gMSkgLyBzaXplKSAqIHNpemUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBtb3VzZS54IC0gbW91c2Uub3ggLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gbW91c2UueSAtIG1vdXNlLm95IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBvcmlnaW5hbC54IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IG9yaWdpbmFsLnkgLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiN0b3BsZWZ0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2UgPSB0aGlzLiNtb3VzZTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRzID0gWy4uLlNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWRdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMuI3Bvc2l0aW9ucyE7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IHRoaXMuI3RvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IEdSSURfU0laRTtcblxuICAgICAgICAgICAgICAgIGlmIChtb3VzZS54ICE9PSBtb3VzZS5peCB8fCBtb3VzZS55ICE9PSBtb3VzZS5peSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBNYXRoLmZsb29yKChtb3VzZS54IC0gbW91c2Uub3gpIC8gc2l6ZSkgKiBzaXplICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5mbG9vcigobW91c2UueSAtIG1vdXNlLm95KSAvIHNpemUpICogc2l6ZSArIG9mZnNldC50b3AgLSB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHBvc2l0aW9uc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IG1vdXNlLnggLSBtb3VzZS5veCArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IG1vdXNlLnkgLSBtb3VzZS5veSArIG9mZnNldC50b3AgLSB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHBvc2l0aW9uc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy4jZG93bnBvcy54ICE9PSAtMSAmJlxuICAgICAgICAgICAgdGhpcy4jZG93bnBvcy55ICE9PSAtMSAmJlxuICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnggIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueSAhPT0gLTFcbiAgICAgICAgKVxuICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RBbGxJbihEcmFnZ2luZ01hbmFnZXIuI2Rvd25wb3MsIE1vdXNlTWFuYWdlci5tb3VzZSk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UgPSB7IHg6IC0xLCB5OiAtMSwgb3g6IC0xLCBveTogLTEsIGl4OiAtMSwgaXk6IC0xLCBkb3duOiBmYWxzZSB9O1xuXG4gICAgICAgIHRoaXMuI2Rvd25wb3MgPSB7IHg6IC0xLCB5OiAtMSB9O1xuXG4gICAgICAgIHRoaXMuI3RvcGxlZnQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNvcmlnaW5hbCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNwb3NpdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgfTtcblxuICAgIHN0YXRpYyBnZXQgZG93bnBvcygpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy4jZG93bnBvcyB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIEtleWJpbmRzTWFuYWdlciB7XG4gICAgc3RhdGljICNrZXltYXAgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcblxuICAgIHN0YXRpYyAja2V5Y2hvcmRzID0gbmV3IEFycmF5PFtzdHJpbmcsICgoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZClbXV0+KCk7XG5cbiAgICBzdGF0aWMgI2tleWRvd24gPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNrZXltYXAuc2V0KGUuY29kZSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGUubWV0YUtleSAmJiAoZS5jb2RlID09PSBcIlNoaWZ0TGVmdFwiIHx8IGUuY29kZSA9PT0gXCJTaGlmdFJpZ2h0XCIpICYmIElTX01BQ19PUylcbiAgICAgICAgICAgIHRoaXMuI2tleW1hcCA9IG5ldyBNYXAoWy4uLnRoaXMuI2tleW1hcC5lbnRyaWVzKCldLmZpbHRlcigoW2tleV0pID0+ICFrZXkuc3RhcnRzV2l0aChcIktleVwiKSkpO1xuXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICBjb25zdCBbY2hvcmQsIHJ1bnNdID1cbiAgICAgICAgICAgICAgICB0aGlzLiNrZXljaG9yZHMuZmluZCgoW2Nob3JkXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGNob3JkLnNwbGl0KFwiK1wiKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja1NoaWZ0ID0ga2V5cy5pbmNsdWRlcyhcIlNoaWZ0TGVmdFwiKSB8fCBrZXlzLmluY2x1ZGVzKFwiU2hpZnRSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tDdHJsID0ga2V5cy5pbmNsdWRlcyhcIkNvbnRyb2xMZWZ0XCIpIHx8IGtleXMuaW5jbHVkZXMoXCJDb250cm9sUmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrQWx0ID0ga2V5cy5pbmNsdWRlcyhcIkFsdExlZnRcIikgfHwga2V5cy5pbmNsdWRlcyhcIkFsdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja01ldGEgPSBrZXlzLmluY2x1ZGVzKFwiTWV0YUxlZnRcIikgfHwga2V5cy5pbmNsdWRlcyhcIk1ldGFSaWdodFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrU2hpZnQgJiYgZS5zaGlmdEtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrQ3RybCAmJiBlLmN0cmxLZXkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGVja0FsdCAmJiBlLmFsdEtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrTWV0YSAmJiBlLm1ldGFLZXkpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tTaGlmdCkga2V5cyA9IGtleXMuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJTaGlmdExlZnRcIiAmJiBrZXkgIT09IFwiU2hpZnRSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrQ3RybCkga2V5cyA9IGtleXMuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJDb250cm9sTGVmdFwiICYmIGtleSAhPT0gXCJDb250cm9sUmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja0FsdCkga2V5cyA9IGtleXMuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJBbHRMZWZ0XCIgJiYga2V5ICE9PSBcIkFsdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tNZXRhKSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIk1ldGFMZWZ0XCIgJiYga2V5ICE9PSBcIk1ldGFSaWdodFwiKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrU2hpZnQgPyBlLnNoaWZ0S2V5IDogdHJ1ZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIChjaGVja0N0cmwgPyBlLmN0cmxLZXkgOiB0cnVlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrQWx0ID8gZS5hbHRLZXkgOiB0cnVlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrTWV0YSA/IGUubWV0YUtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzLmV2ZXJ5KChrZXkpID0+IHRoaXMuI2tleW1hcC5nZXQoa2V5KSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KSA/PyBbXTtcblxuICAgICAgICAgICAgaWYgKHJ1bnMpIHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5raWxsTWVudSgpO1xuXG4gICAgICAgICAgICAgICAgcnVucy5mb3JFYWNoKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuXG4gICAgICAgICAgICAgICAgY2hvcmQhLnNwbGl0KFwiK1wiKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwiS2V5XCIpKSB0aGlzLiNrZXltYXAuZGVsZXRlKGtleSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc3RhdGljICNrZXl1cCA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5kZWxldGUoZS5jb2RlKTtcblxuICAgICAgICBpZiAoIWUubWV0YUtleSAmJiAoZS5jb2RlID09PSBcIk1ldGFMZWZ0XCIgfHwgZS5jb2RlID09PSBcIk1ldGFSaWdodFwiKSAmJiBJU19NQUNfT1MpIHRoaXMuI2tleW1hcC5jbGVhcigpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI2JsdXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5jbGVhcigpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLiNrZXlkb3duKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuI2tleXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy4jYmx1cik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlYWZlbigpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy4ja2V5ZG93bik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLiNrZXl1cCk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuI2JsdXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbktleUNob3JkKGNob3JkOiBzdHJpbmcsIHJ1bjogKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgY2hvcmQgPSBjaG9yZC5zcGxpdChcIitcIikuc29ydCgpLmpvaW4oXCIrXCIpO1xuXG4gICAgICAgIGlmICghdGhpcy4ja2V5Y2hvcmRzLmZpbmQoKFtrZXldKSA9PiBrZXkgPT09IGNob3JkKT8uWzFdLnB1c2gocnVuKSkgdGhpcy4ja2V5Y2hvcmRzLnB1c2goW2Nob3JkLCBbcnVuXV0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0tleURvd25BbmROb0ZvY3VzKGtleTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuI2tleW1hcC5nZXQoa2V5KSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5O1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0tleURvd24oa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy4ja2V5bWFwLmdldChrZXkpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy4ja2V5Y2hvcmRzID0gW107XG5cbiAgICAgICAgdGhpcy5kZWFmZW4oKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgZXhwYW5kPFMgZXh0ZW5kcyBzdHJpbmc+KGNob3JkOiBTKTogRXhwYW5kQ2hvcmQ8Uz5bXTtcbiAgICBzdGF0aWMgZXhwYW5kKGNob3JkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBjaG9yZC5zcGxpdChcIitcIik7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gXCJTaGlmdFwiIHx8IGtleSA9PT0gXCJDb250cm9sXCIgfHwga2V5ID09PSBcIkFsdFwiIHx8IGtleSA9PT0gXCJNZXRhXCIpXG4gICAgICAgICAgICByZXR1cm4gcmVzdC5sZW5ndGhcbiAgICAgICAgICAgICAgICA/IHRoaXMuZXhwYW5kKHJlc3Quam9pbihcIitcIikpLmZsYXRNYXAoKGtleXMpID0+IFtcbiAgICAgICAgICAgICAgICAgICAgICBbYCR7a2V5fUxlZnRgLCBrZXlzXS5qb2luKFwiK1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICBbYCR7a2V5fVJpZ2h0YCwga2V5c10uam9pbihcIitcIiksXG4gICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgIDogW2Ake2tleX1MZWZ0YCwgYCR7a2V5fVJpZ2h0YF07XG5cbiAgICAgICAgaWYgKGtleS5sZW5ndGggPT09IDEgJiYga2V5ID09PSBrZXkudG9VcHBlckNhc2UoKSlcbiAgICAgICAgICAgIHJldHVybiByZXN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgID8gdGhpcy5leHBhbmQocmVzdC5qb2luKFwiK1wiKSkuZmxhdE1hcCgoa2V5cykgPT4gW1tgS2V5JHtrZXl9YCwga2V5c10uam9pbihcIitcIildKVxuICAgICAgICAgICAgICAgIDogW2BLZXkke2tleX1gXTtcblxuICAgICAgICByZXR1cm4gW2Nob3JkXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXNzaWduPFMgZXh0ZW5kcyBzdHJpbmcsIFIgZXh0ZW5kcyAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD4oY2hvcmQ6IFMsIHJ1bjogUik6IEFzc2lnbkNob3JkPFMsIFI+O1xuICAgIHN0YXRpYyBhc3NpZ24oY2hvcmQ6IHN0cmluZywgcnVuOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICAgICAgdGhpcy5leHBhbmQoY2hvcmQpXG4gICAgICAgICAgICAgICAgLm1hcDxbU3RyaW5naWZpYWJsZSwgKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWRdPigoa2V5cykgPT4gW2tleXMsIHJ1bl0pXG4gICAgICAgICAgICAgICAgLmNvbmNhdChbW2Nob3JkLCBydW5dXSksXG4gICAgICAgICk7XG4gICAgfVxufVxuXG50eXBlIFNwbGl0PFMgZXh0ZW5kcyBzdHJpbmcsIEQgZXh0ZW5kcyBzdHJpbmcgPSBcIlwiLCBSIGV4dGVuZHMgcmVhZG9ubHkgdW5rbm93bltdID0gW10+ID0gUyBleHRlbmRzIFwiXCJcbiAgICA/IFJcbiAgICA6IFMgZXh0ZW5kcyBgJHtpbmZlciBBfSR7RH0ke2luZmVyIEJ9YFxuICAgID8gU3BsaXQ8QiwgRCwgWy4uLlIsIEFdPlxuICAgIDogWy4uLlIsIFNdO1xuXG50eXBlIFN0cmluZ2lmaWFibGUgPSBzdHJpbmcgfCBudW1iZXIgfCBiaWdpbnQgfCBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxudHlwZSBKb2luPEEsIFMgZXh0ZW5kcyBzdHJpbmcgPSBcIlwiLCBSIGV4dGVuZHMgc3RyaW5nID0gXCJcIj4gPSBBIGV4dGVuZHMgW2luZmVyIFggZXh0ZW5kcyBTdHJpbmdpZmlhYmxlLCAuLi5pbmZlciBZXVxuICAgID8gSm9pbjxZLCBTLCBSIGV4dGVuZHMgXCJcIiA/IFggOiBgJHtSfSR7U30ke1h9YD5cbiAgICA6IFI7XG5cbnR5cGUgRXhwYW5kQ2hvcmQ8UyBleHRlbmRzIHN0cmluZywgQSBleHRlbmRzIHN0cmluZ1tdID0gU3BsaXQ8UywgXCIrXCI+PiA9IEpvaW48XG4gICAge1xuICAgICAgICBbSyBpbiBrZXlvZiBBXTogQVtLXSBleHRlbmRzIFwiU2hpZnRcIiB8IFwiQ29udHJvbFwiIHwgXCJBbHRcIiB8IFwiTWV0YVwiXG4gICAgICAgICAgICA/IGAke0FbS119JHtcIkxlZnRcIiB8IFwiUmlnaHRcIn1gXG4gICAgICAgICAgICA6IFNwbGl0PEFbS10+W1wibGVuZ3RoXCJdIGV4dGVuZHMgMVxuICAgICAgICAgICAgPyBBW0tdIGV4dGVuZHMgVXBwZXJjYXNlPEFbS10+XG4gICAgICAgICAgICAgICAgPyBgS2V5JHtBW0tdfWBcbiAgICAgICAgICAgICAgICA6IEFbS11cbiAgICAgICAgICAgIDogQVtLXTtcbiAgICB9LFxuICAgIFwiK1wiXG4+O1xuXG50eXBlIEFzc2lnbkNob3JkPFMgZXh0ZW5kcyBzdHJpbmcsIFI+ID0ge1xuICAgIFtfIGluIFNdOiBSO1xufSAmIHtcbiAgICBbSyBpbiBFeHBhbmRDaG9yZDxTPiAmIFByb3BlcnR5S2V5XTogUjtcbn07XG4iLCJpbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgdHlwZSBNZW51TWFuYWdlckNvbnRleHQgPSB7XG4gICAgbWVudTogSFRNTEVsZW1lbnQ7XG4gICAgY2xpY2tzOiBNYXA8c3RyaW5nLCAoKSA9PiB2b2lkPjtcbiAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgbW91c2Vkb3duOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICAgICAgY29udGV4dG1lbnU6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgICAgICBjbGljazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQWN0aW9ucyA9IEFycmF5PFxuICAgIFJlY29yZDxzdHJpbmcsIHsgbGFiZWw6IHN0cmluZzsga2V5YmluZD86IHN0cmluZzsgY2FsbGJhY2s6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkIH0+XG4+O1xuXG5leHBvcnQgdHlwZSBNZW51TWFuYWdlckFjdGlvbiA9IE1lbnVNYW5hZ2VyQWN0aW9uc1tudW1iZXJdO1xuXG5leHBvcnQgY2xhc3MgTWVudU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSAjZWxlbWVudHMgPSBuZXcgTWFwPEhUTUxFbGVtZW50LCBNZW51TWFuYWdlckNvbnRleHQ+KCk7XG5cbiAgICBzdGF0aWMgI29wZW5lZDogTW91c2VFdmVudDtcblxuICAgIHN0YXRpYyB1c2UoXG4gICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICBhY3Rpb25zOiBNZW51TWFuYWdlckFjdGlvbnMsXG4gICAgKTogW3F1ZXVlTmV3Q29udGV4dDogKG5ld0NvbnRleHQ6IChwcmV2OiBNZW51TWFuYWdlckFjdGlvbnMpID0+IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4gdm9pZCwga2lsbE1lbnU6ICgpID0+IHZvaWRdIHtcbiAgICAgICAgY29uc3QgbWVudSA9IGh0bWxgPGRpdiBjbGFzcz1cImNvbnRleHRtZW51XCI+PC9kaXY+YDtcblxuICAgICAgICBjb25zdCBjbGlja3MgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgY29uc3Qgc2V0dXAgPSAoYWN0aW9uczogTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB7XG4gICAgICAgICAgICBjbGlja3MuY2xlYXIoKTtcblxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IGFjdGlvbnMuZmxhdE1hcCgocmVjb3JkKSA9PiBPYmplY3Qua2V5cyhyZWNvcmQpKTtcblxuICAgICAgICAgICAgaWYgKGtleXMubGVuZ3RoICE9PSBuZXcgU2V0KGtleXMpLnNpemUpIHRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZSBrZXlzIGluIG1lbnUgYWN0aW9ucy5cIik7XG5cbiAgICAgICAgICAgIG1lbnUuaW5uZXJIVE1MID0gYWN0aW9uc1xuICAgICAgICAgICAgICAgIC5tYXAoKHJlY29yZCkgPT5cbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMocmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoW25hbWUsIHsgbGFiZWwsIGtleWJpbmQgfV0pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGA8YnV0dG9uIGNsYXNzPVwiJHtuYW1lfVwiPiR7bGFiZWx9PHAgY2xhc3M9XCJtZW51LWtleWJpbmRcIj4ke2tleWJpbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChrZXkpID0+IGA8c3Bhbj4ke2tleX08L3NwYW4+YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcIil9PC9wPjwvYnV0dG9uPmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBgPGJ1dHRvbiBjbGFzcz1cIiR7bmFtZX1cIj4ke2xhYmVsfTwvYnV0dG9uPmAsXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmpvaW4oJzxkaXYgY2xhc3M9XCJiclwiPjwvZGl2PicpO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goKHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlY29yZCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsaWNrID0gcmVjb3JkW2tleV0uY2FsbGJhY2suYmluZCh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4gY2xpY2sodGhpcy4jb3BlbmVkKTtcblxuICAgICAgICAgICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLlwiICsga2V5KSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5cIiArIGtleSkhLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICAgICAgY2xpY2tzLnNldChrZXksIGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBjb250ZXh0OiBNZW51TWFuYWdlckFjdGlvbnMgfCB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3QgZ2V0QWN0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNvbnRleHQ7XG5cbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhY3Rpb25zO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgbWVudS5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1lbnUpO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBzZXR1cChnZXRBY3Rpb25zKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNvcGVuZWQgPSBlO1xuXG4gICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY29udGV4dG1lbnUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBzZXR1cChnZXRBY3Rpb25zKCkpO1xuXG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gZS5jbGllbnRYICsgXCJweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS50b3AgPSBlLmNsaWVudFkgKyBcInB4XCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBzZXR1cChnZXRBY3Rpb25zKCkpO1xuXG4gICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlZG93bik7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGNvbnRleHRtZW51KTtcbiAgICAgICAgbWVudS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2spO1xuICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBjbGljayk7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudHMuc2V0KGVsZW1lbnQsIHsgbWVudSwgY2xpY2tzLCBsaXN0ZW5lcnM6IHsgbW91c2Vkb3duLCBjb250ZXh0bWVudSwgY2xpY2sgfSB9KTtcblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgKG5ld0NvbnRleHQ6IChwcmV2OiBNZW51TWFuYWdlckFjdGlvbnMpID0+IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBuZXdDb250ZXh0LmNhbGwodW5kZWZpbmVkLCBbLi4uYWN0aW9uc10pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXR1cChnZXRBY3Rpb25zKCkpO1xuXG4gICAgICAgICAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW1vdmUoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgeyBtZW51LCBjbGlja3MsIGxpc3RlbmVycyB9ID0gdGhpcy4jZWxlbWVudHMuZ2V0KGVsZW1lbnQpID8/IHt9O1xuXG4gICAgICAgIGlmICghbWVudSB8fCAhY2xpY2tzIHx8ICFsaXN0ZW5lcnMpIHRocm93IG5ldyBFcnJvcihgRWxlbWVudHMgYXJlIG5vdCBiZWluZyBhZmZlY3RlZC5gKTtcblxuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXJzLm1vdXNlZG93bik7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVycy5jb250ZXh0bWVudSk7XG4gICAgICAgIG1lbnUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVycy5jbGljayk7XG4gICAgICAgIG1lbnUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVycy5jbGljayk7XG5cbiAgICAgICAgQXJyYXkuZnJvbShjbGlja3MpLmZvckVhY2goKFtrZXksIGxpc3RlbmVyXSkgPT4ge1xuICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yKFwiLlwiICsga2V5KSEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIG1lbnUucXVlcnlTZWxlY3RvcihcIi5cIiArIGtleSkhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1lbnUucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIE1vZGFsTWFuYWdlciB7XG4gICAgc3RhdGljIGdldCBjb250YWluZXIoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1jb250YWluZXJcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyAjb25Nb2RhbE1vdW50KCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPD0gMCkgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgICAgICBlbHNlIHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgI29uTW9kYWxSZXNvbHZlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IDw9IDApIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkIS5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtaW5hY3RpdmVcIik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkIS5jbGFzc0xpc3QuY29udGFpbnMoXCJtb2RhbC1hbGVydFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGFsZXJ0KG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBhbGVydCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtYWxlcnRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1vZGFsLW1lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1va1wiPk9rPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChhbGVydCk7XG5cbiAgICAgICAgYWxlcnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRvbmUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYWxlcnQucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBlc2MgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsaWNrb3V0ID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IHRoaXMuY29udGFpbmVyIHx8IHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQgIT09IGFsZXJ0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICBhbGVydC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRvbmUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgY29uZmlybShtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy4jb25Nb2RhbE1vdW50KCk7XG5cbiAgICAgICAgY29uc3QgY29uZmlybSA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtY29uZmlybVwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLWNhbmNlbFwiPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZmlybSk7XG5cbiAgICAgICAgY29uZmlybS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUoZmFsc2UpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmFkZChmaW5pc2gpO1xuXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKHZhbHVlOiBib29sZWFuKSA9PiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uZmlybS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxSZXNvbHZlZCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maXJtLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxSZXNvbHZlZCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgY29uc3QgY2xpY2tvdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gdGhpcy5jb250YWluZXIgfHwgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCAhPT0gY29uZmlybSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgICAgICBjb25maXJtLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jb25Nb2RhbFJlc29sdmVkKCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgIGNvbmZpcm0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtY2FuY2VsXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcihmYWxzZSkpO1xuXG4gICAgICAgICAgICBjb25maXJtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcih0cnVlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBwcm9tcHQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI29uTW9kYWxNb3VudCgpO1xuXG4gICAgICAgIGNvbnN0IHByb21wdCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtY29uZmlybVwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibW9kYWwtaW5wdXRcIiB0eXBlPVwidGV4dFwiIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLWNhbmNlbFwiPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocHJvbXB0KTtcblxuICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9tcHQucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBlc2MgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsaWNrb3V0ID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IHRoaXMuY29udGFpbmVyIHx8IHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQgIT09IHByb21wdCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgcHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWlucHV0XCIpIS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWNhbmNlbFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiLm1vZGFsLWlucHV0XCIpIS52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIHBvcHVwKGNvbnRlbnQ6IHN0cmluZyB8IEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jb25Nb2RhbE1vdW50KCk7XG5cbiAgICAgICAgY29uc3QgcG9wdXAgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsIG1vZGFsLWFsZXJ0IG1vZGFsLXBvcHVwXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLW1lc3NhZ2VcIj4ke3R5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiID8gY29udGVudCA6IGNvbnRlbnQub3V0ZXJIVE1MfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1va1wiPk9rPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwb3B1cCk7XG5cbiAgICAgICAgcG9wdXAucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRvbmUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcG9wdXAucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBlc2MgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsaWNrb3V0ID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT09IHRoaXMuY29udGFpbmVyIHx8IHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQgIT09IHBvcHVwKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICBwb3B1cC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRvbmUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgTW91c2VNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI21vdXNlID0geyB4OiAwLCB5OiAwIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlZG93bnMgPSBuZXcgU2V0PChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2V1cHMgPSBuZXcgU2V0PChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjdG91Y2hzdGFydHMgPSBuZXcgU2V0PChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjdG91Y2hlbmRzID0gbmV3IFNldDwoZTogVG91Y2hFdmVudCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyAjbW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcbiAgICB9O1xuXG4gICAgc3RhdGljICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI21vdXNldXAgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIHRoaXMuI21vdXNldXBzLmZvckVhY2goKGwpID0+IGwuY2FsbCh1bmRlZmluZWQsIGUpKTtcbiAgICB9O1xuXG4gICAgc3RhdGljICN0b3VjaG1vdmUgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICB9O1xuXG4gICAgc3RhdGljICN0b3VjaHN0YXJ0ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jdG91Y2hzdGFydHMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI3RvdWNoZW5kID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcblxuICAgICAgICB0aGlzLiN0b3VjaGVuZHMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgc3RhcnQoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLiN0b3VjaG1vdmUpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLiN0b3VjaHN0YXJ0KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuI3RvdWNoZW5kKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMuI3RvdWNobW92ZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuI3RvdWNoc3RhcnQpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy4jdG91Y2hlbmQpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlID0geyB4OiAwLCB5OiAwIH07XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcblxuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmNsZWFyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uTW91c2VEb3duKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuYWRkKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbk1vdXNlVXAoaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuYWRkKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZNb3VzZURvd24oaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5kZWxldGUoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZk1vdXNlVXAoaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZGVsZXRlKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvblRvdWNoU3RhcnQoaGFuZGxlcjogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jdG91Y2hzdGFydHMuYWRkKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvblRvdWNoRW5kKGhhbmRsZXI6IChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI3RvdWNoZW5kcy5hZGQoaGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZlRvdWNoU3RhcnQoaGFuZGxlcjogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jdG91Y2hzdGFydHMuZGVsZXRlKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZUb3VjaEVuZChoYW5kbGVyOiAoZTogVG91Y2hFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiN0b3VjaGVuZHMuZGVsZXRlKGhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgbW91c2UoKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMuI21vdXNlIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgR0VUX0dSQVlfQ09MT1IsIFFVSUNLUElDS19TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IHR5cGUgUXVpY2tQaWNrQ29udGV4dCA9IHtcbiAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgbW91c2V1cDogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIFF1aWNrUGlja0FjdGlvbnMgPSB7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBjYWxsYmFjazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG59W107XG5cbmV4cG9ydCBjbGFzcyBRdWlja1BpY2tNYW5hZ2VyIHtcbiAgICBzdGF0aWMgbGluZTogW2Zyb206IE1vdXNlRXZlbnQsIHRvOiBNb3VzZUV2ZW50XSB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyBhc3luYyBhY3RpdmF0ZShldmVudDogTW91c2VFdmVudCwgYWN0aW9uczogUXVpY2tQaWNrQWN0aW9ucykge1xuICAgICAgICBjb25zdCBxdWlja3BpY2sgPSBodG1sYDxkaXYgY2xhc3M9XCJxdWlja3BpY2tcIj48L2Rpdj5gO1xuXG4gICAgICAgIGNvbnN0IGtleXMgPSBhY3Rpb25zLm1hcCgoeyBsYWJlbCB9KSA9PiBsYWJlbCk7XG5cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoICE9PSBuZXcgU2V0KGtleXMpLnNpemUpIHRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZSBsYWJlbHMgaW4gcXVpY2twaWNrIGFjdGlvbnMuXCIpO1xuXG4gICAgICAgIHF1aWNrcGljay5pbm5lckhUTUwgPSBhY3Rpb25zXG4gICAgICAgICAgICAubWFwKCh7IGxhYmVsIH0sIGkpID0+IGA8ZGl2IGNsYXNzPVwicXVpY2twaWNrLWl0ZW0gaW5kZXgtJHtpfVwiPiR7bGFiZWx9PC9kaXY+YClcbiAgICAgICAgICAgIC5qb2luKFwiXCIpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2lyY2xlID0gaHRtbGBcbiAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicXVpY2twaWNrLWNpcmNsZVwiXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiJHtRVUlDS1BJQ0tfU0laRSAqIDJ9XCJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiJHtRVUlDS1BJQ0tfU0laRSAqIDJ9XCJcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXG4gICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgICAgICAgICAgICAgY3g9XCIke1FVSUNLUElDS19TSVpFfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjeT1cIiR7UVVJQ0tQSUNLX1NJWkV9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHI9XCIke1FVSUNLUElDS19TSVpFIC8gMiAtIDEgLSAxfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIke0dFVF9HUkFZX0NPTE9SKCl9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjJweFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICR7YWN0aW9ucy5tYXAoKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKCgyICogTWF0aC5QSSkgLyBhY3Rpb25zLmxlbmd0aCkgKiBpIC0gTWF0aC5QSSAvIDIgLSBNYXRoLlBJIC8gYWN0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVQYXRoID0gYE0ke01hdGguY29zKGFuZ2xlKSAqIChRVUlDS1BJQ0tfU0laRSAtIDEgLSAxKSArIFFVSUNLUElDS19TSVpFfSwke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguc2luKGFuZ2xlKSAqIChRVUlDS1BJQ0tfU0laRSAtIDEgLSAxKSArIFFVSUNLUElDS19TSVpFXG4gICAgICAgICAgICAgICAgICAgICAgICB9IEwke01hdGguY29zKGFuZ2xlKSAqIChRVUlDS1BJQ0tfU0laRSAvIDIgLSAxIC0gMSkgKyBRVUlDS1BJQ0tfU0laRX0sJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbihhbmdsZSkgKiAoUVVJQ0tQSUNLX1NJWkUgLyAyIC0gMSAtIDEpICsgUVVJQ0tQSUNLX1NJWkVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1gO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxwYXRoIGQ9XCIke2xpbmVQYXRofVwiIHN0eWxlPVwic3Ryb2tlOiAke0dFVF9HUkFZX0NPTE9SKCl9OyBzdHJva2Utd2lkdGg6IDJweDsgZmlsbDogbm9uZTtcIiAvPmA7XG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgcXVpY2twaWNrLmFwcGVuZENoaWxkKGNpcmNsZSk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gY2lyY2xlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgY2lyY2xlLnN0eWxlLmxlZnQgPSBldmVudC5jbGllbnRYIC0gd2lkdGggLyAyICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGNpcmNsZS5zdHlsZS50b3AgPSBldmVudC5jbGllbnRZIC0gaGVpZ2h0IC8gMiArIFwicHhcIjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9ICgoMiAqIE1hdGguUEkpIC8gYWN0aW9ucy5sZW5ndGgpICogaSAtIE1hdGguUEkgLyAyO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IE1hdGguY29zKGFuZ2xlKSAqIFFVSUNLUElDS19TSVpFO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSBNYXRoLnNpbihhbmdsZSkgKiBRVUlDS1BJQ0tfU0laRTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBxdWlja3BpY2sucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuaW5kZXgtXCIgKyBpKSE7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGkgKiAoMjAwIC8gYWN0aW9ucy5sZW5ndGgpICsgXCJtc1wiO1xuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBpICogKDIwMCAvIGFjdGlvbnMubGVuZ3RoKSArIFwibXNcIjtcblxuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IGV2ZW50LmNsaWVudFggKyAoMiAqIHgpIC8gMyAtIHdpZHRoIC8gMiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnRvcCA9IGV2ZW50LmNsaWVudFkgKyAoMiAqIHkpIC8gMyAtIGhlaWdodCAvIDIgKyBcInB4XCI7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gZXZlbnQuY2xpZW50WCArIHggLSB3aWR0aCAvIDIgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUudG9wID0gZXZlbnQuY2xpZW50WSArIHkgLSBoZWlnaHQgLyAyICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocXVpY2twaWNrKTtcblxuICAgICAgICBjb25zdCBtb3VzZW1vdmUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5saW5lID0gW2V2ZW50LCBlXTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2Vtb3ZlKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcIm1vdXNldXBcIixcbiAgICAgICAgICAgIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmh5cG90KGUuY2xpZW50WCAtIGV2ZW50LmNsaWVudFgsIGUuY2xpZW50WSAtIGV2ZW50LmNsaWVudFkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID49IFFVSUNLUElDS19TSVpFIC8gMikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIoZS5jbGllbnRZIC0gZXZlbnQuY2xpZW50WSwgZS5jbGllbnRYIC0gZXZlbnQuY2xpZW50WCkgKyBNYXRoLlBJIC8gMjtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbG9zZXN0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLnJvdW5kKGFuZ2xlIC8gKCgyICogTWF0aC5QSSkgLyBhY3Rpb25zLmxlbmd0aCkpICsgYWN0aW9ucy5sZW5ndGgpICUgYWN0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uc1tjbG9zZXN0XS5jYWxsYmFjay5jYWxsKHVuZGVmaW5lZCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHF1aWNrcGljay5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgb25jZTogdHJ1ZSB9LFxuICAgICAgICApO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwibW91c2VsZWF2ZVwiLFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHF1aWNrcGljay5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgb25jZTogdHJ1ZSB9LFxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFdhdGNoZWRTZXQgfSBmcm9tIFwiLi4vYXVnbWVudHMvV2F0Y2hlZFNldFwiO1xuaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgR1JJRF9TSVpFLCBJTl9ERUJVR19NT0RFLCBMSUdIVF9HUkFZX0NTU19DT0xPUiwgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBmcm9tRmlsZSwgc2F2ZURpYWdyYW0sIFNlcmlhbGl6ZWREaWFncmFtIH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IERpc3BsYXkgfSBmcm9tIFwiLi4vcmVpZmllZC9EaXNwbGF5XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBEYXJrbW9kZU1hbmFnZXIgfSBmcm9tIFwiLi9EYXJrbW9kZU1hbmFnZXJcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4vS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNZW51TWFuYWdlciwgTWVudU1hbmFnZXJBY3Rpb25zIH0gZnJvbSBcIi4vTWVudU1hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgTW91c2VNYW5hZ2VyIH0gZnJvbSBcIi4vTW91c2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4vU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgU3RvcmFnZU1hbmFnZXIgfSBmcm9tIFwiLi9TdG9yYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4vVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBVbmRvUmVkb01hbmFnZXIgfSBmcm9tIFwiLi9VbmRvUmVkb01hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuL1dpcmluZ01hbmFnZXJcIjtcblxudHlwZSBTYW5kYm94Q29uZmlnID0ge1xuICAgIGtleWJpbmRzPzogUmVjb3JkPHN0cmluZywgKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ+O1xuICAgIG1lbnU/OiBNZW51TWFuYWdlckFjdGlvbnM7XG4gICAgaW5pdGlhbD86IFtjb21wb25lbnRzOiBSZWlmaWVkW10sIHdpcmVzOiBXaXJpbmdbXV07XG4gICAgbGltaXRzPzoge1xuICAgICAgICBpbnB1dHM/OiBudW1iZXI7XG4gICAgICAgIG91dHB1dHM/OiBudW1iZXI7XG4gICAgICAgIHdpcmluZ3M/OiBudW1iZXI7XG4gICAgICAgIGNoaXBzPzogUmVjb3JkPHN0cmluZywgbnVtYmVyPjtcbiAgICAgICAgY2hpcHNUb3RhbD86IG51bWJlcjtcbiAgICAgICAgY29tcG9uZW50c1RvdGFsPzogbnVtYmVyO1xuICAgIH07XG4gICAgc3RhdGVzPzogeyBpbnB1dHM/OiBib29sZWFuW107IG91dHB1dHM/OiBib29sZWFuW107IGNhbGxiYWNrOiAoKSA9PiB2b2lkIH1bXTtcbiAgICBzYXZlPzogc3RyaW5nO1xuICAgIG92ZXJyaWRlU2F2ZUlmRXhpc3RzPzogYm9vbGVhbjtcbiAgICBjaGVja0ludGVydmFsPzogbnVtYmVyO1xuICAgIGNoZWNrU3RhdGU/OiAocmVpZmllZDogV2F0Y2hlZFNldDxSZWlmaWVkPiwgd2lyaW5nczogV2F0Y2hlZFNldDxXaXJpbmc+KSA9PiBib29sZWFuO1xuICAgIGlmU3RhdGVDaGVja2VkPzogKCkgPT4gdm9pZDtcbiAgICBzZXR0aW5ncz86IHsgc25hcFRvR3JpZD86IGJvb2xlYW4gfTtcbn07XG5cbmNvbnN0IGNhbGN1bGF0ZVJlaWZpZWRUb3RhbHMgPSAoc2V0OiBTZXQ8UmVpZmllZD4pID0+XG4gICAgWy4uLnNldF0ucmVkdWNlKFxuICAgICAgICAobWFwLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIElucHV0KSB7XG4gICAgICAgICAgICAgICAgbWFwLmlucHV0c1RvdGFsKys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0gaW5zdGFuY2VvZiBPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICBtYXAub3V0cHV0c1RvdGFsKys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0gaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICBtYXAuY2hpcHNUb3RhbCsrO1xuXG4gICAgICAgICAgICAgICAgbWFwLmNoaXBzLnNldChpdGVtLmNoaXAubmFtZSwgKG1hcC5jaGlwcy5nZXQoaXRlbS5jaGlwLm5hbWUpID8/IDApICsgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0gaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbWFwO1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnB1dHNUb3RhbDogMCxcbiAgICAgICAgICAgIG91dHB1dHNUb3RhbDogMCxcbiAgICAgICAgICAgIGNoaXBzVG90YWw6IDAsXG4gICAgICAgICAgICBjaGlwczogbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKSxcbiAgICAgICAgfSxcbiAgICApO1xuXG5leHBvcnQgY2xhc3MgU2FuZGJveE1hbmFnZXIge1xuICAgIHN0YXRpYyBxdWV1ZU5ld0NvbnRleHQ6IFJldHVyblR5cGU8dHlwZW9mIE1lbnVNYW5hZ2VyW1widXNlXCJdPlswXTtcbiAgICBzdGF0aWMga2lsbE1lbnU6IFJldHVyblR5cGU8dHlwZW9mIE1lbnVNYW5hZ2VyW1widXNlXCJdPlsxXTtcblxuICAgIHN0YXRpYyB3YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzID0gbmV3IFNldDwoKSA9PiB2b2lkPigpO1xuXG4gICAgc3RhdGljICNpbnRlcnZhbCA9IC0xO1xuICAgIHN0YXRpYyAjb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgI2hpc3RvcnkgPSBuZXcgQXJyYXk8W2NvbW1hbmQ6ICgpID0+IHZvaWQsIHJlZG86ICgpID0+IHZvaWRdPigpO1xuICAgIHN0YXRpYyAjcmVkb3MgPSBuZXcgQXJyYXk8W2NvbW1hbmQ6ICgpID0+IHZvaWQsIHJlZG86ICgpID0+IHZvaWRdPigpO1xuXG4gICAgc3RhdGljICNjb25maWc6IFNhbmRib3hDb25maWc7XG5cbiAgICBzdGF0aWMgc2V0dXAoY29uZmlnOiBTYW5kYm94Q29uZmlnKSB7XG4gICAgICAgIGlmICh0aGlzLiNvYnNlcnZlcikgdGhpcy4jb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jaW50ZXJ2YWwpO1xuXG4gICAgICAgIHRoaXMuI2NvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxkaXYgY2xhc3M9XCJtb2RhbC1jb250YWluZXIgbW9kYWwtaW5hY3RpdmVcIj48L2Rpdj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxkaXYgY2xhc3M9XCJyZWlmaWVkLXJvb3RcIj48L2Rpdj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kLWNhbnZhc1wiPjwvY2FudmFzPmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGNhbnZhcyBjbGFzcz1cImZvcmVncm91bmQtY2FudmFzXCI+PC9jYW52YXM+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8ZGl2IGNsYXNzPVwidG9hc3RzLWNvbnRhaW5lclwiPjwvZGl2PmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGJ1dHRvbiBjbGFzcz1cImRhcmttb2RlXCI+PC9idXR0b24+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8YnV0dG9uIGNsYXNzPVwidW5kb1wiPjwvYnV0dG9uPmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGJ1dHRvbiBjbGFzcz1cInJlZG9cIj48L2J1dHRvbj5gKTtcblxuICAgICAgICBNb3VzZU1hbmFnZXIuc3RhcnQoKTtcbiAgICAgICAgS2V5YmluZHNNYW5hZ2VyLmxpc3RlbigpO1xuICAgICAgICBEcmFnZ2luZ01hbmFnZXIubGlzdGVuKCk7XG4gICAgICAgIFNlbGVjdGlvbk1hbmFnZXIubGlzdGVuKCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgICBEYXJrbW9kZU1hbmFnZXIubGlzdGVuKCkub25DaGFuZ2UoKCkgPT4gRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpKTtcblxuICAgICAgICBVbmRvUmVkb01hbmFnZXIubGlzdGVuKCk7XG5cbiAgICAgICAgY29uc3QgY3JlYXRlUmVpZmllZEFjdGl2ZSA9IChjb21wb25lbnRzOiBSZWlmaWVkW10pID0+XG4gICAgICAgICAgICBuZXcgV2F0Y2hlZFNldDxSZWlmaWVkPigpXG4gICAgICAgICAgICAgICAgLm9uQWRkKChpdGVtLCBzZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG90YWxzID0gY2FsY3VsYXRlUmVpZmllZFRvdGFscyhzZXQuY2xvbmUoKS5hZGQoaXRlbSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFscy5jaGlwc1RvdGFsICsgdG90YWxzLmlucHV0c1RvdGFsICsgdG90YWxzLm91dHB1dHNUb3RhbCA+XG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy4jY29uZmlnLmxpbWl0cz8uY29tcG9uZW50c1RvdGFsID8/IEluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJFeGNlZWRlZCB0b3RhbCBjb21wb25lbnRzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxzLmlucHV0c1RvdGFsID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LmlucHV0cyA/PyBJbmZpbml0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJFeGNlZWRlZCB0b3RhbCBpbnB1dHMgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbHMub3V0cHV0c1RvdGFsID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/Lm91dHB1dHMgPz8gSW5maW5pdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgb3V0cHV0cyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFscy5jaGlwc1RvdGFsID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LmNoaXBzVG90YWwgPz8gSW5maW5pdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgY2hpcHMgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gaW5zdGFuY2VvZiBDb21wb25lbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFscy5jaGlwcy5oYXMoaXRlbS5jaGlwLm5hbWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHMuY2hpcHMuZ2V0KGl0ZW0uY2hpcC5uYW1lKSEgPiAodGhpcy4jY29uZmlnLmxpbWl0cz8uY2hpcHM/LltpdGVtLmNoaXAubmFtZV0gPz8gSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgRXhjZWVkZWQgdG90YWwgJyR7aXRlbS5jaGlwLm5hbWV9JyBsaW1pdC5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vbkFkZCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBNYXRoLmZsb29yKGNvbXBvbmVudC5wb3MueCAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5mbG9vcihjb21wb25lbnQucG9zLnkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFkZEFsbChjb21wb25lbnRzKTtcblxuICAgICAgICBjb25zdCBjcmVhdGVXaXJpbmdzU2V0ID0gKHdpcmluZ3M6IFdpcmluZ1tdKSA9PlxuICAgICAgICAgICAgbmV3IFdhdGNoZWRTZXQ8V2lyaW5nPigpXG4gICAgICAgICAgICAgICAgLm9uQWRkKChfLCBzZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldC5zaXplICsgMSA+ICh0aGlzLiNjb25maWcubGltaXRzPy53aXJpbmdzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIHdpcmluZ3MgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFkZEFsbCh3aXJpbmdzKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5tZW51ICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgW3RoaXMucXVldWVOZXdDb250ZXh0LCB0aGlzLmtpbGxNZW51XSA9IE1lbnVNYW5hZ2VyLnVzZShSZWlmaWVkLnJvb3QsIHRoaXMuI2NvbmZpZy5tZW51KTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5rZXliaW5kcyAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuI2NvbmZpZy5rZXliaW5kcykuZm9yRWFjaCgoW2Nob3JkLCBydW5dKSA9PiBLZXliaW5kc01hbmFnZXIub25LZXlDaG9yZChjaG9yZCwgcnVuKSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcuaW5pdGlhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZSA9IGNyZWF0ZVJlaWZpZWRBY3RpdmUodGhpcy4jY29uZmlnLmluaXRpYWxbMF0pO1xuXG4gICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5hdHRhY2goKSk7XG5cbiAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMgPSBjcmVhdGVXaXJpbmdzU2V0KHRoaXMuI2NvbmZpZy5pbml0aWFsWzFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLnNhdmUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBTdG9yYWdlTWFuYWdlci5nZXQ8c3RyaW5nPihcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUpO1xuXG4gICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogW3NldHRpbmdzLCBjb21wb25lbnRzLCB3aXJlc10sXG4gICAgICAgICAgICAgICAgfSA9IGZyb21GaWxlKGZpbGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLmRlbGV0ZShcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChJTl9ERUJVR19NT0RFKSBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHJlYWQgZnJvbSBzYXZlczpcIiwgZXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byByZWFkIGZyb20gc2F2ZXMuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLiNjb25maWcub3ZlcnJpZGVTYXZlSWZFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseVJhd1NldHRpbmdzKHNldHRpbmdzISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlID0gY3JlYXRlUmVpZmllZEFjdGl2ZShjb21wb25lbnRzISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmF0dGFjaCgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcyA9IGNyZWF0ZVdpcmluZ3NTZXQod2lyZXMhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5zYXZlICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcbiAgICAgICAgICAgICAgICAgICAgXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLFxuICAgICAgICAgICAgICAgICAgICBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVyLm9ic2VydmUoUmVpZmllZC5yb290LCB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLFxuICAgICAgICAgICAgY2hhcmFjdGVyRGF0YU9sZFZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjaGVjayA9IHRoaXMuI2NvbmZpZy5jaGVja1N0YXRlPy4oUmVpZmllZC5hY3RpdmUuY2xvbmUoKSwgV2lyaW5nTWFuYWdlci53aXJlcy5jbG9uZSgpKSA/PyBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGNoZWNrKSB0aGlzLiNjb25maWcuaWZTdGF0ZUNoZWNrZWQ/LigpO1xuICAgICAgICB9LCB0aGlzLiNjb25maWcuY2hlY2tJbnRlcnZhbCA/PyA1MCkgYXMgbmV2ZXI7XG5cbiAgICAgICAgaWYgKCFTdG9yYWdlTWFuYWdlci5nZXQoXCJ1c2VkaGVscFwiKSlcbiAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQcmVzcyAnPycgZm9yIGhlbHAuXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IExJR0hUX0dSQVlfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBmb3JjZVNhdmUoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLnNhdmUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXG4gICAgICAgICAgICAgICAgXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLFxuICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuI29ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNpbnRlcnZhbCk7XG5cbiAgICAgICAgdGhpcy4jaW50ZXJ2YWwgPSAtMTtcblxuICAgICAgICBNb3VzZU1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgS2V5YmluZHNNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5yZXNldCgpO1xuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIuc3RvcCgpO1xuXG4gICAgICAgIERhcmttb2RlTWFuYWdlci5zdG9wKCk7XG4gICAgICAgIFVuZG9SZWRvTWFuYWdlci5zdG9wKCk7XG5cbiAgICAgICAgTWVudU1hbmFnZXIucmVtb3ZlKFJlaWZpZWQucm9vdCk7XG5cbiAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgIHRoaXMud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5mb3JFYWNoKChmaW5pc2gpID0+IGZpbmlzaC5jYWxsKHVuZGVmaW5lZCkpO1xuXG4gICAgICAgIHRoaXMud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5jbGVhcigpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICB0aGlzLiNjb25maWcgPSB7fTtcblxuICAgICAgICB0aGlzLiNoaXN0b3J5ID0gW107XG4gICAgICAgIHRoaXMuI3JlZG9zID0gW107XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGNsZWFyKCkge1xuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5kZXRhY2goKSk7XG5cbiAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB3aXJlLmRlc3Ryb3koKSk7XG5cbiAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBwdXNoSGlzdG9yeShjb21tYW5kOiAoKSA9PiB2b2lkLCB1bmRvOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI3JlZG9zLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgY29tbWFuZC5jYWxsKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgdGhpcy4jaGlzdG9yeS5wdXNoKFtjb21tYW5kLCB1bmRvXSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHBvcEhpc3RvcnkoKSB7XG4gICAgICAgIGlmICghdGhpcy4jaGlzdG9yeS5sZW5ndGgpIHtcbiAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJOb3RoaW5nIHRvIHVuZG8uXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgW3JlZG8sIHVuZG9dID0gdGhpcy4jaGlzdG9yeS5wb3AoKSE7XG5cbiAgICAgICAgdGhpcy4jcmVkb3MucHVzaChbcmVkbywgdW5kb10pO1xuXG4gICAgICAgIHVuZG8uY2FsbCh1bmRlZmluZWQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWRvSGlzdG9yeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiNyZWRvcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJOb3RoaW5nIHRvIHJlZG8uXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgW2NvbW1hbmQsIHVuZG9dID0gdGhpcy4jcmVkb3MucG9wKCkhO1xuXG4gICAgICAgIHRoaXMuI2hpc3RvcnkucHVzaChbY29tbWFuZCwgdW5kb10pO1xuXG4gICAgICAgIGNvbW1hbmQuY2FsbCh1bmRlZmluZWQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBhcHBseVNldHRpbmdzKHNldHRpbmdzOiBTYW5kYm94Q29uZmlnW1wic2V0dGluZ3NcIl0gJiB7fSkge1xuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCA9IHNldHRpbmdzLnNuYXBUb0dyaWQgPz8gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFwcGx5UmF3U2V0dGluZ3Moc2V0dGluZ3M6IFNlcmlhbGl6ZWREaWFncmFtW1wic2V0dGluZ3NcIl0pIHtcbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQgPSBzZXR0aW5nc1tcIkRyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkXCJdO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBzYXZlVG8oc2F2ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI2NvbmZpZy5zYXZlID0gc2F2ZTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5oYXMoXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlKSAmJlxuICAgICAgICAgICAgIShhd2FpdCBNb2RhbE1hbmFnZXIuY29uZmlybShcbiAgICAgICAgICAgICAgICBcIlRoZXJlIGlzIGFscmVhZHkgYSBzYXZlIHdpdGggdGhpcyBuYW1lLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVwbGFjZSBpdD9cIixcbiAgICAgICAgICAgICkpXG4gICAgICAgIClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLCBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElTX01BQ19PUywgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBmcm9tRmlsZSwgc2F2ZURpYWdyYW0gfSBmcm9tIFwiLi4vZmlsZXNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGlzcGxheSB9IGZyb20gXCIuLi9yZWlmaWVkL0Rpc3BsYXlcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgb3ZlcmxhcHBlZEJvdW5kcywgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgTW91c2VNYW5hZ2VyIH0gZnJvbSBcIi4vTW91c2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9XaXJpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25NYW5hZ2VyIHtcbiAgICBzdGF0aWMgc2VsZWN0ZWQgPSBuZXcgV2F0Y2hlZFNldDxSZWlmaWVkPigpO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBFbGVtZW50O1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBbXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1pbnB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLW91dHB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmRpc3BsYXlcIiksXG4gICAgICAgIF0uZmluZCgoZWxlbWVudCkgPT4gZWxlbWVudCAhPT0gbnVsbCkhO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbmQoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmVsZW1lbnQgPT09IGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChyZWlmaWVkKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKElTX01BQ19PUyAmJiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIk1ldGFMZWZ0XCIpIHx8IEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJNZXRhUmlnaHRcIikpKSB8fFxuICAgICAgICAgICAgICAgICghSVNfTUFDX09TICYmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiQ29udHJvbExlZnRcIikgfHwgS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIkNvbnRyb2xSaWdodFwiKSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3Rpb24ocmVpZmllZCk7XG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5zZWxlY3RlZC5oYXMocmVpZmllZCkpIHRoaXMuc2VsZWN0KHJlaWZpZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjY29weSA9IGFzeW5jIChlOiBDbGlwYm9hcmRFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC5zaXplKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gWy4uLnRoaXMuc2VsZWN0ZWRdO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gc2F2ZURpYWdyYW0oXG4gICAgICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICAgICAgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgKHdpcmluZykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LnNvbWUoKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkgcmV0dXJuIHdpcmluZy5mcm9tID09PSBjb21wb25lbnQuZWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5vdXRwdXRzLnNvbWUoKG91dHB1dCkgPT4gd2lyaW5nLmZyb20gPT09IG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5zb21lKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiB3aXJpbmcudG8gPT09IGNvbXBvbmVudC5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50LmlucHV0cy5zb21lKChpbnB1dCkgPT4gd2lyaW5nLnRvID09PSBpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChkYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3Bhc3RlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIHJlc3VsdDogWywgY29tcG9uZW50cywgd2lyaW5nc10sXG4gICAgICAgIH0gPSBmcm9tRmlsZShhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCkpO1xuXG4gICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHBhc3RlIGRpYWdyYW0gZGF0YS5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBtb3VzZSA9IHsgLi4uTW91c2VNYW5hZ2VyLm1vdXNlIH07XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGRBbGwoY29tcG9uZW50cyEpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudHMhLmV2ZXJ5KChjb21wb25lbnQpID0+IFJlaWZpZWQuYWN0aXZlLmhhcyhjb21wb25lbnQpKSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4gaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNvbXBvbmVudC51cGRhdGUoKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoTW91c2VNYW5hZ2VyLm1vdXNlLnggIT09IC0xICYmIE1vdXNlTWFuYWdlci5tb3VzZS55ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IGNvbXBvbmVudHMhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXggPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXkgPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBieCA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBieSA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkID0gTWF0aC5zcXJ0KGF4ICogYXggKyBheSAqIGF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmQgPSBNYXRoLnNxcnQoYnggKiBieCArIGJ5ICogYnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWQgLSBiZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVswXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogbW91c2UueCArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBtb3VzZS55ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbCh3aXJpbmdzISk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMhLmZvckVhY2goKGNvbXBvbmVudCkgPT4gdGhpcy5hZGRTZWxlY3Rpb24oY29tcG9uZW50KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGVBbGwoY29tcG9uZW50cyEpO1xuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cyEuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZXRhY2goKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZGVsZXRlQWxsKHdpcmluZ3MhKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKChjb21wb25lbnQpID0+IHRoaXMuYWRkU2VsZWN0aW9uKGNvbXBvbmVudCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgc3RhdGljIHNlbGVjdChyZWlmaWVkOiBSZWlmaWVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZChyZWlmaWVkKTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IChjb21wb25lbnQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMFwiKSk7XG5cbiAgICAgICAgcmVpZmllZC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwMFwiO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZWxlY3RBbGxJbihmcm9tOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sIHRvOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbHRlcigoY29tcG9uZW50KSA9PlxuICAgICAgICAgICAgb3ZlcmxhcHBlZEJvdW5kcyhjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgZnJvbSwgdG8pLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkQWxsKHJlaWZpZWQpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwXCIpKTtcblxuICAgICAgICByZWlmaWVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwMFwiKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFNlbGVjdGlvbihyZWlmaWVkOiBSZWlmaWVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkKHJlaWZpZWQpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwXCIpKTtcblxuICAgICAgICByZWlmaWVkLmVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDAwXCI7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzU2VsZWN0ZWQoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLnNlbGVjdGVkXS5zb21lKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkgcmV0dXJuIGVsZW1lbnQgPT09IGNvbXBvbmVudC5lbGVtZW50O1xuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSByZXR1cm4gZWxlbWVudCA9PT0gY29tcG9uZW50LmVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSlcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLnNvbWUoKGlucHV0KSA9PiBlbGVtZW50ID09PSBpbnB1dCkgfHxcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm91dHB1dHMuc29tZSgob3V0cHV0KSA9PiBlbGVtZW50ID09PSBvdXRwdXQpIHx8XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPT09IGNvbXBvbmVudC5lbGVtZW50XG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29weVwiLCB0aGlzLiNjb3B5KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIHRoaXMuI3Bhc3RlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVhZmVuKCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgdGhpcy4jY29weSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLCB0aGlzLiNwYXN0ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5kZWFmZW4oKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU3RvcmFnZU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSBwcmVmaXggPSBcImtlbHNueS5nYXRlc2ltOlwiO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG4gICAgc3RhdGljIHNldDxUPihrZXk6IHN0cmluZywgdmFsdWU6IFQpOiBUIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldEl0ZW0odGhpcy5wcmVmaXggKyBrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQ8VD4oa2V5OiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXggKyBrZXkpISkgPz8gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBoYXMoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMucHJlZml4ICsga2V5KSAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVsZXRlKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSkgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLnByZWZpeCArIGtleSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgREVMQVkgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9XaXJpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0aW5nTWFuYWdlciB7XG4gICAgc3RhdGljICN0ZXN0aW5nID0gZmFsc2U7XG5cbiAgICBzdGF0aWMgYXN5bmMgdGVzdChjYXNlczogW2lucHV0czogYm9vbGVhbltdLCBvdXRwdXRzOiBib29sZWFuW11dW10sIHsgdGltZW91dCA9IDEwMDAgfTogeyB0aW1lb3V0PzogbnVtYmVyIH0gPSB7fSkge1xuICAgICAgICBpZiAodGhpcy4jdGVzdGluZykgcmV0dXJuIE1vZGFsTWFuYWdlci5hbGVydChcIkRpYWdyYW0gaXMgYWxyZWFkeSB1bmRlciB0ZXN0aW5nLlwiKTtcblxuICAgICAgICB0aGlzLiN0ZXN0aW5nID0gdHJ1ZTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5sb2NrKCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMubG9jaygpO1xuXG4gICAgICAgIGNvbnN0IGlucHV0cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZV1cbiAgICAgICAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCk6IGNvbXBvbmVudCBpcyBJbnB1dCA9PiBjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApIC0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKSk7XG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBbLi4uUmVpZmllZC5hY3RpdmVdXG4gICAgICAgICAgICAuZmlsdGVyKChjb21wb25lbnQpOiBjb21wb25lbnQgaXMgT3V0cHV0ID0+IGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApIC0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKSk7XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxBY3RpdmF0aW9ucyA9IGlucHV0cy5tYXAoKGlucHV0KSA9PiBpbnB1dC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgbGV0IGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAoY29uc3QgW2dpdmVuSW5wdXRzLCBleHBlY3RlZE91dHB1dHNdIG9mIGNhc2VzKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRzLmxlbmd0aCAhPT0gZ2l2ZW5JbnB1dHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJNaXNtYXRjaGVkIGlucHV0IGxlbmd0aHMuXCIpO1xuICAgICAgICAgICAgaWYgKG91dHB1dHMubGVuZ3RoICE9PSBleHBlY3RlZE91dHB1dHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJNaXNtYXRjaGVkIG91dHB1dCBsZW5ndGhzLlwiKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIGlucHV0XSBvZiBpbnB1dHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGdpdmVuSW5wdXRzW2luZGV4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IERFTEFZKHRpbWVvdXQpO1xuXG4gICAgICAgICAgICBjb25zdCByZWFsT3V0cHV0cyA9IG91dHB1dHMubWFwKChvdXRwdXQpID0+IG91dHB1dC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgICAgIGlmICghcmVhbE91dHB1dHMuZXZlcnkoKG91dCwgaSkgPT4gb3V0ID09PSBleHBlY3RlZE91dHB1dHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IE1vZGFsTWFuYWdlci5hbGVydChcbiAgICAgICAgICAgICAgICAgICAgYERpYWdyYW0gZmFpbGVkIHRvIHBhc3MgdGhlIHRlc3Qgd2l0aCBpbnB1dHMgXCIke2dpdmVuSW5wdXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChib29sZWFuKSA9PiArYm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiIFwiKX1cIi5gLFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgREVMQVkoMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZhaWxlZCkgYXdhaXQgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiRGlhZ3JhbSBwYXNzZWQgYWxsIHRoZSB0ZXN0cy5cIik7XG5cbiAgICAgICAgb3JpZ2luYWxBY3RpdmF0aW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4gaW5wdXRzW2ldLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCB2YWx1ZSkpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLnVubG9jaygpO1xuICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLnVubG9jaygpO1xuXG4gICAgICAgIHRoaXMuI3Rlc3RpbmcgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHRlc3RpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiN0ZXN0aW5nO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9hc3REYXRhIHtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgY29sb3I6IHN0cmluZztcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgVG9hc3RNYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0cy1jb250YWluZXJcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyB0b2FzdCh7IG1lc3NhZ2UsIGNvbG9yLCBkdXJhdGlvbiB9OiBUb2FzdERhdGEpIHtcbiAgICAgICAgY29uc3QgdG9hc3QgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0b2FzdC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xvc2UtdG9hc3RcIj7ilbM8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRvYXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0LWNvbG9yXCIpIS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcblxuICAgICAgICB0b2FzdC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGR1cmF0aW9uICsgXCJtc1wiO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRvYXN0KTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0b2FzdC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0b2FzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbG9zZS10b2FzdFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIpO1xuXG4gICAgICAgICAgICB0b2FzdC5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIGhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBEYXJrbW9kZU1hbmFnZXIgfSBmcm9tIFwiLi9EYXJrbW9kZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFVuZG9SZWRvTWFuYWdlciB7XG4gICAgc3RhdGljIGdldCAjdW5kb0VsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcImJ1dHRvbi51bmRvXCIpITtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0ICNyZWRvRWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiYnV0dG9uLnJlZG9cIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyAjdW5kb0xpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5wb3BIaXN0b3J5KCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjcmVkb0xpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5yZWRvSGlzdG9yeSgpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICBEYXJrbW9kZU1hbmFnZXIub25DaGFuZ2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jdW5kb0VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgdGhpcy4jcmVkb0VsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwibm9uZVwiO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLiN1bmRvRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLiNyZWRvRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gXCJcIjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiN1bmRvRWxlbWVudC5pbm5lclRleHQgPSBcIlVORE9cIjtcbiAgICAgICAgdGhpcy4jcmVkb0VsZW1lbnQuaW5uZXJUZXh0ID0gXCJSRURPXCI7XG5cbiAgICAgICAgdGhpcy4jdW5kb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI3VuZG9MaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuI3JlZG9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNyZWRvTGlzdGVuZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wKCkge1xuICAgICAgICB0aGlzLiN1bmRvRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jdW5kb0xpc3RlbmVyKTtcbiAgICAgICAgdGhpcy4jcmVkb0VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI3JlZG9MaXN0ZW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQge1xuICAgIEdFVF9BQ1RJVkFURURfQ09MT1IsXG4gICAgR0VUX0JBQ0tHUk9VTkRfQ0FOVkFTX0NUWCxcbiAgICBHRVRfRk9SRUdST1VORF9DQU5WQVNfQ1RYLFxuICAgIEdFVF9HUkFZX0NPTE9SLFxuICAgIExPQ0tFRF9GT1JfVEVTVElORyxcbn0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFF1aWNrUGlja01hbmFnZXIgfSBmcm9tIFwiLi9RdWlja1BpY2tNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4vU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi9UZXN0aW5nTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgTmV3V2lyZUNvbnRleHQge1xuICAgIHN0YXRpYyBmcm9tOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyB7XG4gICAgICAgIE1vdXNlTWFuYWdlci5vbk1vdXNlRG93bigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKE5ld1dpcmVDb250ZXh0LmZyb20pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRhcmdldCB9ID0gZTtcblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImJvYXJkLW91dHB1dFwiKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNvbXBvbmVudC1pbnB1dC1idXR0b25cIilcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmcm9tID0gTmV3V2lyZUNvbnRleHQuZnJvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZChuZXcgV2lyaW5nKGZyb20sIHRhcmdldCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdpcmUgb2YgV2lyaW5nTWFuYWdlci53aXJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gZnJvbSAmJiB3aXJlLnRvID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBOZXdXaXJlQ29udGV4dC5mcm9tID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXaXJpbmcge1xuICAgICNkZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAjb2JzZXJ2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBmcm9tOiBFbGVtZW50LCByZWFkb25seSB0bzogRWxlbWVudCkge1xuICAgICAgICB0aGlzLiNvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghV2lyaW5nTWFuYWdlci53aXJlcy5oYXModGhpcykpIHtcbiAgICAgICAgICAgICAgICBpZiAoIVsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXS5zb21lKCh3aXJlKSA9PiB3aXJlLnRvID09PSB0aGlzLnRvKSkgdG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG8uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBmcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ28oKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLiNkZXN0cm95ZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG5cbiAgICBnbygpIHtcbiAgICAgICAgdGhpcy4jZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmZyb20sIHsgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSwgYXR0cmlidXRlczogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBnZXQgZGVzdHJveWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jZGVzdHJveWVkO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdpcmluZ01hbmFnZXIge1xuICAgIHN0YXRpYyAjckFGID0gLTE7XG5cbiAgICBzdGF0aWMgd2lyZXMgPSBuZXcgV2F0Y2hlZFNldDxXaXJpbmc+KCk7XG5cbiAgICBzdGF0aWMgdXBkYXRlKCkge1xuICAgICAgICBjb25zdCBiZyA9IEdFVF9CQUNLR1JPVU5EX0NBTlZBU19DVFgoKTtcbiAgICAgICAgY29uc3QgZmcgPSBHRVRfRk9SRUdST1VORF9DQU5WQVNfQ1RYKCk7XG5cbiAgICAgICAgYmcuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGJnLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgZmcuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGZnLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICBpZiAod2lyZS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aXJlcy5sb2NrZWQpIHdpcmUuZ28oKTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMud2lyZXMuZGVsZXRlKHdpcmUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmcm9tID0gd2lyZS5mcm9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgdG8gPSB3aXJlLnRvLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VzID0gWy4uLnRoaXMud2lyZXNdLmZpbHRlcigodykgPT4gdy50byA9PT0gd2lyZS50byk7XG5cbiAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgICAgICAgICAgICBcImFjdGl2YXRlZFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZXMuc29tZSgodykgPT4gdy5mcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBiZy5zdHJva2VTdHlsZSA9IHdpcmUuZnJvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgPyBHRVRfQUNUSVZBVEVEX0NPTE9SKCkgOiBHRVRfR1JBWV9DT0xPUigpO1xuXG4gICAgICAgICAgICBiZy5saW5lV2lkdGggPSA1O1xuXG4gICAgICAgICAgICBiZy5saW5lSm9pbiA9IFwicm91bmRcIjtcblxuICAgICAgICAgICAgYmcuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBiZy5tb3ZlVG8oZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBiZy5saW5lVG8odG8ueCArIHRvLndpZHRoIC8gMiwgdG8ueSArIHRvLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgYmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBiZy5zdHJva2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKE5ld1dpcmVDb250ZXh0LmZyb20pIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSBOZXdXaXJlQ29udGV4dC5mcm9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBiZy5zdHJva2VTdHlsZSA9IE5ld1dpcmVDb250ZXh0LmZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpXG4gICAgICAgICAgICAgICAgPyBHRVRfQUNUSVZBVEVEX0NPTE9SKClcbiAgICAgICAgICAgICAgICA6IEdFVF9HUkFZX0NPTE9SKCk7XG5cbiAgICAgICAgICAgIGJnLmxpbmVXaWR0aCA9IDU7XG5cbiAgICAgICAgICAgIGJnLmxpbmVKb2luID0gXCJyb3VuZFwiO1xuXG4gICAgICAgICAgICBiZy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGJnLm1vdmVUbyhmcm9tLnggKyBmcm9tLndpZHRoIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIGJnLmxpbmVUbyhNb3VzZU1hbmFnZXIubW91c2UueCwgTW91c2VNYW5hZ2VyLm1vdXNlLnkpO1xuICAgICAgICAgICAgYmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBiZy5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLnggIT09IC0xICYmXG4gICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy55ICE9PSAtMSAmJlxuICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnggIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueSAhPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBmZy5zdHJva2VTdHlsZSA9IEdFVF9BQ1RJVkFURURfQ09MT1IoKTtcblxuICAgICAgICAgICAgZmcubGluZVdpZHRoID0gMi41O1xuXG4gICAgICAgICAgICBmZy5saW5lSm9pbiA9IFwibWl0ZXJcIjtcblxuICAgICAgICAgICAgZmcuc3Ryb2tlUmVjdChcbiAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54LFxuICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLnksXG4gICAgICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnggLSBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54LFxuICAgICAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55IC0gRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBmZy5zdHJva2VTdHlsZSA9IEdFVF9BQ1RJVkFURURfQ09MT1IoKTtcblxuICAgICAgICAgICAgZmcubGluZVdpZHRoID0gMTtcblxuICAgICAgICAgICAgZmcubGluZUpvaW4gPSBcIm1pdGVyXCI7XG5cbiAgICAgICAgICAgIGZnLnN0cm9rZVJlY3QocmVjdC5sZWZ0IC0gMTUsIHJlY3QudG9wIC0gMTUsIHJlY3Qud2lkdGggKyAxNSArIDE1LCByZWN0LmhlaWdodCArIDE1ICsgMTUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoUXVpY2tQaWNrTWFuYWdlci5saW5lKSB7XG4gICAgICAgICAgICBjb25zdCBbZnJvbSwgdG9dID0gUXVpY2tQaWNrTWFuYWdlci5saW5lO1xuXG4gICAgICAgICAgICBmZy5maWxsU3R5bGUgPSBHRVRfR1JBWV9DT0xPUigpO1xuICAgICAgICAgICAgZmcuc3Ryb2tlU3R5bGUgPSBHRVRfR1JBWV9DT0xPUigpO1xuXG4gICAgICAgICAgICBmZy5saW5lV2lkdGggPSAxO1xuXG4gICAgICAgICAgICBmZy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGZnLmFyYyhmcm9tLmNsaWVudFgsIGZyb20uY2xpZW50WSwgMiwgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgZmcuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBmZy5maWxsKCk7XG5cbiAgICAgICAgICAgIGZnLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgZmcubW92ZVRvKGZyb20uY2xpZW50WCwgZnJvbS5jbGllbnRZKTtcbiAgICAgICAgICAgIGZnLmxpbmVUbyh0by5jbGllbnRYLCB0by5jbGllbnRZKTtcbiAgICAgICAgICAgIGZnLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgZmcuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgIGZnLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgZmcuYXJjKHRvLmNsaWVudFgsIHRvLmNsaWVudFksIDIsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgICAgIGZnLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgZmcuZmlsbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIGNvbnN0IGlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RhcnQuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy4jckFGID0gaWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0b3AoKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuI3JBRik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuLi9jb250ZXh0bWVudS9tZW51XCI7XG5pbXBvcnQgeyBrZXliaW5kcyB9IGZyb20gXCIuLi9rZXliaW5kcy9rZXliaW5kc1wiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZyB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBBbmRHYXRlLCBPckdhdGUsIFhvckdhdGUgfSBmcm9tIFwiLi4vcmVpZmllZC9jaGlwc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcblxuZXhwb3J0IGNvbnN0IGV4YW1wbGU6IFJlY29yZDxzdHJpbmcsIChjdHg6IHsgbmFtZTogc3RyaW5nIH0pID0+IHZvaWQ+ID0ge1xuICAgIFwiZXhhbXBsZTpoYWxmYWRkZXJcIjogKHsgbmFtZTogc2F2ZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBbXG4gICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBYb3JHYXRlKCksIHsgeDogMzAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgQW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBPdXRwdXQoeyB4OiA1MDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNTAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICBdIGFzIGNvbnN0O1xuXG4gICAgICAgIGNvbnN0IFtpMSwgaTIsIHhvciwgYW5kLCBvMSwgbzJdID0gY29tcG9uZW50cztcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICBrZXliaW5kcyxcbiAgICAgICAgICAgIG1lbnUsXG4gICAgICAgICAgICBzYXZlLFxuICAgICAgICAgICAgaW5pdGlhbDogW1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMubWFwKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5wZXJtYW5lbnQoKSksXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkxLmVsZW1lbnQsIHhvci5pbnB1dHNbMF0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkxLmVsZW1lbnQsIGFuZC5pbnB1dHNbMF0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkyLmVsZW1lbnQsIHhvci5pbnB1dHNbMV0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkyLmVsZW1lbnQsIGFuZC5pbnB1dHNbMV0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKHhvci5vdXRwdXRzWzBdLCBvMS5lbGVtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhhbmQub3V0cHV0c1swXSwgbzIuZWxlbWVudCksXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBpbnB1dHM6IDIsXG4gICAgICAgICAgICAgICAgb3V0cHV0czogMixcbiAgICAgICAgICAgICAgICBjaGlwc1RvdGFsOiAyLFxuICAgICAgICAgICAgICAgIHdpcmluZ3M6IDYsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1RvdGFsOiA2LFxuICAgICAgICAgICAgICAgIGNoaXBzOiB7IEFORDogMSwgWE9SOiAxIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIFwiZXhhbXBsZTpmdWxsYWRkZXJcIjogKHsgbmFtZTogc2F2ZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBbXG4gICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDMwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBYb3JHYXRlKCksIHsgeDogMjUwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgQW5kR2F0ZSgpLCB7IHg6IDI1MCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IEFuZEdhdGUoKSwgeyB4OiAyNTAsIHk6IDMwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBYb3JHYXRlKCksIHsgeDogNDAwLCB5OiAxNTAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgT3JHYXRlKCksIHsgeDogNDAwLCB5OiAyNTAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IE91dHB1dCh7IHg6IDU1MCwgeTogMTUwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBPdXRwdXQoeyB4OiA1NTAsIHk6IDI1MCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgIF0gYXMgY29uc3Q7XG5cbiAgICAgICAgY29uc3QgW2kxLCBpMiwgaTMsIHhvcjEsIGFuZDEsIGFuZDIsIHhvcjIsIG9yLCBvMSwgbzJdID0gY29tcG9uZW50cztcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICBrZXliaW5kcyxcbiAgICAgICAgICAgIG1lbnUsXG4gICAgICAgICAgICBzYXZlLFxuICAgICAgICAgICAgaW5pdGlhbDogW1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMubWFwKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5wZXJtYW5lbnQoKSksXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkxLmVsZW1lbnQsIHhvcjEuaW5wdXRzWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMS5lbGVtZW50LCBhbmQyLmlucHV0c1swXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTIuZWxlbWVudCwgeG9yMS5pbnB1dHNbMV0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkyLmVsZW1lbnQsIGFuZDIuaW5wdXRzWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMy5lbGVtZW50LCBhbmQxLmlucHV0c1sxXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTMuZWxlbWVudCwgeG9yMi5pbnB1dHNbMV0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKHhvcjEub3V0cHV0c1swXSwgYW5kMS5pbnB1dHNbMF0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKHhvcjEub3V0cHV0c1swXSwgeG9yMi5pbnB1dHNbMF0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGFuZDEub3V0cHV0c1swXSwgb3IuaW5wdXRzWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhhbmQyLm91dHB1dHNbMF0sIG9yLmlucHV0c1sxXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoeG9yMi5vdXRwdXRzWzBdLCBvMS5lbGVtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhvci5vdXRwdXRzWzBdLCBvMi5lbGVtZW50KSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGxpbWl0czoge1xuICAgICAgICAgICAgICAgIGlucHV0czogMyxcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiAyLFxuICAgICAgICAgICAgICAgIGNoaXBzVG90YWw6IDUsXG4gICAgICAgICAgICAgICAgd2lyaW5nczogMTIsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1RvdGFsOiAxMCxcbiAgICAgICAgICAgICAgICBjaGlwczogeyBBTkQ6IDIsIFhPUjogMiwgT1I6IDEgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH0sXG59O1xuIiwiaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuLi9jb250ZXh0bWVudS9tZW51XCI7XG5pbXBvcnQgeyBrZXliaW5kcyB9IGZyb20gXCIuLi9rZXliaW5kcy9rZXliaW5kc1wiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IGV4YW1wbGUgfSBmcm9tIFwiLi9leGFtcGxlXCI7XG5pbXBvcnQgeyBuYW5kIH0gZnJvbSBcIi4vbmFuZFwiO1xuXG5leHBvcnQgY29uc3QgcHJlbWFkZSA9IG5ldyBNYXA8c3RyaW5nLCAoY3R4OiB7IG5hbWU6IHN0cmluZyB9KSA9PiB2b2lkPihbXG4gICAgLi4uT2JqZWN0LmVudHJpZXMoZXhhbXBsZSksXG4gICAgW1wic2FuZGJveFwiLCAoKSA9PiBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBzYXZlOiBcInNhbmRib3hcIiB9KV0sXG4gICAgLi4uT2JqZWN0LmVudHJpZXMobmFuZCksXG5dKTtcbiIsImltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi4vY29udGV4dG1lbnUvbWVudVwiO1xuaW1wb3J0IHsga2V5YmluZHMgfSBmcm9tIFwiLi4va2V5YmluZHMva2V5YmluZHNcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgTmFuZEdhdGUgfSBmcm9tIFwiLi4vcmVpZmllZC9jaGlwc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcblxuZXhwb3J0IGNvbnN0IG5hbmQ6IFJlY29yZDxzdHJpbmcsIChjdHg6IHsgbmFtZTogc3RyaW5nIH0pID0+IHZvaWQ+ID0ge1xuICAgIFwibmFuZDpub3RcIjogKHsgbmFtZTogc2F2ZSB9KSA9PiB7XG4gICAgICAgIG1lbnUuc3BsaWNlKDIsIDAsIHtcbiAgICAgICAgICAgIHRlc3Q6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IHNvbHV0aW9uXCIsXG4gICAgICAgICAgICAgICAgYXN5bmMgY2FsbGJhY2soKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFRlc3RpbmdNYW5hZ2VyLnRlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1t0cnVlXSwgW2ZhbHNlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1tmYWxzZV0sIFt0cnVlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0aW1lb3V0OiA1MDAgfSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoe1xuICAgICAgICAgICAga2V5YmluZHMsXG4gICAgICAgICAgICBtZW51LFxuICAgICAgICAgICAgc2F2ZSxcbiAgICAgICAgICAgIGluaXRpYWw6IFtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBPdXRwdXQoeyB4OiA1MDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgXS5tYXAoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LnBlcm1hbmVudCgpKSxcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBpbnB1dHM6IDEsXG4gICAgICAgICAgICAgICAgb3V0cHV0czogMSxcbiAgICAgICAgICAgICAgICBjaGlwc1RvdGFsOiAxLFxuICAgICAgICAgICAgICAgIHdpcmluZ3M6IDMsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1RvdGFsOiAzLFxuICAgICAgICAgICAgICAgIGNoaXBzOiB7IE5BTkQ6IDEgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE1vZGFsTWFuYWdlci5hbGVydChcIlJlY3JlYXRlIGEgTk9UIGdhdGUgdXNpbmcgb25seSBhIE5BTkQgZ2F0ZS5cIik7XG4gICAgfSxcbiAgICBcIm5hbmQ6YW5kXCI6ICh7IG5hbWU6IHNhdmUgfSkgPT4ge1xuICAgICAgICBtZW51LnNwbGljZSgyLCAwLCB7XG4gICAgICAgICAgICB0ZXN0OiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCBzb2x1dGlvblwiLFxuICAgICAgICAgICAgICAgIGFzeW5jIGNhbGxiYWNrKCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBUZXN0aW5nTWFuYWdlci50ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbZmFsc2UsIGZhbHNlXSwgW2ZhbHNlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1t0cnVlLCBmYWxzZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbZmFsc2UsIHRydWVdLCBbZmFsc2VdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW3RydWUsIHRydWVdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGltZW91dDogNzUwIH0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHtcbiAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgIHNhdmUsXG4gICAgICAgICAgICBpbml0aWFsOiBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNTAwLCB5OiAxNTAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgIF0ubWFwKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5wZXJtYW5lbnQoKSksXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbGltaXRzOiB7XG4gICAgICAgICAgICAgICAgaW5wdXRzOiAyLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IDEsXG4gICAgICAgICAgICAgICAgY2hpcHNUb3RhbDogMixcbiAgICAgICAgICAgICAgICB3aXJpbmdzOiA1LFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHNUb3RhbDogNSxcbiAgICAgICAgICAgICAgICBjaGlwczogeyBOQU5EOiAyIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBNb2RhbE1hbmFnZXIuYWxlcnQoXCJSZWNyZWF0ZSBhbiBBTkQgZ2F0ZSB1c2luZyBvbmx5IE5BTkQgZ2F0ZXMuXCIpO1xuICAgIH0sXG4gICAgXCJuYW5kOm9yXCI6ICh7IG5hbWU6IHNhdmUgfSkgPT4ge1xuICAgICAgICBtZW51LnNwbGljZSgyLCAwLCB7XG4gICAgICAgICAgICB0ZXN0OiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCBzb2x1dGlvblwiLFxuICAgICAgICAgICAgICAgIGFzeW5jIGNhbGxiYWNrKCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBUZXN0aW5nTWFuYWdlci50ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbZmFsc2UsIGZhbHNlXSwgW2ZhbHNlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1t0cnVlLCBmYWxzZV0sIFt0cnVlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1tmYWxzZSwgdHJ1ZV0sIFt0cnVlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1t0cnVlLCB0cnVlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRpbWVvdXQ6IDEwMDAgfSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoe1xuICAgICAgICAgICAga2V5YmluZHMsXG4gICAgICAgICAgICBtZW51LFxuICAgICAgICAgICAgc2F2ZSxcbiAgICAgICAgICAgIGluaXRpYWw6IFtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDE1MCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNjAwLCB5OiAxNTAgfSksXG4gICAgICAgICAgICAgICAgXS5tYXAoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LnBlcm1hbmVudCgpKSxcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBpbnB1dHM6IDIsXG4gICAgICAgICAgICAgICAgb3V0cHV0czogMSxcbiAgICAgICAgICAgICAgICBjaGlwc1RvdGFsOiAzLFxuICAgICAgICAgICAgICAgIHdpcmluZ3M6IDcsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1RvdGFsOiA2LFxuICAgICAgICAgICAgICAgIGNoaXBzOiB7IE5BTkQ6IDMgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE1vZGFsTWFuYWdlci5hbGVydChcIlJlY3JlYXRlIGFuIE9SIGdhdGUgdXNpbmcgb25seSBOQU5EIGdhdGVzLlwiKTtcbiAgICB9LFxuICAgIFwibmFuZDp4b3JcIjogKHsgbmFtZTogc2F2ZSB9KSA9PiB7XG4gICAgICAgIG1lbnUuc3BsaWNlKDIsIDAsIHtcbiAgICAgICAgICAgIHRlc3Q6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IHNvbHV0aW9uXCIsXG4gICAgICAgICAgICAgICAgYXN5bmMgY2FsbGJhY2soKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFRlc3RpbmdNYW5hZ2VyLnRlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1tmYWxzZSwgZmFsc2VdLCBbZmFsc2VdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW3RydWUsIGZhbHNlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCB0cnVlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW3RydWUsIHRydWVdLCBbZmFsc2VdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRpbWVvdXQ6IDEyNTAgfSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoe1xuICAgICAgICAgICAga2V5YmluZHMsXG4gICAgICAgICAgICBtZW51LFxuICAgICAgICAgICAgc2F2ZSxcbiAgICAgICAgICAgIGluaXRpYWw6IFtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogNTAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDUwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IE91dHB1dCh7IHg6IDcwMCwgeTogMTUwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICBdLm1hcCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQucGVybWFuZW50KCkpLFxuICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGxpbWl0czoge1xuICAgICAgICAgICAgICAgIGlucHV0czogMixcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiAxLFxuICAgICAgICAgICAgICAgIGNoaXBzVG90YWw6IDQsXG4gICAgICAgICAgICAgICAgd2lyaW5nczogOSxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzVG90YWw6IDgsXG4gICAgICAgICAgICAgICAgY2hpcHM6IHsgTkFORDogNCB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiUmVjcmVhdGUgYSBYT1IgZ2F0ZSB1c2luZyBvbmx5IE5BTkQgZ2F0ZXMuXCIpO1xuICAgIH0sXG59O1xuIiwiaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgREVMQVksIElTX01BQ19PUywgTE9DS0VEX0ZPUl9URVNUSU5HLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBDaGlwIH0gZnJvbSBcIi4vY2hpcHNcIjtcbmltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnQ8SSBleHRlbmRzIG51bWJlciwgTyBleHRlbmRzIG51bWJlcj4gZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgcmVhZG9ubHkgaW5wdXRzO1xuICAgIHJlYWRvbmx5IG91dHB1dHM7XG4gICAgcmVhZG9ubHkgbmFtZTtcblxuICAgIHJlYWRvbmx5ICNvYnNlcnZlcnMgPSBuZXcgTWFwPEVsZW1lbnQsIE11dGF0aW9uT2JzZXJ2ZXI+KCk7XG4gICAgcmVhZG9ubHkgI21vdXNldXBzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuICAgIHJlYWRvbmx5ICNjb250ZXh0bWVudXMgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG4gICAgcmVhZG9ubHkgI2NsaWNrcyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcblxuICAgIHJlYWRvbmx5IGNoaXA6IENoaXA8SSwgTz47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgY2hpcDogQ2hpcDxJLCBPPixcbiAgICAgICAgcG9zOlxuICAgICAgICAgICAgfCB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfVxuICAgICAgICAgICAgfCAoKGNvbXA6IENvbXBvbmVudDxJLCBPPikgPT4geyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH0pLFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuY2hpcCA9IGNoaXA7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KHRoaXMuY2hpcC5pbnB1dHMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjb21wb25lbnQtbmFtZVwiPiR7dGhpcy5jaGlwLm5hbWV9PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KHRoaXMuY2hpcC5vdXRwdXRzKS5maWxsKCc8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LW91dHB1dC1idXR0b25cIj5PPC9idXR0b24+Jykuam9pbihcIlwiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LWlucHV0LWJ1dHRvblwiKSk7XG4gICAgICAgIHRoaXMub3V0cHV0cyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCIpKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1uYW1lXCIpITtcblxuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLnNldChpbnB1dCwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGUuYmluZCh0aGlzKSkpO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQoaW5wdXQsICgpID0+IGlucHV0LmJsdXIoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQoaW5wdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoZnJvbSkgPT4gbmV3IFdpcmluZyhmcm9tLCBpbnB1dCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI21vdXNldXBzLnNldChvdXRwdXQsICgpID0+IG91dHB1dC5ibHVyKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KG91dHB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY3JlYXRlLWNvbm5lY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogXCJRXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOZXdXaXJlQ29udGV4dC5mcm9tID0gb3V0cHV0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IG91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUudG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKCh0bykgPT4gbmV3IFdpcmluZyhvdXRwdXQsIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy4jY2xpY2tzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVFcIikpIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldCh0aGlzLm5hbWUsICgpID0+IHtcbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggWFwiIDogXCJDdHJsIFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUEVSTUFORU5UKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGNvbXBvbmVudCBpcyBwZXJtYW5lbnQgYW5kIGNhbm5vdCBiZSBkZWxldGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZSgpLCAwKTtcblxuICAgICAgICB0aGlzLm1vdmUodHlwZW9mIHBvcyA9PT0gXCJmdW5jdGlvblwiID8gcG9zLmNhbGwodW5kZWZpbmVkLCB0aGlzKSA6IHBvcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlKCkge1xuICAgICAgICBjb25zdCBvdXQgPSB0aGlzLmNoaXAuZXZhbHVhdGUodGhpcy5pbnB1dHMubWFwKChpKSA9PiBpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSkpO1xuXG4gICAgICAgIGF3YWl0IERFTEFZKDEwMCArIE1hdGgucmFuZG9tKCkgKiA1MCAtIDI1KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBvdXRbaV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlcnMuZ2V0KGlucHV0KSEub2JzZXJ2ZShpbnB1dCwge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwcy5nZXQoaW5wdXQpISk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KGlucHV0KSEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cHMuZ2V0KG91dHB1dCkhKTtcblxuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KG91dHB1dCkhKTtcblxuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNjbGlja3MuZ2V0KG91dHB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5uYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMubmFtZSkhKTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIud2F0Y2godGhpcy5lbGVtZW50LCB0aGlzLm5hbWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgc3VwZXIuZGV0YWNoKCk7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmZvckVhY2goKG8pID0+IG8uZGlzY29ubmVjdCgpKTtcblxuICAgICAgICB0aGlzLiNtb3VzZXVwcy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLiNjbGlja3MuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy5uYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMubmFtZSkhKTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZm9yZ2V0KHRoaXMuZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgREVMQVksIElTX01BQ19PUywgTE9DS0VEX0ZPUl9URVNUSU5HLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgRGlzcGxheSBleHRlbmRzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IGVsZW1lbnQ7XG5cbiAgICByZWFkb25seSBpbnB1dHM7XG4gICAgcmVhZG9ubHkgb3V0cHV0cztcbiAgICByZWFkb25seSBkaXNwbGF5O1xuXG4gICAgcmVhZG9ubHkgI29ic2VydmVycyA9IG5ldyBNYXA8RWxlbWVudCwgTXV0YXRpb25PYnNlcnZlcj4oKTtcbiAgICByZWFkb25seSAjbW91c2V1cHMgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51cyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY2xpY2tzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuXG4gICAgI2JpdHM7XG4gICAgI3JhZGl4O1xuXG4gICAgY29uc3RydWN0b3IocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCB9LCBiaXRzID0gMSwgcmFkaXggPSAxMCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuI2JpdHMgPSBiaXRzO1xuICAgICAgICB0aGlzLiNyYWRpeCA9IHJhZGl4O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlzcGxheVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkoYml0cykuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dC1idXR0b25cIj5JPC9idXR0b24+Jykuam9pbihcIlwiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImRpc3BsYXktY29udGVudFwiPjA8L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkoYml0cykuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCI+TzwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmlucHV0cyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1pbnB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5kaXNwbGF5LWNvbnRlbnRcIikhO1xuXG4gICAgICAgIHRoaXMuI3VwZGF0ZUxpc3RlbmVycygpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGUoKSwgMCk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHBvcyk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlKCkge1xuICAgICAgICBjb25zdCBvdXQgPSB0aGlzLmlucHV0cy5tYXAoKGkpID0+IGkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcblxuICAgICAgICBhd2FpdCBERUxBWSgxMDAgKyBNYXRoLnJhbmRvbSgpICogNTAgLSAyNSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHRDb250ZW50ID0gb3V0XG4gICAgICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiLCBpLCBuKSA9PiBhICsgK2IgKiAyICoqIChuLmxlbmd0aCAtIGkgLSAxKSwgMClcbiAgICAgICAgICAgIC50b1N0cmluZyh0aGlzLiNyYWRpeCk7XG5cbiAgICAgICAgWy4uLnRoaXMub3V0cHV0c10ucmV2ZXJzZSgpLmZvckVhY2goKG91dHB1dCwgaSkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgb3V0W2ldKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLiNtYWtlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCwgdGhpcy5kaXNwbGF5KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHN1cGVyLmRldGFjaCgpO1xuXG4gICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZm9yZ2V0KHRoaXMuZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgI3VwZGF0ZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5jbGVhcigpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlcnMuc2V0KGlucHV0LCBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI21vdXNldXBzLnNldChpbnB1dCwgKCkgPT4gaW5wdXQuYmx1cigpKTtcblxuICAgICAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldChpbnB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChmcm9tKSA9PiBuZXcgV2lyaW5nKGZyb20sIGlucHV0KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jbW91c2V1cHMuc2V0KG91dHB1dCwgKCkgPT4gb3V0cHV0LmJsdXIoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQob3V0cHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjcmVhdGUtY29ubmVjdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIGNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBcIlFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKHRvKSA9PiBuZXcgV2lyaW5nKG91dHB1dCwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLiNjbGlja3Muc2V0KG91dHB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiS2V5UVwiKSkgTmV3V2lyZUNvbnRleHQuZnJvbSA9IG91dHB1dDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KHRoaXMuZGlzcGxheSwgKCkgPT4ge1xuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwic2V0LWJpdHNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU2V0IGJpdHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiRW50ZXIgdGhlIG51bWJlciBvZiBiaXRzOlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5wdXQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpdHMgPSAraW5wdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGJpdHMpIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGJpdHMpIHx8IGJpdHMgPCAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTnVtYmVyIG9mIGJpdHMgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy4jYml0cyA9PT0gYml0cykgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLiNiaXRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dHMgPSBbLi4udGhpcy5pbnB1dHNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dHMgPSBbLi4udGhpcy5vdXRwdXRzXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jYml0cyA9IGJpdHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5yZW1vdmUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgobykgPT4gby5yZW1vdmUoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNwbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5BcnJheShiaXRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsbCh1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKCkgPT4gaHRtbGA8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LWlucHV0LWJ1dHRvblwiPkk8L2J1dHRvbj5gKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zcGxpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLkFycmF5KGJpdHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWxsKHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoKSA9PiBodG1sYDxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiPk88L2J1dHRvbj5gKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGljID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1pbnB1dHNcIikhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2MgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW91dHB1dHNcIikhO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpYy5hcHBlbmRDaGlsZChpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgobykgPT4gb2MuYXBwZW5kQ2hpbGQobykpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiN1cGRhdGVMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jbWFrZUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRCYXNlZFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNiaXRzID0gcHJldmlvdXM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5yZW1vdmUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgobykgPT4gby5yZW1vdmUoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNwbGljZSgwLCB0aGlzLmlucHV0cy5sZW5ndGgsIC4uLmlucHV0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc3BsaWNlKDAsIHRoaXMub3V0cHV0cy5sZW5ndGgsIC4uLm91dHB1dHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpYyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXRzXCIpITtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9jID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXRzXCIpITtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaWMuYXBwZW5kQ2hpbGQoaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG8pID0+IG9jLmFwcGVuZENoaWxkKG8pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI21ha2VMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuZm9yY2VTYXZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkQmFzZWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZXQtcmFkaXhcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU2V0IHJhZGl4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIkVudGVyIHRoZSBudW1iZXIgb2YgYml0czpcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYWRpeCA9ICtpbnB1dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNOYU4ocmFkaXgpIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKHJhZGl4KSB8fCByYWRpeCA8IDEgfHwgcmFkaXggPiAxNilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkRpc3BsYXkgcmFkaXggbXVzdCBiZSBhbiBpbnRlZ2VyIGZyb20gMSB0byAxNi5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy4jcmFkaXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3JhZGl4ID0gcmFkaXg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmZvcmNlU2F2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNyYWRpeCA9IHByZXZpb3VzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5mb3JjZVNhdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29tcG9uZW50XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIFhcIiA6IFwiQ3RybCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBFUk1BTkVOVClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBjb21wb25lbnQgaXMgcGVybWFuZW50IGFuZCBjYW5ub3QgYmUgZGVsZXRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICNtYWtlTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmdldChpbnB1dCkhLm9ic2VydmUoaW5wdXQsIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cHMuZ2V0KGlucHV0KSEpO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChpbnB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXBzLmdldChvdXRwdXQpISk7XG5cbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChvdXRwdXQpISk7XG5cbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jY2xpY2tzLmdldChvdXRwdXQpISk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLmRpc3BsYXkpISk7XG4gICAgfVxuXG4gICAgI2Rlc3Ryb3lMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVycy5mb3JFYWNoKChvKSA9PiBvLmRpc2Nvbm5lY3QoKSk7XG5cbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy4jY2xpY2tzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLmRpc3BsYXkpISk7XG4gICAgfVxuXG4gICAgZ2V0IGJpdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNiaXRzO1xuICAgIH1cblxuICAgIGdldCByYWRpeCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3JhZGl4O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElTX01BQ19PUywgTE9DS0VEX0ZPUl9URVNUSU5HLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCB9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGA8YnV0dG9uIGNsYXNzPVwiYm9hcmQtaW5wdXRcIj5JPC9idXR0b24+YDtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICByZWFkb25seSAjbW91c2V1cCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmJsdXIoKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI21vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnggPSBlLmNsaWVudFgudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQueSA9IGUuY2xpZW50WS50b1N0cmluZygpO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVFcIikpIHJldHVybiAoTmV3V2lyZUNvbnRleHQuZnJvbSA9IHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKE1hdGguaHlwb3QoZS5jbGllbnRYIC0gK3RoaXMuZWxlbWVudC5kYXRhc2V0LnghLCBlLmNsaWVudFkgLSArdGhpcy5lbGVtZW50LmRhdGFzZXQueSEpID4gMikgcmV0dXJuO1xuXG4gICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlID0gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgIWFjdGl2ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGFjdGl2ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY29udGV4dG1lbnUgPSAoKSA9PiB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjcmVhdGUtY29ubmVjdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUVwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlLWlucHV0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGlucHV0XCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIFhcIiA6IFwiQ3RybCBYXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGlucHV0IGlzIHBlcm1hbmVudCBhbmQgY2Fubm90IGJlIGRlbGV0ZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUudG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKCh0bykgPT4gbmV3IFdpcmluZyh0aGlzLmVsZW1lbnQsIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUudG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKCh0bykgPT4gbmV3IFdpcmluZyh0aGlzLmVsZW1lbnQsIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0pO1xuICAgIH07XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNjbGljayk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgc3VwZXIuZGV0YWNoKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElTX01BQ19PUywgTE9DS0VEX0ZPUl9URVNUSU5HLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgcmVhZG9ubHkgI21vdXNldXAgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5ibHVyKCk7XG4gICAgfTtcblxuICAgIHJlYWRvbmx5ICNjb250ZXh0bWVudSA9ICgpID0+IHtcbiAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1vdXRwdXRcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgb3V0cHV0XCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIFhcIiA6IFwiQ3RybCBYXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIG91dHB1dCBpcyBwZXJtYW5lbnQgYW5kIGNhbm5vdCBiZSBkZWxldGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gdGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoZnJvbSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0aGlzLmVsZW1lbnQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgdGhpcy5lbGVtZW50KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0pO1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwb3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IGNlbnRlcmVkPzogYm9vbGVhbiB9ID0geyB4OiAwLCB5OiAwIH0pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBodG1sYDxidXR0b24gY2xhc3M9XCJib2FyZC1vdXRwdXRcIj5PPC9idXR0b24+YDtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5mb3JnZXQodGhpcy5lbGVtZW50LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IFNDVUZGRURfVVVJRCB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWwodGVtcGxhdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IHVua25vd25bXSk6IEhUTUxFbGVtZW50O1xuZXhwb3J0IGZ1bmN0aW9uIGh0bWwoaHRtbDogc3RyaW5nKTogSFRNTEVsZW1lbnQ7XG5leHBvcnQgZnVuY3Rpb24gaHRtbCguLi5hcmdzOiBbc3RyaW5nXSB8IFtUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udW5rbm93bltdXSkge1xuICAgIGNvbnN0IFt0ZW1wbGF0ZSwgLi4udmFsdWVzXSA9IGFyZ3M7XG5cbiAgICBjb25zdCBodG1sID1cbiAgICAgICAgdHlwZW9mIHRlbXBsYXRlID09PSBcInN0cmluZ1wiID8gdGVtcGxhdGUgOiB0ZW1wbGF0ZS5yZWR1Y2UoKGh0bWwsIHMsIGkpID0+IGh0bWwgKyBzICsgKHZhbHVlc1tpXSA/PyBcIlwiKSwgXCJcIik7XG5cbiAgICByZXR1cm4gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKS5ib2R5LmNoaWxkTm9kZXNbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjc3ModGVtcGxhdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IHVua25vd25bXSk6IHN0cmluZztcbmV4cG9ydCBmdW5jdGlvbiBjc3MoY3NzOiBzdHJpbmcpOiBzdHJpbmc7XG5leHBvcnQgZnVuY3Rpb24gY3NzKC4uLmFyZ3M6IFtzdHJpbmddIHwgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi51bmtub3duW11dKSB7XG4gICAgY29uc3QgW3RlbXBsYXRlLCAuLi52YWx1ZXNdID0gYXJncztcblxuICAgIGNvbnN0IGNzcyA9XG4gICAgICAgIHR5cGVvZiB0ZW1wbGF0ZSA9PT0gXCJzdHJpbmdcIiA/IHRlbXBsYXRlIDogdGVtcGxhdGUucmVkdWNlKChjc3MsIHMsIGkpID0+IGNzcyArIHMgKyAodmFsdWVzW2ldID8/IFwiXCIpLCBcIlwiKTtcblxuICAgIHJldHVybiBjc3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdmVybGFwcGVkQm91bmRzKHJlY3Q6IERPTVJlY3QsIGZyb206IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSwgdG86IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkge1xuICAgIGNvbnN0IGJvdW5kcyA9IHtcbiAgICAgICAgeDogTWF0aC5taW4oZnJvbS54LCB0by54KSxcbiAgICAgICAgeTogTWF0aC5taW4oZnJvbS55LCB0by55KSxcbiAgICAgICAgd2lkdGg6IE1hdGguYWJzKGZyb20ueCAtIHRvLngpLFxuICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGZyb20ueSAtIHRvLnkpLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICByZWN0LnggPD0gYm91bmRzLnggKyBib3VuZHMud2lkdGggJiZcbiAgICAgICAgcmVjdC54ICsgcmVjdC53aWR0aCA+PSBib3VuZHMueCAmJlxuICAgICAgICByZWN0LnkgPD0gYm91bmRzLnkgKyBib3VuZHMuaGVpZ2h0ICYmXG4gICAgICAgIHJlY3QueSArIHJlY3QuaGVpZ2h0ID49IGJvdW5kcy55XG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KGU6IEV2ZW50KSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgdXVpZCA9IFNDVUZGRURfVVVJRCgpO1xuXG4gICAgcHJvdGVjdGVkIFBFUk1BTkVOVCA9IGZhbHNlO1xuXG4gICAgc3RhdGljIGFjdGl2ZSA9IG5ldyBXYXRjaGVkU2V0PFJlaWZpZWQ+KCk7XG5cbiAgICBzdGF0aWMgZ2V0IHJvb3QoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5yZWlmaWVkLXJvb3RcIikhO1xuICAgIH1cblxuICAgIGFic3RyYWN0IHJlYWRvbmx5IGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gICAgbW92ZSh7IHgsIHksIGNlbnRlcmVkIH06IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IGNlbnRlcmVkPzogYm9vbGVhbiB9KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0geCArIFwicHhcIjtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHkgKyBcInB4XCI7XG5cbiAgICAgICAgaWYgKGNlbnRlcmVkKVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0b3AsIGxlZnQsIHdpZHRoLCBoZWlnaHQgfSA9IGdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIHRoaXMubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQobGVmdCkgLSBwYXJzZUZsb2F0KHdpZHRoKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQodG9wKSAtIHBhcnNlRmxvYXQoaGVpZ2h0KSAvIDIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIFJlaWZpZWQucm9vdC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHBlcm1hbmVudCgpIHtcbiAgICAgICAgdGhpcy5QRVJNQU5FTlQgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldCBwZXJtYW5lbmNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5QRVJNQU5FTlQ7XG4gICAgfVxuXG4gICAgZ2V0IHBvcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQodGhpcy5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgeTogcGFyc2VGbG9hdCh0aGlzLmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJ0eXBlIEJvb2xlYW5UdXBsZTxMIGV4dGVuZHMgbnVtYmVyLCBSIGV4dGVuZHMgYm9vbGVhbltdID0gW10+ID0gbnVtYmVyIGV4dGVuZHMgTFxuICAgID8gYm9vbGVhbltdXG4gICAgOiBSW1wibGVuZ3RoXCJdIGV4dGVuZHMgTFxuICAgID8gUlxuICAgIDogQm9vbGVhblR1cGxlPEwsIFsuLi5SLCBib29sZWFuXT47XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDaGlwPEkgZXh0ZW5kcyBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXI+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRTogc3RyaW5nO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFM6IG51bWJlcjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUzogbnVtYmVyO1xuXG4gICAgcmVhZG9ubHkgbmFtZTtcblxuICAgIHJlYWRvbmx5IGlucHV0cztcbiAgICByZWFkb25seSBvdXRwdXRzO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBpbnB1dHM6IEksIG91dHB1dHM6IE8pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBpbnB1dHM7XG4gICAgICAgIHRoaXMub3V0cHV0cyA9IG91dHB1dHM7XG4gICAgfVxuXG4gICAgYWJzdHJhY3Qgb3V0cHV0KGlucHV0czogQm9vbGVhblR1cGxlPEk+KTogQm9vbGVhblR1cGxlPE8+O1xuXG4gICAgZXZhbHVhdGUoaW5wdXRzOiBib29sZWFuW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0cHV0KGlucHV0cyBhcyBCb29sZWFuVHVwbGU8SSwgW10+KSBhcyBib29sZWFuW107XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW5kR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJBTkRcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJBTkRcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFthICYmIGJdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9yR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJPUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk9SXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbYSB8fCBiXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3RHYXRlIGV4dGVuZHMgQ2hpcDwxLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk5PVFwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAxO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk5PVFwiLCAxLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW25dOiBbYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyFuXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOYW5kR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJOQU5EXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiTkFORFwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyEoYSAmJiBiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9yR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJOT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJOT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshKGEgfHwgYildO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFhvckdhdGUgZXh0ZW5kcyBDaGlwPDIsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiWE9SXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiWE9SXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbISEoK2EgXiArYildO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFhub3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIlhOT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJYTk9SXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbISgrYSBeICtiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQnVmZmVyR2F0ZSBleHRlbmRzIENoaXA8MSwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJCVUZcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMTtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJCVUZGRVJcIiwgMSwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFtuXTogW2Jvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFtuXTtcbiAgICB9XG59XG5cbnR5cGUgU3RhdGljTWVtYmVyczxUPiA9IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gfTtcbnR5cGUgRXh0ZW5kZWRDaGlwPEkgZXh0ZW5kcyBudW1iZXIgPSBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXIgPSBudW1iZXI+ID0gU3RhdGljTWVtYmVyczx0eXBlb2YgQ2hpcDxJLCBPPj4gJiB7XG4gICAgbmV3ICgpOiBDaGlwPEksIE8+O1xufTtcblxuZXhwb3J0IGNvbnN0IGdhdGVzID0gW0FuZEdhdGUsIE9yR2F0ZSwgTm90R2F0ZSwgTmFuZEdhdGUsIE5vckdhdGUsIFhvckdhdGUsIFhub3JHYXRlLCBCdWZmZXJHYXRlXSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IGNoaXBzID0gbmV3IE1hcDxzdHJpbmcsIEV4dGVuZGVkQ2hpcD4oZ2F0ZXMubWFwKChnYXRlKSA9PiBbZ2F0ZS5OQU1FLCBnYXRlXSkpO1xuXG5jaGlwcy5zZXQoXCJCVUZGXCIsIEJ1ZmZlckdhdGUpO1xuY2hpcHMuc2V0KFwiQlVGRkVSXCIsIEJ1ZmZlckdhdGUpO1xuXG5leHBvcnQgY2xhc3MgSGFsZkFkZGVyR2F0ZSBleHRlbmRzIENoaXA8MiwgMj4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJIQUxGQURERVJcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJIQUREXCIsIDIsIDIpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuLCBib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbISEoK2EgXiArYiksIGEgJiYgYl07XG4gICAgfVxufVxuXG5jaGlwcy5zZXQoSGFsZkFkZGVyR2F0ZS5OQU1FLCBIYWxmQWRkZXJHYXRlKTtcbmNoaXBzLnNldChcIkhBRERcIiwgSGFsZkFkZGVyR2F0ZSk7XG5cbmV4cG9ydCBjbGFzcyBGdWxsQWRkZXJHYXRlIGV4dGVuZHMgQ2hpcDwzLCAyPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkZVTExBRERFUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAzO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkZBRERcIiwgMywgMik7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiLCBjXTogW2Jvb2xlYW4sIGJvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW4sIGJvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshISgrISEoK2EgXiArYikgXiArYyksICghISgrYSBeICtiKSAmJiBjKSB8fCAoYSAmJiBiKV07XG4gICAgfVxufVxuXG5jaGlwcy5zZXQoRnVsbEFkZGVyR2F0ZS5OQU1FLCBGdWxsQWRkZXJHYXRlKTtcbmNoaXBzLnNldChcIkZBRERcIiwgRnVsbEFkZGVyR2F0ZSk7XG4iLCJleHBvcnQgY29uc3QgYXR0YWNoU3R5bGVzID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGNzcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBbXCJzdHlsZVwiLCBcImNvbXBvbmVudFwiLCBcImlvXCIsIFwiY29udGV4dG1lbnVcIiwgXCJ0b2FzdFwiLCBcIm1vZGFsc1wiLCBcImJ1dHRvbnNcIiwgXCJkYXJrbW9kZVwiLCBcInF1aWNrcGlja1wiXS5tYXAoXG4gICAgICAgICAgICAobmFtZSkgPT4gaW1wb3J0KGAuLyR7bmFtZX0udHNgKSxcbiAgICAgICAgKSxcbiAgICApLnRoZW4oKGNzcykgPT4gY3NzLm1hcCgoXykgPT4gXy5kZWZhdWx0KS5qb2luKFwiXCIpKTtcblxuICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG4gICAgc3R5bGUudGV4dENvbnRlbnQgPSBjc3M7XG5cbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHN0eWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHJlc29sdmUsIHsgb25jZTogdHJ1ZSB9KTtcblxuICAgICAgICBzdHlsZS5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgcmVqZWN0LCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfSk7XG59O1xuIiwiaW1wb3J0IHtcbiAgICBFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1IsXG4gICAgS0lOREFfTElHSFRfR1JBWV9DU1NfQ09MT1IsXG4gICAgTElHSFRFUl9HUkFZX0NTU19DT0xPUixcbiAgICBTVVBFUl9HUkFZX0NTU19DT0xPUixcbn0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgYnV0dG9uLmRhcmttb2RlIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgICAgIGxlZnQ6IDE2cHg7XG4gICAgICAgIGJvdHRvbTogMTZweDtcblxuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuXG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcblxuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcblxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtFVkVOX0xJR0hURVJfR1JBWV9DU1NfQ09MT1J9O1xuXG4gICAgICAgIHRyYW5zaXRpb246IDAuMXMgZWFzZSBiYWNrZ3JvdW5kLWNvbG9yO1xuICAgIH1cblxuICAgIGJ1dHRvbi5kYXJrbW9kZTpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7TElHSFRFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYnV0dG9uLnVuZG8ge1xuICAgICAgICBsZWZ0OiA2NHB4O1xuICAgIH1cblxuICAgIGJ1dHRvbi5yZWRvIHtcbiAgICAgICAgbGVmdDogMTIycHg7XG4gICAgfVxuXG4gICAgYnV0dG9uLnVuZG8sXG4gICAgYnV0dG9uLnJlZG8ge1xuICAgICAgICBjb2xvcjogJHtLSU5EQV9MSUdIVF9HUkFZX0NTU19DT0xPUn07XG5cbiAgICAgICAgYm90dG9tOiAyNHB4O1xuXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICBmb250LXNpemU6IDE2cHg7XG5cbiAgICAgICAgYm9yZGVyOiBub25lO1xuXG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgICAgICB0cmFuc2l0aW9uOiAwLjFzIGVhc2UgY29sb3I7XG4gICAgfVxuXG4gICAgYnV0dG9uLnVuZG86aG92ZXIsXG4gICAgYnV0dG9uLnJlZG86aG92ZXIge1xuICAgICAgICBjb2xvcjogJHtTVVBFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuYDtcbiIsImltcG9ydCB7IGNzcyB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuICAgIC5kaXNwbGF5LFxuICAgIC5jb21wb25lbnQge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG5cbiAgICAgICAgei1pbmRleDogMTA7XG5cbiAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA2cHggYXV0byA2cHg7XG5cbiAgICAgICAgaGVpZ2h0OiBmaXQtY29udGVudDtcbiAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xuXG4gICAgICAgIG1pbi1oZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi13aWR0aDogMTAwcHg7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RlZGVkZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIH1cblxuICAgIC5kaXNwbGF5OmhvdmVyLFxuICAgIC5jb21wb25lbnQ6aG92ZXIge1xuICAgICAgICBjdXJzb3I6IGdyYWI7XG4gICAgfVxuXG4gICAgLmNvbXBvbmVudC1pbnB1dHMsXG4gICAgLmNvbXBvbmVudC1vdXRwdXRzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG5cbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuXG4gICAgICAgIGdhcDogNHB4O1xuICAgIH1cblxuICAgIC5jb21wb25lbnQtaW5wdXQtYnV0dG9uLFxuICAgIC5jb21wb25lbnQtb3V0cHV0LWJ1dHRvbiB7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgZm9udC1mYW1pbHk6IHNlcmlmO1xuICAgICAgICBmb250LXdlaWdodDogOTAwO1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG5cbiAgICAgICAgY29sb3I6ICNjY2NjY2M7XG5cbiAgICAgICAgaGVpZ2h0OiAxNnB4O1xuICAgICAgICB3aWR0aDogMTZweDtcblxuICAgICAgICBwYWRkaW5nOiAwO1xuXG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZWRlZGU7XG4gICAgfVxuXG4gICAgLmNvbXBvbmVudC1pbnB1dC1idXR0b24ge1xuICAgICAgICBtYXJnaW4tbGVmdDogLTZweDtcblxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgfVxuXG4gICAgLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uIHtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAtNnB4O1xuXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICB9XG5cbiAgICAuY29tcG9uZW50LWlucHV0LWJ1dHRvbi5hY3RpdmF0ZWQsXG4gICAgLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uLmFjdGl2YXRlZCB7XG4gICAgICAgIGNvbG9yOiAjZmY3Nzc3O1xuICAgIH1cblxuICAgIC5kaXNwbGF5LWNvbnRlbnQsXG4gICAgLmNvbXBvbmVudC1uYW1lIHtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICBwbGFjZS1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICAgICAgICBmb250LXdlaWdodDogOTAwO1xuICAgICAgICBmb250LXNpemU6IDEuNXJlbTtcblxuICAgICAgICBwYWRkaW5nOiAwIDhweDtcblxuICAgICAgICBjb2xvcjogIzMzMzMzMztcblxuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB9XG5gO1xuIiwiaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgLmNvbnRleHRtZW51IHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgICAgIHotaW5kZXg6IDEwMDtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgICAgIHdpZHRoOiAyMDBweDtcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGVkZWRlO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcblxuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgICAgICBib3gtc2hhZG93OiAxcHggMXB4IDRweCAjZGVkZWRlO1xuICAgIH1cblxuICAgIC5jb250ZXh0bWVudSA+IC5iciB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGVkZWRlO1xuICAgIH1cblxuICAgIC5jb250ZXh0bWVudSA+IGJ1dHRvbiB7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG5cbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG5cbiAgICAgICAgYm9yZGVyOiBub25lO1xuXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAgICAgICBwYWRkaW5nOiA4cHggOHB4O1xuXG4gICAgICAgIGNvbG9yOiAjOTk5OTk5O1xuICAgIH1cblxuICAgIC5jb250ZXh0bWVudSA+IGJ1dHRvbjpob3ZlciB7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICBjb2xvcjogIzMzMzMzMztcblxuICAgICAgICBiYWNrZ3JvdW5kOiAjZjBmMGYwO1xuICAgIH1cblxuICAgIC5tZW51LWtleWJpbmQge1xuICAgICAgICBjb2xvcjogI2RkZGRkZDtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIGdhcDogMnB4O1xuICAgIH1cblxuICAgIC5tZW51LWtleWJpbmQgPiBzcGFuIHtcbiAgICAgICAgZGlzcGxheTogZ3JpZDtcblxuICAgICAgICBwbGFjZS1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIG1pbi1oZWlnaHQ6IDIwcHg7XG4gICAgICAgIG1pbi13aWR0aDogMTRweDtcbiAgICB9XG5cbiAgICAuY29udGV4dG1lbnUgPiBidXR0b246aG92ZXIgPiAubWVudS1rZXliaW5kIHtcbiAgICAgICAgY29sb3I6ICNiYmJiYmI7XG4gICAgfVxuYDtcbiIsImltcG9ydCB7XG4gICAgREFSS0VSX0dSQVlfQ1NTX0NPTE9SLFxuICAgIERBUktfQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICBEQVJLX0dSQVlfQ1NTX0NPTE9SLFxuICAgIEVWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SLFxuICAgIEtJTkRBX0RBUktfR1JBWV9DU1NfQ09MT1IsXG4gICAgS0lOREFfTElHSFRfR1JBWV9DU1NfQ09MT1IsXG4gICAgTElHSFRFUl9HUkFZX0NTU19DT0xPUixcbiAgICBMSUdIVF9HUkFZX0NTU19DT0xPUixcbiAgICBOT1RfUkVBTExZX0RBUktfR1JBWV9DU1NfQ09MT1IsXG4gICAgT05MWV9BX0hJTlRfT0ZfREFSS19HUkFZX0NTU19DT0xPUixcbiAgICBTTElHSFRMWV9EQVJLRVJfR1JBWV9DU1NfQ09MT1IsXG59IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGNzcyB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuICAgIGJvZHkuZGFya21vZGUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDEwMTAyO1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgYnV0dG9uLmRhcmttb2RlIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtEQVJLRVJfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgYnV0dG9uLmRhcmttb2RlOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtEQVJLX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIGJ1dHRvbi51bmRvLFxuICAgIGJvZHkuZGFya21vZGUgYnV0dG9uLnJlZG8ge1xuICAgICAgICBjb2xvcjogJHtOT1RfUkVBTExZX0RBUktfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgYnV0dG9uLnVuZG86aG92ZXIsXG4gICAgYm9keS5kYXJrbW9kZSBidXR0b24ucmVkbzpob3ZlciB7XG4gICAgICAgIGNvbG9yOiAke09OTFlfQV9ISU5UX09GX0RBUktfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgLmJvYXJkLWlucHV0LFxuICAgIGJvZHkuZGFya21vZGUgLmJvYXJkLW91dHB1dCB7XG4gICAgICAgIGNvbG9yOiAke0xJR0hURVJfR1JBWV9DU1NfQ09MT1J9O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICR7Tk9UX1JFQUxMWV9EQVJLX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke0tJTkRBX0RBUktfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgLmFjdGl2YXRlZCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7REFSS19BQ1RJVkFURURfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5jb21wb25lbnQtaW5wdXQtYnV0dG9uLmFjdGl2YXRlZCxcbiAgICBib2R5LmRhcmttb2RlIC5jb21wb25lbnQtb3V0cHV0LWJ1dHRvbi5hY3RpdmF0ZWQge1xuICAgICAgICBjb2xvcjogI2ZmOTk5OTtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke0RBUktfQUNUSVZBVEVEX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAuY29tcG9uZW50LWlucHV0LWJ1dHRvbixcbiAgICBib2R5LmRhcmttb2RlIC5jb21wb25lbnQtb3V0cHV0LWJ1dHRvbiB7XG4gICAgICAgIGNvbG9yOiAke05PVF9SRUFMTFlfREFSS19HUkFZX0NTU19DT0xPUn07XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJHtEQVJLRVJfR1JBWV9DU1NfQ09MT1J9O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7U0xJR0hUTFlfREFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5kaXNwbGF5LFxuICAgIGJvZHkuZGFya21vZGUgLmNvbXBvbmVudCB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICR7RVZFTl9EQVJLRVJfR1JBWV9DU1NfQ09MT1J9O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7U0xJR0hUTFlfREFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5kaXNwbGF5LWNvbnRlbnQsXG4gICAgYm9keS5kYXJrbW9kZSAuY29tcG9uZW50LW5hbWUge1xuICAgICAgICBmb250LXdlaWdodDogMTAwO1xuXG4gICAgICAgIGNvbG9yOiAke0tJTkRBX0xJR0hUX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5jb250ZXh0bWVudSB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICR7REFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke0VWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgICAgICBib3gtc2hhZG93OiAxcHggMXB4IDRweCAke0VWRU5fREFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5jb250ZXh0bWVudSA+IC5iciB7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAke0RBUktFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAuY29udGV4dG1lbnUgPiBidXR0b24ge1xuICAgICAgICBjb2xvcjogJHtPTkxZX0FfSElOVF9PRl9EQVJLX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5jb250ZXh0bWVudSA+IGJ1dHRvbjpob3ZlciB7XG4gICAgICAgIGNvbG9yOiAke0xJR0hUX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke0RBUktFUl9HUkFZX0NTU19DT0xPUn07XG4gICAgfVxuXG4gICAgYm9keS5kYXJrbW9kZSAubWVudS1rZXliaW5kIHtcbiAgICAgICAgY29sb3I6ICR7REFSS0VSX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC5jb250ZXh0bWVudSA+IGJ1dHRvbjpob3ZlciA+IC5tZW51LWtleWJpbmQge1xuICAgICAgICBjb2xvcjogJHtPTkxZX0FfSElOVF9PRl9EQVJLX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICB9XG5cbiAgICBib2R5LmRhcmttb2RlIC50b2FzdCB7XG4gICAgICAgIGNvbG9yOiAke0xJR0hUX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAke0RBUktFUl9HUkFZX0NTU19DT0xPUn07XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtTTElHSFRMWV9EQVJLRVJfR1JBWV9DU1NfQ09MT1J9O1xuXG4gICAgICAgIGJveC1zaGFkb3c6IDFweCAxcHggNHB4ICR7RVZFTl9EQVJLRVJfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgLmNsb3NlLXRvYXN0IHtcbiAgICAgICAgY29sb3I6ICR7S0lOREFfTElHSFRfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cblxuICAgIGJvZHkuZGFya21vZGUgLnF1aWNrcGljay1pdGVtIHtcbiAgICAgICAgY29sb3I6ICR7S0lOREFfTElHSFRfR1JBWV9DU1NfQ09MT1J9O1xuICAgIH1cbmA7XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgLmJvYXJkLWlucHV0LFxuICAgIC5ib2FyZC1vdXRwdXQge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG5cbiAgICAgICAgei1pbmRleDogMjA7XG5cbiAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcblxuICAgICAgICBjb2xvcjogIzMzMzMzMztcblxuICAgICAgICBmb250LWZhbWlseTogc2VyaWY7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogMTZweDtcblxuICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgIHdpZHRoOiAyNHB4O1xuXG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuXG4gICAgICAgIHBhZGRpbmc6IDA7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RlZGVkZTtcbiAgICB9XG5cbiAgICAuYm9hcmQtaW5wdXQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgfVxuXG4gICAgLmJvYXJkLW91dHB1dCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICB9XG5cbiAgICAuYm9hcmQtaW5wdXQ6aG92ZXIge1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgfVxuXG4gICAgLmJvYXJkLW91dHB1dDpob3ZlciB7XG4gICAgICAgIGN1cnNvcjogZ3JhYjtcbiAgICB9XG5cbiAgICAuYWN0aXZhdGVkIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtBQ1RJVkFURURfQ1NTX0NPTE9SfTtcblxuICAgICAgICBjb2xvcjogI2VlZWVlZTtcbiAgICB9XG5gO1xuIiwiaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgLm1vZGFsLWNvbnRhaW5lciB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGxlZnQ6IDA7XG4gICAgICAgIGJvdHRvbTogMDtcbiAgICAgICAgcmlnaHQ6IDA7XG5cbiAgICAgICAgei1pbmRleDogMTAwMDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwYWE7XG4gICAgfVxuXG4gICAgLm1vZGFsLWNvbnRhaW5lci5tb2RhbC1pbmFjdGl2ZSxcbiAgICAubW9kYWwubW9kYWwtaW5hY3RpdmUge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cblxuICAgIC5tb2RhbCB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZShjYWxjKDUwdncgLSA1MCUpLCBjYWxjKDUwdmggLSA1MCUpKTtcbiAgICB9XG5cbiAgICAubW9kYWwtY29uZmlybSxcbiAgICAubW9kYWwtYWxlcnQge1xuICAgICAgICBtaW4td2lkdGg6IDQwMHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA4MHB4O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlZmVmZWY7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RlZGVkZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuXG4gICAgICAgIHBhZGRpbmc6IDhweCAxMHB4O1xuXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgICAgICAgYm94LXNoYWRvdzogMXB4IDFweCA0cHggIzMzMzMzMztcbiAgICB9XG5cbiAgICAubW9kYWwtY29uZmlybSA+IC5idXR0b24tY29udGFpbmVyLFxuICAgIC5tb2RhbC1hbGVydCA+IC5idXR0b24tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG5cbiAgICAgICAgZ2FwOiA2cHg7XG4gICAgfVxuXG4gICAgLm1vZGFsLW1lc3NhZ2Uge1xuICAgICAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcblxuICAgICAgICBmbGV4OiAxO1xuICAgIH1cblxuICAgIC5tb2RhbC1jYW5jZWwsXG4gICAgLm1vZGFsLW9rIHtcbiAgICAgICAgbWluLXdpZHRoOiA1MHB4O1xuXG4gICAgICAgIHBhZGRpbmc6IDRweCA4cHg7XG5cbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuXG4gICAgICAgIGJvcmRlcjogMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xuXG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuXG4gICAgICAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xuICAgIH1cblxuICAgIC5tb2RhbC1jYW5jZWwge1xuICAgICAgICBvdXRsaW5lOiAxcHggc29saWQgIzMzMzMzMztcbiAgICB9XG5cbiAgICAubW9kYWwtb2sge1xuICAgICAgICBjb2xvcjogd2hpdGU7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAwNzdmZjtcblxuICAgICAgICBvdXRsaW5lOiAxcHggc29saWQgIzAwNzdmZjtcbiAgICB9XG5cbiAgICAubW9kYWwtY2FuY2VsOmhvdmVyIHtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlYWVhZWE7XG4gICAgfVxuXG4gICAgLm1vZGFsLW9rOmhvdmVyIHtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDY2ZWU7XG5cbiAgICAgICAgb3V0bGluZTogMXB4IHNvbGlkICMwMDY2ZWU7XG4gICAgfVxuXG4gICAgLm1vZGFsLWlucHV0IHtcbiAgICAgICAgbWFyZ2luOiA4cHggMDtcblxuICAgICAgICBwYWRkaW5nOiAycHggNHB4O1xuXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcblxuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGVkZWRlO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgfVxuXG4gICAgLm1vZGFsLXBvcHVwIHtcbiAgICAgICAgd2lkdGg6IDYwMHB4O1xuICAgICAgICBtYXgtd2lkdGg6IDYwMHB4O1xuICAgIH1cblxuICAgIC5tb2RhbC1wb3B1cCAubW9kYWwtbWVzc2FnZSB7XG4gICAgICAgIGhlaWdodDogNDUwcHg7XG4gICAgICAgIG1heC1oZWlnaHQ6IDQ1MHB4O1xuXG4gICAgICAgIG92ZXJmbG93LXk6IHNjcm9sbDtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDE2cHg7XG4gICAgfVxuYDtcbiIsImltcG9ydCB7IGNzcyB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY3NzYFxuICAgIC5xdWlja3BpY2staXRlbSB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcblxuICAgICAgICBvcGFjaXR5OiAwO1xuXG4gICAgICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDAuMnM7XG4gICAgICAgIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlO1xuICAgICAgICB0cmFuc2l0aW9uLXByb3BlcnR5OiB0b3AsIGxlZnQ7XG5cbiAgICAgICAgYW5pbWF0aW9uOiBmb3J3YXJkcyBlYXNlIDAuMnMgZmFkZS1pbjtcblxuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB9XG5cbiAgICAucXVpY2twaWNrLWNpcmNsZSB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICBhbmltYXRpb246IGZvcndhcmRzIGVhc2UgMC4ycyBmYWRlLWluO1xuICAgIH1cblxuICAgIEBrZXlmcmFtZXMgZmFkZS1pbiB7XG4gICAgICAgIGZyb20ge1xuICAgICAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvIHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgIH1cbiAgICB9XG5gO1xuIiwiaW1wb3J0IHsgY3NzIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjc3NgXG4gICAgKixcbiAgICAqOjpiZWZvcmUsXG4gICAgKjo6YWZ0ZXIge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgfVxuXG4gICAgaHRtbCB7XG4gICAgICAgIGhlaWdodDogMTAwJTtcblxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgICAgIG92ZXJzY3JvbGwtYmVoYXZpb3I6IG5vbmU7XG4gICAgfVxuXG4gICAgYm9keSB7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICB9XG5cbiAgICAucmVpZmllZC1yb290IHtcbiAgICAgICAgei1pbmRleDogMDtcblxuICAgICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgICAgICB3aWR0aDogMTAwdnc7XG5cbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIH1cblxuICAgIC5iYWNrZ3JvdW5kLWNhbnZhcyxcbiAgICAuZm9yZWdyb3VuZC1jYW52YXMge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG5cbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG5cbiAgICAgICAgd2lkdGg6IDEwMHZ3O1xuICAgICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIH1cblxuICAgIC5iYWNrZ3JvdW5kLWNhbnZhcyB7XG4gICAgICAgIHotaW5kZXg6IC0xMDA7XG4gICAgfVxuXG4gICAgLmZvcmVncm91bmQtY2FudmFzIHtcbiAgICAgICAgei1pbmRleDogMTAwO1xuICAgIH1cbmA7XG4iLCJpbXBvcnQgeyBjc3MgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNzc2BcbiAgICAudG9hc3RzLWNvbnRhaW5lciB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG5cbiAgICAgICAgcGFkZGluZzogMTZweDtcblxuICAgICAgICBnYXA6IDhweDtcblxuICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcblxuICAgICAgICB6LWluZGV4OiAxMDA7XG5cbiAgICAgICAgd2lkdGg6IDEwMHZ3O1xuICAgICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIH1cblxuICAgIC50b2FzdCB7XG4gICAgICAgIGFuaW1hdGlvbjogZm9yd2FyZHMgbGluZWFyIDAuNXMgZmFkZS1vdXQ7XG5cbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgICAgIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuXG4gICAgICAgIG1pbi13aWR0aDogMjc1cHg7XG5cbiAgICAgICAgcGFkZGluZzogMTBweCAxOHB4O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZWRlZGU7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVmZWZlO1xuXG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuXG4gICAgICAgIGJveC1zaGFkb3c6IDFweCAxcHggNHB4ICNkZWRlZGU7XG4gICAgfVxuXG4gICAgLnRvYXN0LWNvbG9yIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgICAgIHdpZHRoOiA2cHg7XG5cbiAgICAgICAgdG9wOiAwO1xuICAgICAgICBib3R0b206IDA7XG4gICAgICAgIGxlZnQ6IDA7XG5cbiAgICAgICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogNHB4O1xuICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA0cHg7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcbiAgICB9XG5cbiAgICAuY2xvc2UtdG9hc3Qge1xuICAgICAgICBwb2ludGVyLWV2ZW50czogYWxsO1xuXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgICAgICBtYXJnaW4tdG9wOiA0cHg7XG5cbiAgICAgICAgZm9udC1zaXplOiAxMHB4O1xuXG4gICAgICAgIGNvbG9yOiAjYWFhYWFhO1xuXG4gICAgICAgIHRvcDogMDtcbiAgICAgICAgcmlnaHQ6IDA7XG5cbiAgICAgICAgYm9yZGVyOiBub25lO1xuXG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIH1cblxuICAgIC5jbG9zZS10b2FzdDpob3ZlciB7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICBjb2xvcjogYmxhY2s7XG4gICAgfVxuXG4gICAgQGtleWZyYW1lcyBmYWRlLW91dCB7XG4gICAgICAgIGZyb20ge1xuICAgICAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvIHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIH1cbiAgICB9XG5gO1xuIiwidmFyIG1hcCA9IHtcblx0XCIuL2F0dGFjaGVyLnRzXCI6IFwiLi9zcmMvc3R5bGluZy9hdHRhY2hlci50c1wiLFxuXHRcIi4vYnV0dG9ucy50c1wiOiBcIi4vc3JjL3N0eWxpbmcvYnV0dG9ucy50c1wiLFxuXHRcIi4vY29tcG9uZW50LnRzXCI6IFwiLi9zcmMvc3R5bGluZy9jb21wb25lbnQudHNcIixcblx0XCIuL2NvbnRleHRtZW51LnRzXCI6IFwiLi9zcmMvc3R5bGluZy9jb250ZXh0bWVudS50c1wiLFxuXHRcIi4vZGFya21vZGUudHNcIjogXCIuL3NyYy9zdHlsaW5nL2Rhcmttb2RlLnRzXCIsXG5cdFwiLi9pby50c1wiOiBcIi4vc3JjL3N0eWxpbmcvaW8udHNcIixcblx0XCIuL21vZGFscy50c1wiOiBcIi4vc3JjL3N0eWxpbmcvbW9kYWxzLnRzXCIsXG5cdFwiLi9xdWlja3BpY2sudHNcIjogXCIuL3NyYy9zdHlsaW5nL3F1aWNrcGljay50c1wiLFxuXHRcIi4vc3R5bGUudHNcIjogXCIuL3NyYy9zdHlsaW5nL3N0eWxlLnRzXCIsXG5cdFwiLi90b2FzdC50c1wiOiBcIi4vc3JjL3N0eWxpbmcvdG9hc3QudHNcIlxufTtcblxuZnVuY3Rpb24gd2VicGFja0FzeW5jQ29udGV4dChyZXEpIHtcblx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblxuXHRcdHZhciBpZCA9IG1hcFtyZXFdO1xuXHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcblx0fSk7XG59XG53ZWJwYWNrQXN5bmNDb250ZXh0LmtleXMgPSAoKSA9PiAoT2JqZWN0LmtleXMobWFwKSk7XG53ZWJwYWNrQXN5bmNDb250ZXh0LmlkID0gXCIuL3NyYy9zdHlsaW5nIGxhenkgcmVjdXJzaXZlIF5cXFxcLlxcXFwvLipcXFxcLnRzJFwiO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQXN5bmNDb250ZXh0OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJ2YXIgd2VicGFja1F1ZXVlcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgcXVldWVzXCIpIDogXCJfX3dlYnBhY2tfcXVldWVzX19cIjtcbnZhciB3ZWJwYWNrRXhwb3J0cyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXhwb3J0c1wiKSA6IFwiX193ZWJwYWNrX2V4cG9ydHNfX1wiO1xudmFyIHdlYnBhY2tFcnJvciA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXJyb3JcIikgOiBcIl9fd2VicGFja19lcnJvcl9fXCI7XG52YXIgcmVzb2x2ZVF1ZXVlID0gKHF1ZXVlKSA9PiB7XG5cdGlmKHF1ZXVlICYmICFxdWV1ZS5kKSB7XG5cdFx0cXVldWUuZCA9IDE7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0pKTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSA/IGZuLnIrKyA6IGZuKCkpKTtcblx0fVxufVxudmFyIHdyYXBEZXBzID0gKGRlcHMpID0+IChkZXBzLm1hcCgoZGVwKSA9PiB7XG5cdGlmKGRlcCAhPT0gbnVsbCAmJiB0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKSB7XG5cdFx0aWYoZGVwW3dlYnBhY2tRdWV1ZXNdKSByZXR1cm4gZGVwO1xuXHRcdGlmKGRlcC50aGVuKSB7XG5cdFx0XHR2YXIgcXVldWUgPSBbXTtcblx0XHRcdHF1ZXVlLmQgPSAwO1xuXHRcdFx0ZGVwLnRoZW4oKHIpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFeHBvcnRzXSA9IHI7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9LCAoZSkgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0Vycm9yXSA9IGU7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBvYmogPSB7fTtcblx0XHRcdG9ialt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKGZuKHF1ZXVlKSk7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblx0fVxuXHR2YXIgcmV0ID0ge307XG5cdHJldFt3ZWJwYWNrUXVldWVzXSA9IHggPT4ge307XG5cdHJldFt3ZWJwYWNrRXhwb3J0c10gPSBkZXA7XG5cdHJldHVybiByZXQ7XG59KSk7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmEgPSAobW9kdWxlLCBib2R5LCBoYXNBd2FpdCkgPT4ge1xuXHR2YXIgcXVldWU7XG5cdGhhc0F3YWl0ICYmICgocXVldWUgPSBbXSkuZCA9IDEpO1xuXHR2YXIgZGVwUXVldWVzID0gbmV3IFNldCgpO1xuXHR2YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xuXHR2YXIgY3VycmVudERlcHM7XG5cdHZhciBvdXRlclJlc29sdmU7XG5cdHZhciByZWplY3Q7XG5cdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuXHRcdHJlamVjdCA9IHJlajtcblx0XHRvdXRlclJlc29sdmUgPSByZXNvbHZlO1xuXHR9KTtcblx0cHJvbWlzZVt3ZWJwYWNrRXhwb3J0c10gPSBleHBvcnRzO1xuXHRwcm9taXNlW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAocXVldWUgJiYgZm4ocXVldWUpLCBkZXBRdWV1ZXMuZm9yRWFjaChmbiksIHByb21pc2VbXCJjYXRjaFwiXSh4ID0+IHt9KSk7XG5cdG1vZHVsZS5leHBvcnRzID0gcHJvbWlzZTtcblx0Ym9keSgoZGVwcykgPT4ge1xuXHRcdGN1cnJlbnREZXBzID0gd3JhcERlcHMoZGVwcyk7XG5cdFx0dmFyIGZuO1xuXHRcdHZhciBnZXRSZXN1bHQgPSAoKSA9PiAoY3VycmVudERlcHMubWFwKChkKSA9PiB7XG5cdFx0XHRpZihkW3dlYnBhY2tFcnJvcl0pIHRocm93IGRbd2VicGFja0Vycm9yXTtcblx0XHRcdHJldHVybiBkW3dlYnBhY2tFeHBvcnRzXTtcblx0XHR9KSlcblx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRmbiA9ICgpID0+IChyZXNvbHZlKGdldFJlc3VsdCkpO1xuXHRcdFx0Zm4uciA9IDA7XG5cdFx0XHR2YXIgZm5RdWV1ZSA9IChxKSA9PiAocSAhPT0gcXVldWUgJiYgIWRlcFF1ZXVlcy5oYXMocSkgJiYgKGRlcFF1ZXVlcy5hZGQocSksIHEgJiYgIXEuZCAmJiAoZm4ucisrLCBxLnB1c2goZm4pKSkpO1xuXHRcdFx0Y3VycmVudERlcHMubWFwKChkZXApID0+IChkZXBbd2VicGFja1F1ZXVlc10oZm5RdWV1ZSkpKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZm4uciA/IHByb21pc2UgOiBnZXRSZXN1bHQoKTtcblx0fSwgKGVycikgPT4gKChlcnIgPyByZWplY3QocHJvbWlzZVt3ZWJwYWNrRXJyb3JdID0gZXJyKSA6IG91dGVyUmVzb2x2ZShleHBvcnRzKSksIHJlc29sdmVRdWV1ZShxdWV1ZSkpKTtcblx0cXVldWUgJiYgKHF1ZXVlLmQgPSAwKTtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiLy8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4vLyBTaW5jZSBhbGwgcmVmZXJlbmNlZCBjaHVua3MgYXJlIGFscmVhZHkgaW5jbHVkZWRcbi8vIGluIHRoaXMgZmlsZSwgdGhpcyBmdW5jdGlvbiBpcyBlbXB0eSBoZXJlLlxuX193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKCkgPT4gKFByb21pc2UucmVzb2x2ZSgpKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9