import { CmdBlock } from "../../command/CmdBlock";
import { Command } from "../../command/Command";
import { CommandType } from "../../command/CommandType";
import { BreakProcessor } from "./BreakProcessor";
import { ContinueProcessor } from "./ContinueProcessor";
import { DeleteProcessor } from "./DeleteProcessor";
import { ForInProcessor } from "./ForInProcessor";
import { ForOfProcessor } from "./ForOfProcessor";
import { ForProcessor } from "./ForProcessor";
import { ForSimpleProcessor } from "./ForSimpleProcessor";
import { IfProcessor } from "./IfProcessor";
import { InvokeProcessor } from "./InvokeProcessor";
import { NewProcessor } from "./NewProcessor";
import { ReturnProcessor } from "./ReturnProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";
import { SwitchProcessor } from "./SwitchProcessor";
import { ThrowProcessor } from "./ThrowProcessor";
import { TryProcessor } from "./TryProcessor";
import { TypeofProcessor } from "./TypeofProcessor";
import { VarProcessor } from "./VarProcessor";
import { WhileProcessor } from "./WhileProcessor";

class CommandSubProcessor extends SubProcessor {

    private get cmdBlock(): CmdBlock {
        if (this.codeContext && this.codeContext instanceof CmdBlock) {
            return this.codeContext as CmdBlock; // TODO
        }

        if (!this._params) {
            throw new Error("CommandSubProcessor: _params is null");
        }
        return this._params.cmdBlock;
    }
        

    public processCore(out: ProcessResult): ProcessResult {
        // fix: 修复了无法执行多个命令的问题, 持有命令块，防止嵌套调用cmdBlock被替换
        let cmdBlock = this.cmdBlock;

        for(let i = 0; i < cmdBlock.commands.length; i++) {
            let cmd = cmdBlock.commands[i];
            this.processCommand(cmd, out);
            if (out.isOver || out.isBreak || out.isContinue) {      //  TODO: continue break? 
                break;
            }
        }
        return out;
    }


    public processCommand(cmd: Command, out: ProcessResult): ProcessResult {
       
        switch(cmd.type) {
            case CommandType.Let: VarProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Return_CMD: ReturnProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Resolve_CMD: StatementProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Continue_CMD: ContinueProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Break_CMD: BreakProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Function_CMD: InvokeProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.If_CMD: IfProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.For_CMD: ForProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.ForIn_CMD: ForInProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.ForOf_CMD: ForOfProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.ForSimple_CMD: ForSimpleProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.While_CMD: WhileProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Switch_CMD: SwitchProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Try_CMD: TryProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Throw_CMD: ThrowProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.New_CMD: NewProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Typeof_CMD: TypeofProcessor.process(cmd.codeContext, out, cmd); break;
            case CommandType.Delete_CMD: DeleteProcessor.process(cmd.codeContext, out, cmd); break;
        }
    
        return out;
    }

}

export const CommandProcessor = new CommandSubProcessor();
