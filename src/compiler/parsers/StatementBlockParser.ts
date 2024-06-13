import { TokenType } from "../TokenType";
import { StatementParser } from "./StatementParser";
import { ParserResult, SubParser } from "./SubParser";

/**
 * 语句块解析器, 解析 { ... } 之间的语句
 */
class StatementBlockSubParser extends SubParser
{
    protected get readLeftBrace() : boolean {
        if (!this._params || this._params.readLeftBrace == undefined) {
            return true;
        }
        return !!this._params.readLeftBrace;
    }

    protected get endTokenType() : TokenType {
        if (!this._params || this._params.endTokenType == undefined) {
            return TokenType.RightBrace;
        }
        return this._params.endTokenType;
    }

    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let readLeftBrace = this.readLeftBrace;
        let endTokenType = this.endTokenType;

        if (readLeftBrace) {
            this.readExpectedToken(TokenType.LeftBrace);
        }

        let tokenType: TokenType | undefined = undefined;
        while (this.currentTokenIndex < this._tokens.length) {
            tokenType = this.readToken().tokenType;
            if (tokenType == endTokenType) {
                break;
            }
            this.backToken();
            StatementParser.parse(cmdBlock, out);
        }
    }
}

export const StatementBlockParser = new StatementBlockSubParser();