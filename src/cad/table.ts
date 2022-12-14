export function typeInTextarea(content: string, element: HTMLTextAreaElement) {
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const text = element.value;
    const before = text.slice(0, start);
    const after = text.slice(end, text.length);

    element.value = before + content + after;

    element.selectionStart = start + content.length;
    element.selectionEnd = start + content.length;

    return element.focus();
}

export function validTable(string: string) {
    const heuristics: { row?: number; message: string }[] = [];

    if (!string.trim()) return heuristics;

    const rows = string
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const definedParts = rows[0].split(":");

    const definedInputs = definedParts[0]?.length ?? 0;
    const definedOutputs = definedParts[1]?.length ?? 0;

    rows.forEach((row, i) => {
        const rowParts = row.split(":");

        if (rowParts.length !== 2) heuristics.push({ row: i + 1, message: "needs exactly 2 columns" });

        const rowInputs = rowParts[0]?.length ?? 0;
        const rowOutputs = rowParts[1]?.length ?? 0;

        if (rowInputs !== definedInputs) heuristics.push({ row: i + 1, message: `must have ${definedInputs} inputs` });

        if (rowOutputs !== definedOutputs)
            heuristics.push({ row: i + 1, message: `must have ${definedOutputs} outputs` });
    });

    if (rows.length !== Math.pow(2, definedInputs))
        heuristics.push({
            message: `${Math.pow(2, definedInputs)} entries are needed for ${definedInputs} inputs, but ${
                rows.length
            } were given`,
        });

    const inputs = rows.map((row) => row.split(":")?.[0]).filter(Boolean);

    if (inputs.length !== new Set(inputs).size)
        heuristics.push({
            message: "can't have duplicate entries",
        });

    return heuristics;
}

export function parseTable(string: string) {
    return string
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((row) => row.split(":").map((io) => io.split("").map((bit) => !!+bit)));
}
