import { CmdBlock } from "../../command/CmdBlock";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { CodeContext } from "../../context/CodeContext";
import { TokenType } from "../TokenType";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

class ReturnSubParser extends SubParser {
    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let token = this.peekToken();
        if (!token) {
            throw new Error("return 语句不完整");
        }
        if (token.tokenType == TokenType.RightBrace || token.tokenType == TokenType.Semicolon) {
            cmdBlock?.addCommand(new Command(CommandType.Return_CMD, null, this.peekToken()));
        }
        else{
            cmdBlock?.addCommand(new Command(CommandType.Return_CMD, this.getCompoundCodeContext(true, cmdBlock), this.peekToken()));
        }
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

export const ReturnParser = new ReturnSubParser();