type BooleanTuple<L extends number, R extends boolean[] = []> = number extends L
    ? boolean[]
    : R["length"] extends L
    ? R
    : BooleanTuple<L, [...R, boolean]>;

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

export class NandGate extends Chip<2, 1> {
    static readonly NAME = "NAND";
    static readonly INPUTS = 2;
    static readonly OUTPUTS = 1;

    constructor() {
        super("NAND", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [!(a && b)];
    }
}

export class NorGate extends Chip<2, 1> {
    static readonly NAME = "NOR";
    static readonly INPUTS = 2;
    static readonly OUTPUTS = 1;

    constructor() {
        super("NOR", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [!(a || b)];
    }
}

export class XorGate extends Chip<2, 1> {
    static readonly NAME = "XOR";
    static readonly INPUTS = 2;
    static readonly OUTPUTS = 1;

    constructor() {
        super("XOR", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [!!(+a ^ +b)];
    }
}

export class XnorGate extends Chip<2, 1> {
    static readonly NAME = "XNOR";
    static readonly INPUTS = 2;
    static readonly OUTPUTS = 1;

    constructor() {
        super("XNOR", 2, 1);
    }

    output([a, b]: [boolean, boolean]): [boolean] {
        return [!(+a ^ +b)];
    }
}

export class BufferGate extends Chip<1, 1> {
    static readonly NAME = "BUF";
    static readonly INPUTS = 1;
    static readonly OUTPUTS = 1;

    constructor() {
        super("BUFFER", 1, 1);
    }

    output([n]: [boolean]): [boolean] {
        return [n];
    }
}

type StaticMembers<T> = { [K in keyof T]: T[K] };
type ExtendedChip<I extends number = number, O extends number = number> = StaticMembers<typeof Chip<I, O>> & {
    new (): Chip<I, O>;
};

export const gates = [AndGate, OrGate, NotGate, NandGate, NorGate, XorGate, XnorGate, BufferGate] as const;

export const chips = new Map<string, ExtendedChip>(gates.map((gate) => [gate.NAME, gate]));

chips.set("BUFF", BufferGate);
chips.set("BUFFER", BufferGate);

export class HalfAdderGate extends Chip<2, 2> {
    static readonly NAME = "HALFADDER";
    static readonly INPUTS = 2;
    static readonly OUTPUTS = 2;

    constructor() {
        super("HADD", 2, 2);
    }

    output([a, b]: [boolean, boolean]): [boolean, boolean] {
        return [!!(+a ^ +b), a && b];
    }
}

chips.set(HalfAdderGate.NAME, HalfAdderGate);
chips.set("HADD", HalfAdderGate);

export class FullAdderGate extends Chip<3, 2> {
    static readonly NAME = "FULLADDER";
    static readonly INPUTS = 3;
    static readonly OUTPUTS = 2;

    constructor() {
        super("FADD", 3, 2);
    }

    output([a, b, c]: [boolean, boolean, boolean]): [boolean, boolean] {
        return [!!(+!!(+a ^ +b) ^ +c), (!!(+a ^ +b) && c) || (a && b)];
    }
}

chips.set(FullAdderGate.NAME, FullAdderGate);
chips.set("FADD", FullAdderGate);
