import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
let PostgresService = class PostgresService {
    constructor(_http) {
        this._http = _http;
    }
    create(url, order) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this._http.post(url, order, { responseType: 'text' }).toPromise();
        });
    }
    read(url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    readMany(url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this._http.get(url, { responseType: 'json' }).toPromise();
        });
    }
    update(url, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this._http.put(url, { orderId: id, newStatus: 'failure' }, { responseType: 'json' }).toPromise();
        });
    }
    delete(url, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this._http.delete(url, { params: id, responseType: 'text' }).toPromise();
        });
    }
};
PostgresService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], PostgresService);
export { PostgresService };
//# sourceMappingURL=postgres.service.js.map