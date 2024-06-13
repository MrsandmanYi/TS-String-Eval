

export class Logger
{
    public static log(message: string, ...args: any[]) {
        console.log(message, ...args);
    }

    public static warn(message: string, ...args: any[]) {
        console.warn(message, ...args);
    }

    public static error(message: string, ...args: any[]) {
        console.error(message, ...args);
    }

    public static info(message: string, ...args: any[]) {
        console.info(message, ...args);
    }

    public static debug(message: string, ...args: any[]) {
        console.debug(message, ...args);
    }

    public static assert(condition: boolean, message: string, ...args: any[]) {
        console.assert(condition, message, ...args);
    }

}