import { keybinds } from "../keybinds";
import { ModalManager } from "../managers/ModalManager";
import { SandboxManager } from "../managers/SandboxManager";
import { TestingManager } from "../managers/TestingManager";
import { menu } from "../menu";
import { NandGate } from "../reified/chips";
import { Component } from "../reified/Component";
import { Input } from "../reified/Input";
import { Output } from "../reified/Output";

export const nands: Record<string, (ctx: { name: string }) => void> = {
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
                        { timeout: 300 },
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
                    new Input({ x: 100, y: 100 }),
                    new Component(new NandGate(), { x: 300, y: 100 }),
                    new Output({ x: 500, y: 100 }),
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
                    new Input({ x: 100, y: 100 }),
                    new Input({ x: 100, y: 200 }),
                    new Component(new NandGate(), { x: 300, y: 100 }),
                    new Component(new NandGate(), { x: 300, y: 200 }),
                    new Output({ x: 500, y: 150 }),
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
};
