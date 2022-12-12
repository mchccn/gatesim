import { css } from "../reified/Reified";

export default css`
    body {
        display: flex;
        flex-direction: column;
    }

    truth-table {
        flex: 1;

        max-height: 500px;
    }

    div.truth-table {
        height: 100%;

        display: flex;
        flex-direction: column;
    }

    div.truth-table .input-highlight {
        -ms-overflow-style: none;
        scrollbar-width: none;

        position: absolute;

        pointer-events: none;

        z-index: 100;

        font-size: 16px;
        font-family: Fira Code, monospace;

        line-height: 1;

        letter-spacing: 0;

        word-spacing: 0;
        word-break: break-all;
        word-wrap: break-word;

        overflow-wrap: break-word;
        text-overflow: clip;

        overflow: scroll;
        overscroll-behavior: none;

        white-space: pre;

        padding: 0.5rem;

        border: none;
        outline: none;
    }

    div.truth-table .table-input {
        -ms-overflow-style: none;
        scrollbar-width: none;

        flex: 1;

        resize: none;

        font-size: 16px;
        font-family: Fira Code, monospace;

        line-height: 1;
        letter-spacing: 0;

        word-spacing: 0;
        word-break: break-all;
        word-wrap: break-word;

        overflow-wrap: break-word;
        text-overflow: clip;

        overflow: scroll;
        overscroll-behavior: none;

        white-space: pre;

        padding: 0.5rem;

        border: none;
        outline: none;
    }

    div.truth-table .input-highlight::-webkit-scrollbar,
    div.truth-table .table-input::-webkit-scrollbar {
        display: none;
    }

    div.truth-table .input-highlight::-webkit-scrollbar-thumb,
    div.truth-table .table-input::-webkit-scrollbar-thumb {
        background: transparent;
    }

    div.truth-table > div.buttons {
        display: flex;
    }

    div.truth-table > div.buttons > button {
        flex: 1;

        padding: 1rem;
    }

    cad-output {
        flex: 1;
    }

    @media (min-width: 1076px) {
        body {
            flex-direction: row;
        }

        truth-table {
            max-height: unset;
        }
    }
`;
