import { CmdBlock } from '../command/CmdBlock';
import { CodeContext, ContextType } from "./CodeContext";

export class ForContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.For;
    }
    
    public begin: CmdBlock | null = null;            //开始执行
    public condition: CodeContext | null = null;          //跳出条件
    public loop: CmdBlock | null = null;             //循环执行
    public cmdBlock: CmdBlock | null = null;              //for内容
    public setCmdBlock(cmdBlock: CmdBlock): void {
        this.cmdBlock = cmdBlock;
    }
}

/**
 * for in 循环上下文
 * 语法: for (identifier in loop) { cmdBlock }
 */
export class ForInContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.ForIn;
    }

    public identifier: string = ""; 
    public loop: CodeContext | null = null;
    public cmdBlock: CmdBlock | null = null;
}


/**
 * for 循环上下文
 * 语法: for (begin; finished; step) { cmdBlock }
 */
export class ForSimpleContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.ForSimple;
    }

    public identifier: string = "";
    public begin: CodeContext | null = null;
    public finished: CodeContext | null = null;
    public step: CodeContext | null = null;
    public cmdBlock: CmdBlock | null = null;          
    public variables: any = {};  

    public setCmdBlock(cmdBlock: CmdBlock): void {
        this.cmdBlock = cmdBlock;
    }
}
