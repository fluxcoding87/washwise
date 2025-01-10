import { AdminPageNav } from "./_components/admin-page-nav";
import { MobileSideBar } from "./_components/mobile-sidebar";

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen bg-neutral-100">
      <aside>
        <div className="hidden md:block bg-neutral-200/70 fixed left-0 max-w-[300px] min-w-[300px] h-full">
          <AdminPageNav />
        </div>
        <div className="p-2 block md:hidden">
          <MobileSideBar />
        </div>
      </aside>
      <main className="size-full md:pl-[320px] md:pr-4 px-4 py-2">
        {children}
      </main>
    </section>
  );
}
