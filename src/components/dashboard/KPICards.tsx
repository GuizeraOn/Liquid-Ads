import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LancamentoCompleto, AcompanhamentoSemanal } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { DollarSign, TrendingUp, TrendingDown, Target, BarChart3, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardsProps {
  data: LancamentoCompleto[]
  semanalData?: AcompanhamentoSemanal[]
}

export function KPICards({ data, semanalData = [] }: KPICardsProps) {
  const investimentoTotal = data.reduce((acc, curr) => acc + (curr.investimento || 0), 0)
  const investimentoComImposto = data.reduce((acc, curr) => acc + (curr.investimento_com_imposto || 0), 0)
  const receitaUSD = data.reduce((acc, curr) => acc + (curr.receita_usd || 0), 0)
  const receitaBRL = data.reduce((acc, curr) => acc + (curr.receita_brl || 0), 0)
  const lucro = data.reduce((acc, curr) => acc + (curr.lucro || 0), 0)
  
  const roas = investimentoComImposto > 0 ? receitaBRL / investimentoComImposto : 0
  const roi = investimentoComImposto > 0 ? (receitaBRL - investimentoComImposto) / investimentoComImposto : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
        </CardContent>
      </Card>

      {/* 2. ROI */}
      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ROI</CardTitle>
          <Target className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-4xl font-bold tracking-tighter">
            {roi.toFixed(2)}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {semanalData.slice(-3).map((sem) => (
              <div 
                key={sem.inicio_semana} 
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border",
                  sem.roi >= 1.0 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                    : sem.roi >= 0 
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-500"
                      : "bg-red-500/10 border-red-500/20 text-red-500"
                )}
              >
                S{sem.numero_semana} <span className="opacity-80">{sem.roi?.toFixed(2) || (sem.roas - 1).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2.5 ROAS */}
      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ROAS</CardTitle>
          <Target className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-4xl font-bold tracking-tighter">
            {roas.toFixed(2)}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {semanalData.slice(-3).map((sem) => (
              <div 
                key={sem.inicio_semana} 
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border",
                  sem.roas >= 2.0 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                    : sem.roas >= 1.0 
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-500"
                      : "bg-red-500/10 border-red-500/20 text-red-500"
                )}
              >
                S{sem.numero_semana} <span className="opacity-80">{sem.roas.toFixed(2)}</span>
              </div>
            ))}
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
