export const ROAS_COLORS = {
  excelente: 'text-emerald-500',    // ROAS >= 2.5
  bom: 'text-green-500',            // ROAS >= 1.5
  regular: 'text-yellow-500',       // ROAS >= 1.0
  ruim: 'text-orange-500',          // ROAS >= 0.5
  pessimo: 'text-red-500',          // ROAS < 0.5
} as const

export const ROAS_BG_COLORS = {
  excelente: 'bg-emerald-500/10 border-emerald-500/20',
  bom: 'bg-green-500/10 border-green-500/20',
  regular: 'bg-yellow-500/10 border-yellow-500/20',
  ruim: 'bg-orange-500/10 border-orange-500/20',
  pessimo: 'bg-red-500/10 border-red-500/20',
} as const

export const LUCRO_COLORS = {
  positivo: 'text-emerald-500 bg-emerald-500/10',  // lucro > 0
  zero: 'text-muted-foreground',                    // lucro == 0
  negativo: 'text-red-500 bg-red-500/10',           // lucro < 0
} as const

export const DEFAULT_TAXA_IMPOSTO = 0.13
export const DEFAULT_COTACAO_DOLAR = 5.25
