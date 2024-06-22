import { CmdBlockType } from "../../command/CmdBlockType";
import { ForOfContext } from "../../context/ForContext";
import { ProcessError } from "../base/ProcessError";
import { CommandProcessor } from "./CommandProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * for of 循环处理器
 * 语法结构：
 
 */
class ForOfSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        let command = this.cmd;
        if (command == null) {
            throw new ProcessError(null, "ForOfSubProcessor: cmd is null");
        }

        let forOfContext = command.codeContext as ForOfContext;
        let loop = StatementProcessor.process(forOfContext.loop, out).value;
        if (!loop) {
            throw new ProcessError(null, "ForOfSubProcessor: loop is null");    
        }

        for (let key of loop) {
            let context : {[key: string]: any} = {};
            context[forOfContext.identifier] = key;

            let forOfResult = new ProcessResult();
            forOfResult.context = context;
            forOfResult.blockType = CmdBlockType.ForOf;
            forOfResult.parent = out;

            CommandProcessor.process(forOfContext.cmdBlock, forOfResult);
            if (forOfResult.isBreak || forOfResult.isOver) {
                break;
            }
            if (forOfResult.isContinue) {
                continue;
            }
        }

        return out;
    }
}

export const ForOfProcessor = new ForOfSubProcessor();
