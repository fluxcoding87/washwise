/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { IssueIdPageClient } from "./_components/client";
export const dynamic = "force-dynamic";

export default async function IssueIdPage({
  params,
}: {
  params: Promise<any>;
}) {
  const { issueId } = await params;

  return <IssueIdPageClient issueId={issueId} />;
}
