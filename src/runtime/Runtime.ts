import { SyntaxParser } from "../compiler/SyntaxParser";
import { Token } from "../compiler/Token";
import { ClassContext } from "../context/ClassContext";
import { ClassProcessor } from "./processor/ClassProcessor";
import { ProcessResult } from "./processor/SubProcessor";

export interface RunParams {
    tokens : Token[];
    mainClassName : string;
    global : any;
}

/**
 * 运行时
 */
export class RunTime {

    public static currentThisPtr: Function | null = null;

    public static currentClass: ClassContext | null = null;

    public static __global: any = null;

    public static __classMap: Map<string, ClassContext> = new Map<string, ClassContext>();

    public static __main: any = null;

    public static run(params : RunParams): void {
        
        SyntaxParser.parse(params.tokens);

        RunTime.__classMap = SyntaxParser.classMap;
        RunTime.__global = params.global;
        
        // 解析类
        RunTime.__classMap.forEach((value, key) => {
            let cls = ClassProcessor.process(value,new ProcessResult()).value;
            RunTime.__global[key] = cls;
        });

        let mainCls = RunTime.__global[params.mainClassName];
        RunTime.__main = new mainCls();
    }

}
