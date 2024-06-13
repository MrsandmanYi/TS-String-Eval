import { CmdBlock } from "../../command/CmdBlock";
import { CmdBlockType } from "../../command/CmdBlockType";
import { AssignContext } from "../../context/AssignContext";
import { AccessModifier, CodeContext } from "../../context/CodeContext";
import { FunctionContext, FunctionType } from '../../context/FunctionContext';
import { InvokeFunctionContext } from "../../context/InvokeFunctionContext";
import { MemberContext } from "../../context/MemberContext";
import { TokenType } from "../TokenType";
import { CodeContextParser } from "./CodeContextParser";
import { InvokeFunctionParser } from "./InvokeFunctionParser";
import { StatementBlockParser } from "./StatementBlockParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";



export class FunctionSubParser extends SubParser {
    
    protected get modifier(): AccessModifier {
        if (!this._params || !this._params.modifier) {
            return AccessModifier.Public;
        }
        return this._params.modifier;
    }

    protected get isStatic(): boolean {
        if (!this._params) {
            return false;
        }
        return !!this._params.isStatic;
    }

    protected parseCore(out: ParserResult): void {
        let isStatic = this.isStatic;
        let modifier = this.modifier;

        let token = this.readToken();
        if(!token) return;
        let funcType = FunctionType.Normal;
        if (token.tokenType == TokenType.Get) {
            funcType = FunctionType.Getter;
        }
        else if (token.tokenType == TokenType.Set) {
            funcType = FunctionType.Setter;
        }

        let name = "";
        if(token.tokenType != TokenType.LeftParen && this.peekToken()?.tokenType != TokenType.RightParen) {
            name = this.readExpectedToken(TokenType.Identifier).tokenText; // 函数名
            name = funcType == FunctionType.Getter ? `.get.${name}` : name;
            name = funcType == FunctionType.Setter ? `.set.${name}` : name;
        }

        if (token.tokenType != TokenType.LeftParen) {
            this.readExpectedToken(TokenType.LeftParen);
        }

        // 解析方法参数
        let params: string[] = [];
        let types: Array<MemberContext|undefined> = [];    // 参数类型
        let values: Array<CodeContext|undefined> = [];
        // 是否有动态参数符号...
        let hasDynamicParams = false;

        if (this.peekToken()?.tokenType != TokenType.RightParen) {
            while (true) {
                token = this.readToken();
                if(!token) break;
                if (token.tokenType == TokenType.Spread) { // 动态参数
                    token = this.readExpectedToken(TokenType.Identifier);
                    hasDynamicParams = true;
                }

                let paramName = token.tokenText;
                token = this.peekToken();
                if (token?.tokenType == TokenType.Question) {
                    // (a?:int) 这种情况
                    this.readToken();
                }

                token = this.peekToken();
                if (token?.tokenType == TokenType.Colon) {
                    this.readExpectedToken(TokenType.Colon);
                    // 参数类型
                    let codeContext = this.getCodeContext();
                    if (codeContext instanceof AssignContext) {
                        types.push(codeContext.member);
                        values.push(codeContext.value);
                    }
                    else {
                        types.push(codeContext as MemberContext);
                        values.push(undefined);
                    }
                }
                else if (token?.tokenType == TokenType.Assign) {
                    // 参数默认值, (a = 1)
                    this.backToken();
                    let assignContext: AssignContext = this.getCodeContext() as AssignContext;
                    values.push(assignContext.value);
                }
                else {
                    types.push(undefined);
                    values.push(undefined);
                }
                params.push(paramName);

                token = this.peekToken();
                if (token?.tokenType == TokenType.Comma && !hasDynamicParams) {
                    this.readExpectedToken(TokenType.Comma);
                }
                else if(token?.tokenType == TokenType.RightParen) {
                    break;
                }
                else {
                    throw new ParserError(token, "FunctionParser 参数解析错误.....");
                }
            }
        }
        this.readExpectedToken(TokenType.RightParen);
        token = this.readToken();
        if (token?.tokenType == TokenType.Colon) {
            this.getCodeContext();
        }
        else {
            this.backToken();
        }

        let cmdBlock : CmdBlock = new CmdBlock(CmdBlockType.Function);
        StatementBlockParser.parse(cmdBlock, out, {readLeftBrace: true, endTokenType: TokenType.RightBrace});

        let functionContext:FunctionContext = 
            new FunctionContext(name, isStatic, params, types, values, hasDynamicParams, cmdBlock, this.peekToken());
    
        token = this.readToken();
        this.backToken();
        if (token?.tokenType == TokenType.LeftParen) {
            InvokeFunctionParser.parse(cmdBlock, out, {member: null});
            let invokeContext = out.codeContexts[0] as InvokeFunctionContext;
            functionContext.autoTriggerParams = invokeContext.args || [];
            functionContext.autoTrigger = true;
        }

        out.setCodeContext(functionContext);
    }

    private getCodeContext(): CodeContext {
        let parseResult = new ParserResult();
        CodeContextParser.parse(this.cmdBlock, parseResult);
        if (!parseResult.codeContext) {
            throw new ParserError(null, "FunctionParser getCodeContext 无法获取 codeContext");
        }
        return parseResult.codeContext;
    }

}

export const FunctionParser = new FunctionSubParser();