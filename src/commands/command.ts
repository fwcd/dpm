import { Args } from "https://deno.land/std@0.53.0/flags/mod.ts";

export interface Command {
    invoke(args: Args): Promise<void>;
}