import { AccessModifier, CodeContext, ContextType } from "./CodeContext";

/**
 * 变量上下文
 */
export class VariableContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.Variable;
    }
    
    /** 变量名 */
    public readonly name: string;
    /** 值 */
    public readonly value: any;
    /** 访问修饰符 */
    public readonly modifier: AccessModifier;
    /** 是否为静态变量 */
    public readonly isStatic: boolean;

    constructor(name: string,
        value: any,
        modifier: AccessModifier = AccessModifier.Public,
        isStatic: boolean = false,
        token: any = null
    ) {
        super(token);
        this.name = name;
        this.value = value;
        this.modifier = modifier;
        this.isStatic = isStatic;
    }

}
