import { ModalManager } from "./managers/ModalManager";

declare global {
    interface Navigator {
        userAgentData?: { platform: string };
    }
}

export const INPUT_COMPONENT_CSS_SIZE = 24;
export const OUTPUT_COMPONENT_CSS_SIZE = 24;
export const CHIP_COMPONENT_CSS_WIDTH = 120;
export const CHIP_COMPONENT_CSS_HEIGHT = 40;
export const CHIP_INPUT_CSS_SIZE = 16;
export const CHIP_OUTPUT_CSS_SIZE = 16;
export const ORIGIN_POINT = Object.freeze({ x: 0, y: 0 });
export const IN_DEBUG_MODE = !!new URL(location.href).searchParams.has("debug");
export const IS_MAC_OS = [navigator.userAgentData?.platform, navigator.platform].some(
    (platform) => platform?.toLowerCase().includes("mac") ?? false,
);

export const LOCKED_FOR_TESTING = () =>
    ModalManager.alert("The diagram is currently locked for testing. No changes can be made.");

export const DELAY = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

export const GET_CANVAS_CTX = () => document.querySelector("canvas")!.getContext("2d")!;

export const COUNTER_GENERATOR = function* (i = 0) {
    while (true) yield i++;
};

export const SCUFFED_UUID = () =>
    Date.now().toString(36) + Number(Date.now().toString().split("").reverse().join("")).toString(36);

export const ROUND_TO_NEAREST = (x: number, n: number) => Math.round(x / n) * n;

export const ACTIVATED_CSS_COLOR = "#ff2626";
export const LIGHT_GRAY_CSS_COLOR = "#dedede";
export const EVEN_LIGHTER_GRAY_CSS_COLOR = "#efefef";
export const TOAST_DURATION = 2500;
export const GRID_SIZE = 15;
