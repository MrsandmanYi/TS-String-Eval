import { CmdBlock } from "../../command/CmdBlock";
import { CodeContext } from "../../context/CodeContext";
import { TernaryContext } from "../../context/TernaryContext";
import { Logger } from "../../utils/Logger";
import { TokenType } from "../TokenType";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

class TernarySubParser extends SubParser {

    public get parentCodeContext(): CodeContext {
        return this._params.parentCodeContext;
    }

    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let parentCodeContext = this.parentCodeContext;
        if (this.peekToken().tokenType == TokenType.Question) {
            let result = new TernaryContext(this.peekToken());
            result.condition = parentCodeContext;
            this.readToken();
            result.trueBranch = this.getCompoundCodeContext(false, cmdBlock);
            this.readExpectedToken(TokenType.Colon);
            result.falseBranch = this.getCompoundCodeContext(false, cmdBlock);
            out.setCodeContext(result);
        }
        else{
            Logger.log("TernaryParser...不是三元运算符，不处理", this.peekToken());
        }
        out.setCodeContext(parentCodeContext);
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

export const TernaryParser = new TernarySubParser();