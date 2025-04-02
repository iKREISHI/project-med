import { GET } from "@6_shared/api";
import { LabResearch } from "../model/model";

export const getLaboratoryResearch = async (labId: number): Promise<LabResearch> => {
    const response = await GET("/api/v0/laboratory-research/{lab_direction_guid}/", {
        params: {
            path: { id: labId },
        }
    });

    if (!response.data) {
        throw new Error("Уведомление не найдено");
    }
    console.log(response.data);
    return response.data;
};
