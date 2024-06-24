import { ClassContext } from "../../context/ClassContext";
import { CodeContext, ContextType, PrefixType } from "../../context/CodeContext";
import { TypeofContext } from "../../context/TypeofContext";
import { ProcessError } from "../base/ProcessError";
import { ArrayProcessor } from "./ArrayProcessor";
import { AssignProcessor } from "./AssignProcessor";
import { DeleteProcessor } from "./DeleteProcessor";
import { FunctionProcessor } from "./FunctionProcessor";
import { GetVariableProcessor } from "./GetVariableProcessor";
import { InvokeProcessor } from "./InvokeProcessor";
import { NewProcessor } from "./NewProcessor";
import { OperateProcessor } from "./OperateProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";
import { TernaryProcessor } from "./TernaryProcessor";


class StatementSubProcessor extends SubProcessor {

    public processCore(out: ProcessResult): ProcessResult {
        this.processPrefix(this.codeContext, out);
        return out;    
    }

    private processPrefix(codeContext: CodeContext | null, out: ProcessResult): void {
        if (codeContext == null) {
            out.value = null;
            return;
        }

        this.processStrategy(codeContext, out);
        if (codeContext.prefixType == PrefixType.Not) {
            out.value = !out.value;
        }
        else if (codeContext.prefixType == PrefixType.Negation) {
            out.value = ~out.value;
        }
        else if (codeContext.prefixType == PrefixType.NotNot) {
            out.value = !!out.value;
        }
        else if (codeContext.prefixType == PrefixType.Negative) {
            if(typeof(out.value)!= "number" || isNaN(out.value)){
                throw new ProcessError(null,"StatementSubProcessor: processPrefix 无法对非数字进行取反操作");
            }
            out.value = -out.value;
        }

    }
    
    private processStrategy(codeContext: CodeContext, out: ProcessResult): void {
        switch (codeContext.contextType) {
            case ContextType.Typeof:
                out.value = typeof(this.processPrefix((codeContext as TypeofContext).value, out));
                break;
            case ContextType.BasicType:
                out.value = (codeContext as TypeofContext).value;
                break;
            case ContextType.Delete:
                DeleteProcessor.process(codeContext, out);
                break;
            case ContextType.Function:
                FunctionProcessor.process(codeContext, out);
                break;
            case ContextType.InvokeFunction:
                InvokeProcessor.process(codeContext, out);
                break;
            case ContextType.Member:
                GetVariableProcessor.process(codeContext, out);
                break;
            case ContextType.Array:
                ArrayProcessor.process(codeContext, out);
                break;
            case ContextType.Class:
                let classContext = codeContext as ClassContext;
                if (classContext.isObject){
                    let cls : any = {};
                    for(let key in classContext.variableMap){
                        cls[key] = StatementProcessor.process(classContext.variableMap.get(key),out).value;
                    }
                    out.value = cls;
                }
                else {
                    out.value = this.__classMap.get(classContext.className);
                }
                break;
            case ContextType.Operator:
                OperateProcessor.process(codeContext, out);
                break;
            case ContextType.Ternary:
                TernaryProcessor.process(codeContext, out);
                break;
            case ContextType.Assign:
                AssignProcessor.process(codeContext, out);
                break;
            case ContextType.New:
                NewProcessor.process(codeContext, out);
                break;
            default:
                throw new ProcessError(null, "StatementSubProcessor: 无法处理的代码上下文类型: " + ContextType[codeContext.contextType]);
        }
    }

}

export const StatementProcessor = new StatementSubProcessor();
