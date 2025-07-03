"use client";

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { Input } from '../shadcn/input'
import { Label } from '../shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shadcn/select'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usersSchema, usersSchemaType } from '@/schemas/usersSchemas'
import { z } from 'zod'
import SubNav from '../foundations/sub-nav'
import { Plus, Trash2, Save } from 'lucide-react'
import { Checkbox } from '../shadcn/checkbox'
import { useSearchParams } from 'next/navigation'

const EditUsersForm = () => {
  const searchParams = useSearchParams();
  const userIds = searchParams.get('ids')?.split(',') || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<{ users: (usersSchemaType & { id: number })[] }>({
    resolver: zodResolver(usersSchema.extend({ id: z.number() }).array().min(1, "At least one user is required").transform(users => ({ users }))),
    defaultValues: {
      users: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "users"
  });

  // Mock function to fetch users data - replace with actual API call
  const fetchUsersData = async (ids: string[]) => {
    // This would be replaced with actual API call
    return ids.map((id, index) => ({
      id: parseInt(id),
      username: `user${index + 1}`,
      fullname: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      phone: `0312345678${index}`,
      password: '',
      image: '',
      user_type: 'dashboard_user' as const,
      is_active: true,
      created_by: 1,
      menu_rights: [
        { menu_id: 1, can_view: true, can_create: false, can_edit: false, can_delete: false },
        { menu_id: 2, can_view: false, can_create: false, can_edit: false, can_delete: false },
        { menu_id: 3, can_view: false, can_create: false, can_edit: false, can_delete: false }
      ]
    }));
  };

  useEffect(() => {
    if (userIds.length > 0) {
      fetchUsersData(userIds).then((users) => {
        reset({ users });
      });
    }
  }, [userIds, reset]);

  const onSubmit = async (data: { users: (UsersSchemaType & { id: number })[] }) => {
    try {
      console.log('Form data:', data);
      // Here you would typically make an API call to update multiple users
      // await updateUsers(data.users);
      alert(`${data.users.length} user(s) updated successfully!`);
    } catch (error) {
      console.error('Error updating users:', error);
      alert('Failed to update users');
    }
  };

  const addUser = () => {
    append({
      id: 0, // New user will have id 0
      username: '',
      fullname: '',
      email: '',
      phone: '',
      password: '',
      image: '',
      user_type: 'dashboard_user',
      is_active: true,
      created_by: 1,
      menu_rights: []
    });
  };

  // Mock menu rights data - replace with actual API call
  const mockMenuRights = [
    { id: 1, title: "Users Management" },
    { id: 2, title: "Branch Management" },
    { id: 3, title: "Task Management" },
  ];

  const subNavData = [
    {
      title: "User List",
      href: "/users/user-list",
      description: "View all users",
      isActive: false,
    },
    {
      title: "Edit Users",
      href: "/users/edit-users",
      description: "Edit multiple users",
      isActive: true,
    },
  ];

  return (
    <>
      <SubNav items={subNavData} />
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Edit Multiple Users</CardTitle>
            <Button type="button" onClick={addUser} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {fields.map((field, index) => (
                <Card key={field.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      {watch(`users.${index}.id`) ? `Edit User ${watch(`users.${index}.id`)}` : `New User ${index + 1}`}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Save individual user
                          const userData = watch(`users.${index}`);
                          console.log('Saving user:', userData);
                          alert('User saved successfully!');
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input type="hidden" {...register(`users.${index}.id`)} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`users.${index}.username`}>Username</Label>
                        <Input
                          {...register(`users.${index}.username`)}
                          placeholder="Enter username"
                        />
                        {errors.users?.[index]?.username && (
                          <p className="text-sm text-red-600">{errors.users[index]?.username?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`users.${index}.fullname`}>Full Name</Label>
                        <Input
                          {...register(`users.${index}.fullname`)}
                          placeholder="Enter full name"
                        />
                        {errors.users?.[index]?.fullname && (
                          <p className="text-sm text-red-600">{errors.users[index]?.fullname?.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`users.${index}.email`}>Email</Label>
                        <Input
                          {...register(`users.${index}.email`)}
                          type="email"
                          placeholder="Enter email"
                        />
                        {errors.users?.[index]?.email && (
                          <p className="text-sm text-red-600">{errors.users[index]?.email?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`users.${index}.phone`}>Phone</Label>
                        <Input
                          {...register(`users.${index}.phone`)}
                          placeholder="03XXXXXXXXX"
                        />
                        {errors.users?.[index]?.phone && (
                          <p className="text-sm text-red-600">{errors.users[index]?.phone?.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`users.${index}.password`}>Password (Leave empty to keep current)</Label>
                        <Input
                          {...register(`users.${index}.password`)}
                          type="password"
                          placeholder="Enter new password"
                        />
                        {errors.users?.[index]?.password && (
                          <p className="text-sm text-red-600">{errors.users[index]?.password?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`users.${index}.user_type`}>User Type</Label>
                        <Select 
                          value={watch(`users.${index}.user_type`)} 
                          onValueChange={(value) => setValue(`users.${index}.user_type`, value as 'dashboard_user' | 'api_user')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dashboard_user">Dashboard User</SelectItem>
                            <SelectItem value="api_user">API User</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.users?.[index]?.user_type && (
                          <p className="text-sm text-red-600">{errors.users[index]?.user_type?.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`users.${index}.is_active`}
                          checked={watch(`users.${index}.is_active`)}
                          onCheckedChange={(checked) => setValue(`users.${index}.is_active`, checked as boolean)}
                        />
                        <Label htmlFor={`users.${index}.is_active`}>Active User</Label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Menu Rights</Label>
                      <div className="space-y-3">
                        {mockMenuRights.map((menu, menuIndex) => {
                          const currentRights = watch(`users.${index}.menu_rights`) || [];
                          const menuRight = currentRights.find(r => r.menu_id === menu.id);
                          
                          return (
                            <Card key={menu.id} className="p-4">
                              <div className="space-y-3">
                                <h4 className="font-medium">{menu.title}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`users.${index}.menu_rights.${menuIndex}.can_view`}
                                      checked={menuRight?.can_view || false}
                                      onCheckedChange={(checked) => {
                                        const updatedRights = [...currentRights];
                                        const existingIndex = updatedRights.findIndex(r => r.menu_id === menu.id);
                                        if (existingIndex >= 0) {
                                          updatedRights[existingIndex].can_view = checked as boolean;
                                        } else {
                                          updatedRights.push({ menu_id: menu.id, can_view: checked as boolean, can_create: false, can_edit: false, can_delete: false });
                                        }
                                        setValue(`users.${index}.menu_rights`, updatedRights);
                                      }}
                                    />
                                    <Label htmlFor={`users.${index}.menu_rights.${menuIndex}.can_view`}>View</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`users.${index}.menu_rights.${menuIndex}.can_create`}
                                      checked={menuRight?.can_create || false}
                                      onCheckedChange={(checked) => {
                                        const updatedRights = [...currentRights];
                                        const existingIndex = updatedRights.findIndex(r => r.menu_id === menu.id);
                                        if (existingIndex >= 0) {
                                          updatedRights[existingIndex].can_create = checked as boolean;
                                        } else {
                                          updatedRights.push({ menu_id: menu.id, can_view: false, can_create: checked as boolean, can_edit: false, can_delete: false });
                                        }
                                        setValue(`users.${index}.menu_rights`, updatedRights);
                                      }}
                                    />
                                    <Label htmlFor={`users.${index}.menu_rights.${menuIndex}.can_create`}>Create</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`users.${index}.menu_rights.${menuIndex}.can_edit`}
                                      checked={menuRight?.can_edit || false}
                                      onCheckedChange={(checked) => {
                                        const updatedRights = [...currentRights];
                                        const existingIndex = updatedRights.findIndex(r => r.menu_id === menu.id);
                                        if (existingIndex >= 0) {
                                          updatedRights[existingIndex].can_edit = checked as boolean;
                                        } else {
                                          updatedRights.push({ menu_id: menu.id, can_view: false, can_create: false, can_edit: checked as boolean, can_delete: false });
                                        }
                                        setValue(`users.${index}.menu_rights`, updatedRights);
                                      }}
                                    />
                                    <Label htmlFor={`users.${index}.menu_rights.${menuIndex}.can_edit`}>Edit</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`users.${index}.menu_rights.${menuIndex}.can_delete`}
                                      checked={menuRight?.can_delete || false}
                                      onCheckedChange={(checked) => {
                                        const updatedRights = [...currentRights];
                                        const existingIndex = updatedRights.findIndex(r => r.menu_id === menu.id);
                                        if (existingIndex >= 0) {
                                          updatedRights[existingIndex].can_delete = checked as boolean;
                                        } else {
                                          updatedRights.push({ menu_id: menu.id, can_view: false, can_create: false, can_edit: false, can_delete: checked as boolean });
                                        }
                                        setValue(`users.${index}.menu_rights`, updatedRights);
                                      }}
                                    />
                                    <Label htmlFor={`users.${index}.menu_rights.${menuIndex}.can_delete`}>Delete</Label>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : `Update ${fields.length} User(s)`}
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EditUsersForm;