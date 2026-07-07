"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let TransformerInterceptor = class TransformerInterceptor {
    intercept(context, next) {
        try {
            const response = context.switchToHttp().getResponse();
            console.log("---- Transformer Interceptor ----");
            console.log("before");
            return next.handle().pipe((0, rxjs_1.map)((data) => {
                console.log("after");
                if (data.statusCode) {
                    console.log("statusCode: ", data.statusCode);
                    response.status(data.statusCode);
                    return response.send({
                        statusCode: data.statusCode,
                        message: data.message,
                        data: data.data ? data.data : {},
                    });
                }
            }));
        }
        catch (error) {
            console.log("ERROR in Transformer Interceptor");
            console.log({ error });
        }
    }
};
TransformerInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformerInterceptor);
exports.TransformerInterceptor = TransformerInterceptor;
//# sourceMappingURL=Transformer.interceptor.js.map