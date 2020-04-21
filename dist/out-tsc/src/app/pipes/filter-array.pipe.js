import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
let FilterArrayPipe = class FilterArrayPipe {
    transform(items, callback) {
        if (!items || !callback || !Array.isArray(items)) {
        }
        else if (items.length > 0) {
            let res = items.filter(item => callback(item));
            return res;
        }
        return items;
    }
};
FilterArrayPipe = tslib_1.__decorate([
    Pipe({
        name: 'filterArray',
    })
], FilterArrayPipe);
export { FilterArrayPipe };
//# sourceMappingURL=filter-array.pipe.js.map