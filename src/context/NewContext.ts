import { Token } from "../compiler/Token";
import { CodeContext, ContextType } from "./CodeContext";

export class NewContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.New;
    }
    
    public readonly newObject: CodeContext | null;

    public constructor(newObject: CodeContext | null, token: Token | null = null) {
        super(token);
        this.newObject = newObject;
    }
}
