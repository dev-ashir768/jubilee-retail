"use client";

import React from 'react'
import SubNav from '../foundations/sub-nav'
import BranchForm from './branch-form'
import { BranchSchemaType } from '@/schemas/branchSchema'
import { toast } from 'sonner'

const AddBranchForm = () => {
  
  const handleSubmit = (data: BranchSchemaType) => {
    // Here you would typically make an API call to create the branch
    console.log('Creating branch:', data);
    
    // Show success message
    toast.success('Branch created successfully!');
    
    // Redirect to branch list (in a real app)
    // router.push('/branches/branches-list');
  };

  return (
    <>
      <SubNav
        title="Add New Branch"
      />
      
      <BranchForm 
        mode="add"
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddBranchForm