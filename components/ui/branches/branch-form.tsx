"use client";

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../shadcn/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { branchSchema, BranchSchemaType } from '@/schemas/branchSchema'
import { Button } from '../shadcn/button'
import { Input } from '../shadcn/input'
import { Label } from '../shadcn/label'
import Select from 'react-select'
import { UserOption } from '@/types/branches'

interface BranchFormProps {
  mode: 'add' | 'edit';
  initialData?: BranchSchemaType;
  onSubmit: (data: BranchSchemaType) => void;
  isLoading?: boolean;
}

const BranchForm = ({ mode, initialData, onSubmit, isLoading = false }: BranchFormProps) => {
  
  // Static user options for the dropdown
  const userOptions: UserOption[] = [
    { value: 'john.doe', label: 'John Doe' },
    { value: 'jane.smith', label: 'Jane Smith' },
    { value: 'mike.johnson', label: 'Mike Johnson' },
    { value: 'sarah.williams', label: 'Sarah Williams' },
    { value: 'david.brown', label: 'David Brown' },
    { value: 'lisa.davis', label: 'Lisa Davis' },
    { value: 'robert.wilson', label: 'Robert Wilson' },
    { value: 'emily.taylor', label: 'Emily Taylor' },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BranchSchemaType>({
    resolver: zodResolver(branchSchema),
    defaultValues: initialData || {
      branchName: '',
      managerFirstName: '',
      managerLastName: '',
      username: ''
    }
  });

  const selectedUsername = watch('username');

  const handleUsernameChange = (selectedOption: UserOption | null) => {
    if (selectedOption) {
      setValue('username', selectedOption.value);
      
      // Auto-fill first and last names based on username selection
      const nameParts = selectedOption.label.split(' ');
      if (nameParts.length >= 2) {
        setValue('managerFirstName', nameParts[0]);
        setValue('managerLastName', nameParts.slice(1).join(' '));
      }
    } else {
      setValue('username', '');
      setValue('managerFirstName', '');
      setValue('managerLastName', '');
    }
  };

  const selectedUserOption = userOptions.find(option => option.value === selectedUsername);

  return (
    <Card className='shadow-none border-none'>
      <CardHeader className='border-b'>
        <CardTitle>{mode === 'add' ? 'Add New Branch' : 'Edit Branch'}</CardTitle>
        <CardDescription>
          {mode === 'add' 
            ? 'Create a new branch by filling out the form below.' 
            : 'Update the branch information using the form below.'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className='pt-6'>
        <div className='max-w-2xl'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Branch Name */}
          <div className='space-y-2'>
            <Label htmlFor='branchName'>Branch Name</Label>
            <Input
              id='branchName'
              placeholder='Enter branch name'
              {...register('branchName')}
              className={errors.branchName ? 'border-red-500' : ''}
            />
            {errors.branchName && (
              <p className='text-sm text-red-500'>{errors.branchName.message}</p>
            )}
          </div>

          {/* Username Dropdown */}
          <div className='space-y-2'>
            <Label htmlFor='username'>Select Manager</Label>
            <Select
              id='username'
              value={selectedUserOption || null}
              onChange={handleUsernameChange}
              options={userOptions}
              placeholder='Select a manager...'
              isClearable
              className={errors.username ? 'react-select-error' : ''}
              classNamePrefix="react-select"
            />
            {errors.username && (
              <p className='text-sm text-red-500'>{errors.username.message}</p>
            )}
          </div>

          {/* Manager First Name */}
          <div className='space-y-2'>
            <Label htmlFor='managerFirstName'>Manager First Name</Label>
            <Input
              id='managerFirstName'
              placeholder='Enter first name'
              {...register('managerFirstName')}
              className={errors.managerFirstName ? 'border-red-500' : ''}
            />
            {errors.managerFirstName && (
              <p className='text-sm text-red-500'>{errors.managerFirstName.message}</p>
            )}
          </div>

          {/* Manager Last Name */}
          <div className='space-y-2'>
            <Label htmlFor='managerLastName'>Manager Last Name</Label>
            <Input
              id='managerLastName'
              placeholder='Enter last name'
              {...register('managerLastName')}
              className={errors.managerLastName ? 'border-red-500' : ''}
            />
            {errors.managerLastName && (
              <p className='text-sm text-red-500'>{errors.managerLastName.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className='flex gap-4 pt-4'>
            <Button 
              type='submit' 
              disabled={isLoading}
              className='flex-1'
            >
              {isLoading ? 'Saving...' : (mode === 'add' ? 'Add Branch' : 'Update Branch')}
            </Button>
            <Button 
              type='button' 
              variant='outline'
              className='flex-1'
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
        </div>
      </CardContent>
    </Card>
  )
}

export default BranchForm