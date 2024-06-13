import { CmdBlock } from "../../command/CmdBlock";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { CodeContext } from "../../context/CodeContext";
import { FunctionContext } from "../../context/FunctionContext";
import { TokenType } from "../TokenType";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { DeleteParser } from "./DeleteParser";
import { ExpressionParser } from "./ExpressionParser";
import { ForParser } from "./ForParser";
import { FunctionParser } from "./FunctionParser";
import { IfParser } from "./IfParser";
import { NewParser } from "./NewParser";
import { ReturnParser } from "./ReturnParser";
import { StatementBlockParser } from "./StatementBlockParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";
import { SwitchParser } from "./SwitchParser";
import { ThrowParser } from "./ThrowParser";
import { TryParser } from "./TryParser";
import { TypeofParser } from "./TypeofParser";
import { VarParser } from "./VarParser";
import { WhileParser } from "./WhileParser";

/**
 * 语句解析器
 * 用于解析单个语句
 * 语句包括: 变量声明、变量赋值、变量自增、变量自减 等等
 */
class StatementSubParser extends SubParser {
    
    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let token = this.readToken();
        if (token == null) {
            throw new Error("StatementParser: 语句解析错误, 未读取到 token");
        }

        let parseResult = new ParserResult();

        switch (token.tokenType) {
            case TokenType.Var:
            case TokenType.Const:
                VarParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.If: 
                IfParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.For:
                ForParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.While:
                WhileParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.Switch:
                SwitchParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.Try:
                TryParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.Throw:
                ThrowParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.Return:
                ReturnParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.Identifier:  // 变量赋值 var a = 1;
            case TokenType.Increment:   // 变量自增 ++a;
            case TokenType.Decrement:   // 变量自减 --b;
                ExpressionParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.New:
                NewParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.TypeOf:
                TypeofParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.Delete:
                DeleteParser.parse(cmdBlock, parseResult);
                break;
            case TokenType.Break:
                cmdBlock?.addCommand(new Command(CommandType.Break_CMD, new CodeContext(token), token));
                break;
            case TokenType.Continue:
                cmdBlock?.addCommand(new Command(CommandType.Continue_CMD, new CodeContext(token), token));
                break;
            case TokenType.Function:
                FunctionParser.parse(cmdBlock, parseResult);
                if ((parseResult.codeContext as FunctionContext).autoTrigger) {
                    cmdBlock?.addCommand(new Command(CommandType.Function_CMD, parseResult.codeContext, token));
                }
                break;
            case TokenType.LeftParen:
                StatementBlockParser.parse(cmdBlock, parseResult, {readLeftBrace: false, endTokenType: TokenType.RightParen});
                break;
            case TokenType.As:
                this.getCompoundCodeContext(true, cmdBlock);
                break;
            case TokenType.Semicolon:
                break;
            case TokenType.Public:
            case TokenType.Private:
            case TokenType.Protected:
                throw new ParserError(token, "StatementParser: 语句解析错误, 访问修饰符不应出现在此处:" + TokenType[token.tokenType]);
            default:
                throw new ParserError(token, "StatementParser: 语句解析错误, 不支持的Token类型: " + TokenType[token.tokenType]);
                
        }


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

export const StatementParser = new StatementSubParser();