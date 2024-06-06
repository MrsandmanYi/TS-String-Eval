import { Token } from "../compiler/Token";
import { CodeContext } from "./CodeContext";
import { FunctionContext } from "./FunctionContext";
import { VariableContext } from "./VariableContext";

export class ClassContext extends CodeContext {
    
    public readonly isObject: boolean = false; // 是否为对象

    /** 类名 */
    public className: string = "";
    /** 是否为抽象类 */
    public isAbstract: boolean = false;
    /** 是否导出 */
    public isExport: boolean = false;

    /** 父类 */
    public parentClassName: string | null = null;       // 父类名
    public parentClass: ClassContext | null = null;     // 父类上下文，解析完成后再填充

    /** 实例变量 */
    public variableMap: Map<string, VariableContext> = new Map<string, VariableContext>();
    /** 静态变量 */
    public staticVariableMap: Map<string, VariableContext> = new Map<string, VariableContext>();

    /** 类方法 */
    public functionMap: Map<string, FunctionContext> = new Map<string, FunctionContext>();
    /** 静态方法 */
    public staticFunctionMap: Map<string, FunctionContext> = new Map<string, FunctionContext>();

    public constructor(isObject : boolean = false, token: Token | null = null) {
        super(token);
        this.isObject = isObject;
    }

    public addVariable(variable: VariableContext) {
        if (variable.isStatic) {
            this.staticVariableMap.set(variable.name, variable);
        } else {
            this.variableMap.set(variable.name, variable);
        }
    }

    public addFunction(func: FunctionContext) {
        if (func.isStatic) {
            this.staticFunctionMap.set(func.name, func);
        } else {
            this.functionMap.set(func.name, func);
        }
    }

    public getVariable(name: string): VariableContext | undefined {
        return this.variableMap.get(name) || this.staticVariableMap.get(name);
    }
    
    public getFunction(name: string): FunctionContext | undefined {
        return this.functionMap.get(name) || this.staticFunctionMap.get(name);
    }
}
