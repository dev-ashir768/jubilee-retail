"use client"

import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/shadcn/button'
import { Input } from '../../shadcn/input'

import { Eye, EyeOff } from 'lucide-react'
import { setCookie } from 'cookies-next'

const LoginForm = () => {
  const [toggleEye, setToggleEye] = useState(false)
  return (
    <form className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-md text-balance">
          Welcome to the Jubilee Retail
        </p>
      </div>
      <div className="grid gap-6">
        <Input id="email" type="email" placeholder="Email" />
        <div className='relative'>
          <Input id="password" type="password" placeholder='Password' />
          <Button
            type='button'
            variant="ghost" size="sm" className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer' onClick={() => setToggleEye((prevState) => !prevState)}>
            {toggleEye ? <Eye /> : <EyeOff />}
          </Button>
        </div>
        <Button type="button" onClick={() => { setCookie("jubilee-token", "opopoponxnxs29999udjncb2990") }} className="w-full cursor-pointer" size="lg">
          Login
        </Button>
      </div>
    </form>
  )
}

export default LoginForm