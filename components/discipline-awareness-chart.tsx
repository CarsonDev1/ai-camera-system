"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Mô phỏng dữ liệu cho biểu đồ
const generateData = () => {
  return [
    { name: "Sử dụng điện thoại", value: 18 },
    { name: "Đi trễ/về sớm", value: 12 },
    { name: "Hút thuốc", value: 8 },
    { name: "Đi sai khu vực", value: 7 },
  ]
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6"]

export function DisciplineAwarenessChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} vi phạm`, "Số lượng"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
