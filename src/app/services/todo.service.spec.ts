import {TodoService} from './todo.service';
import {Observable, of} from 'rxjs';
import {TestBed} from '@angular/core/testing';
import {LocalStorageService} from './local-storage.service';
import {Todo} from '../models/Todo';
import {switchMap} from 'rxjs/operators';


class MockLocalStorageService {
  public memory = {} as { [key: string]: any };

  get(key: string): Observable<any> {
    const data = this.memory[key];
    if (data) {
      return of(data);
    }
    return of(null);
  }

  set(key: string, value: any): Observable<void> {
    this.memory[key] = value;
    return of(null);
  }

  remove(key: string): Observable<void> {
    delete this.memory[key];
    return of(null);
  }

}


describe('TodoService', () => {
  let storage: MockLocalStorageService;
  let service: TodoService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoService],
      providers: [
        {provide: LocalStorageService, useClass: storage}
      ]
    }).compileComponents();
    storage = new MockLocalStorageService();
    service = new TodoService(storage as any);

  });


  it('should add a todo', () => {
    service.addTodo('test')
      .pipe(switchMap(() => service.getTodos()))
      .subscribe((todos) => expect(todos.map((todo) => todo.content))
        .toContain('test'));
  });

  it('should delete a todo', () => {
    service.addTodo('test1')
      .pipe(switchMap(() => service.getTodos()),
        switchMap((todos) => service.deleteTodo(todos[0])),
        switchMap(() => service.getTodos()))
      .subscribe((todos) => expect(todos.length).toBe(0));
  });

  it('should toggle todo done', () => {
    const todos = [{id: 1, content: 'first', completed: false}];
    spyOn(storage, 'get').and.returnValue(of(todos));
    service.toggleTodo(todos[0])
      .pipe(switchMap(() => service.getTodos()))
      .subscribe((data) => expect(data[0].completed).toBe(true));
  });

  it('should return empty list when no todos', () => {
    service.getTodos().subscribe((todos) => expect(todos.length).toBe(0));
  });

  it('should store a todo', () => {
    const todo = {id: 1, content: 'testTodo', completed: false};
    service.storeTodo(todo)
      .pipe(switchMap(() => service.getTodos()))
      .subscribe((todos) => expect(todos.map((t) => t.content)).toContain('testTodo'));
  });

  it('should construct a todo', () => {
    service.constructTodo('new').subscribe((todo) => expect(todo.content).toBe('new'));
  });


});
