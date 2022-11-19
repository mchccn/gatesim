import { Chip } from "./chips";
import { html, Reified } from "./dom";

export class Component<I extends number, O extends number> extends Reified {
    readonly element;

    readonly inputs = [] as HTMLButtonElement[];
    readonly outputs = [] as HTMLButtonElement[];

    readonly chip: Chip<I, O>;

    constructor(chip: Chip<I, O>, { x, y }: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.chip = chip;

        this.element = html`
            <div class="component">
                <div class="component-inputs">
                    ${Array(this.chip.inputs)
                        .fill('<button class="component-input-button"></button>')
                        .join("")}
                </div>
                <p class="component-name">${this.chip.name}</p>
                <div class="component-outputs">
                    ${Array(this.chip.outputs)
                        .fill('<button class="component-output-button"></button>')
                        .join("")}
                </div>
            </div>
        `;

        this.inputs = Array.from(this.element.querySelectorAll(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));

        this.move(x, y);
    }
}
