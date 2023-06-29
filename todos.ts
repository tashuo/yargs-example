import { plainToInstance } from "class-transformer";
import Todo from "./todo";
import * as fs from "fs";
export default class Todos {
  constructor(public todos: Todo[]) {}

  private static writeAllTodos(todos: Todo[]): void {
    fs.writeFileSync("data.json", JSON.stringify(todos));
  }

  public static readAllTodos(): Todo[] {
    // Define an empty object
    let todos: Todo[] = [];
    try {
      // try to read the todos
      todos = JSON.parse(fs.readFileSync("data.json", "utf8"));
    } catch (e) {
      // If failed create a write an empty object
      this.writeAllTodos([]);
    }
    return todos;
  }

  public static getTodoByTitle(title: string): Todo {
    const todos: Todo[] = this.readAllTodos();
    const todo = todos.filter((singleTodo: Todo) => singleTodo.title === title);
    return plainToInstance(Todo, todo[0]);
  }

  public static removeTodoByTitle(title: string): void {
    let todos: Todo[] = this.readAllTodos();
    todos = todos.filter((singleTodo: Todo) => singleTodo.title === title);
    this.writeAllTodos(todos);
  }

  public static addNewTodo(todo: Todo): Todo {
    const todos: Todo[] = this.readAllTodos();
    todos.push(todo);
    this.writeAllTodos(todos);
    return todo;
  }
}
