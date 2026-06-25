"use client";

interface ProgressCardsProps {
  totalStudents: number;
  completed: number;
  averageScore: number;
  rows: any[];
}

export default function ProgressCards({
  totalStudents,
  completed,
  averageScore,
  rows,
}: ProgressCardsProps) {
  const pending = totalStudents - completed;

  const excellent = rows.filter((r) => r.total >= 90).length;
  const good = rows.filter((r) => r.total >= 75 && r.total < 90).length;
  const average = rows.filter((r) => r.total >= 60 && r.total < 75).length;
  const improvement = rows.filter((r) => r.total < 60).length;

  const cards = [
    {
      title: "Students",
      value: totalStudents,
      color: "bg-blue-500",
      icon: "👨‍🎓",
    },
    {
      title: "Completed",
      value: completed,
      color: "bg-green-500",
      icon: "✅",
    },
    {
      title: "Pending",
      value: pending,
      color: "bg-red-500",
      icon: "⏳",
    },
    {
      title: "Average Score",
      value: averageScore.toFixed(1),
      color: "bg-purple-500",
      icon: "📊",
    },
    {
      title: "Excellent",
      value: excellent,
      color: "bg-emerald-500",
      icon: "🏆",
    },
    {
      title: "Good",
      value: good,
      color: "bg-sky-500",
      icon: "👍",
    },
    {
      title: "Average",
      value: average,
      color: "bg-yellow-500",
      icon: "🙂",
    },
    {
      title: "Needs Improvement",
      value: improvement,
      color: "bg-rose-500",
      icon: "⚠️",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow border p-4 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl">{card.icon}</span>

            <div
              className={`h-3 w-3 rounded-full ${card.color}`}
            />
          </div>

          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}