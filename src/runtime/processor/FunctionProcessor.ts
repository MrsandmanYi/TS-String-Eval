import { CmdBlockType } from "../../command/CmdBlockType";
import { FunctionContext } from "../../context/FunctionContext";
import { CommandProcessor } from "./CommandProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";


class FunctionSubProcessor extends SubProcessor {

    private get thisObject(): any {
        if (!this._params) {
            return null;
        }
        return this._params.thisObject;
    }

    public processCore(out: ProcessResult): ProcessResult {
        let self = this;
        let funcContext = self.codeContext as FunctionContext;
        let tempFunc : any = (function() {

            let cmd = funcContext.cmdBlock;
            let params = funcContext.params;
            let values = funcContext.values;

            let __this = self.thisObject;

            function tempFunc(this: any) {
                self.currentThisPtr = this;
                for(let i = 0; i < params.length; i++) {
                    // @ts-ignore
                    tempFunc[params[i]] = arguments[i] || this.StatementProcessor.process(values[i], out).value;
                }

                let result = new ProcessResult();
                result.blockType = CmdBlockType.Function;
                result.parent = out;
                result.context = tempFunc;

                result.value = CommandProcessor.process(null, result, null,{cmdBlock: cmd}).value;
                return result.value;
            }

            return tempFunc;
        })();

        if (this.thisObject) {
            out.value = tempFunc.bind(this.thisObject);
        }
        else {
            out.value = tempFunc;
        }

        return out;
    }
}

export const FunctionProcessor = new FunctionSubProcessor();