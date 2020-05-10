import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  public postgressUrl = 'https://192.168.43.131:3001';
  constructor() { }
}
