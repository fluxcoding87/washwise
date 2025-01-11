"use client";

import { useGetAdminLaundries } from "@/hooks/admin/use-get-admin-laundries";
import { AdminLaundryChart } from "./admin-laundry-chart";

interface AdminLaundryOverviewProps {
  selectedHostelId: string;
  startDate: Date;
  endDate: Date;
}

export const AdminLaundryOverview = ({
  selectedHostelId,
  startDate,
  endDate,
}: AdminLaundryOverviewProps) => {
  const { data: laundries, isLoading: isLaundriesLoading } =
    useGetAdminLaundries(selectedHostelId, startDate, endDate);

  return (
    <div>
      <AdminLaundryChart
        data={laundries ?? []}
        isLoading={isLaundriesLoading}
      />
    </div>
  );
};
