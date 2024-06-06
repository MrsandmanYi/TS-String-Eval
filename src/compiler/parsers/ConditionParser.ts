import { CodeContext } from "../../context/CodeContext";
import { TokenType } from "../TokenType";
import { CodeContextParser } from "./CodeContextParser";
import { StatementBlockParser } from "./StatementBlockParser";
import { ParserResult, SubParser } from "./SubParser";

/**
 * 条件解析器, 用于解析 if, else, while 等语句
 * 语法:
 *    while (condition) { ... }
 */
class ConditionSubParser extends SubParser {
    
    public get tokenType(): TokenType {
        return this._params.tokenType;
    }

    protected parseCore(out: ParserResult): void {
        let codeContext: CodeContext | null = null;
        if (!(this.tokenType == TokenType.Else)) {
            // 有()的情况
            this.readExpectedToken(TokenType.LeftParen);
            let parseResult = new ParserResult();
            CodeContextParser.parse(this.cmdBlock, parseResult);
            codeContext = parseResult.codeContext;
            this.readExpectedToken(TokenType.RightParen);
        }
        StatementBlockParser.parse(this._cmdBlock, out, { readLeftBrace: true, endTokenType: TokenType.RightBrace });
        out.codeContexts = [codeContext];
    }
    
}

export const ConditionParser = new ConditionSubParser();
