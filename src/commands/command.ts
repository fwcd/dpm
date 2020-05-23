import { Args } from "flags/mod.ts";

export interface Command {
    readonly description: string;

    invoke(args: Args): Promise<void>;
}