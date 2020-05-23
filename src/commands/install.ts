import * as fs from "std/fs/mod.ts";
import * as path from "std/path/mod.ts";
import { Args } from "std/flags/mod.ts";
import { Command } from "./command.ts";
import { Context } from '../model/context.ts';

export class InstallCommand implements Command {
    public readonly description: string = "Installs the project to a global location."

    public async invoke(args: Args, context: Context): Promise<void> {
        await context.loadProject();

        const project = context.project;
        const projectsPath = path.join(context.dpmHomePath, "projects");
        const binPath = path.join(context.dpmHomePath, "bin");

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
            `${context.projectCommand.join(" ")} ${path.join(installPath, project.main)} $@`
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