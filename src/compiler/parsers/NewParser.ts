import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { NewContext } from "../../context/NewContext";
import { ParserResult, SubParser } from "./SubParser";

class NewSubParser extends SubParser {
    protected parseCore(out: ParserResult): void {
        let newContext: NewContext = new NewContext(this.getCompoundCodeContext(),this.peekToken());
        if (this._cmdBlock) {
            this._cmdBlock.addCommand(new Command(CommandType.New_CMD, newContext, this.peekToken()));
        }
        out.setCodeContext(newContext);
    }
}

export const NewParser = new NewSubParser();