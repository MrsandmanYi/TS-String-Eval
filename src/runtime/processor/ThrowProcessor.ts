import { ThrowContext } from "../../context/ThrowContext";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class ThrowSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        let throwContext = this.cmd?.codeContext as ThrowContext;
        let t = StatementProcessor.process(throwContext.exception, out).value;
        throw t;
        //return out;
    }
}

export const ThrowProcessor = new ThrowSubProcessor();