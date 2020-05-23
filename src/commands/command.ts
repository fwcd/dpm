import { Args } from "std/flags/mod.ts";
import { Context } from "../model/context.ts";

export interface Command {
    readonly description: string;

    invoke(args: Args, context: Context): Promise<void>;
}