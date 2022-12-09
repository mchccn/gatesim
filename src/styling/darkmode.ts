import {
    DARKER_GRAY_CSS_COLOR,
    DARK_GRAY_CSS_COLOR,
    NOT_REALLY_DARK_GRAY_CSS_COLOR,
    ONLY_A_HINT_OF_DARK_GRAY_CSS_COLOR,
} from "../constants";
import { css } from "../reified/Reified";

export default css`
    body.darkmode {
        background-color: #010102;
    }

    body.darkmode button.darkmode {
        background-color: ${DARKER_GRAY_CSS_COLOR};
    }

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
`;
