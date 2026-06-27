import { Injectable } from "@nestjs/common";
import { MyCityModel } from "@prisma/client";
import { MyCityService } from "../../my-city/app/my-city.service";

@Injectable()
export class BookmarkMyCityFactory {
  constructor(private readonly myCityService: MyCityService) {}

  public async findOneLocationById(
    location_id: string
  ): Promise<MyCityModel | Error> {
    return await this.myCityService.findOne(location_id);
  }
}
