import { CmdBlock } from "../../command/CmdBlock";
import { CodeContext } from "../../context/CodeContext";
import { FunctionContext } from "../../context/FunctionContext";
import { InvokeFunctionContext } from "../../context/InvokeFunctionContext";
import { MemberContext } from "../../context/MemberContext";
import { TokenType } from "../TokenType";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

/**
 * 语法解析器: 函数调用
 */
class InvokeFunctionSubParser extends SubParser {
    
    private static FUNC_INDEX = 0;

    protected get member(): MemberContext {
        return this._params.member;
    }

    protected parseCore(out: ParserResult): void {
        let thisMember = this.member;
        let cmdBlock = this.cmdBlock;
        let context = new InvokeFunctionContext(this.peekToken());

        this.readExpectedToken(TokenType.LeftParen); // 读取左括号( ,参数列表开始

        let funcParams : CodeContext[] = [];      // 函数参数列表
        let token = this.peekToken();
        while (token.tokenType != TokenType.RightParen) {
            let member = this.getCodeContext(cmdBlock);
            // 如果是方法，则需要包装成一个MemberContext，并且Function要塞给当前的父作用域
            // 设置一个方法名称的唯一标识，用于后续的调用，
            // TODO： 这里暂时不做支持，可使用 let func = function(){}; 并且在方法中引用func作为参数来处理
            if (member instanceof FunctionContext) {
                throw new ParserError(token, "InvokeFunctionParser: 不支持直接传递方法作为参数,可使用 let func = function(){}; 并且在方法中引用func作为参数来处理");
                // let funcName = "__func__" + InvokeFunctionSubParser.FUNC_INDEX;
                // InvokeFunctionSubParser.FUNC_INDEX++;
                // member = new MemberContext(null, funcName);  
            }
            funcParams.push(member);
            token = this.peekToken();
            if (token.tokenType == TokenType.Comma) {
                this.readToken();
            }
            else if(token.tokenType == TokenType.RightParen) {
                break;
            }
            else {
                throw new ParserError(token, "InvokeFunctionParser: 函数调用参数解析错误");
            }
        }
        this.readExpectedToken(TokenType.RightParen); // 读取右括号 ) ,参数列表结束
        context.member = thisMember;
        context.args = funcParams;

        out.codeContexts = [context];
    }

    private getCodeContext(cmdBlock: CmdBlock | null): CodeContext {
        let parseResult = new ParserResult();
        CompoundCodeContextParser.parse(cmdBlock, parseResult);
        if (!parseResult.codeContext) {
            throw new ParserError(null, "FunctionParser getCodeContext 无法获取 codeContext");
        }
        return parseResult.codeContext;
    }


}

export const InvokeFunctionParser = new InvokeFunctionSubParser();