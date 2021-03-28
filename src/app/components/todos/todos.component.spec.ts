import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TodosComponent} from './todos.component';
import {TodoService} from '../../services/todo.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Todo} from '../../models/Todo';


@Injectable({
  providedIn: 'root'
})
class MockTodoService {
  public todos: Todo[] = [];
  maxId = 0;

  addTodo(inputTodo: string): Observable<Todo[]> {
    const todo = this.constructTodo(inputTodo);
    this.todos.push(todo);
    return of(this.todos);
  }

  deleteTodo(todo: Todo): Observable<Todo[]> {
    this.todos = this.todos.filter((item) => item.id !== todo.id);
    return of(this.todos);
  }

  toggleTodo(todo: Todo): Observable<Todo[]> {
    const matchingTodo = this.todos.find((v) => v.id === todo.id);
    matchingTodo.completed = !matchingTodo.completed;
    return of(this.todos);
  }


  constructTodo(inputTodo: string): Todo {
    const todo = {
      id: this.maxId + 1,
      content: inputTodo,
      completed: false
    };
    this.setMaxId(this.maxId + 1);
    return todo;
  }

  getTodos(): Observable<Todo[]> {
    return of(this.todos);
  }

  private getNextId(): Observable<number> {
    return of(this.maxId + 1);
  }

  setMaxId(id: number): Observable<number> {
    this.maxId = id;
    return of(id);
  }

}

@Pipe({
  name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
  public name = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let storage: LocalStorageService;
  let service: MockTodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodosComponent, TranslatePipeMock],
      providers: [
        {provide: TodoService, useClass: MockTodoService}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    storage = new LocalStorageService();
    service = new MockTodoService();

    component.inputTodo = 'example';
    component.handleAddTodo();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add todo', () => {
    expect(component.todos.map((t) => t.content)).toContain('example');
  });

  it('should add a second todo with a id of 2', () => {
    component.inputTodo = 'example2';
    component.handleAddTodo();
    expect(component.todos.map((t) => t.id)).toContain(2);
  });

  it('should not add a empty todo', () => {
    component.inputTodo = ' ';
    component.handleAddTodo();
    expect(component.todos.length).toBe(1);
  });

  it('should remove a todo', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const todo = component.todos[0];
    component.deleteTodo(todo);
    expect(component.todos.length).toBe(0);
  });

  it('should toggle done a todo', () => {
    const todo = component.todos[0];
    component.toggleDone(todo);
    expect(localStorage.getItem('toDoList')).toBe(null);
    expect(component.todos.map((t) => t.completed)).toContain(true);
  });

  it('should create a error message', () => {
    component.showErrorMessage('error');
    expect(component.errorMessage).toBe('error');
  });

  it('should set the filter to false', () => {
    component.setFilter(false);
    expect(component.currentFilter).toBe(false);
  });

  it('should return false if input is empty or only whitespaces, otherwise true', () => {
    expect(component.isInputValid(' ')).toBe(false);
    expect(component.isInputValid('tere')).toBe(true);
  });

  it('should trim and capitalize the input string', () => {
    expect(component.trimAndCapitalizeString(' this is a todo ')).toBe('This is a todo');
  });

  it('should return todo status as a string', () => {
    expect(component.formatStatus(component.todos[0])).toBe('ACTIVE');
  });

  it('should refresh the todos list onInit', () => {
    expect(component.todos.length).toBe(1);
  });


});

