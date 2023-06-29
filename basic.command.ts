import * as yargs from "yargs";
import Todos from "./todos";
import Todo from "./todo";
import { plainToInstance } from "class-transformer";

export const basicCommand = async (argv: yargs.Argv) => {
  // We will take advantage of typings and intellsence.
  const todoTitleOptions: yargs.Options = {
    describe: "Title of TODO",
    demand: true,
    alias: "t",
  };
  const todoBodyOptions: yargs.Options = {
    describe: "Body of TODO",
    demand: false,
    alias: "b",
  };

  const command = argv
    .command("add", "Add TODO to database", {
      title: todoTitleOptions,
      body: todoBodyOptions,
    })
    .command("remove", "Remove an existing TODO", {
      title: todoTitleOptions,
    })
    .command("view", "View a single TODO", {
      title: todoTitleOptions,
    })
    .command("all", "List add TODOS");

  const params = await command.parseAsync();
  if (params._[0] === "add") {
    const todo = Todos.addNewTodo(
      new Todo(params.title as string, params.body as string)
    );
    todo.prittyPrint();
  } else if (params._[0] === "remove") {
    Todos.removeTodoByTitle(params.title as string);
    console.log("Todo has been deleted");
  } else if (params._[0] === "view") {
    const todo = Todos.getTodoByTitle(params.title as string);
    todo.prittyPrint();
  } else if (params._[0] === "all") {
    const todos: Todo[] = Todos.readAllTodos();
    todos.forEach((singleTodo: Todo) => {
      plainToInstance(Todo, singleTodo).prittyPrint();
    });
  }

  return command;
};
