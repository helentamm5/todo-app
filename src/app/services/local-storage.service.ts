import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  localStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage;
  }

  get(key: string): Observable<any> {
    const data = JSON.parse(this.localStorage.getItem(key));
    if (data) {
      return of(data);
    }
    return of(null);
  }

  set(key: string, value: any): Observable<void> {
    this.localStorage.setItem(key, JSON.stringify(value));
    return of(null);
  }

  remove(key: string): Observable<void> {
    if (this.localStorage.getItem(key)) {
      this.localStorage.removeItem(key);
    }
    return of(null);
  }
}
