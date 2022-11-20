import { AndGate } from "./chips";
import { Component } from "./Component";
import { DraggingManager } from "./DraggingManager";
import { Input } from "./Input";
import { MenuManager } from "./MenuManager";
import { Output } from "./Output";
import { Reified } from "./Reified";
import { Wiring, WiringManager } from "./WiringManager";

const a = new Input({ x: 100, y: 100 });
const b = new Input({ x: 100, y: 200 });
const c = new Component(new AndGate(), { x: 300, y: 150 });
const d = new Output({ x: 500, y: 150 });

const active = new Set([a, b, c, d]);

DraggingManager.listen();

active.forEach((c) => {
    c.attach();

    if (c instanceof Component) {
        DraggingManager.watch(c.element, c.element.querySelector<HTMLElement>(".component-name")!);
    }
});

WiringManager.wires.push(new Wiring(a.element, c.inputs[0]));
WiringManager.wires.push(new Wiring(b.element, c.inputs[1]));
WiringManager.wires.push(new Wiring(c.outputs[0], d.element));

MenuManager.use(Reified.root, [
    {
        "insert-chip": {
            label: "Insert chip",
            callback: () => {},
        },
    },
    {
        "new-input": {
            label: "New input",
            callback: () => {},
        },
        "new-output": {
            label: "New output",
            callback: () => {},
        },
    },
    {
        "new-chip": {
            label: "New chip from diagram",
            callback: () => {},
        },
    },
    {
        "save-as": {
            label: "Save as file",
            callback: () => {},
        },
    },
]);

(function loop() {
    WiringManager.render();

    requestAnimationFrame(loop);
})();
