import { CmdBlockType } from "../../command/CmdBlockType";
import { WhileContext } from "../../context/WhileContext";
import { ConditionProcessor } from "./ConditionProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * while 循环处理器
 * 语法结构：
 * while(条件){
 *  // 循环体
 * }
 */
class WhileSubProcessor extends SubProcessor {

    public processCore(out: ProcessResult): ProcessResult {
        if (this.cmd == null) {
            throw new Error("ForSubProcessor: cmd is null");
        }
        
        let whileContext = this.cmd.codeContext as WhileContext;
        let condition = whileContext.whileCondition;
        while (true) {
            let conditionResult = new ProcessResult();  // TODO: 待优化，不需要每次都创建新的ProcessResult
            conditionResult.blockType = CmdBlockType.While;
            conditionResult.parent = out;
            conditionResult.context = {};

            let r = ConditionProcessor.process(null, conditionResult, null, {
                conditionBlock: condition,
                cmdBlockType: CmdBlockType.While
            }).value;
            
            if (!r) {
                break;
            }

            if (out.isBreak || out.isOver) {
                break;
            }

            if (out.isContinue) {
                continue;
            }
        }

        return out;
    }

}

export const WhileProcessor = new WhileSubProcessor();