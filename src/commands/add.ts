import { Args } from "flags/mod.ts";
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
        
        let addedCount = 0;
        for (const rawDep of args._) {
            const match = /(([\w-/]+)(?:@.+)?)/.exec(`${rawDep}`);
            if (match) {
                const nameAndVersion = match[1];
                const name = match[2];
                const path = `https://deno.land/${nameAndVersion.startsWith("std") ? "" : "x/"}${nameAndVersion}/mod.ts`;

                project.imports[`${name}/`] = path;
                console.log(`Adding ${name} -> ${path}`);
                addedCount += 1;
            } else {
                console.log(`Warning: Invalidly formatted dependency: ${rawDep}`);
            }
        }

        await context.saveProject();
        console.log(`Added ${addedCount} ${pluralize("dependency", addedCount)}!`);
    }
}