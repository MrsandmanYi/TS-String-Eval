import { BasicTypeContext } from "../../context/BasicTypeContext";
import { CodeContext, ContextType } from '../../context/CodeContext';
import { InvokeFunctionContext } from '../../context/InvokeFunctionContext';
import { MemberContext, MemberMutator } from "../../context/MemberContext";
import { ProcessError } from "../base/ProcessError";
import { ClassProcessor } from "./ClassProcessor";
import { SetVariableProcessor } from "./SetVariableProcessor";
import { StatementProcessor } from "./StatementProcessor";
import { ProcessResult, SubProcessor } from "./SubProcessor";

/**
 * 获取变量处理器, 用于获取变量的值
 */
class GetVariableSubProcessor extends SubProcessor {
    
    public processCore(out: ProcessResult): ProcessResult {
        let member = this.codeContext as MemberContext;
        if (member == null) {
            throw new ProcessError(null, "GetVariableProcessor: processCore 无法获取变量");
        }
        let result: any  = undefined;

        if (member.parent) {
            let currentMember: any = member;
            let members = [member];
            while (member.parent) {
                member = member.parent;
                members.push(member);
            }
            members.reverse();
            if (members[0].contextType == ContextType.InvokeFunction) {            
                result = StatementProcessor.process(member, out).value;
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
            if (result == undefined && classContext) {
                let currentClass = this.currentClass;
                let result = ClassProcessor.process(classContext, out).value;
                this.currentClass = currentClass;

                out.value = result;
                return result;
            }

        }
        else {
            if (member.value == "this") {
                result = this.currentThisPtr;
            }
            else if (member.value == "super") {
                result = this.currentThisPtr[".super"].prototype;
            }
            else {
                let value = this.getMemberValue(member, out);
                result = this.getContextValue(out, value, true);
                if (result == undefined) {
                    if(!this.currentClass){
                        throw new ProcessError(member, "GetVariableProcessor: processCore 无法获取变量");
                    }
                    result = this.__global[this.currentClass.className] || this.__global[value];
                }
                else if (result.isNull) {
                    result = null;
                }
            }
        }

        // 处理自增、自减运算符
        if (member.mutator != MemberMutator.None) {
            if (result == undefined) {
                throw new ProcessError(member, "GetVariableProcessor: processCore 无法获取变量");
            }
            if (typeof(result) != "number"){
                throw new ProcessError(member, "GetVariableProcessor: processCore 无法对非数字进行自增、自减操作");
            }

            if (member.mutator == MemberMutator.PreIncrement) {
                ++result;
            }
            else if (member.mutator == MemberMutator.PreDecrement) {
                --result;
            }
            else if (member.mutator == MemberMutator.PostIncrement) {
                result++;
            }
            else if (member.mutator == MemberMutator.PostDecrement) {
                result--;
            }

            SetVariableProcessor.process(member, out, null,{value: result});
        }

        out.value = result;
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
            return out.value;
        }
        else {
            // wtf?
            StatementProcessor.process(member, out);
            return out.value;
        }
    }

}

export const GetVariableProcessor = new GetVariableSubProcessor();