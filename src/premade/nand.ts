import { keybinds } from "../keybinds/keybinds";
import { ModalManager } from "../managers/ModalManager";
import { SandboxManager } from "../managers/SandboxManager";
import { TestingManager } from "../managers/TestingManager";
import { menu } from "../menu/menu";
import { NandGate } from "../reified/chips";
import { Component } from "../reified/Component";
import { Input } from "../reified/Input";
import { Output } from "../reified/Output";

export const nand: Record<string, (ctx: { name: string }) => void> = {
    "nand:not": ({ name: save }) => {
        menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await TestingManager.test(
                        [
                            [[true], [false]],
                            [[false], [true]],
                        ],
                        { timeout: 500 },
                    );
                },
            },
        });

        SandboxManager.setup({
            keybinds,
            menu,
            save,
            initial: [
                [
                    new Input({ x: 100, y: 100, centered: true }),
                    new Component(new NandGate(), { x: 300, y: 100, centered: true }),
                    new Output({ x: 500, y: 100, centered: true }),
                ].map((component) => component.permanent()),
                [],
            ],
            limits: {
                inputs: 1,
                outputs: 1,
                chipsTotal: 1,
                wirings: 3,
                componentsTotal: 3,
                chips: { NAND: 1 },
            },
        });

        ModalManager.alert("Recreate a NOT gate using only a NAND gate.");
    },
    "nand:and": ({ name: save }) => {
        menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await TestingManager.test(
                        [
                            [[false, false], [false]],
                            [[true, false], [false]],
                            [[false, true], [false]],
                            [[true, true], [true]],
                        ],
                        { timeout: 750 },
                    );
                },
            },
        });

        SandboxManager.setup({
            keybinds,
            menu,
            save,
            initial: [
                [
                    new Input({ x: 100, y: 100, centered: true }),
                    new Input({ x: 100, y: 200, centered: true }),
                    new Component(new NandGate(), { x: 300, y: 100, centered: true }),
                    new Component(new NandGate(), { x: 300, y: 200, centered: true }),
                    new Output({ x: 500, y: 150, centered: true }),
                ].map((component) => component.permanent()),
                [],
            ],
            limits: {
                inputs: 2,
                outputs: 1,
                chipsTotal: 2,
                wirings: 5,
                componentsTotal: 5,
                chips: { NAND: 2 },
            },
        });

        ModalManager.alert("Recreate an AND gate using only NAND gates.");
    },
    "nand:or": ({ name: save }) => {
        menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await TestingManager.test(
                        [
                            [[false, false], [false]],
                            [[true, false], [true]],
                            [[false, true], [true]],
                            [[true, true], [true]],
                        ],
                        { timeout: 1000 },
                    );
                },
            },
        });

        SandboxManager.setup({
            keybinds,
            menu,
            save,
            initial: [
                [
                    new Input({ x: 100, y: 100, centered: true }),
                    new Input({ x: 100, y: 200, centered: true }),
                    new Component(new NandGate(), { x: 300, y: 100, centered: true }),
                    new Component(new NandGate(), { x: 300, y: 150, centered: true }),
                    new Component(new NandGate(), { x: 300, y: 200, centered: true }),
                    new Output({ x: 600, y: 150 }),
                ].map((component) => component.permanent()),
                [],
            ],
            limits: {
                inputs: 2,
                outputs: 1,
                chipsTotal: 3,
                wirings: 7,
                componentsTotal: 6,
                chips: { NAND: 3 },
            },
        });

        ModalManager.alert("Recreate an OR gate using only NAND gates.");
    },
    "nand:xor": ({ name: save }) => {
        menu.splice(2, 0, {
            test: {
                label: "Test solution",
                async callback() {
                    await TestingManager.test(
                        [
                            [[false, false], [false]],
                            [[true, false], [true]],
                            [[false, true], [true]],
                            [[true, true], [false]],
                        ],
                        { timeout: 1250 },
                    );
                },
            },
        });

        SandboxManager.setup({
            keybinds,
            menu,
            save,
            initial: [
                [
                    new Input({ x: 100, y: 100, centered: true }),
                    new Input({ x: 100, y: 200, centered: true }),
                    new Component(new NandGate(), { x: 300, y: 100, centered: true }),
                    new Component(new NandGate(), { x: 300, y: 200, centered: true }),
                    new Component(new NandGate(), { x: 500, y: 100, centered: true }),
                    new Component(new NandGate(), { x: 500, y: 200, centered: true }),
                    new Output({ x: 700, y: 150, centered: true }),
                ].map((component) => component.permanent()),
                [],
            ],
            limits: {
                inputs: 2,
                outputs: 1,
                chipsTotal: 4,
                wirings: 9,
                componentsTotal: 8,
                chips: { NAND: 4 },
            },
        });

        ModalManager.alert("Recreate a XOR gate using only NAND gates.");
    },
};
