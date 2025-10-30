import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { Button } from "../shadcn/button";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import {
  UpdatePasswordSchema,
  UpdatePasswordSchemaType,
} from "@/schemas/updatePasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { axiosFunction } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { UploadPasswordResponseTypes } from "@/types/updatePasswordTypes";
import { toast } from "sonner";

interface UpdatePasswordDialogProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isFilterOpen: boolean) => void;
}

const UpdatePasswordDialog: React.FC<UpdatePasswordDialogProps> = ({
  isFilterOpen,
  setIsFilterOpen,
}) => {
  // ======== HOOK FORM ========
  const {
    formState: { errors },
    handleSubmit,
    reset,
    register,
  } = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  // ======== MUTATION ========
  const updatePasswordMutation = useMutation<
    UploadPasswordResponseTypes,
    AxiosError<UploadPasswordResponseTypes>,
    UpdatePasswordSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/users/password",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Update password mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      setIsFilterOpen(false)
      reset();
      toast.success(message);
    },
  });

  // ======== HANDLER ========
  const handleOnSubmit = (data: UpdatePasswordSchemaType) => {
    console.log(data);
    updatePasswordMutation.mutate(data);
  };
  return (
    <>
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-[460px] gap-6">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
            <DialogDescription>Update your password.</DialogDescription>
          </DialogHeader>
          <form id="update-password" onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="grid grid-cols-1 gap-6">
              {/* Old Password */}
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  id="oldPassword"
                  type="text"
                  {...register("oldPassword")}
                  className="w-full"
                  placeholder="Enter Old Password"
                />
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="text"
                  {...register("newPassword")}
                  className="w-full"
                  placeholder="Enter New Password"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
            </div>
          </form>
          <DialogFooter className="sm:justify-center gap-4">
            <Button
              size="lg"
              type="submit"
              className="min-w-[150px] cursor-pointer"
              form="update-password"
            >
              {updatePasswordMutation?.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdatePasswordDialog;
