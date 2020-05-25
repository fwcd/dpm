import { Args } from "std/flags/mod.ts";
import { Command } from "./command.ts";
import { Context } from "../model/context.ts";
import { pluralize } from "../utils/strings.ts";
import { findLatestVersion } from "../webapis/publicDatabase.ts";

export class AddCommand implements Command {
    public readonly description: string = "Adds a list of dependencies to the project."

    public async invoke(args: Args, context: Context): Promise<void> {
        await context.loadProject();

        const db = await context.publicDatabase.get();
        const project = context.project;
        if (!project.imports) {
            project.imports = {};
        }
        
        const joinedArgs = args._.map((a: any) => `${a}`).join(" ");
        const pattern = /(?:(?<pre>[\w-/]+)(?:@(?<ver>[\d\.]+))?(?<post>\S+)?)\s*(?<url>http\S+)?/g;
        let addedCount = 0;
        let match: RegExpExecArray | null;
        while (match = pattern.exec(joinedArgs)) {
            const groups = match.groups!;
            const pre = groups.pre || "";
            const post = groups.post || "";
            const name = pre + post;
            const isStd = name.startsWith("std");
            const scope = isStd ? "" : "x/";
            const version = groups.ver || (isStd ? "" : await findLatestVersion(name, db));
            const versionPostfix = version ? `@${version}` : "";
            const url = groups.url || `https://deno.land/${scope}${pre}${versionPostfix}${post}/`;

            if (isStd || name in db) {
                const ownerPostfix = (name in db) ? ` by ${db[name].owner}` : "";

                console.log(`Adding ${name}${ownerPostfix} -> ${url}`);
                project.imports[`${name}/`] = url;
                addedCount += 1;
            } else {
                console.log(`${name} is not available in the standard Deno module database!`);
            }
        }

        await context.saveProject();
        console.log(`Added ${addedCount} ${pluralize("dependency", addedCount)}!`);
    }

    
}