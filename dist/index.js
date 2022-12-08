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

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACTIVATED_CSS_COLOR": () => (/* binding */ ACTIVATED_CSS_COLOR),
/* harmony export */   "CHIP_COMPONENT_CSS_HEIGHT": () => (/* binding */ CHIP_COMPONENT_CSS_HEIGHT),
/* harmony export */   "CHIP_COMPONENT_CSS_WIDTH": () => (/* binding */ CHIP_COMPONENT_CSS_WIDTH),
/* harmony export */   "CHIP_INPUT_CSS_SIZE": () => (/* binding */ CHIP_INPUT_CSS_SIZE),
/* harmony export */   "CHIP_OUTPUT_CSS_SIZE": () => (/* binding */ CHIP_OUTPUT_CSS_SIZE),
/* harmony export */   "COUNTER_GENERATOR": () => (/* binding */ COUNTER_GENERATOR),
/* harmony export */   "DELAY": () => (/* binding */ DELAY),
/* harmony export */   "GET_CANVAS_CTX": () => (/* binding */ GET_CANVAS_CTX),
/* harmony export */   "GRID_SIZE": () => (/* binding */ GRID_SIZE),
/* harmony export */   "INPUT_COMPONENT_CSS_SIZE": () => (/* binding */ INPUT_COMPONENT_CSS_SIZE),
/* harmony export */   "IN_DEBUG_MODE": () => (/* binding */ IN_DEBUG_MODE),
/* harmony export */   "IS_MAC_OS": () => (/* binding */ IS_MAC_OS),
/* harmony export */   "LIGHT_GRAY_CSS_COLOR": () => (/* binding */ LIGHT_GRAY_CSS_COLOR),
/* harmony export */   "LOCKED_FOR_TESTING": () => (/* binding */ LOCKED_FOR_TESTING),
/* harmony export */   "ORIGIN_POINT": () => (/* binding */ ORIGIN_POINT),
/* harmony export */   "OUTPUT_COMPONENT_CSS_SIZE": () => (/* binding */ OUTPUT_COMPONENT_CSS_SIZE),
/* harmony export */   "ROUND_TO_NEAREST": () => (/* binding */ ROUND_TO_NEAREST),
/* harmony export */   "SCUFFED_UUID": () => (/* binding */ SCUFFED_UUID),
/* harmony export */   "TOAST_DURATION": () => (/* binding */ TOAST_DURATION)
/* harmony export */ });
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./managers/ModalManager */ "./src/managers/ModalManager.ts");

const INPUT_COMPONENT_CSS_SIZE = 24;
const OUTPUT_COMPONENT_CSS_SIZE = 24;
const CHIP_COMPONENT_CSS_WIDTH = 120;
const CHIP_COMPONENT_CSS_HEIGHT = 40;
const CHIP_INPUT_CSS_SIZE = 16;
const CHIP_OUTPUT_CSS_SIZE = 16;
const ORIGIN_POINT = Object.freeze({ x: 0, y: 0 });
const IN_DEBUG_MODE = !!new URL(location.href).searchParams.has("debug");
const IS_MAC_OS = [navigator.userAgentData?.platform, navigator.platform].some((platform) => platform?.toLowerCase().includes("mac") ?? false);
const LOCKED_FOR_TESTING = () => _managers_ModalManager__WEBPACK_IMPORTED_MODULE_0__.ModalManager.alert("The diagram is currently locked for testing. No changes can be made.");
const DELAY = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const GET_CANVAS_CTX = () => document.querySelector("canvas").getContext("2d");
const COUNTER_GENERATOR = function* (i = 0) {
    while (true)
        yield i++;
};
const SCUFFED_UUID = () => Date.now().toString(36) + Number(Date.now().toString().split("").reverse().join("")).toString(36);
const ROUND_TO_NEAREST = (x, n) => Math.round(x / n) * n;
const ACTIVATED_CSS_COLOR = "#ff2626";
const LIGHT_GRAY_CSS_COLOR = "#dedede";
const TOAST_DURATION = 2500;
const GRID_SIZE = 10;


/***/ }),

/***/ "./src/contextmenu/debug.ts":
/*!**********************************!*\
  !*** ./src/contextmenu/debug.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _contextmenu_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contextmenu/menu */ "./src/contextmenu/menu.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files */ "./src/files.ts");
/* harmony import */ var _keybinds_keybinds__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./keybinds/keybinds */ "./src/keybinds/keybinds.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _premade__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./premade */ "./src/premade/index.ts");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styles */ "./src/styles.ts");









Object.assign(globalThis, _constants__WEBPACK_IMPORTED_MODULE_0__);
await (0,_styles__WEBPACK_IMPORTED_MODULE_7__.loadStyles)();
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

/***/ "./src/keybinds/io.ts":
/*!****************************!*\
  !*** ./src/keybinds/io.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "keybinds": () => (/* binding */ keybinds)
/* harmony export */ });
/* harmony import */ var _backspace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./backspace */ "./src/keybinds/backspace.ts");
/* harmony import */ var _behavior__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./behavior */ "./src/keybinds/behavior.ts");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./history */ "./src/keybinds/history.ts");
/* harmony import */ var _io__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./io */ "./src/keybinds/io.ts");
/* harmony import */ var _select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./select */ "./src/keybinds/select.ts");
/* harmony import */ var _serde__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./serde */ "./src/keybinds/serde.ts");






const keybinds = Object.assign({}, _backspace__WEBPACK_IMPORTED_MODULE_0__.backspace, _behavior__WEBPACK_IMPORTED_MODULE_1__.behavior, _history__WEBPACK_IMPORTED_MODULE_2__.history, _io__WEBPACK_IMPORTED_MODULE_3__.io, _select__WEBPACK_IMPORTED_MODULE_4__.select, _serde__WEBPACK_IMPORTED_MODULE_5__.serde);


/***/ }),

/***/ "./src/keybinds/select.ts":
/*!********************************!*\
  !*** ./src/keybinds/select.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DarkmodeManager": () => (/* binding */ DarkmodeManager)
/* harmony export */ });
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");


class DarkmodeManager {
    static #key = "settings.darkmode";
    static get #enabled() {
        return _StorageManager__WEBPACK_IMPORTED_MODULE_1__.StorageManager.get(this.#key) ?? false;
    }
    static set #enabled(value) {
        _StorageManager__WEBPACK_IMPORTED_MODULE_1__.StorageManager.set(this.#key, value);
        this.#element.innerText = value ? "🌕" : "🌑";
        document.body.classList.toggle("darkmode", value);
    }
    static get #element() {
        return document.querySelector("button.darkmode");
    }
    static #listener = () => {
        this.#enabled = !this.#enabled;
    };
    static listen() {
        this.#enabled = this.#enabled;
        this.#element.innerText = this.#enabled ? "🌕" : "🌑";
        this.#element.style.cssText = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.css `
            & {
                position: absolute;
                left: 16px;
                bottom: 16px;
                width: 40px;
                height: 40px;
                border: none;
                font-size: 18px;
                border-radius: 50%;
                cursor: pointer;
            }
        `;
        this.#element.addEventListener("click", this.#listener);
    }
    static stop() {
        this.#element.removeEventListener("click", this.#listener);
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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DraggingManager": () => (/* binding */ DraggingManager)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");




class DraggingManager {
    static #dragged;
    static #watched = new Map();
    static #mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };
    static #topleft;
    static #original;
    static #downpos = { x: -1, y: -1 };
    static #positions;
    static snapToGrid = false;
    static watch(element, target = element) {
        element.dataset.watched = "true";
        const mousedown = (e) => {
            this.#dragged = element;
            this.#dragged.dataset.dragged = "true";
            this.#dragged.style.cursor = "grabbing";
            const rect = this.#dragged.getBoundingClientRect();
            const body = this.#dragged.parentElement?.getBoundingClientRect() ?? new DOMRect();
            this.#mouse.x = e.clientX;
            this.#mouse.y = e.clientY;
            this.#mouse.ix = e.clientX;
            this.#mouse.iy = e.clientY;
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size <= 1) {
                this.#mouse.ox = e.clientX - rect.left + body.left;
                this.#mouse.oy = e.clientY - rect.top + body.top;
            }
            else {
                this.#positions = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected].map((target) => target.pos);
                const topleft = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected].sort((a, b) => {
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
            const body = this.#dragged.parentElement?.getBoundingClientRect() ?? new DOMRect();
            this.#mouse.x = touch.clientX;
            this.#mouse.y = touch.clientY;
            this.#mouse.ix = touch.clientX;
            this.#mouse.iy = touch.clientY;
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size <= 1) {
                this.#mouse.ox = touch.clientX - rect.left + body.left;
                this.#mouse.oy = touch.clientY - rect.top + body.top;
            }
            else {
                this.#positions = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected].map((target) => target.pos);
                const topleft = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected].sort((a, b) => {
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
        document.body.addEventListener("mousemove", this.#mousemove);
        window.addEventListener("mousedown", this.#mousedown);
        window.addEventListener("mouseup", this.#mouseup);
        document.body.addEventListener("touchmove", this.#touchmove);
        document.body.addEventListener("touchstart", this.#touchstart);
        document.body.addEventListener("touchend", this.#touchend);
    }
    static deafen() {
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
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left =
                        Math.floor((this.#mouse.x - this.#mouse.ox) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                    this.#dragged.style.top =
                        Math.floor((this.#mouse.y - this.#mouse.oy) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.forEach((component) => {
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
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                    this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.forEach((component) => {
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
            this.#downpos.x = e.clientX;
            this.#downpos.y = e.clientY;
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
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size <= 1) {
                const target = this.#dragged;
                const mouse = this.#mouse;
                const original = this.#original;
                const size = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                            target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                            target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                        }, () => {
                            target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                            target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                        });
                    else
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                            target.style.left = mouse.x - mouse.ox - 1 + "px";
                            target.style.top = mouse.y - mouse.oy - 1 + "px";
                        }, () => {
                            target.style.left = original.x - 1 + "px";
                            target.style.top = original.y - 1 + "px";
                        });
            }
            else if (this.#topleft) {
                const mouse = this.#mouse;
                const targets = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected];
                const positions = this.#positions;
                const topleft = this.#topleft.getBoundingClientRect();
                const size = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
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
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
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
            _MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.y !== -1)
            _SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selectAllIn(DraggingManager.#downpos, _MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse);
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
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left =
                        Math.floor((this.#mouse.x - this.#mouse.ox) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                    this.#dragged.style.top =
                        Math.floor((this.#mouse.y - this.#mouse.oy) / _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE) * _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.forEach((component) => {
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
                if (_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                    this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
                }
                else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();
                    _SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.forEach((component) => {
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
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected.size <= 1) {
                const target = this.#dragged;
                const mouse = this.#mouse;
                const original = this.#original;
                const size = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                            target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                            target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                        }, () => {
                            target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                            target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                        });
                    else
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                            target.style.left = mouse.x - mouse.ox - 1 + "px";
                            target.style.top = mouse.y - mouse.oy - 1 + "px";
                        }, () => {
                            target.style.left = original.x - 1 + "px";
                            target.style.top = original.y - 1 + "px";
                        });
            }
            else if (this.#topleft) {
                const mouse = this.#mouse;
                const targets = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selected];
                const positions = this.#positions;
                const topleft = this.#topleft.getBoundingClientRect();
                const size = _constants__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
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
                        _SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
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
            _MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.y !== -1)
            _SelectionManager__WEBPACK_IMPORTED_MODULE_3__.SelectionManager.selectAllIn(DraggingManager.#downpos, _MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse);
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
    }
    static deafen() {
        document.removeEventListener("keydown", this.#keydown);
        document.removeEventListener("keyup", this.#keyup);
        document.removeEventListener("blur", this.#blur);
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
    }
    static stop() {
        document.removeEventListener("mousemove", this.#mousemove);
        document.removeEventListener("mousedown", this.#mousedown);
        document.removeEventListener("mouseup", this.#mouseup);
        document.removeEventListener("touchmove", this.#touchmove);
        document.removeEventListener("touchstart", this.#touchstart);
        document.removeEventListener("touchend", this.#touchend);
        this.#mouse = { x: 0, y: 0 };
    }
    static reset() {
        this.stop();
        this.#mousedowns.clear();
        this.#mouseups.clear();
    }
    static onMouseDown(handler) {
        this.#mousedowns.add(handler);
    }
    static onMouseUp(handler) {
        this.#mouseups.add(handler);
    }
    static offMouseDown(handler) {
        this.#mousedowns.delete(handler);
    }
    static offMouseUp(handler) {
        this.#mouseups.delete(handler);
    }
    static onTouchStart(handler) {
        this.#touchstarts.add(handler);
    }
    static onTouchEnd(handler) {
        this.#touchends.add(handler);
    }
    static offTouchStart(handler) {
        this.#touchstarts.delete(handler);
    }
    static offTouchEnd(handler) {
        this.#touchends.delete(handler);
    }
    static get mouse() {
        return { ...this.#mouse };
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
/* harmony import */ var _DarkmodeManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DarkmodeManager */ "./src/managers/DarkmodeManager.ts");
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MenuManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MenuManager */ "./src/managers/MenuManager.ts");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");


















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
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<canvas></canvas>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<div class="toasts-container"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.html `<button class="darkmode"></button>`);
        _MouseManager__WEBPACK_IMPORTED_MODULE_13__.MouseManager.start();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_10__.KeybindsManager.listen();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.listen();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_14__.SelectionManager.listen();
        _WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.start();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_8__.DarkmodeManager.listen();
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
            _WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.wires = createWiringsSet(this.#config.initial[1]);
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
                        _WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.wires = createWiringsSet(wires);
                    }
                    _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.wires]));
                }
            }
        }
        this.#observer = new MutationObserver(() => {
            if (typeof this.#config.save !== "undefined")
                _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.wires]));
        });
        this.#observer.observe(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        });
        this.#interval = setInterval(() => {
            const check = this.#config.checkState?.(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.clone(), _WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.wires.clone()) ?? false;
            if (check)
                this.#config.ifStateChecked?.();
        }, this.#config.checkInterval ?? 50);
    }
    static manualSave() {
        if (typeof this.#config.save !== "undefined")
            _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.wires]));
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
        _WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.stop();
        _DarkmodeManager__WEBPACK_IMPORTED_MODULE_8__.DarkmodeManager.stop();
        _MenuManager__WEBPACK_IMPORTED_MODULE_11__.MenuManager.remove(_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.root);
        this.clear();
        this.watchedUnresolvedPromises.forEach((finish) => finish.call(undefined));
        this.watchedUnresolvedPromises.clear();
        document.body.innerHTML = "";
        this.#config = {};
        this.#history = [];
        this.#redos = [];
    }
    static clear() {
        _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => component.detach());
        _WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.wires.forEach((wire) => wire.destroy());
        _SelectionManager__WEBPACK_IMPORTED_MODULE_14__.SelectionManager.selected.clear();
    }
    static pushHistory(command, undo) {
        this.#redos.length = 0;
        command.call(undefined);
        this.#history.push([command, undo]);
    }
    static popHistory() {
        if (!this.#history.length)
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
                message: "Nothing to undo.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
        const [redo, undo] = this.#history.pop();
        this.#redos.push([redo, undo]);
        return undo.call(undefined);
    }
    static redoHistory() {
        if (!this.#redos.length)
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_16__.ToastManager.toast({
                message: "Nothing to redo.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: _constants__WEBPACK_IMPORTED_MODULE_1__.TOAST_DURATION,
            });
        const [command, undo] = this.#redos.pop();
        this.#history.push([command, undo]);
        return command.call(undefined);
    }
    static applySettings(settings) {
        _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.snapToGrid = settings.snapToGrid ?? false;
    }
    static applyRawSettings(settings) {
        _DraggingManager__WEBPACK_IMPORTED_MODULE_9__.DraggingManager.snapToGrid = settings["DraggingManager.snapToGrid"];
    }
    static async saveTo(save) {
        this.#config.save = save;
        if (_StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.has("saves:" + this.#config.save) &&
            !(await _ModalManager__WEBPACK_IMPORTED_MODULE_12__.ModalManager.confirm("There is already a save with this name. Are you sure you want to replace it?")))
            return;
        _StorageManager__WEBPACK_IMPORTED_MODULE_15__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_17__.WiringManager.wires]));
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
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component) {
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
    }
    static selectAllIn(from, to) {
        this.selected.clear();
        const reified = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active].filter((component) => (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_7__.overlappedBounds)(component.element.getBoundingClientRect(), from, to));
        this.selected.addAll(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.forEach((component) => (component.element.style.zIndex = "1000"));
    }
    static addSelection(reified) {
        this.selected.add(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.element.style.zIndex = "1000";
    }
    static listen() {
        document.body.addEventListener("mousedown", this.#mousedown);
        document.addEventListener("copy", this.#copy);
        document.addEventListener("paste", this.#paste);
    }
    static deafen() {
        document.body.removeEventListener("mousedown", this.#mousedown);
        document.removeEventListener("copy", this.#copy);
        document.removeEventListener("paste", this.#paste);
    }
    static reset() {
        this.selected.clear();
        this.deafen();
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
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");
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
        const ctx = (0,_constants__WEBPACK_IMPORTED_MODULE_1__.GET_CANVAS_CTX)();
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
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
            ctx.strokeStyle = wire.from.classList.contains("activated") ? _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR : _constants__WEBPACK_IMPORTED_MODULE_1__.LIGHT_GRAY_CSS_COLOR;
            ctx.lineWidth = 5;
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(from.x + from.width / 2, from.y + from.height / 2);
            ctx.lineTo(to.x + to.width / 2, to.y + to.height / 2);
            ctx.closePath();
            ctx.stroke();
        });
        if (NewWireContext.from) {
            const from = NewWireContext.from.getBoundingClientRect();
            ctx.strokeStyle = NewWireContext.from.classList.contains("activated")
                ? _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR
                : _constants__WEBPACK_IMPORTED_MODULE_1__.LIGHT_GRAY_CSS_COLOR;
            ctx.lineWidth = 5;
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(from.x + from.width / 2, from.y + from.height / 2);
            ctx.lineTo(_MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y);
            ctx.closePath();
            ctx.stroke();
        }
        if (_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.x !== -1 &&
            _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.y !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y !== -1) {
            ctx.strokeStyle = _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR;
            ctx.lineWidth = 2.5;
            ctx.lineJoin = "miter";
            ctx.strokeRect(_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.x, _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.y, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.x - _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.x, _MouseManager__WEBPACK_IMPORTED_MODULE_3__.MouseManager.mouse.y - _DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.downpos.y);
        }
        _SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.selected.forEach((component) => {
            const rect = component.element.getBoundingClientRect();
            ctx.strokeStyle = _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR;
            ctx.lineWidth = 1;
            ctx.lineJoin = "miter";
            ctx.strokeRect(rect.left - 10, rect.top - 10, rect.width + 10 + 10, rect.height + 10 + 10);
        });
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
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.manualSave();
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
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.manualSave();
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
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.manualSave();
                            }, () => {
                                this.#radix = previous;
                                this.update();
                                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.manualSave();
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
    const html = typeof template === "string" ? template : template.reduce((html, text, i) => html + text + values[i] ?? "", "");
    return new DOMParser().parseFromString(html, "text/html").body.childNodes[0];
}
function css(...args) {
    const [template, ...values] = args;
    const css = typeof template === "string" ? template : template.reduce((html, text, i) => html + text + values[i] ?? "", "");
    return (css
        .match(/^.*\&.*\{(?<css>.+)\}.*$/s)
        ?.groups?.css.trim()
        .split("\n")
        .map((line) => line.trim())
        .join(" ") ?? css);
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
    static NAME = "BUFFER";
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
chips.set("BUF", BufferGate);
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

/***/ "./src/styles.ts":
/*!***********************!*\
  !*** ./src/styles.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadStyles": () => (/* binding */ loadStyles)
/* harmony export */ });
const loadStyles = () => Promise.all(["style", "component", "io", "contextmenu", "toast", "modals"].map((name) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./styles/" + name + ".css";
    document.head.appendChild(link);
    return new Promise((resolve, reject) => {
        link.onload = () => resolve();
        link.onerror = () => reject();
    });
}));


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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUU1QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUM7SUFFRixNQUFNLENBQUMsS0FBSztRQUNSLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNQLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdELFFB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Oi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2F1Z21lbnRzL1dhdGNoZWRTZXQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY29udGV4dG1lbnUvZGVidWcudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L2luc2VydC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY29udGV4dG1lbnUvaW8udHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L21lbnUudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NvbnRleHRtZW51L3NlcmRlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9maWxlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL2JhY2tzcGFjZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMva2V5YmluZHMvYmVoYXZpb3IudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL2hpc3RvcnkudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzL2lvLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9rZXliaW5kcy9rZXliaW5kcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMva2V5YmluZHMvc2VsZWN0LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9rZXliaW5kcy9zZXJkZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvRGFya21vZGVNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTWVudU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL01vZGFsTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTW91c2VNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU3RvcmFnZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1dpcmluZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3ByZW1hZGUvZXhhbXBsZS50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcHJlbWFkZS9pbmRleC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcHJlbWFkZS9uYW5kLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL0NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9EaXNwbGF5LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL0lucHV0LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL091dHB1dC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9SZWlmaWVkLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL2NoaXBzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsZXMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvYXN5bmMgbW9kdWxlIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBXYXRjaGVkU2V0PFQ+IGV4dGVuZHMgU2V0PFQ+IHtcbiAgICAjYWRkcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcbiAgICAjZGVsZXRlcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcbiAgICAjYXR0ZW1wdGVkQWRkcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcbiAgICAjYXR0ZW1wdGVkRGVsZXRlcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcblxuICAgICNsb2NrZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGl0ZW1zPzogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPHR5cGVvZiBTZXQ8VD4+WzBdKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgaWYgKGl0ZW1zKSB0aGlzLmFkZEFsbChbLi4uaXRlbXNdKTtcbiAgICB9XG5cbiAgICBvbkFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYWRkcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkRlbGV0ZShydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jZGVsZXRlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkF0dGVtcHRlZEFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkQWRkcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkF0dGVtcHRlZERlbGV0ZShydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkRGVsZXRlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZBZGQocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2FkZHMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmRGVsZXRlKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNkZWxldGVzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZkF0dGVtcHRlZEFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkQWRkcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZBdHRlbXB0ZWREZWxldGUocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2F0dGVtcHRlZERlbGV0ZXMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWRkQWxsKGl0ZW1zOiBUW10pIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5hZGQoaXRlbSkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRlbGV0ZUFsbChpdGVtczogVFtdKSB7XG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoKGl0ZW0pID0+IHRoaXMuZGVsZXRlKGl0ZW0pKTtcbiAgICB9XG5cbiAgICBhZGQoaXRlbTogVCkge1xuICAgICAgICBpZiAodGhpcy4jbG9ja2VkKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2F0dGVtcHRlZEFkZHNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdHMuZXZlcnkoKG91dCkgPT4gIW91dCkpIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFsuLi50aGlzLiNhZGRzXS5tYXAoKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBpdGVtLCB0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHMuc29tZSgob3V0KSA9PiBvdXQgPT09IGZhbHNlKSA/IHRoaXMgOiBzdXBlci5hZGQoaXRlbSk7XG4gICAgfVxuXG4gICAgZGVsZXRlKGl0ZW06IFQpIHtcbiAgICAgICAgaWYgKHRoaXMuI2xvY2tlZCkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IFsuLi50aGlzLiNhdHRlbXB0ZWREZWxldGVzXS5tYXAoKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBpdGVtLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHRzLmV2ZXJ5KChvdXQpID0+ICFvdXQpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2RlbGV0ZXNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0cy5zb21lKChvdXQpID0+IG91dCA9PT0gZmFsc2UpID8gZmFsc2UgOiBzdXBlci5kZWxldGUoaXRlbSk7XG4gICAgfVxuXG4gICAgbG9jaygpIHtcbiAgICAgICAgdGhpcy4jbG9ja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1bmxvY2soKSB7XG4gICAgICAgIHRoaXMuI2xvY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGdldCBsb2NrZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNsb2NrZWQ7XG4gICAgfVxuXG4gICAgY2xvbmUod2l0aExpc3RlbmVycz86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgc2V0ID0gbmV3IFdhdGNoZWRTZXQodGhpcyk7XG5cbiAgICAgICAgaWYgKHdpdGhMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuI2FkZHMuZm9yRWFjaCgocnVuKSA9PiBzZXQub25BZGQocnVuKSk7XG4gICAgICAgICAgICB0aGlzLiNkZWxldGVzLmZvckVhY2goKHJ1bikgPT4gc2V0Lm9uRGVsZXRlKHJ1bikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNldDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBOYXZpZ2F0b3Ige1xuICAgICAgICB1c2VyQWdlbnREYXRhPzogeyBwbGF0Zm9ybTogc3RyaW5nIH07XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFID0gMjQ7XG5leHBvcnQgY29uc3QgT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSA9IDI0O1xuZXhwb3J0IGNvbnN0IENISVBfQ09NUE9ORU5UX0NTU19XSURUSCA9IDEyMDtcbmV4cG9ydCBjb25zdCBDSElQX0NPTVBPTkVOVF9DU1NfSEVJR0hUID0gNDA7XG5leHBvcnQgY29uc3QgQ0hJUF9JTlBVVF9DU1NfU0laRSA9IDE2O1xuZXhwb3J0IGNvbnN0IENISVBfT1VUUFVUX0NTU19TSVpFID0gMTY7XG5leHBvcnQgY29uc3QgT1JJR0lOX1BPSU5UID0gT2JqZWN0LmZyZWV6ZSh7IHg6IDAsIHk6IDAgfSk7XG5leHBvcnQgY29uc3QgSU5fREVCVUdfTU9ERSA9ICEhbmV3IFVSTChsb2NhdGlvbi5ocmVmKS5zZWFyY2hQYXJhbXMuaGFzKFwiZGVidWdcIik7XG5leHBvcnQgY29uc3QgSVNfTUFDX09TID0gW25hdmlnYXRvci51c2VyQWdlbnREYXRhPy5wbGF0Zm9ybSwgbmF2aWdhdG9yLnBsYXRmb3JtXS5zb21lKFxuICAgIChwbGF0Zm9ybSkgPT4gcGxhdGZvcm0/LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoXCJtYWNcIikgPz8gZmFsc2UsXG4pO1xuXG5leHBvcnQgY29uc3QgTE9DS0VEX0ZPUl9URVNUSU5HID0gKCkgPT5cbiAgICBNb2RhbE1hbmFnZXIuYWxlcnQoXCJUaGUgZGlhZ3JhbSBpcyBjdXJyZW50bHkgbG9ja2VkIGZvciB0ZXN0aW5nLiBObyBjaGFuZ2VzIGNhbiBiZSBtYWRlLlwiKTtcblxuZXhwb3J0IGNvbnN0IERFTEFZID0gKGRlbGF5OiBudW1iZXIpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG5cbmV4cG9ydCBjb25zdCBHRVRfQ0FOVkFTX0NUWCA9ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJjYW52YXNcIikhLmdldENvbnRleHQoXCIyZFwiKSE7XG5cbmV4cG9ydCBjb25zdCBDT1VOVEVSX0dFTkVSQVRPUiA9IGZ1bmN0aW9uKiAoaSA9IDApIHtcbiAgICB3aGlsZSAodHJ1ZSkgeWllbGQgaSsrO1xufTtcblxuZXhwb3J0IGNvbnN0IFNDVUZGRURfVVVJRCA9ICgpID0+XG4gICAgRGF0ZS5ub3coKS50b1N0cmluZygzNikgKyBOdW1iZXIoRGF0ZS5ub3coKS50b1N0cmluZygpLnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpKS50b1N0cmluZygzNik7XG5cbmV4cG9ydCBjb25zdCBST1VORF9UT19ORUFSRVNUID0gKHg6IG51bWJlciwgbjogbnVtYmVyKSA9PiBNYXRoLnJvdW5kKHggLyBuKSAqIG47XG5cbmV4cG9ydCBjb25zdCBBQ1RJVkFURURfQ1NTX0NPTE9SID0gXCIjZmYyNjI2XCI7XG5leHBvcnQgY29uc3QgTElHSFRfR1JBWV9DU1NfQ09MT1IgPSBcIiNkZWRlZGVcIjtcbmV4cG9ydCBjb25zdCBUT0FTVF9EVVJBVElPTiA9IDI1MDA7XG5leHBvcnQgY29uc3QgR1JJRF9TSVpFID0gMTA7XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBJTl9ERUJVR19NT0RFLCBMSUdIVF9HUkFZX0NTU19DT0xPUiwgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBNZW51TWFuYWdlckFjdGlvbnMgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTWVudU1hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1N0b3JhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcblxuZXhwb3J0IGNvbnN0IGRlYnVnID0gKFxuICAgIElOX0RFQlVHX01PREVcbiAgICAgICAgPyBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGVzdC1hbGVydFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCBhbGVydFwiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGF3YWl0IE1vZGFsTWFuYWdlci5hbGVydChcIlRoaXMgaXMgYW4gYWxlcnQuXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwidGVzdC1jb25maXJtXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IGNvbmZpcm1cIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhd2FpdCBNb2RhbE1hbmFnZXIuY29uZmlybShcIlRoaXMgaXMgYSBjb25maXJtYXRpb24uXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwidGVzdC1wcm9tcHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3QgcHJvbXB0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIlRoaXMgaXMgYSBwcm9tcHQuXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwidGVzdC10b2FzdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCB0b2FzdFwiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoaXMgaXMgYSB0b2FzdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogTElHSFRfR1JBWV9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwid2lwZS1zdG9yYWdlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJXaXBlIHN0b3JhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5zdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcIndpcGUtc2F2ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiV2lwZSBuYW1lZCBzYXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2F2ZSA9IGF3YWl0IE1vZGFsTWFuYWdlci5wcm9tcHQoXCJcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNhdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghU3RvcmFnZU1hbmFnZXIuaGFzKFwic2F2ZXM6XCIgKyBzYXZlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJObyBzYXZlcyBleGlzdCB3aXRoIHRoYXQgbmFtZS5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuZGVsZXRlKFwic2F2ZXM6XCIgKyBzYXZlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJzdG9wLXJlbmRlclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU3RvcCByZW5kZXJpbmcgd2lyZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwic3RhcnQtcmVuZGVyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTdGFydCByZW5kZXJpbmcgd2lyZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdXG4pIHNhdGlzZmllcyBNZW51TWFuYWdlckFjdGlvbnM7XG4iLCJpbXBvcnQgeyBMT0NLRURfRk9SX1RFU1RJTkcsIE9SSUdJTl9QT0lOVCB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IE1lbnVNYW5hZ2VyQWN0aW9uIH0gZnJvbSBcIi4uL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgY2hpcHMgfSBmcm9tIFwiLi4vcmVpZmllZC9jaGlwc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSBcIi4uL3JlaWZpZWQvRGlzcGxheVwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNvbnN0IGluc2VydCA9IHtcbiAgICBcImluc2VydC1jb21wb25lbnRcIjoge1xuICAgICAgICBsYWJlbDogXCJJbnNlcnQgY29tcG9uZW50XCIsXG4gICAgICAgIGtleWJpbmQ6IFwiQVwiLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiRW50ZXIgdGhlIGNvbXBvbmVudCdzIG5hbWU6XCIpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgY2hpcCA9IGNoaXBzLmdldChuYW1lLnRvVXBwZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjaGlwXG4gICAgICAgICAgICAgICAgPyBuZXcgQ29tcG9uZW50KFJlZmxlY3QuY29uc3RydWN0KGNoaXAsIFtdKSwgT1JJR0lOX1BPSU5UKVxuICAgICAgICAgICAgICAgIDogbmFtZS50b1VwcGVyQ2FzZSgpID09PSBcIkRJU1BMQVlcIlxuICAgICAgICAgICAgICAgID8gbmV3IERpc3BsYXkoKVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudCkgcmV0dXJuIE1vZGFsTWFuYWdlci5hbGVydChcIk5vIGNvbXBvbmVudCB3YXMgZm91bmQgd2l0aCB0aGF0IG5hbWUuXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKGNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBnZXRDb21wdXRlZFN0eWxlKGNvbXBvbmVudC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIHBhcnNlRmxvYXQod2lkdGgpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBlLmNsaWVudFkgLSBwYXJzZUZsb2F0KGhlaWdodCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgfSxcbn0gc2F0aXNmaWVzIE1lbnVNYW5hZ2VyQWN0aW9uO1xuIiwiaW1wb3J0IHsgSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFLCBMT0NLRURfRk9SX1RFU1RJTkcsIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBNZW51TWFuYWdlckFjdGlvbiB9IGZyb20gXCIuLi9tYW5hZ2Vycy9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNvbnN0IGlvID0ge1xuICAgIFwibmV3LWlucHV0XCI6IHtcbiAgICAgICAgbGFiZWw6IFwiTmV3IGlucHV0XCIsXG4gICAgICAgIGtleWJpbmQ6IFwiSVwiLFxuICAgICAgICBjYWxsYmFjazogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gbmV3IElucHV0KHtcbiAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGlucHV0KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKGlucHV0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBcIm5ldy1vdXRwdXRcIjoge1xuICAgICAgICBsYWJlbDogXCJOZXcgb3V0cHV0XCIsXG4gICAgICAgIGtleWJpbmQ6IFwiT1wiLFxuICAgICAgICBjYWxsYmFjazogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG91dHB1dCA9IG5ldyBPdXRwdXQoe1xuICAgICAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMob3V0cHV0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChvdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgIH0sXG59IHNhdGlzZmllcyBNZW51TWFuYWdlckFjdGlvbjtcbiIsImltcG9ydCB7IE1lbnVNYW5hZ2VyQWN0aW9ucyB9IGZyb20gXCIuLi9tYW5hZ2Vycy9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgZGVidWcgfSBmcm9tIFwiLi9kZWJ1Z1wiO1xuaW1wb3J0IHsgaW5zZXJ0IH0gZnJvbSBcIi4vaW5zZXJ0XCI7XG5pbXBvcnQgeyBpbyB9IGZyb20gXCIuL2lvXCI7XG5pbXBvcnQgeyBzZXJkZSB9IGZyb20gXCIuL3NlcmRlXCI7XG5cbmV4cG9ydCBjb25zdCBtZW51OiBNZW51TWFuYWdlckFjdGlvbnMgPSBbaW5zZXJ0LCBpbywgc2VyZGUsIC4uLmRlYnVnXTtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElTX01BQ19PUywgTElHSFRfR1JBWV9DU1NfQ09MT1IsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZnJvbUZpbGUsIHNhdmVEaWFncmFtIH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBrZXliaW5kcyB9IGZyb20gXCIuLi9rZXliaW5kcy9rZXliaW5kc1wiO1xuaW1wb3J0IHsgTWVudU1hbmFnZXJBY3Rpb24gfSBmcm9tIFwiLi4vbWFuYWdlcnMvTWVudU1hbmFnZXJcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL21lbnVcIjtcblxuZXhwb3J0IGNvbnN0IHNlcmRlID0ge1xuICAgIFwiY29weS11cmxcIjoge1xuICAgICAgICBsYWJlbDogXCJDb3B5IGxpbmtcIixcbiAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggS1wiIDogXCJDdHJsIEtcIixcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhyZWZBc1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cbiAgICAgICAgICAgIGhyZWZBc1VybC5zZWFyY2hQYXJhbXMuc2V0KFwiaW5saW5lXCIsIGJ0b2Eoc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSkpO1xuXG4gICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChocmVmQXNVcmwuaHJlZik7XG5cbiAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQ29waWVkIGRpYWdyYW0gbGluayB0byBjbGlwYm9hcmQuXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IExJR0hUX0dSQVlfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH0sXG4gICAgXCJzYXZlLXRvXCI6IHtcbiAgICAgICAgbGFiZWw6IFwiU2F2ZSB3aXRoIG5hbWVcIixcbiAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLijJggU1wiIDogXCJDdHJsIFNcIixcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNhdmUgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiV2hhdCBzaG91bGQgYmUgdGhlIG5hbWUgb2YgdGhpcyBzYXZlP1wiKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzYXZlICE9PSBcInN0cmluZ1wiKSByZXR1cm47XG5cbiAgICAgICAgICAgIGF3YWl0IFNhbmRib3hNYW5hZ2VyLnNhdmVUbyhzYXZlKTtcblxuICAgICAgICAgICAgY29uc3QgaHJlZkFzVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblxuICAgICAgICAgICAgaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJzYXZlXCIsIHNhdmUpO1xuXG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh1bmRlZmluZWQsIFwiXCIsIGhyZWZBc1VybCk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBcImxvYWQtZnJvbVwiOiB7XG4gICAgICAgIGxhYmVsOiBcIkxvYWQgZnJvbSBzYXZlc1wiLFxuICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBPXCIgOiBcIkN0cmwgT1wiLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2F2ZSA9IGF3YWl0IE1vZGFsTWFuYWdlci5wcm9tcHQoXCJXaGljaCBzYXZlIHdvdWxkIHlvdSBsaWtlIHRvIGxvYWQ/XCIpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNhdmUgIT09IFwic3RyaW5nXCIpIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKCFTdG9yYWdlTWFuYWdlci5oYXMoXCJzYXZlczpcIiArIHNhdmUpKSByZXR1cm4gTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiTm8gc2F2ZSB3YXMgZm91bmQgd2l0aCB0aGF0IG5hbWUuXCIpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5yZXNldCgpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBzYXZlIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBocmVmQXNVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLnNldChcInNhdmVcIiwgc2F2ZSk7XG5cbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHVuZGVmaW5lZCwgXCJcIiwgaHJlZkFzVXJsKTtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIFwic2F2ZS1hc1wiOiB7XG4gICAgICAgIGxhYmVsOiBcIlNhdmUgYXMgZmlsZVwiLFxuICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggU1wiIDogXCJDdHJsIFNoaWZ0IFNcIixcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIiksIHtcbiAgICAgICAgICAgICAgICBocmVmOiBVUkwuY3JlYXRlT2JqZWN0VVJMKFxuICAgICAgICAgICAgICAgICAgICBuZXcgQmxvYihbc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKV0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIGRvd25sb2FkOiBgZ2F0ZXNpbS0ke0RhdGUubm93KCl9Lmpzb25gLFxuICAgICAgICAgICAgfSkuY2xpY2soKTtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIFwiaW1wb3J0LWZyb21cIjoge1xuICAgICAgICBsYWJlbDogXCJJbXBvcnQgZnJvbSBmaWxlXCIsXG4gICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBPXCIgOiBcIkN0cmwgU2hpZnQgT1wiLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSwgeyB0eXBlOiBcImZpbGVcIiB9KTtcblxuICAgICAgICAgICAgaW5wdXQuY2xpY2soKTtcblxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IG5ldyBQcm9taXNlPEZpbGUgfCB1bmRlZmluZWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgaW5wdXQub25jaGFuZ2UgPSAoKSA9PiByZXNvbHZlKGlucHV0LmZpbGVzPy5bMF0gPz8gdW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgICAgIGlucHV0Lm9uZXJyb3IgPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCFmaWxlKVxuICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vIGZpbGUgd2FzIHByb3ZpZGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblxuICAgICAgICAgICAgY29uc3QgcmF3ID0gYXdhaXQgbmV3IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKHJlYWRlci5yZXN1bHQ/LnRvU3RyaW5nKCkgPz8gdW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghcmF3KVxuICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byByZWFkIHRoZSBmaWxlLlwiLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgcmVzdWx0OiBbc2V0dGluZ3MsIGNvbXBvbmVudHMsIHdpcmVzXSxcbiAgICAgICAgICAgIH0gPSBmcm9tRmlsZShyYXcpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3IpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5yZXNldCgpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICAgICAga2V5YmluZHMsXG4gICAgICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgICAgICBzYXZlOiBcInNhbmRib3hcIixcbiAgICAgICAgICAgICAgICBpbml0aWFsOiBbY29tcG9uZW50cyEsIHdpcmVzIV0sXG4gICAgICAgICAgICAgICAgb3ZlcnJpZGVTYXZlSWZFeGlzdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHt9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmFwcGx5UmF3U2V0dGluZ3Moc2V0dGluZ3MhKTtcblxuICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFwic2F2ZXM6XCIgKyBcInNhbmRib3hcIiwgc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSk7XG4gICAgICAgIH0sXG4gICAgfSxcbn0gc2F0aXNmaWVzIE1lbnVNYW5hZ2VyQWN0aW9uO1xuIiwiaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgQ09VTlRFUl9HRU5FUkFUT1IsIElOX0RFQlVHX01PREUsIFRPQVNUX0RVUkFUSU9OIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nIH0gZnJvbSBcIi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgY2hpcHMgfSBmcm9tIFwiLi9yZWlmaWVkL2NoaXBzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGlzcGxheSB9IGZyb20gXCIuL3JlaWZpZWQvRGlzcGxheVwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkRGlhZ3JhbSA9IHtcbiAgICBzZXR0aW5nczoge1xuICAgICAgICBbXCJEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZFwiXTogYm9vbGVhbjtcbiAgICB9O1xuICAgIGNvbXBvbmVudHM6IChcbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgcGVybWFuZW50OiBib29sZWFuO1xuICAgICAgICAgICAgICB0eXBlOiBcIklOUFVUXCI7XG4gICAgICAgICAgICAgIGFjdGl2YXRlZDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgaWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiT1VUUFVUXCI7XG4gICAgICAgICAgICAgIGFjdGl2YXRlZDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgaWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCI7XG4gICAgICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICAgICAgaW5wdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIG91dHB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiRElTUExBWVwiO1xuICAgICAgICAgICAgICBpbnB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgb3V0cHV0czogeyBpZDogbnVtYmVyOyBhY3RpdmF0ZWQ6IGJvb2xlYW4gfVtdO1xuICAgICAgICAgICAgICByYWRpeDogbnVtYmVyO1xuICAgICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAgIHk6IG51bWJlcjtcbiAgICAgICAgICB9XG4gICAgKVtdO1xuICAgIHdpcmVzOiB7IGZyb206IG51bWJlcjsgdG86IG51bWJlciB9W107XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURpYWdyYW0oY29tcG9uZW50czogUmVpZmllZFtdLCB3aXJlczogV2lyaW5nW10pIHtcbiAgICBjb25zdCBpZCA9IENPVU5URVJfR0VORVJBVE9SKCk7XG5cbiAgICBjb25zdCBpZHMgPSBuZXcgTWFwPEVsZW1lbnQsIG51bWJlcj4oKTtcblxuICAgIGNvbnN0IGRhdGE6IFNlcmlhbGl6ZWREaWFncmFtID0ge1xuICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgW1wiRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWRcIl06IERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkLFxuICAgICAgICB9LFxuICAgICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzLm1hcCgoY29tcG9uZW50LCByZWlmaWVkKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZHMuc2V0KGNvbXBvbmVudC5lbGVtZW50LCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQsXG4gICAgICAgICAgICAgICAgICAgIHBlcm1hbmVudDogY29tcG9uZW50LnBlcm1hbmVuY2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiSU5QVVRcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVkOiBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZHMuZ2V0KGNvbXBvbmVudC5lbGVtZW50KSEsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgaWRzLnNldChjb21wb25lbnQuZWxlbWVudCwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIk9VVFBVVFwiLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkcy5nZXQoY29tcG9uZW50LmVsZW1lbnQpISxcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb21wb25lbnQuY2hpcC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IGNvbXBvbmVudC5pbnB1dHMubWFwKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KGksIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChpKSEsIGFjdGl2YXRlZDogaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IGNvbXBvbmVudC5vdXRwdXRzLm1hcCgobykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChvLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQobykhLCBhY3RpdmF0ZWQ6IG8uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkRJU1BMQVlcIixcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBjb21wb25lbnQuaW5wdXRzLm1hcCgoaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChpLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQoaSkhLCBhY3RpdmF0ZWQ6IGkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBjb21wb25lbnQub3V0cHV0cy5tYXAoKG8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5zZXQobywgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGlkOiBpZHMuZ2V0KG8pISwgYWN0aXZhdGVkOiBvLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSB9O1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXg6IGNvbXBvbmVudC5yYWRpeCxcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gc2VyaWFsaXplIGRpYWdyYW0uXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gUmVpZmllZCBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgIH0pLFxuICAgICAgICB3aXJlczogd2lyZXNcbiAgICAgICAgICAgIC5maWx0ZXIoKHdpcmUpID0+ICF3aXJlLmRlc3Ryb3llZClcbiAgICAgICAgICAgIC5tYXAoKHdpcmUpID0+ICh7XG4gICAgICAgICAgICAgICAgZnJvbTogaWRzLmdldCh3aXJlLmZyb20pISxcbiAgICAgICAgICAgICAgICB0bzogaWRzLmdldCh3aXJlLnRvKSEsXG4gICAgICAgICAgICB9KSksXG4gICAgfTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhLCB1bmRlZmluZWQsIElOX0RFQlVHX01PREUgPyA0IDogdW5kZWZpbmVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21GaWxlKFxuICAgIGZpbGU6IHN0cmluZyxcbik6XG4gICAgfCB7IGVycm9yOiBzdHJpbmc7IHJlc3VsdDogW10gfVxuICAgIHwgeyBlcnJvcjogdW5kZWZpbmVkOyByZXN1bHQ6IFtzZXR0aW5nczogU2VyaWFsaXplZERpYWdyYW1bXCJzZXR0aW5nc1wiXSwgY29tcG9uZW50czogUmVpZmllZFtdLCB3aXJlczogV2lyaW5nW11dIH0ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGZpbGUpO1xuXG4gICAgICAgIHZhbGlkYXRlKGRhdGEpO1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gbmV3IE1hcDxudW1iZXIsIEVsZW1lbnQ+KCk7XG5cbiAgICAgICAgY29uc3QgcmVpZmllZCA9IGRhdGEuY29tcG9uZW50cy5tYXAoKHJhdykgPT4ge1xuICAgICAgICAgICAgaWYgKHJhdy50eXBlID09PSBcIklOUFVUXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IG5ldyBJbnB1dChyYXcpO1xuXG4gICAgICAgICAgICAgICAgaW5wdXQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pZCwgaW5wdXQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmF3LnBlcm1hbmVudCA/IGlucHV0LnBlcm1hbmVudCgpIDogaW5wdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyYXcudHlwZSA9PT0gXCJPVVRQVVRcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dCA9IG5ldyBPdXRwdXQocmF3KTtcblxuICAgICAgICAgICAgICAgIG91dHB1dC5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3LmlkLCBvdXRwdXQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmF3LnBlcm1hbmVudCA/IG91dHB1dC5wZXJtYW5lbnQoKSA6IG91dHB1dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJhdy50eXBlID09PSBcIkRJU1BMQVlcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3BsYXkgPSBuZXcgRGlzcGxheShyYXcsIHJhdy5pbnB1dHMubGVuZ3RoLCByYXcucmFkaXgpO1xuXG4gICAgICAgICAgICAgICAgZGlzcGxheS5pbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmlucHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3LmlucHV0c1tpbmRleF0uaWQsIGlucHV0KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGRpc3BsYXkub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5vdXRwdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcub3V0cHV0c1tpbmRleF0uaWQsIG91dHB1dCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmF3LnBlcm1hbmVudCA/IGRpc3BsYXkucGVybWFuZW50KCkgOiBkaXNwbGF5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KG5ldyAoY2hpcHMuZ2V0KHJhdy5uYW1lKSEpKCksIHJhdyk7XG5cbiAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuaW5wdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pbnB1dHNbaW5kZXhdLmlkLCBpbnB1dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29tcG9uZW50Lm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5vdXRwdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5vdXRwdXRzW2luZGV4XS5pZCwgb3V0cHV0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmF3LnBlcm1hbmVudCA/IGNvbXBvbmVudC5wZXJtYW5lbnQoKSA6IGNvbXBvbmVudDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgd2lyZXMgPSBkYXRhLndpcmVzLm1hcCgoeyBmcm9tLCB0byB9KSA9PiBuZXcgV2lyaW5nKGVsZW1lbnRzLmdldChmcm9tKSEsIGVsZW1lbnRzLmdldCh0bykhKSk7XG5cbiAgICAgICAgcmV0dXJuIHsgcmVzdWx0OiBbZGF0YS5zZXR0aW5ncywgcmVpZmllZCwgd2lyZXNdLCBlcnJvcjogdW5kZWZpbmVkIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4geyBlcnJvcjogZS5tZXNzYWdlLCByZXN1bHQ6IFtdIH07XG5cbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IFwiRmFpbGVkIHRvIHByb2Nlc3MgZmlsZS5cIiwgcmVzdWx0OiBbXSB9O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGUoZGF0YTogdW5rbm93bik6IGFzc2VydHMgZGF0YSBpcyBTZXJpYWxpemVkRGlhZ3JhbSB7XG4gICAgaWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG5vdCBhbiBvYmplY3QuXCIpO1xuXG4gICAgaWYgKCEoXCJzZXR0aW5nc1wiIGluIGRhdGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG1pc3NpbmcgcHJvamVjdCBzZXR0aW5ncy5cIik7XG5cbiAgICBpZiAodHlwZW9mIGRhdGEuc2V0dGluZ3MgIT09IFwib2JqZWN0XCIgfHwgIWRhdGEuc2V0dGluZ3MpIHRocm93IG5ldyBFcnJvcihcIlByb2plY3Qgc2V0dGluZ3Mgc2hvdWxkIGJlIGFuIG9iamVjdC5cIik7XG5cbiAgICBpZiAoIShcImNvbXBvbmVudHNcIiBpbiBkYXRhKSkgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBtaXNzaW5nIGNvbXBvbmVudHMuXCIpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY29tcG9uZW50cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBub3QgYW4gYXJyYXkuXCIpO1xuXG4gICAgaWYgKCEoXCJ3aXJlc1wiIGluIGRhdGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG1pc3Npbmcgd2lyZXMuXCIpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEud2lyZXMpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlcyBkYXRhIGlzIG5vdCBhbiBhcnJheS5cIik7XG5cbiAgICBpZiAoIShcIkRyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkXCIgaW4gZGF0YS5zZXR0aW5ncykpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3Npbmcgc2V0dGluZyAnRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQnLlwiKTtcblxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGRhdGEuY29tcG9uZW50cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQgfHwgdHlwZW9mIGNvbXBvbmVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgbXVzdCBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwicmVpZmllZFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIHJlaWZpZWQgaWQuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnJlaWZpZWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJlaWZpZWQgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJwZXJtYW5lbnRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBwZXJtYW5lbmNlIHN0YXR1cy5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQucGVybWFuZW50ICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHBlcm1hbmVuY2UgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuXG4gICAgICAgIGlmICghKFwidHlwZVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIGEgdHlwZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQudHlwZSAhPT0gXCJzdHJpbmdcIiB8fCAhW1wiSU5QVVRcIiwgXCJPVVRQVVRcIiwgXCJDT01QT05FTlRcIiwgXCJESVNQTEFZXCJdLmluY2x1ZGVzKGNvbXBvbmVudC50eXBlKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29tcG9uZW50IHR5cGUuXCIpO1xuXG4gICAgICAgIGlmICghKFwieFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIGEgeCBjb29yZGluYXRlLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC54ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgeCBjb29yZGluYXRlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgIGlmICghKFwieVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIGEgeSBjb29yZGluYXRlLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC55ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgeSBjb29yZGluYXRlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgIHN3aXRjaCAoY29tcG9uZW50LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJJTlBVVFwiOlxuICAgICAgICAgICAgY2FzZSBcIk9VVFBVVFwiOiB7XG4gICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkkvTyBkYXRhIGlzIG1pc3NpbmcgaWRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmlkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcImFjdGl2YXRlZFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkkvTyBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuYWN0aXZhdGVkICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQWN0aXZhdGlvbiBzdGF0dXMgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFwiQ09NUE9ORU5UXCI6IHtcbiAgICAgICAgICAgICAgICBpZiAoIShcImlucHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3NpbmcgaW5wdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnQuaW5wdXRzKSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGlucHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJvdXRwdXRzXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBvdXRwdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnQub3V0cHV0cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBvdXRwdXRzIGRhdGEgbXVzdCBiZSBhbiBhcnJheS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcIm5hbWVcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgZGF0YSBpcyBtaXNzaW5nIGNoaXAgbmFtZS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5uYW1lICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlwIG5hbWUgbXVzdCBiZSBhIHN0cmluZy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNoaXBzLmhhcyhjb21wb25lbnQubmFtZS50cmltKCkudG9VcHBlckNhc2UoKSkpIHRocm93IG5ldyBFcnJvcihcIkNoaXAgbmFtZSBkb2Vzbid0IGV4aXN0LlwiKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IENoaXAgPSBjaGlwcy5nZXQoY29tcG9uZW50Lm5hbWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpITtcblxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuaW5wdXRzLmxlbmd0aCAhPT0gQ2hpcC5JTlBVVFMpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBpbnB1dHMgZG9lcyBub3QgbWF0Y2ggY2hpcCBpbnB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5vdXRwdXRzLmxlbmd0aCAhPT0gQ2hpcC5PVVRQVVRTKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgb3V0cHV0cyBkb2VzIG5vdCBtYXRjaCBjaGlwIG91dHB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbnB1dCBvZiBjb21wb25lbnQuaW5wdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvdXRwdXQgb2YgY29tcG9uZW50Lm91dHB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJESVNQTEFZXCI6IHtcbiAgICAgICAgICAgICAgICBpZiAoIShcInJhZGl4XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSBkYXRhIGlzIG1pc3NpbmcgZGlzcGxheSByYWRpeC5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5yYWRpeCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSByYWRpeCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwiaW5wdXRzXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSBkYXRhIGlzIG1pc3NpbmcgaW5wdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnQuaW5wdXRzKSkgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSBpbnB1dHMgZGF0YSBtdXN0IGJlIGFuIGFycmF5LlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwib3V0cHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkRpc3BsYXkgZGF0YSBpcyBtaXNzaW5nIG91dHB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbXBvbmVudC5vdXRwdXRzKSkgdGhyb3cgbmV3IEVycm9yKFwiRGlzcGxheSBvdXRwdXRzIGRhdGEgbXVzdCBiZSBhbiBhcnJheS5cIik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGNvbXBvbmVudC5pbnB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpZCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImFjdGl2YXRlZFwiIGluIGlucHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG91dHB1dCBvZiBjb21wb25lbnQub3V0cHV0cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdXRwdXQgfHwgdHlwZW9mIG91dHB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gb3V0cHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGlkLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG91dHB1dC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpZCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImFjdGl2YXRlZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuYWN0aXZhdGVkICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQWN0aXZhdGlvbiBzdGF0dXMgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlkcyA9IGRhdGEuY29tcG9uZW50cy5mbGF0TWFwPG51bWJlcj4oKGNvbXBvbmVudCkgPT5cbiAgICAgICAgY29tcG9uZW50LnR5cGUgPT09IFwiQ09NUE9ORU5UXCIgfHwgY29tcG9uZW50LnR5cGUgPT09IFwiRElTUExBWVwiXG4gICAgICAgICAgICA/IFtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbXBvbmVudC5pbnB1dHMubWFwKCh7IGlkIH06IHsgaWQ6IG51bWJlciB9KSA9PiBpZCksXG4gICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQub3V0cHV0cy5tYXAoKHsgaWQgfTogeyBpZDogbnVtYmVyIH0pID0+IGlkKSxcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgOiBjb21wb25lbnQuaWQsXG4gICAgKTtcblxuICAgIGZvciAoY29uc3Qgd2lyZSBvZiBkYXRhLndpcmVzIGFzIHVua25vd25bXSkge1xuICAgICAgICBpZiAoIXdpcmUgfHwgdHlwZW9mIHdpcmUgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJmcm9tXCIgaW4gd2lyZSkpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBpcyBtaXNzaW5nIHRoZSBjb21wb25lbnQgaXQgc3RhcnRzIGZyb20uXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2lyZS5mcm9tICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgbXVzdCByZWZlcmVuY2UgbnVtZXJpYyBpZHMuXCIpO1xuXG4gICAgICAgIGlmICghKFwidG9cIiBpbiB3aXJlKSkgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIGlzIG1pc3NpbmcgdGhlIHRhcmdldCBjb21wb25lbnQuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2lyZS50byAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIG11c3QgcmVmZXJlbmNlIG51bWVyaWMgaWRzLlwiKTtcblxuICAgICAgICBpZiAoIWlkcy5pbmNsdWRlcyh3aXJlLmZyb20pIHx8ICFpZHMuaW5jbHVkZXMod2lyZS50bykpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSByZWZlcmVuY2VzIGludmFsaWQgaWRzLlwiKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBjb25zdGFudHMgZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL2NvbnRleHRtZW51L21lbnVcIjtcbmltcG9ydCB7IGZyb21GaWxlIH0gZnJvbSBcIi4vZmlsZXNcIjtcbmltcG9ydCB7IGtleWJpbmRzIH0gZnJvbSBcIi4va2V5YmluZHMva2V5YmluZHNcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgcHJlbWFkZSB9IGZyb20gXCIuL3ByZW1hZGVcIjtcbmltcG9ydCB7IGxvYWRTdHlsZXMgfSBmcm9tIFwiLi9zdHlsZXNcIjtcblxuT2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCBjb25zdGFudHMpO1xuXG5hd2FpdCBsb2FkU3R5bGVzKCk7XG5cbmNvbnN0IGhyZWZBc1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cbmNvbnN0IHNob3VsZExvYWRJbmxpbmUgPSBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLmdldChcImlubGluZVwiKTtcblxuaWYgKHNob3VsZExvYWRJbmxpbmUpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBpbmxpbmVkID0gYXRvYihzaG91bGRMb2FkSW5saW5lKTtcblxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIHJlc3VsdDogW3NldHRpbmdzLCBjb21wb25lbnRzLCB3aXJpbmdzXSxcbiAgICAgICAgfSA9IGZyb21GaWxlKGlubGluZWQpO1xuXG4gICAgICAgIGlmIChlcnJvcikgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBpbml0aWFsOiBbY29tcG9uZW50cyEsIHdpcmluZ3MhXSB9KTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5hcHBseVJhd1NldHRpbmdzKHNldHRpbmdzISk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHsga2V5YmluZHMsIG1lbnUsIHNhdmU6IFwic2FuZGJveFwiIH0pO1xuXG4gICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICBtZXNzYWdlOiBcIkRpYWdyYW0gaXMgbm90IGNvcnJlY3RseSBlbmNvZGVkLlwiLFxuICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGhyZWZBc1VybC5zZWFyY2hQYXJhbXMuZGVsZXRlKFwiaW5saW5lXCIpO1xuXG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHVuZGVmaW5lZCwgXCJcIiwgaHJlZkFzVXJsKTtcbiAgICB9XG59IGVsc2Uge1xuICAgIGNvbnN0IHNhdmUgPSBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLmdldChcInNhdmVcIik7XG5cbiAgICBpZiAoc2F2ZSkge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBzYXZlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHNob3VsZExvYWRQcmVtYWRlID0gaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJwcmVtYWRlXCIpO1xuXG4gICAgICAgIGlmIChzaG91bGRMb2FkUHJlbWFkZSAmJiBwcmVtYWRlLmhhcyhzaG91bGRMb2FkUHJlbWFkZS50cmltKCkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgIHByZW1hZGUuZ2V0KHNob3VsZExvYWRQcmVtYWRlLnRyaW0oKS50b0xvd2VyQ2FzZSgpKSEoeyBuYW1lOiBzaG91bGRMb2FkUHJlbWFkZS50cmltKCkudG9Mb3dlckNhc2UoKSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHsga2V5YmluZHMsIG1lbnUsIHNhdmU6IFwic2FuZGJveFwiIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2hvdWxkTG9hZFByZW1hZGUpIHtcbiAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vIHByZW1hZGVzIHdlcmUgZm91bmQgd2l0aCB0aGF0IG5hbWUuXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLmRlbGV0ZShcInByZW1hZGVcIik7XG5cbiAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh1bmRlZmluZWQsIFwiXCIsIGhyZWZBc1VybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MsIExPQ0tFRF9GT1JfVEVTVElORyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25NYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NlbGVjdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSBcIi4uL3JlaWZpZWQvRGlzcGxheVwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvT3V0cHV0XCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgY29uc3QgYmFja3NwYWNlID0ge1xuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJDb250cm9sK1hcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgYmFja3NwYWNlW1wiQmFja3NwYWNlXCJdKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIk1ldGErWFwiLCAoKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgYmFja3NwYWNlW1wiQmFja3NwYWNlXCJdKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrU2hpZnQrWFwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBiYWNrc3BhY2VbXCJTaGlmdCtCYWNrc3BhY2VcIl0oKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStTaGlmdCtYXCIsICgpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBiYWNrc3BhY2VbXCJTaGlmdCtCYWNrc3BhY2VcIl0oKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiU2hpZnQrQmFja3NwYWNlXCIsICgpID0+IHtcbiAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICBpZiAoIVNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcbiAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IGNvbXBvbmVudC5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IGNvbXBvbmVudC5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50IHx8IGNvbXBvbmVudCBpbnN0YW5jZW9mIERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSkpO1xuXG4gICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGVkLmNsb25lKHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9KSxcbiAgICBbXCJCYWNrc3BhY2VcIl06ICgpID0+IHtcbiAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICBpZiAoIVNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcbiAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBjb21wb25lbnQuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSBjb21wb25lbnQuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hdHRhY2goKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSk7XG5cbiAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH0sXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4iLCJpbXBvcnQgeyBHUklEX1NJWkUsIExJR0hUX0dSQVlfQ1NTX0NPTE9SLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgY29uc3QgYmVoYXZpb3IgPSB7XG4gICAgW1wiS2V5R1wiXTogYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gWy4uLlJlaWZpZWQuYWN0aXZlXTtcbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gY29tcG9uZW50cy5tYXAoKHsgcG9zIH0pID0+IHBvcyk7XG5cbiAgICAgICAgY29uc3Qgc2l6ZSA9IEdSSURfU0laRTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQgPSAhRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQ7XG5cbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBNYXRoLmZsb29yKGNvbXBvbmVudC5wb3MueCAvIHNpemUpICogc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IE1hdGguZmxvb3IoY29tcG9uZW50LnBvcy55IC8gc2l6ZSkgKiBzaXplLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBUb2dnbGVkIHNuYXAgdG8gZ3JpZCAobm93ICR7RHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWR9KSBbR10uYCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IExJR0hUX0dSQVlfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkID0gIURyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkO1xuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5mb3JFYWNoKChjb21wb25lbnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiIsImltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmNvbnN0IHVuZG8gPSAoKSA9PiB7XG4gICAgU2FuZGJveE1hbmFnZXIucG9wSGlzdG9yeSgpO1xufTtcblxuY29uc3QgcmVkbyA9ICgpID0+IHtcbiAgICBTYW5kYm94TWFuYWdlci5yZWRvSGlzdG9yeSgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGhpc3RvcnkgPSB7XG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIkNvbnRyb2wrU2hpZnQrWlwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIk1ldGErU2hpZnQrWlwiLCAoKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJDb250cm9sK1pcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgdW5kbygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK1pcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHVuZG8oKTtcbiAgICB9KSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiIsImltcG9ydCB7IElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSwgTE9DS0VEX0ZPUl9URVNUSU5HLCBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgTW91c2VNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNvbnN0IGlvID0ge1xuICAgIFtcIktleUlcIl06ICgpID0+IHtcbiAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICBjb25zdCBpbnB1dCA9IG5ldyBJbnB1dCh7XG4gICAgICAgICAgICB4OiBNb3VzZU1hbmFnZXIubW91c2UueCAtIElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICB5OiBNb3VzZU1hbmFnZXIubW91c2UueSAtIElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKGlucHV0KSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChpbnB1dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgaW5wdXQuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9LFxuICAgIFtcIktleU9cIl06ICgpID0+IHtcbiAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICBjb25zdCBvdXRwdXQgPSBuZXcgT3V0cHV0KHtcbiAgICAgICAgICAgIHg6IE1vdXNlTWFuYWdlci5tb3VzZS54IC0gT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICB5OiBNb3VzZU1hbmFnZXIubW91c2UueSAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQob3V0cHV0KTtcblxuICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMob3V0cHV0KSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3Qob3V0cHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiIsImltcG9ydCB7IGJhY2tzcGFjZSB9IGZyb20gXCIuL2JhY2tzcGFjZVwiO1xuaW1wb3J0IHsgYmVoYXZpb3IgfSBmcm9tIFwiLi9iZWhhdmlvclwiO1xuaW1wb3J0IHsgaGlzdG9yeSB9IGZyb20gXCIuL2hpc3RvcnlcIjtcbmltcG9ydCB7IGlvIH0gZnJvbSBcIi4vaW9cIjtcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gXCIuL3NlbGVjdFwiO1xuaW1wb3J0IHsgc2VyZGUgfSBmcm9tIFwiLi9zZXJkZVwiO1xuXG5leHBvcnQgY29uc3Qga2V5YmluZHM6IFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPiA9IE9iamVjdC5hc3NpZ24oXG4gICAge30sXG4gICAgYmFja3NwYWNlLFxuICAgIGJlaGF2aW9yLFxuICAgIGhpc3RvcnksXG4gICAgaW8sXG4gICAgc2VsZWN0LFxuICAgIHNlcmRlLFxuKTtcbiIsImltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNvbnN0IHNlbGVjdCA9IHtcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtBXCIsICgpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gU2VsZWN0aW9uTWFuYWdlci5hZGRTZWxlY3Rpb24oY29tcG9uZW50KSk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIk1ldGErQVwiLCAoKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiBTZWxlY3Rpb25NYW5hZ2VyLmFkZFNlbGVjdGlvbihjb21wb25lbnQpKTtcbiAgICB9KSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiIsImltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IHNlcmRlIGFzIG1lbnUgfSBmcm9tIFwiLi4vY29udGV4dG1lbnUvc2VyZGVcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9LZXliaW5kc01hbmFnZXJcIjtcblxuZXhwb3J0IGNvbnN0IHNlcmRlID0ge1xuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJDb250cm9sK0tcIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBtZW51W1wiY29weS11cmxcIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiTWV0YStLXCIsIChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG1lbnVbXCJjb3B5LXVybFwiXS5jYWxsYmFjaygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJDb250cm9sK1NcIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBtZW51W1wic2F2ZS10b1wiXS5jYWxsYmFjaygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK1NcIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcInNhdmUtdG9cIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtPXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcImxvYWQtZnJvbVwiXS5jYWxsYmFjaygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK09cIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcImxvYWQtZnJvbVwiXS5jYWxsYmFjaygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJDb250cm9sK1NoaWZ0K1NcIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBtZW51W1wic2F2ZS1hc1wiXS5jYWxsYmFjaygpO1xuICAgIH0pLFxuICAgIC4uLktleWJpbmRzTWFuYWdlci5hc3NpZ24oXCJNZXRhK1NoaWZ0K1NcIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcInNhdmUtYXNcIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbiAgICAuLi5LZXliaW5kc01hbmFnZXIuYXNzaWduKFwiQ29udHJvbCtTaGlmdCtPXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbWVudVtcImltcG9ydC1mcm9tXCJdLmNhbGxiYWNrKCk7XG4gICAgfSksXG4gICAgLi4uS2V5YmluZHNNYW5hZ2VyLmFzc2lnbihcIk1ldGErU2hpZnQrT1wiLCAoZSkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBtZW51W1wiaW1wb3J0LWZyb21cIl0uY2FsbGJhY2soKTtcbiAgICB9KSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiIsImltcG9ydCB7IGNzcyB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSBcIi4vU3RvcmFnZU1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIERhcmttb2RlTWFuYWdlciB7XG4gICAgc3RhdGljIHJlYWRvbmx5ICNrZXkgPSBcInNldHRpbmdzLmRhcmttb2RlXCI7XG5cbiAgICBzdGF0aWMgZ2V0ICNlbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gU3RvcmFnZU1hbmFnZXIuZ2V0KHRoaXMuI2tleSkgPz8gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldCAjZW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQodGhpcy4ja2V5LCB2YWx1ZSk7XG5cbiAgICAgICAgdGhpcy4jZWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSA/IFwi8J+MlVwiIDogXCLwn4yRXCI7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwiZGFya21vZGVcIiwgdmFsdWUpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgI2VsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcImJ1dHRvbi5kYXJrbW9kZVwiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljICNsaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy4jZW5hYmxlZCA9ICF0aGlzLiNlbmFibGVkO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLiNlbmFibGVkID0gdGhpcy4jZW5hYmxlZDtcblxuICAgICAgICB0aGlzLiNlbGVtZW50LmlubmVyVGV4dCA9IHRoaXMuI2VuYWJsZWQgPyBcIvCfjJVcIiA6IFwi8J+MkVwiO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IGNzc2BcbiAgICAgICAgICAgICYge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICBsZWZ0OiAxNnB4O1xuICAgICAgICAgICAgICAgIGJvdHRvbTogMTZweDtcbiAgICAgICAgICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2xpc3RlbmVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jbGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyB0b2dnbGUodmFsdWU/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuI2VuYWJsZWQgPSB0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiID8gdmFsdWUgOiAhdGhpcy4jZW5hYmxlZDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBHUklEX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBEcmFnZ2luZ01hbmFnZXIge1xuICAgIHN0YXRpYyAjZHJhZ2dlZDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3dhdGNoZWQgPSBuZXcgTWFwKCk7XG5cbiAgICBzdGF0aWMgI21vdXNlID0geyB4OiAtMSwgeTogLTEsIG94OiAtMSwgb3k6IC0xLCBpeDogLTEsIGl5OiAtMSwgZG93bjogZmFsc2UgfTtcblxuICAgIHN0YXRpYyAjdG9wbGVmdDogRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjb3JpZ2luYWw6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjZG93bnBvcyA9IHsgeDogLTEsIHk6IC0xIH07XG5cbiAgICBzdGF0aWMgI3Bvc2l0aW9uczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9W10gfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgc25hcFRvR3JpZCA9IGZhbHNlO1xuXG4gICAgc3RhdGljIHdhdGNoKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB0YXJnZXQgPSBlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC53YXRjaGVkID0gXCJ0cnVlXCI7XG5cbiAgICAgICAgY29uc3QgbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQgPSBlbGVtZW50O1xuXG4gICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLmRhdGFzZXQuZHJhZ2dlZCA9IFwidHJ1ZVwiO1xuXG4gICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLmN1cnNvciA9IFwiZ3JhYmJpbmdcIjtcblxuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuI2RyYWdnZWQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLiNkcmFnZ2VkLnBhcmVudEVsZW1lbnQ/LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpID8/IG5ldyBET01SZWN0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZS5peCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgIHRoaXMuI21vdXNlLml5ID0gZS5jbGllbnRZO1xuXG4gICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdCArIGJvZHkubGVmdDtcbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veSA9IGUuY2xpZW50WSAtIHJlY3QudG9wICsgYm9keS50b3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IFsuLi5TZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkXS5tYXAoKHRhcmdldCkgPT4gdGFyZ2V0LnBvcyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gWy4uLlNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWRdLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXggPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXkgPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBieCA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBieSA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkID0gTWF0aC5zcXJ0KGF4ICogYXggKyBheSAqIGF5KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmQgPSBNYXRoLnNxcnQoYnggKiBieCArIGJ5ICogYnkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWQgLSBiZDtcbiAgICAgICAgICAgICAgICB9KVswXS5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYm91bmRzID0gdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm94ID0gZS5jbGllbnRYIC0gYm91bmRzLng7XG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3kgPSBlLmNsaWVudFkgLSBib3VuZHMueTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI3RvcGxlZnQgPSB0b3BsZWZ0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLiNvcmlnaW5hbCA9IHsgeDogcmVjdC5sZWZ0LCB5OiByZWN0LnRvcCB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHRvdWNoc3RhcnQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgW3RvdWNoXSA9IGUudG91Y2hlcztcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IGVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuZGF0YXNldC5kcmFnZ2VkID0gXCJ0cnVlXCI7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiO1xuXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy4jZHJhZ2dlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMuI2RyYWdnZWQucGFyZW50RWxlbWVudD8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgPz8gbmV3IERPTVJlY3QoKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2UueCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZS55ID0gdG91Y2guY2xpZW50WTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2UuaXggPSB0b3VjaC5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jbW91c2UuaXkgPSB0b3VjaC5jbGllbnRZO1xuXG4gICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veCA9IHRvdWNoLmNsaWVudFggLSByZWN0LmxlZnQgKyBib2R5LmxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3kgPSB0b3VjaC5jbGllbnRZIC0gcmVjdC50b3AgKyBib2R5LnRvcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy4jcG9zaXRpb25zID0gWy4uLlNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWRdLm1hcCgodGFyZ2V0KSA9PiB0YXJnZXQucG9zKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF0uc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBheCA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBheSA9IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ4ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ5ID0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWQgPSBNYXRoLnNxcnQoYXggKiBheCArIGF5ICogYXkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBiZCA9IE1hdGguc3FydChieCAqIGJ4ICsgYnkgKiBieSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZCAtIGJkO1xuICAgICAgICAgICAgICAgIH0pWzBdLmVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3ggPSB0b3VjaC5jbGllbnRYIC0gYm91bmRzLng7XG4gICAgICAgICAgICAgICAgdGhpcy4jbW91c2Uub3kgPSB0b3VjaC5jbGllbnRZIC0gYm91bmRzLnk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiN0b3BsZWZ0ID0gdG9wbGVmdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4jb3JpZ2luYWwgPSB7IHg6IHJlY3QubGVmdCwgeTogcmVjdC50b3AgfTtcbiAgICAgICAgfTtcblxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd24sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRvdWNoc3RhcnQsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLiN3YXRjaGVkLnNldCh0YXJnZXQsIHsgbW91c2Vkb3duLCB0b3VjaHN0YXJ0IH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBmb3JnZXQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGZvcmNlPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuI3dhdGNoZWQuZ2V0KGVsZW1lbnQpO1xuXG4gICAgICAgIGlmICghbGlzdGVuZXIgJiYgIWZvcmNlKSB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbm90IGN1cnJlbnRseSBiZWluZyB3YXRjaGVkLmApO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZGF0YXNldC53YXRjaGVkO1xuXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXIubW91c2Vkb3duLCB7IGNhcHR1cmU6IHRydWUgfSk7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGxpc3RlbmVyLnRvdWNoc3RhcnQsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgdGhpcy4jd2F0Y2hlZC5kZWxldGUoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuI3dhdGNoZWQuZm9yRWFjaCgoXywgZWxlbWVudCkgPT4gdGhpcy5mb3JnZXQoZWxlbWVudCkpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlID0geyB4OiAtMSwgeTogLTEsIG94OiAtMSwgb3k6IC0xLCBpeDogLTEsIGl5OiAtMSwgZG93bjogZmFsc2UgfTtcblxuICAgICAgICB0aGlzLiNkb3ducG9zID0geyB4OiAtMSwgeTogLTEgfTtcblxuICAgICAgICB0aGlzLiN0b3BsZWZ0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI2RyYWdnZWQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jb3JpZ2luYWwgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jcG9zaXRpb25zID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuZGVhZmVuKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuI21vdXNlbW92ZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMuI3RvdWNobW92ZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy4jdG91Y2hzdGFydCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuI3RvdWNoZW5kKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVhZmVuKCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy4jdG91Y2htb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLiN0b3VjaHN0YXJ0KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy4jdG91Y2hlbmQpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICBpZiAodGhpcy4jZHJhZ2dlZCkge1xuICAgICAgICAgICAgaWYgKERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUubGVmdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3gpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50b3AgPVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiN0b3BsZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSB0aGlzLiN0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0LmxlZnQgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQudG9wIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5sZWZ0ID0gdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLnRvcCA9IHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IHRoaXMuI3RvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UuaXggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLml5ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XG5cbiAgICAgICAgY29uc3QgaXNPbkludmFsaWRUYXJnZXQgPSBbXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1pbnB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLW91dHB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmRpc3BsYXlcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5jb250ZXh0bWVudVwiKSxcbiAgICAgICAgXS5maW5kKChlbGVtZW50KSA9PiBlbGVtZW50ICE9PSBudWxsKSE7XG5cbiAgICAgICAgaWYgKCFpc09uSW52YWxpZFRhcmdldCAmJiBlLmJ1dHRvbiA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy4jZG93bnBvcy54ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jZG93bnBvcy55ID0gZS5jbGllbnRZO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jbW91c2UuZG93biA9IHRydWU7XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2V1cCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgaWYgKHRoaXMuI2RyYWdnZWQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kcmFnZ2VkPVwidHJ1ZVwiXScpLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgZS5kYXRhc2V0LmRyYWdnZWQ7XG5cbiAgICAgICAgICAgICAgICBlLnN0eWxlLmN1cnNvciA9IFwiXCI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy4jZHJhZ2dlZDtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuI21vdXNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsID0gdGhpcy4jb3JpZ2luYWwhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSBHUklEX1NJWkU7XG5cbiAgICAgICAgICAgICAgICBpZiAobW91c2UueCAhPT0gbW91c2UuaXggfHwgbW91c2UueSAhPT0gbW91c2UuaXkpXG4gICAgICAgICAgICAgICAgICAgIGlmIChEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZClcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBNYXRoLmZsb29yKChtb3VzZS54IC0gbW91c2Uub3ggLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoKG1vdXNlLnkgLSBtb3VzZS5veSAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IE1hdGguZmxvb3IoKG9yaWdpbmFsLnggLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoKG9yaWdpbmFsLnkgLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IG1vdXNlLnggLSBtb3VzZS5veCAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBtb3VzZS55IC0gbW91c2Uub3kgLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IG9yaWdpbmFsLnggLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gb3JpZ2luYWwueSAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuI21vdXNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldHMgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF07XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy4jcG9zaXRpb25zITtcbiAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gdGhpcy4jdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gR1JJRF9TSVpFO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLnggIT09IG1vdXNlLml4IHx8IG1vdXNlLnkgIT09IG1vdXNlLml5KVxuICAgICAgICAgICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IE1hdGguZmxvb3IoKG1vdXNlLnggLSBtb3VzZS5veCkgLyBzaXplKSAqIHNpemUgKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBNYXRoLmZsb29yKChtb3VzZS55IC0gbW91c2Uub3kpIC8gc2l6ZSkgKiBzaXplICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogbW91c2UueCAtIG1vdXNlLm94ICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbW91c2UueSAtIG1vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggIT09IC0xICYmXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnkgIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueCAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55ICE9PSAtMVxuICAgICAgICApXG4gICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdEFsbEluKERyYWdnaW5nTWFuYWdlci4jZG93bnBvcywgTW91c2VNYW5hZ2VyLm1vdXNlKTtcblxuICAgICAgICB0aGlzLiNtb3VzZSA9IHsgeDogLTEsIHk6IC0xLCBveDogLTEsIG95OiAtMSwgaXg6IC0xLCBpeTogLTEsIGRvd246IGZhbHNlIH07XG5cbiAgICAgICAgdGhpcy4jZG93bnBvcyA9IHsgeDogLTEsIHk6IC0xIH07XG5cbiAgICAgICAgdGhpcy4jdG9wbGVmdCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNkcmFnZ2VkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI29yaWdpbmFsID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICN0b3VjaG1vdmUgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBbdG91Y2hdID0gZS50b3VjaGVzO1xuXG4gICAgICAgIHRoaXMuI21vdXNlLnggPSB0b3VjaC5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gdG91Y2guY2xpZW50WTtcblxuICAgICAgICBpZiAodGhpcy4jZHJhZ2dlZCkge1xuICAgICAgICAgICAgaWYgKERyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUubGVmdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3gpIC8gR1JJRF9TSVpFKSAqIEdSSURfU0laRSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50b3AgPVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLiN0b3BsZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSB0aGlzLiN0b3BsZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCkgLyBHUklEX1NJWkUpICogR1JJRF9TSVpFICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0LmxlZnQgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcigodGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95KSAvIEdSSURfU0laRSkgKiBHUklEX1NJWkUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQudG9wIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wbGVmdC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5sZWZ0ID0gdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLnRvcCA9IHRoaXMuI21vdXNlLnkgLSB0aGlzLiNtb3VzZS5veSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IHRoaXMuI3RvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3RvdWNoc3RhcnQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBbdG91Y2hdID0gZS50b3VjaGVzO1xuXG4gICAgICAgIHRoaXMuI21vdXNlLnggPSB0b3VjaC5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gdG91Y2guY2xpZW50WTtcblxuICAgICAgICB0aGlzLiNtb3VzZS5peCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLml5ID0gdG91Y2guY2xpZW50WTtcblxuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBFbGVtZW50O1xuXG4gICAgICAgIGNvbnN0IGlzT25JbnZhbGlkVGFyZ2V0ID0gW1xuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJidXR0b24uYm9hcmQtaW5wdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1vdXRwdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5jb21wb25lbnRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5kaXNwbGF5XCIpLFxuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJkaXYuY29udGV4dG1lbnVcIiksXG4gICAgICAgIF0uZmluZCgoZWxlbWVudCkgPT4gZWxlbWVudCAhPT0gbnVsbCkhO1xuXG4gICAgICAgIGlmICghaXNPbkludmFsaWRUYXJnZXQpIHtcbiAgICAgICAgICAgIHRoaXMuI2Rvd25wb3MueCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnkgPSB0b3VjaC5jbGllbnRZO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jbW91c2UuZG93biA9IHRydWU7XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjdG91Y2hlbmQgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBbdG91Y2hdID0gZS5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgICB0aGlzLiNtb3VzZS54ID0gdG91Y2guY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IHRvdWNoLmNsaWVudFk7XG5cbiAgICAgICAgaWYgKHRoaXMuI2RyYWdnZWQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kcmFnZ2VkPVwidHJ1ZVwiXScpLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgZS5kYXRhc2V0LmRyYWdnZWQ7XG5cbiAgICAgICAgICAgICAgICBlLnN0eWxlLmN1cnNvciA9IFwiXCI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuc2l6ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy4jZHJhZ2dlZDtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuI21vdXNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsID0gdGhpcy4jb3JpZ2luYWwhO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSBHUklEX1NJWkU7XG5cbiAgICAgICAgICAgICAgICBpZiAobW91c2UueCAhPT0gbW91c2UuaXggfHwgbW91c2UueSAhPT0gbW91c2UuaXkpXG4gICAgICAgICAgICAgICAgICAgIGlmIChEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZClcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBNYXRoLmZsb29yKChtb3VzZS54IC0gbW91c2Uub3ggLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoKG1vdXNlLnkgLSBtb3VzZS5veSAtIDEpIC8gc2l6ZSkgKiBzaXplICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IE1hdGguZmxvb3IoKG9yaWdpbmFsLnggLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoKG9yaWdpbmFsLnkgLSAxKSAvIHNpemUpICogc2l6ZSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IG1vdXNlLnggLSBtb3VzZS5veCAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS50b3AgPSBtb3VzZS55IC0gbW91c2Uub3kgLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IG9yaWdpbmFsLnggLSAxICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gb3JpZ2luYWwueSAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuI3RvcGxlZnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuI21vdXNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldHMgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF07XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy4jcG9zaXRpb25zITtcbiAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gdGhpcy4jdG9wbGVmdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gR1JJRF9TSVpFO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLnggIT09IG1vdXNlLml4IHx8IG1vdXNlLnkgIT09IG1vdXNlLml5KVxuICAgICAgICAgICAgICAgICAgICBpZiAoRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IE1hdGguZmxvb3IoKG1vdXNlLnggLSBtb3VzZS5veCkgLyBzaXplKSAqIHNpemUgKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBNYXRoLmZsb29yKChtb3VzZS55IC0gbW91c2Uub3kpIC8gc2l6ZSkgKiBzaXplICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogbW91c2UueCAtIG1vdXNlLm94ICsgb2Zmc2V0LmxlZnQgLSB0b3BsZWZ0LmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbW91c2UueSAtIG1vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGNvbXBvbmVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggIT09IC0xICYmXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnkgIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueCAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55ICE9PSAtMVxuICAgICAgICApXG4gICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdEFsbEluKERyYWdnaW5nTWFuYWdlci4jZG93bnBvcywgTW91c2VNYW5hZ2VyLm1vdXNlKTtcblxuICAgICAgICB0aGlzLiNtb3VzZSA9IHsgeDogLTEsIHk6IC0xLCBveDogLTEsIG95OiAtMSwgaXg6IC0xLCBpeTogLTEsIGRvd246IGZhbHNlIH07XG5cbiAgICAgICAgdGhpcy4jZG93bnBvcyA9IHsgeDogLTEsIHk6IC0xIH07XG5cbiAgICAgICAgdGhpcy4jdG9wbGVmdCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNkcmFnZ2VkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI29yaWdpbmFsID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB9O1xuXG4gICAgc3RhdGljIGdldCBkb3ducG9zKCkge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLiNkb3ducG9zIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgS2V5YmluZHNNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2tleW1hcCA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xuXG4gICAgc3RhdGljICNrZXljaG9yZHMgPSBuZXcgQXJyYXk8W3N0cmluZywgKChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKVtdXT4oKTtcblxuICAgIHN0YXRpYyAja2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5zZXQoZS5jb2RlLCB0cnVlKTtcblxuICAgICAgICBpZiAoZS5tZXRhS2V5ICYmIChlLmNvZGUgPT09IFwiU2hpZnRMZWZ0XCIgfHwgZS5jb2RlID09PSBcIlNoaWZ0UmlnaHRcIikgJiYgSVNfTUFDX09TKVxuICAgICAgICAgICAgdGhpcy4ja2V5bWFwID0gbmV3IE1hcChbLi4udGhpcy4ja2V5bWFwLmVudHJpZXMoKV0uZmlsdGVyKChba2V5XSkgPT4gIWtleS5zdGFydHNXaXRoKFwiS2V5XCIpKSk7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGNvbnN0IFtjaG9yZCwgcnVuc10gPVxuICAgICAgICAgICAgICAgIHRoaXMuI2tleWNob3Jkcy5maW5kKChbY2hvcmRdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBrZXlzID0gY2hvcmQuc3BsaXQoXCIrXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrU2hpZnQgPSBrZXlzLmluY2x1ZGVzKFwiU2hpZnRMZWZ0XCIpIHx8IGtleXMuaW5jbHVkZXMoXCJTaGlmdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja0N0cmwgPSBrZXlzLmluY2x1ZGVzKFwiQ29udHJvbExlZnRcIikgfHwga2V5cy5pbmNsdWRlcyhcIkNvbnRyb2xSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tBbHQgPSBrZXlzLmluY2x1ZGVzKFwiQWx0TGVmdFwiKSB8fCBrZXlzLmluY2x1ZGVzKFwiQWx0UmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrTWV0YSA9IGtleXMuaW5jbHVkZXMoXCJNZXRhTGVmdFwiKSB8fCBrZXlzLmluY2x1ZGVzKFwiTWV0YVJpZ2h0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tTaGlmdCAmJiBlLnNoaWZ0S2V5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tDdHJsICYmIGUuY3RybEtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrQWx0ICYmIGUuYWx0S2V5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tNZXRhICYmIGUubWV0YUtleSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja1NoaWZ0KSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIlNoaWZ0TGVmdFwiICYmIGtleSAhPT0gXCJTaGlmdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tDdHJsKSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIkNvbnRyb2xMZWZ0XCIgJiYga2V5ICE9PSBcIkNvbnRyb2xSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrQWx0KSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIkFsdExlZnRcIiAmJiBrZXkgIT09IFwiQWx0UmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja01ldGEpIGtleXMgPSBrZXlzLmZpbHRlcigoa2V5KSA9PiBrZXkgIT09IFwiTWV0YUxlZnRcIiAmJiBrZXkgIT09IFwiTWV0YVJpZ2h0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tTaGlmdCA/IGUuc2hpZnRLZXkgOiB0cnVlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrQ3RybCA/IGUuY3RybEtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tBbHQgPyBlLmFsdEtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tNZXRhID8gZS5tZXRhS2V5IDogdHJ1ZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXMuZXZlcnkoKGtleSkgPT4gdGhpcy4ja2V5bWFwLmdldChrZXkpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pID8/IFtdO1xuXG4gICAgICAgICAgICBpZiAocnVucykge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLmtpbGxNZW51KCk7XG5cbiAgICAgICAgICAgICAgICBydW5zLmZvckVhY2goKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBlKSk7XG5cbiAgICAgICAgICAgICAgICBjaG9yZCEuc3BsaXQoXCIrXCIpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJLZXlcIikpIHRoaXMuI2tleW1hcC5kZWxldGUoa2V5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgI2tleXVwID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmRlbGV0ZShlLmNvZGUpO1xuXG4gICAgICAgIGlmICghZS5tZXRhS2V5ICYmIChlLmNvZGUgPT09IFwiTWV0YUxlZnRcIiB8fCBlLmNvZGUgPT09IFwiTWV0YVJpZ2h0XCIpICYmIElTX01BQ19PUykgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjYmx1ciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuI2tleWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy4ja2V5dXApO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLiNibHVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVhZmVuKCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLiNrZXlkb3duKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuI2tleXVwKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy4jYmx1cik7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uS2V5Q2hvcmQoY2hvcmQ6IHN0cmluZywgcnVuOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICBjaG9yZCA9IGNob3JkLnNwbGl0KFwiK1wiKS5zb3J0KCkuam9pbihcIitcIik7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNrZXljaG9yZHMuZmluZCgoW2tleV0pID0+IGtleSA9PT0gY2hvcmQpPy5bMV0ucHVzaChydW4pKSB0aGlzLiNrZXljaG9yZHMucHVzaChbY2hvcmQsIFtydW5dXSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bkFuZE5vRm9jdXMoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy4ja2V5bWFwLmdldChrZXkpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bihrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gISF0aGlzLiNrZXltYXAuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLiNrZXltYXAuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLiNrZXljaG9yZHMgPSBbXTtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBleHBhbmQ8UyBleHRlbmRzIHN0cmluZz4oY2hvcmQ6IFMpOiBFeHBhbmRDaG9yZDxTPltdO1xuICAgIHN0YXRpYyBleHBhbmQoY2hvcmQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBba2V5LCAuLi5yZXN0XSA9IGNob3JkLnNwbGl0KFwiK1wiKTtcblxuICAgICAgICBpZiAoa2V5ID09PSBcIlNoaWZ0XCIgfHwga2V5ID09PSBcIkNvbnRyb2xcIiB8fCBrZXkgPT09IFwiQWx0XCIgfHwga2V5ID09PSBcIk1ldGFcIilcbiAgICAgICAgICAgIHJldHVybiByZXN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgID8gdGhpcy5leHBhbmQocmVzdC5qb2luKFwiK1wiKSkuZmxhdE1hcCgoa2V5cykgPT4gW1xuICAgICAgICAgICAgICAgICAgICAgIFtgJHtrZXl9TGVmdGAsIGtleXNdLmpvaW4oXCIrXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIFtgJHtrZXl9UmlnaHRgLCBrZXlzXS5qb2luKFwiK1wiKSxcbiAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgOiBbYCR7a2V5fUxlZnRgLCBgJHtrZXl9UmlnaHRgXTtcblxuICAgICAgICBpZiAoa2V5Lmxlbmd0aCA9PT0gMSAmJiBrZXkgPT09IGtleS50b1VwcGVyQ2FzZSgpKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3QubGVuZ3RoXG4gICAgICAgICAgICAgICAgPyB0aGlzLmV4cGFuZChyZXN0LmpvaW4oXCIrXCIpKS5mbGF0TWFwKChrZXlzKSA9PiBbW2BLZXkke2tleX1gLCBrZXlzXS5qb2luKFwiK1wiKV0pXG4gICAgICAgICAgICAgICAgOiBbYEtleSR7a2V5fWBdO1xuXG4gICAgICAgIHJldHVybiBbY2hvcmRdO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3NpZ248UyBleHRlbmRzIHN0cmluZywgUiBleHRlbmRzIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPihjaG9yZDogUywgcnVuOiBSKTogQXNzaWduQ2hvcmQ8UywgUj47XG4gICAgc3RhdGljIGFzc2lnbihjaG9yZDogc3RyaW5nLCBydW46IChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChjaG9yZClcbiAgICAgICAgICAgICAgICAubWFwPFtTdHJpbmdpZmlhYmxlLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZF0+KChrZXlzKSA9PiBba2V5cywgcnVuXSlcbiAgICAgICAgICAgICAgICAuY29uY2F0KFtbY2hvcmQsIHJ1bl1dKSxcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbnR5cGUgU3BsaXQ8UyBleHRlbmRzIHN0cmluZywgRCBleHRlbmRzIHN0cmluZyA9IFwiXCIsIFIgZXh0ZW5kcyByZWFkb25seSB1bmtub3duW10gPSBbXT4gPSBTIGV4dGVuZHMgXCJcIlxuICAgID8gUlxuICAgIDogUyBleHRlbmRzIGAke2luZmVyIEF9JHtEfSR7aW5mZXIgQn1gXG4gICAgPyBTcGxpdDxCLCBELCBbLi4uUiwgQV0+XG4gICAgOiBbLi4uUiwgU107XG5cbnR5cGUgU3RyaW5naWZpYWJsZSA9IHN0cmluZyB8IG51bWJlciB8IGJpZ2ludCB8IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG50eXBlIEpvaW48QSwgUyBleHRlbmRzIHN0cmluZyA9IFwiXCIsIFIgZXh0ZW5kcyBzdHJpbmcgPSBcIlwiPiA9IEEgZXh0ZW5kcyBbaW5mZXIgWCBleHRlbmRzIFN0cmluZ2lmaWFibGUsIC4uLmluZmVyIFldXG4gICAgPyBKb2luPFksIFMsIFIgZXh0ZW5kcyBcIlwiID8gWCA6IGAke1J9JHtTfSR7WH1gPlxuICAgIDogUjtcblxudHlwZSBFeHBhbmRDaG9yZDxTIGV4dGVuZHMgc3RyaW5nLCBBIGV4dGVuZHMgc3RyaW5nW10gPSBTcGxpdDxTLCBcIitcIj4+ID0gSm9pbjxcbiAgICB7XG4gICAgICAgIFtLIGluIGtleW9mIEFdOiBBW0tdIGV4dGVuZHMgXCJTaGlmdFwiIHwgXCJDb250cm9sXCIgfCBcIkFsdFwiIHwgXCJNZXRhXCJcbiAgICAgICAgICAgID8gYCR7QVtLXX0ke1wiTGVmdFwiIHwgXCJSaWdodFwifWBcbiAgICAgICAgICAgIDogU3BsaXQ8QVtLXT5bXCJsZW5ndGhcIl0gZXh0ZW5kcyAxXG4gICAgICAgICAgICA/IEFbS10gZXh0ZW5kcyBVcHBlcmNhc2U8QVtLXT5cbiAgICAgICAgICAgICAgICA/IGBLZXkke0FbS119YFxuICAgICAgICAgICAgICAgIDogQVtLXVxuICAgICAgICAgICAgOiBBW0tdO1xuICAgIH0sXG4gICAgXCIrXCJcbj47XG5cbnR5cGUgQXNzaWduQ2hvcmQ8UyBleHRlbmRzIHN0cmluZywgUj4gPSB7XG4gICAgW18gaW4gU106IFI7XG59ICYge1xuICAgIFtLIGluIEV4cGFuZENob3JkPFM+ICYgUHJvcGVydHlLZXldOiBSO1xufTtcbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQ29udGV4dCA9IHtcbiAgICBtZW51OiBIVE1MRWxlbWVudDtcbiAgICBjbGlja3M6IE1hcDxzdHJpbmcsICgpID0+IHZvaWQ+O1xuICAgIGxpc3RlbmVyczoge1xuICAgICAgICBtb3VzZWRvd246IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgICAgICBjb250ZXh0bWVudTogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgICAgIGNsaWNrOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICB9O1xufTtcblxuZXhwb3J0IHR5cGUgTWVudU1hbmFnZXJBY3Rpb25zID0gQXJyYXk8XG4gICAgUmVjb3JkPHN0cmluZywgeyBsYWJlbDogc3RyaW5nOyBrZXliaW5kPzogc3RyaW5nOyBjYWxsYmFjazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQgfT5cbj47XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQWN0aW9uID0gTWVudU1hbmFnZXJBY3Rpb25zW251bWJlcl07XG5cbmV4cG9ydCBjbGFzcyBNZW51TWFuYWdlciB7XG4gICAgc3RhdGljIHJlYWRvbmx5ICNlbGVtZW50cyA9IG5ldyBNYXA8SFRNTEVsZW1lbnQsIE1lbnVNYW5hZ2VyQ29udGV4dD4oKTtcblxuICAgIHN0YXRpYyAjb3BlbmVkOiBNb3VzZUV2ZW50O1xuXG4gICAgc3RhdGljIHVzZShcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgIGFjdGlvbnM6IE1lbnVNYW5hZ2VyQWN0aW9ucyxcbiAgICApOiBbcXVldWVOZXdDb250ZXh0OiAobmV3Q29udGV4dDogKHByZXY6IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4gTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB2b2lkLCBraWxsTWVudTogKCkgPT4gdm9pZF0ge1xuICAgICAgICBjb25zdCBtZW51ID0gaHRtbGA8ZGl2IGNsYXNzPVwiY29udGV4dG1lbnVcIj48L2Rpdj5gO1xuXG4gICAgICAgIGNvbnN0IGNsaWNrcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICBjb25zdCBzZXR1cCA9IChhY3Rpb25zOiBNZW51TWFuYWdlckFjdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGNsaWNrcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBjb25zdCBrZXlzID0gYWN0aW9ucy5mbGF0TWFwKChyZWNvcmQpID0+IE9iamVjdC5rZXlzKHJlY29yZCkpO1xuXG4gICAgICAgICAgICBpZiAoa2V5cy5sZW5ndGggIT09IG5ldyBTZXQoa2V5cykuc2l6ZSkgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIGtleXMgaW4gbWVudSBhY3Rpb25zLlwiKTtcblxuICAgICAgICAgICAgbWVudS5pbm5lckhUTUwgPSBhY3Rpb25zXG4gICAgICAgICAgICAgICAgLm1hcCgocmVjb3JkKSA9PlxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhyZWNvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChbbmFtZSwgeyBsYWJlbCwga2V5YmluZCB9XSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYDxidXR0b24gY2xhc3M9XCIke25hbWV9XCI+JHtsYWJlbH08cCBjbGFzcz1cIm1lbnUta2V5YmluZFwiPiR7a2V5YmluZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGtleSkgPT4gYDxzcGFuPiR7a2V5fTwvc3Bhbj5gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKX08L3A+PC9idXR0b24+YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGA8YnV0dG9uIGNsYXNzPVwiJHtuYW1lfVwiPiR7bGFiZWx9PC9idXR0b24+YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuam9pbignPGRpdiBjbGFzcz1cImJyXCI+PC9kaXY+Jyk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZm9yRWFjaCgocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVjb3JkKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xpY2sgPSByZWNvcmRba2V5XS5jYWxsYmFjay5iaW5kKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiBjbGljayh0aGlzLiNvcGVuZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIG1lbnUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuXCIgKyBrZXkpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLlwiICsga2V5KSEuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgICAgICBjbGlja3Muc2V0KGtleSwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGNvbnRleHQ6IE1lbnVNYW5hZ2VyQWN0aW9ucyB8IHVuZGVmaW5lZDtcblxuICAgICAgICBjb25zdCBnZXRBY3Rpb25zID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gY29udGV4dDtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobWVudSk7XG5cbiAgICAgICAgY29uc3QgbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI29wZW5lZCA9IGU7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjb250ZXh0bWVudSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBlLmNsaWVudFggKyBcInB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IGUuY2xpZW50WSArIFwicHhcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgY29udGV4dG1lbnUpO1xuICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGljayk7XG4gICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGNsaWNrKTtcblxuICAgICAgICB0aGlzLiNlbGVtZW50cy5zZXQoZWxlbWVudCwgeyBtZW51LCBjbGlja3MsIGxpc3RlbmVyczogeyBtb3VzZWRvd24sIGNvbnRleHRtZW51LCBjbGljayB9IH0pO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAobmV3Q29udGV4dDogKHByZXY6IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4gTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IG5ld0NvbnRleHQuY2FsbCh1bmRlZmluZWQsIFsuLi5hY3Rpb25zXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIG1lbnUuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCB7IG1lbnUsIGNsaWNrcywgbGlzdGVuZXJzIH0gPSB0aGlzLiNlbGVtZW50cy5nZXQoZWxlbWVudCkgPz8ge307XG5cbiAgICAgICAgaWYgKCFtZW51IHx8ICFjbGlja3MgfHwgIWxpc3RlbmVycykgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50cyBhcmUgbm90IGJlaW5nIGFmZmVjdGVkLmApO1xuXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBsaXN0ZW5lcnMubW91c2Vkb3duKTtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXJzLmNvbnRleHRtZW51KTtcbiAgICAgICAgbWVudS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXJzLmNsaWNrKTtcbiAgICAgICAgbWVudS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXJzLmNsaWNrKTtcblxuICAgICAgICBBcnJheS5mcm9tKGNsaWNrcykuZm9yRWFjaCgoW2tleSwgbGlzdGVuZXJdKSA9PiB7XG4gICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3IoXCIuXCIgKyBrZXkpIS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yKFwiLlwiICsga2V5KSEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWVudS5yZW1vdmUoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgTW9kYWxNYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWNvbnRhaW5lclwiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljICNvbk1vZGFsTW91bnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCA8PSAwKSB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtaW5hY3RpdmVcIik7XG4gICAgICAgIGVsc2UgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEuY2xhc3NMaXN0LmFkZChcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgIH1cblxuICAgIHN0YXRpYyAjb25Nb2RhbFJlc29sdmVkKCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPD0gMCkgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5jb250YWlucyhcIm1vZGFsLWFsZXJ0XCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgYWxlcnQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI29uTW9kYWxNb3VudCgpO1xuXG4gICAgICAgIGNvbnN0IGFsZXJ0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1hbGVydFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGFsZXJ0KTtcblxuICAgICAgICBhbGVydC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBhbGVydC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxSZXNvbHZlZCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgY29uc3QgY2xpY2tvdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gdGhpcy5jb250YWluZXIgfHwgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCAhPT0gYWxlcnQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbGlja291dCk7XG5cbiAgICAgICAgICAgIGFsZXJ0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBjb25maXJtKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBjb25maXJtID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1jb25maXJtXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtY2FuY2VsXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChjb25maXJtKTtcblxuICAgICAgICBjb25maXJtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5mb2N1cygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKCkgPT4gcmVzb2x2ZShmYWxzZSk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAodmFsdWU6IGJvb2xlYW4pID0+ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25maXJtLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jb25Nb2RhbFJlc29sdmVkKCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgZXNjID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5jb2RlID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm0ucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jb25Nb2RhbFJlc29sdmVkKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlc2MpO1xuXG4gICAgICAgICAgICBjb25zdCBjbGlja291dCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICE9PSB0aGlzLmNvbnRhaW5lciB8fCB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkICE9PSBjb25maXJtKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgICAgIGNvbmZpcm0ucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgY29uZmlybS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1jYW5jZWxcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKGZhbHNlKSk7XG5cbiAgICAgICAgICAgIGNvbmZpcm0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKHRydWUpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIHByb21wdChtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy4jb25Nb2RhbE1vdW50KCk7XG5cbiAgICAgICAgY29uc3QgcHJvbXB0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1jb25maXJtXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJtb2RhbC1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgLz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtY2FuY2VsXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9tcHQpO1xuXG4gICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmFkZChmaW5pc2gpO1xuXG4gICAgICAgICAgICBjb25zdCBkb25lID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb21wdC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxSZXNvbHZlZCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZmluaXNoKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgY29uc3QgY2xpY2tvdXQgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAhPT0gdGhpcy5jb250YWluZXIgfHwgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCAhPT0gcHJvbXB0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsaWNrb3V0KTtcblxuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xpY2tvdXQpO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtY2FuY2VsXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgTW91c2VNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI21vdXNlID0geyB4OiAwLCB5OiAwIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlZG93bnMgPSBuZXcgU2V0PChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2V1cHMgPSBuZXcgU2V0PChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjdG91Y2hzdGFydHMgPSBuZXcgU2V0PChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjdG91Y2hlbmRzID0gbmV3IFNldDwoZTogVG91Y2hFdmVudCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyAjbW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcbiAgICB9O1xuXG4gICAgc3RhdGljICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI21vdXNldXAgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIHRoaXMuI21vdXNldXBzLmZvckVhY2goKGwpID0+IGwuY2FsbCh1bmRlZmluZWQsIGUpKTtcbiAgICB9O1xuXG4gICAgc3RhdGljICN0b3VjaG1vdmUgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICB9O1xuXG4gICAgc3RhdGljICN0b3VjaHN0YXJ0ID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jdG91Y2hzdGFydHMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI3RvdWNoZW5kID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcblxuICAgICAgICB0aGlzLiN0b3VjaGVuZHMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgc3RhcnQoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLiN0b3VjaG1vdmUpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLiN0b3VjaHN0YXJ0KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuI3RvdWNoZW5kKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMuI3RvdWNobW92ZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuI3RvdWNoc3RhcnQpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy4jdG91Y2hlbmQpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlID0geyB4OiAwLCB5OiAwIH07XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcblxuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uTW91c2VEb3duKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuYWRkKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbk1vdXNlVXAoaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuYWRkKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZNb3VzZURvd24oaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5kZWxldGUoaGFuZGxlcik7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZk1vdXNlVXAoaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZGVsZXRlKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvblRvdWNoU3RhcnQoaGFuZGxlcjogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jdG91Y2hzdGFydHMuYWRkKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvblRvdWNoRW5kKGhhbmRsZXI6IChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI3RvdWNoZW5kcy5hZGQoaGFuZGxlcik7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZlRvdWNoU3RhcnQoaGFuZGxlcjogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jdG91Y2hzdGFydHMuZGVsZXRlKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZUb3VjaEVuZChoYW5kbGVyOiAoZTogVG91Y2hFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiN0b3VjaGVuZHMuZGVsZXRlKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgbW91c2UoKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMuI21vdXNlIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBJTl9ERUJVR19NT0RFLCBUT0FTVF9EVVJBVElPTiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGZyb21GaWxlLCBzYXZlRGlhZ3JhbSwgU2VyaWFsaXplZERpYWdyYW0gfSBmcm9tIFwiLi4vZmlsZXNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGlzcGxheSB9IGZyb20gXCIuLi9yZWlmaWVkL0Rpc3BsYXlcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IERhcmttb2RlTWFuYWdlciB9IGZyb20gXCIuL0Rhcmttb2RlTWFuYWdlclwiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1lbnVNYW5hZ2VyLCBNZW51TWFuYWdlckFjdGlvbnMgfSBmcm9tIFwiLi9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4vTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuL1N0b3JhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuL1dpcmluZ01hbmFnZXJcIjtcblxudHlwZSBTYW5kYm94Q29uZmlnID0ge1xuICAgIGtleWJpbmRzPzogUmVjb3JkPHN0cmluZywgKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ+O1xuICAgIG1lbnU/OiBNZW51TWFuYWdlckFjdGlvbnM7XG4gICAgaW5pdGlhbD86IFtjb21wb25lbnRzOiBSZWlmaWVkW10sIHdpcmVzOiBXaXJpbmdbXV07XG4gICAgbGltaXRzPzoge1xuICAgICAgICBpbnB1dHM/OiBudW1iZXI7XG4gICAgICAgIG91dHB1dHM/OiBudW1iZXI7XG4gICAgICAgIHdpcmluZ3M/OiBudW1iZXI7XG4gICAgICAgIGNoaXBzPzogUmVjb3JkPHN0cmluZywgbnVtYmVyPjtcbiAgICAgICAgY2hpcHNUb3RhbD86IG51bWJlcjtcbiAgICAgICAgY29tcG9uZW50c1RvdGFsPzogbnVtYmVyO1xuICAgIH07XG4gICAgc3RhdGVzPzogeyBpbnB1dHM/OiBib29sZWFuW107IG91dHB1dHM/OiBib29sZWFuW107IGNhbGxiYWNrOiAoKSA9PiB2b2lkIH1bXTtcbiAgICBzYXZlPzogc3RyaW5nO1xuICAgIG92ZXJyaWRlU2F2ZUlmRXhpc3RzPzogYm9vbGVhbjtcbiAgICBjaGVja0ludGVydmFsPzogbnVtYmVyO1xuICAgIGNoZWNrU3RhdGU/OiAocmVpZmllZDogV2F0Y2hlZFNldDxSZWlmaWVkPiwgd2lyaW5nczogV2F0Y2hlZFNldDxXaXJpbmc+KSA9PiBib29sZWFuO1xuICAgIGlmU3RhdGVDaGVja2VkPzogKCkgPT4gdm9pZDtcbiAgICBzZXR0aW5ncz86IHsgc25hcFRvR3JpZD86IGJvb2xlYW4gfTtcbn07XG5cbmNvbnN0IGNhbGN1bGF0ZVJlaWZpZWRUb3RhbHMgPSAoc2V0OiBTZXQ8UmVpZmllZD4pID0+XG4gICAgWy4uLnNldF0ucmVkdWNlKFxuICAgICAgICAobWFwLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIElucHV0KSB7XG4gICAgICAgICAgICAgICAgbWFwLmlucHV0c1RvdGFsKys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0gaW5zdGFuY2VvZiBPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICBtYXAub3V0cHV0c1RvdGFsKys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0gaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICBtYXAuY2hpcHNUb3RhbCsrO1xuXG4gICAgICAgICAgICAgICAgbWFwLmNoaXBzLnNldChpdGVtLmNoaXAubmFtZSwgKG1hcC5jaGlwcy5nZXQoaXRlbS5jaGlwLm5hbWUpID8/IDApICsgMSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0gaW5zdGFuY2VvZiBEaXNwbGF5KSB7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbWFwO1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnB1dHNUb3RhbDogMCxcbiAgICAgICAgICAgIG91dHB1dHNUb3RhbDogMCxcbiAgICAgICAgICAgIGNoaXBzVG90YWw6IDAsXG4gICAgICAgICAgICBjaGlwczogbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKSxcbiAgICAgICAgfSxcbiAgICApO1xuXG5leHBvcnQgY2xhc3MgU2FuZGJveE1hbmFnZXIge1xuICAgIHN0YXRpYyBxdWV1ZU5ld0NvbnRleHQ6IFJldHVyblR5cGU8dHlwZW9mIE1lbnVNYW5hZ2VyW1widXNlXCJdPlswXTtcbiAgICBzdGF0aWMga2lsbE1lbnU6IFJldHVyblR5cGU8dHlwZW9mIE1lbnVNYW5hZ2VyW1widXNlXCJdPlsxXTtcblxuICAgIHN0YXRpYyB3YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzID0gbmV3IFNldDwoKSA9PiB2b2lkPigpO1xuXG4gICAgc3RhdGljICNpbnRlcnZhbCA9IC0xO1xuICAgIHN0YXRpYyAjb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgI2hpc3RvcnkgPSBuZXcgQXJyYXk8W2NvbW1hbmQ6ICgpID0+IHZvaWQsIHJlZG86ICgpID0+IHZvaWRdPigpO1xuICAgIHN0YXRpYyAjcmVkb3MgPSBuZXcgQXJyYXk8W2NvbW1hbmQ6ICgpID0+IHZvaWQsIHJlZG86ICgpID0+IHZvaWRdPigpO1xuXG4gICAgc3RhdGljICNjb25maWc6IFNhbmRib3hDb25maWc7XG5cbiAgICBzdGF0aWMgc2V0dXAoY29uZmlnOiBTYW5kYm94Q29uZmlnKSB7XG4gICAgICAgIGlmICh0aGlzLiNvYnNlcnZlcikgdGhpcy4jb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jaW50ZXJ2YWwpO1xuXG4gICAgICAgIHRoaXMuI2NvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxkaXYgY2xhc3M9XCJtb2RhbC1jb250YWluZXIgbW9kYWwtaW5hY3RpdmVcIj48L2Rpdj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxkaXYgY2xhc3M9XCJyZWlmaWVkLXJvb3RcIj48L2Rpdj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxjYW52YXM+PC9jYW52YXM+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8ZGl2IGNsYXNzPVwidG9hc3RzLWNvbnRhaW5lclwiPjwvZGl2PmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGJ1dHRvbiBjbGFzcz1cImRhcmttb2RlXCI+PC9idXR0b24+YCk7XG5cbiAgICAgICAgTW91c2VNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgICAgIEtleWJpbmRzTWFuYWdlci5saXN0ZW4oKTtcbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmxpc3RlbigpO1xuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLmxpc3RlbigpO1xuICAgICAgICBXaXJpbmdNYW5hZ2VyLnN0YXJ0KCk7XG5cbiAgICAgICAgRGFya21vZGVNYW5hZ2VyLmxpc3RlbigpO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZVJlaWZpZWRBY3RpdmUgPSAoY29tcG9uZW50czogUmVpZmllZFtdKSA9PlxuICAgICAgICAgICAgbmV3IFdhdGNoZWRTZXQ8UmVpZmllZD4oKVxuICAgICAgICAgICAgICAgIC5vbkFkZCgoaXRlbSwgc2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFscyA9IGNhbGN1bGF0ZVJlaWZpZWRUb3RhbHMoc2V0LmNsb25lKCkuYWRkKGl0ZW0pKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHMuY2hpcHNUb3RhbCArIHRvdGFscy5pbnB1dHNUb3RhbCArIHRvdGFscy5vdXRwdXRzVG90YWwgPlxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuI2NvbmZpZy5saW1pdHM/LmNvbXBvbmVudHNUb3RhbCA/PyBJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgY29tcG9uZW50cyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFscy5pbnB1dHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5pbnB1dHMgPz8gSW5maW5pdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgaW5wdXRzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxzLm91dHB1dHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5vdXRwdXRzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIG91dHB1dHMgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbHMuY2hpcHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5jaGlwc1RvdGFsID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIGNoaXBzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtIGluc3RhbmNlb2YgQ29tcG9uZW50ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHMuY2hpcHMuaGFzKGl0ZW0uY2hpcC5uYW1lKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzLmNoaXBzLmdldChpdGVtLmNoaXAubmFtZSkhID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LmNoaXBzPy5baXRlbS5jaGlwLm5hbWVdID8/IEluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYEV4Y2VlZGVkIHRvdGFsICcke2l0ZW0uY2hpcC5uYW1lfScgbGltaXQuYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWRkQWxsKGNvbXBvbmVudHMpO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZVdpcmluZ3NTZXQgPSAod2lyaW5nczogV2lyaW5nW10pID0+XG4gICAgICAgICAgICBuZXcgV2F0Y2hlZFNldDxXaXJpbmc+KClcbiAgICAgICAgICAgICAgICAub25BZGQoKF8sIHNldCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0LnNpemUgKyAxID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LndpcmluZ3MgPz8gSW5maW5pdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgd2lyaW5ncyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWRkQWxsKHdpcmluZ3MpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLm1lbnUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICBbdGhpcy5xdWV1ZU5ld0NvbnRleHQsIHRoaXMua2lsbE1lbnVdID0gTWVudU1hbmFnZXIudXNlKFJlaWZpZWQucm9vdCwgdGhpcy4jY29uZmlnLm1lbnUpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLmtleWJpbmRzICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy4jY29uZmlnLmtleWJpbmRzKS5mb3JFYWNoKChbY2hvcmQsIHJ1bl0pID0+IEtleWJpbmRzTWFuYWdlci5vbktleUNob3JkKGNob3JkLCBydW4pKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5pbml0aWFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlID0gY3JlYXRlUmVpZmllZEFjdGl2ZSh0aGlzLiNjb25maWcuaW5pdGlhbFswXSk7XG5cbiAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmF0dGFjaCgpKTtcblxuICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcyA9IGNyZWF0ZVdpcmluZ3NTZXQodGhpcy4jY29uZmlnLmluaXRpYWxbMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcuc2F2ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IFN0b3JhZ2VNYW5hZ2VyLmdldDxzdHJpbmc+KFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSk7XG5cbiAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBbc2V0dGluZ3MsIGNvbXBvbmVudHMsIHdpcmVzXSxcbiAgICAgICAgICAgICAgICB9ID0gZnJvbUZpbGUoZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuZGVsZXRlKFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKElOX0RFQlVHX01PREUpIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcmVhZCBmcm9tIHNhdmVzOlwiLCBlcnJvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHJlYWQgZnJvbSBzYXZlcy5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuI2NvbmZpZy5vdmVycmlkZVNhdmVJZkV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5UmF3U2V0dGluZ3Moc2V0dGluZ3MhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUgPSBjcmVhdGVSZWlmaWVkQWN0aXZlKGNvbXBvbmVudHMhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQuYXR0YWNoKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzID0gY3JlYXRlV2lyaW5nc1NldCh3aXJlcyEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLnNhdmUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFxuICAgICAgICAgICAgICAgICAgICBcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUsXG4gICAgICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIub2JzZXJ2ZShSZWlmaWVkLnJvb3QsIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsXG4gICAgICAgICAgICBjaGFyYWN0ZXJEYXRhT2xkVmFsdWU6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrID0gdGhpcy4jY29uZmlnLmNoZWNrU3RhdGU/LihSZWlmaWVkLmFjdGl2ZS5jbG9uZSgpLCBXaXJpbmdNYW5hZ2VyLndpcmVzLmNsb25lKCkpID8/IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoY2hlY2spIHRoaXMuI2NvbmZpZy5pZlN0YXRlQ2hlY2tlZD8uKCk7XG4gICAgICAgIH0sIHRoaXMuI2NvbmZpZy5jaGVja0ludGVydmFsID8/IDUwKSBhcyBuZXZlcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFudWFsU2F2ZSgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcuc2F2ZSAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcbiAgICAgICAgICAgICAgICBcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUsXG4gICAgICAgICAgICAgICAgc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSxcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICBpZiAodGhpcy4jb2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblxuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuI2ludGVydmFsKTtcblxuICAgICAgICB0aGlzLiNpbnRlcnZhbCA9IC0xO1xuXG4gICAgICAgIE1vdXNlTWFuYWdlci5yZXNldCgpO1xuICAgICAgICBLZXliaW5kc01hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgIFNlbGVjdGlvbk1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgV2lyaW5nTWFuYWdlci5zdG9wKCk7XG5cbiAgICAgICAgRGFya21vZGVNYW5hZ2VyLnN0b3AoKTtcblxuICAgICAgICBNZW51TWFuYWdlci5yZW1vdmUoUmVpZmllZC5yb290KTtcblxuICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmZvckVhY2goKGZpbmlzaCkgPT4gZmluaXNoLmNhbGwodW5kZWZpbmVkKSk7XG5cbiAgICAgICAgdGhpcy53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmNsZWFyKCk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIHRoaXMuI2NvbmZpZyA9IHt9O1xuXG4gICAgICAgIHRoaXMuI2hpc3RvcnkgPSBbXTtcbiAgICAgICAgdGhpcy4jcmVkb3MgPSBbXTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY2xlYXIoKSB7XG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmRldGFjaCgpKTtcblxuICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHdpcmUuZGVzdHJveSgpKTtcblxuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHB1c2hIaXN0b3J5KGNvbW1hbmQ6ICgpID0+IHZvaWQsIHVuZG86ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jcmVkb3MubGVuZ3RoID0gMDtcblxuICAgICAgICBjb21tYW5kLmNhbGwodW5kZWZpbmVkKTtcblxuICAgICAgICB0aGlzLiNoaXN0b3J5LnB1c2goW2NvbW1hbmQsIHVuZG9dKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcG9wSGlzdG9yeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiNoaXN0b3J5Lmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJOb3RoaW5nIHRvIHVuZG8uXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgW3JlZG8sIHVuZG9dID0gdGhpcy4jaGlzdG9yeS5wb3AoKSE7XG5cbiAgICAgICAgdGhpcy4jcmVkb3MucHVzaChbcmVkbywgdW5kb10pO1xuXG4gICAgICAgIHJldHVybiB1bmRvLmNhbGwodW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVkb0hpc3RvcnkoKSB7XG4gICAgICAgIGlmICghdGhpcy4jcmVkb3MubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vdGhpbmcgdG8gcmVkby5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBbY29tbWFuZCwgdW5kb10gPSB0aGlzLiNyZWRvcy5wb3AoKSE7XG5cbiAgICAgICAgdGhpcy4jaGlzdG9yeS5wdXNoKFtjb21tYW5kLCB1bmRvXSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbW1hbmQuY2FsbCh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhcHBseVNldHRpbmdzKHNldHRpbmdzOiBTYW5kYm94Q29uZmlnW1wic2V0dGluZ3NcIl0gJiB7fSkge1xuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuc25hcFRvR3JpZCA9IHNldHRpbmdzLnNuYXBUb0dyaWQgPz8gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIGFwcGx5UmF3U2V0dGluZ3Moc2V0dGluZ3M6IFNlcmlhbGl6ZWREaWFncmFtW1wic2V0dGluZ3NcIl0pIHtcbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnNuYXBUb0dyaWQgPSBzZXR0aW5nc1tcIkRyYWdnaW5nTWFuYWdlci5zbmFwVG9HcmlkXCJdO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBzYXZlVG8oc2F2ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI2NvbmZpZy5zYXZlID0gc2F2ZTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5oYXMoXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlKSAmJlxuICAgICAgICAgICAgIShhd2FpdCBNb2RhbE1hbmFnZXIuY29uZmlybShcbiAgICAgICAgICAgICAgICBcIlRoZXJlIGlzIGFscmVhZHkgYSBzYXZlIHdpdGggdGhpcyBuYW1lLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVwbGFjZSBpdD9cIixcbiAgICAgICAgICAgICkpXG4gICAgICAgIClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLCBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElTX01BQ19PUywgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBmcm9tRmlsZSwgc2F2ZURpYWdyYW0gfSBmcm9tIFwiLi4vZmlsZXNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGlzcGxheSB9IGZyb20gXCIuLi9yZWlmaWVkL0Rpc3BsYXlcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgb3ZlcmxhcHBlZEJvdW5kcywgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgTW91c2VNYW5hZ2VyIH0gZnJvbSBcIi4vTW91c2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9XaXJpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25NYW5hZ2VyIHtcbiAgICBzdGF0aWMgc2VsZWN0ZWQgPSBuZXcgV2F0Y2hlZFNldDxSZWlmaWVkPigpO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBFbGVtZW50O1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBbXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1pbnB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLW91dHB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmRpc3BsYXlcIiksXG4gICAgICAgIF0uZmluZCgoZWxlbWVudCkgPT4gZWxlbWVudCAhPT0gbnVsbCkhO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbmQoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmVsZW1lbnQgPT09IGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChyZWlmaWVkKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKElTX01BQ19PUyAmJiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIk1ldGFMZWZ0XCIpIHx8IEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJNZXRhUmlnaHRcIikpKSB8fFxuICAgICAgICAgICAgICAgICghSVNfTUFDX09TICYmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiQ29udHJvbExlZnRcIikgfHwgS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIkNvbnRyb2xSaWdodFwiKSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3Rpb24ocmVpZmllZCk7XG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5zZWxlY3RlZC5oYXMocmVpZmllZCkpIHRoaXMuc2VsZWN0KHJlaWZpZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjY29weSA9IGFzeW5jIChlOiBDbGlwYm9hcmRFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC5zaXplKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gWy4uLnRoaXMuc2VsZWN0ZWRdO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gc2F2ZURpYWdyYW0oXG4gICAgICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICAgICAgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgKHdpcmluZykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LnNvbWUoKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkgcmV0dXJuIHdpcmluZy5mcm9tID09PSBjb21wb25lbnQuZWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgRGlzcGxheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudC5vdXRwdXRzLnNvbWUoKG91dHB1dCkgPT4gd2lyaW5nLmZyb20gPT09IG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5zb21lKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiB3aXJpbmcudG8gPT09IGNvbXBvbmVudC5lbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBEaXNwbGF5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50LmlucHV0cy5zb21lKChpbnB1dCkgPT4gd2lyaW5nLnRvID09PSBpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChkYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3Bhc3RlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIHJlc3VsdDogWywgY29tcG9uZW50cywgd2lyaW5nc10sXG4gICAgICAgIH0gPSBmcm9tRmlsZShhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCkpO1xuXG4gICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHBhc3RlIGRpYWdyYW0gZGF0YS5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBtb3VzZSA9IHsgLi4uTW91c2VNYW5hZ2VyLm1vdXNlIH07XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGRBbGwoY29tcG9uZW50cyEpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudHMhLmV2ZXJ5KChjb21wb25lbnQpID0+IFJlaWZpZWQuYWN0aXZlLmhhcyhjb21wb25lbnQpKSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjb21wb25lbnQudXBkYXRlKCksIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKE1vdXNlTWFuYWdlci5tb3VzZS54ICE9PSAtMSAmJiBNb3VzZU1hbmFnZXIubW91c2UueSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSBjb21wb25lbnRzIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF4ID0gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF5ID0gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnggPSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnkgPSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhZCA9IE1hdGguc3FydChheCAqIGF4ICsgYXkgKiBheSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJkID0gTWF0aC5zcXJ0KGJ4ICogYnggKyBieSAqIGJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFkIC0gYmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cyEuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IG1vdXNlLnggKyBvZmZzZXQubGVmdCAtIHRvcGxlZnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbW91c2UueSArIG9mZnNldC50b3AgLSB0b3BsZWZ0LnRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwod2lyaW5ncyEpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHRoaXMuYWRkU2VsZWN0aW9uKGNvbXBvbmVudCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlQWxsKGNvbXBvbmVudHMhKTtcblxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMhLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmRlbGV0ZUFsbCh3aXJpbmdzISk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uZm9yRWFjaCgoY29tcG9uZW50KSA9PiB0aGlzLmFkZFNlbGVjdGlvbihjb21wb25lbnQpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBzZWxlY3QocmVpZmllZDogUmVpZmllZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZC5hZGQocmVpZmllZCk7XG5cbiAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiAoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDBcIikpO1xuXG4gICAgICAgIHJlaWZpZWQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMDBcIjtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2VsZWN0QWxsSW4oZnJvbTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9LCB0bzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICBjb25zdCByZWlmaWVkID0gWy4uLlJlaWZpZWQuYWN0aXZlXS5maWx0ZXIoKGNvbXBvbmVudCkgPT5cbiAgICAgICAgICAgIG92ZXJsYXBwZWRCb3VuZHMoY29tcG9uZW50LmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGZyb20sIHRvKSxcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZEFsbChyZWlmaWVkKTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IChjb21wb25lbnQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMFwiKSk7XG5cbiAgICAgICAgcmVpZmllZC5mb3JFYWNoKChjb21wb25lbnQpID0+IChjb21wb25lbnQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMDBcIikpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRTZWxlY3Rpb24ocmVpZmllZDogUmVpZmllZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZChyZWlmaWVkKTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IChjb21wb25lbnQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMFwiKSk7XG5cbiAgICAgICAgcmVpZmllZC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwMFwiO1xuICAgIH1cblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29weVwiLCB0aGlzLiNjb3B5KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIHRoaXMuI3Bhc3RlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVhZmVuKCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgdGhpcy4jY29weSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLCB0aGlzLiNwYXN0ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy5kZWFmZW4oKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU3RvcmFnZU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSBwcmVmaXggPSBcImtlbHNueS5nYXRlc2ltOlwiO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG4gICAgc3RhdGljIHNldDxUPihrZXk6IHN0cmluZywgdmFsdWU6IFQpOiBUIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldEl0ZW0odGhpcy5wcmVmaXggKyBrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQ8VD4oa2V5OiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXggKyBrZXkpISkgPz8gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBoYXMoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMucHJlZml4ICsga2V5KSAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVsZXRlKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSkgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLnByZWZpeCArIGtleSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgREVMQVkgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9XaXJpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXN0aW5nTWFuYWdlciB7XG4gICAgc3RhdGljICN0ZXN0aW5nID0gZmFsc2U7XG5cbiAgICBzdGF0aWMgYXN5bmMgdGVzdChjYXNlczogW2lucHV0czogYm9vbGVhbltdLCBvdXRwdXRzOiBib29sZWFuW11dW10sIHsgdGltZW91dCA9IDEwMDAgfTogeyB0aW1lb3V0PzogbnVtYmVyIH0gPSB7fSkge1xuICAgICAgICBpZiAodGhpcy4jdGVzdGluZykgcmV0dXJuIE1vZGFsTWFuYWdlci5hbGVydChcIkRpYWdyYW0gaXMgYWxyZWFkeSB1bmRlciB0ZXN0aW5nLlwiKTtcblxuICAgICAgICB0aGlzLiN0ZXN0aW5nID0gdHJ1ZTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5sb2NrKCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMubG9jaygpO1xuXG4gICAgICAgIGNvbnN0IGlucHV0cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZV1cbiAgICAgICAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCk6IGNvbXBvbmVudCBpcyBJbnB1dCA9PiBjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApIC0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKSk7XG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBbLi4uUmVpZmllZC5hY3RpdmVdXG4gICAgICAgICAgICAuZmlsdGVyKChjb21wb25lbnQpOiBjb21wb25lbnQgaXMgT3V0cHV0ID0+IGNvbXBvbmVudCBpbnN0YW5jZW9mIE91dHB1dClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApIC0gcGFyc2VGbG9hdChiLmVsZW1lbnQuc3R5bGUudG9wKSk7XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxBY3RpdmF0aW9ucyA9IGlucHV0cy5tYXAoKGlucHV0KSA9PiBpbnB1dC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgbGV0IGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAoY29uc3QgW2dpdmVuSW5wdXRzLCBleHBlY3RlZE91dHB1dHNdIG9mIGNhc2VzKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRzLmxlbmd0aCAhPT0gZ2l2ZW5JbnB1dHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJNaXNtYXRjaGVkIGlucHV0IGxlbmd0aHMuXCIpO1xuICAgICAgICAgICAgaWYgKG91dHB1dHMubGVuZ3RoICE9PSBleHBlY3RlZE91dHB1dHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJNaXNtYXRjaGVkIG91dHB1dCBsZW5ndGhzLlwiKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIGlucHV0XSBvZiBpbnB1dHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGdpdmVuSW5wdXRzW2luZGV4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IERFTEFZKHRpbWVvdXQpO1xuXG4gICAgICAgICAgICBjb25zdCByZWFsT3V0cHV0cyA9IG91dHB1dHMubWFwKChvdXRwdXQpID0+IG91dHB1dC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgICAgIGlmICghcmVhbE91dHB1dHMuZXZlcnkoKG91dCwgaSkgPT4gb3V0ID09PSBleHBlY3RlZE91dHB1dHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IE1vZGFsTWFuYWdlci5hbGVydChcbiAgICAgICAgICAgICAgICAgICAgYERpYWdyYW0gZmFpbGVkIHRvIHBhc3MgdGhlIHRlc3Qgd2l0aCBpbnB1dHMgXCIke2dpdmVuSW5wdXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChib29sZWFuKSA9PiArYm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiIFwiKX1cIi5gLFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgREVMQVkoMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZhaWxlZCkgYXdhaXQgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiRGlhZ3JhbSBwYXNzZWQgYWxsIHRoZSB0ZXN0cy5cIik7XG5cbiAgICAgICAgb3JpZ2luYWxBY3RpdmF0aW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4gaW5wdXRzW2ldLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCB2YWx1ZSkpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLnVubG9jaygpO1xuICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLnVubG9jaygpO1xuXG4gICAgICAgIHRoaXMuI3Rlc3RpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHRlc3RpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiN0ZXN0aW5nO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9hc3REYXRhIHtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgY29sb3I6IHN0cmluZztcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgVG9hc3RNYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0cy1jb250YWluZXJcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyB0b2FzdCh7IG1lc3NhZ2UsIGNvbG9yLCBkdXJhdGlvbiB9OiBUb2FzdERhdGEpIHtcbiAgICAgICAgY29uc3QgdG9hc3QgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0b2FzdC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xvc2UtdG9hc3RcIj7ilbM8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRvYXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0LWNvbG9yXCIpIS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcblxuICAgICAgICB0b2FzdC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGR1cmF0aW9uICsgXCJtc1wiO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRvYXN0KTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0b2FzdC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0b2FzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbG9zZS10b2FzdFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIpO1xuXG4gICAgICAgICAgICB0b2FzdC5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIGhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIEdFVF9DQU5WQVNfQ1RYLCBMSUdIVF9HUkFZX0NTU19DT0xPUiwgTE9DS0VEX0ZPUl9URVNUSU5HIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuL1Rlc3RpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBOZXdXaXJlQ29udGV4dCB7XG4gICAgc3RhdGljIGZyb206IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIHtcbiAgICAgICAgTW91c2VNYW5hZ2VyLm9uTW91c2VEb3duKChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoTmV3V2lyZUNvbnRleHQuZnJvbSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSBlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm9hcmQtb3V0cHV0XCIpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY29tcG9uZW50LWlucHV0LWJ1dHRvblwiKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSBOZXdXaXJlQ29udGV4dC5mcm9tO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkKG5ldyBXaXJpbmcoZnJvbSwgdGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd2lyZSBvZiBXaXJpbmdNYW5hZ2VyLndpcmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBmcm9tICYmIHdpcmUudG8gPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdpcmluZyB7XG4gICAgI2Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgICNvYnNlcnZlcjtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGZyb206IEVsZW1lbnQsIHJlYWRvbmx5IHRvOiBFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFXaXJpbmdNYW5hZ2VyLndpcmVzLmhhcyh0aGlzKSkge1xuICAgICAgICAgICAgICAgIGlmICghWy4uLldpcmluZ01hbmFnZXIud2lyZXNdLnNvbWUoKHdpcmUpID0+IHdpcmUudG8gPT09IHRoaXMudG8pKSB0by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0by5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nbygpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuI2Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH1cblxuICAgIGdvKCkge1xuICAgICAgICB0aGlzLiNkZXN0cm95ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLiNvYnNlcnZlci5vYnNlcnZlKHRoaXMuZnJvbSwgeyBhdHRyaWJ1dGVGaWx0ZXI6IFtcImNsYXNzXCJdLCBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIGdldCBkZXN0cm95ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNkZXN0cm95ZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2lyaW5nTWFuYWdlciB7XG4gICAgc3RhdGljICNyQUYgPSAtMTtcblxuICAgIHN0YXRpYyB3aXJlcyA9IG5ldyBXYXRjaGVkU2V0PFdpcmluZz4oKTtcblxuICAgIHN0YXRpYyB1cGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IEdFVF9DQU5WQVNfQ1RYKCk7XG5cbiAgICAgICAgY3R4LmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBjdHguY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICB0aGlzLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgIGlmICh3aXJlLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndpcmVzLmxvY2tlZCkgd2lyZS5nbygpO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy53aXJlcy5kZWxldGUod2lyZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSB3aXJlLmZyb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCB0byA9IHdpcmUudG8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZXMgPSBbLi4udGhpcy53aXJlc10uZmlsdGVyKCh3KSA9PiB3LnRvID09PSB3aXJlLnRvKTtcblxuICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgICAgICAgICAgIFwiYWN0aXZhdGVkXCIsXG4gICAgICAgICAgICAgICAgc291cmNlcy5zb21lKCh3KSA9PiB3LmZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHdpcmUuZnJvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgPyBBQ1RJVkFURURfQ1NTX0NPTE9SIDogTElHSFRfR1JBWV9DU1NfQ09MT1I7XG5cbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSA1O1xuXG4gICAgICAgICAgICBjdHgubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBjdHgubGluZVRvKHRvLnggKyB0by53aWR0aCAvIDIsIHRvLnkgKyB0by5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKE5ld1dpcmVDb250ZXh0LmZyb20pIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSBOZXdXaXJlQ29udGV4dC5mcm9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBOZXdXaXJlQ29udGV4dC5mcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKVxuICAgICAgICAgICAgICAgID8gQUNUSVZBVEVEX0NTU19DT0xPUlxuICAgICAgICAgICAgICAgIDogTElHSFRfR1JBWV9DU1NfQ09MT1I7XG5cbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSA1O1xuXG4gICAgICAgICAgICBjdHgubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBjdHgubGluZVRvKE1vdXNlTWFuYWdlci5tb3VzZS54LCBNb3VzZU1hbmFnZXIubW91c2UueSk7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54ICE9PSAtMSAmJlxuICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueSAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS54ICE9PSAtMSAmJlxuICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnkgIT09IC0xXG4gICAgICAgICkge1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gQUNUSVZBVEVEX0NTU19DT0xPUjtcblxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDIuNTtcblxuICAgICAgICAgICAgY3R4LmxpbmVKb2luID0gXCJtaXRlclwiO1xuXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdChcbiAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54LFxuICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLnksXG4gICAgICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnggLSBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54LFxuICAgICAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55IC0gRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBBQ1RJVkFURURfQ1NTX0NPTE9SO1xuXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMTtcblxuICAgICAgICAgICAgY3R4LmxpbmVKb2luID0gXCJtaXRlclwiO1xuXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdChyZWN0LmxlZnQgLSAxMCwgcmVjdC50b3AgLSAxMCwgcmVjdC53aWR0aCArIDEwICsgMTAsIHJlY3QuaGVpZ2h0ICsgMTAgKyAxMCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdGFydCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0YXJ0LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuI3JBRiA9IGlkO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wKCkge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLiNyQUYpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi4vY29udGV4dG1lbnUvbWVudVwiO1xuaW1wb3J0IHsga2V5YmluZHMgfSBmcm9tIFwiLi4va2V5YmluZHMva2V5YmluZHNcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmcgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgQW5kR2F0ZSwgT3JHYXRlLCBYb3JHYXRlIH0gZnJvbSBcIi4uL3JlaWZpZWQvY2hpcHNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvT3V0cHV0XCI7XG5cbmV4cG9ydCBjb25zdCBleGFtcGxlOiBSZWNvcmQ8c3RyaW5nLCAoY3R4OiB7IG5hbWU6IHN0cmluZyB9KSA9PiB2b2lkPiA9IHtcbiAgICBcImV4YW1wbGU6aGFsZmFkZGVyXCI6ICh7IG5hbWU6IHNhdmUgfSkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gW1xuICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgWG9yR2F0ZSgpLCB7IHg6IDMwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IEFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNTAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IE91dHB1dCh7IHg6IDUwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgXSBhcyBjb25zdDtcblxuICAgICAgICBjb25zdCBbaTEsIGkyLCB4b3IsIGFuZCwgbzEsIG8yXSA9IGNvbXBvbmVudHM7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoe1xuICAgICAgICAgICAga2V5YmluZHMsXG4gICAgICAgICAgICBtZW51LFxuICAgICAgICAgICAgc2F2ZSxcbiAgICAgICAgICAgIGluaXRpYWw6IFtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLm1hcCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQucGVybWFuZW50KCkpLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMS5lbGVtZW50LCB4b3IuaW5wdXRzWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMS5lbGVtZW50LCBhbmQuaW5wdXRzWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMi5lbGVtZW50LCB4b3IuaW5wdXRzWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMi5lbGVtZW50LCBhbmQuaW5wdXRzWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyh4b3Iub3V0cHV0c1swXSwgbzEuZWxlbWVudCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoYW5kLm91dHB1dHNbMF0sIG8yLmVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbGltaXRzOiB7XG4gICAgICAgICAgICAgICAgaW5wdXRzOiAyLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IDIsXG4gICAgICAgICAgICAgICAgY2hpcHNUb3RhbDogMixcbiAgICAgICAgICAgICAgICB3aXJpbmdzOiA2LFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHNUb3RhbDogNixcbiAgICAgICAgICAgICAgICBjaGlwczogeyBBTkQ6IDEsIFhPUjogMSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBcImV4YW1wbGU6ZnVsbGFkZGVyXCI6ICh7IG5hbWU6IHNhdmUgfSkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gW1xuICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAzMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgWG9yR2F0ZSgpLCB7IHg6IDI1MCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IEFuZEdhdGUoKSwgeyB4OiAyNTAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBBbmRHYXRlKCksIHsgeDogMjUwLCB5OiAzMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgWG9yR2F0ZSgpLCB7IHg6IDQwMCwgeTogMTUwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE9yR2F0ZSgpLCB7IHg6IDQwMCwgeTogMjUwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG5ldyBPdXRwdXQoeyB4OiA1NTAsIHk6IDE1MCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNTUwLCB5OiAyNTAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICBdIGFzIGNvbnN0O1xuXG4gICAgICAgIGNvbnN0IFtpMSwgaTIsIGkzLCB4b3IxLCBhbmQxLCBhbmQyLCB4b3IyLCBvciwgbzEsIG8yXSA9IGNvbXBvbmVudHM7XG5cbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoe1xuICAgICAgICAgICAga2V5YmluZHMsXG4gICAgICAgICAgICBtZW51LFxuICAgICAgICAgICAgc2F2ZSxcbiAgICAgICAgICAgIGluaXRpYWw6IFtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLm1hcCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQucGVybWFuZW50KCkpLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMS5lbGVtZW50LCB4b3IxLmlucHV0c1swXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTEuZWxlbWVudCwgYW5kMi5pbnB1dHNbMF0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkyLmVsZW1lbnQsIHhvcjEuaW5wdXRzWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhpMi5lbGVtZW50LCBhbmQyLmlucHV0c1sxXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoaTMuZWxlbWVudCwgYW5kMS5pbnB1dHNbMV0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKGkzLmVsZW1lbnQsIHhvcjIuaW5wdXRzWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyh4b3IxLm91dHB1dHNbMF0sIGFuZDEuaW5wdXRzWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyh4b3IxLm91dHB1dHNbMF0sIHhvcjIuaW5wdXRzWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdpcmluZyhhbmQxLm91dHB1dHNbMF0sIG9yLmlucHV0c1swXSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcoYW5kMi5vdXRwdXRzWzBdLCBvci5pbnB1dHNbMV0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgV2lyaW5nKHhvcjIub3V0cHV0c1swXSwgbzEuZWxlbWVudCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXaXJpbmcob3Iub3V0cHV0c1swXSwgbzIuZWxlbWVudCksXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBpbnB1dHM6IDMsXG4gICAgICAgICAgICAgICAgb3V0cHV0czogMixcbiAgICAgICAgICAgICAgICBjaGlwc1RvdGFsOiA1LFxuICAgICAgICAgICAgICAgIHdpcmluZ3M6IDEyLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHNUb3RhbDogMTAsXG4gICAgICAgICAgICAgICAgY2hpcHM6IHsgQU5EOiAyLCBYT1I6IDIsIE9SOiAxIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9LFxufTtcbiIsImltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi4vY29udGV4dG1lbnUvbWVudVwiO1xuaW1wb3J0IHsga2V5YmluZHMgfSBmcm9tIFwiLi4va2V5YmluZHMva2V5YmluZHNcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBleGFtcGxlIH0gZnJvbSBcIi4vZXhhbXBsZVwiO1xuaW1wb3J0IHsgbmFuZCB9IGZyb20gXCIuL25hbmRcIjtcblxuZXhwb3J0IGNvbnN0IHByZW1hZGUgPSBuZXcgTWFwPHN0cmluZywgKGN0eDogeyBuYW1lOiBzdHJpbmcgfSkgPT4gdm9pZD4oW1xuICAgIC4uLk9iamVjdC5lbnRyaWVzKGV4YW1wbGUpLFxuICAgIFtcInNhbmRib3hcIiwgKCkgPT4gU2FuZGJveE1hbmFnZXIuc2V0dXAoeyBrZXliaW5kcywgbWVudSwgc2F2ZTogXCJzYW5kYm94XCIgfSldLFxuICAgIC4uLk9iamVjdC5lbnRyaWVzKG5hbmQpLFxuXSk7XG4iLCJpbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4uL2NvbnRleHRtZW51L21lbnVcIjtcbmltcG9ydCB7IGtleWJpbmRzIH0gZnJvbSBcIi4uL2tleWJpbmRzL2tleWJpbmRzXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IE5hbmRHYXRlIH0gZnJvbSBcIi4uL3JlaWZpZWQvY2hpcHNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvT3V0cHV0XCI7XG5cbmV4cG9ydCBjb25zdCBuYW5kOiBSZWNvcmQ8c3RyaW5nLCAoY3R4OiB7IG5hbWU6IHN0cmluZyB9KSA9PiB2b2lkPiA9IHtcbiAgICBcIm5hbmQ6bm90XCI6ICh7IG5hbWU6IHNhdmUgfSkgPT4ge1xuICAgICAgICBtZW51LnNwbGljZSgyLCAwLCB7XG4gICAgICAgICAgICB0ZXN0OiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCBzb2x1dGlvblwiLFxuICAgICAgICAgICAgICAgIGFzeW5jIGNhbGxiYWNrKCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBUZXN0aW5nTWFuYWdlci50ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbZmFsc2VdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGltZW91dDogNTAwIH0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHtcbiAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgIHNhdmUsXG4gICAgICAgICAgICBpbml0aWFsOiBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNTAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgIF0ubWFwKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5wZXJtYW5lbnQoKSksXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbGltaXRzOiB7XG4gICAgICAgICAgICAgICAgaW5wdXRzOiAxLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IDEsXG4gICAgICAgICAgICAgICAgY2hpcHNUb3RhbDogMSxcbiAgICAgICAgICAgICAgICB3aXJpbmdzOiAzLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHNUb3RhbDogMyxcbiAgICAgICAgICAgICAgICBjaGlwczogeyBOQU5EOiAxIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBNb2RhbE1hbmFnZXIuYWxlcnQoXCJSZWNyZWF0ZSBhIE5PVCBnYXRlIHVzaW5nIG9ubHkgYSBOQU5EIGdhdGUuXCIpO1xuICAgIH0sXG4gICAgXCJuYW5kOmFuZFwiOiAoeyBuYW1lOiBzYXZlIH0pID0+IHtcbiAgICAgICAgbWVudS5zcGxpY2UoMiwgMCwge1xuICAgICAgICAgICAgdGVzdDoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3Qgc29sdXRpb25cIixcbiAgICAgICAgICAgICAgICBhc3luYyBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgVGVzdGluZ01hbmFnZXIudGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCBmYWxzZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZSwgZmFsc2VdLCBbZmFsc2VdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCB0cnVlXSwgW2ZhbHNlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1t0cnVlLCB0cnVlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRpbWVvdXQ6IDc1MCB9LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICBrZXliaW5kcyxcbiAgICAgICAgICAgIG1lbnUsXG4gICAgICAgICAgICBzYXZlLFxuICAgICAgICAgICAgaW5pdGlhbDogW1xuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAxMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IE91dHB1dCh7IHg6IDUwMCwgeTogMTUwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICBdLm1hcCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQucGVybWFuZW50KCkpLFxuICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGxpbWl0czoge1xuICAgICAgICAgICAgICAgIGlucHV0czogMixcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiAxLFxuICAgICAgICAgICAgICAgIGNoaXBzVG90YWw6IDIsXG4gICAgICAgICAgICAgICAgd2lyaW5nczogNSxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzVG90YWw6IDUsXG4gICAgICAgICAgICAgICAgY2hpcHM6IHsgTkFORDogMiB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiUmVjcmVhdGUgYW4gQU5EIGdhdGUgdXNpbmcgb25seSBOQU5EIGdhdGVzLlwiKTtcbiAgICB9LFxuICAgIFwibmFuZDpvclwiOiAoeyBuYW1lOiBzYXZlIH0pID0+IHtcbiAgICAgICAgbWVudS5zcGxpY2UoMiwgMCwge1xuICAgICAgICAgICAgdGVzdDoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3Qgc29sdXRpb25cIixcbiAgICAgICAgICAgICAgICBhc3luYyBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgVGVzdGluZ01hbmFnZXIudGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCBmYWxzZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZSwgZmFsc2VdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbZmFsc2UsIHRydWVdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZSwgdHJ1ZV0sIFt0cnVlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0aW1lb3V0OiAxMDAwIH0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHtcbiAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgIHNhdmUsXG4gICAgICAgICAgICBpbml0aWFsOiBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAxNTAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IE91dHB1dCh7IHg6IDYwMCwgeTogMTUwIH0pLFxuICAgICAgICAgICAgICAgIF0ubWFwKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5wZXJtYW5lbnQoKSksXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbGltaXRzOiB7XG4gICAgICAgICAgICAgICAgaW5wdXRzOiAyLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IDEsXG4gICAgICAgICAgICAgICAgY2hpcHNUb3RhbDogMyxcbiAgICAgICAgICAgICAgICB3aXJpbmdzOiA3LFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHNUb3RhbDogNixcbiAgICAgICAgICAgICAgICBjaGlwczogeyBOQU5EOiAzIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBNb2RhbE1hbmFnZXIuYWxlcnQoXCJSZWNyZWF0ZSBhbiBPUiBnYXRlIHVzaW5nIG9ubHkgTkFORCBnYXRlcy5cIik7XG4gICAgfSxcbiAgICBcIm5hbmQ6eG9yXCI6ICh7IG5hbWU6IHNhdmUgfSkgPT4ge1xuICAgICAgICBtZW51LnNwbGljZSgyLCAwLCB7XG4gICAgICAgICAgICB0ZXN0OiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCBzb2x1dGlvblwiLFxuICAgICAgICAgICAgICAgIGFzeW5jIGNhbGxiYWNrKCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBUZXN0aW5nTWFuYWdlci50ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbZmFsc2UsIGZhbHNlXSwgW2ZhbHNlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1t0cnVlLCBmYWxzZV0sIFt0cnVlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1tmYWxzZSwgdHJ1ZV0sIFt0cnVlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1t0cnVlLCB0cnVlXSwgW2ZhbHNlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0aW1lb3V0OiAxMjUwIH0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHtcbiAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgIHNhdmUsXG4gICAgICAgICAgICBpbml0aWFsOiBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMjAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDEwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAyMDAsIGNlbnRlcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDUwMCwgeTogMTAwLCBjZW50ZXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiA1MDAsIHk6IDIwMCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBPdXRwdXQoeyB4OiA3MDAsIHk6IDE1MCwgY2VudGVyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgXS5tYXAoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LnBlcm1hbmVudCgpKSxcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBpbnB1dHM6IDIsXG4gICAgICAgICAgICAgICAgb3V0cHV0czogMSxcbiAgICAgICAgICAgICAgICBjaGlwc1RvdGFsOiA0LFxuICAgICAgICAgICAgICAgIHdpcmluZ3M6IDksXG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1RvdGFsOiA4LFxuICAgICAgICAgICAgICAgIGNoaXBzOiB7IE5BTkQ6IDQgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE1vZGFsTWFuYWdlci5hbGVydChcIlJlY3JlYXRlIGEgWE9SIGdhdGUgdXNpbmcgb25seSBOQU5EIGdhdGVzLlwiKTtcbiAgICB9LFxufTtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIERFTEFZLCBJU19NQUNfT1MsIExPQ0tFRF9GT1JfVEVTVElORywgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IE5ld1dpcmVDb250ZXh0LCBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgQ2hpcCB9IGZyb20gXCIuL2NoaXBzXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50PEkgZXh0ZW5kcyBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXI+IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIHJlYWRvbmx5IGlucHV0cztcbiAgICByZWFkb25seSBvdXRwdXRzO1xuICAgIHJlYWRvbmx5IG5hbWU7XG5cbiAgICByZWFkb25seSAjb2JzZXJ2ZXJzID0gbmV3IE1hcDxFbGVtZW50LCBNdXRhdGlvbk9ic2VydmVyPigpO1xuICAgIHJlYWRvbmx5ICNtb3VzZXVwcyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY29udGV4dG1lbnVzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuICAgIHJlYWRvbmx5ICNjbGlja3MgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG5cbiAgICByZWFkb25seSBjaGlwOiBDaGlwPEksIE8+O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGNoaXA6IENoaXA8SSwgTz4sXG4gICAgICAgIHBvczpcbiAgICAgICAgICAgIHwgeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH1cbiAgICAgICAgICAgIHwgKChjb21wOiBDb21wb25lbnQ8SSwgTz4pID0+IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IGNlbnRlcmVkPzogYm9vbGVhbiB9KSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNoaXAgPSBjaGlwO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dHNcIj5cbiAgICAgICAgICAgICAgICAgICAgJHtBcnJheSh0aGlzLmNoaXAuaW5wdXRzKS5maWxsKCc8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LWlucHV0LWJ1dHRvblwiPkk8L2J1dHRvbj4nKS5qb2luKFwiXCIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiY29tcG9uZW50LW5hbWVcIj4ke3RoaXMuY2hpcC5uYW1lfTwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LW91dHB1dHNcIj5cbiAgICAgICAgICAgICAgICAgICAgJHtBcnJheSh0aGlzLmNoaXAub3V0cHV0cykuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCI+TzwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmlucHV0cyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1pbnB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLm91dHB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiKSk7XG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtbmFtZVwiKSE7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5zZXQoaW5wdXQsIG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudXBkYXRlLmJpbmQodGhpcykpKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2V1cHMuc2V0KGlucHV0LCAoKSA9PiBpbnB1dC5ibHVyKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KGlucHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KCgpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgaW5wdXQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQob3V0cHV0LCAoKSA9PiBvdXRwdXQuYmx1cigpKTtcblxuICAgICAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNyZWF0ZS1jb25uZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDcmVhdGUgY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IFwiUVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IG91dHB1dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgodG8pID0+IG5ldyBXaXJpbmcob3V0cHV0LCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NsaWNrcy5zZXQob3V0cHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJLZXlRXCIpKSBOZXdXaXJlQ29udGV4dC5mcm9tID0gb3V0cHV0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQodGhpcy5uYW1lLCAoKSA9PiB7XG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29tcG9uZW50XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4oyYIFhcIiA6IFwiQ3RybCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBFUk1BTkVOVClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBjb21wb25lbnQgaXMgcGVybWFuZW50IGFuZCBjYW5ub3QgYmUgZGVsZXRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGUoKSwgMCk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHR5cGVvZiBwb3MgPT09IFwiZnVuY3Rpb25cIiA/IHBvcy5jYWxsKHVuZGVmaW5lZCwgdGhpcykgOiBwb3MpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3Qgb3V0ID0gdGhpcy5jaGlwLmV2YWx1YXRlKHRoaXMuaW5wdXRzLm1hcCgoaSkgPT4gaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpKTtcblxuICAgICAgICBhd2FpdCBERUxBWSgxMDAgKyBNYXRoLnJhbmRvbSgpICogNTAgLSAyNSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCwgaSkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgb3V0W2ldKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmdldChpbnB1dCkhLm9ic2VydmUoaW5wdXQsIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cHMuZ2V0KGlucHV0KSEpO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChpbnB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXBzLmdldChvdXRwdXQpISk7XG5cbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChvdXRwdXQpISk7XG5cbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jY2xpY2tzLmdldChvdXRwdXQpISk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubmFtZS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLm5hbWUpISk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCwgdGhpcy5uYW1lKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHN1cGVyLmRldGFjaCgpO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVycy5mb3JFYWNoKChvKSA9PiBvLmRpc2Nvbm5lY3QoKSk7XG5cbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy4jY2xpY2tzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMubmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLm5hbWUpISk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIERFTEFZLCBJU19NQUNfT1MsIExPQ0tFRF9GT1JfVEVTVElORywgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IE5ld1dpcmVDb250ZXh0LCBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNsYXNzIERpc3BsYXkgZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgcmVhZG9ubHkgaW5wdXRzO1xuICAgIHJlYWRvbmx5IG91dHB1dHM7XG4gICAgcmVhZG9ubHkgZGlzcGxheTtcblxuICAgIHJlYWRvbmx5ICNvYnNlcnZlcnMgPSBuZXcgTWFwPEVsZW1lbnQsIE11dGF0aW9uT2JzZXJ2ZXI+KCk7XG4gICAgcmVhZG9ubHkgI21vdXNldXBzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuICAgIHJlYWRvbmx5ICNjb250ZXh0bWVudXMgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG4gICAgcmVhZG9ubHkgI2NsaWNrcyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcblxuICAgICNiaXRzO1xuICAgICNyYWRpeDtcblxuICAgIGNvbnN0cnVjdG9yKHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH0gPSB7IHg6IDAsIHk6IDAgfSwgYml0cyA9IDEsIHJhZGl4ID0gMTApIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLiNiaXRzID0gYml0cztcbiAgICAgICAgdGhpcy4jcmFkaXggPSByYWRpeDtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpc3BsYXlcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KGJpdHMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJkaXNwbGF5LWNvbnRlbnRcIj4wPC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KGJpdHMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiPk88L2J1dHRvbj4nKS5qb2luKFwiXCIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXQtYnV0dG9uXCIpKTtcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW91dHB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuZGlzcGxheS1jb250ZW50XCIpITtcblxuICAgICAgICB0aGlzLiN1cGRhdGVMaXN0ZW5lcnMoKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlKCksIDApO1xuXG4gICAgICAgIHRoaXMubW92ZShwb3MpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3Qgb3V0ID0gdGhpcy5pbnB1dHMubWFwKChpKSA9PiBpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgYXdhaXQgREVMQVkoMTAwICsgTWF0aC5yYW5kb20oKSAqIDUwIC0gMjUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0Q29udGVudCA9IG91dFxuICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYiwgaSwgbikgPT4gYSArICtiICogMiAqKiAobi5sZW5ndGggLSBpIC0gMSksIDApXG4gICAgICAgICAgICAudG9TdHJpbmcodGhpcy4jcmFkaXgpO1xuXG4gICAgICAgIFsuLi50aGlzLm91dHB1dHNdLnJldmVyc2UoKS5mb3JFYWNoKChvdXRwdXQsIGkpID0+IHtcbiAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIG91dFtpXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgc3VwZXIuYXR0YWNoKCk7XG5cbiAgICAgICAgdGhpcy4jbWFrZUxpc3RlbmVycygpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQsIHRoaXMuZGlzcGxheSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgICN1cGRhdGVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVycy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLnNldChpbnB1dCwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGUuYmluZCh0aGlzKSkpO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQoaW5wdXQsICgpID0+IGlucHV0LmJsdXIoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQoaW5wdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoZnJvbSkgPT4gbmV3IFdpcmluZyhmcm9tLCBpbnB1dCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI21vdXNldXBzLnNldChvdXRwdXQsICgpID0+IG91dHB1dC5ibHVyKCkpO1xuXG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KG91dHB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY3JlYXRlLWNvbm5lY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogXCJRXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOZXdXaXJlQ29udGV4dC5mcm9tID0gb3V0cHV0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IG91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUudG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKCh0bykgPT4gbmV3IFdpcmluZyhvdXRwdXQsIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy4jY2xpY2tzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIktleVFcIikpIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldCh0aGlzLmRpc3BsYXksICgpID0+IHtcbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInNldC1iaXRzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlNldCBiaXRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIkVudGVyIHRoZSBudW1iZXIgb2YgYml0czpcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlucHV0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiaXRzID0gK2lucHV0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc05hTihiaXRzKSB8fCAhTnVtYmVyLmlzSW50ZWdlcihiaXRzKSB8fCBiaXRzIDwgMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk51bWJlciBvZiBiaXRzIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuI2JpdHMgPT09IGJpdHMpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy4jYml0cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IFtmcm9tOiBFbGVtZW50LCB0bzogRWxlbWVudF1bXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXRzID0gWy4uLnRoaXMuaW5wdXRzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXRzID0gWy4uLnRoaXMub3V0cHV0c107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2JpdHMgPSBiaXRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNkZXN0cm95TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkucmVtb3ZlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG8pID0+IG8ucmVtb3ZlKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zcGxpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uQXJyYXkoYml0cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbGwodW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKCgpID0+IGh0bWxgPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dC1idXR0b25cIj5JPC9idXR0b24+YCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc3BsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5BcnJheShiaXRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsbCh1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKCkgPT4gaHRtbGA8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LW91dHB1dC1idXR0b25cIj5PPC9idXR0b24+YCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpYyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXRzXCIpITtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9jID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXRzXCIpITtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaWMuYXBwZW5kQ2hpbGQoaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG8pID0+IG9jLmFwcGVuZENoaWxkKG8pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI21ha2VMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIubWFudWFsU2F2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNiaXRzID0gcHJldmlvdXM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2Rlc3Ryb3lMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5yZW1vdmUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgobykgPT4gby5yZW1vdmUoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNwbGljZSgwLCB0aGlzLmlucHV0cy5sZW5ndGgsIC4uLmlucHV0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc3BsaWNlKDAsIHRoaXMub3V0cHV0cy5sZW5ndGgsIC4uLm91dHB1dHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpYyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXRzXCIpITtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9jID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXRzXCIpITtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaWMuYXBwZW5kQ2hpbGQoaSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG8pID0+IG9jLmFwcGVuZENoaWxkKG8pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI21ha2VMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIubWFudWFsU2F2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInNldC1yYWRpeFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTZXQgcmFkaXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiRW50ZXIgdGhlIG51bWJlciBvZiBiaXRzOlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5wdXQpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhZGl4ID0gK2lucHV0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc05hTihyYWRpeCkgfHwgIU51bWJlci5pc0ludGVnZXIocmFkaXgpIHx8IHJhZGl4IDwgMSB8fCByYWRpeCA+IDE2KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRGlzcGxheSByYWRpeCBtdXN0IGJlIGFuIGludGVnZXIgZnJvbSAxIHRvIDE2LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogVE9BU1RfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLiNyYWRpeDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jcmFkaXggPSByYWRpeDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIubWFudWFsU2F2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNyYWRpeCA9IHByZXZpb3VzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5tYW51YWxTYXZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbXBvbmVudFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29tcG9uZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBYXCIgOiBcIkN0cmwgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoaXMgY29tcG9uZW50IGlzIHBlcm1hbmVudCBhbmQgY2Fubm90IGJlIGRlbGV0ZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZSh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaSkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChbZnJvbSwgdG9dKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRvKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWJpbmQ6IElTX01BQ19PUyA/IFwi4qyGIOKMmCBYXCIgOiBcIkN0cmwgU2hpZnQgWFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAjbWFrZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5nZXQoaW5wdXQpIS5vYnNlcnZlKGlucHV0LCB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcImNsYXNzXCJdLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXBzLmdldChpbnB1dCkhKTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQoaW5wdXQpISk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwcy5nZXQob3V0cHV0KSEpO1xuXG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQob3V0cHV0KSEpO1xuXG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrcy5nZXQob3V0cHV0KSEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQodGhpcy5kaXNwbGF5KSEpO1xuICAgIH1cblxuICAgICNkZXN0cm95TGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLiNvYnNlcnZlcnMuZm9yRWFjaCgobykgPT4gby5kaXNjb25uZWN0KCkpO1xuXG4gICAgICAgIHRoaXMuI21vdXNldXBzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMuI2NsaWNrcy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQodGhpcy5kaXNwbGF5KSEpO1xuICAgIH1cblxuICAgIGdldCBiaXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jYml0cztcbiAgICB9XG5cbiAgICBnZXQgcmFkaXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNyYWRpeDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBJU19NQUNfT1MsIExPQ0tFRF9GT1JfVEVTVElORywgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IE5ld1dpcmVDb250ZXh0LCBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNsYXNzIElucHV0IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH0gPSB7IHg6IDAsIHk6IDAgfSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGh0bWxgPGJ1dHRvbiBjbGFzcz1cImJvYXJkLWlucHV0XCI+STwvYnV0dG9uPmA7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHBvcyk7XG4gICAgfVxuXG4gICAgcmVhZG9ubHkgI21vdXNldXAgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5ibHVyKCk7XG4gICAgfTtcblxuICAgIHJlYWRvbmx5ICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC54ID0gZS5jbGllbnRYLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnkgPSBlLmNsaWVudFkudG9TdHJpbmcoKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI2NsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJLZXlRXCIpKSByZXR1cm4gKE5ld1dpcmVDb250ZXh0LmZyb20gPSB0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChNYXRoLmh5cG90KGUuY2xpZW50WCAtICt0aGlzLmVsZW1lbnQuZGF0YXNldC54ISwgZS5jbGllbnRZIC0gK3RoaXMuZWxlbWVudC5kYXRhc2V0LnkhKSA+IDIpIHJldHVybjtcblxuICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsICFhY3RpdmUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBhY3RpdmUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51ID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKCkgPT4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY3JlYXRlLWNvbm5lY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDcmVhdGUgY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBcIlFcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1pbnB1dFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBpbnB1dFwiLFxuICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBYXCIgOiBcIkN0cmwgWFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUEVSTUFORU5UKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBpbnB1dCBpcyBwZXJtYW5lbnQgYW5kIGNhbm5vdCBiZSBkZWxldGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IFRPQVNUX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgodG8pID0+IG5ldyBXaXJpbmcodGhpcy5lbGVtZW50LCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAga2V5YmluZDogSVNfTUFDX09TID8gXCLirIYg4oyYIFhcIiA6IFwiQ3RybCBTaGlmdCBYXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgodG8pID0+IG5ldyBXaXJpbmcodGhpcy5lbGVtZW50LCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdKTtcbiAgICB9O1xuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jY2xpY2spO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51KTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIud2F0Y2godGhpcy5lbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHN1cGVyLmRldGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLiNjbGljayk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5mb3JnZXQodGhpcy5lbGVtZW50LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBJU19NQUNfT1MsIExPQ0tFRF9GT1JfVEVTVElORywgVE9BU1RfRFVSQVRJT04gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgT3V0cHV0IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIHJlYWRvbmx5ICNtb3VzZXVwID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYmx1cigpO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY29udGV4dG1lbnUgPSAoKSA9PiB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgoKSA9PiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJkZWxldGUtb3V0cHV0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIG91dHB1dFwiLFxuICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKMmCBYXCIgOiBcIkN0cmwgWFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUEVSTUFORU5UKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBvdXRwdXQgaXMgcGVybWFuZW50IGFuZCBjYW5ub3QgYmUgZGVsZXRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT0FTVF9EVVJBVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZSh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKHdpcmUuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgdGhpcy5lbGVtZW50KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICBrZXliaW5kOiBJU19NQUNfT1MgPyBcIuKshiDijJggWFwiIDogXCJDdHJsIFNoaWZ0IFhcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChmcm9tKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRoaXMuZWxlbWVudCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdKTtcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBjZW50ZXJlZD86IGJvb2xlYW4gfSA9IHsgeDogMCwgeTogMCB9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGA8YnV0dG9uIGNsYXNzPVwiYm9hcmQtb3V0cHV0XCI+TzwvYnV0dG9uPmA7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHBvcyk7XG4gICAgfVxuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgc3VwZXIuZGV0YWNoKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51KTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZm9yZ2V0KHRoaXMuZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQgeyBTQ1VGRkVEX1VVSUQgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBodG1sKHRlbXBsYXRlOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udmFsdWVzOiB1bmtub3duW10pOiBIVE1MRWxlbWVudDtcbmV4cG9ydCBmdW5jdGlvbiBodG1sKGh0bWw6IHN0cmluZyk6IEhUTUxFbGVtZW50O1xuZXhwb3J0IGZ1bmN0aW9uIGh0bWwoLi4uYXJnczogW3N0cmluZ10gfCBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnVua25vd25bXV0pIHtcbiAgICBjb25zdCBbdGVtcGxhdGUsIC4uLnZhbHVlc10gPSBhcmdzO1xuXG4gICAgY29uc3QgaHRtbCA9XG4gICAgICAgIHR5cGVvZiB0ZW1wbGF0ZSA9PT0gXCJzdHJpbmdcIiA/IHRlbXBsYXRlIDogdGVtcGxhdGUucmVkdWNlKChodG1sLCB0ZXh0LCBpKSA9PiBodG1sICsgdGV4dCArIHZhbHVlc1tpXSA/PyBcIlwiLCBcIlwiKTtcblxuICAgIHJldHVybiBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGh0bWwsIFwidGV4dC9odG1sXCIpLmJvZHkuY2hpbGROb2Rlc1swXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNzcyh0ZW1wbGF0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnZhbHVlczogdW5rbm93bltdKTogc3RyaW5nO1xuZXhwb3J0IGZ1bmN0aW9uIGNzcyhjc3M6IHN0cmluZyk6IHN0cmluZztcbmV4cG9ydCBmdW5jdGlvbiBjc3MoLi4uYXJnczogW3N0cmluZ10gfCBbVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnVua25vd25bXV0pIHtcbiAgICBjb25zdCBbdGVtcGxhdGUsIC4uLnZhbHVlc10gPSBhcmdzO1xuXG4gICAgY29uc3QgY3NzID1cbiAgICAgICAgdHlwZW9mIHRlbXBsYXRlID09PSBcInN0cmluZ1wiID8gdGVtcGxhdGUgOiB0ZW1wbGF0ZS5yZWR1Y2UoKGh0bWwsIHRleHQsIGkpID0+IGh0bWwgKyB0ZXh0ICsgdmFsdWVzW2ldID8/IFwiXCIsIFwiXCIpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgY3NzXG4gICAgICAgICAgICAubWF0Y2goL14uKlxcJi4qXFx7KD88Y3NzPi4rKVxcfS4qJC9zKVxuICAgICAgICAgICAgPy5ncm91cHM/LmNzcy50cmltKClcbiAgICAgICAgICAgIC5zcGxpdChcIlxcblwiKVxuICAgICAgICAgICAgLm1hcCgobGluZSkgPT4gbGluZS50cmltKCkpXG4gICAgICAgICAgICAuam9pbihcIiBcIikgPz8gY3NzXG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG92ZXJsYXBwZWRCb3VuZHMocmVjdDogRE9NUmVjdCwgZnJvbTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9LCB0bzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSB7XG4gICAgY29uc3QgYm91bmRzID0ge1xuICAgICAgICB4OiBNYXRoLm1pbihmcm9tLngsIHRvLngpLFxuICAgICAgICB5OiBNYXRoLm1pbihmcm9tLnksIHRvLnkpLFxuICAgICAgICB3aWR0aDogTWF0aC5hYnMoZnJvbS54IC0gdG8ueCksXG4gICAgICAgIGhlaWdodDogTWF0aC5hYnMoZnJvbS55IC0gdG8ueSksXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIHJlY3QueCA8PSBib3VuZHMueCArIGJvdW5kcy53aWR0aCAmJlxuICAgICAgICByZWN0LnggKyByZWN0LndpZHRoID49IGJvdW5kcy54ICYmXG4gICAgICAgIHJlY3QueSA8PSBib3VuZHMueSArIGJvdW5kcy5oZWlnaHQgJiZcbiAgICAgICAgcmVjdC55ICsgcmVjdC5oZWlnaHQgPj0gYm91bmRzLnlcbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJldmVudERlZmF1bHQoZTogRXZlbnQpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSB1dWlkID0gU0NVRkZFRF9VVUlEKCk7XG5cbiAgICBwcm90ZWN0ZWQgUEVSTUFORU5UID0gZmFsc2U7XG5cbiAgICBzdGF0aWMgYWN0aXZlID0gbmV3IFdhdGNoZWRTZXQ8UmVpZmllZD4oKTtcblxuICAgIHN0YXRpYyBnZXQgcm9vdCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnJlaWZpZWQtcm9vdFwiKSE7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgcmVhZG9ubHkgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgICBtb3ZlKHsgeCwgeSwgY2VudGVyZWQgfTogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgY2VudGVyZWQ/OiBib29sZWFuIH0pIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSB4ICsgXCJweFwiO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0geSArIFwicHhcIjtcblxuICAgICAgICBpZiAoY2VudGVyZWQpXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRvcCwgbGVmdCwgd2lkdGgsIGhlaWdodCB9ID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChsZWZ0KSAtIHBhcnNlRmxvYXQod2lkdGgpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdCh0b3ApIC0gcGFyc2VGbG9hdChoZWlnaHQpIC8gMixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgUmVpZmllZC5yb290LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGVybWFuZW50KCkge1xuICAgICAgICB0aGlzLlBFUk1BTkVOVCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IHBlcm1hbmVuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlBFUk1BTkVOVDtcbiAgICB9XG5cbiAgICBnZXQgcG9zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcGFyc2VGbG9hdCh0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICB5OiBwYXJzZUZsb2F0KHRoaXMuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsInR5cGUgQm9vbGVhblR1cGxlPEwgZXh0ZW5kcyBudW1iZXIsIFIgZXh0ZW5kcyBib29sZWFuW10gPSBbXT4gPSBudW1iZXIgZXh0ZW5kcyBMXG4gICAgPyBib29sZWFuW11cbiAgICA6IFJbXCJsZW5ndGhcIl0gZXh0ZW5kcyBMXG4gICAgPyBSXG4gICAgOiBCb29sZWFuVHVwbGU8TCwgWy4uLlIsIGJvb2xlYW5dPjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENoaXA8SSBleHRlbmRzIG51bWJlciwgTyBleHRlbmRzIG51bWJlcj4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FOiBzdHJpbmc7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUzogbnVtYmVyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTOiBudW1iZXI7XG5cbiAgICByZWFkb25seSBuYW1lO1xuXG4gICAgcmVhZG9ubHkgaW5wdXRzO1xuICAgIHJlYWRvbmx5IG91dHB1dHM7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGlucHV0czogSSwgb3V0cHV0czogTykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmlucHV0cyA9IGlucHV0cztcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gb3V0cHV0cztcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBvdXRwdXQoaW5wdXRzOiBCb29sZWFuVHVwbGU8ST4pOiBCb29sZWFuVHVwbGU8Tz47XG5cbiAgICBldmFsdWF0ZShpbnB1dHM6IGJvb2xlYW5bXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vdXRwdXQoaW5wdXRzIGFzIEJvb2xlYW5UdXBsZTxJLCBbXT4pIGFzIGJvb2xlYW5bXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBbmRHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkFORFwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkFORFwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gW2EgJiYgYl07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgT3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk9SXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFthIHx8IGJdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vdEdhdGUgZXh0ZW5kcyBDaGlwPDEsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiTk9UXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDE7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiTk9UXCIsIDEsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbbl06IFtib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbIW5dO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5hbmRHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk5BTkRcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJOQU5EXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbIShhICYmIGIpXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk5PUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk5PUlwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyEoYSB8fCBiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgWG9yR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJYT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJYT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshISgrYSBeICtiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgWG5vckdhdGUgZXh0ZW5kcyBDaGlwPDIsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiWE5PUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlhOT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshKCthIF4gK2IpXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCdWZmZXJHYXRlIGV4dGVuZHMgQ2hpcDwxLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkJVRkZFUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAxO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkJVRkZFUlwiLCAxLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW25dOiBbYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gW25dO1xuICAgIH1cbn1cblxudHlwZSBTdGF0aWNNZW1iZXJzPFQ+ID0geyBbSyBpbiBrZXlvZiBUXTogVFtLXSB9O1xudHlwZSBFeHRlbmRlZENoaXA8SSBleHRlbmRzIG51bWJlciA9IG51bWJlciwgTyBleHRlbmRzIG51bWJlciA9IG51bWJlcj4gPSBTdGF0aWNNZW1iZXJzPHR5cGVvZiBDaGlwPEksIE8+PiAmIHtcbiAgICBuZXcgKCk6IENoaXA8SSwgTz47XG59O1xuXG5leHBvcnQgY29uc3QgZ2F0ZXMgPSBbQW5kR2F0ZSwgT3JHYXRlLCBOb3RHYXRlLCBOYW5kR2F0ZSwgTm9yR2F0ZSwgWG9yR2F0ZSwgWG5vckdhdGUsIEJ1ZmZlckdhdGVdIGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgY2hpcHMgPSBuZXcgTWFwPHN0cmluZywgRXh0ZW5kZWRDaGlwPihnYXRlcy5tYXAoKGdhdGUpID0+IFtnYXRlLk5BTUUsIGdhdGVdKSk7XG5cbmNoaXBzLnNldChcIkJVRlwiLCBCdWZmZXJHYXRlKTtcblxuZXhwb3J0IGNsYXNzIEhhbGZBZGRlckdhdGUgZXh0ZW5kcyBDaGlwPDIsIDI+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiSEFMRkFEREVSXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiSEFERFwiLCAyLCAyKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbiwgYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyEhKCthIF4gK2IpLCBhICYmIGJdO1xuICAgIH1cbn1cblxuY2hpcHMuc2V0KEhhbGZBZGRlckdhdGUuTkFNRSwgSGFsZkFkZGVyR2F0ZSk7XG5jaGlwcy5zZXQoXCJIQUREXCIsIEhhbGZBZGRlckdhdGUpO1xuXG5leHBvcnQgY2xhc3MgRnVsbEFkZGVyR2F0ZSBleHRlbmRzIENoaXA8MywgMj4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJGVUxMQURERVJcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMztcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJGQUREXCIsIDMsIDIpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYiwgY106IFtib29sZWFuLCBib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuLCBib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbISEoKyEhKCthIF4gK2IpIF4gK2MpLCAoISEoK2EgXiArYikgJiYgYykgfHwgKGEgJiYgYildO1xuICAgIH1cbn1cblxuY2hpcHMuc2V0KEZ1bGxBZGRlckdhdGUuTkFNRSwgRnVsbEFkZGVyR2F0ZSk7XG5jaGlwcy5zZXQoXCJGQUREXCIsIEZ1bGxBZGRlckdhdGUpO1xuIiwiZXhwb3J0IGNvbnN0IGxvYWRTdHlsZXMgPSAoKSA9PlxuICAgIFByb21pc2UuYWxsKFxuICAgICAgICBbXCJzdHlsZVwiLCBcImNvbXBvbmVudFwiLCBcImlvXCIsIFwiY29udGV4dG1lbnVcIiwgXCJ0b2FzdFwiLCBcIm1vZGFsc1wiXS5tYXAoKG5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuICAgICAgICAgICAgbGluay5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuICAgICAgICAgICAgbGluay5ocmVmID0gXCIuL3N0eWxlcy9cIiArIG5hbWUgKyBcIi5jc3NcIjtcblxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsaW5rLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoKTtcblxuICAgICAgICAgICAgICAgIGxpbmsub25lcnJvciA9ICgpID0+IHJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLFxuICAgICk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwidmFyIHdlYnBhY2tRdWV1ZXMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIHF1ZXVlc1wiKSA6IFwiX193ZWJwYWNrX3F1ZXVlc19fXCI7XG52YXIgd2VicGFja0V4cG9ydHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGV4cG9ydHNcIikgOiBcIl9fd2VicGFja19leHBvcnRzX19cIjtcbnZhciB3ZWJwYWNrRXJyb3IgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2woXCJ3ZWJwYWNrIGVycm9yXCIpIDogXCJfX3dlYnBhY2tfZXJyb3JfX1wiO1xudmFyIHJlc29sdmVRdWV1ZSA9IChxdWV1ZSkgPT4ge1xuXHRpZihxdWV1ZSAmJiAhcXVldWUuZCkge1xuXHRcdHF1ZXVlLmQgPSAxO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tKSk7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0gPyBmbi5yKysgOiBmbigpKSk7XG5cdH1cbn1cbnZhciB3cmFwRGVwcyA9IChkZXBzKSA9PiAoZGVwcy5tYXAoKGRlcCkgPT4ge1xuXHRpZihkZXAgIT09IG51bGwgJiYgdHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIikge1xuXHRcdGlmKGRlcFt3ZWJwYWNrUXVldWVzXSkgcmV0dXJuIGRlcDtcblx0XHRpZihkZXAudGhlbikge1xuXHRcdFx0dmFyIHF1ZXVlID0gW107XG5cdFx0XHRxdWV1ZS5kID0gMDtcblx0XHRcdGRlcC50aGVuKChyKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXhwb3J0c10gPSByO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSwgKGUpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFcnJvcl0gPSBlO1xuXHRcdFx0XHRyZXNvbHZlUXVldWUocXVldWUpO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgb2JqID0ge307XG5cdFx0XHRvYmpbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChmbihxdWV1ZSkpO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9XG5cdH1cblx0dmFyIHJldCA9IHt9O1xuXHRyZXRbd2VicGFja1F1ZXVlc10gPSB4ID0+IHt9O1xuXHRyZXRbd2VicGFja0V4cG9ydHNdID0gZGVwO1xuXHRyZXR1cm4gcmV0O1xufSkpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5hID0gKG1vZHVsZSwgYm9keSwgaGFzQXdhaXQpID0+IHtcblx0dmFyIHF1ZXVlO1xuXHRoYXNBd2FpdCAmJiAoKHF1ZXVlID0gW10pLmQgPSAxKTtcblx0dmFyIGRlcFF1ZXVlcyA9IG5ldyBTZXQoKTtcblx0dmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cztcblx0dmFyIGN1cnJlbnREZXBzO1xuXHR2YXIgb3V0ZXJSZXNvbHZlO1xuXHR2YXIgcmVqZWN0O1xuXHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcblx0XHRyZWplY3QgPSByZWo7XG5cdFx0b3V0ZXJSZXNvbHZlID0gcmVzb2x2ZTtcblx0fSk7XG5cdHByb21pc2Vbd2VicGFja0V4cG9ydHNdID0gZXhwb3J0cztcblx0cHJvbWlzZVt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKHF1ZXVlICYmIGZuKHF1ZXVlKSwgZGVwUXVldWVzLmZvckVhY2goZm4pLCBwcm9taXNlW1wiY2F0Y2hcIl0oeCA9PiB7fSkpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IHByb21pc2U7XG5cdGJvZHkoKGRlcHMpID0+IHtcblx0XHRjdXJyZW50RGVwcyA9IHdyYXBEZXBzKGRlcHMpO1xuXHRcdHZhciBmbjtcblx0XHR2YXIgZ2V0UmVzdWx0ID0gKCkgPT4gKGN1cnJlbnREZXBzLm1hcCgoZCkgPT4ge1xuXHRcdFx0aWYoZFt3ZWJwYWNrRXJyb3JdKSB0aHJvdyBkW3dlYnBhY2tFcnJvcl07XG5cdFx0XHRyZXR1cm4gZFt3ZWJwYWNrRXhwb3J0c107XG5cdFx0fSkpXG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0Zm4gPSAoKSA9PiAocmVzb2x2ZShnZXRSZXN1bHQpKTtcblx0XHRcdGZuLnIgPSAwO1xuXHRcdFx0dmFyIGZuUXVldWUgPSAocSkgPT4gKHEgIT09IHF1ZXVlICYmICFkZXBRdWV1ZXMuaGFzKHEpICYmIChkZXBRdWV1ZXMuYWRkKHEpLCBxICYmICFxLmQgJiYgKGZuLnIrKywgcS5wdXNoKGZuKSkpKTtcblx0XHRcdGN1cnJlbnREZXBzLm1hcCgoZGVwKSA9PiAoZGVwW3dlYnBhY2tRdWV1ZXNdKGZuUXVldWUpKSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZuLnIgPyBwcm9taXNlIDogZ2V0UmVzdWx0KCk7XG5cdH0sIChlcnIpID0+ICgoZXJyID8gcmVqZWN0KHByb21pc2Vbd2VicGFja0Vycm9yXSA9IGVycikgOiBvdXRlclJlc29sdmUoZXhwb3J0cykpLCByZXNvbHZlUXVldWUocXVldWUpKSk7XG5cdHF1ZXVlICYmIChxdWV1ZS5kID0gMCk7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=