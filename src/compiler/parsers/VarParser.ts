import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { TokenType } from "../TokenType";
import { StatementParser } from "./StatementParser";
import { ParserResult, SubParser } from "./SubParser";

/**
 * 变量声明解析器
 * 语法: var a = 1, b = 2, c = 3;
 * 语法: var a, b, c;
 * 语法: var a: int = 1, b: int = 2, c: int = 3;
 * 语法: var a: int, b: int, c: int;
 * */
class VarSubParser extends SubParser {

    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        while(true) {
            // 读取变量名
            let token = this.readExpectedToken(TokenType.Identifier);
            // 读取 冒号\等号\逗号
            let peekToken = this.peekToken();
            cmdBlock?.addCommand(new Command(CommandType.Let, token.tokenText, peekToken));
            // 处理有冒号的情况
            if (token.tokenType == TokenType.Colon) {
                this.readToken();
                this.readToken();
                peekToken = this.peekToken(); 
            }

            // 处理有等号的情况
            if (peekToken?.tokenType == TokenType.Assign) {
                this.backToken();
                this.backToken();
                if (this.peekToken().tokenType == TokenType.Colon) {
                    this.backToken();
                }
                else {
                    this.readToken();
                }
                
                // 解析表达式 (等号右边的表达式)
                StatementParser.parse(cmdBlock, out);
            }

            // 处理有逗号的情况
            peekToken = this.readToken();
            if (peekToken?.tokenType != TokenType.Comma) {
                this.backToken();
                break;
            }
        }

    }
    

}

export const VarParser = new VarSubParser();