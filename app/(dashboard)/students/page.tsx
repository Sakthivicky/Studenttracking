import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function StudentsPage() {
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .order("name");

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Students ({students?.length || 0})
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          + Add Student
        </button>
      </div>

      <div className="grid gap-3">
        {students?.map((student) => (
          <Link
            href={`/students/${student.id}`}
            key={student.id}
            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition block"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {student.name}
                </h3>

                <p className="text-gray-500">
                  {student.year}
                </p>
              </div>

              <div>
                ID: {student.id}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}