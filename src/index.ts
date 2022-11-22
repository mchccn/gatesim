import { AndGate } from "./chips";
import { Component } from "./Component";
import "./contextmenu";
import { DraggingManager } from "./DraggingManager";
import { Input } from "./Input";
import { MouseTracker } from "./MouseTracker";
import { NewWireContext } from "./NewWireContext";
import { Output } from "./Output";
import { Wiring, WiringManager } from "./WiringManager";

const a = new Input({ x: 100, y: 100 });
const b = new Input({ x: 100, y: 200 });
const c = new Component(new AndGate(), { x: 300, y: 150 });
const d = new Output({ x: 500, y: 150 });

[a, b, c, d].forEach((c) => {
    c.attach();

    if (c instanceof Component) {
        DraggingManager.watch(c.element, c.name);
    } else {
        DraggingManager.watch(c.element);
    }
});

MouseTracker.onMouseDown((e) => {
    if (NewWireContext.from) {
        const target = e.target;

        if (target && target instanceof HTMLElement) {
            if (target.classList.contains("board-output") || target.classList.contains("component-input-button")) {
                WiringManager.wires.push(new Wiring(NewWireContext.from, target));
            }
        }

        NewWireContext.from = undefined;
    }
});

MouseTracker.start();
DraggingManager.listen();

WiringManager.wires.push(new Wiring(a.element, c.inputs[0]));
WiringManager.wires.push(new Wiring(b.element, c.inputs[1]));
WiringManager.wires.push(new Wiring(c.outputs[0], d.element));

(function loop() {
    WiringManager.render();

    requestAnimationFrame(loop);
})();
