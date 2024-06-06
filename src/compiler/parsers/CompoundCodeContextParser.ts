import { AssignContext } from "../../context/AssignContext";
import { CodeContext } from "../../context/CodeContext";
import { MemberContext, MemberMutator } from "../../context/MemberContext";
import { OperatorContext } from "../../context/OperatorContext";
import { Stack } from "../../structure/Stack";
import { TokenType } from "../TokenType";
import { CodeContextParser } from "./CodeContextParser";
import { ParserError, ParserResult, SubParser } from "./SubParser";
import { OperatorInfo, OperatorParser, TernaryParser } from "./index";

class CompoundCodeContextSubParser extends SubParser {

    public get checkColon(): boolean {
        if (this._params.checkColon == undefined) {
            return true;
        }
        return this._params.checkColon;
    }

    protected parseCore(out: ParserResult): void {
        let codeContext = this.getCompoundCodeContext(this.checkColon);
        out.setCodeContext(codeContext);
    }
    
    /**
     * 获取复合类型上下文, 用于解析复合语句
     * @param checkColon 是否检查冒号, 默认为 true, 如：case 语句块不需要检查冒号
     */
    protected getCompoundCodeContext(checkColon: boolean = true) : CodeContext {
        let operatorStack: Stack<OperatorInfo> = new Stack<OperatorInfo>();
        let codeContextStack: Stack<CodeContext> = new Stack<CodeContext>();
        
        // 解析出运算符
        while (true) {
            let parseResult = new ParserResult();
            CodeContextParser.parse(this.cmdBlock, parseResult);
            let codeContext = parseResult.codeContext;
            if (codeContext) {
                codeContextStack.push(codeContext);
            }
            else{
                throw new ParserError(null, "getCompoundCodeContext 无法获取 codeContext");
            }

            let result = new ParserResult();
            OperatorParser.parse(this.cmdBlock, result, { operateStack: operatorStack, contextStack: codeContextStack });
            if (!result.codeContext) {
                break;
            }
        }
        
        // 根据运算符栈解析出代码上下文
        while (true) {
            if (operatorStack.length <= 0) {
                break;
            }
            let operator = operatorStack.pop();
            let right = codeContextStack.pop();
            let left = codeContextStack.pop();
            let operatorContext = new OperatorContext(right, left, operator.operator, this.peekToken());
            codeContextStack.push(operatorContext);
        }

        let result = codeContextStack.pop();
        if (result instanceof MemberContext) {
            // 如果是 MemberContext, 则需要检查是否有冒号
            let member = result as MemberContext;
            if (member.mutator == MemberMutator.None) {
                let token = this.readToken();
                if (checkColon && token.tokenType == TokenType.Colon) {
                    this.readToken();
                    token = this.readToken();
                }

                switch (token.tokenType) {
                    case TokenType.Assign:
                    case TokenType.AddAssign:
                    case TokenType.SubAssign:
                    case TokenType.MulAssign:
                    case TokenType.DivAssign:
                    case TokenType.ModAssign:
                    case TokenType.AssignBitwiseAnd:
                    case TokenType.AssignBitwiseOr:
                    case TokenType.AssignBitwiseXor:
                    case TokenType.AssignBitwiseNot:
                    case TokenType.AssignShiftLeft:
                    case TokenType.AssignShiftRight:
                        return new AssignContext(member, this.getCompoundCodeContext(),token.tokenType,token);
                    default:
                        this.backToken();
                        break;
                }
            }
        }

        let parseResult = new ParserResult();
        TernaryParser.parse(this.cmdBlock, parseResult, { parentCodeContext: result });
        if (!parseResult.codeContext) {
            throw new ParserError(null, "getCompoundCodeContext 无法获取 codeContext");
        }
        return parseResult.codeContext;
    }

    
   

} 

export const CompoundCodeContextParser = new CompoundCodeContextSubParser();
