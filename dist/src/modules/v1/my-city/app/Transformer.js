"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const process = require("process");
let MyCityTransformer = class MyCityTransformer {
    transform(item) {
        return {
            id: item.id,
            category: item.category,
            province: this.cityInfo(item.province),
            city: this.cityInfo(item.city),
            title: item.title,
            latitude: item.latitude,
            longitude: item.longitude,
            status: item.status,
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    localtionDetails(item) {
        console.log(item.bookmarks);
        let is_favorite = false;
        if (item.bookmarks.length > 0) {
            is_favorite = true;
        }
        return {
            id: item.id,
            is_favorite,
            category: item.category,
            title: item.title,
            description: item.description,
            size: item.size,
            year_built: item.year_built,
            number_of_rooms: item.number_of_rooms,
            renovation_tax: item.renovation_tax,
            latitude: item.latitude,
            longitude: item.longitude,
            status: item.status,
            province: this.cityInfo(item.province),
            city: this.cityInfo(item.city),
            files: this.collectionFile(item.media),
        };
    }
    cityInfo(item) {
        if (!item) {
            return null;
        }
        return {
            id: item.id,
            name: item.name,
        };
    }
    transformFile(item) {
        if (!item) {
            return {
                id: -1,
                file_name: "",
                tag: false,
                file_type: null,
                file_url: "",
                sort_number: -1,
                priority: null,
                thumbnail: null,
            };
        }
        return {
            id: item.id,
            file_name: item.file_name,
            tag: item.tag,
            file_type: item.file_type,
            file_url: process.env.APP_CONTENT_PATH + item.file_name,
            sort_number: item.sort_number,
            priority: item.priority,
            thumbnail: process.env.APP_CONTENT_PATH + item.thumbnail,
        };
    }
    collectionFile(items) {
        return items.map((item) => this.transformFile(item));
    }
};
MyCityTransformer = __decorate([
    (0, common_1.Injectable)()
], MyCityTransformer);
exports.default = MyCityTransformer;
//# sourceMappingURL=Transformer.js.map