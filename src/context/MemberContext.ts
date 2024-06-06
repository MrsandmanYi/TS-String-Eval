import { CodeContext } from "./CodeContext";


/**
 * 成员操作符 
 */
export enum MemberMutator {
    None = 0,
    PreIncrement = 1,
    PreDecrement = 2,
    PostIncrement = 3,
    PostDecrement = 4,
}

/**
 * 成员上下文
 */
export class MemberContext extends CodeContext{

    public readonly parent: MemberContext | null;  // parent.member, a.member

    public readonly value : string | CodeContext | number | Function;

    public mutator: MemberMutator;

    constructor(
        parent: MemberContext | null, 
        value: string | CodeContext | number | Function,
        mutator: MemberMutator = MemberMutator.None,
        token: any = null){
        super(token);
        this.parent = parent;
        this.value = value;
        this.mutator = mutator;
    }
}
