import { Args } from "flags/mod.ts";
import { Command } from "./command.ts";
import { Context } from "../model/context.ts";

export class RunCommand implements Command {
    public readonly description: string = "Runs the project."

    public async invoke(args: Args, context: Context): Promise<void> {
        context.loadProject();
        await Deno.run({ cmd: context.projectCommand.concat([context.project.main]) }).status();
    }
}