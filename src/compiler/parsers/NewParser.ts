import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { CodeContext } from "../../context/CodeContext";
import { NewContext } from "../../context/NewContext";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

class NewSubParser extends SubParser {
    protected parseCore(out: ParserResult): void {
        let newContext: NewContext = new NewContext(this.getCompoundCodeContext(),this.peekToken());
        if (this._cmdBlock) {
            this._cmdBlock.addCommand(new Command(CommandType.New_CMD, newContext, this.peekToken()));
        }
        out.setCodeContext(newContext);
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

export const NewParser = new NewSubParser();