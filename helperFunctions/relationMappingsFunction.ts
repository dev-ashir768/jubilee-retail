import { RelationMappingsResponseTypes } from "@/types/relationMappingsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchRelationMappingsList =
  async (): Promise<RelationMappingsResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/relation-mappings",
      });

      return response;
    } catch (err) {
      console.error("Error fetching product types list:", err);
      return null;
    }
  };

export const fetchSingleRelationMappings = async (
  RelationMappingId: number
): Promise<RelationMappingsResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: `/relation-mappings/single`,
      data: { id: RelationMappingId },
    });

    return response;
  } catch (err) {
    console.error("Error fetching product types:", err);
    return null;
  }
};
