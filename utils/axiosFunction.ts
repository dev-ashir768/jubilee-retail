import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { toast } from "sonner";

type axiosParams = {
  method: Method;
  urlPath: string;
  data: any;
  token?: string;
  isServer: boolean;
};

export type axiosReturnType = {
  status: string;
  message: string;
  payload: any;
};

export const axiosFunction = async ({
  method = "GET",
  urlPath = "",
  data = {},
  token = undefined,
  isServer = false,
}: axiosParams) => {
  const url = process.env.NEXT_PUBLIC_SERVER_URL + urlPath;
  const cookieToken = getCookie("jubilee-token")?.toString() || null;
  const authToken = cookieToken || token;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : "",
    },
    data,
  };

  try {
    const result: any = await axios(config);
    return result.data;
  } catch (err: AxiosError | any) {
    if (err.status === 401) {
      toast.error("Your session has expired. Please login again.");
      deleteCookie("jubilee-token");
      window.location.href = "/login";
    }

    if (isServer === false) {
      return {
        message: err.message,
        payload: [],
        status: "500",
      };
    }
  }
};
