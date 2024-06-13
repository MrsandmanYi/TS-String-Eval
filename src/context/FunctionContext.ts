import { CmdBlock } from '../command/CmdBlock';
import { Token } from '../compiler/Token';
import { CodeContext, ContextType } from "./CodeContext";
import { MemberContext } from "./MemberContext";

export enum FunctionType {
    Normal,
    Getter,
    Setter,
    //Constructor
}

/**
 * 函数上下文
 */
export class FunctionContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.Function;
    }
    
    public readonly params: string[];       // 参数名
    public readonly types: Array<MemberContext|undefined>;  // 参数类型
    public readonly values: Array<CodeContext|undefined>;   // 参数值

    public readonly name: string;
    public readonly isStatic: boolean;

    public readonly hasDynamicParams: boolean;

    public readonly cmdBlock: CmdBlock;

    public autoTrigger: boolean = false;

    public autoTriggerParams: Array<CodeContext|undefined> = [];

    public constructor(name: string, isStatic: boolean, params: string[], types: Array<MemberContext|undefined>,
         values: Array<CodeContext|undefined>, hasDynamicParams: boolean, cmdBlock: CmdBlock, token: Token | null = null) {
        super(token);
        this.name = name;
        this.isStatic = isStatic;
        this.params = params;
        this.types = types;
        this.values = values;
        this.hasDynamicParams = hasDynamicParams;
        this.cmdBlock = cmdBlock;
    }

    public print() {
        console.log("--FunctionName: " + this.name);
        console.log("----Params: " + this.params.join(", "));
        console.log("----HasDynamicParams: " + this.hasDynamicParams);

        this.cmdBlock.print();
    }

}