import { Chip } from "./chips";
import { html, Reified } from "./Reified";

export class Component<I extends number, O extends number> extends Reified {
    readonly element;

    readonly inputs = [] as HTMLButtonElement[];
    readonly outputs = [] as HTMLButtonElement[];

    readonly observers = new Map();

    readonly chip: Chip<I, O>;

    constructor(chip: Chip<I, O>, { x, y }: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.chip = chip;

        this.element = html`
            <div class="component">
                <div class="component-inputs">
                    ${Array(this.chip.inputs).fill('<button class="component-input-button">I</button>').join("")}
                </div>
                <p class="component-name">${this.chip.name}</p>
                <div class="component-outputs">
                    ${Array(this.chip.outputs).fill('<button class="component-output-button">O</button>').join("")}
                </div>
            </div>
        `;

        this.inputs = Array.from(this.element.querySelectorAll(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));

        this.inputs.forEach((input) =>
            this.observers.set(
                input,
                new MutationObserver(() => {
                    const out = this.chip.evaluate(this.inputs.map((i) => i.classList.contains("activated")));

                    this.outputs.forEach((output, i) => {
                        output.classList.toggle("activated", out[i]);
                    });
                })
            )
        );

        this.move(x, y);
    }

    attach() {
        super.attach();

        this.inputs.forEach((input) => {
            this.observers.get(input).observe(input, {
                attributeFilter: ["class"],
                attributes: true,
            });
        });
    }

    detach() {
        super.detach();

        this.observers.forEach((o) => o.disconnect());
    }
}
