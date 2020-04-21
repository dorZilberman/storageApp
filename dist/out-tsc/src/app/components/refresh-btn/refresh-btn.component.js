import * as tslib_1 from "tslib";
import { Component, Output, EventEmitter } from '@angular/core';
let RefreshBtnComponent = class RefreshBtnComponent {
    constructor(_notificationsService) {
        this._notificationsService = _notificationsService;
        this.refreshEmitter = new EventEmitter();
        this.subscription = [];
        this.subscription.push(this._notificationsService.onOrderDeleted(this, this.refresh));
    }
    ngOnInit() {
        this.refresher = $('.refresher');
        this.refresher.click(this.refresh.bind(this));
    }
    refresh() {
        console.log('refresh');
        console.log(this);
        this.refreshEmitter.emit();
        this.refresher.addClass('loading');
        setTimeout(() => {
            this.refresher.removeClass('loading');
            this.refresher.addClass('success');
            setTimeout(() => this.refresher.removeClass('success'), 2000);
        }, 1500);
        $('.btn-refresh-error').on('click', () => {
            this.refresher.addClass('loading');
            setTimeout(() => {
                this.refresher.removeClass('loading');
                this.refresher.addClass('error');
                setTimeout(() => this.refresher.removeClass('error'), 2000);
            }, 1500);
        });
    }
    ngOnDestroy() {
        console.log('onDestroy');
        this.subscription.forEach((subscriber) => {
            subscriber.unsubscribe();
        });
    }
};
tslib_1.__decorate([
    Output()
], RefreshBtnComponent.prototype, "refreshEmitter", void 0);
RefreshBtnComponent = tslib_1.__decorate([
    Component({
        selector: 'app-refresh-btn',
        templateUrl: './refresh-btn.component.html',
        styleUrls: ['./refresh-btn.component.scss']
    })
], RefreshBtnComponent);
export { RefreshBtnComponent };
//# sourceMappingURL=refresh-btn.component.js.map