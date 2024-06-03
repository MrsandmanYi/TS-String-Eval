import { LexUtils } from "../../utils/LexUtils";
import { Token } from "../Token";
import { TokenType } from "../TokenType";
import { LexerResult, SubLexer } from "./SubLexer";

/**
 * 标识符词法分析器
 */
export class IdentifierLexer extends SubLexer {
    public parse(lines: string[], lineIndex: number, columnIndex: number, out: LexerResult): boolean {
        let line = lines[lineIndex];
        let char = line[columnIndex];

        // 判断是否是标识符，不支持跨行
        if (this.isIdentifierCharHeader(char)) {
            let identifier = "";
            let endColumn = columnIndex;
            for (let i = columnIndex; i < line.length; i++) {
                let char = line[i];
                if (this.isIdentifierChar(char)) {
                    identifier += char;
                    endColumn = i;
                }
                else {
                    break;
                }
            }
            
            out.type = "Identifier";
            out.text = identifier;
            out.line = lineIndex;
            out.startColumn = columnIndex;
            out.endColumn = endColumn;
            let tokenType: TokenType = TokenType.Identifier;

            switch (identifier) {
                case "var":
                    tokenType = TokenType.Let;
                    break;
                case "let":
                    tokenType = TokenType.Let;
                    break;
                case "const":
                    tokenType = TokenType.Const;
                    break;
                case "function":
                    tokenType = TokenType.Function;
                    break;
                case "return":
                    tokenType = TokenType.Return;
                    break;
                case "if":
                    tokenType = TokenType.If;
                    break;
                case "else":
                    tokenType = TokenType.Else;
                    break;
                case "for":
                    tokenType = TokenType.For;
                    break;
                case "while":
                    tokenType = TokenType.While;
                    break;
                case "break":
                    tokenType = TokenType.Break;
                    break;
                case "continue":
                    tokenType = TokenType.Continue;
                    break;
                case "true":
                    tokenType = TokenType.True;
                    break;
                case "false":
                    tokenType = TokenType.False;
                    break;
                case "null":
                case "Null":
                    tokenType = TokenType.Null;
                    break;
                case "undefined":
                    tokenType = TokenType.Undefined;
                    break;
                case "new":
                    tokenType = TokenType.New;
                    break;
                case "class":
                    tokenType = TokenType.Class;
                    break;
                case "extends":
                    tokenType = TokenType.Extends;
                    break;
                case "this":
                    tokenType = TokenType.This;
                    break;
                case "super":
                    tokenType = TokenType.Super;
                    break;
                case "import":
                    tokenType = TokenType.Import;
                    break;
                case "from":
                    tokenType = TokenType.From;
                    break;
                case "as":
                    tokenType = TokenType.As;
                    break;
                case "export":
                    tokenType = TokenType.Export;
                    break;
                case "default":
                    tokenType = TokenType.Default;
                    break;
                case "try":
                    tokenType = TokenType.Try;
                    break;
                case "catch":
                    tokenType = TokenType.Catch;
                    break;
                case "finally":
                    tokenType = TokenType.Finally;
                    break;
                case "throw":
                    tokenType = TokenType.Throw;
                    break;
                case "switch":
                    tokenType = TokenType.Switch;
                    break;
                case "case":
                    tokenType = TokenType.Case;
                    break;
                case "default":
                    tokenType = TokenType.Default;
                    break;
                default:
                    break;
            }

            let token = new Token(tokenType, identifier, lineIndex, columnIndex, endColumn);
            out.tokens = [token];
            return true;
        }

        return false;
    }
    private isIdentifierCharHeader(char: string): boolean {
        return LexUtils.isLetter(char) || char === "_" || char === "$";
    }
    private isIdentifierChar(char: string): boolean {
        return LexUtils.isLetterOrDigit(char) || char === "_" || char === "$";
    }
}