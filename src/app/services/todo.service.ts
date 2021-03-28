import {Injectable} from '@angular/core';
import {Todo} from '../models/Todo';
import {LocalStorageService} from './local-storage.service';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private static readonly LIST_STORAGE_KEY = 'todoList';

  constructor(private localStorageService: LocalStorageService) {
  }

  addTodo(inputTodo: string): Observable<void> {
    return this.constructTodo(inputTodo)
      .pipe(
        switchMap((todo: Todo) => this.storeTodo(todo))
      );
  }

  deleteTodo(todo: Todo): Observable<void> {
    return this.localStorageService.get(TodoService.LIST_STORAGE_KEY)
      .pipe(
        switchMap((todos: Todo[]) => {
          todos = todos.filter((item) => item.id !== todo.id);
          return this.localStorageService.set(TodoService.LIST_STORAGE_KEY, todos);
        })
      );
  }

  toggleTodo(todo: Todo): Observable<void> {
    return this.localStorageService.get(TodoService.LIST_STORAGE_KEY)
      .pipe(
        switchMap((todos: Todo[]) => {
          const matchingTodo = todos.find((v) => v.id === todo.id);
          if (!matchingTodo) {
            return of(null);
          }

          matchingTodo.completed = !matchingTodo.completed;
          return this.localStorageService.set(TodoService.LIST_STORAGE_KEY, todos);
        })
      );
  }

  getTodos(): Observable<Todo[]> {
    return this.localStorageService.get(TodoService.LIST_STORAGE_KEY)
      .pipe(map((items) => Array.isArray(items) ? items : []));
  }

  storeTodo(todo: Todo): Observable<void> {
    return this.getTodos()
      .pipe(
        switchMap((todos: Todo[]) => {
          todos.push(todo);
          return this.localStorageService.set(TodoService.LIST_STORAGE_KEY, todos);
        })
      );
  }

  constructTodo(inputTodo: string): Observable<Todo> {
    return this.getNextId()
      .pipe(map((id) =>  {
        return {
          id,
          content: inputTodo,
          completed: false
        };
      }));
  }


  private getNextId(): Observable<number> {
    return this.localStorageService.get(TodoService.LIST_STORAGE_KEY)
      .pipe(map((todos: Todo[]) => Array.isArray(todos) ? todos : []), map( (todos) => {
        todos.sort((a, b) => {
          if (a.id > b.id) {
            return -1;
          }
          if (a.id < b.id) {
            return 1;
          }
          return 0;
        });

        let maxId = 0;
        if (todos.length) {
          maxId = todos[0].id;
        }
        return maxId + 1;
      }));
  }
}
