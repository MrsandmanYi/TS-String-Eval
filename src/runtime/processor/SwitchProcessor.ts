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
        

        return out;
    }
    
}

export const SwitchProcessor = new SwitchSubProcessor();