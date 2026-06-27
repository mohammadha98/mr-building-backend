"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const DateService_1 = require("../../../services/DateService");
let ServicesModuleAppTransformer = class ServicesModuleAppTransformer {
    transformerMedia(service) {
        return {
            id: service.id,
            type: service.type,
            file_type: service.fileType,
            file: service.file
                ? `${process.env.APP_CONTENT_PATH}/services/${service.type}/${service.file}`
                : "",
        };
    }
    collectionMedia(services) {
        return services.map((item) => this.transformerMedia(item));
    }
    transformerService(item) {
        return {
            id: item.id,
            description: item.description,
        };
    }
    transformComment(item, user_id) {
        let is_liked = false;
        let total_like = 0;
        if (item.ServicesCommentLikes && item.ServicesCommentLikes.length > 0) {
            item.ServicesCommentLikes.map((item) => {
                if (item.clientID == user_id) {
                    is_liked = true;
                }
            });
            total_like = item.ServicesCommentLikes.length;
        }
        let transform = {
            id: item.id,
            content: item.content,
            client_id: item.client,
            is_replied: item.is_replied,
            is_liked,
            total_like,
            replied_to: [],
            created_at: (0, DateService_1.DateToPersian)(item.created_at),
        };
        if (item.replied_by && item.replied_by.length > 0 && item.replied_by[0]) {
            transform = {
                id: item.id,
                content: item.content,
                client_id: item.client,
                is_replied: item.is_replied,
                is_liked,
                total_like,
                replied_to: this.collectionComments(item.replied_by, user_id),
                created_at: (0, DateService_1.DateToPersian)(item.created_at),
            };
        }
        return transform;
    }
    collectionComments(comments, user_id) {
        return comments.map((item) => this.transformComment(item, user_id));
    }
};
ServicesModuleAppTransformer = __decorate([
    (0, common_1.Injectable)()
], ServicesModuleAppTransformer);
exports.default = ServicesModuleAppTransformer;
//# sourceMappingURL=Transformer.js.map