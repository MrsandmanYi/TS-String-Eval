import { TokenType } from "./TokenType";

// 语法标记
export class Token {
    
    // 语法标记类型
    protected _tokenType: TokenType = TokenType.None;
    public get tokenType(): TokenType {
        return this._tokenType;
    }

    protected _tokenName: string = "";
    public get tokenName(): string {
        return this._tokenName;
    }

    // 语法标记文本
    protected _tokenText: string = "";
    public get tokenText(): string {
        return this._tokenText;
    }

    // 语法标记所在行数
    protected _line: number = 0;
    public get line(): number {
        return this._line;
    }

    // 语法标记所在列数
    protected _startColumn: number = 0;
    public get startColumn(): number {
        return this._startColumn;
    }

    // 语法标记所在列数
    protected _endColumn: number = 0;
    public get endColumn(): number {
        return this._endColumn;
    }

    constructor(tokenType: TokenType, tokenText: string, line: number, startColumn: number, endColumn: number) {
        this._tokenType = tokenType;
        this._tokenName = TokenType[tokenType];
        this._tokenText = tokenText;
        this._line = line;
        this._startColumn = startColumn;
        this._endColumn = endColumn;
    }

}
