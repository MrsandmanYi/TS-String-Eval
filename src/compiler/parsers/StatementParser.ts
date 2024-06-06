import { TokenType } from "../TokenType";
import { ExpressionParser } from "./ExpressionParser";
import { ParserResult, SubParser } from "./SubParser";
import { VarParser } from "./VarParser";

/**
 * 语句解析器
 * 用于解析单个语句
 * 语句包括: 变量声明、变量赋值、变量自增、变量自减 等等
 */
class StatementSubParser extends SubParser {
    
    protected parseCore(out: ParserResult): void {
        
        let token = this.readToken();
        if (token == null) {
            throw new Error("StatementParser: 语句解析错误, 未读取到 token");
        }

        switch (token.tokenType) {
            case TokenType.Var:
            case TokenType.Const:
                VarParser.parse(this._cmdBlock, out);
                break;

            case TokenType.Identifier:  // 变量赋值 var a = 1;
            case TokenType.Increment:   // 变量自增 a++;
            case TokenType.Decrement:   // 变量自减 b--;
                ExpressionParser.parse(this._cmdBlock, out);
                break;

            case TokenType.Public:
            case TokenType.Private:
            case TokenType.Protected:
                throw new Error("StatementParser: 语句解析错误, 访问修饰符不应出现在此处");
            default:
                throw new Error("StatementParser: 语句解析错误");
                
        }


    }

}

export const StatementParser = new StatementSubParser();