import { CmdBlock } from "../../command/CmdBlock";
import { CmdBlockType } from "../../command/CmdBlockType";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { TryContext } from "../../context/TryContext";
import { TokenType } from "../TokenType";
import { StatementBlockParser } from "./StatementBlockParser";
import { ParserResult, SubParser } from "./SubParser";

class TrySubParser extends SubParser {
        
    protected parseCore(out: ParserResult): void {
        let tryContext: TryContext = new TryContext(this.peekToken());
        // 解析try块
        let tryCmdBlock = new CmdBlock(CmdBlockType.Function, this._cmdBlock);
        StatementBlockParser.parse(tryCmdBlock, out, {readLeftBrace: true, endTokenType: TokenType.RightBrace});
        tryContext.tryBlock = tryCmdBlock;
        // 解析catch块
        let catchCmdBlock = new CmdBlock(CmdBlockType.Function, this._cmdBlock);
        this.readExpectedToken(TokenType.Catch);
        this.readExpectedToken(TokenType.LeftParen);
        tryContext.identifier = this.readExpectedToken(TokenType.Identifier).tokenText;
        let token = this.peekToken();
        if (token?.tokenType == TokenType.Colon) {
            this.skipToken(2);
            token = this.peekToken();            
        }
        this.readExpectedToken(TokenType.RightParen);
        StatementBlockParser.parse(catchCmdBlock, out, {readLeftBrace: true, endTokenType: TokenType.RightBrace});
        tryContext.catchBlock = catchCmdBlock;
        // 解析finally块
        let finallyCmdBlock = new CmdBlock(CmdBlockType.Function, this._cmdBlock);
        if (this.peekToken()?.tokenType == TokenType.Finally) {
            this.readExpectedToken(TokenType.Finally);
            StatementBlockParser.parse(finallyCmdBlock, out, {readLeftBrace: true, endTokenType: TokenType.RightBrace});
            tryContext.finallyBlock = finallyCmdBlock;
        }

        this._cmdBlock?.addCommand(new Command(CommandType.Try_CMD, tryContext, this.peekToken()));
    }
}

export const TryParser = new TrySubParser();