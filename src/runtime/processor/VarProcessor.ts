import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * 变量处理器, 用于声明变量
 */
class VarSubProcessor extends SubProcessor {

    public processCore(out: ProcessResult): ProcessResult {
        let command = this.cmd;
        if(!command){
            throw new Error("VarProcessor: processCore 无法获取变量");
        }
        let name: any = command.codeContext;
        out.context[name] = null;   // 为变量赋null值, 只是为了声明变量
        return out;
    }
    
}

export const VarProcessor = new VarSubProcessor();
