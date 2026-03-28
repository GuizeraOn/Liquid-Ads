import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardGeral } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { DollarSign, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROASBadge } from '../shared/ROASBadge'

interface KPICardsProps {
  data: DashboardGeral[]
}

export function KPICards({ data }: KPICardsProps) {
  const investimentoTotal = data.reduce((acc, curr) => acc + curr.investimento_total, 0)
  const receitaUSD = data.reduce((acc, curr) => acc + curr.receita_usd_total, 0)
  const receitaBRL = data.reduce((acc, curr) => acc + curr.receita_brl_total, 0)
  const lucro = data.reduce((acc, curr) => acc + curr.lucro_total, 0)
  const roas = investimentoTotal > 0 ? (receitaBRL - investimentoTotal) / investimentoTotal : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Investimento</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(investimentoTotal, 'BRL')}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receita (U$)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(receitaUSD, 'USD')}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receita (R$)</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(receitaBRL, 'BRL')}</div>
        </CardContent>
      </Card>

      <Card className={cn(lucro > 0 ? 'bg-emerald-500/10 border-emerald-500/20' : lucro < 0 ? 'bg-red-500/10 border-red-500/20' : '')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={cn("text-sm font-medium", lucro > 0 ? 'text-emerald-700 dark:text-emerald-400' : lucro < 0 ? 'text-red-700 dark:text-red-400' : 'text-muted-foreground')}>Lucro</CardTitle>
          {lucro > 0 ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", lucro > 0 ? 'text-emerald-700 dark:text-emerald-400' : lucro < 0 ? 'text-red-700 dark:text-red-400' : '')}>
            {formatCurrency(lucro, 'BRL')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">ROAS</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <ROASBadge value={roas} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
