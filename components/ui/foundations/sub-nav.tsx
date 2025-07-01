import { subNavTypes } from '@/types/subNavTypes'
import { Calendar } from "@/components/ui/shadcn/calendar"


const SubNav: React.FC<subNavTypes> = ({ title }) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div>
        
      </div>
    </div>
  )
}

export default SubNav