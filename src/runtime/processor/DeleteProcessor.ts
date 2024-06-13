import { DeleteContext } from "../../context/DeleteContext";
import { SetVariableProcessor } from "./SetVariableProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class DeleteSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        let deleteContext = this.codeContext as DeleteContext;
        SetVariableProcessor.process(deleteContext.value,new ProcessResult(),null,{value : undefined});
        return out;
    }
}

export const DeleteProcessor = new DeleteSubProcessor();
