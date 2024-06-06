import { CodeContext } from "./CodeContext";

/**
 * 调用函数类型, 普通调用，new调用
 */
export enum InvokeFuncType {
    Normal = 1, 
    New = 2,    // new
}

export class InvokeFunctionContext extends CodeContext {
    
    public invokeFuncType: InvokeFuncType = InvokeFuncType.Normal; // 调用类型
    public member: CodeContext | null = null;  // 所属成员
    public args: CodeContext[] = []; // 参数列表
}