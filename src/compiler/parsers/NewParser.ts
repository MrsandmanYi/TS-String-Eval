import { CmdBlock } from "../../command/CmdBlock";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { CodeContext } from "../../context/CodeContext";
import { NewContext } from "../../context/NewContext";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

class NewSubParser extends SubParser {
    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let newContext: NewContext = new NewContext(this.getCompoundCodeContext(true, cmdBlock),this.peekToken());
        if (cmdBlock) {
            cmdBlock.addCommand(new Command(CommandType.New_CMD, newContext, this.peekToken()));
        }
        out.setCodeContext(newContext);
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

export const NewParser = new NewSubParser();