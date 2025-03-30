import { ReceptionTemplate } from "@5_entities/reseptionTemplate/model/model.ts";
import { POST } from "@6_shared/api";

export const addTemplate = async (
  template:  ReceptionTemplate,
):Promise<void> => {
  await POST('/api/v0/reception-templates/', {
    body:template,
  });
}