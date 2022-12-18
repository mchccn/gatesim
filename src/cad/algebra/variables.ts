export const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
// repeats 3 times to add primes and double primes
export const VARIABLE_NAMES = ALPHABET.repeat(3)
    .split("")
    .map((c, i) => `${c}${["", "ʹ", "ʺ"][Math.floor(i / ALPHABET.length)]}`);
/** used to negate something, "ā" */
export const UNICODE_MACRON_DIACRITIC = "\u0304";

/** converts index of input into variable name */
export function variableFor(i: number, invert: boolean) {
    return invert ? VARIABLE_NAMES[i].replace(/^(\w)/, "$1" + UNICODE_MACRON_DIACRITIC) : VARIABLE_NAMES[i];
}

/** converts variable name into index of input */
export function fromVariable(v: string) {
    return VARIABLE_NAMES.indexOf(v.replace(UNICODE_MACRON_DIACRITIC, ""));
}

/** changes a variable into its inverted version (does not toggle) */
export function invertVariable(v: string) {
    return v.replace(/^(\w)/, "$1" + UNICODE_MACRON_DIACRITIC);
}

/** checks if the variable is an inverted version */
export function isInversion(v: string) {
    return v.includes(UNICODE_MACRON_DIACRITIC);
}
