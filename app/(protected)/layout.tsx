import Image from "next/image";
import Link from "next/link";
import { NavClient } from "./_components/nav-client";

export default function ProtectedPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-screen-xl mx-auto">
      <header className="flex items-center py-6 justify-between px-4">
        <Link href={"/"} className="flex items-center gap-x-1.5">
          <div className="size-7 md:size-8 relative">
            <Image fill src="/logo.svg" alt="logo" />
          </div>
          <h2 className="font-extrabold tracking-tight text-xl md:text-2xl text-[#007DFC]">
            Washwise
          </h2>
        </Link>
        <NavClient />
      </header>
      <main className="p-4 h-full">{children}</main>
    </section>
  );
}
