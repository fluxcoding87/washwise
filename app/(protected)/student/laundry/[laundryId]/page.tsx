import { LaundryIdPageClient } from "@/app/(protected)/hostel-staff/laundry/[laundryId]/_components/laundry-id-page-client";

export default async function StudentLaundryIdPage({
  params,
}: {
  params: { laundryId: string };
}) {
  const { laundryId } = await params;

  if (laundryId) return <LaundryIdPageClient id={laundryId} />;
}
