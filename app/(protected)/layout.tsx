import { MobileSidebar } from "@/components/mobile-sidebar";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import Image from "next/image";
import Link from "next/link";

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
        <nav className="flex items-center justify-center">
          <Navbar />
          <MobileSidebar />
        </nav>
        <UserButton />
      </header>
      <main className="p-4 h-full">{children}</main>
    </section>
  );
}
