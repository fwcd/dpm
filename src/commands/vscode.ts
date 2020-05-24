import * as path from "std/path/mod.ts";
import * as fs from "std/fs/mod.ts";
import { Args } from "std/flags/mod.ts";
import { Command } from "./command.ts";
import { Context } from "../model/context.ts";

export class VSCodeCommand implements Command {
    public readonly description: string = "Configures the VSCode Deno extension to use the correct import map on this project";

    public async invoke(args: Args, context: Context): Promise<void> {
        const dotVscodePath = path.join(context.projectPath, ".vscode");
        const settingsPath = path.join(dotVscodePath, "settings.json");
        await fs.ensureDir(dotVscodePath);

        let settings: any = {};
        if (await fs.exists(settingsPath)) {
            settings = await fs.readJson(settingsPath);
        }

        settings["deno.unstable"] = true;
        settings["deno.importmap"] = context.projectJsonPath;

        await fs.writeJson(settingsPath, settings, { spaces: 4 });
        console.log("Successfully configured VSCode-Deno in this project!");
    }
}