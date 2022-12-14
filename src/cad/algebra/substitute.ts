import { fromVariable, isInversion } from "./variables";

export function substitute(exprs: string[], using: boolean[]) {
    return exprs.map((expr) =>
        expr.startsWith("(") && expr.endsWith(")")
            ? expr
                  .slice(1, -1)
                  .split(")(")
                  .map((o) =>
                      o
                          .split("+")
                          .map((v) => (isInversion(v) ? !using[fromVariable(v)] : using[fromVariable(v)]))
                          .some(Boolean),
                  )
                  .every(Boolean)
            : expr
                  .split("+")
                  .map((o) =>
                      o
                          .split(/(?=\w)/)
                          .map((v) => (isInversion(v) ? !using[fromVariable(v)] : using[fromVariable(v)]))
                          .every(Boolean),
                  )
                  .some(Boolean),
    );
}
