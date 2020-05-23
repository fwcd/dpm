import * as fs from "std/fs/mod.ts";
import * as path from "std/path/mod.ts";
import { Project } from "./project.ts";

export const PROJECT_JSON = "project.json";

/**
 * An application-wide context holding
 * the current projects and related paths.
 */
export class Context {
    public readonly projectPath: string;
    public readonly dpmHomePath: string;

    public project!: Project;

    public static async create(projectPath: string = Deno.cwd(), dpmHomePath: string = path.join(Deno.env.get("HOME") ?? "~", ".dpm")) {
        const ctx = new Context(projectPath, dpmHomePath);
        await fs.ensureDir(ctx.dpmHomePath);
        return ctx;
    }

    private constructor(projectPath: string, dpmHomePath: string) {
        this.projectPath = projectPath;
        this.dpmHomePath = dpmHomePath;
    }

    /** Reloads the project manifest. */
    public async loadProject(): Promise<void> {
        this.project = await fs.readJson(this.projectJsonPath) as Project;
    }

    /** Saves the project manifest. */
    public async saveProject(): Promise<void> {
        await fs.writeJson(this.projectJsonPath, this.project, { spaces: 4 });
    }

    public get projectJsonPath(): string {
        return path.join(this.projectPath, PROJECT_JSON);
    }

    public get projectCommand(): string[] {
        let cmd = ["deno", "run", "--unstable"];

        cmd.push(...(this.project.permissions?.map(p => `--allow-${p}`) ?? []));
        if (this.project.imports) {
            cmd.push("--importmap", this.projectJsonPath);
        }

        return cmd;
    }
}