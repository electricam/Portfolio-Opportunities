"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { BudgetAlignment } from "@/lib/types";

export function BudgetAlignmentChart({ items }: { items: BudgetAlignment[] }) {
  const data = items.map((item) => ({
    name: item.title.replace("Autonomous and ", "").replace(" / Rapid Prototyping", ""),
    score: Math.round(item.confidence * 100),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis type="category" dataKey="name" width={132} tickLine={false} axisLine={false} />
          <Bar dataKey="score" fill="#0f766e" radius={[0, 12, 12, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
