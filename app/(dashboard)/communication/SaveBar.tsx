"use client";

interface SaveBarProps {
  completed: number;
  total: number;
  onSaveAll?: () => void;
  onExport?: () => void;
  saving?: boolean;
}

export default function SaveBar({
  completed,
  total,
  onSaveAll,
  onExport,
  saving = false,
}: SaveBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const pending = total - completed;

  return (
    <div className="sticky bottom-0 z-40 bg-white border-t shadow-2xl px-6 py-4 mt-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Communication Progress</span>
            <span>{completed} / {total} Students ({percentage}%)</span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <span>✅ Completed: {completed}</span>
            <span>⏳ Pending: {pending}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onExport}
            className="px-5 py-3 rounded-lg border font-medium hover:bg-gray-100"
          >
            Export Report
          </button>

          <button
            type="button"
            onClick={onSaveAll}
            disabled={saving}
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>
    </div>
  );
}