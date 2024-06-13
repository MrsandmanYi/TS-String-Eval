import { CmdBlockType } from "../../command/CmdBlockType";
import { ForInContext } from "../../context/ForContext";
import { ProcessError } from "../base/ProcessError";
import { CommandProcessor } from "./CommandProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * for in 循环处理器
 * 语法结构：
 * for(变量 in 集合){
 *   // 循环体
 * }
 */
class ForInSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        let command = this.cmd;
        if (command == null) {
            throw new ProcessError(null, "ForInSubProcessor: cmd is null");
        }

        let forInContext = command.codeContext as ForInContext;
        let loop = StatementProcessor.process(forInContext.loop, out).value;
        if (!loop) {
            throw new ProcessError(null, "ForInSubProcessor: loop is null");    
        }

        for (let key in loop) {
            let context : {[key: string]: any} = {};
            context[forInContext.identifier] = key;

            let forInResult = new ProcessResult();
            forInResult.context = context;
            forInResult.blockType = CmdBlockType.ForIn;
            forInResult.parent = out;

            CommandProcessor.process(forInContext.cmdBlock, forInResult);
            if (forInResult.isBreak || forInResult.isOver) {
                break;
            }
            if (forInResult.isContinue) {
                continue;
            }
        }

        return out;
    }
}

export const ForInProcessor = new ForInSubProcessor();
