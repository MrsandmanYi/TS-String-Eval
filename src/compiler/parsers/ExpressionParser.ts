import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { AssignContext } from "../../context/AssignContext";
import { CodeContext } from "../../context/CodeContext";
import { InvokeFunctionContext } from "../../context/InvokeFunctionContext";
import { MemberContext, MemberMutator } from "../../context/MemberContext";
import { OperatorContext } from "../../context/OperatorContext";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

class ExpressionSubParser extends SubParser {
    
    protected parseCore(out: ParserResult): void {
        this.backToken();
        let token = this.peekToken();
        if (!token) {
            throw new Error("ExpressionSubParser 表达式不完整");
        }

        let expression = this.getCompoundCodeContext();
        if (expression instanceof InvokeFunctionContext) {
            // 函数调用, xxxx();
            this._cmdBlock?.addCommand(new Command(CommandType.Function_CMD, expression, this.peekToken()));
        }
        else if (expression instanceof MemberContext) {
            if ((expression as MemberContext).mutator != MemberMutator.None) {
                // 自增自减 i++, i--
                this._cmdBlock?.addCommand(new Command(CommandType.Resolve_CMD, expression, this.peekToken()));
            }
        }
        else if (expression instanceof AssignContext) {
            // 赋值 a = 1;
            this._cmdBlock?.addCommand(new Command(CommandType.Resolve_CMD, expression, this.peekToken()));
        }
        else if (expression instanceof OperatorContext) {
            // 运算 a + b;
            this._cmdBlock?.addCommand(new Command(CommandType.Resolve_CMD, expression, this.peekToken()));
        }
        else {
            throw new ParserError(token, "不支持的表达式" + token.tokenText);
        }
    }

    private getCompoundCodeContext(checkColon: boolean = true): CodeContext {
        let parseResult = new ParserResult();
        CompoundCodeContextParser.parse(this.cmdBlock, parseResult, {checkColon: checkColon});
        if (!parseResult.codeContext) {
            throw new ParserError(null, "getCompoundCodeContext 无法获取 codeContext");
        }
        return parseResult.codeContext;
    }

}

export const ExpressionParser = new ExpressionSubParser();
