import { IssueIdPageClient } from "./_components/client";

export default async function IssueIdPage({
  params,
}: {
  params: { issueId: string };
}) {
  const { issueId } = await params;

  return <IssueIdPageClient issueId={issueId} />;
}
