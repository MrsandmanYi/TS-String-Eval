import { CmdBlock } from "../../command/CmdBlock";
import { ArrayContext } from "../../context/ArrayContext";
import { CodeContext } from "../../context/CodeContext";
import { TokenType } from "../TokenType";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

/**
 * 数组解析器
 * 语法：[元素1, 元素2, ...]
 */
class ArraySubParser extends SubParser {
    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let arrayContext: ArrayContext = new ArrayContext(this.peekToken());
        this.readExpectedToken(TokenType.LeftBracket);
        let token = this.peekToken();
        if(!token) throw new Error("ArraySubParser 数组定义不完整");
        while(this.peekToken()?.tokenType != TokenType.RightBracket){
            let token = this.peekToken();
            if(!token) throw new Error("ArraySubParser 数组定义不完整");
            if(token.tokenType == TokenType.RightBracket) break;

            arrayContext.addElement(this.getCompoundCodeContext(true, cmdBlock));
            token = this.peekToken();
            if(token?.tokenType == TokenType.Comma) {
                this.readExpectedToken(TokenType.Comma); // 逗号分隔
            }
            else if(token?.tokenType == TokenType.RightBracket) {
                break;
            }
            else {
                throw new Error("ArraySubParser 数组定义不完整");
            }
        }
        this.readExpectedToken(TokenType.RightBracket);
        out.setCodeContext(arrayContext);
    }

    private getCompoundCodeContext(checkColon: boolean = true, cmdBlock: CmdBlock | null): CodeContext {
        let parseResult = new ParserResult();
        CompoundCodeContextParser.parse(cmdBlock, parseResult, {checkColon: checkColon});
        if (!parseResult.codeContext) {
            throw new ParserError(null, "getCompoundCodeContext 无法获取 codeContext");
        }
        return parseResult.codeContext;
    }
}

export const ArrayParser = new ArraySubParser();
