import { Injectable } from "@nestjs/common";
import * as jmoment from "jalali-moment";
import { DbBackups } from "@prisma/client";

jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class BackupTransformer {
  public transform(item: Partial<DbBackups> | any) {
    return {
      id: item.id,
      link: item.filename
        ? `${process.env.APP_CONTENT_PATH}/backups/${item.filename}`
        : "",
      created_at: this.calculCreatedAt(item.createdAt),
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  private calculCreatedAt(created_at: string) {
    const currentYear = Number(
      jmoment(new Date(Date.now())).locale("fa").format("YYYY")
    );

    const day = Number(jmoment(created_at).locale("fa").format("DD"));
    const month = jmoment(created_at).locale("fa").format("MMMM");
    const year = Number(jmoment(created_at).locale("fa").format("YYYY"));

    let info = "";
    if (Number(currentYear) === Number(year)) {
      info = month + " " + day.toString();
    } else {
      info = ` ${year} ${month} ${day} `;
    }
    return info;
  }
}
