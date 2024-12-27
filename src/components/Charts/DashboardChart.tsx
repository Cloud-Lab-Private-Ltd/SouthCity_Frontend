"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"

const courseData = [
  { name: "Pharmaceutical", value: 45.9, color: "#818CF8" },
  { name: "Nursing", value: 16.1, color: "#38BDF8" },
  { name: "Physiotherapy", value: 38.3, color: "#67E8F9" },
]

const batchData = [
  { name: "Pharmaceutical", students: 56635 },
  { name: "Nursing", students: 74779 },
  { name: "Neurology", students: 19027 },
  { name: "Physiotherapy", students: 43887 },
  { name: "Dermatology", students: 8142 },
]

export default function DashboardPieChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2 p-1">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Course Analysis</h2>
        <p className="text-xl text-muted-foreground mb-4">207,388</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="80%" height="60%">
            <PieChart>
              <Pie
                data={courseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {courseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="left"
                wrapperStyle={{
                  paddingLeft: "24px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Batch-wise Student</h2>
        <p className="text-xl text-muted-foreground mb-4">2024 - 2025</p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="70%">
            <BarChart
              data={batchData}
              layout="vertical"
              className="text-xs"
              margin={{ top: 0, right: 30, bottom: 0, left: 20 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={70} />
              <Bar
                dataKey="students"
                fill="#38BDF8"
                radius={[4, 4, 4, 4]}
                label={{ position: "right", formatter: (value:any) => value.toLocaleString() }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

