import { CmdBlockType } from "../../command/CmdBlockType";
import { ForContext } from "../../context/ForContext";
import { CommandProcessor } from "./CommandProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * for循环处理器
 * 语法结构：
 * for(初始化语句; 判断语句; 循环语句){
 *    // 循环体
 * }
 */
class ForSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        if (this.cmd == null) {
            throw new Error("ForSubProcessor: cmd is null");
        }

        let forContext = this.cmd.codeContext as ForContext;

        let forResult = new ProcessResult();
        forResult.blockType = CmdBlockType.For;
        forResult.parent = out;
        forResult.context = {};

        CommandProcessor.process(forContext.begin, forResult);  // 执行初始化语句

        while (true) {
            // 执行判断语句
            if (forContext.condition != null) {
                let condition = CommandProcessor.process(forContext.condition, forResult).value;
                if (!condition) {
                    break;
                }
            }

            // 执行循环体
            CommandProcessor.process(forContext.cmdBlock, forResult);
            if(forResult.isBreak || forResult.isOver) {
                break;
            }
            // 执行循环语句
            CommandProcessor.process(forContext.loop, forResult);
            if (forResult.isContinue) {
                continue;
            }
        }

        return out;
    }
}

export const ForProcessor = new ForSubProcessor();