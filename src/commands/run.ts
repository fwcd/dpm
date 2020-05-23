import { Args } from "flags/mod.ts";
import { Command } from "./command.ts";
import { Project, commandOf } from "../model/project.ts";
import { PROJECT_JSON_PATH } from "../model/constants.ts";

export class RunCommand implements Command {
    public readonly description: string = "Runs the project."

    public async invoke(args: Args, project: Project): Promise<void> {
        Deno.run({ cmd: commandOf(project) });
    }
}