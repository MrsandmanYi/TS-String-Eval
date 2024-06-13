import { CmdBlock } from "../../command/CmdBlock";
import { CodeContext } from "../../context/CodeContext";

/**
 * 条件块, 用于if, else, while等
 * 包含一个判断条件和一个指令块
 */
export class ConditionBlock {

    public condition: CodeContext | null;  // 判断条件
    public cmdBlock: CmdBlock | null;  // 指令块

    constructor(condition: CodeContext | null, cmdBlock: CmdBlock | null) {
        this.condition = condition;
        this.cmdBlock = cmdBlock;
    }
}


/**
 * case块, 用于switch
 * 包含多个判断条件和一个指令块
 * 一个case块可以有多个条件，只要有一个条件满足就执行
 */
export class CaseBlock {
    
    public conditions: CodeContext[];  // 判断条件列表，
    public cmdBlock: CmdBlock;  // 指令块

    constructor(conditions: CodeContext[], cmdBlock: CmdBlock) {
        this.conditions = conditions;
        this.cmdBlock = cmdBlock;
    }
}
