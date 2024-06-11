import { CmdBlockType } from "../../command/CmdBlockType";
import { CodeContext } from "../../context/CodeContext";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class ContinueSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        if(!this.cmd){
            throw new Error("ContinueProcessor: processCore 无法获取当前命令");
        }
        this.invokeContinue(this.cmd.codeContext, out);
        return out;
    }

    private invokeContinue(codeContext: CodeContext, out: ProcessResult): void {
        out.isContinue = true;
        if (!this.isSupportContinue(out.blockType)) {
            if (!out.parent) {
                throw new Error("ContinueProcessor: invokeContinue 无法获取父级命令");
            }
            this.invokeContinue(codeContext, out.parent);
        }
    }

    // 是否支持continue
    private isSupportContinue(blockType: CmdBlockType): boolean {
        return blockType == CmdBlockType.For || blockType == CmdBlockType.While || blockType == CmdBlockType.ForIn;
    }
}

export const ContinueProcessor = new ContinueSubProcessor();
