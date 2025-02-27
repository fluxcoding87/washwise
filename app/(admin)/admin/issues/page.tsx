import { HostelStaffIssuesClient } from "@/app/(protected)/hostel-staff/issues/_components/client";
export const dynamic = "force-dynamic";

export default async function AdminIssuesPage() {
  return <HostelStaffIssuesClient type="admin" />;
}
