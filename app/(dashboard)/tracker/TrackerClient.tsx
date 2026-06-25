"use client";

import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("NERDSLAB X SHANMUGHA TRAINING REPORT", 14, 20);

    doc.setFontSize(11);
    doc.text(`Date: ${date}`, 14, 30);

    doc.text("Day Summary:", 14, 42);
    doc.text(daySummary || "No summary provided", 14, 50);

    doc.setFontSize(14);
    doc.text("Attendance Summary", 14, 65);

    doc.setFontSize(11);
    doc.text(`Total Students: ${filteredStudents.length}`, 14, 75);
    doc.text(`AM Present: ${attendanceSummary.amPresent}`, 14, 85);
    doc.text(`AM Absent: ${attendanceSummary.amAbsent}`, 14, 95);

    doc.text(`PM Present: ${attendanceSummary.pmPresent}`, 90, 85);
    doc.text(`PM Absent: ${attendanceSummary.pmAbsent}`, 90, 95);

    const tableRows = filteredStudents.map((student) => [
      student.name,
      rows[student.id]?.am_status || "-",
      rows[student.id]?.pm_status || "-",
      rows[student.id]?.daily_task_score ?? 0,
      rows[student.id]?.home_task_rating || "-",
      rows[student.id]?.comments || "-",
    ]);

    autoTable(doc, {
      startY: 115,
      head: [["Student", "AM", "PM", "Score", "Home Task", "Comments"]],
      body: tableRows,
      styles: {
        fontSize: 8,
      },
    });

    doc.save(`Daily_Report_${date}.pdf`);
  };

  const loadTrackerData = async () => {
    const { data, error } = await supabase
      .from("daily_tracking")
      .select("*")
      .eq("tracking_date", date);

    if (error || !data) return;

    const mapped: Record<number, any> = {};

    data.forEach((row: any) => {
      mapped[row.student_id] = {
        am_status: row.am_status || "",
        pm_status: row.pm_status || "",
        daily_task_score: row.daily_task_score || 0,
        home_task_rating: row.home_task_rating || "",
        comments: row.comments || "",
      };
    });

    setRows(mapped);

    if (data.length > 0) {
      setDaySummary(data[0].day_summary || "");
    } else {
      setDaySummary("");
    }
  };

  useEffect(() => {
    loadTrackerData();
  }, [date]);

  const markAllPresent = () => {
    const updated = { ...rows };

    filteredStudents.forEach((student) => {
      updated[student.id] = {
        ...updated[student.id],
        am_status: "Present",
        pm_status: "Present",
      };
    });

    setRows(updated);
  };

  const markAllAMPresent = () => {
    const updated = { ...rows };

    filteredStudents.forEach((student) => {
      updated[student.id] = {
        ...updated[student.id],
        am_status: "Present",
      };
    });

    setRows(updated);
  };

  const markAllPMPresent = () => {
    const updated = { ...rows };

    filteredStudents.forEach((student) => {
      updated[student.id] = {
        ...updated[student.id],
        pm_status: "Present",
      };
    });

    setRows(updated);
  };

  const clearAllAttendance = () => {
    setRows({});
  };

  const attendanceSummary = filteredStudents.reduce(
    (acc, student) => {
      const am = rows[student.id]?.am_status;
      const pm = rows[student.id]?.pm_status;

      if (am === "Present") acc.amPresent += 1;
      if (am === "Absent") acc.amAbsent += 1;

      if (pm === "Present") acc.pmPresent += 1;
      if (pm === "Absent") acc.pmAbsent += 1;

      return acc;
    },
    {
      amPresent: 0,
      amAbsent: 0,
      pmPresent: 0,
      pmAbsent: 0,
    }
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="sticky top-0 z-10 bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Tracker</h1>
          <p className="text-sm text-gray-700 font-medium">
            {filteredStudents.length} Students
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={saveAll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-lg"
          >
            Save All
          </button>

          <button
            type="button"
            onClick={downloadReport}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow-lg"
          >
            Download PDF
          </button>
        </div>
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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">Students</p>
          <p className="text-3xl font-bold text-slate-700">
            {filteredStudents.length}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">AM Present</p>
          <p className="text-3xl font-bold text-green-600">
            {attendanceSummary.amPresent}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">AM Absent</p>
          <p className="text-3xl font-bold text-red-600">
            {attendanceSummary.amAbsent}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">PM Present</p>
          <p className="text-3xl font-bold text-green-600">
            {attendanceSummary.pmPresent}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">PM Absent</p>
          <p className="text-3xl font-bold text-red-600">
            {attendanceSummary.pmAbsent}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={markAllPresent}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Mark All Present
          </button>

          <button
            type="button"
            onClick={markAllAMPresent}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Mark All AM Present
          </button>

          <button
            type="button"
            onClick={markAllPMPresent}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Mark All PM Present
          </button>

          <button
            type="button"
            onClick={clearAllAttendance}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Clear All
          </button>
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
                    <option value="">Select</option>
<option value="Average">Average</option>
<option value="Good">Good</option>
<option value="Excellent">Excellent</option>
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