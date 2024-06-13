import { Token } from "../Token";
import { TokenType } from "../TokenType";
import { LexerResult, SubLexer } from "./SubLexer";

/**
 * 数字词法分析器
 */
export class NumberLexer extends SubLexer{
    public parse(lines: string[], lineIndex: number, columnIndex: number, out: LexerResult): boolean {
        let line = lines[lineIndex];
        let char = line[columnIndex];
        let nextChar = columnIndex + 1 < line.length ? line[columnIndex + 1] : "";

        // 判断是否是数字，支持整数、小数、Hex，不支持跨行
        let isNegative = char == "-" && nextChar >= "0" && nextChar <= "9";
        let isPositive = char == "+" && nextChar >= "0" && nextChar <= "9";
        
        if ((char >= "0" && char <= "9") || isNegative || isPositive) {
            let num = "";
            let startColumn = columnIndex;
            if (isNegative || isPositive) {
                num += char;
                columnIndex++;
            }
            let endColumn = columnIndex;
            for (let i = columnIndex; i < line.length; i++) {
                let char = line[i];
                if ((char >= "0" && char <= "9") || char === "." ||
                 (char >= "a" && char <= "f") || (char >= "A" && char <= "F")) {
                    num += char;
                    endColumn = i;
                }
                else {
                    break;
                }
            }

            out.type = "Number";
            out.text = num;
            out.line = lineIndex;
            out.startColumn = startColumn;
            out.endColumn = endColumn;

            if(isNegative){
                out.tokens = [new Token(TokenType.Negative, num, lineIndex, startColumn, endColumn)];
            }
            else if(isPositive){
                out.tokens = [new Token(TokenType.Positive, num, lineIndex, startColumn, endColumn)];
            }
            else{
                out.tokens = [new Token(TokenType.Number, num, lineIndex, startColumn, endColumn)];
            }

            return true;
        }
        return false;
    }
}