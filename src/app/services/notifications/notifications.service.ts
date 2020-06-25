import { Injectable, EventEmitter } from '@angular/core';
import io from '../../../assets/scripts/socket.io.js';
import { ContextService } from '../context/context.service.js';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private socket;
  private orderDeletedEmitter = new EventEmitter();
  constructor(private contextService: ContextService) {
    this.socket = io.connect(this.contextService.serverURL, { secure: true });
    this.socket.on('connect', () => {
      console.log('connect');
    });
    this.socket.on('event', ((data) => {
      this.orderDeletedEmitter.emit();
    }));
    this.socket.on('disconnect', function () {
      console.log('disconnect');
    });
  }

  onOrderDeleted(self, callback: Function) {
    return this.orderDeletedEmitter.subscribe(() => {
      callback.call(self);
    });
  }
}
