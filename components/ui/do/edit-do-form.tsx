"use client";

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { Input } from '../shadcn/input'
import { Label } from '../shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shadcn/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { doSchema, DoSchemaType } from '@/schemas/doSchema'
import SubNav from '../foundations/sub-nav'
import { useSearchParams } from 'next/navigation'

const EditDoForm = () => {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DoSchemaType>({
    resolver: zodResolver(doSchema),
  });

  // Mock function to fetch task data - replace with actual API call
  const fetchTaskData = async (id: string) => {
    // This would be replaced with actual API call
    return {
      id: 1,
      title: "Complete project documentation",
      description: "Write comprehensive documentation for the retail management system",
      priority: "high" as const,
      status: "in_progress" as const,
      due_date: "2024-12-31",
      assigned_to: 1,
    };
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskData(taskId).then((data) => {
        reset({
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          due_date: data.due_date,
          assigned_to: data.assigned_to,
        });
      });
    }
  }, [taskId, reset]);

  const onSubmit = async (data: DoSchemaType) => {
    try {
      console.log('Form data:', data);
      // Here you would typically make an API call to update the task
      // await updateTask(taskId, data);
      alert('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  // Mock users data - replace with actual API call
  const mockUsers = [
    { id: 1, fullname: "John Doe", username: "johndoe" },
    { id: 2, fullname: "Jane Smith", username: "janesmith" },
    { id: 3, fullname: "Bob Johnson", username: "bobjohnson" }
  ];

  const subNavData = [
    {
      title: "Task List",
      href: "/do/do-list",
      description: "View all tasks",
      isActive: false,
    },
    {
      title: "Edit Task",
      href: "/do/edit-do",
      description: "Edit existing task",
      isActive: true,
    },
  ];

  return (
    <>
      <SubNav items={subNavData} />
      <div className="container mx-auto py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  {...register('title')}
                  placeholder="Enter task title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter task description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => setValue('status', value as 'pending' | 'in_progress' | 'completed')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    {...register('due_date')}
                  />
                  {errors.due_date && (
                    <p className="text-sm text-red-600">{errors.due_date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assign To</Label>
                  <Select onValueChange={(value) => setValue('assigned_to', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.fullname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.assigned_to && (
                    <p className="text-sm text-red-600">{errors.assigned_to.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Task'}
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

export default EditDoForm;