import { CmdBlockType } from '../../command/CmdBlockType';
import { ClassContext } from "../../context/ClassContext";
import { CodeContext } from "../../context/CodeContext";
import { FunctionContext } from "../../context/FunctionContext";
import { ProcessError } from "../base/ProcessError";
import { FunctionProcessor } from "./FunctionProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

// @ts-ignore
let __extends = (this && this.__extends) || function __extends(t: any, e: any) {
    // t: 子类 (target)
    // e: 父类 (base)
    function r() {
        // @ts-ignore
        this.constructor = t; // 将构造函数设置为子类
    }
    // 将父类的静态属性复制到子类
    for (var i in e) 
        if (e.hasOwnProperty(i)) 
            t[i] = e[i];
    // 将父类的原型对象设置为子类的原型对象
    r.prototype = e.prototype;
    // @ts-ignore
    t.prototype = new r(); // 创建父类原型的一个新实例并赋值给子类的原型
};


class ClassSubProcessor extends SubProcessor {

    protected get classContext(): ClassContext {
        return this.codeContext as ClassContext;
    }

    public processCore(out: ProcessResult): ProcessResult {
        
        this.currentClass = this.classContext;

        let parentClass = null;
        if (this.classContext instanceof CodeContext) {
            let oldClass = this.currentClass;
            if (this.classContext.parentClass != null) {
                parentClass = ClassProcessor.process(this.classContext.parentClass, out, null).value;
            }
            this.currentClass = oldClass;
        }
        else {
            throw new Error("ClassSubProcessor.processCore: 无法处理的类上下文类型: " + this.classContext);
            //parentClass = this.classContext.parentClass;
        }

        let self = this;
        let __Class = (function(__super : any) {
            let __classContext = self.classContext;
            if (!!parentClass) {
                __extends(ClassCtor, __super);
            }

            // 类构造函数
            function ClassCtor(this: any) {
                if (!this) {
                    throw new ProcessError(null, "ClassCtor: this 指针不能为空");
                }
                this[".classPath"] = __classContext.className;
                this[".super"] = __super;

                let args: IArguments = arguments; // arguments 是一个类数组对象，它代表了被传递给一个函数的参数。
                let ctor: FunctionContext | undefined = __classContext.getFunction("constructor"); 
                if (ctor) {
                    // 如果有构造函数，则直接调用构造函数
                    let variableMap = __classContext.variableMap;
                    // 构造函数指令集合
                    let commands = ctor.cmdBlock.commands;
                    
                    let __this = self.currentThisPtr = this;
                    if (__super && (commands.length == 0 || commands[0].token == null ||
                         commands[0].token.tokenText != "super")) {
                        throw new ProcessError(null, "子类构造函数必须调用 super");
                    }

                    if (commands.length > 0) {
                        // 如果有 super 调用，则需要将 super 调用的 this 指针传递给构造函数
                        if (commands[0].token && commands[0].token.tokenText == "super") {
                            __this = self.currentThisPtr = (__super && __super.call(this,args)) || this;
                        }
                    }
                    // 开始增加成员变量，并为成员变量赋默认值
                    variableMap.forEach((value, key) => {
                        let result = new ProcessResult();
                        result.blockType = CmdBlockType.Function;
                        result.context = __this;
                        __this[key] = StatementProcessor.process(variableMap.get(key)?.value, result).value;
                    });
                    // 调用构造函数
                    FunctionProcessor.process(ctor, out, null, {thisObject: __this}).value();
                    return __this;
                }
                else {
                    let __this = __super && __super.call(this, args) || this;
                    self.currentThisPtr = __this;
                    // 开始增加成员变量，并为成员变量赋默认值
                    __classContext.variableMap.forEach((value, key) => {
                        let result = new ProcessResult();
                        result.blockType = CmdBlockType.Function;
                        result.context = __this;
                        __this[key] = StatementProcessor.process(__classContext.variableMap.get(key)?.value, result).value;
                    });
                    return __this;
                }
            }

            // 处理类的成员函数
            __classContext.functionMap.forEach((func, key) => {
                if (key == "constructor") {
                    // 构造函数不需要处理
                    return;
                }
                let markName = key.substring(0, 5);
                if (markName == ".get.") {
                    let funcName = key.substring(5);
                    Object.defineProperty(ClassCtor.prototype, funcName, {
                        get: StatementProcessor.process(func, new ProcessResult(CmdBlockType.Function)).value
                    });
                }
                else if (markName == ".set.") {
                    let funcName = key.substring(5);
                    Object.defineProperty(ClassCtor.prototype, funcName, {
                        set: StatementProcessor.process(func, new ProcessResult(CmdBlockType.Function)).value
                    });
                }
                else {
                    ClassCtor.prototype[key] = StatementProcessor.process(func, new ProcessResult(CmdBlockType.Function)).value;
                }
            });

            // 处理静态属性
            __classContext.staticVariableMap.forEach((value, key) => {
                let __Ctor: any = ClassCtor;
                __Ctor[key] = StatementProcessor.process(__classContext.staticVariableMap.get(key), new ProcessResult(CmdBlockType.Function)).value;
            });

            // 处理静态函数
            __classContext.staticFunctionMap.forEach((value, key) => {
                let __Ctor: any = ClassCtor;
                __Ctor[key] = StatementProcessor.process(__classContext.staticFunctionMap.get(key), new ProcessResult(CmdBlockType.Function)).value;
            });

            return ClassCtor;
        }(parentClass));
        out.value = __Class;
        return out;
    }
    
}

export const ClassProcessor = new ClassSubProcessor();