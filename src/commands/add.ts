import { Args } from "std/flags/mod.ts";
import { Command } from "./command.ts";
import { Context } from "../model/context.ts";
import { pluralize } from "../utils/strings.ts";
import { PublicDatabase } from "../webapis/publicDatabase.ts";
import { fetchGitHubTags } from "../webapis/githubTag.ts";

export class AddCommand implements Command {
    public readonly description: string = "Adds a list of dependencies to the project."

    public async invoke(args: Args, context: Context): Promise<void> {
        await context.loadProject();

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
            const version = groups.ver || (isStd ? "" : await this.findLatestVersion(name, await context.publicDatabase.get()));
            const versionPostfix = version ? `@${version}` : "";
            const url = groups.url || `https://deno.land/${scope}${pre}${versionPostfix}${post}/`;

            project.imports[`${name}/`] = url;
            console.log(`Adding ${name} -> ${url}`);
            addedCount += 1;
        }

        await context.saveProject();
        console.log(`Added ${addedCount} ${pluralize("dependency", addedCount)}!`);
    }

    private async findLatestVersion(name: string, db: PublicDatabase): Promise<string> {
        if (name in db) {
            const entry = db[name];
            if (entry.type == "github") {
                const tags = await fetchGitHubTags(entry.owner, entry.repo);
                if (tags) {
                    // Assuming GitHub tags are ordered in descending chronological order
                    return tags[0].name;
                }
            }
        }
        return "";
    }
}