import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
let IconsModule = class IconsModule {
};
IconsModule = tslib_1.__decorate([
    NgModule({
        declarations: [],
        imports: [
            CommonModule,
            FeatherModule.pick(allIcons)
        ],
        exports: [FeatherModule]
    })
], IconsModule);
export { IconsModule };
//# sourceMappingURL=icons.module.js.map