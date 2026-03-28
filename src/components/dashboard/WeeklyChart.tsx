'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AcompanhamentoSemanal } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/formatters'

interface WeeklyChartProps {
  data: AcompanhamentoSemanal[]
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  // Group by week number if multiple offers are selected
  const chartData = data.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === `Semana ${curr.numero_semana}`)
    if (existing) {
      existing.investimento += curr.investimento_total
      existing.receita += curr.receita_total
    } else {
      acc.push({
        name: `Semana ${curr.numero_semana}`,
        investimento: curr.investimento_total,
        receita: curr.receita_total,
      })
    }
    return acc
  }, [] as any[])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Performance Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(val) => `R$ ${val}`} 
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  borderColor: '#334155', 
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
                itemStyle={{ color: '#f8fafc' }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(value: number, name: string) => {
                  const label = name === 'investimento' ? 'Investimento' : 'Receita'
                  return [formatCurrency(value), label]
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Bar dataKey="investimento" fill="#64748b" radius={[4, 4, 0, 0]} name="investimento" />
              <Bar dataKey="receita" fill="#6366f1" radius={[4, 4, 0, 0]} name="receita" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
