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
/* harmony export */   "INPUT_COMPONENT_CSS_SIZE": () => (/* binding */ INPUT_COMPONENT_CSS_SIZE),
/* harmony export */   "IN_DEBUG_MODE": () => (/* binding */ IN_DEBUG_MODE),
/* harmony export */   "IS_MAC_OS": () => (/* binding */ IS_MAC_OS),
/* harmony export */   "LIGHT_GRAY_CSS_COLOR": () => (/* binding */ LIGHT_GRAY_CSS_COLOR),
/* harmony export */   "LOCKED_FOR_TESTING": () => (/* binding */ LOCKED_FOR_TESTING),
/* harmony export */   "ORIGIN_POINT": () => (/* binding */ ORIGIN_POINT),
/* harmony export */   "OUTPUT_COMPONENT_CSS_SIZE": () => (/* binding */ OUTPUT_COMPONENT_CSS_SIZE),
/* harmony export */   "SCUFFED_UUID": () => (/* binding */ SCUFFED_UUID)
/* harmony export */ });
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./managers/ModalManager */ "./src/managers/ModalManager.ts");

const INPUT_COMPONENT_CSS_SIZE = 24;
const OUTPUT_COMPONENT_CSS_SIZE = 24;
const CHIP_COMPONENT_CSS_WIDTH = 120;
const CHIP_COMPONENT_CSS_HEIGHT = 40;
const CHIP_INPUT_CSS_SIZE = 16;
const CHIP_OUTPUT_CSS_SIZE = 16;
const ORIGIN_POINT = Object.freeze({ x: 0, y: 0 });
const ACTIVATED_CSS_COLOR = "#ff2626";
const LIGHT_GRAY_CSS_COLOR = "#dedede";
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
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reified/Output */ "./src/reified/Output.ts");







function saveDiagram(components, wires) {
    const id = (0,_constants__WEBPACK_IMPORTED_MODULE_0__.COUNTER_GENERATOR)();
    const ids = new Map();
    const data = {
        components: components.map((component, reified) => {
            if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_5__.Input) {
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
            if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output) {
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
                };
            }
            _managers_ToastManager__WEBPACK_IMPORTED_MODULE_1__.ToastManager.toast({
                message: "Unable to serialize diagram.",
                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                duration: 2500,
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
                const input = new _reified_Input__WEBPACK_IMPORTED_MODULE_5__.Input(raw);
                input.element.classList.toggle("activated", raw.activated);
                elements.set(raw.id, input.element);
                return raw.permanent ? input.permanent() : input;
            }
            if (raw.type === "OUTPUT") {
                const output = new _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output(raw);
                output.element.classList.toggle("activated", raw.activated);
                elements.set(raw.id, output.element);
                return raw.permanent ? output.permanent() : output;
            }
            const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component(new (_reified_chips__WEBPACK_IMPORTED_MODULE_3__.chips.get(raw.name))(), raw);
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
        const wires = data.wires.map(({ from, to }) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.Wiring(elements.get(from), elements.get(to)));
        return { result: [reified, wires], error: undefined };
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
    if (!("components" in data))
        throw new Error("Data is missing components.");
    if (!("wires" in data))
        throw new Error("Data is missing wires.");
    if (!Array.isArray(data.components))
        throw new Error("Components data is not an array.");
    if (!Array.isArray(data.wires))
        throw new Error("Wires data is not an array.");
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
        if (typeof component.type !== "string" || !["INPUT", "OUTPUT", "COMPONENT"].includes(component.type))
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
                if (!_reified_chips__WEBPACK_IMPORTED_MODULE_3__.chips.has(component.name.trim().toUpperCase()))
                    throw new Error("Chip name doesn't exist.");
                const Chip = _reified_chips__WEBPACK_IMPORTED_MODULE_3__.chips.get(component.name.trim().toUpperCase());
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
        }
    }
    const ids = data.components.flatMap((component) => component.type === "COMPONENT"
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
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./files */ "./src/files.ts");
/* harmony import */ var _keybinds__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keybinds */ "./src/keybinds.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./menu */ "./src/menu.ts");
/* harmony import */ var _premade__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./premade */ "./src/premade/index.ts");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styles */ "./src/styles.ts");









Object.assign(globalThis, _constants__WEBPACK_IMPORTED_MODULE_0__);
await (0,_styles__WEBPACK_IMPORTED_MODULE_7__.loadStyles)();
const hrefAsUrl = new URL(location.href);
const shouldLoadInline = hrefAsUrl.searchParams.get("inline");
if (shouldLoadInline) {
    try {
        const inlined = atob(shouldLoadInline);
        const { error, result: [components, wirings], } = (0,_files__WEBPACK_IMPORTED_MODULE_1__.fromFile)(inlined);
        if (error)
            throw new Error(error);
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.setup({ keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds, menu: _menu__WEBPACK_IMPORTED_MODULE_5__.menu, initial: [components, wirings] });
    }
    catch {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.setup({ keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds, menu: _menu__WEBPACK_IMPORTED_MODULE_5__.menu, save: "sandbox" });
        _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__.ToastManager.toast({
            message: "Diagram is not correctly encoded.",
            color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
            duration: 2500,
        });
        hrefAsUrl.searchParams.delete("inline");
        history.pushState(undefined, "", hrefAsUrl);
    }
}
else {
    const save = hrefAsUrl.searchParams.get("save");
    if (save) {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.setup({ keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds, menu: _menu__WEBPACK_IMPORTED_MODULE_5__.menu, save });
    }
    else {
        const shouldLoadPremade = hrefAsUrl.searchParams.get("premade");
        if (shouldLoadPremade && _premade__WEBPACK_IMPORTED_MODULE_6__.premade.has(shouldLoadPremade.trim().toLowerCase())) {
            _premade__WEBPACK_IMPORTED_MODULE_6__.premade.get(shouldLoadPremade.trim().toLowerCase())({ name: shouldLoadPremade.trim().toLowerCase() });
        }
        else {
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_3__.SandboxManager.setup({ keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds, menu: _menu__WEBPACK_IMPORTED_MODULE_5__.menu, save: "sandbox" });
            if (shouldLoadPremade) {
                _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__.ToastManager.toast({
                    message: "No premades were found with that name.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
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

/***/ "./src/keybinds.ts":
/*!*************************!*\
  !*** ./src/keybinds.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "keybinds": () => (/* binding */ keybinds)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./reified/Reified */ "./src/reified/Reified.ts");








const undo = (e) => {
    _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.popHistory();
};
const redo = (e) => {
    _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.redoHistory();
};
const keybinds = {
    "ControlLeft+ShiftLeft+KeyZ": (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo(e);
    },
    "ControlLeft+ShiftRight+KeyZ": (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo(e);
    },
    "ControlRight+ShiftLeft+KeyZ": (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo(e);
    },
    "ControlRight+ShiftRight+KeyZ": (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo(e);
    },
    "MetaLeft+ShiftLeft+KeyZ": (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo(e);
    },
    "MetaLeft+ShiftRight+KeyZ": (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo(e);
    },
    "MetaRight+ShiftLeft+KeyZ": (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo(e);
    },
    "MetaRight+ShiftRight+KeyZ": (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        redo(e);
    },
    "ControlLeft+KeyZ": (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        undo(e);
    },
    "ControlRight+KeyZ": (e) => {
        if (_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        undo(e);
    },
    "MetaLeft+KeyZ": (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        undo(e);
    },
    "MetaRight+KeyZ": (e) => {
        if (!_constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            return;
        undo(e);
    },
    Backspace: () => {
        const selected = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected.clone();
        const deleted = [];
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.pushHistory(() => {
            selected.forEach((component) => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active["delete"](component);
                component.detach();
                if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_5__.Input) {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.WiringManager.wires.forEach((wire) => {
                        if (wire.from === component.element) {
                            wire.destroy();
                            wire.to.classList.remove("activated");
                            deleted.push([wire.from, wire.to]);
                        }
                    });
                }
                else if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output) {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.WiringManager.wires.forEach((wire) => {
                        if (wire.to === component.element) {
                            wire.destroy();
                            deleted.push([wire.from, wire.to]);
                        }
                    });
                    component.element.classList.remove("activated");
                }
                else if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_4__.Component) {
                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.WiringManager.wires.forEach((wire) => {
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
            _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected.clear();
        }, () => {
            selected.forEach((component) => {
                _reified_Reified__WEBPACK_IMPORTED_MODULE_7__.Reified.active.add(component);
                component.attach();
            });
            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_3__.Wiring(from, to)));
            _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected = selected;
        });
    },
};


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
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");



class DraggingManager {
    static #dragged;
    static #watched = new Map();
    static #mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };
    static #topleft;
    static #original;
    static #downpos = { x: -1, y: -1 };
    static #positions;
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
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected.size <= 1) {
                this.#mouse.ox = e.clientX - rect.left + body.left;
                this.#mouse.oy = e.clientY - rect.top + body.top;
            }
            else {
                this.#positions = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected].map((target) => ({
                    x: parseFloat(target.element.style.left),
                    y: parseFloat(target.element.style.top),
                }));
                const topleft = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected].sort((a, b) => {
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
        target.addEventListener("mousedown", mousedown, { capture: true });
        this.#watched.set(target, mousedown);
    }
    static forget(element, force) {
        const listener = this.#watched.get(element);
        if (!listener && !force)
            throw new Error(`Element is not currently being watched.`);
        delete element.dataset.watched;
        element.removeEventListener("mousedown", listener, { capture: true });
        this.#watched.delete(element);
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
    }
    static deafen() {
        document.body.removeEventListener("mousemove", this.#mousemove);
        window.removeEventListener("mousedown", this.#mousedown);
        window.removeEventListener("mouseup", this.#mouseup);
    }
    static #mousemove = (e) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
        if (this.#dragged) {
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected.size <= 1) {
                this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
            }
            else {
                const topleft = this.#topleft.getBoundingClientRect();
                _SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected.forEach((component) => {
                    const offset = component.element.getBoundingClientRect();
                    component.move({
                        x: this.#mouse.x - this.#mouse.ox + offset.left - topleft.left,
                        y: this.#mouse.y - this.#mouse.oy + offset.top - topleft.top,
                    });
                });
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
            if (_SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected.size <= 1) {
                const target = this.#dragged;
                const mouse = this.#mouse;
                const original = this.#original;
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.pushHistory(() => {
                        target.style.left = mouse.x - mouse.ox - 1 + "px";
                        target.style.top = mouse.y - mouse.oy - 1 + "px";
                    }, () => {
                        target.style.left = original.x - 1 + "px";
                        target.style.top = original.y - 1 + "px";
                    });
            }
            else {
                const mouse = this.#mouse;
                const targets = [..._SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selected];
                const positions = this.#positions;
                const topleft = this.#topleft.getBoundingClientRect();
                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.pushHistory(() => {
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
            _MouseManager__WEBPACK_IMPORTED_MODULE_0__.MouseManager.mouse.x !== -1 &&
            _MouseManager__WEBPACK_IMPORTED_MODULE_0__.MouseManager.mouse.y !== -1)
            _SelectionManager__WEBPACK_IMPORTED_MODULE_2__.SelectionManager.selectAllIn(DraggingManager.#downpos, _MouseManager__WEBPACK_IMPORTED_MODULE_0__.MouseManager.mouse);
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

class KeybindsManager {
    static #keymap = new Map();
    static #keychords = new Array();
    static #keydown = (e) => {
        this.#keymap.set(e.code, true);
        if (e.metaKey && (e.code === "ShiftLeft" || e.code === "ShiftRight") && _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            this.#keymap = new Map([...this.#keymap.entries()].filter(([key]) => !key.startsWith("Key")));
        if (document.activeElement === document.body) {
            const [, runs] = this.#keychords.find(([chord]) => {
                let keys = chord.split("+");
                const checkShift = keys.includes("ShiftLeft") || keys.includes("ShiftRight");
                const checkMeta = keys.includes("MetaLeft") || keys.includes("MetaRight");
                const checkAlt = keys.includes("AltLeft") || keys.includes("AltRight");
                const checkCtrl = keys.includes("ControlLeft") || keys.includes("ControlRight");
                if (checkShift)
                    keys = keys.filter((key) => key !== "ShiftLeft" && key !== "ShiftRight");
                if (checkMeta)
                    keys = keys.filter((key) => key !== "MetaLeft" && key !== "MetaRight");
                if (checkAlt)
                    keys = keys.filter((key) => key !== "AltLeft" && key !== "AltRight");
                if (checkCtrl)
                    keys = keys.filter((key) => key !== "ControlLeft" && key !== "ControlRight");
                return (keys.every((key) => this.#keymap.get(key)) &&
                    (checkShift ? e.shiftKey : true) &&
                    (checkMeta ? e.metaKey : true) &&
                    (checkAlt ? e.altKey : true) &&
                    (checkCtrl ? e.ctrlKey : true));
            }) ?? [];
            if (runs)
                runs.forEach((run) => run.call(undefined, e));
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
        const menu = _reified_Reified__WEBPACK_IMPORTED_MODULE_0__.html `
            <div class="contextmenu">
                ${actions
            .map((record) => Object.entries(record)
            .map(([name, { label }]) => `<button class="${name}">${label}</button>`)
            .join(""))
            .join('<div class="br"></div>')}
            </div>
        `;
        const clicks = new Map();
        const setup = (actions) => {
            clicks.clear();
            menu.innerHTML = actions
                .map((record) => Object.entries(record)
                .map(([name, { label }]) => `<button class="${name}">${label}</button>`)
                .join(""))
                .join('<div class="br"></div>');
            actions.forEach((record) => {
                Object.keys(record).forEach((key) => {
                    const click = record[key].callback.bind(undefined);
                    menu.querySelector("." + key).addEventListener("click", () => click(this.#opened));
                    menu.querySelector("." + key).addEventListener("contextmenu", () => click(this.#opened));
                    clicks.set(key, clicks);
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
                //
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
    static #mousemove = (e) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
    };
    static #mousedown = (e) => {
        this.#mousedowns.forEach((l) => l.call(undefined, e));
    };
    static #mouseup = (e) => {
        this.#mouseups.forEach((l) => l.call(undefined, e));
    };
    static start() {
        document.addEventListener("mousemove", this.#mousemove);
        document.addEventListener("mousedown", this.#mousedown);
        document.addEventListener("mouseup", this.#mouseup);
    }
    static stop() {
        document.removeEventListener("mousemove", this.#mousemove);
        document.removeEventListener("mousedown", this.#mousedown);
        document.removeEventListener("mouseup", this.#mouseup);
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
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MenuManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./MenuManager */ "./src/managers/MenuManager.ts");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SelectionManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");
















const calculateReifiedTotals = (set) => [...set].reduce((map, item) => {
    if (item instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_4__.Input) {
        map.inputsTotal++;
    }
    else if (item instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_5__.Output) {
        map.outputsTotal++;
    }
    else if (item instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component) {
        map.chipsTotal++;
        map.chips.set(item.chip.name, (map.chips.get(item.chip.name) ?? 0) + 1);
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
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.html `<div class="modal-container modal-inactive"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.html `<div class="reified-root"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.html `<canvas></canvas>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.html `<div class="toasts-container"></div>`);
        _MouseManager__WEBPACK_IMPORTED_MODULE_11__.MouseManager.start();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_8__.KeybindsManager.listen();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_7__.DraggingManager.listen();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_12__.SelectionManager.listen();
        _WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.start();
        const createReifiedActive = (components) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((item, set) => {
            const totals = calculateReifiedTotals(set.clone().add(item));
            if (totals.chipsTotal + totals.inputsTotal + totals.outputsTotal >
                (this.#config.limits?.componentsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                    message: "Exceeded total components limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            if (totals.inputsTotal > (this.#config.limits?.inputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                    message: "Exceeded total inputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            if (totals.outputsTotal > (this.#config.limits?.outputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                    message: "Exceeded total outputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            if (totals.chipsTotal > (this.#config.limits?.chipsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                    message: "Exceeded total chips limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            if (item instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component &&
                totals.chips.has(item.chip.name) &&
                totals.chips.get(item.chip.name) > (this.#config.limits?.chips?.[item.chip.name] ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                    message: `Exceeded total '${item.chip.name}' limit.`,
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            return true;
        })
            .addAll(components);
        const createWiringsSet = (wirings) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((_, set) => {
            if (set.size + 1 > (this.#config.limits?.wirings ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                    message: "Exceeded total wirings limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            return true;
        })
            .addAll(wirings);
        if (typeof this.#config.menu !== "undefined")
            [this.queueNewContext] = _MenuManager__WEBPACK_IMPORTED_MODULE_9__.MenuManager.use(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.root, this.#config.menu);
        if (typeof this.#config.keybinds !== "undefined")
            Object.entries(this.#config.keybinds).forEach(([chord, run]) => _KeybindsManager__WEBPACK_IMPORTED_MODULE_8__.KeybindsManager.onKeyChord(chord, run));
        if (typeof this.#config.initial !== "undefined") {
            this.clear();
            _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active = createReifiedActive(this.#config.initial[0]);
            _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.forEach((component) => component.attach());
            _WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires = createWiringsSet(this.#config.initial[1]);
        }
        if (typeof this.#config.save !== "undefined") {
            const file = _StorageManager__WEBPACK_IMPORTED_MODULE_13__.StorageManager.get("saves:" + this.#config.save);
            if (file) {
                const { error, result: [components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_2__.fromFile)(file);
                if (error) {
                    _StorageManager__WEBPACK_IMPORTED_MODULE_13__.StorageManager["delete"]("saves:" + this.#config.save);
                    _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                        message: "Unable to read from saves.",
                        color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });
                }
                else {
                    if (!this.#config.overrideSaveIfExists) {
                        this.clear();
                        _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active = createReifiedActive(components);
                        _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.forEach((component) => component.attach());
                        _WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires = createWiringsSet(wires);
                    }
                    _StorageManager__WEBPACK_IMPORTED_MODULE_13__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires]));
                }
            }
        }
        this.#observer = new MutationObserver(() => {
            if (typeof this.#config.save !== "undefined")
                _StorageManager__WEBPACK_IMPORTED_MODULE_13__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires]));
        });
        this.#observer.observe(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.root, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        });
        this.#interval = setInterval(() => {
            const check = this.#config.checkState?.(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.clone(), _WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires.clone()) ?? false;
            if (check)
                this.#config.ifStateChecked?.();
        }, this.#config.checkInterval ?? 50);
    }
    static reset() {
        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = undefined;
        }
        clearInterval(this.#interval);
        this.#interval = -1;
        _MouseManager__WEBPACK_IMPORTED_MODULE_11__.MouseManager.reset();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_8__.KeybindsManager.reset();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_7__.DraggingManager.reset();
        _SelectionManager__WEBPACK_IMPORTED_MODULE_12__.SelectionManager.reset();
        _WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.stop();
        _MenuManager__WEBPACK_IMPORTED_MODULE_9__.MenuManager.remove(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.root);
        this.clear();
        this.watchedUnresolvedPromises.forEach((finish) => finish.call(undefined));
        this.watchedUnresolvedPromises.clear();
        document.body.innerHTML = "";
        this.#config = {};
        this.#history = [];
        this.#redos = [];
    }
    static clear() {
        _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.forEach((component) => component.detach());
        _WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires.forEach((wire) => wire.destroy());
        _SelectionManager__WEBPACK_IMPORTED_MODULE_12__.SelectionManager.selected.clear();
    }
    static pushHistory(command, undo) {
        this.#redos.length = 0;
        command.call(undefined);
        this.#history.push([command, undo]);
    }
    static popHistory() {
        if (!this.#history.length)
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                message: "Nothing to undo.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: 2500,
            });
        const [redo, undo] = this.#history.pop();
        this.#redos.push([redo, undo]);
        return undo.call(undefined);
    }
    static redoHistory() {
        if (!this.#redos.length)
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_14__.ToastManager.toast({
                message: "Nothing to redo.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: 2500,
            });
        const [command, undo] = this.#redos.pop();
        this.#history.push([command, undo]);
        return command.call(undefined);
    }
    static async saveTo(save) {
        this.#config.save = save;
        if (_StorageManager__WEBPACK_IMPORTED_MODULE_13__.StorageManager.has("saves:" + this.#config.save) &&
            !(await _ModalManager__WEBPACK_IMPORTED_MODULE_10__.ModalManager.confirm("There is already a save with this name. Are you sure you want to replace it?")))
            return;
        _StorageManager__WEBPACK_IMPORTED_MODULE_13__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_15__.WiringManager.wires]));
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
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");












class SelectionManager {
    static selected = new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet();
    static #mousedown = (e) => {
        const target = e.target;
        const element = [
            target.closest("button.board-input"),
            target.closest("button.board-output"),
            target.closest("div.component"),
        ].find((element) => element !== null);
        const reified = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active].find((component) => component.element === element);
        if (reified) {
            if ((_constants__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("MetaLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("MetaRight"))) ||
                (!_constants__WEBPACK_IMPORTED_MODULE_1__.IS_MAC_OS && (_KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("ControlLeft") || _KeybindsManager__WEBPACK_IMPORTED_MODULE_7__.KeybindsManager.isKeyDown("ControlRight"))))
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
            const data = (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)(array, [..._WiringManager__WEBPACK_IMPORTED_MODULE_11__.WiringManager.wires].filter((wiring) => array.some((component) => {
                if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_4__.Input)
                    return wiring.from === component.element;
                if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_5__.Output)
                    return false;
                if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component)
                    return component.outputs.some((output) => wiring.from === output);
                throw new Error("Unknown component type.");
            }) &&
                array.some((component) => {
                    if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_4__.Input)
                        return false;
                    if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_5__.Output)
                        return wiring.to === component.element;
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component)
                        return component.inputs.some((input) => wiring.to === input);
                    throw new Error("Unknown component type.");
                })));
            await navigator.clipboard.writeText(data);
        }
    };
    static #paste = async () => {
        const { error, result: [components, wirings], } = (0,_files__WEBPACK_IMPORTED_MODULE_2__.fromFile)(await navigator.clipboard.readText());
        if (error)
            return _ToastManager__WEBPACK_IMPORTED_MODULE_10__.ToastManager.toast({
                message: "Unable to paste diagram data.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: 2500,
            });
        const mouse = { ..._MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse };
        const selection = this.selected.clone(true);
        _SandboxManager__WEBPACK_IMPORTED_MODULE_9__.SandboxManager.pushHistory(() => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.addAll(components);
            if (components.every((component) => _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.has(component))) {
                components.forEach((component) => {
                    component.attach();
                    if (component instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component) {
                        component.inputs.forEach((input) => input.classList.remove("activated"));
                        setTimeout(() => component.update(), 0);
                    }
                    if (component instanceof _reified_Output__WEBPACK_IMPORTED_MODULE_5__.Output) {
                        component.element.classList.remove("activated");
                    }
                });
                if (_MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse.x !== -1 && _MouseManager__WEBPACK_IMPORTED_MODULE_8__.MouseManager.mouse.y !== -1) {
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
                _WiringManager__WEBPACK_IMPORTED_MODULE_11__.WiringManager.wires.addAll(wirings);
                this.selected.clear();
                components.forEach((component) => this.addSelection(component));
            }
        }, () => {
            _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.deleteAll(components);
            components.forEach((component) => {
                component.detach();
            });
            _WiringManager__WEBPACK_IMPORTED_MODULE_11__.WiringManager.wires.deleteAll(wirings);
            this.selected.clear();
            selection.forEach((component) => this.addSelection(component));
        });
    };
    static select(reified) {
        this.selected.clear();
        this.selected.add(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.element.style.zIndex = "1000";
    }
    static selectAllIn(from, to) {
        this.selected.clear();
        const reified = [..._reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active].filter((component) => (0,_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.overlappedBounds)(component.element.getBoundingClientRect(), from, to));
        this.selected.addAll(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
        reified.forEach((component) => (component.element.style.zIndex = "1000"));
    }
    static addSelection(reified) {
        this.selected.add(reified);
        _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.forEach((component) => (component.element.style.zIndex = "100"));
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
                await _ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.alert(`Diagram failed to pass the test with inputs "${expectedOutputs
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
                                    WiringManager.wires.delete(wire);
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
            wire.to.classList.toggle("activated", wire.from.classList.contains("activated"));
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

/***/ "./src/menu.ts":
/*!*********************!*\
  !*** ./src/menu.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "menu": () => (/* binding */ menu)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./files */ "./src/files.ts");
/* harmony import */ var _keybinds__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keybinds */ "./src/keybinds.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./managers/SelectionManager */ "./src/managers/SelectionManager.ts");
/* harmony import */ var _managers_StorageManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./managers/StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./reified/Reified */ "./src/reified/Reified.ts");















const menu = [
    {
        "insert-chip": {
            label: "Insert chip",
            callback: async (e) => {
                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_7__.TestingManager.testing)
                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                const name = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.prompt("Enter the chip's name:");
                if (typeof name !== "string")
                    return;
                const chip = _reified_chips__WEBPACK_IMPORTED_MODULE_10__.chips.get(name.toUpperCase());
                if (!chip)
                    return _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.alert("No chip was found with that name.");
                const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_11__.Component(Reflect.construct(chip, []), _constants__WEBPACK_IMPORTED_MODULE_0__.ORIGIN_POINT);
                const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.selected.clone(true);
                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                    _reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active.add(component);
                    if (_reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active.has(component)) {
                        component.attach();
                        const { width, height } = getComputedStyle(component.element);
                        component.move({
                            x: e.clientX - parseFloat(width) / 2,
                            y: e.clientY - parseFloat(height) / 2,
                        });
                        _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.select(component);
                    }
                }, () => {
                    _reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active["delete"](component);
                    component.detach();
                    _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.selected = selection;
                });
            },
        },
    },
    {
        "new-input": {
            label: "New input",
            callback: (e) => {
                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_7__.TestingManager.testing)
                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                const input = new _reified_Input__WEBPACK_IMPORTED_MODULE_12__.Input({
                    x: e.clientX - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
                });
                const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.selected.clone(true);
                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                    _reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active.add(input);
                    if (_reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active.has(input)) {
                        input.attach();
                        _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.select(input);
                    }
                }, () => {
                    _reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active["delete"](input);
                    input.detach();
                    _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.selected = selection;
                });
            },
        },
        "new-output": {
            label: "New output",
            callback: (e) => {
                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_7__.TestingManager.testing)
                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                const output = new _reified_Output__WEBPACK_IMPORTED_MODULE_13__.Output({
                    x: e.clientX - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
                });
                const selection = _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.selected.clone(true);
                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.pushHistory(() => {
                    _reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active.add(output);
                    if (_reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active.has(output)) {
                        output.attach();
                        _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.select(output);
                    }
                }, () => {
                    _reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active["delete"](output);
                    output.detach();
                    _managers_SelectionManager__WEBPACK_IMPORTED_MODULE_5__.SelectionManager.selected = selection;
                });
            },
        },
    },
    {
        "copy-url": {
            label: "Copy link",
            callback: () => {
                const hrefAsUrl = new URL(location.href);
                hrefAsUrl.searchParams.set("inline", btoa((0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active], [..._managers_WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.wires])));
                navigator.clipboard.writeText(hrefAsUrl.href);
            },
        },
        "save-to": {
            label: "Save with name",
            callback: async () => {
                const name = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.prompt("What should be the name of this save?");
                if (typeof name !== "string")
                    return;
                await _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.saveTo(name);
            },
        },
        "load-from": {
            label: "Load from saves",
            callback: async () => {
                const save = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.prompt("Which save would you like to load?");
                if (typeof save !== "string")
                    return;
                if (!_managers_StorageManager__WEBPACK_IMPORTED_MODULE_6__.StorageManager.has("saves:" + save))
                    return _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.alert("No save was found with that name.");
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.reset();
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({ keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds, menu, save });
            },
        },
        "save-as": {
            label: "Save as file",
            callback: () => {
                Object.assign(document.createElement("a"), {
                    href: URL.createObjectURL(new Blob([(0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active], [..._managers_WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.wires])], {
                        type: "application/json",
                    })),
                    download: `gatesim-${Date.now()}.json`,
                }).click();
            },
        },
        "import-from": {
            label: "Import from file",
            callback: async () => {
                const input = Object.assign(document.createElement("input"), { type: "file" });
                input.click();
                const file = await new Promise((resolve) => {
                    input.onchange = () => resolve(input.files?.[0] ?? undefined);
                    input.onerror = () => resolve(undefined);
                });
                if (!file)
                    return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_8__.ToastManager.toast({
                        message: "No file was provided.",
                        color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });
                const reader = new FileReader();
                reader.readAsText(file);
                const raw = await new Promise((resolve) => {
                    reader.onload = () => resolve(reader.result?.toString() ?? undefined);
                    reader.onerror = () => resolve(undefined);
                });
                if (!raw)
                    return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_8__.ToastManager.toast({
                        message: "Unable to read the file.",
                        color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });
                const { error, result: [components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_1__.fromFile)(raw);
                if (error)
                    return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_8__.ToastManager.toast({ message: error, color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR, duration: 2500 });
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.reset();
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({
                    keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds,
                    menu,
                    save: "sandbox",
                    initial: [components, wires],
                    overrideSaveIfExists: true,
                });
                _managers_StorageManager__WEBPACK_IMPORTED_MODULE_6__.StorageManager.set("saves:" + "sandbox", (0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_14__.Reified.active], [..._managers_WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.wires]));
            },
        },
    },
    ...(_constants__WEBPACK_IMPORTED_MODULE_0__.IN_DEBUG_MODE
        ? [
            {
                "test-alert": {
                    label: "Test alert",
                    callback: () => {
                        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.alert("This is an alert.");
                    },
                },
                "test-confirm": {
                    label: "Test confirm",
                    callback: () => {
                        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.confirm("This is a confirmation.");
                    },
                },
                "test-prompt": {
                    label: "Test prompt",
                    callback: () => {
                        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.prompt("This is a prompt.");
                    },
                },
                "test-toast": {
                    label: "Test toast",
                    callback: () => {
                        _managers_ToastManager__WEBPACK_IMPORTED_MODULE_8__.ToastManager.toast({
                            message: "This is a toast.",
                            color: _constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR,
                            duration: 2500,
                        });
                    },
                },
            },
            {
                "wipe-storage": {
                    label: "Wipe storage",
                    callback: () => {
                        _managers_StorageManager__WEBPACK_IMPORTED_MODULE_6__.StorageManager.storage.clear();
                    },
                },
            },
            {
                "stop-render": {
                    label: "Stop rendering wires",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.stop();
                    },
                },
                "start-render": {
                    label: "Start rendering wires",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.start();
                    },
                },
            },
        ]
        : []),
];


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
/* harmony import */ var _keybinds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../keybinds */ "./src/keybinds.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../menu */ "./src/menu.ts");
/* harmony import */ var _nands__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nands */ "./src/premade/nands.ts");




const premade = new Map([
    ["sandbox", () => _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.setup({ keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_0__.keybinds, menu: _menu__WEBPACK_IMPORTED_MODULE_2__.menu, save: "sandbox" })],
    ...Object.entries(_nands__WEBPACK_IMPORTED_MODULE_3__.nands),
]);


/***/ }),

/***/ "./src/premade/nands.ts":
/*!******************************!*\
  !*** ./src/premade/nands.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "nands": () => (/* binding */ nands)
/* harmony export */ });
/* harmony import */ var _keybinds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../keybinds */ "./src/keybinds.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../menu */ "./src/menu.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reified/Output */ "./src/reified/Output.ts");









const nands = {
    "nand:not": ({ name: save }) => {
        _menu__WEBPACK_IMPORTED_MODULE_4__.menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await _managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.test([
                        [[true], [false]],
                        [[false], [true]],
                    ], { timeout: 250 });
                },
            },
        });
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.setup({
            keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_0__.keybinds,
            menu: _menu__WEBPACK_IMPORTED_MODULE_4__.menu,
            save,
            initial: [
                [
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 100 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 100 }),
                    new _reified_Output__WEBPACK_IMPORTED_MODULE_8__.Output({ x: 500, y: 100 }),
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
        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("Recreate a NOT gate using only a NAND gate.");
    },
    "nand:and": ({ name: save }) => {
        _menu__WEBPACK_IMPORTED_MODULE_4__.menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await _managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.test([
                        [[false, false], [false]],
                        [[true, false], [false]],
                        [[false, true], [false]],
                        [[true, true], [true]],
                    ], { timeout: 500 });
                },
            },
        });
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.setup({
            keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_0__.keybinds,
            menu: _menu__WEBPACK_IMPORTED_MODULE_4__.menu,
            save,
            initial: [
                [
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 100 }),
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 200 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 100 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 200 }),
                    new _reified_Output__WEBPACK_IMPORTED_MODULE_8__.Output({ x: 500, y: 150 }),
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
        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("Recreate an AND gate using only NAND gates.");
    },
    "nand:or": ({ name: save }) => {
        _menu__WEBPACK_IMPORTED_MODULE_4__.menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await _managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.test([
                        [[false, false], [false]],
                        [[true, false], [true]],
                        [[false, true], [true]],
                        [[true, true], [true]],
                    ], { timeout: 750 });
                },
            },
        });
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.setup({
            keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_0__.keybinds,
            menu: _menu__WEBPACK_IMPORTED_MODULE_4__.menu,
            save,
            initial: [
                [
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 100 }),
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 200 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 100 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 150 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 200 }),
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
        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("Recreate an OR gate using only NAND gates.");
    },
    "nand:xor": ({ name: save }) => {
        _menu__WEBPACK_IMPORTED_MODULE_4__.menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await _managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.test([
                        [[false, false], [false]],
                        [[true, false], [true]],
                        [[false, true], [true]],
                        [[true, true], [false]],
                    ], { timeout: 1000 });
                },
            },
        });
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.setup({
            keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_0__.keybinds,
            menu: _menu__WEBPACK_IMPORTED_MODULE_4__.menu,
            save,
            initial: [
                [
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 100 }),
                    new _reified_Input__WEBPACK_IMPORTED_MODULE_7__.Input({ x: 100, y: 200 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 100 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 300, y: 200 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 500, y: 100 }),
                    new _reified_Component__WEBPACK_IMPORTED_MODULE_6__.Component(new _reified_chips__WEBPACK_IMPORTED_MODULE_5__.NandGate(), { x: 500, y: 200 }),
                    new _reified_Output__WEBPACK_IMPORTED_MODULE_8__.Output({ x: 700, y: 150 }),
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
        _managers_ModalManager__WEBPACK_IMPORTED_MODULE_1__.ModalManager.alert("Recreate a XOR gate using only NAND gates.");
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
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");







class Component extends _Reified__WEBPACK_IMPORTED_MODULE_6__.Reified {
    element;
    inputs;
    outputs;
    name;
    #observers = new Map();
    #mouseups = new Map();
    #contextmenus = new Map();
    chip;
    constructor(chip, pos) {
        super();
        this.chip = chip;
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_6__.html `
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
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.queueNewContext((prev) => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                                        if (wire.to === input) {
                                            wire.destroy();
                                            deleted.push(wire.from);
                                        }
                                    });
                                    input.classList.remove("activated");
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((from) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(from, input)));
                                });
                            },
                        },
                    },
                    ...prev.slice(2),
                ]);
            });
        });
        this.outputs.forEach((output) => {
            this.#mouseups.set(output, () => output.blur());
            this.#contextmenus.set(output, () => {
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.queueNewContext((prev) => [
                    {
                        "create-connection": {
                            label: "Create connection",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.NewWireContext.from = output;
                                return undefined;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            callback: () => {
                                if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                                    return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                                const deleted = [];
                                return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                                        if (wire.from === output) {
                                            wire.destroy();
                                            wire.to.classList.remove("activated");
                                            deleted.push(wire.to);
                                        }
                                    });
                                }, () => {
                                    _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(output, to)));
                                });
                            },
                        },
                    },
                    ...prev.slice(2),
                ]);
            });
        });
        this.#contextmenus.set(this.name, () => {
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.queueNewContext((prev) => [
                {
                    "delete-component": {
                        label: "Delete component",
                        callback: () => {
                            if (this.PERMANENT)
                                return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__.ToastManager.toast({
                                    message: "This component is permanent and cannot be deleted.",
                                    color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                    duration: 2500,
                                });
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                                _Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active["delete"](this);
                                this.detach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.add(this);
                                this.attach();
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(from, to)));
                            });
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        callback: () => {
                            if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                                return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                            const deleted = [];
                            return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                                    if (this.inputs.some((i) => wire.to === i) ||
                                        this.outputs.some((o) => wire.from === o)) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                        deleted.push([wire.from, wire.to]);
                                    }
                                });
                                this.inputs.forEach((i) => i.classList.remove("activated"));
                            }, () => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(from, to)));
                            });
                        },
                    },
                },
                ...prev.slice(2),
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
        });
        this.name.addEventListener("contextmenu", this.#contextmenus.get(this.name));
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.watch(this.element, this.name);
        return this;
    }
    detach() {
        super.detach();
        this.#observers.forEach((o) => o.disconnect());
        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));
        this.name.removeEventListener("contextmenu", this.#contextmenus.get(this.name));
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_1__.DraggingManager.forget(this.element, true);
        return this;
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
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../managers/TestingManager */ "./src/managers/TestingManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");







class Input extends _Reified__WEBPACK_IMPORTED_MODULE_6__.Reified {
    element;
    constructor(pos = { x: 0, y: 0 }) {
        super();
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_6__.html `<button class="board-input">I</button>`;
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
        if (Math.hypot(e.clientX - +this.element.dataset.x, e.clientY - +this.element.dataset.y) > 2)
            return;
        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
        const active = this.element.classList.contains("activated");
        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
            this.element.classList.toggle("activated", !active);
        }, () => {
            this.element.classList.toggle("activated", active);
        });
    };
    #contextmenu = () => {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.queueNewContext((prev) => [
            {
                "create-connection": {
                    label: "Create connection",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.NewWireContext.from = this.element;
                    },
                },
                "delete-input": {
                    label: "Delete input",
                    callback: () => {
                        if (this.PERMANENT)
                            return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__.ToastManager.toast({
                                message: "This input is permanent and cannot be deleted.",
                                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                duration: 2500,
                            });
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                            _Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active["delete"](this);
                            this.detach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                                if (wire.from === this.element) {
                                    wire.destroy();
                                    wire.to.classList.remove("activated");
                                    deleted.push(wire.to);
                                }
                            });
                        }, () => {
                            _Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.add(this);
                            this.attach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(this.element, to)));
                        });
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    callback: () => {
                        if (_managers_TestingManager__WEBPACK_IMPORTED_MODULE_3__.TestingManager.testing)
                            return (0,_constants__WEBPACK_IMPORTED_MODULE_0__.LOCKED_FOR_TESTING)();
                        const deleted = [];
                        return _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.pushHistory(() => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.forEach((wire) => {
                                if (wire.from === this.element) {
                                    wire.destroy();
                                    wire.to.classList.remove("activated");
                                    deleted.push(wire.to);
                                }
                            });
                        }, () => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.WiringManager.wires.addAll(deleted.splice(0, deleted.length).map((to) => new _managers_WiringManager__WEBPACK_IMPORTED_MODULE_5__.Wiring(this.element, to)));
                        });
                    },
                },
            },
            ...prev.slice(2),
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
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_2__.SandboxManager.queueNewContext((prev) => [
            {
                "delete-output": {
                    label: "Delete output",
                    callback: () => {
                        if (this.PERMANENT)
                            return void _managers_ToastManager__WEBPACK_IMPORTED_MODULE_4__.ToastManager.toast({
                                message: "This output is permanent and cannot be deleted.",
                                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                                duration: 2500,
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
            ...prev.slice(2),
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
    move({ x, y }) {
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
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
/* harmony export */   "NandGate": () => (/* binding */ NandGate),
/* harmony export */   "NorGate": () => (/* binding */ NorGate),
/* harmony export */   "NotGate": () => (/* binding */ NotGate),
/* harmony export */   "OrGate": () => (/* binding */ OrGate),
/* harmony export */   "XnorGate": () => (/* binding */ XnorGate),
/* harmony export */   "XorGate": () => (/* binding */ XorGate),
/* harmony export */   "chips": () => (/* binding */ chips)
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
const chips = new Map([AndGate, OrGate, NotGate, NandGate, NorGate, XorGate, XnorGate, BufferGate].map((gate) => [gate.NAME, gate]));


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsQ0FBQztRQUV0RSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUs7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUU1RCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBRTVFLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFFMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFFMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFFNUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTTtRQUNULFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLElBQUk7V0FDSjtXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLENBQUM7V0FDRDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0Esc0dBQXNHO1dBQ3RHO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQSxFQUFFO1dBQ0Y7V0FDQTs7Ozs7V0NoRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvYXVnbWVudHMvV2F0Y2hlZFNldC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9maWxlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2tleWJpbmRzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL0tleWJpbmRzTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTWVudU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL01vZGFsTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTW91c2VNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU2VsZWN0aW9uTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvU3RvcmFnZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1dpcmluZ01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21lbnUudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3ByZW1hZGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3ByZW1hZGUvbmFuZHMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvQ29tcG9uZW50LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL0lucHV0LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL091dHB1dC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9SZWlmaWVkLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL2NoaXBzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsZXMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvYXN5bmMgbW9kdWxlIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBXYXRjaGVkU2V0PFQ+IGV4dGVuZHMgU2V0PFQ+IHtcbiAgICAjYWRkcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcbiAgICAjZGVsZXRlcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcbiAgICAjYXR0ZW1wdGVkQWRkcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcbiAgICAjYXR0ZW1wdGVkRGVsZXRlcyA9IG5ldyBTZXQ8KGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZD4oKTtcblxuICAgICNsb2NrZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGl0ZW1zPzogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPHR5cGVvZiBTZXQ8VD4+WzBdKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgaWYgKGl0ZW1zKSB0aGlzLmFkZEFsbChbLi4uaXRlbXNdKTtcbiAgICB9XG5cbiAgICBvbkFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYWRkcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkRlbGV0ZShydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jZGVsZXRlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkF0dGVtcHRlZEFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkQWRkcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkF0dGVtcHRlZERlbGV0ZShydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkRGVsZXRlcy5hZGQocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZBZGQocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2FkZHMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb2ZmRGVsZXRlKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNkZWxldGVzLmRlbGV0ZShydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZkF0dGVtcHRlZEFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYXR0ZW1wdGVkQWRkcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZBdHRlbXB0ZWREZWxldGUocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2F0dGVtcHRlZERlbGV0ZXMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWRkQWxsKGl0ZW1zOiBUW10pIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5hZGQoaXRlbSkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRlbGV0ZUFsbChpdGVtczogVFtdKSB7XG4gICAgICAgIHJldHVybiBpdGVtcy5tYXAoKGl0ZW0pID0+IHRoaXMuZGVsZXRlKGl0ZW0pKTtcbiAgICB9XG5cbiAgICBhZGQoaXRlbTogVCkge1xuICAgICAgICBpZiAodGhpcy4jbG9ja2VkKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2F0dGVtcHRlZEFkZHNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdHMuZXZlcnkoKG91dCkgPT4gIW91dCkpIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFsuLi50aGlzLiNhZGRzXS5tYXAoKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBpdGVtLCB0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHMuc29tZSgob3V0KSA9PiBvdXQgPT09IGZhbHNlKSA/IHRoaXMgOiBzdXBlci5hZGQoaXRlbSk7XG4gICAgfVxuXG4gICAgZGVsZXRlKGl0ZW06IFQpIHtcbiAgICAgICAgaWYgKHRoaXMuI2xvY2tlZCkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IFsuLi50aGlzLiNhdHRlbXB0ZWREZWxldGVzXS5tYXAoKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBpdGVtLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHRzLmV2ZXJ5KChvdXQpID0+ICFvdXQpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2RlbGV0ZXNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0cy5zb21lKChvdXQpID0+IG91dCA9PT0gZmFsc2UpID8gZmFsc2UgOiBzdXBlci5kZWxldGUoaXRlbSk7XG4gICAgfVxuXG4gICAgbG9jaygpIHtcbiAgICAgICAgdGhpcy4jbG9ja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1bmxvY2soKSB7XG4gICAgICAgIHRoaXMuI2xvY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGdldCBsb2NrZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNsb2NrZWQ7XG4gICAgfVxuXG4gICAgY2xvbmUod2l0aExpc3RlbmVycz86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgc2V0ID0gbmV3IFdhdGNoZWRTZXQodGhpcyk7XG5cbiAgICAgICAgaWYgKHdpdGhMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuI2FkZHMuZm9yRWFjaCgocnVuKSA9PiBzZXQub25BZGQocnVuKSk7XG4gICAgICAgICAgICB0aGlzLiNkZWxldGVzLmZvckVhY2goKHJ1bikgPT4gc2V0Lm9uRGVsZXRlKHJ1bikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNldDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBOYXZpZ2F0b3Ige1xuICAgICAgICB1c2VyQWdlbnREYXRhPzogeyBwbGF0Zm9ybTogc3RyaW5nIH07XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFID0gMjQ7XG5leHBvcnQgY29uc3QgT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSA9IDI0O1xuZXhwb3J0IGNvbnN0IENISVBfQ09NUE9ORU5UX0NTU19XSURUSCA9IDEyMDtcbmV4cG9ydCBjb25zdCBDSElQX0NPTVBPTkVOVF9DU1NfSEVJR0hUID0gNDA7XG5leHBvcnQgY29uc3QgQ0hJUF9JTlBVVF9DU1NfU0laRSA9IDE2O1xuZXhwb3J0IGNvbnN0IENISVBfT1VUUFVUX0NTU19TSVpFID0gMTY7XG5leHBvcnQgY29uc3QgT1JJR0lOX1BPSU5UID0gT2JqZWN0LmZyZWV6ZSh7IHg6IDAsIHk6IDAgfSk7XG5leHBvcnQgY29uc3QgQUNUSVZBVEVEX0NTU19DT0xPUiA9IFwiI2ZmMjYyNlwiO1xuZXhwb3J0IGNvbnN0IExJR0hUX0dSQVlfQ1NTX0NPTE9SID0gXCIjZGVkZWRlXCI7XG5leHBvcnQgY29uc3QgSU5fREVCVUdfTU9ERSA9ICEhbmV3IFVSTChsb2NhdGlvbi5ocmVmKS5zZWFyY2hQYXJhbXMuaGFzKFwiZGVidWdcIik7XG5leHBvcnQgY29uc3QgSVNfTUFDX09TID0gW25hdmlnYXRvci51c2VyQWdlbnREYXRhPy5wbGF0Zm9ybSwgbmF2aWdhdG9yLnBsYXRmb3JtXS5zb21lKFxuICAgIChwbGF0Zm9ybSkgPT4gcGxhdGZvcm0/LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoXCJtYWNcIikgPz8gZmFsc2UsXG4pO1xuZXhwb3J0IGNvbnN0IExPQ0tFRF9GT1JfVEVTVElORyA9ICgpID0+XG4gICAgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiVGhlIGRpYWdyYW0gaXMgY3VycmVudGx5IGxvY2tlZCBmb3IgdGVzdGluZy4gTm8gY2hhbmdlcyBjYW4gYmUgbWFkZS5cIik7XG5leHBvcnQgY29uc3QgREVMQVkgPSAoZGVsYXk6IG51bWJlcikgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbmV4cG9ydCBjb25zdCBHRVRfQ0FOVkFTX0NUWCA9ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJjYW52YXNcIikhLmdldENvbnRleHQoXCIyZFwiKSE7XG5leHBvcnQgY29uc3QgQ09VTlRFUl9HRU5FUkFUT1IgPSBmdW5jdGlvbiogKGkgPSAwKSB7XG4gICAgd2hpbGUgKHRydWUpIHlpZWxkIGkrKztcbn07XG5leHBvcnQgY29uc3QgU0NVRkZFRF9VVUlEID0gKCkgPT5cbiAgICBEYXRlLm5vdygpLnRvU3RyaW5nKDM2KSArIE51bWJlcihEYXRlLm5vdygpLnRvU3RyaW5nKCkuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIikpLnRvU3RyaW5nKDM2KTtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIENPVU5URVJfR0VORVJBVE9SLCBJTl9ERUJVR19NT0RFIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZyB9IGZyb20gXCIuL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGNoaXBzIH0gZnJvbSBcIi4vcmVpZmllZC9jaGlwc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZERpYWdyYW0gPSB7XG4gICAgY29tcG9uZW50czogKFxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIHR5cGU6IFwiSU5QVVRcIjtcbiAgICAgICAgICAgICAgYWN0aXZhdGVkOiBib29sZWFuO1xuICAgICAgICAgICAgICBpZDogbnVtYmVyO1xuICAgICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAgIHk6IG51bWJlcjtcbiAgICAgICAgICB9XG4gICAgICAgIHwge1xuICAgICAgICAgICAgICByZWlmaWVkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHBlcm1hbmVudDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgdHlwZTogXCJPVVRQVVRcIjtcbiAgICAgICAgICAgICAgYWN0aXZhdGVkOiBib29sZWFuO1xuICAgICAgICAgICAgICBpZDogbnVtYmVyO1xuICAgICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAgIHk6IG51bWJlcjtcbiAgICAgICAgICB9XG4gICAgICAgIHwge1xuICAgICAgICAgICAgICByZWlmaWVkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHBlcm1hbmVudDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgdHlwZTogXCJDT01QT05FTlRcIjtcbiAgICAgICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgICBpbnB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgb3V0cHV0czogeyBpZDogbnVtYmVyOyBhY3RpdmF0ZWQ6IGJvb2xlYW4gfVtdO1xuICAgICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAgIHk6IG51bWJlcjtcbiAgICAgICAgICB9XG4gICAgKVtdO1xuICAgIHdpcmVzOiB7IGZyb206IG51bWJlcjsgdG86IG51bWJlciB9W107XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURpYWdyYW0oY29tcG9uZW50czogUmVpZmllZFtdLCB3aXJlczogV2lyaW5nW10pIHtcbiAgICBjb25zdCBpZCA9IENPVU5URVJfR0VORVJBVE9SKCk7XG5cbiAgICBjb25zdCBpZHMgPSBuZXcgTWFwPEVsZW1lbnQsIG51bWJlcj4oKTtcblxuICAgIGNvbnN0IGRhdGE6IFNlcmlhbGl6ZWREaWFncmFtID0ge1xuICAgICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzLm1hcCgoY29tcG9uZW50LCByZWlmaWVkKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZHMuc2V0KGNvbXBvbmVudC5lbGVtZW50LCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQsXG4gICAgICAgICAgICAgICAgICAgIHBlcm1hbmVudDogY29tcG9uZW50LnBlcm1hbmVuY2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiSU5QVVRcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVkOiBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZHMuZ2V0KGNvbXBvbmVudC5lbGVtZW50KSEsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgaWRzLnNldChjb21wb25lbnQuZWxlbWVudCwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIk9VVFBVVFwiLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkcy5nZXQoY29tcG9uZW50LmVsZW1lbnQpISxcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICBwZXJtYW5lbnQ6IGNvbXBvbmVudC5wZXJtYW5lbmNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb21wb25lbnQuY2hpcC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IGNvbXBvbmVudC5pbnB1dHMubWFwKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KGksIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChpKSEsIGFjdGl2YXRlZDogaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IGNvbXBvbmVudC5vdXRwdXRzLm1hcCgobykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChvLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQobykhLCBhY3RpdmF0ZWQ6IG8uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byBzZXJpYWxpemUgZGlhZ3JhbS5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIFJlaWZpZWQgY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICB9KSxcbiAgICAgICAgd2lyZXM6IHdpcmVzXG4gICAgICAgICAgICAuZmlsdGVyKCh3aXJlKSA9PiAhd2lyZS5kZXN0cm95ZWQpXG4gICAgICAgICAgICAubWFwKCh3aXJlKSA9PiAoe1xuICAgICAgICAgICAgICAgIGZyb206IGlkcy5nZXQod2lyZS5mcm9tKSEsXG4gICAgICAgICAgICAgICAgdG86IGlkcy5nZXQod2lyZS50bykhLFxuICAgICAgICAgICAgfSkpLFxuICAgIH07XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSwgdW5kZWZpbmVkLCBJTl9ERUJVR19NT0RFID8gNCA6IHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRmlsZShcbiAgICBmaWxlOiBzdHJpbmcsXG4pOiB7IGVycm9yOiBzdHJpbmc7IHJlc3VsdDogW10gfSB8IHsgZXJyb3I6IHVuZGVmaW5lZDsgcmVzdWx0OiBbY29tcG9uZW50czogUmVpZmllZFtdLCB3aXJlczogV2lyaW5nW11dIH0ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGZpbGUpO1xuXG4gICAgICAgIHZhbGlkYXRlKGRhdGEpO1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gbmV3IE1hcDxudW1iZXIsIEVsZW1lbnQ+KCk7XG5cbiAgICAgICAgY29uc3QgcmVpZmllZCA9IGRhdGEuY29tcG9uZW50cy5tYXAoKHJhdykgPT4ge1xuICAgICAgICAgICAgaWYgKHJhdy50eXBlID09PSBcIklOUFVUXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IG5ldyBJbnB1dChyYXcpO1xuXG4gICAgICAgICAgICAgICAgaW5wdXQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pZCwgaW5wdXQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmF3LnBlcm1hbmVudCA/IGlucHV0LnBlcm1hbmVudCgpIDogaW5wdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyYXcudHlwZSA9PT0gXCJPVVRQVVRcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dCA9IG5ldyBPdXRwdXQocmF3KTtcblxuICAgICAgICAgICAgICAgIG91dHB1dC5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3LmlkLCBvdXRwdXQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmF3LnBlcm1hbmVudCA/IG91dHB1dC5wZXJtYW5lbnQoKSA6IG91dHB1dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudChuZXcgKGNoaXBzLmdldChyYXcubmFtZSkhKSgpLCByYXcpO1xuXG4gICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLmZvckVhY2goKGlucHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmlucHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaW5wdXRzW2luZGV4XS5pZCwgaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbXBvbmVudC5vdXRwdXRzLmZvckVhY2goKG91dHB1dCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcub3V0cHV0c1tpbmRleF0uYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcub3V0cHV0c1tpbmRleF0uaWQsIG91dHB1dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJhdy5wZXJtYW5lbnQgPyBjb21wb25lbnQucGVybWFuZW50KCkgOiBjb21wb25lbnQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHdpcmVzID0gZGF0YS53aXJlcy5tYXAoKHsgZnJvbSwgdG8gfSkgPT4gbmV3IFdpcmluZyhlbGVtZW50cy5nZXQoZnJvbSkhLCBlbGVtZW50cy5nZXQodG8pISkpO1xuXG4gICAgICAgIHJldHVybiB7IHJlc3VsdDogW3JlaWZpZWQsIHdpcmVzXSwgZXJyb3I6IHVuZGVmaW5lZCB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIHsgZXJyb3I6IGUubWVzc2FnZSwgcmVzdWx0OiBbXSB9O1xuXG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIkZhaWxlZCB0byBwcm9jZXNzIGZpbGUuXCIsIHJlc3VsdDogW10gfTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKGRhdGE6IHVua25vd24pOiBhc3NlcnRzIGRhdGEgaXMgU2VyaWFsaXplZERpYWdyYW0ge1xuICAgIGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBub3QgYW4gb2JqZWN0LlwiKTtcblxuICAgIGlmICghKFwiY29tcG9uZW50c1wiIGluIGRhdGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG1pc3NpbmcgY29tcG9uZW50cy5cIik7XG5cbiAgICBpZiAoIShcIndpcmVzXCIgaW4gZGF0YSkpIHRocm93IG5ldyBFcnJvcihcIkRhdGEgaXMgbWlzc2luZyB3aXJlcy5cIik7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5jb21wb25lbnRzKSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50cyBkYXRhIGlzIG5vdCBhbiBhcnJheS5cIik7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS53aXJlcykpIHRocm93IG5ldyBFcnJvcihcIldpcmVzIGRhdGEgaXMgbm90IGFuIGFycmF5LlwiKTtcblxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGRhdGEuY29tcG9uZW50cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQgfHwgdHlwZW9mIGNvbXBvbmVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgbXVzdCBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwicmVpZmllZFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIHJlaWZpZWQgaWQuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnJlaWZpZWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJlaWZpZWQgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJwZXJtYW5lbnRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBwZXJtYW5lbmNlIHN0YXR1cy5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQucGVybWFuZW50ICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHBlcm1hbmVuY2UgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuXG4gICAgICAgIGlmICghKFwidHlwZVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIGEgdHlwZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQudHlwZSAhPT0gXCJzdHJpbmdcIiB8fCAhW1wiSU5QVVRcIiwgXCJPVVRQVVRcIiwgXCJDT01QT05FTlRcIl0uaW5jbHVkZXMoY29tcG9uZW50LnR5cGUpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb21wb25lbnQgdHlwZS5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJ4XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50cyBkYXRhIGlzIG1pc3NpbmcgYSB4IGNvb3JkaW5hdGUuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB4IGNvb3JkaW5hdGUgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJ5XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50cyBkYXRhIGlzIG1pc3NpbmcgYSB5IGNvb3JkaW5hdGUuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnkgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB5IGNvb3JkaW5hdGUgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgc3dpdGNoIChjb21wb25lbnQudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcIklOUFVUXCI6XG4gICAgICAgICAgICBjYXNlIFwiT1VUUFVUXCI6IHtcbiAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiSS9PIGRhdGEgaXMgbWlzc2luZyBpZHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkkvTyBpZCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwiYWN0aXZhdGVkXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiSS9PIGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJDT01QT05FTlRcIjoge1xuICAgICAgICAgICAgICAgIGlmICghKFwiaW5wdXRzXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBpbnB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbXBvbmVudC5pbnB1dHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgaW5wdXRzIGRhdGEgbXVzdCBiZSBhbiBhcnJheS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcIm91dHB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgZGF0YSBpcyBtaXNzaW5nIG91dHB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbXBvbmVudC5vdXRwdXRzKSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IG91dHB1dHMgZGF0YSBtdXN0IGJlIGFuIGFycmF5LlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwibmFtZVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3NpbmcgY2hpcCBuYW1lLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm5hbWUgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkNoaXAgbmFtZSBtdXN0IGJlIGEgc3RyaW5nLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghY2hpcHMuaGFzKGNvbXBvbmVudC5uYW1lLnRyaW0oKS50b1VwcGVyQ2FzZSgpKSkgdGhyb3cgbmV3IEVycm9yKFwiQ2hpcCBuYW1lIGRvZXNuJ3QgZXhpc3QuXCIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgQ2hpcCA9IGNoaXBzLmdldChjb21wb25lbnQubmFtZS50cmltKCkudG9VcHBlckNhc2UoKSkhO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5pbnB1dHMubGVuZ3RoICE9PSBDaGlwLklOUFVUUylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGlucHV0cyBkb2VzIG5vdCBtYXRjaCBjaGlwIGlucHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50Lm91dHB1dHMubGVuZ3RoICE9PSBDaGlwLk9VVFBVVFMpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBvdXRwdXRzIGRvZXMgbm90IG1hdGNoIGNoaXAgb3V0cHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGNvbXBvbmVudC5pbnB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpZCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImFjdGl2YXRlZFwiIGluIGlucHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG91dHB1dCBvZiBjb21wb25lbnQub3V0cHV0cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdXRwdXQgfHwgdHlwZW9mIG91dHB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gb3V0cHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGlkLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG91dHB1dC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpZCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImFjdGl2YXRlZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuYWN0aXZhdGVkICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQWN0aXZhdGlvbiBzdGF0dXMgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaWRzID0gZGF0YS5jb21wb25lbnRzLmZsYXRNYXA8bnVtYmVyPigoY29tcG9uZW50KSA9PlxuICAgICAgICBjb21wb25lbnQudHlwZSA9PT0gXCJDT01QT05FTlRcIlxuICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQuaW5wdXRzLm1hcCgoeyBpZCB9OiB7IGlkOiBudW1iZXIgfSkgPT4gaWQpLFxuICAgICAgICAgICAgICAgICAgLi4uY29tcG9uZW50Lm91dHB1dHMubWFwKCh7IGlkIH06IHsgaWQ6IG51bWJlciB9KSA9PiBpZCksXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIDogY29tcG9uZW50LmlkLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHdpcmUgb2YgZGF0YS53aXJlcyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCF3aXJlIHx8IHR5cGVvZiB3aXJlICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgbXVzdCBiZSBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwiZnJvbVwiIGluIHdpcmUpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgaXMgbWlzc2luZyB0aGUgY29tcG9uZW50IGl0IHN0YXJ0cyBmcm9tLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUuZnJvbSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIG11c3QgcmVmZXJlbmNlIG51bWVyaWMgaWRzLlwiKTtcblxuICAgICAgICBpZiAoIShcInRvXCIgaW4gd2lyZSkpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBpcyBtaXNzaW5nIHRoZSB0YXJnZXQgY29tcG9uZW50LlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUudG8gIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBtdXN0IHJlZmVyZW5jZSBudW1lcmljIGlkcy5cIik7XG5cbiAgICAgICAgaWYgKCFpZHMuaW5jbHVkZXMod2lyZS5mcm9tKSB8fCAhaWRzLmluY2x1ZGVzKHdpcmUudG8pKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgcmVmZXJlbmNlcyBpbnZhbGlkIGlkcy5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgY29uc3RhbnRzIGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZnJvbUZpbGUgfSBmcm9tIFwiLi9maWxlc1wiO1xuaW1wb3J0IHsga2V5YmluZHMgfSBmcm9tIFwiLi9rZXliaW5kc1wiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudVwiO1xuaW1wb3J0IHsgcHJlbWFkZSB9IGZyb20gXCIuL3ByZW1hZGVcIjtcbmltcG9ydCB7IGxvYWRTdHlsZXMgfSBmcm9tIFwiLi9zdHlsZXNcIjtcblxuT2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCBjb25zdGFudHMpO1xuXG5hd2FpdCBsb2FkU3R5bGVzKCk7IFxuXG5jb25zdCBocmVmQXNVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG5jb25zdCBzaG91bGRMb2FkSW5saW5lID0gaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJpbmxpbmVcIik7XG5cbmlmIChzaG91bGRMb2FkSW5saW5lKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaW5saW5lZCA9IGF0b2Ioc2hvdWxkTG9hZElubGluZSk7XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICByZXN1bHQ6IFtjb21wb25lbnRzLCB3aXJpbmdzXSxcbiAgICAgICAgfSA9IGZyb21GaWxlKGlubGluZWQpO1xuXG4gICAgICAgIGlmIChlcnJvcikgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBpbml0aWFsOiBbY29tcG9uZW50cyEsIHdpcmluZ3MhXSB9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoeyBrZXliaW5kcywgbWVudSwgc2F2ZTogXCJzYW5kYm94XCIgfSk7XG5cbiAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRGlhZ3JhbSBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuXCIsXG4gICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICB9KTtcblxuICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLmRlbGV0ZShcImlubGluZVwiKTtcblxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh1bmRlZmluZWQsIFwiXCIsIGhyZWZBc1VybCk7XG4gICAgfVxufSBlbHNlIHtcbiAgICBjb25zdCBzYXZlID0gaHJlZkFzVXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJzYXZlXCIpO1xuXG4gICAgaWYgKHNhdmUpIHtcbiAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoeyBrZXliaW5kcywgbWVudSwgc2F2ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzaG91bGRMb2FkUHJlbWFkZSA9IGhyZWZBc1VybC5zZWFyY2hQYXJhbXMuZ2V0KFwicHJlbWFkZVwiKTtcblxuICAgICAgICBpZiAoc2hvdWxkTG9hZFByZW1hZGUgJiYgcHJlbWFkZS5oYXMoc2hvdWxkTG9hZFByZW1hZGUudHJpbSgpLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICBwcmVtYWRlLmdldChzaG91bGRMb2FkUHJlbWFkZS50cmltKCkudG9Mb3dlckNhc2UoKSkhKHsgbmFtZTogc2hvdWxkTG9hZFByZW1hZGUudHJpbSgpLnRvTG93ZXJDYXNlKCkgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBzYXZlOiBcInNhbmRib3hcIiB9KTtcblxuICAgICAgICAgICAgaWYgKHNob3VsZExvYWRQcmVtYWRlKSB7XG4gICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJObyBwcmVtYWRlcyB3ZXJlIGZvdW5kIHdpdGggdGhhdCBuYW1lLlwiLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLmRlbGV0ZShcInByZW1hZGVcIik7XG5cbiAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh1bmRlZmluZWQsIFwiXCIsIGhyZWZBc1VybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5jb25zdCB1bmRvID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBTYW5kYm94TWFuYWdlci5wb3BIaXN0b3J5KCk7XG59O1xuXG5jb25zdCByZWRvID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBTYW5kYm94TWFuYWdlci5yZWRvSGlzdG9yeSgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGtleWJpbmRzOiBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD4gPSB7XG4gICAgXCJDb250cm9sTGVmdCtTaGlmdExlZnQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbyhlKTtcbiAgICB9LFxuICAgIFwiQ29udHJvbExlZnQrU2hpZnRSaWdodCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKGUpO1xuICAgIH0sXG4gICAgXCJDb250cm9sUmlnaHQrU2hpZnRMZWZ0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHJlZG8oZSk7XG4gICAgfSxcbiAgICBcIkNvbnRyb2xSaWdodCtTaGlmdFJpZ2h0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHJlZG8oZSk7XG4gICAgfSxcbiAgICBcIk1ldGFMZWZ0K1NoaWZ0TGVmdCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbyhlKTtcbiAgICB9LFxuICAgIFwiTWV0YUxlZnQrU2hpZnRSaWdodCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbyhlKTtcbiAgICB9LFxuICAgIFwiTWV0YVJpZ2h0K1NoaWZ0TGVmdCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbyhlKTtcbiAgICB9LFxuICAgIFwiTWV0YVJpZ2h0K1NoaWZ0UmlnaHQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHJlZG8oZSk7XG4gICAgfSxcbiAgICBcIkNvbnRyb2xMZWZ0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHVuZG8oZSk7XG4gICAgfSxcbiAgICBcIkNvbnRyb2xSaWdodCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICB1bmRvKGUpO1xuICAgIH0sXG4gICAgXCJNZXRhTGVmdCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgdW5kbyhlKTtcbiAgICB9LFxuICAgIFwiTWV0YVJpZ2h0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICB1bmRvKGUpO1xuICAgIH0sXG4gICAgQmFja3NwYWNlOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSgpO1xuICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gY29tcG9uZW50LmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gY29tcG9uZW50LmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5wdXNoKFt3aXJlLmZyb20sIHdpcmUudG9dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbGVhcigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmF0dGFjaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgoW2Zyb20sIHRvXSkgPT4gbmV3IFdpcmluZyhmcm9tLCB0bykpKTtcblxuICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfSxcbn07XG4iLCJpbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBEcmFnZ2luZ01hbmFnZXIge1xuICAgIHN0YXRpYyAjZHJhZ2dlZDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3dhdGNoZWQgPSBuZXcgTWFwKCk7XG5cbiAgICBzdGF0aWMgI21vdXNlID0geyB4OiAtMSwgeTogLTEsIG94OiAtMSwgb3k6IC0xLCBpeDogLTEsIGl5OiAtMSwgZG93bjogZmFsc2UgfTtcblxuICAgIHN0YXRpYyAjdG9wbGVmdDogRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjb3JpZ2luYWw6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjZG93bnBvcyA9IHsgeDogLTEsIHk6IC0xIH07XG5cbiAgICBzdGF0aWMgI3Bvc2l0aW9uczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9W10gfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgd2F0Y2goZWxlbWVudDogSFRNTEVsZW1lbnQsIHRhcmdldCA9IGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LndhdGNoZWQgPSBcInRydWVcIjtcblxuICAgICAgICBjb25zdCBtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IGVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuZGF0YXNldC5kcmFnZ2VkID0gXCJ0cnVlXCI7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiO1xuXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy4jZHJhZ2dlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMuI2RyYWdnZWQucGFyZW50RWxlbWVudD8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgPz8gbmV3IERPTVJlY3QoKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgICAgIHRoaXMuI21vdXNlLml4ID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgdGhpcy4jbW91c2UuaXkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgICAgIGlmIChTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm94ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0ICsgYm9keS5sZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm95ID0gZS5jbGllbnRZIC0gcmVjdC50b3AgKyBib2R5LnRvcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy4jcG9zaXRpb25zID0gWy4uLlNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWRdLm1hcCgodGFyZ2V0KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KHRhcmdldC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KHRhcmdldC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IFsuLi5TZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkXS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF4ID0gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF5ID0gcGFyc2VGbG9hdChhLmVsZW1lbnQuc3R5bGUudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnggPSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnkgPSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZCA9IE1hdGguc3FydChheCAqIGF4ICsgYXkgKiBheSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJkID0gTWF0aC5zcXJ0KGJ4ICogYnggKyBieSAqIGJ5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFkIC0gYmQ7XG4gICAgICAgICAgICAgICAgfSlbMF0uZWxlbWVudDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kcyA9IHRvcGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNtb3VzZS5veCA9IGUuY2xpZW50WCAtIGJvdW5kcy54O1xuICAgICAgICAgICAgICAgIHRoaXMuI21vdXNlLm95ID0gZS5jbGllbnRZIC0gYm91bmRzLnk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiN0b3BsZWZ0ID0gdG9wbGVmdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4jb3JpZ2luYWwgPSB7IHg6IHJlY3QubGVmdCwgeTogcmVjdC50b3AgfTtcbiAgICAgICAgfTtcblxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd24sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLiN3YXRjaGVkLnNldCh0YXJnZXQsIG1vdXNlZG93bik7XG4gICAgfVxuXG4gICAgc3RhdGljIGZvcmdldChlbGVtZW50OiBIVE1MRWxlbWVudCwgZm9yY2U/OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy4jd2F0Y2hlZC5nZXQoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKCFsaXN0ZW5lciAmJiAhZm9yY2UpIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBpcyBub3QgY3VycmVudGx5IGJlaW5nIHdhdGNoZWQuYCk7XG5cbiAgICAgICAgZGVsZXRlIGVsZW1lbnQuZGF0YXNldC53YXRjaGVkO1xuXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBsaXN0ZW5lciwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuXG4gICAgICAgIHRoaXMuI3dhdGNoZWQuZGVsZXRlKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy4jd2F0Y2hlZC5mb3JFYWNoKChfLCBlbGVtZW50KSA9PiB0aGlzLmZvcmdldChlbGVtZW50KSk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UgPSB7IHg6IC0xLCB5OiAtMSwgb3g6IC0xLCBveTogLTEsIGl4OiAtMSwgaXk6IC0xLCBkb3duOiBmYWxzZSB9O1xuXG4gICAgICAgIHRoaXMuI2Rvd25wb3MgPSB7IHg6IC0xLCB5OiAtMSB9O1xuXG4gICAgICAgIHRoaXMuI3RvcGxlZnQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNvcmlnaW5hbCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNwb3NpdGlvbnMgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgdGhpcy5kZWFmZW4oKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWFmZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZW1vdmUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIGlmICh0aGlzLiNkcmFnZ2VkKSB7XG4gICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiNkcmFnZ2VkLnN0eWxlLmxlZnQgPSB0aGlzLiNtb3VzZS54IC0gdGhpcy4jbW91c2Uub3ggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50b3AgPSB0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kgKyBcInB4XCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvcGxlZnQgPSB0aGlzLiN0b3BsZWZ0IS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMuI21vdXNlLnggLSB0aGlzLiNtb3VzZS5veCArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UuaXggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLml5ID0gZS5jbGllbnRZO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XG5cbiAgICAgICAgY29uc3QgaXNPbkludmFsaWRUYXJnZXQgPSBbXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1pbnB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiYnV0dG9uLmJvYXJkLW91dHB1dFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiZGl2LmNvbnRleHRtZW51XCIpLFxuICAgICAgICBdLmZpbmQoKGVsZW1lbnQpID0+IGVsZW1lbnQgIT09IG51bGwpITtcblxuICAgICAgICBpZiAoIWlzT25JbnZhbGlkVGFyZ2V0ICYmIGUuYnV0dG9uID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnkgPSBlLmNsaWVudFk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNtb3VzZS5kb3duID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZXVwID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICBpZiAodGhpcy4jZHJhZ2dlZCkge1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ1tkYXRhLWRyYWdnZWQ9XCJ0cnVlXCJdJykuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlLmRhdGFzZXQuZHJhZ2dlZDtcblxuICAgICAgICAgICAgICAgIGUuc3R5bGUuY3Vyc29yID0gXCJcIjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5zaXplIDw9IDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLiNkcmFnZ2VkO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vdXNlID0gdGhpcy4jbW91c2U7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSB0aGlzLiNvcmlnaW5hbCE7XG5cbiAgICAgICAgICAgICAgICBpZiAobW91c2UueCAhPT0gbW91c2UuaXggfHwgbW91c2UueSAhPT0gbW91c2UuaXkpXG4gICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5sZWZ0ID0gbW91c2UueCAtIG1vdXNlLm94IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gbW91c2UueSAtIG1vdXNlLm95IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmxlZnQgPSBvcmlnaW5hbC54IC0gMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gb3JpZ2luYWwueSAtIDEgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuI21vdXNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldHMgPSBbLi4uU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZF07XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy4jcG9zaXRpb25zITtcbiAgICAgICAgICAgICAgICBjb25zdCB0b3BsZWZ0ID0gdGhpcy4jdG9wbGVmdCEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAobW91c2UueCAhPT0gbW91c2UuaXggfHwgbW91c2UueSAhPT0gbW91c2UuaXkpXG4gICAgICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IG1vdXNlLnggLSBtb3VzZS5veCArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbW91c2UueSAtIG1vdXNlLm95ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKChjb21wb25lbnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUocG9zaXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnggIT09IC0xICYmXG4gICAgICAgICAgICB0aGlzLiNkb3ducG9zLnkgIT09IC0xICYmXG4gICAgICAgICAgICBNb3VzZU1hbmFnZXIubW91c2UueCAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55ICE9PSAtMVxuICAgICAgICApXG4gICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdEFsbEluKERyYWdnaW5nTWFuYWdlci4jZG93bnBvcywgTW91c2VNYW5hZ2VyLm1vdXNlKTtcblxuICAgICAgICB0aGlzLiNtb3VzZSA9IHsgeDogLTEsIHk6IC0xLCBveDogLTEsIG95OiAtMSwgaXg6IC0xLCBpeTogLTEsIGRvd246IGZhbHNlIH07XG5cbiAgICAgICAgdGhpcy4jZG93bnBvcyA9IHsgeDogLTEsIHk6IC0xIH07XG5cbiAgICAgICAgdGhpcy4jdG9wbGVmdCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLiNkcmFnZ2VkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI29yaWdpbmFsID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuI3Bvc2l0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB9O1xuXG4gICAgc3RhdGljIGdldCBkb3ducG9zKCkge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLiNkb3ducG9zIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgY2xhc3MgS2V5YmluZHNNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2tleW1hcCA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xuXG4gICAgc3RhdGljICNrZXljaG9yZHMgPSBuZXcgQXJyYXk8W3N0cmluZywgKChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKVtdXT4oKTtcblxuICAgIHN0YXRpYyAja2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5zZXQoZS5jb2RlLCB0cnVlKTtcblxuICAgICAgICBpZiAoZS5tZXRhS2V5ICYmIChlLmNvZGUgPT09IFwiU2hpZnRMZWZ0XCIgfHwgZS5jb2RlID09PSBcIlNoaWZ0UmlnaHRcIikgJiYgSVNfTUFDX09TKVxuICAgICAgICAgICAgdGhpcy4ja2V5bWFwID0gbmV3IE1hcChbLi4udGhpcy4ja2V5bWFwLmVudHJpZXMoKV0uZmlsdGVyKChba2V5XSkgPT4gIWtleS5zdGFydHNXaXRoKFwiS2V5XCIpKSk7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGNvbnN0IFssIHJ1bnNdID1cbiAgICAgICAgICAgICAgICB0aGlzLiNrZXljaG9yZHMuZmluZCgoW2Nob3JkXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQga2V5cyA9IGNob3JkLnNwbGl0KFwiK1wiKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja1NoaWZ0ID0ga2V5cy5pbmNsdWRlcyhcIlNoaWZ0TGVmdFwiKSB8fCBrZXlzLmluY2x1ZGVzKFwiU2hpZnRSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tNZXRhID0ga2V5cy5pbmNsdWRlcyhcIk1ldGFMZWZ0XCIpIHx8IGtleXMuaW5jbHVkZXMoXCJNZXRhUmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrQWx0ID0ga2V5cy5pbmNsdWRlcyhcIkFsdExlZnRcIikgfHwga2V5cy5pbmNsdWRlcyhcIkFsdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja0N0cmwgPSBrZXlzLmluY2x1ZGVzKFwiQ29udHJvbExlZnRcIikgfHwga2V5cy5pbmNsdWRlcyhcIkNvbnRyb2xSaWdodFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tTaGlmdCkga2V5cyA9IGtleXMuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJTaGlmdExlZnRcIiAmJiBrZXkgIT09IFwiU2hpZnRSaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrTWV0YSkga2V5cyA9IGtleXMuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJNZXRhTGVmdFwiICYmIGtleSAhPT0gXCJNZXRhUmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja0FsdCkga2V5cyA9IGtleXMuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJBbHRMZWZ0XCIgJiYga2V5ICE9PSBcIkFsdFJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tDdHJsKSBrZXlzID0ga2V5cy5maWx0ZXIoKGtleSkgPT4ga2V5ICE9PSBcIkNvbnRyb2xMZWZ0XCIgJiYga2V5ICE9PSBcIkNvbnRyb2xSaWdodFwiKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5cy5ldmVyeSgoa2V5KSA9PiB0aGlzLiNrZXltYXAuZ2V0KGtleSkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tTaGlmdCA/IGUuc2hpZnRLZXkgOiB0cnVlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrTWV0YSA/IGUubWV0YUtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tBbHQgPyBlLmFsdEtleSA6IHRydWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hlY2tDdHJsID8gZS5jdHJsS2V5IDogdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KSA/PyBbXTtcblxuICAgICAgICAgICAgaWYgKHJ1bnMpIHJ1bnMuZm9yRWFjaCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGUpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzdGF0aWMgI2tleXVwID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmRlbGV0ZShlLmNvZGUpO1xuXG4gICAgICAgIGlmICghZS5tZXRhS2V5ICYmIChlLmNvZGUgPT09IFwiTWV0YUxlZnRcIiB8fCBlLmNvZGUgPT09IFwiTWV0YVJpZ2h0XCIpICYmIElTX01BQ19PUykgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjYmx1ciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuI2tleWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy4ja2V5dXApO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCB0aGlzLiNibHVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVhZmVuKCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLiNrZXlkb3duKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuI2tleXVwKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy4jYmx1cik7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uS2V5Q2hvcmQoY2hvcmQ6IHN0cmluZywgcnVuOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICBjaG9yZCA9IGNob3JkLnNwbGl0KFwiK1wiKS5zb3J0KCkuam9pbihcIitcIik7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNrZXljaG9yZHMuZmluZCgoW2tleV0pID0+IGtleSA9PT0gY2hvcmQpPy5bMV0ucHVzaChydW4pKSB0aGlzLiNrZXljaG9yZHMucHVzaChbY2hvcmQsIFtydW5dXSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bkFuZE5vRm9jdXMoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy4ja2V5bWFwLmdldChrZXkpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bihrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gISF0aGlzLiNrZXltYXAuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLiNrZXltYXAuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLiNrZXljaG9yZHMgPSBbXTtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQ29udGV4dCA9IHtcbiAgICBtZW51OiBIVE1MRWxlbWVudDtcbiAgICBjbGlja3M6IE1hcDxzdHJpbmcsICgpID0+IHZvaWQ+O1xuICAgIGxpc3RlbmVyczoge1xuICAgICAgICBtb3VzZWRvd246IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgICAgICBjb250ZXh0bWVudTogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgICAgIGNsaWNrOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICB9O1xufTtcblxuZXhwb3J0IHR5cGUgTWVudU1hbmFnZXJBY3Rpb25zID0gQXJyYXk8UmVjb3JkPHN0cmluZywgeyBsYWJlbDogc3RyaW5nOyBjYWxsYmFjazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQgfT4+O1xuXG5leHBvcnQgY2xhc3MgTWVudU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSAjZWxlbWVudHMgPSBuZXcgTWFwPEhUTUxFbGVtZW50LCBNZW51TWFuYWdlckNvbnRleHQ+KCk7XG5cbiAgICBzdGF0aWMgI29wZW5lZDogTW91c2VFdmVudDtcblxuICAgIHN0YXRpYyB1c2UoZWxlbWVudDogSFRNTEVsZW1lbnQsIGFjdGlvbnM6IE1lbnVNYW5hZ2VyQWN0aW9ucykge1xuICAgICAgICBjb25zdCBtZW51ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZXh0bWVudVwiPlxuICAgICAgICAgICAgICAgICR7YWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAubWFwKChyZWNvcmQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhyZWNvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoW25hbWUsIHsgbGFiZWwgfV0pID0+IGA8YnV0dG9uIGNsYXNzPVwiJHtuYW1lfVwiPiR7bGFiZWx9PC9idXR0b24+YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKSxcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAuam9pbignPGRpdiBjbGFzcz1cImJyXCI+PC9kaXY+Jyl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICBjb25zdCBjbGlja3MgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgY29uc3Qgc2V0dXAgPSAoYWN0aW9uczogTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB7XG4gICAgICAgICAgICBjbGlja3MuY2xlYXIoKTtcblxuICAgICAgICAgICAgbWVudS5pbm5lckhUTUwgPSBhY3Rpb25zXG4gICAgICAgICAgICAgICAgLm1hcCgocmVjb3JkKSA9PlxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhyZWNvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChbbmFtZSwgeyBsYWJlbCB9XSkgPT4gYDxidXR0b24gY2xhc3M9XCIke25hbWV9XCI+JHtsYWJlbH08L2J1dHRvbj5gKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcIiksXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5qb2luKCc8ZGl2IGNsYXNzPVwiYnJcIj48L2Rpdj4nKTtcblxuICAgICAgICAgICAgYWN0aW9ucy5mb3JFYWNoKChyZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhyZWNvcmQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGljayA9IHJlY29yZFtrZXldLmNhbGxiYWNrLmJpbmQodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLlwiICsga2V5KSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGNsaWNrKHRoaXMuI29wZW5lZCkpO1xuICAgICAgICAgICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLlwiICsga2V5KSEuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGljayh0aGlzLiNvcGVuZWQpLFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrcy5zZXQoa2V5LCBjbGlja3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGNvbnRleHQ6IE1lbnVNYW5hZ2VyQWN0aW9ucyB8IHVuZGVmaW5lZDtcblxuICAgICAgICBjb25zdCBnZXRBY3Rpb25zID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gY29udGV4dDtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobWVudSk7XG5cbiAgICAgICAgY29uc3QgbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI29wZW5lZCA9IGU7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjb250ZXh0bWVudSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBlLmNsaWVudFggKyBcInB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IGUuY2xpZW50WSArIFwicHhcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgY29udGV4dG1lbnUpO1xuICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGljayk7XG4gICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGNsaWNrKTtcblxuICAgICAgICB0aGlzLiNlbGVtZW50cy5zZXQoZWxlbWVudCwgeyBtZW51LCBjbGlja3MsIGxpc3RlbmVyczogeyBtb3VzZWRvd24sIGNvbnRleHRtZW51LCBjbGljayB9IH0pO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAobmV3Q29udGV4dDogKHByZXY6IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4gTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IG5ld0NvbnRleHQuY2FsbCh1bmRlZmluZWQsIFsuLi5hY3Rpb25zXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW1vdmUoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgeyBtZW51LCBjbGlja3MsIGxpc3RlbmVycyB9ID0gdGhpcy4jZWxlbWVudHMuZ2V0KGVsZW1lbnQpID8/IHt9O1xuXG4gICAgICAgIGlmICghbWVudSB8fCAhY2xpY2tzIHx8ICFsaXN0ZW5lcnMpIHRocm93IG5ldyBFcnJvcihgRWxlbWVudHMgYXJlIG5vdCBiZWluZyBhZmZlY3RlZC5gKTtcblxuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXJzLm1vdXNlZG93bik7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVycy5jb250ZXh0bWVudSk7XG4gICAgICAgIG1lbnUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVycy5jbGljayk7XG4gICAgICAgIG1lbnUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVycy5jbGljayk7XG5cbiAgICAgICAgQXJyYXkuZnJvbShjbGlja3MpLmZvckVhY2goKFtrZXksIGxpc3RlbmVyXSkgPT4ge1xuICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yKFwiLlwiICsga2V5KSEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIG1lbnUucXVlcnlTZWxlY3RvcihcIi5cIiArIGtleSkhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1lbnUucmVtb3ZlKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIE1vZGFsTWFuYWdlciB7XG4gICAgc3RhdGljIGdldCBjb250YWluZXIoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1jb250YWluZXJcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyAjb25Nb2RhbE1vdW50KCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPD0gMCkgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgICAgICBlbHNlIHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgI29uTW9kYWxSZXNvbHZlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IDw9IDApIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkIS5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtaW5hY3RpdmVcIik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkIS5jbGFzc0xpc3QuY29udGFpbnMoXCJtb2RhbC1hbGVydFwiKSkge1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgYWxlcnQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI29uTW9kYWxNb3VudCgpO1xuXG4gICAgICAgIGNvbnN0IGFsZXJ0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1hbGVydFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGFsZXJ0KTtcblxuICAgICAgICBhbGVydC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBhbGVydC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxSZXNvbHZlZCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGVzYyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXNjKTtcblxuICAgICAgICAgICAgYWxlcnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBkb25lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNvbmZpcm0obWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI29uTW9kYWxNb3VudCgpO1xuXG4gICAgICAgIGNvbnN0IGNvbmZpcm0gPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsIG1vZGFsLWNvbmZpcm1cIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1vZGFsLW1lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1va1wiPk9rPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1jYW5jZWxcIj5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbmZpcm0pO1xuXG4gICAgICAgIGNvbmZpcm0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKGZhbHNlKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9ICh2YWx1ZTogYm9vbGVhbikgPT4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbmZpcm0ucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBlc2MgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uZmlybS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgIGNvbmZpcm0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtY2FuY2VsXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcihmYWxzZSkpO1xuXG4gICAgICAgICAgICBjb25maXJtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcih0cnVlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBwcm9tcHQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI29uTW9kYWxNb3VudCgpO1xuXG4gICAgICAgIGNvbnN0IHByb21wdCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtY29uZmlybVwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibW9kYWwtaW5wdXRcIiB0eXBlPVwidGV4dFwiIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLWNhbmNlbFwiPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQocHJvbXB0KTtcblxuICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9tcHQucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBlc2MgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGVzYyk7XG5cbiAgICAgICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiLm1vZGFsLWlucHV0XCIpIS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1jYW5jZWxcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBNb3VzZU1hbmFnZXIge1xuICAgIHN0YXRpYyAjbW91c2UgPSB7IHg6IDAsIHk6IDAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vkb3ducyA9IG5ldyBTZXQ8KGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ+KCk7XG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZXVwcyA9IG5ldyBTZXQ8KGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ+KCk7XG5cbiAgICBzdGF0aWMgI21vdXNlbW92ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5mb3JFYWNoKChsKSA9PiBsLmNhbGwodW5kZWZpbmVkLCBlKSk7XG4gICAgfTtcblxuICAgIHN0YXRpYyAjbW91c2V1cCA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmZvckVhY2goKGwpID0+IGwuY2FsbCh1bmRlZmluZWQsIGUpKTtcbiAgICB9O1xuXG4gICAgc3RhdGljIHN0YXJ0KCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuI21vdXNlbW92ZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0b3AoKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcblxuICAgICAgICB0aGlzLiNtb3VzZSA9IHsgeDogMCwgeTogMCB9O1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG5cbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5jbGVhcigpO1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5jbGVhcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbk1vdXNlRG93bihoYW5kbGVyOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmFkZChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgb25Nb3VzZVVwKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmFkZChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmTW91c2VEb3duKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuZGVsZXRlKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZNb3VzZVVwKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmRlbGV0ZShoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IG1vdXNlKCkge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLiNtb3VzZSB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFdhdGNoZWRTZXQgfSBmcm9tIFwiLi4vYXVnbWVudHMvV2F0Y2hlZFNldFwiO1xuaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGZyb21GaWxlLCBzYXZlRGlhZ3JhbSB9IGZyb20gXCIuLi9maWxlc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IEtleWJpbmRzTWFuYWdlciB9IGZyb20gXCIuL0tleWJpbmRzTWFuYWdlclwiO1xuaW1wb3J0IHsgTWVudU1hbmFnZXIsIE1lbnVNYW5hZ2VyQWN0aW9ucyB9IGZyb20gXCIuL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uTWFuYWdlciB9IGZyb20gXCIuL1NlbGVjdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7IFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSBcIi4vU3RvcmFnZU1hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nLCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vV2lyaW5nTWFuYWdlclwiO1xuXG50eXBlIFNhbmRib3hDb25maWcgPSB7XG4gICAga2V5YmluZHM/OiBSZWNvcmQ8c3RyaW5nLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZD47XG4gICAgbWVudT86IE1lbnVNYW5hZ2VyQWN0aW9ucztcbiAgICBpbml0aWFsPzogW2NvbXBvbmVudHM6IFJlaWZpZWRbXSwgd2lyZXM6IFdpcmluZ1tdXTtcbiAgICBsaW1pdHM/OiB7XG4gICAgICAgIGlucHV0cz86IG51bWJlcjtcbiAgICAgICAgb3V0cHV0cz86IG51bWJlcjtcbiAgICAgICAgd2lyaW5ncz86IG51bWJlcjtcbiAgICAgICAgY2hpcHM/OiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+O1xuICAgICAgICBjaGlwc1RvdGFsPzogbnVtYmVyO1xuICAgICAgICBjb21wb25lbnRzVG90YWw/OiBudW1iZXI7XG4gICAgfTtcbiAgICBzdGF0ZXM/OiB7IGlucHV0cz86IGJvb2xlYW5bXTsgb3V0cHV0cz86IGJvb2xlYW5bXTsgY2FsbGJhY2s6ICgpID0+IHZvaWQgfVtdO1xuICAgIHNhdmU/OiBzdHJpbmc7XG4gICAgb3ZlcnJpZGVTYXZlSWZFeGlzdHM/OiBib29sZWFuO1xuICAgIGNoZWNrSW50ZXJ2YWw/OiBudW1iZXI7XG4gICAgY2hlY2tTdGF0ZT86IChyZWlmaWVkOiBXYXRjaGVkU2V0PFJlaWZpZWQ+LCB3aXJpbmdzOiBXYXRjaGVkU2V0PFdpcmluZz4pID0+IGJvb2xlYW47XG4gICAgaWZTdGF0ZUNoZWNrZWQ/OiAoKSA9PiB2b2lkO1xufTtcblxuY29uc3QgY2FsY3VsYXRlUmVpZmllZFRvdGFscyA9IChzZXQ6IFNldDxSZWlmaWVkPikgPT5cbiAgICBbLi4uc2V0XS5yZWR1Y2UoXG4gICAgICAgIChtYXAsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBtYXAuaW5wdXRzVG90YWwrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbSBpbnN0YW5jZW9mIE91dHB1dCkge1xuICAgICAgICAgICAgICAgIG1hcC5vdXRwdXRzVG90YWwrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbSBpbnN0YW5jZW9mIENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIG1hcC5jaGlwc1RvdGFsKys7XG5cbiAgICAgICAgICAgICAgICBtYXAuY2hpcHMuc2V0KGl0ZW0uY2hpcC5uYW1lLCAobWFwLmNoaXBzLmdldChpdGVtLmNoaXAubmFtZSkgPz8gMCkgKyAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlucHV0c1RvdGFsOiAwLFxuICAgICAgICAgICAgb3V0cHV0c1RvdGFsOiAwLFxuICAgICAgICAgICAgY2hpcHNUb3RhbDogMCxcbiAgICAgICAgICAgIGNoaXBzOiBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpLFxuICAgICAgICB9LFxuICAgICk7XG5cbmV4cG9ydCBjbGFzcyBTYW5kYm94TWFuYWdlciB7XG4gICAgc3RhdGljIHF1ZXVlTmV3Q29udGV4dDogUmV0dXJuVHlwZTx0eXBlb2YgTWVudU1hbmFnZXJbXCJ1c2VcIl0+WzBdO1xuXG4gICAgc3RhdGljIHdhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMgPSBuZXcgU2V0PCgpID0+IHZvaWQ+KCk7XG5cbiAgICBzdGF0aWMgI2ludGVydmFsID0gLTE7XG4gICAgc3RhdGljICNvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyAjaGlzdG9yeSA9IG5ldyBBcnJheTxbY29tbWFuZDogKCkgPT4gdm9pZCwgcmVkbzogKCkgPT4gdm9pZF0+KCk7XG4gICAgc3RhdGljICNyZWRvcyA9IG5ldyBBcnJheTxbY29tbWFuZDogKCkgPT4gdm9pZCwgcmVkbzogKCkgPT4gdm9pZF0+KCk7XG5cbiAgICBzdGF0aWMgI2NvbmZpZzogU2FuZGJveENvbmZpZztcblxuICAgIHN0YXRpYyBzZXR1cChjb25maWc6IFNhbmRib3hDb25maWcpIHtcbiAgICAgICAgaWYgKHRoaXMuI29ic2VydmVyKSB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNpbnRlcnZhbCk7XG5cbiAgICAgICAgdGhpcy4jY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRhaW5lciBtb2RhbC1pbmFjdGl2ZVwiPjwvZGl2PmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGRpdiBjbGFzcz1cInJlaWZpZWQtcm9vdFwiPjwvZGl2PmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGNhbnZhcz48L2NhbnZhcz5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxkaXYgY2xhc3M9XCJ0b2FzdHMtY29udGFpbmVyXCI+PC9kaXY+YCk7XG5cbiAgICAgICAgTW91c2VNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgICAgIEtleWJpbmRzTWFuYWdlci5saXN0ZW4oKTtcbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmxpc3RlbigpO1xuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLmxpc3RlbigpO1xuICAgICAgICBXaXJpbmdNYW5hZ2VyLnN0YXJ0KCk7XG5cbiAgICAgICAgY29uc3QgY3JlYXRlUmVpZmllZEFjdGl2ZSA9IChjb21wb25lbnRzOiBSZWlmaWVkW10pID0+XG4gICAgICAgICAgICBuZXcgV2F0Y2hlZFNldDxSZWlmaWVkPigpXG4gICAgICAgICAgICAgICAgLm9uQWRkKChpdGVtLCBzZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG90YWxzID0gY2FsY3VsYXRlUmVpZmllZFRvdGFscyhzZXQuY2xvbmUoKS5hZGQoaXRlbSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFscy5jaGlwc1RvdGFsICsgdG90YWxzLmlucHV0c1RvdGFsICsgdG90YWxzLm91dHB1dHNUb3RhbCA+XG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy4jY29uZmlnLmxpbWl0cz8uY29tcG9uZW50c1RvdGFsID8/IEluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJFeGNlZWRlZCB0b3RhbCBjb21wb25lbnRzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbHMuaW5wdXRzVG90YWwgPiAodGhpcy4jY29uZmlnLmxpbWl0cz8uaW5wdXRzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIGlucHV0cyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxzLm91dHB1dHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5vdXRwdXRzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIG91dHB1dHMgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFscy5jaGlwc1RvdGFsID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LmNoaXBzVG90YWwgPz8gSW5maW5pdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgY2hpcHMgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSBpbnN0YW5jZW9mIENvbXBvbmVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxzLmNoaXBzLmhhcyhpdGVtLmNoaXAubmFtZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFscy5jaGlwcy5nZXQoaXRlbS5jaGlwLm5hbWUpISA+ICh0aGlzLiNjb25maWcubGltaXRzPy5jaGlwcz8uW2l0ZW0uY2hpcC5uYW1lXSA/PyBJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBFeGNlZWRlZCB0b3RhbCAnJHtpdGVtLmNoaXAubmFtZX0nIGxpbWl0LmAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWRkQWxsKGNvbXBvbmVudHMpO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZVdpcmluZ3NTZXQgPSAod2lyaW5nczogV2lyaW5nW10pID0+XG4gICAgICAgICAgICBuZXcgV2F0Y2hlZFNldDxXaXJpbmc+KClcbiAgICAgICAgICAgICAgICAub25BZGQoKF8sIHNldCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0LnNpemUgKyAxID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LndpcmluZ3MgPz8gSW5maW5pdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgd2lyaW5ncyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5hZGRBbGwod2lyaW5ncyk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcubWVudSAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIFt0aGlzLnF1ZXVlTmV3Q29udGV4dF0gPSBNZW51TWFuYWdlci51c2UoUmVpZmllZC5yb290LCB0aGlzLiNjb25maWcubWVudSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcua2V5YmluZHMgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzLiNjb25maWcua2V5YmluZHMpLmZvckVhY2goKFtjaG9yZCwgcnVuXSkgPT4gS2V5YmluZHNNYW5hZ2VyLm9uS2V5Q2hvcmQoY2hvcmQsIHJ1bikpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLmluaXRpYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUgPSBjcmVhdGVSZWlmaWVkQWN0aXZlKHRoaXMuI2NvbmZpZy5pbml0aWFsWzBdKTtcblxuICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQuYXR0YWNoKCkpO1xuXG4gICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzID0gY3JlYXRlV2lyaW5nc1NldCh0aGlzLiNjb25maWcuaW5pdGlhbFsxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5zYXZlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlID0gU3RvcmFnZU1hbmFnZXIuZ2V0PHN0cmluZz4oXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlKTtcblxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IFtjb21wb25lbnRzLCB3aXJlc10sXG4gICAgICAgICAgICAgICAgfSA9IGZyb21GaWxlKGZpbGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLmRlbGV0ZShcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUpO1xuXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byByZWFkIGZyb20gc2F2ZXMuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuI2NvbmZpZy5vdmVycmlkZVNhdmVJZkV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZSA9IGNyZWF0ZVJlaWZpZWRBY3RpdmUoY29tcG9uZW50cyEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5hdHRhY2goKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMgPSBjcmVhdGVXaXJpbmdzU2V0KHdpcmVzISk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcuc2F2ZSAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXG4gICAgICAgICAgICAgICAgICAgIFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSxcbiAgICAgICAgICAgICAgICAgICAgc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNvYnNlcnZlci5vYnNlcnZlKFJlaWZpZWQucm9vdCwge1xuICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZSxcbiAgICAgICAgICAgIGNoYXJhY3RlckRhdGFPbGRWYWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuI2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2hlY2sgPSB0aGlzLiNjb25maWcuY2hlY2tTdGF0ZT8uKFJlaWZpZWQuYWN0aXZlLmNsb25lKCksIFdpcmluZ01hbmFnZXIud2lyZXMuY2xvbmUoKSkgPz8gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChjaGVjaykgdGhpcy4jY29uZmlnLmlmU3RhdGVDaGVja2VkPy4oKTtcbiAgICAgICAgfSwgdGhpcy4jY29uZmlnLmNoZWNrSW50ZXJ2YWwgPz8gNTApIGFzIG5ldmVyO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuI29ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNpbnRlcnZhbCk7XG5cbiAgICAgICAgdGhpcy4jaW50ZXJ2YWwgPSAtMTtcblxuICAgICAgICBNb3VzZU1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgS2V5YmluZHNNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5yZXNldCgpO1xuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIuc3RvcCgpO1xuXG4gICAgICAgIE1lbnVNYW5hZ2VyLnJlbW92ZShSZWlmaWVkLnJvb3QpO1xuXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZm9yRWFjaCgoZmluaXNoKSA9PiBmaW5pc2guY2FsbCh1bmRlZmluZWQpKTtcblxuICAgICAgICB0aGlzLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuY2xlYXIoKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgdGhpcy4jY29uZmlnID0ge307XG5cbiAgICAgICAgdGhpcy4jaGlzdG9yeSA9IFtdO1xuICAgICAgICB0aGlzLiNyZWRvcyA9IFtdO1xuICAgIH1cblxuICAgIHN0YXRpYyBjbGVhcigpIHtcbiAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQuZGV0YWNoKCkpO1xuXG4gICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4gd2lyZS5kZXN0cm95KCkpO1xuXG4gICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcHVzaEhpc3RvcnkoY29tbWFuZDogKCkgPT4gdm9pZCwgdW5kbzogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNyZWRvcy5sZW5ndGggPSAwO1xuXG4gICAgICAgIGNvbW1hbmQuY2FsbCh1bmRlZmluZWQpO1xuXG4gICAgICAgIHRoaXMuI2hpc3RvcnkucHVzaChbY29tbWFuZCwgdW5kb10pO1xuICAgIH1cblxuICAgIHN0YXRpYyBwb3BIaXN0b3J5KCkge1xuICAgICAgICBpZiAoIXRoaXMuI2hpc3RvcnkubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vdGhpbmcgdG8gdW5kby5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IFtyZWRvLCB1bmRvXSA9IHRoaXMuI2hpc3RvcnkucG9wKCkhO1xuXG4gICAgICAgIHRoaXMuI3JlZG9zLnB1c2goW3JlZG8sIHVuZG9dKTtcblxuICAgICAgICByZXR1cm4gdW5kby5jYWxsKHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlZG9IaXN0b3J5KCkge1xuICAgICAgICBpZiAoIXRoaXMuI3JlZG9zLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJOb3RoaW5nIHRvIHJlZG8uXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBbY29tbWFuZCwgdW5kb10gPSB0aGlzLiNyZWRvcy5wb3AoKSE7XG5cbiAgICAgICAgdGhpcy4jaGlzdG9yeS5wdXNoKFtjb21tYW5kLCB1bmRvXSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbW1hbmQuY2FsbCh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBzYXZlVG8oc2F2ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI2NvbmZpZy5zYXZlID0gc2F2ZTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5oYXMoXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlKSAmJlxuICAgICAgICAgICAgIShhd2FpdCBNb2RhbE1hbmFnZXIuY29uZmlybShcbiAgICAgICAgICAgICAgICBcIlRoZXJlIGlzIGFscmVhZHkgYSBzYXZlIHdpdGggdGhpcyBuYW1lLiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVwbGFjZSBpdD9cIixcbiAgICAgICAgICAgICkpXG4gICAgICAgIClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLCBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElTX01BQ19PUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGZyb21GaWxlLCBzYXZlRGlhZ3JhbSB9IGZyb20gXCIuLi9maWxlc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IG92ZXJsYXBwZWRCb3VuZHMsIFJlaWZpZWQgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4vVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vV2lyaW5nTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uTWFuYWdlciB7XG4gICAgc3RhdGljIHNlbGVjdGVkID0gbmV3IFdhdGNoZWRTZXQ8UmVpZmllZD4oKTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcblxuICAgICAgICBjb25zdCBlbGVtZW50ID0gW1xuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCJidXR0b24uYm9hcmQtaW5wdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImJ1dHRvbi5ib2FyZC1vdXRwdXRcIiksXG4gICAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcImRpdi5jb21wb25lbnRcIiksXG4gICAgICAgIF0uZmluZCgoZWxlbWVudCkgPT4gZWxlbWVudCAhPT0gbnVsbCkhO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbmQoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmVsZW1lbnQgPT09IGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChyZWlmaWVkKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKElTX01BQ19PUyAmJiAoS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIk1ldGFMZWZ0XCIpIHx8IEtleWJpbmRzTWFuYWdlci5pc0tleURvd24oXCJNZXRhUmlnaHRcIikpKSB8fFxuICAgICAgICAgICAgICAgICghSVNfTUFDX09TICYmIChLZXliaW5kc01hbmFnZXIuaXNLZXlEb3duKFwiQ29udHJvbExlZnRcIikgfHwgS2V5YmluZHNNYW5hZ2VyLmlzS2V5RG93bihcIkNvbnRyb2xSaWdodFwiKSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3Rpb24ocmVpZmllZCk7XG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5zZWxlY3RlZC5oYXMocmVpZmllZCkpIHRoaXMuc2VsZWN0KHJlaWZpZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjY29weSA9IGFzeW5jIChlOiBDbGlwYm9hcmRFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC5zaXplKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gWy4uLnRoaXMuc2VsZWN0ZWRdO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gc2F2ZURpYWdyYW0oXG4gICAgICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICAgICAgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgKHdpcmluZykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LnNvbWUoKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkgcmV0dXJuIHdpcmluZy5mcm9tID09PSBjb21wb25lbnQuZWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQub3V0cHV0cy5zb21lKChvdXRwdXQpID0+IHdpcmluZy5mcm9tID09PSBvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkuc29tZSgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSByZXR1cm4gd2lyaW5nLnRvID09PSBjb21wb25lbnQuZWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQuaW5wdXRzLnNvbWUoKGlucHV0KSA9PiB3aXJpbmcudG8gPT09IGlucHV0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGRhdGEpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjcGFzdGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgcmVzdWx0OiBbY29tcG9uZW50cywgd2lyaW5nc10sXG4gICAgICAgIH0gPSBmcm9tRmlsZShhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCkpO1xuXG4gICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHBhc3RlIGRpYWdyYW0gZGF0YS5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlID0geyAuLi5Nb3VzZU1hbmFnZXIubW91c2UgfTtcblxuICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZEFsbChjb21wb25lbnRzISk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50cyEuZXZlcnkoKGNvbXBvbmVudCkgPT4gUmVpZmllZC5hY3RpdmUuaGFzKGNvbXBvbmVudCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMhLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4gaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNvbXBvbmVudC51cGRhdGUoKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoTW91c2VNYW5hZ2VyLm1vdXNlLnggIT09IC0xICYmIE1vdXNlTWFuYWdlci5tb3VzZS55ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wbGVmdCA9IGNvbXBvbmVudHMhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXggPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS5sZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXkgPSBwYXJzZUZsb2F0KGEuZWxlbWVudC5zdHlsZS50b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBieCA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBieSA9IHBhcnNlRmxvYXQoYi5lbGVtZW50LnN0eWxlLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkID0gTWF0aC5zcXJ0KGF4ICogYXggKyBheSAqIGF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmQgPSBNYXRoLnNxcnQoYnggKiBieCArIGJ5ICogYnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWQgLSBiZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVswXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzIS5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogbW91c2UueCArIG9mZnNldC5sZWZ0IC0gdG9wbGVmdC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBtb3VzZS55ICsgb2Zmc2V0LnRvcCAtIHRvcGxlZnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbCh3aXJpbmdzISk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMhLmZvckVhY2goKGNvbXBvbmVudCkgPT4gdGhpcy5hZGRTZWxlY3Rpb24oY29tcG9uZW50KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGVBbGwoY29tcG9uZW50cyEpO1xuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cyEuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kZXRhY2goKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZGVsZXRlQWxsKHdpcmluZ3MhKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKChjb21wb25lbnQpID0+IHRoaXMuYWRkU2VsZWN0aW9uKGNvbXBvbmVudCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgc3RhdGljIHNlbGVjdChyZWlmaWVkOiBSZWlmaWVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZChyZWlmaWVkKTtcblxuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IChjb21wb25lbnQuZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMFwiKSk7XG5cbiAgICAgICAgcmVpZmllZC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwMFwiO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZWxlY3RBbGxJbihmcm9tOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sIHRvOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuXG4gICAgICAgIGNvbnN0IHJlaWZpZWQgPSBbLi4uUmVpZmllZC5hY3RpdmVdLmZpbHRlcigoY29tcG9uZW50KSA9PlxuICAgICAgICAgICAgb3ZlcmxhcHBlZEJvdW5kcyhjb21wb25lbnQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgZnJvbSwgdG8pLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkQWxsKHJlaWZpZWQpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwXCIpKTtcblxuICAgICAgICByZWlmaWVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwMFwiKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFNlbGVjdGlvbihyZWlmaWVkOiBSZWlmaWVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkKHJlaWZpZWQpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gKGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiMTAwXCIpKTtcblxuICAgICAgICByZWlmaWVkLmVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDAwXCI7XG4gICAgfVxuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsIHRoaXMuI2NvcHkpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIiwgdGhpcy4jcGFzdGUpO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWFmZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29weVwiLCB0aGlzLiNjb3B5KTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIHRoaXMuI3Bhc3RlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTdG9yYWdlTWFuYWdlciB7XG4gICAgc3RhdGljIHJlYWRvbmx5IHByZWZpeCA9IFwia2Vsc255LmdhdGVzaW06XCI7XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbiAgICBzdGF0aWMgc2V0PFQ+KGtleTogc3RyaW5nLCB2YWx1ZTogVCk6IFQge1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldDxUPihrZXk6IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSkhKSA/PyB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGhhcyhrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXggKyBrZXkpICE9PSBudWxsO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWxldGUoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMucHJlZml4ICsga2V5KSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMucHJlZml4ICsga2V5KTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBERUxBWSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IE1vZGFsTWFuYWdlciB9IGZyb20gXCIuL01vZGFsTWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuL1dpcmluZ01hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFRlc3RpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI3Rlc3RpbmcgPSBmYWxzZTtcblxuICAgIHN0YXRpYyBhc3luYyB0ZXN0KGNhc2VzOiBbaW5wdXRzOiBib29sZWFuW10sIG91dHB1dHM6IGJvb2xlYW5bXV1bXSwgeyB0aW1lb3V0ID0gMTAwMCB9OiB7IHRpbWVvdXQ/OiBudW1iZXIgfSA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLiN0ZXN0aW5nKSByZXR1cm4gTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiRGlhZ3JhbSBpcyBhbHJlYWR5IHVuZGVyIHRlc3RpbmcuXCIpO1xuXG4gICAgICAgIHRoaXMuI3Rlc3RpbmcgPSB0cnVlO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLmxvY2soKTtcbiAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5sb2NrKCk7XG5cbiAgICAgICAgY29uc3QgaW5wdXRzID0gWy4uLlJlaWZpZWQuYWN0aXZlXVxuICAgICAgICAgICAgLmZpbHRlcigoY29tcG9uZW50KTogY29tcG9uZW50IGlzIElucHV0ID0+IGNvbXBvbmVudCBpbnN0YW5jZW9mIElucHV0KVxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCkgLSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApKTtcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZV1cbiAgICAgICAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCk6IGNvbXBvbmVudCBpcyBPdXRwdXQgPT4gY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KVxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IHBhcnNlRmxvYXQoYS5lbGVtZW50LnN0eWxlLnRvcCkgLSBwYXJzZUZsb2F0KGIuZWxlbWVudC5zdHlsZS50b3ApKTtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbEFjdGl2YXRpb25zID0gaW5wdXRzLm1hcCgoaW5wdXQpID0+IGlucHV0LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcblxuICAgICAgICBsZXQgZmFpbGVkID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChjb25zdCBbZ2l2ZW5JbnB1dHMsIGV4cGVjdGVkT3V0cHV0c10gb2YgY2FzZXMpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dHMubGVuZ3RoICE9PSBnaXZlbklucHV0cy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcIk1pc21hdGNoZWQgaW5wdXQgbGVuZ3Rocy5cIik7XG4gICAgICAgICAgICBpZiAob3V0cHV0cy5sZW5ndGggIT09IGV4cGVjdGVkT3V0cHV0cy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcIk1pc21hdGNoZWQgb3V0cHV0IGxlbmd0aHMuXCIpO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtpbmRleCwgaW5wdXRdIG9mIGlucHV0cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgZ2l2ZW5JbnB1dHNbaW5kZXhdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgREVMQVkodGltZW91dCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlYWxPdXRwdXRzID0gb3V0cHV0cy5tYXAoKG91dHB1dCkgPT4gb3V0cHV0LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcblxuICAgICAgICAgICAgaWYgKCFyZWFsT3V0cHV0cy5ldmVyeSgob3V0LCBpKSA9PiBvdXQgPT09IGV4cGVjdGVkT3V0cHV0c1tpXSkpIHtcbiAgICAgICAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgYXdhaXQgTW9kYWxNYW5hZ2VyLmFsZXJ0KFxuICAgICAgICAgICAgICAgICAgICBgRGlhZ3JhbSBmYWlsZWQgdG8gcGFzcyB0aGUgdGVzdCB3aXRoIGlucHV0cyBcIiR7ZXhwZWN0ZWRPdXRwdXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChib29sZWFuKSA9PiArYm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiIFwiKX1cIi5gLFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgREVMQVkoMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZhaWxlZCkgYXdhaXQgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiRGlhZ3JhbSBwYXNzZWQgYWxsIHRoZSB0ZXN0cy5cIik7XG5cbiAgICAgICAgb3JpZ2luYWxBY3RpdmF0aW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4gaW5wdXRzW2ldLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCB2YWx1ZSkpO1xuXG4gICAgICAgIFJlaWZpZWQuYWN0aXZlLnVubG9jaygpO1xuICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLnVubG9jaygpO1xuXG4gICAgICAgIHRoaXMuI3Rlc3RpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHRlc3RpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiN0ZXN0aW5nO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9hc3REYXRhIHtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgY29sb3I6IHN0cmluZztcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgVG9hc3RNYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0cy1jb250YWluZXJcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyB0b2FzdCh7IG1lc3NhZ2UsIGNvbG9yLCBkdXJhdGlvbiB9OiBUb2FzdERhdGEpIHtcbiAgICAgICAgY29uc3QgdG9hc3QgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0b2FzdC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xvc2UtdG9hc3RcIj7ilbM8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRvYXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0LWNvbG9yXCIpIS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcblxuICAgICAgICB0b2FzdC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGR1cmF0aW9uICsgXCJtc1wiO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRvYXN0KTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0b2FzdC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0b2FzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbG9zZS10b2FzdFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIpO1xuXG4gICAgICAgICAgICB0b2FzdC5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIGhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIEdFVF9DQU5WQVNfQ1RYLCBMSUdIVF9HUkFZX0NTU19DT0xPUiwgTE9DS0VEX0ZPUl9URVNUSU5HIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb3VzZU1hbmFnZXIgfSBmcm9tIFwiLi9Nb3VzZU1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuL1Rlc3RpbmdNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBOZXdXaXJlQ29udGV4dCB7XG4gICAgc3RhdGljIGZyb206IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIHtcbiAgICAgICAgTW91c2VNYW5hZ2VyLm9uTW91c2VEb3duKChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoTmV3V2lyZUNvbnRleHQuZnJvbSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSBlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm9hcmQtb3V0cHV0XCIpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY29tcG9uZW50LWlucHV0LWJ1dHRvblwiKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSBOZXdXaXJlQ29udGV4dC5mcm9tO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkKG5ldyBXaXJpbmcoZnJvbSwgdGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd2lyZSBvZiBXaXJpbmdNYW5hZ2VyLndpcmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBmcm9tICYmIHdpcmUudG8gPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZGVsZXRlKHdpcmUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdpcmluZyB7XG4gICAgI2Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgICNvYnNlcnZlcjtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGZyb206IEVsZW1lbnQsIHJlYWRvbmx5IHRvOiBFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuI29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgdG8uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBmcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ28oKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLiNkZXN0cm95ZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG5cbiAgICBnbygpIHtcbiAgICAgICAgdGhpcy4jZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmZyb20sIHsgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSwgYXR0cmlidXRlczogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBnZXQgZGVzdHJveWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jZGVzdHJveWVkO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdpcmluZ01hbmFnZXIge1xuICAgIHN0YXRpYyAjckFGID0gLTE7XG5cbiAgICBzdGF0aWMgd2lyZXMgPSBuZXcgV2F0Y2hlZFNldDxXaXJpbmc+KCk7XG5cbiAgICBzdGF0aWMgdXBkYXRlKCkge1xuICAgICAgICBjb25zdCBjdHggPSBHRVRfQ0FOVkFTX0NUWCgpO1xuXG4gICAgICAgIGN0eC5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgY3R4LmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICBpZiAod2lyZS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aXJlcy5sb2NrZWQpIHdpcmUuZ28oKTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMud2lyZXMuZGVsZXRlKHdpcmUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmcm9tID0gd2lyZS5mcm9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgdG8gPSB3aXJlLnRvLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgd2lyZS5mcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSk7XG5cbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHdpcmUuZnJvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgPyBBQ1RJVkFURURfQ1NTX0NPTE9SIDogTElHSFRfR1JBWV9DU1NfQ09MT1I7XG5cbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSA1O1xuXG4gICAgICAgICAgICBjdHgubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBjdHgubGluZVRvKHRvLnggKyB0by53aWR0aCAvIDIsIHRvLnkgKyB0by5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKE5ld1dpcmVDb250ZXh0LmZyb20pIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSBOZXdXaXJlQ29udGV4dC5mcm9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBOZXdXaXJlQ29udGV4dC5mcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKVxuICAgICAgICAgICAgICAgID8gQUNUSVZBVEVEX0NTU19DT0xPUlxuICAgICAgICAgICAgICAgIDogTElHSFRfR1JBWV9DU1NfQ09MT1I7XG5cbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSA1O1xuXG4gICAgICAgICAgICBjdHgubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oZnJvbS54ICsgZnJvbS53aWR0aCAvIDIsIGZyb20ueSArIGZyb20uaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBjdHgubGluZVRvKE1vdXNlTWFuYWdlci5tb3VzZS54LCBNb3VzZU1hbmFnZXIubW91c2UueSk7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54ICE9PSAtMSAmJlxuICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueSAhPT0gLTEgJiZcbiAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS54ICE9PSAtMSAmJlxuICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnkgIT09IC0xXG4gICAgICAgICkge1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gQUNUSVZBVEVEX0NTU19DT0xPUjtcblxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDIuNTtcblxuICAgICAgICAgICAgY3R4LmxpbmVKb2luID0gXCJtaXRlclwiO1xuXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdChcbiAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54LFxuICAgICAgICAgICAgICAgIERyYWdnaW5nTWFuYWdlci5kb3ducG9zLnksXG4gICAgICAgICAgICAgICAgTW91c2VNYW5hZ2VyLm1vdXNlLnggLSBEcmFnZ2luZ01hbmFnZXIuZG93bnBvcy54LFxuICAgICAgICAgICAgICAgIE1vdXNlTWFuYWdlci5tb3VzZS55IC0gRHJhZ2dpbmdNYW5hZ2VyLmRvd25wb3MueSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGNvbXBvbmVudC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBBQ1RJVkFURURfQ1NTX0NPTE9SO1xuXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMTtcblxuICAgICAgICAgICAgY3R4LmxpbmVKb2luID0gXCJtaXRlclwiO1xuXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdChyZWN0LmxlZnQgLSAxMCwgcmVjdC50b3AgLSAxMCwgcmVjdC53aWR0aCArIDEwICsgMTAsIHJlY3QuaGVpZ2h0ICsgMTAgKyAxMCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdGFydCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0YXJ0LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuI3JBRiA9IGlkO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wKCkge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLiNyQUYpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUsXG4gICAgSU5fREVCVUdfTU9ERSxcbiAgICBMSUdIVF9HUkFZX0NTU19DT0xPUixcbiAgICBMT0NLRURfRk9SX1RFU1RJTkcsXG4gICAgT1JJR0lOX1BPSU5ULFxuICAgIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZnJvbUZpbGUsIHNhdmVEaWFncmFtIH0gZnJvbSBcIi4vZmlsZXNcIjtcbmltcG9ydCB7IGtleWJpbmRzIH0gZnJvbSBcIi4va2V5YmluZHNcIjtcbmltcG9ydCB7IE1lbnVNYW5hZ2VyQWN0aW9ucyB9IGZyb20gXCIuL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9TZWxlY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1N0b3JhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBjaGlwcyB9IGZyb20gXCIuL3JlaWZpZWQvY2hpcHNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuL3JlaWZpZWQvT3V0cHV0XCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjb25zdCBtZW51OiBNZW51TWFuYWdlckFjdGlvbnMgPSBbXG4gICAge1xuICAgICAgICBcImluc2VydC1jaGlwXCI6IHtcbiAgICAgICAgICAgIGxhYmVsOiBcIkluc2VydCBjaGlwXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGF3YWl0IE1vZGFsTWFuYWdlci5wcm9tcHQoXCJFbnRlciB0aGUgY2hpcCdzIG5hbWU6XCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjaGlwID0gY2hpcHMuZ2V0KG5hbWUudG9VcHBlckNhc2UoKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNoaXApIHJldHVybiBNb2RhbE1hbmFnZXIuYWxlcnQoXCJObyBjaGlwIHdhcyBmb3VuZCB3aXRoIHRoYXQgbmFtZS5cIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KFJlZmxlY3QuY29uc3RydWN0KGNoaXAsIFtdKSwgT1JJR0lOX1BPSU5UKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChjb21wb25lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKGNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGdldENvbXB1dGVkU3R5bGUoY29tcG9uZW50LmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1vdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBwYXJzZUZsb2F0KHdpZHRoKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIHBhcnNlRmxvYXQoaGVpZ2h0KSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgICBcIm5ldy1pbnB1dFwiOiB7XG4gICAgICAgICAgICBsYWJlbDogXCJOZXcgaW5wdXRcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IG5ldyBJbnB1dCh7XG4gICAgICAgICAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBTZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdGVkLmNsb25lKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQoaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKGlucHV0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LmF0dGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3QoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUoaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJuZXctb3V0cHV0XCI6IHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk5ldyBvdXRwdXRcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBuZXcgT3V0cHV0KHtcbiAgICAgICAgICAgICAgICAgICAgeDogZS5jbGllbnRYIC0gT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICAgICAgICAgIHk6IGUuY2xpZW50WSAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gU2VsZWN0aW9uTWFuYWdlci5zZWxlY3RlZC5jbG9uZSh0cnVlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKG91dHB1dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMob3V0cHV0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KG91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZShvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0ZWQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIFwiY29weS11cmxcIjoge1xuICAgICAgICAgICAgbGFiZWw6IFwiQ29weSBsaW5rXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhyZWZBc1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cbiAgICAgICAgICAgICAgICBocmVmQXNVcmwuc2VhcmNoUGFyYW1zLnNldChcImlubGluZVwiLCBidG9hKHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSkpKTtcblxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGhyZWZBc1VybC5ocmVmKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFwic2F2ZS10b1wiOiB7XG4gICAgICAgICAgICBsYWJlbDogXCJTYXZlIHdpdGggbmFtZVwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIldoYXQgc2hvdWxkIGJlIHRoZSBuYW1lIG9mIHRoaXMgc2F2ZT9cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGF3YWl0IFNhbmRib3hNYW5hZ2VyLnNhdmVUbyhuYW1lKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFwibG9hZC1mcm9tXCI6IHtcbiAgICAgICAgICAgIGxhYmVsOiBcIkxvYWQgZnJvbSBzYXZlc1wiLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzYXZlID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIldoaWNoIHNhdmUgd291bGQgeW91IGxpa2UgdG8gbG9hZD9cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNhdmUgIT09IFwic3RyaW5nXCIpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmICghU3RvcmFnZU1hbmFnZXIuaGFzKFwic2F2ZXM6XCIgKyBzYXZlKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1vZGFsTWFuYWdlci5hbGVydChcIk5vIHNhdmUgd2FzIGZvdW5kIHdpdGggdGhhdCBuYW1lLlwiKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnJlc2V0KCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBzYXZlIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJzYXZlLWFzXCI6IHtcbiAgICAgICAgICAgIGxhYmVsOiBcIlNhdmUgYXMgZmlsZVwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpLCB7XG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IFVSTC5jcmVhdGVPYmplY3RVUkwoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgQmxvYihbc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKV0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBkb3dubG9hZDogYGdhdGVzaW0tJHtEYXRlLm5vdygpfS5qc29uYCxcbiAgICAgICAgICAgICAgICB9KS5jbGljaygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJpbXBvcnQtZnJvbVwiOiB7XG4gICAgICAgICAgICBsYWJlbDogXCJJbXBvcnQgZnJvbSBmaWxlXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gT2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksIHsgdHlwZTogXCJmaWxlXCIgfSk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5jbGljaygpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IG5ldyBQcm9taXNlPEZpbGUgfCB1bmRlZmluZWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4gcmVzb2x2ZShpbnB1dC5maWxlcz8uWzBdID8/IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5wdXQub25lcnJvciA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk5vIGZpbGUgd2FzIHByb3ZpZGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByYXcgPSBhd2FpdCBuZXcgUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKHJlYWRlci5yZXN1bHQ/LnRvU3RyaW5nKCkgPz8gdW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghcmF3KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHJlYWQgdGhlIGZpbGUuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogW2NvbXBvbmVudHMsIHdpcmVzXSxcbiAgICAgICAgICAgICAgICB9ID0gZnJvbUZpbGUocmF3KTtcblxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7IG1lc3NhZ2U6IGVycm9yLCBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUiwgZHVyYXRpb246IDI1MDAgfSk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5yZXNldCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIuc2V0dXAoe1xuICAgICAgICAgICAgICAgICAgICBrZXliaW5kcyxcbiAgICAgICAgICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgICAgICAgICAgc2F2ZTogXCJzYW5kYm94XCIsXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWw6IFtjb21wb25lbnRzISwgd2lyZXMhXSxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcnJpZGVTYXZlSWZFeGlzdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJzYXZlczpcIiArIFwic2FuZGJveFwiLCBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAuLi4oSU5fREVCVUdfTU9ERVxuICAgICAgICA/IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXN0LWFsZXJ0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IGFsZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiVGhpcyBpcyBhbiBhbGVydC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInRlc3QtY29uZmlybVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCBjb25maXJtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgTW9kYWxNYW5hZ2VyLmNvbmZpcm0oXCJUaGlzIGlzIGEgY29uZmlybWF0aW9uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwidGVzdC1wcm9tcHRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3QgcHJvbXB0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgTW9kYWxNYW5hZ2VyLnByb21wdChcIlRoaXMgaXMgYSBwcm9tcHQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJ0ZXN0LXRvYXN0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IHRvYXN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhpcyBpcyBhIHRvYXN0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IExJR0hUX0dSQVlfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcIndpcGUtc3RvcmFnZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiV2lwZSBzdG9yYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuc3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInN0b3AtcmVuZGVyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTdG9wIHJlbmRlcmluZyB3aXJlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJzdGFydC1yZW5kZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlN0YXJ0IHJlbmRlcmluZyB3aXJlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pLFxuXTtcbiIsImltcG9ydCB7IGtleWJpbmRzIH0gZnJvbSBcIi4uL2tleWJpbmRzXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuLi9tZW51XCI7XG5pbXBvcnQgeyBuYW5kcyB9IGZyb20gXCIuL25hbmRzXCI7XG5cbmV4cG9ydCBjb25zdCBwcmVtYWRlID0gbmV3IE1hcDxzdHJpbmcsIChjdHg6IHsgbmFtZTogc3RyaW5nIH0pID0+IHZvaWQ+KFtcbiAgICBbXCJzYW5kYm94XCIsICgpID0+IFNhbmRib3hNYW5hZ2VyLnNldHVwKHsga2V5YmluZHMsIG1lbnUsIHNhdmU6IFwic2FuZGJveFwiIH0pXSxcbiAgICAuLi5PYmplY3QuZW50cmllcyhuYW5kcyksXG5dKTtcbiIsImltcG9ydCB7IGtleWJpbmRzIH0gZnJvbSBcIi4uL2tleWJpbmRzXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IG1lbnUgfSBmcm9tIFwiLi4vbWVudVwiO1xuaW1wb3J0IHsgTmFuZEdhdGUgfSBmcm9tIFwiLi4vcmVpZmllZC9jaGlwc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4uL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vcmVpZmllZC9PdXRwdXRcIjtcblxuZXhwb3J0IGNvbnN0IG5hbmRzOiBSZWNvcmQ8c3RyaW5nLCAoY3R4OiB7IG5hbWU6IHN0cmluZyB9KSA9PiB2b2lkPiA9IHtcbiAgICBcIm5hbmQ6bm90XCI6ICh7IG5hbWU6IHNhdmUgfSkgPT4ge1xuICAgICAgICBtZW51LnNwbGljZSgyLCAwLCB7XG4gICAgICAgICAgICB0ZXN0OiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IFwiVGVzdCBzb2x1dGlvblwiLFxuICAgICAgICAgICAgICAgIGFzeW5jIGNhbGxiYWNrKCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBUZXN0aW5nTWFuYWdlci50ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbZmFsc2VdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGltZW91dDogMjUwIH0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHtcbiAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgIHNhdmUsXG4gICAgICAgICAgICBpbml0aWFsOiBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDEwMCB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudChuZXcgTmFuZEdhdGUoKSwgeyB4OiAzMDAsIHk6IDEwMCB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IE91dHB1dCh7IHg6IDUwMCwgeTogMTAwIH0pLFxuICAgICAgICAgICAgICAgIF0ubWFwKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5wZXJtYW5lbnQoKSksXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbGltaXRzOiB7XG4gICAgICAgICAgICAgICAgaW5wdXRzOiAxLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IDEsXG4gICAgICAgICAgICAgICAgY2hpcHNUb3RhbDogMSxcbiAgICAgICAgICAgICAgICB3aXJpbmdzOiAzLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHNUb3RhbDogMyxcbiAgICAgICAgICAgICAgICBjaGlwczogeyBOQU5EOiAxIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBNb2RhbE1hbmFnZXIuYWxlcnQoXCJSZWNyZWF0ZSBhIE5PVCBnYXRlIHVzaW5nIG9ubHkgYSBOQU5EIGdhdGUuXCIpO1xuICAgIH0sXG4gICAgXCJuYW5kOmFuZFwiOiAoeyBuYW1lOiBzYXZlIH0pID0+IHtcbiAgICAgICAgbWVudS5zcGxpY2UoMiwgMCwge1xuICAgICAgICAgICAgdGVzdDoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3Qgc29sdXRpb25cIixcbiAgICAgICAgICAgICAgICBhc3luYyBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgVGVzdGluZ01hbmFnZXIudGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCBmYWxzZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZSwgZmFsc2VdLCBbZmFsc2VdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCB0cnVlXSwgW2ZhbHNlXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1t0cnVlLCB0cnVlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRpbWVvdXQ6IDUwMCB9LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICBrZXliaW5kcyxcbiAgICAgICAgICAgIG1lbnUsXG4gICAgICAgICAgICBzYXZlLFxuICAgICAgICAgICAgaW5pdGlhbDogW1xuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAxMDAgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMjAwIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMTAwIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMjAwIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNTAwLCB5OiAxNTAgfSksXG4gICAgICAgICAgICAgICAgXS5tYXAoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LnBlcm1hbmVudCgpKSxcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBpbnB1dHM6IDIsXG4gICAgICAgICAgICAgICAgb3V0cHV0czogMSxcbiAgICAgICAgICAgICAgICBjaGlwc1RvdGFsOiAyLFxuICAgICAgICAgICAgICAgIHdpcmluZ3M6IDUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1RvdGFsOiA1LFxuICAgICAgICAgICAgICAgIGNoaXBzOiB7IE5BTkQ6IDIgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE1vZGFsTWFuYWdlci5hbGVydChcIlJlY3JlYXRlIGFuIEFORCBnYXRlIHVzaW5nIG9ubHkgTkFORCBnYXRlcy5cIik7XG4gICAgfSxcbiAgICBcIm5hbmQ6b3JcIjogKHsgbmFtZTogc2F2ZSB9KSA9PiB7XG4gICAgICAgIG1lbnUuc3BsaWNlKDIsIDAsIHtcbiAgICAgICAgICAgIHRlc3Q6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJUZXN0IHNvbHV0aW9uXCIsXG4gICAgICAgICAgICAgICAgYXN5bmMgY2FsbGJhY2soKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFRlc3RpbmdNYW5hZ2VyLnRlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1tmYWxzZSwgZmFsc2VdLCBbZmFsc2VdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW3RydWUsIGZhbHNlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCB0cnVlXSwgW3RydWVdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW3RydWUsIHRydWVdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGltZW91dDogNzUwIH0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHtcbiAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgIHNhdmUsXG4gICAgICAgICAgICBpbml0aWFsOiBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBuZXcgSW5wdXQoeyB4OiAxMDAsIHk6IDEwMCB9KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAyMDAgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAxMDAgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAxNTAgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnQobmV3IE5hbmRHYXRlKCksIHsgeDogMzAwLCB5OiAyMDAgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBPdXRwdXQoeyB4OiA2MDAsIHk6IDE1MCB9KSxcbiAgICAgICAgICAgICAgICBdLm1hcCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQucGVybWFuZW50KCkpLFxuICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGxpbWl0czoge1xuICAgICAgICAgICAgICAgIGlucHV0czogMixcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiAxLFxuICAgICAgICAgICAgICAgIGNoaXBzVG90YWw6IDMsXG4gICAgICAgICAgICAgICAgd2lyaW5nczogNyxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzVG90YWw6IDYsXG4gICAgICAgICAgICAgICAgY2hpcHM6IHsgTkFORDogMyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiUmVjcmVhdGUgYW4gT1IgZ2F0ZSB1c2luZyBvbmx5IE5BTkQgZ2F0ZXMuXCIpO1xuICAgIH0sXG4gICAgXCJuYW5kOnhvclwiOiAoeyBuYW1lOiBzYXZlIH0pID0+IHtcbiAgICAgICAgbWVudS5zcGxpY2UoMiwgMCwge1xuICAgICAgICAgICAgdGVzdDoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRlc3Qgc29sdXRpb25cIixcbiAgICAgICAgICAgICAgICBhc3luYyBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgVGVzdGluZ01hbmFnZXIudGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbW2ZhbHNlLCBmYWxzZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZSwgZmFsc2VdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbZmFsc2UsIHRydWVdLCBbdHJ1ZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtbdHJ1ZSwgdHJ1ZV0sIFtmYWxzZV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGltZW91dDogMTAwMCB9LFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICBrZXliaW5kcyxcbiAgICAgICAgICAgIG1lbnUsXG4gICAgICAgICAgICBzYXZlLFxuICAgICAgICAgICAgaW5pdGlhbDogW1xuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IElucHV0KHsgeDogMTAwLCB5OiAxMDAgfSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBJbnB1dCh7IHg6IDEwMCwgeTogMjAwIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMTAwIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDMwMCwgeTogMjAwIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDUwMCwgeTogMTAwIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcG9uZW50KG5ldyBOYW5kR2F0ZSgpLCB7IHg6IDUwMCwgeTogMjAwIH0pLFxuICAgICAgICAgICAgICAgICAgICBuZXcgT3V0cHV0KHsgeDogNzAwLCB5OiAxNTAgfSksXG4gICAgICAgICAgICAgICAgXS5tYXAoKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LnBlcm1hbmVudCgpKSxcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBpbnB1dHM6IDIsXG4gICAgICAgICAgICAgICAgb3V0cHV0czogMSxcbiAgICAgICAgICAgICAgICBjaGlwc1RvdGFsOiA0LFxuICAgICAgICAgICAgICAgIHdpcmluZ3M6IDksXG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1RvdGFsOiA4LFxuICAgICAgICAgICAgICAgIGNoaXBzOiB7IE5BTkQ6IDQgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE1vZGFsTWFuYWdlci5hbGVydChcIlJlY3JlYXRlIGEgWE9SIGdhdGUgdXNpbmcgb25seSBOQU5EIGdhdGVzLlwiKTtcbiAgICB9LFxufTtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIERFTEFZLCBMT0NLRURfRk9SX1RFU1RJTkcgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgVGVzdGluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVGVzdGluZ01hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IE5ld1dpcmVDb250ZXh0LCBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgQ2hpcCB9IGZyb20gXCIuL2NoaXBzXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50PEkgZXh0ZW5kcyBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXI+IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIHJlYWRvbmx5IGlucHV0cztcbiAgICByZWFkb25seSBvdXRwdXRzO1xuICAgIHJlYWRvbmx5IG5hbWU7XG5cbiAgICByZWFkb25seSAjb2JzZXJ2ZXJzID0gbmV3IE1hcDxFbGVtZW50LCBNdXRhdGlvbk9ic2VydmVyPigpO1xuICAgIHJlYWRvbmx5ICNtb3VzZXVwcyA9IG5ldyBNYXA8RWxlbWVudCwgKCkgPT4gdm9pZD4oKTtcbiAgICByZWFkb25seSAjY29udGV4dG1lbnVzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuXG4gICAgcmVhZG9ubHkgY2hpcDogQ2hpcDxJLCBPPjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBjaGlwOiBDaGlwPEksIE8+LFxuICAgICAgICBwb3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB8ICgoY29tcDogQ29tcG9uZW50PEksIE8+KSA9PiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pLFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuY2hpcCA9IGNoaXA7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KHRoaXMuY2hpcC5pbnB1dHMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjb21wb25lbnQtbmFtZVwiPiR7dGhpcy5jaGlwLm5hbWV9PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KHRoaXMuY2hpcC5vdXRwdXRzKS5maWxsKCc8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LW91dHB1dC1idXR0b25cIj5PPC9idXR0b24+Jykuam9pbihcIlwiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LWlucHV0LWJ1dHRvblwiKSk7XG4gICAgICAgIHRoaXMub3V0cHV0cyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCIpKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1uYW1lXCIpITtcblxuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLnNldChpbnB1dCwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy51cGRhdGUuYmluZCh0aGlzKSkpO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQoaW5wdXQsICgpID0+IGlucHV0LmJsdXIoKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQoaW5wdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKHByZXYpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKGZyb20pID0+IG5ldyBXaXJpbmcoZnJvbSwgaW5wdXQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLi4ucHJldi5zbGljZSgyKSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZXVwcy5zZXQob3V0cHV0LCAoKSA9PiBvdXRwdXQuYmx1cigpKTtcblxuICAgICAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldChvdXRwdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKHByZXYpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjcmVhdGUtY29ubmVjdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIGNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gb3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKHRvKSA9PiBuZXcgV2lyaW5nKG91dHB1dCwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLi4ucHJldi5zbGljZSgyKSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KHRoaXMubmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KChwcmV2KSA9PiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoaXMgY29tcG9uZW50IGlzIHBlcm1hbmVudCBhbmQgY2Fubm90IGJlIGRlbGV0ZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBbZnJvbTogRWxlbWVudCwgdG86IEVsZW1lbnRdW10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0cy5zb21lKChvKSA9PiB3aXJlLmZyb20gPT09IG8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goW3dpcmUuZnJvbSwgd2lyZS50b10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogW2Zyb206IEVsZW1lbnQsIHRvOiBFbGVtZW50XVtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuc29tZSgoaSkgPT4gd2lyZS50byA9PT0gaSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChbd2lyZS5mcm9tLCB3aXJlLnRvXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKFtmcm9tLCB0b10pID0+IG5ldyBXaXJpbmcoZnJvbSwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAuLi5wcmV2LnNsaWNlKDIpLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGUoKSwgMCk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHR5cGVvZiBwb3MgPT09IFwiZnVuY3Rpb25cIiA/IHBvcy5jYWxsKHVuZGVmaW5lZCwgdGhpcykgOiBwb3MpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3Qgb3V0ID0gdGhpcy5jaGlwLmV2YWx1YXRlKHRoaXMuaW5wdXRzLm1hcCgoaSkgPT4gaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpKTtcblxuICAgICAgICBhd2FpdCBERUxBWSgxMDAgKyBNYXRoLnJhbmRvbSgpICogNTAgLSAyNSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCwgaSkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgb3V0W2ldKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmdldChpbnB1dCkhLm9ic2VydmUoaW5wdXQsIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cHMuZ2V0KGlucHV0KSEpO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChpbnB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXBzLmdldChvdXRwdXQpISk7XG5cbiAgICAgICAgICAgIG91dHB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChvdXRwdXQpISk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubmFtZS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLm5hbWUpISk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCwgdGhpcy5uYW1lKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHN1cGVyLmRldGFjaCgpO1xuXG4gICAgICAgIHRoaXMuI29ic2VydmVycy5mb3JFYWNoKChvKSA9PiBvLmRpc2Nvbm5lY3QoKSk7XG5cbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLmZvckVhY2goKGxpc3RlbmVyLCBlbGVtZW50KSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcikpO1xuXG4gICAgICAgIHRoaXMubmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldCh0aGlzLm5hbWUpISk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIExPQ0tFRF9GT1JfVEVTVElORyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUZXN0aW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9UZXN0aW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gPSB7IHg6IDAsIHk6IDAgfSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGh0bWxgPGJ1dHRvbiBjbGFzcz1cImJvYXJkLWlucHV0XCI+STwvYnV0dG9uPmA7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHBvcyk7XG4gICAgfVxuXG4gICAgcmVhZG9ubHkgI21vdXNldXAgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5ibHVyKCk7XG4gICAgfTtcblxuICAgIHJlYWRvbmx5ICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC54ID0gZS5jbGllbnRYLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnkgPSBlLmNsaWVudFkudG9TdHJpbmcoKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI2NsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKE1hdGguaHlwb3QoZS5jbGllbnRYIC0gK3RoaXMuZWxlbWVudC5kYXRhc2V0LnghLCBlLmNsaWVudFkgLSArdGhpcy5lbGVtZW50LmRhdGFzZXQueSEpID4gMikgcmV0dXJuO1xuXG4gICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlID0gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgIWFjdGl2ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGFjdGl2ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY29udGV4dG1lbnUgPSAoKSA9PiB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgocHJldikgPT4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY3JlYXRlLWNvbm5lY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDcmVhdGUgY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlLWlucHV0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGlucHV0XCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIGlucHV0IGlzIHBlcm1hbmVudCBhbmQgY2Fubm90IGJlIGRlbGV0ZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlc3RpbmdNYW5hZ2VyLnRlc3RpbmcpIHJldHVybiBMT0NLRURfRk9SX1RFU1RJTkcoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlZDogRWxlbWVudFtdID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmRlbGV0ZSh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUuZnJvbSA9PT0gdGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2god2lyZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZEFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQuc3BsaWNlKDAsIGRlbGV0ZWQubGVuZ3RoKS5tYXAoKHRvKSA9PiBuZXcgV2lyaW5nKHRoaXMuZWxlbWVudCwgdG8pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVzdGluZ01hbmFnZXIudGVzdGluZykgcmV0dXJuIExPQ0tFRF9GT1JfVEVTVElORygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkOiBFbGVtZW50W10gPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNhbmRib3hNYW5hZ2VyLnB1c2hIaXN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuYWRkQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5zcGxpY2UoMCwgZGVsZXRlZC5sZW5ndGgpLm1hcCgodG8pID0+IG5ldyBXaXJpbmcodGhpcy5lbGVtZW50LCB0bykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4ucHJldi5zbGljZSgyKSxcbiAgICAgICAgXSk7XG4gICAgfTtcblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgc3VwZXIuYXR0YWNoKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy4jY2xpY2spO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51KTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZm9yZ2V0KHRoaXMuZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQUNUSVZBVEVEX0NTU19DT0xPUiwgTE9DS0VEX0ZPUl9URVNUSU5HIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFRlc3RpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1Rlc3RpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNsYXNzIE91dHB1dCBleHRlbmRzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IGVsZW1lbnQ7XG5cbiAgICByZWFkb25seSAjbW91c2V1cCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmJsdXIoKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51ID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKHByZXYpID0+IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1vdXRwdXRcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgb3V0cHV0XCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QRVJNQU5FTlQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGlzIG91dHB1dCBpcyBwZXJtYW5lbnQgYW5kIGNhbm5vdCBiZSBkZWxldGVkLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChmcm9tKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRoaXMuZWxlbWVudCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZXN0aW5nTWFuYWdlci50ZXN0aW5nKSByZXR1cm4gTE9DS0VEX0ZPUl9URVNUSU5HKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWQ6IEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2FuZGJveE1hbmFnZXIucHVzaEhpc3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaCh3aXJlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5hZGRBbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnNwbGljZSgwLCBkZWxldGVkLmxlbmd0aCkubWFwKChmcm9tKSA9PiBuZXcgV2lyaW5nKGZyb20sIHRoaXMuZWxlbWVudCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4ucHJldi5zbGljZSgyKSxcbiAgICAgICAgXSk7XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9ID0geyB4OiAwLCB5OiAwIH0pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBodG1sYDxidXR0b24gY2xhc3M9XCJib2FyZC1vdXRwdXRcIj5PPC9idXR0b24+YDtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5mb3JnZXQodGhpcy5lbGVtZW50LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBXYXRjaGVkU2V0IH0gZnJvbSBcIi4uL2F1Z21lbnRzL1dhdGNoZWRTZXRcIjtcbmltcG9ydCB7IFNDVUZGRURfVVVJRCB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWwodGVtcGxhdGU6IFRlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi52YWx1ZXM6IHVua25vd25bXSk6IEhUTUxFbGVtZW50O1xuZXhwb3J0IGZ1bmN0aW9uIGh0bWwoaHRtbDogc3RyaW5nKTogSFRNTEVsZW1lbnQ7XG5leHBvcnQgZnVuY3Rpb24gaHRtbCguLi5hcmdzOiBbc3RyaW5nXSB8IFtUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4udW5rbm93bltdXSkge1xuICAgIGNvbnN0IFt0ZW1wbGF0ZSwgLi4udmFsdWVzXSA9IGFyZ3M7XG5cbiAgICBjb25zdCBodG1sID1cbiAgICAgICAgdHlwZW9mIHRlbXBsYXRlID09PSBcInN0cmluZ1wiID8gdGVtcGxhdGUgOiB0ZW1wbGF0ZS5yZWR1Y2UoKGh0bWwsIHRleHQsIGkpID0+IGh0bWwgKyB0ZXh0ICsgdmFsdWVzW2ldID8/IFwiXCIsIFwiXCIpO1xuXG4gICAgcmV0dXJuIG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIikuYm9keS5jaGlsZE5vZGVzWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3ZlcmxhcHBlZEJvdW5kcyhyZWN0OiBET01SZWN0LCBmcm9tOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sIHRvOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pIHtcbiAgICBjb25zdCBib3VuZHMgPSB7XG4gICAgICAgIHg6IE1hdGgubWluKGZyb20ueCwgdG8ueCksXG4gICAgICAgIHk6IE1hdGgubWluKGZyb20ueSwgdG8ueSksXG4gICAgICAgIHdpZHRoOiBNYXRoLmFicyhmcm9tLnggLSB0by54KSxcbiAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhmcm9tLnkgLSB0by55KSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgcmVjdC54IDw9IGJvdW5kcy54ICsgYm91bmRzLndpZHRoICYmXG4gICAgICAgIHJlY3QueCArIHJlY3Qud2lkdGggPj0gYm91bmRzLnggJiZcbiAgICAgICAgcmVjdC55IDw9IGJvdW5kcy55ICsgYm91bmRzLmhlaWdodCAmJlxuICAgICAgICByZWN0LnkgKyByZWN0LmhlaWdodCA+PSBib3VuZHMueVxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChlOiBFdmVudCkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IHV1aWQgPSBTQ1VGRkVEX1VVSUQoKTtcblxuICAgIHByb3RlY3RlZCBQRVJNQU5FTlQgPSBmYWxzZTtcblxuICAgIHN0YXRpYyBhY3RpdmUgPSBuZXcgV2F0Y2hlZFNldDxSZWlmaWVkPigpO1xuXG4gICAgc3RhdGljIGdldCByb290KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIucmVpZmllZC1yb290XCIpITtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCByZWFkb25seSBlbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgIG1vdmUoeyB4LCB5IH06IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHggKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB5ICsgXCJweFwiO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgUmVpZmllZC5yb290LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGVybWFuZW50KCkge1xuICAgICAgICB0aGlzLlBFUk1BTkVOVCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IHBlcm1hbmVuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlBFUk1BTkVOVDtcbiAgICB9XG59XG4iLCJ0eXBlIEJvb2xlYW5UdXBsZTxMIGV4dGVuZHMgbnVtYmVyLCBSIGV4dGVuZHMgYm9vbGVhbltdID0gW10+ID0gbnVtYmVyIGV4dGVuZHMgTFxuICAgID8gYm9vbGVhbltdXG4gICAgOiBSW1wibGVuZ3RoXCJdIGV4dGVuZHMgTFxuICAgID8gUlxuICAgIDogQm9vbGVhblR1cGxlPEwsIFsuLi5SLCBib29sZWFuXT47XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDaGlwPEkgZXh0ZW5kcyBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXI+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRTogc3RyaW5nO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFM6IG51bWJlcjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUzogbnVtYmVyO1xuXG4gICAgcmVhZG9ubHkgbmFtZTtcblxuICAgIHJlYWRvbmx5IGlucHV0cztcbiAgICByZWFkb25seSBvdXRwdXRzO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBpbnB1dHM6IEksIG91dHB1dHM6IE8pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBpbnB1dHM7XG4gICAgICAgIHRoaXMub3V0cHV0cyA9IG91dHB1dHM7XG4gICAgfVxuXG4gICAgYWJzdHJhY3Qgb3V0cHV0KGlucHV0czogQm9vbGVhblR1cGxlPEk+KTogQm9vbGVhblR1cGxlPE8+O1xuXG4gICAgZXZhbHVhdGUoaW5wdXRzOiBib29sZWFuW10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0cHV0KGlucHV0cyBhcyBCb29sZWFuVHVwbGU8SSwgW10+KSBhcyBib29sZWFuW107XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW5kR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJBTkRcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJBTkRcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFthICYmIGJdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9yR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJPUlwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk9SXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbYSB8fCBiXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3RHYXRlIGV4dGVuZHMgQ2hpcDwxLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk5PVFwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAxO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIk5PVFwiLCAxLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW25dOiBbYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyFuXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOYW5kR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJOQU5EXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiTkFORFwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gWyEoYSAmJiBiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9yR2F0ZSBleHRlbmRzIENoaXA8MiwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJOT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJOT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshKGEgfHwgYildO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFhvckdhdGUgZXh0ZW5kcyBDaGlwPDIsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiWE9SXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiWE9SXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbISEoK2EgXiArYildO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFhub3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIlhOT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJYTk9SXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbISgrYSBeICtiKV07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQnVmZmVyR2F0ZSBleHRlbmRzIENoaXA8MSwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJCVUZGRVJcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMTtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJCVUZGRVJcIiwgMSwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFtuXTogW2Jvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFtuXTtcbiAgICB9XG59XG5cbnR5cGUgU3RhdGljTWVtYmVyczxUPiA9IHsgW0sgaW4ga2V5b2YgVF06IFRbS10gfTtcblxuZXhwb3J0IGNvbnN0IGNoaXBzID0gbmV3IE1hcDxzdHJpbmcsIFN0YXRpY01lbWJlcnM8dHlwZW9mIENoaXA8bnVtYmVyLCBudW1iZXI+PiAmIHsgbmV3ICgpOiBDaGlwPG51bWJlciwgbnVtYmVyPiB9PihcbiAgICBbQW5kR2F0ZSwgT3JHYXRlLCBOb3RHYXRlLCBOYW5kR2F0ZSwgTm9yR2F0ZSwgWG9yR2F0ZSwgWG5vckdhdGUsIEJ1ZmZlckdhdGVdLm1hcCgoZ2F0ZSkgPT4gW2dhdGUuTkFNRSwgZ2F0ZV0pLFxuKTtcbiIsImV4cG9ydCBjb25zdCBsb2FkU3R5bGVzID0gKCkgPT5cbiAgICBQcm9taXNlLmFsbChcbiAgICAgICAgW1wic3R5bGVcIiwgXCJjb21wb25lbnRcIiwgXCJpb1wiLCBcImNvbnRleHRtZW51XCIsIFwidG9hc3RcIiwgXCJtb2RhbHNcIl0ubWFwKChuYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cbiAgICAgICAgICAgIGxpbmsucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cbiAgICAgICAgICAgIGxpbmsuaHJlZiA9IFwiLi9zdHlsZXMvXCIgKyBuYW1lICsgXCIuY3NzXCI7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGluay5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKCk7XG5cbiAgICAgICAgICAgICAgICBsaW5rLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSxcbiAgICApO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciB3ZWJwYWNrUXVldWVzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBxdWV1ZXNcIikgOiBcIl9fd2VicGFja19xdWV1ZXNfX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgd2VicGFja0Vycm9yID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKSA6IFwiX193ZWJwYWNrX2Vycm9yX19cIjtcbnZhciByZXNvbHZlUXVldWUgPSAocXVldWUpID0+IHtcblx0aWYocXVldWUgJiYgIXF1ZXVlLmQpIHtcblx0XHRxdWV1ZS5kID0gMTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSkpO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tID8gZm4ucisrIDogZm4oKSkpO1xuXHR9XG59XG52YXIgd3JhcERlcHMgPSAoZGVwcykgPT4gKGRlcHMubWFwKChkZXApID0+IHtcblx0aWYoZGVwICE9PSBudWxsICYmIHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZihkZXBbd2VicGFja1F1ZXVlc10pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0cXVldWUuZCA9IDA7XG5cdFx0XHRkZXAudGhlbigocikgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0V4cG9ydHNdID0gcjtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0sIChlKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXJyb3JdID0gZTtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG9iaiA9IHt9O1xuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdHZhciByZXQgPSB7fTtcblx0cmV0W3dlYnBhY2tRdWV1ZXNdID0geCA9PiB7fTtcblx0cmV0W3dlYnBhY2tFeHBvcnRzXSA9IGRlcDtcblx0cmV0dXJuIHJldDtcbn0pKTtcbl9fd2VicGFja19yZXF1aXJlX18uYSA9IChtb2R1bGUsIGJvZHksIGhhc0F3YWl0KSA9PiB7XG5cdHZhciBxdWV1ZTtcblx0aGFzQXdhaXQgJiYgKChxdWV1ZSA9IFtdKS5kID0gMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9