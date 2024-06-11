import { ClassContext } from "../context/ClassContext";


export class RunTime {

    public static currentThisPtr: Function | null = null;

    public static currentClass: ClassContext | null = null;

    public static __global: any = null;

    public static __classMap: Map<string, ClassContext> = new Map<string, ClassContext>();

    public static main(): void {
        console.log("Hello, world!");
    }

}
