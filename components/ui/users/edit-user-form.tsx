"use client";

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import SubNav from '../foundations/sub-nav'
import { Label } from '../shadcn/label'
import { Input } from '../shadcn/input'
import { Button } from '../shadcn/button'
import { Eye, EyeOff } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod';
import { EditUserSchema, EditUserSchemaType } from '@/schemas/usersSchemas';
import { useForm, Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shadcn/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion"
import { convertToBase64 } from '@/utils/convertToBase64';
import { getCookie } from 'cookies-next';
import { userInfoTypes } from '@/types/verifyOtpTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { allMenusResponse, MenuRightsTypes, RightsType } from '@/types/menus';
import { fetchAllMenus } from '@/helperFunctions/allMenusFunction';
import Loader from '../foundations/loader';
import * as Icons from 'lucide-react';
import { Checkbox } from '../shadcn/checkbox';
import { toast } from 'sonner';
import { axiosFunction } from '@/utils/axiosFunction';
import { AxiosError } from 'axios';
import { AddUserResponseType, SingleUserResponseType } from '@/types/usersTypes';
import { usePathname, useRouter } from 'next/navigation';
import Empty from '../foundations/empty';
import { getRights } from '@/utils/getRights';
import { fetchSingleUser } from '@/helperFunctions/userFunction';
import useUserIdStore from '@/hooks/useAddUserIdStore';


const userTypeOptions: { value: string, label: string }[] = [
  { value: "api_user", label: "Api User" },
  { value: "dashboard_user", label: "Dashboard User" },
];

const statusOptions: { value: string, label: string }[] = [
  { value: "false", label: "In active" },
  { value: "true", label: "Active" },
];

const EditUserForm = () => {

  const [toggleEye, setToggleEye] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [menuRights, setMenuRights] = useState<MenuRightsTypes[]>([]);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useUserIdStore()

  // rights
  const rights = useMemo(() => {
    return getRights(pathname)
  }, [pathname])

  if (rights?.can_edit === "0") {
    router.back();
  }

  // fetch all menus and single user
  const { data: allMenusResponse, isLoading: allMenusLoading } = useQuery<allMenusResponse | null>({
    queryKey: ["all-menus"],
    queryFn: fetchAllMenus
  })

  const { data: singleUserResponse, isLoading: singleUserLoading, isSuccess } = useQuery<SingleUserResponseType | null>({
    queryKey: ["single-user", userId],
    queryFn: () => fetchSingleUser(userId),
    enabled: !!userId,
  });

  // user info from cookie
  const userInfo: userInfoTypes = useMemo(() => {
    const userInfoFromCookie = getCookie('userInfo')
    return userInfoFromCookie ? JSON.parse(userInfoFromCookie?.toString()) : null
  }, [])

  // form
  const { handleSubmit, register, formState: { errors }, control, reset } = useForm({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      username: '',
      fullname: '',
      email: '',
      phone: '',
      password: '',
      image: undefined,
      userType: undefined,
      isActive: undefined,
      updated_by: undefined,
      menu_rights: [],
    }
  })

  const memoizeSingleUserData = useMemo(() => {
    if (singleUserResponse) {
      return singleUserResponse?.payload[0]
    }

  }, [singleUserResponse])

  useEffect(() => {
    if (isSuccess && memoizeSingleUserData) {
      reset({
        username: memoizeSingleUserData.username,
        fullname: memoizeSingleUserData.fullname,
        email: memoizeSingleUserData.email,
        phone: memoizeSingleUserData.contact,
        password: '',
        image: memoizeSingleUserData.image || undefined,
        userType: memoizeSingleUserData.userType as 'dashboard_user' | 'api_user',
        isActive: memoizeSingleUserData.isActive,
        updated_by: userInfo?.id,
        menu_rights: [],
      });

      if (memoizeSingleUserData.image) {
        setUploadedImage('Current Profile Image');
      }

      if (memoizeSingleUserData.rights?.length > 0) {
        const existingRights = memoizeSingleUserData.rights.map(right => ({
          menu_id: right.menu_id,
          can_view: right.can_view,
          can_create: right.can_create,
          can_edit: right.can_edit,
          can_delete: right.can_delete
        }));
        setMenuRights(existingRights);
      }
    }
  }, [memoizeSingleUserData, reset, userInfo, isSuccess]);
  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  const handleDrop = async (e: React.DragEvent, onChange: (value: any) => void) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const base64 = await handleImage(file);
      onChange(base64);
      setUploadedImage(file.name);
    }
  }

  const handleRights = ({ menu_id, right, value }: { menu_id: number, right: RightsType, value: boolean }) => {
    setMenuRights((prevState) => {
      const existingIndex = prevState.findIndex((entry) => entry.menu_id === menu_id);

      if (existingIndex !== -1) {
        const updatedRights = [...prevState];
        updatedRights[existingIndex] = {
          ...updatedRights[existingIndex],
          [right]: value,
        };
        return updatedRights;
      } else {
        return [
          ...prevState,
          {
            menu_id,
            can_view: false,
            can_create: false,
            can_edit: false,
            can_delete: false,
            [right]: value,
          },
        ];
      }
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await handleImage(file);
      onChange(base64);
      setUploadedImage(file.name);
    }
  };

  // edit form mutation
  const editUserMutation = useMutation<
    AddUserResponseType,
    AxiosError<AddUserResponseType>,
    EditUserSchemaType & { user_id: number }
  >({
    mutationFn: (record) => {
      const { user_id, ...data } = record;
      return axiosFunction({
        method: "PUT",
        urlPath: `/users/${user_id}`,
        data: data,
        isServer: true,
      })
    },
    onError: (err) => {
      const message = err.response?.data?.message
      console.error("Edit User Mutation Error", err)
      toast.error(message)
    },
    onSuccess: (data) => {
      const message = data.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['users-list'] })
      queryClient.invalidateQueries({ queryKey: ['single-user', userId] })
      router.back();
    }
  })

  const onSubmit = (data: EditUserSchemaType) => {
    if (menuRights.length === 0) {
      toast.error('Please assign at least one right to proceed.');
      return;
    }

    if (!userId) {
      toast.error('User ID is missing.');
      return;
    }

    const finalData = {
      user_id: userId,
      username: data.username,
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      userType: data.userType,
      isActive: data.isActive,
      updated_by: data.updated_by,
      menu_rights: menuRights,
      ...(data.password && { password: data.password }),
      ...(data.image && { image: data.image }),
    }
    // editUserMutation.mutate(finalData)
    console.log("final data", finalData)
  }

  if (!userId) {
    setTimeout(() => {
      router.push('/users/user-list')
    }, 1500);

    return <Empty title="Not Found" description="User ID is missing. Redirecting to user list..." />
  }

  // loading state while fetching user list data
  if (allMenusLoading || singleUserLoading) {
    return <Loader />
  }

  console.log(menuRights.length > 0 ? menuRights.map((right) => String(right.menu_id)) : [])
  return (
    <>
      <SubNav
        title='Edit User'
      />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' onClick={() => { router.back() }}>
                <Icons.ArrowLeft className='size-6' />
              </Button>
              Edit existing user to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='username' className='gap-1 text-gray-600'>
                    Username<span className='text-red-500 text-md'>*</span>
                  </Label>
                  <div className='space-y-2'>
                    <Input
                      type='text'
                      id='username'
                      placeholder='Enter Username'
                      {...register('username')}
                    />
                    {errors.username && (
                      <p className='text-red-500 text-sm'>
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='fullname' className='gap-1 text-gray-600'>
                    Fullname<span className='text-red-500 text-md'>*</span>
                  </Label>
                  <div className='space-y-2'>
                    <Input
                      type='text'
                      id='fullname'
                      placeholder='Enter Fullname'
                      {...register('fullname')}
                    />
                    {errors.fullname && (
                      <p className='text-red-500 text-sm'>
                        {errors.fullname.message}
                      </p>
                    )}
                  </div>

                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email' className='gap-1 text-gray-600'>
                    Email<span className='text-red-500 text-md'>*</span>
                  </Label>
                  <div className='space-y-2'>
                    <Input
                      type='email'
                      id='email'
                      placeholder='Enter Email'
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className='text-red-500 text-sm'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone' className='gap-1 text-gray-600'>
                    Phone Number<span className='text-red-500 text-md'>*</span>
                  </Label>
                  <div className='space-y-2'>
                    <Input
                      type='text'
                      id='phone'
                      placeholder='Enter Phone Number'
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className='text-red-500 text-sm'>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='password' className='gap-1 text-gray-600'>
                    Password <span className='text-sm text-gray-500'>(Leave empty to keep current password)</span>
                  </Label>
                  <div className='space-y-2'>
                    <div className='relative'>
                      <Input
                        type={toggleEye ? 'text' : 'password'}
                        id='password'
                        placeholder='Enter Password'
                        {...register('password')}
                      />
                      <Button
                        type='button'
                        variant="ghost" size="sm" className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer' onClick={() => setToggleEye((prevState) => !prevState)}>
                        {toggleEye ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className='text-red-500 text-sm'>
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='userType' className='gap-1 text-gray-600'>
                    User Type<span className='text-red-500 text-md'>*</span>
                  </Label>
                  <div className='space-y-2'>
                    <Controller
                      name='userType'
                      defaultValue={memoizeSingleUserData?.userType as 'dashboard_user' | 'api_user'}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Select
                            value={field.value || ''}
                            onValueChange={(selectedOption) => field.onChange(selectedOption)}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder="Select User Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {userTypeOptions.map((item, idx) => (
                                <SelectItem key={idx} value={item.value}>{item.label}</SelectItem>
                              ))
                              }
                            </SelectContent>
                          </Select>
                        )
                      }}
                    />
                    {errors.userType && (
                      <p className='text-red-500 text-sm'>
                        {errors.userType.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='userType' className='gap-1 text-gray-600'>
                    Status<span className='text-red-500 text-md'>*</span>
                  </Label>
                  <div className='space-y-2'>
                    <Controller
                      name='isActive'
                      defaultValue={memoizeSingleUserData?.isActive as boolean}
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value === true ? "true" : field.value === false ? "false" : ""}
                          onValueChange={(selectedOption) => {
                            field.onChange(selectedOption === "true");
                          }}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((item, idx) => (
                              <SelectItem key={idx} value={item.value}>{item.label}</SelectItem>
                            ))
                            }
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.isActive && (
                      <p className='text-red-500 text-sm'>
                        {errors.isActive.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='image' className='text-gray-600'>
                    Profile Image
                  </Label>
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
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
                              <span className="text-sm text-green-700">{uploadedImage}</span>
                              {uploadedImage === 'Current Profile Image' && (
                                <span className="text-xs text-blue-600">(Existing)</span>
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
                            <p className="text-gray-600 mb-2">Drag and drop your image here, or</p>
                            <label className="cursor-pointer">
                              <span className="text-blue-600 hover:text-blue-700 font-medium">browse files</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, field.onChange)}
                              />
                            </label>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className='space-y-6'>
                <div>
                  <h3 className='font-semibold text-xl'>Menu Rights</h3>
                </div>
                {
                  (allMenusResponse?.payload?.length ?? 0) > 0 ? (
                    <Accordion
                      type="multiple"
                      className="w-full space-y-3"
                      defaultValue={menuRights.length > 0 ? menuRights.map((right) => String(right.menu_id)) : []}
                    >
                      {allMenusResponse?.payload.map((item) => {
                        const Icon = item.icon ? (Icons[item.icon as keyof typeof Icons] as React.ElementType) : null;
                        return (
                          <AccordionItem key={item.menu_id} value={String(item.menu_id)} className='bg-gray-50 rounded-md px-3 border-none'>
                            <AccordionTrigger className='hover:no-underline cursor-pointer items-center py-2 [&[data-state=open]]:border-b rounded-none'>
                              <div className='flex items-center gap-2'>
                                <span className='rounded-full bg-gray-100 p-1 size-9 flex justify-center items-center'>
                                  {Icon && <Icon className="size-5" />}
                                </span>
                                {item.name}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="py-4 flex flex-col gap-2 text-balance">
                              {item.childs?.map((child) => {
                                return (
                                  <div className='flex flex-wrap gap-2' key={child.id}>
                                    <h6 className='text-base font-semibold'>
                                      {child.name}
                                    </h6>
                                    {
                                      ['can_view', 'can_create', 'can_edit', 'can_delete'].map((right) => {
                                        return (
                                          <div key={`${right}-${child.id}`} className="flex items-center gap-3">
                                            <Checkbox
                                              id={`${right}-${child.id}`}
                                              checked={menuRights.find(r => r.menu_id === child.id)?.[right as RightsType] || false}
                                              onCheckedChange={(val) => (handleRights({ menu_id: child.id, right: right as RightsType, value: !!val }))}
                                            />
                                            <Label htmlFor={`${right}-${child.id}`} className='capitalize'>{right.replace('can_', '').toLowerCase()}</Label>
                                          </div>
                                        )
                                      })
                                    }
                                  </div>
                                )
                              })}
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  ) : (
                    <div>No Menu Rights Available!</div>
                  )
                }
              </div>
              <div>
                <Button
                  type='submit'
                  className='min-w-[150px] cursor-pointer'
                  size='lg'
                  disabled={editUserMutation.isPending}
                >
                  {editUserMutation.isPending ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditUserForm