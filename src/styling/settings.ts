import { css } from "../reified/Reified";

export default css`
    .settings-form {
        display: flex;
        flex-direction: column;

        gap: 16px;
    }

    .settings-control {
        display: flex;
        align-items: center;

        gap: 8px;
    }

    .settings-control input[type="checkbox"] {
        height: 16px;
        width: 16px;
    }
`;
