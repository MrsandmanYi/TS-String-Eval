import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { ThrowContext } from "../../context/ThrowContext";
import { ParserResult, SubParser } from "./SubParser";

/**
 * throw 语句解析器
 * 语法：
 *  throw [表达式];
 */
class ThrowSubParser extends SubParser {
    protected parseCore(out: ParserResult): void {
        let throwContext: ThrowContext = new ThrowContext(this.peekToken());
        throwContext.exception = this.getCompoundCodeContext();
        this._cmdBlock?.addCommand(new Command(CommandType.Throw_CMD, throwContext, this.peekToken()));
    }
}

export const ThrowParser = new ThrowSubParser();