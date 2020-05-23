import { Args } from "flags/mod.ts";
import { Command } from "./command.ts";

export class RunCommand implements Command {
    public readonly description: string = "Runs the project."

    public async invoke(args: Args): Promise<void> {
        // TODO
    }
}