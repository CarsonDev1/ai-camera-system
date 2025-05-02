"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mô phỏng dữ liệu cho biểu đồ
const generateData = () => {
  return [
    {
      name: "Tuần 1",
      "Không đội mũ": 8,
      "Không đeo găng tay": 5,
      "Không mặc áo bảo hộ": 3,
      "Sử dụng điện thoại": 6,
      "Hút thuốc": 2,
      "Đánh nhau": 0,
    },
    {
      name: "Tuần 2",
      "Không đội mũ": 10,
      "Không đeo găng tay": 7,
      "Không mặc áo bảo hộ": 4,
      "Sử dụng điện thoại": 8,
      "Hút thuốc": 3,
      "Đánh nhau": 1,
    },
    {
      name: "Tuần 3",
      "Không đội mũ": 7,
      "Không đeo găng tay": 6,
      "Không mặc áo bảo hộ": 2,
      "Sử dụng điện thoại": 5,
      "Hút thuốc": 4,
      "Đánh nhau": 0,
    },
    {
      name: "Tuần 4",
      "Không đội mũ": 9,
      "Không đeo găng tay": 4,
      "Không mặc áo bảo hộ": 3,
      "Sử dụng điện thoại": 7,
      "Hút thuốc": 2,
      "Đánh nhau": 1,
    },
    {
      name: "Tuần 5",
      "Không đội mũ": 6,
      "Không đeo găng tay": 3,
      "Không mặc áo bảo hộ": 2,
      "Sử dụng điện thoại": 4,
      "Hút thuốc": 1,
      "Đánh nhau": 0,
    },
    {
      name: "Tuần 6",
      "Không đội mũ": 8,
      "Không đeo găng tay": 5,
      "Không mặc áo bảo hộ": 1,
      "Sử dụng điện thoại": 3,
      "Hút thuốc": 2,
      "Đánh nhau": 0,
    },
  ]
}

export function SafetyComplianceChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
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
          {/* Vi phạm PPE */}
          <Bar dataKey="Không đội mũ" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Không đeo găng tay" fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Không mặc áo bảo hộ" fill="#eab308" radius={[4, 4, 0, 0]} />
          {/* Hành vi vi phạm */}
          <Bar dataKey="Sử dụng điện thoại" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Hút thuốc" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Đánh nhau" fill="#ec4899" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
