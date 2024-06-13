import { CmdBlockType } from "../../command/CmdBlockType";
import { IfContext } from "../../context/IfContext";
import { ConditionProcessor } from "./ConditionProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class IfSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {

        if (this.cmd == null) {
            throw new Error("IfSubProcessor: cmd is null");
        }

        let ifContext = this.cmd.codeContext as IfContext;
        if(ConditionProcessor.process(null,out,null,{
            conditionBlock: ifContext.ifCondition,
            cmdBlockType: CmdBlockType.If
        }).value){
            return out;
        }

        for(let i = 0; i < ifContext.elseIfConditions.length; i++){
            if(ConditionProcessor.process(null,out,null,{
                conditionBlock: ifContext.elseIfConditions[i],
                cmdBlockType: CmdBlockType.If
            }).value){
                return out;
            }
        }

        ConditionProcessor.process(null,out,null,{
            conditionBlock: ifContext.elseCondition,
            cmdBlockType: CmdBlockType.If
        });
        return out;
    }
}

export const IfProcessor = new IfSubProcessor();