import { BooleanTuple } from "./types";

export abstract class Chip<I extends number, O extends number> {
    static readonly NAME: string;

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

    constructor() {
        super("AND", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [a && b];
    }
}

export class OrGate extends Chip<2, 1> {
    static readonly NAME = "OR";

    constructor() {
        super("OR", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [a || b];
    }
}

export class NotGate extends Chip<1, 1> {
    static readonly NAME = "NOT";

    constructor() {
        super("NOT", 1, 1);
    }

    output([n]: [boolean]): [boolean] {
        return [!n];
    }
}

export const chips = new Map<string, new () => Chip<number, number>>([
    [AndGate.NAME, AndGate],
    [OrGate.NAME, OrGate],
    [NotGate.NAME, NotGate],
]);
