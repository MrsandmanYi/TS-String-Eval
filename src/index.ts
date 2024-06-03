import { Lexer } from "./compiler/Lexer";



const lexer = new Lexer(`
for(let i = 0; i < 10; i++) {
    console.log(i);
    console.log(i * 2.1);
}
`);

lexer.parserTokens();

let tokens = lexer.tokens;
console.log(tokens);
