import { Args } from "https://deno.land/std@0.53.0/flags/mod.ts";
import { Command } from "./command.ts";

export class RunCommand implements Command {
    public readonly description: string = "Runs the project."

    public async invoke(args: Args): Promise<void> {
        // TODO
    }
}