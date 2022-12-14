/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/cad/algebra/stringify.ts":
/*!**************************************!*\
  !*** ./src/cad/algebra/stringify.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "stringify": () => (/* binding */ stringify)
/* harmony export */ });
/* harmony import */ var _variables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./variables */ "./src/cad/algebra/variables.ts");

function expression(input, type) {
    if (type === "PRODUCT_OF_SUMS")
        return input.map((_, i) => (0,_variables__WEBPACK_IMPORTED_MODULE_0__.variableFor)(i, _)).join("+");
    if (type === "SUM_OF_PRODUCTS")
        return input.map((_, i) => (0,_variables__WEBPACK_IMPORTED_MODULE_0__.variableFor)(i, !_)).join("");
    throw new TypeError(`Unknown type '${type}'.`);
}
function stringify(table) {
    if (table.some(([inputs]) => inputs.length > _variables__WEBPACK_IMPORTED_MODULE_0__.VARIABLE_NAMES.length))
        throw new RangeError(`Table contains more than ${_variables__WEBPACK_IMPORTED_MODULE_0__.VARIABLE_NAMES.length} inputs.`);
    const outputs = table.map(([, outputs]) => outputs);
    const transposed = outputs[0].map((_, col) => outputs.map((row) => row[col]));
    return transposed.map((out, index) => {
        if (out.every(Boolean))
            return `(a+a${_variables__WEBPACK_IMPORTED_MODULE_0__.UNICODE_MACRON_DIACRITIC})`;
        if (!out.some(Boolean))
            return `aa${_variables__WEBPACK_IMPORTED_MODULE_0__.UNICODE_MACRON_DIACRITIC}`;
        const type = out.filter(Boolean).length > out.length / 2 ? "PRODUCT_OF_SUMS" : "SUM_OF_PRODUCTS";
        if (type === "PRODUCT_OF_SUMS") {
            return ("(" +
                table
                    .filter(([, outputs]) => outputs[index] === false)
                    .map(([inputs]) => expression(inputs, type))
                    .join(")(") +
                ")");
        }
        if (type === "SUM_OF_PRODUCTS") {
            return table
                .filter(([, outputs]) => outputs[index] === true)
                .map(([inputs]) => expression(inputs, type))
                .join("+");
        }
        throw new Error();
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

function substitute(exprs, using) {
    return exprs.map((expr) => expr.startsWith("(") && expr.endsWith(")")
        ? expr
            .slice(1, -1)
            .split(")(")
            .map((o) => o
            .split("+")
            .map((v) => ((0,_variables__WEBPACK_IMPORTED_MODULE_0__.isInversion)(v) ? !using[(0,_variables__WEBPACK_IMPORTED_MODULE_0__.fromVariable)(v)] : using[(0,_variables__WEBPACK_IMPORTED_MODULE_0__.fromVariable)(v)]))
            .some(Boolean))
            .every(Boolean)
        : expr
            .split("+")
            .map((o) => o
            .split(/(?=\w)/)
            .map((v) => ((0,_variables__WEBPACK_IMPORTED_MODULE_0__.isInversion)(v) ? !using[(0,_variables__WEBPACK_IMPORTED_MODULE_0__.fromVariable)(v)] : using[(0,_variables__WEBPACK_IMPORTED_MODULE_0__.fromVariable)(v)]))
            .every(Boolean))
            .some(Boolean));
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
const VARIABLE_NAMES = ALPHABET.repeat(3)
    .split("")
    .map((c, i) => `${c}${["", "ʹ", "ʺ"][Math.floor(i / ALPHABET.length)]}`);
const UNICODE_MACRON_DIACRITIC = "\u0304";
function variableFor(i, invert) {
    return invert ? VARIABLE_NAMES[i].replace(/^(\w)/, "$1" + UNICODE_MACRON_DIACRITIC) : VARIABLE_NAMES[i];
}
function fromVariable(v) {
    return VARIABLE_NAMES.indexOf(v.replace(UNICODE_MACRON_DIACRITIC, ""));
}
function invertVariable(v) {
    return v.replace(/^(\w)/, "$1" + UNICODE_MACRON_DIACRITIC);
}
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
/* harmony import */ var _algebra_stringify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./algebra/stringify */ "./src/cad/algebra/stringify.ts");
/* harmony import */ var _algebra_substitute__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algebra/substitute */ "./src/cad/algebra/substitute.ts");


try {
    const table = await new Promise((resolve, reject) => {
        self.onmessage = (e) => resolve(e.data);
        self.onerror = (e) => reject(e);
    });
    self.postMessage({
        code: "GENERATION",
        message: "Received:\n" + table.map((row) => row.map((col) => col.map(Number).join(" ")).join(" | ")).join("\n"),
    });
    self.postMessage({
        code: "GENERATION",
        message: "Expressions:\n" +
            (0,_algebra_stringify__WEBPACK_IMPORTED_MODULE_0__.stringify)(table)
                .map((row, i) => `output ${i + 1}: ${row}`)
                .join("\n"),
    });
    self.postMessage({
        code: "GENERATION",
        message: "Tests:\n" +
            table
                .map(([input]) => `input ${input.map(Number).join(" ")}: ` +
                (0,_algebra_substitute__WEBPACK_IMPORTED_MODULE_1__.substitute)((0,_algebra_stringify__WEBPACK_IMPORTED_MODULE_0__.stringify)(table), input).map(Number).join(" "))
                .join("\n"),
    });
}
catch (e) {
    self.postMessage({ code: "ERROR", error: e });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFHO1dBQ0g7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBLEVBQUU7V0FDRjtXQUNBOzs7OztXQ2hFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9jYWQvYWxnZWJyYS9zdHJpbmdpZnkudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NhZC9hbGdlYnJhL3N1YnN0aXR1dGUudHMiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL2NhZC9hbGdlYnJhL3ZhcmlhYmxlcy50cyIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvY2FkL2VtcGxveWVlLnRzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL2FzeW5jIG1vZHVsZSIsIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVTklDT0RFX01BQ1JPTl9ESUFDUklUSUMsIHZhcmlhYmxlRm9yLCBWQVJJQUJMRV9OQU1FUyB9IGZyb20gXCIuL3ZhcmlhYmxlc1wiO1xuXG5mdW5jdGlvbiBleHByZXNzaW9uKGlucHV0OiBib29sZWFuW10sIHR5cGU6IFwiUFJPRFVDVF9PRl9TVU1TXCIgfCBcIlNVTV9PRl9QUk9EVUNUU1wiKSB7XG4gICAgaWYgKHR5cGUgPT09IFwiUFJPRFVDVF9PRl9TVU1TXCIpIHJldHVybiBpbnB1dC5tYXAoKF8sIGkpID0+IHZhcmlhYmxlRm9yKGksIF8pKS5qb2luKFwiK1wiKTtcblxuICAgIGlmICh0eXBlID09PSBcIlNVTV9PRl9QUk9EVUNUU1wiKSByZXR1cm4gaW5wdXQubWFwKChfLCBpKSA9PiB2YXJpYWJsZUZvcihpLCAhXykpLmpvaW4oXCJcIik7XG5cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBVbmtub3duIHR5cGUgJyR7dHlwZX0nLmApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5KHRhYmxlOiBib29sZWFuW11bXVtdKSB7XG4gICAgaWYgKHRhYmxlLnNvbWUoKFtpbnB1dHNdKSA9PiBpbnB1dHMubGVuZ3RoID4gVkFSSUFCTEVfTkFNRVMubGVuZ3RoKSlcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYFRhYmxlIGNvbnRhaW5zIG1vcmUgdGhhbiAke1ZBUklBQkxFX05BTUVTLmxlbmd0aH0gaW5wdXRzLmApO1xuXG4gICAgY29uc3Qgb3V0cHV0cyA9IHRhYmxlLm1hcCgoWywgb3V0cHV0c10pID0+IG91dHB1dHMpO1xuICAgIGNvbnN0IHRyYW5zcG9zZWQgPSBvdXRwdXRzWzBdLm1hcCgoXywgY29sKSA9PiBvdXRwdXRzLm1hcCgocm93KSA9PiByb3dbY29sXSkpO1xuXG4gICAgcmV0dXJuIHRyYW5zcG9zZWQubWFwKChvdXQsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChvdXQuZXZlcnkoQm9vbGVhbikpIHJldHVybiBgKGErYSR7VU5JQ09ERV9NQUNST05fRElBQ1JJVElDfSlgO1xuICAgICAgICBpZiAoIW91dC5zb21lKEJvb2xlYW4pKSByZXR1cm4gYGFhJHtVTklDT0RFX01BQ1JPTl9ESUFDUklUSUN9YDtcblxuICAgICAgICBjb25zdCB0eXBlID0gb3V0LmZpbHRlcihCb29sZWFuKS5sZW5ndGggPiBvdXQubGVuZ3RoIC8gMiA/IFwiUFJPRFVDVF9PRl9TVU1TXCIgOiBcIlNVTV9PRl9QUk9EVUNUU1wiO1xuXG4gICAgICAgIGlmICh0eXBlID09PSBcIlBST0RVQ1RfT0ZfU1VNU1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIFwiKFwiICtcbiAgICAgICAgICAgICAgICB0YWJsZVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChbLCBvdXRwdXRzXSkgPT4gb3V0cHV0c1tpbmRleF0gPT09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAubWFwKChbaW5wdXRzXSkgPT4gZXhwcmVzc2lvbihpbnB1dHMsIHR5cGUpKVxuICAgICAgICAgICAgICAgICAgICAuam9pbihcIikoXCIpICtcbiAgICAgICAgICAgICAgICBcIilcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlID09PSBcIlNVTV9PRl9QUk9EVUNUU1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFibGVcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChbLCBvdXRwdXRzXSkgPT4gb3V0cHV0c1tpbmRleF0gPT09IHRydWUpXG4gICAgICAgICAgICAgICAgLm1hcCgoW2lucHV0c10pID0+IGV4cHJlc3Npb24oaW5wdXRzLCB0eXBlKSlcbiAgICAgICAgICAgICAgICAuam9pbihcIitcIik7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IGZyb21WYXJpYWJsZSwgaXNJbnZlcnNpb24gfSBmcm9tIFwiLi92YXJpYWJsZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnN0aXR1dGUoZXhwcnM6IHN0cmluZ1tdLCB1c2luZzogYm9vbGVhbltdKSB7XG4gICAgcmV0dXJuIGV4cHJzLm1hcCgoZXhwcikgPT5cbiAgICAgICAgZXhwci5zdGFydHNXaXRoKFwiKFwiKSAmJiBleHByLmVuZHNXaXRoKFwiKVwiKVxuICAgICAgICAgICAgPyBleHByXG4gICAgICAgICAgICAgICAgICAuc2xpY2UoMSwgLTEpXG4gICAgICAgICAgICAgICAgICAuc3BsaXQoXCIpKFwiKVxuICAgICAgICAgICAgICAgICAgLm1hcCgobykgPT5cbiAgICAgICAgICAgICAgICAgICAgICBvXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIitcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgodikgPT4gKGlzSW52ZXJzaW9uKHYpID8gIXVzaW5nW2Zyb21WYXJpYWJsZSh2KV0gOiB1c2luZ1tmcm9tVmFyaWFibGUodildKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvbWUoQm9vbGVhbiksXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAuZXZlcnkoQm9vbGVhbilcbiAgICAgICAgICAgIDogZXhwclxuICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiK1wiKVxuICAgICAgICAgICAgICAgICAgLm1hcCgobykgPT5cbiAgICAgICAgICAgICAgICAgICAgICBvXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdCgvKD89XFx3KS8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHYpID0+IChpc0ludmVyc2lvbih2KSA/ICF1c2luZ1tmcm9tVmFyaWFibGUodildIDogdXNpbmdbZnJvbVZhcmlhYmxlKHYpXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5ldmVyeShCb29sZWFuKSxcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIC5zb21lKEJvb2xlYW4pLFxuICAgICk7XG59XG4iLCJleHBvcnQgY29uc3QgQUxQSEFCRVQgPSBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCI7XG5leHBvcnQgY29uc3QgVkFSSUFCTEVfTkFNRVMgPSBBTFBIQUJFVC5yZXBlYXQoMylcbiAgICAuc3BsaXQoXCJcIilcbiAgICAubWFwKChjLCBpKSA9PiBgJHtjfSR7W1wiXCIsIFwiyrlcIiwgXCLKulwiXVtNYXRoLmZsb29yKGkgLyBBTFBIQUJFVC5sZW5ndGgpXX1gKTtcbmV4cG9ydCBjb25zdCBVTklDT0RFX01BQ1JPTl9ESUFDUklUSUMgPSBcIlxcdTAzMDRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHZhcmlhYmxlRm9yKGk6IG51bWJlciwgaW52ZXJ0OiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGludmVydCA/IFZBUklBQkxFX05BTUVTW2ldLnJlcGxhY2UoL14oXFx3KS8sIFwiJDFcIiArIFVOSUNPREVfTUFDUk9OX0RJQUNSSVRJQykgOiBWQVJJQUJMRV9OQU1FU1tpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21WYXJpYWJsZSh2OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gVkFSSUFCTEVfTkFNRVMuaW5kZXhPZih2LnJlcGxhY2UoVU5JQ09ERV9NQUNST05fRElBQ1JJVElDLCBcIlwiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnRWYXJpYWJsZSh2OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdi5yZXBsYWNlKC9eKFxcdykvLCBcIiQxXCIgKyBVTklDT0RFX01BQ1JPTl9ESUFDUklUSUMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbnZlcnNpb24odjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHYuaW5jbHVkZXMoVU5JQ09ERV9NQUNST05fRElBQ1JJVElDKTtcbn1cbiIsImltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gXCIuL2FsZ2VicmEvc3RyaW5naWZ5XCI7XG5pbXBvcnQgeyBzdWJzdGl0dXRlIH0gZnJvbSBcIi4vYWxnZWJyYS9zdWJzdGl0dXRlXCI7XG5cbnRyeSB7XG4gICAgY29uc3QgdGFibGUgPSBhd2FpdCBuZXcgUHJvbWlzZTxib29sZWFuW11bXVtdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHNlbGYub25tZXNzYWdlID0gKGUpID0+IHJlc29sdmUoZS5kYXRhKTtcblxuICAgICAgICBzZWxmLm9uZXJyb3IgPSAoZSkgPT4gcmVqZWN0KGUpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvZGU6IFwiR0VORVJBVElPTlwiLFxuICAgICAgICBtZXNzYWdlOiBcIlJlY2VpdmVkOlxcblwiICsgdGFibGUubWFwKChyb3cpID0+IHJvdy5tYXAoKGNvbCkgPT4gY29sLm1hcChOdW1iZXIpLmpvaW4oXCIgXCIpKS5qb2luKFwiIHwgXCIpKS5qb2luKFwiXFxuXCIpLFxuICAgIH0pO1xuXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvZGU6IFwiR0VORVJBVElPTlwiLFxuICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgXCJFeHByZXNzaW9uczpcXG5cIiArXG4gICAgICAgICAgICBzdHJpbmdpZnkodGFibGUpXG4gICAgICAgICAgICAgICAgLm1hcCgocm93LCBpKSA9PiBgb3V0cHV0ICR7aSArIDF9OiAke3Jvd31gKVxuICAgICAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpLFxuICAgIH0pO1xuXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGNvZGU6IFwiR0VORVJBVElPTlwiLFxuICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgXCJUZXN0czpcXG5cIiArXG4gICAgICAgICAgICB0YWJsZVxuICAgICAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChbaW5wdXRdKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgYGlucHV0ICR7aW5wdXQubWFwKE51bWJlcikuam9pbihcIiBcIil9OiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnN0aXR1dGUoc3RyaW5naWZ5KHRhYmxlKSwgaW5wdXQpLm1hcChOdW1iZXIpLmpvaW4oXCIgXCIpLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuam9pbihcIlxcblwiKSxcbiAgICB9KTtcbn0gY2F0Y2ggKGUpIHtcbiAgICBzZWxmLnBvc3RNZXNzYWdlKHsgY29kZTogXCJFUlJPUlwiLCBlcnJvcjogZSB9KTtcbn1cblxuZXhwb3J0IHt9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciB3ZWJwYWNrUXVldWVzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBxdWV1ZXNcIikgOiBcIl9fd2VicGFja19xdWV1ZXNfX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgd2VicGFja0Vycm9yID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKSA6IFwiX193ZWJwYWNrX2Vycm9yX19cIjtcbnZhciByZXNvbHZlUXVldWUgPSAocXVldWUpID0+IHtcblx0aWYocXVldWUgJiYgIXF1ZXVlLmQpIHtcblx0XHRxdWV1ZS5kID0gMTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSkpO1xuXHRcdHF1ZXVlLmZvckVhY2goKGZuKSA9PiAoZm4uci0tID8gZm4ucisrIDogZm4oKSkpO1xuXHR9XG59XG52YXIgd3JhcERlcHMgPSAoZGVwcykgPT4gKGRlcHMubWFwKChkZXApID0+IHtcblx0aWYoZGVwICE9PSBudWxsICYmIHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZihkZXBbd2VicGFja1F1ZXVlc10pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0cXVldWUuZCA9IDA7XG5cdFx0XHRkZXAudGhlbigocikgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0V4cG9ydHNdID0gcjtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0sIChlKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXJyb3JdID0gZTtcblx0XHRcdFx0cmVzb2x2ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdH0pO1xuXHRcdFx0dmFyIG9iaiA9IHt9O1xuXHRcdFx0b2JqW3dlYnBhY2tRdWV1ZXNdID0gKGZuKSA9PiAoZm4ocXVldWUpKTtcblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fVxuXHR9XG5cdHZhciByZXQgPSB7fTtcblx0cmV0W3dlYnBhY2tRdWV1ZXNdID0geCA9PiB7fTtcblx0cmV0W3dlYnBhY2tFeHBvcnRzXSA9IGRlcDtcblx0cmV0dXJuIHJldDtcbn0pKTtcbl9fd2VicGFja19yZXF1aXJlX18uYSA9IChtb2R1bGUsIGJvZHksIGhhc0F3YWl0KSA9PiB7XG5cdHZhciBxdWV1ZTtcblx0aGFzQXdhaXQgJiYgKChxdWV1ZSA9IFtdKS5kID0gMSk7XG5cdHZhciBkZXBRdWV1ZXMgPSBuZXcgU2V0KCk7XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG5cdFx0cmVqZWN0ID0gcmVqO1xuXHRcdG91dGVyUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1F1ZXVlc10gPSAoZm4pID0+IChxdWV1ZSAmJiBmbihxdWV1ZSksIGRlcFF1ZXVlcy5mb3JFYWNoKGZuKSwgcHJvbWlzZVtcImNhdGNoXCJdKHggPT4ge30pKTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdGZuID0gKCkgPT4gKHJlc29sdmUoZ2V0UmVzdWx0KSk7XG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHZhciBmblF1ZXVlID0gKHEpID0+IChxICE9PSBxdWV1ZSAmJiAhZGVwUXVldWVzLmhhcyhxKSAmJiAoZGVwUXVldWVzLmFkZChxKSwgcSAmJiAhcS5kICYmIChmbi5yKyssIHEucHVzaChmbikpKSk7XG5cdFx0XHRjdXJyZW50RGVwcy5tYXAoKGRlcCkgPT4gKGRlcFt3ZWJwYWNrUXVldWVzXShmblF1ZXVlKSkpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IGdldFJlc3VsdCgpO1xuXHR9LCAoZXJyKSA9PiAoKGVyciA/IHJlamVjdChwcm9taXNlW3dlYnBhY2tFcnJvcl0gPSBlcnIpIDogb3V0ZXJSZXNvbHZlKGV4cG9ydHMpKSwgcmVzb2x2ZVF1ZXVlKHF1ZXVlKSkpO1xuXHRxdWV1ZSAmJiAocXVldWUuZCA9IDApO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NhZC9lbXBsb3llZS50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==