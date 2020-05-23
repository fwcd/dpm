import * as flags from "flags/mod.ts";
import * as fs from 'fs/mod.ts';
import { Command } from "./commands/command.ts";
import { RunCommand } from "./commands/run.ts";
import { PROJECT_JSON_PATH } from "./model/constants.ts";

const commands: { [key: string]: Command } = {
    "run": new RunCommand()
};

function printHelp(): void {
    const commandsDesc = Object.keys(commands)
        .map(c => ` - ${c}: ${commands[c].description}`)
        .join(", ");
    console.log(`Syntax: dpm [command] [args...]\n\nAvailable commands:\n${commandsDesc}`);
}

async function main(): Promise<void> {
    const rawArgs = Deno.args;
    const args = flags.parse(rawArgs);
    if ("help" in args || rawArgs.length < 1) {
        printHelp();
        return;
    }
    const commandName = rawArgs[0];
    if (!(commandName in commands)) {
        console.log(`Unknown command name: ${commandName}`);
        printHelp();
        return;
    }

    try {
        const project = JSON.parse(await fs.readFileStr(PROJECT_JSON_PATH));
        const command = commands[commandName];
        const commandArgs = flags.parse(rawArgs.slice(2));
        await command.invoke(commandArgs, project);
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            console.log(`${error} Perhaps a missing 'project.json'?`);
        } else {
            throw error;
        }
    }
}

await main();