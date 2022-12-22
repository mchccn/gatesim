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

    clone() {
        return new Token(this.type, this.lexeme, this.line, this.col);
    }

    static spoofed(type: TokenType) {
        return new Token(type, lexemeForTokenType.get(type) ?? "\0", 0, 0);
    }
}

export const tokenTypeForKeyword: ReadonlyMap<string, TokenType> = new Map([
    ["true", TokenType.True],
    ["false", TokenType.False],
    ["not", TokenType.Not],
    ["or", TokenType.Or],
    ["nor", TokenType.Nor],
    ["and", TokenType.And],
    ["nand", TokenType.Nand],
    ["xor", TokenType.Xor],
    ["xnor", TokenType.Xnor],
]);

export const lexemeForTokenType: ReadonlyMap<TokenType, string> = new Map(
    [...tokenTypeForKeyword].map(([k, v]) => [v, k]),
);

export const symbolForTokenType: ReadonlyMap<TokenType, string> = new Map([
    [TokenType.True, "1"],
    [TokenType.False, "0"],
    [TokenType.Not, "¬"],
    [TokenType.Or, "∨"],
    [TokenType.Nor, "⊽"],
    [TokenType.And, "∧"],
    [TokenType.Nand, "⊼"],
    [TokenType.Xor, "⊕"],
    [TokenType.Xnor, "⊙"],
]);

export const tokenNestingPairs: ReadonlyMap<TokenType, TokenType> = new Map(
    [
        [TokenType.RightParen, TokenType.LeftParen],
        [TokenType.RightBrack, TokenType.LeftBrack],
        [TokenType.RightBrace, TokenType.LeftBrace],
    ].flatMap(([k, v]) => [
        [k, v],
        [v, k],
    ]),
);
