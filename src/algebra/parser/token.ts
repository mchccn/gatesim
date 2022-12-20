import { ConstructorClone } from "./derive/clone";
import { derive } from "./derive/decorator";

export enum TokenType {
    LeftParen = "LeftParen",
    RightParen = "RightParen",
    LeftBrack = "LeftBrack",
    RightBrack = "RightBrack",
    LeftBrace = "LeftBrace",
    RightBrace = "RightBrace",

    Variable = "Variable",

    Escape = "Escape",

    Not = "Not",
    Or = "Or",
    Nor = "Nor",
    And = "And",
    Nand = "Nand",
    Xor = "Xor",
    Xnor = "Xnor",

    True = "True",
    False = "False",

    Eof = "Eof",
}

@derive(ConstructorClone)
export class Token implements ConstructorClone {
    constructor(readonly type: TokenType, readonly lexeme: string, readonly line: number, readonly col: number) {}

    clone(): this {
        return new Token(this.type, this.lexeme, this.line, this.col) as this;
    }
}
