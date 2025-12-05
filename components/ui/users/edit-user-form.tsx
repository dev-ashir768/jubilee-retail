"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import * as Icons from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserSchema, EditUserSchemaType } from "@/schemas/usersSchemas";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import { convertToBase64 } from "@/utils/convertToBase64";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  allMenusPayloadType,
  MenuRightsTypes,
  RightsType,
} from "@/types/menus";
import { Checkbox } from "../shadcn/checkbox";
import { toast } from "sonner";
import { axiosFunction } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { UserResponseType, SingleUserPayloadType } from "@/types/usersTypes";
import { useRouter } from "next/navigation";
import useUserIdStore from "@/hooks/useAddUserIdStore";
import { fetchImageAsBase64 } from "@/utils/fetchImageAsBase64";

const userTypeOptions: {
  value: "api_user" | "dashboard_user";
  label: string;
}[] = [
  { value: "api_user", label: "Api User" },
  { value: "dashboard_user", label: "Dashboard User" },
];

const statusOptions: { value: string; label: string }[] = [
  { value: "false", label: "In active" },
  { value: "true", label: "Active" },
];

interface EditUserFormProps {
  allMenus: allMenusPayloadType[] | undefined;
  singleUser: SingleUserPayloadType | undefined;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  allMenus,
  singleUser,
}) => {
  // Constants
  const LISTING_ROUTE = "/users/user-list";

  const [toggleEye, setToggleEye] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [menuRights, setMenuRights] = useState<MenuRightsTypes[]>([]);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userId } = useUserIdStore();
  const [isAccordionReady, setIsAccordionReady] = useState(false);

  useEffect(() => {
    if (singleUser && allMenus) {
      if (singleUser.image) {
        setUploadedImage("Current Profile Image");
      }
      if (singleUser.rights?.length) {
        const existingRights = singleUser.rights.map((right) => ({
          menu_id: right.menu_id,
          can_view: right.can_view,
          can_create: right.can_create,
          can_edit: right.can_edit,
          can_delete: right.can_delete,
        }));
        setMenuRights(existingRights);
      }
      setIsAccordionReady(true);
    }
  }, [singleUser, allMenus]);

  // 1. Yeh maps add kar do (allMenus ke neeche, useMemo mein)
  const { childToParentMap, parentToChildrenMap } = useMemo(() => {
    const childToParent = new Map<number, number>();
    const parentToChildren = new Map<number, number[]>();

    allMenus?.forEach((menu) => {
      if (menu.childs && menu.childs.length > 0) {
        const childIds = menu.childs.map((c) => c.id);
        parentToChildren.set(menu.menu_id, childIds);
        childIds.forEach((id) => childToParent.set(id, menu.menu_id));
      }
    });

    return {
      childToParentMap: childToParent,
      parentToChildrenMap: parentToChildren,
    };
  }, [allMenus]);

  // form
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset,
  } = useForm<EditUserSchemaType>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      phone: "",
      password: "",
      image: undefined,
      user_type: singleUser ? singleUser.userType! : undefined,
      menu_rights: [],
      redirection_url: null,
      is_active: true,
      user_id: undefined,
    },
  });

  useEffect(() => {
    if (singleUser) {
      reset({
        username: singleUser.username,
        fullname: singleUser.fullname,
        email: singleUser.email,
        phone: singleUser.contact,
        password: "",
        image: undefined,
        user_type: singleUser.userType as "api_user" | "dashboard_user",
        menu_rights: [] as MenuRightsTypes[],
        redirection_url: singleUser.redirection_url,
        is_active: singleUser.isActive,
        is_locked: singleUser.is_locked ?? false,
        user_id: userId ?? undefined,
      });
    }
  }, [singleUser, reset, userId]);

  // Compute redirection options from allMenus (main routes only)
  const redirectionOptions = useMemo(() => {
    if (!allMenus) return [];
    return allMenus
      .filter((menu) => menu.url) // Only main menus with url
      .map((menu) => ({ value: menu.url, label: menu.name }));
  }, [allMenus]);

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (
    e: React.DragEvent,
    onChange: (value: string | undefined) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const base64 = await handleImage(file);
      onChange(base64);
      setUploadedImage(file.name);
    }
  };

  // 2. Purana handleRights delete karo aur yeh naya laga do
  const handleRights = ({
    menu_id,
    right,
    value,
  }: {
    menu_id: number;
    right: RightsType;
    value: boolean;
  }) => {
    setMenuRights((prev) => {
      const updated = [...prev];

      // Helper: get current rights for a menu (default false)
      const getRights = (id: number) => {
        const found = updated.find((r) => r.menu_id === id);
        if (!found) {
          return {
            can_view: false,
            can_create: false,
            can_edit: false,
            can_delete: false,
          };
        }
        return found;
      };

      // Helper: update or add entry (and remove if all false)
      const updateMenu = (id: number, updates: Partial<MenuRightsTypes>) => {
        const index = updated.findIndex((r) => r.menu_id === id);
        const current = getRights(id);
        const newEntry = { ...current, menu_id: id, ...updates };

        const hasAnyRight =
          newEntry.can_view ||
          newEntry.can_create ||
          newEntry.can_edit ||
          newEntry.can_delete;

        if (!hasAnyRight && index !== -1) {
          updated.splice(index, 1);
        } else if (hasAnyRight) {
          if (index !== -1) {
            updated[index] = newEntry as MenuRightsTypes;
          } else {
            updated.push(newEntry as MenuRightsTypes);
          }
        }
      };

      // 1. Update the clicked menu (child or parent)
      updateMenu(menu_id, { [right]: value });

      // 2. Agar child hai → parent ko update karo
      const parentId = childToParentMap.get(menu_id);
      if (parentId) {
        const childIds = parentToChildrenMap.get(parentId) || [];
        const anyChildHasRight = childIds.some((id) => {
          if (id === menu_id) return value;
          return getRights(id)[right];
        });

        updateMenu(parentId, { [right]: anyChildHasRight });
      }

      return updated;
    });
  };

  // handle image (file to base64)
  const handleImage = async (file: File) => {
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        return base64;
      } catch (error) {
        console.error("Error converting to Base64:", error);
        return undefined;
      }
    }
    return undefined;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await handleImage(file);
      onChange(base64);
      setUploadedImage(file.name);
    }
  };

  // edit form mutation
  const editUserMutation = useMutation<
    UserResponseType,
    AxiosError<UserResponseType>,
    EditUserSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: `/users`,
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err.response?.data?.message;
      console.error("Edit User Mutation Error", err);
      toast.error(message);
    },
    onSuccess: (data) => {
      const message = data.message;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
      queryClient.invalidateQueries({ queryKey: ["single-user", userId] });
      router.replace(LISTING_ROUTE);
    },
  });

  const onSubmit = async (data: EditUserSchemaType) => {
    if (menuRights.length === 0) {
      toast.error("Please assign at least one right to proceed.");
      return;
    }

    // Only fetch existing image if uploadedImage is 'Current Profile Image'
    let imageBase64: string | undefined = data.image;
    if (
      !imageBase64 &&
      uploadedImage === "Current Profile Image" &&
      singleUser?.image
    ) {
      imageBase64 = await fetchImageAsBase64(`users/${singleUser.image}`);
    }

    const finalData: EditUserSchemaType = {
      username: data.username,
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      user_type: data.user_type as "api_user" | "dashboard_user",
      menu_rights: menuRights as MenuRightsTypes[],
      redirection_url: data.redirection_url,
      password: data.password || "",
      image: imageBase64,
      is_active: data.is_active,
      is_locked: singleUser?.is_locked ?? false,
      user_id: userId || undefined,
    };
    editUserMutation.mutate(finalData);
  };

  // 3. defaultAccordionValues ko thoda fix karo (existing rights ke basis pe open ho)
  const defaultAccordionValues = useMemo(() => {
    const parentIdsWithRights = new Set<number>();

    menuRights.forEach((right) => {
      const parentId = childToParentMap.get(right.menu_id);
      if (parentId) {
        parentIdsWithRights.add(parentId);
      } else {
        parentIdsWithRights.add(right.menu_id);
      }
    });

    return Array.from(parentIdsWithRights).map(String);
  }, [menuRights, childToParentMap]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="gap-1 text-gray-600">
              Username<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="username"
                placeholder="Enter Username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullname" className="gap-1 text-gray-600">
              Fullname<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="fullname"
                placeholder="Enter Fullname"
                {...register("fullname")}
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm">
                  {errors.fullname.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="gap-1 text-gray-600">
              Email<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="email"
                id="email"
                placeholder="Enter Email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="gap-1 text-gray-600">
              Phone Number<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                type="text"
                id="phone"
                placeholder="Enter Phone Number"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="gap-1 text-gray-600">
              Password{" "}
              <span className="text-sm text-gray-500">
                (Leave empty to keep current password)
              </span>
            </Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={toggleEye ? "text" : "password"}
                  id="password"
                  placeholder="Enter Password"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setToggleEye((prevState) => !prevState)}
                >
                  {toggleEye ? <Icons.Eye /> : <Icons.EyeOff />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_type" className="gap-1 text-gray-600">
              User Type<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                name="user_type"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      value={field.value || ""}
                      onValueChange={(selectedOption) =>
                        field.onChange(selectedOption)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select User Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypeOptions.map((item, idx) => (
                          <SelectItem key={idx} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.user_type && (
                <p className="text-red-500 text-sm">
                  {errors.user_type.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="is_active" className="gap-1 text-gray-600">
              Status<span className="text-red-500 text-md">*</span>
            </Label>
            <div className="space-y-2">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Select
                    value={
                      field.value === true
                        ? "true"
                        : field.value === false
                        ? "false"
                        : ""
                    }
                    onValueChange={(selectedOption) => {
                      field.onChange(selectedOption === "true");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((item, idx) => (
                        <SelectItem key={idx} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.is_active && (
                <p className="text-red-500 text-sm">
                  {errors.is_active.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image" className="text-gray-600">
              Profile Image
            </Label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, field.onChange)}
                >
                  {uploadedImage ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <Icons.Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          {singleUser?.image}
                        </span>
                        {uploadedImage === "Current Profile Image" && (
                          <span className="text-xs text-blue-600">
                            (Existing)
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          field.onChange(undefined);
                          setUploadedImage(null);
                        }}
                      >
                        <Icons.X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Icons.Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">
                        Drag and drop your image here, or
                      </p>
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          browse files
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, field.onChange)}
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              )}
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="redirection_url" className="text-gray-600">
              Redirection URL
            </Label>
            <Controller
              name="redirection_url"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(selectedOption) =>
                    field.onChange(selectedOption || null)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Redirection URL" />
                  </SelectTrigger>
                  <SelectContent>
                    {redirectionOptions.map((item, idx: number) => (
                      <SelectItem key={idx} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.redirection_url && (
              <p className="text-red-500 text-sm">
                {errors.redirection_url.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-xl">Menu Rights</h3>
          </div>
          {isAccordionReady && allMenus && (
            <Accordion
              type="multiple"
              className="w-full space-y-3"
              defaultValue={defaultAccordionValues}
            >
              {allMenus?.map((item) => {
                const Icon = item.icon
                  ? (Icons[
                      item.icon as keyof typeof Icons
                    ] as React.ElementType)
                  : null;
                return (
                  <AccordionItem
                    key={item.menu_id}
                    value={String(item.menu_id)}
                    className="bg-gray-50 rounded-md px-3 border-none"
                  >
                    <AccordionTrigger className="hover:no-underline cursor-pointer items-center py-2 [&[data-state=open]]:border-b rounded-none">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-gray-100 p-1 size-9 flex justify-center items-center">
                          {Icon && <Icon className="size-5" />}
                        </span>
                        {item.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="py-4 flex flex-col gap-2 text-balance">
                      {item.childs && item.childs.length > 0 ? (
                        item.childs.map((child) => (
                          <div className="flex flex-wrap gap-2" key={child.id}>
                            <h6 className="text-base font-semibold">
                              {child.name}
                            </h6>
                            {[
                              "can_view",
                              "can_create",
                              "can_edit",
                              "can_delete",
                            ].map((right) => {
                              return (
                                <div
                                  key={`${right}-${child.id}`}
                                  className="flex items-center gap-3"
                                >
                                  <Checkbox
                                    id={`${right}-${child.id}`}
                                    checked={
                                      menuRights.find(
                                        (r) => r.menu_id === child.id
                                      )?.[right as RightsType] || false
                                    }
                                    onCheckedChange={(val) =>
                                      handleRights({
                                        menu_id: child.id,
                                        right: right as RightsType,
                                        value: !!val,
                                      })
                                    }
                                  />
                                  <Label
                                    htmlFor={`${right}-${child.id}`}
                                    className="capitalize"
                                  >
                                    {right.replace("can_", "").toLowerCase()}
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <h6 className="text-base font-semibold">
                            {item.name}
                          </h6>
                          {[
                            "can_view",
                            "can_create",
                            "can_edit",
                            "can_delete",
                          ].map((right) => {
                            return (
                              <div
                                key={`${right}-${item.menu_id}`}
                                className="flex items-center gap-3"
                              >
                                <Checkbox
                                  id={`${right}-${item.menu_id}`}
                                  checked={
                                    menuRights.find(
                                      (r) => r.menu_id === item.menu_id
                                    )?.[right as RightsType] || false
                                  }
                                  onCheckedChange={(val) =>
                                    handleRights({
                                      menu_id: item.menu_id,
                                      right: right as RightsType,
                                      value: !!val,
                                    })
                                  }
                                />
                                <Label
                                  htmlFor={`${right}-${item.menu_id}`}
                                  className="capitalize"
                                >
                                  {right.replace("can_", "").toLowerCase()}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
        <div className="col-span-2">
          <Button
            type="submit"
            className="min-w-[150px] cursor-pointer"
            size="lg"
            disabled={editUserMutation.isPending}
          >
            {editUserMutation.isPending ? "Submitting" : "Submit"}
            {editUserMutation.isPending && (
              <Icons.Loader2 className="w-4 h-4 ml-2 animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditUserForm;
