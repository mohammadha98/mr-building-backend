"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const moment = require("moment");
const RealEstateAdSellerTypes_1 = require("../../../../commons/contracts/RealEstateAdSellerTypes");
const process = require("process");
let RealEstateAdsTransformer = class RealEstateAdsTransformer {
    transformDetails(item) {
        const items = item.items;
        return {
            id: item.id,
            tag: "divar",
            category: this.categoryInfo(item.category),
            sub_category: this.categoryInfo(item.subCategory),
            tracking_code: item.tracking_code,
            seller_type: item.seller_type,
            is_applicant: item.is_applicant,
            display_contact: true,
            agent_valuation_request: false,
            owner_id: -1,
            title: item.title,
            description: item.description,
            sale_price: item.sale_price.toString(),
            deposit_price: item.deposit_price.toString(),
            rent_price: item.rent_price.toString(),
            number_of_rooms: item.number_of_rooms,
            max_capicity: item.max_capicity,
            size: item.size,
            year_built: item.year_built,
            normal_days_price: item.normal_days_price.toString(),
            weekend_price: item.weekend_price.toString(),
            special_days_price: item.special_days_price.toString(),
            cost_per_additional_person: item.cost_per_additional_person.toString(),
            extra_people: item.extra_people,
            price_status: item.price_status,
            price_rating: item.price_rating,
            latitude: item.lat_item,
            longitude: item.long_item,
            status: item.status,
            province: this.cityInfo(item.province),
            city: this.cityInfo(item.city),
            area: item.area,
            items: this.collectionAdItems(items.length ? items : []),
            media: this.collectionFile(item.media),
            owner_info: this.getOwnerInfo(item.owner_name, item.owner_phone),
            created_at: this.calculCreatedAt(item.created_at),
            created_time: item.created_at,
        };
    }
    categoryInfo(item) {
        if (!item) {
            return null;
        }
        return {
            id: item.id,
            title: item.title,
            type: item.type,
        };
    }
    getOwnerInfo(owner_name, owner_phone) {
        return {
            name: owner_name,
            phone: owner_phone,
            avatar: "",
        };
    }
    collectionDetails(items) {
        return items.map((item) => this.transformDetails(item));
    }
    getOwnerId(item) {
        if (item.seller_type === RealEstateAdSellerTypes_1.default.individual) {
            return item.client_id;
        }
        else if (item.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent) {
            return item.agent_id;
        }
        else if (item.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
            return item.advisor_id;
        }
    }
    transformAdList(item) {
        return {
            id: item.id,
            tag: "divar",
            tracking_code: item.tracking_code,
            category: this.categoryInfo(item.category),
            sub_category: this.categoryInfo(item.subCategory),
            title: item.title,
            is_applicant: item.is_applicant,
            agent_valuation_request: false,
            status: item.status,
            reasons: item.Reasons ? item.Reasons : [],
            sale_price: item.sale_price.toString(),
            deposit_price: item.deposit_price.toString(),
            rent_price: item.rent_price.toString(),
            number_of_rooms: item.number_of_rooms,
            max_capicity: item.max_capicity,
            normal_days_price: item.normal_days_price.toString(),
            province: this.cityInfo(item.province),
            city: this.cityInfo(item.city),
            area: item.area,
            seller_type: item.seller_type,
            owner_info: this.getOwnerInfo(item.owner_name, item.owner_phone),
            created_at: this.calculCreatedAt(item.created_at),
            createdAt: item.created_at,
            media: this.transformFile(item.media[0]),
        };
    }
    collectionAdList(items) {
        return items.map((item) => this.transformAdList(item));
    }
    cityInfo(item) {
        return {
            id: -1,
            name: item,
        };
    }
    transformFile(item) {
        if (!item) {
            return {
                id: -1,
                file_name: "",
                file_type: null,
                file_url: "",
                sort_number: -1,
                priority: null,
                thumbnail: null,
            };
        }
        return {
            id: item.id,
            file_name: process.env.APP_URL + item.file_name,
            file_type: item.file_type,
            file_url: process.env.APP_URL + item.file_name,
            sort_number: item.sort_number,
            priority: item.priority,
            thumbnail: null,
        };
    }
    collectionFile(items) {
        return items.map((item) => this.transformFile(item));
    }
    transformAdItem(item) {
        if (!item) {
            return null;
        }
        return {
            id: "",
            item_id: "",
            field_type: "input_string",
            field_name: item.field_name,
            value: item.value,
            icon: "",
            sort_number: "",
        };
    }
    collectionAdItems(list) {
        return list.map((ad) => this.transformAdItem(ad));
    }
    calculCreatedAt(created_at) {
        const date = moment(created_at);
        const diffSeconds = moment().diff(date, "seconds");
        const diffMinutes = moment().diff(date, "minutes");
        const diffHours = moment().diff(date, "hours");
        const diffDays = moment().diff(date, "days");
        const diffWeeks = moment().diff(date, "weeks");
        const diffMonths = moment().diff(date, "months");
        const diffYears = moment().diff(date, "years");
        let formattedDate;
        if (diffSeconds <= 60) {
            formattedDate = `لحظاتی پیش`;
        }
        else if (diffMinutes <= 60) {
            formattedDate = `${diffMinutes} دقیقه پیش`;
        }
        else if (diffHours <= 24) {
            formattedDate = `${diffHours} ساعت پیش`;
        }
        else if (diffDays <= 7) {
            formattedDate = `${diffDays} روز پیش`;
        }
        else if (diffWeeks <= 4) {
            formattedDate = `${diffWeeks} هفته پیش`;
        }
        else if (diffMonths <= 12) {
            formattedDate = `${diffMonths} ماه پیش`;
        }
        else {
            formattedDate = `${diffYears} سال پیش`;
        }
        return formattedDate;
    }
    assortmentTransform(item) {
        return {
            id: item.id,
            title: item.title,
            type: item.type,
            sub_categories: this.subCategoryCollection(item.RealEstateAdSubCategory),
        };
    }
    assortmentCollection(items) {
        return items.map((item) => this.assortmentTransform(item));
    }
    subCategoryTransform(item) {
        return {
            id: item.id,
            title: item.title,
        };
    }
    subCategoryCollection(items) {
        return items.map((item) => this.subCategoryTransform(item));
    }
    transformFormItem(item) {
        if (!item) {
            return {};
        }
        return {
            id: item.id,
            field_name: item.field_name,
            type: item.type,
            field_type: item.field_type,
            values: item.values,
            sort_number: item.sort_number,
            status: item.status,
            icon: process.env.APP_CONTENT_PATH +
                "/real_estate_ad_forms/icons/" +
                item.icon,
            key: item.key,
        };
    }
    collectionFormItem(items) {
        return items.map((item) => this.transformFormItem(item));
    }
};
RealEstateAdsTransformer = __decorate([
    (0, common_1.Injectable)()
], RealEstateAdsTransformer);
exports.default = RealEstateAdsTransformer;
//# sourceMappingURL=Transformer.js.map