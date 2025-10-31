import axios, { AxiosRequestConfig, Method , ResponseType} from "axios";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { handleLogout } from "./handleLogout";

type axiosParams = {
  method: Method;
  urlPath: string;
  data?: any;
  token?: string;
  isServer?: boolean;
  responseType?: ResponseType;
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
  responseType = 'json'
}: axiosParams) => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + urlPath;
  const cookieToken = getCookie("jubilee-retail-token")?.toString() || null;
  const authToken = cookieToken || token;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : "",
    },
    data,
    responseType
  };

  try {
    const result: any = await axios(config);
    return result.data;
  } catch (err: any) {
    if (err.status === 401) {
      toast.error("Your session has expired. Please login again.");
      // handleLogout();
      // window.location.href = `/login`;
    }

    if (err.status === 404) {
      toast.error("API endpoint not found. Please try again.");
    }

    if (isServer === false) {
      return {
        message: err.message,
        payload: [],
        status: "500",
      };
    }

    throw err;
  }
};
