import { CmdBlock } from '../command/CmdBlock';
import { CodeContext, ContextType } from "./CodeContext";

export class TryContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.Try;
    }
    
    public tryBlock: CmdBlock | null = null;  // try块
    public catchBlock: CmdBlock | null = null;  // catch块
    public finallyBlock: CmdBlock | null = null;  // finally块

    public identifier: string = "";  // 异常变量名
}
