import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  public serverURL = 'https://logisticserver.azurewebsites.net';
  constructor() { }
}
