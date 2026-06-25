import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Assessment {
  title: string;
  assessment_date: string;
  topic?: string;
}

interface CommunicationRow {
  studentId: number | string;
  studentName: string;

  wpm: number;
  hesitations: string;
  responseLatency: string;

  grammar: number;
  vocabulary: number;
  pronunciation: number;
  fluency: number;
  confidence: number;

  total: number;
  status: string;
}

export async function generateCommunicationReport(
  assessment: Assessment,
  rows: CommunicationRow[]
) {
  const doc = new jsPDF();

  const completed = rows.filter(
    (r) => r.status === "completed"
  ).length;

  const pending = rows.length - completed;

  const average =
    rows.length === 0
      ? 0
      : (
          rows.reduce((sum, r) => sum + Number(r.total), 0) /
          rows.length
        ).toFixed(1);

  doc.setFontSize(20);
  doc.text("Communication Assessment Report", 14, 18);

  doc.setFontSize(11);

  doc.text(`Assessment : ${assessment.title}`, 14, 30);
  doc.text(`Date : ${assessment.assessment_date}`, 14, 37);
  doc.text(`Topic : ${assessment.topic ?? "-"}`, 14, 44);

  doc.text(`Total Students : ${rows.length}`, 120, 30);
  doc.text(`Completed : ${completed}`, 120, 37);
  doc.text(`Pending : ${pending}`, 120, 44);
  doc.text(`Average : ${average}`, 120, 51);

  autoTable(doc, {
    startY: 60,

    head: [[
      "S.No",
      "Student",
      "WPM",
      "Hesitations",
      "Latency",
      "Grammar",
      "Vocabulary",
      "Pronunciation",
      "Fluency",
      "Confidence",
      "Total"
    ]],

    body: rows.map((row, index) => [
      index + 1,
      row.studentName,
      row.wpm,
      row.hesitations,
      row.responseLatency,
      row.grammar,
      row.vocabulary,
      row.pronunciation,
      row.fluency,
      row.confidence,
      row.total,
    ]),

    styles: {
      fontSize: 8,
      cellPadding: 2,
    },

    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  doc.save(`${assessment.title}.pdf`);
}