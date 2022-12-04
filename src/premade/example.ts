import { keybinds } from "../keybinds";
import { SandboxManager } from "../managers/SandboxManager";
import { Wiring } from "../managers/WiringManager";
import { menu } from "../menu";
import { AndGate, OrGate, XorGate } from "../reified/chips";
import { Component } from "../reified/Component";
import { Input } from "../reified/Input";
import { Output } from "../reified/Output";

export const example: Record<string, (ctx: { name: string }) => void> = {
    "example:halfadder": ({ name: save }) => {
        const components = [
            new Input({ x: 100, y: 100, centered: true }),
            new Input({ x: 100, y: 200, centered: true }),
            new Component(new XorGate(), { x: 300, y: 100, centered: true }),
            new Component(new AndGate(), { x: 300, y: 200, centered: true }),
            new Output({ x: 500, y: 100, centered: true }),
            new Output({ x: 500, y: 200, centered: true }),
        ] as const;

        const [i1, i2, xor, and, o1, o2] = components;

        SandboxManager.setup({
            keybinds,
            menu,
            save,
            initial: [
                components.map((component) => component.permanent()),
                [
                    new Wiring(i1.element, xor.inputs[0]),
                    new Wiring(i1.element, and.inputs[0]),
                    new Wiring(i2.element, xor.inputs[1]),
                    new Wiring(i2.element, and.inputs[1]),
                    new Wiring(xor.outputs[0], o1.element),
                    new Wiring(and.outputs[0], o2.element),
                ],
            ],
            limits: {
                inputs: 2,
                outputs: 2,
                chipsTotal: 2,
                wirings: 6,
                componentsTotal: 6,
                chips: { AND: 1, XOR: 1 },
            },
        });
    },
    "example:fulladder": ({ name: save }) => {
        const components = [
            new Input({ x: 100, y: 100, centered: true }),
            new Input({ x: 100, y: 200, centered: true }),
            new Input({ x: 100, y: 300, centered: true }),
            new Component(new XorGate(), { x: 250, y: 100, centered: true }),
            new Component(new AndGate(), { x: 250, y: 200, centered: true }),
            new Component(new AndGate(), { x: 250, y: 300, centered: true }),
            new Component(new XorGate(), { x: 400, y: 150, centered: true }),
            new Component(new OrGate(), { x: 400, y: 250, centered: true }),
            new Output({ x: 550, y: 150, centered: true }),
            new Output({ x: 550, y: 250, centered: true }),
        ] as const;

        const [i1, i2, i3, xor1, and1, and2, xor2, or, o1, o2] = components;

        SandboxManager.setup({
            keybinds,
            menu,
            save,
            initial: [
                components.map((component) => component.permanent()),
                [
                    new Wiring(i1.element, xor1.inputs[0]),
                    new Wiring(i1.element, and2.inputs[0]),
                    new Wiring(i2.element, xor1.inputs[1]),
                    new Wiring(i2.element, and2.inputs[1]),
                    new Wiring(i3.element, and1.inputs[1]),
                    new Wiring(i3.element, xor2.inputs[1]),
                    new Wiring(xor1.outputs[0], and1.inputs[0]),
                    new Wiring(xor1.outputs[0], xor2.inputs[0]),
                    new Wiring(and1.outputs[0], or.inputs[0]),
                    new Wiring(and2.outputs[0], or.inputs[1]),
                    new Wiring(xor2.outputs[0], o1.element),
                    new Wiring(or.outputs[0], o2.element),
                ],
            ],
            limits: {
                inputs: 3,
                outputs: 2,
                chipsTotal: 5,
                wirings: 12,
                componentsTotal: 10,
                chips: { AND: 2, XOR: 2, OR: 1 },
            },
        });
    },
};
