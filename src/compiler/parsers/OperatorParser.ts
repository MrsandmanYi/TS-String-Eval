import { CodeContext } from "../../context/CodeContext";
import { OperatorContext } from '../../context/OperatorContext';
import { Stack } from "../../structure/Stack";
import { TokenType } from "../TokenType";
import { ParserResult, SubParser } from "./SubParser";

export interface OperatorResult extends ParserResult {

}

export interface OperatorInfo {
    operator: TokenType;    // 操作符
    priority: number; // 优先级
}

// 操作符优先级字典，优先级越高运算越先进行
export const OperatorPriorityMap: Map<TokenType, OperatorInfo> = new Map<TokenType, OperatorInfo>([

    [TokenType.BitwiseOr, { operator: TokenType.BitwiseOr, priority: 1 }],
    [TokenType.BitwiseAnd, { operator: TokenType.BitwiseAnd, priority: 1 }],
    [TokenType.BitwiseXor, { operator: TokenType.BitwiseXor, priority: 1 }],
    [TokenType.ShiftLeft, { operator: TokenType.ShiftLeft, priority: 1 }],
    [TokenType.ShiftRight, { operator: TokenType.ShiftRight, priority: 1 }],
    [TokenType.And, { operator: TokenType.And, priority: 1 }],
    [TokenType.Or, { operator: TokenType.Or, priority: 1 }],
    
    [TokenType.InstanceOf, { operator: TokenType.InstanceOf, priority: 2 }],

    [TokenType.Equal, { operator: TokenType.Equal, priority: 3 }],
    [TokenType.NotEqual, { operator: TokenType.NotEqual, priority: 3 }],
    [TokenType.Less, { operator: TokenType.Less, priority: 3 }],
    [TokenType.LessEqual, { operator: TokenType.LessEqual, priority: 3 }],
    [TokenType.Greater, { operator: TokenType.Greater, priority: 3 }],
    [TokenType.GreaterEqual, { operator: TokenType.GreaterEqual, priority: 3 }],
    [TokenType.Add, { operator: TokenType.Add, priority: 3 }],
    [TokenType.Sub, { operator: TokenType.Sub, priority: 3 }],

    [TokenType.Mul, { operator: TokenType.Mul, priority: 4 }],
    [TokenType.Div, { operator: TokenType.Div, priority: 4 }],
    [TokenType.Mod, { operator: TokenType.Mod, priority: 4 }],
]);
    

class OperatorSubParser extends SubParser {
    
    // 操作符栈
    protected get operateStack(): Stack<OperatorInfo> {
        return this._params.operateStack;
    }

    // 上下文栈
    protected get contextStack(): Stack<CodeContext> {
        return this._params.contextStack;
    }

    protected parseCore(out: ParserResult): void {
        let operateStack = this.operateStack;
        let contextStack = this.contextStack;

        let token = this.peekToken();
        if (!token) {
            return;
        }
        let currentOperator = OperatorPriorityMap.get(token.tokenType);
        if (!currentOperator) {
            out.codeContexts = [];
            return;
        }

        this.readToken();
        while (operateStack.length > 0) {
            let operator = operateStack.peek();
            if (operator && operator.priority >= currentOperator.priority) {
                operateStack.pop();
                let right = contextStack.pop();
                let left = contextStack.pop();
                if (right && left) {
                    let operatorContext = new OperatorContext(right, left, operator.operator, this.peekToken());                    
                    contextStack.push(operatorContext);
                }
            }
            else {
                break;
            }
        }
        operateStack.push(currentOperator);

        out.codeContexts = contextStack.toArray();
    }
}

export const OperatorParser = new OperatorSubParser();