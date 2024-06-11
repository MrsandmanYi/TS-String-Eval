import { ProcessResult, SubProcessor } from "./SubProcessor";

class DeleteSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        return out;
    }
}

export const DeleteProcessor = new DeleteSubProcessor();
