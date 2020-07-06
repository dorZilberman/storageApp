import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  public pageNotFound = false;
  public pageNotAuthorized = false;

  constructor() { }
}
