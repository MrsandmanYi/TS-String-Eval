import { Token } from "../Token";
import { TokenType } from "../TokenType";
import { LexerResult, SubLexer } from "./SubLexer";

/**
 * 运算符词法分析器
 */
export class OperatorLexer extends SubLexer{

    /**
     * 运算符词法分析, 识别运算符
     * @param lines 行数组
     * @param lineIndex 行索引
     * @param columnIndex 列索引
     * @param out 输出 {type: string, text: string, line: number, startColumn: number, endColumn: number}
     * @returns 是否识别成功
     */
    public parse(lines : string[], lineIndex : number, columnIndex : number, out : LexerResult): boolean {
        let line: string = lines[lineIndex];
        let char: string = line[columnIndex];
        let nextChar: string = columnIndex + 1 < line.length ? line[columnIndex + 1] : "";
        let nextNextChar: string = columnIndex + 2 < line.length ? line[columnIndex + 2] : "";

        //#region +、+=、-、-=、/、/=、%、%=、*、*=、 ++、-- 运算符
        if (char === "+") {
            if (nextChar === "=") {
                out.type = "Operator";
                out.text = "+=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.AddAssign, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else if (nextChar === "+") {
                out.type = "Operator";
                out.text = "++";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.Increment, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "+";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.Add, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        else if (char === "-") {
            if (nextChar === "=") {
                out.type = "Operator";
                out.text = "-=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.SubAssign, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else if (nextChar === "-") {
                out.type = "Operator";
                out.text = "--";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.Decrement, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "-";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.Sub, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        else if (char === "/") {
            if (nextChar === "=") {
                out.type = "Operator";
                out.text = "/=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.DivAssign, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else if(nextChar === "/" || nextChar === "*"){
                // 判断为注释
                
            }
            else{
                out.type = "Operator";
                out.text = "/";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.Div, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        else if (char === "*") {
            if (nextChar === "=") {
                out.type = "Operator";
                out.text = "*=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.MulAssign, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "*";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.Mul, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        else if (char === "%") {
            if (nextChar === "=") {
                out.type = "Operator";
                out.text = "%=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.ModAssign, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "%";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.Mod, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        //#endregion

        //#region 位运算符 与 && 或 ||
        else if (char === "&") {
            if (nextChar === "=") {
                out.type = "Operator";
                out.text = "&=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.AssignBitwiseAnd, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else if (nextChar === "&") {
                out.type = "Operator";
                out.text = "&&";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.And, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "&";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.BitwiseAnd, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        else if (char === "|") {
            if (nextChar === "=") {
                out.type = "Operator";
                out.text = "|=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.AssignBitwiseOr, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else if (nextChar === "|") {
                out.type = "Operator";
                out.text = "||";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.Or, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "|";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.BitwiseOr, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        else if (char === "^") {
            if (nextChar === "=") {
                out.type = "Operator";
                out.text = "^=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.AssignBitwiseXor, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "^";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.BitwiseXor, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        else if (char === "~") {
            if (nextChar === "=") {
                out.type = "Operator";
                out.text = "~=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.AssignBitwiseNot, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "~";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.BitwiseNot, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        //#endregion

        //#region <<、<<=、>>、>>=、>、>=、<、<=
        else if (char === "<") {
            if (nextChar === "<") {
                if (nextNextChar === "=") {
                    out.type = "Operator";
                    out.text = "<<=";
                    out.line = lineIndex;
                    out.startColumn = columnIndex;
                    out.endColumn = columnIndex + 2;
                    out.tokens = [new Token(TokenType.AssignShiftLeft, out.text, out.line, out.startColumn, out.endColumn)];
                    return true;
                }
                else{
                    out.type = "Operator";
                    out.text = "<<";
                    out.line = lineIndex;
                    out.startColumn = columnIndex;
                    out.endColumn = columnIndex + 1;
                    out.tokens = [new Token(TokenType.ShiftLeft, out.text, out.line, out.startColumn, out.endColumn)];
                    return true;
                }
            }
            else if (nextChar === "=") {
                out.type = "Operator";
                out.text = "<=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.LessEqual, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "<";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.Less, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        else if (char === ">") {
            if (nextChar === ">") {
                if (nextNextChar === "=") {
                    out.type = "Operator";
                    out.text = ">>=";
                    out.line = lineIndex;
                    out.startColumn = columnIndex;
                    out.endColumn = columnIndex + 2;
                    out.tokens = [new Token(TokenType.AssignShiftRight, out.text, out.line, out.startColumn, out.endColumn)];
                    return true;
                }
                else{
                    out.type = "Operator";
                    out.text = ">>";
                    out.line = lineIndex;
                    out.startColumn = columnIndex;
                    out.endColumn = columnIndex + 1;
                    out.tokens = [new Token(TokenType.ShiftRight, out.text, out.line, out.startColumn, out.endColumn)];
                    return true;
                }
            }
            else if (nextChar === "=") {
                out.type = "Operator";
                out.text = ">=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.GreaterEqual, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = ">";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.Greater, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        //#endregion

        //#region =、==、===
        else if (char === "=") {
            if (nextChar === "=") {
                if (nextNextChar === "=") {
                    out.type = "Operator";
                    out.text = "===";
                    out.line = lineIndex;
                    out.startColumn = columnIndex;
                    out.endColumn = columnIndex + 2;
                    out.tokens = [new Token(TokenType.Equal, out.text, out.line, out.startColumn, out.endColumn)];
                    return true;
                }
                else{
                    out.type = "Operator";
                    out.text = "==";
                    out.line = lineIndex;
                    out.startColumn = columnIndex;
                    out.endColumn = columnIndex + 1;
                    out.tokens = [new Token(TokenType.Equal, out.text, out.line, out.startColumn, out.endColumn)];
                    return true;
                }
            }
            else if (nextChar === ">") {
                out.type = "Operator";
                out.text = "=>";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.ArrowFunction, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "=";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.Assign, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        //#endregion
        
        //#region !、!=、!==、!!
        else if (char === "!") {
            if (nextChar === "=") {
                if (nextNextChar === "=") {
                    out.type = "Operator";
                    out.text = "!==";
                    out.line = lineIndex;
                    out.startColumn = columnIndex;
                    out.endColumn = columnIndex + 2;
                    out.tokens = [new Token(TokenType.NotEqual, out.text, out.line, out.startColumn, out.endColumn)];
                    return true;
                }
                else{
                    out.type = "Operator";
                    out.text = "!=";
                    out.line = lineIndex;
                    out.startColumn = columnIndex;
                    out.endColumn = columnIndex + 1;
                    out.tokens = [new Token(TokenType.NotEqual, out.text, out.line, out.startColumn, out.endColumn)];
                    return true;
                }
            }
            else if (nextChar === "!") {
                out.type = "Operator";
                out.text = "!!";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex + 1;
                out.tokens = [new Token(TokenType.NotNot, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
            else{
                out.type = "Operator";
                out.text = "!";
                out.line = lineIndex;
                out.startColumn = columnIndex;
                out.endColumn = columnIndex;
                out.tokens = [new Token(TokenType.Not, out.text, out.line, out.startColumn, out.endColumn)];
                return true;
            }
        }
        //#endregion

        return false;
    }

}
