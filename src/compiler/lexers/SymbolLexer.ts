import { Token } from "../Token";
import { TokenType } from "../TokenType";
import { LexerResult, SubLexer } from "./SubLexer";

/**
 * 符号解析器，(){}[];,.?:
 */
export class SymbolLexer extends SubLexer {
    
    public parse(lines: string[], lineIndex: number, columnIndex: number, out: LexerResult): boolean {
        
        let line = lines[lineIndex];
        let char = line[columnIndex];
        // 判断是否是符号
        let tokenType: TokenType = TokenType.None;
        switch (char) {
            case "(":
                tokenType = TokenType.LeftParen;
                break;
            case ")":
                tokenType = TokenType.RightParen;
                break;
            case "{":
                tokenType = TokenType.LeftBrace;
                break;
            case "}":
                tokenType = TokenType.RightBrace;
                break;
            case "[":
                tokenType = TokenType.LeftBracket;
                break;
            case "]":
                tokenType = TokenType.RightBracket;
                break;
            case ";":
                tokenType = TokenType.Semicolon;
                break;
            case ",":
                tokenType = TokenType.Comma;
                break;
            case ".":
                let nextChar = columnIndex + 1 < line.length ? line[columnIndex + 1] : "";
                let nextNextChar = columnIndex + 2 < line.length ? line[columnIndex + 2] : "";
                if (nextChar === "." && nextNextChar === ".") {
                    tokenType = TokenType.Spread;
                    throw Error("... 可变参数符号暂未支持~")
                }
                else {
                    tokenType = TokenType.Dot;
                }
                break;
            case "?":
                let nextChar2 = columnIndex + 1 < line.length ? line[columnIndex + 1] : "";
                if (nextChar2 === ".") {
                    columnIndex++;
                    char = ".";
                    tokenType = TokenType.Dot;      // ?. 语法糖，当做 . 处理
                }
                else {
                    tokenType = TokenType.Question;
                }
                break;
            case "!":
                let nextChar3 = columnIndex + 1 < line.length ? line[columnIndex + 1] : "";
                if (nextChar3 === ".") {
                    columnIndex++;
                    char = ".";
                    tokenType = TokenType.Dot;    // !. 语法糖，当做 . 处理
                }
                else {
                    tokenType = TokenType.None;
                }
                break;
            case ":":
                tokenType = TokenType.Colon;
                break;
        }

        if (tokenType !== TokenType.None) {
            out.type = "Symbol";
            out.text = char;
            out.line = lineIndex;
            out.startColumn = columnIndex;
            out.endColumn = columnIndex;
            out.tokens = [new Token(tokenType, char, lineIndex, columnIndex, columnIndex)];
            return true;
        }

        return false;
    }
}
