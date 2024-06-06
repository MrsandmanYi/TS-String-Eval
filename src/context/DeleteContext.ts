import { Token } from "../compiler/Token";
import { CodeContext } from "./CodeContext";

export class DeleteContext extends CodeContext {
    public readonly value: CodeContext | null;
    public constructor(value: CodeContext | null, token: Token | null = null) {
        super(token);
        this.value = value;
    }
}
