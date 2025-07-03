"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { Input } from '../shadcn/input'
import { Label } from '../shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shadcn/select'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usersSchema, UsersSchemaType } from '@/schemas/usersSchemas'
import SubNav from '../foundations/sub-nav'
import { Plus, Trash2 } from 'lucide-react'
import { Checkbox } from '../shadcn/checkbox'

const AddUsersForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting }
  } = useForm<{ users: UsersSchemaType[] }>({
    resolver: zodResolver(usersSchema.array().min(1, "At least one user is required").transform(users => ({ users }))),
    defaultValues: {
      users: [{
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
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "users"
  });

  const onSubmit = async (data: { users: UsersSchemaType[] }) => {
    try {
      console.log('Form data:', data);
      // Here you would typically make an API call to create multiple users
      // await createUsers(data.users);
      alert(`${data.users.length} user(s) created successfully!`);
    } catch (error) {
      console.error('Error creating users:', error);
      alert('Failed to create users');
    }
  };

  const addUser = () => {
    append({
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
    { id: 1, title: "Users Management", can_view: false, can_create: false, can_edit: false, can_delete: false },
    { id: 2, title: "Branch Management", can_view: false, can_create: false, can_edit: false, can_delete: false },
    { id: 3, title: "Task Management", can_view: false, can_create: false, can_edit: false, can_delete: false },
  ];

  const subNavData = [
    {
      title: "User List",
      href: "/users/user-list",
      description: "View all users",
      isActive: false,
    },
    {
      title: "Add User",
      href: "/users/add-user",
      description: "Create a single user",
      isActive: false,
    },
    {
      title: "Add Users",
      href: "/users/add-users",
      description: "Create multiple users",
      isActive: true,
    },
  ];

  return (
    <>
      <SubNav items={subNavData} />
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Add Multiple Users</CardTitle>
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
                    <CardTitle className="text-lg">User {index + 1}</CardTitle>
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
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                        <Label htmlFor={`users.${index}.password`}>Password</Label>
                        <Input
                          {...register(`users.${index}.password`)}
                          type="password"
                          placeholder="Enter password"
                        />
                        {errors.users?.[index]?.password && (
                          <p className="text-sm text-red-600">{errors.users[index]?.password?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`users.${index}.user_type`}>User Type</Label>
                        <Select onValueChange={(value) => setValue(`users.${index}.user_type`, value as 'dashboard_user' | 'api_user')}>
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
                        {mockMenuRights.map((menu, menuIndex) => (
                          <Card key={menu.id} className="p-4">
                            <div className="space-y-3">
                              <h4 className="font-medium">{menu.title}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`users.${index}.menu_rights.${menuIndex}.can_view`}
                                    onCheckedChange={(checked) => {
                                      const currentRights = watch(`users.${index}.menu_rights`) || [];
                                      const updatedRights = [...currentRights];
                                      if (!updatedRights[menuIndex]) {
                                        updatedRights[menuIndex] = { menu_id: menu.id, can_view: false, can_create: false, can_edit: false, can_delete: false };
                                      }
                                      updatedRights[menuIndex].can_view = checked as boolean;
                                      setValue(`users.${index}.menu_rights`, updatedRights);
                                    }}
                                  />
                                  <Label htmlFor={`users.${index}.menu_rights.${menuIndex}.can_view`}>View</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`users.${index}.menu_rights.${menuIndex}.can_create`}
                                    onCheckedChange={(checked) => {
                                      const currentRights = watch(`users.${index}.menu_rights`) || [];
                                      const updatedRights = [...currentRights];
                                      if (!updatedRights[menuIndex]) {
                                        updatedRights[menuIndex] = { menu_id: menu.id, can_view: false, can_create: false, can_edit: false, can_delete: false };
                                      }
                                      updatedRights[menuIndex].can_create = checked as boolean;
                                      setValue(`users.${index}.menu_rights`, updatedRights);
                                    }}
                                  />
                                  <Label htmlFor={`users.${index}.menu_rights.${menuIndex}.can_create`}>Create</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`users.${index}.menu_rights.${menuIndex}.can_edit`}
                                    onCheckedChange={(checked) => {
                                      const currentRights = watch(`users.${index}.menu_rights`) || [];
                                      const updatedRights = [...currentRights];
                                      if (!updatedRights[menuIndex]) {
                                        updatedRights[menuIndex] = { menu_id: menu.id, can_view: false, can_create: false, can_edit: false, can_delete: false };
                                      }
                                      updatedRights[menuIndex].can_edit = checked as boolean;
                                      setValue(`users.${index}.menu_rights`, updatedRights);
                                    }}
                                  />
                                  <Label htmlFor={`users.${index}.menu_rights.${menuIndex}.can_edit`}>Edit</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`users.${index}.menu_rights.${menuIndex}.can_delete`}
                                    onCheckedChange={(checked) => {
                                      const currentRights = watch(`users.${index}.menu_rights`) || [];
                                      const updatedRights = [...currentRights];
                                      if (!updatedRights[menuIndex]) {
                                        updatedRights[menuIndex] = { menu_id: menu.id, can_view: false, can_create: false, can_edit: false, can_delete: false };
                                      }
                                      updatedRights[menuIndex].can_delete = checked as boolean;
                                      setValue(`users.${index}.menu_rights`, updatedRights);
                                    }}
                                  />
                                  <Label htmlFor={`users.${index}.menu_rights.${menuIndex}.can_delete`}>Delete</Label>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : `Create ${fields.length} User(s)`}
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

export default AddUsersForm;