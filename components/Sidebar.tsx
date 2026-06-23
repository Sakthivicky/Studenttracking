import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-8">
        Student Tracker
      </h1>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Dashboard
        </Link>

        <Link
          href="/students"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Students
        </Link>

        <Link
          href="/tracker"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Daily Tracker
        </Link>

        <Link
          href="/reports"
          className="block p-3 rounded-lg hover:bg-slate-800"
        >
          Reports
        </Link>
      </nav>
    </aside>
  );
}