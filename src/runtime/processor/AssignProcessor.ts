import { TokenType } from "../../compiler/TokenType";
import { AssignContext } from "../../context/AssignContext";
import { ProcessError } from "../base/ProcessError";
import { GetVariableProcessor } from "./GetVariableProcessor";
import { SetVariableProcessor } from "./SetVariableProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class AssignSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        let assignContext = this.codeContext as AssignContext;
        if (assignContext.assignType == TokenType.Assign) {
            // 赋值
            let value = StatementProcessor.process(assignContext.value, out).value;
            SetVariableProcessor.process(assignContext.member, out, null, { value: value });
        }
        else{
            let value = GetVariableProcessor.process(assignContext.member, out).value;
            if (typeof(value) == 'string') {
                if (assignContext.assignType == TokenType.AddAssign) {
                    value += StatementProcessor.process(assignContext.value, out).value;
                }   
                else {
                    throw new ProcessError(null, "AssignSubProcessor: processCore 字符串只能+=赋值");
                }
            }
            else if (typeof(value) == 'number') {
                if (assignContext.assignType == TokenType.AddAssign) {
                    value += StatementProcessor.process(assignContext.value, out).value;
                }
                else if (assignContext.assignType == TokenType.SubAssign) {
                    value -= StatementProcessor.process(assignContext.value, out).value;
                }
                else if (assignContext.assignType == TokenType.MulAssign) {
                    value *= StatementProcessor.process(assignContext.value, out).value;
                }
                else if (assignContext.assignType == TokenType.DivAssign) {
                    value /= StatementProcessor.process(assignContext.value, out).value;
                }
                else if (assignContext.assignType == TokenType.ModAssign) {
                    value %= StatementProcessor.process(assignContext.value, out).value;
                }
                else if (assignContext.assignType == TokenType.AssignBitwiseAnd) {
                    value &= StatementProcessor.process(assignContext.value, out).value;
                }
                else if (assignContext.assignType == TokenType.AssignBitwiseOr) {
                    value |= StatementProcessor.process(assignContext.value, out).value;
                }
                else if (assignContext.assignType == TokenType.AssignBitwiseXor) {
                    value ^= StatementProcessor.process(assignContext.value, out).value;
                }
                else if (assignContext.assignType == TokenType.AssignBitwiseNot) {
                    value = ~(StatementProcessor.process(assignContext.value, out).value);
                }
                else if (assignContext.assignType == TokenType.AssignShiftLeft) {
                    value <<= StatementProcessor.process(assignContext.value, out).value;
                }
                else if (assignContext.assignType == TokenType.AssignShiftRight) {
                    value >>= StatementProcessor.process(assignContext.value, out).value;
                }
                else {
                    throw new ProcessError(null, "AssignSubProcessor: processCore 无法处理的赋值类型"+ TokenType[assignContext.assignType]);
                }

                SetVariableProcessor.process(assignContext.member, out, null, { value: value });
            }
            else {
                throw new ProcessError(null, "AssignSubProcessor: processCore 无法处理的类型：" + typeof(value));
            }
        }

        return out;
    }
}

export const AssignProcessor = new AssignSubProcessor();
