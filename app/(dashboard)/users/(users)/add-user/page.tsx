import AddUserForm from '@/components/ui/users/add-user-form'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Add User | Jubilee Retail',
  description: 'Add a new user to the Jubilee Retail system, assigning roles and permissions as needed.',
}
const page = () => {
  return (
    <>
      <AddUserForm />
    </>
  )
}

export default page