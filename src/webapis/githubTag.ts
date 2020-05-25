import { soxa } from "soxa/mod.ts";

export interface GitHubCommit {
    sha: string;
    url: string;
}

export interface GitHubTag {
    name: string;
    zipball_url: string;
    tarball_url: string;
    commit: GitHubCommit;
    node_id: string;
}

export async function fetchGitHubTags(repoOwner: string, repoName: string): Promise<GitHubTag[]> {
    const rsp = await soxa.get(`https://api.github.com/repos/${repoOwner}/${repoName}/tags`, { responseType: "json" });
    return rsp.data;
}