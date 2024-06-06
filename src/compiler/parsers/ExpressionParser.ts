import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { AssignContext } from "../../context/AssignContext";
import { InvokeFunctionContext } from "../../context/InvokeFunctionContext";
import { MemberContext, MemberMutator } from "../../context/MemberContext";
import { OperatorContext } from "../../context/OperatorContext";
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

}

export const ExpressionParser = new ExpressionSubParser();
