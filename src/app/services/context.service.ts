import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  public postgressUrl = 'http://localhost:3001';
  constructor() { }
}
