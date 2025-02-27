import { ProtectedPageClient } from "./_components/client";
export const dynamic = "force-dynamic";

export default async function ProtectedHomePage() {
  return <ProtectedPageClient />;
}
