import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { Top5AgentsPayloadType } from "@/types/dashboardTypes";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Skeleton } from "../shadcn/skeleton";

interface Top5AgentsProps {
  payload: Top5AgentsPayloadType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const Top5Agents: React.FC<Top5AgentsProps> = ({
  payload,
  isLoading,
  isError,
  error,
}) => {
  
  const renderSkeleton = () => (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="gap-0">
        <CardTitle className="text-base sm:text-lg">
          <Skeleton className="h-6 w-32 rounded-sm" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 sticky top-0">
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderError = () => (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="gap-0">
        <CardTitle className="text-base sm:text-lg">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{error}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  if (isError) {
    return renderError();
  }

  return (
    <>
      <Card className="w-full shadow-none border-none">
        <CardHeader className="gap-0">
          <CardTitle className="text-base sm:text-lg">Top 5 Agents</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 sticky top-0">
                  <TableHead>Agent Name</TableHead>
                  <TableHead className="text-right">Policy Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payload.length > 0 ? (
                  payload.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src="/images/user-avatar.png"
                              alt={item.agent_name}
                            />
                            <AvatarFallback className="text-xs">
                              {item.agent_name}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{item.agent_name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.policy_amount || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="h-[285px] text-center text-muted-foreground"
                    >
                      No data to display.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Top5Agents;
