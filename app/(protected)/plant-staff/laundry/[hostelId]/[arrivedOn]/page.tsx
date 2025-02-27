import { ArrivedOnPageClient } from "./_components/client";
export const dynamic = "force-dynamic";

export default async function LaundryIdAndDatePage({
  params,
}: {
  params: { hostelId: string; arrivedOn: string };
}) {
  const { hostelId, arrivedOn } = await params;

  return <ArrivedOnPageClient hostelId={hostelId} arrivedOn={arrivedOn} />;
}
