import { ProductsPayloadTypes } from "@/types/productsTypes";
import { ApiUsersPayloadType } from "@/types/usersTypes";
import React from "react";
import { Label } from "../shadcn/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ApiUserProductsSchema,
  ApiUserProductsSchemaType,
} from "@/schemas/apiUserProductsSchema";
import {
  ApiUserProductsResponseType,
} from "@/types/apiUserProductsTypes";
import { AxiosError } from "axios";
import { axiosFunction } from "@/utils/axiosFunction";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Select from "react-select";
import { Button } from "../shadcn/button";
import { multiSelectStyle, singleSelectStyle } from "@/utils/selectStyles";

interface EditApiAserProductsFormProps {
  apiUserList: ApiUsersPayloadType[];
  productList: ProductsPayloadTypes[];
}

const EditApiAserProductsForm: React.FC<EditApiAserProductsFormProps> = ({
  apiUserList,
  productList,
}) => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/users/api-user-products";
  const queryClient = useQueryClient();
  const router = useRouter();

  // ======== SELECT OPTIONS ========
  const apiUserOptions: { value: number; label: string }[] = apiUserList.map(
    (opt) => ({ label: opt.name, value: opt.id })
  );

  const productIdOptions: { value: number; label: string }[] = productList.map(
    (opt) => ({ label: opt.product_name, value: opt.id })
  );

  // ======== REACT HOOK FORM ========
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ApiUserProductsSchema),
    defaultValues: {
      api_user_id: undefined,
      product_id: [],
    },
  });

  // ======== MUTATION HANDLER ========
  const editApiUserProductsMutation = useMutation<
    ApiUserProductsResponseType,
    AxiosError<ApiUserProductsResponseType>,
    ApiUserProductsSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/api-user-products",
        isServer: true,
        data: record,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log("Edit api user products mutation error", err);
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["api-user-products-list"] });
      router.push(LISTING_ROUTE);
    },
  });

  // ======== SUBMIT HANDLER ========
  const onSubmit = (data: ApiUserProductsSchemaType) => {
    editApiUserProductsMutation.mutate(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="gap-1 text-gray-600">
              Api User<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                control={control}
                name="api_user_id"
                render={({ field }) => (
                  <Select
                    options={apiUserOptions}
                    value={apiUserOptions.find(
                      (item) => item.value === field.value
                    )}
                    onChange={(selectedValue) =>
                      field.onChange(
                        selectedValue ? selectedValue.value : undefined
                      )
                    }
                    styles={singleSelectStyle}
                    placeholder="Api User"
                  />
                )}
              />
              {errors.api_user_id && (
                <p className="text-red-500 text-sm">
                  {errors.api_user_id.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="gap-1 text-gray-600">
              Products<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                control={control}
                name="product_id"
                render={({ field }) => (
                  <Select
                    options={productIdOptions}
                    value={productIdOptions.filter((opt) =>
                      field.value.includes(opt.value)
                    )}
                    onChange={(selectedOpt) =>
                      field.onChange(
                        selectedOpt ? selectedOpt.map((opt) => opt.value) : []
                      )
                    }
                    styles={multiSelectStyle}
                    placeholder="Products"
                    isMulti
                  />
                )}
              />
              {errors.api_user_id && (
                <p className="text-red-500 text-sm">
                  {errors.api_user_id.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="min-w-[150px] cursor-pointer"
              size="lg"
              disabled={editApiUserProductsMutation.isPending}
            >
              {editApiUserProductsMutation.isPending ? "Submitting" : "Submit"}
              {editApiUserProductsMutation.isPending && (
                <span className="animate-spin">
                  <Loader2 />
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditApiAserProductsForm;
