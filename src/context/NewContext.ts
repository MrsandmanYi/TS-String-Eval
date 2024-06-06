import { Token } from "../compiler/Token";
import { CodeContext } from "./CodeContext";

export class NewContext extends CodeContext {

    public readonly newObject: CodeContext | null;

    public constructor(newObject: CodeContext | null, token: Token | null = null) {
        super(token);
        this.newObject = newObject;
    }
}
