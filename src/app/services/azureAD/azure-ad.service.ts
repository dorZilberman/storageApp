import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class userService {

  protected _id : string;
  constructor() { 
    this._id = '';
  }

  getUserID() {
    return this._id;
  }
  setUserID(id: string) {
    this._id = id;
  }
}
