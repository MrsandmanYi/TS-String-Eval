import { TernaryContext } from "../../context/TernaryContext";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

class TernarySubProcessor extends SubProcessor {

    public processCore(out: ProcessResult): ProcessResult {
        let ternaryContext = this.codeContext as TernaryContext;
        let condition = ternaryContext.condition;
        let trueBlock = ternaryContext.trueBranch;
        let falseBlock = ternaryContext.falseBranch;

        let result = StatementProcessor.process(condition, out).value;
        if (result) {
            StatementProcessor.process(trueBlock, out);
        } else {
            StatementProcessor.process(falseBlock, out);
        }
        return out;
    }
}

export const TernaryProcessor = new TernarySubProcessor();
