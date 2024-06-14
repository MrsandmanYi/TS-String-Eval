import { CmdBlock } from "../../command/CmdBlock";
import { BasicTypeContext } from "../../context/BasicTypeContext";
import { ClassContext } from "../../context/ClassContext";
import { CodeContext, PrefixType } from "../../context/CodeContext";
import { MemberContext, MemberMutator } from "../../context/MemberContext";
import { TokenType } from "../TokenType";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { CodeItemType, ParserError, ParserResult, SubParser } from "./SubParser";
import { ArrayParser, DeleteParser, FunctionParser, InvokeFunctionParser, MembersParser, NewParser, TypeofParser } from "./index";

class CodeContextSubParser extends SubParser {
    protected get codeType(): CodeItemType {
        if (!this._params) {
            return CodeItemType.Object;
        }
        return this._params.codeType || CodeItemType.Object;
    }

    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let codeType = this.codeType;
        let codeContext = this.getCodeContext(codeType, cmdBlock);
        out.setCodeContext(codeContext);
    }

    /**
     * 获取代码上下文, 用于解析单行语句，如果发现是复合语句则会调用 getCompoundCodeContext 方法
     */
    protected getCodeContext(codeType : CodeItemType = CodeItemType.Object, cmdBlock: CmdBlock | null) : CodeContext | null {
        let codeContext : CodeContext | null = null;
        let token = this.readToken();

        let prefixType: PrefixType = PrefixType.None;
        if (token.tokenType == TokenType.Not) {
            prefixType = PrefixType.Not;
        }
        else if (token.tokenType == TokenType.NotNot) {
            prefixType = PrefixType.NotNot;
        }
        else if (token.tokenType == TokenType.Sub) {
            prefixType = PrefixType.Negative;
        }

        let mutator: MemberMutator = MemberMutator.None;

        let preTokenType = token?.tokenType;
        if(preTokenType == TokenType.NotNot){   // !!
            token = this.readToken();
        }
        else if(preTokenType == TokenType.Increment){   // ++
            mutator = MemberMutator.PreIncrement;
            token = this.readToken();
        }
        else if(preTokenType == TokenType.Decrement){   // --
            mutator = MemberMutator.PreDecrement;
            token = this.readToken();
        }

        if(!token) throw new ParserError(null, "getCodeContext 无法获取 token");

        let result = new ParserResult();
        switch (token.tokenType) {
            case TokenType.Identifier:  
                codeContext = new MemberContext(null, token.tokenText, MemberMutator.None, token);
                break;
            case TokenType.LeftParen: // ( ， ()=>void , ():void =>{}
                if (codeType == CodeItemType.Object) {
                    let parseResult = new ParserResult();
                    CompoundCodeContextParser.parse(cmdBlock, parseResult);
                    codeContext = parseResult.codeContext;
                }
                else{
                    // ()=>void, 直接返回 Function
                    let token = this.peekToken();
                    while(token?.tokenType != TokenType.Assign){
                        token = this.readToken();
                    }
                    token = this.readExpectedToken(TokenType.Greater);
                    codeContext = new MemberContext(null, Function, MemberMutator.None, token);
                }
                break;
            case TokenType.Function: // function
                FunctionParser.parse(cmdBlock, result);
                codeContext = result.codeContext;
                break;
            case TokenType.LeftBracket:
                this.backToken();
                ArrayParser.parse(cmdBlock, result);
                codeContext = result.codeContext;
                break;
            case TokenType.LeftBrace:
                this.backToken();
                codeContext = new ClassContext(true, token);
                MembersParser.parse(cmdBlock, result, { classContext: codeContext as ClassContext });
                //codeContext = result.codeContext;
                break;
            case TokenType.Void:
            case TokenType.NaN:
            case TokenType.Null:
            case TokenType.Undefined:
            case TokenType.True:
            case TokenType.False:
            case TokenType.Number:
            case TokenType.String:
                if (token.tokenType == TokenType.Number) {
                    // 字符串转数字，考虑Hex、整数、浮点数
                    let number = Number(token.tokenText);
                    if (isNaN(number)) {
                        throw new ParserError(token, "getCodeContext 无法获取 number");
                    }
                    codeContext = new BasicTypeContext(number, token);
                }
                else{
                    codeContext = new BasicTypeContext(token.tokenText, token);
                }
                break;
            case TokenType.New:
                NewParser.parse(cmdBlock, result);
                codeContext = result.codeContext;
                break;
            case TokenType.TypeOf:
                TypeofParser.parse(cmdBlock, result);
                codeContext = result.codeContext;
                break;
            case TokenType.Delete:
                DeleteParser.parse(cmdBlock, result);
                codeContext = result.codeContext;
                break;
            default:
                throw new ParserError(token, "getCodeContext 起始关键字错误 ");
        }

        if (!codeContext) {
            throw new ParserError(token, "getCodeContext 无法获取 codeContext");
        }

        codeContext = this.getVariable(codeContext, cmdBlock);
        codeContext.prefixType = prefixType;

        if (codeContext instanceof MemberContext) {
            if (mutator != MemberMutator.None) {
                codeContext.mutator = mutator;
            }
            else{
                let token = this.readToken();
                if (token.tokenType == TokenType.Increment) {
                    codeContext.mutator = MemberMutator.PostIncrement;
                }
                else if (token.tokenType == TokenType.Decrement) {
                    codeContext.mutator = MemberMutator.PostDecrement;
                }
                else{
                    this.backToken();
                }
            }
        }
        else if(mutator != MemberMutator.None){
            throw new ParserError(token, "++ 或者 -- 只支持变量的操作");
        }

        return codeContext;
    }

    protected getVariable(parent : CodeContext, cmdBlock: CmdBlock | null): CodeContext {
        let codeContext = parent;
        while(true){
            
            let token = this.readToken();
            if (parent.token?.tokenType == TokenType.Identifier) {
                 if (token.tokenType == TokenType.LeftBracket) {
                    this.readToken();
                    this.readToken();
                    token = this.peekToken();
                 }  
            }
            if (token.tokenType == TokenType.Dot) { // . 点号
                let identifier = this.readExpectedToken(TokenType.Identifier).tokenText;
                codeContext = new MemberContext(codeContext as MemberContext, identifier, MemberMutator.None, token);
                if (this.peekToken().tokenType == TokenType.LeftBracket) {
                    this.readToken();
                    if (this.peekToken().tokenType == TokenType.RightBracket) {
                        this.readToken();
                        return codeContext;
                    }
                    else{
                        this.backToken();
                    }
                }
            }
            else if (token.tokenType == TokenType.LeftBracket) {
                let parseResult = new ParserResult();
                CompoundCodeContextParser.parse(cmdBlock, parseResult);
                let keyContext = parseResult.codeContext as CodeContext;
                codeContext = new MemberContext(codeContext as MemberContext, keyContext, MemberMutator.None, token);
                
                if (this.peekToken().tokenType == TokenType.RightBracket) {
                    this.readExpectedToken(TokenType.RightBracket);
                }
            }
            else if (token.tokenType == TokenType.LeftParen) {
                this.backToken();
                let result = new ParserResult();
                InvokeFunctionParser.parse(cmdBlock, result, { member: codeContext });
                codeContext = result.codeContext as CodeContext;
            }
            else {
                this.backToken();
                break;
            }
        }
        return codeContext;
    }
}

export const CodeContextParser = new CodeContextSubParser();