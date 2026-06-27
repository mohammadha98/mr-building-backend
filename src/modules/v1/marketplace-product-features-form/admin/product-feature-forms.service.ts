import { Injectable } from "@nestjs/common";
import { UpdateProductFeatureFormDto } from "./dto/update-product-feature-form.dto";
import MarketplaceProductFeatureFormsPostgresqlRepository from "../repositories/MarketplaceProductFeatureFormsPostgresqlRepository";
import { GetProductFeaturesDto } from "./dto/get-product-feature-forms.dto";
import { CreateProductFeatureDto } from "./dto/create-productfeature-form-item.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { UpdateSortProductFeatureFormsDto } from "./dto/update-sort-product-feature-forms.dto";
import { createProductFeatureFormsDto } from "./dto/create-product-feature-form.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { UpdateProductFeatureDto } from "./dto/update-product-feature.dto";

@Injectable()
export class ProductFeatureFormsService {
  constructor(
    private readonly featureFormsPostgresqlRepository: MarketplaceProductFeatureFormsPostgresqlRepository,
    private readonly prismaService: PrismaService
  ) {}

  public async createNewForm(body: createProductFeatureFormsDto) {
    try {
      const result =
        await this.prismaService.marketplaceProductFeaturesForm.create({
          data: {
            title: body.title,
            description: body.description,
          },
          select: { id: true, title: true, description: true },
        });
      return { status: 201, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async saveItem(body: CreateProductFeatureDto) {
    try {
      if (body.values) {
        const valuesList = body.values as any;
        const values = valuesList.split(",");
        body.values = values;
      } else {
        body.values = [];
      }

      const result = await this.featureFormsPostgresqlRepository.saveItem(body);

      return { status: 201, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findForms(query: PaginationDto) {
    try {
      const count = await this.featureFormsPostgresqlRepository.count({
        where: {},
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const result = await this.featureFormsPostgresqlRepository.findMany({
        where: {},
        orderBy: { id: "asc" },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
      });

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  async findItems(query: GetProductFeaturesDto) {
    try {
      const result = await this.featureFormsPostgresqlRepository.findManyItems({
        where: { formId: query.form_id },
        orderBy: { sort_number: "asc" },
      });
      return { status: 200, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findItemsForApp(query: GetProductFeaturesDto) {
    return await this.featureFormsPostgresqlRepository.findMany({
      where: { type: query.form_id },
      orderBy: { sort_number: "asc" },
    });
  }

  async updateForm(body: UpdateProductFeatureFormDto) {
    try {
      const item = (await this.featureFormsPostgresqlRepository.findOne({
        id: body.form_id,
      })) as any;
      if (!item) {
        return { status: 400 };
      }

      await this.featureFormsPostgresqlRepository.updateOne(
        {
          id: body.form_id,
        },
        {
          title: body.title,
          description: body.description,
        }
      );
      return {
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async updateItem(body: UpdateProductFeatureDto) {
    try {
      const item = (await this.featureFormsPostgresqlRepository.findOneItem({
        id: body.item_id,
      })) as any;
      if (!item) {
        return { status: 400 };
      }

      const valuesData = body.values as any;
      const values = body.values ? valuesData.split(",") : item.values;
      console.log(values);
      await this.featureFormsPostgresqlRepository.updateOneItem(
        {
          id: body.item_id,
        },
        {
          field_name: body.field_name,
          field_type: body.field_type,
          values: values,
        }
      );

      return {
        status: 200,
        result: {
          id: body.item_id,
          field_name: body.field_name,
          field_type: body.field_type,
          values: values,
          is_active: item.is_active,
          required: item.required,
          sort_number: item.sort_number,
          status: item.status,
          key: item.key,
        },
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async removeItem(item_id: string) {
    try {
      const item = await this.featureFormsPostgresqlRepository.findOneItem({
        id: item_id,
      });

      console.log({ item });

      if (!item) {
        return { status: 400 };
      }

      await this.featureFormsPostgresqlRepository.deleteOneItem({
        id: item_id,
        form_id: item.form_id,
      });
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async removeForm(form_id: string) {
    try {
      const item = await this.featureFormsPostgresqlRepository.findOne({
        id: form_id,
      });
      if (!item) {
        return { status: 400 };
      }

      await this.featureFormsPostgresqlRepository.deleteManyItem({
        form_id,
      });

      await this.featureFormsPostgresqlRepository.deleteOne({
        id: form_id,
      });
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async updateDraggableItems(body: UpdateSortProductFeatureFormsDto) {
    try {
      body.items.map(
        async (item) =>
          await this.featureFormsPostgresqlRepository.updateOneItem(
            { id: item.id },
            { sort_number: item.sort_number }
          )
      );

      return { status: 200 };
    } catch (error) {
      return { status: 500 };
    }
  }

  async removeFileFromStorage(file_name: string, destination: string) {
    try {
      if (existsSync(join(__dirname, destination, file_name))) {
        unlinkSync(join(__dirname, destination, file_name));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
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
      back: page > 1,
    };
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page,
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
