"use client";

import {
  UserProfileSchema,
  UserProfileSchemaType,
} from "@/schemas/userProfileSchema";
import { axiosFunction } from "@/utils/axiosFunction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { UserResponseType } from "@/types/usersTypes";
import { convertToBase64 } from "@/utils/convertToBase64";
import { getCookie, setCookie } from "cookies-next";
import { userInfoTypes } from "@/types/verifyOtpTypes";
import { useRouter } from "next/navigation";

const UserProfileForm = () => {
  // ======== CONSTANTS & HOOKS ========
  const [toggleEye, setToggleEye] = useState(false);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const route = useRouter();

  const userInfoFromCookie: userInfoTypes = useMemo(() => {
    return JSON.parse(getCookie("userInfo")?.toString() || "{}");
  }, []);

  // ======== REACT HOOK FORM ========
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserProfileSchemaType>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      phone: "",
      password: "",
      image: undefined,
      user_type: undefined,
      is_active: undefined,
      is_locked: undefined,
    },
  });

  // Reset form with user data from cookie
  useEffect(() => {
    if (userInfoFromCookie.id) {
      reset({
        user_id: userInfoFromCookie.id,
        username: userInfoFromCookie.username,
        fullname: userInfoFromCookie.fullname,
        email: userInfoFromCookie.email,
        phone: userInfoFromCookie.contact,
        password: "",
        image: undefined,
        user_type: userInfoFromCookie.userType,
        is_active: userInfoFromCookie.is_active,
        is_locked: userInfoFromCookie.is_locked,
      });
    }
  }, [userInfoFromCookie, reset]);

  // ======== MUTATION HANDLER ========
  const updateProfileMutation = useMutation<
    UserResponseType,
    AxiosError<UserResponseType>,
    UserProfileSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "PUT",
        urlPath: "/users",
        isServer: true,
        data: record,
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message || "Failed to update profile");
    },
    onSuccess: (data) => {
      const message = data?.message;
      toast.success(message || "Profile updated successfully");

      if (data.payload) {
        const updatedUserInfo: userInfoTypes = {
          id: userInfoFromCookie.id,
          username: data.payload[0].username || userInfoFromCookie.username,
          fullname: data.payload[0].fullname || userInfoFromCookie.fullname,
          email: data.payload[0].email || userInfoFromCookie.email,
          contact: userInfoFromCookie.contact,
          isActive: data.payload[0].is_active ?? userInfoFromCookie.isActive,
          image: data.payload[0].image || userInfoFromCookie.image,
          redirection_url:
            data.payload[0].redirection_url ??
            userInfoFromCookie.redirection_url,
          userType: data.payload[0].user_type ?? userInfoFromCookie.userType,
          is_active: data.payload[0].is_active ?? userInfoFromCookie.is_active,
          is_locked: data.payload[0].is_locked ?? userInfoFromCookie.is_locked,
        };
        setCookie("userInfo", JSON.stringify(updatedUserInfo));
      }

      route.push("/");
    },
  });

  // ======== SUBMIT HANDLER ========
  const onSubmit = async (data: Omit<UserProfileSchemaType, "image">) => {
    let imageBase64: string | undefined;
    if (imageFile) {
      imageBase64 = await convertToBase64(imageFile);
    }

    const finalData = {
      ...data,
      ...(imageBase64 && { image: imageBase64 }),
    };

    updateProfileMutation.mutate(
      finalData as UserProfileSchemaType & { image?: string }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="gap-1 text-gray-600">
            Username<span className="text-red-500 text-md">*</span>
          </Label>
          <div className="space-y-2">
            <Input
              type="text"
              id="username"
              {...register("username")}
              placeholder="Enter Username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
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
              {...register("fullname")}
              placeholder="Enter Fullname"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname.message}</p>
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
              {...register("email")}
              placeholder="Enter Email"
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
              {...register("phone")}
              placeholder="Enter Phone Number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="gap-1 text-gray-600">
            Password<span className="text-red-500 text-md">*</span>
          </Label>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={toggleEye ? "text" : "password"}
                id="password"
                {...register("password")}
                placeholder="Enter New Password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                onClick={() => setToggleEye((prevState) => !prevState)}
              >
                {toggleEye ? <Eye /> : <EyeOff />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="image" className="text-gray-600">
            Profile Image
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageFile(file || undefined);
            }}
          />
        </div>
        <div>
          <Button
            type="submit"
            className="min-w-[150px] cursor-pointer"
            size="lg"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default UserProfileForm;
