import { CodeContext, ContextType, PrefixType } from "../../context/CodeContext";
import { TypeofContext } from "../../context/TypeofContext";
import { ProcessError } from "../base/ProcessError";
import { ProcessResult, SubProcessor } from "./SubProcessor";


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
                out.value = DeleteProcessor.pr
                break;
        }
    }

}

export const StatementProcessor = new StatementSubProcessor();
