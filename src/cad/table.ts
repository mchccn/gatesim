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
    const heuristics = [];

    const rows = string.split("\n");

    const parts = rows[0].split(":");

    if (parts.length > 2) heuristics.push({ row: 1, message: "more than two columns" });

    return heuristics;
}
