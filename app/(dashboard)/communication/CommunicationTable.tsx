"use client";

import React from "react";

import type { CommunicationRow } from "./types";

interface Props {
  rows: CommunicationRow[];
  setRows: React.Dispatch<
    React.SetStateAction<CommunicationRow[]>
  >;
  onStudentClick?: (student: CommunicationRow) => void;
}

export default function CommunicationTable({
  rows,
  setRows,
  onStudentClick,
}: Props) {
  const updateField = (
    index: number,
    field: keyof CommunicationRow,
    value: string | number
  ) => {
    const updated = [...rows];

    (updated[index] as any)[field] = value;

    updated[index].status =
      updated[index].total > 0
        ? "completed"
        : "pending";

    setRows(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow border">

      <div className="overflow-auto max-h-[75vh]">

        <table className="min-w-[2200px] w-full border-collapse text-sm">

          <thead className="sticky top-0 bg-slate-800 text-white z-20">

            <tr>

              <th className="sticky left-0 bg-slate-800 p-3 w-16">
                #
              </th>

              <th className="sticky left-16 bg-slate-800 p-3 text-left min-w-[220px]">
                Student
              </th>

              <th className="p-3">
                WPM
              </th>

              <th className="p-3 min-w-[180px]">
                Hesitations
              </th>

              <th className="p-3 min-w-[140px]">
                Response
                <br />
                Latency
              </th>

              <th className="p-3">
                Grammar
                <br />
                <span className="text-xs">
                  /20
                </span>
              </th>

              <th className="p-3">
                Vocabulary
                <br />
                <span className="text-xs">
                  /15
                </span>
              </th>

              <th className="p-3">
                Pronunciation
                <br />
                <span className="text-xs">
                  /15
                </span>
              </th>

              <th className="p-3">
                Fluency
                <br />
                <span className="text-xs">
                  /25
                </span>
              </th>

              <th className="p-3">
                Confidence
                <br />
                <span className="text-xs">
                  /5
                </span>
              </th>

              <th className="p-3">
                Total
                <br />
                <span className="text-xs">
                  /100
                </span>
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {rows.map((row, index) => (
              <tr
                key={row.studentId}
                className="border-b hover:bg-slate-50"
              >
                <td className="sticky left-0 bg-white text-center font-semibold">
                  {index + 1}
                </td>
                <td
                  className="sticky left-16 bg-white px-3 py-2 font-medium text-blue-600 cursor-pointer hover:underline whitespace-nowrap"
                  onClick={() =>
                    onStudentClick?.(row)
                  }
                >
                  {row.studentName}
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={row.wpm}
                    onChange={(e) =>
                      updateField(
                        index,
                        "wpm",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-16 border rounded px-1 py-1 text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.hesitations}
                    onChange={(e) =>
                      updateField(
                        index,
                        "hesitations",
                        e.target.value
                      )
                    }
                    placeholder='About 5 ("um", "uh")'
                    className="w-44 border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.responseLatency}
                    onChange={(e) =>
                      updateField(
                        index,
                        "responseLatency",
                        e.target.value
                      )
                    }
                    placeholder="1.8 seconds"
                    className="w-28 border rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={row.grammar}
                    onChange={(e) =>
                      updateField(
                        index,
                        "grammar",
                        Number(e.target.value)
                      )
                    }
                    className="w-16 border rounded px-1 py-1 text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={row.vocabulary}
                    onChange={(e) =>
                      updateField(
                        index,
                        "vocabulary",
                        Number(e.target.value)
                      )
                    }
                    className="w-16 border rounded px-1 py-1 text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={row.pronunciation}
                    onChange={(e) =>
                      updateField(
                        index,
                        "pronunciation",
                        Number(e.target.value)
                      )
                    }
                    className="w-16 border rounded px-1 py-1 text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={row.fluency}
                    onChange={(e) =>
                      updateField(
                        index,
                        "fluency",
                        Number(e.target.value)
                      )
                    }
                    className="w-16 border rounded px-1 py-1 text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={row.confidence}
                    onChange={(e) =>
                      updateField(
                        index,
                        "confidence",
                        Number(e.target.value)
                      )
                    }
                    className="w-16 border rounded px-1 py-1 text-center"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={row.total}
                    onChange={(e) =>
                      updateField(
                        index,
                        "total",
                        Number(e.target.value)
                      )
                    }
                    className="w-16 border rounded px-1 py-1 text-center font-bold bg-blue-50"
                  />
                </td>
                <td className="text-center">
                  {row.status === "completed" ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      Completed
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                      Pending
                    </span>
                  )}
                </td>
                <td className="text-center">
                  <button
                    onClick={() => onStudentClick?.(row)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}