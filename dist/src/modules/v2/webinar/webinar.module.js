"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebinarModule = void 0;
const common_1 = require("@nestjs/common");
const webinar_module_1 = require("./app/webinar.module");
const webinar_module_2 = require("./admin/webinar.module");
let WebinarModule = class WebinarModule {
};
WebinarModule = __decorate([
    (0, common_1.Module)({
        imports: [webinar_module_1.WebinarModule, webinar_module_2.WebinarModule],
    })
], WebinarModule);
exports.WebinarModule = WebinarModule;
//# sourceMappingURL=webinar.module.js.map