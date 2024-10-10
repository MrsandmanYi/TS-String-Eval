import {describe, expect, test} from '@jest/globals';
import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {

    sum(a : number, b : number) : number {
        return a + b;
    }

    constructor() { 
        // console.log(".......constructor unit test.......");
        let self = this;
        let test = () => {
            jest.expect(self.sum(1,2)).toBe(3);
        }
        jest.test('adds 1 + 2 to equal 3', test);
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

