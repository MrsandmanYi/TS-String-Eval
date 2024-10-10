import { CodeContext, ContextType } from "../../context/CodeContext";
import { FunctionContext } from '../../context/FunctionContext';
import { InvokeFuncType, InvokeFunctionContext } from "../../context/InvokeFunctionContext";
import { MemberContext } from "../../context/MemberContext";
import { Logger } from "../../utils/Logger";
import { ENV_EDITOR } from "../../utils/Marco";
import { ProcessError } from "../base/ProcessError";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * 调用处理器, 用于调用函数
 */
class InvokeSubProcessor extends SubProcessor {
    public processCore(out: ProcessResult): ProcessResult {
        let invokeContext = this.codeContext;
        if (!invokeContext) throw new ProcessError(null, "InvokeSubProcessor: processCore 无法获取当前上下文");
        let params = [];    // 参数列表
        let func: Function | null = null;

        if (invokeContext.contextType == ContextType.InvokeFunction) {
            let invokeFunctionContext = invokeContext as InvokeFunctionContext;
            for (let i = 0; i < invokeFunctionContext.args.length; i++) {
                let arg = invokeFunctionContext.args[i];
                let argResult = StatementProcessor.process(arg, out);
                params.push(argResult.value);
            }
        }
        else if (invokeContext.contextType == ContextType.Function) {
            let funcContext = invokeContext as FunctionContext;
            for (let i = 0; i < funcContext.params.length; i++) {
                let param = funcContext.params[i];
                let paramResult = StatementProcessor.process(param, out);
                params.push(paramResult.value);
            }

        }

        if (invokeContext.contextType == ContextType.Function) {
            func = StatementProcessor.process(invokeContext, out).value;
            if (!func) {
                throw new ProcessError(null, "InvokeSubProcessor: processCore 无法获取函数 1");
            }
            func.apply(this.__global, params);
        }
        else {
            let invokeFuncContext = invokeContext as InvokeFunctionContext;
            if (invokeFuncContext.member instanceof CodeContext) {
                func = StatementProcessor.process(invokeFuncContext.member, out).value;
            }
            else {
                func = invokeFuncContext.member;
            }

            if (!func) {
                if (ENV_EDITOR) {
                    Logger.error("invokeFuncContext: ",JSON.stringify(invokeFuncContext))                    
                }
                throw new ProcessError(null, "InvokeSubProcessor: processCore 无法获取函数 2 :" + invokeContext.token?.toString());
            }

            if (invokeFuncContext.invokeFuncType != InvokeFuncType.New) {
                let isSuper = false;
                if (invokeFuncContext.member instanceof MemberContext) {
                    let parent = invokeFuncContext.member.parent;
                    if (parent) {
                        // TODO
                    }
                    else {
                        isSuper = invokeFuncContext.member.value == "super";
                        if (isSuper) {
                            func = this.currentThisPtr[".super"];
                        }
                    }
                }


                let recordThisPtr = this.currentThisPtr;
                if ((invokeFuncContext.member as any)[".this"]) { // TODO 恶心的写法
                    let canChangeThis = true;
                    if (invokeFuncContext.member instanceof MemberContext) {
                        let parent = invokeFuncContext.member.parent;
                        if (parent && parent instanceof MemberContext && parent.value == "super") {
                            canChangeThis = false;
                        }
                    }

                    if (canChangeThis) {
                        this.currentThisPtr = (invokeFuncContext.member as any)[".this"];
                    }
                }
                else {
                    // 拿不到this,则是静态方法
                    this.currentThisPtr = this.__global;
                }
                let result = !isSuper ? func?.apply(this.currentThisPtr, params) : func?.apply(recordThisPtr, params);
                this.currentThisPtr = recordThisPtr;
                out.value = result;
                return out;
            }
            else{
                let recordThisPtr = this.currentThisPtr;
                let result = new (func.bind.apply(func,[null, ...params]))();
                this.currentThisPtr = recordThisPtr;
                out.value = result;
                return out;
            }
        }

        return out;
    }

}

export const InvokeProcessor = new InvokeSubProcessor();