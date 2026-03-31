export const ROI_COLORS = {
  excelente: 'text-emerald-400 dark:text-emerald-400',    // ROI >= 2.5
  bom: 'text-green-400 dark:text-green-400',            // ROI >= 1.5
  regular: 'text-yellow-400 dark:text-yellow-400',       // ROI >= 1.0
  ruim: 'text-orange-400 dark:text-orange-400',          // ROI >= 0.5
  pessimo: 'text-red-400 dark:text-red-400',             // ROI < 0.5
} as const

export const ROI_BG_COLORS = {
  excelente: 'bg-emerald-500/10 border-emerald-500/20',
  bom: 'bg-green-500/10 border-green-500/20',
  regular: 'bg-yellow-500/10 border-yellow-500/20',
  ruim: 'bg-orange-500/10 border-orange-500/20',
  pessimo: 'bg-red-500/10 border-red-500/20',
} as const

export const ROAS_COLORS = {
  excelente: 'text-emerald-400 dark:text-emerald-400',    // ROAS >= 4.0
  bom: 'text-green-400 dark:text-green-400',            // ROAS >= 3.0
  regular: 'text-yellow-400 dark:text-yellow-400',       // ROAS >= 2.0
  ruim: 'text-orange-400 dark:text-orange-400',          // ROAS >= 1.0
  pessimo: 'text-red-400 dark:text-red-400',             // ROAS < 1.0
} as const

export const ROAS_BG_COLORS = {
  excelente: 'bg-emerald-500/10 border-emerald-500/20',
  bom: 'bg-green-500/10 border-green-500/20',
  regular: 'bg-yellow-500/10 border-yellow-500/20',
  ruim: 'bg-orange-500/10 border-orange-500/20',
  pessimo: 'bg-red-500/10 border-red-500/20',
} as const

export const LUCRO_COLORS = {
  positivo: 'text-emerald-400 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20',  // lucro > 0
  zero: 'text-muted-foreground',                    // lucro == 0
  negativo: 'text-red-400 bg-red-500/10 dark:text-red-400 dark:bg-red-500/20',           // lucro < 0
} as const

export const DEFAULT_TAXA_IMPOSTO = 0.13
export const DEFAULT_COTACAO_DOLAR = 5.25
