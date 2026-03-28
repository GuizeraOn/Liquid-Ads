import { LancamentoCompleto } from '@/types'

interface MetaCostBadgeProps {
  lancamentos: LancamentoCompleto[]
}

export function MetaCostBadge({ lancamentos }: MetaCostBadgeProps) {
  const totalImposto = lancamentos.reduce((acc, curr) => {
    // Cálculo: Investimento com Imposto - Investimento Puro
    const imposto = (curr.investimento_com_imposto || 0) - (curr.investimento || 0)
    return acc + imposto
  }, 0)

  if (totalImposto === 0 && lancamentos.length > 0) return null

  return (
    <div className="pt-8 pb-12 flex justify-center">
      <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm font-medium text-orange-600 dark:text-orange-400 shadow-lg shadow-orange-500/5 transition-all hover:scale-105">
        <span className="flex items-center gap-1.5">
          <span className="text-base">💰</span>
          <span>"pro mark zuckerberg"</span>
        </span>
        <div className="w-px h-4 bg-orange-500/20 mx-1" />
        <span className="font-mono font-bold">R$ {totalImposto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  )
}
