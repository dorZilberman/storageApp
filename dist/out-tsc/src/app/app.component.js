import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let AppComponent = class AppComponent {
    constructor(_postgres, _context) {
        this._postgres = _postgres;
        this._context = _context;
        this.title = 'storageApp';
        this.onRefresh();
    }
    onRefresh() {
        console.log('res');
        this._postgres.readMany(this._context.postgressUrl).then((res) => {
            console.log(res);
            res.forEach(order => {
                //@ts-ignore  
                order.orderdate = new Date(order.orderdate).format("dd/mm/yy");
            });
            this.orders = (Array.isArray(res)) ? res : [];
        });
    }
    onCancel(selected) {
        selected.forEach((itemId) => {
            this._postgres.update(this._context.postgressUrl, itemId).then((res) => {
                this.orders = (Array.isArray(res)) ? res : [];
            });
        });
    }
    waitingFilter(item) {
        return (item.status == "waiting") ? true : false;
    }
    readyFilter(item) {
        return (item.status != "waiting") ? true : false;
    }
};
AppComponent = tslib_1.__decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map