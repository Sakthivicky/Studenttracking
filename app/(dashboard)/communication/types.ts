export interface Student {
  id: number;
  name: string;
}

export interface CommunicationRow {
  studentId: number;
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
  performance: string;

  status: "pending" | "completed";
}