import * as flags from "https://deno.land/std@0.53.0/flags/mod.ts";
import { Command } from "./commands/command.ts";
import { RunCommand } from "./commands/run.ts";

const commands: { [key: string]: Command } = {
    "run": new RunCommand()
};

function printHelp(): void {
    console.log(`Syntax: dpm [command] [args...]\nAvailable commands: ${Object.keys(commands).join(", ")}`);
}

async function main(): Promise<void> {
    const rawArgs = Deno.args;
    if (rawArgs.length < 1) {
        printHelp();
        return;
    }
    const commandName = rawArgs[0];
    if (!(commandName in Object.keys(commands))) {
        console.log(`Unknown command name: ${commandName}`);
        printHelp();
        return;
    }
    const command = commands[commandName];
    const commandArgs = flags.parse(rawArgs.slice(2));
    await command.invoke(commandArgs);
}

await main();