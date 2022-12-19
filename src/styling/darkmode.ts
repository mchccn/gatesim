import {
    DARKER_GRAY_CSS_COLOR,
    DARK_ACTIVATED_CSS_COLOR,
    DARK_GRAY_CSS_COLOR,
    EVEN_DARKER_GRAY_CSS_COLOR,
    KINDA_DARK_GRAY_CSS_COLOR,
    KINDA_LIGHT_GRAY_CSS_COLOR,
    LIGHTER_GRAY_CSS_COLOR,
    LIGHT_GRAY_CSS_COLOR,
    MID_GRAY_CSS_COLOR,
    NOT_REALLY_DARK_GRAY_CSS_COLOR,
    ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR,
    SLIGHTLY_DARKER_GRAY_CSS_COLOR,
} from "../constants";
import { css } from "../reified/Reified";

export default css`
    body.darkmode {
        background-color: #010102;
    }

    body.darkmode button.tools,
    body.darkmode button.settings,
    body.darkmode button.darkmode {
        background-color: ${DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode button.tools:hover,
    body.darkmode button.settings:hover,
    body.darkmode button.darkmode:hover {
        background-color: ${DARK_GRAY_CSS_COLOR};
    }

    body.darkmode button.undo,
    body.darkmode button.redo {
        color: ${NOT_REALLY_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode button.undo:hover,
    body.darkmode button.redo:hover {
        color: ${ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode .board-input,
    body.darkmode .board-output {
        color: ${LIGHTER_GRAY_CSS_COLOR};

        border: 1px solid ${NOT_REALLY_DARK_GRAY_CSS_COLOR};

        background-color: ${KINDA_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode .activated {
        background-color: ${DARK_ACTIVATED_CSS_COLOR};
    }

    body.darkmode .component-input-button.activated,
    body.darkmode .component-output-button.activated {
        color: #ff9999;

        background-color: ${DARK_ACTIVATED_CSS_COLOR};
    }

    body.darkmode .component-input-button,
    body.darkmode .component-output-button {
        color: ${NOT_REALLY_DARK_GRAY_CSS_COLOR};

        border: 1px solid ${DARKER_GRAY_CSS_COLOR};

        background-color: ${SLIGHTLY_DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .display,
    body.darkmode .component {
        border: 1px solid ${EVEN_DARKER_GRAY_CSS_COLOR};

        background-color: ${SLIGHTLY_DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .display-content,
    body.darkmode .component-name {
        font-weight: 100;

        color: ${KINDA_LIGHT_GRAY_CSS_COLOR};
    }

    body.darkmode .tools-menu,
    body.darkmode .contextmenu {
        border: 1px solid ${DARKER_GRAY_CSS_COLOR};

        background-color: ${EVEN_DARKER_GRAY_CSS_COLOR};

        box-shadow: 1px 1px 4px ${EVEN_DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .tools-menu > .br,
    body.darkmode .contextmenu > .br {
        border-bottom: 1px solid ${DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .tools-menu > button,
    body.darkmode .contextmenu > button {
        font-weight: 100;
        color: ${MID_GRAY_CSS_COLOR};
    }

    body.darkmode .tools-menu > button:hover,
    body.darkmode .contextmenu > button:hover {
        color: ${LIGHT_GRAY_CSS_COLOR};

        background-color: ${DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .menu-keybind {
        color: ${KINDA_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode .tools-menu > button:hover > .menu-keybind,
    body.darkmode .contextmenu > button:hover > .menu-keybind {
        color: ${ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode .toast {
        color: ${LIGHT_GRAY_CSS_COLOR};

        border: 1px solid ${DARKER_GRAY_CSS_COLOR};

        background-color: ${SLIGHTLY_DARKER_GRAY_CSS_COLOR};

        box-shadow: 1px 1px 4px ${EVEN_DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode .close-toast {
        color: ${KINDA_LIGHT_GRAY_CSS_COLOR};
    }

    body.darkmode .quickpick-item {
        color: ${KINDA_LIGHT_GRAY_CSS_COLOR};
    }

    body.darkmode.darkmode-modals .modal {
        color: ${LIGHT_GRAY_CSS_COLOR};

        background-color: ${EVEN_DARKER_GRAY_CSS_COLOR};

        border: 1px solid ${DARKER_GRAY_CSS_COLOR};

        box-shadow: 1px 1px 4px ${EVEN_DARKER_GRAY_CSS_COLOR};
    }

    body.darkmode.darkmode-modals .modal-cancel {
        background: transparent;

        color: ${LIGHT_GRAY_CSS_COLOR};

        border: 1px solid ${DARK_GRAY_CSS_COLOR};
    }

    body.darkmode.darkmode-modals .modal-cancel:hover {
        color: ${LIGHTER_GRAY_CSS_COLOR};

        border: 1px solid ${ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR};
    }

    body.darkmode.darkmode-modals .modal-ok {
        background-color: #0066ee;

        outline: 1px solid #0066ee;
    }

    body.darkmode.darkmode-modals .modal-ok:hover {
        background-color: #0077ff;

        outline: 1px solid #0077ff;
    }

    .modal-input {
        border: 1px solid ${DARK_GRAY_CSS_COLOR};
    }
`;
