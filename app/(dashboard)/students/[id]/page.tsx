import { supabase } from "@/lib/supabase";

export default async function StudentProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !student) {
    return (
      <div className="p-6">
        Student not found
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">
          {student.name}
        </h1>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <strong>Year:</strong> {student.year}
          </div>

          <div>
            <strong>Arrears:</strong> {student.arrears}
          </div>

          <div>
            <strong>Specialization:</strong> {student.specialization || "-"}
          </div>

          <div>
            <strong>Email:</strong> {student.email || "-"}
          </div>

          <div>
            <strong>City:</strong> {student.city || "-"}
          </div>

          <div>
            <strong>Accommodation:</strong> {student.accommodation || "-"}
          </div>

          <div>
            <strong>Room No:</strong> {student.room_no || "-"}
          </div>

          <div>
            <strong>Preferred Location:</strong> {student.preferred_location || "-"}
          </div>

        </div>

        <div className="mt-6">
          <strong>Comments</strong>

          <div className="mt-2 border rounded-lg p-4">
            {student.comments || "No comments available"}
          </div>
        </div>
      </div>
    </div>
  );
}