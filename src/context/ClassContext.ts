import { Token } from "../compiler/Token";
import { CodeContext, ContextType } from "./CodeContext";
import { FunctionContext } from "./FunctionContext";
import { VariableContext } from "./VariableContext";

export class ClassContext extends CodeContext {
    
    public get contextType(): ContextType {
        return ContextType.Class;
    }
    
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

    public print() {
        // 打印出类的信息，包括类名，父类，成员变量，成员方法
        console.log("Class: " + this.className);
        console.log("Parent: " + (!!this.parentClassName? this.parentClassName : "null"));
        console.log("Abstract: " + this.isAbstract);
        console.log("Export: " + this.isExport);
        console.log("");

        if (this.variableMap.size > 0) {   
            console.log("Variables:");
            this.variableMap.forEach((variable, key) => {
                variable.print();
                console.log("");
            });   
        }

        if (this.staticVariableMap.size > 0){
            console.log("Static Variables:");
            this.staticVariableMap.forEach((variable, key) => {
                variable.print();
                console.log("");
            });
        }

        if(this.functionMap.size > 0){
            console.log("Functions:");
            this.functionMap.forEach((func, key) => {
                func.print();
                console.log("");
            });
        }

        if (this.staticFunctionMap.size > 0) {
            console.log("Static Functions:");
            this.staticFunctionMap.forEach((func, key) => {
                func.print();
                console.log("");
            });
        }

    }
}
