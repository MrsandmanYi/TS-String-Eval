import { BasicTypeContext } from "../../context/BasicTypeContext";
import { CodeContext, ContextType } from "../../context/CodeContext";
import { InvokeFunctionContext } from "../../context/InvokeFunctionContext";
import { MemberContext } from "../../context/MemberContext";
import { ProcessError } from "../base/ProcessError";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * 设置变量处理器, 用于设置变量的值
 */
class SetVariableSubProcessor extends SubProcessor {
    
    // 设置变量的值
    protected get value(): any {
        return this._params.value;
    }

    public processCore(out: ProcessResult): ProcessResult {
        
        let variableValue = this.value;

        let member = this.codeContext as MemberContext;
        if (member == null) {
            throw new ProcessError(null, "SetVariableProcessor: processCore 无法获取变量");
        }

        if (member.parent) {
            let currentMember: any = member;
            let members = [member];
            while (member.parent) {
                member = member.parent;
                members.push(member);
            }
            members.reverse();

            let result: any = undefined;
            if (members[0].contextType == ContextType.InvokeFunction) {            
                result = StatementProcessor.process(member, new ProcessResult()).value;
            }
            else{
                result = this.getContextValue(out, this.getMemberValue(members[0], out));
            }

            if (members.length > 0) {
                if (members[0].value == "this") {  //  this.a.b.c
                    result = this.currentThisPtr;
                }
                else if (members[0].value == "super") {  //  super.xxx
                    result = this.currentThisPtr[".super"].prototype;
                }
            }

            currentMember[".this"] = result;
            if (result) {
                members.shift();
            }

            let classContext: any = this.__classMap;
            let parent = undefined;
            for (let i = 0; i < members.length; i++) {
                if (result) {
                    parent = result;
                    if (members[i] instanceof InvokeFunctionContext) {
                        result = StatementProcessor.process(members[i], out).value;
                    }
                    else {
                        result = result[this.getMemberValue(members[i], out)];
                    }
                }

                if (classContext) {
                    // @ts-ignore
                    classContext = classContext[members[i].value];
                }
            }

            currentMember[".this"] = parent;
            if (parent && variableValue == undefined){
                // 删除元素
                let o = delete parent[this.getMemberValue(currentMember, out)];
                out.value = o;
                return out;
            }
            else if (parent) {
                parent[this.getMemberValue(currentMember, out)] = variableValue;
            }

        }
        else {
            let key = this.getMemberValue(member, out);
            let currentResult = out;
            let result = out;
            // 是否已经设置过值
            let hasSet = false;
            while (result && result.context[key] == undefined) {
                if (result.parent) {
                    result = result.parent;
                    if (result.context[key] !== undefined) {
                        result.context[key] = variableValue;
                        hasSet = true;
                        break;
                    }
                }
                else {
                    break;
                }
            } 

            if (!hasSet) {
                currentResult.context[this.getMemberValue(member,result)] = variableValue;
            }
        }

        return out;
    }

    private getMemberValue(member: MemberContext, out: ProcessResult): any {
        if (member.value instanceof BasicTypeContext) {
            return (member.value as BasicTypeContext).value;
        }
        else if (typeof(member.value) == "string" || typeof(member.value) == "number" || typeof(member.value) == "boolean") {
            return member.value;
        }
        else if (member instanceof MemberContext) {
            StatementProcessor.process(member.value as CodeContext, out);
        }
        else {
            // wtf?
            StatementProcessor.process(member, out);
        }
    }

}

export const SetVariableProcessor = new SetVariableSubProcessor();
