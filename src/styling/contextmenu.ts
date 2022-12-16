import { LIGHT_GRAY_CSS_COLOR } from "../constants";
import { css } from "../reified/Reified";

export default css`
    .tools-menu,
    .contextmenu {
        position: absolute;

        z-index: 100;

        display: flex;
        flex-direction: column;

        width: 200px;

        border: 1px solid ${LIGHT_GRAY_CSS_COLOR};
        border-radius: 4px;

        background-color: #fefefe;

        user-select: none;

        box-shadow: 1px 1px 4px ${LIGHT_GRAY_CSS_COLOR};
    }

    .tools-menu {
        left: 16px;
        bottom: 172px;

        box-shadow: none;
    }

    .tools-menu > .br,
    .contextmenu > .br {
        display: block;

        width: 100%;

        border-bottom: 1px solid ${LIGHT_GRAY_CSS_COLOR};
    }

    .tools-menu > button,
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

    .tools-menu > button:hover,
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

    .tools-menu > button:hover > .menu-keybind,
    .contextmenu > button:hover > .menu-keybind {
        color: #bbbbbb;
    }
`;
