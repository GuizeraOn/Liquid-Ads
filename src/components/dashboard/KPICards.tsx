import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardGeral } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { DollarSign, TrendingUp, TrendingDown, Target, BarChart3, AlertCircle } from 'lucide-react'
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
  
  const hasNegativeProfit = data.some(d => d.lucro_total < 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {/* 1. LUCRO (DESTAQUE) */}
      <Card className={cn(
        "md:col-span-2 relative overflow-hidden transition-all hover:ring-2",
        lucro > 0 ? 'bg-emerald-500/10 border-emerald-500/20 ring-emerald-500/20' : lucro < 0 ? 'bg-red-500/10 border-red-500/20 ring-red-500/20' : ''
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lucro Total</CardTitle>
          {lucro > 0 ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className={cn("text-4xl font-extrabold tracking-tighter", lucro > 0 ? 'text-emerald-500' : lucro < 0 ? 'text-red-500' : '')}>
            {formatCurrency(lucro, 'BRL')}
          </div>
          {hasNegativeProfit && (
            <div className="flex items-center gap-1.5 text-red-500 font-medium text-[10px] mt-2 animate-pulse">
              <AlertCircle className="h-3 w-3" />
              ATENÇÃO: Existem ofertas operando no prejuízo
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. ROAS (SEGUNDO FOCO) */}
      <Card className="flex flex-col justify-center">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ROAS</CardTitle>
          <Target className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            <ROASBadge value={roas} />
          </div>
        </CardContent>
      </Card>

      {/* 3. RECEITAS AGRUPADAS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Receita Unificada</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-xl font-bold">{formatCurrency(receitaBRL, 'BRL')}</div>
          <div className="text-xs text-muted-foreground/80 font-medium">({formatCurrency(receitaUSD, 'USD')})</div>
        </CardContent>
      </Card>

      {/* 4. INVESTIMENTO */}
      <Card className="md:order-last">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Investimento</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-muted-foreground">{formatCurrency(investimentoTotal, 'BRL')}</div>
        </CardContent>
      </Card>
    </div>
  )
}
