import { CmdBlock } from "../../command/CmdBlock";
import { CmdBlockType } from "../../command/CmdBlockType";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { IfContext } from "../../context/IfContext";
import { TokenType } from "../TokenType";
import { ConditionBlock } from "../base/ConditionBlock";
import { ConditionParser } from "./ConditionParser";
import { ParserResult, SubParser } from "./SubParser";

class IfSubParser extends SubParser {


    protected parseCore(out: ParserResult): void {
        
        let ifContext: IfContext = new IfContext(this.peekToken());
        // 解析if条件
        let ifCmdBlock = new CmdBlock(CmdBlockType.If, this._cmdBlock);
        ConditionParser.parse(ifCmdBlock, out, { tokenType: TokenType.If });
        ifContext.ifCondition = new ConditionBlock(out.codeContexts[0], ifCmdBlock);
        // 解析elseif条件
        while (true) {
            let token = this.readToken();
            if (token?.tokenType == TokenType.Else) {
                if (this.peekToken()?.tokenType == TokenType.If) {
                    // else if
                    this.readToken();
                    let elseIfCmdBlock = new CmdBlock(CmdBlockType.If, this._cmdBlock);
                    ConditionParser.parse(elseIfCmdBlock, out, { tokenType: TokenType.ElseIf });
                    ifContext.addElseIf(new ConditionBlock(out.codeContexts[0], elseIfCmdBlock));
                }
                else{
                    this.backToken();
                    break;
                }
            }
            else{
                this.backToken();
                break;
            }
        }

        // 解析else
        if (this.peekToken()?.tokenType == TokenType.Else) {
            this.readToken();
            let elseCmdBlock = new CmdBlock(CmdBlockType.If, this._cmdBlock);
            ConditionParser.parse(elseCmdBlock, out, { tokenType: TokenType.Else });
            ifContext.elseCondition = new ConditionBlock(out.codeContexts[0], elseCmdBlock);
        }

        // 添加if命令
        this._cmdBlock?.addCommand(new Command(CommandType.If_CMD, ifContext, this.peekToken()));

        out.codeContexts = [ifContext];
    }

}

export const IfParser = new IfSubParser();