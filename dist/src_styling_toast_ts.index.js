"use strict";
(self["webpackChunk_kelsny_gatesim"] = self["webpackChunk_kelsny_gatesim"] || []).push([["src_styling_toast_ts"],{

/***/ "./src/styling/toast.ts":
/*!******************************!*\
  !*** ./src/styling/toast.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/* css */`
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
    animation: forwards linear 0.5s toast-fade-out;

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

@keyframes toast-fade-out {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
`);


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3N0eWxpbmdfdG9hc3RfdHMuaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLDBFQUF5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTJGeEIsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0BrZWxzbnkvZ2F0ZXNpbS8uL3NyYy9zdHlsaW5nL3RvYXN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IC8qIGNzcyAqLyBgXG4udG9hc3RzLWNvbnRhaW5lciB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuXG4gICAgcGFkZGluZzogMTZweDtcblxuICAgIGdhcDogOHB4O1xuXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG5cbiAgICB6LWluZGV4OiAxMDA7XG5cbiAgICB3aWR0aDogMTAwdnc7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbn1cblxuLnRvYXN0IHtcbiAgICBhbmltYXRpb246IGZvcndhcmRzIGxpbmVhciAwLjVzIHRvYXN0LWZhZGUtb3V0O1xuXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG5cbiAgICBtaW4td2lkdGg6IDI3NXB4O1xuXG4gICAgcGFkZGluZzogMTBweCAxOHB4O1xuXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2RlZGVkZTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG5cbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVmZWZlO1xuXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICBib3gtc2hhZG93OiAxcHggMXB4IDRweCAjZGVkZWRlO1xufVxuXG4udG9hc3QtY29sb3Ige1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgIHdpZHRoOiA2cHg7XG5cbiAgICB0b3A6IDA7XG4gICAgYm90dG9tOiAwO1xuICAgIGxlZnQ6IDA7XG5cbiAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA0cHg7XG4gICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogNHB4O1xuXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcbn1cblxuLmNsb3NlLXRvYXN0IHtcbiAgICBwb2ludGVyLWV2ZW50czogYWxsO1xuXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgbWFyZ2luLXRvcDogNHB4O1xuXG4gICAgZm9udC1zaXplOiAxMHB4O1xuXG4gICAgY29sb3I6ICNhYWFhYWE7XG5cbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IDA7XG5cbiAgICBib3JkZXI6IG5vbmU7XG5cbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbn1cblxuLmNsb3NlLXRvYXN0OmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICBjb2xvcjogYmxhY2s7XG59XG5cbkBrZXlmcmFtZXMgdG9hc3QtZmFkZS1vdXQge1xuICAgIGZyb20ge1xuICAgICAgICBvcGFjaXR5OiAxO1xuICAgIH1cblxuICAgIHRvIHtcbiAgICAgICAgb3BhY2l0eTogMDtcbiAgICB9XG59XG5gO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9