"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mô phỏng dữ liệu cho biểu đồ
const generateData = () => {
  const data = []
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour.toString().padStart(2, "0") + ":00"

    // Tạo dữ liệu ngẫu nhiên nhưng có xu hướng
    const activeUsers = Math.max(0, Math.floor(Math.random() * 50) + 20)
    const violations = Math.max(0, Math.floor(Math.random() * 5))

    data.push({
      time: formattedHour,
      activeUsers: activeUsers,
      violations: violations,
    })
  }
  return data
}

export function DashboardChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="activeUsers"
            stroke="#2563eb"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            name="Người hoạt động"
          />
          <Line type="monotone" dataKey="violations" stroke="#ef4444" strokeWidth={2} name="Vi phạm" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
