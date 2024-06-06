import { CodeContext } from "./CodeContext";

export class ThrowContext extends CodeContext {
    public exception: CodeContext | null = null;
}