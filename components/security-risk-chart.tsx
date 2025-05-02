"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mô phỏng dữ liệu cho biểu đồ
const generateData = () => {
  return [
    { name: "T1", "Truy cập trái phép": 2, "Ra vào ngoài giờ": 5, "Đi vào khu vực cấm": 3 },
    { name: "T2", "Truy cập trái phép": 1, "Ra vào ngoài giờ": 4, "Đi vào khu vực cấm": 2 },
    { name: "T3", "Truy cập trái phép": 3, "Ra vào ngoài giờ": 6, "Đi vào khu vực cấm": 4 },
    { name: "T4", "Truy cập trái phép": 2, "Ra vào ngoài giờ": 5, "Đi vào khu vực cấm": 3 },
    { name: "T5", "Truy cập trái phép": 4, "Ra vào ngoài giờ": 3, "Đi vào khu vực cấm": 2 },
    { name: "T6", "Truy cập trái phép": 3, "Ra vào ngoài giờ": 4, "Đi vào khu vực cấm": 3 },
    { name: "T7", "Truy cập trái phép": 2, "Ra vào ngoài giờ": 3, "Đi vào khu vực cấm": 2 },
    { name: "T8", "Truy cập trái phép": 1, "Ra vào ngoài giờ": 2, "Đi vào khu vực cấm": 1 },
    { name: "T9", "Truy cập trái phép": 2, "Ra vào ngoài giờ": 3, "Đi vào khu vực cấm": 2 },
    { name: "T10", "Truy cập trái phép": 3, "Ra vào ngoài giờ": 4, "Đi vào khu vực cấm": 3 },
    { name: "T11", "Truy cập trái phép": 2, "Ra vào ngoài giờ": 3, "Đi vào khu vực cấm": 2 },
    { name: "T12", "Truy cập trái phép": 3, "Ra vào ngoài giờ": 4, "Đi vào khu vực cấm": 3 },
  ]
}

export function SecurityRiskChart() {
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
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Truy cập trái phép" stroke="#ef4444" activeDot={{ r: 8 }} strokeWidth={2} />
          <Line type="monotone" dataKey="Ra vào ngoài giờ" stroke="#eab308" strokeWidth={2} />
          <Line type="monotone" dataKey="Đi vào khu vực cấm" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
