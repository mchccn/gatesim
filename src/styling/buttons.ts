import {
    EVEN_LIGHTER_GRAY_CSS_COLOR,
    KINDA_LIGHT_GRAY_CSS_COLOR,
    LIGHTER_GRAY_CSS_COLOR,
    SUPER_GRAY_CSS_COLOR,
} from "../constants";
import { css } from "../reified/Reified";

export default css`
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

        background-color: ${EVEN_LIGHTER_GRAY_CSS_COLOR};

        transition: 0.1s ease background-color;
    }

    button.darkmode:hover {
        background-color: ${LIGHTER_GRAY_CSS_COLOR};
    }

    button.undo {
        left: 64px;
    }

    button.redo {
        left: 122px;
    }

    button.undo,
    button.redo {
        color: ${KINDA_LIGHT_GRAY_CSS_COLOR};

        bottom: 24px;

        position: absolute;

        font-size: 16px;

        border: none;

        background: transparent;

        cursor: pointer;

        user-select: none;

        transition: 0.1s ease color;
    }

    button.undo:hover,
    button.redo:hover {
        color: ${SUPER_GRAY_CSS_COLOR};
    }
`;
