import { TypeofContext } from "../../context/TypeofContext";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class TypeofSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        let typeofContext = this.codeContext as TypeofContext;
        let value = StatementProcessor.process(typeofContext.value, out).value;
        let type = typeof value;
        out.value = type;
        return out;
    }
}

export const TypeofProcessor = new TypeofSubProcessor();
