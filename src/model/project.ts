import { PROJECT_JSON_PATH } from "./constants.ts";

/** A Deno project's metadata. */
export interface Project {
    /** The project's name. */
    name: string;
    /** The name of the binary. */
    binname?: string | undefined;
    /** The project's version. */
    version?: string | undefined;
    /** The project's description. */
    description?: string | undefined;
    /** The project's author */
    author?: string | undefined;
    /** A path to the main source file. */
    main: string;
    /** The project's required permissions (without the '--allow-' prefix), e.g. 'read', 'write', 'net', ... */
    permissions?: string[] | undefined;
    /** The project's dependencies, serving as an import map. */
    imports?: { [alias: string]: string; } | undefined;
}

export function commandOf(project: Project): string[] {
    let cmd = ["deno", "run", "--unstable"];

    cmd.push(...(project.permissions?.map(p => `--allow-${p}`) ?? []));
    if (project.imports) {
        cmd.push("--importmap", PROJECT_JSON_PATH);
    }

    return cmd;
}