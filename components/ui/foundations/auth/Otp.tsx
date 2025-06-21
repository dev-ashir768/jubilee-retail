"use client"

import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/shadcn/input-otp"


const Otp = () => {
  const [toggleEye, setToggleEye] = useState(false)
  return (
    <form className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Enter Verification Code</h1>
        <p className="text-muted-foreground text-md text-balance">
          A 6-digit code has been sent to your email.
        </p>
      </div>

      <div className='mx-auto'>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

    </form>
  )
}

export default Otp