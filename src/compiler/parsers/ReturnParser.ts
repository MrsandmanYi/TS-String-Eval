import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { TokenType } from "../TokenType";
import { ParserResult, SubParser } from "./SubParser";

class ReturnSubParser extends SubParser {
    protected parseCore(out: ParserResult): void {
        let token = this.peekToken();
        if (!token) {
            throw new Error("return 语句不完整");
        }
        if (token.tokenType == TokenType.RightBrace || token.tokenType == TokenType.Semicolon) {
            this._cmdBlock?.addCommand(new Command(CommandType.Return_CMD, null, this.peekToken()));
        }
        else{
            this._cmdBlock?.addCommand(new Command(CommandType.Return_CMD, this.getCompoundCodeContext(), this.peekToken()));
        }
    }
}

export const ReturnParser = new ReturnSubParser();