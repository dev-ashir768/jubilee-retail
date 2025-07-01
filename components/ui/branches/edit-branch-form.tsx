"use client";

import React from 'react'
import SubNav from '../foundations/sub-nav'
import BranchForm from './branch-form'
import { BranchSchemaType } from '@/schemas/branchSchema'
import { toast } from 'sonner'

const EditBranchForm = () => {
  
  // Static data for demonstration (in a real app, this would come from API/URL params)
  const initialData: BranchSchemaType = {
    branchName: 'Main Branch',
    managerFirstName: 'John',
    managerLastName: 'Doe',
    username: 'john.doe'
  };
  
  const handleSubmit = (data: BranchSchemaType) => {
    // Here you would typically make an API call to update the branch
    console.log('Updating branch:', data);
    
    // Show success message
    toast.success('Branch updated successfully!');
    
    // Redirect to branch list (in a real app)
    // router.push('/branches/branches-list');
  };

  return (
    <>
      <SubNav
        title="Edit Branch"
      />
      
      <BranchForm 
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default EditBranchForm