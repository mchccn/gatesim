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
    offAdd(run) {
        this.#adds.delete(run);
        return this;
    }
    offDelete(run) {
        this.#deletes.delete(run);
        return this;
    }
    addAll(items) {
        items.forEach((item) => this.add(item));
        return this;
    }
    deleteAll(items) {
        items.forEach((item) => this.delete(item));
        return this;
    }
    add(item) {
        const results = [...this.#adds].map((run) => run.call(undefined, item, this));
        return results.some((out) => out === false) ? this : super.add(item);
    }
    delete(item) {
        const results = [...this.#deletes].map((run) => run.call(undefined, item, this));
        return results.some((out) => out === false) ? false : super.delete(item);
    }
    clone() {
        return new WatchedSet(this);
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
/* harmony export */   "INPUT_COMPONENT_CSS_SIZE": () => (/* binding */ INPUT_COMPONENT_CSS_SIZE),
/* harmony export */   "IN_DEBUG_MODE": () => (/* binding */ IN_DEBUG_MODE),
/* harmony export */   "IS_MAC_OS": () => (/* binding */ IS_MAC_OS),
/* harmony export */   "LIGHT_GRAY_CSS_COLOR": () => (/* binding */ LIGHT_GRAY_CSS_COLOR),
/* harmony export */   "ORIGIN_POINT": () => (/* binding */ ORIGIN_POINT),
/* harmony export */   "OUTPUT_COMPONENT_CSS_SIZE": () => (/* binding */ OUTPUT_COMPONENT_CSS_SIZE)
/* harmony export */ });
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
const IS_MAC_OS = [navigator.userAgentData.platform, navigator.platform].some((platform) => platform.toLowerCase().includes("mac"));


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







function* gen() {
    let i = 0;
    while (true)
        yield i++;
}
function saveDiagram(components, wires) {
    const id = gen();
    const ids = new Map();
    const data = {
        components: components.map((component, reified) => {
            if (component instanceof _reified_Input__WEBPACK_IMPORTED_MODULE_5__.Input) {
                ids.set(component.element, id.next().value);
                return {
                    reified,
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
                return input;
            }
            if (raw.type === "OUTPUT") {
                const output = new _reified_Output__WEBPACK_IMPORTED_MODULE_6__.Output(raw);
                output.element.classList.toggle("activated", raw.activated);
                elements.set(raw.id, output.element);
                return output;
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
            return component;
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
/* harmony import */ var _SandboxManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SandboxManager */ "./src/managers/SandboxManager.ts");

class DraggingManager {
    static #dragged;
    static #mouse = {
        x: -1,
        y: -1,
        ox: -1,
        oy: -1,
        down: false,
    };
    static #watched = new Map();
    static watch(element, target = element) {
        element.dataset.watched = "true";
        const mousedown = (e) => {
            this.#dragged = element;
            this.#dragged.dataset.dragged = "true";
            this.#dragged.style.cursor = "grabbing";
            const rect = this.#dragged.getBoundingClientRect();
            const body = this.#dragged.parentElement?.getBoundingClientRect() ?? new DOMRect();
            this.#mouse.ox = e.clientX - rect.left + body.left;
            this.#mouse.oy = e.clientY - rect.top + body.top;
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
        this.#mouse.x = -1;
        this.#mouse.y = -1;
        this.#mouse.ox = -1;
        this.#mouse.oy = -1;
        this.#mouse.down = false;
        this.#watched.forEach((_, element) => this.forget(element));
        this.#dragged = undefined;
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
            //EXPERIMENTAL
            const target = this.#dragged;
            const prevLeft = target.style.left;
            const prevTop = target.style.top;
            console.log(prevLeft, prevTop);
            _SandboxManager__WEBPACK_IMPORTED_MODULE_0__.SandboxManager.pushHistory(() => {
                target.style.left = this.#mouse.x - this.#mouse.ox + "px";
                target.style.top = this.#mouse.y - this.#mouse.oy + "px";
            }, () => {
                target.style.left = prevLeft;
                target.style.top = prevTop;
            });
            //END-EXPERIMENTAL
        }
    };
    static #mousedown = (e) => {
        this.#mouse.down = true;
    };
    static #mouseup = () => {
        if (this.#dragged) {
            document.querySelectorAll('[data-dragged="true"]').forEach((e) => {
                delete e.dataset.dragged;
                e.style.cursor = "";
            });
        }
        this.#mouse.down = false;
        this.#mouse.x = -1;
        this.#mouse.y = -1;
        this.#mouse.ox = -1;
        this.#mouse.oy = -1;
        this.#dragged = undefined;
    };
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
        if (document.activeElement === document.body) {
            const [, runs] = this.#keychords.find(([chord]) => chord.split("+").every((key) => this.#keymap.get(key))) ?? [];
            if (runs)
                runs.forEach((run) => run.call(undefined, e));
        }
    };
    static #keyup = (e) => {
        this.#keymap.delete(e.code);
        if (!e.metaKey && (e.code === "MetaLeft" || e.code === "MetaRight") && _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            this.#keymap.clear();
        if (e.metaKey && (e.code === "ShiftLeft" || e.code === "ShiftRight") && _constants__WEBPACK_IMPORTED_MODULE_0__.IS_MAC_OS)
            this.#keymap = new Map([...this.#keymap.entries()].filter(([key]) => !key.startsWith("Key")));
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
                    menu.querySelector("." + key).addEventListener("click", click);
                    menu.querySelector("." + key).addEventListener("contextmenu", click);
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
        const mousedown = () => {
            setup(getActions());
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
            alert.querySelector(".modal-ok").addEventListener("click", () => {
                alert.remove();
                this.#onModalResolved();
                _SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.watchedUnresolvedPromises["delete"](finish);
                return finish();
            });
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
            prompt.querySelector(".modal-input").addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
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
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");














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
    static #observer;
    static #history = new Array();
    static #redos = new Array();
    static #config;
    static setup(config) {
        this.#config = config;
        document.body.innerHTML = "";
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.html `<div class="modal-container modal-inactive"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.html `<div class="reified-root"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.html `<canvas></canvas>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.html `<div class="toasts-container"></div>`);
        _MouseManager__WEBPACK_IMPORTED_MODULE_10__.MouseManager.start();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_8__.KeybindsManager.listen();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_7__.DraggingManager.listen();
        _WiringManager__WEBPACK_IMPORTED_MODULE_13__.WiringManager.start();
        const createReifiedActive = (components) => new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet()
            .onAdd((item, set) => {
            const totals = calculateReifiedTotals(set.clone().add(item));
            if (totals.chipsTotal + totals.inputsTotal + totals.outputsTotal >
                (this.#config.limits?.componentsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_12__.ToastManager.toast({
                    message: "Exceeded total components limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            if (totals.inputsTotal > (this.#config.limits?.inputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_12__.ToastManager.toast({
                    message: "Exceeded total inputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            if (totals.outputsTotal > (this.#config.limits?.outputs ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_12__.ToastManager.toast({
                    message: "Exceeded total outputs limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            if (totals.chipsTotal > (this.#config.limits?.chipsTotal ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_12__.ToastManager.toast({
                    message: "Exceeded total chips limit.",
                    color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
                return false;
            }
            if (item instanceof _reified_Component__WEBPACK_IMPORTED_MODULE_3__.Component &&
                totals.chips.has(item.chip.name) &&
                totals.chips.get(item.chip.name) > (this.#config.limits?.chips?.[item.chip.name] ?? Infinity)) {
                _ToastManager__WEBPACK_IMPORTED_MODULE_12__.ToastManager.toast({
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
                _ToastManager__WEBPACK_IMPORTED_MODULE_12__.ToastManager.toast({
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
            _WiringManager__WEBPACK_IMPORTED_MODULE_13__.WiringManager.wires = createWiringsSet(this.#config.initial[1]);
        }
        if (typeof this.#config.save !== "undefined") {
            const file = _StorageManager__WEBPACK_IMPORTED_MODULE_11__.StorageManager.get("saves:" + this.#config.save);
            if (file) {
                const { error, result: [components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_2__.fromFile)(file);
                if (error) {
                    _StorageManager__WEBPACK_IMPORTED_MODULE_11__.StorageManager["delete"]("saves:" + this.#config.save);
                    _ToastManager__WEBPACK_IMPORTED_MODULE_12__.ToastManager.toast({
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
                        _WiringManager__WEBPACK_IMPORTED_MODULE_13__.WiringManager.wires = createWiringsSet(wires);
                    }
                    _StorageManager__WEBPACK_IMPORTED_MODULE_11__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_13__.WiringManager.wires]));
                }
            }
        }
        this.#observer = new MutationObserver(() => {
            if (typeof this.#config.save !== "undefined")
                _StorageManager__WEBPACK_IMPORTED_MODULE_11__.StorageManager.set("saves:" + this.#config.save, (0,_files__WEBPACK_IMPORTED_MODULE_2__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_13__.WiringManager.wires]));
        });
        this.#observer.observe(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.root, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        });
        //TODO: Implement limits
        //TODO: Implement diagram state check callbacks
    }
    static reset() {
        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = undefined;
        }
        _MouseManager__WEBPACK_IMPORTED_MODULE_10__.MouseManager.reset();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_8__.KeybindsManager.reset();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_7__.DraggingManager.reset();
        _WiringManager__WEBPACK_IMPORTED_MODULE_13__.WiringManager.stop();
        _MenuManager__WEBPACK_IMPORTED_MODULE_9__.MenuManager.remove(_reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.root);
        this.clear();
        this.watchedUnresolvedPromises.forEach((finish) => finish.call(undefined));
        this.watchedUnresolvedPromises.clear();
        document.body.innerHTML = "";
        this.#config = {};
    }
    static clear() {
        _reified_Reified__WEBPACK_IMPORTED_MODULE_6__.Reified.active.forEach((component) => component.detach());
        _WiringManager__WEBPACK_IMPORTED_MODULE_13__.WiringManager.wires.forEach((wire) => wire.destroy());
    }
    static pushHistory(command, undo) {
        this.#redos.length = 0;
        command.call(undefined);
        this.#history.push([command, undo]);
    }
    static popHistory() {
        if (!this.#history.length)
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_12__.ToastManager.toast({
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
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_12__.ToastManager.toast({
                message: "Nothing to redo.",
                color: _constants__WEBPACK_IMPORTED_MODULE_1__.ACTIVATED_CSS_COLOR,
                duration: 2500,
            });
        const [command, undo] = this.#redos.pop();
        this.#history.push([command, undo]);
        return command.call(undefined);
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
    static delete(key) {
        if (this.storage.getItem(this.prefix + key) === null)
            return false;
        this.storage.removeItem(this.prefix + key);
        return true;
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
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");



class NewWireContext {
    static from;
    static {
        _MouseManager__WEBPACK_IMPORTED_MODULE_2__.MouseManager.onMouseDown((e) => {
            if (NewWireContext.from) {
                const { target } = e;
                if (target && target instanceof HTMLElement) {
                    if (target.classList.contains("board-output") ||
                        target.classList.contains("component-input-button")) {
                        WiringManager.wires.add(new Wiring(NewWireContext.from, target));
                    }
                }
                NewWireContext.from = undefined;
            }
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
        this.#observer.observe(from, { attributeFilter: ["class"], attributes: true });
    }
    destroy() {
        this.#destroyed = true;
        this.#observer.disconnect();
    }
    get destroyed() {
        return this.#destroyed;
    }
}
class WiringManager {
    static #rAF = -1;
    static wires = new _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__.WatchedSet();
    static update() {
        const ctx = document.querySelector("canvas").getContext("2d");
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        this.wires.forEach((wire) => {
            if (wire.destroyed) {
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
            ctx.lineTo(_MouseManager__WEBPACK_IMPORTED_MODULE_2__.MouseManager.mouse.x, _MouseManager__WEBPACK_IMPORTED_MODULE_2__.MouseManager.mouse.y);
            ctx.closePath();
            ctx.stroke();
        }
    }
    static start() {
        this.update();
        const id = requestAnimationFrame(this.start.bind(this));
        if (typeof this.#rAF === "undefined") {
            this.#rAF = -1;
            return;
        }
        this.#rAF = id;
    }
    static stop() {
        if (typeof this.#rAF !== "undefined") {
            cancelAnimationFrame(this.#rAF ?? 0);
            this.#rAF = undefined;
        }
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
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_StorageManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./managers/StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./reified/Reified */ "./src/reified/Reified.ts");














const menu = [
    {
        "insert-chip": {
            label: "Insert chip",
            callback: async (e) => {
                const name = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.prompt("Enter the chip's name:");
                if (typeof name !== "string")
                    return;
                const chip = _reified_chips__WEBPACK_IMPORTED_MODULE_9__.chips.get(name.toUpperCase());
                if (!chip)
                    return _managers_ModalManager__WEBPACK_IMPORTED_MODULE_4__.ModalManager.alert("No chip was found with that name.");
                const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_10__.Component(Reflect.construct(chip, []), _constants__WEBPACK_IMPORTED_MODULE_0__.ORIGIN_POINT);
                _reified_Reified__WEBPACK_IMPORTED_MODULE_13__.Reified.active.add(component);
                if (_reified_Reified__WEBPACK_IMPORTED_MODULE_13__.Reified.active.has(component)) {
                    component.attach();
                    _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_3__.DraggingManager.watch(component.element, component.name);
                    const { width, height } = getComputedStyle(component.element);
                    component.move({
                        x: e.clientX - parseFloat(width) / 2,
                        y: e.clientY - parseFloat(height) / 2,
                    });
                }
                return;
            },
        },
    },
    {
        "new-input": {
            label: "New input",
            callback: (e) => {
                const input = new _reified_Input__WEBPACK_IMPORTED_MODULE_11__.Input({
                    x: e.clientX - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
                });
                _reified_Reified__WEBPACK_IMPORTED_MODULE_13__.Reified.active.add(input);
                if (_reified_Reified__WEBPACK_IMPORTED_MODULE_13__.Reified.active.has(input)) {
                    input.attach();
                }
            },
        },
        "new-output": {
            label: "New output",
            callback: (e) => {
                const output = new _reified_Output__WEBPACK_IMPORTED_MODULE_12__.Output({
                    x: e.clientX - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
                });
                _reified_Reified__WEBPACK_IMPORTED_MODULE_13__.Reified.active.add(output);
                if (_reified_Reified__WEBPACK_IMPORTED_MODULE_13__.Reified.active.has(output)) {
                    output.attach();
                }
            },
        },
    },
    // {
    //     "new-chip": {
    //         label: "New chip from diagram",
    //         callback: async () => {
    //             const name = await ModalManager.prompt("Enter the name of the chip:");
    //             if (!name) return;
    //             if (
    //                 chips.has(name.trim().toUpperCase()) &&
    //                 !(await ModalManager.confirm(
    //                     "A chip already exists with this name.\nAre you sure you want to replace it?",
    //                 ))
    //             )
    //                 return;
    //             if (!/^\w+$/.test(name.trim().toUpperCase()))
    //                 return ModalManager.alert("Chip name must consist of only alphanumeric characters.");
    //             const inputs = [...Reified.active.values()].filter((v) => v instanceof Input).length;
    //             const outputs = [...Reified.active.values()].filter((v) => v instanceof Output).length;
    //             chips.set(
    //                 name.trim().toUpperCase(),
    //                 class _ extends Chip<number, number> {
    //                     static readonly NAME = name!.trim().toUpperCase();
    //                     static readonly INPUTS = inputs;
    //                     static readonly OUTPUTS = outputs;
    //                     constructor() {
    //                         super(name!, inputs, outputs);
    //                     }
    //                     output(inputs: boolean[]): boolean[] {
    //                         //TODO: SOMEHOW COMPILE THE DIAGRAM
    //                         //TODO: SORT INPUTS/OUTPUTS BY Y-COORD
    //                         return [];
    //                     }
    //                 },
    //             );
    //             SandboxManager.reset();
    //         },
    //     },
    // },
    {
        "save-as": {
            label: "Save as file",
            callback: () => {
                Object.assign(document.createElement("a"), {
                    href: URL.createObjectURL(new Blob([(0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_13__.Reified.active], [..._managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires])], {
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
                    return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({
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
                    return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({
                        message: "Unable to read the file.",
                        color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });
                const { error, result: [components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_1__.fromFile)(raw);
                if (error)
                    return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_7__.ToastManager.toast({ message: error, color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR, duration: 2500 });
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.reset();
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_5__.SandboxManager.setup({
                    keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_2__.keybinds,
                    menu,
                    save: "sandbox",
                    initial: [components, wires],
                    overrideSaveIfExists: true,
                });
                _managers_StorageManager__WEBPACK_IMPORTED_MODULE_6__.StorageManager.set("saves:" + "sandbox", (0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_13__.Reified.active], [..._managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.wires]));
            },
        },
    },
    ...(_constants__WEBPACK_IMPORTED_MODULE_0__.IN_DEBUG_MODE
        ? [
            {
                STOP: {
                    label: "STOP RENDER",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.stop();
                    },
                },
                START: {
                    label: "START RENDER",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_8__.WiringManager.start();
                    },
                },
            },
        ]
        : []),
];


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
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");




class Component extends _Reified__WEBPACK_IMPORTED_MODULE_3__.Reified {
    element;
    inputs;
    outputs;
    name;
    #observers = new Map();
    #contextmenus = new Map();
    chip;
    constructor(chip, pos) {
        super();
        this.chip = chip;
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_3__.html `
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
        this.update();
        this.inputs.forEach((input) => {
            this.#observers.set(input, new MutationObserver(this.update.bind(this)));
            this.#contextmenus.set(input, () => {
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.queueNewContext((prev) => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            callback: () => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.WiringManager.wires.forEach((wire) => {
                                    if (wire.to === input)
                                        wire.destroy();
                                });
                                input.classList.remove("activated");
                            },
                        },
                    },
                    ...prev,
                ]);
            });
        });
        this.outputs.forEach((output) => {
            this.#contextmenus.set(output, () => {
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.queueNewContext((prev) => [
                    {
                        "create-connection": {
                            label: "Create connection",
                            callback: () => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.NewWireContext.from = output;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            callback: () => {
                                _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.WiringManager.wires.forEach((wire) => {
                                    if (wire.from === output) {
                                        wire.destroy();
                                        wire.to.classList.remove("activated");
                                    }
                                });
                            },
                        },
                    },
                    ...prev,
                ]);
            });
        });
        this.#contextmenus.set(this.name, () => {
            _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.queueNewContext((prev) => [
                {
                    "delete-component": {
                        label: "Delete component",
                        callback: () => {
                            _Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active["delete"](this);
                            this.detach();
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.WiringManager.wires.forEach((wire) => {
                                if (this.inputs.some((i) => wire.to === i) ||
                                    this.outputs.some((o) => wire.from === o)) {
                                    wire.destroy();
                                    wire.to.classList.remove("activated");
                                }
                            });
                            this.inputs.forEach((i) => i.classList.remove("activated"));
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        callback: () => {
                            _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.WiringManager.wires.forEach((wire) => {
                                if (this.inputs.some((i) => wire.to === i) ||
                                    this.outputs.some((o) => wire.from === o)) {
                                    wire.destroy();
                                    wire.to.classList.remove("activated");
                                }
                            });
                            this.inputs.forEach((i) => i.classList.remove("activated"));
                        },
                    },
                },
                ...prev,
            ]);
        });
        this.move(typeof pos === "function" ? pos.call(undefined, this) : pos);
    }
    update() {
        const out = this.chip.evaluate(this.inputs.map((i) => i.classList.contains("activated")));
        this.outputs.forEach((output, i) => {
            output.classList.toggle("activated", out[i]);
        });
        return this;
    }
    attach() {
        super.attach();
        this.inputs.forEach((input) => {
            this.#observers.get(input).observe(input, {
                attributeFilter: ["class"],
                attributes: true,
            });
            input.addEventListener("contextmenu", this.#contextmenus.get(input));
        });
        this.outputs.forEach((output) => {
            output.addEventListener("contextmenu", this.#contextmenus.get(output));
        });
        this.name.addEventListener("contextmenu", this.#contextmenus.get(this.name));
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_0__.DraggingManager.watch(this.element, this.name);
        return this;
    }
    detach() {
        super.detach();
        this.#observers.forEach((o) => o.disconnect());
        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));
        this.name.removeEventListener("contextmenu", this.#contextmenus.get(this.name));
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_0__.DraggingManager.forget(this.element, true);
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
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");




class Input extends _Reified__WEBPACK_IMPORTED_MODULE_3__.Reified {
    element;
    constructor(pos = { x: 0, y: 0 }) {
        super();
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_3__.html `<button class="board-input">I</button>`;
        this.move(pos);
    }
    #mousedown = (e) => {
        this.element.dataset.x = e.clientX.toString();
        this.element.dataset.y = e.clientY.toString();
    };
    #click = (e) => {
        if (Math.hypot(e.clientX - +this.element.dataset.x, e.clientY - +this.element.dataset.y) > 2)
            return;
        this.element.classList.toggle("activated");
    };
    #contextmenu = () => {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.queueNewContext((prev) => [
            {
                "create-connection": {
                    label: "Create connection",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.NewWireContext.from = this.element;
                    },
                },
                "delete-input": {
                    label: "Delete input",
                    callback: () => {
                        _Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active["delete"](this);
                        this.detach();
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.WiringManager.wires.forEach((wire) => {
                            if (wire.from === this.element) {
                                wire.destroy();
                                wire.to.classList.remove("activated");
                            }
                        });
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.WiringManager.wires.forEach((wire) => {
                            if (wire.from === this.element) {
                                wire.destroy();
                                wire.to.classList.remove("activated");
                            }
                        });
                    },
                },
            },
            ...prev,
        ]);
    };
    attach() {
        super.attach();
        this.element.addEventListener("mousedown", this.#mousedown);
        this.element.addEventListener("click", this.#click);
        this.element.addEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_0__.DraggingManager.watch(this.element);
        return this;
    }
    detach() {
        super.detach();
        this.element.removeEventListener("mousedown", this.#mousedown);
        this.element.removeEventListener("click", this.#click);
        this.element.removeEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_0__.DraggingManager.forget(this.element, true);
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
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _Reified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Reified */ "./src/reified/Reified.ts");




class Output extends _Reified__WEBPACK_IMPORTED_MODULE_3__.Reified {
    element;
    #contextmenu = () => {
        _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.queueNewContext((prev) => [
            {
                "delete-output": {
                    label: "Delete output",
                    callback: () => {
                        _Reified__WEBPACK_IMPORTED_MODULE_3__.Reified.active["delete"](this);
                        this.detach();
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.WiringManager.wires.forEach((wire) => {
                            if (wire.to === this.element)
                                wire.destroy();
                        });
                        this.element.classList.remove("activated");
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_2__.WiringManager.wires.forEach((wire) => {
                            if (wire.to === this.element)
                                wire.destroy();
                        });
                        this.element.classList.remove("activated");
                    },
                },
            },
            ...prev,
        ]);
    };
    constructor(pos = { x: 0, y: 0 }) {
        super();
        this.element = _Reified__WEBPACK_IMPORTED_MODULE_3__.html `<button class="board-output">O</button>`;
        this.move(pos);
    }
    attach() {
        super.attach();
        this.element.addEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_0__.DraggingManager.watch(this.element);
        return this;
    }
    detach() {
        super.detach();
        this.element.removeEventListener("contextmenu", this.#contextmenu);
        _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_0__.DraggingManager.forget(this.element, true);
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
/* harmony export */   "preventDefault": () => (/* binding */ preventDefault)
/* harmony export */ });
/* harmony import */ var _augments_WatchedSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../augments/WatchedSet */ "./src/augments/WatchedSet.ts");

function html(...args) {
    const [template, ...values] = args;
    const html = typeof template === "string" ? template : template.reduce((html, text, i) => html + text + values[i] ?? "", "");
    return new DOMParser().parseFromString(html, "text/html").body.childNodes[0];
}
function preventDefault(e) {
    e.preventDefault();
}
class Reified {
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
/* harmony export */   "Chip": () => (/* binding */ Chip),
/* harmony export */   "NotGate": () => (/* binding */ NotGate),
/* harmony export */   "OrGate": () => (/* binding */ OrGate),
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
const chips = new Map([
    [AndGate.NAME, AndGate],
    [OrGate.NAME, OrGate],
    [NotGate.NAME, NotGate],
]);


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _keybinds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keybinds */ "./src/keybinds.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./menu */ "./src/menu.ts");



_managers_SandboxManager__WEBPACK_IMPORTED_MODULE_1__.SandboxManager.setup({ keybinds: _keybinds__WEBPACK_IMPORTED_MODULE_0__.keybinds, menu: _menu__WEBPACK_IMPORTED_MODULE_2__.menu, save: "sandbox" });

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFLElBQUksMkNBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvYXVnbWVudHMvV2F0Y2hlZFNldC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9maWxlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMva2V5YmluZHMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9NZW51TWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTW9kYWxNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9Nb3VzZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvVG9hc3RNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tZW51LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL0NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9JbnB1dC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9PdXRwdXQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvUmVpZmllZC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9jaGlwcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFdhdGNoZWRTZXQ8VD4gZXh0ZW5kcyBTZXQ8VD4ge1xuICAgICNhZGRzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuICAgICNkZWxldGVzID0gbmV3IFNldDwoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuXG4gICAgY29uc3RydWN0b3IoaXRlbXM/OiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8dHlwZW9mIFNldDxUPj5bMF0pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBpZiAoaXRlbXMpIHRoaXMuYWRkQWxsKFsuLi5pdGVtc10pO1xuICAgIH1cblxuICAgIG9uQWRkKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNhZGRzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uRGVsZXRlKHJ1bjogKGl0ZW06IFQsIHNldDogV2F0Y2hlZFNldDxUPikgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLiNkZWxldGVzLmFkZChydW4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9mZkFkZChydW46IChpdGVtOiBULCBzZXQ6IFdhdGNoZWRTZXQ8VD4pID0+IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy4jYWRkcy5kZWxldGUocnVuKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmZEZWxldGUocnVuOiAoaXRlbTogVCwgc2V0OiBXYXRjaGVkU2V0PFQ+KSA9PiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuI2RlbGV0ZXMuZGVsZXRlKHJ1bik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWRkQWxsKGl0ZW1zOiBUW10pIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5hZGQoaXRlbSkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRlbGV0ZUFsbChpdGVtczogVFtdKSB7XG4gICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuZGVsZXRlKGl0ZW0pKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhZGQoaXRlbTogVCkge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2FkZHNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0cy5zb21lKChvdXQpID0+IG91dCA9PT0gZmFsc2UpID8gdGhpcyA6IHN1cGVyLmFkZChpdGVtKTtcbiAgICB9XG5cbiAgICBkZWxldGUoaXRlbTogVCkge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gWy4uLnRoaXMuI2RlbGV0ZXNdLm1hcCgocnVuKSA9PiBydW4uY2FsbCh1bmRlZmluZWQsIGl0ZW0sIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0cy5zb21lKChvdXQpID0+IG91dCA9PT0gZmFsc2UpID8gZmFsc2UgOiBzdXBlci5kZWxldGUoaXRlbSk7XG4gICAgfVxuXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgV2F0Y2hlZFNldCh0aGlzKTtcbiAgICB9XG59XG4iLCJkZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIE5hdmlnYXRvciB7XG4gICAgICAgIHVzZXJBZ2VudERhdGE6IHsgcGxhdGZvcm06IHN0cmluZyB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSA9IDI0O1xuZXhwb3J0IGNvbnN0IE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgPSAyNDtcbmV4cG9ydCBjb25zdCBDSElQX0NPTVBPTkVOVF9DU1NfV0lEVEggPSAxMjA7XG5leHBvcnQgY29uc3QgQ0hJUF9DT01QT05FTlRfQ1NTX0hFSUdIVCA9IDQwO1xuZXhwb3J0IGNvbnN0IENISVBfSU5QVVRfQ1NTX1NJWkUgPSAxNjtcbmV4cG9ydCBjb25zdCBDSElQX09VVFBVVF9DU1NfU0laRSA9IDE2O1xuZXhwb3J0IGNvbnN0IE9SSUdJTl9QT0lOVCA9IE9iamVjdC5mcmVlemUoeyB4OiAwLCB5OiAwIH0pO1xuZXhwb3J0IGNvbnN0IEFDVElWQVRFRF9DU1NfQ09MT1IgPSBcIiNmZjI2MjZcIjtcbmV4cG9ydCBjb25zdCBMSUdIVF9HUkFZX0NTU19DT0xPUiA9IFwiI2RlZGVkZVwiO1xuZXhwb3J0IGNvbnN0IElOX0RFQlVHX01PREUgPSAhIW5ldyBVUkwobG9jYXRpb24uaHJlZikuc2VhcmNoUGFyYW1zLmhhcyhcImRlYnVnXCIpO1xuZXhwb3J0IGNvbnN0IElTX01BQ19PUyA9IFtuYXZpZ2F0b3IudXNlckFnZW50RGF0YS5wbGF0Zm9ybSwgbmF2aWdhdG9yLnBsYXRmb3JtXS5zb21lKChwbGF0Zm9ybSkgPT5cbiAgICBwbGF0Zm9ybS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFwibWFjXCIpLFxuKTtcbiIsImltcG9ydCB7IEFDVElWQVRFRF9DU1NfQ09MT1IsIElOX0RFQlVHX01PREUgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nIH0gZnJvbSBcIi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgY2hpcHMgfSBmcm9tIFwiLi9yZWlmaWVkL2NoaXBzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9yZWlmaWVkL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi9yZWlmaWVkL0lucHV0XCI7XG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgUmVpZmllZCB9IGZyb20gXCIuL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5mdW5jdGlvbiogZ2VuKCkge1xuICAgIGxldCBpID0gMDtcblxuICAgIHdoaWxlICh0cnVlKSB5aWVsZCBpKys7XG59XG5cbmV4cG9ydCB0eXBlIFNlcmlhbGl6ZWREaWFncmFtID0ge1xuICAgIGNvbXBvbmVudHM6IChcbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgdHlwZTogXCJJTlBVVFwiO1xuICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICAgIGlkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeTogbnVtYmVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfCB7XG4gICAgICAgICAgICAgIHJlaWZpZWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgdHlwZTogXCJPVVRQVVRcIjtcbiAgICAgICAgICAgICAgYWN0aXZhdGVkOiBib29sZWFuO1xuICAgICAgICAgICAgICBpZDogbnVtYmVyO1xuICAgICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAgIHk6IG51bWJlcjtcbiAgICAgICAgICB9XG4gICAgICAgIHwge1xuICAgICAgICAgICAgICByZWlmaWVkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCI7XG4gICAgICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICAgICAgaW5wdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIG91dHB1dHM6IHsgaWQ6IG51bWJlcjsgYWN0aXZhdGVkOiBib29sZWFuIH1bXTtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgIClbXTtcbiAgICB3aXJlczogeyBmcm9tOiBudW1iZXI7IHRvOiBudW1iZXIgfVtdO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEaWFncmFtKGNvbXBvbmVudHM6IFJlaWZpZWRbXSwgd2lyZXM6IFdpcmluZ1tdKSB7XG4gICAgY29uc3QgaWQgPSBnZW4oKTtcblxuICAgIGNvbnN0IGlkcyA9IG5ldyBNYXA8RWxlbWVudCwgbnVtYmVyPigpO1xuXG4gICAgY29uc3QgZGF0YTogU2VyaWFsaXplZERpYWdyYW0gPSB7XG4gICAgICAgIGNvbXBvbmVudHM6IGNvbXBvbmVudHMubWFwKChjb21wb25lbnQsIHJlaWZpZWQpID0+IHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBJbnB1dCkge1xuICAgICAgICAgICAgICAgIGlkcy5zZXQoY29tcG9uZW50LmVsZW1lbnQsIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpZmllZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJJTlBVVFwiLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkcy5nZXQoY29tcG9uZW50LmVsZW1lbnQpISxcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBPdXRwdXQpIHtcbiAgICAgICAgICAgICAgICBpZHMuc2V0KGNvbXBvbmVudC5lbGVtZW50LCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiT1VUUFVUXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2YXRlZDogY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpLFxuICAgICAgICAgICAgICAgICAgICBpZDogaWRzLmdldChjb21wb25lbnQuZWxlbWVudCkhLFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiQ09NUE9ORU5UXCIsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbXBvbmVudC5jaGlwLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0czogY29tcG9uZW50LmlucHV0cy5tYXAoKGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5zZXQoaSwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGlkOiBpZHMuZ2V0KGkpISwgYWN0aXZhdGVkOiBpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSB9O1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0czogY29tcG9uZW50Lm91dHB1dHMubWFwKChvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KG8sIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChvKSEsIGFjdGl2YXRlZDogby5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIHNlcmlhbGl6ZSBkaWFncmFtLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gUmVpZmllZCBjb21wb25lbnQgdHlwZS5cIik7XG4gICAgICAgIH0pLFxuICAgICAgICB3aXJlczogd2lyZXNcbiAgICAgICAgICAgIC5maWx0ZXIoKHdpcmUpID0+ICF3aXJlLmRlc3Ryb3llZClcbiAgICAgICAgICAgIC5tYXAoKHdpcmUpID0+ICh7XG4gICAgICAgICAgICAgICAgZnJvbTogaWRzLmdldCh3aXJlLmZyb20pISxcbiAgICAgICAgICAgICAgICB0bzogaWRzLmdldCh3aXJlLnRvKSEsXG4gICAgICAgICAgICB9KSksXG4gICAgfTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhLCB1bmRlZmluZWQsIElOX0RFQlVHX01PREUgPyA0IDogdW5kZWZpbmVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21GaWxlKFxuICAgIGZpbGU6IHN0cmluZyxcbik6IHsgZXJyb3I6IHN0cmluZzsgcmVzdWx0OiBbXSB9IHwgeyBlcnJvcjogdW5kZWZpbmVkOyByZXN1bHQ6IFtjb21wb25lbnRzOiBSZWlmaWVkW10sIHdpcmVzOiBXaXJpbmdbXV0gfSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoZmlsZSk7XG5cbiAgICAgICAgdmFsaWRhdGUoZGF0YSk7XG5cbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBuZXcgTWFwPG51bWJlciwgRWxlbWVudD4oKTtcblxuICAgICAgICBjb25zdCByZWlmaWVkID0gZGF0YS5jb21wb25lbnRzLm1hcCgocmF3KSA9PiB7XG4gICAgICAgICAgICBpZiAocmF3LnR5cGUgPT09IFwiSU5QVVRcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gbmV3IElucHV0KHJhdyk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3LmlkLCBpbnB1dC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJhdy50eXBlID09PSBcIk9VVFBVVFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gbmV3IE91dHB1dChyYXcpO1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0LmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuYWN0aXZhdGVkKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnNldChyYXcuaWQsIG91dHB1dC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnQobmV3IChjaGlwcy5nZXQocmF3Lm5hbWUpISkoKSwgcmF3KTtcblxuICAgICAgICAgICAgY29tcG9uZW50LmlucHV0cy5mb3JFYWNoKChpbnB1dCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5pbnB1dHNbaW5kZXhdLmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3LmlucHV0c1tpbmRleF0uaWQsIGlucHV0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb21wb25lbnQub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3Lm91dHB1dHNbaW5kZXhdLmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3Lm91dHB1dHNbaW5kZXhdLmlkLCBvdXRwdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHdpcmVzID0gZGF0YS53aXJlcy5tYXAoKHsgZnJvbSwgdG8gfSkgPT4gbmV3IFdpcmluZyhlbGVtZW50cy5nZXQoZnJvbSkhLCBlbGVtZW50cy5nZXQodG8pISkpO1xuXG4gICAgICAgIHJldHVybiB7IHJlc3VsdDogW3JlaWZpZWQsIHdpcmVzXSwgZXJyb3I6IHVuZGVmaW5lZCB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIHsgZXJyb3I6IGUubWVzc2FnZSwgcmVzdWx0OiBbXSB9O1xuXG4gICAgICAgIHJldHVybiB7IGVycm9yOiBcIkZhaWxlZCB0byBwcm9jZXNzIGZpbGUuXCIsIHJlc3VsdDogW10gfTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKGRhdGE6IHVua25vd24pOiBhc3NlcnRzIGRhdGEgaXMgU2VyaWFsaXplZERpYWdyYW0ge1xuICAgIGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBub3QgYW4gb2JqZWN0LlwiKTtcblxuICAgIGlmICghKFwiY29tcG9uZW50c1wiIGluIGRhdGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG1pc3NpbmcgY29tcG9uZW50cy5cIik7XG5cbiAgICBpZiAoIShcIndpcmVzXCIgaW4gZGF0YSkpIHRocm93IG5ldyBFcnJvcihcIkRhdGEgaXMgbWlzc2luZyB3aXJlcy5cIik7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5jb21wb25lbnRzKSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50cyBkYXRhIGlzIG5vdCBhbiBhcnJheS5cIik7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS53aXJlcykpIHRocm93IG5ldyBFcnJvcihcIldpcmVzIGRhdGEgaXMgbm90IGFuIGFycmF5LlwiKTtcblxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGRhdGEuY29tcG9uZW50cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQgfHwgdHlwZW9mIGNvbXBvbmVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgbXVzdCBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwicmVpZmllZFwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIHJlaWZpZWQgaWQuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnJlaWZpZWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIlJlaWZpZWQgaWQgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJ0eXBlXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50cyBkYXRhIGlzIG1pc3NpbmcgYSB0eXBlLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC50eXBlICE9PSBcInN0cmluZ1wiIHx8ICFbXCJJTlBVVFwiLCBcIk9VVFBVVFwiLCBcIkNPTVBPTkVOVFwiXS5pbmNsdWRlcyhjb21wb25lbnQudHlwZSkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbXBvbmVudCB0eXBlLlwiKTtcblxuICAgICAgICBpZiAoIShcInhcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHggY29vcmRpbmF0ZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQueCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHggY29vcmRpbmF0ZSBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICBpZiAoIShcInlcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyBhIHkgY29vcmRpbmF0ZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQueSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHkgY29vcmRpbmF0ZSBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICBzd2l0Y2ggKGNvbXBvbmVudC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiSU5QVVRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJPVVRQVVRcIjoge1xuICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gZGF0YSBpcyBtaXNzaW5nIGlkcy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSS9PIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJhY3RpdmF0ZWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJL08gZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcIkNPTVBPTkVOVFwiOiB7XG4gICAgICAgICAgICAgICAgaWYgKCEoXCJpbnB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgZGF0YSBpcyBtaXNzaW5nIGlucHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50LmlucHV0cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBpbnB1dHMgZGF0YSBtdXN0IGJlIGFuIGFycmF5LlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwib3V0cHV0c1wiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3Npbmcgb3V0cHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50Lm91dHB1dHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgb3V0cHV0cyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoXCJuYW1lXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBjaGlwIG5hbWUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQubmFtZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiQ2hpcCBuYW1lIG11c3QgYmUgYSBzdHJpbmcuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlwcy5oYXMoY29tcG9uZW50Lm5hbWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpKSB0aHJvdyBuZXcgRXJyb3IoXCJDaGlwIG5hbWUgZG9lc24ndCBleGlzdC5cIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBDaGlwID0gY2hpcHMuZ2V0KGNvbXBvbmVudC5uYW1lLnRyaW0oKS50b1VwcGVyQ2FzZSgpKSE7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmlucHV0cy5sZW5ndGggIT09IENoaXAuSU5QVVRTKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgaW5wdXRzIGRvZXMgbm90IG1hdGNoIGNoaXAgaW5wdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQub3V0cHV0cy5sZW5ndGggIT09IENoaXAuT1VUUFVUUylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IG91dHB1dHMgZG9lcyBub3QgbWF0Y2ggY2hpcCBvdXRwdXRzLlwiKTtcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW5wdXQgb2YgY29tcG9uZW50LmlucHV0cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbnB1dCB8fCB0eXBlb2YgaW5wdXQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgbXVzdCBiZSBhbiBvYmplY3RcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJpZFwiIGluIGlucHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGlkLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0LmlkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiYWN0aXZhdGVkXCIgaW4gaW5wdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgYWN0aXZhdGlvbiBzdGF0dXMuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQuYWN0aXZhdGVkICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQWN0aXZhdGlvbiBzdGF0dXMgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgb3V0cHV0IG9mIGNvbXBvbmVudC5vdXRwdXRzIGFzIHVua25vd25bXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBvdXRwdXQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlzIG1pc3NpbmcgaWQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmlkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiYWN0aXZhdGVkXCIgaW4gb3V0cHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG91dHB1dC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpZHMgPSBkYXRhLmNvbXBvbmVudHMuZmxhdE1hcDxudW1iZXI+KChjb21wb25lbnQpID0+XG4gICAgICAgIGNvbXBvbmVudC50eXBlID09PSBcIkNPTVBPTkVOVFwiXG4gICAgICAgICAgICA/IFtcbiAgICAgICAgICAgICAgICAgIC4uLmNvbXBvbmVudC5pbnB1dHMubWFwKCh7IGlkIH06IHsgaWQ6IG51bWJlciB9KSA9PiBpZCksXG4gICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQub3V0cHV0cy5tYXAoKHsgaWQgfTogeyBpZDogbnVtYmVyIH0pID0+IGlkKSxcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgOiBjb21wb25lbnQuaWQsXG4gICAgKTtcblxuICAgIGZvciAoY29uc3Qgd2lyZSBvZiBkYXRhLndpcmVzIGFzIHVua25vd25bXSkge1xuICAgICAgICBpZiAoIXdpcmUgfHwgdHlwZW9mIHdpcmUgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJmcm9tXCIgaW4gd2lyZSkpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBpcyBtaXNzaW5nIHRoZSBjb21wb25lbnQgaXQgc3RhcnRzIGZyb20uXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2lyZS5mcm9tICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgbXVzdCByZWZlcmVuY2UgbnVtZXJpYyBpZHMuXCIpO1xuXG4gICAgICAgIGlmICghKFwidG9cIiBpbiB3aXJlKSkgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIGlzIG1pc3NpbmcgdGhlIHRhcmdldCBjb21wb25lbnQuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2lyZS50byAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIG11c3QgcmVmZXJlbmNlIG51bWVyaWMgaWRzLlwiKTtcblxuICAgICAgICBpZiAoIWlkcy5pbmNsdWRlcyh3aXJlLmZyb20pIHx8ICFpZHMuaW5jbHVkZXMod2lyZS50bykpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSByZWZlcmVuY2VzIGludmFsaWQgaWRzLlwiKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJU19NQUNfT1MgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcblxuY29uc3QgdW5kbyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgU2FuZGJveE1hbmFnZXIucG9wSGlzdG9yeSgpO1xufTtcblxuY29uc3QgcmVkbyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgU2FuZGJveE1hbmFnZXIucmVkb0hpc3RvcnkoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBrZXliaW5kczogUmVjb3JkPHN0cmluZywgKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ+ID0ge1xuICAgIFwiQ29udHJvbExlZnQrU2hpZnRMZWZ0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHJlZG8oZSk7XG4gICAgfSxcbiAgICBcIkNvbnRyb2xMZWZ0K1NoaWZ0UmlnaHQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbyhlKTtcbiAgICB9LFxuICAgIFwiQ29udHJvbFJpZ2h0K1NoaWZ0TGVmdCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKGUpO1xuICAgIH0sXG4gICAgXCJDb250cm9sUmlnaHQrU2hpZnRSaWdodCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKGUpO1xuICAgIH0sXG4gICAgXCJNZXRhTGVmdCtTaGlmdExlZnQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHJlZG8oZSk7XG4gICAgfSxcbiAgICBcIk1ldGFMZWZ0K1NoaWZ0UmlnaHQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHJlZG8oZSk7XG4gICAgfSxcbiAgICBcIk1ldGFSaWdodCtTaGlmdExlZnQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHJlZG8oZSk7XG4gICAgfSxcbiAgICBcIk1ldGFSaWdodCtTaGlmdFJpZ2h0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKGUpO1xuICAgIH0sXG4gICAgXCJDb250cm9sTGVmdCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICB1bmRvKGUpO1xuICAgIH0sXG4gICAgXCJDb250cm9sUmlnaHQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgdW5kbyhlKTtcbiAgICB9LFxuICAgIFwiTWV0YUxlZnQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHVuZG8oZSk7XG4gICAgfSxcbiAgICBcIk1ldGFSaWdodCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgdW5kbyhlKTtcbiAgICB9LFxufTtcbiIsImltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIERyYWdnaW5nTWFuYWdlciB7XG4gICAgc3RhdGljICNkcmFnZ2VkOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2UgPSB7XG4gICAgICAgIHg6IC0xLFxuICAgICAgICB5OiAtMSxcbiAgICAgICAgb3g6IC0xLFxuICAgICAgICBveTogLTEsXG4gICAgICAgIGRvd246IGZhbHNlLFxuICAgIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI3dhdGNoZWQgPSBuZXcgTWFwKCk7XG5cbiAgICBzdGF0aWMgd2F0Y2goZWxlbWVudDogSFRNTEVsZW1lbnQsIHRhcmdldCA9IGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LndhdGNoZWQgPSBcInRydWVcIjtcblxuICAgICAgICBjb25zdCBtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IGVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuZGF0YXNldC5kcmFnZ2VkID0gXCJ0cnVlXCI7XG5cbiAgICAgICAgICAgIHRoaXMuI2RyYWdnZWQuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiO1xuXG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy4jZHJhZ2dlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMuI2RyYWdnZWQucGFyZW50RWxlbWVudD8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgPz8gbmV3IERPTVJlY3QoKTtcblxuICAgICAgICAgICAgdGhpcy4jbW91c2Uub3ggPSBlLmNsaWVudFggLSByZWN0LmxlZnQgKyBib2R5LmxlZnQ7XG4gICAgICAgICAgICB0aGlzLiNtb3VzZS5veSA9IGUuY2xpZW50WSAtIHJlY3QudG9wICsgYm9keS50b3A7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duLCB7IGNhcHR1cmU6IHRydWUgfSk7XG5cbiAgICAgICAgdGhpcy4jd2F0Y2hlZC5zZXQodGFyZ2V0LCBtb3VzZWRvd24pO1xuICAgIH1cblxuICAgIHN0YXRpYyBmb3JnZXQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGZvcmNlPzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuI3dhdGNoZWQuZ2V0KGVsZW1lbnQpO1xuXG4gICAgICAgIGlmICghbGlzdGVuZXIgJiYgIWZvcmNlKSB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbm90IGN1cnJlbnRseSBiZWluZyB3YXRjaGVkLmApO1xuXG4gICAgICAgIGRlbGV0ZSBlbGVtZW50LmRhdGFzZXQud2F0Y2hlZDtcblxuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXIsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLiN3YXRjaGVkLmRlbGV0ZShlbGVtZW50KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSAtMTtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IC0xO1xuICAgICAgICB0aGlzLiNtb3VzZS5veCA9IC0xO1xuICAgICAgICB0aGlzLiNtb3VzZS5veSA9IC0xO1xuICAgICAgICB0aGlzLiNtb3VzZS5kb3duID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy4jd2F0Y2hlZC5mb3JFYWNoKChfLCBlbGVtZW50KSA9PiB0aGlzLmZvcmdldChlbGVtZW50KSk7XG5cbiAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBsaXN0ZW4oKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlYWZlbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuI21vdXNlbW92ZSk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlbW92ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlLnggPSBlLmNsaWVudFg7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSBlLmNsaWVudFk7XG5cbiAgICAgICAgaWYgKHRoaXMuI2RyYWdnZWQpIHtcbiAgICAgICAgICAgIC8vRVhQRVJJTUVOVEFMXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLiNkcmFnZ2VkO1xuICAgICAgICAgICAgY29uc3QgcHJldkxlZnQgPSB0YXJnZXQuc3R5bGUubGVmdDtcbiAgICAgICAgICAgIGNvbnN0IHByZXZUb3AgPSB0YXJnZXQuc3R5bGUudG9wO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocHJldkxlZnQsIHByZXZUb3ApO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci5wdXNoSGlzdG9yeShcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5sZWZ0ID0gdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gdGhpcy4jbW91c2UueSAtIHRoaXMuI21vdXNlLm95ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUubGVmdCA9IHByZXZMZWZ0O1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUudG9wID0gcHJldlRvcDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vRU5ELUVYUEVSSU1FTlRBTFxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UuZG93biA9IHRydWU7XG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2V1cCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuI2RyYWdnZWQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1kcmFnZ2VkPVwidHJ1ZVwiXScpLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgZS5kYXRhc2V0LmRyYWdnZWQ7XG5cbiAgICAgICAgICAgICAgICBlLnN0eWxlLmN1cnNvciA9IFwiXCI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI21vdXNlLmRvd24gPSBmYWxzZTtcblxuICAgICAgICB0aGlzLiNtb3VzZS54ID0gLTE7XG4gICAgICAgIHRoaXMuI21vdXNlLnkgPSAtMTtcblxuICAgICAgICB0aGlzLiNtb3VzZS5veCA9IC0xO1xuICAgICAgICB0aGlzLiNtb3VzZS5veSA9IC0xO1xuXG4gICAgICAgIHRoaXMuI2RyYWdnZWQgPSB1bmRlZmluZWQ7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IElTX01BQ19PUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGNsYXNzIEtleWJpbmRzTWFuYWdlciB7XG4gICAgc3RhdGljICNrZXltYXAgPSBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcblxuICAgIHN0YXRpYyAja2V5Y2hvcmRzID0gbmV3IEFycmF5PFtzdHJpbmcsICgoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZClbXV0+KCk7XG5cbiAgICBzdGF0aWMgI2tleWRvd24gPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNrZXltYXAuc2V0KGUuY29kZSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGNvbnN0IFssIHJ1bnNdID1cbiAgICAgICAgICAgICAgICB0aGlzLiNrZXljaG9yZHMuZmluZCgoW2Nob3JkXSkgPT4gY2hvcmQuc3BsaXQoXCIrXCIpLmV2ZXJ5KChrZXkpID0+IHRoaXMuI2tleW1hcC5nZXQoa2V5KSkpID8/IFtdO1xuXG4gICAgICAgICAgICBpZiAocnVucykgcnVucy5mb3JFYWNoKChydW4pID0+IHJ1bi5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyAja2V5dXAgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNrZXltYXAuZGVsZXRlKGUuY29kZSk7XG5cbiAgICAgICAgaWYgKCFlLm1ldGFLZXkgJiYgKGUuY29kZSA9PT0gXCJNZXRhTGVmdFwiIHx8IGUuY29kZSA9PT0gXCJNZXRhUmlnaHRcIikgJiYgSVNfTUFDX09TKSB0aGlzLiNrZXltYXAuY2xlYXIoKTtcbiAgICAgICAgaWYgKGUubWV0YUtleSAmJiAoZS5jb2RlID09PSBcIlNoaWZ0TGVmdFwiIHx8IGUuY29kZSA9PT0gXCJTaGlmdFJpZ2h0XCIpICYmIElTX01BQ19PUylcbiAgICAgICAgICAgIHRoaXMuI2tleW1hcCA9IG5ldyBNYXAoWy4uLnRoaXMuI2tleW1hcC5lbnRyaWVzKCldLmZpbHRlcigoW2tleV0pID0+ICFrZXkuc3RhcnRzV2l0aChcIktleVwiKSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI2JsdXIgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5jbGVhcigpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgbGlzdGVuKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLiNrZXlkb3duKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuI2tleXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy4jYmx1cik7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlYWZlbigpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy4ja2V5ZG93bik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLiNrZXl1cCk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuI2JsdXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbktleUNob3JkKGNob3JkOiBzdHJpbmcsIHJ1bjogKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgY2hvcmQgPSBjaG9yZC5zcGxpdChcIitcIikuc29ydCgpLmpvaW4oXCIrXCIpO1xuXG4gICAgICAgIGlmICghdGhpcy4ja2V5Y2hvcmRzLmZpbmQoKFtrZXldKSA9PiBrZXkgPT09IGNob3JkKT8uWzFdLnB1c2gocnVuKSkgdGhpcy4ja2V5Y2hvcmRzLnB1c2goW2Nob3JkLCBbcnVuXV0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0tleURvd25BbmROb0ZvY3VzKGtleTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuI2tleW1hcC5nZXQoa2V5KSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5O1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0tleURvd24oa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy4ja2V5bWFwLmdldChrZXkpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy4ja2V5bWFwLmNsZWFyKCk7XG5cbiAgICAgICAgdGhpcy4ja2V5Y2hvcmRzID0gW107XG5cbiAgICAgICAgdGhpcy5kZWFmZW4oKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuXG5leHBvcnQgdHlwZSBNZW51TWFuYWdlckNvbnRleHQgPSB7XG4gICAgbWVudTogSFRNTEVsZW1lbnQ7XG4gICAgY2xpY2tzOiBNYXA8c3RyaW5nLCAoKSA9PiB2b2lkPjtcbiAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgbW91c2Vkb3duOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICAgICAgY29udGV4dG1lbnU6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgICAgICBjbGljazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgfTtcbn07XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQWN0aW9ucyA9IEFycmF5PFJlY29yZDxzdHJpbmcsIHsgbGFiZWw6IHN0cmluZzsgY2FsbGJhY2s6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkIH0+PjtcblxuZXhwb3J0IGNsYXNzIE1lbnVNYW5hZ2VyIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgI2VsZW1lbnRzID0gbmV3IE1hcDxIVE1MRWxlbWVudCwgTWVudU1hbmFnZXJDb250ZXh0PigpO1xuXG4gICAgc3RhdGljIHVzZShlbGVtZW50OiBIVE1MRWxlbWVudCwgYWN0aW9uczogTWVudU1hbmFnZXJBY3Rpb25zKSB7XG4gICAgICAgIGNvbnN0IG1lbnUgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRleHRtZW51XCI+XG4gICAgICAgICAgICAgICAgJHthY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKHJlY29yZCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHJlY29yZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChbbmFtZSwgeyBsYWJlbCB9XSkgPT4gYDxidXR0b24gY2xhc3M9XCIke25hbWV9XCI+JHtsYWJlbH08L2J1dHRvbj5gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCc8ZGl2IGNsYXNzPVwiYnJcIj48L2Rpdj4nKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIGNvbnN0IGNsaWNrcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICBjb25zdCBzZXR1cCA9IChhY3Rpb25zOiBNZW51TWFuYWdlckFjdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGNsaWNrcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBtZW51LmlubmVySFRNTCA9IGFjdGlvbnNcbiAgICAgICAgICAgICAgICAubWFwKChyZWNvcmQpID0+XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHJlY29yZClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKFtuYW1lLCB7IGxhYmVsIH1dKSA9PiBgPGJ1dHRvbiBjbGFzcz1cIiR7bmFtZX1cIj4ke2xhYmVsfTwvYnV0dG9uPmApXG4gICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIlwiKSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmpvaW4oJzxkaXYgY2xhc3M9XCJiclwiPjwvZGl2PicpO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goKHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlY29yZCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsaWNrID0gcmVjb3JkW2tleV0uY2FsbGJhY2suYmluZCh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIG1lbnUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuXCIgKyBrZXkpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2spO1xuICAgICAgICAgICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLlwiICsga2V5KSEuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGNsaWNrKTtcblxuICAgICAgICAgICAgICAgICAgICBjbGlja3Muc2V0KGtleSwgY2xpY2tzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBjb250ZXh0OiBNZW51TWFuYWdlckFjdGlvbnMgfCB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3QgZ2V0QWN0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNvbnRleHQ7XG5cbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhY3Rpb25zO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgbWVudS5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1lbnUpO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlZG93biA9ICgpID0+IHtcbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjb250ZXh0bWVudSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBlLmNsaWVudFggKyBcInB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IGUuY2xpZW50WSArIFwicHhcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNldHVwKGdldEFjdGlvbnMoKSk7XG5cbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfTtcblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2Vkb3duKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgY29udGV4dG1lbnUpO1xuICAgICAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGljayk7XG4gICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGNsaWNrKTtcblxuICAgICAgICB0aGlzLiNlbGVtZW50cy5zZXQoZWxlbWVudCwgeyBtZW51LCBjbGlja3MsIGxpc3RlbmVyczogeyBtb3VzZWRvd24sIGNvbnRleHRtZW51LCBjbGljayB9IH0pO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAobmV3Q29udGV4dDogKHByZXY6IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4gTWVudU1hbmFnZXJBY3Rpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IG5ld0NvbnRleHQuY2FsbCh1bmRlZmluZWQsIFsuLi5hY3Rpb25zXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW1vdmUoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgeyBtZW51LCBjbGlja3MsIGxpc3RlbmVycyB9ID0gdGhpcy4jZWxlbWVudHMuZ2V0KGVsZW1lbnQpID8/IHt9O1xuXG4gICAgICAgIGlmICghbWVudSB8fCAhY2xpY2tzIHx8ICFsaXN0ZW5lcnMpIHRocm93IG5ldyBFcnJvcihgRWxlbWVudHMgYXJlIG5vdCBiZWluZyBhZmZlY3RlZC5gKTtcblxuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbGlzdGVuZXJzLm1vdXNlZG93bik7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVycy5jb250ZXh0bWVudSk7XG4gICAgICAgIG1lbnUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVycy5jbGljayk7XG4gICAgICAgIG1lbnUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVycy5jbGljayk7XG5cbiAgICAgICAgQXJyYXkuZnJvbShjbGlja3MpLmZvckVhY2goKFtrZXksIGxpc3RlbmVyXSkgPT4ge1xuICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yKFwiLlwiICsga2V5KSEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIG1lbnUucXVlcnlTZWxlY3RvcihcIi5cIiArIGtleSkhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBsaXN0ZW5lcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1lbnUucmVtb3ZlKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaHRtbCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vU2FuZGJveE1hbmFnZXJcIjtcblxuZXhwb3J0IGNsYXNzIE1vZGFsTWFuYWdlciB7XG4gICAgc3RhdGljIGdldCBjb250YWluZXIoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1jb250YWluZXJcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyAjb25Nb2RhbE1vdW50KCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPD0gMCkgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgICAgICBlbHNlIHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgI29uTW9kYWxSZXNvbHZlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50IDw9IDApIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkIS5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtaW5hY3RpdmVcIik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkIS5jbGFzc0xpc3QuY29udGFpbnMoXCJtb2RhbC1hbGVydFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGFsZXJ0KG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBhbGVydCA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgbW9kYWwtYWxlcnRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1vZGFsLW1lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1va1wiPk9rPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChhbGVydCk7XG5cbiAgICAgICAgYWxlcnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgIGFsZXJ0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFsZXJ0LnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jb25Nb2RhbFJlc29sdmVkKCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBjb25maXJtKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBjb25maXJtID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1jb25maXJtXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtY2FuY2VsXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChjb25maXJtKTtcblxuICAgICAgICBjb25maXJtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5mb2N1cygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKCkgPT4gcmVzb2x2ZShmYWxzZSk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAodmFsdWU6IGJvb2xlYW4pID0+ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25maXJtLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jb25Nb2RhbFJlc29sdmVkKCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uZmlybS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1jYW5jZWxcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKGZhbHNlKSk7XG5cbiAgICAgICAgICAgIGNvbmZpcm0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKHRydWUpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIHByb21wdChtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy4jb25Nb2RhbE1vdW50KCk7XG5cbiAgICAgICAgY29uc3QgcHJvbXB0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1jb25maXJtXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJtb2RhbC1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgLz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtb2tcIj5PazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWwtY2FuY2VsXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChwcm9tcHQpO1xuXG4gICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmFkZChmaW5pc2gpO1xuXG4gICAgICAgICAgICBjb25zdCBkb25lID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb21wdC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuI29uTW9kYWxSZXNvbHZlZCgpO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5kZWxldGUoZmluaXNoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWNhbmNlbFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLW9rXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHByb21wdC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiLm1vZGFsLWlucHV0XCIpIS52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIE1vdXNlTWFuYWdlciB7XG4gICAgc3RhdGljICNtb3VzZSA9IHsgeDogMCwgeTogMCB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZWRvd25zID0gbmV3IFNldDwoZTogTW91c2VFdmVudCkgPT4gdm9pZD4oKTtcbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNldXBzID0gbmV3IFNldDwoZTogTW91c2VFdmVudCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyAjbW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcbiAgICB9O1xuXG4gICAgc3RhdGljICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmZvckVhY2goKGwpID0+IGwuY2FsbCh1bmRlZmluZWQsIGUpKTtcbiAgICB9O1xuXG4gICAgc3RhdGljICNtb3VzZXVwID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgc3RhcnQoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuXG4gICAgICAgIHRoaXMuI21vdXNlID0geyB4OiAwLCB5OiAwIH07XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcblxuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuI21vdXNldXBzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uTW91c2VEb3duKGhhbmRsZXI6IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuYWRkKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvbk1vdXNlVXAoaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuYWRkKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBvZmZNb3VzZURvd24oaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5kZWxldGUoaGFuZGxlcik7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZk1vdXNlVXAoaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuZGVsZXRlKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgbW91c2UoKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMuI21vdXNlIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZnJvbUZpbGUsIHNhdmVEaWFncmFtIH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi9yZWlmaWVkL091dHB1dFwiO1xuaW1wb3J0IHsgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuLi9yZWlmaWVkL1JlaWZpZWRcIjtcbmltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgS2V5YmluZHNNYW5hZ2VyIH0gZnJvbSBcIi4vS2V5YmluZHNNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNZW51TWFuYWdlciwgTWVudU1hbmFnZXJBY3Rpb25zIH0gZnJvbSBcIi4vTWVudU1hbmFnZXJcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuaW1wb3J0IHsgU3RvcmFnZU1hbmFnZXIgfSBmcm9tIFwiLi9TdG9yYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgVG9hc3RNYW5hZ2VyIH0gZnJvbSBcIi4vVG9hc3RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmcsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9XaXJpbmdNYW5hZ2VyXCI7XG5cbnR5cGUgU2FuZGJveENvbmZpZyA9IHtcbiAgICBrZXliaW5kcz86IFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPjtcbiAgICBtZW51PzogTWVudU1hbmFnZXJBY3Rpb25zO1xuICAgIGluaXRpYWw/OiBbY29tcG9uZW50czogUmVpZmllZFtdLCB3aXJlczogV2lyaW5nW11dO1xuICAgIGxpbWl0cz86IHtcbiAgICAgICAgaW5wdXRzPzogbnVtYmVyO1xuICAgICAgICBvdXRwdXRzPzogbnVtYmVyO1xuICAgICAgICB3aXJpbmdzPzogbnVtYmVyO1xuICAgICAgICBjaGlwcz86IFJlY29yZDxzdHJpbmcsIG51bWJlcj47XG4gICAgICAgIGNoaXBzVG90YWw/OiBudW1iZXI7XG4gICAgICAgIGNvbXBvbmVudHNUb3RhbD86IG51bWJlcjtcbiAgICB9O1xuICAgIHN0YXRlcz86IHsgaW5wdXRzPzogYm9vbGVhbltdOyBvdXRwdXRzPzogYm9vbGVhbltdOyBjYWxsYmFjazogKCkgPT4gdm9pZCB9W107XG4gICAgc2F2ZT86IHN0cmluZztcbiAgICBvdmVycmlkZVNhdmVJZkV4aXN0cz86IGJvb2xlYW47XG59O1xuXG5jb25zdCBjYWxjdWxhdGVSZWlmaWVkVG90YWxzID0gKHNldDogU2V0PFJlaWZpZWQ+KSA9PlxuICAgIFsuLi5zZXRdLnJlZHVjZShcbiAgICAgICAgKG1hcCwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBJbnB1dCkge1xuICAgICAgICAgICAgICAgIG1hcC5pbnB1dHNUb3RhbCsrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtIGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgbWFwLm91dHB1dHNUb3RhbCsrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtIGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgbWFwLmNoaXBzVG90YWwrKztcblxuICAgICAgICAgICAgICAgIG1hcC5jaGlwcy5zZXQoaXRlbS5jaGlwLm5hbWUsIChtYXAuY2hpcHMuZ2V0KGl0ZW0uY2hpcC5uYW1lKSA/PyAwKSArIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGNvbXBvbmVudCB0eXBlLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaW5wdXRzVG90YWw6IDAsXG4gICAgICAgICAgICBvdXRwdXRzVG90YWw6IDAsXG4gICAgICAgICAgICBjaGlwc1RvdGFsOiAwLFxuICAgICAgICAgICAgY2hpcHM6IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCksXG4gICAgICAgIH0sXG4gICAgKTtcblxuZXhwb3J0IGNsYXNzIFNhbmRib3hNYW5hZ2VyIHtcbiAgICBzdGF0aWMgcXVldWVOZXdDb250ZXh0OiBSZXR1cm5UeXBlPHR5cGVvZiBNZW51TWFuYWdlcltcInVzZVwiXT5bMF07XG5cbiAgICBzdGF0aWMgd2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcyA9IG5ldyBTZXQ8KCkgPT4gdm9pZD4oKTtcblxuICAgIHN0YXRpYyAjb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGF0aWMgI2hpc3RvcnkgPSBuZXcgQXJyYXk8W2NvbW1hbmQ6ICgpID0+IHZvaWQsIHJlZG86ICgpID0+IHZvaWRdPigpO1xuICAgIHN0YXRpYyAjcmVkb3MgPSBuZXcgQXJyYXk8W2NvbW1hbmQ6ICgpID0+IHZvaWQsIHJlZG86ICgpID0+IHZvaWRdPigpO1xuXG4gICAgc3RhdGljICNjb25maWc6IFNhbmRib3hDb25maWc7XG5cbiAgICBzdGF0aWMgc2V0dXAoY29uZmlnOiBTYW5kYm94Q29uZmlnKSB7XG4gICAgICAgIHRoaXMuI2NvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxkaXYgY2xhc3M9XCJtb2RhbC1jb250YWluZXIgbW9kYWwtaW5hY3RpdmVcIj48L2Rpdj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxkaXYgY2xhc3M9XCJyZWlmaWVkLXJvb3RcIj48L2Rpdj5gKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChodG1sYDxjYW52YXM+PC9jYW52YXM+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8ZGl2IGNsYXNzPVwidG9hc3RzLWNvbnRhaW5lclwiPjwvZGl2PmApO1xuXG4gICAgICAgIE1vdXNlTWFuYWdlci5zdGFydCgpO1xuICAgICAgICBLZXliaW5kc01hbmFnZXIubGlzdGVuKCk7XG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5saXN0ZW4oKTtcbiAgICAgICAgV2lyaW5nTWFuYWdlci5zdGFydCgpO1xuXG4gICAgICAgIGNvbnN0IGNyZWF0ZVJlaWZpZWRBY3RpdmUgPSAoY29tcG9uZW50czogUmVpZmllZFtdKSA9PlxuICAgICAgICAgICAgbmV3IFdhdGNoZWRTZXQ8UmVpZmllZD4oKVxuICAgICAgICAgICAgICAgIC5vbkFkZCgoaXRlbSwgc2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFscyA9IGNhbGN1bGF0ZVJlaWZpZWRUb3RhbHMoc2V0LmNsb25lKCkuYWRkKGl0ZW0pKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHMuY2hpcHNUb3RhbCArIHRvdGFscy5pbnB1dHNUb3RhbCArIHRvdGFscy5vdXRwdXRzVG90YWwgPlxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuI2NvbmZpZy5saW1pdHM/LmNvbXBvbmVudHNUb3RhbCA/PyBJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRXhjZWVkZWQgdG90YWwgY29tcG9uZW50cyBsaW1pdC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxzLmlucHV0c1RvdGFsID4gKHRoaXMuI2NvbmZpZy5saW1pdHM/LmlucHV0cyA/PyBJbmZpbml0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJFeGNlZWRlZCB0b3RhbCBpbnB1dHMgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFscy5vdXRwdXRzVG90YWwgPiAodGhpcy4jY29uZmlnLmxpbWl0cz8ub3V0cHV0cyA/PyBJbmZpbml0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJFeGNlZWRlZCB0b3RhbCBvdXRwdXRzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbHMuY2hpcHNUb3RhbCA+ICh0aGlzLiNjb25maWcubGltaXRzPy5jaGlwc1RvdGFsID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIGNoaXBzIGxpbWl0LlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gaW5zdGFuY2VvZiBDb21wb25lbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFscy5jaGlwcy5oYXMoaXRlbS5jaGlwLm5hbWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbHMuY2hpcHMuZ2V0KGl0ZW0uY2hpcC5uYW1lKSEgPiAodGhpcy4jY29uZmlnLmxpbWl0cz8uY2hpcHM/LltpdGVtLmNoaXAubmFtZV0gPz8gSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgRXhjZWVkZWQgdG90YWwgJyR7aXRlbS5jaGlwLm5hbWV9JyBsaW1pdC5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFkZEFsbChjb21wb25lbnRzKTtcblxuICAgICAgICBjb25zdCBjcmVhdGVXaXJpbmdzU2V0ID0gKHdpcmluZ3M6IFdpcmluZ1tdKSA9PlxuICAgICAgICAgICAgbmV3IFdhdGNoZWRTZXQ8V2lyaW5nPigpXG4gICAgICAgICAgICAgICAgLm9uQWRkKChfLCBzZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldC5zaXplICsgMSA+ICh0aGlzLiNjb25maWcubGltaXRzPy53aXJpbmdzID8/IEluZmluaXR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkV4Y2VlZGVkIHRvdGFsIHdpcmluZ3MgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWRkQWxsKHdpcmluZ3MpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLm1lbnUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICBbdGhpcy5xdWV1ZU5ld0NvbnRleHRdID0gTWVudU1hbmFnZXIudXNlKFJlaWZpZWQucm9vdCwgdGhpcy4jY29uZmlnLm1lbnUpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLmtleWJpbmRzICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy4jY29uZmlnLmtleWJpbmRzKS5mb3JFYWNoKChbY2hvcmQsIHJ1bl0pID0+IEtleWJpbmRzTWFuYWdlci5vbktleUNob3JkKGNob3JkLCBydW4pKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuI2NvbmZpZy5pbml0aWFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlID0gY3JlYXRlUmVpZmllZEFjdGl2ZSh0aGlzLiNjb25maWcuaW5pdGlhbFswXSk7XG5cbiAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmF0dGFjaCgpKTtcblxuICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcyA9IGNyZWF0ZVdpcmluZ3NTZXQodGhpcy4jY29uZmlnLmluaXRpYWxbMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNjb25maWcuc2F2ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IFN0b3JhZ2VNYW5hZ2VyLmdldDxzdHJpbmc+KFwic2F2ZXM6XCIgKyB0aGlzLiNjb25maWcuc2F2ZSk7XG5cbiAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBbY29tcG9uZW50cywgd2lyZXNdLFxuICAgICAgICAgICAgICAgIH0gPSBmcm9tRmlsZShmaWxlKTtcblxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5kZWxldGUoXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlKTtcblxuICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gcmVhZCBmcm9tIHNhdmVzLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLiNjb25maWcub3ZlcnJpZGVTYXZlSWZFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUgPSBjcmVhdGVSZWlmaWVkQWN0aXZlKGNvbXBvbmVudHMhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZm9yRWFjaCgoY29tcG9uZW50KSA9PiBjb21wb25lbnQuYXR0YWNoKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzID0gY3JlYXRlV2lyaW5nc1NldCh3aXJlcyEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzYXZlczpcIiArIHRoaXMuI2NvbmZpZy5zYXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZURpYWdyYW0oWy4uLlJlaWZpZWQuYWN0aXZlXSwgWy4uLldpcmluZ01hbmFnZXIud2lyZXNdKSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy4jY29uZmlnLnNhdmUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgU3RvcmFnZU1hbmFnZXIuc2V0KFxuICAgICAgICAgICAgICAgICAgICBcInNhdmVzOlwiICsgdGhpcy4jY29uZmlnLnNhdmUsXG4gICAgICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIub2JzZXJ2ZShSZWlmaWVkLnJvb3QsIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsXG4gICAgICAgICAgICBjaGFyYWN0ZXJEYXRhT2xkVmFsdWU6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvL1RPRE86IEltcGxlbWVudCBsaW1pdHNcbiAgICAgICAgLy9UT0RPOiBJbXBsZW1lbnQgZGlhZ3JhbSBzdGF0ZSBjaGVjayBjYWxsYmFja3NcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLiNvYnNlcnZlcikge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIE1vdXNlTWFuYWdlci5yZXNldCgpO1xuICAgICAgICBLZXliaW5kc01hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIuc3RvcCgpO1xuXG4gICAgICAgIE1lbnVNYW5hZ2VyLnJlbW92ZShSZWlmaWVkLnJvb3QpO1xuXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZm9yRWFjaCgoZmluaXNoKSA9PiBmaW5pc2guY2FsbCh1bmRlZmluZWQpKTtcblxuICAgICAgICB0aGlzLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuY2xlYXIoKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgdGhpcy4jY29uZmlnID0ge307XG4gICAgfVxuXG4gICAgc3RhdGljIGNsZWFyKCkge1xuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5kZXRhY2goKSk7XG5cbiAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB3aXJlLmRlc3Ryb3koKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHB1c2hIaXN0b3J5KGNvbW1hbmQ6ICgpID0+IHZvaWQsIHVuZG86ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jcmVkb3MubGVuZ3RoID0gMDtcblxuICAgICAgICBjb21tYW5kLmNhbGwodW5kZWZpbmVkKTtcblxuICAgICAgICB0aGlzLiNoaXN0b3J5LnB1c2goW2NvbW1hbmQsIHVuZG9dKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcG9wSGlzdG9yeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiNoaXN0b3J5Lmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJOb3RoaW5nIHRvIHVuZG8uXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBbcmVkbywgdW5kb10gPSB0aGlzLiNoaXN0b3J5LnBvcCgpITtcblxuICAgICAgICB0aGlzLiNyZWRvcy5wdXNoKFtyZWRvLCB1bmRvXSk7XG5cbiAgICAgICAgcmV0dXJuIHVuZG8uY2FsbCh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWRvSGlzdG9yeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiNyZWRvcy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTm90aGluZyB0byByZWRvLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgW2NvbW1hbmQsIHVuZG9dID0gdGhpcy4jcmVkb3MucG9wKCkhO1xuXG4gICAgICAgIHRoaXMuI2hpc3RvcnkucHVzaChbY29tbWFuZCwgdW5kb10pO1xuXG4gICAgICAgIHJldHVybiBjb21tYW5kLmNhbGwodW5kZWZpbmVkKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU3RvcmFnZU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSBwcmVmaXggPSBcImtlbHNueS5nYXRlc2ltOlwiO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG4gICAgc3RhdGljIHNldDxUPihrZXk6IHN0cmluZywgdmFsdWU6IFQpOiBUIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldEl0ZW0odGhpcy5wcmVmaXggKyBrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQ8VD4oa2V5OiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXggKyBrZXkpISkgPz8gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWxldGUoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMucHJlZml4ICsga2V5KSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMucHJlZml4ICsga2V5KTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRvYXN0RGF0YSB7XG4gICAgbWVzc2FnZTogc3RyaW5nO1xuICAgIGNvbG9yOiBzdHJpbmc7XG4gICAgZHVyYXRpb246IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFRvYXN0TWFuYWdlciB7XG4gICAgc3RhdGljIGdldCBjb250YWluZXIoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi50b2FzdHMtY29udGFpbmVyXCIpITtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgdG9hc3QoeyBtZXNzYWdlLCBjb2xvciwgZHVyYXRpb24gfTogVG9hc3REYXRhKSB7XG4gICAgICAgIGNvbnN0IHRvYXN0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdC1jb2xvclwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidG9hc3QtbWVzc2FnZVwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNsb3NlLXRvYXN0XCI+4pWzPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0b2FzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi50b2FzdC1jb2xvclwiKSEuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XG5cbiAgICAgICAgdG9hc3Quc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBkdXJhdGlvbiArIFwibXNcIjtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0b2FzdCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9hc3QucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdG9hc3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY2xvc2UtdG9hc3RcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKTtcblxuICAgICAgICAgICAgdG9hc3QuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBoYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgV2F0Y2hlZFNldCB9IGZyb20gXCIuLi9hdWdtZW50cy9XYXRjaGVkU2V0XCI7XG5pbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBMSUdIVF9HUkFZX0NTU19DT0xPUiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgTmV3V2lyZUNvbnRleHQge1xuICAgIHN0YXRpYyBmcm9tOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyB7XG4gICAgICAgIE1vdXNlTWFuYWdlci5vbk1vdXNlRG93bigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKE5ld1dpcmVDb250ZXh0LmZyb20pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRhcmdldCB9ID0gZTtcblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImJvYXJkLW91dHB1dFwiKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNvbXBvbmVudC1pbnB1dC1idXR0b25cIilcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZChuZXcgV2lyaW5nKE5ld1dpcmVDb250ZXh0LmZyb20sIHRhcmdldCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2lyaW5nIHtcbiAgICAjZGVzdHJveWVkID0gZmFsc2U7XG4gICAgI29ic2VydmVyO1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZnJvbTogRWxlbWVudCwgcmVhZG9ubHkgdG86IEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICB0by5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIub2JzZXJ2ZShmcm9tLCB7IGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sIGF0dHJpYnV0ZXM6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy4jZGVzdHJveWVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgZ2V0IGRlc3Ryb3llZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2Rlc3Ryb3llZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXaXJpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI3JBRjogbnVtYmVyIHwgdW5kZWZpbmVkID0gLTE7XG5cbiAgICBzdGF0aWMgd2lyZXMgPSBuZXcgV2F0Y2hlZFNldDxXaXJpbmc+KCk7XG5cbiAgICBzdGF0aWMgdXBkYXRlKCkge1xuICAgICAgICBjb25zdCBjdHggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiY2FudmFzXCIpIS5nZXRDb250ZXh0KFwiMmRcIikhO1xuXG4gICAgICAgIGN0eC5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgY3R4LmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICBpZiAod2lyZS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpcmVzLmRlbGV0ZSh3aXJlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZnJvbSA9IHdpcmUuZnJvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IHRvID0gd2lyZS50by5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHdpcmUuZnJvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpO1xuXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB3aXJlLmZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpID8gQUNUSVZBVEVEX0NTU19DT0xPUiA6IExJR0hUX0dSQVlfQ1NTX0NPTE9SO1xuXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gNTtcblxuICAgICAgICAgICAgY3R4LmxpbmVKb2luID0gXCJyb3VuZFwiO1xuXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHgubW92ZVRvKGZyb20ueCArIGZyb20ud2lkdGggLyAyLCBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyh0by54ICsgdG8ud2lkdGggLyAyLCB0by55ICsgdG8uaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChOZXdXaXJlQ29udGV4dC5mcm9tKSB7XG4gICAgICAgICAgICBjb25zdCBmcm9tID0gTmV3V2lyZUNvbnRleHQuZnJvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gTmV3V2lyZUNvbnRleHQuZnJvbS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIilcbiAgICAgICAgICAgICAgICA/IEFDVElWQVRFRF9DU1NfQ09MT1JcbiAgICAgICAgICAgICAgICA6IExJR0hUX0dSQVlfQ1NTX0NPTE9SO1xuXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gNTtcblxuICAgICAgICAgICAgY3R4LmxpbmVKb2luID0gXCJyb3VuZFwiO1xuXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHgubW92ZVRvKGZyb20ueCArIGZyb20ud2lkdGggLyAyLCBmcm9tLnkgKyBmcm9tLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhNb3VzZU1hbmFnZXIubW91c2UueCwgTW91c2VNYW5hZ2VyLm1vdXNlLnkpO1xuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIGNvbnN0IGlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RhcnQuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNyQUYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuI3JBRiA9IC0xO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNyQUYgPSBpZDtcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RvcCgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLiNyQUYgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuI3JBRiA/PyAwKTtcblxuICAgICAgICAgICAgdGhpcy4jckFGID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgIElOUFVUX0NPTVBPTkVOVF9DU1NfU0laRSxcbiAgICBJTl9ERUJVR19NT0RFLFxuICAgIE9SSUdJTl9QT0lOVCxcbiAgICBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGZyb21GaWxlLCBzYXZlRGlhZ3JhbSB9IGZyb20gXCIuL2ZpbGVzXCI7XG5pbXBvcnQgeyBrZXliaW5kcyB9IGZyb20gXCIuL2tleWJpbmRzXCI7XG5pbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IE1lbnVNYW5hZ2VyQWN0aW9ucyB9IGZyb20gXCIuL21hbmFnZXJzL01lbnVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Nb2RhbE1hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvU3RvcmFnZU1hbmFnZXJcIjtcbmltcG9ydCB7IFRvYXN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1RvYXN0TWFuYWdlclwiO1xuaW1wb3J0IHsgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGNoaXBzIH0gZnJvbSBcIi4vcmVpZmllZC9jaGlwc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNvbnN0IG1lbnU6IE1lbnVNYW5hZ2VyQWN0aW9ucyA9IFtcbiAgICB7XG4gICAgICAgIFwiaW5zZXJ0LWNoaXBcIjoge1xuICAgICAgICAgICAgbGFiZWw6IFwiSW5zZXJ0IGNoaXBcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiRW50ZXIgdGhlIGNoaXAncyBuYW1lOlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpcCA9IGNoaXBzLmdldChuYW1lLnRvVXBwZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlwKSByZXR1cm4gTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiTm8gY2hpcCB3YXMgZm91bmQgd2l0aCB0aGF0IG5hbWUuXCIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudChSZWZsZWN0LmNvbnN0cnVjdChjaGlwLCBbXSksIE9SSUdJTl9QT0lOVCk7XG5cbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQoY29tcG9uZW50KTtcblxuICAgICAgICAgICAgICAgIGlmIChSZWlmaWVkLmFjdGl2ZS5oYXMoY29tcG9uZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKGNvbXBvbmVudC5lbGVtZW50LCBjb21wb25lbnQubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBnZXRDb21wdXRlZFN0eWxlKGNvbXBvbmVudC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBwYXJzZUZsb2F0KHdpZHRoKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBlLmNsaWVudFkgLSBwYXJzZUZsb2F0KGhlaWdodCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgICBcIm5ldy1pbnB1dFwiOiB7XG4gICAgICAgICAgICBsYWJlbDogXCJOZXcgaW5wdXRcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gbmV3IElucHV0KHtcbiAgICAgICAgICAgICAgICAgICAgeDogZS5jbGllbnRYIC0gSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgICAgICAgICAgeTogZS5jbGllbnRZIC0gSU5QVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoUmVpZmllZC5hY3RpdmUuaGFzKGlucHV0KSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5hdHRhY2goKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBcIm5ldy1vdXRwdXRcIjoge1xuICAgICAgICAgICAgbGFiZWw6IFwiTmV3IG91dHB1dFwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gbmV3IE91dHB1dCh7XG4gICAgICAgICAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIE9VVFBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgICAgICB5OiBlLmNsaWVudFkgLSBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmFkZChvdXRwdXQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFJlaWZpZWQuYWN0aXZlLmhhcyhvdXRwdXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5hdHRhY2goKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgLy8ge1xuICAgIC8vICAgICBcIm5ldy1jaGlwXCI6IHtcbiAgICAvLyAgICAgICAgIGxhYmVsOiBcIk5ldyBjaGlwIGZyb20gZGlhZ3JhbVwiLFxuICAgIC8vICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAvLyAgICAgICAgICAgICBjb25zdCBuYW1lID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIkVudGVyIHRoZSBuYW1lIG9mIHRoZSBjaGlwOlwiKTtcblxuICAgIC8vICAgICAgICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xuXG4gICAgLy8gICAgICAgICAgICAgaWYgKFxuICAgIC8vICAgICAgICAgICAgICAgICBjaGlwcy5oYXMobmFtZS50cmltKCkudG9VcHBlckNhc2UoKSkgJiZcbiAgICAvLyAgICAgICAgICAgICAgICAgIShhd2FpdCBNb2RhbE1hbmFnZXIuY29uZmlybShcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIFwiQSBjaGlwIGFscmVhZHkgZXhpc3RzIHdpdGggdGhpcyBuYW1lLlxcbkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZXBsYWNlIGl0P1wiLFxuICAgIC8vICAgICAgICAgICAgICAgICApKVxuICAgIC8vICAgICAgICAgICAgIClcbiAgICAvLyAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgLy8gICAgICAgICAgICAgaWYgKCEvXlxcdyskLy50ZXN0KG5hbWUudHJpbSgpLnRvVXBwZXJDYXNlKCkpKVxuICAgIC8vICAgICAgICAgICAgICAgICByZXR1cm4gTW9kYWxNYW5hZ2VyLmFsZXJ0KFwiQ2hpcCBuYW1lIG11c3QgY29uc2lzdCBvZiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLlwiKTtcblxuICAgIC8vICAgICAgICAgICAgIGNvbnN0IGlucHV0cyA9IFsuLi5SZWlmaWVkLmFjdGl2ZS52YWx1ZXMoKV0uZmlsdGVyKCh2KSA9PiB2IGluc3RhbmNlb2YgSW5wdXQpLmxlbmd0aDtcbiAgICAvLyAgICAgICAgICAgICBjb25zdCBvdXRwdXRzID0gWy4uLlJlaWZpZWQuYWN0aXZlLnZhbHVlcygpXS5maWx0ZXIoKHYpID0+IHYgaW5zdGFuY2VvZiBPdXRwdXQpLmxlbmd0aDtcblxuICAgIC8vICAgICAgICAgICAgIGNoaXBzLnNldChcbiAgICAvLyAgICAgICAgICAgICAgICAgbmFtZS50cmltKCkudG9VcHBlckNhc2UoKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgY2xhc3MgXyBleHRlbmRzIENoaXA8bnVtYmVyLCBudW1iZXI+IHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gbmFtZSEudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gaW5wdXRzO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSBvdXRwdXRzO1xuXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlcihuYW1lISwgaW5wdXRzLCBvdXRwdXRzKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgb3V0cHV0KGlucHV0czogYm9vbGVhbltdKTogYm9vbGVhbltdIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IFNPTUVIT1cgQ09NUElMRSBUSEUgRElBR1JBTVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogU09SVCBJTlBVVFMvT1VUUFVUUyBCWSBZLUNPT1JEXG5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgIH0sXG4gICAgLy8gICAgICAgICAgICAgKTtcblxuICAgIC8vICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnJlc2V0KCk7XG4gICAgLy8gICAgICAgICB9LFxuICAgIC8vICAgICB9LFxuICAgIC8vIH0sXG4gICAge1xuICAgICAgICBcInNhdmUtYXNcIjoge1xuICAgICAgICAgICAgbGFiZWw6IFwiU2F2ZSBhcyBmaWxlXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIiksIHtcbiAgICAgICAgICAgICAgICAgICAgaHJlZjogVVJMLmNyZWF0ZU9iamVjdFVSTChcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBCbG9iKFtzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIGRvd25sb2FkOiBgZ2F0ZXNpbS0ke0RhdGUubm93KCl9Lmpzb25gLFxuICAgICAgICAgICAgICAgIH0pLmNsaWNrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBcImltcG9ydC1mcm9tXCI6IHtcbiAgICAgICAgICAgIGxhYmVsOiBcIkltcG9ydCBmcm9tIGZpbGVcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBPYmplY3QuYXNzaWduKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSwgeyB0eXBlOiBcImZpbGVcIiB9KTtcblxuICAgICAgICAgICAgICAgIGlucHV0LmNsaWNrKCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgbmV3IFByb21pc2U8RmlsZSB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQub25jaGFuZ2UgPSAoKSA9PiByZXNvbHZlKGlucHV0LmZpbGVzPy5bMF0gPz8gdW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgICAgICAgICBpbnB1dC5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTm8gZmlsZSB3YXMgcHJvdmlkZWQuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJhdyA9IGF3YWl0IG5ldyBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHJlc29sdmUocmVhZGVyLnJlc3VsdD8udG9TdHJpbmcoKSA/PyB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFyYXcpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gcmVhZCB0aGUgZmlsZS5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBbY29tcG9uZW50cywgd2lyZXNdLFxuICAgICAgICAgICAgICAgIH0gPSBmcm9tRmlsZShyYXcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSByZXR1cm4gVG9hc3RNYW5hZ2VyLnRvYXN0KHsgbWVzc2FnZTogZXJyb3IsIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLCBkdXJhdGlvbjogMjUwMCB9KTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnJlc2V0KCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5zZXR1cCh7XG4gICAgICAgICAgICAgICAgICAgIGtleWJpbmRzLFxuICAgICAgICAgICAgICAgICAgICBtZW51LFxuICAgICAgICAgICAgICAgICAgICBzYXZlOiBcInNhbmRib3hcIixcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbDogW2NvbXBvbmVudHMhLCB3aXJlcyFdLFxuICAgICAgICAgICAgICAgICAgICBvdmVycmlkZVNhdmVJZkV4aXN0czogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcInNhdmVzOlwiICsgXCJzYW5kYm94XCIsIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIC4uLihJTl9ERUJVR19NT0RFXG4gICAgICAgID8gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBTVE9QOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU1RPUCBSRU5ERVJcIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFNUQVJUOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiU1RBUlQgUkVOREVSXCIsXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci5zdGFydCgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgIF1cbiAgICAgICAgOiBbXSksXG5dO1xuIiwiaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IE5ld1dpcmVDb250ZXh0LCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IENoaXAgfSBmcm9tIFwiLi9jaGlwc1wiO1xuaW1wb3J0IHsgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudDxJIGV4dGVuZHMgbnVtYmVyLCBPIGV4dGVuZHMgbnVtYmVyPiBleHRlbmRzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IGVsZW1lbnQ7XG5cbiAgICByZWFkb25seSBpbnB1dHM7XG4gICAgcmVhZG9ubHkgb3V0cHV0cztcbiAgICByZWFkb25seSBuYW1lO1xuXG4gICAgcmVhZG9ubHkgI29ic2VydmVycyA9IG5ldyBNYXA8RWxlbWVudCwgTXV0YXRpb25PYnNlcnZlcj4oKTtcbiAgICByZWFkb25seSAjY29udGV4dG1lbnVzID0gbmV3IE1hcDxFbGVtZW50LCAoKSA9PiB2b2lkPigpO1xuXG4gICAgcmVhZG9ubHkgY2hpcDogQ2hpcDxJLCBPPjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBjaGlwOiBDaGlwPEksIE8+LFxuICAgICAgICBwb3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB8ICgoY29tcDogQ29tcG9uZW50PEksIE8+KSA9PiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pLFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuY2hpcCA9IGNoaXA7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KHRoaXMuY2hpcC5pbnB1dHMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtaW5wdXQtYnV0dG9uXCI+STwvYnV0dG9uPicpLmpvaW4oXCJcIil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjb21wb25lbnQtbmFtZVwiPiR7dGhpcy5jaGlwLm5hbWV9PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0c1wiPlxuICAgICAgICAgICAgICAgICAgICAke0FycmF5KHRoaXMuY2hpcC5vdXRwdXRzKS5maWxsKCc8YnV0dG9uIGNsYXNzPVwiY29tcG9uZW50LW91dHB1dC1idXR0b25cIj5PPC9idXR0b24+Jykuam9pbihcIlwiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LWlucHV0LWJ1dHRvblwiKSk7XG4gICAgICAgIHRoaXMub3V0cHV0cyA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uXCIpKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvbXBvbmVudC1uYW1lXCIpITtcblxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlcnMuc2V0KGlucHV0LCBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKSk7XG5cbiAgICAgICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQoaW5wdXQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKHByZXYpID0+IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb25uZWN0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpcmUudG8gPT09IGlucHV0KSB3aXJlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KG91dHB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgocHJldikgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNyZWF0ZS1jb25uZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDcmVhdGUgY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSBvdXRwdXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldCh0aGlzLm5hbWUsICgpID0+IHtcbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgocHJldikgPT4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29tcG9uZW50XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBjb21wb25lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5zb21lKChpKSA9PiB3aXJlLnRvID09PSBpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnNvbWUoKG8pID0+IHdpcmUuZnJvbSA9PT0gbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpKSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHR5cGVvZiBwb3MgPT09IFwiZnVuY3Rpb25cIiA/IHBvcy5jYWxsKHVuZGVmaW5lZCwgdGhpcykgOiBwb3MpO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3Qgb3V0ID0gdGhpcy5jaGlwLmV2YWx1YXRlKHRoaXMuaW5wdXRzLm1hcCgoaSkgPT4gaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikpKTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpKSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCBvdXRbaV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlcnMuZ2V0KGlucHV0KSEub2JzZXJ2ZShpbnB1dCwge1xuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnVzLmdldChpbnB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vdXRwdXRzLmZvckVhY2goKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgb3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KG91dHB1dCkhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5uYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMubmFtZSkhKTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIud2F0Y2godGhpcy5lbGVtZW50LCB0aGlzLm5hbWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgc3VwZXIuZGV0YWNoKCk7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXJzLmZvckVhY2goKG8pID0+IG8uZGlzY29ubmVjdCgpKTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuZm9yRWFjaCgobGlzdGVuZXIsIGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKSk7XG5cbiAgICAgICAgdGhpcy5uYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KHRoaXMubmFtZSkhKTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIuZm9yZ2V0KHRoaXMuZWxlbWVudCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvU2FuZGJveE1hbmFnZXJcIjtcbmltcG9ydCB7IE5ld1dpcmVDb250ZXh0LCBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnB1dCBleHRlbmRzIFJlaWZpZWQge1xuICAgIHJlYWRvbmx5IGVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwb3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSA9IHsgeDogMCwgeTogMCB9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGA8YnV0dG9uIGNsYXNzPVwiYm9hcmQtaW5wdXRcIj5JPC9idXR0b24+YDtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICByZWFkb25seSAjbW91c2Vkb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQueCA9IGUuY2xpZW50WC50b1N0cmluZygpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC55ID0gZS5jbGllbnRZLnRvU3RyaW5nKCk7XG4gICAgfTtcblxuICAgIHJlYWRvbmx5ICNjbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChNYXRoLmh5cG90KGUuY2xpZW50WCAtICt0aGlzLmVsZW1lbnQuZGF0YXNldC54ISwgZS5jbGllbnRZIC0gK3RoaXMuZWxlbWVudC5kYXRhc2V0LnkhKSA+IDIpIHJldHVybjtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51ID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKHByZXYpID0+IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNyZWF0ZS1jb25uZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQ3JlYXRlIGNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE5ld1dpcmVDb250ZXh0LmZyb20gPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1pbnB1dFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlbGV0ZSBpbnB1dFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuZGVsZXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAuLi5wcmV2LFxuICAgICAgICBdKTtcbiAgICB9O1xuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51ID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKHByZXYpID0+IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1vdXRwdXRcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgb3V0cHV0XCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSB0aGlzLmVsZW1lbnQpIHdpcmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLnRvID09PSB0aGlzLmVsZW1lbnQpIHdpcmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgXSk7XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9ID0geyB4OiAwLCB5OiAwIH0pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBodG1sYDxidXR0b24gY2xhc3M9XCJib2FyZC1vdXRwdXRcIj5PPC9idXR0b24+YDtcblxuICAgICAgICB0aGlzLm1vdmUocG9zKTtcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIHN1cGVyLmF0dGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRldGFjaCgpIHtcbiAgICAgICAgc3VwZXIuZGV0YWNoKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFdhdGNoZWRTZXQgfSBmcm9tIFwiLi4vYXVnbWVudHMvV2F0Y2hlZFNldFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaHRtbCh0ZW1wbGF0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnZhbHVlczogdW5rbm93bltdKTogSFRNTEVsZW1lbnQ7XG5leHBvcnQgZnVuY3Rpb24gaHRtbChodG1sOiBzdHJpbmcpOiBIVE1MRWxlbWVudDtcbmV4cG9ydCBmdW5jdGlvbiBodG1sKC4uLmFyZ3M6IFtzdHJpbmddIHwgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi51bmtub3duW11dKSB7XG4gICAgY29uc3QgW3RlbXBsYXRlLCAuLi52YWx1ZXNdID0gYXJncztcblxuICAgIGNvbnN0IGh0bWwgPVxuICAgICAgICB0eXBlb2YgdGVtcGxhdGUgPT09IFwic3RyaW5nXCIgPyB0ZW1wbGF0ZSA6IHRlbXBsYXRlLnJlZHVjZSgoaHRtbCwgdGV4dCwgaSkgPT4gaHRtbCArIHRleHQgKyB2YWx1ZXNbaV0gPz8gXCJcIiwgXCJcIik7XG5cbiAgICByZXR1cm4gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKS5ib2R5LmNoaWxkTm9kZXNbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChlOiBFdmVudCkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlaWZpZWQge1xuICAgIHN0YXRpYyBhY3RpdmUgPSBuZXcgV2F0Y2hlZFNldDxSZWlmaWVkPigpO1xuXG4gICAgc3RhdGljIGdldCByb290KCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIucmVpZmllZC1yb290XCIpITtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCByZWFkb25seSBlbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICAgIG1vdmUoeyB4LCB5IH06IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHggKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB5ICsgXCJweFwiO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgUmVpZmllZC5yb290LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwidHlwZSBCb29sZWFuVHVwbGU8TCBleHRlbmRzIG51bWJlciwgUiBleHRlbmRzIGJvb2xlYW5bXSA9IFtdPiA9IG51bWJlciBleHRlbmRzIExcbiAgICA/IGJvb2xlYW5bXVxuICAgIDogUltcImxlbmd0aFwiXSBleHRlbmRzIExcbiAgICA/IFJcbiAgICA6IEJvb2xlYW5UdXBsZTxMLCBbLi4uUiwgYm9vbGVhbl0+O1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2hpcDxJIGV4dGVuZHMgbnVtYmVyLCBPIGV4dGVuZHMgbnVtYmVyPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUU6IHN0cmluZztcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTOiBudW1iZXI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFM6IG51bWJlcjtcblxuICAgIHJlYWRvbmx5IG5hbWU7XG5cbiAgICByZWFkb25seSBpbnB1dHM7XG4gICAgcmVhZG9ubHkgb3V0cHV0cztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgaW5wdXRzOiBJLCBvdXRwdXRzOiBPKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzO1xuICAgICAgICB0aGlzLm91dHB1dHMgPSBvdXRwdXRzO1xuICAgIH1cblxuICAgIGFic3RyYWN0IG91dHB1dChpbnB1dHM6IEJvb2xlYW5UdXBsZTxJPik6IEJvb2xlYW5UdXBsZTxPPjtcblxuICAgIGV2YWx1YXRlKGlucHV0czogYm9vbGVhbltdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm91dHB1dChpbnB1dHMgYXMgQm9vbGVhblR1cGxlPEksIFtdPikgYXMgYm9vbGVhbltdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFuZEdhdGUgZXh0ZW5kcyBDaGlwPDIsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiQU5EXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiQU5EXCIsIDIsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbYSwgYl06IFtib29sZWFuLCBib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbYSAmJiBiXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPckdhdGUgZXh0ZW5kcyBDaGlwPDIsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiT1JcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJPUlwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gW2EgfHwgYl07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm90R2F0ZSBleHRlbmRzIENoaXA8MSwgMT4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FID0gXCJOT1RcIjtcbiAgICBzdGF0aWMgcmVhZG9ubHkgSU5QVVRTID0gMTtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IDE7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJOT1RcIiwgMSwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFtuXTogW2Jvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFshbl07XG4gICAgfVxufVxuXG50eXBlIFN0YXRpY01lbWJlcnM8VD4gPSB7IFtLIGluIGtleW9mIFRdOiBUW0tdIH07XG5cbmV4cG9ydCBjb25zdCBjaGlwcyA9IG5ldyBNYXA8c3RyaW5nLCBTdGF0aWNNZW1iZXJzPHR5cGVvZiBDaGlwPG51bWJlciwgbnVtYmVyPj4gJiB7IG5ldyAoKTogQ2hpcDxudW1iZXIsIG51bWJlcj4gfT4oW1xuICAgIFtBbmRHYXRlLk5BTUUsIEFuZEdhdGVdLFxuICAgIFtPckdhdGUuTkFNRSwgT3JHYXRlXSxcbiAgICBbTm90R2F0ZS5OQU1FLCBOb3RHYXRlXSxcbl0pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBrZXliaW5kcyB9IGZyb20gXCIuL2tleWJpbmRzXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBtZW51IH0gZnJvbSBcIi4vbWVudVwiO1xuXG5TYW5kYm94TWFuYWdlci5zZXR1cCh7IGtleWJpbmRzLCBtZW51LCBzYXZlOiBcInNhbmRib3hcIiB9KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==