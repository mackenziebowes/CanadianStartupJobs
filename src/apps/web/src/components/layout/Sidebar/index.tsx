import Link from "next/link";
import BuildCanada from "@/components/common/svg/BuildCanada";
import FAQ from "@/components/FAQ";
import Filters from "@/components/tools/filters";
interface SidebarProps {
  pageTitle: string;
}

function Sidebar({ pageTitle }: SidebarProps) {
  return (
    <div className="col-span-1 flex h-full min-h-0 flex-col overflow-hidden">
      <div className="mb-4 shrink-0">
        <Link href="https://buildcanada.com" className="block bg-[#8b2332] p-3 w-fit pr-8">
          <BuildCanada />
        </Link>
      </div>
      <Link href="/" className="text-4xl lg:text-5xl font-bold mb-6 text-[#8b2332]">{pageTitle}</Link>
      <div className="mb-6 shrink-0">
        <p className="text-gray-900 mb-4">
          A community-driven job board connecting top talent with Canadian-owned and operated startups.
        </p>
        <FAQ />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <Filters />
      </div>
    </div>
  );
}

export default Sidebar;
