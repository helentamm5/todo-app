import {TestBed} from '@angular/core/testing';
import {LocalStorageService} from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in localstorage', () => {
    service.set('maxId', 3);
    service.get('maxId').subscribe((id) => expect(id).toBe(3));
  });

  it('should write an array to localstorage, parse it and return the array', () => {
    const todos = [{id: 1, content: 'example1', completed: false}, {id: 2, content: 'example2', completed: false}];
    service.set('todoList', todos);
    service.get('todoList').subscribe((t) => expect(t).toEqual(todos));
  });

  it('should remove an item from localstorage', () => {
    service.set('maxId', 3);
    service.remove('maxId');
    service.get('maxId').subscribe((id) => expect(id).toBe(null));
  });

  it('should remove an item from localstorage', () => {
    service.set('maxId', 3);
    service.remove('maxId');
    service.get('maxId').subscribe((id) => expect(id).toBe(null));
  });

});
