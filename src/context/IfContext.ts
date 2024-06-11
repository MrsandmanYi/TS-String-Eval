import { ConditionBlock } from "../compiler/base/ConditionBlock";
import { CodeContext, ContextType } from "./CodeContext";

export class IfContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.If;
    }
    
    public ifCondition: ConditionBlock | null = null;
    public elseIfConditions: ConditionBlock[] = [];
    public elseCondition: ConditionBlock | null = null;

    public addElseIf(condition: ConditionBlock) {
        this.elseIfConditions.push(condition);
    }
}