import { CmdBlock } from "../../command/CmdBlock";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { CodeContext } from "../../context/CodeContext";
import { DeleteContext } from "../../context/DeleteContext";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

class DeleteSubParser extends SubParser {
    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let deleteContext: DeleteContext = new DeleteContext(this.getCompoundCodeContext(true, cmdBlock),this.peekToken());
        if (cmdBlock) {
            cmdBlock.addCommand(new Command(CommandType.Delete_CMD, deleteContext, this.peekToken()));
        }
        out.setCodeContext(deleteContext);
    }

    private getCompoundCodeContext(checkColon: boolean = true, cmdBlock: CmdBlock | null = null): CodeContext {
        let parseResult = new ParserResult();
        CompoundCodeContextParser.parse(cmdBlock, parseResult, {checkColon: checkColon});
        if (!parseResult.codeContext) {
            throw new ParserError(null, "getCompoundCodeContext 无法获取 codeContext");
        }
        return parseResult.codeContext;
    }
}

export const DeleteParser = new DeleteSubParser();