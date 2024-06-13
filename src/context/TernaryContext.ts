import { CodeContext, ContextType } from "./CodeContext";

/**
 * 三元表达式上下文
 * 语法: condition ? trueBranch : falseBranch
 */
export class TernaryContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.Ternary;
    }
    
    public condition: CodeContext | null = null;    // 条件
    public trueBranch: CodeContext | null = null;   // 真分支
    public falseBranch: CodeContext | null = null;  // 假分支
}
