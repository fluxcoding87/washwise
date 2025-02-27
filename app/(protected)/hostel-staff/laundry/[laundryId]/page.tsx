import { LaundryIdPageClient } from "./_components/laundry-id-page-client";
export const dynamic = "force-dynamic";

interface LaundryIdPageProps {
  params: { laundryId: string };
}

export default async function LaundryIdPage({ params }: LaundryIdPageProps) {
  const { laundryId } = await params;

  return <LaundryIdPageClient id={laundryId} />;
}
