import { CmdBlockType } from "../../command/CmdBlockType";
import { FunctionContext } from "../../context/FunctionContext";
import { CommandProcessor } from "./CommandProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";
import { StatementProcessor } from "./StatementProcessor";

class FunctionSubProcessor extends SubProcessor {

    private get thisObject(): any {
        if (!this._params) {
            return null;
        }
        return this._params.thisObject;
    }

    public processCore(out: ProcessResult): ProcessResult {
        let self = this;
        let selfObject = this.thisObject;
        let funcContext = self.codeContext as FunctionContext;
        let tempFunc : any = (function() {

            let cmd = funcContext.cmdBlock;
            let params = funcContext.params;
            let values = funcContext.values;

            let __this = selfObject;

            function tempFunc(this: any) {
                self.currentThisPtr = this;
                for(let i = 0; i < params.length; i++) {
                    if (arguments.length < i + 1) {
                        // @ts-ignore
                        tempFunc[params[i]] = null;
                    }
                    else{
                        // @ts-ignore
                        tempFunc[params[i]] = arguments[i] || StatementProcessor.process(values[i], out).value;
                    }
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

        if (selfObject) {
            out.value = tempFunc.bind(selfObject);
        }
        else {
            out.value = tempFunc;
        }

        return out;
    }
}

export const FunctionProcessor = new FunctionSubProcessor();