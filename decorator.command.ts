import { plainToInstance } from "class-transformer";
import { Command, Commands } from "./decorator";
import Todo from "./todo";
import Todos from "./todos";

export class Decorator1 {
  @Command()
  add2(title: string, body?: string) {
    const todo = Todos.addNewTodo(new Todo(title, body));
    todo.prittyPrint();
  }
}

@Commands({
  command: "all2",
})
export class Decorator2 {
  all2() {
    Todos.readAllTodos().map((singleTodo: Todo) => {
      plainToInstance(Todo, singleTodo).prittyPrint();
    });
    console.log(`\ndone`);
  }
}
