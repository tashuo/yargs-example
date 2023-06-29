// Import our DAO object
import * as yargs from "yargs";
import { TestCommand } from "./test.command";
import { basicCommand } from "./basic.command";
import { Scanner } from "./scaner";

let command: yargs.Argv = yargs.help();

// yargs command module
command = command.command(new TestCommand());

// decorators
Scanner.scan().map((c: yargs.CommandModule) => {
  command = command.command(c);
});

// basic command
basicCommand(command);
