import { Args } from "std/flags/mod.ts";
import { Command } from "./command.ts";
import { Context } from "../model/context.ts";
import { pluralize } from "../utils/strings.ts";

export class AddCommand implements Command {
    public readonly description: string = "Adds a list of dependencies to the project."

    public async invoke(args: Args, context: Context): Promise<void> {
        await context.loadProject();

        const project = context.project;
        if (!project.imports) {
            project.imports = {};
        }
        
        const joinedArgs = args._.map(a => `${a}`).join(" ");
        const pattern = /(?:(?<name>[\w-/]+)(?<ver>@.+)?)\s*(?<url>http\S+)?/g;
        let addedCount = 0;
        let match: RegExpExecArray | null;
        while (match = pattern.exec(joinedArgs)) {
            const name = match.groups!.name;
            const versionPostfix = match.groups?.ver || "";
            const scope = name.startsWith("std") ? "" : "x/";
            const url = match.groups?.url || `https://deno.land/${scope}${name}${versionPostfix}/`;

            project.imports[`${name}/`] = url;
            console.log(`Adding ${name} -> ${url}`);
            addedCount += 1;
        }

        await context.saveProject();
        console.log(`Added ${addedCount} ${pluralize("dependency", addedCount)}!`);
    }
}