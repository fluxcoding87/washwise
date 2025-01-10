"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const AdminHomePageClient = () => {
  return (
    <Card>
      <CardHeader>
        <div className="text-xl font-medium ">
          <span>Home</span>
        </div>
        <p className="text-muted-foreground">
          Overview of all the laundries by date
        </p>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
