"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AssessmentPage() {
  const [title, setTitle] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [maxMarks, setMaxMarks] = useState(20);
  const [students, setStudents] = useState<any[]>([]);
  const [assessmentCreated, setAssessmentCreated] = useState(false);
  const [marks, setMarks] = useState<Record<number, string>>({});
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    loadStudents();
    loadAssessments();
  }, []);

  const loadStudents = async () => {
    const { data } = await supabase
      .from("students")
      .select("*")
      .order("name");

    setStudents(data || []);
  };

  const loadAssessments = async () => {
    const { data } = await supabase
      .from("assessments")
      .select("*")
      .order("assessment_date", { ascending: false });

    setAssessments(data || []);
  };

  const viewAssessment = async (assessment: any) => {
    setSelectedAssessment(assessment);
    setViewMode(true);
    setAssessmentCreated(false);
    setAssessmentId(assessment.id);

    const { data } = await supabase
      .from("assessment_marks")
      .select("*")
      .eq("assessment_id", assessment.id);

    const loadedMarks: Record<number, string> = {};

    (data || []).forEach((row: any) => {
      loadedMarks[row.student_id] = String(row.marks);
    });

    setMarks(loadedMarks);
  };

  const createAssessment = async () => {
    if (!title || !assessmentDate || !maxMarks) {
      alert("Please fill all fields");
      return;
    }

    const { data, error } = await supabase
      .from("assessments")
      .insert([
        {
          title,
          assessment_date: assessmentDate,
          max_marks: maxMarks,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    alert("Assessment Created Successfully");
    setAssessmentCreated(true);
    setAssessmentId(data.id);
    loadAssessments();

    console.log("Assessment:", data);
  };

  const saveMarks = async () => {
    if (!assessmentId) {
      alert("Create assessment first");
      return;
    }

    const payload = students
      .filter((student) => marks[student.id] !== undefined && marks[student.id] !== "")
      .map((student) => ({
        assessment_id: assessmentId,
        student_id: student.id,
        marks: Number(marks[student.id]),
      }));

    const { error } = await supabase
      .from("assessment_marks")
      .insert(payload);

    if (error) {
      alert(error.message);
      return;
    }

    alert(viewMode ? "Marks Updated Successfully" : "Marks Saved Successfully");
  };

  const downloadAssessmentReport = () => {
    if (!selectedAssessment) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("NERDSLAB X SHANMUGHA TRAINING REPORT", 14, 20);

    doc.setFontSize(12);
    doc.text(`Assessment: ${selectedAssessment.title}`, 14, 35);
    doc.text(`Date: ${selectedAssessment.assessment_date}`, 14, 45);
    doc.text(`Maximum Marks: ${selectedAssessment.max_marks}`, 14, 55);

    doc.text(`Highest Mark: ${highestMark}`, 14, 70);
    doc.text(`Average Mark: ${averageMark}`, 14, 80);

    doc.text(
      `Top 3: ${top3Performers.map((s) => `${s.name} (${s.mark})`).join(', ')}`,
      14,
      90
    );

    autoTable(doc, {
      startY: 100,
      head: [["Rank", "Student Name", "Marks"]],
      body: rankedStudents.map((student, index) => [
        index + 1,
        student.name,
        student.mark,
      ]),
    });

    doc.save(`${selectedAssessment.title}_Report.pdf`);
  };

  // Calculate mark statistics and top students
  const markValues = Object.values(marks)
    .map((m) => Number(m))
    .filter((m) => !isNaN(m));

  const highestMark = markValues.length
    ? Math.max(...markValues)
    : 0;

  const averageMark = markValues.length
    ? (
        markValues.reduce((a, b) => a + b, 0) /
        markValues.length
      ).toFixed(2)
    : 0;

  const topStudents = students.filter(
    (student) => Number(marks[student.id]) === highestMark
  );

  const rankedStudents = students
    .map((student) => ({
      ...student,
      mark: Number(marks[student.id] || 0),
    }))
    .sort((a, b) => b.mark - a.mark);

  const top3Performers = rankedStudents.slice(0, 3);

  const bottom3Performers = [...rankedStudents]
    .reverse()
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment Module
          </h1>
          <p className="text-gray-500">
            Create assessments and record student marks.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">
            Create Assessment
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Assessment Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Networking Test 1"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Assessment Date
              </label>
              <input
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Marks
              </label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={createAssessment}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Create Assessment
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Assessment History
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex justify-between items-center border rounded-lg p-3 cursor-pointer"
                  onClick={() => viewAssessment(assessment)}
                >
                  <div>
                    <p className="font-semibold">
                      {assessment.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {assessment.assessment_date}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewAssessment(assessment);
                    }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedAssessment && (
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedAssessment.title}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Date: {selectedAssessment.assessment_date} | Max Marks: {selectedAssessment.max_marks}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAssessment(null);
                    setViewMode(false);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="grid md:grid-cols-5 gap-4 mb-6">
                <div className="bg-green-50 border rounded-xl p-4">
                  <p className="text-sm text-gray-500">Highest Mark</p>
                  <p className="text-3xl font-bold text-green-600">{highestMark}</p>
                </div>

                <div className="bg-blue-50 border rounded-xl p-4">
                  <p className="text-sm text-gray-500">Average Mark</p>
                  <p className="text-3xl font-bold text-blue-600">{averageMark}</p>
                </div>

                <div className="bg-purple-50 border rounded-xl p-4">
                  <p className="text-sm text-gray-500">Top Performers</p>
                  <p className="font-semibold text-purple-600">
                    {topStudents.length > 0
                      ? topStudents.map((s) => s.name).join(", ")
                      : "-"}
                  </p>
                </div>

                <div className="bg-amber-50 border rounded-xl p-4">
                  <p className="text-sm text-gray-500">Top 3 Performers</p>
                  <div className="text-sm font-semibold text-amber-700 mt-2">
                    {top3Performers.length > 0 ? (
                      top3Performers.map((student, index) => (
                        <div key={student.id}>
                          #{index + 1} {student.name} ({student.mark})
                        </div>
                      ))
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>

                <div className="bg-red-50 border rounded-xl p-4">
                  <p className="text-sm text-gray-500">Bottom 3 Performers</p>
                  <div className="text-sm font-semibold text-red-700 mt-2">
                    {bottom3Performers.length > 0 ? (
                      bottom3Performers.map((student, index) => (
                        <div key={student.id}>
                          #{index + 1} {student.name} ({student.mark})
                        </div>
                      ))
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 bg-gray-100 p-3 font-semibold">
                  <div>Student Name</div>
                  <div>Marks</div>
                </div>

                <div className="max-h-[700px] overflow-y-auto">
                  {rankedStudents.map((student, index) => (
                    <div
                      key={student.id}
                      className="grid grid-cols-2 items-center p-3 border-t"
                    >
                      <div>
                        #{index + 1} - {student.name}
                      </div>

                      <div>
                        <input
                          type="number"
                          min="0"
                          max={selectedAssessment.max_marks}
                          value={marks[student.id] || ""}
                          onChange={(e) =>
                            setMarks({
                              ...marks,
                              [student.id]: e.target.value,
                            })
                          }
                          className="w-32 border rounded-lg px-3 py-2"
                        />
                        <span className="ml-2">/ {selectedAssessment.max_marks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={downloadAssessmentReport}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Download Assessment Report
                </button>

                <button
                  type="button"
                  onClick={saveMarks}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {assessmentCreated && !viewMode && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Enter Student Marks
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div className="font-medium">
                    {student.name}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={maxMarks}
                      value={marks[student.id] || ""}
                      onChange={(e) =>
                        setMarks({
                          ...marks,
                          [student.id]: e.target.value,
                        })
                      }
                      className="w-24 border rounded-lg px-3 py-2 text-center"
                    />
                    <span>/ {maxMarks}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={saveMarks}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Save Marks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}