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
        if (this.peekToken().tokenType == TokenType.Question) {
            let result = new TernaryContext(this.peekToken());
            result.condition = this.parentCodeContext;
            this.readToken();
            result.trueBranch = this.getCompoundCodeContext(false);
            this.readExpectedToken(TokenType.Colon);
            result.falseBranch = this.getCompoundCodeContext(false);
            out.setCodeContext(result);
        }
        else{
            Logger.log("TernaryParser...不是三元运算符，不处理", this.peekToken());
        }
        out.setCodeContext(this.parentCodeContext);
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

export const TernaryParser = new TernarySubParser();