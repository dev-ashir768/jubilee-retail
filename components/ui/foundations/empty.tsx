import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'

interface EmptyProps {
  title: string;
  description: string;
}

const Empty: React.FC<EmptyProps> = ({ title, description }) => {
  return (
    <Card className='w-full shadow-none border-none'>
      <CardHeader className='border-b gap-0'>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <h2>
          {description}
        </h2>
      </CardContent>
    </Card>
  )
}

export default Empty