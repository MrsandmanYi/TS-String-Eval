import { Token } from "../Token";
import { TokenType } from "../TokenType";
import { LexerResult, SubLexer } from "./SubLexer";

/**
 * 字符串词法分析器，提取字符串
 *      let str1 = "xxxxxx";
 *      let str2 = 'xxxxxx';
 *      let str3 = `xxxxxx`;
 *      let str4 = "xxxxxx\"xxxxxx";
 *      let str5 = 'xxxxxx\'xxxxxx';
 *      let str6 = `xxxxxx\`xxxxxx`;
 *      let str7 = `xxxxx${str1}xxxxx${111 + 222}xxxxx`;  // TODO ： 在字符串中进行逻辑处理，后续支持
 */
export class StringLexer extends SubLexer{
    public parse(lines: string[], lineIndex: number, columnIndex: number, out: LexerResult): boolean {
        let line = lines[lineIndex];
        let startChar = line[columnIndex];

        // 判断是否是字符串，支持单引号、双引号、反引号，支持转义字符，支持跨行
        if (startChar === "\"" || startChar === "'" || startChar === "`") {
            let str = "";
            let isEnd = false;
            let isEscape = false;
            let startColumn = columnIndex;
            let endColumn = columnIndex;
            let endLine = lineIndex;
            for (let i = lineIndex; i < lines.length; i++) {
                let line = lines[i];
                let j = i === lineIndex ? columnIndex + 1 : 0;
                for (; j < line.length; j++) {
                    let char = line[j];
                    if (isEscape) {
                        str += char;
                        isEscape = false;
                    }
                    else if (char === "\\") {
                        isEscape = true;
                        str += char;
                    }
                    else if (char === "\"" || char === "'" || char === "`") {
                        if (char === line[lineIndex]) {
                            isEnd = true;
                            endColumn = j;
                            endLine = i;
                            break;
                        }
                        else {
                            str += char;
                        }
                    }
                    else {
                        str += char;
                    }
                }

                if (isEnd) {
                    break;
                }
            }

            if (isEnd) {
                out.type = "String";
                out.text = str;
                out.line = lineIndex;
                out.endLine = endLine;
                out.startColumn = startColumn;
                out.endColumn = endColumn;
                out.tokens = [new Token(TokenType.String, str, lineIndex, startColumn, endColumn)];
                return true;
            }
        }

        
        return false;
    }
}