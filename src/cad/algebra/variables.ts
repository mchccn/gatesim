export const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
export const VARIABLE_NAMES = ALPHABET.repeat(3)
    .split("")
    .map((c, i) => `${c}${["", "ʹ", "ʺ"][Math.floor(i / ALPHABET.length)]}`);
export const UNICODE_MACRON_DIACRITIC = "\u0304";

export function variableFor(i: number, invert: boolean) {
    return invert ? VARIABLE_NAMES[i].replace(/^(\w)/, "$1" + UNICODE_MACRON_DIACRITIC) : VARIABLE_NAMES[i];
}

export function fromVariable(v: string) {
    return VARIABLE_NAMES.indexOf(v.replace(UNICODE_MACRON_DIACRITIC, ""));
}

export function invertVariable(v: string) {
    return v.replace(/^(\w)/, "$1" + UNICODE_MACRON_DIACRITIC);
}

export function isInversion(v: string) {
    return v.includes(UNICODE_MACRON_DIACRITIC);
}
