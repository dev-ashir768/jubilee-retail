import { DeleteResponseType, StatusResponseType } from "@/types/commonType";
import { axiosFunction } from "@/utils/axiosFunction";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleDeleteMutation = () => {
  return useMutation<
    DeleteResponseType,
    AxiosError<DeleteResponseType>,
    { module: string; record_id: number }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        urlPath: "/common",
        method: "DELETE",
        isServer: true,
        data: {
          module: record.module,
          record_id: +record.record_id,
        },
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Delete record mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
    },
  });
};

export const handleStatusMutation = () => {
  return useMutation<
    StatusResponseType,
    AxiosError<StatusResponseType>,
    { module: string; record_id: number }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        urlPath: "/common",
        method: "PUT",
        isServer: true,
        data: {
          module: record.module,
          record_id: +record.record_id,
        },
      });
    },
    onMutate: ()=>{
      toast.success("Updating status...")
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Status update record mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
    },
  });
};
