import { TokenType } from '../../compiler/TokenType';
import { OperatorContext } from '../../context/OperatorContext';
import { StatementProcessor } from './StatementProcessor';
import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * 操作符处理器, 用于在运行时处理操作符
 * + - * / % ++ -- == != > < >= <= ....
 */
class OperateSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        let opContext = this.codeContext as OperatorContext;
        let opType: TokenType = opContext.operator; // 操作符类型

        let leftValue = StatementProcessor.process(opContext.left, out).value;
        let rightValue = null;

        if (opType == TokenType.Add) {  // +
            // 可能是数字和字符串相加
            rightValue = StatementProcessor.process(opContext.right, out).value;
            out.value = leftValue + rightValue;
        }
        else if (   // - * / % | & ^ << >>
            opType == TokenType.Sub || 
            opType == TokenType.Mul ||
            opType == TokenType.Div ||
            opType == TokenType.Mod ||
            opType == TokenType.BitwiseOr ||
            opType == TokenType.BitwiseAnd ||
            opType == TokenType.BitwiseXor ||
            opType == TokenType.ShiftLeft ||
            opType == TokenType.ShiftRight
        ) {
            rightValue = StatementProcessor.process(opContext.right, out).value;            
            // 两遍都只能是数字
            if (typeof(leftValue) != "number") {
                throw new Error("OperateSubProcessor: leftValue is not number");
            }
            if (typeof(rightValue) != "number") {
                throw new Error("OperateSubProcessor: rightValue is not number");
            }

            switch (opType) {
                case TokenType.Sub:
                    out.value = leftValue - rightValue;
                    break;
                case TokenType.Mul:
                    out.value = leftValue * rightValue;
                    break;
                case TokenType.Div:
                    out.value = leftValue / rightValue;
                    break;
                case TokenType.Mod:
                    out.value = leftValue % rightValue;
                    break;
                case TokenType.BitwiseOr:
                    out.value = leftValue | rightValue;
                    break;
                case TokenType.BitwiseAnd:
                    out.value = leftValue & rightValue;
                    break;
                case TokenType.BitwiseXor:
                    out.value = leftValue ^ rightValue;
                    break;
                case TokenType.ShiftLeft:
                    out.value = leftValue << rightValue;
                    break;
                case TokenType.ShiftRight:
                    out.value = leftValue >> rightValue;
                    break;
            }

        }
        else if ( // && || == != > < >= <=
            opType == TokenType.And ||
            opType == TokenType.Or || 
            opType == TokenType.Equal ||
            opType == TokenType.NotEqual ||
            opType == TokenType.Greater ||
            opType == TokenType.GreaterEqual ||
            opType == TokenType.Less ||
            opType == TokenType.LessEqual
        ) {
            switch (opType) {
                case TokenType.And:
                    if (!leftValue) {
                        out.value = false;
                        break;
                    }
                    rightValue = StatementProcessor.process(opContext.right, out).value;
                    out.value = leftValue && rightValue;
                    break;
                case TokenType.Or:
                    if (leftValue) {
                        out.value = true;
                        break;
                    }
                    else {
                        rightValue = StatementProcessor.process(opContext.right, out).value;
                        out.value = leftValue || rightValue;
                        break;
                    }
                case TokenType.Equal:
                    rightValue = StatementProcessor.process(opContext.right, out).value;
                    out.value = leftValue == rightValue;
                    break;
                case TokenType.NotEqual:
                    rightValue = StatementProcessor.process(opContext.right, out).value;
                    out.value = leftValue != rightValue;
                    break;
                case TokenType.Greater:
                    rightValue = StatementProcessor.process(opContext.right, out).value;
                    out.value = leftValue > rightValue;
                    break;
                case TokenType.GreaterEqual:
                    rightValue = StatementProcessor.process(opContext.right, out).value;
                    out.value = leftValue >= rightValue;
                    break;
                case TokenType.Less:
                    rightValue = StatementProcessor.process(opContext.right, out).value;
                    out.value = leftValue < rightValue;
                    break;
                case TokenType.LessEqual:
                    rightValue = StatementProcessor.process(opContext.right, out).value;
                    out.value = leftValue <= rightValue;
                    break;
            }
        }
        else if (opType == TokenType.InstanceOf) {
            rightValue = StatementProcessor.process(opContext.right, out).value;           
            out.value = leftValue instanceof rightValue;
        }
        else {
            throw new Error("OperateSubProcessor: operator not supported :" + TokenType[opType]);
        }

        return out;
    }
}

export const OperateProcessor = new OperateSubProcessor();