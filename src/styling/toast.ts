import { css } from "../reified/Reified";

export default css`
    .toasts-container {
        position: absolute;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;

        padding: 16px;

        gap: 8px;

        pointer-events: none;

        z-index: 100;

        width: 100vw;
        height: 100vh;
    }

    .toast {
        animation: forwards linear 0.5s fade-out;

        position: relative;

        font-family: sans-serif;

        min-width: 275px;

        padding: 10px 18px;

        border: 1px solid #dedede;
        border-radius: 4px;

        background-color: #fefefe;

        user-select: none;

        box-shadow: 1px 1px 4px #dedede;
    }

    .toast-color {
        position: absolute;

        width: 6px;

        top: 0;
        bottom: 0;
        left: 0;

        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;

        background-color: #fefefe;
    }

    .close-toast {
        pointer-events: all;

        position: absolute;

        margin-top: 4px;

        font-size: 10px;

        color: #aaaaaa;

        top: 0;
        right: 0;

        border: none;

        background: transparent;
    }

    .close-toast:hover {
        cursor: pointer;

        color: black;
    }

    @keyframes fade-out {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }
`;
