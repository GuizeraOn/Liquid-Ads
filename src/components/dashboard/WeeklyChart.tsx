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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(val) => `R$ ${val}`} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value: number, name: string) => {
                  return [formatCurrency(value), name === 'investimento' ? 'Investimento' : 'Receita']
                }}
              />
              <Legend />
              <Bar dataKey="investimento" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
