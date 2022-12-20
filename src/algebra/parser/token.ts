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

export class Token {
    constructor(readonly type: TokenType, readonly lexeme: string, readonly line: number, readonly col: number) {}
}
