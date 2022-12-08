"use strict";
(self["webpackChunk_kelsny_gatesim"] = self["webpackChunk_kelsny_gatesim"] || []).push([["src_styling_buttons_ts"],{

/***/ "./src/styling/buttons.ts":
/*!********************************!*\
  !*** ./src/styling/buttons.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/* css */`
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
    background-color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.LIGHT_GRAY_CSS_COLOR};
}

button.undo {
    color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.KINDA_GRAY_CSS_COLOR};
    left: 64px;
    bottom: 24px;
    position: absolute;
    font-size: 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    user-select: none;
}

button.redo {
    color: ${_constants__WEBPACK_IMPORTED_MODULE_0__.KINDA_GRAY_CSS_COLOR};
    left: 122px;
    bottom: 24px;
    position: absolute;
    font-size: 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    user-select: none;
}
`);


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3N0eWxpbmdfYnV0dG9uc190cy5pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUF1RztBQUV2RywwRUFBeUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBbUJELG1FQUEyQjs7Ozs7O3dCQU0zQiw0REFBb0I7Ozs7YUFJL0IsNERBQW9COzs7Ozs7Ozs7Ozs7YUFZcEIsNERBQW9COzs7Ozs7Ozs7O0NBVWhDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvc3R5bGluZy9idXR0b25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVWRU5fTElHSFRFUl9HUkFZX0NTU19DT0xPUiwgS0lOREFfR1JBWV9DU1NfQ09MT1IsIExJR0hUX0dSQVlfQ1NTX0NPTE9SIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgZGVmYXVsdCAvKiBjc3MgKi8gYFxuYnV0dG9uLmRhcmttb2RlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgXG4gICAgbGVmdDogMTZweDtcbiAgICBib3R0b206IDE2cHg7XG4gICAgXG4gICAgd2lkdGg6IDQwcHg7XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIFxuICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICBcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIFxuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgIGJhY2tncm91bmQtY29sb3I6ICR7RVZFTl9MSUdIVEVSX0dSQVlfQ1NTX0NPTE9SfTtcblxuICAgIHRyYW5zaXRpb246IDAuMXMgZWFzZSBiYWNrZ3JvdW5kLWNvbG9yO1xufVxuXG5idXR0b24uZGFya21vZGU6aG92ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7TElHSFRfR1JBWV9DU1NfQ09MT1J9O1xufVxuXG5idXR0b24udW5kbyB7XG4gICAgY29sb3I6ICR7S0lOREFfR1JBWV9DU1NfQ09MT1J9O1xuICAgIGxlZnQ6IDY0cHg7XG4gICAgYm90dG9tOiAyNHB4O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbn1cblxuYnV0dG9uLnJlZG8ge1xuICAgIGNvbG9yOiAke0tJTkRBX0dSQVlfQ1NTX0NPTE9SfTtcbiAgICBsZWZ0OiAxMjJweDtcbiAgICBib3R0b206IDI0cHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xufVxuYDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==