import { Token, TokenType } from "./token";

export class Scanner {
    static #keywords: ReadonlyMap<string, TokenType> = new Map([
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

    static lexemeForKeyword: ReadonlyMap<TokenType, string> = new Map([...this.#keywords].map(([k, v]) => [v, k]));

    static symbolForKeyword: ReadonlyMap<TokenType, string> = new Map([
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

    static nestingPairs: ReadonlyMap<TokenType, TokenType> = new Map(
        [
            [TokenType.RightParen, TokenType.LeftParen],
            [TokenType.RightBrack, TokenType.LeftBrack],
            [TokenType.RightBrace, TokenType.LeftBrace],
        ].flatMap(([k, v]) => [
            [k, v],
            [v, k],
        ]),
    );

    static #escapes: ReadonlyMap<string, TokenType> = new Map([
        ["true", TokenType.True],
        ["t", TokenType.True],
        ["top", TokenType.True],
        ["false", TokenType.False],
        ["f", TokenType.False],
        ["perp", TokenType.False],
        ["not", TokenType.Not],
        ["neg", TokenType.Not],
        ["sim", TokenType.Not],
        ["or", TokenType.Or],
        ["plus", TokenType.Or],
        ["pipe", TokenType.Or],
        ["parallel", TokenType.Or],
        ["nor", TokenType.Nor],
        ["and", TokenType.And],
        ["amp", TokenType.And],
        ["nand", TokenType.Nand],
        ["xor", TokenType.Xor],
        ["oplus", TokenType.Xor],
        ["veebar", TokenType.Xor],
        ["nequiv", TokenType.Xor],
        ["xnor", TokenType.Xnor],
        ["odot", TokenType.Xnor],
    ]);

    readonly #tokens: Token[] = [];

    #start = 0;
    #current = 0;
    #line = 1;
    #col = 1;

    constructor(readonly source: string) {}

    scanTokens() {
        while (!this.#isAtEnd()) {
            this.#start = this.#current;

            this.#scanToken();
        }

        this.#addToken(TokenType.Eof, "\0");

        return this.#tokens;
    }

    #scanToken() {
        const c = this.#advance();

        const lexmap = new Map([
            ["(", () => this.#implicitMultiply(TokenType.LeftParen)],
            [")", () => this.#addToken(TokenType.RightParen)],
            ["[", () => this.#implicitMultiply(TokenType.LeftBrack)],
            ["]", () => this.#addToken(TokenType.RightBrack)],
            ["{", () => this.#implicitMultiply(TokenType.LeftBrace)],
            ["}", () => this.#addToken(TokenType.RightBrace)],
            [" ", () => this.#col++],
            ["\r", () => this.#col++],
            ["\t", () => this.#col++],
            ["\v", () => this.#col++],
            ["\f", () => this.#col++],
            ["\n", () => (this.#line++, (this.#col = 1))],
            ["¬", () => this.#addToken(TokenType.Not, "not", true)],
            ["+", () => this.#addToken(TokenType.Or, "or", true)],
            ["|", () => this.#addToken(TokenType.Or, "or", true)],
            ["∨", () => this.#addToken(TokenType.Or, "or", true)],
            ["∥", () => this.#addToken(TokenType.Or, "or", true)],
            ["⊽", () => this.#addToken(TokenType.Nor, "nor", true)],
            ["*", () => this.#addToken(TokenType.And, "and", true)],
            ["&", () => this.#addToken(TokenType.And, "and", true)],
            ["∧", () => this.#addToken(TokenType.And, "and", true)],
            ["⊕", () => this.#addToken(TokenType.Xor, "xor", true)],
            ["⊻", () => this.#addToken(TokenType.Xor, "xor", true)],
            ["⊙", () => this.#addToken(TokenType.Xnor, "xnor", true)],
            ["⊼", () => this.#addToken(TokenType.Nand, "nand", true)],
            ["1", () => this.#implicitMultiply(TokenType.True, "true", true)],
            ["0", () => this.#implicitMultiply(TokenType.False, "false", true)],
            ["\\", () => this.#processEscapeSequence()],
            ["%", () => this.#skipComment()],
        ]);

        (
            lexmap.get(c) ??
            (() => {
                if (this.#isSymbolChar(c)) return this.#symbol();

                throw new SyntaxError();
            })
        )();
    }

    #symbol() {
        while (this.#isSymbolChar(this.#peek())) this.#advance();

        const text = this.source.substring(this.#start, this.#current);

        const type = Scanner.#keywords.get(text);

        if (!type) {
            // transform into products
            const parts = text.split(/(?=[01a-zA-Z])/);

            return parts.forEach((lexeme, i) => {
                if (i) this.#addToken(TokenType.And, "and", true);

                if (lexeme === "0") return this.#implicitMultiply(TokenType.False, lexeme);

                if (lexeme === "1") return this.#implicitMultiply(TokenType.True, lexeme);

                return this.#implicitMultiply(TokenType.Variable, lexeme);
            });
        }

        // unary operators should have implicit multiplication
        if (type === TokenType.Not) return this.#implicitMultiply(type);

        return this.#addToken(type);
    }

    #processEscapeSequence() {
        while (this.#isSymbolChar(this.#peek())) this.#advance();

        // add one to skip over backslash
        const text = this.source.substring(this.#start + 1, this.#current);

        const type = Scanner.#escapes.get(text);

        // unrecognized escape sequence
        if (!type) throw new SyntaxError();

        // lookup text by token type
        const lexeme = Scanner.lexemeForKeyword.get(type)!;

        if (type === TokenType.Not) return this.#implicitMultiply(type, lexeme, true);

        return this.#addToken(type, lexeme, true);
    }

    #skipComment() {
        // comments start with '%' and end with '%'
        while (this.#peek() !== "%" && !this.#isAtEnd()) this.#advance();

        this.#advance();
    }

    // insert a multiplication before opening groups
    #implicitMultiply(type: TokenType, lexeme?: string, artificiallyInserted?: boolean) {
        if (
            this.#tokens.length &&
            ![
                TokenType.LeftParen,
                TokenType.LeftBrack,
                TokenType.LeftBrace,
                TokenType.Not,
                TokenType.Or,
                TokenType.Nor,
                TokenType.And,
                TokenType.Nand,
                TokenType.Xor,
                TokenType.Xnor,
            ].includes(this.#tokens.at(-1)?.type ?? TokenType.Eof)
        )
            this.#addToken(TokenType.And, "and", true);

        return this.#addToken(type, lexeme, artificiallyInserted);
    }

    #peek() {
        return this.source[this.#current] ?? "\0";
    }

    #advance() {
        return this.source[this.#current++];
    }

    #isSymbolChar(c: string) {
        // allow primes and double primes
        return /^[01a-zA-Z]$/.test(c) || c === "ʹ" || c === "ʺ";
    }

    #addToken(type: TokenType, text = this.source.substring(this.#start, this.#current), artificiallyInserted = false) {
        this.#tokens.push(new Token(type, text, this.#line, this.#col));

        // if it was artificially inserted we shouldn't change the column
        if (!artificiallyInserted) this.#col += text.length;
    }

    #isAtEnd() {
        return this.#current >= this.source.length;
    }
}
