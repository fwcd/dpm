import * as path from "path/mod.ts";
import { Args } from "flags/mod.ts";
import { Command } from "./command.ts";
import { Context } from "../model/context.ts";
import { promptWith } from "../utils/prompt.ts";

export class InitCommand implements Command {
    public readonly description: string = "Initializes a new Deno project in the current directory.";

    public async invoke(args: Args, context: Context): Promise<void> {
        const decoder = new TextDecoder("utf-8");

        const defaultName = path.basename(context.projectPath);
        const defaultBinname = undefined;
        const defaultVersion = "0.0.1";
        const defaultDescription = "My cool project";
        const defaultAuthor = decoder.decode(await Deno.run({ cmd: ["git", "config", "user.name"], stdout: "piped", stderr: "piped" }).output()).trim();
        const defaultMain = "src/index.ts";

        const name = await promptWith(`Project name? (default: ${defaultName})`) || defaultName;
        const binname = await promptWith(`Project binname? (default: ${defaultBinname})`) || defaultBinname;
        const version = await promptWith(`Project version? (default: ${defaultVersion})`) || defaultVersion;
        const description = await promptWith(`Project description? (default: ${defaultDescription})`) || defaultDescription;
        const author = await promptWith(`Project author? (default: ${defaultAuthor})`) || defaultAuthor;
        const main = await promptWith(`Path to main file? (default: ${defaultMain})`) || defaultMain;

        context.project = {
            name,
            binname,
            version,
            description,
            author,
            main
        };
        await context.saveProject();
    }
}