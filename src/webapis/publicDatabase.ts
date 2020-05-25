import { soxa } from "soxa/mod.ts";
import { fetchGitHubTags } from "./githubTag.ts";

const PUBLIC_DATABASE_URL = "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json";

export interface PublicDatabaseModule {
    type: string;
    owner: string;
    repo: string;
    desc: string;
};

export type PublicDatabase = { [name: string]: PublicDatabaseModule };

export async function fetchPublicDatabase(): Promise<PublicDatabase> {
    const rsp = await soxa.get(PUBLIC_DATABASE_URL, { responseType: "json" });
    return rsp.data;
}

export async function findLatestVersion(name: string, db: PublicDatabase): Promise<string> {
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