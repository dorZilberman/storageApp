import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  public postgressUrl = 'https://192.168.43.143:3001';
  constructor() { }
}
