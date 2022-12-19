//@ts-nocheck

import { ACTIVATED_CSS_COLOR, APP_NAME } from "./constants";

// using ts extension because of webpack things
switch (APP_NAME) {
    case "alg":
    case "algebra": {
        await import(`./algebra/index.ts`);

        console.log("%cGATESIM ALGEBRA", `color: ${ACTIVATED_CSS_COLOR}; font-size: 2rem;`);
        console.log("Enter in a list of expressions (boolean algebra).");
        console.log("This app transforms the expressions into a circuit.");

        break;
    }
    case "cad": {
        await import(`./cad/index.ts`);

        console.log("%cGATESIM CAD", `color: ${ACTIVATED_CSS_COLOR}; font-size: 2rem;`);
        console.log("Input a truth table to get started.");
        console.log("The program will find a circuit that matches the table.");

        break;
    }
    case "sim": {
        await import(`./app.ts`);

        console.log("%cGATESIM", `color: ${ACTIVATED_CSS_COLOR}; font-size: 2rem;`);
        console.log("Right click to get started.");
        console.log("Press '?' for help.");

        break;
    }
    default: {
        console.log("%cUNKNOWN APP", `color: ${ACTIVATED_CSS_COLOR}; font-size: 2rem;`);
    }
}
