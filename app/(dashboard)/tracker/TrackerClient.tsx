"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TrackerClient({
  students = [],
}: {
  students?: any[];
}) {
  const [yearFilter, setYearFilter] = useState("all");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [daySummary, setDaySummary] = useState("");
  const [rows, setRows] = useState<Record<number, any>>({});

  const filteredStudents = useMemo(() => {
    if (yearFilter === "3rd") {
      return students.filter((s) =>
        String(s.year || "").toLowerCase().includes("3rd")
      );
    }

    if (yearFilter === "final") {
      return students.filter((s) =>
        String(s.year || "").toLowerCase().includes("final")
      );
    }

    return students;
  }, [students, yearFilter]);

  const saveAll = async () => {
    const payload = filteredStudents.map((student) => ({
      student_id: student.id,
      tracking_date: date,
      day_summary: daySummary,
      am_status: rows[student.id]?.am_status || null,
      pm_status: rows[student.id]?.pm_status || null,
      daily_task_score: rows[student.id]?.daily_task_score || 0,
      home_task_rating: rows[student.id]?.home_task_rating || null,
      comments: rows[student.id]?.comments || null,
    }));

    const { error } = await supabase
      .from("daily_tracking")
      .upsert(payload, {
        onConflict: "student_id,tracking_date",
      });

    if (error) {
      alert(error.message);
    } else {
      alert("Saved successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="sticky top-0 z-10 bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Tracker</h1>
          <p className="text-sm text-gray-700 font-medium">
            {filteredStudents.length} Students
          </p>
        </div>
        <button
          type="button"
          onClick={saveAll}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-lg"
        >
          Save All
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Year Filter</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="all">All Students</option>
            <option value="3rd">3rd Year</option>
            <option value="final">Final Year</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <label className="block text-sm font-medium mb-2">
          Day Summary
        </label>
        <textarea
          value={daySummary}
          onChange={(e) => setDaySummary(e.target.value)}
          rows={3}
          className="w-full border rounded-lg p-3"
          placeholder="Today's training summary"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="bg-blue-50 border-b">
              <th className="p-3 text-left">Student</th>
              <th className="p-3">AM</th>
              <th className="p-3">PM</th>
              <th className="p-3">Score</th>
              <th className="p-3">Home Task</th>
              <th className="p-3">Comments</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="p-3 font-medium">{student.name}</td>
                <td className="p-2">
                  <select
                    className="w-full border rounded px-2 py-2"
                    value={rows[student.id]?.am_status || ""}
                    onChange={(e) =>
                      setRows((prev) => ({
                        ...prev,
                        [student.id]: {
                          ...prev[student.id],
                          am_status: e.target.value,
                        },
                      }))
                    }
                  >
                    <option value="">Select</option>
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Leave</option>
                    <option>Late</option>
                  </select>
                </td>
                <td className="p-2">
                  <select
                    className="w-full border rounded px-2 py-2"
                    value={rows[student.id]?.pm_status || ""}
                    onChange={(e) =>
                      setRows((prev) => ({
                        ...prev,
                        [student.id]: {
                          ...prev[student.id],
                          pm_status: e.target.value,
                        },
                      }))
                    }
                  >
                    <option value="">Select</option>
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Leave</option>
                    <option>Late</option>
                  </select>
                </td>
                <td className="p-2">
                  <select
                    className="w-full border rounded px-2 py-2"
                    value={rows[student.id]?.daily_task_score ?? "0"}
                    onChange={(e) =>
                      setRows((prev) => ({
                        ...prev,
                        [student.id]: {
                          ...prev[student.id],
                          daily_task_score: Number(e.target.value),
                        },
                      }))
                    }
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </td>
                <td className="p-2">
                  <select
                    className="w-full border rounded px-2 py-2"
                    value={rows[student.id]?.home_task_rating || ""}
                    onChange={(e) =>
                      setRows((prev) => ({
                        ...prev,
                        [student.id]: {
                          ...prev[student.id],
                          home_task_rating: e.target.value,
                        },
                      }))
                    }
                  >
                    <option value="">Average</option>
                    <option>Good</option>
                    <option>Excellent</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    className="w-full border rounded px-2 py-2"
                    placeholder="Comments"
                    value={rows[student.id]?.comments || ""}
                    onChange={(e) =>
                      setRows((prev) => ({
                        ...prev,
                        [student.id]: {
                          ...prev[student.id],
                          comments: e.target.value,
                        },
                      }))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}