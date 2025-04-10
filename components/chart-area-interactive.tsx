"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = [
  { date: "2024-04-01", classAverage: 82, attendance: 95 },
  { date: "2024-04-08", classAverage: 78, attendance: 92 },
  { date: "2024-04-15", classAverage: 85, attendance: 97 },
  { date: "2024-04-22", classAverage: 80, attendance: 94 },
  { date: "2024-04-29", classAverage: 76, attendance: 90 },
  { date: "2024-05-06", classAverage: 83, attendance: 96 },
  { date: "2024-05-13", classAverage: 87, attendance: 98 },
  { date: "2024-05-20", classAverage: 81, attendance: 93 },
  { date: "2024-05-27", classAverage: 84, attendance: 95 },
  { date: "2024-06-03", classAverage: 88, attendance: 97 },
  { date: "2024-06-10", classAverage: 79, attendance: 91 },
  { date: "2024-06-17", classAverage: 86, attendance: 94 },
  { date: "2024-06-24", classAverage: 90, attendance: 98 },
]

const chartConfig = {
  performance: {
    label: "Performance",
  },
  classAverage: {
    label: "Class Average",
    color: "hsl(var(--chart-1))",
  },
  attendance: {
    label: "Attendance",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [selectedClass, setSelectedClass] = React.useState("all")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Class Performance</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Average grades and attendance rates</span>
          <span className="@[540px]/card:hidden">Performance metrics</span>
        </CardDescription>
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass} className="@[767px]/card:flex hidden">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="9a">Class 9A</SelectItem>
              <SelectItem value="10b">Class 10B</SelectItem>
              <SelectItem value="11c">Class 11C</SelectItem>
            </SelectContent>
          </Select>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Term
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Month
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Week
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Term
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Month
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Week
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillClassAverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-classAverage)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-classAverage)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-attendance)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-attendance)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="attendance" type="natural" fill="url(#fillAttendance)" stroke="var(--color-attendance)" />
            <Area
              dataKey="classAverage"
              type="natural"
              fill="url(#fillClassAverage)"
              stroke="var(--color-classAverage)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
