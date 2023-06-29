import * as yargs from "yargs";
import Todos from "./todos";

export class TestCommand implements yargs.CommandModule {
  public command = "get <title>";

  public describe = "get todo info";

  builder(args: yargs.Argv) {
    return args
      .positional("title", {
        alias: "t",
        type: "string",
      })
      .option("done", {
        alias: "d",
        describe: "output done",
        type: "boolean",
      });
  }

  handler(args: yargs.Arguments) {
    const todo = Todos.getTodoByTitle(args.title as string);
    todo.prittyPrint();
    args.done && console.log(`\ndone!`);
    process.exit(0);
  }
}
