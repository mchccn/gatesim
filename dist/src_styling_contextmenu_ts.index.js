"use strict";
(self["webpackChunk_kelsny_gatesim"] = self["webpackChunk_kelsny_gatesim"] || []).push([["src_styling_contextmenu_ts"],{

/***/ "./src/styling/contextmenu.ts":
/*!************************************!*\
  !*** ./src/styling/contextmenu.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/* css */`
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


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3N0eWxpbmdfY29udGV4dG1lbnVfdHMuaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLDBFQUF5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0EwRXhCLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvc3R5bGluZy9jb250ZXh0bWVudS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCAvKiBjc3MgKi8gYFxuLmNvbnRleHRtZW51IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG5cbiAgICB6LWluZGV4OiAxMDA7XG5cbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgICB3aWR0aDogMjAwcHg7XG5cbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZGVkZWRlO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcblxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XG5cbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgIGJveC1zaGFkb3c6IDFweCAxcHggNHB4ICNkZWRlZGU7XG59XG5cbi5jb250ZXh0bWVudSA+IC5iciB7XG4gICAgZGlzcGxheTogYmxvY2s7XG5cbiAgICB3aWR0aDogMTAwJTtcblxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGVkZWRlO1xufVxuXG4uY29udGV4dG1lbnUgPiBidXR0b24ge1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG5cbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcblxuICAgIGJvcmRlcjogbm9uZTtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgICBwYWRkaW5nOiA4cHggOHB4O1xuXG4gICAgY29sb3I6ICM5OTk5OTk7XG59XG5cbi5jb250ZXh0bWVudSA+IGJ1dHRvbjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgY29sb3I6ICMzMzMzMzM7XG5cbiAgICBiYWNrZ3JvdW5kOiAjZjBmMGYwO1xufVxuXG4ubWVudS1rZXliaW5kIHtcbiAgICBjb2xvcjogI2RkZGRkZDtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgIGdhcDogMnB4O1xufVxuXG4ubWVudS1rZXliaW5kID4gc3BhbiB7XG4gICAgZGlzcGxheTogZ3JpZDtcblxuICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICBtaW4taGVpZ2h0OiAyMHB4O1xuICAgIG1pbi13aWR0aDogMTRweDtcbn1cblxuLmNvbnRleHRtZW51ID4gYnV0dG9uOmhvdmVyID4gLm1lbnUta2V5YmluZCB7XG4gICAgY29sb3I6ICNiYmJiYmI7XG59XG5gO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9