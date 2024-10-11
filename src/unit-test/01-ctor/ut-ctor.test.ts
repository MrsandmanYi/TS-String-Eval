import {describe, expect, test} from '@jest/globals';
import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {

    sum(a : number, b : number) : number {
        return a + b;
    }

    constructor() { 
        this.jestTest('adds 1 + -1 to equal 0', this.sum, 0);
    }

    jestTest(desc, func, result) {
        let self = this;
        let r = result;
        let test = () => {
            jest.expect(func()).toBe(r);
        }
        jest.test(desc, test);
    }
}
`);

lexer.parserTokens();
let tokens = lexer.tokens;

RunTime.run({
    tokens: tokens,
    mainClassName: "Start",
    global: {
        console: console,
        jest: {
            describe: describe,
            expect: expect,
            test: test,
        }
    }
});

