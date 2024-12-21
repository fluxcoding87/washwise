import { ArrivedOnPageClient } from "./_components/client";

export default async function LaundryIdAndDatePage({
  params,
}: {
  params: { hostelId: string; arrivedOn: string };
}) {
  const { hostelId, arrivedOn } = await params;

  return <ArrivedOnPageClient hostelId={hostelId} arrivedOn={arrivedOn} />;
}
