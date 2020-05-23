import * as fs from 'fs/mod.ts';
import * as path from 'path/mod.ts';
import { Args } from "flags/mod.ts";
import { Command } from "./command.ts";
import { Project, commandOf } from "../model/project.ts";
import { PROJECT_JSON_PATH, DPM_HOME_PATH } from "../model/constants.ts";

export class InstallCommand implements Command {
    public readonly description: string = "Installs the project to a global location."

    public async invoke(args: Args, project: Project): Promise<void> {
        const projectsPath = path.join(DPM_HOME_PATH, "projects");
        const binPath = path.join(DPM_HOME_PATH, "bin");

        if (!(await fs.exists(binPath))) {
            console.log("IMPORTANT: Creating global 'bin' directory, please insert the following into your shell config (.bashrc/.zshrc/...):");
            console.log(`  export PATH="${binPath}:$PATH"`);
        }
        await fs.ensureDir(projectsPath);
        await fs.ensureDir(binPath);

        const installPath = path.join(projectsPath, project.name);
        const startScriptPath = path.join(binPath, project.binname ?? project.name);
        const startScript = [
            "#!/bin/sh",
            `${commandOf(project).join(" ")} ${path.join(installPath, project.main)} $@`
        ];

        if (await fs.exists(installPath)) {
            await Deno.remove(installPath, { recursive: true });
        }
        if (await fs.exists(startScriptPath)) {
            await Deno.remove(startScriptPath);
        }

        await fs.copy(Deno.cwd(), installPath);
        await fs.writeFileStr(startScriptPath, startScript.join("\n"));
        await Deno.chmod(startScriptPath, 0o777);

        console.log(`Successfully installed to ${installPath}!`);
    }
}