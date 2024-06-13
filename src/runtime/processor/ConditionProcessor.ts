import { CmdBlockType } from "../../command/CmdBlockType";
import { ConditionBlock } from "../../compiler/base/ConditionBlock";
import { CommandProcessor } from "./CommandProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class ConditionSubProcessor extends SubProcessor {
    
    private get conditionBlock(): ConditionBlock {
        if (!this._params) {
            throw new Error("ConditionSubProcessor: _params is null");
        }
        return this._params.conditionBlock;
    }

    private get cmdBlockType(): CmdBlockType {
        if (!this._params) {
            throw new Error("ConditionSubProcessor: _params is null");
        }
        return this._params.cmdBlockType;
    }
    
    public processCore(out: ProcessResult): ProcessResult {

        let conditionBlock = this.conditionBlock;
        let cmdBlockType = this.cmdBlockType;

        if(!conditionBlock){
            out.value = false;
            return out;
        }

        if (conditionBlock.condition) {
            let conditionResult = StatementProcessor.process(conditionBlock.condition, out);
            return out;
        }

        let result = new ProcessResult();
        result.value = undefined;
        result.blockType = cmdBlockType;
        result.parent = out;
        result.context = {};
        CommandProcessor.process(null, result,null,{
            cmdBlock : conditionBlock.cmdBlock
        });
        out.value = true;
        return out;
    }
}

export const ConditionProcessor = new ConditionSubProcessor();