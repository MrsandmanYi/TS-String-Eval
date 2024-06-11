import { CodeContext, ContextType } from "./CodeContext";

/**
 * 数组上下文
 * 语法: [element1, element2, ...]
 */
export class ArrayContext extends CodeContext {
    public get contextType(): ContextType {
        return ContextType.Array;
    }
    /**
     * 元素list
     */
    public elements: Array<CodeContext | null> = [];

    /**
     * 添加元素
     * @param element 
     */
    public addElement(element: CodeContext | null) {
        this.elements.push(element);
    }
}
