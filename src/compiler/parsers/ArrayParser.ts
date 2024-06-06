import { ArrayContext } from "../../context/ArrayContext";
import { TokenType } from "../TokenType";
import { ParserResult, SubParser } from "./SubParser";

/**
 * 数组解析器
 * 语法：[元素1, 元素2, ...]
 */
class ArraySubParser extends SubParser {
    protected parseCore(out: ParserResult): void {
        let arrayContext: ArrayContext = new ArrayContext(this.peekToken());
        this.readExpectedToken(TokenType.LeftBracket);
        let token = this.peekToken();
        if(!token) throw new Error("ArraySubParser 数组定义不完整");
        while(this.peekToken()?.tokenType != TokenType.RightBracket){
            let token = this.peekToken();
            if(!token) throw new Error("ArraySubParser 数组定义不完整");
            if(token.tokenType == TokenType.RightBracket) break;

            arrayContext.addElement(this.getCompoundCodeContext());
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
}

export const ArrayParser = new ArraySubParser();
