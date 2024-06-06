import { ConditionBlock } from "../compiler/base/ConditionBlock";
import { CodeContext } from "./CodeContext";

export class WhileContext extends CodeContext {

    public whileCondition: ConditionBlock | null = null;

}
