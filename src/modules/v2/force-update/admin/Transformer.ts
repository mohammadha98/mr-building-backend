import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";

@Injectable()
export default class ForceUpdateTransformer implements ITransformer<any> {
  public transform(item: any) {
    if (!item) {
      return {
        id: -1,
        installed_version_type: "",
        version: "",
        required: false,
        file_name: "",
        indirect_link: "",
        file_url: "",
        status: "",
        content: "",
        items: [],
        created_at: "",
      };
    }

    return {
      id: item.id,
      installed_version_type: item.installed_version_type,
      version: item.version,
      required: item.required,
      total_installs: item.total_installs,
      file_name: item.file_name,
      indirect_link: item.indirect_link,
      file_url: item.file_name
        ? process.env.APP_CONTENT_PATH + "/force_updates/" + item.file_name
        : null,
      status: item.status,
      content: item.content,
      items: item.items[0].split(","),
      created_at: item.created_at,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }
}
