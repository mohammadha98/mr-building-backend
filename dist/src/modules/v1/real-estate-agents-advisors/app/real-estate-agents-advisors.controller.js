"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAgentsAdvisorsController = void 0;
const delete_filtered_word_advisor_dto_1 = require("./dto/delete-filtered-word-advisor.dto");
const common_1 = require("@nestjs/common");
const real_estate_agents_advisors_service_1 = require("./real-estate-agents-advisors.service");
const create_real_estate_agents_advisor_dto_1 = require("./dto/create-real-estate-agents-advisor.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const validate_real_estate_agents_advisor_dto_1 = require("./dto/validate-real-estate-agents-advisor.dto");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const Transformer_1 = require("../../client/app/Transformer");
const get_real_estate_agents_advisors_dto_1 = require("./dto/get-real-estate-agents-advisors.dto");
const Transformer_2 = require("./Transformer");
const change_status_real_estate_agents_advisors_dto_1 = require("./dto/change-status-real-estate-agents-advisors.dto");
const delete_real_estate_agents_advisors_dto_1 = require("./dto/delete-real-estate-agents-advisors.dto");
const create_active_area_advisor_dto_1 = require("./dto/create-active-area-advisor.dto");
const delete_active_area_advisor_dto_1 = require("./dto/delete-active-area-advisor.dto");
const get_active_areas_advisor_dto_1 = require("./dto/get-active-areas-advisor.dto");
const create_advisor_comment_dto_1 = require("./dto/create-advisor-comment.dto");
const get_advisor_comments__dto_1 = require("./dto/get-advisor-comments..dto");
const save_advisor_settings__dto_1 = require("./dto/save-advisor-settings..dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const update_real_estate_agents_comment_dto_1 = require("../../real-estate-agents-comments/app/dto/update-real-estate-agents-comment.dto");
let RealEstateAgentsAdvisorsController = class RealEstateAgentsAdvisorsController {
    constructor(responseHandler, realEstateAdvisorTransformer, clientTransformer, realEstateAgentsAdvisorsService) {
        this.responseHandler = responseHandler;
        this.realEstateAdvisorTransformer = realEstateAdvisorTransformer;
        this.clientTransformer = clientTransformer;
        this.realEstateAgentsAdvisorsService = realEstateAgentsAdvisorsService;
    }
    async validate(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: validate ***");
        console.log(body);
        const result = await this.realEstateAgentsAdvisorsService.validate(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.clientTransformer.transform(result.user);
        return this.responseHandler.send(res, 200, "ریسپانس در دسترس است.", {
            status: result.result,
            client_info: transformer,
        });
    }
    async create(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: create ***");
        console.log(body);
        const result = await this.realEstateAgentsAdvisorsService.create(body);
        if (result.status === 200) {
            return this.responseHandler.send(res, 200, "کارشناس موردنظر اضافه نشد. برای بررسی دلیل به جزییات ریسپانس مراجعه کنید.", {
                status: result.result,
            });
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 201, "کارشناس با موفقیت اضافه شد.", {
            status: result.result,
            advisor: result.advisor,
        });
    }
    async updatePermissions(body) {
        console.log("*** updatePermissions Advisor  ***");
        console.log(body);
        return await this.realEstateAgentsAdvisorsService.updatePermissions(body);
    }
    async findAll(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: findAll ***");
        console.log({ query });
        const result = await this.realEstateAgentsAdvisorsService.findAll(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کارشناس درخواست موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "لیست کارشناس های کارشناس در دسترس است.", result.advisors);
    }
    async changeStatus(body, req, res) {
        console.log("*** RealEstateAgentsAdvisor: change status ***");
        console.log(body);
        body.client_id = req.user.id;
        const result = await this.realEstateAgentsAdvisorsService.changeStatus(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا . کارشناس مورد نظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "وضعیت کارشناس با موفقیت تغییر کرد.");
    }
    async removeAdvisor(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: removeAdvisor ***");
        console.log(body);
        const result = await this.realEstateAgentsAdvisorsService.removeAdvisor(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا . کارشناس مورد نظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "وضعیت کارشناس با موفقیت تغییر کرد.");
    }
    async storeActiveArea(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: storeActiveArea ***");
        console.log(body);
        const result = await this.realEstateAgentsAdvisorsService.storeActiveArea(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.realEstateAdvisorTransformer.collectionActiveArea(result.active_areas);
        return this.responseHandler.send(res, 200, "محدوده موردنظر با موفقیت ذخیره شد.", transformer);
    }
    async removeActiveArea(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: removeActiveArea ***");
        console.log(body);
        const result = await this.realEstateAgentsAdvisorsService.removeActiveArea(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "آیتم مورد نظر با موفقیت حذف شد.");
    }
    async getActiveAreas(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: getActiveAreas ***");
        console.log(query);
        const result = await this.realEstateAgentsAdvisorsService.getActiveAreas(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کارشناس مورد نظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.realEstateAdvisorTransformer.collectionActiveArea(result.result);
        return this.responseHandler.send(res, 200, "لیست محدوده ها در دسترس است.", transformer);
    }
    async storeFilteredWord(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: storeFilteredWord ***");
        console.log(body);
        const result = await this.realEstateAgentsAdvisorsService.storeFilteredWord(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.realEstateAdvisorTransformer.collectionFilteredWord(result.filtered_words);
        return this.responseHandler.send(res, 200, "فیلتر کلمات جدید با موفقیت ذخیره شد.", transformer);
    }
    async removeFilteredWord(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: removeFilteredWord ***");
        console.log(body);
        const result = await this.realEstateAgentsAdvisorsService.removeFilteredWord(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "آیتم مورد نظر با موفقیت حذف شد.");
    }
    async getFilteredWords(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: getActiveAreas ***");
        console.log(query);
        const result = await this.realEstateAgentsAdvisorsService.getFilteredWords(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کارشناس مورد نظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.realEstateAdvisorTransformer.collectionActiveArea(result.result);
        return this.responseHandler.send(res, 200, "لیست کلمات فیلتر شده کارشناس در دسترس است.", transformer);
    }
    async storeComment(body, req, res) {
        body.client_id = req.user.id;
        const result = await this.realEstateAgentsAdvisorsService.storeComment(body);
        if (result.status === 200) {
            const transformer = this.realEstateAdvisorTransformer.transformComments(result.result);
            return this.responseHandler.send(res, 200, "نظر شما در سیستم موجود میباشد.", {
                result: transformer,
                is_blocked: result.is_blocked,
            });
        }
        else if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کارشناس موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.realEstateAdvisorTransformer.transformComments(result.result);
        return this.responseHandler.send(res, 201, "نظر شما با موفقیت ثبت شد. بعد از بررسی و تایید منتشر میشود.", {
            result: transformer,
            is_blocked: result.is_blocked,
        });
    }
    async findComments(query, req, res) {
        query.client_id = req.user.id;
        const result = await this.realEstateAgentsAdvisorsService.findComments(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.realEstateAdvisorTransformer.collectionComments(result.result);
        const user_comment = this.realEstateAdvisorTransformer.transformComments(result.user_comment);
        return this.responseHandler.send(res, 200, "لیست نظرات ثبت شده در دسترس است.", {
            data: transformer,
            statistics: result.statistics,
            comment_submitted: result.comment_submitted,
            user_comment,
            metadata: result.metadata,
        });
    }
    async deleteCommentForRealEstate(query) {
        return this.realEstateAgentsAdvisorsService.deleteCommentForAdvisor(query);
    }
    async saveSettings(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** change advisor dashboard settings ***");
        console.log(body);
        const result = await this.realEstateAgentsAdvisorsService.saveSettings(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کارشناس موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "تنظیمات کارشناس با موفقیت تغییر کرد.");
    }
    async updateProfile(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** Update Advisor ***");
        console.log(body);
        const result = await this.realEstateAgentsAdvisorsService.updateProfile(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کارشناس موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "بروزرسانی با موفقیت انجام شد.");
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "ریسپانس در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "ریسپانس در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "estate_agent, not_found, busy, free",
                        },
                        client_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                provider_id: { type: "integer", example: 1 },
                                name: { type: "string", example: "" },
                                surname: { type: "string", example: "" },
                                phone: { type: "string", example: "09120000000" },
                                avatar: { type: "string", example: "" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "بررسی شماره کارشناس" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("/validate"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_real_estate_agents_advisor_dto_1.ValidateRealEstateAgentsAdvisorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "validate", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "افزودن کارشناس انجام نشد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "افزودن کارشناس انجام نشد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "estate_agent, not_found, busy",
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "کارشناس با موفقیت اضافه شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "کارشناس با موفقیت اضافه شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "created",
                        },
                        advisor: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "افزودن کارشناس به مشاوراملاک" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_agents_advisor_dto_1.CreateRealEstateAgentsAdvisorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)("update-permissions"),
    (0, swagger_1.ApiOperation)({ summary: "ویرایش دسترسی کارشناس" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_agents_advisor_dto_1.UpdatePermissionsForAdvisorDto]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "updatePermissions", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کارشناس های کارشناس در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست کارشناس های کارشناس در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 1 },
                            name: { type: "string" },
                            phone: { type: "string" },
                            validate_phone: { type: "boolean", default: false },
                            avatar: { type: "string" },
                            score: { type: "integer", example: 0 },
                            biography: { type: "string" },
                            comment_visibility: { type: "boolean" },
                            number_of_ads: { type: "integer", example: 0 },
                            total_customer: { type: "integer", example: 0 },
                            status: { type: "string", example: "active, inactive" },
                            agent_info: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت لیست کارشناس های یک مشاور املاک" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_real_estate_agents_advisors_dto_1.GetRealEstateAgentsAdvisorsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وضعیت کارشناس با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وضعیت کارشناس با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت کارشناس" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_real_estate_agents_advisors_dto_1.ChangeStatusRealEstateAgentsAdvisorsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وضعیت کارشناس با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وضعیت کارشناس با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف کارشناس" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_real_estate_agents_advisors_dto_1.DeleteRealEstateAgentsAdvisorsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "removeAdvisor", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "محدوده موردنظر با موفقیت ذخیره شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "محدوده موردنظر با موفقیت ذخیره شد.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                                example: 1,
                            },
                            title: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "افزودن محدوده فعالیت کارشناس" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("/active_areas"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_active_area_advisor_dto_1.CreateActiveAreaAdvisorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "storeActiveArea", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "آیتم مورد نظر با موفقیت حذف شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "آیتم مورد نظر با موفقیت حذف شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف محدوده فعالیت" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Delete)("/active_areas"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_active_area_advisor_dto_1.DeleteActiveAreaAdvisorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "removeActiveArea", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست محدوده ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست محدوده ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                                example: 1,
                            },
                            title: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت محدوده های فعالیت کارشناس" }),
    (0, common_1.Get)("/active_areas"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_active_areas_advisor_dto_1.GetActiveAreasAdvisorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "getActiveAreas", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "فیلتر کلمات جدید با موفقیت ذخیره شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "فیلتر کلمات جدید با موفقیت ذخیره شد.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                                example: 1,
                            },
                            title: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "افزودن کلمات فیلتر شده توسط کارشناس" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("/filtered_words"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_active_area_advisor_dto_1.CreateActiveAreaAdvisorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "storeFilteredWord", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "آیتم مورد نظر با موفقیت حذف شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "آیتم مورد نظر با موفقیت حذف شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف  کلمه فیلتر شده" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Delete)("/filtered_words"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_filtered_word_advisor_dto_1.DeleteFilteredWordAdvisorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "removeFilteredWord", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کلمات فیلتر شده کارشناس در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست کلمات فیلتر شده کارشناس در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                                example: 1,
                            },
                            title: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست کلمات فیلتر شده کارشناس   ." }),
    (0, common_1.Get)("/filtered_words"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_active_areas_advisor_dto_1.GetActiveAreasAdvisorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "getFilteredWords", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "نظر شما در سیستم موجود میباشد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "نظر شما در سیستم موجود میباشد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        result: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: "1" },
                                comment: { type: "String" },
                                score: { type: "number", example: 4 },
                                status: {
                                    type: "string",
                                    example: "pending, approved, rejected",
                                },
                                client: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        name: { type: "String" },
                                    },
                                },
                                created_at: {
                                    type: "object",
                                    properties: {
                                        day: { type: "integer" },
                                        month: { type: "string" },
                                        year: { type: "integer" },
                                    },
                                },
                            },
                        },
                        is_blocked: { type: "boolean", example: false },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "کامنت با موفقیت ثبت شد. بعد از تایید منتشر میشود.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "کامنت با موفقیت ثبت شد. بعد از تایید منتشر میشود.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        result: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: "1" },
                                comment: { type: "String" },
                                score: { type: "number", example: 4 },
                                status: {
                                    type: "string",
                                    example: "pending, approved, rejected",
                                },
                                client: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        name: { type: "String" },
                                    },
                                },
                                created_at: {
                                    type: "object",
                                    properties: {
                                        day: { type: "integer" },
                                        month: { type: "string" },
                                        year: { type: "integer" },
                                    },
                                },
                            },
                        },
                        is_blocked: { type: "boolean", example: false },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ثبت نظر برای کارشناس" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("comments"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_advisor_comment_dto_1.CreateAdvisorCommentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "storeComment", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست نظرات ثبت شده در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست نظرات ثبت شده در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: "1" },
                                    comment: { type: "String" },
                                    score: { type: "number", example: 4 },
                                    status: {
                                        type: "string",
                                        example: "pending, approved, rejected",
                                    },
                                    client: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "String" },
                                        },
                                    },
                                    created_at: {
                                        type: "object",
                                        properties: {
                                            day: { type: "integer" },
                                            month: { type: "string" },
                                            year: { type: "integer" },
                                        },
                                    },
                                },
                            },
                        },
                        statistics: {
                            type: "object",
                            properties: {
                                total_comments: { type: "number", example: 1 },
                                total_score: { type: "number", example: 2 },
                            },
                        },
                        comment_submitted: { type: "boolean", example: true },
                        user_comment: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: "1" },
                                agent_id: { type: "number", example: 1 },
                                comment: { type: "String" },
                                score: { type: "number", example: 4 },
                                status: {
                                    type: "string",
                                    example: "pending, approved, rejected",
                                },
                                client: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        name: { type: "String" },
                                    },
                                },
                                created_at: {
                                    type: "object",
                                    properties: {
                                        day: { type: "integer" },
                                        month: { type: "string" },
                                        year: { type: "integer" },
                                    },
                                },
                            },
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                total_page: { type: "integer", example: 1 },
                                per_page: { type: "integer", example: 1 },
                                next: { type: "boolean", example: true },
                                back: { type: "boolean", example: false },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست نظرات کارشناس" }),
    (0, common_1.Get)("comments"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_advisor_comments__dto_1.GetAdvisorCommentsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "findComments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف نظر  مشاور املاک" }),
    (0, common_1.Delete)("/comments"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_real_estate_agents_comment_dto_1.DeleteCommentDto]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "deleteCommentForRealEstate", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "تنظیمات کارشناس با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "تنظیمات کارشناس با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ذخیره تنظیمات کارشناس" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("settings"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_advisor_settings__dto_1.SaveAdvisorSettingDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "saveSettings", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "تنظیمات کارشناس با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "تنظیمات کارشناس با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "بروزرسانی بیوگرافی" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("profile"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_dto_1.UpdateAdvisorProfileDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "updateProfile", null);
RealEstateAgentsAdvisorsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/app/real-estate-agents-advisors"),
    (0, common_1.Controller)("v1/app/real-estate-agents-advisors"),
    __metadata("design:paramtypes", [httpResponsehandler_1.HttpResponsehandler,
        Transformer_2.default,
        Transformer_1.default,
        real_estate_agents_advisors_service_1.RealEstateAgentsAdvisorsService])
], RealEstateAgentsAdvisorsController);
exports.RealEstateAgentsAdvisorsController = RealEstateAgentsAdvisorsController;
//# sourceMappingURL=real-estate-agents-advisors.controller.js.map