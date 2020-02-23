import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  public postgressUrl = 'https://localhost:3001';
  constructor() { }
}
