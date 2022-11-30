import { ModalManager } from "./managers/ModalManager";

declare global {
    interface Navigator {
        userAgentData: { platform: string };
    }
}

export const INPUT_COMPONENT_CSS_SIZE = 24;
export const OUTPUT_COMPONENT_CSS_SIZE = 24;
export const CHIP_COMPONENT_CSS_WIDTH = 120;
export const CHIP_COMPONENT_CSS_HEIGHT = 40;
export const CHIP_INPUT_CSS_SIZE = 16;
export const CHIP_OUTPUT_CSS_SIZE = 16;
export const ORIGIN_POINT = Object.freeze({ x: 0, y: 0 });
export const ACTIVATED_CSS_COLOR = "#ff2626";
export const LIGHT_GRAY_CSS_COLOR = "#dedede";
export const IN_DEBUG_MODE = !!new URL(location.href).searchParams.has("debug");
export const IS_MAC_OS = [navigator.userAgentData.platform, navigator.platform].some((platform) =>
    platform.toLowerCase().includes("mac"),
);
export const LOCKED_FOR_TESTING = () =>
    ModalManager.alert("The diagram is currently locked for testing. No changes can be made.");
export const DELAY = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
