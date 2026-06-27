"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsExceptionHandler = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let WsExceptionHandler = class WsExceptionHandler extends websockets_1.BaseWsExceptionFilter {
    catch(exception, host) {
        super.catch(exception, host);
    }
};
WsExceptionHandler = __decorate([
    (0, common_1.Catch)(common_1.BadRequestException)
], WsExceptionHandler);
exports.WsExceptionHandler = WsExceptionHandler;
//# sourceMappingURL=WsExceptionHandler.js.map