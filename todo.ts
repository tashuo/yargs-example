export default class Todo {
  constructor(public title: string, public description?: string) {}

  prittyPrint() {
    console.log(`\nTitle: ${this.title}\nBody: ${this.description}`);
  }
}
