import { CmdBlock } from "../../command/CmdBlock";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { BreakProcessor } from "./BreakProcessor";
import { ContinueProcessor } from "./ContinueProcessor";
import { InvokeProcessor } from "./InvokeProcessor";
import { ReturnProcessor } from "./ReturnProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";
import { VarProcessor } from "./VarProcessor";

class CommandSubProcessor extends SubProcessor {

    private get cmdBlock(): CmdBlock {
        if (!this._params) {
            throw new Error("CommandSubProcessor: _params is null");
        }
        return this._params.cmdBlock;
    }
        

    public processCore(out: ProcessResult): ProcessResult {
        
        for(let i = 0; i < this.cmdBlock.commands.length; i++) {
            let cmd = this.cmdBlock.commands[i];
            this.processCommand(cmd, out);
            if (out.isOver || out.isBreak || out.isContinue) {      //  TODO: continue break? 
                break;
            }
        }
        return out;
    }


    public processCommand(cmd: Command, out: ProcessResult): ProcessResult {
       
        switch(cmd.type) {
            case CommandType.Let: VarProcessor.process(null, out, cmd); break;
            case CommandType.Return_CMD: ReturnProcessor.process(null, out, cmd); break;
            case CommandType.Resolve_CMD: StatementProcessor.process(null, out, cmd); break;
            case CommandType.Continue_CMD: ContinueProcessor.process(null, out, cmd); break;
            case CommandType.Break_CMD: BreakProcessor.process(null, out, cmd); break;
            case CommandType.Function_CMD: InvokeProcessor.process(null, out, cmd); break;
            case CommandType.If_CMD: 
        }

        return out;
    }

}

export const CommandProcessor = new CommandSubProcessor();
