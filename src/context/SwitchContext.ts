import { CaseBlock } from "../compiler/base/ConditionBlock";
import { CodeContext, ContextType } from "./CodeContext";

/**
 * switch语句
 * 包含一个判断条件、多个case块 、default块
 * 语法：
 * switch (condition) {
 *    case value1:
 *   case value2:
 *     // code block
 *    break;
 *   case value3:
 *    // code block
 *   break;
 *   default:
 *   // code block
 * }
 */
export class SwitchContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.Switch;
    }
    
    public switchCondition: CodeContext | null = null;
    public defaultBlock: CaseBlock | null = null;
    public caseBlocks: CaseBlock[] = [];

    public addCaseBlock(caseBlock: CaseBlock) {
        this.caseBlocks.push(caseBlock);
    }
}