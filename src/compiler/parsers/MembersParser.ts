import { ClassContext } from "../../context/ClassContext";
import { AccessModifier, CodeContext } from "../../context/CodeContext";
import { FunctionContext } from '../../context/FunctionContext';
import { VariableContext } from "../../context/VariableContext";
import { TokenType } from "../TokenType";
import { CodeContextParser } from "./CodeContextParser";
import { CompoundCodeContextParser } from "./CompoundCodeContextParser";
import { FunctionParser } from "./FunctionParser";
import { NewParser } from "./NewParser";
import { CodeItemType, ParserError, ParserResult, SubParser } from "./SubParser";

/**
 * 类成员解析器
 * 包括 变量、属性、方法、构造函数
 */
class MembersSubParser extends SubParser {
    
    protected get classContext(): ClassContext {
        return this._params.classContext;
    }

    protected parseCore(out: ParserResult): void {
        this.readExpectedToken(TokenType.LeftBrace);
        while(this.peekToken().tokenType != TokenType.RightBrace){
            let token = this.peekToken();
            if(!token) throw new Error("MembersSubParser 类成员定义不完整");

            // 解析访问修饰符
            let accessModifier = AccessModifier.Public;
            if(token.tokenType == TokenType.Public || token.tokenType == TokenType.Private || token.tokenType == TokenType.Protected){
                if(token.tokenType == TokenType.Private) accessModifier = AccessModifier.Private;
                else if(token.tokenType == TokenType.Protected) accessModifier = AccessModifier.Protected;
                this.readToken();
                token = this.peekToken();
            }
            // 解析Static
            let isStatic = false;
            if(token.tokenType == TokenType.Static){
                isStatic = true;
                this.readToken();
            }
            // 解析 get/set
            let isGetter = false;
            let isSetter = false;
            if(token.tokenType == TokenType.Get){
                isGetter = true;
                this.readToken();
            }
            else if(token.tokenType == TokenType.Set){
                isSetter = true;
                this.readToken();
            }
            // 读取到成员名
            let memberName = this.readToken()?.tokenText;
            
            if (this.peekToken().tokenType == TokenType.LeftParen) {
                // 解析是方法的情况
                this.backToken(2);
                let result = new ParserResult();
                FunctionParser.parse(this._cmdBlock, result, {modifier: accessModifier, isStatic: isStatic});
                this.classContext.addFunction(result.codeContext as FunctionContext);
            }
            else {
                // 解析是变量的情况
                let variableType = null;
                if(this.peekToken().tokenType == TokenType.Colon){
                    // 有类型
                    this.readToken();
                    if (this.classContext.isObject) {
                        variableType = this.getCompoundCodeContext();
                    }
                    else {
                        variableType = this.getCodeContext(CodeItemType.Type);
                    }
                }

                if (this.peekToken().tokenType == TokenType.Assign) {
                    // 有赋值
                    this.readToken();
                    token = this.peekToken();
                    if (token.tokenType == TokenType.New) {     // = new()
                        token = this.readToken();
                        let result = new ParserResult();
                        NewParser.parse(this._cmdBlock, result);
                        this.classContext.addVariable(new VariableContext(memberName, result.codeContext, accessModifier, isStatic, token));
                    }
                    else {      // = xxx
                        let result = this.getCompoundCodeContext();
                        this.classContext.addVariable(new VariableContext(memberName, result, accessModifier, isStatic, token));
                    }
                }
                else {
                    if (this.classContext.className == "") {
                        this.classContext.addVariable(new VariableContext(memberName, variableType||memberName, accessModifier, isStatic, token));
                    }
                    else{
                        this.classContext.addVariable(new VariableContext(memberName, undefined, accessModifier, isStatic, token));
                    }
                }
            }

            let peek = this.peekToken();
            if(peek.tokenType == TokenType.Semicolon || peek.tokenType == TokenType.Comma){
                this.readToken();
            }
        }
        out.setCodeContext(this.classContext);
        this.readExpectedToken(TokenType.RightBrace);
    }

    private getCodeContext(itemType : CodeItemType = CodeItemType.Object): CodeContext {
        let parseResult = new ParserResult();
        CodeContextParser.parse(this.cmdBlock, parseResult, {codeType : itemType});
        if (!parseResult.codeContext) {
            throw new ParserError(null, "MembersSubParser getCodeContext 无法获取 codeContext");
        }
        return parseResult.codeContext;
    }

    private getCompoundCodeContext(checkColon: boolean = true): CodeContext {
        let parseResult = new ParserResult();
        CompoundCodeContextParser.parse(this.cmdBlock, parseResult, {checkColon: checkColon});
        if (!parseResult.codeContext) {
            throw new ParserError(null, "MembersSubParser getCompoundCodeContext 无法获取 codeContext");
        }
        return parseResult.codeContext;
    }

}

export const MembersParser = new MembersSubParser();