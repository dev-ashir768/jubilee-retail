"use client"

import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/shadcn/button'


const OtpOption = () => {
  return (
    <form className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Receive Your Otp code</h1>
        <p className="text-muted-foreground text-md text-balance">
          Choose how you&apos;d like to get your one-time code to login.
        </p>
      </div>
      <div className="grid gap-6">
        <Button type="submit" size="lg" variant="secondary" className="w-full">
          Email
        </Button>
        <Button type="submit" size="lg" variant="secondary" className="w-full">
          SMS
        </Button>
      </div>
    </form>
  )
}

export default OtpOption