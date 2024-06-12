import { CmdBlockType } from "../../command/CmdBlockType";
import { CodeContext } from "../../context/CodeContext";
import { SwitchContext } from "../../context/SwitchContext";
import { CommandProcessor } from "./CommandProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * switch 处理器
 * 语法结构：
 * switch(表达式){
 *  case 常量表达式:
 *      // 语句
 *      break;
 *  case 常量表达式:
 *      // 语句
 *      break;
 *  default:
 *      // 语句
 * }
 */
class SwitchSubProcessor extends SubProcessor {
    
    public processCore(out: ProcessResult): ProcessResult {
        if (this.cmd == null) {
            throw new Error("SwitchSubProcessor: cmd is null");
        }

        let switchContext = this.cmd.codeContext as SwitchContext;

        let condition = StatementProcessor.process(switchContext.switchCondition, out).value;
        let isMatch = false;

        let switchResult = new ProcessResult();
        switchResult.blockType = CmdBlockType.Switch;
        switchResult.parent = out;
        switchResult.context = {};

        for (let i = 0; i < switchContext.caseBlocks.length; i++) {
            let caseBlock = switchContext.caseBlocks[i];
            for (let j = 0; j < caseBlock.conditions.length; j++) {
                let caseCondition = caseBlock.conditions[j];
                let caseValue = null;
                if (caseCondition instanceof CodeContext) {
                    caseValue = StatementProcessor.process(caseCondition, out).value;
                }
                else {
                    caseValue = caseCondition;
                }

                if (caseValue == condition) {
                    isMatch = true;
                    CommandProcessor.process(caseBlock.cmdBlock, switchResult);
                    break;
                }
            }
        }

        if (!isMatch && switchContext.defaultBlock) {
            CommandProcessor.process(switchContext.defaultBlock.cmdBlock, switchResult);
        }
        
        return out;
    }

}

export const SwitchProcessor = new SwitchSubProcessor();