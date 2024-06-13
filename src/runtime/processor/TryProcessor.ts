import { TryContext } from "../../context/TryContext";
import { CommandProcessor } from "./CommandProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";


class TrySubProcessor extends SubProcessor {
    
    public processCore(out: ProcessResult): ProcessResult {
        let command = this.cmd;
        let tryContext = command?.codeContext as TryContext;
        try {
            let tryResult = new ProcessResult();
            tryResult.blockType = out.blockType;
            tryResult.parent = out;
            tryResult.context = {};
            CommandProcessor.process(tryContext.tryBlock, tryResult);
        } catch (error) {
            let context = {[tryContext.identifier]: error};
            let catchResult = new ProcessResult();
            catchResult.blockType = out.blockType;
            catchResult.parent = out;
            catchResult.context = context;
            CommandProcessor.process(tryContext.catchBlock, catchResult);
        } finally {
            let finallyResult = new ProcessResult();
            finallyResult.blockType = out.blockType;
            finallyResult.parent = out;
            finallyResult.context = {};
            CommandProcessor.process(tryContext.finallyBlock, finallyResult);
        }
        return out;
    }
    
}

export const TryProcessor = new TrySubProcessor();