"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  {
    week: "Tuần 1",
    diTre: 14,
    veSom: 8,
  },
  {
    week: "Tuần 2",
    diTre: 12,
    veSom: 7,
  },
  {
    week: "Tuần 3",
    diTre: 15,
    veSom: 9,
  },
  {
    week: "Tuần 4",
    diTre: 10,
    veSom: 5,
  },
  {
    week: "Tuần 5",
    diTre: 8,
    veSom: 4,
  },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-orange-600">
          Đi trễ: <span className="font-medium">{payload[0].value}%</span>
        </p>
        <p className="text-xs text-yellow-600">
          Về sớm: <span className="font-medium">{payload[1].value}%</span>
        </p>
      </div>
    )
  }

  return null
}

export function TimeComplianceChart() {
  return (
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
        <XAxis dataKey="week" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 20]} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Line
          type="monotone"
          dataKey="diTre"
          name="Tỷ lệ đi trễ"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="veSom"
          name="Tỷ lệ về sớm"
          stroke="#eab308"
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
