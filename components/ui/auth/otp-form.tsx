"use client"

import React, { useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/shadcn/input-otp"
import { useMutation } from '@tanstack/react-query'
import { axiosFunction } from '@/utils/axiosFunction'
import { AxiosError } from 'axios'
import { Button } from '../shadcn/button'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { toast } from 'sonner'
import { useForm, Controller } from 'react-hook-form'
import { otpSchema, OtpSchemaType } from '@/schemas/otpSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { sendOtpResponseType } from '@/types/sendOtpTypes'
import { userInfoTypes, verifyOtpResponseType } from '@/types/verifyOtpTypes'


const OtpForm = () => {

  const [step, setStep] = useState(1)
  const router = useRouter()
  const [sendOtpOption, setSendOtpOption] = useState("")

  // UserInfo from cookies
  const userInfoFromCookie: userInfoTypes = useMemo(() => {
    return JSON.parse(getCookie("userInfo")?.toString() || "{}");
  }, []);

  // Send Otp
  const useSendOtpMutation = useMutation<sendOtpResponseType, AxiosError<sendOtpResponseType>, { username: string, type: string }>({
    mutationFn: (record) => {
      return axiosFunction({
        method: 'POST',
        urlPath: '/users/send-otp',
        data: record,
        isServer: true
      })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message)
      console.log("Send Otp Mutation Error:", err)
    },
    onSuccess: () => {
      toast.success("Otp Sent Successfully!")
      setStep((prevState) => prevState + 1)
    }
  })

  const handleSendOtp = (type: string) => {
    useSendOtpMutation.mutate({
      username: userInfoFromCookie.username,
      type
    })
    setSendOtpOption(type)
  }

  // Verify Otp

  const { handleSubmit: handleVerifyOtpSubmit, formState: { errors }, setValue, control, trigger } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      username: "",
      otp: ''
    }
  })

  useEffect(() => {
    if (userInfoFromCookie) setValue("username", userInfoFromCookie.username)
  }, [userInfoFromCookie, setValue])

  const useVerifyOtpMutation = useMutation<verifyOtpResponseType, AxiosError<verifyOtpResponseType>, { username: string, otp: string }>({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/users/verify-otp",
        data: record,
        isServer: true
      })
    },
    onMutate: () => {
      toast.info("Verifying Otp...")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message)
      console.log("Verify Otp Mutation Error:", err)
    },
    onSuccess: (data) => {
      toast.success("Otp Verified Successfully!")
      setCookie('jubilee-retail-token', data.payload[0].token)
      setCookie('userInfo', JSON.stringify(data.payload[0].user_info))
      localStorage.setItem('menus', JSON.stringify(data.payload[0].menus))
      deleteCookie("otp-session");
      router.push('/')
    }
  })

  const submitVerifyOtp = (data: OtpSchemaType) => {
    useVerifyOtpMutation.mutate(data)
  }

  return (
    <>
      {step === 1 && (
        <div className={cn("flex flex-col gap-6")}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-bold">Send Your Otp</h1>
            <p className="text-muted-foreground text-md text-balance">
              Choose how you&apos;d like to get your one-time code to login.
            </p>
          </div>
          <div className="grid gap-6">
            <Button type="button" size="lg" variant="secondary" onClick={() => handleSendOtp('email')} className="w-full" disabled={useSendOtpMutation.isPending}>
              {useSendOtpMutation.isPending ? "Sending..." : "Email"}
            </Button>
            <Button type="button" size="lg" variant="secondary" onClick={() => handleSendOtp('sms')} className="w-full" disabled={useSendOtpMutation.isPending}>
              SMS
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form className={cn("flex flex-col gap-6")}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-bold">Enter Verification Code</h1>
            <p className="text-muted-foreground text-md text-balance">
              A 6-digit code has been sent to your {sendOtpOption}.
            </p>
          </div>

          <div className='mx-auto'>
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <>
                  <InputOTP maxLength={6} disabled={useVerifyOtpMutation.isPending} onChange={(val) => {
                    field.onChange(val)
                    if (val.length === 6) {
                      trigger('otp').then((isValid) => {
                        if (isValid) handleVerifyOtpSubmit(submitVerifyOtp)();
                      })
                    }
                  }}>
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
                  {errors.otp && <span className="text-red-500 text-sm">{errors.otp.message}</span>}
                </>
              )}
            />
          </div>
        </form>
      )}
    </>
  )
}

export default OtpForm