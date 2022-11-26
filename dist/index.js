/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
            this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
            this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
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
//TODO: Fix dumb fucking bug where holding a key makes it somehow pressed forever...
class KeybindsManager {
    static #keymap = new Map();
    static #keychords = new Array();
    static #keydown = (e) => {
        this.#keymap.set(e.code, true);
        if (document.activeElement === document.body) {
            const entry = this.#keychords.find(([chord]) => chord.split("+").every((key) => this.#keymap.get(key)));
            if (entry)
                entry[1].forEach((run) => run.call(undefined, e));
        }
    };
    static #keyup = (e) => {
        this.#keymap.delete(e.code);
    };
    static listen() {
        document.addEventListener("keydown", this.#keydown);
        document.addEventListener("keyup", this.#keyup);
    }
    static deafen() {
        document.removeEventListener("keydown", this.#keydown);
        document.removeEventListener("keyup", this.#keyup);
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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../files */ "./src/files.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reified/Reified */ "./src/reified/Reified.ts");
/* harmony import */ var _DraggingManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _KeybindsManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./KeybindsManager */ "./src/managers/KeybindsManager.ts");
/* harmony import */ var _MenuManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./MenuManager */ "./src/managers/MenuManager.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");
/* harmony import */ var _StorageManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./StorageManager */ "./src/managers/StorageManager.ts");
/* harmony import */ var _ToastManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _WiringManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./WiringManager */ "./src/managers/WiringManager.ts");










class SandboxManager {
    static queueNewContext;
    static watchedUnresolvedPromises = new Set();
    static #observer;
    static #history = new Array();
    static #redos = new Array();
    static setup(config) {
        document.body.innerHTML = "";
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_2__.html `<div class="modal-container modal-inactive"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_2__.html `<div class="reified-root"></div>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_2__.html `<canvas></canvas>`);
        document.body.appendChild(_reified_Reified__WEBPACK_IMPORTED_MODULE_2__.html `<div class="toasts-container"></div>`);
        _MouseManager__WEBPACK_IMPORTED_MODULE_6__.MouseManager.start();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_4__.KeybindsManager.listen();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_3__.DraggingManager.listen();
        _WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.start();
        if (typeof config.menu !== "undefined")
            [this.queueNewContext] = _MenuManager__WEBPACK_IMPORTED_MODULE_5__.MenuManager.use(_reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.root, config.menu);
        if (typeof config.keybinds !== "undefined")
            Object.entries(config.keybinds).forEach(([chord, run]) => _KeybindsManager__WEBPACK_IMPORTED_MODULE_4__.KeybindsManager.onKeyChord(chord, run));
        if (typeof config.initial !== "undefined") {
            this.clear();
            _reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.active = new Set(config.initial[0]);
            _reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.active.forEach((component) => component.attach());
            _WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.wires = new Set(config.initial[1]);
        }
        if (typeof config.save !== "undefined") {
            const file = _StorageManager__WEBPACK_IMPORTED_MODULE_7__.StorageManager.get("saves:" + config.save);
            if (file) {
                const { error, result: [components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_1__.fromFile)(file);
                if (error) {
                    _ToastManager__WEBPACK_IMPORTED_MODULE_8__.ToastManager.toast({
                        message: "Unable to read from saves.",
                        color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });
                }
                else {
                    if (!config.overrideSaveIfExists) {
                        this.clear();
                        _reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.active = new Set(components);
                        _reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.active.forEach((component) => component.attach());
                        _WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.wires = new Set(wires);
                    }
                    _StorageManager__WEBPACK_IMPORTED_MODULE_7__.StorageManager.set("saves:" + config.save, (0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.wires]));
                }
            }
        }
        //TODO: Implement undo/redo
        this.#observer = new MutationObserver(() => {
            if (typeof config.save !== "undefined")
                _StorageManager__WEBPACK_IMPORTED_MODULE_7__.StorageManager.set("saves:" + config.save, (0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.active], [..._WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.wires]));
        });
        this.#observer.observe(_reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.root, {
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
        _MouseManager__WEBPACK_IMPORTED_MODULE_6__.MouseManager.reset();
        _KeybindsManager__WEBPACK_IMPORTED_MODULE_4__.KeybindsManager.reset();
        _DraggingManager__WEBPACK_IMPORTED_MODULE_3__.DraggingManager.reset();
        _WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.stop();
        _MenuManager__WEBPACK_IMPORTED_MODULE_5__.MenuManager.remove(_reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.root);
        this.clear();
        this.watchedUnresolvedPromises.forEach((finish) => finish.call(undefined));
        this.watchedUnresolvedPromises.clear();
        document.body.innerHTML = "";
    }
    static clear() {
        _reified_Reified__WEBPACK_IMPORTED_MODULE_2__.Reified.active.forEach((component) => component.detach());
        _WiringManager__WEBPACK_IMPORTED_MODULE_9__.WiringManager.wires.forEach((wire) => wire.destroy());
    }
    static pushHistory(command, undo) {
        this.#redos.length = 0;
        this.#history.push([command, undo]);
    }
    static popHistory() {
        if (!this.#history.length)
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_8__.ToastManager.toast({
                message: "Nothing to undo.",
                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                duration: 2500,
            });
        const [redo, undo] = this.#history.pop();
        this.#redos.push([redo, undo]);
        return undo.call(undefined);
    }
    static redoHistory() {
        if (!this.#redos.length)
            return void _ToastManager__WEBPACK_IMPORTED_MODULE_8__.ToastManager.toast({
                message: "Nothing to redo.",
                color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _MouseManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MouseManager */ "./src/managers/MouseManager.ts");


class NewWireContext {
    static from;
    static {
        _MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.onMouseDown((e) => {
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
    static wires = new Set();
    static update() {
        const ctx = document.querySelector("canvas").getContext("2d");
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        this.wires = new Set([...this.wires].filter((wire) => !wire.destroyed));
        this.wires.forEach((wire) => {
            const from = wire.from.getBoundingClientRect();
            const to = wire.to.getBoundingClientRect();
            wire.to.classList.toggle("activated", wire.from.classList.contains("activated"));
            ctx.strokeStyle = wire.from.classList.contains("activated") ? _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR : _constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR;
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
                ? _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR
                : _constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR;
            ctx.lineWidth = 5;
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(from.x + from.width / 2, from.y + from.height / 2);
            ctx.lineTo(_MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.x, _MouseManager__WEBPACK_IMPORTED_MODULE_1__.MouseManager.mouse.y);
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
/* harmony import */ var _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./managers/DraggingManager */ "./src/managers/DraggingManager.ts");
/* harmony import */ var _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./managers/ModalManager */ "./src/managers/ModalManager.ts");
/* harmony import */ var _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./managers/SandboxManager */ "./src/managers/SandboxManager.ts");
/* harmony import */ var _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./managers/ToastManager */ "./src/managers/ToastManager.ts");
/* harmony import */ var _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./managers/WiringManager */ "./src/managers/WiringManager.ts");
/* harmony import */ var _reified_chips__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./reified/chips */ "./src/reified/chips.ts");
/* harmony import */ var _reified_Component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./reified/Component */ "./src/reified/Component.ts");
/* harmony import */ var _reified_Input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./reified/Input */ "./src/reified/Input.ts");
/* harmony import */ var _reified_Output__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./reified/Output */ "./src/reified/Output.ts");
/* harmony import */ var _reified_Reified__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./reified/Reified */ "./src/reified/Reified.ts");












const menu = [
    {
        "insert-chip": {
            label: "Insert chip",
            callback: async (e) => {
                const name = await _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.prompt("Enter the chip's name:");
                if (typeof name !== "string")
                    return;
                const chip = _reified_chips__WEBPACK_IMPORTED_MODULE_7__.chips.get(name.toUpperCase());
                if (!chip)
                    return _managers_ModalManager__WEBPACK_IMPORTED_MODULE_3__.ModalManager.alert("No chip was found with that name.");
                const component = new _reified_Component__WEBPACK_IMPORTED_MODULE_8__.Component(Reflect.construct(chip, []), _constants__WEBPACK_IMPORTED_MODULE_0__.ORIGIN_POINT);
                _reified_Reified__WEBPACK_IMPORTED_MODULE_11__.Reified.active.add(component);
                component.attach();
                _managers_DraggingManager__WEBPACK_IMPORTED_MODULE_2__.DraggingManager.watch(component.element, component.name);
                const { width, height } = getComputedStyle(component.element);
                component.move({
                    x: e.clientX - parseFloat(width) / 2,
                    y: e.clientY - parseFloat(height) / 2,
                });
                return;
            },
        },
    },
    {
        "new-input": {
            label: "New input",
            callback: (e) => {
                const input = new _reified_Input__WEBPACK_IMPORTED_MODULE_9__.Input({
                    x: e.clientX - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - _constants__WEBPACK_IMPORTED_MODULE_0__.INPUT_COMPONENT_CSS_SIZE / 2,
                });
                _reified_Reified__WEBPACK_IMPORTED_MODULE_11__.Reified.active.add(input);
                input.attach();
            },
        },
        "new-output": {
            label: "New output",
            callback: (e) => {
                const output = new _reified_Output__WEBPACK_IMPORTED_MODULE_10__.Output({
                    x: e.clientX - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - _constants__WEBPACK_IMPORTED_MODULE_0__.OUTPUT_COMPONENT_CSS_SIZE / 2,
                });
                _reified_Reified__WEBPACK_IMPORTED_MODULE_11__.Reified.active.add(output);
                output.attach();
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
                    href: URL.createObjectURL(new Blob([(0,_files__WEBPACK_IMPORTED_MODULE_1__.saveDiagram)([..._reified_Reified__WEBPACK_IMPORTED_MODULE_11__.Reified.active], [..._managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.wires])], {
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
                    return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
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
                    return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({
                        message: "Unable to read the file.",
                        color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });
                const { error, result: [components, wires], } = (0,_files__WEBPACK_IMPORTED_MODULE_1__.fromFile)(raw);
                if (error)
                    return _managers_ToastManager__WEBPACK_IMPORTED_MODULE_5__.ToastManager.toast({ message: error, color: _constants__WEBPACK_IMPORTED_MODULE_0__.ACTIVATED_CSS_COLOR, duration: 2500 });
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.reset();
                _managers_SandboxManager__WEBPACK_IMPORTED_MODULE_4__.SandboxManager.setup({
                    menu,
                    initial: [components, wires],
                    save: "sandbox",
                    overrideSaveIfExists: true,
                });
            },
        },
    },
    ...(_constants__WEBPACK_IMPORTED_MODULE_0__.IN_DEBUG_MODE
        ? [
            {
                STOP: {
                    label: "STOP RENDER",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.stop();
                    },
                },
                START: {
                    label: "START RENDER",
                    callback: () => {
                        _managers_WiringManager__WEBPACK_IMPORTED_MODULE_6__.WiringManager.start();
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
function html(...args) {
    const [template, ...values] = args;
    const html = typeof template === "string" ? template : template.reduce((html, text, i) => html + text + values[i] ?? "", "");
    return new DOMParser().parseFromString(html, "text/html").body.childNodes[0];
}
function preventDefault(e) {
    e.preventDefault();
}
class Reified {
    static active = new Set();
    static get root() {
        return document.querySelector(".reified-root");
    }
    move({ x, y }) {
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
    }
    attach() {
        Reified.active.add(this);
        Reified.root.appendChild(this.element);
        return this;
    }
    detach() {
        Reified.active.delete(this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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REFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOc0M7QUFDcUI7QUFDN0I7QUFFOUIsMEVBQW9CLENBQUMsRUFBRSxRQUFRLG1EQUFFLElBQUksMkNBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9maWxlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMva2V5YmluZHMudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL0RyYWdnaW5nTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvS2V5YmluZHNNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9NZW51TWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvTW9kYWxNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9Nb3VzZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9TdG9yYWdlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvbWFuYWdlcnMvVG9hc3RNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9tZW51LnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9yZWlmaWVkL0NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9JbnB1dC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9PdXRwdXQudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3JlaWZpZWQvUmVpZmllZC50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvcmVpZmllZC9jaGlwcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBOYXZpZ2F0b3Ige1xuICAgICAgICB1c2VyQWdlbnREYXRhOiB7IHBsYXRmb3JtOiBzdHJpbmcgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgPSAyNDtcbmV4cG9ydCBjb25zdCBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFID0gMjQ7XG5leHBvcnQgY29uc3QgQ0hJUF9DT01QT05FTlRfQ1NTX1dJRFRIID0gMTIwO1xuZXhwb3J0IGNvbnN0IENISVBfQ09NUE9ORU5UX0NTU19IRUlHSFQgPSA0MDtcbmV4cG9ydCBjb25zdCBDSElQX0lOUFVUX0NTU19TSVpFID0gMTY7XG5leHBvcnQgY29uc3QgQ0hJUF9PVVRQVVRfQ1NTX1NJWkUgPSAxNjtcbmV4cG9ydCBjb25zdCBPUklHSU5fUE9JTlQgPSBPYmplY3QuZnJlZXplKHsgeDogMCwgeTogMCB9KTtcbmV4cG9ydCBjb25zdCBBQ1RJVkFURURfQ1NTX0NPTE9SID0gXCIjZmYyNjI2XCI7XG5leHBvcnQgY29uc3QgTElHSFRfR1JBWV9DU1NfQ09MT1IgPSBcIiNkZWRlZGVcIjtcbmV4cG9ydCBjb25zdCBJTl9ERUJVR19NT0RFID0gISFuZXcgVVJMKGxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcy5oYXMoXCJkZWJ1Z1wiKTtcbmV4cG9ydCBjb25zdCBJU19NQUNfT1MgPSBbbmF2aWdhdG9yLnVzZXJBZ2VudERhdGEucGxhdGZvcm0sIG5hdmlnYXRvci5wbGF0Zm9ybV0uc29tZSgocGxhdGZvcm0pID0+XG4gICAgcGxhdGZvcm0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhcIm1hY1wiKSxcbik7XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBJTl9ERUJVR19NT0RFIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZyB9IGZyb20gXCIuL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGNoaXBzIH0gZnJvbSBcIi4vcmVpZmllZC9jaGlwc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vcmVpZmllZC9Db21wb25lbnRcIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4vcmVpZmllZC9JbnB1dFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4vcmVpZmllZC9PdXRwdXRcIjtcbmltcG9ydCB7IFJlaWZpZWQgfSBmcm9tIFwiLi9yZWlmaWVkL1JlaWZpZWRcIjtcblxuZnVuY3Rpb24qIGdlbigpIHtcbiAgICBsZXQgaSA9IDA7XG5cbiAgICB3aGlsZSAodHJ1ZSkgeWllbGQgaSsrO1xufVxuXG5leHBvcnQgdHlwZSBTZXJpYWxpemVkRGlhZ3JhbSA9IHtcbiAgICBjb21wb25lbnRzOiAoXG4gICAgICAgIHwge1xuICAgICAgICAgICAgICByZWlmaWVkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHR5cGU6IFwiSU5QVVRcIjtcbiAgICAgICAgICAgICAgYWN0aXZhdGVkOiBib29sZWFuO1xuICAgICAgICAgICAgICBpZDogbnVtYmVyO1xuICAgICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAgIHk6IG51bWJlcjtcbiAgICAgICAgICB9XG4gICAgICAgIHwge1xuICAgICAgICAgICAgICByZWlmaWVkOiBudW1iZXI7XG4gICAgICAgICAgICAgIHR5cGU6IFwiT1VUUFVUXCI7XG4gICAgICAgICAgICAgIGFjdGl2YXRlZDogYm9vbGVhbjtcbiAgICAgICAgICAgICAgaWQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgeDogbnVtYmVyO1xuICAgICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB8IHtcbiAgICAgICAgICAgICAgcmVpZmllZDogbnVtYmVyO1xuICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiO1xuICAgICAgICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICAgIGlucHV0czogeyBpZDogbnVtYmVyOyBhY3RpdmF0ZWQ6IGJvb2xlYW4gfVtdO1xuICAgICAgICAgICAgICBvdXRwdXRzOiB7IGlkOiBudW1iZXI7IGFjdGl2YXRlZDogYm9vbGVhbiB9W107XG4gICAgICAgICAgICAgIHg6IG51bWJlcjtcbiAgICAgICAgICAgICAgeTogbnVtYmVyO1xuICAgICAgICAgIH1cbiAgICApW107XG4gICAgd2lyZXM6IHsgZnJvbTogbnVtYmVyOyB0bzogbnVtYmVyIH1bXTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlRGlhZ3JhbShjb21wb25lbnRzOiBSZWlmaWVkW10sIHdpcmVzOiBXaXJpbmdbXSkge1xuICAgIGNvbnN0IGlkID0gZ2VuKCk7XG5cbiAgICBjb25zdCBpZHMgPSBuZXcgTWFwPEVsZW1lbnQsIG51bWJlcj4oKTtcblxuICAgIGNvbnN0IGRhdGE6IFNlcmlhbGl6ZWREaWFncmFtID0ge1xuICAgICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzLm1hcCgoY29tcG9uZW50LCByZWlmaWVkKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZHMuc2V0KGNvbXBvbmVudC5lbGVtZW50LCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlaWZpZWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiSU5QVVRcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVkOiBjb21wb25lbnQuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIiksXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZHMuZ2V0KGNvbXBvbmVudC5lbGVtZW50KSEsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUubGVmdCksXG4gICAgICAgICAgICAgICAgICAgIHk6IHBhcnNlRmxvYXQoY29tcG9uZW50LmVsZW1lbnQuc3R5bGUudG9wKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgT3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgaWRzLnNldChjb21wb25lbnQuZWxlbWVudCwgaWQubmV4dCgpLnZhbHVlISk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIk9VVFBVVFwiLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZWQ6IGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkcy5nZXQoY29tcG9uZW50LmVsZW1lbnQpISxcbiAgICAgICAgICAgICAgICAgICAgeDogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgeTogcGFyc2VGbG9hdChjb21wb25lbnQuZWxlbWVudC5zdHlsZS50b3ApLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZWlmaWVkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkNPTVBPTkVOVFwiLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb21wb25lbnQuY2hpcC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IGNvbXBvbmVudC5pbnB1dHMubWFwKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMuc2V0KGksIGlkLm5leHQoKS52YWx1ZSEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpZDogaWRzLmdldChpKSEsIGFjdGl2YXRlZDogaS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmF0ZWRcIikgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IGNvbXBvbmVudC5vdXRwdXRzLm1hcCgobykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnNldChvLCBpZC5uZXh0KCkudmFsdWUhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGlkcy5nZXQobykhLCBhY3RpdmF0ZWQ6IG8uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICB4OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICB5OiBwYXJzZUZsb2F0KGNvbXBvbmVudC5lbGVtZW50LnN0eWxlLnRvcCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVG9hc3RNYW5hZ2VyLnRvYXN0KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byBzZXJpYWxpemUgZGlhZ3JhbS5cIixcbiAgICAgICAgICAgICAgICBjb2xvcjogQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIFJlaWZpZWQgY29tcG9uZW50IHR5cGUuXCIpO1xuICAgICAgICB9KSxcbiAgICAgICAgd2lyZXM6IHdpcmVzXG4gICAgICAgICAgICAuZmlsdGVyKCh3aXJlKSA9PiAhd2lyZS5kZXN0cm95ZWQpXG4gICAgICAgICAgICAubWFwKCh3aXJlKSA9PiAoe1xuICAgICAgICAgICAgICAgIGZyb206IGlkcy5nZXQod2lyZS5mcm9tKSEsXG4gICAgICAgICAgICAgICAgdG86IGlkcy5nZXQod2lyZS50bykhLFxuICAgICAgICAgICAgfSkpLFxuICAgIH07XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSwgdW5kZWZpbmVkLCBJTl9ERUJVR19NT0RFID8gNCA6IHVuZGVmaW5lZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRmlsZShcbiAgICBmaWxlOiBzdHJpbmcsXG4pOiB7IGVycm9yOiBzdHJpbmc7IHJlc3VsdDogW10gfSB8IHsgZXJyb3I6IHVuZGVmaW5lZDsgcmVzdWx0OiBbY29tcG9uZW50czogUmVpZmllZFtdLCB3aXJlczogV2lyaW5nW11dIH0ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGZpbGUpO1xuXG4gICAgICAgIHZhbGlkYXRlKGRhdGEpO1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gbmV3IE1hcDxudW1iZXIsIEVsZW1lbnQ+KCk7XG5cbiAgICAgICAgY29uc3QgcmVpZmllZCA9IGRhdGEuY29tcG9uZW50cy5tYXAoKHJhdykgPT4ge1xuICAgICAgICAgICAgaWYgKHJhdy50eXBlID09PSBcIklOUFVUXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IG5ldyBJbnB1dChyYXcpO1xuXG4gICAgICAgICAgICAgICAgaW5wdXQuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pZCwgaW5wdXQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyYXcudHlwZSA9PT0gXCJPVVRQVVRcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dCA9IG5ldyBPdXRwdXQocmF3KTtcblxuICAgICAgICAgICAgICAgIG91dHB1dC5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmF0ZWRcIiwgcmF3LmFjdGl2YXRlZCk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5zZXQocmF3LmlkLCBvdXRwdXQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KG5ldyAoY2hpcHMuZ2V0KHJhdy5uYW1lKSEpKCksIHJhdyk7XG5cbiAgICAgICAgICAgIGNvbXBvbmVudC5pbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCByYXcuaW5wdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5pbnB1dHNbaW5kZXhdLmlkLCBpbnB1dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29tcG9uZW50Lm91dHB1dHMuZm9yRWFjaCgob3V0cHV0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIHJhdy5vdXRwdXRzW2luZGV4XS5hY3RpdmF0ZWQpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHMuc2V0KHJhdy5vdXRwdXRzW2luZGV4XS5pZCwgb3V0cHV0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB3aXJlcyA9IGRhdGEud2lyZXMubWFwKCh7IGZyb20sIHRvIH0pID0+IG5ldyBXaXJpbmcoZWxlbWVudHMuZ2V0KGZyb20pISwgZWxlbWVudHMuZ2V0KHRvKSEpKTtcblxuICAgICAgICByZXR1cm4geyByZXN1bHQ6IFtyZWlmaWVkLCB3aXJlc10sIGVycm9yOiB1bmRlZmluZWQgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB7IGVycm9yOiBlLm1lc3NhZ2UsIHJlc3VsdDogW10gfTtcblxuICAgICAgICByZXR1cm4geyBlcnJvcjogXCJGYWlsZWQgdG8gcHJvY2VzcyBmaWxlLlwiLCByZXN1bHQ6IFtdIH07XG4gICAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZShkYXRhOiB1bmtub3duKTogYXNzZXJ0cyBkYXRhIGlzIFNlcmlhbGl6ZWREaWFncmFtIHtcbiAgICBpZiAoIWRhdGEgfHwgdHlwZW9mIGRhdGEgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIkRhdGEgaXMgbm90IGFuIG9iamVjdC5cIik7XG5cbiAgICBpZiAoIShcImNvbXBvbmVudHNcIiBpbiBkYXRhKSkgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBpcyBtaXNzaW5nIGNvbXBvbmVudHMuXCIpO1xuXG4gICAgaWYgKCEoXCJ3aXJlc1wiIGluIGRhdGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIGlzIG1pc3Npbmcgd2lyZXMuXCIpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY29tcG9uZW50cykpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBub3QgYW4gYXJyYXkuXCIpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEud2lyZXMpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlcyBkYXRhIGlzIG5vdCBhbiBhcnJheS5cIik7XG5cbiAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBkYXRhLmNvbXBvbmVudHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgIGlmICghY29tcG9uZW50IHx8IHR5cGVvZiBjb21wb25lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIG11c3QgYW4gb2JqZWN0LlwiKTtcblxuICAgICAgICBpZiAoIShcInJlaWZpZWRcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnRzIGRhdGEgaXMgbWlzc2luZyByZWlmaWVkIGlkLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5yZWlmaWVkICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJSZWlmaWVkIGlkIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuXG4gICAgICAgIGlmICghKFwidHlwZVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudHMgZGF0YSBpcyBtaXNzaW5nIGEgdHlwZS5cIik7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQudHlwZSAhPT0gXCJzdHJpbmdcIiB8fCAhW1wiSU5QVVRcIiwgXCJPVVRQVVRcIiwgXCJDT01QT05FTlRcIl0uaW5jbHVkZXMoY29tcG9uZW50LnR5cGUpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb21wb25lbnQgdHlwZS5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJ4XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50cyBkYXRhIGlzIG1pc3NpbmcgYSB4IGNvb3JkaW5hdGUuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnggIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB4IGNvb3JkaW5hdGUgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgaWYgKCEoXCJ5XCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50cyBkYXRhIGlzIG1pc3NpbmcgYSB5IGNvb3JkaW5hdGUuXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnkgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB5IGNvb3JkaW5hdGUgbXVzdCBiZSBhIG51bWJlci5cIik7XG5cbiAgICAgICAgc3dpdGNoIChjb21wb25lbnQudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcIklOUFVUXCI6XG4gICAgICAgICAgICBjYXNlIFwiT1VUUFVUXCI6IHtcbiAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiSS9PIGRhdGEgaXMgbWlzc2luZyBpZHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuaWQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkkvTyBpZCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwiYWN0aXZhdGVkXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiSS9PIGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5hY3RpdmF0ZWQgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJBY3RpdmF0aW9uIHN0YXR1cyBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJDT01QT05FTlRcIjoge1xuICAgICAgICAgICAgICAgIGlmICghKFwiaW5wdXRzXCIgaW4gY29tcG9uZW50KSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGRhdGEgaXMgbWlzc2luZyBpbnB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbXBvbmVudC5pbnB1dHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgaW5wdXRzIGRhdGEgbXVzdCBiZSBhbiBhcnJheS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShcIm91dHB1dHNcIiBpbiBjb21wb25lbnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgZGF0YSBpcyBtaXNzaW5nIG91dHB1dHMuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbXBvbmVudC5vdXRwdXRzKSkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IG91dHB1dHMgZGF0YSBtdXN0IGJlIGFuIGFycmF5LlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghKFwibmFtZVwiIGluIGNvbXBvbmVudCkpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBkYXRhIGlzIG1pc3NpbmcgY2hpcCBuYW1lLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm5hbWUgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkNoaXAgbmFtZSBtdXN0IGJlIGEgc3RyaW5nLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmICghY2hpcHMuaGFzKGNvbXBvbmVudC5uYW1lLnRyaW0oKS50b1VwcGVyQ2FzZSgpKSkgdGhyb3cgbmV3IEVycm9yKFwiQ2hpcCBuYW1lIGRvZXNuJ3QgZXhpc3QuXCIpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgQ2hpcCA9IGNoaXBzLmdldChjb21wb25lbnQubmFtZS50cmltKCkudG9VcHBlckNhc2UoKSkhO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5pbnB1dHMubGVuZ3RoICE9PSBDaGlwLklOUFVUUylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IGlucHV0cyBkb2VzIG5vdCBtYXRjaCBjaGlwIGlucHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50Lm91dHB1dHMubGVuZ3RoICE9PSBDaGlwLk9VVFBVVFMpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCBvdXRwdXRzIGRvZXMgbm90IG1hdGNoIGNoaXAgb3V0cHV0cy5cIik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGNvbXBvbmVudC5pbnB1dHMgYXMgdW5rbm93bltdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dCBkYXRhIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwiaWRcIiBpbiBpbnB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBpZC5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpZCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImFjdGl2YXRlZFwiIGluIGlucHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGFjdGl2YXRpb24gc3RhdHVzLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0LmFjdGl2YXRlZCAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkFjdGl2YXRpb24gc3RhdHVzIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG91dHB1dCBvZiBjb21wb25lbnQub3V0cHV0cyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdXRwdXQgfHwgdHlwZW9mIG91dHB1dCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBtdXN0IGJlIGFuIG9iamVjdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImlkXCIgaW4gb3V0cHV0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpcyBtaXNzaW5nIGlkLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG91dHB1dC5pZCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5wdXQgZGF0YSBpZCBtdXN0IGJlIGEgbnVtYmVyLlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShcImFjdGl2YXRlZFwiIGluIG91dHB1dCkpIHRocm93IG5ldyBFcnJvcihcIklucHV0IGRhdGEgaXMgbWlzc2luZyBhY3RpdmF0aW9uIHN0YXR1cy5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvdXRwdXQuYWN0aXZhdGVkICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiQWN0aXZhdGlvbiBzdGF0dXMgbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaWRzID0gZGF0YS5jb21wb25lbnRzLmZsYXRNYXA8bnVtYmVyPigoY29tcG9uZW50KSA9PlxuICAgICAgICBjb21wb25lbnQudHlwZSA9PT0gXCJDT01QT05FTlRcIlxuICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQuaW5wdXRzLm1hcCgoeyBpZCB9OiB7IGlkOiBudW1iZXIgfSkgPT4gaWQpLFxuICAgICAgICAgICAgICAgICAgLi4uY29tcG9uZW50Lm91dHB1dHMubWFwKCh7IGlkIH06IHsgaWQ6IG51bWJlciB9KSA9PiBpZCksXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIDogY29tcG9uZW50LmlkLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHdpcmUgb2YgZGF0YS53aXJlcyBhcyB1bmtub3duW10pIHtcbiAgICAgICAgaWYgKCF3aXJlIHx8IHR5cGVvZiB3aXJlICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgbXVzdCBiZSBhbiBvYmplY3QuXCIpO1xuXG4gICAgICAgIGlmICghKFwiZnJvbVwiIGluIHdpcmUpKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgaXMgbWlzc2luZyB0aGUgY29tcG9uZW50IGl0IHN0YXJ0cyBmcm9tLlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUuZnJvbSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiV2lyZSBkYXRhIG11c3QgcmVmZXJlbmNlIG51bWVyaWMgaWRzLlwiKTtcblxuICAgICAgICBpZiAoIShcInRvXCIgaW4gd2lyZSkpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBpcyBtaXNzaW5nIHRoZSB0YXJnZXQgY29tcG9uZW50LlwiKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpcmUudG8gIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIldpcmUgZGF0YSBtdXN0IHJlZmVyZW5jZSBudW1lcmljIGlkcy5cIik7XG5cbiAgICAgICAgaWYgKCFpZHMuaW5jbHVkZXMod2lyZS5mcm9tKSB8fCAhaWRzLmluY2x1ZGVzKHdpcmUudG8pKSB0aHJvdyBuZXcgRXJyb3IoXCJXaXJlIGRhdGEgcmVmZXJlbmNlcyBpbnZhbGlkIGlkcy5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSVNfTUFDX09TIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmNvbnN0IHVuZG8gPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIFNhbmRib3hNYW5hZ2VyLnBvcEhpc3RvcnkoKTtcbn07XG5cbmNvbnN0IHJlZG8gPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIFNhbmRib3hNYW5hZ2VyLnJlZG9IaXN0b3J5KCk7XG59O1xuXG5leHBvcnQgY29uc3Qga2V5YmluZHM6IFJlY29yZDxzdHJpbmcsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkPiA9IHtcbiAgICBcIkNvbnRyb2xMZWZ0K1NoaWZ0TGVmdCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmIChJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKGUpO1xuICAgIH0sXG4gICAgXCJDb250cm9sTGVmdCtTaGlmdFJpZ2h0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHJlZG8oZSk7XG4gICAgfSxcbiAgICBcIkNvbnRyb2xSaWdodCtTaGlmdExlZnQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbyhlKTtcbiAgICB9LFxuICAgIFwiQ29udHJvbFJpZ2h0K1NoaWZ0UmlnaHQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbyhlKTtcbiAgICB9LFxuICAgIFwiTWV0YUxlZnQrU2hpZnRMZWZ0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKGUpO1xuICAgIH0sXG4gICAgXCJNZXRhTGVmdCtTaGlmdFJpZ2h0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKGUpO1xuICAgIH0sXG4gICAgXCJNZXRhUmlnaHQrU2hpZnRMZWZ0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICByZWRvKGUpO1xuICAgIH0sXG4gICAgXCJNZXRhUmlnaHQrU2hpZnRSaWdodCtLZXlaXCI6IChlKSA9PiB7XG4gICAgICAgIGlmICghSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgcmVkbyhlKTtcbiAgICB9LFxuICAgIFwiQ29udHJvbExlZnQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoSVNfTUFDX09TKSByZXR1cm47XG5cbiAgICAgICAgdW5kbyhlKTtcbiAgICB9LFxuICAgIFwiQ29udHJvbFJpZ2h0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKElTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHVuZG8oZSk7XG4gICAgfSxcbiAgICBcIk1ldGFMZWZ0K0tleVpcIjogKGUpID0+IHtcbiAgICAgICAgaWYgKCFJU19NQUNfT1MpIHJldHVybjtcblxuICAgICAgICB1bmRvKGUpO1xuICAgIH0sXG4gICAgXCJNZXRhUmlnaHQrS2V5WlwiOiAoZSkgPT4ge1xuICAgICAgICBpZiAoIUlTX01BQ19PUykgcmV0dXJuO1xuXG4gICAgICAgIHVuZG8oZSk7XG4gICAgfSxcbn07XG4iLCJleHBvcnQgY2xhc3MgRHJhZ2dpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2RyYWdnZWQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZSA9IHtcbiAgICAgICAgeDogLTEsXG4gICAgICAgIHk6IC0xLFxuICAgICAgICBveDogLTEsXG4gICAgICAgIG95OiAtMSxcbiAgICAgICAgZG93bjogZmFsc2UsXG4gICAgfTtcblxuICAgIHN0YXRpYyByZWFkb25seSAjd2F0Y2hlZCA9IG5ldyBNYXAoKTtcblxuICAgIHN0YXRpYyB3YXRjaChlbGVtZW50OiBIVE1MRWxlbWVudCwgdGFyZ2V0ID0gZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmRhdGFzZXQud2F0Y2hlZCA9IFwidHJ1ZVwiO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNkcmFnZ2VkID0gZWxlbWVudDtcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5kYXRhc2V0LmRyYWdnZWQgPSBcInRydWVcIjtcblxuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5jdXJzb3IgPSBcImdyYWJiaW5nXCI7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLiNkcmFnZ2VkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gdGhpcy4jZHJhZ2dlZC5wYXJlbnRFbGVtZW50Py5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA/PyBuZXcgRE9NUmVjdCgpO1xuXG4gICAgICAgICAgICB0aGlzLiNtb3VzZS5veCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdCArIGJvZHkubGVmdDtcbiAgICAgICAgICAgIHRoaXMuI21vdXNlLm95ID0gZS5jbGllbnRZIC0gcmVjdC50b3AgKyBib2R5LnRvcDtcbiAgICAgICAgfTtcblxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd24sIHsgY2FwdHVyZTogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLiN3YXRjaGVkLnNldCh0YXJnZXQsIG1vdXNlZG93bik7XG4gICAgfVxuXG4gICAgc3RhdGljIGZvcmdldChlbGVtZW50OiBIVE1MRWxlbWVudCwgZm9yY2U/OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy4jd2F0Y2hlZC5nZXQoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKCFsaXN0ZW5lciAmJiAhZm9yY2UpIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBpcyBub3QgY3VycmVudGx5IGJlaW5nIHdhdGNoZWQuYCk7XG5cbiAgICAgICAgZGVsZXRlIGVsZW1lbnQuZGF0YXNldC53YXRjaGVkO1xuXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBsaXN0ZW5lciwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuXG4gICAgICAgIHRoaXMuI3dhdGNoZWQuZGVsZXRlKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IC0xO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gLTE7XG4gICAgICAgIHRoaXMuI21vdXNlLm94ID0gLTE7XG4gICAgICAgIHRoaXMuI21vdXNlLm95ID0gLTE7XG4gICAgICAgIHRoaXMuI21vdXNlLmRvd24gPSBmYWxzZTtcblxuICAgICAgICB0aGlzLiN3YXRjaGVkLmZvckVhY2goKF8sIGVsZW1lbnQpID0+IHRoaXMuZm9yZ2V0KGVsZW1lbnQpKTtcblxuICAgICAgICB0aGlzLiNkcmFnZ2VkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRoaXMuZGVhZmVuKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuI21vdXNlbW92ZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLiNtb3VzZXVwKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVhZmVuKCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy4jbW91c2Vtb3ZlKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy4jbW91c2UueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IGUuY2xpZW50WTtcblxuICAgICAgICBpZiAodGhpcy4jZHJhZ2dlZCkge1xuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS5sZWZ0ID0gdGhpcy4jbW91c2UueCAtIHRoaXMuI21vdXNlLm94ICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy4jZHJhZ2dlZC5zdHlsZS50b3AgPSB0aGlzLiNtb3VzZS55IC0gdGhpcy4jbW91c2Uub3kgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS5kb3duID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgc3RhdGljIHJlYWRvbmx5ICNtb3VzZXVwID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy4jZHJhZ2dlZCkge1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJ1tkYXRhLWRyYWdnZWQ9XCJ0cnVlXCJdJykuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlLmRhdGFzZXQuZHJhZ2dlZDtcblxuICAgICAgICAgICAgICAgIGUuc3R5bGUuY3Vyc29yID0gXCJcIjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jbW91c2UuZG93biA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuI21vdXNlLnggPSAtMTtcbiAgICAgICAgdGhpcy4jbW91c2UueSA9IC0xO1xuXG4gICAgICAgIHRoaXMuI21vdXNlLm94ID0gLTE7XG4gICAgICAgIHRoaXMuI21vdXNlLm95ID0gLTE7XG5cbiAgICAgICAgdGhpcy4jZHJhZ2dlZCA9IHVuZGVmaW5lZDtcbiAgICB9O1xufVxuIiwiLy9UT0RPOiBGaXggZHVtYiBmdWNraW5nIGJ1ZyB3aGVyZSBob2xkaW5nIGEga2V5IG1ha2VzIGl0IHNvbWVob3cgcHJlc3NlZCBmb3JldmVyLi4uXG5leHBvcnQgY2xhc3MgS2V5YmluZHNNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI2tleW1hcCA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xuXG4gICAgc3RhdGljICNrZXljaG9yZHMgPSBuZXcgQXJyYXk8W3N0cmluZywgKChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKVtdXT4oKTtcblxuICAgIHN0YXRpYyAja2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5zZXQoZS5jb2RlLCB0cnVlKTtcblxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLiNrZXljaG9yZHMuZmluZCgoW2Nob3JkXSkgPT4gY2hvcmQuc3BsaXQoXCIrXCIpLmV2ZXJ5KChrZXkpID0+IHRoaXMuI2tleW1hcC5nZXQoa2V5KSkpO1xuXG4gICAgICAgICAgICBpZiAoZW50cnkpIGVudHJ5WzFdLmZvckVhY2goKHJ1bikgPT4gcnVuLmNhbGwodW5kZWZpbmVkLCBlKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc3RhdGljICNrZXl1cCA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI2tleW1hcC5kZWxldGUoZS5jb2RlKTtcbiAgICB9O1xuXG4gICAgc3RhdGljIGxpc3RlbigpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy4ja2V5ZG93bik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLiNrZXl1cCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlYWZlbigpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy4ja2V5ZG93bik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLiNrZXl1cCk7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uS2V5Q2hvcmQoY2hvcmQ6IHN0cmluZywgcnVuOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICBjaG9yZCA9IGNob3JkLnNwbGl0KFwiK1wiKS5zb3J0KCkuam9pbihcIitcIik7XG5cbiAgICAgICAgaWYgKCF0aGlzLiNrZXljaG9yZHMuZmluZCgoW2tleV0pID0+IGtleSA9PT0gY2hvcmQpPy5bMV0ucHVzaChydW4pKSB0aGlzLiNrZXljaG9yZHMucHVzaChbY2hvcmQsIFtydW5dXSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bkFuZE5vRm9jdXMoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy4ja2V5bWFwLmdldChrZXkpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzS2V5RG93bihrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gISF0aGlzLiNrZXltYXAuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLiNrZXltYXAuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLiNrZXljaG9yZHMgPSBbXTtcblxuICAgICAgICB0aGlzLmRlYWZlbigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCB0eXBlIE1lbnVNYW5hZ2VyQ29udGV4dCA9IHtcbiAgICBtZW51OiBIVE1MRWxlbWVudDtcbiAgICBjbGlja3M6IE1hcDxzdHJpbmcsICgpID0+IHZvaWQ+O1xuICAgIGxpc3RlbmVyczoge1xuICAgICAgICBtb3VzZWRvd246IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgICAgICBjb250ZXh0bWVudTogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgICAgIGNsaWNrOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICB9O1xufTtcblxuZXhwb3J0IHR5cGUgTWVudU1hbmFnZXJBY3Rpb25zID0gQXJyYXk8UmVjb3JkPHN0cmluZywgeyBsYWJlbDogc3RyaW5nOyBjYWxsYmFjazogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQgfT4+O1xuXG5leHBvcnQgY2xhc3MgTWVudU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSAjZWxlbWVudHMgPSBuZXcgTWFwPEhUTUxFbGVtZW50LCBNZW51TWFuYWdlckNvbnRleHQ+KCk7XG5cbiAgICBzdGF0aWMgdXNlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBhY3Rpb25zOiBNZW51TWFuYWdlckFjdGlvbnMpIHtcbiAgICAgICAgY29uc3QgbWVudSA9IGh0bWxgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGV4dG1lbnVcIj5cbiAgICAgICAgICAgICAgICAke2FjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgocmVjb3JkKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMocmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKFtuYW1lLCB7IGxhYmVsIH1dKSA9PiBgPGJ1dHRvbiBjbGFzcz1cIiR7bmFtZX1cIj4ke2xhYmVsfTwvYnV0dG9uPmApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCJcIiksXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJzxkaXYgY2xhc3M9XCJiclwiPjwvZGl2PicpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgY29uc3QgY2xpY2tzID0gbmV3IE1hcCgpO1xuXG4gICAgICAgIGNvbnN0IHNldHVwID0gKGFjdGlvbnM6IE1lbnVNYW5hZ2VyQWN0aW9ucykgPT4ge1xuICAgICAgICAgICAgY2xpY2tzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIG1lbnUuaW5uZXJIVE1MID0gYWN0aW9uc1xuICAgICAgICAgICAgICAgIC5tYXAoKHJlY29yZCkgPT5cbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMocmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoW25hbWUsIHsgbGFiZWwgfV0pID0+IGA8YnV0dG9uIGNsYXNzPVwiJHtuYW1lfVwiPiR7bGFiZWx9PC9idXR0b24+YClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiXCIpLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuam9pbignPGRpdiBjbGFzcz1cImJyXCI+PC9kaXY+Jyk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMuZm9yRWFjaCgocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVjb3JkKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xpY2sgPSByZWNvcmRba2V5XS5jYWxsYmFjay5iaW5kKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5cIiArIGtleSkhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGljayk7XG4gICAgICAgICAgICAgICAgICAgIG1lbnUucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuXCIgKyBrZXkpIS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgY2xpY2spO1xuXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrcy5zZXQoa2V5LCBjbGlja3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGNvbnRleHQ6IE1lbnVNYW5hZ2VyQWN0aW9ucyB8IHVuZGVmaW5lZDtcblxuICAgICAgICBjb25zdCBnZXRBY3Rpb25zID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gY29udGV4dDtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICBtZW51LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICBtZW51LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobWVudSk7XG5cbiAgICAgICAgY29uc3QgbW91c2Vkb3duID0gKCkgPT4ge1xuICAgICAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNvbnRleHRtZW51ID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IGUuY2xpZW50WCArIFwicHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUudG9wID0gZS5jbGllbnRZICsgXCJweFwiO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgc2V0dXAoZ2V0QWN0aW9ucygpKTtcblxuICAgICAgICAgICAgbWVudS5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9O1xuXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZWRvd24pO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBjb250ZXh0bWVudSk7XG4gICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrKTtcbiAgICAgICAgbWVudS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgY2xpY2spO1xuXG4gICAgICAgIHRoaXMuI2VsZW1lbnRzLnNldChlbGVtZW50LCB7IG1lbnUsIGNsaWNrcywgbGlzdGVuZXJzOiB7IG1vdXNlZG93biwgY29udGV4dG1lbnUsIGNsaWNrIH0gfSk7XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIChuZXdDb250ZXh0OiAocHJldjogTWVudU1hbmFnZXJBY3Rpb25zKSA9PiBNZW51TWFuYWdlckFjdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gbmV3Q29udGV4dC5jYWxsKHVuZGVmaW5lZCwgWy4uLmFjdGlvbnNdKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgc3RhdGljIHJlbW92ZShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCB7IG1lbnUsIGNsaWNrcywgbGlzdGVuZXJzIH0gPSB0aGlzLiNlbGVtZW50cy5nZXQoZWxlbWVudCkgPz8ge307XG5cbiAgICAgICAgaWYgKCFtZW51IHx8ICFjbGlja3MgfHwgIWxpc3RlbmVycykgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50cyBhcmUgbm90IGJlaW5nIGFmZmVjdGVkLmApO1xuXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBsaXN0ZW5lcnMubW91c2Vkb3duKTtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXJzLmNvbnRleHRtZW51KTtcbiAgICAgICAgbWVudS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXJzLmNsaWNrKTtcbiAgICAgICAgbWVudS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXJzLmNsaWNrKTtcblxuICAgICAgICBBcnJheS5mcm9tKGNsaWNrcykuZm9yRWFjaCgoW2tleSwgbGlzdGVuZXJdKSA9PiB7XG4gICAgICAgICAgICBtZW51LnF1ZXJ5U2VsZWN0b3IoXCIuXCIgKyBrZXkpIS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgbWVudS5xdWVyeVNlbGVjdG9yKFwiLlwiICsga2V5KSEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIGxpc3RlbmVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWVudS5yZW1vdmUoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBodG1sIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9TYW5kYm94TWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgTW9kYWxNYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWNvbnRhaW5lclwiKSE7XG4gICAgfVxuXG4gICAgc3RhdGljICNvbk1vZGFsTW91bnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCA8PSAwKSB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtaW5hY3RpdmVcIik7XG4gICAgICAgIGVsc2UgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEuY2xhc3NMaXN0LmFkZChcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgIH1cblxuICAgIHN0YXRpYyAjb25Nb2RhbFJlc29sdmVkKCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPD0gMCkgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm1vZGFsLWluYWN0aXZlXCIpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1pbmFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQhLmNsYXNzTGlzdC5jb250YWlucyhcIm1vZGFsLWFsZXJ0XCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCEucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgYWxlcnQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI29uTW9kYWxNb3VudCgpO1xuXG4gICAgICAgIGNvbnN0IGFsZXJ0ID0gaHRtbGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCBtb2RhbC1hbGVydFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibW9kYWwtbWVzc2FnZVwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1vZGFsLW9rXCI+T2s8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGFsZXJ0KTtcblxuICAgICAgICBhbGVydC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgYWxlcnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYWxlcnQucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNvbmZpcm0obWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuI29uTW9kYWxNb3VudCgpO1xuXG4gICAgICAgIGNvbnN0IGNvbmZpcm0gPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsIG1vZGFsLWNvbmZpcm1cIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1vZGFsLW1lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1va1wiPk9rPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1jYW5jZWxcIj5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbmZpcm0pO1xuXG4gICAgICAgIGNvbmZpcm0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKGZhbHNlKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9ICh2YWx1ZTogYm9vbGVhbikgPT4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbmZpcm0ucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiNvbk1vZGFsUmVzb2x2ZWQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25maXJtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWNhbmNlbFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIoZmFsc2UpKTtcblxuICAgICAgICAgICAgY29uZmlybS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tb2RhbC1va1wiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIodHJ1ZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgcHJvbXB0KG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLiNvbk1vZGFsTW91bnQoKTtcblxuICAgICAgICBjb25zdCBwcm9tcHQgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsIG1vZGFsLWNvbmZpcm1cIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1vZGFsLW1lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm1vZGFsLWlucHV0XCIgdHlwZT1cInRleHRcIiAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1va1wiPk9rPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1jYW5jZWxcIj5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHByb21wdCk7XG5cbiAgICAgICAgcHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWlucHV0XCIpIS5mb2N1cygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaW5pc2ggPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuYWRkKGZpbmlzaCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRvbmUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcHJvbXB0LnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4jb25Nb2RhbFJlc29sdmVkKCk7XG5cbiAgICAgICAgICAgICAgICBTYW5kYm94TWFuYWdlci53YXRjaGVkVW5yZXNvbHZlZFByb21pc2VzLmRlbGV0ZShmaW5pc2gpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1vZGFsLWlucHV0XCIpIS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5tb2RhbC1pbnB1dFwiKSEudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtY2FuY2VsXCIpIS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9tcHQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubW9kYWwtb2tcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocHJvbXB0LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIubW9kYWwtaW5wdXRcIikhLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgTW91c2VNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI21vdXNlID0geyB4OiAwLCB5OiAwIH07XG5cbiAgICBzdGF0aWMgcmVhZG9ubHkgI21vdXNlZG93bnMgPSBuZXcgU2V0PChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkPigpO1xuICAgIHN0YXRpYyByZWFkb25seSAjbW91c2V1cHMgPSBuZXcgU2V0PChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkPigpO1xuXG4gICAgc3RhdGljICNtb3VzZW1vdmUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZS54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLiNtb3VzZS55ID0gZS5jbGllbnRZO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI21vdXNlZG93biA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuZm9yRWFjaCgobCkgPT4gbC5jYWxsKHVuZGVmaW5lZCwgZSkpO1xuICAgIH07XG5cbiAgICBzdGF0aWMgI21vdXNldXAgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5mb3JFYWNoKChsKSA9PiBsLmNhbGwodW5kZWZpbmVkLCBlKSk7XG4gICAgfTtcblxuICAgIHN0YXRpYyBzdGFydCgpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLiNtb3VzZW1vdmUpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuI21vdXNlZG93bik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuI21vdXNldXApO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdG9wKCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuI21vdXNlbW92ZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy4jbW91c2Vkb3duKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy4jbW91c2V1cCk7XG5cbiAgICAgICAgdGhpcy4jbW91c2UgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuXG4gICAgICAgIHRoaXMuI21vdXNlZG93bnMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy4jbW91c2V1cHMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgb25Nb3VzZURvd24oaGFuZGxlcjogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jbW91c2Vkb3ducy5hZGQoaGFuZGxlcik7XG4gICAgfVxuXG4gICAgc3RhdGljIG9uTW91c2VVcChoYW5kbGVyOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5hZGQoaGFuZGxlcik7XG4gICAgfVxuXG4gICAgc3RhdGljIG9mZk1vdXNlRG93bihoYW5kbGVyOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNtb3VzZWRvd25zLmRlbGV0ZShoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgb2ZmTW91c2VVcChoYW5kbGVyOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLiNtb3VzZXVwcy5kZWxldGUoaGFuZGxlcik7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBtb3VzZSgpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy4jbW91c2UgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZnJvbUZpbGUsIHNhdmVEaWFncmFtIH0gZnJvbSBcIi4uL2ZpbGVzXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4uL3JlaWZpZWQvUmVpZmllZFwiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBLZXliaW5kc01hbmFnZXIgfSBmcm9tIFwiLi9LZXliaW5kc01hbmFnZXJcIjtcbmltcG9ydCB7IE1lbnVNYW5hZ2VyLCBNZW51TWFuYWdlckFjdGlvbnMgfSBmcm9tIFwiLi9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgTW91c2VNYW5hZ2VyIH0gZnJvbSBcIi4vTW91c2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTdG9yYWdlTWFuYWdlciB9IGZyb20gXCIuL1N0b3JhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZywgV2lyaW5nTWFuYWdlciB9IGZyb20gXCIuL1dpcmluZ01hbmFnZXJcIjtcblxudHlwZSBTYW5kYm94Q29uZmlnID0ge1xuICAgIGtleWJpbmRzPzogUmVjb3JkPHN0cmluZywgKGU6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ+O1xuICAgIG1lbnU/OiBNZW51TWFuYWdlckFjdGlvbnM7XG4gICAgaW5pdGlhbD86IFtjb21wb25lbnRzOiBSZWlmaWVkW10sIHdpcmVzOiBXaXJpbmdbXV07XG4gICAgbGltaXRzPzogKHsgdHlwZTogXCJJTlBVVFwiIHwgXCJPVVRQVVRcIjsgY291bnQ6IG51bWJlciB9IHwgeyB0eXBlOiBcIkNPTVBPTkVOVFwiOyBuYW1lPzogc3RyaW5nOyBjb3VudDogbnVtYmVyIH0pW107XG4gICAgc3RhdGVzPzogeyBpbnB1dHM/OiBib29sZWFuW107IG91dHB1dHM/OiBib29sZWFuW107IGNhbGxiYWNrOiAoKSA9PiB2b2lkIH1bXTtcbiAgICBzYXZlPzogc3RyaW5nO1xuICAgIG92ZXJyaWRlU2F2ZUlmRXhpc3RzPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBjbGFzcyBTYW5kYm94TWFuYWdlciB7XG4gICAgc3RhdGljIHF1ZXVlTmV3Q29udGV4dDogUmV0dXJuVHlwZTx0eXBlb2YgTWVudU1hbmFnZXJbXCJ1c2VcIl0+WzBdO1xuXG4gICAgc3RhdGljIHdhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMgPSBuZXcgU2V0PCgpID0+IHZvaWQ+KCk7XG5cbiAgICBzdGF0aWMgI29ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhdGljICNoaXN0b3J5ID0gbmV3IEFycmF5PFtjb21tYW5kOiAoKSA9PiB2b2lkLCByZWRvOiAoKSA9PiB2b2lkXT4oKTtcbiAgICBzdGF0aWMgI3JlZG9zID0gbmV3IEFycmF5PFtjb21tYW5kOiAoKSA9PiB2b2lkLCByZWRvOiAoKSA9PiB2b2lkXT4oKTtcblxuICAgIHN0YXRpYyBzZXR1cChjb25maWc6IFNhbmRib3hDb25maWcpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGFpbmVyIG1vZGFsLWluYWN0aXZlXCI+PC9kaXY+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8ZGl2IGNsYXNzPVwicmVpZmllZC1yb290XCI+PC9kaXY+YCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaHRtbGA8Y2FudmFzPjwvY2FudmFzPmApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGh0bWxgPGRpdiBjbGFzcz1cInRvYXN0cy1jb250YWluZXJcIj48L2Rpdj5gKTtcblxuICAgICAgICBNb3VzZU1hbmFnZXIuc3RhcnQoKTtcbiAgICAgICAgS2V5YmluZHNNYW5hZ2VyLmxpc3RlbigpO1xuICAgICAgICBEcmFnZ2luZ01hbmFnZXIubGlzdGVuKCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5tZW51ICE9PSBcInVuZGVmaW5lZFwiKSBbdGhpcy5xdWV1ZU5ld0NvbnRleHRdID0gTWVudU1hbmFnZXIudXNlKFJlaWZpZWQucm9vdCwgY29uZmlnLm1lbnUpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLmtleWJpbmRzICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoY29uZmlnLmtleWJpbmRzKS5mb3JFYWNoKChbY2hvcmQsIHJ1bl0pID0+IEtleWJpbmRzTWFuYWdlci5vbktleUNob3JkKGNob3JkLCBydW4pKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5pbml0aWFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlID0gbmV3IFNldChjb25maWcuaW5pdGlhbFswXSk7XG5cbiAgICAgICAgICAgIFJlaWZpZWQuYWN0aXZlLmZvckVhY2goKGNvbXBvbmVudCkgPT4gY29tcG9uZW50LmF0dGFjaCgpKTtcblxuICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcyA9IG5ldyBTZXQoY29uZmlnLmluaXRpYWxbMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuc2F2ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IFN0b3JhZ2VNYW5hZ2VyLmdldDxzdHJpbmc+KFwic2F2ZXM6XCIgKyBjb25maWcuc2F2ZSk7XG5cbiAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBbY29tcG9uZW50cywgd2lyZXNdLFxuICAgICAgICAgICAgICAgIH0gPSBmcm9tRmlsZShmaWxlKTtcblxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gcmVhZCBmcm9tIHNhdmVzLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25maWcub3ZlcnJpZGVTYXZlSWZFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUgPSBuZXcgU2V0KGNvbXBvbmVudHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5hdHRhY2goKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMgPSBuZXcgU2V0KHdpcmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VNYW5hZ2VyLnNldChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2F2ZXM6XCIgKyBjb25maWcuc2F2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9UT0RPOiBJbXBsZW1lbnQgdW5kby9yZWRvXG4gICAgICAgIHRoaXMuI29ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuc2F2ZSAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICBTdG9yYWdlTWFuYWdlci5zZXQoXCJzYXZlczpcIiArIGNvbmZpZy5zYXZlLCBzYXZlRGlhZ3JhbShbLi4uUmVpZmllZC5hY3RpdmVdLCBbLi4uV2lyaW5nTWFuYWdlci53aXJlc10pKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIub2JzZXJ2ZShSZWlmaWVkLnJvb3QsIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsXG4gICAgICAgICAgICBjaGFyYWN0ZXJEYXRhT2xkVmFsdWU6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvL1RPRE86IEltcGxlbWVudCBsaW1pdHNcbiAgICAgICAgLy9UT0RPOiBJbXBsZW1lbnQgZGlhZ3JhbSBzdGF0ZSBjaGVjayBjYWxsYmFja3NcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLiNvYnNlcnZlcikge1xuICAgICAgICAgICAgdGhpcy4jb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gICAgICAgICAgICB0aGlzLiNvYnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIE1vdXNlTWFuYWdlci5yZXNldCgpO1xuICAgICAgICBLZXliaW5kc01hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgIFdpcmluZ01hbmFnZXIuc3RvcCgpO1xuXG4gICAgICAgIE1lbnVNYW5hZ2VyLnJlbW92ZShSZWlmaWVkLnJvb3QpO1xuXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICB0aGlzLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZm9yRWFjaCgoZmluaXNoKSA9PiBmaW5pc2guY2FsbCh1bmRlZmluZWQpKTtcblxuICAgICAgICB0aGlzLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuY2xlYXIoKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IFwiXCI7XG4gICAgfVxuXG4gICAgc3RhdGljIGNsZWFyKCkge1xuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5mb3JFYWNoKChjb21wb25lbnQpID0+IGNvbXBvbmVudC5kZXRhY2goKSk7XG5cbiAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB3aXJlLmRlc3Ryb3koKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHB1c2hIaXN0b3J5KGNvbW1hbmQ6ICgpID0+IHZvaWQsIHVuZG86ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy4jcmVkb3MubGVuZ3RoID0gMDtcblxuICAgICAgICB0aGlzLiNoaXN0b3J5LnB1c2goW2NvbW1hbmQsIHVuZG9dKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcG9wSGlzdG9yeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiNoaXN0b3J5Lmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB2b2lkIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJOb3RoaW5nIHRvIHVuZG8uXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBbcmVkbywgdW5kb10gPSB0aGlzLiNoaXN0b3J5LnBvcCgpITtcblxuICAgICAgICB0aGlzLiNyZWRvcy5wdXNoKFtyZWRvLCB1bmRvXSk7XG5cbiAgICAgICAgcmV0dXJuIHVuZG8uY2FsbCh1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWRvSGlzdG9yeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiNyZWRvcy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gdm9pZCBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTm90aGluZyB0byByZWRvLlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTAwLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgW2NvbW1hbmQsIHVuZG9dID0gdGhpcy4jcmVkb3MucG9wKCkhO1xuXG4gICAgICAgIHRoaXMuI2hpc3RvcnkucHVzaChbY29tbWFuZCwgdW5kb10pO1xuXG4gICAgICAgIHJldHVybiBjb21tYW5kLmNhbGwodW5kZWZpbmVkKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU3RvcmFnZU1hbmFnZXIge1xuICAgIHN0YXRpYyByZWFkb25seSBwcmVmaXggPSBcImtlbHNueS5nYXRlc2ltOlwiO1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG4gICAgc3RhdGljIHNldDxUPihrZXk6IHN0cmluZywgdmFsdWU6IFQpOiBUIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldEl0ZW0odGhpcy5wcmVmaXggKyBrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXQ8VD4oa2V5OiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXggKyBrZXkpISkgPz8gdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGh0bWwgfSBmcm9tIFwiLi4vcmVpZmllZC9SZWlmaWVkXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL1NhbmRib3hNYW5hZ2VyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9hc3REYXRhIHtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgY29sb3I6IHN0cmluZztcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgVG9hc3RNYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0IGNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0cy1jb250YWluZXJcIikhO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyB0b2FzdCh7IG1lc3NhZ2UsIGNvbG9yLCBkdXJhdGlvbiB9OiBUb2FzdERhdGEpIHtcbiAgICAgICAgY29uc3QgdG9hc3QgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0b2FzdC1tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2xvc2UtdG9hc3RcIj7ilbM8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICAgIHRvYXN0LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLnRvYXN0LWNvbG9yXCIpIS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcblxuICAgICAgICB0b2FzdC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGR1cmF0aW9uICsgXCJtc1wiO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRvYXN0KTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHJlc29sdmUodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIud2F0Y2hlZFVucmVzb2x2ZWRQcm9taXNlcy5hZGQoZmluaXNoKTtcblxuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0b2FzdC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLndhdGNoZWRVbnJlc29sdmVkUHJvbWlzZXMuZGVsZXRlKGZpbmlzaCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0b2FzdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbG9zZS10b2FzdFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIpO1xuXG4gICAgICAgICAgICB0b2FzdC5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIGhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBQ1RJVkFURURfQ1NTX0NPTE9SLCBMSUdIVF9HUkFZX0NTU19DT0xPUiB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IE1vdXNlTWFuYWdlciB9IGZyb20gXCIuL01vdXNlTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgTmV3V2lyZUNvbnRleHQge1xuICAgIHN0YXRpYyBmcm9tOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIHN0YXRpYyB7XG4gICAgICAgIE1vdXNlTWFuYWdlci5vbk1vdXNlRG93bigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKE5ld1dpcmVDb250ZXh0LmZyb20pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRhcmdldCB9ID0gZTtcblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImJvYXJkLW91dHB1dFwiKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNvbXBvbmVudC1pbnB1dC1idXR0b25cIilcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmFkZChuZXcgV2lyaW5nKE5ld1dpcmVDb250ZXh0LmZyb20sIHRhcmdldCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2lyaW5nIHtcbiAgICAjZGVzdHJveWVkID0gZmFsc2U7XG4gICAgI29ic2VydmVyO1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZnJvbTogRWxlbWVudCwgcmVhZG9ubHkgdG86IEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICB0by5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIGZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4jb2JzZXJ2ZXIub2JzZXJ2ZShmcm9tLCB7IGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sIGF0dHJpYnV0ZXM6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy4jZGVzdHJveWVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLiNvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgZ2V0IGRlc3Ryb3llZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI2Rlc3Ryb3llZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXaXJpbmdNYW5hZ2VyIHtcbiAgICBzdGF0aWMgI3JBRjogbnVtYmVyIHwgdW5kZWZpbmVkID0gLTE7XG5cbiAgICBzdGF0aWMgd2lyZXMgPSBuZXcgU2V0PFdpcmluZz4oKTtcblxuICAgIHN0YXRpYyB1cGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJjYW52YXNcIikhLmdldENvbnRleHQoXCIyZFwiKSE7XG5cbiAgICAgICAgY3R4LmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBjdHguY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICB0aGlzLndpcmVzID0gbmV3IFNldChbLi4udGhpcy53aXJlc10uZmlsdGVyKCh3aXJlKSA9PiAhd2lyZS5kZXN0cm95ZWQpKTtcblxuICAgICAgICB0aGlzLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSB3aXJlLmZyb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCB0byA9IHdpcmUudG8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgIHdpcmUudG8uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2YXRlZFwiLCB3aXJlLmZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpKTtcblxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gd2lyZS5mcm9tLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSA/IEFDVElWQVRFRF9DU1NfQ09MT1IgOiBMSUdIVF9HUkFZX0NTU19DT0xPUjtcblxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDU7XG5cbiAgICAgICAgICAgIGN0eC5saW5lSm9pbiA9IFwicm91bmRcIjtcblxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4Lm1vdmVUbyhmcm9tLnggKyBmcm9tLndpZHRoIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8odG8ueCArIHRvLndpZHRoIC8gMiwgdG8ueSArIHRvLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoTmV3V2lyZUNvbnRleHQuZnJvbSkge1xuICAgICAgICAgICAgY29uc3QgZnJvbSA9IE5ld1dpcmVDb250ZXh0LmZyb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IE5ld1dpcmVDb250ZXh0LmZyb20uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZhdGVkXCIpXG4gICAgICAgICAgICAgICAgPyBBQ1RJVkFURURfQ1NTX0NPTE9SXG4gICAgICAgICAgICAgICAgOiBMSUdIVF9HUkFZX0NTU19DT0xPUjtcblxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDU7XG5cbiAgICAgICAgICAgIGN0eC5saW5lSm9pbiA9IFwicm91bmRcIjtcblxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4Lm1vdmVUbyhmcm9tLnggKyBmcm9tLndpZHRoIC8gMiwgZnJvbS55ICsgZnJvbS5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIGN0eC5saW5lVG8oTW91c2VNYW5hZ2VyLm1vdXNlLngsIE1vdXNlTWFuYWdlci5tb3VzZS55KTtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBzdGFydCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0YXJ0LmJpbmQodGhpcykpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jckFGID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLiNyQUYgPSAtMTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4jckFGID0gaWQ7XG4gICAgfVxuXG4gICAgc3RhdGljIHN0b3AoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy4jckFGICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLiNyQUYgPz8gMCk7XG5cbiAgICAgICAgICAgIHRoaXMuI3JBRiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgQUNUSVZBVEVEX0NTU19DT0xPUixcbiAgICBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUsXG4gICAgSU5fREVCVUdfTU9ERSxcbiAgICBPUklHSU5fUE9JTlQsXG4gICAgT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBmcm9tRmlsZSwgc2F2ZURpYWdyYW0gfSBmcm9tIFwiLi9maWxlc1wiO1xuaW1wb3J0IHsgRHJhZ2dpbmdNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBNZW51TWFuYWdlckFjdGlvbnMgfSBmcm9tIFwiLi9tYW5hZ2Vycy9NZW51TWFuYWdlclwiO1xuaW1wb3J0IHsgTW9kYWxNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlcnMvTW9kYWxNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBUb2FzdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9Ub2FzdE1hbmFnZXJcIjtcbmltcG9ydCB7IFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9XaXJpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBjaGlwcyB9IGZyb20gXCIuL3JlaWZpZWQvY2hpcHNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL3JlaWZpZWQvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL3JlaWZpZWQvSW5wdXRcIjtcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuL3JlaWZpZWQvT3V0cHV0XCI7XG5pbXBvcnQgeyBSZWlmaWVkIH0gZnJvbSBcIi4vcmVpZmllZC9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjb25zdCBtZW51OiBNZW51TWFuYWdlckFjdGlvbnMgPSBbXG4gICAge1xuICAgICAgICBcImluc2VydC1jaGlwXCI6IHtcbiAgICAgICAgICAgIGxhYmVsOiBcIkluc2VydCBjaGlwXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gYXdhaXQgTW9kYWxNYW5hZ2VyLnByb21wdChcIkVudGVyIHRoZSBjaGlwJ3MgbmFtZTpcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaXAgPSBjaGlwcy5nZXQobmFtZS50b1VwcGVyQ2FzZSgpKTtcblxuICAgICAgICAgICAgICAgIGlmICghY2hpcCkgcmV0dXJuIE1vZGFsTWFuYWdlci5hbGVydChcIk5vIGNoaXAgd2FzIGZvdW5kIHdpdGggdGhhdCBuYW1lLlwiKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyBDb21wb25lbnQoUmVmbGVjdC5jb25zdHJ1Y3QoY2hpcCwgW10pLCBPUklHSU5fUE9JTlQpO1xuXG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGNvbXBvbmVudCk7XG5cbiAgICAgICAgICAgICAgICBjb21wb25lbnQuYXR0YWNoKCk7XG5cbiAgICAgICAgICAgICAgICBEcmFnZ2luZ01hbmFnZXIud2F0Y2goY29tcG9uZW50LmVsZW1lbnQsIGNvbXBvbmVudC5uYW1lKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShjb21wb25lbnQuZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICBjb21wb25lbnQubW92ZSh7XG4gICAgICAgICAgICAgICAgICAgIHg6IGUuY2xpZW50WCAtIHBhcnNlRmxvYXQod2lkdGgpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgeTogZS5jbGllbnRZIC0gcGFyc2VGbG9hdChoZWlnaHQpIC8gMixcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIFwibmV3LWlucHV0XCI6IHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk5ldyBpbnB1dFwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBuZXcgSW5wdXQoe1xuICAgICAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgICAgICB5OiBlLmNsaWVudFkgLSBJTlBVVF9DT01QT05FTlRfQ1NTX1NJWkUgLyAyLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgUmVpZmllZC5hY3RpdmUuYWRkKGlucHV0KTtcblxuICAgICAgICAgICAgICAgIGlucHV0LmF0dGFjaCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJuZXctb3V0cHV0XCI6IHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk5ldyBvdXRwdXRcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dCA9IG5ldyBPdXRwdXQoe1xuICAgICAgICAgICAgICAgICAgICB4OiBlLmNsaWVudFggLSBPVVRQVVRfQ09NUE9ORU5UX0NTU19TSVpFIC8gMixcbiAgICAgICAgICAgICAgICAgICAgeTogZS5jbGllbnRZIC0gT1VUUFVUX0NPTVBPTkVOVF9DU1NfU0laRSAvIDIsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQob3V0cHV0KTtcblxuICAgICAgICAgICAgICAgIG91dHB1dC5hdHRhY2goKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAvLyB7XG4gICAgLy8gICAgIFwibmV3LWNoaXBcIjoge1xuICAgIC8vICAgICAgICAgbGFiZWw6IFwiTmV3IGNoaXAgZnJvbSBkaWFncmFtXCIsXG4gICAgLy8gICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgIC8vICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBhd2FpdCBNb2RhbE1hbmFnZXIucHJvbXB0KFwiRW50ZXIgdGhlIG5hbWUgb2YgdGhlIGNoaXA6XCIpO1xuXG4gICAgLy8gICAgICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XG5cbiAgICAvLyAgICAgICAgICAgICBpZiAoXG4gICAgLy8gICAgICAgICAgICAgICAgIGNoaXBzLmhhcyhuYW1lLnRyaW0oKS50b1VwcGVyQ2FzZSgpKSAmJlxuICAgIC8vICAgICAgICAgICAgICAgICAhKGF3YWl0IE1vZGFsTWFuYWdlci5jb25maXJtKFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgXCJBIGNoaXAgYWxyZWFkeSBleGlzdHMgd2l0aCB0aGlzIG5hbWUuXFxuQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlcGxhY2UgaXQ/XCIsXG4gICAgLy8gICAgICAgICAgICAgICAgICkpXG4gICAgLy8gICAgICAgICAgICAgKVxuICAgIC8vICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAvLyAgICAgICAgICAgICBpZiAoIS9eXFx3KyQvLnRlc3QobmFtZS50cmltKCkudG9VcHBlckNhc2UoKSkpXG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiBNb2RhbE1hbmFnZXIuYWxlcnQoXCJDaGlwIG5hbWUgbXVzdCBjb25zaXN0IG9mIG9ubHkgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMuXCIpO1xuXG4gICAgLy8gICAgICAgICAgICAgY29uc3QgaW5wdXRzID0gWy4uLlJlaWZpZWQuYWN0aXZlLnZhbHVlcygpXS5maWx0ZXIoKHYpID0+IHYgaW5zdGFuY2VvZiBJbnB1dCkubGVuZ3RoO1xuICAgIC8vICAgICAgICAgICAgIGNvbnN0IG91dHB1dHMgPSBbLi4uUmVpZmllZC5hY3RpdmUudmFsdWVzKCldLmZpbHRlcigodikgPT4gdiBpbnN0YW5jZW9mIE91dHB1dCkubGVuZ3RoO1xuXG4gICAgLy8gICAgICAgICAgICAgY2hpcHMuc2V0KFxuICAgIC8vICAgICAgICAgICAgICAgICBuYW1lLnRyaW0oKS50b1VwcGVyQ2FzZSgpLFxuICAgIC8vICAgICAgICAgICAgICAgICBjbGFzcyBfIGV4dGVuZHMgQ2hpcDxudW1iZXIsIG51bWJlcj4ge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBuYW1lIS50cmltKCkudG9VcHBlckNhc2UoKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSBpbnB1dHM7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBzdGF0aWMgcmVhZG9ubHkgT1VUUFVUUyA9IG91dHB1dHM7XG5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyKG5hbWUhLCBpbnB1dHMsIG91dHB1dHMpO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBvdXRwdXQoaW5wdXRzOiBib29sZWFuW10pOiBib29sZWFuW10ge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogU09NRUhPVyBDT01QSUxFIFRIRSBESUFHUkFNXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiBTT1JUIElOUFVUUy9PVVRQVVRTIEJZIFktQ09PUkRcblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICAgICAgfSxcbiAgICAvLyAgICAgICAgICAgICApO1xuXG4gICAgLy8gICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucmVzZXQoKTtcbiAgICAvLyAgICAgICAgIH0sXG4gICAgLy8gICAgIH0sXG4gICAgLy8gfSxcbiAgICB7XG4gICAgICAgIFwic2F2ZS1hc1wiOiB7XG4gICAgICAgICAgICBsYWJlbDogXCJTYXZlIGFzIGZpbGVcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKSwge1xuICAgICAgICAgICAgICAgICAgICBocmVmOiBVUkwuY3JlYXRlT2JqZWN0VVJMKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEJsb2IoW3NhdmVEaWFncmFtKFsuLi5SZWlmaWVkLmFjdGl2ZV0sIFsuLi5XaXJpbmdNYW5hZ2VyLndpcmVzXSldLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgZG93bmxvYWQ6IGBnYXRlc2ltLSR7RGF0ZS5ub3coKX0uanNvbmAsXG4gICAgICAgICAgICAgICAgfSkuY2xpY2soKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFwiaW1wb3J0LWZyb21cIjoge1xuICAgICAgICAgICAgbGFiZWw6IFwiSW1wb3J0IGZyb20gZmlsZVwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLCB7IHR5cGU6IFwiZmlsZVwiIH0pO1xuXG4gICAgICAgICAgICAgICAgaW5wdXQuY2xpY2soKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBuZXcgUHJvbWlzZTxGaWxlIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5vbmNoYW5nZSA9ICgpID0+IHJlc29sdmUoaW5wdXQuZmlsZXM/LlswXSA/PyB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlucHV0Lm9uZXJyb3IgPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZpbGUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJObyBmaWxlIHdhcyBwcm92aWRlZC5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBBQ1RJVkFURURfQ1NTX0NPTE9SLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmF3ID0gYXdhaXQgbmV3IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4gcmVzb2x2ZShyZWFkZXIucmVzdWx0Py50b1N0cmluZygpID8/IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXJhdylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRvYXN0TWFuYWdlci50b2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byByZWFkIHRoZSBmaWxlLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IFtjb21wb25lbnRzLCB3aXJlc10sXG4gICAgICAgICAgICAgICAgfSA9IGZyb21GaWxlKHJhdyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHJldHVybiBUb2FzdE1hbmFnZXIudG9hc3QoeyBtZXNzYWdlOiBlcnJvciwgY29sb3I6IEFDVElWQVRFRF9DU1NfQ09MT1IsIGR1cmF0aW9uOiAyNTAwIH0pO1xuXG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucmVzZXQoKTtcblxuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnNldHVwKHtcbiAgICAgICAgICAgICAgICAgICAgbWVudSxcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbDogW2NvbXBvbmVudHMhLCB3aXJlcyFdLFxuICAgICAgICAgICAgICAgICAgICBzYXZlOiBcInNhbmRib3hcIixcbiAgICAgICAgICAgICAgICAgICAgb3ZlcnJpZGVTYXZlSWZFeGlzdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgLi4uKElOX0RFQlVHX01PREVcbiAgICAgICAgPyBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFNUT1A6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTVE9QIFJFTkRFUlwiLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgU1RBUlQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJTVEFSVCBSRU5ERVJcIixcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgXVxuICAgICAgICA6IFtdKSxcbl07XG4iLCJpbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgQ2hpcCB9IGZyb20gXCIuL2NoaXBzXCI7XG5pbXBvcnQgeyBodG1sLCBSZWlmaWVkIH0gZnJvbSBcIi4vUmVpZmllZFwiO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50PEkgZXh0ZW5kcyBudW1iZXIsIE8gZXh0ZW5kcyBudW1iZXI+IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIHJlYWRvbmx5IGlucHV0cztcbiAgICByZWFkb25seSBvdXRwdXRzO1xuICAgIHJlYWRvbmx5IG5hbWU7XG5cbiAgICByZWFkb25seSAjb2JzZXJ2ZXJzID0gbmV3IE1hcDxFbGVtZW50LCBNdXRhdGlvbk9ic2VydmVyPigpO1xuICAgIHJlYWRvbmx5ICNjb250ZXh0bWVudXMgPSBuZXcgTWFwPEVsZW1lbnQsICgpID0+IHZvaWQ+KCk7XG5cbiAgICByZWFkb25seSBjaGlwOiBDaGlwPEksIE8+O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGNoaXA6IENoaXA8SSwgTz4sXG4gICAgICAgIHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IHwgKChjb21wOiBDb21wb25lbnQ8SSwgTz4pID0+IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSksXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5jaGlwID0gY2hpcDtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBodG1sYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkodGhpcy5jaGlwLmlucHV0cykuZmlsbCgnPGJ1dHRvbiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dC1idXR0b25cIj5JPC9idXR0b24+Jykuam9pbihcIlwiKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImNvbXBvbmVudC1uYW1lXCI+JHt0aGlzLmNoaXAubmFtZX08L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1vdXRwdXRzXCI+XG4gICAgICAgICAgICAgICAgICAgICR7QXJyYXkodGhpcy5jaGlwLm91dHB1dHMpLmZpbGwoJzxidXR0b24gY2xhc3M9XCJjb21wb25lbnQtb3V0cHV0LWJ1dHRvblwiPk88L2J1dHRvbj4nKS5qb2luKFwiXCIpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMgPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIi5jb21wb25lbnQtaW5wdXQtYnV0dG9uXCIpKTtcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW91dHB1dC1idXR0b25cIikpO1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY29tcG9uZW50LW5hbWVcIikhO1xuXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5zZXQoaW5wdXQsIG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMudXBkYXRlLmJpbmQodGhpcykpKTtcblxuICAgICAgICAgICAgdGhpcy4jY29udGV4dG1lbnVzLnNldChpbnB1dCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgocHJldikgPT4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gaW5wdXQpIHdpcmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAuLi5wcmV2LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5zZXQob3V0cHV0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KChwcmV2KSA9PiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY3JlYXRlLWNvbm5lY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNyZWF0ZSBjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IG91dHB1dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IG91dHB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiNjb250ZXh0bWVudXMuc2V0KHRoaXMubmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgU2FuZGJveE1hbmFnZXIucXVldWVOZXdDb250ZXh0KChwcmV2KSA9PiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb21wb25lbnRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbXBvbmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZS1jb25uZWN0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lyaW5nTWFuYWdlci53aXJlcy5mb3JFYWNoKCh3aXJlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnNvbWUoKGkpID0+IHdpcmUudG8gPT09IGkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dHMuc29tZSgobykgPT4gd2lyZS5mcm9tID09PSBvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGkpID0+IGkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vdmUodHlwZW9mIHBvcyA9PT0gXCJmdW5jdGlvblwiID8gcG9zLmNhbGwodW5kZWZpbmVkLCB0aGlzKSA6IHBvcyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICBjb25zdCBvdXQgPSB0aGlzLmNoaXAuZXZhbHVhdGUodGhpcy5pbnB1dHMubWFwKChpKSA9PiBpLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2YXRlZFwiKSkpO1xuXG4gICAgICAgIHRoaXMub3V0cHV0cy5mb3JFYWNoKChvdXRwdXQsIGkpID0+IHtcbiAgICAgICAgICAgIG91dHB1dC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIsIG91dFtpXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgc3VwZXIuYXR0YWNoKCk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuI29ic2VydmVycy5nZXQoaW5wdXQpIS5vYnNlcnZlKGlucHV0LCB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudXMuZ2V0KGlucHV0KSEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dHB1dHMuZm9yRWFjaCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICBvdXRwdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQob3V0cHV0KSEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm5hbWUuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQodGhpcy5uYW1lKSEpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci53YXRjaCh0aGlzLmVsZW1lbnQsIHRoaXMubmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLiNvYnNlcnZlcnMuZm9yRWFjaCgobykgPT4gby5kaXNjb25uZWN0KCkpO1xuXG4gICAgICAgIHRoaXMuI2NvbnRleHRtZW51cy5mb3JFYWNoKChsaXN0ZW5lciwgZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgbGlzdGVuZXIpKTtcblxuICAgICAgICB0aGlzLm5hbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51cy5nZXQodGhpcy5uYW1lKSEpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5mb3JnZXQodGhpcy5lbGVtZW50LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBEcmFnZ2luZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvRHJhZ2dpbmdNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTYW5kYm94TWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV3V2lyZUNvbnRleHQsIFdpcmluZ01hbmFnZXIgfSBmcm9tIFwiLi4vbWFuYWdlcnMvV2lyaW5nTWFuYWdlclwiO1xuaW1wb3J0IHsgaHRtbCwgUmVpZmllZCB9IGZyb20gXCIuL1JlaWZpZWRcIjtcblxuZXhwb3J0IGNsYXNzIElucHV0IGV4dGVuZHMgUmVpZmllZCB7XG4gICAgcmVhZG9ubHkgZWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9ID0geyB4OiAwLCB5OiAwIH0pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBodG1sYDxidXR0b24gY2xhc3M9XCJib2FyZC1pbnB1dFwiPkk8L2J1dHRvbj5gO1xuXG4gICAgICAgIHRoaXMubW92ZShwb3MpO1xuICAgIH1cblxuICAgIHJlYWRvbmx5ICNtb3VzZWRvd24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC54ID0gZS5jbGllbnRYLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnkgPSBlLmNsaWVudFkudG9TdHJpbmcoKTtcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgI2NsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKE1hdGguaHlwb3QoZS5jbGllbnRYIC0gK3RoaXMuZWxlbWVudC5kYXRhc2V0LnghLCBlLmNsaWVudFkgLSArdGhpcy5lbGVtZW50LmRhdGFzZXQueSEpID4gMikgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZhdGVkXCIpO1xuICAgIH07XG5cbiAgICByZWFkb25seSAjY29udGV4dG1lbnUgPSAoKSA9PiB7XG4gICAgICAgIFNhbmRib3hNYW5hZ2VyLnF1ZXVlTmV3Q29udGV4dCgocHJldikgPT4gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY3JlYXRlLWNvbm5lY3Rpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDcmVhdGUgY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgTmV3V2lyZUNvbnRleHQuZnJvbSA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlLWlucHV0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGlucHV0XCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS5mcm9tID09PSB0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZS50by5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJkZWxldGUtY29ubmVjdGlvbnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgY29ubmVjdGlvbnNcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpcmluZ01hbmFnZXIud2lyZXMuZm9yRWFjaCgod2lyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aXJlLmZyb20gPT09IHRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXJlLnRvLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmF0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAuLi5wcmV2LFxuICAgICAgICBdKTtcbiAgICB9O1xuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLndhdGNoKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBzdXBlci5kZXRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLiNtb3VzZWRvd24pO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuI2NsaWNrKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLiNjb250ZXh0bWVudSk7XG5cbiAgICAgICAgRHJhZ2dpbmdNYW5hZ2VyLmZvcmdldCh0aGlzLmVsZW1lbnQsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IERyYWdnaW5nTWFuYWdlciB9IGZyb20gXCIuLi9tYW5hZ2Vycy9EcmFnZ2luZ01hbmFnZXJcIjtcbmltcG9ydCB7IFNhbmRib3hNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1NhbmRib3hNYW5hZ2VyXCI7XG5pbXBvcnQgeyBXaXJpbmdNYW5hZ2VyIH0gZnJvbSBcIi4uL21hbmFnZXJzL1dpcmluZ01hbmFnZXJcIjtcbmltcG9ydCB7IGh0bWwsIFJlaWZpZWQgfSBmcm9tIFwiLi9SZWlmaWVkXCI7XG5cbmV4cG9ydCBjbGFzcyBPdXRwdXQgZXh0ZW5kcyBSZWlmaWVkIHtcbiAgICByZWFkb25seSBlbGVtZW50O1xuXG4gICAgcmVhZG9ubHkgI2NvbnRleHRtZW51ID0gKCkgPT4ge1xuICAgICAgICBTYW5kYm94TWFuYWdlci5xdWV1ZU5ld0NvbnRleHQoKHByZXYpID0+IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImRlbGV0ZS1vdXRwdXRcIjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJEZWxldGUgb3V0cHV0XCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gdGhpcy5lbGVtZW50KSB3aXJlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlLWNvbm5lY3Rpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVsZXRlIGNvbm5lY3Rpb25zXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBXaXJpbmdNYW5hZ2VyLndpcmVzLmZvckVhY2goKHdpcmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lyZS50byA9PT0gdGhpcy5lbGVtZW50KSB3aXJlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2YXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgIF0pO1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwb3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSA9IHsgeDogMCwgeTogMCB9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gaHRtbGA8YnV0dG9uIGNsYXNzPVwiYm9hcmQtb3V0cHV0XCI+TzwvYnV0dG9uPmA7XG5cbiAgICAgICAgdGhpcy5tb3ZlKHBvcyk7XG4gICAgfVxuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBzdXBlci5hdHRhY2goKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuI2NvbnRleHRtZW51KTtcblxuICAgICAgICBEcmFnZ2luZ01hbmFnZXIud2F0Y2godGhpcy5lbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIHN1cGVyLmRldGFjaCgpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy4jY29udGV4dG1lbnUpO1xuXG4gICAgICAgIERyYWdnaW5nTWFuYWdlci5mb3JnZXQodGhpcy5lbGVtZW50LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaHRtbCh0ZW1wbGF0ZTogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnZhbHVlczogdW5rbm93bltdKTogSFRNTEVsZW1lbnQ7XG5leHBvcnQgZnVuY3Rpb24gaHRtbChodG1sOiBzdHJpbmcpOiBIVE1MRWxlbWVudDtcbmV4cG9ydCBmdW5jdGlvbiBodG1sKC4uLmFyZ3M6IFtzdHJpbmddIHwgW1RlbXBsYXRlU3RyaW5nc0FycmF5LCAuLi51bmtub3duW11dKSB7XG4gICAgY29uc3QgW3RlbXBsYXRlLCAuLi52YWx1ZXNdID0gYXJncztcblxuICAgIGNvbnN0IGh0bWwgPVxuICAgICAgICB0eXBlb2YgdGVtcGxhdGUgPT09IFwic3RyaW5nXCIgPyB0ZW1wbGF0ZSA6IHRlbXBsYXRlLnJlZHVjZSgoaHRtbCwgdGV4dCwgaSkgPT4gaHRtbCArIHRleHQgKyB2YWx1ZXNbaV0gPz8gXCJcIiwgXCJcIik7XG5cbiAgICByZXR1cm4gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKS5ib2R5LmNoaWxkTm9kZXNbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChlOiBFdmVudCkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlaWZpZWQge1xuICAgIHN0YXRpYyBhY3RpdmUgPSBuZXcgU2V0PFJlaWZpZWQ+KCk7XG5cbiAgICBzdGF0aWMgZ2V0IHJvb3QoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5yZWlmaWVkLXJvb3RcIikhO1xuICAgIH1cblxuICAgIGFic3RyYWN0IHJlYWRvbmx5IGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gICAgbW92ZSh7IHgsIHkgfTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0geCArIFwicHhcIjtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHkgKyBcInB4XCI7XG4gICAgfVxuXG4gICAgYXR0YWNoKCkge1xuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5hZGQodGhpcyk7XG5cbiAgICAgICAgUmVpZmllZC5yb290LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBSZWlmaWVkLmFjdGl2ZS5kZWxldGUodGhpcyk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsInR5cGUgQm9vbGVhblR1cGxlPEwgZXh0ZW5kcyBudW1iZXIsIFIgZXh0ZW5kcyBib29sZWFuW10gPSBbXT4gPSBudW1iZXIgZXh0ZW5kcyBMXG4gICAgPyBib29sZWFuW11cbiAgICA6IFJbXCJsZW5ndGhcIl0gZXh0ZW5kcyBMXG4gICAgPyBSXG4gICAgOiBCb29sZWFuVHVwbGU8TCwgWy4uLlIsIGJvb2xlYW5dPjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENoaXA8SSBleHRlbmRzIG51bWJlciwgTyBleHRlbmRzIG51bWJlcj4ge1xuICAgIHN0YXRpYyByZWFkb25seSBOQU1FOiBzdHJpbmc7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUzogbnVtYmVyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTOiBudW1iZXI7XG5cbiAgICByZWFkb25seSBuYW1lO1xuXG4gICAgcmVhZG9ubHkgaW5wdXRzO1xuICAgIHJlYWRvbmx5IG91dHB1dHM7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGlucHV0czogSSwgb3V0cHV0czogTykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmlucHV0cyA9IGlucHV0cztcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gb3V0cHV0cztcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBvdXRwdXQoaW5wdXRzOiBCb29sZWFuVHVwbGU8ST4pOiBCb29sZWFuVHVwbGU8Tz47XG5cbiAgICBldmFsdWF0ZShpbnB1dHM6IGJvb2xlYW5bXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vdXRwdXQoaW5wdXRzIGFzIEJvb2xlYW5UdXBsZTxJLCBbXT4pIGFzIGJvb2xlYW5bXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBbmRHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIkFORFwiO1xuICAgIHN0YXRpYyByZWFkb25seSBJTlBVVFMgPSAyO1xuICAgIHN0YXRpYyByZWFkb25seSBPVVRQVVRTID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkFORFwiLCAyLCAxKTtcbiAgICB9XG5cbiAgICBvdXRwdXQoW2EsIGJdOiBbYm9vbGVhbiwgYm9vbGVhbl0pOiBbYm9vbGVhbl0ge1xuICAgICAgICByZXR1cm4gW2EgJiYgYl07XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgT3JHYXRlIGV4dGVuZHMgQ2hpcDwyLCAxPiB7XG4gICAgc3RhdGljIHJlYWRvbmx5IE5BTUUgPSBcIk9SXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDI7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiT1JcIiwgMiwgMSk7XG4gICAgfVxuXG4gICAgb3V0cHV0KFthLCBiXTogW2Jvb2xlYW4sIGJvb2xlYW5dKTogW2Jvb2xlYW5dIHtcbiAgICAgICAgcmV0dXJuIFthIHx8IGJdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vdEdhdGUgZXh0ZW5kcyBDaGlwPDEsIDE+IHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgTkFNRSA9IFwiTk9UXCI7XG4gICAgc3RhdGljIHJlYWRvbmx5IElOUFVUUyA9IDE7XG4gICAgc3RhdGljIHJlYWRvbmx5IE9VVFBVVFMgPSAxO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiTk9UXCIsIDEsIDEpO1xuICAgIH1cblxuICAgIG91dHB1dChbbl06IFtib29sZWFuXSk6IFtib29sZWFuXSB7XG4gICAgICAgIHJldHVybiBbIW5dO1xuICAgIH1cbn1cblxudHlwZSBTdGF0aWNNZW1iZXJzPFQ+ID0geyBbSyBpbiBrZXlvZiBUXTogVFtLXSB9O1xuXG5leHBvcnQgY29uc3QgY2hpcHMgPSBuZXcgTWFwPHN0cmluZywgU3RhdGljTWVtYmVyczx0eXBlb2YgQ2hpcDxudW1iZXIsIG51bWJlcj4+ICYgeyBuZXcgKCk6IENoaXA8bnVtYmVyLCBudW1iZXI+IH0+KFtcbiAgICBbQW5kR2F0ZS5OQU1FLCBBbmRHYXRlXSxcbiAgICBbT3JHYXRlLk5BTUUsIE9yR2F0ZV0sXG4gICAgW05vdEdhdGUuTkFNRSwgTm90R2F0ZV0sXG5dKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsga2V5YmluZHMgfSBmcm9tIFwiLi9rZXliaW5kc1wiO1xuaW1wb3J0IHsgU2FuZGJveE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2Vycy9TYW5kYm94TWFuYWdlclwiO1xuaW1wb3J0IHsgbWVudSB9IGZyb20gXCIuL21lbnVcIjtcblxuU2FuZGJveE1hbmFnZXIuc2V0dXAoeyBrZXliaW5kcywgbWVudSwgc2F2ZTogXCJzYW5kYm94XCIgfSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=