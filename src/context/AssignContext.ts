import { Token } from "../compiler/Token";
import { TokenType } from "../compiler/TokenType";
import { CodeContext, ContextType } from "./CodeContext";
import { MemberContext } from "./MemberContext";

export class AssignContext extends CodeContext {

    public get contextType(): ContextType {
        return ContextType.Assign;
    }

    public readonly member: MemberContext;
    public readonly value: CodeContext;
    public readonly assignType: TokenType;


    constructor(member: MemberContext, value: CodeContext, assignType: TokenType, token: Token | null = null) {
        super(token);
        this.member = member;
        this.value = value;
        this.assignType = assignType;
    }
}
