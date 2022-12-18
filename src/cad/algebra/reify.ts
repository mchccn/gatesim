import type { Wiring } from "../../managers/WiringManager";
import type { Reified } from "../../reified/Reified";

export function reify(table: string[]) {
    const components = new Array<Reified>();
    const wirings = new Array<Wiring>();

    table.forEach(() => {});

    return [components, wirings] as const;
}
