import { Args } from "https://deno.land/std@0.53.0/flags/mod.ts";

export interface Command {
    readonly description: string;

    invoke(args: Args): Promise<void>;
}