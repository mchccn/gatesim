"use strict";
(self["webpackChunk_kelsny_gatesim"] = self["webpackChunk_kelsny_gatesim"] || []).push([["src_styling_component_ts"],{

/***/ "./src/styling/component.ts":
/*!**********************************!*\
  !*** ./src/styling/component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/* css */`
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

.component-input-button.activated {
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


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3N0eWxpbmdfY29tcG9uZW50X3RzLmluZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSwwRUFBeUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E4RnhCLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Aa2Vsc255L2dhdGVzaW0vLi9zcmMvc3R5bGluZy9jb21wb25lbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgLyogY3NzICovIGBcbi5kaXNwbGF5LFxuLmNvbXBvbmVudCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuXG4gICAgei1pbmRleDogMTA7XG5cbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA2cHggYXV0byA2cHg7XG5cbiAgICBoZWlnaHQ6IGZpdC1jb250ZW50O1xuICAgIHdpZHRoOiBmaXQtY29udGVudDtcblxuICAgIG1pbi1oZWlnaHQ6IDQwcHg7XG4gICAgbWluLXdpZHRoOiAxMDBweDtcblxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2RlZGVkZTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5kaXNwbGF5OmhvdmVyLFxuLmNvbXBvbmVudDpob3ZlciB7XG4gICAgY3Vyc29yOiBncmFiO1xufVxuXG4uY29tcG9uZW50LWlucHV0cyxcbi5jb21wb25lbnQtb3V0cHV0cyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuXG4gICAgaGVpZ2h0OiAxMDAlO1xuXG4gICAgZ2FwOiA0cHg7XG59XG5cbi5jb21wb25lbnQtaW5wdXQtYnV0dG9uLFxuLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICBmb250LWZhbWlseTogc2VyaWY7XG4gICAgZm9udC13ZWlnaHQ6IDkwMDtcbiAgICBmb250LXNpemU6IDEycHg7XG5cbiAgICBjb2xvcjogI2NjY2NjYztcblxuICAgIGhlaWdodDogMTZweDtcbiAgICB3aWR0aDogMTZweDtcblxuICAgIHBhZGRpbmc6IDA7XG5cbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZWRlZGU7XG59XG5cbi5jb21wb25lbnQtaW5wdXQtYnV0dG9uIHtcbiAgICBtYXJnaW4tbGVmdDogLTZweDtcblxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbn1cblxuLmNvbXBvbmVudC1vdXRwdXQtYnV0dG9uIHtcbiAgICBtYXJnaW4tcmlnaHQ6IC02cHg7XG5cbiAgICBib3JkZXItcmFkaXVzOiAycHg7XG59XG5cbi5jb21wb25lbnQtaW5wdXQtYnV0dG9uLmFjdGl2YXRlZCB7XG4gICAgY29sb3I6ICNmZjc3Nzc7XG59XG5cbi5kaXNwbGF5LWNvbnRlbnQsXG4uY29tcG9uZW50LW5hbWUge1xuICAgIGhlaWdodDogMTAwJTtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcblxuICAgIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG5cbiAgICBwYWRkaW5nOiAwIDhweDtcblxuICAgIGNvbG9yOiAjMzMzMzMzO1xuXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG59XG5gO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9