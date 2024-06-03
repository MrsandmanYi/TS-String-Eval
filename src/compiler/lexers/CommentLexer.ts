import { LexerResult, SubLexer } from "./SubLexer";

/**
 * 注释解析器，解析注释
 */
export class CommentLexer extends SubLexer {
    
    public parse(lines: string[], lineIndex: number, columnIndex: number, out: LexerResult): boolean {
        
        let line = lines[lineIndex];
        let char = line[columnIndex];
        let nextChar = columnIndex + 1 < line.length ? line[columnIndex + 1] : "";
        // 判断是否是注释
        if (char === "/" && nextChar === "/") {            
            out.type = "Comment";
            out.text = line.substring(columnIndex);
            out.line = lineIndex;
            out.startColumn = columnIndex;
            out.endColumn = line.length - 1;
            return true;
        }
        else if(char === "/" && nextChar === "*") {
            // 得到所有的注释信息，直到遇到 */，会有跨行的可能
            let commentText = "";
            for (let i = lineIndex; i < lines.length; i++) {
                let line = lines[i];
                if (i === lineIndex) {
                    commentText = "/*";
                    for(let j = columnIndex + 2; j < line.length; j++) {
                        let char = line[j];
                        let nextChar = j + 1 < line.length ? line[j + 1] : "";

                        if (char === "*" && nextChar === "/") {
                            commentText += "*/";
                            out.type = "Comment";
                            out.text = commentText;
                            out.line = lineIndex;
                            out.endLine = i;
                            out.startColumn = columnIndex;
                            out.endColumn = j + 1;
                            return true;   
                        }
                        else {
                            commentText += char;
                        }
                    }
                }
                else {
                    let index = line.indexOf("*/");
                    if (index >= 0) {
                        commentText += line.substring(0, index + 2);
                        out.type = "Comment";
                        out.text = commentText;
                        out.line = lineIndex;
                        out.endLine = i;
                        out.startColumn = columnIndex;
                        out.endColumn = index + 1;
                        return true; 
                    }
                    else {
                        commentText += line + "\n";
                    }
                }

            }
        }

        return false;
    }
}
