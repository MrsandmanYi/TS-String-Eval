import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { CodeContext } from "../../context/CodeContext";
import { ThrowContext } from "../../context/ThrowContext";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

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

    private getCompoundCodeContext(checkColon: boolean = true): CodeContext {
        let parseResult = new ParserResult();
        CompoundCodeContextParser.parse(this.cmdBlock, parseResult, {checkColon: checkColon});
        if (!parseResult.codeContext) {
            throw new ParserError(null, "getCompoundCodeContext 无法获取 codeContext");
        }
        return parseResult.codeContext;
    }
}

export const ThrowParser = new ThrowSubParser();