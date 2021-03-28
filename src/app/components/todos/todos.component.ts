import {Component, OnInit} from '@angular/core';
import {Todo} from '../../models/Todo';
import {TodoService} from '../../services/todo.service';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  inputTodo = '';
  currentFilter = null;
  errorMessage = '';

  constructor(private toDoService: TodoService) {
  }

  ngOnInit(): void {
    this.refreshTodos();
  }

  handleAddTodo(): void {
    if (this.isInputValid(this.inputTodo)) {
      this.toDoService.addTodo(this.inputTodo)
        .pipe(
          switchMap(() => this.toDoService.getTodos())
        )
        .subscribe((data) => this.todos = data);
      this.inputTodo = '';
    } else {
      this.showErrorMessage('* You can not enter a empty todo');
    }
  }

  showErrorMessage(message: string, seconds: number = 3): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 1000 * seconds);
  }

  deleteTodo(todo: Todo): void {
    if (!confirm('Are you sure you want to delete the todo?')) {
      return;
    }
    this.toDoService.deleteTodo(todo)
      .pipe(switchMap(() => this.toDoService.getTodos()))
      .subscribe((data) => this.todos = data);

  }

  toggleDone(todo: Todo): void {
    this.toDoService.toggleTodo(todo)
      .pipe(switchMap(() => this.toDoService.getTodos()))
      .subscribe((data) => this.todos = data);
  }

  setFilter(isDone: boolean): void {
    this.currentFilter = isDone;
  }

  refreshTodos(): void {
    this.toDoService.getTodos()
      .subscribe(data => {
        this.todos = data;
      });
  }

  isInputValid(input: string): boolean {
    return !(!input || input.trim() === '');
  }

  formatStatus(todo: Todo): string {
    if (todo.completed) {
      return 'COMPLETED';
    }
    return 'ACTIVE';
  }

  trimAndCapitalizeString(str: string): string {
    str = str.trim();
    return str[0].toUpperCase() + str.slice(1);
  }
}
