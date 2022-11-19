export type BooleanTuple<L extends number, R extends boolean[] = []> = R["length"] extends L
    ? R
    : BooleanTuple<L, [...R, boolean]>;
