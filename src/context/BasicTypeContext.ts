import { Token } from "../compiler/Token";
import { CodeContext, ContextType } from "./CodeContext";

/**
 * TS基本类型上下文
 * void\null\undefined\boolean\number\string\NaN
 */
export class BasicTypeContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.BasicType;
    }
    
    /**
     * 基本类型的值
     */
    public readonly value: any;

    constructor(value: any, token: Token | null = null) {
        super(token);
        this.value = value;
    }
}
