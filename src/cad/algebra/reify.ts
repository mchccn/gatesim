import { COUNTER_GENERATOR } from "../../constants";
import type {
    SerializedComponent,
    SerializedComponents,
    SerializedDiagram,
    SerializedInput,
    SerializedOutput,
    SerializedWire,
} from "../../files";
import { fromVariable, isInversion } from "./variables";

// need to explicitly pass number of inputs since simplified table may not have all of the original inputs
/** converts a list of expressions into a serialized diagram */
export function reify(ins: number, table: string[]): SerializedDiagram {
    const components = new Array<SerializedComponents>();
    const wires = new Array<SerializedWire>();

    const id = COUNTER_GENERATOR();

    // create inputs
    const inputs: SerializedInput[] = Array(ins)
        .fill(0)
        .map((_, i) => ({
            reified: i,
            permanent: false,
            type: "INPUT",
            activated: false,
            id: id.next().value,
            x: 100,
            y: i * 25 + 100,
        }));

    // create outputs
    const outputs: SerializedOutput[] = table.map((_, i) => ({
        reified: inputs.length + i,
        permanent: false,
        type: "OUTPUT",
        activated: false,
        id: id.next().value,
        x: 700,
        y: i * 25 + 100,
    }));

    // should start at the sum of the lengths of the inputs and outputs
    let reified = inputs.length + outputs.length;

    // not gates for negating inputs
    const negatedInputs: SerializedComponent[] = inputs.map((_, i) => ({
        reified: reified++,
        permanent: false,
        type: "COMPONENT",
        name: "NOT",
        inputs: [{ id: id.next().value, activated: false }],
        outputs: [{ id: id.next().value, activated: true }],
        x: 150,
        y: i * 25 + 100 + 25,
        angle: 0,
        complementary: false,
        joins: 1,
    }));

    // connecting inputs to not gates
    inputs.forEach(({ id: from }, i) => {
        wires.push({ from, to: negatedInputs[i].inputs[0].id });
    });

    // add inputs, outputs, and negated inputs to components
    components.push(...inputs, ...outputs, ...negatedInputs);

    table.forEach((expr, i) => {
        // product of sums
        if (expr.startsWith("(") && expr.endsWith(")")) {
            const product = expr.slice(1, -1).split(")(");

            const masterGate: SerializedComponent = {
                reified: reified++,
                permanent: false,
                type: "COMPONENT",
                name: "AND",
                inputs: product.map(() => ({ id: id.next().value, activated: false })),
                outputs: [{ id: id.next().value, activated: false }],
                x: 550,
                y: i * 25 + 100,
                angle: 0,
                complementary: false,
                joins: product.length,
            };

            components.push(masterGate);

            product.forEach((o, j) => {
                const sum = o.split("+");

                const sumGate: SerializedComponent = {
                    reified: reified++,
                    permanent: false,
                    type: "COMPONENT",
                    name: "OR",
                    inputs: sum.map((v) =>
                        isInversion(v)
                            ? { id: id.next().value, activated: true }
                            : {
                                  id: id.next().value,
                                  activated: false,
                              },
                    ),
                    outputs: [
                        sum.some((v) => isInversion(v))
                            ? { id: id.next().value, activated: true }
                            : { id: id.next().value, activated: false },
                    ],
                    x: 450,
                    y: i * 25 + 100 + (product.length / 2 - j) * 25,
                    angle: 0,
                    complementary: false,
                    joins: sum.length,
                };

                sum.forEach((v) => {
                    if (isInversion(v)) {
                        // reference Input
                        inputs[fromVariable(v)];
                    }
                });
            });

            return;
        }

        // sum of products
    });

    return {
        settings: {
            "DraggingManager.snapToGrid": false,
        },
        components,
        wires,
    };
}
