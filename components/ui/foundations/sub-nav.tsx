import { subNavTypes } from '@/types/subNavTypes'
import { Button } from '../shadcn/button'
import Link from 'next/link'


const SubNav: React.FC<subNavTypes> = ({ title, addBtnTitle }) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {addBtnTitle && (
        <div>
          <Button size="lg" className='min-w-[150px]' asChild>
            <Link href="/users/add-user">
              {addBtnTitle}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default SubNav