import * as flags from "std/flags/mod.ts";
import { Command } from "./commands/command.ts";
import { RunCommand } from "./commands/run.ts";
import { InstallCommand } from "./commands/install.ts";
import { Context } from "./model/context.ts";
import { InitCommand } from "./commands/init.ts";
import { AddCommand } from "./commands/add.ts";
import { RemoveCommand } from "./commands/remove.ts";

const commands: { [key: string]: Command } = {
    "run": new RunCommand(),
    "install": new InstallCommand(),
    "init": new InitCommand(),
    "add": new AddCommand(),
    "remove": new RemoveCommand()
};

function printHelp(): void {
    const commandsDesc = Object.keys(commands)
        .map(c => ` - ${c}: ${commands[c].description}`)
        .join("\n");
    console.log(`Syntax: dpm [command] [args...]\n\nAvailable commands:\n${commandsDesc}`);
}

async function main(): Promise<void> {
    // Setup application-wide state
    const context = await Context.create();

    // Parse CLI args
    const rawArgs = Deno.args;
    const args = flags.parse(rawArgs);
    if ("help" in args || rawArgs.length < 1) {
        printHelp();
        return;
    }

    // Find command
    const commandName = rawArgs[0];
    if (!(commandName in commands)) {
        console.log(`Unknown command name: ${commandName}`);
        printHelp();
        return;
    }
    const command = commands[commandName];
    const commandArgs = flags.parse(rawArgs.slice(1));

    try {
        await command.invoke(commandArgs, context);
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            console.log(`${error} Perhaps a missing 'project.json'?`);
        } else {
            throw error;
        }
    }
}

await main();