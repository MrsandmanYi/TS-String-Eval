import { CmdBlock } from "../../command/CmdBlock";
import { CmdBlockType } from "../../command/CmdBlockType";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { CodeContext } from "../../context/CodeContext";
import { ForContext, ForInContext, ForSimpleContext } from "../../context/ForContext";
import { TokenType } from "../TokenType";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { StatementBlockParser } from "./StatementBlockParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";

/**
 * 循环解析器, 用于解析 for 语句
 * 语法: 
 *      for (let i = 0; i < 10; i++) {}
 *      for in 语句 for(let s in arr) {}
 */
class ForSubParser extends SubParser {
    
    protected parseCore(out: ParserResult): void {
        this.skipToken(3);
        let token = this.peekToken();
        if (!token) throw new Error("ForParser: 语法错误");
        if (token.tokenType == TokenType.In) {
            // for in 语句 for(let s in arr) {}
            this.backToken(3);
            this.parseForIn(out);
        }
        else {
            this.backToken(3);
            this.readExpectedToken(TokenType.LeftParen);
            let tokenIndex = this.currentTokenIndex;
            let token = this.readToken();
            if (!token) throw new Error("ForParser: 语法错误");
            if (token.tokenType == TokenType.Identifier) {
                let assignToken = this.readToken();
                if (assignToken?.tokenType == TokenType.Assign) {
                    let context = this.getCompoundCodeContext();
                    let commaToken = this.readToken();
                    if (context && commaToken?.tokenType == TokenType.Comma) {
                        this.parseForSimple(out, token.tokenText, context);
                        return;
                    }
                }
            }
            this.currentTokenIndex = tokenIndex;
            this.parseFor(out);
        }
    }

    /**
     * 解析正常的for循环,for(;;) 语句
     */
    private parseFor(out: ParserResult) {
        let forContext: ForContext = new ForContext(this.peekToken());
        let token = this.readToken();
        if (token?.tokenType != TokenType.Semicolon) { // ;
            this.backToken();
            let beginBlock = new CmdBlock(CmdBlockType.ForBegin, this._cmdBlock);
            StatementBlockParser.parse(beginBlock, out, { readLeftBrace: false, endTokenType: TokenType.Semicolon });
            forContext.begin = beginBlock;
        }
        token = this.readToken();
        if (token?.tokenType != TokenType.Semicolon) {
            this.backToken();
            forContext.condition = this.getCompoundCodeContext();
            this.readExpectedToken(TokenType.Semicolon);            
        }
        token = this.readToken();
        if (token.tokenType != TokenType.RightParen) {
            this.backToken();
            let loopBlock = new CmdBlock(CmdBlockType.ForLoop, this._cmdBlock);
            StatementBlockParser.parse(loopBlock, out, { readLeftBrace: false, endTokenType: TokenType.RightParen });
            forContext.loop = loopBlock;
        }
        // 解析for语句块
        let forCmdBlock: CmdBlock = new CmdBlock(CmdBlockType.For, this._cmdBlock);
        StatementBlockParser.parse(forCmdBlock,out, { readLeftBrace: true, endTokenType: TokenType.RightBrace });
        forContext.setCmdBlock(forCmdBlock);

        this._cmdBlock?.addCommand(new Command(CommandType.For_CMD, forContext, this.peekToken()));
    }


    private parseForSimple(out: ParserResult, identifier: string, beginContext: CodeContext) {
        let forSimContext: ForSimpleContext = new ForSimpleContext(this.peekToken());
        let forSimCmdBlock: CmdBlock = new CmdBlock(CmdBlockType.For, this._cmdBlock);

        forSimContext.identifier = identifier;
        forSimContext.begin = beginContext;
        forSimContext.finished = this.getCompoundCodeContext();
        let token = this.peekToken();
        if (!token) {
            throw new Error("ForParser: 语法错误");
        }

        if (token.tokenType == TokenType.Comma) { //, 逗号
            this.readToken();
            forSimContext.step = this.getCompoundCodeContext();  // 步进, 例如 i++
        }

        this.readExpectedToken(TokenType.RightParen);
        StatementBlockParser.parse(forSimCmdBlock,out, { readLeftBrace: true, endTokenType: TokenType.RightBrace });
        forSimContext.setCmdBlock(forSimCmdBlock);

        this._cmdBlock?.addCommand(new Command(CommandType.ForSimple_CMD, forSimContext, this.peekToken()));
    }


    private parseForIn(out: ParserResult) {
        let forInContext: ForInContext = new ForInContext(this.peekToken());
        let forInCmdBlock: CmdBlock = new CmdBlock(CmdBlockType.ForIn, this._cmdBlock);

        this.readExpectedToken(TokenType.LeftParen);
        this.readExpectedToken(TokenType.Var);

        forInContext.identifier = this.readExpectedToken(TokenType.Identifier).tokenText;
        if (this.peekToken()?.tokenType == TokenType.Colon) {
            // 处理有类型的情况
            this.readToken();
            this.readExpectedToken(TokenType.Identifier);
        }
        this.readExpectedToken(TokenType.In);
        forInContext.loop = this.getCompoundCodeContext();
        this.readExpectedToken(TokenType.RightParen);

        StatementBlockParser.parse(forInCmdBlock, out, { readLeftBrace: true, endTokenType: TokenType.RightBrace });
        forInContext.cmdBlock = forInCmdBlock;

        this._cmdBlock?.addCommand(new Command(CommandType.ForIn_CMD, forInContext, this.peekToken()));
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


export const ForParser = new ForSubParser();