import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
interface LoginLayoutPageProps {
  children: React.ReactNode;
}
export default async function LoginLayoutPage({
  children,
}: LoginLayoutPageProps) {
  return (
    <section className="max-w-screen-xl mx-auto">
      <header className="flex items-center py-6 justify-between px-4">
        <Link href={"/"} className="flex items-center gap-x-1.5">
          <div className="size-7 md:size-8 relative">
            <Image fill src={Logo} alt="logo" />
          </div>
          <h2 className="font-extrabold tracking-tight text-xl md:text-2xl text-[#007DFC]">
            Washwise
          </h2>
        </Link>
        {/* <nav className="flex items-center gap-x-4">
          <Button className="font-semibold bg-[#007DFC]" asChild>
            <Link href={"/staff-sign-up"}>Request Staff Sign Up</Link>
          </Button>
        </nav> */}
      </header>
      <main className="p-4 h-full">{children}</main>
    </section>
  );
}
