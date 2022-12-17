import { IS_MAC_OS } from "../circular";
import { ACTIVATED_CSS_COLOR, DELAY, LOCKED_FOR_TESTING, TOAST_DURATION } from "../constants";
import { DraggingManager } from "../managers/DraggingManager";
import { KeybindsManager } from "../managers/KeybindsManager";
import { ModalManager } from "../managers/ModalManager";
import { SandboxManager } from "../managers/SandboxManager";
import { TestingManager } from "../managers/TestingManager";
import { ToastManager } from "../managers/ToastManager";
import { NewWireContext, Wiring, WiringManager } from "../managers/WiringManager";
import { Reified, computeTransformOrigin, html } from "./Reified";
import { Chip, ExtendedChip } from "./chips";

export class Component<I extends number, O extends number> extends Reified {
    readonly element;

    inputs;
    outputs;
    readonly name;

    readonly #observers = new Map<Element, MutationObserver>();
    readonly #mouseups = new Map<Element, () => void>();
    readonly #contextmenus = new Map<Element, () => void>();
    readonly #clicks = new Map<Element, () => void>();

    readonly base: Chip<I, O>;
    chip: Chip<I, O>;

    #angle = 0;

    #complementary = false;

    #joins = 0;

    constructor(
        chip: Chip<I, O>,
        pos:
            | { x: number; y: number; centered?: boolean }
            | ((comp: Component<I, O>) => { x: number; y: number; centered?: boolean }),
        complementary = false,
        joins = chip.inputs,
    ) {
        super();

        this.#complementary = complementary;
        this.#joins = joins;

        this.base = chip;
        this.chip =
            this.#joins !== this.base.inputs
                ? new (Chip.joined(this.base.constructor as ExtendedChip<I, O>, this.#joins as I))()
                : this.base;

        this.element = html`
            <div class="component">
                <div class="component-inputs">
                    ${Array(this.joins).fill('<button class="component-input-button">I</button>').join("")}
                </div>
                <p class="component-name">${this.chip.name}</p>
                <div class="component-outputs">
                    ${Array(complementary && this.chip.outputs === 1 ? this.chip.outputs + 1 : this.chip.outputs)
                        .fill('<button class="component-output-button">O</button>')
                        .join("")}
                </div>
            </div>
        `;

        this.inputs = Array.from(this.element.querySelectorAll<HTMLElement>(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll<HTMLElement>(".component-output-button"));
        this.name = this.element.querySelector<HTMLElement>(".component-name")!;

        this.#updateListeners();

        requestAnimationFrame(() => this.update());

        this.move(typeof pos === "function" ? pos.call(undefined, this) : pos);
    }

    async update() {
        const out = this.chip.evaluate(this.inputs.map((i) => i.classList.contains("activated")));

        await DELAY(
            Reified.GATE_DELAY + Math.random() * (2 * Reified.GATE_DELAY_VARIATION) - Reified.GATE_DELAY_VARIATION,
        );

        this.outputs.forEach((output, i) => {
            output.classList.toggle("activated", this.#complementary && i === 1 ? !out[0] : out[i]);
        });

        return this;
    }

    get angle() {
        return this.#angle;
    }

    set angle(v: number) {
        this.#angle = v % 360;

        this.element.style.transform = `rotateZ(${v}deg)`;

        if (v === 180) {
            this.name.style.transform = `rotateZ(${v}deg)`;
        } else {
            this.name.style.transform = "";
        }

        this.element.style.transformOrigin = computeTransformOrigin(this.element);
    }

    get complementary() {
        return this.#complementary;
    }

    get joins() {
        return this.#joins;
    }

    rotate(angle: number) {
        this.angle = angle;

        return this;
    }

    attach() {
        super.attach();

        this.#attachListeners();

        DraggingManager.watch(this.element, this.name);

        return this;
    }

    detach() {
        super.detach();

        this.#destroyListeners();

        DraggingManager.forget(this.element, true);

        return this;
    }

    #updateListeners() {
        this.#observers.clear();
        this.#mouseups.clear();
        this.#contextmenus.clear();
        this.#clicks.clear();

        this.inputs.forEach((input) => {
            this.#observers.set(input, new MutationObserver(this.update.bind(this)));

            this.#mouseups.set(input, () => input.blur());

            this.#contextmenus.set(input, () => {
                SandboxManager.queueNewContext(() => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                                const deleted: Element[] = [];

                                return SandboxManager.pushHistory(
                                    () => {
                                        WiringManager.wires.forEach((wire) => {
                                            if (wire.to === input) {
                                                wire.destroy();

                                                deleted.push(wire.from);
                                            }
                                        });

                                        input.classList.remove("activated");
                                    },
                                    () => {
                                        WiringManager.wires.addAll(
                                            deleted.splice(0, deleted.length).map((from) => new Wiring(from, input)),
                                        );
                                    },
                                );
                            },
                        },
                    },
                ]);
            });
        });

        this.outputs.forEach((output) => {
            this.#mouseups.set(output, () => output.blur());

            this.#contextmenus.set(output, () => {
                SandboxManager.queueNewContext(() => [
                    {
                        "create-connection": {
                            label: "Create connection",
                            keybind: "Q",
                            callback: () => {
                                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                                NewWireContext.from = output;

                                return undefined;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                                const deleted: Element[] = [];

                                return SandboxManager.pushHistory(
                                    () => {
                                        WiringManager.wires.forEach((wire) => {
                                            if (wire.from === output) {
                                                wire.destroy();

                                                wire.to.classList.remove("activated");

                                                deleted.push(wire.to);
                                            }
                                        });
                                    },
                                    () => {
                                        WiringManager.wires.addAll(
                                            deleted.splice(0, deleted.length).map((to) => new Wiring(output, to)),
                                        );
                                    },
                                );
                            },
                        },
                    },
                ]);
            });

            this.#clicks.set(output, () => {
                if (KeybindsManager.isKeyDown("KeyQ")) NewWireContext.from = output;
            });
        });

        this.#contextmenus.set(this.name, () => {
            SandboxManager.queueNewContext(() => [
                ...(this.chip.outputs === 1
                    ? [
                          {
                              "set-inputs": {
                                  label: "Set inputs",
                                  callback: async () => {
                                      const input = await ModalManager.prompt("Enter the number of inputs:");

                                      if (!input) return;

                                      const joins = +input;

                                      if (Number.isNaN(joins) || !Number.isInteger(joins) || joins < this.base.inputs)
                                          return ToastManager.toast({
                                              message: `Number of inputs must be a positive integer greater than or equal to ${this.base.inputs}.`,
                                              color: ACTIVATED_CSS_COLOR,
                                              duration: TOAST_DURATION,
                                          });

                                      if (this.#joins === joins) return;

                                      const previous = this.#joins;

                                      const deleted: [from: Element, to: Element][] = [];

                                      const inputs = [...this.inputs];

                                      const old = this.chip;

                                      return SandboxManager.pushHistory(
                                          () => {
                                              this.#joins = joins;

                                              WiringManager.wires.forEach((wire) => {
                                                  if (this.inputs.some((i) => wire.to === i)) {
                                                      wire.destroy();

                                                      wire.to.classList.remove("activated");

                                                      deleted.push([wire.from, wire.to]);
                                                  }
                                              });

                                              this.#destroyListeners();

                                              this.inputs.forEach((i) => i.remove());

                                              this.inputs = Array(joins)
                                                  .fill(undefined)
                                                  .map(() => html`<button class="component-input-button">I</button>`);

                                              const ic = this.element.querySelector<HTMLElement>(".component-inputs")!;

                                              this.inputs.forEach((i) => ic.appendChild(i));

                                              this.#updateListeners();

                                              this.#attachListeners();

                                              this.chip =
                                                  this.#joins !== this.base.inputs
                                                      ? new (Chip.joined(
                                                            this.base.constructor as ExtendedChip<I, O>,
                                                            this.#joins as I,
                                                        ))()
                                                      : this.base;

                                              this.update();

                                              SandboxManager.forceSave();

                                              DraggingManager.snapToGridBasedUpdate();
                                          },
                                          () => {
                                              this.#joins = previous;

                                              WiringManager.wires.addAll(
                                                  deleted
                                                      .splice(0, deleted.length)
                                                      .map(([from, to]) => new Wiring(from, to)),
                                              );

                                              this.#destroyListeners();

                                              this.inputs.forEach((i) => i.remove());

                                              this.inputs = inputs;

                                              const ic = this.element.querySelector<HTMLElement>(".component-inputs")!;

                                              this.inputs.forEach((i) => ic.appendChild(i));

                                              this.#updateListeners();

                                              this.#attachListeners();

                                              this.chip = old;

                                              this.update();

                                              SandboxManager.forceSave();

                                              DraggingManager.snapToGridBasedUpdate();
                                          },
                                      );
                                  },
                              },
                              "toggle-complementary": {
                                  label: "Complementary output",
                                  callback: () => {
                                      if (TestingManager.testing) return LOCKED_FOR_TESTING();

                                      if (this.complementary) {
                                          const output = this.outputs[this.outputs.length - 1];
                                          const deleted: Element[] = [];

                                          return SandboxManager.pushHistory(
                                              () => {
                                                  this.#complementary = false;

                                                  this.#destroyListeners();

                                                  output.remove();

                                                  this.outputs = Array.from(
                                                      this.element.querySelectorAll<HTMLElement>(
                                                          ".component-output-button",
                                                      ),
                                                  );

                                                  WiringManager.wires.forEach((wire) => {
                                                      if (wire.from === output) {
                                                          wire.destroy();

                                                          wire.to.classList.remove("activated");

                                                          deleted.push(wire.to);
                                                      }
                                                  });

                                                  this.#updateListeners();

                                                  this.#attachListeners();

                                                  this.update();

                                                  SandboxManager.forceSave();

                                                  DraggingManager.snapToGridBasedUpdate();
                                              },
                                              () => {
                                                  this.#complementary = true;

                                                  this.#destroyListeners();

                                                  this.element
                                                      .querySelector<HTMLElement>(".component-outputs")!
                                                      .appendChild(output);

                                                  this.outputs = Array.from(
                                                      this.element.querySelectorAll<HTMLElement>(
                                                          ".component-output-button",
                                                      ),
                                                  );

                                                  WiringManager.wires.addAll(
                                                      deleted
                                                          .splice(0, deleted.length)
                                                          .map((to) => new Wiring(output, to)),
                                                  );

                                                  this.#updateListeners();

                                                  this.#attachListeners();

                                                  this.update();

                                                  SandboxManager.forceSave();

                                                  DraggingManager.snapToGridBasedUpdate();
                                              },
                                          );
                                      } else {
                                          const output = html`<button class="component-output-button">O</button>`;

                                          return SandboxManager.pushHistory(
                                              () => {
                                                  this.#complementary = true;

                                                  this.#destroyListeners();

                                                  this.element
                                                      .querySelector<HTMLElement>(".component-outputs")!
                                                      .appendChild(output);

                                                  this.outputs = Array.from(
                                                      this.element.querySelectorAll<HTMLElement>(
                                                          ".component-output-button",
                                                      ),
                                                  );

                                                  this.#updateListeners();

                                                  this.#attachListeners();

                                                  this.update();

                                                  SandboxManager.forceSave();

                                                  DraggingManager.snapToGridBasedUpdate();
                                              },
                                              () => {
                                                  this.#complementary = false;

                                                  this.#destroyListeners();

                                                  output.remove();

                                                  this.outputs = Array.from(
                                                      this.element.querySelectorAll<HTMLElement>(
                                                          ".component-output-button",
                                                      ),
                                                  );

                                                  this.#updateListeners();

                                                  this.#attachListeners();

                                                  this.update();

                                                  SandboxManager.forceSave();

                                                  DraggingManager.snapToGridBasedUpdate();
                                              },
                                          );
                                      }
                                  },
                              },
                          },
                      ]
                    : []),
                {
                    "rotate-component": {
                        label: "Rotate component",
                        keybind: "R",
                        callback: () => {
                            if (TestingManager.testing) return LOCKED_FOR_TESTING();

                            return SandboxManager.pushHistory(
                                () => {
                                    this.angle += 90;
                                },
                                () => {
                                    this.angle -= 90;
                                },
                            );
                        },
                    },
                },
                {
                    "delete-component": {
                        label: "Delete component",
                        keybind: IS_MAC_OS ? "⌘ X" : "Ctrl X",
                        callback: () => {
                            if (this.PERMANENT)
                                return void ToastManager.toast({
                                    message: "This component is permanent and cannot be deleted.",
                                    color: ACTIVATED_CSS_COLOR,
                                    duration: TOAST_DURATION,
                                });

                            if (TestingManager.testing) return LOCKED_FOR_TESTING();

                            const deleted: [from: Element, to: Element][] = [];

                            return SandboxManager.pushHistory(
                                () => {
                                    Reified.active.delete(this);

                                    this.detach();

                                    WiringManager.wires.forEach((wire) => {
                                        if (
                                            this.inputs.some((i) => wire.to === i) ||
                                            this.outputs.some((o) => wire.from === o)
                                        ) {
                                            wire.destroy();

                                            wire.to.classList.remove("activated");

                                            deleted.push([wire.from, wire.to]);
                                        }
                                    });

                                    this.inputs.forEach((i) => i.classList.remove("activated"));
                                },
                                () => {
                                    Reified.active.add(this);

                                    this.attach();

                                    WiringManager.wires.addAll(
                                        deleted.splice(0, deleted.length).map(([from, to]) => new Wiring(from, to)),
                                    );
                                },
                            );
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        keybind: IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                        callback: () => {
                            if (TestingManager.testing) return LOCKED_FOR_TESTING();

                            const deleted: [from: Element, to: Element][] = [];

                            return SandboxManager.pushHistory(
                                () => {
                                    WiringManager.wires.forEach((wire) => {
                                        if (
                                            this.inputs.some((i) => wire.to === i) ||
                                            this.outputs.some((o) => wire.from === o)
                                        ) {
                                            wire.destroy();

                                            wire.to.classList.remove("activated");

                                            deleted.push([wire.from, wire.to]);
                                        }
                                    });

                                    this.inputs.forEach((i) => i.classList.remove("activated"));
                                },
                                () => {
                                    WiringManager.wires.addAll(
                                        deleted.splice(0, deleted.length).map(([from, to]) => new Wiring(from, to)),
                                    );
                                },
                            );
                        },
                    },
                },
            ]);
        });
    }

    #attachListeners() {
        this.inputs.forEach((input) => {
            this.#observers.get(input)!.observe(input, {
                attributes: true,
                attributeFilter: ["class"],
            });

            input.addEventListener("mouseup", this.#mouseups.get(input)!);

            input.addEventListener("contextmenu", this.#contextmenus.get(input)!);
        });

        this.outputs.forEach((output) => {
            output.addEventListener("mouseup", this.#mouseups.get(output)!);

            output.addEventListener("contextmenu", this.#contextmenus.get(output)!);

            output.addEventListener("click", this.#clicks.get(output)!);
        });

        this.name.addEventListener("contextmenu", this.#contextmenus.get(this.name)!);
    }

    #destroyListeners() {
        this.#observers.forEach((o) => o.disconnect());

        this.#mouseups.forEach((listener, element) => element.removeEventListener("mouseup", listener));

        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));

        this.#clicks.forEach((listener, element) => element.removeEventListener("click", listener));

        this.name.removeEventListener("contextmenu", this.#contextmenus.get(this.name)!);
    }
}
