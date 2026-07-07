"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jmoment = require("jalali-moment");
jmoment().locale("fa").format("YYYY/M/D");
let BackupTransformer = class BackupTransformer {
    transform(item) {
        return {
            id: item.id,
            link: item.filename
                ? `${process.env.APP_CONTENT_PATH}/backups/${item.filename}`
                : "",
            created_at: this.calculCreatedAt(item.createdAt),
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    calculCreatedAt(created_at) {
        const currentYear = Number(jmoment(new Date(Date.now())).locale("fa").format("YYYY"));
        const day = Number(jmoment(created_at).locale("fa").format("DD"));
        const month = jmoment(created_at).locale("fa").format("MMMM");
        const year = Number(jmoment(created_at).locale("fa").format("YYYY"));
        let info = "";
        if (Number(currentYear) === Number(year)) {
            info = month + " " + day.toString();
        }
        else {
            info = ` ${year} ${month} ${day} `;
        }
        return info;
    }
};
BackupTransformer = __decorate([
    (0, common_1.Injectable)()
], BackupTransformer);
exports.default = BackupTransformer;
//# sourceMappingURL=Transformer.js.map