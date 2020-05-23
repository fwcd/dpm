import { Args } from "std/flags/mod.ts";
import { Command } from "./command.ts";
import { Context } from "../model/context.ts";
import { pluralize } from "../utils/strings.ts";

export class RemoveCommand implements Command {
    public readonly description: string = "Removes a list of dependencies from the project."

    public async invoke(args: Args, context: Context): Promise<void> {
        await context.loadProject();

        const project = context.project;
        if (!project.imports) {
            project.imports = {};
        }
        
        let removedCount = 0;
        for (const rawDep of args._) {
            const imports = Object.keys(project.imports ?? {});
            for (const imported of imports) {
                if (imported === `${rawDep}/`) {
                    console.log(`Removing ${rawDep} -> ${project.imports[imported]}`);
                    delete project.imports[imported];
                    removedCount += 1;
                }
            }
        }

        await context.saveProject();
        console.log(`Removed ${removedCount} ${pluralize("dependency", removedCount)}!`);
    }
}