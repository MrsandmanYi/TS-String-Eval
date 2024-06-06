import { TokenType } from "../TokenType";
import { StatementParser } from "./StatementParser";
import { ParserResult, SubParser } from "./SubParser";

/**
 * 语句块解析器, 解析 { ... } 之间的语句
 */
class StatementBlockSubParser extends SubParser
{
    protected get readLeftBrace() : boolean {
        return this._params.readLeftBrace;
    }

    protected get endTokenType() : TokenType {
        return this._params.endTokenType;
    }

    protected parseCore(out: ParserResult): void {
        if (this.readLeftBrace) {
            this.readExpectedToken(TokenType.LeftBrace);
        }

        let tokenType: TokenType | undefined = undefined;
        while (this.currentTokenIndex < this._tokens.length) {
            tokenType = this.peekToken()?.tokenType;
            if (tokenType == this.endTokenType) {
                break;
            }
            StatementParser.parse(this._cmdBlock, out);
        }
    }
}

export const StatementBlockParser = new StatementBlockSubParser();