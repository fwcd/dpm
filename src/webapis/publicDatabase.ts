import * as soxa from "soxa/mod.ts";

const PUBLIC_DATABASE_URL = "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json";

export interface PublicDatabaseModule {
    type: string;
    owner: string;
    repo: string;
    desc: string;
};

export type PublicDatabase = { [name: string]: PublicDatabaseModule };

export async function fetchPublicDatabase(): Promise<PublicDatabase> {
    const raw = await soxa.get(PUBLIC_DATABASE_URL);
    return JSON.parse(raw);
}