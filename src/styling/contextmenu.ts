export default /* css */ `
.contextmenu {
    position: absolute;

    z-index: 100;

    display: flex;
    flex-direction: column;

    width: 200px;

    border: 1px solid #dedede;
    border-radius: 4px;

    background-color: #fefefe;

    user-select: none;

    box-shadow: 1px 1px 4px #dedede;
}

.contextmenu > .br {
    display: block;

    width: 100%;

    border-bottom: 1px solid #dedede;
}

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

.contextmenu > button:hover > .menu-keybind {
    color: #bbbbbb;
}
`;
