import { Token } from "../compiler/Token";
import { CodeContext, ContextType } from "./CodeContext";

export class DeleteContext extends CodeContext {

    public get contextType(): ContextType {
        return ContextType.Delete;
    }

    public readonly value: CodeContext | null;
    public constructor(value: CodeContext | null, token: Token | null = null) {
        super(token);
        this.value = value;
    }
}
