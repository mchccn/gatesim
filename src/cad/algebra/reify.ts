import { COUNTER_GENERATOR } from "../../constants";
import type {
    SerializedComponent,
    SerializedComponents,
    SerializedDiagram,
    SerializedInput,
    SerializedOutput,
    SerializedWire,
} from "../../files";
import { fromVariable, isInversion, variableFor } from "./variables";

// need to explicitly pass number of inputs since simplified table may not have all of the original inputs
/** converts a list of expressions into a serialized diagram */
export function reify(ins: number, outs: number, table: string[]): SerializedDiagram {
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
            y: i * 50 + 100,
        }));

    // create outputs
    const outputs: SerializedOutput[] = Array(outs)
        .fill(0)
        .map((_, i) => ({
            reified: inputs.length + i,
            permanent: false,
            type: "OUTPUT",
            activated: false,
            id: id.next().value,
            x: 700,
            y: i * 50 + 100,
        }));

    // should start at the sum of the lengths of the inputs and outputs
    let reified = inputs.length + outputs.length;

    // not gates for negating inputs
    const negatedInputs: (SerializedComponent | undefined)[] = inputs.map((_, i) => {
        const v = variableFor(i, true);

        // if the negated input is never used, don't create a not gate
        if (!table.some((expr) => expr.includes(v))) return undefined;

        return {
            reified: reified++,
            permanent: false,
            type: "COMPONENT",
            name: "NOT",
            inputs: [{ id: id.next().value, activated: false }],
            outputs: [{ id: id.next().value, activated: true }],
            x: 150,
            y: i * 50 + 100 + 50,
            angle: 0,
            complementary: false,
            joins: 1,
        };
    });

    // connecting inputs to not gates
    inputs.forEach(({ id: from }, i) => {
        if (negatedInputs[i]) wires.push({ from, to: negatedInputs[i]!.inputs[0].id });
    });

    // add inputs, outputs, and negated inputs to components
    components.push(
        ...inputs,
        ...outputs,
        ...negatedInputs.filter((x): x is SerializedComponent => typeof x !== "undefined"),
    );

    table.forEach((expr, i) => {
        // product of sums
        if (expr.startsWith("(") && expr.endsWith(")")) {
            const product = expr.slice(1, -1).split(")(");

            // handle single products
            // directly connect or gate to output
            if (product.length === 1) {
                const sum = product[0].split("+");

                const sumGate: SerializedComponent = {
                    reified: reified++,
                    permanent: false,
                    type: "COMPONENT",
                    name: "OR",
                    inputs: sum.map((v) => ({ id: id.next().value, activated: isInversion(v) })),
                    outputs: [{ id: id.next().value, activated: sum.some((v) => isInversion(v)) }],
                    x: 350,
                    y: i * 50 + 100,
                    angle: 0,
                    complementary: false,
                    joins: sum.length,
                };

                // connect inputs to the or gate
                sum.forEach((v, k) => {
                    if (isInversion(v)) {
                        wires.push({
                            from: negatedInputs[fromVariable(v)]!.outputs[0].id,
                            to: sumGate.inputs[k].id,
                        });
                    } else {
                        wires.push({
                            from: inputs[fromVariable(v)].id,
                            to: sumGate.inputs[k].id,
                        });
                    }
                });

                // add or gate to components
                components.push(sumGate);

                // connect or gate to output
                wires.push({
                    from: sumGate.outputs[0].id,
                    to: outputs[i].id,
                });

                return;
            }

            const productGate: SerializedComponent = {
                reified: reified++,
                permanent: false,
                type: "COMPONENT",
                name: "AND",
                inputs: product.map(() => ({ id: id.next().value, activated: false })),
                outputs: [{ id: id.next().value, activated: false }],
                x: 550,
                y: i * 50 + 100,
                angle: 0,
                complementary: false,
                joins: product.length,
            };

            product.forEach((o, j) => {
                const sum = o.split("+");

                const sumGate: SerializedComponent = {
                    reified: reified++,
                    permanent: false,
                    type: "COMPONENT",
                    name: "OR",
                    inputs: sum.map((v) => ({ id: id.next().value, activated: isInversion(v) })),
                    outputs: [{ id: id.next().value, activated: sum.some((v) => isInversion(v)) }],
                    x: 350,
                    y: i * 50 + 100 + (product.length / 2 - j) * 50,
                    angle: 0,
                    complementary: false,
                    joins: sum.length,
                };

                // update and gate input
                productGate.inputs[j].activated = sumGate.outputs[0].activated;

                // connect inputs to the or gate
                sum.forEach((v, k) => {
                    if (isInversion(v)) {
                        wires.push({
                            from: negatedInputs[fromVariable(v)]!.outputs[0].id,
                            to: sumGate.inputs[k].id,
                        });
                    } else {
                        wires.push({
                            from: inputs[fromVariable(v)].id,
                            to: sumGate.inputs[k].id,
                        });
                    }
                });

                // add or gate to components
                components.push(sumGate);

                // connect or gate to and gate
                wires.push({
                    from: sumGate.outputs[0].id,
                    to: productGate.inputs[j].id,
                });
            });

            // add and gate to components
            components.push(productGate);

            // connect and gate to output
            wires.push({
                from: productGate.outputs[0].id,
                to: outputs[i].id,
            });

            return;
        }

        // sum of products
        const sum = expr.split("+");

        // handle single sums
        // directly connect and gate to output
        if (sum.length === 1) {
            const product = sum[0].split(/(?=\w)/);

            const productGate: SerializedComponent = {
                reified: reified++,
                permanent: false,
                type: "COMPONENT",
                name: "AND",
                inputs: product.map((v) => ({ id: id.next().value, activated: isInversion(v) })),
                outputs: [{ id: id.next().value, activated: product.every((v) => isInversion(v)) }],
                x: 350,
                y: i * 50 + 100,
                angle: 0,
                complementary: false,
                joins: product.length,
            };

            // connect inputs to the and gate
            product.forEach((v, k) => {
                if (isInversion(v)) {
                    wires.push({
                        from: negatedInputs[fromVariable(v)]!.outputs[0].id,
                        to: productGate.inputs[k].id,
                    });
                } else {
                    wires.push({
                        from: inputs[fromVariable(v)].id,
                        to: productGate.inputs[k].id,
                    });
                }
            });

            // add and gate to components
            components.push(productGate);

            // connect and gate to output
            wires.push({
                from: productGate.outputs[0].id,
                to: outputs[i].id,
            });

            return;
        }

        const sumGate: SerializedComponent = {
            reified: reified++,
            permanent: false,
            type: "COMPONENT",
            name: "OR",
            inputs: sum.map(() => ({ id: id.next().value, activated: false })),
            outputs: [{ id: id.next().value, activated: false }],
            x: 550,
            y: i * 50 + 100,
            angle: 0,
            complementary: false,
            joins: sum.length,
        };

        sum.forEach((o, j) => {
            const product = o.split(/(?=\w)/);

            const productGate: SerializedComponent = {
                reified: reified++,
                permanent: false,
                type: "COMPONENT",
                name: "AND",
                inputs: product.map((v) => ({ id: id.next().value, activated: isInversion(v) })),
                outputs: [{ id: id.next().value, activated: product.every((v) => isInversion(v)) }],
                x: 350,
                y: i * 50 + 100 + (product.length / 2 - j) * 50,
                angle: 0,
                complementary: false,
                joins: product.length,
            };

            // update or gate input
            sumGate.inputs[j].activated = productGate.outputs[0].activated;

            // connect inputs to the and gate
            product.forEach((v, k) => {
                if (isInversion(v)) {
                    wires.push({
                        from: negatedInputs[fromVariable(v)]!.outputs[0].id,
                        to: productGate.inputs[k].id,
                    });
                } else {
                    wires.push({
                        from: inputs[fromVariable(v)].id,
                        to: productGate.inputs[k].id,
                    });
                }
            });

            // add and gate to components
            components.push(productGate);

            // connect and gate to or gate
            wires.push({
                from: productGate.outputs[0].id,
                to: sumGate.inputs[j].id,
            });
        });

        // add or gate to components
        components.push(sumGate);

        // connect or gate to output
        wires.push({
            from: sumGate.outputs[0].id,
            to: outputs[i].id,
        });

        return;
    });

    return {
        settings: {
            "DraggingManager.snapToGrid": false,
        },
        components,
        wires,
    };
}
