import { ArrayContext } from "../../context/ArrayContext";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";


class ArraySubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        let arrayContext = this.codeContext as ArrayContext;
        let array: any[] = [];
        
        for(let i = 0; i < arrayContext.elements.length; i++){
            let element = arrayContext.elements[i];
            let ev = StatementProcessor.process(element, out).value;   
            array.push(ev);
        }
        
        out.value = array;
        return out;
    }
}

export const ArrayProcessor = new ArraySubProcessor();
