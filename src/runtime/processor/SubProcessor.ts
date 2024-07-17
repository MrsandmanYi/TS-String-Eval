import { CmdBlockType } from "../../command/CmdBlockType";
import { Command } from "../../command/Command";
import { ClassContext } from "../../context/ClassContext";
import { CodeContext } from "../../context/CodeContext";
import { ENV_EDITOR } from "../../utils/Marco";
import { RunTime } from "../Runtime";

export class ProcessResult {
    value: any;

    isOver: boolean = false;
    isContinue: boolean = false;
    isBreak: boolean = false;
    
    blockType: CmdBlockType = CmdBlockType.None;
    
    parent: ProcessResult | null = null;
    
    context: any;

    constructor(blockType: CmdBlockType = CmdBlockType.None, parent: ProcessResult | null = null, context: any = {}){
        this.blockType = blockType;
        this.parent = parent;
        this.context = context;
    }
}

/**
 * 子处理器基类, 用于在运行时处理特定的命令
 */
export abstract class SubProcessor {
    
    protected _codeContext: CodeContext | null = null;
    public get codeContext(): CodeContext | null {
        return this._codeContext;
    }

    protected _cmd: Command | null = null;
    public get cmd(): Command | null {
        return this._cmd;
    }

    protected _params: any = null;
    public get params(): any {
        return this._params
    }

    public get __global(): any {
        return RunTime.__global;
    }

    public get __classMap(): Map<string, ClassContext> {
        return RunTime.__classMap;
    }

    public get currentThisPtr(): any | null {
        return RunTime.currentThisPtr;
    }
    public set currentThisPtr(value: any | null) {
        RunTime.currentThisPtr = value;
    }

    public get currentClass(): ClassContext | null {
        return RunTime.currentClass;
    }
    public set currentClass(value: ClassContext | null) {
        RunTime.currentClass = value;
    }
    
    public process(codeContext: any, out: ProcessResult, cmd: Command | null = null, params?: any): ProcessResult{
        this._codeContext = codeContext;
        this._cmd = cmd;
        this._params = params ? params : null;
        return this.processCore(out);
    }

    public abstract processCore(out: ProcessResult): ProcessResult;



    //#region 辅助方法

    protected getContextValue(pr: ProcessResult, key: string, processNull: boolean = false): any {

        if (ENV_EDITOR) {
            if (key.includes("__func__")) {
                console.log("寻找匿名方法........: ", key);
            }
        }

        let data : ProcessResult | null = pr;
        while(data && !data.context.hasOwnProperty(key)){
            data = data.parent;     // 优先从当前上下文中查找
        }

        if(data){
            if (processNull) {
                if (data.context.hasOwnProperty(key)) {
                    if (data.context[key] == null) {
                        return {
                            isNull: true,
                        }
                    }
                }
            }

            return data.context[key];
        }
        else if (this.currentThisPtr && this.currentThisPtr.hasOwnProperty(key)){
            return this.currentThisPtr[key];        // 从当前对象中查找
        }
        else{
            let v = this.__global[key]; // 从全局对象中查找
            if (!v) {
                //Logger.error("getContextValue 无法获取ContextValue: " + key);
            }
            return v;        
        }

    }


    //#endregion
}
