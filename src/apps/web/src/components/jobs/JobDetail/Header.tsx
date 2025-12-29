import LocationBadge from "@/components/jobs/Minor/LocationBadge";
import RemoteBadge from "@/components/jobs/Minor/RemoteBadge";
import StartupBadge from "../Minor/StartupBadge";


interface HeaderProps {
  title: string;
  company: string;
  city: string;
  province: string;
  remoteOk: boolean;
  isAtAStartup: boolean;
  salaryMin?: number;
  salaryMax?: number;
}

export default function Header({
  title,
  company,
  city,
  province,
  remoteOk,
  isAtAStartup,
  salaryMin,
  salaryMax,
}: HeaderProps) {
  const salary = salaryMin || salaryMax
    ? `$${salaryMin?.toLocaleString() ?? "—"} - $${salaryMax?.toLocaleString() ?? "—"}`
    : null;

  return (
    <header className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
        <p className="text-lg text-neutral-600 mt-1">{company}</p>
        {salary && (
          <>
            <p className="inline-flex items-center gap-1 py-2 text-neutral-700 text-2xl">
              {salary}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-md">
        <LocationBadge city={city} province={province} />
        <RemoteBadge remoteOk={remoteOk} />
        {isAtAStartup && (
          <>
            <StartupBadge />
          </>
        )}
      </div>
    </header>
  );
}
