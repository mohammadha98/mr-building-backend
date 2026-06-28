import { HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { PrismaService } from "../../../../prisma/prisma.service";
import { exec } from "child_process";
import * as process from "process";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { MarketplaceStorefrontSort } from "../marketplace-storefront/app/dto/list-storefront.dto";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import BackupTransformer from "./Transformer";
import { PublicMessage } from "src/commons/enums/messages";
import * as fs from "node:fs";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { users } from "@prisma/client";

@Injectable({ scope: Scope.REQUEST })
export class DbBackupService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly prismaService: PrismaService,
    // private readonly mailerService: MailerService,
    private readonly backupTransFormer: BackupTransformer
  ) {}

  async saveBackup() {
    const userInfo: users = this.request.user as users;
    let result = null;

    const dbName =
      process.env.APP_MODE === "develop" ? "postgres" : "persiangulf_project";
    const dbUser = process.env.APP_MODE === "develop" ? "root" : "p3rshainglf";
    const filename = `${Date.now()}_backup.dump`;
    const backupAddr = process.cwd() + `/public/contents/backups/${filename}`;
    const command = `pg_dump -h ${process.env.DATABASE_HOST || 'localhost'} -U ${dbUser} -d ${dbName} -F c -f  "${backupAddr}"`;

    console.log("createBackup");
    console.log(command);

    let status = await this.executeCommand(command);
    console.log({ status });

    if (status !== 201) {
      throw new InternalServerErrorHandler();
    }

    result = await this.prismaService.dbBackups.create({
      data: {
        userId: userInfo?.id,
        filename,
      },
      select: {
        id: true,
        filename: true,
        createdAt: true,
        userId: true,
      },
    });
    const transformer = this.backupTransFormer.transform(result);

    if (fs.existsSync(backupAddr)) {
      console.log("File exists and is ready to attach.");
    } else {
      console.log("File not found or inaccessible.");
    }

    // await this.mailerService.send({
    //   body: transformer.link,
    //   subject: "DB Backup",
    //   to: userInfo?.email,
    //   attachments: [
    //     {
    //       filename: filename,
    //       path: backupAddr,
    //       contentType: "text/plain",
    //     },
    //   ],
    // });

    return {
      status: HttpStatus.OK,
      message: PublicMessage.OkResponse,
      data: transformer,
    };
  }

  private async executeCommand(command: string) {
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        let returnValue;

        if (error) {
          console.error(`Process failed: ${error.message}`);
          returnValue = 500;
          resolve(returnValue);
        }
        if (stderr) {
          console.error(`Process failed: ${stderr}`);
          returnValue = 500;
          resolve(returnValue);
        }
        console.log("Process successfully!");
        console.log(stdout);
        returnValue = 201;
        resolve(returnValue);
      });
    });
  }

  async getBackupList(query: PaginationDto) {
    try {
      const count = await this.prismaService.dbBackups.count({});

      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      let orderBy: any = {};
      if (query.sort == MarketplaceStorefrontSort.newest) {
        orderBy = {
          createdAt: "desc",
        };
      } else if (query.sort == MarketplaceStorefrontSort.oldest) {
        orderBy = {
          createdAt: "asc",
        };
      }
      const result = await this.prismaService.dbBackups.findMany({
        select: {
          id: true,
          filename: true,
          createdAt: true,
          userId: true,
        },
        orderBy,
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
      console.error(`Error: get Backup`);
      console.log(error);

      return { status: 500 };
    }
  }

  async createZipPublicDir(user_id: number) {
    const filename = `${Date.now()}_public_backup.zip`;
    const sourceDir = process.cwd() + `/public/*`;
    const distDir = process.cwd() + `/public/contents/backups/${filename}`;
    const command = `zip -R ${distDir} ${sourceDir}`;

    console.log("createZipPublicDir");
    console.log(filename);
    console.log(command);

    let resultDB = null;
    let status = null;
    try {
      let result = await this.executeCommand(command);

      console.log({ result });

      if (result !== 500) {
        console.log(result);
        status = 201;
        // resultDB = await this.prismaService.dbBackups.create({
        //   data: {
        //     userId: user_id,
        //     filename,
        //   },
        //   select: {
        //     id: true,
        //     filename: true,
        //     createdAt: true,
        //     userId: true,
        //   },
        // });
      } else {
        console.log("Error in Generate Backup");
        status = 500;
      }

      return { status, result: resultDB };
    } catch (error) {
      console.error(`Error: Backup process`);
      console.log(error);
      return { status: 500 };
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
