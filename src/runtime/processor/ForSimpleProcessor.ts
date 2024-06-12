import { CmdBlockType } from "../../command/CmdBlockType";
import { ForSimpleContext } from "../../context/ForContext";
import { CommandProcessor } from "./CommandProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class ForSimpleSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        
        let forContext = this.codeContext as ForSimpleContext;
        let begin = StatementProcessor.process(forContext.begin, out).value;
        if(begin == null || typeof(begin) != "number"){
            throw new Error("ForSimpleSubProcessor: processCore 无法获取循环开始值");
        }

        let end = StatementProcessor.process(forContext.finished, out).value;
        if(end == null || typeof(end) != "number"){
            throw new Error("ForSimpleSubProcessor: processCore 无法获取循环结束值");
        }

        let step = StatementProcessor.process(forContext.step, out).value;
        if(step == null || typeof(step) != "number"){
            throw new Error("ForSimpleSubProcessor: processCore 无法获取循环步长");
        }

        let variables = forContext.variables;

        for(let i = begin; i < end; i += step){
            variables.set(forContext.identifier, i);
            let forResult = new ProcessResult();
            forResult.blockType = CmdBlockType.For;
            forResult.parent = out;
            forResult.context = {};

            CommandProcessor.process(forContext.cmdBlock, forResult);

            if(forResult.isBreak || forResult.isOver){
                break;
            }

            if(forResult.isContinue){
                continue;
            }

        }

        return out;
    }
}

export const ForSimpleProcessor = new ForSimpleSubProcessor();