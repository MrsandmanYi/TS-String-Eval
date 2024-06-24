import { Token } from "./Token";
import { CommentLexer } from "./lexers/CommentLexer";
import { IdentifierLexer } from "./lexers/IdentifierLexer";
import { NumberLexer } from "./lexers/NumberLexer";
import { OperatorLexer } from "./lexers/OperatorLexer";
import { StringLexer } from "./lexers/StringLexer";
import { LexerResult, SubLexer } from './lexers/SubLexer';
import { SymbolLexer } from "./lexers/SymbolLexer";
import { tokenFilterFunc } from "./lexers/TokenFilter";


/**
 * Lexer 词法分析器
 */
export class Lexer {

    private _lines = new Array<string>();

    private _lineIndex = 0;    // 当前行数
    private _columnIndex = 0;  // 当前列数

    private _currentChar = "";

    private _tokens = new Array<Token>();
    public get tokens(): Array<Token> {
        return this._tokens;
    }

    private _subLexers = new Array<SubLexer>();  // 子词法分析器, 用于解析不同的语法标记

    constructor(input: string) {
        input = input.replace(/\r\n/g, "\n");
        this._lines = input.split("\n");
        for (let i = 0; i < this._lines.length; i++) {
            this._lines[i] = this._lines[i] + "\n";     // 补上换行符,用于标记行的结束
        }

        // 添加子词法分析器
        this._subLexers.push(new CommentLexer());   // 注释解析器，优先判断是否为注释
        this._subLexers.push(new StringLexer());    // 字符串解析器
        this._subLexers.push(new SymbolLexer());    // 符号解析器
        this._subLexers.push(new NumberLexer());    // 数字解析器
        this._subLexers.push(new OperatorLexer());  // 操作符解析器
        this._subLexers.push(new IdentifierLexer());// 标识符解析器
    }

    public parserTokens(): void {
        
        this._lineIndex = 0;
        this._columnIndex = 0;
        this._tokens = new Array<Token>();

        while (!this.isEndOfInput()) {
            if (this.isEndOfLine(this._columnIndex)) {
                this._lineIndex++;
                this._columnIndex = 0;
                continue;
            }

            this._currentChar = this.getCharAtCurrent();

            if (this.isWhiteSpace(this._currentChar)) {
                this._columnIndex++;
                continue;
            }

            let lexerResult : LexerResult = {
                type: "",
                text: "",
                line: 0,
                endLine: 0,
                startColumn: 0,
                endColumn: 0,
                tokens: [],
            };

            let isMatch = false;
            for (let lexer of this._subLexers) {
                let result = lexer.parse(this._lines, this._lineIndex, this._columnIndex, lexerResult);
                if (result) {
                    isMatch = true;
                    this._columnIndex = lexerResult.endColumn + 1;
                    this._lineIndex = lexerResult.endLine ? lexerResult.endLine : this._lineIndex;
                    break;
                }
            }

            if (!isMatch) {
                console.error(`无法识别的字符: ${this._currentChar} at ${this._lineIndex}:${this._columnIndex}`, 
                    this._lines[this._lineIndex].substring(this._columnIndex));
            }
            else {
                this._tokens.push(...lexerResult.tokens);
            }

        }

        this._tokens = tokenFilterFunc(this._tokens);
    }


    //#region 辅助方法

    private isWhiteSpace(char: string): boolean {
        return char === " " || char === "\t" || char === "\n" || char === "\r";
    }

    /**
     * 是否是输入的结尾
     */
    private isEndOfInput(): boolean {
        return this._lineIndex >= this._lines.length;
    }

    /**
     * 是否是行的结尾
     * @param columnIndex 
     */
    private isEndOfLine(columnIndex : number): boolean {
        return columnIndex >= this._lines[this._lineIndex].length;
    }

    private getChar(lineIndex : number, columnIndex : number): string {
        if (lineIndex >= this._lines.length) {
            return "";
        }

        let line = this._lines[lineIndex];
        if (columnIndex >= line.length) {
            return "";
        }
        return line[columnIndex];
    }

    private getCharAtCurrent(): string {
        return this.getChar(this._lineIndex, this._columnIndex);
    }

    private getSubString(lineIndex: number, columnIndex: number, length: number): string {
        if (lineIndex >= this._lines.length) {
            return "";
        }

        let line = this._lines[lineIndex];
        if (columnIndex >= line.length) {
            return "";
        }
        return line.substring(columnIndex, length);
    }

    //#endregion 
}


