import { CmdBlockType } from "../../command/CmdBlockType";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class ReturnSubProcessor extends SubProcessor {

    public processCore(out: ProcessResult): ProcessResult {
        if(!this.cmd) {
            throw new Error("ReturnProcessor: processCore 无法获取命令");
        }
        let value = StatementProcessor.process(this.cmd.codeContext, out).value;
        this.invokeReturn(value, out);
        return out;
    }

    private invokeReturn(value: any, out: ProcessResult): void {
        out.isOver = true;
        if (out.blockType == CmdBlockType.Function) {
            out.value = value;
        }
        else {
            this.invokeReturn(value, out.parent as ProcessResult);
        }
    }
}

export const ReturnProcessor = new ReturnSubProcessor();