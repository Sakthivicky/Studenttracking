"use client";

interface Props {
  student: any;
  open: boolean;
  onClose: () => void;
}

export default function StudentDrawer({
  student,
  open,
  onClose,
}: Props) {
  if (!open || !student) return null;

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-screen w-[520px] bg-white shadow-2xl z-50 overflow-y-auto">

        {/* Header */}

        <div className="sticky top-0 bg-slate-800 text-white p-6">

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold">
                {student.studentName}
              </h2>

              <p className="text-sm text-slate-300">
                Student Performance Dashboard
              </p>

            </div>

            <button
              onClick={onClose}
              className="text-2xl"
            >
              ✕
            </button>

          </div>

        </div>

        <div className="p-6 space-y-6">

          {/* Communication */}

          <div className="border rounded-xl p-5">

            <h3 className="font-bold text-lg mb-4">
              Communication
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <Card
                title="Total Score"
                value={student.total}
              />

              <Card
                title="Performance"
                value={student.performance}
              />

              <Card
                title="WPM"
                value={student.wpm}
              />

              <Card
                title="Hesitations"
                value={student.hesitations}
              />

              <Card
                title="Latency"
                value={student.responseLatency}
              />

            </div>

          </div>

          {/* Attendance */}

          <div className="border rounded-xl p-5">

            <h3 className="font-bold text-lg mb-4">
              Attendance
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <Card
                title="AM Present"
                value="92%"
              />

              <Card
                title="PM Present"
                value="90%"
              />

            </div>

          </div>

          {/* Assessment */}

          <div className="border rounded-xl p-5">

            <h3 className="font-bold text-lg mb-4">
              Assessment
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <Card
                title="Highest"
                value="94"
              />

              <Card
                title="Average"
                value="82"
              />

            </div>

          </div>

          {/* Progress */}

          <div className="border rounded-xl p-5">

            <h3 className="font-bold mb-3">
              Weekly Progress
            </h3>

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left p-2">
                    Week
                  </th>

                  <th>
                    Score
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td className="p-2">
                    Week 1
                  </td>

                  <td>
                    72
                  </td>

                </tr>

                <tr>

                  <td className="p-2">
                    Week 2
                  </td>

                  <td>
                    78
                  </td>

                </tr>

                <tr>

                  <td className="p-2">
                    Week 3
                  </td>

                  <td>
                    85
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}

function Card({
  title,
  value,
}: any) {
  return (
    <div className="border rounded-lg p-4">

      <div className="text-sm text-gray-500">
        {title}
      </div>

      <div className="text-2xl font-bold mt-2">
        {value}
      </div>

    </div>
  );
}