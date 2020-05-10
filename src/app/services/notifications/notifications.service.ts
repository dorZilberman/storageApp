import { Injectable, EventEmitter } from '@angular/core';
import io from '../../../assets/scripts/socket.io.js';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private socket;
  private orderDeletedEmitter = new EventEmitter();
  constructor() {

    this.socket = io.connect('https://192.168.43.131:3001',{secure:true});
    console.log(this.socket);
    this.socket.on('connect', () => {
      console.log('connect');
    });

    this.socket.on('event', ((data) => {
      console.log('new event');
      console.log(data);
      this.orderDeletedEmitter.emit()
    }));
    this.socket.on('disconnect', function () { console.log('disconnect'); });
  }

  onOrderDeleted(self, callback: Function) {
    return this.orderDeletedEmitter.subscribe(() => {
      console.log('subsribe');
      callback.call(self);
    });
  }
}
