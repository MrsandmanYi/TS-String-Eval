import { CmdBlockType } from "../../command/CmdBlockType";
import { ProcessResult, SubProcessor } from "./SubProcessor";


class BreakSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        if(!this.cmd){
            throw new Error("BreakProcessor: processCore 无法获取当前命令");
        }
        this.invokeBreak(this.cmd.codeContext, out);
        return out;    
    }

    private invokeBreak(codeContext: any, out: ProcessResult): void {
        out.isBreak = true;
        if (!this.isSupportBreak(out.blockType)) {
            if (!out.parent) {
                throw new Error("BreakProcessor: invokeBreak 无法获取父级命令");
            }
            this.invokeBreak(codeContext, out.parent);
        }
    }

    // 是否支持break
    private isSupportBreak(blockType: CmdBlockType): boolean {
        return blockType == CmdBlockType.For || blockType == CmdBlockType.While || blockType == CmdBlockType.ForIn;
    }
}

export const BreakProcessor = new BreakSubProcessor();
