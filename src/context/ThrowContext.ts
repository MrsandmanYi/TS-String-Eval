import { CodeContext, ContextType } from "./CodeContext";

export class ThrowContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.Throw;
    }
    
    public exception: CodeContext | null = null;
}