import { Args } from "flags/mod.ts";
import { Command } from "./command.ts";
import { Project } from "../model/project.ts";
import { PROJECT_JSON_PATH } from "../model/constants.ts";

export class RunCommand implements Command {
    public readonly description: string = "Runs the project."

    public async invoke(args: Args, project: Project): Promise<void> {
        let cmd = ["deno", "run", "--unstable"];

        cmd.push(...(project.permissions?.map(p => `--allow-${p}`) ?? []));
        if (project.imports) {
            cmd.push("--importmap", PROJECT_JSON_PATH);
        }

        Deno.run({ cmd });
    }
}