import { AndGate } from "./chips";
import { Component } from "./Component";
import { DraggingManager } from "./DraggingManager";
import { Input } from "./Input";
import { Output } from "./Output";
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

(function loop() {
    WiringManager.render();

    requestAnimationFrame(loop);
})();
