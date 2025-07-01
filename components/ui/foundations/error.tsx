import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Alert, AlertDescription, AlertTitle } from '../shadcn/alert'

const Error = ({ err }: { err: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Failed to load user list</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{err?.message || "An unexpected error occurred"}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

export default Error