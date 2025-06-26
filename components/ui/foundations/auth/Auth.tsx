import React from 'react'
import Image from 'next/image'

import LoginForm from './LoginForm'

const Auth = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/images/auth-bg.jpg"
          className="object-cover"
          alt="Image"
          fill
          priority
        />
      </div>
      <div className="flex flex-col md:p-10 flex-1 items-center justify-center gap-4 p-6">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={130}
          height={60}
          priority
        />
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Auth