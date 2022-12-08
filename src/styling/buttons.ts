import { EVEN_LIGHTER_GRAY_CSS_COLOR, KINDA_GRAY_CSS_COLOR, LIGHT_GRAY_CSS_COLOR } from "../constants";

export default /* css */ `
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
    background-color: ${LIGHT_GRAY_CSS_COLOR};
}

button.undo {
    color: ${KINDA_GRAY_CSS_COLOR};
    left: 64px;
    bottom: 24px;
    position: absolute;
    font-size: 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    user-select: none;
}

button.redo {
    color: ${KINDA_GRAY_CSS_COLOR};
    left: 122px;
    bottom: 24px;
    position: absolute;
    font-size: 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    user-select: none;
}
`;
