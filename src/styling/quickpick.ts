import { LIGHT_GRAY_CSS_COLOR } from "../constants";
import { css } from "../reified/Reified";

export default css`
    .quickpick-item {
        position: absolute;

        animation: forwards ease 0.2s fade-in;

        user-select: none;
    }

    .quickpick-circle {
        position: absolute;

        border: 1px solid ${LIGHT_GRAY_CSS_COLOR};
        border-radius: 50%;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
`;
