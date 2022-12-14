import { DarkmodeManager } from "./managers/DarkmodeManager";
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
export const IN_DEBUG_MODE = new URL(location.href).searchParams.has("debug");
export const NO_RENDERING = new URL(location.href).searchParams.has("norender");
export const IS_MAC_OS = [navigator.userAgentData?.platform, navigator.platform].some(
    (platform) => platform?.toLowerCase().includes("mac") ?? false,
);

export const LOCKED_FOR_TESTING = () =>
    ModalManager.alert("The diagram is currently locked for testing. No changes can be made.");

export const DELAY = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay));

export const GET_BACKGROUND_CANVAS_CTX = () =>
    document.querySelector<HTMLCanvasElement>("canvas.background-canvas")!.getContext("2d")!;

export const GET_FOREGROUND_CANVAS_CTX = () =>
    document.querySelector<HTMLCanvasElement>("canvas.foreground-canvas")!.getContext("2d")!;

export const COUNTER_GENERATOR = function* (i = 0) {
    while (true) yield i++;
};

export const SCUFFED_UUID = () =>
    Date.now().toString(36) + Number(Date.now().toString().split("").reverse().join("")).toString(36);

export const ROUND_TO_NEAREST = (x: number, n: number) => Math.round(x / n) * n;

export const GET_ACTIVATED_COLOR = () => (DarkmodeManager.enabled ? DARK_ACTIVATED_CSS_COLOR : ACTIVATED_CSS_COLOR);
export const GET_GRAY_COLOR = () =>
    DarkmodeManager.enabled ? ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR : LIGHT_GRAY_CSS_COLOR;

export const ACTIVATED_CSS_COLOR = "#ff2626";
export const DARK_ACTIVATED_CSS_COLOR = "#dd1111";
export const EVEN_DARKER_GRAY_CSS_COLOR = "#0a0a0c";
export const SLIGHTLY_DARKER_GRAY_CSS_COLOR = "#101012";
export const DARKER_GRAY_CSS_COLOR = "#16161f";
export const DARK_GRAY_CSS_COLOR = "#1c1c24";
export const KINDA_DARK_GRAY_CSS_COLOR = "#24242e";
export const NOT_REALLY_DARK_GRAY_CSS_COLOR = "#2e2e3f";
export const ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR = "#3c3c4f";
export const SUPER_GRAY_CSS_COLOR = "#bbbbbb";
export const KINDA_LIGHT_GRAY_CSS_COLOR = "#cdcdcd";
export const LIGHT_GRAY_CSS_COLOR = "#dedede";
export const LIGHTER_GRAY_CSS_COLOR = "#eaeaea";
export const EVEN_LIGHTER_GRAY_CSS_COLOR = "#efefef";
export const TOAST_DURATION = 2500;
export const GRID_SIZE = 15;
export const QUICKPICK_SIZE = 75;

export const IS_CAD_APP = new URL(location.href).searchParams.has("cad");
