import { ConditionBlock } from "../compiler/base/ConditionBlock";
import { CodeContext, ContextType } from "./CodeContext";

export class WhileContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.While;
    }
    
    public whileCondition: ConditionBlock | null = null;

}
