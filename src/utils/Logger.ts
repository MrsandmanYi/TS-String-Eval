
import { ENV_EDITOR } from "./Marco";

export class Logger
{
    public static log(message: string, ...args: any[]) {
        if (!ENV_EDITOR) return;
        console.log(message, ...args);
    }

    public static warn(message: string, ...args: any[]) {
        if (!ENV_EDITOR) return;
        console.warn(message, ...args);
    }

    public static error(message: string, ...args: any[]) {
        if (!ENV_EDITOR) return;
        console.error(message, ...args);
    }

    public static info(message: string, ...args: any[]) {
        if (!ENV_EDITOR) return;
        console.info(message, ...args);
    }

    public static debug(message: string, ...args: any[]) {
        if (!ENV_EDITOR) return;
        console.debug(message, ...args);
    }

    public static assert(condition: boolean, message: string, ...args: any[]) {
        if (!ENV_EDITOR) return;
        console.assert(condition, message, ...args);
    }

}