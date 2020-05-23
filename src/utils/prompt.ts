import { readLines } from "std/io/bufio.ts";

export async function promptWith(p: string): Promise<string> {
    console.log(p);
    for await (const line of readLines(Deno.stdin)) {
        return line;
    }
    throw new Error("Prompt hit EOF");
}