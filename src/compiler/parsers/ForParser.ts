import { CmdBlock } from "../../command/CmdBlock";
import { CmdBlockType } from "../../command/CmdBlockType";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { CodeContext } from "../../context/CodeContext";
import { ForContext, ForInContext, ForOfContext, ForSimpleContext } from "../../context/ForContext";
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
        let cmdBlock = this.cmdBlock;
        this.skipToken(3);
        let token = this.peekToken();
        if (!token) throw new Error("ForParser: 语法错误");
        if (token.tokenType == TokenType.In) {
            // for in 语句 for(let s in arr) {}
            this.backToken(3);
            this.parseForIn(out, cmdBlock);
        }
        else if (token.tokenType == TokenType.Of) {
            // for of 语句 for(let s of arr) {}
            this.backToken(3);
            this.parseForOf(out, cmdBlock);
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
                    let context = this.getCompoundCodeContext(true, cmdBlock);
                    let commaToken = this.readToken();
                    if (context && commaToken?.tokenType == TokenType.Comma) {
                        this.parseForSimple(out, token.tokenText, context, cmdBlock);
                        return;
                    }
                }
            }
            this.currentTokenIndex = tokenIndex;
            this.parseFor(out, cmdBlock);
        }
    }

    /**
     * 解析正常的for循环,for(;;) 语句
     */
    private parseFor(out: ParserResult, cmdBlock: CmdBlock | null) {
        let forContext: ForContext = new ForContext(this.peekToken());
        let token = this.readToken();
        if (token?.tokenType != TokenType.Semicolon) { // ;
            this.backToken();
            let beginBlock = new CmdBlock(CmdBlockType.ForBegin, cmdBlock);
            StatementBlockParser.parse(beginBlock, out, { readLeftBrace: false, endTokenType: TokenType.Semicolon });
            forContext.begin = beginBlock;
        }
        token = this.readToken();
        if (token?.tokenType != TokenType.Semicolon) {
            this.backToken();
            forContext.condition = this.getCompoundCodeContext(true, cmdBlock);
            this.readExpectedToken(TokenType.Semicolon);            
        }
        token = this.readToken();
        if (token.tokenType != TokenType.RightParen) {
            this.backToken();
            let loopBlock = new CmdBlock(CmdBlockType.ForLoop, cmdBlock);
            StatementBlockParser.parse(loopBlock, out, { readLeftBrace: false, endTokenType: TokenType.RightParen });
            forContext.loop = loopBlock;
        }
        // 解析for语句块
        let forCmdBlock: CmdBlock = new CmdBlock(CmdBlockType.For, cmdBlock);
        StatementBlockParser.parse(forCmdBlock,out, { readLeftBrace: true, endTokenType: TokenType.RightBrace });
        forContext.setCmdBlock(forCmdBlock);

        cmdBlock?.addCommand(new Command(CommandType.For_CMD, forContext, this.peekToken()));
    }


    private parseForSimple(out: ParserResult, identifier: string, beginContext: CodeContext, cmdBlock: CmdBlock | null) {
        let forSimContext: ForSimpleContext = new ForSimpleContext(this.peekToken());
        let forSimCmdBlock: CmdBlock = new CmdBlock(CmdBlockType.For, cmdBlock);

        forSimContext.identifier = identifier;
        forSimContext.begin = beginContext;
        forSimContext.finished = this.getCompoundCodeContext(true, cmdBlock);
        let token = this.peekToken();
        if (!token) {
            throw new Error("ForParser: 语法错误");
        }

        if (token.tokenType == TokenType.Comma) { //, 逗号
            this.readToken();
            forSimContext.step = this.getCompoundCodeContext(true, cmdBlock);  // 步进, 例如 i++
        }

        this.readExpectedToken(TokenType.RightParen);
        StatementBlockParser.parse(forSimCmdBlock,out, { readLeftBrace: true, endTokenType: TokenType.RightBrace });
        forSimContext.setCmdBlock(forSimCmdBlock);

        cmdBlock?.addCommand(new Command(CommandType.ForSimple_CMD, forSimContext, this.peekToken()));
    }


    private parseForIn(out: ParserResult, cmdBlock: CmdBlock | null) {
        let forInContext: ForInContext = new ForInContext(this.peekToken());
        let forInCmdBlock: CmdBlock = new CmdBlock(CmdBlockType.ForIn, cmdBlock);

        this.readExpectedToken(TokenType.LeftParen);
        this.readExpectedToken(TokenType.Var);

        forInContext.identifier = this.readExpectedToken(TokenType.Identifier).tokenText;
        if (this.peekToken()?.tokenType == TokenType.Colon) {
            // 处理有类型的情况
            this.readToken();
            this.readExpectedToken(TokenType.Identifier);
        }
        this.readExpectedToken(TokenType.In);
        forInContext.loop = this.getCompoundCodeContext(true, cmdBlock);
        this.readExpectedToken(TokenType.RightParen);

        StatementBlockParser.parse(forInCmdBlock, out, { readLeftBrace: true, endTokenType: TokenType.RightBrace });
        forInContext.cmdBlock = forInCmdBlock;

        cmdBlock?.addCommand(new Command(CommandType.ForIn_CMD, forInContext, this.peekToken()));
    }

    private parseForOf(out: ParserResult, cmdBlock: CmdBlock | null) {
        let forOfContext: ForOfContext = new ForOfContext(this.peekToken());
        let forOfCmdBlock: CmdBlock = new CmdBlock(CmdBlockType.ForOf, cmdBlock);

        this.readExpectedToken(TokenType.LeftParen);
        this.readExpectedToken(TokenType.Var);

        forOfContext.identifier = this.readExpectedToken(TokenType.Identifier).tokenText;
        if (this.peekToken()?.tokenType == TokenType.Colon) {
            // 处理有类型的情况
            this.readToken();
            this.readExpectedToken(TokenType.Identifier);
        }
        this.readExpectedToken(TokenType.Of);
        forOfContext.loop = this.getCompoundCodeContext(true, cmdBlock);
        this.readExpectedToken(TokenType.RightParen);

        StatementBlockParser.parse(forOfCmdBlock, out, { readLeftBrace: true, endTokenType: TokenType.RightBrace });
        forOfContext.cmdBlock = forOfCmdBlock;

        cmdBlock?.addCommand(new Command(CommandType.ForOf_CMD, forOfContext, this.peekToken()));
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


export const ForParser = new ForSubParser();