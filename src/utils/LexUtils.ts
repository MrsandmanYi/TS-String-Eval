
export class LexUtils {

    public static isLetter(ch: string): boolean {
        return /^[a-zA-Z]$/.test(ch);
    }

    public static isDigit(ch: string): boolean {
        return /^[0-9]$/.test(ch);
    }

    public static isLetterOrDigit(ch: string): boolean {
        return /^[a-zA-Z0-9]$/.test(ch);
    }

}
