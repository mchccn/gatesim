import { AndGate } from "./chips";
import { Component } from "./Component";
import { Reified } from "./dom";
import { DraggingManager } from "./DraggingManager";
import { Input } from "./Input";
import { Output } from "./Output";

const active = new Set([
    new Input({ x: 100, y: 100 }),
    new Input({ x: 100, y: 200 }),
    new Component(new AndGate(), { x: 300, y: 150 }),
    new Output({ x: 500, y: 150 }),
]);

DraggingManager.listen();

active.forEach((c) => {
    c.attach();

    if (c instanceof Component)
        DraggingManager.watch(c.element, c.element.querySelector(".component-name") as HTMLElement);
    else DraggingManager.watch(c.element);
});

DraggingManager.watch(Reified.root);

// ZoomingManager.observe(Reified.root);
