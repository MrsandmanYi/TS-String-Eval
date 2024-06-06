import { Token } from "../compiler/Token";
import { CodeContext } from "./CodeContext";

/**
 * TS typeof上下文
 * 语法: typeof(value)
 */
export class TypeofContext extends CodeContext {
    public readonly value: CodeContext;
    public constructor(value: CodeContext, token: Token | null = null) {
        super(token);
        this.value = value;
    }
}
