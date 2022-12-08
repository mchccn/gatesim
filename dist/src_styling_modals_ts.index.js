"use strict";
(self["webpackChunk_kelsny_gatesim"] = self["webpackChunk_kelsny_gatesim"] || []).push([["src_styling_modals_ts"],{

/***/ "./src/styling/modals.ts":
/*!*******************************!*\
  !*** ./src/styling/modals.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/* css */`
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
    width: 400px;
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
`);


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3N0eWxpbmdfbW9kYWxzX3RzLmluZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSwwRUFBeUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBaUh4QixFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGtlbHNueS9nYXRlc2ltLy4vc3JjL3N0eWxpbmcvbW9kYWxzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IC8qIGNzcyAqLyBgXG4ubW9kYWwtY29udGFpbmVyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG5cbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICBib3R0b206IDA7XG4gICAgcmlnaHQ6IDA7XG5cbiAgICB6LWluZGV4OiAxMDAwO1xuXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMGFhO1xufVxuXG4ubW9kYWwtY29udGFpbmVyLm1vZGFsLWluYWN0aXZlLFxuLm1vZGFsLm1vZGFsLWluYWN0aXZlIHtcbiAgICBkaXNwbGF5OiBub25lO1xufVxuXG4ubW9kYWwge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKGNhbGMoNTB2dyAtIDUwJSksIGNhbGMoNTB2aCAtIDUwJSkpO1xufVxuXG4ubW9kYWwtY29uZmlybSxcbi5tb2RhbC1hbGVydCB7XG4gICAgd2lkdGg6IDQwMHB4O1xuICAgIG1pbi1oZWlnaHQ6IDgwcHg7XG5cbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWZlZmVmO1xuXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2RlZGVkZTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG5cbiAgICBwYWRkaW5nOiA4cHggMTBweDtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgIGJveC1zaGFkb3c6IDFweCAxcHggNHB4ICMzMzMzMzM7XG59XG5cbi5tb2RhbC1jb25maXJtID4gLmJ1dHRvbi1jb250YWluZXIsXG4ubW9kYWwtYWxlcnQgPiAuYnV0dG9uLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93LXJldmVyc2U7XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuXG4gICAgZ2FwOiA2cHg7XG59XG5cbi5tb2RhbC1tZXNzYWdlIHtcbiAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcblxuICAgIGZsZXg6IDE7XG59XG5cbi5tb2RhbC1jYW5jZWwsXG4ubW9kYWwtb2sge1xuICAgIG1pbi13aWR0aDogNTBweDtcblxuICAgIHBhZGRpbmc6IDRweCA4cHg7XG5cbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcblxuICAgIGJvcmRlcjogMDtcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XG5cbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xufVxuXG4ubW9kYWwtY2FuY2VsIHtcbiAgICBvdXRsaW5lOiAxcHggc29saWQgIzMzMzMzMztcbn1cblxuLm1vZGFsLW9rIHtcbiAgICBjb2xvcjogd2hpdGU7XG5cbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA3N2ZmO1xuXG4gICAgb3V0bGluZTogMXB4IHNvbGlkICMwMDc3ZmY7XG59XG5cbi5tb2RhbC1jYW5jZWw6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlYWVhZWE7XG59XG5cbi5tb2RhbC1vazpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwNjZlZTtcblxuICAgIG91dGxpbmU6IDFweCBzb2xpZCAjMDA2NmVlO1xufVxuXG4ubW9kYWwtaW5wdXQge1xuICAgIG1hcmdpbjogOHB4IDA7XG5cbiAgICBwYWRkaW5nOiAycHggNHB4O1xuXG4gICAgZm9udC1zaXplOiAxMnB4O1xuXG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG5cbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZGVkZWRlO1xuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbn1cbmA7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=