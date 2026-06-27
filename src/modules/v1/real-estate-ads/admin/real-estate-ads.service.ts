import { HttpStatus, Injectable } from "@nestjs/common";
import RealEstateAdsPostgresqlRepository from "../repositories/RealEstateAdsPostgresqlRepository";
import statuses from "src/commons/contracts/Statuses";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import SortingTypes from "src/commons/contracts/SortingTypes";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { GetRealEstateAdDto } from "./dto/get-real-estate-ads.dto";
import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";
import { UsersService } from "src/modules/v1/users/admin/users.service";
import { Admin_ChangeStatusAdDto } from "./dto/change-status-ad.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import UserTypes from "src/commons/contracts/UserTypes";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { CreateAdCategoryDto } from "./dto/create-ad-category-dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category-dto";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { GetTypes } from "../../client/admin/dto/client-list.dto";
import * as process from "process";
import { saveReasonsForRejectingAdsDto } from "./dto/saveReasonsForRejectingAds-dto";
import sortingTypes from "src/commons/contracts/SortingTypes";
import Statuses from "src/commons/contracts/Statuses";
import { RealEstateAdsServiceApp } from "../app/real-estate-ads-service-app.service";
import { WarningSignsBeforeTransactionDto } from "./dto/warning-signs-before-transaction-dto";
import { PublicMessage } from "src/commons/enums/messages";
import UploadService from "src/modules/services/UploadService";
import { AdsDetailTags } from "../app/dto/get-details-real-estate-ads.dto";
import { GetReasonsAdDto } from "./dto/get-reasons-ad.dto";
import { ReasonAdTypes } from "./enums/ReasonAdTypes";

@Injectable()
export class RealEstateAdsService {
  private readonly uploadService: UploadService;

  constructor(
    private readonly realEstateAdsPostgresqlRepository: RealEstateAdsPostgresqlRepository,
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly adsServiceApp: RealEstateAdsServiceApp
  ) {
    this.uploadService = new UploadService();
  }

  async findDetails(tracking_code: any) {
    try {
      const result = (await this.prismaService.realEstateAds.findFirst({
        where: { tracking_code: tracking_code, tag: AdsDetailTags.mrbuilding },
        select: {
          id: true,
          category: { select: { id: true, title: true, type: true } },
          subCategory: { select: { id: true, title: true } },
          tracking_code: true,
          tag: true,
          owner_name: true,
          owner_phone: true,

          display_contact: true,
          seller_type: true,
          is_applicant: true,
          client_id: true,
          agent_id: true,
          advisor_id: true,
          title: true,
          description: true,
          lat_item: true,
          long_item: true,
          agent_valuation_request: true,
          price_status: true,
          price_rating: true,
          status: true,
          is_timed: true,
          expired_at: true,
          created_at: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          area: true,
          sale_price: true,
          deposit_price: true,
          rent_price: true,
          number_of_rooms: true,
          max_capicity: true,
          size: true,
          year_built: true,
          normal_days_price: true,
          weekend_price: true,
          special_days_price: true,
          cost_per_additional_person: true,
          extra_people: true,
          RealEstateAdForms: {
            select: {
              id: true,
              value: true,
              form: {
                select: {
                  id: true,
                  icon: true,
                  field_name: true,
                  field_type: true,
                  values: true,
                  sort_number: true
                }
              }
            },
            orderBy: {
              form: {
                sort_number: "asc"
              }
            }
          },
          robotAdItems: true,
          media: {
            select: {
              id: true,
              file_name: true,
              file_type: true,
              sort_number: true,
              priority: true,
              thumbnail: true
            }
          }
        }
      })) as any;

      if (!result) {
        return { status: 400 };
      }

      let adOwnerInfo;
      if (result.seller_type === RealEstateAdSellerTypes.individual) {
        adOwnerInfo = await this.prismaService.client.findFirst({
          where: { id: result.client_id }
        });
        result.owner_info = {
          phone: adOwnerInfo.phone,
          name: adOwnerInfo.name + " " + adOwnerInfo.surname,
          avatar: adOwnerInfo.avatar
            ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${adOwnerInfo.avatar}`
            : ""
        };
      } else if (
        result.seller_type === RealEstateAdSellerTypes.real_estate_agent
      ) {
        const adminInfo =
          await this.prismaService.realEstateAgentAdmins.findFirst({
            where: {
              agent_id: result.agent_id,
              permissions: { hasSome: "answer_calls" }
            },
            select: {
              client: { select: { phone: true, name: true, avatar: true } }
            },
            orderBy: { id: "desc" }
          });

        const agentInfo = await this.prismaService.realEstateAgents.findUnique({
          where: { id: result.agent_id },
          select: {
            name: true,
            avatar: true,
            client: { select: { phone: true } }
          }
        });

        if (!adminInfo) {
          adOwnerInfo = {
            phone: agentInfo.client.phone,
            name: agentInfo.name,
            avatar: agentInfo.avatar
          };
          result.owner_info = {
            phone: adOwnerInfo.phone,
            name: adOwnerInfo.name,
            avatar: adOwnerInfo.avatar
              ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.avatar}`
              : ""
          };
        } else {
          adOwnerInfo = {
            phone: adminInfo.client.phone,
            name: adminInfo.client.name,
            avatar: adminInfo.client.avatar
          };
          result.owner_info = {
            phone: adOwnerInfo.phone,
            name: adOwnerInfo.name,
            avatar: adOwnerInfo.avatar
              ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.avatar}`
              : ""
          };
        }
      } else if (result.seller_type === RealEstateAdSellerTypes.advisor) {
        adOwnerInfo = await this.prismaService.realEstateAdvisors.findFirst({
          where: { client_id: result.client_id },
          select: {
            phone: true,
            avatar: true,
            client: { select: { name: true, avatar: true } },
            real_estate_agent: {
              select: { id: true, phone: true, name: true, avatar: true }
            }
          }
        });

        result.owner_info = {
          phone: adOwnerInfo.real_estate_agent.phone,
          name: adOwnerInfo.real_estate_agent.name,
          avatar: adOwnerInfo.real_estate_agent.avatar
            ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.real_estate_agent.avatar}`
            : ""
        };
      }

      return {
        status: 200,
        result
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async changeStatus(body: Admin_ChangeStatusAdDto) {
    try {
      const ad_info = await this.prismaService.realEstateAds.findFirst({
        where: {
          id: body.item_id
        }
      });
      if (!ad_info) {
        return { status: 400 };
      }

      // increase or decrease number_of_ads for real estate agent and real estate agent advisor
      if (
        ad_info.seller_type === RealEstateAdSellerTypes.real_estate_agent ||
        ad_info.seller_type === RealEstateAdSellerTypes.advisor
      ) {
        await this.changeNumberOfAds(ad_info, body.status);
      }

      // change status ad
      const result = await this.realEstateAdsPostgresqlRepository.changeStatus(
        {
          id: body.item_id
        },
        { status: body.status, price_status: body.price_status }
      );
      if (!result) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAdApproval.create({
        data: {
          user_id: Number(body.user_id),
          user_type: UserTypes.dashboard_admin,
          ad_id: body.item_id,
          status: body.status
        }
      });

      if (body.status === Statuses.rejected) {
        await this.prismaService.reasonsForRejectingAds.deleteMany({
          where: {
            adId: body.item_id
          }
        });

        await this.prismaService.reasonsForRejectingAds.createMany({
          data: body.reasons.map((item) => {
            return {
              text: item,
              adId: body.item_id
            };
          })
        });
      } else {
        const { details } = await this.adsServiceApp.adDetail({
          id: ad_info.id
        });

        // await this.adsServiceApp.sendNotificationNewAd(details);

        // update published_ad_time for realEstate after approved ad with admin panel
        if (
          ad_info.seller_type === RealEstateAdSellerTypes.real_estate_agent ||
          ad_info.seller_type === RealEstateAdSellerTypes.advisor
        ) {
          await this.updatePublishedAdTime(ad_info.agent_id);
        }
      }

      return {
        status: 200
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async updatePublishedAdTime(agent_id: number) {
    await this.prismaService.realEstateAgents.update({
      where: { id: agent_id },
      data: {
        published_ad_time: new Date(Date.now())
      }
    });
  }

  async saveCategory(body: CreateAdCategoryDto) {
    try {
      let result;

      if (body.item_id) {
        result = { id: body.item_id };
        await this.prismaService.realEstateAdMainCategory.update({
          where: { id: body.item_id },
          data: {
            title: body.title,
            type: body.type
          },
          select: { id: true }
        });
      } else {
        result = await this.prismaService.realEstateAdMainCategory.create({
          data: {
            type: body.type,
            title: body.title
          }
        });
      }

      if (body.items.length) {
        await body.items.map(async (item) => {
          console.log(item);

          await this.prismaService.realEstateAdSubCategory.create({
            data: {
              title: item.title,
              formId: item.form_id,
              categoryId: result.id
            }
          });
        });
      }

      return {
        status: 201
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async getCategorys(body: PaginationDto) {
    try {
      let where = {};
      if (body.status === statuses.all) {
        where = {};
      } else {
        where = { status: body.status };
      }

      const count = await this.prismaService.realEstateAdMainCategory.count({
        where: { ...where }
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(body.per_page)
      );

      const paginationValue = this.makePagination(
        Number(body.page),
        Number(body.per_page)
      );

      const result = await this.prismaService.realEstateAdMainCategory.findMany(
        {
          where: {
            ...where
          },
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            RealEstateAdSubCategory: {
              select: {
                id: true,
                title: true,
                formId: true,
                form: {
                  select: {
                    items: {
                      orderBy: { sort_number: "asc" },
                      select: {
                        id: true,
                        field_name: true,
                        is_active: true,
                        required: true,
                        field_type: true,
                        values: true,
                        icon: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: { id: "desc" },
          skip: paginationValue.offset,
          take: paginationValue.per_page
        }
      );

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(body.page),
          Number(body.per_page),
          Number(total)
        )
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async deleteMainCategory(item_id: string) {
    try {
      const result =
        await this.prismaService.realEstateAdMainCategory.findFirst({
          where: {
            id: item_id
          }
        });
      if (!result) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAdSubCategory.deleteMany({
        where: { categoryId: item_id }
      });
      await this.prismaService.realEstateAdMainCategory.delete({
        where: { id: item_id }
      });

      return {
        status: 200,
        result
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async deleteSubCategory(item_id: string) {
    try {
      const result = await this.prismaService.realEstateAdSubCategory.findFirst(
        {
          where: {
            id: item_id
          }
        }
      );
      if (!result) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAdSubCategory.delete({
        where: { id: item_id }
      });

      return {
        status: 200,
        result
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async updateSubCategory(body: UpdateSubCategoryDto) {
    try {
      const result = await this.prismaService.realEstateAdSubCategory.findFirst(
        {
          where: {
            id: body.item_id
          }
        }
      );
      if (!result) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAdSubCategory.update({
        where: { id: body.item_id },
        data: { title: body.title, form: { connect: { id: body.form_id } } }
      });

      return {
        status: 200,
        result
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async saveReasonsForRejectingAds(body: saveReasonsForRejectingAdsDto) {
    try {
      let result;
      if (body.item_id) {
        result = await this.prismaService.reasonsAdTemplate.update({
          where: {
            id: body.item_id
          },
          data: {
            userId: body.user_id,
            text: body.text,
            type: body.type
          },
          select: {
            userId: true,
            text: true,
            type: true,
            created_at: true
          }
        });
      } else {
        result = await this.prismaService.reasonsAdTemplate.create({
          data: {
            userId: body.user_id,
            text: body.text,
            type: body.type
          },
          select: {
            userId: true,
            text: true,
            type: true,
            created_at: true
          }
        });
      }

      return {
        status: 200,
        result
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async getReasonsList(query: GetReasonsAdDto) {
    try {
      let condition: any = {};
      if (query.reason_type !== ReasonAdTypes.All) {
        condition = { type: query.reason_type };
      }

      if (query.type === GetTypes.search) {
        condition = {
          text: {
            contains: query.keyword,
            mode: "insensitive"
          }
        };
      }
      let orderBy: any = { created_at: "desc" };
      if (query.sort === sortingTypes.oldest) {
        orderBy = { created_at: "asc" };
      }

      // TODO test log
      console.log({ condition });

      const count = await this.prismaService.reasonsAdTemplate.count({
        where: { ...condition }
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const result = await this.prismaService.reasonsAdTemplate.findMany({
        where: { ...condition },
        orderBy,
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        select: {
          id: true,
          text: true,
          type: true,
          created_at: true
        }
      });

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        )
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async SaveWarningSingBeforeTransaction(
    body: WarningSignsBeforeTransactionDto
  ) {
    let result;
    if (body.item_id) {
      result = await this.prismaService.warningSignsBeforTransaction.update({
        where: { id: body.item_id },
        data: { content: body.content },
        select: {
          id: true,
          content: true
        }
      });
    }
    result = await this.prismaService.warningSignsBeforTransaction.create({
      data: { content: body.content },
      select: {
        id: true,
        content: true
      }
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: PublicMessage.Created,
      data: result
    };
  }

  public async GetWarningSingBeforeTransaction() {
    const result =
      await this.prismaService.warningSignsBeforTransaction.findFirst({
        select: {
          id: true,
          content: true
        }
      });

    return {
      statusCode: HttpStatus.OK,
      message: PublicMessage.OkResponse,
      data: result
    };
  }

  public async deleteAd(id: number) {
    await this.prismaService.realEstateAds.findFirst({
      where: {
        id
      }
    });
    const adMedia = await this.prismaService.realEstateAdvertisements.findMany({
      where: { ad_id: id }
    });
    adMedia.map(async (item) => {
      await this.uploadService.removeFile(item.file_name, "/real_estate_ads/");
    });

    await this.prismaService.realEstateAdvertisements.deleteMany({
      where: { ad_id: id }
    });

    await this.prismaService.realEstateAdFormValue.deleteMany({
      where: { ad_id: id }
    });

    await this.prismaService.realEstateAds.delete({
      where: {
        id
      }
    });

    return {
      statusCode: HttpStatus.OK,
      message: PublicMessage.Deleted
    };
  }

  public async deleteReasonsForRejectingAds(item_id: string) {
    try {
      await this.prismaService.reasonsAdTemplate.delete({
        where: {
          id: item_id
        }
      });

      return {
        status: 200
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async changeNumberOfAds(ad_info: any, status: string) {
    try {
      const agent_info = await this.prismaService.realEstateAgents.findFirst({
        where: { id: ad_info.agent_id }
      });

      if (ad_info.seller_type === RealEstateAdSellerTypes.real_estate_agent) {
        if (status === statuses.approved) {
          await this.prismaService.realEstateAgents.update({
            where: { id: ad_info.agent_id },
            data: {
              number_of_ads: agent_info.number_of_ads + 1
            }
          });
        } else if (status === statuses.rejected) {
          await this.prismaService.realEstateAgents.update({
            where: { id: ad_info.agent_id },
            data: {
              number_of_ads: agent_info.number_of_ads - 1
            }
          });
        }
      } else if (ad_info.seller_type === RealEstateAdSellerTypes.advisor) {
        const advisor_info =
          await this.prismaService.realEstateAdvisors.findFirst({
            where: { id: ad_info.advisor_id }
          });

        if (status === statuses.approved) {
          await this.prismaService.realEstateAdvisors.update({
            where: { id: ad_info.advisor_id },
            data: {
              number_of_ads: advisor_info.number_of_ads + 1
            }
          });

          await this.prismaService.realEstateAgents.update({
            where: { id: ad_info.agent_id },
            data: {
              number_of_ads: agent_info.number_of_ads + 1
            }
          });
        } else if (status === statuses.rejected) {
          await this.prismaService.realEstateAdvisors.update({
            where: { id: ad_info.advisor_id },
            data: {
              number_of_ads: advisor_info.number_of_ads - 1
            }
          });

          await this.prismaService.realEstateAgents.update({
            where: { id: ad_info.agent_id },
            data: {
              number_of_ads: agent_info.number_of_ads - 1
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private async getUserPermittedAds() {
    const result =
      await this.prismaService.adminUserRoleCategoryPermissions.findMany({
        where: {
          key: "list_ads"
        },
        select: {
          category: {
            select: {
              assignedRoles: {
                select: {
                  role: {
                    select: {
                      userRoles: {
                        select: {
                          user: {
                            select: {
                              id: true,
                              name: true,
                              phone: true,
                              email: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

    let usersPermitted = [];
    console.log("userPermitted response");
    result.map((item) => {
      item.category.assignedRoles.map((item2) => {
        item2.role.userRoles.map((user) => {
          usersPermitted = [...usersPermitted, user.user];
        });
      });
    });

    let emailList = [];
    usersPermitted.map((item) => {
      // TODO: Test log in usersPermitted
      console.log(item.email);

      emailList.push(item.email);
    });

    return emailList;
  }

  private async senEmailForAdmins() {
    // sent email for admin user permitted
    const usersPermitted = await this.getUserPermittedAds();
    await this.mailerService.sendBulk({
      body: "آگهی جدید ثبت شده است. برای بررسی آگهی ها وارد پنل آقای ساختمان شوید.",
      subject: "اطلاع رسانی - آگهی جدید",
      to: usersPermitted
    });
  }

  async findAds(query: GetRealEstateAdDto) {
    try {
      const client = await this.usersService.validateWithID(
        Number(query.user_id)
      );
      if (!client) {
        return { status: 403 };
      }

      // conditions
      let condition: any = {};

      if (query.status !== statuses.all) {
        condition = {
          where: { status: query.status },
          orderBy: { id: "desc" }
        };
      }

      // order by
      if (query.sort === SortingTypes.newest) {
        condition = {
          ...condition,
          orderBy: { id: "desc" }
        };
      } else if (query.sort === SortingTypes.oldest) {
        condition = {
          ...condition,
          orderBy: { id: "asc" }
        };
      } else if (query.sort === SortingTypes.most_expensive) {
        condition = {
          ...condition,
          orderBy: [
            { sale_price: "desc" },
            { deposit_price: "desc" },
            { rent_price: "desc" }
          ]
        };
      } else if (query.sort === SortingTypes.cheapest) {
        condition = {
          ...condition,
          orderBy: [
            { sale_price: "asc" },
            { deposit_price: "asc" },
            { rent_price: "asc" }
          ]
        };
      }

      if (query.sub_category) {
        condition = {
          ...condition,
          where: {
            ...condition.where,
            subCategoryId: query.sub_category
          }
        };
      }

      if (query.province_id) {
        condition = {
          ...condition,
          where: {
            province_id: Number(query.province_id)
          }
        };
      }

      condition.where = {
        ...condition.where,
        tag: AdsDetailTags.mrbuilding
      };

      if (query.type === GetTypes.search) {
        condition = {
          ...condition,
          where: {
            ...condition.where,
            OR: [
              {
                title: {
                  contains: query.keyword,
                  mode: "insensitive"
                }
              },
              {
                client: {
                  name: {
                    contains: query.keyword,
                    mode: "insensitive"
                  }
                }
              },
              {
                client: {
                  phone: {
                    contains: query.keyword,
                    mode: "insensitive"
                  }
                }
              },
              {
                client: {
                  real_state_agents: {
                    some: {
                      name: {
                        contains: query.keyword,
                        mode: "insensitive"
                      }
                    }
                  }
                }
              }
            ]
          }
        };
      }
      // TODO test log
      console.log("*** find Ads: Admin ***");
      console.log("page ", query.page);
      console.log({ query });
      console.log({ condition });

      const count = await this.realEstateAdsPostgresqlRepository.count(
        condition
      );
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      let result = await this.realEstateAdsPostgresqlRepository.findMany({
        ...condition,
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        select: {
          id: true,
          category: { select: { id: true, title: true, type: true } },
          subCategory: { select: { id: true, title: true } },
          title: true,
          status: true,
          Reasons: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          client_id: true,
          agent_id: true,
          advisor_id: true,
          seller_type: true,
          tracking_code: true,
          sale_price: true,
          deposit_price: true,
          rent_price: true,
          number_of_rooms: true,
          max_capicity: true,
          created_at: true,
          area: true,
          media: {
            where: {
              file_type: RealEstateAdMediaType.image,
              priority: RealEstateAdMediaTypePriorities.primary
            },
            select: {
              id: true,
              file_name: true,
              file_type: true,
              sort_number: true,
              priority: true
            }
          }
        }
      });
      if (!result) {
        return { status: 400 };
      }

      result = await Promise.all(
        result.map(async (item: any) => {
          return await this.getAdOwnerInfo(item);
        })
      );

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        )
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findOneByID(item_id: number) {
    return await this.prismaService.realEstateAds.findFirst({
      where: { id: Number(item_id) },
      select: { id: true, title: true }
    });
  }

  private async getAdOwnerInfo(ad) {
    const adInfo = ad;
    adInfo.owner_info = adInfo.owner_info;

    if (ad.seller_type === RealEstateAdSellerTypes.real_estate_agent) {
      const agentInfo = await this.prismaService.realEstateAgents.findFirst({
        where: { id: ad.agent_id },
        select: { name: true, avatar: true }
      });
      adInfo.owner_info = {
        name: agentInfo.name,
        avatar: agentInfo.avatar
          ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${agentInfo.avatar}`
          : ""
      };
    } else if (ad.seller_type === RealEstateAdSellerTypes.advisor) {
      const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst(
        {
          where: { id: ad.advisor_id },
          select: {
            real_estate_agent: { select: { name: true, avatar: true } }
          }
        }
      );
      adInfo.owner_info = {
        name: advisorInfo.real_estate_agent.name,
        avatar: advisorInfo.real_estate_agent.avatar
          ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${advisorInfo.real_estate_agent.avatar}`
          : ""
      };
    }

    return adInfo;
  }

  // make metadata
  private makeMetadata(
    page: number,
    per_page: number,
    total_page: number
  ): IMetadata {
    return {
      page,
      total_page,
      per_page: per_page,
      next: page < total_page,
      back: page > 1
    };
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
