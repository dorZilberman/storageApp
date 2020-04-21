import * as tslib_1 from "tslib";
import { Injectable, EventEmitter } from '@angular/core';
import io from '../../../assets/scripts/socket.io.js';
let NotificationsService = class NotificationsService {
    constructor() {
        this.orderDeletedEmitter = new EventEmitter();
        this.socket = io('https://localhost:3001');
        this.socket.on('connect', () => {
            console.log('connect');
        });
        this.socket.on('event', ((data) => {
            console.log('new event');
            console.log(data);
            this.orderDeletedEmitter.emit();
        }));
        this.socket.on('disconnect', function () { console.log('disconnect'); });
    }
    onOrderDeleted(self, callback) {
        return this.orderDeletedEmitter.subscribe(() => {
            console.log('subsribe');
            callback.call(self);
        });
    }
};
NotificationsService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], NotificationsService);
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map