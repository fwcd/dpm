import * as fs from "std/fs/mod.ts";
import * as path from "std/path/mod.ts";
import { Project } from "./project.ts";
import { AsyncLazy } from "../utils/lazy.ts";
import { fetchPublicDatabase } from "../webapis/publicDatabase.ts";

export const PROJECT_JSON = "project.json";

/**
 * An application-wide context holding
 * the current projects and related paths.
 */
export class Context {
    public readonly projectPath: string;
    public readonly dpmHomePath: string;

    public readonly publicDatabase = new AsyncLazy(fetchPublicDatabase);

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
        this.project = await fs.readJson(this.getProjectJsonPath()) as Project;
    }

    /** Saves the project manifest. */
    public async saveProject(): Promise<void> {
        await fs.writeJson(this.getProjectJsonPath(), this.project, { spaces: 4 });
    }

    public getProjectJsonPath(dirPath: string = this.projectPath): string {
        return path.join(dirPath, PROJECT_JSON);
    }

    public getProjectRunCommand(dirPath: string = this.projectPath): string[] {
        let cmd = ["deno", "run", "--unstable"];

        cmd.push(...(this.project.permissions?.map(p => `--allow-${p}`) ?? []));
        if (this.project.imports) {
            cmd.push("--importmap", this.getProjectJsonPath(dirPath));
        }
        cmd.push(path.join(dirPath, this.project.main));

        return cmd;
    }
}