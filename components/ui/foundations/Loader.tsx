import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../shadcn/card'
import { Loader2 } from 'lucide-react'

const Loader = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Please wait while we fetch the data...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <Loader2 className='animate-spin h-6 w-6' />
        </div>
      </CardContent>
    </Card>
  )
}

export default Loader