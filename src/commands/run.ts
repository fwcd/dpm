import { Args } from "std/flags/mod.ts";
import { Command } from "./command.ts";
import { Context } from "../model/context.ts";

export class RunCommand implements Command {
    public readonly description: string = "Runs the project."

    public async invoke(args: Args, context: Context): Promise<void> {
        await context.loadProject();
        const runArgs: string[] = args._.map((a: any) => `${a}`);
        await Deno.run({ cmd: context.getProjectRunCommand().concat([...runArgs]) }).status();
    }
}