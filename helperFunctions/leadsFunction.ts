import { LeadInfoPayloadTypes, LeadInfoResponseTypes } from "@/types/leadInfoTypes";
import {
  LeadMotorInfoPayloadTypes,
  LeadMotorInfoResponseTypes,
} from "@/types/leadMotorInfoTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchLeadsMotorInfoList =
  async (): Promise<LeadMotorInfoResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/lead-motor-infos/all",
      });

      return response;
    } catch (err) {
      console.error("Error fetching leads motor info list:", err);
      return null;
    }
  };

export const fetchLeadInfoList =
  async (): Promise<LeadInfoResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/lead-infos",
      });

      return response;
    } catch (err) {
      console.error("Error fetching lead info list:", err);
      return null;
    }
  };

export const createFilterOptions = (
  data: LeadMotorInfoPayloadTypes[],
  key: keyof LeadMotorInfoPayloadTypes
) => {
  if (!data || data.length === 0) return [];

  const uniqueValues = Array.from(new Set(data.map((item) => item[key])));

  return uniqueValues.map((value) => ({
    label: String(value ?? "N/A"),
    value: String(value ?? "N/A"),
  }));
};


export const createFilterOptionsForLeadInfo = (
  data: LeadInfoPayloadTypes[],
  key: keyof LeadInfoPayloadTypes
) => {
  if (!data || data.length === 0) return [];

  const uniqueValues = Array.from(new Set(data.map((item) => item[key])));

  return uniqueValues.map((value) => ({
    label: String(value ?? "N/A"),
    value: String(value ?? "N/A"),
  }));
};