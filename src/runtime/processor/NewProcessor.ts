import { InvokeFuncType, InvokeFunctionContext } from '../../context/InvokeFunctionContext';
import { NewContext } from "../../context/NewContext";
import { ProcessError } from "../base/ProcessError";
import { StatementProcessor } from './StatementProcessor';
import { ProcessResult, SubProcessor } from "./SubProcessor";

class NewSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        if (!this.codeContext) {
            throw new ProcessError(null, "NewSubProcessor: codeContext is null");
        }

        let newContext = this.codeContext as NewContext;
        let isInvoke = false;
        if (newContext.newObject instanceof InvokeFunctionContext) {
            isInvoke = true;
            newContext.newObject.invokeFuncType = InvokeFuncType.New;
        }

        let classContext = StatementProcessor.process(newContext.newObject, out).value;
        if (classContext == null) {
            throw new ProcessError(null, "NewSubProcessor: classContext is null, 类不存在");
        }

        out.value = isInvoke? classContext : new classContext();
        return out;
    }
}

export const NewProcessor = new NewSubProcessor();