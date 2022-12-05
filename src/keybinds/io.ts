import { INPUT_COMPONENT_CSS_SIZE, LOCKED_FOR_TESTING, OUTPUT_COMPONENT_CSS_SIZE } from "../constants";
import { MouseManager } from "../managers/MouseManager";
import { SandboxManager } from "../managers/SandboxManager";
import { SelectionManager } from "../managers/SelectionManager";
import { TestingManager } from "../managers/TestingManager";
import { Input } from "../reified/Input";
import { Output } from "../reified/Output";
import { Reified } from "../reified/Reified";

export const io = {
    KeyI: () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        const input = new Input({
            x: MouseManager.mouse.x - INPUT_COMPONENT_CSS_SIZE / 2,
            y: MouseManager.mouse.y - INPUT_COMPONENT_CSS_SIZE / 2,
        });

        const selection = SelectionManager.selected.clone(true);

        return SandboxManager.pushHistory(
            () => {
                Reified.active.add(input);

                if (Reified.active.has(input)) {
                    input.attach();

                    SelectionManager.select(input);
                }
            },
            () => {
                Reified.active.delete(input);

                input.detach();

                SelectionManager.selected = selection;
            },
        );
    },
    KeyO: () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        const output = new Output({
            x: MouseManager.mouse.x - OUTPUT_COMPONENT_CSS_SIZE / 2,
            y: MouseManager.mouse.y - OUTPUT_COMPONENT_CSS_SIZE / 2,
        });

        const selection = SelectionManager.selected.clone(true);

        return SandboxManager.pushHistory(
            () => {
                Reified.active.add(output);

                if (Reified.active.has(output)) {
                    output.attach();

                    SelectionManager.select(output);
                }
            },
            () => {
                Reified.active.delete(output);

                output.detach();

                SelectionManager.selected = selection;
            },
        );
    },
} satisfies Record<string, (e: KeyboardEvent) => void>;
