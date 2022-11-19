import { BooleanTuple } from "./types";

export abstract class Chip<I extends number, O extends number> {
    readonly name;

    readonly inputs;
    readonly outputs;

    constructor(name: string, inputs: I, outputs: O) {
        this.name = name;
        this.inputs = inputs;
        this.outputs = outputs;
    }

    abstract output(inputs: BooleanTuple<I>): BooleanTuple<O>;
}

export class AndGate extends Chip<2, 1> {
    constructor() {
        super("AND", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [a && b];
    }
}

export class OrGate extends Chip<2, 1> {
    constructor() {
        super("OR", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [a || b];
    }
}

export class NotGate extends Chip<1, 1> {
    constructor() {
        super("NOT", 1, 1);
    }

    output([n]: [boolean]): [boolean] {
        return [!n];
    }
}
