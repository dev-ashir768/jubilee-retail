import {
  LeadInfoPayloadTypes,
  LeadInfoResponseTypes,
} from "@/types/leadInfoTypes";
import {
  LeadMotorInfoPayloadTypes,
  LeadMotorInfoResponseTypes,
} from "@/types/leadMotorInfoTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchLeadInfoListProps {
  startDate: string;
  endDate: string;
}

interface fetchLeadsMotorInfoListProps {
  startDate: string;
  endDate: string;
}

export const fetchLeadsMotorInfoList = async ({
  startDate,
  endDate,
}: fetchLeadInfoListProps): Promise<LeadMotorInfoResponseTypes | null> => {
  const payload = { date: `${startDate} to ${endDate}` };
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/lead-motor-infos/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching leads motor info list:", err);
    return null;
  }
};

export const fetchAllLeadsMotorInfoList =
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

export const fetchLeadInfoList = async ({
  startDate,
  endDate,
}: fetchLeadInfoListProps): Promise<LeadInfoResponseTypes | null> => {
  const payload = { date: `${startDate} to ${endDate}` };
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/lead-infos/all",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching lead info list:", err);
    return null;
  }
};

export const fetchAllLeadInfoList =
  async (): Promise<LeadInfoResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/lead-infos/all",
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
