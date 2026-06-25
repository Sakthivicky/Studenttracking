"use client";

import { useEffect, useMemo, useState } from "react";
import { generateCommunicationReport } from "@/lib/pdf/communicationReport";
import ProgressCards from "./ProgressCards";
import CommunicationTable from "./CommunicationTable";
import StudentDrawer from "./StudentDrawer";
import SaveBar from "./SaveBar";

import { supabase } from "@/lib/supabase";

import type { CommunicationRow } from "./types";

export default function CommunicationPage() {
  const [rows, setRows] = useState<CommunicationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [topic, setTopic] = useState("English Communication");
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  useEffect(() => {
    loadStudents();
    loadAssessmentHistory();
  }, []);

  async function loadStudents() {
    setLoading(true);

    const { data } = await supabase
      .from("students")
      .select("*")
      .order("name");

    if (data && Array.isArray(data)) {
      const mappedRows: CommunicationRow[] = (data as any[]).map((student: any) => ({
        studentId: student.id,
        studentName: student.name,

        wpm: 0,
        hesitations: "",
        responseLatency: "",

        grammar: 0,
        vocabulary: 0,
        pronunciation: 0,
        fluency: 0,
        confidence: 0,

        total: 0,

        performance: "",

        status: "pending",
      }));

      setRows(mappedRows);
    }

    setLoading(false);
  }

  async function loadAssessmentHistory() {
    const { data } = await supabase
      .from("communication_assessment_master")
      .select("*")
      .order("assessment_date", { ascending: false });

    if (data) {
      setAssessmentHistory(data);
    }
  }

  // Load assessment results for the selected assessment
  async function loadAssessment(assessment: any) {
    setSelectedAssessment(assessment);

    const { data: students } = await supabase
      .from("students")
      .select("*")
      .order("name");

    const { data: results } = await supabase
      .from("communication_results")
      .select("*")
      .eq("assessment_id", assessment.id);

    const mappedRows: CommunicationRow[] = (students ?? []).map((student: any) => {
      const result = results?.find(
        (r: any) => r.student_id === student.id
      );

      return {
        studentId: student.id,
        studentName: student.name,
        wpm: result?.wpm ?? 0,
        hesitations: result?.hesitations ?? "",
        responseLatency: result?.response_latency ?? "",
        grammar: result?.grammar ?? 0,
        vocabulary: result?.vocabulary ?? 0,
        pronunciation: result?.pronunciation ?? 0,
        fluency: result?.fluency ?? 0,
        confidence: result?.confidence ?? 0,
        total: result?.total ?? 0,
        performance: "",
        status: result?.status ?? "pending",
      };
    });

    setRows(mappedRows);
  }

  async function createAssessment() {
    if (!assessmentTitle.trim()) {
      alert("Enter Assessment Name");
      return;
    }

    const { data, error } = await supabase
      .from("communication_assessment_master")
      .insert({
        title: assessmentTitle,
        assessment_date: assessmentDate,
        topic,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Failed to create assessment");
      return;
    }

    setSelectedAssessment(data);
    setAssessmentTitle("");
    await loadAssessment(data);
    await loadAssessmentHistory();
  }

  async function saveAll(): Promise<boolean> {
  if (!selectedAssessment) {
    alert("Please create or select an assessment first.");
    return false;
  }

  setSaving(true);

  const payload = rows.map((row) => ({
    assessment_id: selectedAssessment.id,
    student_id: row.studentId,
    wpm: row.wpm,
    hesitations: row.hesitations,
    response_latency: row.responseLatency,
    grammar: row.grammar,
    vocabulary: row.vocabulary,
    pronunciation: row.pronunciation,
    fluency: row.fluency,
    confidence: row.confidence,
    total: row.total,
    status: row.status,
  }));

  const { error } = await supabase
    .from("communication_results")
    .upsert(payload, {
      onConflict: "assessment_id,student_id",
    });

  setSaving(false);

  if (error) {
    console.error(error);
    alert("Failed to save communication assessment.");
    return false;
  }

  return true;
}



async function exportReport() {
  const saved = await saveAll();

  if (!saved) return;

  if (!selectedAssessment) {
    alert("Please select an assessment.");
    return;
  }

  await generateCommunicationReport(
    selectedAssessment,
    rows
  );
}

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.studentName
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [rows, search]);

  const completed = rows.filter(
    (r) => r.total > 0
  ).length;

  const averageScore =
    rows.length === 0
      ? 0
      : rows.reduce(
          (sum, r) => sum + r.total,
          0
        ) / rows.length;

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      <div className="flex justify-between">

        <h1 className="text-3xl font-bold">
          Communication Dashboard
        </h1>

        <input
          placeholder="Search Student..."
          className="border rounded-lg px-4 py-2 w-72"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* Assessment creation and history card */}
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Assessment Title"
            className="border rounded px-3 py-2"
            value={assessmentTitle}
            onChange={(e) => setAssessmentTitle(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={assessmentDate}
            onChange={(e) => setAssessmentDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Topic"
            className="border rounded px-3 py-2"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={createAssessment}
          >
            Create Assessment
          </button>
        </div>
        <div className="mt-4">
          <div className="font-semibold mb-2">Assessment History:</div>
          <div className="flex flex-wrap gap-2">
            {assessmentHistory.map((assessment) => (
              <div
                key={assessment.id}
                className={`cursor-pointer border rounded px-3 py-2 ${selectedAssessment && selectedAssessment.id === assessment.id ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"}`}
                onClick={() => loadAssessment(assessment)}
              >
                <div className="font-medium">{assessment.title}</div>
                <div className="text-xs text-gray-500">{assessment.assessment_date}</div>
                <div className="text-xs text-gray-500">{assessment.topic}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProgressCards
        totalStudents={rows.length}
        completed={completed}
        averageScore={averageScore}
        rows={rows}
      />

      <CommunicationTable
        rows={rows}
        setRows={setRows}
        onStudentClick={(student) => {
          setSelectedStudent(student);
          setDrawerOpen(true);
        }}
      />

      <StudentDrawer
        open={drawerOpen}
        student={selectedStudent}
        onClose={() =>
          setDrawerOpen(false)
        }
      />

      <SaveBar
  completed={completed}
  total={rows.length}
  saving={saving}
  onSaveAll={saveAll}
  onExport={exportReport}
/>
    </div>
  );
}