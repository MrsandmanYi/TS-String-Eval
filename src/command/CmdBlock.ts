import { CmdBlockType } from "./CmdBlockType";
import { Command } from "./Command";


/**
 * 指令块
 * 包含一组指令
 */
export class CmdBlock {
    
    private _commands: Command[] = [];
    public get commands(): Command[] {
        return this._commands;
    }

    private _parent: CmdBlock | null = null;
    public get parent(): CmdBlock | null {
        return this._parent;
    }

    private _blockType: CmdBlockType = CmdBlockType.None;
    public get blockType(): CmdBlockType {
        return this._blockType;
    }

    constructor(blockType: CmdBlockType, parent: CmdBlock | null = null) {
        this._blockType = blockType;
        this._parent = parent;
    }

    public addCommand(command: Command): void {
        this._commands.push(command);
    }

    public print(): void {
        if (this.parent) {
            this.parent.print();
        }

        console.log("   -->CmdBlock: " + CmdBlockType[this.blockType]);
        for (let i = 0; i < this.commands.length; i++) {
            this.commands[i].print();
        }
        console.log("   -->CmdBlock End: " + CmdBlockType[this.blockType]);

    }

}