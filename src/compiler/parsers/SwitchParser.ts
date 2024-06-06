import { CmdBlock } from "../../command/CmdBlock";
import { CmdBlockType } from "../../command/CmdBlockType";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { CodeContext } from "../../context/CodeContext";
import { SwitchContext } from "../../context/SwitchContext";
import { TokenType } from "../TokenType";
import { CaseBlock } from "../base/ConditionBlock";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { StatementBlockParser } from "./StatementBlockParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

class SwitchSubParser extends SubParser {

    protected parseCore(out: ParserResult): void {
        let switchContext: SwitchContext = new SwitchContext(this.peekToken());
        // 解析条件
        this.readExpectedToken(TokenType.LeftParen);
        switchContext.switchCondition = this.getCompoundCodeContext();
        this.readExpectedToken(TokenType.RightParen);
        // 解析case
        while (true) {
            let token = this.readToken();
            if (!token) {
                throw new Error("switch 语句解析错误");
                break;
            }

            if (token.tokenType == TokenType.Case) {
                let caseValues: any[] = []; // case 值
                this.parseCaseValues(caseValues);
                // case 包裹的语句块
                let caseCmdBlock: CmdBlock = new CmdBlock(CmdBlockType.Switch, this._cmdBlock);
                StatementBlockParser.parse(caseCmdBlock, out, {readLeftBrace: false, endTokenType: TokenType.Break});
                switchContext.addCaseBlock(new CaseBlock(caseValues, caseCmdBlock));
            }
            else if (token.tokenType == TokenType.Default) {
                this.readExpectedToken(TokenType.Colon); // :
                // default 包裹的语句块
                let defaultCmdBlock: CmdBlock = new CmdBlock(CmdBlockType.Switch, this._cmdBlock);
                StatementBlockParser.parse(defaultCmdBlock, out, {readLeftBrace: false, endTokenType: TokenType.Break});
                switchContext.defaultBlock = new CaseBlock([], defaultCmdBlock);
            }
            else if (token.tokenType != TokenType.Semicolon) {
                this.backToken();
                break;
            }
        }

        this.readExpectedToken(TokenType.RightBrace);

        this._cmdBlock?.addCommand(new Command(CommandType.Switch_CMD, switchContext, this.peekToken()));
    }


    protected parseCaseValues(values: any[]) {
        values.push(this.getCompoundCodeContext(false));
        this.readExpectedToken(TokenType.Colon);
        if (this.readToken()?.tokenType == TokenType.Case) {
            this.parseCaseValues(values);
        }
        else{
            this.backToken();
        }
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

export const SwitchParser = new SwitchSubParser();