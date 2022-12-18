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

    static joined<I extends number, O extends number, N extends number>(
        chip: ExtendedChip<I, O>,
        n: N,
    ): ExtendedChip<N, O> {
        if (chip.INPUTS < 1 || chip.OUTPUTS < 1) throw new TypeError("Invalid chip");

        if (n === 1) return (chip instanceof NotGate ? NotGate : BufferGate) as ExtendedChip<N, O>;

        return class extends Chip<N, O> {
            static readonly NAME = chip.NAME;
            static readonly INPUTS = n;
            static readonly OUTPUTS = chip.OUTPUTS;

            #chips = Array.from({ length: n - 1 }, () => new chip());

            constructor() {
                super(chip.NAME, n, chip.OUTPUTS as O);
            }

            output(inputs: boolean[]) {
                return this.#chips
                    .slice(1)
                    .reduce(
                        (output, chip, i) => chip.output([inputs[i + chip.inputs], ...output] as BooleanTuple<I>),
                        this.#chips[0].output(inputs.slice(0, chip.INPUTS) as BooleanTuple<I>),
                    );
            }
        };
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

export type ExtendedChip<I extends number = number, O extends number = number> = StaticMembers<typeof Chip<I, O>> & {
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
