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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="data" 
                tickFormatter={(val) => formatDate(val).substring(0, 5)} 
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left" 
                tickFormatter={(val) => `R$ ${val}`} 
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  borderColor: '#334155', 
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
                itemStyle={{ color: '#f8fafc' }}
                labelStyle={{ color: '#94a3b8' }}
                labelFormatter={(val) => formatDate(val as string)}
                formatter={(value: number, name: string) => {
                  if (name === 'lucro') return [formatCurrency(value), 'Lucro']
                  if (name === 'roas') return [value.toFixed(2), 'ROAS']
                  if (name === 'roi') return [value.toFixed(2), 'ROI']
                  return [value, name]
                }}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="lucro" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#ef4444' }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="roas" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="roi" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
