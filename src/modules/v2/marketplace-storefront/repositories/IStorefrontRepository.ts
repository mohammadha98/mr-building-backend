import IPagination from "src/commons/contracts/IPagination";
import IRepository from "src/commons/contracts/IRepository";
import { StorefrontBookmark } from "@prisma/client";

export default interface IStorefrontRepository extends IRepository<any> {
  findByStatus(status: string): Promise<any[] | []>;

  findNewItems(
    params: any,
    include: any,
    pagination?: IPagination
  ): Promise<any[] | []>;

  createFile(body: any): Promise<any>;

  getFileInfo(query: any): Promise<any>;

  deleteTempFile(id: number): Promise<any>;

  removeItems(id: string): Promise<any>;

  createItem(params: any): Promise<any>;

  updateMedia(params: any, data: any): Promise<any>;

  findMedia(id: number): Promise<any>;

  changeStatus(where: any, data: any): Promise<any>;

  bookmarkStorefront(storefrontId: string, clientId: number): Promise<any>;

  deleteBookmarked(bookmarkId: string): Promise<any>;

  getBookmarkList(clientId: number): Promise<StorefrontBookmark[]>;

  getStorefrontIsBookmarked(
    clientId: number,
    storefrontId: string
  ): Promise<StorefrontBookmark>;
}
