import OtpForm from "@/components/ui/auth/otp-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'OTP | Jubilee Retail',
  description: 'Enter the OTP sent to your registered email or phone number to verify your identity and access your account.',
}

const page = () => {
  return (
    <OtpForm />
  )
}

export default page