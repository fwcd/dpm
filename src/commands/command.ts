import { Args } from "flags/mod.ts";
import { Project } from "../model/project.ts";

export interface Command {
    readonly description: string;

    invoke(args: Args, project: Project): Promise<void>;
}