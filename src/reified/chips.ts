import { BooleanTuple } from "../types";

export abstract class Chip<I extends number, O extends number> {
    static readonly NAME: string;
    static readonly INPUTS: number;
    static readonly OUTPUTS: number;

    readonly name;

    readonly inputs;
    readonly outputs;

    constructor(name: string, inputs: I, outputs: O) {
        this.name = name;
        this.inputs = inputs;
        this.outputs = outputs;
    }

    abstract output(inputs: BooleanTuple<I>): BooleanTuple<O>;

    evaluate(inputs: boolean[]) {
        return this.output(inputs as BooleanTuple<I, []>) as boolean[];
    }
}

export class AndGate extends Chip<2, 1> {
    static readonly NAME = "AND";
    static readonly INPUTS = 2;
    static readonly OUTPUTS = 1;

    constructor() {
        super("AND", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [a && b];
    }
}

export class OrGate extends Chip<2, 1> {
    static readonly NAME = "OR";
    static readonly INPUTS = 2;
    static readonly OUTPUTS = 1;

    constructor() {
        super("OR", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [a || b];
    }
}

export class NotGate extends Chip<1, 1> {
    static readonly NAME = "NOT";
    static readonly INPUTS = 1;
    static readonly OUTPUTS = 1;

    constructor() {
        super("NOT", 1, 1);
    }

    output([n]: [boolean]): [boolean] {
        return [!n];
    }
}

type StaticMembers<T> = { [K in keyof T]: T[K] };

export const chips = new Map<string, StaticMembers<typeof Chip<number, number>> & { new (): Chip<number, number> }>([
    [AndGate.NAME, AndGate],
    [OrGate.NAME, OrGate],
    [NotGate.NAME, NotGate],
]);
