'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LancamentoCompleto } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency, formatDate } from '@/lib/formatters'

interface PerformanceChartProps {
  data: LancamentoCompleto[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Sort data chronologically for the chart
  const chartData = [...data].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Evolução Diária</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="data" 
                tickFormatter={(val) => formatDate(val).substring(0, 5)} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left" 
                tickFormatter={(val) => `R$ ${val}`} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                labelFormatter={(val) => formatDate(val as string)}
                formatter={(value: number, name: string) => {
                  if (name === 'lucro') return [formatCurrency(value), 'Lucro']
                  if (name === 'roas') return [value.toFixed(2), 'ROAS']
                  return [value, name]
                }}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="lucro" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="roas" 
                stroke="hsl(var(--chart-2, 160 60% 45%))" 
                strokeWidth={2} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
