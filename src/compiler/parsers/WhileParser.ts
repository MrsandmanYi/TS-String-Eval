import { CmdBlock } from "../../command/CmdBlock";
import { CmdBlockType } from "../../command/CmdBlockType";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { WhileContext } from "../../context/WhileContext";
import { TokenType } from "../TokenType";
import { ConditionBlock } from "../base/ConditionBlock";
import { ConditionParser } from './ConditionParser';
import { ParserResult, SubParser } from "./SubParser";

/**
 * While 解析器
 * 语法:
 *   while (condition) { ... }
 */
class WhileSubParser extends SubParser {
        
    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let whileContext: WhileContext = new WhileContext(this.peekToken());
        // 解析条件
        let whileCmdBlock = new CmdBlock(CmdBlockType.While, cmdBlock);
        ConditionParser.parse(whileCmdBlock, out, { tokenType: TokenType.While });
        whileContext.whileCondition = new ConditionBlock(out.codeContext, whileCmdBlock);
        cmdBlock?.addCommand(new Command(CommandType.While_CMD, whileContext, this.peekToken()));
    }

}

export const WhileParser = new WhileSubParser();
